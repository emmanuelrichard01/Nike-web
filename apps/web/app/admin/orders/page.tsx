import { prisma } from "@nike/database";
import { Button } from "@nike/ui";

export const metadata = {
    title: "Orders - Admin",
};

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-display-sm font-bold">Orders</h1>
            </div>

            <div className="bg-background-secondary rounded-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Order ID</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Customer</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Items</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Total</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-background transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm">{order.user?.email || "Guest"}</p>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {order.items.length} item(s)
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-foreground-muted">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <StatusUpdateButtons orderId={order.id} currentStatus={order.status} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="text-center py-12 text-foreground-muted">
                        No orders yet
                    </div>
                )}
            </div>
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

function StatusUpdateButtons({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const nextStatus: Record<string, string> = {
        PENDING: "CONFIRMED",
        CONFIRMED: "SHIPPED",
        SHIPPED: "DELIVERED",
    };

    const next = nextStatus[currentStatus];

    if (!next) return null;

    return (
        <form action={`/api/admin/orders/${orderId}/status`} method="POST">
            <input type="hidden" name="status" value={next} />
            <Button variant="outline" size="sm" type="submit">
                Mark {next.toLowerCase()}
            </Button>
        </form>
    );
}
