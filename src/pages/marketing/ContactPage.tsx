import { useState } from "react";
import { Link } from "react-router-dom";
import { ZodError } from "zod";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import ContactFields from "@/components/marketing/ContactFields";
import WhatsAppCta from "@/components/WhatsAppCta";
import { brand } from "@/config/brand";
import {
  contactLeadSchema,
  emptyContact,
  LeadSubmissionDisabledError,
  submitContactInquiry,
  zodFieldErrors,
  type ContactDraft,
} from "@/lib/leads";
import { claimSubmission, releaseSubmission, submissionKey } from "@/lib/submission-guard";
import { getErrorMessage } from "@/lib/utils";

export default function ContactPage() {
  const phoneReady = brand.contact.phone.trim().length > 0;
  const [draft, setDraft] = useState<ContactDraft>(emptyContact());
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "disabled" | "duplicate" | "error" | "saved">("idle");
  const [reference, setReference] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = contactLeadSchema.safeParse({ ...draft, message });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    const key = submissionKey(["contact", parsed.data.phone, message]);
    if (claimSubmission(key) === "duplicate") {
      setStatus("duplicate");
      return;
    }
    setStatus("sending");
    try {
      const result = await submitContactInquiry(parsed.data);
      setReference(result.referenceNumber);
      setStatus("saved");
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
      <Seo title="تواصل" description="تواصل مع ورشة منجور في كربلاء بخصوص المنتجات والجملة والتصنيع حسب الطلب." path="/contact" />
      <div className="container max-w-2xl py-12">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">تواصل معنا</h1>
        <p className="mt-3 leading-8">المكان: {brand.originAr}. العنوان التفصيلي لم يُعتمد بعد للنشر.</p>
        <p className="mt-3">{phoneReady ? `الهاتف: ${brand.contact.phone}` : "رقم الهاتف الرسمي لم يُضف في الإعدادات بعد، لذلك لا نعرض رقماً هنا."}</p>
        <form className="mt-8 space-y-4 rounded-3xl bg-white p-6" onSubmit={submit} noValidate>
          <label className="block text-sm font-medium">
            الرسالة
            <textarea className="mt-1 min-h-28 w-full rounded-xl border border-manjoor-sand p-3" value={message} onChange={(event) => setMessage(event.target.value)} />
            {errors.message && <span className="text-xs text-destructive">{errors.message}</span>}
          </label>
          <ContactFields value={draft} errors={errors} onChange={setDraft} notesLabel="ملاحظة إضافية" />
          <button type="submit" disabled={status === "sending"} className="h-12 w-full rounded-full bg-manjoor-walnut font-bold text-manjoor-sand disabled:opacity-60">أرسل الرسالة</button>
          {status === "disabled" && <p role="alert">لم تُحفظ الرسالة. حفظ الاستفسارات غير مفعّل.</p>}
          {status === "duplicate" && <p role="alert">هذه الرسالة مكررة. انتظر قليلاً.</p>}
          {status === "error" && <p role="alert">{errors.form ?? "فشل الحفظ. لا يوجد رقم مرجعي."}</p>}
          {status === "saved" && (
            <div className="space-y-3">
              <p role="status">تم الحفظ. المرجع: {reference}. واتساب لا يرسل الطلب تلقائياً.</p>
              <WhatsAppCta topic="followup" referenceNumber={reference} label="متابعة الطلب عبر واتساب" />
            </div>
          )}
        </form>
        <div className="mt-6 flex flex-col gap-3">
          <WhatsAppCta topic="general" label="افتح واتساب" />
          <Link to="/request-quote" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">اطلب عرض سعر</Link>
          <Link to="/wholesale" className="text-center font-bold text-manjoor-walnut underline">صفحة الجملة</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
