"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@nike/ui";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            // Extract order number from session or generate one
            setOrderNumber(`ORD-${Date.now().toString(36).toUpperCase()}`);
            // Clear cart after successful checkout
            localStorage.removeItem("nike-cart");
        }
    }, [sessionId]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                            <Package className="h-4 w-4 text-accent-foreground" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-display-sm font-bold mb-2">Order Confirmed!</h1>
                <p className="text-foreground-muted mb-6">
                    Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
                </p>

                {/* Order Number */}
                {orderNumber && (
                    <div className="bg-background-secondary rounded-lg p-4 mb-8">
                        <p className="text-sm text-foreground-muted mb-1">Order Number</p>
                        <p className="text-lg font-mono font-bold">{orderNumber}</p>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-background-secondary rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
                    <ul className="space-y-3 text-sm text-foreground-muted">
                        <li className="flex items-start gap-3">
                            <span className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                            <span>You&apos;ll receive a confirmation email shortly</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                            <span>We&apos;ll notify you when your order ships</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                            <span>Estimated delivery: 3-5 business days</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button asChild>
                        <Link href="/products">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/account/orders">View Orders</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
