import { IRAQI_GOVERNORATES, type ContactDraft } from "@/lib/leads";

const inputClass = "mt-1 w-full h-12 rounded-xl border border-manjoor-sand bg-white px-3 text-base";

export default function ContactFields({
  value,
  errors,
  onChange,
  notesLabel = "ملاحظات",
}: {
  value: ContactDraft;
  errors: Record<string, string | undefined>;
  onChange: (next: ContactDraft) => void;
  notesLabel?: string;
}) {
  const set = (patch: Partial<ContactDraft>) => onChange({ ...value, ...patch });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium">
        الاسم الكامل
        <input className={inputClass} value={value.name} autoComplete="name" onChange={(e) => set({ name: e.target.value })} aria-invalid={Boolean(errors.name)} />
        {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
      </label>
      <label className="block text-sm font-medium">
        رقم الهاتف
        <input className={inputClass} value={value.phone} inputMode="tel" autoComplete="tel" placeholder="07xxxxxxxxx" onChange={(e) => set({ phone: e.target.value })} aria-invalid={Boolean(errors.phone)} />
        {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
      </label>
      <label className="block text-sm font-medium">
        اسم المحل أو الشركة (اختياري)
        <input className={inputClass} value={value.businessName} onChange={(e) => set({ businessName: e.target.value })} />
      </label>
      <label className="block text-sm font-medium">
        المحافظة
        <select className={inputClass} value={value.governorate} onChange={(e) => set({ governorate: e.target.value })} aria-invalid={Boolean(errors.governorate)}>
          <option value="">اختر المحافظة</option>
          {IRAQI_GOVERNORATES.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        {errors.governorate && <span className="mt-1 block text-xs text-destructive">{errors.governorate}</span>}
      </label>
      <label className="block text-sm font-medium">
        المدينة أو الحي (اختياري)
        <input className={inputClass} value={value.city} onChange={(e) => set({ city: e.target.value })} />
      </label>
      <fieldset className="text-sm font-medium">
        <legend>طريقة التواصل المفضّلة</legend>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center gap-2"><input type="radio" name="preferredContact" checked={value.preferredContact === "whatsapp"} onChange={() => set({ preferredContact: "whatsapp" })} /> واتساب</label>
          <label className="inline-flex items-center gap-2"><input type="radio" name="preferredContact" checked={value.preferredContact === "phone"} onChange={() => set({ preferredContact: "phone" })} /> اتصال</label>
        </div>
      </fieldset>
      <label className="block text-sm font-medium sm:col-span-2">
        {notesLabel}
        <textarea className="mt-1 w-full min-h-28 rounded-xl border border-manjoor-sand bg-white p-3 text-base" value={value.notes} onChange={(e) => set({ notes: e.target.value })} aria-invalid={Boolean(errors.notes)} />
        {errors.notes && <span className="mt-1 block text-xs text-destructive">{errors.notes}</span>}
      </label>
    </div>
  );
}
