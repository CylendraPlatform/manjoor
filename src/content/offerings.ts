/**
 * Intended public offering directions. These are navigation and copy slots.
 * They are not a claim that stock, photos, or prices have been approved.
 */
export interface OfferingDirection {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
}

export const OFFERING_DIRECTIONS: OfferingDirection[] = [
  {
    slug: "wooden-ornaments",
    title: "التحفيات الخشبية",
    summary: "قطع خشبية للعرض والديكور. تُدرج المنتجات هنا بعد اعتماد الصور والمواصفات.",
    keywords: ["تحف", "تحفة", "تحفيات"],
  },
  {
    slug: "wooden-decor",
    title: "الديكور الخشبي",
    summary: "عناصر ديكور خشبية للمتاجر والمشاريع. التوفر يُؤكد مع كل طلب.",
    keywords: ["ديكور"],
  },
  {
    slug: "holders",
    title: "الشمعدانات والقواعد",
    summary: "قواعد وحوامل خشبية. الأبعاد والتشطيبات تُذكر على بطاقة كل منتج معتمد.",
    keywords: ["شمعدان", "قاعدة", "حامل"],
  },
  {
    slug: "furniture-parts",
    title: "قطع الأثاث الخشبية",
    summary: "مكونات خشبية للأثاث. ليست أثاثاً مكتملاً ما لم يُذكر ذلك على المنتج.",
    keywords: ["أثاث", "قطع أثاث"],
  },
  {
    slug: "turned-parts",
    title: "القطع المصنوعة بالخراطة",
    summary: "مكونات مخرطة من ورشة كربلاء. المواصفات الدقيقة تُراجع قبل التسعير.",
    keywords: ["خراطة", "مخرطة", "مخرط"],
  },
  {
    slug: "custom",
    title: "التصنيع حسب الطلب",
    summary: "إرسال مواصفات لا يعني قبول التصنيع. العرض والسعة يُؤكدان لاحقاً.",
    keywords: ["حسب الطلب", "تصنيع"],
  },
];

export function offeringBySlug(slug: string | null): OfferingDirection | undefined {
  if (!slug) return undefined;
  return OFFERING_DIRECTIONS.find((item) => item.slug === slug);
}
