export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  theme: "production" | "craft" | "custom";
  kind: "workshop" | "conceptual";
  image: string;
  imageMobile: string;
  imageWidth: number;
  imageHeight: number;
  objectPosition: string;
  objectPositionMobile: string;
  kicker: string;
  title: string;
  body: string;
  primary: HeroCta;
  secondary: HeroCta;
  caption: string;
}

export const CAPABILITIES = [
  { title: "إنتاج قائم", body: "بكّارات خشبية حقيقية من ورشة منجور في كربلاء.", href: "/products", cta: "استعرض الإنتاج" },
  { title: "خراطة وتصنيع", body: "مهارة خراطة يمكن توظيفها حسب المقاس والمواصفات بعد المراجعة.", href: "/about", cta: "عن الورشة" },
  { title: "تصنيع حسب الطلب", body: "أفكار ديكور ومكونات أثاث تُدرس كطلبات تصنيع، وليست مخزوناً.", href: "/custom-orders", cta: "اطلب تصنيع خاص" },
] as const;

export const INQUIRY_PATHS = CAPABILITIES;

const PUBLIC_SLIDES: HeroSlide[] = [
  {
    id: "production",
    theme: "production",
    kind: "conceptual",
    image: "/hero/production-desktop.webp",
    imageMobile: "/hero/production-mobile.webp",
    imageWidth: 1920,
    imageHeight: 1080,
    objectPosition: "center",
    objectPositionMobile: "center",
    kicker: "منجور · كربلاء",
    title: "بكّارات خشبية من إنتاج منجور",
    body: "نستعرض نماذج من البكّارات الخشبية التي يصنعها المعمل في كربلاء، بتصاميم مختلفة وإمكانية الاستفسار عن الكميات والتصنيع حسب الطلب.",
    primary: { label: "استعرض البكّارات", href: "/products" },
    secondary: { label: "اطلب عرض سعر", href: "/wholesale" },
    caption: "مشهد تصوري بتقنيات الذكاء الاصطناعي، والمنتجات الحقيقية في كتالوج البكّارات.",
  },
  {
    id: "craft",
    theme: "craft",
    kind: "conceptual",
    image: "/hero/craft-desktop.webp",
    imageMobile: "/hero/craft-mobile.webp",
    imageWidth: 1920,
    imageHeight: 1080,
    objectPosition: "center",
    objectPositionMobile: "center",
    kicker: "الحرفة",
    title: "خراطة خشبية دقيقة... وصناعة متقنة",
    body: "من تشكيل الخشب إلى أدق التفاصيل، نعمل على صناعة قطع خشبية وفق التصميم والمواصفات المطلوبة.",
    primary: { label: "تعرّف على الحرفة", href: "/about" },
    secondary: { label: "اطلب تصنيعاً خاصاً", href: "/custom-orders" },
    caption: "تصور فني بتقنيات الذكاء الاصطناعي لحرفة الخراطة، وليس لقطة من داخل المعمل.",
  },
  {
    id: "custom",
    theme: "custom",
    kind: "conceptual",
    image: "/hero/custom-desktop.webp",
    imageMobile: "/hero/custom-mobile.webp",
    imageWidth: 1920,
    imageHeight: 1080,
    objectPosition: "center",
    objectPositionMobile: "center",
    kicker: "تصنيع حسب الطلب",
    title: "من فكرتك... نصنع قطعة مميزة",
    body: "نستقبل أفكار وتصاميم المنتجات الخشبية، وندرس إمكانية تنفيذها حسب المواصفات والكميات المطلوبة.",
    primary: { label: "اطلب تصنيعاً خاصاً", href: "/custom-orders" },
    secondary: { label: "استعرض الأفكار", href: "/custom-orders" },
    caption: "تطبيقات مقترحة بتقنيات الذكاء الاصطناعي، وليست مخزوناً جاهزاً.",
  },
];

export function publicHeroSlides(): HeroSlide[] {
  return [...PUBLIC_SLIDES];
}
