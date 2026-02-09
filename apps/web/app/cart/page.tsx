"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@nike/ui";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

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

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container-nike py-20 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto text-foreground-muted mb-6" />
                <h1 className="text-display-md font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-foreground-muted mb-8">
                    Looks like you haven&apos;t added anything to your cart yet.
                </p>
                <Button asChild>
                    <Link href="/products">
                        Start Shopping
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        );
    }

    const subtotal = getTotal();
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="container-nike py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-display-md font-bold">Your Cart</h1>
                <Button variant="ghost" onClick={clearCart} className="text-destructive">
                    Clear Cart
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 bg-background-secondary rounded-card"
                        >
                            {/* Product Image Placeholder */}
                            <div className="w-24 h-24 bg-border/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-3xl">👟</span>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-foreground-muted">
                                            Size: {item.size} | Color: {item.color}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-foreground-muted hover:text-destructive transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 border border-border rounded hover:border-foreground transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 border border-border rounded hover:border-foreground transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-background-secondary rounded-card p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-foreground-muted">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-foreground-muted">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-foreground-muted">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full mb-3"
                            onClick={handleCheckout}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Checkout with Stripe
                                </>
                            )}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full" asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>

                        {subtotal < 100 && (
                            <p className="text-sm text-foreground-muted text-center mt-4">
                                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                            </p>
                        )}

                        {/* Secure Checkout Badge */}
                        <div className="mt-6 pt-4 border-t border-border">
                            <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure checkout powered by Stripe
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
