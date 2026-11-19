import type { Json } from "@/integrations/supabase/types";

/**
 * Helpers for safely narrowing Supabase RPC results that are typed as `Json`.
 *
 * Supabase functions whose SQL returns a composed object are generated with the
 * return type `Json`, so the client must validate shape at runtime before
 * reading fields. These helpers replace unsafe `any` access with explicit,
 * defensive narrowing.
 */

export type JsonRecord = Record<string, Json | undefined>;

/** Returns a plain-object view of a Json value, or an empty record otherwise. */
export function asJsonRecord(value: Json | null | undefined): JsonRecord {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return {};
}

export function asString(value: Json | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: Json | undefined, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

export function asBoolean(value: Json | undefined): boolean {
  return value === true;
}
