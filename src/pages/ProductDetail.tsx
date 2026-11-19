import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { ShoppingBag, MessageCircle, ArrowRight, Heart, AlertTriangle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useCallback } from "react";
import { storeConfig } from "@/config/store";
import { triggerCartAnimation } from "@/components/FlyingCartAnimation";

const PLACEHOLDER_IMG = "/placeholder.svg";

const ProductDetail = () => {
  const { slug } = useParams();
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlistStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const displaySrc = useCallback(
    (url: string) => (failedUrls[url] ? PLACEHOLDER_IMG : url),
    [failedUrls]
  );
  const onImgError = useCallback((url: string) => {
    setFailedUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug!).maybeSingle();
      return data;
    },
  });

  const { data: suggested } = useQuery({
    queryKey: ["suggested", product?.category_id],
    queryFn: async () => {
      if (!product) return [];
      const { data } = await supabase.from("products").select("*").eq("category_id", product.category_id!).neq("id", product.id).limit(4);
      return data ?? [];
    },
    enabled: !!product?.category_id,
  });

  useEffect(() => {
    setFailedUrls({});
    setSelectedImage(0);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link to="/products">
            <Button>العودة للمنتجات</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"];
  const whatsappNum = storeConfig.whatsapp.replace('+', '');

  const productUrl = `${window.location.origin}/product/${product.slug}`;
  const quickOrderMsg = encodeURIComponent(
    `مرحباً منجور، أود طلب هذا المنتج فوراً:\n\n` +
    `📦 المنتج: ${product.name}\n` +
    `💰 السعر: ${formatPrice(hasDiscount ? product.discount_price! : product.price)}\n` +
    `🔗 الرابط: ${productUrl}\n\n` +
    `معلوماتي لإتمام الطلب:\n` +
    `- الاسم:\n` +
    `- الهاتف:\n` +
    `- العنوان:\n` +
    `-------------------------`
  );
  const inquiryMsg = encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${product.name}\nالرابط: ${productUrl}`);
  const isOutOfStock = product.stock !== null && product.stock <= 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <ArrowRight size={12} />
            <Link to="/products" className="hover:text-foreground">المنتجات</Link>
            <ArrowRight size={12} />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border mb-3">
                <img
                  src={displaySrc(images[selectedImage])}
                  alt={product.name}
                  onError={() => onImgError(images[selectedImage])}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded border-2 overflow-hidden ${i === selectedImage ? "border-primary" : "border-border"}`}
                    >
                      <img
                        src={displaySrc(img)}
                        alt=""
                        onError={() => onImgError(img)}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              <div className="mb-6">
                {hasDiscount ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">{formatPrice(product.discount_price!)}</span>
                    <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    <span className="bg-destructive text-destructive-foreground text-sm px-2 py-1 rounded">
                      خصم {Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>

              {product.description && (
                <div className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-wrap font-sans">
                  {product.description}
                </div>
              )}

              {!isOutOfStock ? (
                <div className="mb-6 space-y-2">
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    متوفر في المخزون
                  </p>
                  {product.stock! < 5 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1 animate-pulse font-bold">
                      <AlertTriangle size={14} />
                      بقي {product.stock} فقط - سارع بالطلب!
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <p className="text-sm text-destructive font-bold flex items-center gap-2">
                    <XCircle size={18} />
                    نفذت الكمية حالياً
                  </p>
                </div>
              )}

              {/* Loyalty Points Info */}
              {(product as any).loyalty_points_enabled !== false && !isOutOfStock && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                      <span className="text-sm font-black">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900">نقاط الولاء</p>
                      <p className="text-[11px] text-blue-700">ستربح {Math.floor((product.discount_price ?? product.price) / 100)} نقطة عند الشراء</p>
                    </div>
                  </div>
                  <div className="text-blue-600 font-black text-xl bg-white px-3 py-1 rounded-lg border border-blue-100">
                    +{Math.floor((product.discount_price ?? product.price) / 100)}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      addToCart(product);
                      triggerCartAnimation(e.currentTarget);
                    }}
                  >
                    <ShoppingBag size={18} />
                    {isOutOfStock ? "نفذت الكمية" : "أضف إلى السلة"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`gap-2 aspect-square px-0 w-14 border-2 ${isInWishlist(product.id) ? "border-red-500 text-red-500 bg-red-50" : ""}`}
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </Button>
                </div>

                {!isOutOfStock && (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/checkout" onClick={() => addToCart(product)} className="w-full">
                      <Button size="lg" variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white">
                        إتمام الطلب
                      </Button>
                    </Link>
                    <a
                      href={`https://wa.me/${whatsappNum}?text=${quickOrderMsg}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                    >
                      <Button size="lg" variant="secondary" className="w-full bg-green-500 hover:bg-green-600 text-white border-none gap-2">
                        <MessageCircle size={18} />
                        طلب سريع
                      </Button>
                    </a>
                  </div>
                )}

                <a href={`https://wa.me/${whatsappNum}?text=${inquiryMsg}`} target="_blank" rel="noreferrer">
                  <Button variant="link" className="w-full text-muted-foreground">
                    لديك استفسار؟ تواصل معنا
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Suggested */}
          {suggested && suggested.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold mb-6">منتجات مقترحة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggested.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
