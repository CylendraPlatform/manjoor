import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useQuoteStore, type QuoteItem } from "@/lib/quote-store";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  product: Omit<QuoteItem, "quantity">;
  defaultQuantity?: number;
  showQuantity?: boolean;
  className?: string;
}

/**
 * Adds a product to the quotation request with a chosen quantity. Does NOT
 * represent a purchase.
 */
export default function QuoteButton({ product, defaultQuantity = 1, showQuantity = false, className }: Props) {
  const addItem = useQuoteStore((s) => s.addItem);
  const inQuote = useQuoteStore((s) => s.hasItem(product.productId));
  const [qty, setQty] = useState(defaultQuantity);

  const add = () => {
    const quantity = Math.max(1, Math.floor(qty) || 1);
    addItem(product, quantity);
    trackEvent("add_to_quote", { product_id: product.productId, quantity });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showQuantity && (
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          aria-label="الكمية"
          className="w-20 h-10 rounded-md border border-input bg-background px-2 text-center"
        />
      )}
      <Button onClick={add} variant={inQuote ? "secondary" : "default"} className="gap-2 rounded-full">
        {inQuote ? <><Check size={16} /> في طلب العرض</> : <><Plus size={16} /> أضف لطلب العرض</>}
      </Button>
    </div>
  );
}
