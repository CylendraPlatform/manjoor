import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

export default function Offers() {
    const { data: products, isLoading } = useQuery({
        queryKey: ["offers-products"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name, slug)")
                .not("discount_price", "is", null)
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (error) throw error;

            // Secondary filter to ensure discount_price is actually less than price
            return (data ?? []).filter(p => p.discount_price && p.discount_price < p.price);
        },
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section for Offers */}
            <div className="bg-destructive/5 border-b border-destructive/10 py-12 mb-8">
                <div className="container text-center space-y-4">
                    <Badge variant="outline" className="text-destructive border-destructive/20 gap-1 px-4 py-1">
                        <Percent size={14} />
                        أفضل الأسعار
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-destructive italic tracking-tight">عروض التوفير</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto font-medium">
                        اكتشف أفضل الخصومات والعروض الحصرية على منتجاتنا المختارة بعناية. وفر أكثر مع متجر دكاني.
                    </p>
                </div>
            </div>

            <main className="flex-1 container py-8">
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-80 w-full rounded-xl" />
                        ))}
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground text-lg italic">لا توجد عروض نشطة حالياً، تابعنا للأفضل!</p>
                    </div>
                )}
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
}
