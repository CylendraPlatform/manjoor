import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/supabase/db";
import type { Tables } from "@/integrations/supabase/types";
import type { Product } from "@/integrations/supabase/overrides";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RefreshCcw, CreditCard, ChevronLeft, Timer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useCallback, useState } from "react";

const CountdownDisplay = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          h: Math.floor(difference / (1000 * 60 * 60)),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span>00:00:00</span>;

  return (
    <span>
      {timeLeft.h.toString().padStart(2, '0')}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}
    </span>
  );
};

const Index = () => {

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return (data ?? []) as Tables<"categories">[];
    },
  });


  const { data: featuredProducts, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await db.from("products").select("*").eq("is_best_seller", true).eq("is_active", true).limit(8);
      return (data ?? []) as Product[];
    },
  });

  const { data: newProducts } = useQuery({
    queryKey: ["new-products"],
    queryFn: async () => {
      const { data } = await db.from("products").select("*").eq("is_new", true).eq("is_active", true).limit(8);
      return (data ?? []) as Product[];
    },
  });

  const { data: offerProducts, isLoading: isOffersLoading } = useQuery({
    queryKey: ["offer-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").not("discount_price", "is", null).eq("is_active", true).limit(8);
      return (data ?? []) as Product[];
    },
  });

  // Featured categories (e.g., top 12)
  const topCategories: Tables<"categories">[] = categories?.slice(0, 12) || [];
  const offers: Product[] = offerProducts || [];
  const featured: Product[] = featuredProducts || [];
  const news: Product[] = newProducts || [];


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: 'rtl' });
  const [emblaRef2, emblaApi2] = useEmblaCarousel({ loop: true, direction: 'rtl' });

  useEffect(() => {
    if (!emblaApi) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi2) return;
    const intervalId = setInterval(() => {
      emblaApi2.scrollNext();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [emblaApi2]);

  const heroImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
  ];

  const promoBanners = [
    {
      title: "أجهزة المطبخ",
      subtitle: "خصومات الـ 40%",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
      link: "/products?search=مطبخ",
      color: "from-orange-500/20 to-orange-500/80"
    },
    {
      title: "أجهزة الرياضة",
      subtitle: "لياقة بدنية أعلى",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      link: "/products?search=رياضة",
      color: "from-blue-500/20 to-blue-500/80"
    },
    {
      title: "أجهزة المنزلية",
      subtitle: "راحة منزلك تهمنا",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
      link: "/products?search=منزل",
      color: "from-emerald-500/20 to-emerald-500/80"
    }
  ];

  const flashSaleTarget = new Date();
  flashSaleTarget.setHours(flashSaleTarget.getHours() + 18);


  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header />
      <main className="flex-1 space-y-4 md:space-y-8 pb-12">

        {/* Commercial Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white">
          <div className="container relative z-10 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-right space-y-6 md:w-1/2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-block bg-destructive px-3 py-1 rounded-sm font-bold text-xs md:text-sm animate-bounce">
                  خصومات تصل إلى 40% 🔥
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                  <Timer size={14} className="text-amber-400 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold text-white/90">ينتهي العرض خلال:</span>
                  <div className="text-xs md:text-sm font-black text-amber-400 font-mono tabular-nums">
                    <CountdownDisplay targetDate={flashSaleTarget.toISOString()} />
                  </div>
                </div>
              </div>
              <p className="text-3xl md:text-5xl font-black text-amber-500 mb-[-8px] tracking-wide drop-shadow-md">منجور</p>
              <h1 className="text-3xl md:text-6xl font-black leading-tight tracking-tight">
                أكبر تشكيلة منتجات <br />
                <span className="text-amber-400 italic">في العراق</span>
              </h1>
              <p className="text-sm md:text-lg opacity-80 max-w-lg leading-relaxed">
                توصيل لجميع المحافظات وحل لمشاكل الدفع عند الاستلام. تسوّق الآن واحصل على أفضل العروض الأسبوعية.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/products">
                  <Button size="lg" className="h-12 md:h-14 px-8 md:px-12 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 text-white">
                    تصفح المتجر
                  </Button>
                </Link>
                <Link to="/offers">
                  <Button size="lg" variant="outline" className="h-12 md:h-14 px-8 md:px-12 text-lg font-bold border-white/40 text-white hover:bg-white hover:text-black transition-all bg-transparent">
                    كافة العروض
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual element (Carousel) */}
            <div className="md:w-1/2 relative group hidden md:block overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:bg-primary/30 transition-all duration-700"></div>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {heroImages.map((src, i) => (
                    <div className="flex-[0_0_100%] min-w-0" key={i}>
                      <img
                        src={src}
                        alt={`MANJOOR Product ${i + 1}`}
                        className="relative z-10 w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Decoration */}
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/4"></div>
        </section>


        {/* 3-Banner Promo Section */}
        <section className="container py-2">
          {/* Desktop view: 3 Columns */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {promoBanners.map((banner, i) => (
              <Link
                key={i}
                to={banner.link}
                className="group relative overflow-hidden rounded-2xl aspect-[16/9] shadow-md hover:shadow-xl transition-all"
              >
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${banner.color} opacity-60 group-hover:opacity-80 transition-opacity`}></div>
                <div className="absolute bottom-0 right-0 p-6 text-white text-right">
                  <h3 className="text-2xl font-black mb-1">{banner.title}</h3>
                  <p className="text-sm opacity-90 font-bold">{banner.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile view: Slider */}
          <div className="md:hidden overflow-hidden rounded-2xl shadow-md" ref={emblaRef2}>
            <div className="flex">
              {promoBanners.map((banner, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 pr-0">
                  <Link
                    to={banner.link}
                    className="relative block aspect-[16/9] overflow-hidden"
                  >
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${banner.color} opacity-70`}></div>
                    <div className="absolute bottom-0 right-0 p-6 text-white text-right">
                      <h3 className="text-xl font-black mb-1">{banner.title}</h3>
                      <p className="text-xs opacity-90 font-bold">{banner.subtitle}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Features Strip */}
        <section className="container relative z-20">
          <div className="bg-background border border-border rounded-xl shadow-lg grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-border overflow-hidden">
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2 hover:bg-muted/50 transition-colors">
              <Truck className="text-primary h-6 w-6 md:h-8 md:w-8" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs md:text-sm">توصيل سريع</h3>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">لكل محافظات العراق</p>
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2 hover:bg-muted/50 transition-colors">
              <CreditCard className="text-primary h-6 w-6 md:h-8 md:w-8" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs md:text-sm">دفع عند الاستلام</h3>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">تسوق بكل ثقة وأمان</p>
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2 hover:bg-muted/50 transition-colors">
              <RefreshCcw className="text-primary h-6 w-6 md:h-8 md:w-8" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs md:text-sm">استرجاع سهل</h3>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">ضمان حقيقي للمنتج</p>
              </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col items-center text-center gap-2 hover:bg-muted/50 transition-colors">
              <ShieldCheck className="text-primary h-6 w-6 md:h-8 md:w-8" />
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs md:text-sm">أعلى جودة</h3>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">منتجات أصلية مختارة</p>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Deals Section (Highest Priority) */}
        <section className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-destructive text-white p-1 rounded">🔥</div>
              <h2 className="text-xl md:text-2xl font-black">عروض قوية</h2>
            </div>
            <Link to="/offers" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
              عرض الكل
              <ChevronLeft size={16} />
            </Link>
          </div>
          {isOffersLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {offers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* 2. Best Sellers */}
        <section className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 text-white p-1 rounded">⭐</div>
              <h2 className="text-xl md:text-2xl font-black">الأكثر مبيعاً</h2>
            </div>
            <Link to="/products" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
              كل المنتجات
              <ChevronLeft size={16} />
            </Link>
          </div>
          {isFeaturedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* 3. Selected Categories (Optimized Display) */}
        {topCategories && topCategories.length > 0 && (
          <section className="bg-muted/30 py-12">


            <div className="container">
              <div className="text-center mb-10 space-y-2">
                <h2 className="text-2xl md:text-3xl font-black">الأقسام المختارة</h2>
                <p className="text-muted-foreground">تصفح حسب فئات المنتجات التي تهمك</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {topCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group bg-background border border-border rounded-xl p-4 md:p-6 text-center hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full mx-auto mb-4 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <ShoppingBag className="text-muted-foreground group-hover:text-primary h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <span className="text-sm md:text-base font-bold whitespace-nowrap">{cat.name}</span>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/products">
                  <Button variant="ghost" className="text-muted-foreground font-bold">
                    مشاهدة جميع الأقسام
                    <ChevronLeft size={18} className="mr-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. New Arrivals */}
        {news && news.length > 0 && (
          <section className="container py-4">

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1 rounded">🆕</div>
                <h2 className="text-xl md:text-2xl font-black">وصل حديثاً</h2>
              </div>
              <Link to="/products?filter=new" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                عرض الكل
                <ChevronLeft size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {news.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

