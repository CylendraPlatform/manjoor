import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ZodError } from "zod";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import ContactFields from "@/components/marketing/ContactFields";
import Reveal from "@/components/marketing/Reveal";
import ConceptCard from "@/components/marketing/ConceptCard";
import {
  CONCEPT_CROP_NOTE,
  CONCEPT_DISCLAIMER,
  CONCEPT_GROUPS,
  CONCEPT_LABEL,
  MANUFACTURING_CONCEPTS,
  conceptById,
} from "@/content/concepts";
import { customOrderSchema, emptyContact, LeadSubmissionDisabledError, submitCustomOrder, zodFieldErrors, type ContactDraft } from "@/lib/leads";
import { claimSubmission, releaseSubmission, submissionKey } from "@/lib/submission-guard";
import { validateReferenceImage } from "@/lib/uploads";
import { trackEvent } from "@/lib/analytics";
import { getErrorMessage } from "@/lib/utils";

export default function CustomOrderPage() {
  const [params] = useSearchParams();
  const concept = conceptById(params.get("concept"));
  const [draft, setDraft] = useState<ContactDraft>(emptyContact());
  const [specifications, setSpecifications] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [fileNote, setFileNote] = useState("لم يُختر ملف. رفع الصور غير مفعّل حتى اعتماد التخزين.");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "disabled" | "duplicate" | "error" | "saved">("idle");
  const [reference, setReference] = useState("");

  useEffect(() => {
    trackEvent("concept_gallery_view", { path: "/custom-orders" });
  }, []);

  useEffect(() => {
    if (!concept) return;
    setSpecifications((current) => current.trim().length > 0 ? current : `طلب دراسة تصنيع مشابه لـ«${concept.title}» (${concept.id}). ${CONCEPT_LABEL}`);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("custom-inquiry")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [concept]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const problem = validateReferenceImage(file);
    setFileNote(problem ?? `«${file.name}» صالحة للفحص المحلي، ولن تُرفع حتى يُفعَّل مسار تخزين مراجع.`);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = customOrderSchema.safeParse({
      ...draft,
      specifications,
      dimensions,
      quantity,
      conceptId: concept?.id ?? "",
      conceptTitle: concept?.title ?? "",
    });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    const key = submissionKey(["custom", parsed.data.phone, specifications, String(quantity), concept?.id ?? ""]);
    if (claimSubmission(key) === "duplicate") {
      setStatus("duplicate");
      return;
    }
    setStatus("sending");
    try {
      const result = await submitCustomOrder(parsed.data);
      setReference(result.referenceNumber);
      setStatus("saved");
      trackEvent("custom_order_request", {
        concept_id: concept?.id ?? "none",
        source: "custom_order",
      });
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
      <Seo title="التصنيع حسب الطلب" description="نماذج تصميمية خشبية يمكن دراسة تنفيذها حسب الطلب في ورشة منجور. الصور ليست منتجات متوفرة." path="/custom-orders" />
      <div className="container py-10">
        <p className="text-sm font-bold tracking-wide text-manjoor-brass">من فكرتك... نصنع قطعة مميزة</p>
        <h1 className="mt-2 text-3xl font-extrabold text-manjoor-walnut">تصاميم تصورية للتصنيع حسب الطلب</h1>
        <p className="mt-2 text-sm font-bold text-manjoor-walnut">{CONCEPT_LABEL}</p>
        <p className="mt-3 max-w-3xl leading-8">{CONCEPT_DISCLAIMER}</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-manjoor-charcoal/70">{CONCEPT_CROP_NOTE}</p>
        {concept && (
          <p className="mt-4 rounded-2xl border border-manjoor-brass bg-white p-4" role="status">
            الفكرة المختارة: <strong>{concept.title}</strong>. أكمل النموذج أسفل المعرض.
          </p>
        )}

        {CONCEPT_GROUPS.map((group) => (
          <section key={group.id} className="mt-10">
            <h2 className="text-xl font-extrabold text-manjoor-walnut">{group.title}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MANUFACTURING_CONCEPTS.filter((item) => item.group === group.id).map((item, index) => (
                <Reveal key={item.id} delay={index * 30}>
                  <ConceptCard item={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}

        <form id="custom-inquiry" className="mx-auto mt-12 max-w-3xl space-y-4 rounded-3xl bg-white p-6" onSubmit={submit} noValidate>
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">طلب دراسة تصنيع</h2>
          <p className="leading-7">صف القطعة والأبعاد التقريبية والكمية. مراجعة الطلب لا تعني أن الورشة قبلت التصنيع أو حددت موعداً.</p>
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
      </div>
    </MarketingShell>
  );
}
