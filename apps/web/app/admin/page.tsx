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
    ArrowRight
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
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Active Products",
            value: productCount.toLocaleString(),
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "+4 new",
            trendUp: true
        },
        {
            title: "Total Orders",
            value: orderCount.toLocaleString(),
            icon: ShoppingCart,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            trend: "+8.2%",
            trendUp: true
        },
        {
            title: "Customers",
            value: userCount.toLocaleString(),
            icon: Users,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
            trend: "+2.4%",
            trendUp: true
        },
    ];

    return (
        <div className="space-y-8">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-black">Dashboard</h1>
                    <p className="text-black/40 font-medium mt-1">
                        Overview of your store's performance today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-black/30 bg-black/[0.03] px-3 py-1.5 rounded-full">
                        Last updated: Just now
                    </span>
                </div>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="group relative overflow-hidden bg-white rounded-[2rem] p-6 border border-black/[0.04] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-black/5`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-4xl font-black tracking-tighter text-black mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm font-semibold text-black/40">{stat.title}</p>
                        </div>
                        {/* Decorative background blur */}
                        <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                    </div>
                ))}
            </div>

            {/* ─── Content Grid ─── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* ─── Recent Orders ─── */}
                <div className="xl:col-span-2 bg-white rounded-[2rem] border border-black/[0.04] p-1 shadow-sm">
                    <div className="p-6 flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Recent Orders</h2>
                            <p className="text-sm text-black/40 font-medium">Latest transaction activity</p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-sm font-bold text-black border border-black/10 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all flex items-center gap-2"
                        >
                            View All
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.04]">
                        {recentOrders.length === 0 ? (
                            <div className="p-16 text-center bg-black/[0.01]">
                                <ShoppingCart className="w-12 h-12 text-black/10 mx-auto mb-4" />
                                <p className="text-black/40 font-medium">No recent orders found</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-black/[0.02] border-b border-black/[0.04]">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-[11px] font-bold text-black/40 uppercase tracking-widest">Order</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-bold text-black/40 uppercase tracking-widest">Customer</th>
                                        <th className="text-left px-6 py-4 text-[11px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                                        <th className="text-right px-6 py-4 text-[11px] font-bold text-black/40 uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[0.04]">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-black/[0.01] transition-colors cursor-default">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-black group-hover:text-blue-600 transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className="text-[11px] text-black/30 font-medium">{timeAgo(order.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-[10px] font-black text-black/40">
                                                        {order.user?.name?.[0]?.toUpperCase() || "G"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-black/80">{order.user?.name || "Guest User"}</p>
                                                        <p className="text-[11px] text-black/30 truncate max-w-[120px]">{order.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusDot status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-sm text-black">
                                                    ${Number(order.total).toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ─── Side Column ─── */}
                <div className="space-y-6">
                    {/* Action Center */}
                    <div className="bg-white rounded-[2rem] border border-black/[0.04] p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-[#CCFF00] rounded-full" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <QuickAction
                                href="/admin/products"
                                icon={Package}
                                label="Add Product"
                                description="Update catalog"
                            />
                            <QuickAction
                                href="/admin/orders"
                                icon={Truck}
                                label="Ship Orders"
                                description="Process pending"
                            />
                            <QuickAction
                                href="/admin/users"
                                icon={Users}
                                label="Manage Users"
                                description="View database"
                            />
                            <QuickAction
                                href="/admin/settings"
                                icon={Star}
                                label="Store Settings"
                                description="Configuration"
                            />
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-[#111] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-lg">System Health</h3>
                                <div className="p-2 bg-white/10 rounded-full animate-pulse">
                                    <div className="w-2 h-2 bg-[#CCFF00] rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <HealthRow label="Server Status" value="Operational" good />
                                <HealthRow label="Database" value="Connected" good />
                                <HealthRow label="Last Backup" value="2 hours ago" good />
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center text-xs font-medium text-white/50 mb-2">
                                        <span>CPU Usage</span>
                                        <span>12%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[12%] h-full bg-[#CCFF00] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00] blur-[100px] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 blur-[80px] opacity-20 rounded-full -translate-x-1/3 translate-y-1/3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Helper Components ──────────────────────────────────────

function StatusDot({ status }: { status: string }) {
    const config: Record<string, { color: string; bg: string; label: string }> = {
        PENDING: { color: "text-amber-600", bg: "bg-amber-400/20", label: "Pending" },
        CONFIRMED: { color: "text-blue-600", bg: "bg-blue-400/20", label: "Confirmed" },
        SHIPPED: { color: "text-violet-600", bg: "bg-violet-400/20", label: "Shipped" },
        DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-400/20", label: "Delivered" },
        CANCELLED: { color: "text-red-600", bg: "bg-red-400/20", label: "Cancelled" },
    };

    const style = config[status] || {
        color: "text-gray-600",
        bg: "bg-gray-400/20",
        label: status,
    };

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${style.bg} border border-${style.color.split('-')[1]}-200/50`}>
            <span className={`text-[11px] font-bold ${style.color}`}>{style.label}</span>
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
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/[0.03] transition-all group border border-transparent hover:border-black/[0.04]"
        >
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black">{label}</p>
                <p className="text-[11px] font-medium text-black/40">{description}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/20 group-hover:text-black transition-colors" />
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
            <span className="text-sm text-white/60 font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <div
                    className={`w-1.5 h-1.5 rounded-full ${good ? "bg-[#CCFF00]" : "bg-red-500"}`}
                />
                <span className={`text-xs font-bold ${good ? "text-white" : "text-red-300"}`}>{value}</span>
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
