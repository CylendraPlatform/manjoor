import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import MarketingShell from "@/components/marketing/MarketingShell";
import PlaceholderVisual from "@/components/marketing/PlaceholderVisual";
import QuoteButton from "@/components/QuoteButton";
import { OFFERING_DIRECTIONS } from "@/content/offerings";
import { filterCatalog, loadPublicCatalog } from "@/lib/public-catalog";

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<"name" | "newest">("name");
  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const catalog = useQuery({ queryKey: ["public-catalog"], queryFn: loadPublicCatalog });

  const products = useMemo(
    () => filterCatalog(catalog.data?.products ?? [], { search, category, sort }),
    [catalog.data, search, category, sort],
  );

  return (
    <MarketingShell>
      <Seo title="المنتجات" description="كتالوج قطع الخشب المعتمدة من منجور في كربلاء. المنتجات غير المعتمدة لا تظهر." path="/products" />
      <div className="container py-10">
        <h1 className="text-3xl font-extrabold text-manjoor-walnut">المنتجات</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7">يظهر هنا فقط ما اعتُمد للعرض العام. لا خصومات مصطنعة ولا ادعاء بنفاد الكمية.</p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
          <label className="flex-1 text-sm">
            بحث
            <input
              className="mt-1 h-12 w-full rounded-xl border border-manjoor-sand px-3"
              value={search}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                if (event.target.value) next.set("search", event.target.value);
                else next.delete("search");
                setParams(next);
              }}
            />
          </label>
          <label className="text-sm">
            الترتيب
            <select className="mt-1 h-12 rounded-xl border border-manjoor-sand px-3" value={sort} onChange={(event) => setSort(event.target.value === "newest" ? "newest" : "name")}>
              <option value="name">الاسم</option>
              <option value="newest">الأحدث</option>
            </select>
          </label>
        </form>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button type="button" className={`shrink-0 rounded-full px-4 py-2 text-sm ${category === "" ? "bg-manjoor-walnut text-manjoor-sand" : "bg-white"}`} onClick={() => {
            const next = new URLSearchParams(params);
            next.delete("category");
            setParams(next);
          }}>الكل</button>
          {OFFERING_DIRECTIONS.filter((item) => item.slug !== "custom").map((item) => (
            <button key={item.slug} type="button" className={`shrink-0 rounded-full px-4 py-2 text-sm ${category === item.slug ? "bg-manjoor-walnut text-manjoor-sand" : "bg-white"}`} onClick={() => {
              const next = new URLSearchParams(params);
              next.set("category", item.slug);
              setParams(next);
            }}>{item.title}</button>
          ))}
        </div>
        {catalog.isLoading && <p className="mt-8">جارٍ التحميل…</p>}
        {catalog.data?.state === "unavailable" && <p className="mt-8" role="alert">الكتالوج غير متاح حالياً: {catalog.data.message}</p>}
        {catalog.data && catalog.data.state !== "unavailable" && products.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-6 leading-7">
            <p>{catalog.data.message || "لا توجد منتجات مطابقة ضمن المعتمد للعرض."}</p>
            <Link to="/custom-orders" className="mt-3 inline-block font-bold text-manjoor-walnut underline-offset-4 hover:underline">
              استعرض أفكار التصنيع حسب الطلب
            </Link>
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <Link to={`/products/${product.slug}`}>
                {product.images[0]
                  ? <img src={product.images[0]} alt="" className="h-48 w-full rounded-xl object-cover" />
                  : <PlaceholderVisual label="بانتظار صورة معتمدة" className="h-48 rounded-xl" />}
                <h2 className="mt-3 font-bold">{product.name}</h2>
              </Link>
              <p className="text-sm text-manjoor-charcoal/70">{product.material ?? "الخامة تُؤكد مع العرض"}</p>
              <p className="text-sm">{product.pricePublic && product.price != null ? `${product.price.toLocaleString("ar-IQ")} د.ع` : "السعر بعد التأكيد"}</p>
              <div className="mt-3">
                <QuoteButton product={{ productId: product.id, slug: product.slug, name: product.name, imageUrl: product.images[0] ?? null }} showQuantity />
              </div>
            </article>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
