import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import { brand } from "@/config/brand";
import { INQUIRY_PATHS, publicHeroSlides } from "@/content/hero";
import { loadPublicCatalog } from "@/lib/public-catalog";

const STEPS = [
  { title: "أرسل الفكرة أو المقاس", body: "من النموذج أو من معرض الأفكار التصورية." },
  { title: "نراجع في الورشة", body: "الإمكانية والخامة قبل أي التزام." },
  { title: "نؤكد السعر والمدة", body: "بعد المراجعة فقط." },
];

export default function HomePage() {
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });
  const featured = (catalog.data?.products ?? []).slice(0, 6);
  const slides = publicHeroSlides();

  return (
    <MarketingShell>
      <Seo
        title="فنّ الخشب العراقي"
        description="خراطة وتصنيع قطع خشبية حسب التصميم والمواصفات والكميات المطلوبة. ورشة منجور في كربلاء."
        path="/"
      />

      <HeroCarousel slides={slides} />

      <section className="border-b border-manjoor-sand/80 bg-white">
        <div className="container py-10 md:py-12">
          <p className="text-sm font-bold tracking-wide text-manjoor-brass">{brand.originAr}</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold leading-snug text-manjoor-walnut md:text-3xl">
            خراطة وتصنيع قطع خشبية حسب التصميم والمواصفات والكميات المطلوبة.
          </h2>
        </div>
      </section>

      <section className="container grid gap-4 py-10 md:grid-cols-3">
        {INQUIRY_PATHS.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="flex flex-col rounded-3xl border border-manjoor-sand bg-white p-6 shadow-sm transition hover:border-manjoor-brass"
          >
            <h3 className="text-xl font-extrabold text-manjoor-walnut">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-manjoor-charcoal/80">{item.body}</p>
            <span className="mt-5 text-sm font-bold text-manjoor-brass">{item.cta}</span>
          </Link>
        ))}
      </section>

      <section className="bg-white">
        <div className="container py-10">
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">كيف نعمل</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="border-t-2 border-manjoor-brass pt-4">
                <p className="text-sm font-extrabold text-manjoor-brass">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-bold text-manjoor-walnut">{step.title}</p>
                <p className="mt-1 text-sm leading-7">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container py-8">
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">منتجات معتمدة للعرض</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="rounded-2xl bg-white p-4 shadow-sm">
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
                )}
                <h3 className="mt-3 font-bold">{product.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      {catalog.data?.state === "unavailable" && (
        <p className="container py-4" role="alert">تعذّر قراءة الكتالوج: {catalog.data.message}</p>
      )}

      <section className="container py-10 pb-24 md:pb-10">
        <div className="grid gap-8 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-2xl font-extrabold text-manjoor-walnut">للتجار وأصحاب المشاريع</h2>
            <p className="mt-3 leading-8">
              استفسار الجملة مراجعة للكميات والمواصفات. التسليم يُحدد بعد التأكيد، وليس تغطية معلنة مسبقاً.
            </p>
            <Link to="/wholesale" className="mt-6 inline-block rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand">
              اطلب أسعار الجملة
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-manjoor-walnut">أفكار تصورية</h2>
            <p className="mt-3 leading-8">
              معرض الأفكار يعرض نماذج يمكن دراسة تنفيذها. ليست مخزوناً، والتنفيذ يحتاج موافقة المعمل.
            </p>
            <Link to="/custom-orders" className="mt-6 inline-block rounded-full border border-manjoor-walnut px-6 py-3 font-bold text-manjoor-walnut">
              استعرض المعرض الكامل
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-manjoor-sand/80 bg-[#f7f1e8]/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/custom-orders" className="rounded-full bg-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-sand">
            دراسة تصنيع
          </Link>
          <Link to="/request-quote" className="rounded-full border border-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-walnut">
            عرض سعر
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
