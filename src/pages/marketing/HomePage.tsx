import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import { brand } from "@/config/brand";
import { CONCEPT_DISCLAIMER } from "@/content/concepts";
import { HOMEPAGE_SPOTLIGHTS, publicHeroSlides } from "@/content/hero";
import { loadPublicCatalog } from "@/lib/public-catalog";

const STEPS = [
  { title: "أرسل فكرتك أو اختر تصميماً", body: "من المعرض أو بمواصفاتك." },
  { title: "نراجع إمكانية التنفيذ", body: "الخامة والتشطيب قبل أي التزام." },
  { title: "نؤكد السعر والمدة", body: "بعد المراجعة، وليس قبلها." },
];

export default function HomePage() {
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });
  const featured = (catalog.data?.products ?? []).slice(0, 6);
  const slides = publicHeroSlides();

  return (
    <MarketingShell>
      <Seo
        title="خراطة تُظهر عرق الخشب"
        description="خراطة وصناعة قطع خشبية في كربلاء، وتنفيذ تصاميم خاصة للتجار وأصحاب المشاريع حسب المواصفات والكميات المطلوبة."
        path="/"
      />

      <HeroCarousel slides={slides} />

      <section className="container grid gap-4 py-8 md:grid-cols-3">
        {HOMEPAGE_SPOTLIGHTS.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            aria-label={`${item.title} — استعرض أفكار التصنيع`}
            className="card-lift group relative overflow-hidden rounded-3xl bg-manjoor-charcoal text-manjoor-sand"
          >
            <img
              src={item.image}
              alt=""
              width={1400}
              height={933}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-manjoor-charcoal via-manjoor-charcoal/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-1 p-4">
              <h2 className="text-lg font-extrabold drop-shadow">{item.title}</h2>
              <p className="text-sm leading-6 text-manjoor-sand/90">{item.subtitle}</p>
              <span className="inline-block text-xs font-bold text-manjoor-brass">استعرض الأفكار</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="container py-8">
        <h2 className="text-center text-2xl font-extrabold text-manjoor-walnut md:text-3xl">من فكرتك... نصنعها لك</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center leading-8">
          نحوّل أفكارك إلى قطع خشبية: أرسل تصميمك أو اختر من نماذجنا التصورية، وسنقوم بدراسة التنفيذ وتقديم عرض مناسب حسب المواصفات والكمية.
        </p>
        <ol className="mt-8 grid gap-3 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <p className="text-sm font-extrabold text-manjoor-brass">{index + 1}. {step.title}</p>
              <p className="mt-1 text-sm leading-6">{step.body}</p>
            </li>
          ))}
          <li className="flex items-center justify-center">
            <Link to="/request-quote" className="w-full rounded-full bg-manjoor-walnut px-5 py-4 text-center font-bold text-manjoor-sand">
              اطلب الآن
            </Link>
          </li>
        </ol>
      </section>

      {featured.length > 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">منتجات معتمدة</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="card-lift rounded-2xl bg-white p-4 shadow-sm">
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
                )}
                <h3 className="mt-3 font-bold">{product.name}</h3>
                <p className="text-sm text-manjoor-charcoal/70">{product.material ?? "الخامة تُؤكد مع العرض"}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      {catalog.isLoading && <p className="container py-4 text-sm">جارٍ التحقق من المنتجات المعتمدة…</p>}
      {catalog.data?.state === "unavailable" && (
        <p className="container py-4" role="alert">تعذّر قراءة الكتالوج: {catalog.data.message}</p>
      )}

      <section className="bg-manjoor-walnut text-manjoor-sand">
        <div className="container py-10 md:py-12">
          <h2 className="text-3xl font-extrabold">تاجر أو صاحب محل؟ خلّينا نجهز طلباتك.</h2>
          <p className="mt-3 max-w-2xl leading-8">
            استفسار الجملة يشمل الكميات والمواصفات الخاصة. ترتيبات التسليم تُحدد بعد تأكيد الطلب، وليست وعداً مسبقاً بالتغطية.
          </p>
          <Link to="/wholesale" className="mt-6 inline-block min-h-11 rounded-full bg-manjoor-brass px-6 py-3 font-bold text-manjoor-charcoal">
            اطلب أسعار الجملة
          </Link>
        </div>
      </section>

      <section className="container py-10 pb-24 md:pb-14">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold text-manjoor-brass">{brand.sloganAr} · {brand.originAr}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-manjoor-walnut">جاهز تبدأ؟</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-manjoor-charcoal/80">{CONCEPT_DISCLAIMER}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link to="/custom-orders" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">استعرض أفكار التصنيع</Link>
            <Link to="/request-quote" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold">اطلب عرض سعر</Link>
            <Link to="/contact" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold">تواصل معنا</Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-manjoor-sand/80 bg-[#f7f1e8]/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/custom-orders" className="rounded-full bg-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-sand">
            أفكار التصنيع
          </Link>
          <Link to="/request-quote" className="rounded-full border border-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-walnut">
            اطلب عرض سعر
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
