export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  theme: "bakarat" | "custom" | "wholesale";
  kind: "workshop" | "conceptual";
  image: string;
  imageWidth: number;
  imageHeight: number;
  objectPosition: string;
  kicker: string;
  title: string;
  body: string;
  primary: HeroCta;
  secondary: HeroCta;
  caption: string;
}

export const INQUIRY_PATHS = [
  { title: "البكّارات الخشبية", body: "الإنتاج الحالي للورشة: بكّارات خشبية بأشكال متعددة.", href: "/products", cta: "استعرض البكّارات" },
  { title: "تصنيع خاص", body: "خراطة حسب التصميم والمقاس والكمية بعد مراجعة الورشة.", href: "/custom-orders", cta: "اطلب تصنيع خاص" },
  { title: "تجهيز الجملة", body: "للتجار والمحلات. السعر والتسليم يُؤكدان بعد المراجعة.", href: "/wholesale", cta: "اطلب عرض سعر جملة" },
] as const;

const PUBLIC_SLIDES: HeroSlide[] = [
  {
    id: "bakarat",
    theme: "bakarat",
    kind: "workshop",
    image: "/workshop/hero/bakarat.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center",
    kicker: "منجور · كربلاء",
    title: "بكّارات خشبية من ورشة منجور",
    body: "إنتاج حقيقي لسيقان خشبية (بكّارات) بالخراطة. الصورة من الورشة، وليست تصوراً تصميمياً.",
    primary: { label: "استعرض البكّارات", href: "/products" },
    secondary: { label: "اطلب عرض سعر", href: "/wholesale" },
    caption: "صورة حقيقية من إنتاج الورشة.",
  },
  {
    id: "custom",
    theme: "custom",
    kind: "workshop",
    image: "/workshop/hero/custom.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center",
    kicker: "تصنيع خاص",
    title: "خراطة حسب طلبك",
    body: "نراجع الفكرة أو المقاس أو النموذج، ثم نؤكد إمكانية التصنيع قبل أي التزام.",
    primary: { label: "اطلب تصنيع خاص", href: "/custom-orders" },
    secondary: { label: "تعرّف على الورشة", href: "/about" },
    caption: "تفصيل خراطة حقيقي من إنتاج الورشة.",
  },
  {
    id: "wholesale",
    theme: "wholesale",
    kind: "workshop",
    image: "/workshop/hero/wholesale.jpg",
    imageWidth: 1920,
    imageHeight: 900,
    objectPosition: "center",
    kicker: "للتاجر والمحل",
    title: "كميات للتجار وأصحاب المحلات",
    body: "استفسار الجملة للكميات والموديلات. لا سعر معلن ولا ادّعاء مخزون قبل التأكيد.",
    primary: { label: "اطلب عرض سعر جملة", href: "/wholesale" },
    secondary: { label: "استعرض البكّارات", href: "/products" },
    caption: "دفعة بكّارات خشبية من الورشة.",
  },
];

export function publicHeroSlides(): HeroSlide[] {
  return [...PUBLIC_SLIDES];
}
