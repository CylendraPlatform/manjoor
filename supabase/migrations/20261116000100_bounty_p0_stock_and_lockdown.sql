-- Bounty P0 ONLY — apply to a NEW, ISOLATED Bounty staging DB after reviewing legacy migrations.
-- Never run on the Dukany original project.
-- Public order entry points disabled on the database side pending legal/security approval.
DO $bounty$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN ('place_order', 'create_order', 'create_public_order_with_items')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn.signature);
  END LOOP;
END;
$bounty$;

-- Typed adjustment function: a row lock, stock write and movement insert share one transaction.
-- SECURITY INVOKER retains table RLS requirements; admin privilege checked explicitly.
CREATE OR REPLACE FUNCTION public.bounty_adjust_stock(
    p_product_id UUID,
    p_new_stock INTEGER,
    p_reason TEXT
) RETURNS VOID
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp
AS $$
DECLARE
    v_old_stock INTEGER;
BEGIN
    IF auth.uid() IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Admin privileges required' USING ERRCODE = '42501';
    END IF;
    IF p_new_stock IS NULL OR p_new_stock < 0 THEN
        RAISE EXCEPTION 'Stock must be non-negative';
    END IF;
    IF NULLIF(btrim(p_reason), '') IS NULL THEN
        RAISE EXCEPTION 'A stock adjustment reason is required';
    END IF;

    SELECT stock INTO v_old_stock FROM public.products
    WHERE id = p_product_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    IF v_old_stock = p_new_stock THEN
        RETURN;
    END IF;

    UPDATE public.products SET stock = p_new_stock WHERE id = p_product_id;
    INSERT INTO public.stock_movements (product_id, change_amount, type, reason)
    VALUES (p_product_id, p_new_stock - v_old_stock, 'adjustment', p_reason);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bounty_adjust_stock(UUID, INTEGER, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bounty_adjust_stock(UUID, INTEGER, TEXT) TO authenticated;
