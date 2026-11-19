import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/marketing/Reveal";
import ConceptCard from "@/components/marketing/ConceptCard";
import { brand } from "@/config/brand";
import { CONCEPT_DISCLAIMER, homepageConcepts } from "@/content/concepts";
import { OFFERING_DIRECTIONS } from "@/content/offerings";
import { loadPublicCatalog } from "@/lib/public-catalog";

const STEPS = [
  { title: "أرسل الفكرة أو المنتج", body: "اختر تصميماً تصورياً أو صِف القطعة والكمية." },
  { title: "نراجع في الورشة", body: "نقيّم الإمكانية والخامة والتشطيب قبل أي التزام." },
  { title: "نؤكد السعر والمدة", body: "يصلك العرض بعد المراجعة. لا سعر معلن مسبقاً." },
];

export default function HomePage() {
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });
  const featured = (catalog.data?.products ?? []).slice(0, 6);
  const teaser = homepageConcepts();

  return (
    <MarketingShell>
      <Seo
        title="من قطعة خشب... إلى تصميم يحمل بصمتك"
        description="خراطة وصناعة قطع خشبية في كربلاء، وتنفيذ تصاميم خاصة للتجار وأصحاب المشاريع حسب المواصفات والكميات المطلوبة."
        path="/"
      />

      <section className="container grid items-center gap-8 py-8 md:grid-cols-2 md:py-12">
        <div className="enter-soft space-y-5">
          <p className="text-sm font-bold tracking-wide text-manjoor-brass">{brand.sloganAr} · {brand.originAr}</p>
          <h1 className="text-3xl font-extrabold leading-tight text-manjoor-walnut sm:text-4xl md:text-5xl">
            من قطعة خشب... إلى تصميم يحمل بصمتك
          </h1>
          <p className="max-w-xl text-base leading-8 text-manjoor-charcoal/85 md:text-lg">
            خراطة وصناعة قطع خشبية في كربلاء، وتنفيذ تصاميم خاصة للتجار وأصحاب المشاريع حسب المواصفات والكميات المطلوبة.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/custom-orders" className="rounded-full bg-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-sand">
              استعرض أفكار التصنيع
            </Link>
            <Link to="/request-quote" className="rounded-full border border-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-walnut">
              اطلب عرض سعر
            </Link>
          </div>
        </div>
        <figure className="enter-soft overflow-hidden rounded-3xl shadow-sm">
          <img
            src="/concepts/hero-woodturning.jpg"
            alt=""
            width={1400}
            height={933}
            className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
          />
          <figcaption className="bg-manjoor-walnut/95 px-4 py-2 text-xs leading-5 text-manjoor-sand">
            تصور تصميمي لخراطة خشبية — ليس صورة مخزون جاهز.
          </figcaption>
        </figure>
      </section>

      <section className="container py-8 md:py-10">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">من فكرتك... نصنع قطعة مميزة</h2>
          <p className="mt-2 max-w-3xl leading-7">
            استكشف نماذج تصميمية لمنتجات خشبية يمكن دراسة تنفيذها حسب مواصفاتك والكمية المطلوبة.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teaser.map((item, index) => (
            <Reveal key={item.id} delay={index * 60}>
              <ConceptCard item={item} inquiryCta={false} />
            </Reveal>
          ))}
        </div>
        <Link
          to="/custom-orders"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand"
        >
          استعرض أفكار التصنيع
        </Link>
      </section>

      <section className="container py-8">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">اتجاهات التصنيع</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-manjoor-charcoal/70">
          مسارات يمكن دراسة التوريد أو التصنيع عبرها. الظهور هنا لا يعني أن صنفاً معتمداً موجود في الكتالوج.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERING_DIRECTIONS.map((item, index) => (
            <Reveal key={item.slug} delay={index * 40}>
              <Link
                to={item.slug === "custom" ? "/custom-orders" : `/products?category=${item.slug}`}
                className="card-lift block overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <img src={item.image} alt="" width={900} height={480} className="aspect-[16/9] w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-manjoor-walnut">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-manjoor-charcoal/70">{item.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
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
      {!catalog.isLoading && catalog.data?.state !== "unavailable" && featured.length === 0 && (
        <section className="container py-4">
          <p className="rounded-2xl border border-manjoor-sand bg-white p-5 leading-7">
            الكتالوج العام للمنتجات المعتمدة فارغ حالياً. يمكنك طلب دراسة تصنيع أو عرض سعر للجملة دون انتظار صور مخزون.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link to="/custom-orders" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">طلب تصنيع حسب المواصفات</Link>
            <Link to="/wholesale" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-walnut">استفسار جملة</Link>
          </div>
        </section>
      )}

      <section className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">من الورشة في كربلاء</h2>
          <p className="mt-3 leading-8">
            منجور ورشة نجارة وخراطة. مراحل العمل المعتادة تشمل تجهيز الخشب، التشكيل، التشطيب، ثم مراجعة القطعة قبل التسليم.
            لا ننشر صوراً للورشة أو أرقاماً عن الطاقة قبل اعتمادها.
          </p>
          <Link to="/contact" className="mt-4 inline-block font-bold text-manjoor-walnut underline-offset-4 hover:underline">
            تواصل مع الورشة
          </Link>
        </div>
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm font-extrabold text-manjoor-brass">{index + 1}. {step.title}</p>
              <p className="mt-1 text-sm leading-6">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

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
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">جاهز تبدأ؟</h2>
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
          <Link to="/request-quote" className="rounded-full border border-manjoor-walnut px-3 py-3 text-center font-bold text-manjoor-walnut">
            اطلب عرض سعر
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
