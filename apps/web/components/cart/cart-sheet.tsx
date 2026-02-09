"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Check, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { cn, Button } from "@nike/ui";

export function CartSheet() {
    const { isCartOpen, closeCart } = useUIStore();
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const cartRef = useRef<HTMLDivElement>(null);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set(prev).add(id));
    };

    const total = getTotal();
    const freeShippingThreshold = 100;
    const progress = Math.min((total / freeShippingThreshold) * 100, 100);
    const hasReachedFreeShipping = total >= freeShippingThreshold;

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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-50 shadow-2xl flex flex-col"
                        ref={cartRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping Cart"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-black/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Your Bag</h2>
                                    <p className="text-sm text-foreground/50">{items.length} {items.length === 1 ? "item" : "items"}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeCart}
                                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {items.length > 0 && (
                            <div className="px-6 py-4 bg-[#fafafa] border-b border-black/5">
                                <div className="flex items-center gap-2 mb-3">
                                    {hasReachedFreeShipping ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full bg-[#c0ff00] flex items-center justify-center">
                                                <Check className="w-3 h-3 text-black" />
                                            </div>
                                            <span className="text-sm font-semibold text-black">
                                                You&apos;ve earned free shipping!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Truck className="w-4 h-4 text-foreground/50" />
                                            <span className="text-sm text-foreground/60">
                                                Add <span className="font-bold text-black">${(freeShippingThreshold - total).toFixed(2)}</span> for free shipping
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className={cn(
                                            "h-full rounded-full",
                                            hasReachedFreeShipping ? "bg-[#c0ff00]" : "bg-black"
                                        )}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                                    <div className="w-24 h-24 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-6">
                                        <ShoppingBag className="w-10 h-10 text-black/20" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Your bag is empty</h3>
                                    <p className="text-foreground/50 max-w-[250px] text-sm leading-relaxed mb-8">
                                        Looks like you haven&apos;t added any items yet.
                                    </p>
                                    <Button
                                        onClick={closeCart}
                                        className="rounded-full px-8 h-12 font-bold"
                                    >
                                        Start Shopping
                                        <Sparkles className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-black/5">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="p-6 flex gap-5 group"
                                            >
                                                {/* Image */}
                                                <div className="w-24 h-24 bg-[#f5f5f5] rounded-xl flex-shrink-0 relative overflow-hidden">
                                                    {item.image && !imageErrors.has(item.id) ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain p-2"
                                                            sizes="96px"
                                                            onError={() => handleImageError(item.id)}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Image
                                                                src="/nike_logo.png"
                                                                alt="Nike"
                                                                width={30}
                                                                height={30}
                                                                className="opacity-20"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-3 mb-2">
                                                        <h4 className="font-semibold text-sm line-clamp-2 leading-snug">
                                                            {item.name}
                                                        </h4>
                                                        <p className="font-bold text-sm whitespace-nowrap">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs text-foreground/50 mb-3">
                                                        {item.category || "Shoes"} · {item.color} · Size {item.size}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-1 bg-[#f5f5f5] rounded-full px-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center text-lg"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-6 text-center text-sm font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center text-lg"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-foreground/40 hover:text-red-500 transition-colors p-1"
                                                            aria-label="Remove item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-black/5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                                {/* Subtotal */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-foreground/60">Subtotal</span>
                                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-foreground/40 mb-5">
                                    Shipping and taxes calculated at checkout
                                </p>

                                {/* CTAs */}
                                <div className="space-y-3">
                                    <Button
                                        size="lg"
                                        className="w-full rounded-full h-14 font-bold text-base group"
                                        asChild
                                    >
                                        <Link href="/checkout" onClick={closeCart}>
                                            Checkout
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full rounded-full h-12 font-semibold hover:bg-black/5 transition-colors"
                                        asChild
                                    >
                                        <Link href="/cart" onClick={closeCart}>
                                            View Full Bag
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
