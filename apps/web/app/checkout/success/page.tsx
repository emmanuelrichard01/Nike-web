"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nike/ui";
import { CheckCircle, Package, Truck, Mail, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="container-nike py-12 md:py-20">
                <div className="max-w-2xl mx-auto">
                    {/* Success Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        {/* Animated Checkmark */}
                        <div className="mb-6 flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="h-20 w-20 rounded-full bg-[#0d6d37] flex items-center justify-center"
                            >
                                <CheckCircle className="h-10 w-10 text-white" />
                            </motion.div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-3">Thank You for Your Order!</h1>
                        <p className="text-[#707072] text-lg">
                            We've received your order and will begin processing it soon.
                        </p>
                    </motion.div>

                    {/* Order Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-white rounded-lg overflow-hidden shadow-sm mb-8"
                    >
                        {/* Order Number Header */}
                        <div className="p-6 border-b border-[#e5e5e5]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#707072] mb-1">Order Number</p>
                                    <p className="text-xl font-bold font-mono">{orderNumber || "Processing..."}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-[#707072] mb-1">Estimated Delivery</p>
                                    <p className="font-medium">
                                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="p-6">
                            <h3 className="font-semibold mb-6">Order Status</h3>
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-[#e5e5e5]" />
                                <div className="absolute left-[15px] top-8 h-8 w-0.5 bg-[#0d6d37]" />

                                {/* Steps */}
                                <div className="space-y-6">
                                    <TimelineStep
                                        icon={<CheckCircle className="w-4 h-4" />}
                                        title="Order Confirmed"
                                        description="Your order has been received"
                                        isComplete={true}
                                        isActive={true}
                                    />
                                    <TimelineStep
                                        icon={<Package className="w-4 h-4" />}
                                        title="Processing"
                                        description="We're preparing your items"
                                        isComplete={false}
                                        isActive={false}
                                    />
                                    <TimelineStep
                                        icon={<Truck className="w-4 h-4" />}
                                        title="Shipped"
                                        description="On its way to you"
                                        isComplete={false}
                                        isActive={false}
                                    />
                                    <TimelineStep
                                        icon={<CheckCircle className="w-4 h-4" />}
                                        title="Delivered"
                                        description="Package delivered"
                                        isComplete={false}
                                        isActive={false}
                                        isLast={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Email Confirmation Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white rounded-lg p-6 shadow-sm mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-[#111]" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Confirmation Email Sent</h3>
                                <p className="text-[#707072] text-sm">
                                    We've sent a confirmation email with your order details and tracking information.
                                    Check your inbox (and spam folder, just in case).
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Button
                            className="flex-1 bg-[#111] hover:bg-[#111]/90 text-white rounded-full h-14 font-medium"
                            asChild
                        >
                            <Link href="/account/orders" className="flex items-center justify-center gap-2">
                                View My Orders
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-[#ccc] hover:border-[#111] rounded-full h-14 font-medium"
                            asChild
                        >
                            <Link href="/products" className="flex items-center justify-center gap-2">
                                Continue Shopping <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-12 text-center text-sm text-[#707072]"
                    >
                        <p>
                            Need help? <Link href="/contact" className="underline hover:text-[#111]">Contact us</Link> or
                            call <span className="font-medium text-[#111]">1-800-806-6453</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function TimelineStep({
    icon,
    title,
    description,
    isComplete,
    isActive,
    isLast = false
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    isComplete: boolean;
    isActive: boolean;
    isLast?: boolean;
}) {
    return (
        <div className="flex gap-4">
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                ${isComplete ? 'bg-[#0d6d37] text-white' : isActive ? 'bg-[#111] text-white' : 'bg-[#e5e5e5] text-[#707072]'}
            `}>
                {icon}
            </div>
            <div className={`pb-${isLast ? '0' : '2'}`}>
                <p className={`font-medium ${isComplete || isActive ? 'text-[#111]' : 'text-[#707072]'}`}>
                    {title}
                </p>
                <p className="text-sm text-[#707072]">{description}</p>
            </div>
        </div>
    );
}
