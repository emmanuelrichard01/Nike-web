"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@nike/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, getTotal } = useCartStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container-nike py-24 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-display-sm font-bold mb-4">Your bag is empty</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    There are no items in your bag to checkout.
                </p>
                <Button size="lg" asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    const total = getTotal();
    const shipping = total > 150 ? 0 : 8;
    const taxes = total * 0.08; // Estimated tax
    const finalTotal = total + shipping + taxes;

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create checkout session");
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Failed to start checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-nike py-12">
            <h1 className="text-display-sm font-black uppercase mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Order Summary (Left/Main) */}
                <div className="lg:col-span-8">
                    <div className="bg-background-secondary rounded-card p-6 mb-8">
                        <h2 className="text-xl font-bold mb-6">Order Items</h2>
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b border-border/50 last:border-0">
                                    <div className="w-24 h-24 bg-white rounded-md overflow-hidden relative flex-shrink-0">
                                        {/* Image would go here, placeholder for now or item.image */}
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">👟</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.color} / {item.size}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Totals (Right Sidebar) */}
                <div className="lg:col-span-4">
                    <div className="bg-white border boundary-border rounded-card p-6 sticky top-24 shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Estimated Shipping</span>
                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Estimated Tax</span>
                                <span>${taxes.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full font-bold py-6 text-lg rounded-full"
                            onClick={handleCheckout}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Proceed to Payment"}
                            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </Button>

                        <p className="mt-4 text-xs text-center text-muted-foreground">
                            Secure Checkout powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
