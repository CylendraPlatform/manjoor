import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Quotation cart — DISTINCT from the direct-purchase cart (`cart-store.ts`).
 * A quotation request captures products + desired quantities for a sales
 * inquiry. It is never a completed purchase.
 */
export interface QuoteItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
}

interface QuoteStore {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  hasItem: (productId: string) => boolean;
  totalQuantity: () => number;
  itemCount: () => number;
}

const MIN_QTY = 1;

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const qty = Math.max(MIN_QTY, Math.floor(quantity) || MIN_QTY);
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        });
      },
      setQuantity: (productId, quantity) => {
        const qty = Math.floor(quantity);
        if (qty < MIN_QTY) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
        }));
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      hasItem: (productId) => get().items.some((i) => i.productId === productId),
      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      itemCount: () => get().items.length,
    }),
    { name: "manjoor-quote-request" },
  ),
);
