import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import Reveal from "@/components/marketing/Reveal";
import PlaceholderVisual from "@/components/marketing/PlaceholderVisual";
import WhatsAppCta from "@/components/WhatsAppCta";
import { brand } from "@/config/brand";
import { CONCEPT_DISCLAIMER, CONCEPT_LABEL, MANUFACTURING_CONCEPTS } from "@/content/concepts";
import { OFFERING_DIRECTIONS } from "@/content/offerings";
import { loadPublicCatalog } from "@/lib/public-catalog";

const STEPS = [
  "اختر منتجاً معتمداً أو أرسل مواصفاتك.",
  "حدّد الكمية.",
  "أرسل طلب الاستفسار.",
  "يصلك تأكيد السعر والتوفر بعد المراجعة.",
  "يُتفق على التصنيع والتسليم قبل أي التزام.",
];

export default function HomePage() {
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });
  const featured = (catalog.data?.products ?? []).slice(0, 6);

  return (
    <MarketingShell>
      <Seo
        title="خشب يتحوّل إلى فن"
        description="من كربلاء، منجور لقطع الخشب والديكور والتصنيع حسب الطلب للتجار وأصحاب المشاريع. الاستفسار لا يعني شراءً مكتملاً."
        path="/"
      />
      <section className="container grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div className="enter-soft space-y-6">
          <p className="text-sm font-bold tracking-wide text-manjoor-brass">{brand.sloganAr} · {brand.originAr}</p>
          <h1 className="text-4xl font-extrabold leading-tight text-manjoor-walnut md:text-6xl">خشب يتحوّل إلى فن</h1>
          <p className="text-lg leading-8 text-manjoor-charcoal/80">
            من كربلاء، نصنع قطعاً خشبية تجمع جمال الحرفة مع دقة التنفيذ، ونوفر حلول تجهيز وتصنيع للتجار وأصحاب المشاريع.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="rounded-full bg-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-sand">استعرض المنتجات</Link>
            <Link to="/wholesale" className="rounded-full border border-manjoor-walnut px-6 py-3 text-center font-bold text-manjoor-walnut">اطلب عرض سعر للجملة</Link>
          </div>
        </div>
        <PlaceholderVisual label="مساحة صورة الورشة — بانتظار صورة معتمدة" className="enter-soft min-h-72 rounded-3xl" />
      </section>

      <section className="container py-8">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">اتجاهات التصنيع</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-manjoor-charcoal/70">
          هذه الاتجاهات تصف ما يمكن أن تعرضه الورشة. المنتج لا يظهر ضمنها إلا بعد اعتماد صورته ومواصفاته.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERING_DIRECTIONS.map((item, index) => (
            <Reveal key={item.slug} delay={index * 40}>
              <Link to={item.slug === "custom" ? "/custom-orders" : `/products?category=${item.slug}`} className="block overflow-hidden rounded-2xl bg-white shadow-sm">
                <PlaceholderVisual label="خانة صورة الفئة" className="h-36" />
                <div className="p-4">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-manjoor-charcoal/70">{item.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">منتجات مختارة</h2>
        {catalog.isLoading && <p className="mt-4">جارٍ التحقق من المنتجات المعتمدة…</p>}
        {catalog.data?.state === "unavailable" && <p className="mt-4" role="alert">تعذّر قراءة الكتالوج: {catalog.data.message}</p>}
        {featured.length === 0 && !catalog.isLoading && catalog.data?.state !== "unavailable" && (
          <p className="mt-4 rounded-2xl border border-dashed border-manjoor-brass bg-white p-6 leading-7">
            لا تُعرض هنا صور أو أسعار افتراضية. عند اعتماد منتج، تظهر صورته واسمه وخامته وأبعاده وتشطيباته والحد الأدنى للطلب، والسعر فقط إذا كان معتمداً.
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`} className="rounded-2xl bg-white p-4 shadow-sm">
              {product.images[0]
                ? <img src={product.images[0]} alt={product.name} className="h-48 w-full rounded-xl object-cover" />
                : <PlaceholderVisual label="بانتظار صورة المنتج المعتمدة" className="h-48 rounded-xl" />}
              <h3 className="mt-3 font-bold">{product.name}</h3>
              <p className="text-sm text-manjoor-charcoal/70">{product.material ?? "الخامة تُؤكد مع العرض"}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container grid gap-8 py-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">من الورشة</h2>
          <p className="mt-3 leading-8">
            منجور ورشة نجارة وخراطة في كربلاء. مراحل العمل المعتادة تشمل تجهيز الخشب، التشكيل، التشطيب، ثم مراجعة القطعة قبل التسليم.
            أي وصف لتاريخ الورشة أو عدد العاملين يُنشر فقط بعد توثيقه، لذلك لا نضع أرقاماً هنا.
          </p>
        </div>
        <PlaceholderVisual label="بانتظار صور الخراطة والتشطيب المعتمدة" className="min-h-56 rounded-3xl" />
      </section>

      <section className="bg-manjoor-walnut text-manjoor-sand">
        <div className="container py-12">
          <h2 className="text-3xl font-extrabold">تاجر أو صاحب محل؟ خلّينا نجهز طلباتك.</h2>
          <p className="mt-3 max-w-2xl leading-8">
            استفسار الجملة يشمل الكميات، والمواصفات الخاصة، وطلبات الإعادة، والتنسيق التجاري. ترتيبات التسليم تُحدد بعد تأكيد الطلب، وليست وعداً مسبقاً بالتغطية.
          </p>
          <Link to="/wholesale" className="mt-6 inline-block rounded-full bg-manjoor-brass px-6 py-3 font-bold text-manjoor-charcoal">اطلب أسعار الجملة</Link>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">من فكرتك... نصنع قطعة مميزة</h2>
        <p className="mt-2 max-w-3xl leading-7">استكشف نماذج تصميمية لمنتجات خشبية يمكن دراسة تنفيذها حسب مواصفاتك والكمية المطلوبة.</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-manjoor-charcoal/70">{CONCEPT_DISCLAIMER}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MANUFACTURING_CONCEPTS.slice(0, 3).map((item) => (
            <Link key={item.id} to="/custom-orders" className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img src={item.image} alt="" className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-bold text-manjoor-brass">{CONCEPT_LABEL}</p>
                <h3 className="mt-2 font-bold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/custom-orders" className="mt-6 inline-block rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand">استعرض أفكار التصنيع</Link>
      </section>

      <section className="container py-4">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">المعرض</h2>
        <p className="mt-2 text-sm">شبكة الصور تنتظر وسائط الورشة المعتمدة. الخانات التالية ليست منتجات حقيقية.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {["خراطة", "تجهيز الخشب", "تشكيل", "تشطيب", "مراجعة", "قطع منتهية"].map((label) => (
            <PlaceholderVisual key={label} label={`${label} — بانتظار صورة معتمدة`} className="h-36 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-extrabold text-manjoor-walnut">كيف يتم الطلب</h2>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 rounded-2xl bg-white p-4">
              <span className="font-extrabold text-manjoor-brass">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="container pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold text-manjoor-walnut">جاهز تبدأ؟</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link to="/request-quote" className="rounded-full bg-manjoor-walnut px-5 py-3 text-center font-bold text-manjoor-sand">اطلب عرض سعر</Link>
            <Link to="/contact" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold">تواصل معنا</Link>
            <Link to="/products" className="rounded-full border border-manjoor-walnut px-5 py-3 text-center font-bold">استعرض المنتجات</Link>
          </div>
          <div className="mt-4"><WhatsAppCta topic="general" /></div>
        </div>
      </section>
    </MarketingShell>
  );
}
