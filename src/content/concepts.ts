/**
 * Conceptual manufacturing ideas for public inquiry.
 * These are not catalog products. Do not set public_approved or price_public from this list.
 */
export const CONCEPT_DISCLAIMER =
  "الصور توضيحية لأفكار تصميمية، وليست صوراً لمنتجات متوفرة. يخضع التنفيذ لتقييم المعمل والاتفاق على المواصفات والسعر والمدة.";

export const CONCEPT_LABEL = "تصميم تصوري — قابل للدراسة والتنفيذ حسب الطلب";

/** Short badge for cards. The full legal sentence lives once on the gallery. */
export const CONCEPT_SHORT_LABEL = "تصميم تصوري";

export const CONCEPT_CROP_NOTE =
  "بعض الصور قصّات من مجموعات تصورية لتوضيح الفكرة، وليست أصنافاً مستقلة في المخزون.";

export type ConceptGroup = "lighting" | "vessels" | "components";

export const CONCEPT_GROUPS: { id: ConceptGroup; title: string }[] = [
  { id: "lighting", title: "إضاءة وعرض" },
  { id: "vessels", title: "أوعية وعلب" },
  { id: "components", title: "مكونات أثاث" },
];

export interface ManufacturingConcept {
  id: string;
  title: string;
  summary: string;
  image: string;
  group: ConceptGroup;
  /** True when the file is a crop of a multi-object illustration. */
  detailCrop: boolean;
}

export const MANUFACTURING_CONCEPTS: ManufacturingConcept[] = [
  {
    id: "candlesticks",
    title: "شمعدانات خشبية مخرطة",
    summary: "أشكال خراطة للعرض والإضاءة الشمعية. التشطيب والأبعاد يُراجعان مع الطلب.",
    image: "/concepts/crops/candlesticks.jpg",
    group: "lighting",
    detailCrop: false,
  },
  {
    id: "vases",
    title: "مزهريات خشبية للديكور",
    summary: "أوعية عرض مخرطة كمرجع شكلي. الخامة والحجم غير مثبتين.",
    image: "/concepts/crops/vases.jpg",
    group: "vessels",
    detailCrop: true,
  },
  {
    id: "lamp-bases",
    title: "قواعد مصابيح خشبية",
    summary: "قواعد مخرطة يمكن دراسة تجهيزها حسب الاتفاق. الكهرباء غير مضمّنة تلقائياً.",
    image: "/concepts/crops/lamp-bases.jpg",
    group: "lighting",
    detailCrop: false,
  },
  {
    id: "lidded-boxes",
    title: "علب خشبية بغطاء",
    summary: "علب ديكور بغطاء. النقش والحجم ليسا مواصفات ثابتة.",
    image: "/concepts/crops/lidded-box.jpg",
    group: "vessels",
    detailCrop: true,
  },
  {
    id: "bowls",
    title: "أوعية خشبية مخرطة",
    summary: "أوعية تقديم أو عرض. الخامة والسعة تُحددان بعد المراجعة.",
    image: "/concepts/crops/bowl.jpg",
    group: "vessels",
    detailCrop: true,
  },
  {
    id: "furniture-legs",
    title: "أرجل أثاث خشبية",
    summary: "مكونات خراطة للأثاث وليست قطعاً مكتملة من الأثاث.",
    image: "/concepts/crops/legs.jpg",
    group: "components",
    detailCrop: true,
  },
  {
    id: "cabinet-knobs",
    title: "مقابض خزائن خشبية",
    summary: "مقابض وأرجل قصيرة للخزائن. المقاس يُؤكد مع الطلب.",
    image: "/concepts/crops/knobs.jpg",
    group: "components",
    detailCrop: true,
  },
  {
    id: "curtain-finials",
    title: "رؤوس ستائر خشبية",
    summary: "نهايات مخرطة للستائر أو الدرابزين حسب الدراسة.",
    image: "/concepts/crops/finials.jpg",
    group: "components",
    detailCrop: true,
  },
  {
    id: "spheres",
    title: "كرات خشبية للديكور",
    summary: "أشكال كروية للعرض. القطر والتشطيب غير مثبتين.",
    image: "/concepts/crops/sphere.jpg",
    group: "components",
    detailCrop: true,
  },
  {
    id: "spindles",
    title: "مغازل خشبية زخرفية",
    summary: "قطع خراطة طويلة للديكور أو مكونات الأثاث بعد التقييم.",
    image: "/concepts/crops/spindles.jpg",
    group: "components",
    detailCrop: true,
  },
];

/** Distinct source images for the homepage teaser — not the full catalog. */
export const HOMEPAGE_CONCEPT_IDS = ["candlesticks", "lamp-bases", "furniture-legs"] as const;

export function homepageConcepts(): ManufacturingConcept[] {
  return HOMEPAGE_CONCEPT_IDS
    .map((id) => conceptById(id))
    .filter((item): item is ManufacturingConcept => Boolean(item));
}

export function conceptById(id: string | null | undefined): ManufacturingConcept | undefined {
  if (!id) return undefined;
  return MANUFACTURING_CONCEPTS.find((item) => item.id === id);
}

export function conceptInquiryPath(id: string): string {
  return `/custom-orders?concept=${encodeURIComponent(id)}#custom-inquiry`;
}
