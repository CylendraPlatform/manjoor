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
--   * Legacy catalog rows stay private until public_approved is set.
--   * Regulated hookah/tobacco names are rejected even if mis-flagged.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS public_approved BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS price_public BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.products.public_approved IS
  'Must be true before a product may be included in a public quote request.';
COMMENT ON COLUMN public.products.price_public IS
  'Show the price publicly only after it is confirmed current.';

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
    payload_hash TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','quoted','won','lost','spam','invalid')),
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

CREATE INDEX IF NOT EXISTS leads_phone_created_idx ON public.leads (phone, created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.leads FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.lead_items FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.leads TO authenticated;
GRANT SELECT ON TABLE public.lead_items TO authenticated;

-- Admin only. The profiles.role check does not include a sales role.
DROP POLICY IF EXISTS "staff read leads" ON public.leads;
DROP POLICY IF EXISTS "staff update leads" ON public.leads;
DROP POLICY IF EXISTS "staff read lead items" ON public.lead_items;
DROP POLICY IF EXISTS "admin read leads" ON public.leads;
CREATE POLICY "admin read leads" ON public.leads FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
DROP POLICY IF EXISTS "admin update leads" ON public.leads;
CREATE POLICY "admin update leads" ON public.leads FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
DROP POLICY IF EXISTS "admin read lead items" ON public.lead_items;
CREATE POLICY "admin read lead items" ON public.lead_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

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
    v_notes TEXT := btrim(coalesce(p_payload->>'notes',''));
    v_ref   TEXT;
    v_lead_id UUID;
    v_item  JSONB;
    v_recent INTEGER;
    v_dup INTEGER;
    v_hash TEXT;
    v_pid UUID;
    v_pname TEXT;
    v_approved BOOLEAN;
    v_active BOOLEAN;
    v_qty INTEGER;
BEGIN
    IF p_source NOT IN ('quote_request','wholesale','custom_order') THEN
        RAISE EXCEPTION 'invalid source';
    END IF;
    IF length(v_name) < 2 OR length(v_name) > 120 OR v_phone !~ '^(\+964|0)7[0-9]{9}$' THEN
        RAISE EXCEPTION 'invalid contact';
    END IF;
    IF length(v_notes) > 1000 OR octet_length(coalesce(p_payload::text,'')) > 16000 THEN
        RAISE EXCEPTION 'payload too large';
    END IF;
    IF p_source = 'quote_request' AND (
        jsonb_typeof(p_payload->'items') IS DISTINCT FROM 'array'
        OR jsonb_array_length(p_payload->'items') < 1
        OR jsonb_array_length(p_payload->'items') > 30
    ) THEN
        RAISE EXCEPTION 'items required';
    END IF;

    v_hash := md5(v_phone || '|' || p_source || '|' || coalesce(p_payload::text, ''));

    SELECT count(*) INTO v_recent FROM public.leads
      WHERE phone = v_phone AND created_at > now() - interval '1 hour';
    IF v_recent >= 5 THEN
        RAISE EXCEPTION 'rate limit exceeded' USING ERRCODE = '53400';
    END IF;

    SELECT count(*) INTO v_dup FROM public.leads
      WHERE phone = v_phone AND payload_hash = v_hash AND created_at > now() - interval '24 hours';
    IF v_dup > 0 THEN
        RAISE EXCEPTION 'duplicate submission';
    END IF;

    v_ref := 'MJ-' || to_char(now(),'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(3),'hex'),1,6));

    INSERT INTO public.leads (
        reference, source, name, phone, business_name, governorate, city,
        preferred_contact, product_interest, expected_quantity, notes, payload_hash,
        utm_source, utm_medium, utm_campaign, landing_path, referrer)
    VALUES (
        v_ref, p_source, v_name, v_phone,
        nullif(btrim(coalesce(p_payload->>'businessName','')),''),
        nullif(btrim(coalesce(p_payload->>'governorate','')),''),
        nullif(btrim(coalesce(p_payload->>'city','')),''),
        CASE WHEN p_payload->>'preferredContact' = 'phone' THEN 'phone' ELSE 'whatsapp' END,
        nullif(btrim(coalesce(p_payload->>'productInterest','')),''),
        nullif(btrim(coalesce(p_payload->>'expectedQuantity','')),''),
        nullif(v_notes,''),
        v_hash,
        left(coalesce(p_attribution->>'utm_source',''), 80),
        left(coalesce(p_attribution->>'utm_medium',''), 80),
        left(coalesce(p_attribution->>'utm_campaign',''), 120),
        left(coalesce(p_attribution->>'landing_path',''), 200),
        left(coalesce(p_attribution->>'referrer',''), 200))
    RETURNING id INTO v_lead_id;

    IF jsonb_typeof(p_payload->'items') = 'array' THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_payload->'items') LOOP
            v_qty := coalesce((v_item->>'quantity')::int, 0);
            IF v_qty < 1 OR v_qty > 100000 THEN
                RAISE EXCEPTION 'invalid quantity';
            END IF;
            BEGIN
                v_pid := nullif(v_item->>'productId','')::uuid;
            EXCEPTION WHEN invalid_text_representation THEN
                RAISE EXCEPTION 'invalid product';
            END;
            IF v_pid IS NULL THEN
                RAISE EXCEPTION 'invalid product';
            END IF;

            SELECT pr.name, pr.public_approved, pr.is_active
              INTO v_pname, v_approved, v_active
              FROM public.products pr WHERE pr.id = v_pid;
            IF NOT FOUND OR v_approved IS DISTINCT FROM true OR v_active IS DISTINCT FROM true THEN
                RAISE EXCEPTION 'product not approved';
            END IF;
            IF v_pname ~* '(hookah|shisha|tobacco|أركيل|اركيل|شيش|نرجيل|تبغ)' THEN
                RAISE EXCEPTION 'regulated product';
            END IF;

            INSERT INTO public.lead_items (lead_id, product_id, product_name, quantity)
            VALUES (v_lead_id, v_pid, v_pname, v_qty);
        END LOOP;
    END IF;

    RETURN jsonb_build_object('reference', v_ref);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quote_request(TEXT, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_quote_request(TEXT, JSONB, JSONB) TO anon, authenticated;
