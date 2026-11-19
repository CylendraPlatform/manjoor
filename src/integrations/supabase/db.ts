import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./client";

/**
 * A default-schema client handle for tables and columns that are not yet in the
 * generated `types.ts` (which is stale — see `overrides.ts`). Use this ONLY for
 * reads/writes that reference those not-yet-generated columns/tables
 * (e.g. loyalty_settings, orders.agent_id/admin_notes); prefer the typed
 * `supabase` client everywhere else. Runtime behavior is identical.
 */
export const db: SupabaseClient = supabase;
