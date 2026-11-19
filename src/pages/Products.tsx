import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const filter = searchParams.get("filter");
  const search = searchParams.get("search");
  const [sort, setSort] = useState("newest");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categorySlug, filter, search, sort],
    queryFn: async () => {
      let query = supabase.from("products").select("*, categories(slug)").eq("is_active", true);

      if (categorySlug) {
        const cat = categories?.find((c) => c.slug === categorySlug);
        if (cat) query = query.eq("category_id", cat.id);
      }
      if (filter === "offers") query = query.not("discount_price", "is", null);
      if (filter === "new") query = query.eq("is_new", true);

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (sort === "price-asc") query = query.order("price", { ascending: true });
      else if (sort === "price-desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data } = await query;
      return data ?? [];
    },
    enabled: (!categorySlug && !search) || (categories?.length ?? 0) > 0 || !!search,
  });

  const title = search
    ? `نتائج البحث عن: ${search}`
    : filter === "offers"
      ? "العروض"
      : filter === "new"
        ? "وصل حديثاً"
        : categorySlug
          ? categories?.find((c) => c.slug === categorySlug)?.name ?? "المنتجات"
          : "جميع المنتجات";


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-3 items-center">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث</SelectItem>
                <SelectItem value="price-asc">السعر: الأقل</SelectItem>
                <SelectItem value="price-desc">السعر: الأعلى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => { searchParams.delete("category"); searchParams.delete("filter"); setSearchParams(searchParams); }}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${!categorySlug && !filter ? "bg-primary text-primary-foreground" : "bg-card border-border hover:bg-accent"}`}
          >
            الكل
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { searchParams.set("category", cat.slug); searchParams.delete("filter"); setSearchParams(searchParams); }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${categorySlug === cat.slug ? "bg-primary text-primary-foreground" : "bg-card border-border hover:bg-accent"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">لا توجد منتجات</p>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;
