import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStaffLeads, updateStaffLead, type StaffLead } from "@/lib/staff-leads";
import { LEAD_STATUS_LABELS, canTransition, nextStatuses, summarizeLeads, type LeadStatus } from "@/lib/lead-status";
import { getErrorMessage } from "@/lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  quote_request: "عرض سعر",
  wholesale: "جملة",
  custom_order: "حسب الطلب",
  contact: "تواصل",
};

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const leads = useQuery({ queryKey: ["staff-leads"], queryFn: fetchStaffLeads });
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const result = leads.data;
  const rows: StaffLead[] = result?.ok ? result.leads : [];
  const summary = summarizeLeads(rows.map((lead) => ({
    status: lead.status,
    source: lead.source,
    governorate: lead.governorate,
  })));
  const current = rows.find((lead) => lead.id === selected) ?? null;

  const move = async (status: LeadStatus) => {
    if (!current || !canTransition(current.status, status)) return;
    setActionError("");
    try {
      await updateStaffLead(current.id, status, note || current.followUpNotes || "");
      await queryClient.invalidateQueries({ queryKey: ["staff-leads"] });
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">استفسارات البيع</h2>
        <p className="text-sm text-muted-foreground">أرقام الهاتف تظهر للإدارة فقط. لا تُحتسب زيارة واتساب كعميل.</p>
      </div>
      {leads.isLoading && <p>جارٍ التحميل…</p>}
      {result && result.ok === false && (
        <p role="alert" className="rounded-xl border border-dashed p-4 leading-7">
          تعذّر قراءة الاستفسارات: {result.message}. جدول العملاء المحتملين غير مفعّل على قاعدة معزولة، لذلك لا تُعرض طلبات ولا تُختلق أرقام.
        </p>
      )}
      {result?.ok && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="غير متواصَل معها" value={summary.uncontacted} />
            <Stat label="بانتظار عرض" value={summary.pendingQuote} />
            <Stat label="اتفاقيات" value={summary.won} />
            <Stat label="لم تكتمل" value={summary.lost} />
          </div>
          {rows.length === 0 && <p>لا توجد استفسارات محفوظة.</p>}
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-right">
                  <th className="p-3">المرجع</th>
                  <th className="p-3">الاسم</th>
                  <th className="p-3">المحافظة</th>
                  <th className="p-3">المصدر</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lead) => (
                  <tr key={lead.id} className="cursor-pointer border-b" onClick={() => { setSelected(lead.id); setNote(lead.followUpNotes ?? ""); }}>
                    <td className="p-3">{lead.reference}</td>
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.governorate ?? "—"}</td>
                    <td className="p-3">{SOURCE_LABEL[lead.source] ?? lead.source}</td>
                    <td className="p-3">{LEAD_STATUS_LABELS[lead.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {current && (
            <section className="space-y-3 rounded-xl border bg-card p-4">
              <h3 className="font-bold">{current.reference} — {current.name}</h3>
              <p>الهاتف: {current.phone}</p>
              <p>النشاط: {current.businessName ?? "—"}</p>
              <p>الاهتمام: {current.productInterest ?? "—"} / الكمية: {current.expectedQuantity ?? "—"}</p>
              <p>ملاحظة الزائر: {current.notes ?? "—"}</p>
              <label className="block text-sm">
                ملاحظة المتابعة
                <textarea className="mt-1 w-full rounded-lg border p-2" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              <div className="flex flex-wrap gap-2">
                {nextStatuses(current.status).map((status) => (
                  <button key={status} type="button" className="rounded-full border px-3 py-2 text-sm" onClick={() => move(status)}>
                    {LEAD_STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
              {actionError && <p role="alert">{actionError}</p>}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
