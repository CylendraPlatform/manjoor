import { Link } from "react-router-dom";
import type { Product } from "@/integrations/supabase/overrides";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { ShoppingBag, Timer, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { triggerCartAnimation } from "@/lib/cart-animation";

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
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

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full border border-white/20">
      <Timer size={10} className="text-destructive animate-pulse" />
      <span>{timeLeft.h.toString().padStart(2, '0')}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}</span>
    </div>
  );
};

interface Props {
  product: Product;
}

const PLACEHOLDER_IMG = "/placeholder.svg";

const ProductCard = ({ product }: Props) => {
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem, removeItem, hasItem } = useWishlistStore();
  const [imgSrc, setImgSrc] = useState(() => product.images?.[0] || PLACEHOLDER_IMG);
  useEffect(() => {
    setImgSrc(product.images?.[0] || PLACEHOLDER_IMG);
  }, [product.id, product.images]);
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock !== null && product.stock <= 0;

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-md transition-shadow animate-fade-in flex flex-col h-full">
      <Link to={`/product/${product.slug}`} className="relative block">
        <div className="aspect-square overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(PLACEHOLDER_IMG)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? "grayscale opacity-60" : ""}`}
            loading="lazy"
          />
        </div>

        {/* Badges Container */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {hasDiscount && (
            <span className="bg-destructive text-white text-[11px] md:text-sm px-2.5 py-1.5 rounded-md font-black shadow-lg animate-pulse">
              وفر {discountPercent}%
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-amber-500 text-white text-[10px] md:text-xs px-2 py-1 rounded font-bold shadow-sm">
              الأكثر مبيعاً
            </span>
          )}
          {product.is_new && !hasDiscount && (
            <span className="bg-primary text-primary-foreground text-[10px] md:text-xs px-2 py-1 rounded shadow-sm">
              جديد
            </span>
          )}
          {product.loyalty_points_enabled !== false && (
            <span className="bg-blue-600/90 text-white text-[9px] md:text-[10px] px-2 py-1 rounded-md font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              {Math.floor((product.discount_price ?? product.price) / 100)} نقطة
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-black/80 text-white text-[10px] md:text-xs px-2.5 py-1.5 rounded-md font-bold shadow-xl backdrop-blur-md border border-white/20">
              نفذت الكمية
            </span>
          )}
        </div>

        {/* Countdown Over Image if available */}
        {product.offer_ends_at && (
          <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none">
            <CountdownTimer targetDate={product.offer_ends_at} />
          </div>
        )}

      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`} className="flex-1">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="font-black text-base md:text-lg text-primary leading-none">{formatPrice(product.discount_price!)}</span>
                <span className="text-[11px] md:text-xs text-muted-foreground line-through decoration-destructive decoration-2 opacity-70">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-black text-base md:text-lg text-foreground leading-none">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (hasItem(product.id)) removeItem(product.id);
                else addItem(product.id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${hasItem(product.id) ? "bg-red-50 text-red-500" : "bg-accent hover:bg-red-50 hover:text-red-500"}`}
              aria-label="المفضلة"
            >
              <Heart size={18} fill={hasItem(product.id) ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                if (isOutOfStock) return;
                addToCart(product);
                triggerCartAnimation(e.currentTarget);
              }}
              disabled={isOutOfStock}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${isOutOfStock ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110"}`}
              aria-label={isOutOfStock ? "نفذت الكمية" : "أضف للسلة"}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProductCard;
