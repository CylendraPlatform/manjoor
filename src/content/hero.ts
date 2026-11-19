import { features } from "@/config/features";

export type HeroAssetKind = "conceptual" | "workshop";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  theme: "craftsmanship" | "custom-woodwork" | "decorative";
  kind: HeroAssetKind;
  restricted: boolean;
  image: string;
  imageWidth: number;
  imageHeight: number;
  objectPosition: string;
  kicker: string;
  title: string;
  body: string;
  chips: string[];
  primary: HeroCta;
  secondary: HeroCta;
  caption: string;
}

/**
 * Real workshop merchandise remains unpublished until legal review.
 * Do not attach `photo/` paths here.
 */
const WORKSHOP_SLIDE_DISABLED = true;

export const INQUIRY_PATHS = [
  { title: "تقييم تصنيع", body: "أرسل الفكرة أو المقاس. نراجع الإمكانية في الورشة.", href: "/custom-orders", cta: "اطلب دراسة تصنيع" },
  { title: "عرض سعر", body: "للكميات والمواصفات المتفق عليها. السعر يُؤكد بعد المراجعة.", href: "/request-quote", cta: "اطلب عرض سعر" },
  { title: "أفكار تصميمية", body: "نماذج تصورية غير مخزونة. التنفيذ يخضع لموافقة المعمل.", href: "/custom-orders", cta: "استعرض الأفكار" },
] as const;

const PUBLIC_SLIDES: HeroSlide[] = [
  {
    id: "craftsmanship",
    theme: "craftsmanship",
    kind: "conceptual",
    restricted: false,
    image: "/concepts/hero/craftsmanship.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center",
    kicker: "منجور · كربلاء",
    title: "فنّ الخشب العراقي",
    body: "خراطة وتشكيل خشبي في ورشة منجور بكربلاء. المشهد تصور لمهارة الخراطة، وليس تصويراً فوتوغرافياً للمعمل.",
    chips: [],
    primary: { label: "اطلب تقييم تصنيع", href: "/custom-orders" },
    secondary: { label: "تعرّف على الورشة", href: "/about" },
    caption: "تصور تصميمي لعملية الخراطة — ليست صورة من داخل معمل منجور.",
  },
  {
    id: "custom-woodwork",
    theme: "custom-woodwork",
    kind: "conceptual",
    restricted: false,
    image: "/concepts/hero/custom-woodwork.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center right",
    kicker: "تصنيع حسب المواصفات",
    title: "قطعة واضحة… حسب مقاسك",
    body: "خراطة وتصنيع قطع خشبية حسب التصميم والمواصفات والكميات المطلوبة.",
    chips: [],
    primary: { label: "اطلب دراسة تصنيع حسب المقاسات", href: "/custom-orders" },
    secondary: { label: "اطلب عرض سعر", href: "/request-quote" },
    caption: "تصور تصميمي لقطعة واحدة، وليس منتجاً جاهزاً في المخزون.",
  },
  {
    id: "decorative",
    theme: "decorative",
    kind: "conceptual",
    restricted: false,
    image: "/concepts/hero/decor-concepts.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center",
    kicker: "تطبيقات ديكور",
    title: "أفكار خشبية للمشاريع",
    body: "اتجاه بصري لتطبيقات ديكور في بيئة استخدام. هذه الصور التصورية ليست منتجات مصنّعة معروضة للبيع.",
    chips: [],
    primary: { label: "استعرض أفكار التصنيع", href: "/custom-orders" },
    secondary: { label: "تواصل معنا", href: "/contact" },
    caption: "تصور تطبيقي في بيئة استخدام — ليس مخزوناً جاهزاً.",
  },
];

export function publicHeroSlides(): HeroSlide[] {
  return [...PUBLIC_SLIDES];
}

export function workshopPromoReady(): boolean {
  return features.workshopProductPromo && !WORKSHOP_SLIDE_DISABLED;
}
