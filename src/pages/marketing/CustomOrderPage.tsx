import { useState } from "react";
import { ZodError } from "zod";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import ContactFields from "@/components/marketing/ContactFields";
import WhatsAppCta from "@/components/WhatsAppCta";
import { customOrderSchema, emptyContact, LeadSubmissionDisabledError, submitCustomOrder, zodFieldErrors, type ContactDraft } from "@/lib/leads";
import { claimSubmission, releaseSubmission, submissionKey } from "@/lib/submission-guard";
import { validateReferenceImage } from "@/lib/uploads";
import { trackEvent } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/utils";

export default function CustomOrderPage() {
  const [draft, setDraft] = useState<ContactDraft>(emptyContact());
  const [specifications, setSpecifications] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fileNote, setFileNote] = useState("لم يُختر ملف. رفع الصور غير مفعّل حتى اعتماد التخزين.");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "disabled" | "duplicate" | "error" | "saved">("idle");
  const [reference, setReference] = useState("");

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const problem = validateReferenceImage(file);
    setFileNote(problem ?? `«${file.name}» صالحة للفحص المحلي، ولن تُرفع حتى يُفعَّل مسار تخزين مراجع.`);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = customOrderSchema.safeParse({ ...draft, specifications, dimensions, quantity });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    const key = submissionKey(["custom", parsed.data.phone, specifications, String(quantity)]);
    if (claimSubmission(key) === "duplicate") {
      setStatus("duplicate");
      return;
    }
    setStatus("sending");
    try {
      const result = await submitCustomOrder(parsed.data);
      setReference(result.referenceNumber);
      setStatus("saved");
      trackEvent("custom_order_request", {});
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
      <Seo title="التصنيع حسب الطلب" description="أرسل مواصفات قطعة خشبية إلى ورشة منجور في كربلاء. الإرسال لا يعني قبول التصنيع." path="/custom-orders" />
      <div className="container max-w-3xl py-10">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">تصنيع حسب الطلب</h1>
        <p className="mt-3 leading-8">صف القطعة والأبعاد التقريبية والكمية. مراجعة الطلب لا تعني أن الورشة قبلت التصنيع أو حددت موعداً.</p>
        <form className="mt-8 space-y-4 rounded-3xl bg-white p-6" onSubmit={submit} noValidate>
          <label className="block text-sm font-medium">
            المواصفات
            <textarea className="mt-1 min-h-28 w-full rounded-xl border border-manjoor-sand p-3" value={specifications} onChange={(event) => setSpecifications(event.target.value)} />
            {errors.specifications && <span className="text-xs text-destructive">{errors.specifications}</span>}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              الأبعاد التقريبية
              <input className="mt-1 h-12 w-full rounded-xl border border-manjoor-sand px-3" value={dimensions} onChange={(event) => setDimensions(event.target.value)} />
            </label>
            <label className="text-sm font-medium">
              الكمية
              <input className="mt-1 h-12 w-full rounded-xl border border-manjoor-sand px-3" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
              {errors.quantity && <span className="text-xs text-destructive">{errors.quantity}</span>}
            </label>
          </div>
          <label className="block text-sm font-medium">
            صورة مرجعية (اختياري)
            <input className="mt-1 block w-full" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
          </label>
          <p className="text-sm text-manjoor-charcoal/70">{fileNote}</p>
          <ContactFields value={draft} errors={errors} onChange={setDraft} notesLabel="ملاحظات إضافية" />
          <button type="submit" disabled={status === "sending"} className="h-12 w-full rounded-full bg-manjoor-walnut font-bold text-manjoor-sand disabled:opacity-60">أرسل طلب التصنيع</button>
          {status === "disabled" && <p role="alert">لم يُحفظ الطلب. إرسال الاستفسارات غير مفعّل على الخادم بعد.</p>}
          {status === "duplicate" && <p role="alert">هذا الطلب مكرر خلال الدقيقة الأخيرة.</p>}
          {status === "error" && <p role="alert">{errors.form}</p>}
          {status === "saved" && <p role="status">وصل الاستفسار برقم {reference}. ليس التزاماً بالتصنيع.</p>}
        </form>
        <div className="mt-6"><WhatsAppCta topic="custom" label="واتساب للتصنيع الخاص" /></div>
      </div>
    </MarketingShell>
  );
}
