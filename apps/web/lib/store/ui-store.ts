import { create } from "zustand";

interface UIState {
    isCartOpen: boolean;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isCartOpen: false,
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
}));
