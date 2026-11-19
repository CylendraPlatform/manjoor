export interface StemModel {
  slug: string;
  title: string;
  descriptor: string;
  image: string;
  sourceFile: string;
}

/** Temporary public labels until official SKU names are confirmed. */
export const STEM_MODELS: StemModel[] = [
  {
    slug: "bakara-01",
    title: "بكار خشبي — نموذج 01",
    descriptor: "بكار بقشرة لحاء وفتحة هواء. قطعة خشبية حقيقية من إنتاج الورشة.",
    image: "/workshop/stems/01.jpg",
    sourceFile: "manjoor (3).jpg",
  },
  {
    slug: "bakara-02",
    title: "بكار خشبي — نموذج 02",
    descriptor: "مجموعة أبواق خشبية بقشرة لحاء. الصورة من ورشة منجور.",
    image: "/workshop/stems/02.jpg",
    sourceFile: "manjoor (1).jpg",
  },
  {
    slug: "bakara-03",
    title: "بكار خشبي — نموذج 03",
    descriptor: "بكار خشبي مركّب على قاعدة زجاجية للتوضيح. المنتج المعروض هو الجزء الخشبي.",
    image: "/workshop/stems/03.jpg",
    sourceFile: "manjoor (14).jpg",
  },
  {
    slug: "bakara-04",
    title: "بكار خشبي — نموذج 04",
    descriptor: "بكّارات منحوتة بنابض نحاسي. أسماء الموديلات مؤقتة حتى اعتماد التسمية.",
    image: "/workshop/stems/04.jpg",
    sourceFile: "manjoor (32).jpg",
  },
  {
    slug: "bakara-05",
    title: "بكار خشبي — نموذج 05",
    descriptor: "بكار مخروط بالخراطة، خشب خام قبل الطلاء. السعر والتوفر بعد المراجعة.",
    image: "/workshop/stems/05.jpg",
    sourceFile: "manjoor (21).jpg",
  },
  {
    slug: "bakara-06",
    title: "بكار خشبي — نموذج 06",
    descriptor: "بكار بتفاصيل خراطة متدرجة. يمكن دراسة تصنيع مشابه حسب المواصفات.",
    image: "/workshop/stems/06.jpg",
    sourceFile: "manjoor (23).jpg",
  },
  {
    slug: "bakara-07",
    title: "بكار خشبي — نموذج 07",
    descriptor: "دفعة بكّارات مخروطة بحلقات داكنة. للكميات يُرسل استفسار جملة.",
    image: "/workshop/stems/07.jpg",
    sourceFile: "manjoor (27).jpg",
  },
  {
    slug: "bakara-08",
    title: "بكار خشبي — نموذج 08",
    descriptor: "زوج بكّارات منحوتة الوجه مع نابض نحاسي. ليست قطعاً ديكورية عامة.",
    image: "/workshop/stems/08.jpg",
    sourceFile: "manjoor (35).jpg",
  },
];

export function stemBySlug(slug: string): StemModel | undefined {
  return STEM_MODELS.find((item) => item.slug === slug);
}

export function stemInquiryPath(slug?: string): string {
  if (!slug) return "/wholesale";
  return `/wholesale?model=${encodeURIComponent(slug)}`;
}
