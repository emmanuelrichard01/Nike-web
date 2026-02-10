import { prisma } from "@nike/database";
import Link from "next/link";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ChevronRight,
    Clock,
    CheckCircle,
    Truck,
    Star,
} from "lucide-react";

export const metadata = {
    title: "Dashboard — Admin | Nike",
};

export default async function AdminDashboard() {
    const [productCount, orderCount, userCount, reviewCount, recentOrders] =
        await Promise.all([
            prisma.product.count().catch(() => 0),
            prisma.order.count().catch(() => 0),
            prisma.user.count().catch(() => 0),
            prisma.review.count().catch(() => 0),
            prisma.order
                .findMany({
                    take: 6,
                    orderBy: { createdAt: "desc" },
                    include: { user: true, items: true },
                })
                .catch(() => []),
        ]);

    const orders = await prisma.order
        .findMany({ select: { total: true } })
        .catch(() => []);
    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
    );

    const stats = [
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            change: "+12.5%",
        },
        {
            title: "Products",
            value: productCount.toLocaleString(),
            icon: Package,
            gradient: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
            change: `${productCount} active`,
        },
        {
            title: "Orders",
            value: orderCount.toLocaleString(),
            icon: ShoppingCart,
            gradient: "from-orange-500 to-amber-600",
            bg: "bg-orange-50",
            text: "text-orange-600",
            change: `${recentOrders.length} recent`,
        },
        {
            title: "Customers",
            value: userCount.toLocaleString(),
            icon: Users,
            gradient: "from-violet-500 to-purple-600",
            bg: "bg-violet-50",
            text: "text-violet-600",
            change: `${reviewCount} reviews`,
        },
    ];

    return (
        <div className="max-w-7xl">
            {/* ─── Header ─── */}
            <div className="mb-8">
                <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
                <p className="text-sm text-black/40 mt-1">
                    Here's what's happening with your store today
                </p>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white rounded-2xl border border-black/[0.04] p-5 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-black/10`}
                            >
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <span
                                className={`text-[11px] font-bold ${stat.bg} ${stat.text} px-2.5 py-1 rounded-full`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                        <p className="text-xs text-black/35 mt-1 font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* ─── Content Grid ─── */}
            <div className="grid xl:grid-cols-3 gap-6">
                {/* ─── Recent Orders ─── */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-sm">Recent Orders</h2>
                            <p className="text-[11px] text-black/30 mt-0.5">
                                Latest {recentOrders.length} orders
                            </p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-xs font-semibold text-black/40 hover:text-black flex items-center gap-1 transition-colors"
                        >
                            View All
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingCart className="w-8 h-8 text-black/10 mx-auto mb-3" />
                            <p className="text-sm text-black/30">No orders yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-black/[0.03]">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="px-6 py-3.5 flex items-center justify-between hover:bg-black/[0.01] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center text-xs font-bold text-black/40">
                                            {order.user?.name?.[0]?.toUpperCase() || "G"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {order.user?.name || order.user?.email || "Guest"}
                                            </p>
                                            <p className="text-[11px] text-black/30">
                                                {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                                                {timeAgo(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusDot status={order.status} />
                                        <span className="text-sm font-bold">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Quick Actions ─── */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-black/[0.04] p-5">
                        <h3 className="font-bold text-sm mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <QuickAction
                                href="/admin/products"
                                icon={Package}
                                label="Manage Products"
                                description={`${productCount} products in catalog`}
                            />
                            <QuickAction
                                href="/admin/orders"
                                icon={ShoppingCart}
                                label="Process Orders"
                                description={`${orderCount} total orders`}
                            />
                            <QuickAction
                                href="/admin/users"
                                icon={Users}
                                label="View Customers"
                                description={`${userCount} registered users`}
                            />
                            <QuickAction
                                href="/admin/settings"
                                icon={Star}
                                label="Store Settings"
                                description="Configure your store"
                            />
                        </div>
                    </div>

                    {/* ─── Status Summary ─── */}
                    <div className="bg-gradient-to-br from-[#111] to-[#222] rounded-2xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-[#c0ff00]" />
                            <h3 className="font-bold text-sm">Store Health</h3>
                        </div>
                        <div className="space-y-3">
                            <HealthRow label="Products" value={`${productCount} active`} good />
                            <HealthRow label="Orders" value={`${orderCount} total`} good />
                            <HealthRow
                                label="Reviews"
                                value={`${reviewCount} reviews`}
                                good={reviewCount > 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Helper Components ──────────────────────────────────────

function StatusDot({ status }: { status: string }) {
    const config: Record<string, { color: string; label: string }> = {
        PENDING: { color: "bg-amber-400", label: "Pending" },
        CONFIRMED: { color: "bg-blue-400", label: "Confirmed" },
        SHIPPED: { color: "bg-violet-400", label: "Shipped" },
        DELIVERED: { color: "bg-emerald-400", label: "Delivered" },
        CANCELLED: { color: "bg-red-400", label: "Cancelled" },
    };

    const { color, label } = config[status] || {
        color: "bg-gray-400",
        label: status,
    };

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
            <span className="text-[11px] text-black/40 font-medium">{label}</span>
        </div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    description,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.02] transition-all group"
        >
            <div className="w-9 h-9 rounded-lg bg-black/[0.04] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[11px] text-black/30">{description}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/15 group-hover:text-black transition-colors" />
        </Link>
    );
}

function HealthRow({
    label,
    value,
    good,
}: {
    label: string;
    value: string;
    good: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">{label}</span>
            <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white/70">{value}</span>
                <div
                    className={`w-1.5 h-1.5 rounded-full ${good ? "bg-[#c0ff00]" : "bg-white/20"}`}
                />
            </div>
        </div>
    );
}

function timeAgo(date: Date): string {
    const seconds = Math.floor(
        (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}
