import { features } from "@/config/features";

export type HeroAssetKind = "conceptual" | "workshop";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  theme: "craftsmanship" | "custom-woodwork" | "workshop-products";
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
 * Slide C is prepared but disabled. It must not load `photo/` (regulated hookah stems).
 */
const WORKSHOP_SLIDE: HeroSlide = {
  id: "workshop-products",
  theme: "workshop-products",
  kind: "workshop",
  restricted: true,
  image: "",
  imageWidth: 1920,
  imageHeight: 980,
  objectPosition: "center",
  kicker: "منجور — الإنتاج الحقيقي",
  title: "منتجات الورشة المعتمدة للعرض",
  body: "صور الإنتاج الحقيقي تُنشر هنا بعد المراجعة القانونية واعتماد كل صنف للعرض العام. هذا الشريط غير مفعّل حالياً.",
  chips: [],
  primary: { label: "اطلب عرض سعر", href: "/request-quote" },
  secondary: { label: "تواصل مع الورشة", href: "/contact" },
  caption: "منتجات حقيقية — تُعرض فقط بعد الاعتماد.",
};

const PUBLIC_SLIDES: HeroSlide[] = [
  {
    id: "craftsmanship",
    theme: "craftsmanship",
    kind: "conceptual",
    restricted: false,
    image: "/concepts/hero/craftsmanship.jpg",
    imageWidth: 1920,
    imageHeight: 980,
    objectPosition: "center 35%",
    kicker: "منجور — فن الخشب العراقي | كربلاء",
    title: "خراطة خشبية تُتقن التفاصيل",
    body: "تصاميم متعددة بجودة عالية، وتصنيع كميات للتجار والمحلات حسب المواصفات المتفق عليها.",
    chips: ["خشب طبيعي مختار", "خراطة دقيقة وتشطيب متقن", "تصاميم متعددة وأحجام مختلفة", "تنفيذ خاص للتجار"],
    primary: { label: "استعرض أفكار التصنيع", href: "/custom-orders" },
    secondary: { label: "اطلب عرض سعر", href: "/request-quote" },
    caption: "تصور تصميمي — ليست صورة مخزون جاهز.",
  },
  {
    id: "custom-woodwork",
    theme: "custom-woodwork",
    kind: "conceptual",
    restricted: false,
    image: "/concepts/hero/custom-woodwork.jpg",
    imageWidth: 1920,
    imageHeight: 980,
    objectPosition: "center 45%",
    kicker: "تصنيع حسب المواصفات",
    title: "من فكرتك... نصنع قطعة مميزة",
    body: "نماذج تصميمية لأوعية ومكونات خشبية يمكن دراسة تنفيذها حسب طلبك والكمية المطلوبة.",
    chips: ["أوعية وعلب", "مكونات أثاث", "إضاءة وعرض"],
    primary: { label: "اطلب عرض سعر للتصنيع", href: "/request-quote" },
    secondary: { label: "استعرض التصاميم", href: "/custom-orders" },
    caption: "تصور تصميمي — التنفيذ يخضع لتقييم الورشة.",
  },
];

export const HOMEPAGE_SPOTLIGHTS: Array<{
  title: string;
  subtitle: string;
  href: string;
  image?: string;
}> = [
  {
    title: "مكونات الأثاث",
    subtitle: "أرجل، مغازل، وقطع زخرفية",
    href: "/custom-orders",
    image: "/concepts/furniture-components.jpg",
  },
  {
    title: "أوعية وتحف ديكورية",
    subtitle: "أطباق، علب، ومزهريات خشبية",
    href: "/custom-orders",
  },
  {
    title: "إكسسوارات الإضاءة",
    subtitle: "شمعدانات وقواعد مصابيح",
    href: "/custom-orders",
    image: "/concepts/lamp-bases.jpg",
  },
];

export function publicHeroSlides(): HeroSlide[] {
  const slides = [...PUBLIC_SLIDES];
  if (features.workshopProductPromo && WORKSHOP_SLIDE.image.length > 0) {
    slides.push(WORKSHOP_SLIDE);
  }
  return slides;
}

export function workshopPromoReady(): boolean {
  return features.workshopProductPromo && WORKSHOP_SLIDE.image.length > 0;
}
