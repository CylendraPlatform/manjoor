/**
 * Conceptual manufacturing ideas for public inquiry.
 * These are not catalog products. Do not set public_approved or price_public from this list.
 */
export const CONCEPT_DISCLAIMER =
  "الصور توضيحية لأفكار تصميمية، وليست صوراً لمنتجات متوفرة. يخضع التنفيذ لتقييم المعمل والاتفاق على المواصفات والسعر والمدة.";

export const CONCEPT_LABEL = "تصميم تصوري — قابل للدراسة والتنفيذ حسب الطلب";

export interface ManufacturingConcept {
  id: string;
  title: string;
  summary: string;
  image: string;
  imageNote: string;
}

export const MANUFACTURING_CONCEPTS: ManufacturingConcept[] = [
  {
    id: "candlesticks",
    title: "شمعدانات خشبية مخرطة",
    summary: "أشكال خراطة للعرض والإضاءة الشمعية. التشطيب والأبعاد يُراجعان مع الطلب.",
    image: "/concepts/candlesticks.jpg",
    imageNote: "مجموعة تصورية لعدة أشكال في إطار واحد، وليست أصنافاً منفصلة في المخزون.",
  },
  {
    id: "vases",
    title: "مزهريات خشبية للديكور",
    summary: "أوعية عرض مخرطة. الصورة تضم قطعاً متعددة كمرجع شكلي فقط.",
    image: "/concepts/vases-ornaments.jpg",
    imageNote: "صورة مجموعة لأفكار متنوعة، لا تعني أن كل قطعة معروضة متوفرة.",
  },
  {
    id: "lamp-bases",
    title: "قواعد مصابيح خشبية",
    summary: "قواعد مخرطة يمكن دراسة تركيب التجهيز الكهربائي عليها حسب الاتفاق.",
    image: "/concepts/lamp-bases.jpg",
    imageNote: "مجموعة تصورية لعدة قواعد. التركيب الكهربائي غير مضمّن ما لم يُتفق عليه.",
  },
  {
    id: "lidded-boxes",
    title: "علب خشبية بغطاء",
    summary: "علب ديكور بغطاء. النقش والحجم ليسا مواصفات ثابتة.",
    image: "/concepts/vases-ornaments.jpg",
    imageNote: "العلبة تظهر ضمن مجموعة تصورية وليست صنفاً مستقلاً في المخزون.",
  },
  {
    id: "bowls",
    title: "أوعية خشبية مخرطة",
    summary: "أوعية تقديم أو عرض. الخامة والسعة تُحددان بعد المراجعة.",
    image: "/concepts/vases-ornaments.jpg",
    imageNote: "الوعاء يظهر ضمن مجموعة تصورية وليس منتجاً جاهزاً.",
  },
  {
    id: "furniture-legs",
    title: "أرجل أثاث خشبية",
    summary: "مكونات خراطة للأثاث وليست قطعاً مكتملة من الأثاث.",
    image: "/concepts/furniture-components.jpg",
    imageNote: "صورة مجموعة لمكونات أثاث مقترحة، ليست قائمة مخزون.",
  },
  {
    id: "cabinet-knobs",
    title: "مقابض خزائن خشبية",
    summary: "مقابض وأرجل قصيرة للخزائن. المقاس يُؤكد مع الطلب.",
    image: "/concepts/furniture-components.jpg",
    imageNote: "المقابض جزء من مجموعة تصورية وليست أصنافاً منفصلة للبيع الفوري.",
  },
  {
    id: "curtain-finials",
    title: "رؤوس ستائر خشبية",
    summary: "نهايات مخرطة للستائر أو الدرابزين حسب الدراسة.",
    image: "/concepts/furniture-components.jpg",
    imageNote: "رؤوس متعددة في صورة واحدة كمرجع شكلي فقط.",
  },
  {
    id: "spheres",
    title: "كرات خشبية للديكور",
    summary: "أشكال كروية للعرض. القطر والتشطيب غير مثبتين.",
    image: "/concepts/furniture-components.jpg",
    imageNote: "الكرة تظهر ضمن مجموعة تصورية وليست صنفاً مستقلاً.",
  },
  {
    id: "spindles",
    title: "مغازل خشبية زخرفية",
    summary: "قطع خراطة طويلة للديكور أو مكونات الأثاث بعد التقييم.",
    image: "/concepts/furniture-components.jpg",
    imageNote: "المغازل ظاهرة كمجموعة أفكار، لا كمخزون جاهز.",
  },
];

export function conceptById(id: string | null | undefined): ManufacturingConcept | undefined {
  if (!id) return undefined;
  return MANUFACTURING_CONCEPTS.find((item) => item.id === id);
}

export function conceptInquiryPath(id: string): string {
  return `/custom-orders?concept=${encodeURIComponent(id)}`;
}
