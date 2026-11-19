-- MANJOOR Phase 02 — Lead capture (quotation requests & wholesale leads).
-- NOT APPLIED / NOT TESTED in this phase. Apply ONLY to the isolated MANJOOR
-- staging database after security review. NEVER run on the original Dukany DB.
--
-- Security model:
--   * Lead tables are NOT publicly readable (RLS denies anon/authenticated SELECT).
--   * Public submission goes through ONE narrow SECURITY DEFINER RPC that
--     validates input and inserts only. No direct table grants to the public.
--   * Staff (profiles.role in staff roles) may read/update leads via RLS.
--   * A lightweight rate limit caps submissions per phone per hour.

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL CHECK (source IN ('quote_request','wholesale','custom_order')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_name TEXT,
    governorate TEXT,
    city TEXT,
    preferred_contact TEXT NOT NULL DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp','phone')),
    product_interest TEXT,
    expected_quantity TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','quoted','won','lost','spam')),
    assigned_to UUID REFERENCES public.profiles(id),
    follow_up_notes TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    landing_path TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_items ENABLE ROW LEVEL SECURITY;

-- No public SELECT/INSERT/UPDATE: deny by default (RLS on, no permissive policy for anon).
-- Staff read/update only.
DROP POLICY IF EXISTS "staff read leads" ON public.leads;
CREATE POLICY "staff read leads" ON public.leads FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','sales','agent')));
DROP POLICY IF EXISTS "staff update leads" ON public.leads;
CREATE POLICY "staff update leads" ON public.leads FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','sales')));
DROP POLICY IF EXISTS "staff read lead items" ON public.lead_items;
CREATE POLICY "staff read lead items" ON public.lead_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','sales','agent')));

-- Narrow public submission endpoint. SECURITY DEFINER so it can insert without
-- granting table access; validates input and rate-limits by phone.
CREATE OR REPLACE FUNCTION public.submit_quote_request(
    p_source TEXT,
    p_payload JSONB,
    p_attribution JSONB
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp
AS $$
DECLARE
    v_phone TEXT := btrim(coalesce(p_payload->>'phone',''));
    v_name  TEXT := btrim(coalesce(p_payload->>'name',''));
    v_ref   TEXT;
    v_lead_id UUID;
    v_item  JSONB;
    v_recent INTEGER;
BEGIN
    IF p_source NOT IN ('quote_request','wholesale','custom_order') THEN
        RAISE EXCEPTION 'invalid source';
    END IF;
    IF length(v_name) < 2 OR v_phone !~ '^(\+?964|0)7[0-9]{9}$' THEN
        RAISE EXCEPTION 'invalid contact';
    END IF;

    -- Rate limit: max 5 submissions per phone per hour.
    SELECT count(*) INTO v_recent FROM public.leads
      WHERE phone = v_phone AND created_at > now() - interval '1 hour';
    IF v_recent >= 5 THEN
        RAISE EXCEPTION 'rate limit exceeded' USING ERRCODE = '53400';
    END IF;

    v_ref := 'MJ-' || to_char(now(),'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(3),'hex'),1,6));

    INSERT INTO public.leads (reference, source, name, phone, business_name, governorate, city,
        preferred_contact, product_interest, expected_quantity, notes,
        utm_source, utm_medium, utm_campaign, landing_path, referrer)
    VALUES (v_ref, p_source, v_name, v_phone,
        nullif(btrim(coalesce(p_payload->>'businessName','')),''),
        nullif(btrim(coalesce(p_payload->>'governorate','')),''),
        nullif(btrim(coalesce(p_payload->>'city','')),''),
        coalesce(nullif(p_payload->>'preferredContact',''),'whatsapp'),
        nullif(btrim(coalesce(p_payload->>'productInterest','')),''),
        nullif(btrim(coalesce(p_payload->>'expectedQuantity','')),''),
        nullif(btrim(coalesce(p_payload->>'notes','')),''),
        p_attribution->>'utm_source', p_attribution->>'utm_medium', p_attribution->>'utm_campaign',
        p_attribution->>'landing_path', p_attribution->>'referrer')
    RETURNING id INTO v_lead_id;

    IF jsonb_typeof(p_payload->'items') = 'array' THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_payload->'items') LOOP
            IF coalesce((v_item->>'quantity')::int,0) > 0 THEN
                INSERT INTO public.lead_items (lead_id, product_id, product_name, quantity)
                VALUES (v_lead_id,
                    nullif(v_item->>'productId','')::uuid,
                    coalesce(v_item->>'name','منتج'),
                    (v_item->>'quantity')::int);
            END IF;
        END LOOP;
    END IF;

    RETURN jsonb_build_object('reference', v_ref);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quote_request(TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_quote_request(TEXT, JSONB, JSONB) TO anon, authenticated;
