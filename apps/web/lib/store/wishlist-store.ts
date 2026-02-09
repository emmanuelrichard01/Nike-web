import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
    id: string; // Product ID
    name: string;
    price: number | string;
    image?: string;
    slug: string;
    category: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
    syncWithServer: () => Promise<void>; // For future sync
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: async (item) => {
                const { items } = get();
                if (items.some((i) => i.id === item.id)) {
                    toast("Item already in wishlist");
                    return;
                }

                set({ items: [...items, item] });
                toast.success("Added to Wishlist");

                // Optimistic update - in future call API if logged in
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
                toast.success("Removed from Wishlist");
            },
            isInWishlist: (id) => get().items.some((i) => i.id === id),
            clearWishlist: () => set({ items: [] }),
            syncWithServer: async () => {
                // Placeholder for sync logic
            },
        }),
        {
            name: "nike-wishlist-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
