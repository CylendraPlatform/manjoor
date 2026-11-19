import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import { brand } from "@/config/brand";
import { INQUIRY_PATHS, publicHeroSlides } from "@/content/hero";
import { STEM_MODELS, stemInquiryPath } from "@/content/stems";

export default function HomePage() {
  const slides = publicHeroSlides();

  return (
    <MarketingShell>
      <Seo
        title="بكّارات خشبية"
        description="ورشة منجور في كربلاء تنتج بكّارات خشبية حقيقية، وتراجع طلبات التصنيع الخاص والجملة."
        path="/"
      />

      <HeroCarousel slides={slides} />

      <section className="border-b border-manjoor-sand/80 bg-white">
        <div className="container py-10 md:py-12">
          <p className="text-sm font-bold tracking-wide text-manjoor-brass">{brand.originAr}</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold leading-snug text-manjoor-walnut md:text-3xl">
            بكّارات خشبية من إنتاج الورشة، مع إمكانية التصنيع حسب الطلب وتجهيز الجملة.
          </h2>
        </div>
      </section>

      <section id="bakarat" className="container py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-manjoor-walnut">البكّارات الخشبية</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-manjoor-charcoal/80">
              نماذج من الإنتاج الحالي. الأسماء مؤقتة حتى اعتماد التسمية الرسمية. لا أسعار معلنة ولا ادّعاء توفر.
            </p>
          </div>
          <Link to="/products" className="font-bold text-manjoor-brass">كل النماذج</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEM_MODELS.slice(0, 8).map((item) => (
            <article key={item.slug} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
              <Link to={`/products/${item.slug}`} className="block">
                <img src={item.image} alt={item.title} className="aspect-[4/5] w-full object-cover" />
                <h3 className="px-4 pt-4 font-extrabold text-manjoor-walnut">{item.title}</h3>
                <p className="px-4 pt-2 text-sm leading-7 text-manjoor-charcoal/75">{item.descriptor}</p>
              </Link>
              <Link
                to={stemInquiryPath(item.slug)}
                className="m-4 mt-auto rounded-full bg-manjoor-walnut px-4 py-3 text-center text-sm font-bold text-manjoor-sand"
              >
                اطلب هذا الموديل
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-4 py-6 md:grid-cols-3">
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

      <section className="container py-10 pb-24 md:pb-10">
        <div className="grid gap-8 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-2xl font-extrabold text-manjoor-walnut">تصنيع خاص</h2>
            <p className="mt-3 leading-8">
              إن كان طلبك خارج النماذج المعروضة، نراجع المقاس والكمية في الورشة. الأفكار التصورية تبقى في صفحة التصنيع الخاص وليست مخزوناً.
            </p>
            <Link to="/custom-orders" className="mt-6 inline-block rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand">
              اطلب تصنيع خاص
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-manjoor-walnut">أفكار إضافية</h2>
            <p className="mt-3 leading-8">
              معرض التصنيع حسب الطلب يعرض اتجاهات خراطة أخرى يمكن دراستها. ليس واجهة الموقع الرئيسية.
            </p>
            <Link to="/custom-orders" className="mt-6 inline-block rounded-full border border-manjoor-walnut px-6 py-3 font-bold text-manjoor-walnut">
              استعرض الأفكار التصورية
            </Link>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-manjoor-sand/80 bg-[#f7f1e8]/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/products" className="rounded-full bg-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-sand">
            البكّارات
          </Link>
          <Link to="/wholesale" className="rounded-full border border-manjoor-walnut px-3 py-3 text-center text-sm font-bold text-manjoor-walnut">
            عرض سعر
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
