import { useState } from "react";
import { Link } from "react-router-dom";
import { ZodError } from "zod";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import ContactFields from "@/components/marketing/ContactFields";
import { useQuoteStore } from "@/lib/quote-store";
import { emptyContact, LeadSubmissionDisabledError, quoteRequestSchema, submitQuoteRequest, zodFieldErrors, type ContactDraft } from "@/lib/leads";
import { claimSubmission, releaseSubmission, submissionKey } from "@/lib/submission-guard";
import { trackEvent } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/utils";

export default function RequestQuotePage() {
  const items = useQuoteStore((state) => state.items);
  const setQuantity = useQuoteStore((state) => state.setQuantity);
  const removeItem = useQuoteStore((state) => state.removeItem);
  const clear = useQuoteStore((state) => state.clear);
  const [draft, setDraft] = useState<ContactDraft>(emptyContact());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "disabled" | "duplicate" | "error" | "saved">("idle");
  const [reference, setReference] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...draft,
      items: items.map((item) => ({ productId: item.productId, name: item.name, quantity: item.quantity })),
    };
    const parsed = quoteRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    const key = submissionKey(["quote", parsed.data.phone, ...parsed.data.items.map((item) => `${item.productId}:${item.quantity}`)]);
    if (claimSubmission(key) === "duplicate") {
      setStatus("duplicate");
      return;
    }
    setStatus("sending");
    try {
      const result = await submitQuoteRequest(parsed.data);
      setReference(result.referenceNumber);
      setStatus("saved");
      clear();
      trackEvent("quote_submission_success", { lines: parsed.data.items.length });
    } catch (error) {
      releaseSubmission(key);
      if (error instanceof LeadSubmissionDisabledError) setStatus("disabled");
      else if (error instanceof ZodError) setErrors(zodFieldErrors(error));
      else {
        setStatus("error");
        setErrors({ form: getErrorMessage(error) });
      }
    }
  };

  return (
    <MarketingShell>
      <Seo title="طلب عرض سعر" description="اجمع كميات المنتجات المعتمدة واطلب عرض سعر من منجور. هذا ليس شراءً مكتملاً." path="/request-quote" />
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">طلب عرض سعر</h1>
        <p className="mt-2 text-sm leading-7">قائمة استفسار بالكميات. لا تُنشئ طلباً مدفوعاً ولا تخصم مخزوناً.</p>
        {items.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-6">
            لا توجد منتجات في الطلب. <Link to="/products" className="font-bold text-manjoor-walnut underline">استعرض المنتجات المعتمدة</Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4">
                <Link to={`/products/${item.slug}`} className="font-bold">{item.name}</Link>
                <label className="text-sm">
                  الكمية
                  <input className="mr-2 h-10 w-20 rounded-lg border px-2" type="number" min={1} value={item.quantity} aria-label={`كمية ${item.name}`} onChange={(event) => setQuantity(item.productId, Number(event.target.value))} />
                </label>
                <button type="button" className="text-sm text-destructive" onClick={() => removeItem(item.productId)}>حذف</button>
              </li>
            ))}
          </ul>
        )}
        {errors.items && <p className="mt-3 text-sm text-destructive" role="alert">{errors.items}</p>}
        <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
          <ContactFields value={draft} errors={errors} onChange={setDraft} />
          <button type="submit" disabled={status === "sending" || items.length === 0} className="h-12 w-full rounded-full bg-manjoor-walnut font-bold text-manjoor-sand disabled:opacity-60">
            أرسل طلب العرض
          </button>
          {status === "disabled" && <p role="alert">لم يُحفظ الطلب على الخادم. الإرسال العام ما زال مغلقاً حتى اجتياز فحص الأمان، لذلك لا يوجد رقم مرجعي.</p>}
          {status === "duplicate" && <p role="alert">تم منع إرسال مكرر.</p>}
          {status === "error" && <p role="alert">{errors.form ?? "فشل الحفظ. لا تعتبر الطلب ناجحاً."}</p>}
          {status === "saved" && <p role="status">تم الحفظ. المرجع: {reference}</p>}
        </form>
      </div>
    </MarketingShell>
  );
}
