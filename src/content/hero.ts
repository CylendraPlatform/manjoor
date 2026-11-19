export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  theme: "production" | "craft" | "custom";
  kind: "workshop" | "conceptual";
  tone: "cream" | "charcoal" | "linen";
  image: string;
  imageMobile: string;
  imageWidth: number;
  imageHeight: number;
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

/** Alias used by older tests and inquiry links. */
export const INQUIRY_PATHS = CAPABILITIES;

const PUBLIC_SLIDES: HeroSlide[] = [
  {
    id: "production",
    theme: "production",
    kind: "workshop",
    tone: "cream",
    image: "/workshop/hero/production.jpg",
    imageMobile: "/workshop/hero/production-mobile.jpg",
    imageWidth: 1200,
    imageHeight: 1500,
    kicker: "منجور · كربلاء",
    title: "إنتاج خشبي قائم… من الورشة",
    body: "بكّارات خشبية مخرطة من إنتاج منجور. الصورة منتج حقيقي داخل إطار تحريري، وليست خلفيّة مكبّرة.",
    primary: { label: "استعرض الإنتاج", href: "/products" },
    secondary: { label: "اطلب عرض سعر", href: "/wholesale" },
    caption: "صورة حقيقية من إنتاج الورشة، داخل تكوين استوديو.",
  },
  {
    id: "craft",
    theme: "craft",
    kind: "conceptual",
    tone: "charcoal",
    image: "/workshop/hero/craft.jpg",
    imageMobile: "/workshop/hero/craft.jpg",
    imageWidth: 1200,
    imageHeight: 1500,
    kicker: "الحرفة",
    title: "خراطة خشب… مهارة وصنعة",
    body: "نعمل بالخراطة والتشكيل الخشبي. هذا المشهد تصور لمهارة الخراطة، وليس تصويراً داخل معمل منجور.",
    primary: { label: "اقرأ عن الورشة", href: "/about" },
    secondary: { label: "اطلب تصنيع خاص", href: "/custom-orders" },
    caption: "تصور تصميمي لعملية الخراطة — ليست لقطة وثائقية للمعمل.",
  },
  {
    id: "custom",
    theme: "custom",
    kind: "conceptual",
    tone: "linen",
    image: "/workshop/hero/custom.jpg",
    imageMobile: "/workshop/hero/custom.jpg",
    imageWidth: 1200,
    imageHeight: 1500,
    kicker: "تصنيع حسب الطلب",
    title: "من المخرطة إلى المشروع",
    body: "مكونات أثاث وقطع ديكور وأعمال حسب التصميم. الصور التصورية ليست مخزوناً جاهزاً.",
    primary: { label: "استعرض الأفكار", href: "/custom-orders" },
    secondary: { label: "أرسل مواصفاتك", href: "/custom-orders#custom-inquiry" },
    caption: "تصور تطبيقي في بيئة استخدام — ليس منتجاً جاهزاً من منجور.",
  },
];

export function publicHeroSlides(): HeroSlide[] {
  return [...PUBLIC_SLIDES];
}
