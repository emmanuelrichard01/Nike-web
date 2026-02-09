import { prisma } from "@nike/database";
import { Card, CardHeader, CardTitle, CardContent } from "@nike/ui";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export const metadata = {
    title: "Admin Dashboard",
};

export default async function AdminDashboard() {
    const [productCount, orderCount, userCount, recentOrders] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true },
        }),
    ]);

    // Calculate revenue (sum of all orders)
    const orders = await prisma.order.findMany({
        select: { total: true },
    });
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    return (
        <div>
            <h1 className="text-display-sm font-bold mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    color="text-green-500"
                />
                <StatCard
                    title="Products"
                    value={productCount.toString()}
                    icon={Package}
                    color="text-blue-500"
                />
                <StatCard
                    title="Orders"
                    value={orderCount.toString()}
                    icon={ShoppingCart}
                    color="text-orange-500"
                />
                <StatCard
                    title="Users"
                    value={userCount.toString()}
                    icon={Users}
                    color="text-purple-500"
                />
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <p className="text-foreground-muted">No orders yet</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{order.id.slice(0, 8)}...</p>
                                        <p className="text-sm text-foreground-muted">
                                            {order.user?.email || "Guest"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-foreground-muted">{title}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-background-secondary flex items-center justify-center ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
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
