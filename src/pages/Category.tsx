import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Category() {
    const { slug } = useParams();

    const { data: category, isLoading: categoryLoading } = useQuery({
        queryKey: ["category", slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .eq("slug", slug)
                .maybeSingle();
            if (error) throw error;
            return data;
        },
    });

    const { data: subcategories } = useQuery({
        queryKey: ["subcategories", (category as any)?.id],
        enabled: !!(category as any)?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("categories")
                .select("id, name, slug")
                .eq("parent_id", (category as any).id)
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return data ?? [];
        },
    } as any);


    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ["category-products", (category as any)?.id, (subcategories as any)?.map((s: any) => s.id)],
        enabled: !!(category as any)?.id,
        queryFn: async () => {
            const cat = category as any;
            const categoryIds = [cat.id, ...((subcategories as any)?.map((s: any) => s.id) || [])];

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .in("category_id", categoryIds)
                .eq("is_active", true)
                .order("sort_order", { ascending: true });
            if (error) throw error;
            return data ?? [];
        },
    } as any);


    if (categoryLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container py-12">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 4, 5, 6, 7, 8].map((n) => (
                            <Skeleton key={n} className="h-64 w-full" />
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">القسم غير موجود</h1>
                    <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">{(category as any)?.name}</h1>
                    <p className="text-muted-foreground">{(products as any)?.length || 0} منتج</p>
                </div>

                {subcategories && (subcategories as any).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 bg-muted/30 p-3 rounded-lg">
                        {(subcategories as any).map((sub: any) => (
                            <Link
                                key={sub.id}
                                to={`/category/${sub.slug}`}
                                className="bg-background border border-border px-4 py-1.5 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                )}


                {productsLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 4, 5, 6, 7, 8].map((n) => (
                            <Skeleton key={n} className="h-64 w-full" />
                        ))}
                    </div>
                ) : (products as any)?.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">لا توجد منتجات في هذا القسم حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {(products as any)?.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}
