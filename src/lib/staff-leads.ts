import { db } from "@/integrations/supabase/db";
import { getErrorMessage } from "@/lib/utils";
import { isLeadStatus, type LeadStatus } from "@/lib/lead-status";

export interface StaffLead {
  id: string;
  reference: string;
  name: string;
  phone: string;
  businessName: string | null;
  governorate: string | null;
  source: string;
  status: LeadStatus;
  productInterest: string | null;
  expectedQuantity: string | null;
  notes: string | null;
  followUpNotes: string | null;
  createdAt: string;
}

export type StaffLeadsResult =
  | { ok: true; leads: StaffLead[] }
  | { ok: false; message: string };

function parseLead(row: unknown): StaffLead | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.reference !== "string") return null;
  if (typeof record.name !== "string" || typeof record.phone !== "string") return null;
  if (typeof record.status !== "string" || !isLeadStatus(record.status)) return null;
  if (typeof record.created_at !== "string") return null;
  return {
    id: record.id,
    reference: record.reference,
    name: record.name,
    phone: record.phone,
    businessName: typeof record.business_name === "string" ? record.business_name : null,
    governorate: typeof record.governorate === "string" ? record.governorate : null,
    source: typeof record.source === "string" ? record.source : "unknown",
    status: record.status,
    productInterest: typeof record.product_interest === "string" ? record.product_interest : null,
    expectedQuantity: typeof record.expected_quantity === "string" ? record.expected_quantity : null,
    notes: typeof record.notes === "string" ? record.notes : null,
    followUpNotes: typeof record.follow_up_notes === "string" ? record.follow_up_notes : null,
    createdAt: record.created_at,
  };
}

export async function fetchStaffLeads(): Promise<StaffLeadsResult> {
  const { data, error } = await db
    .from("leads")
    .select("id,reference,name,phone,business_name,governorate,source,status,product_interest,expected_quantity,notes,follow_up_notes,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return { ok: false, message: getErrorMessage(error) };
  if (!Array.isArray(data)) return { ok: false, message: "استجابة غير متوقعة من الخادم" };
  return {
    ok: true,
    leads: data.flatMap((row) => {
      const lead = parseLead(row);
      return lead ? [lead] : [];
    }),
  };
}

export async function updateStaffLead(id: string, status: LeadStatus, followUpNotes: string): Promise<void> {
  const { error } = await db
    .from("leads")
    .update({ status, follow_up_notes: followUpNotes, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
