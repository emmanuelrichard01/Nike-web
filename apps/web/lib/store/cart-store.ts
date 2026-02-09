import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image?: string;
    category?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find(
                    (i) => i.variantId === item.variantId
                );

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.variantId === item.variantId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                    toast.success("Cart updated");
                } else {
                    set({
                        items: [
                            ...items,
                            { ...item, id: `cart-${Date.now()}-${Math.random()}` },
                        ],
                    });
                    toast.success("Added to cart");
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
                toast.success("Removed from cart");
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: "nike-cart",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
