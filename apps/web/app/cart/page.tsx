"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nike/ui";
import { Trash2, ShoppingBag, ArrowRight, Loader2, CreditCard, ChevronRight, Truck, Shield, Check, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set(prev).add(id));
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed");
        } finally {
            setIsLoading(false);
        }
    };

    const subtotal = getTotal();
    const freeShippingThreshold = 100;
    const shipping = subtotal >= freeShippingThreshold ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    const hasReachedFreeShipping = subtotal >= freeShippingThreshold;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#fafafa]">
                <div className="bg-white border-b border-black/5">
                    <div className="container-nike py-10">
                        <div className="flex items-center gap-2 text-sm text-foreground/50 mb-6">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-foreground font-medium">Shopping Bag</span>
                        </div>
                        <div className="w-12 h-1 bg-black rounded-full mb-4" />
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Shopping Bag</h1>
                    </div>
                </div>

                <div className="container-nike py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-black/20" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4">Your bag is empty</h2>
                        <p className="text-foreground/50 mb-10 max-w-md mx-auto text-lg">
                            Looks like you haven&apos;t added anything to your bag yet.
                        </p>
                        <Button
                            size="lg"
                            asChild
                            className="rounded-full px-10 h-14 font-bold text-base"
                        >
                            <Link href="/products">
                                Start Shopping
                                <Sparkles className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="bg-white border-b border-black/5">
                <div className="container-nike py-10">
                    <div className="flex items-center gap-2 text-sm text-foreground/50 mb-6">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">Shopping Bag</span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className="w-12 h-1 bg-black rounded-full mb-4" />
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
                                <ShoppingBag className="w-10 h-10" />
                                Shopping Bag
                            </h1>
                            <p className="text-foreground/50 mt-3 text-lg">
                                {items.length} {items.length === 1 ? "Item" : "Items"}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={clearCart}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 hidden md:flex"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Bag
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container-nike py-10 md:py-14">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Free Shipping Banner */}
                        <div className="bg-white rounded-2xl p-5 border border-black/5">
                            <div className="flex items-center gap-2 mb-3">
                                {hasReachedFreeShipping ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full bg-[#c0ff00] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-black" />
                                        </div>
                                        <span className="text-sm font-semibold">
                                            You&apos;ve earned free shipping!
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Truck className="w-4 h-4 text-foreground/50" />
                                        <span className="text-sm text-foreground/60">
                                            Add <span className="font-bold text-black">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more for free shipping
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div
                                    className={hasReachedFreeShipping ? "bg-[#c0ff00] h-full" : "bg-black h-full"}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 border border-black/5 flex gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="w-28 h-28 md:w-36 md:h-36 bg-[#f5f5f5] rounded-xl flex-shrink-0 relative overflow-hidden">
                                        {item.image && !imageErrors.has(item.id) ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-3"
                                                sizes="144px"
                                                onError={() => handleImageError(item.id)}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Image
                                                    src="/nike_logo.png"
                                                    alt="Nike"
                                                    width={40}
                                                    height={40}
                                                    className="opacity-20"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="font-bold text-base md:text-lg line-clamp-2 leading-snug">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-foreground/50 mt-1">
                                                    {item.category || "Shoes"} · {item.color} · Size {item.size}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-foreground/30 hover:text-red-500 transition-colors p-1"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-auto pt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-1 bg-[#f5f5f5] rounded-full px-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-lg"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="font-bold text-lg">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-black/5 sticky top-24">
                            <h2 className="text-xl font-black mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-foreground/60">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-foreground/60">
                                    <span>Shipping</span>
                                    <span className={`font-semibold ${shipping === 0 ? "text-[#00a843]" : "text-foreground"}`}>
                                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-foreground/60">
                                    <span>Estimated Tax</span>
                                    <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-black/5 pt-4 flex justify-between">
                                    <span className="font-black text-lg">Total</span>
                                    <span className="font-black text-lg">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3">
                                <Button
                                    size="lg"
                                    className="w-full rounded-full h-14 font-bold text-base group"
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Checkout
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full rounded-full h-12 font-semibold"
                                    asChild
                                >
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-6 border-t border-black/5 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-foreground/60">
                                    <Shield className="w-5 h-5" />
                                    <span>Secure checkout powered by Stripe</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-foreground/60">
                                    <CreditCard className="w-5 h-5" />
                                    <span>All major credit cards accepted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
