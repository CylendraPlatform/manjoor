import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import { brand } from "@/config/brand";
import { CAPABILITIES, publicHeroSlides } from "@/content/hero";
import { homepageConcepts, CONCEPT_SHORT_LABEL, conceptInquiryPath } from "@/content/concepts";
import { STEM_MODELS, stemInquiryPath } from "@/content/stems";

const FEATURED_STEMS = STEM_MODELS.filter((item) =>
  ["bakara-02", "bakara-05", "bakara-06", "bakara-08"].includes(item.slug),
);

const STEPS = [
  { title: "أرسل الفكرة أو الموديل", body: "من الإنتاج القائم أو من معرض التصنيع الخاص." },
  { title: "نراجع في الورشة", body: "الإمكانية والخامة قبل أي التزام بالتصنيع." },
  { title: "نؤكد السعر والمدة", body: "بعد المراجعة فقط، دون أسعار معلنة مسبقاً." },
];

export default function HomePage() {
  const slides = publicHeroSlides();
  const concepts = homepageConcepts();
  const [lead, ...rest] = FEATURED_STEMS;

  return (
    <MarketingShell>
      <Seo
        title="خراطة خشب من كربلاء"
        description="ورشة منجور: إنتاج بكّارات خشبية، خراطة حسب الطلب، وأفكار تصنيع إضافية. الاستفسار ليس شراءً."
        path="/"
      />

      <HeroCarousel slides={slides} />

      <section className="bg-white">
        <div className="container grid gap-10 py-14 md:grid-cols-3 md:gap-12">
          {CAPABILITIES.map((item, index) => (
            <Link key={item.title} to={item.href} className="group border-t border-manjoor-brass pt-5">
              <p className="text-xs font-extrabold tracking-[0.2em] text-manjoor-brass">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 text-2xl font-extrabold text-manjoor-walnut">{item.title}</h2>
              <p className="mt-3 text-sm leading-8 text-manjoor-charcoal/80">{item.body}</p>
              <span className="mt-5 inline-block text-sm font-bold text-manjoor-brass group-hover:underline">{item.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="bakarat" className="container py-14">
        <p className="text-sm font-bold text-manjoor-brass">{brand.originAr}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-3xl font-extrabold text-manjoor-walnut">من الإنتاج الحالي</h2>
          <Link to="/products" className="font-bold text-manjoor-brass">كل النماذج</Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-manjoor-charcoal/75">
          بكّارات خشبية حقيقية. الأسماء مؤقتة. لا أسعار ولا كميات معلنة.
        </p>
        {lead && (
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <article className="overflow-hidden rounded-[2rem] bg-white lg:col-span-7">
              <Link to={`/products/${lead.slug}`} className="grid md:grid-cols-2">
                <img src={lead.image} alt={lead.title} className="aspect-[4/5] h-full w-full object-cover" />
                <div className="flex flex-col justify-end p-6 md:p-8">
                  <p className="text-xs font-bold text-manjoor-brass">إنتاج حقيقي</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-manjoor-walnut">{lead.title}</h3>
                  <p className="mt-3 text-sm leading-7">{lead.descriptor}</p>
                </div>
              </Link>
              <Link to={stemInquiryPath(lead.slug)} className="mx-6 mb-6 inline-flex rounded-full bg-manjoor-walnut px-5 py-3 text-sm font-bold text-manjoor-sand">
                استفسر عن هذا الموديل
              </Link>
            </article>
            <div className="grid gap-4 lg:col-span-5">
              {rest.map((item) => (
                <article key={item.slug} className="grid grid-cols-[8rem_1fr] overflow-hidden rounded-3xl bg-white sm:grid-cols-[10rem_1fr]">
                  <Link to={`/products/${item.slug}`}>
                    <img src={item.image} alt={item.title} className="h-full min-h-[8rem] w-full object-cover" />
                  </Link>
                  <div className="flex flex-col justify-center p-4">
                    <h3 className="font-extrabold text-manjoor-walnut">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-manjoor-charcoal/75">{item.descriptor}</p>
                    <Link to={stemInquiryPath(item.slug)} className="mt-2 text-sm font-bold text-manjoor-brass">اطلب هذا الموديل</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-manjoor-charcoal text-manjoor-sand">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2">
          <img src="/workshop/story/bench.jpg" alt="" className="aspect-[16/10] w-full rounded-[2rem] object-cover" />
          <div>
            <p className="text-sm font-bold text-manjoor-brass">الصنعة</p>
            <h2 className="mt-2 text-3xl font-extrabold">خراطة وتشكيل خشبي</h2>
            <p className="mt-4 leading-8 text-manjoor-sand/85">
              الورشة تراجع طلبات الخراطة حسب التصميم والمقاس والكمية. المشهد المجاور تصور لأدوات الحرفة، وليس صورة داخلية لمعمل منجور.
            </p>
            <Link to="/about" className="mt-6 inline-block rounded-full bg-manjoor-brass px-6 py-3 font-bold text-manjoor-charcoal">
              تعرّف على الورشة
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-14">
          <p className="text-sm font-bold text-manjoor-brass">{CONCEPT_SHORT_LABEL}</p>
          <h2 className="mt-2 text-3xl font-extrabold text-manjoor-walnut">أفكار تصنيع إضافية</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-manjoor-charcoal/75">
            نماذج يمكن دراسة تنفيذها. ليست مخزوناً، والتنفيذ يحتاج موافقة المعمل.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {concepts.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[2rem] border border-manjoor-sand/80">
                <Link to={conceptInquiryPath(item.id)}>
                  <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-bold text-manjoor-brass">{CONCEPT_SHORT_LABEL}</p>
                    <h3 className="mt-2 text-xl font-extrabold text-manjoor-walnut">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7">{item.summary}</p>
                    <span className="mt-4 inline-block text-sm font-bold text-manjoor-brass">ادرس تصنيع هذه الفكرة</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <Link to="/custom-orders" className="mt-8 inline-block font-bold text-manjoor-walnut">المعرض الكامل</Link>
        </div>
      </section>

      <section className="container py-14">
        <div className="rounded-[2rem] bg-[#efe6d8] px-6 py-10 md:px-12">
          <h2 className="text-3xl font-extrabold text-manjoor-walnut">للتاجر وصاحب المحل</h2>
          <p className="mt-3 max-w-2xl leading-8">
            استفسار الجملة للكميات والموديلات. التسليم والسعر يُحددان بعد التأكيد، وليسا تغطية معلنة.
          </p>
          <Link to="/wholesale" className="mt-6 inline-block rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand">
            اطلب عرض سعر جملة
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-14">
          <h2 className="text-3xl font-extrabold text-manjoor-walnut">كيف نعمل</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="text-5xl font-extrabold text-manjoor-sand">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-bold text-manjoor-walnut">{step.title}</p>
                <p className="mt-2 text-sm leading-7">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container pb-16">
        <div className="rounded-[2rem] bg-manjoor-walnut px-6 py-12 text-manjoor-sand md:px-12">
          <h2 className="text-3xl font-extrabold">جاهزون لمراجعة طلبك</h2>
          <p className="mt-3 max-w-xl leading-8 text-manjoor-sand/85">
            أرسل الموديل أو المقاس أو الفكرة. الحفظ استفسار عبر النظام المعتمد، وليس عملية شراء.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/wholesale" className="rounded-full bg-manjoor-brass px-6 py-3 text-center font-bold text-manjoor-charcoal">
              اطلب عرض سعر
            </Link>
            <Link to="/custom-orders#custom-inquiry" className="rounded-full border border-manjoor-sand px-6 py-3 text-center font-bold">
              أرسل طلب تصنيع
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
