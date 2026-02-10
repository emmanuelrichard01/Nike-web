import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, ChevronRight, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@nike/ui";

export const metadata = {
    title: "My Orders",
};

export default async function AccountOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/account/orders");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
    });

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="container-nike py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/account"
                        className="w-10 h-10 rounded-full bg-white hover:bg-[#e5e5e5] flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-6">
                            <Package className="h-8 w-8 text-[#707072]" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                        <p className="text-[#707072] mb-8 max-w-md mx-auto">
                            When you place orders, they'll appear here so you can track their progress.
                        </p>
                        <Button
                            className="bg-[#111] hover:bg-[#111]/90 text-white rounded-full px-8 h-12"
                            asChild
                        >
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg overflow-hidden shadow-sm"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-[#e5e5e5]">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="text-sm text-[#707072]">
                                                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-[#707072]">Total</p>
                                                <p className="text-xl font-bold">${Number(order.total).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className={`flex items-center gap-4 ${idx !== order.items.length - 1 ? 'pb-4 border-b border-[#e5e5e5]' : ''}`}
                                            >
                                                {/* Product Image Placeholder */}
                                                <div className="h-20 w-20 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-3xl">👟</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{item.productName || "Nike Product"}</p>
                                                    <p className="text-sm text-[#707072]">
                                                        {item.size && `Size: ${item.size}`}
                                                        {item.size && item.color && " • "}
                                                        {item.color && `Color: ${item.color}`}
                                                    </p>
                                                    <p className="text-sm text-[#707072]">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-medium">${Number(item.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                {order.shippingAddress && (
                                    <div className="px-6 pb-6">
                                        <div className="bg-[#f5f5f5] rounded-lg p-4">
                                            <p className="text-sm font-medium mb-1">Shipping Address</p>
                                            <p className="text-sm text-[#707072]">{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="px-6 pb-6 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="border-[#ccc] hover:border-[#111] rounded-full px-6 h-10 text-sm"
                                        asChild
                                    >
                                        <Link href={`/account/orders/${order.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                    {order.status === "DELIVERED" && (
                                        <Button
                                            variant="outline"
                                            className="border-[#ccc] hover:border-[#111] rounded-full px-6 h-10 text-sm"
                                            asChild
                                        >
                                            <Link href={`/products/${order.items[0]?.productId || ''}#reviews`}>
                                                Write a Review
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
        PENDING: {
            bg: "bg-[#fef3cd]",
            text: "text-[#856404]",
            icon: <Clock className="w-3 h-3" />
        },
        CONFIRMED: {
            bg: "bg-[#cce5ff]",
            text: "text-[#004085]",
            icon: <CheckCircle className="w-3 h-3" />
        },
        SHIPPED: {
            bg: "bg-[#e2d5f1]",
            text: "text-[#6f42c1]",
            icon: <Truck className="w-3 h-3" />
        },
        DELIVERED: {
            bg: "bg-[#d4edda]",
            text: "text-[#155724]",
            icon: <CheckCircle className="w-3 h-3" />
        },
        CANCELLED: {
            bg: "bg-[#f8d7da]",
            text: "text-[#721c24]",
            icon: null
        },
    };

    const { bg, text, icon } = config[status] || { bg: "bg-[#e5e5e5]", text: "text-[#707072]", icon: null };

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bg} ${text}`}>
            {icon}
            {status}
        </span>
    );
}
