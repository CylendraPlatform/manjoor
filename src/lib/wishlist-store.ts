import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface WishlistStore {
    items: string[]; // Store product IDs
    addItem: (id: string) => void;
    removeItem: (id: string) => void;
    hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (id) => {
                if (!get().items.includes(id)) {
                    set({ items: [...get().items, id] });
                    toast.success("تمت الإضافة للمفضلة");
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i !== id) });
                toast.success("تم الحذف من المفضلة");
            },
            hasItem: (id) => get().items.includes(id),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
