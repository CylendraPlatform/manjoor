import { useState } from "react";
import { Link } from "react-router-dom";
import { ZodError } from "zod";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import ContactFields from "@/components/marketing/ContactFields";
import WhatsAppCta from "@/components/WhatsAppCta";
import { emptyContact, LeadSubmissionDisabledError, submitWholesaleLead, wholesaleLeadSchema, zodFieldErrors, type ContactDraft } from "@/lib/leads";
import { claimSubmission, releaseSubmission, submissionKey } from "@/lib/submission-guard";
import { trackEvent } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/utils";

export default function WholesalePage() {
  const [draft, setDraft] = useState<ContactDraft>(emptyContact());
  const [interest, setInterest] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "disabled" | "duplicate" | "error" | "saved">("idle");
  const [reference, setReference] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    const parsed = wholesaleLeadSchema.safeParse({ ...draft, productInterest: interest, expectedQuantity: quantity });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    const key = submissionKey(["wholesale", parsed.data.phone, interest, quantity]);
    if (claimSubmission(key) === "duplicate") {
      setStatus("duplicate");
      return;
    }
    setStatus("sending");
    try {
      const result = await submitWholesaleLead(parsed.data);
      setReference(result.referenceNumber);
      setStatus("saved");
      trackEvent("wholesale_form_success", {});
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
      <Seo title="الجملة" description="طلب أسعار الجملة من ورشة منجور في كربلاء للتجار وأصحاب المحلات. الإرسال استفسار وليس طلباً مكتملاً." path="/wholesale" />
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">تجهيز للجملة</h1>
        <p className="mt-3 leading-8">
          للتجار والموزعين وأصحاب المحلات. نراجع المنتجات المعتمدة والكميات المطلوبة ثم نعود بالسعر والتوفر. لا نعلن عن طاقة إنتاج أو تغطية توصيل قبل تأكيدها.
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/products" className="font-bold text-manjoor-walnut underline">اختيار منتجات</Link>
          <Link to="/custom-orders" className="font-bold text-manjoor-walnut underline">تصنيع خاص</Link>
        </div>
        <form className="mt-8 space-y-4 rounded-3xl bg-white p-6" onSubmit={submit} noValidate>
          <label className="block text-sm font-medium">
            المنتجات التي تهمّك
            <input className="mt-1 h-12 w-full rounded-xl border border-manjoor-sand px-3" value={interest} onChange={(event) => setInterest(event.target.value)} />
            {errors.productInterest && <span className="text-xs text-destructive">{errors.productInterest}</span>}
          </label>
          <label className="block text-sm font-medium">
            الكمية المتوقعة
            <input className="mt-1 h-12 w-full rounded-xl border border-manjoor-sand px-3" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <ContactFields value={draft} errors={errors} onChange={setDraft} />
          <button type="submit" disabled={status === "sending"} className="h-12 w-full rounded-full bg-manjoor-walnut font-bold text-manjoor-sand disabled:opacity-60">
            {status === "sending" ? "جارٍ الإرسال…" : "أرسل طلب الجملة"}
          </button>
          {status === "disabled" && <p role="alert">حفظ الطلبات غير مفعّل بعد. راجعنا البيانات محلياً ولم يُسجَّل طلب على الخادم.</p>}
          {status === "duplicate" && <p role="alert">وصلنا نفس الطلب قبل لحظات. انتظر قليلاً قبل إعادة الإرسال.</p>}
          {status === "error" && <p role="alert">{errors.form ?? "تعذّر الحفظ. لم يُؤكد الطلب."}</p>}
          {status === "saved" && <p role="status">تم حفظ الاستفسار. الرقم المرجعي: {reference}. هذا ليس تأكيداً للبيع.</p>}
        </form>
        <div className="mt-6"><WhatsAppCta topic="wholesale" label="واتساب الجملة" /></div>
      </div>
    </MarketingShell>
  );
}
