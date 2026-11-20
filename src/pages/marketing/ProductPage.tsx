import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import PlaceholderVisual from "@/components/marketing/PlaceholderVisual";
import Lightbox from "@/components/marketing/Lightbox";
import QuoteButton from "@/components/QuoteButton";
import WhatsAppCta from "@/components/WhatsAppCta";
import { brand } from "@/config/brand";
import { stemBySlug, stemInquiryPath } from "@/content/stems";
import { loadPublicCatalog } from "@/lib/public-catalog";
import { trackEvent } from "@/lib/analytics";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <dt className="text-xs text-manjoor-charcoal/60">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export default function ProductPage() {
  const { slug = "" } = useParams();
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });
  const stem = stemBySlug(slug);
  const product = catalog.data?.products.find((item) => item.slug === slug);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (product) trackEvent("product_view", { product_id: product.id });
    if (stem) trackEvent("product_view", { product_id: stem.slug });
  }, [product, stem]);

  useEffect(() => {
    if (!product) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "manjoor-product-jsonld";
    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description ?? undefined,
      brand: { "@type": "Brand", name: brand.ar },
    };
    if (product.images[0]) data.image = product.images[0];
    if (product.pricePublic && product.price != null) {
      data.offers = {
        "@type": "Offer",
        priceCurrency: "IQD",
        price: product.price,
        availability: "https://schema.org/PreOrder",
      };
    }
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => script.remove();
  }, [product]);

  return (
    <MarketingShell>
      <Seo title={stem?.title ?? product?.name ?? "المنتج"} description={stem?.descriptor ?? product?.description ?? "تفاصيل منتج خشبي من منجور."} path={`/products/${slug}`} />
      <div className="container py-10">
        <Link to="/products" className="text-sm text-manjoor-walnut">العودة للبكّارات</Link>
        {stem && (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <img src={stem.image} alt={stem.title} className="h-80 w-full rounded-3xl object-cover md:h-[28rem]" />
            <div>
              <h1 className="text-3xl font-extrabold text-manjoor-walnut">{stem.title}</h1>
              <p className="mt-3 leading-8">{stem.descriptor}</p>
              <p className="mt-4 text-sm">السعر والتوفر ومدة التجهيز تُؤكد بعد مراجعة الطلب. هذا استفسار وليس شراءً.</p>
              <div className="mt-6 flex flex-col items-start gap-3">
                <Link to={stemInquiryPath(stem.slug)} className="inline-block rounded-full bg-manjoor-walnut px-6 py-3 font-bold text-manjoor-sand">
                  اطلب هذا الموديل
                </Link>
                <WhatsAppCta topic="product" model={stem.slug} label="اسأل عن هذا الموديل عبر واتساب" />
              </div>
            </div>
          </div>
        )}
        {!stem && catalog.isLoading && <p className="mt-6">جارٍ التحميل…</p>}
        {!stem && catalog.data?.state === "unavailable" && <p className="mt-6" role="alert">تعذّر تحميل المنتج: {catalog.data.message}</p>}
        {!stem && catalog.data && catalog.data.state !== "unavailable" && !product && (
          <p className="mt-6 rounded-2xl bg-white p-6">هذا المنتج غير متاح للعرض العام. قد يكون غير معتمد أو غير موجود.</p>
        )}
        {product && (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <button type="button" className="block w-full" onClick={() => product.images[0] && setActive(product.images[0])}>
                {product.images[0]
                  ? <img src={product.images[0]} alt={product.name} className="h-80 w-full rounded-3xl object-cover" />
                  : <PlaceholderVisual label="بانتظار صور المنتج المعتمدة" className="h-80 rounded-3xl" />}
              </button>
              <div className="mt-3 flex gap-2">
                {product.images.slice(1).map((src) => (
                  <button key={src} type="button" onClick={() => setActive(src)}>
                    <img src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-manjoor-walnut">{product.name}</h1>
              {product.description && <p className="mt-3 leading-8">{product.description}</p>}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Detail label="الخامة" value={product.material ?? "تُؤكد مع العرض"} />
                <Detail label="الأبعاد" value={product.dimensions ?? "تُؤكد مع العرض"} />
                <Detail label="التشطيب" value={product.finishes ?? "يُؤكد مع العرض"} />
                <Detail label="الحد الأدنى" value={product.moq != null ? String(product.moq) : "يُؤكد مع العرض"} />
                <Detail label="السعر" value={product.pricePublic && product.price != null ? `${product.price.toLocaleString("ar-IQ")} د.ع` : "بعد التأكيد"} />
                <Detail label="مدة التجهيز" value={product.leadTime ?? "تُذكر بعد مراجعة الطلب"} />
              </dl>
              <div className="mt-6 flex flex-col gap-3">
                <QuoteButton
                  showQuantity
                  product={{ productId: product.id, slug: product.slug, name: product.name, imageUrl: product.images[0] ?? null }}
                />
                <WhatsAppCta topic="product" model={product.slug} productName={product.name} productRef={product.slug} label="اسأل عن هذا المنتج" />
              </div>
            </div>
          </div>
        )}
      </div>
      <Lightbox src={active} alt={product?.name ?? "صورة"} onClose={() => setActive(null)} />
    </MarketingShell>
  );
}
