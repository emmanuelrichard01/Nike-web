import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { Card, CardContent } from "@nike/ui";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

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
        <div className="container-nike py-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/account" className="text-foreground-muted hover:text-foreground">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-display-md font-bold">My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
                        <p className="text-lg font-medium mb-2">No orders yet</p>
                        <p className="text-foreground-muted">
                            When you place orders, they will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <Card key={order.id}>
                            <CardContent className="py-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-sm text-foreground-muted">
                                            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">${Number(order.total).toFixed(2)}</p>
                                        <p className="text-sm text-foreground-muted">{order.items.length} item(s)</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mt-6 pt-6 border-t border-border">
                                    <div className="grid gap-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="h-16 w-16 bg-background-secondary rounded flex items-center justify-center flex-shrink-0">
                                                    <span className="text-2xl">👟</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.productName || "Product"}</p>
                                                    <p className="text-sm text-foreground-muted">
                                                        {item.size && `Size: ${item.size}`}
                                                        {item.size && item.color && " • "}
                                                        {item.color && `Color: ${item.color}`}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${Number(item.price).toFixed(2)}</p>
                                                    <p className="text-sm text-foreground-muted">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <p className="text-sm text-foreground-muted mb-1">Shipping Address</p>
                                        <p className="text-sm">{order.shippingAddress}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    return (
        <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}
