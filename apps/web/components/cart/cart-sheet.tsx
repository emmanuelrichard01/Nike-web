"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { cn, Button } from "@nike/ui"; // Ensure Button is available or use standard

export function CartSheet() {
    const { isCartOpen, closeCart } = useUIStore();
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const cartRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeCart]);

    // Lock body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCartOpen]);

    const total = getTotal();
    const freeShippingThreshold = 100;
    const progress = Math.min((total / freeShippingThreshold) * 100, 100);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 transition-opacity"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-background z-50 shadow-2xl flex flex-col border-l border-border"
                        ref={cartRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping Cart"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 flex items-center justify-between border-b border-border bg-background z-10">
                            <h2 className="text-xl font-bold font-display uppercase tracking-wider">Your Bag ({items.length})</h2>
                            <button
                                onClick={closeCart}
                                className="p-2 -mr-2 text-foreground hover:text-foreground-muted hover:bg-background-secondary rounded-full transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {items.length > 0 && (
                            <div className="px-8 py-5 bg-background-secondary/30 border-b border-border">
                                {total >= freeShippingThreshold ? (
                                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium mb-3">
                                        <span className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">✓</span>
                                        You've earned free shipping!
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground-muted mb-3">
                                        Add <span className="text-foreground font-bold">${(freeShippingThreshold - total).toFixed(2)}</span> for free shipping
                                    </p>
                                )}
                                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-black"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-background-secondary rounded-full flex items-center justify-center text-4xl mb-2">
                                        🛍️
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Your bag is empty</h3>
                                        <p className="text-muted-foreground max-w-[250px] mx-auto text-sm leading-relaxed">
                                            Sign in to see your bag and favorites across all your devices.
                                        </p>
                                    </div>
                                    <Button onClick={closeCart} className="rounded-full px-8 py-6 text-base font-bold">
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-32 aspect-square bg-background-secondary rounded-sm flex-shrink-0 relative overflow-hidden self-start">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-3xl text-muted-foreground/20">
                                                    👟
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col min-h-[128px]">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-base line-clamp-2 leading-tight">{item.name}</h4>
                                                    <p className="text-sm text-foreground-muted">{item.category || "Men's Shoes"}</p>
                                                    <p className="text-sm text-foreground-muted">{item.color} / Size {item.size}</p>
                                                </div>
                                                <p className="font-bold text-base whitespace-nowrap">${item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-end justify-between mt-auto pt-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm text-foreground-muted mr-2">Qty</span>
                                                        <select
                                                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer border-b border-transparent hover:border-black transition-colors py-0.5"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                        >
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                                <option key={num} value={num}>{num}</option>
                                                            ))}
                                                        </select>
                                                        <span className="text-xs text-foreground-muted ml-0.5">▼</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-red-600 transition-colors p-1 -mr-1"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-border bg-background space-y-4 shadow-[0_-5px_25px_rgba(0,0,0,0.03)] z-10">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-foreground-muted">
                                        Shipping, taxes, and discounts calculated at checkout.
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <Button size="lg" className="w-full text-lg font-bold rounded-full py-7 group" asChild>
                                        <Link href="/checkout" onClick={closeCart}>
                                            Guest Checkout <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="w-full font-bold rounded-full py-7 hover:bg-background-secondary transition-colors" asChild>
                                        <Link href="/cart" onClick={closeCart}>
                                            View Bag
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
