import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Wishlist = () => {
    const { items } = useWishlistStore();

    const { data: products, isLoading } = useQuery({
        queryKey: ["wishlist-products", items],
        queryFn: async () => {
            if (items.length === 0) return [];
            const { data } = await supabase.from("products").select("*").in("id", items);
            return data ?? [];
        },
        enabled: items.length > 0,
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8">
                <h1 className="text-2xl font-bold mb-6">المفضلة</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground mb-4">قائمة المفضلة فارغة</p>
                        <Link to="/products">
                            <Button>تصفح المنتجات</Button>
                        </Link>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {products?.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Wishlist;
