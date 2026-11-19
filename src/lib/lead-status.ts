export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "quoted",
  "won",
  "lost",
  "spam",
  "invalid",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  qualified: "مؤهّل",
  quoted: "أُرسل عرض",
  won: "تم الاتفاق",
  lost: "لم يكتمل",
  spam: "مزعج",
  invalid: "غير صالح",
};

const NEXT: Record<LeadStatus, readonly LeadStatus[]> = {
  new: ["contacted", "spam", "invalid", "lost"],
  contacted: ["qualified", "lost", "spam", "invalid"],
  qualified: ["quoted", "lost", "spam"],
  quoted: ["won", "lost"],
  won: [],
  lost: [],
  spam: [],
  invalid: [],
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  return NEXT[from].includes(to);
}

export function nextStatuses(from: LeadStatus): readonly LeadStatus[] {
  return NEXT[from];
}

export interface LeadSummaryInput {
  status: LeadStatus;
  source: string;
  governorate: string | null;
}

export interface LeadSummary {
  total: number;
  byStatus: Record<LeadStatus, number>;
  uncontacted: number;
  pendingQuote: number;
  won: number;
  lost: number;
  bySource: Record<string, number>;
  byGovernorate: Record<string, number>;
}

export function summarizeLeads(leads: LeadSummaryInput[]): LeadSummary {
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0])) as Record<LeadStatus, number>;
  const bySource: Record<string, number> = {};
  const byGovernorate: Record<string, number> = {};
  for (const lead of leads) {
    byStatus[lead.status] += 1;
    bySource[lead.source] = (bySource[lead.source] ?? 0) + 1;
    if (lead.governorate) byGovernorate[lead.governorate] = (byGovernorate[lead.governorate] ?? 0) + 1;
  }
  return {
    total: leads.length,
    byStatus,
    uncontacted: byStatus.new,
    pendingQuote: byStatus.qualified,
    won: byStatus.won,
    lost: byStatus.lost,
    bySource,
    byGovernorate,
  };
}
