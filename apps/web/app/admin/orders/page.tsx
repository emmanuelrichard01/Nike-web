import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import Link from "next/link";
import {
    ShoppingCart,
    ChevronRight,
    Clock,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal
} from "lucide-react";

export const metadata = {
    title: "Orders — Admin | Nike",
};

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const statusCounts = {
        PENDING: orders.filter((o) => o.status === "PENDING").length,
        CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
        SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
        DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    };

    return (
        <div className="space-y-8">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-black">Orders</h1>
                    <p className="text-black/40 font-medium mt-1">
                        Track and manage customer orders.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/[0.06] shadow-sm">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Total Orders:</span>
                        <span className="text-sm font-bold text-black">{orders.length}</span>
                    </div>
                    <Button
                        className="rounded-full bg-black text-white hover:bg-[#CCFF00] hover:text-black font-bold h-10 px-6 text-sm transition-all duration-300"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* ─── Filters & Search ─── */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-black/[0.04] shadow-sm">
                {/* Status Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 w-full xl:w-auto scrollbar-hide">
                    <StatusPill label="All" count={orders.length} active />
                    <StatusPill
                        label="Pending"
                        count={statusCounts.PENDING}
                        color="bg-amber-400"
                    />
                    <StatusPill
                        label="Confirmed"
                        count={statusCounts.CONFIRMED}
                        color="bg-blue-400"
                    />
                    <StatusPill
                        label="Shipped"
                        count={statusCounts.SHIPPED}
                        color="bg-violet-400"
                    />
                    <StatusPill
                        label="Delivered"
                        count={statusCounts.DELIVERED}
                        color="bg-emerald-400"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/[0.03] border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/[0.02] transition-all text-sm font-medium placeholder:text-black/30"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl text-sm font-bold text-black/60 hover:text-black hover:border-black/20 transition-all">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Table ─── */}
            <div className="bg-white rounded-[2rem] border border-black/[0.04] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f9f9f9] border-b border-black/[0.04]">
                            <tr>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Order</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Customer</th>
                                <th className="text-center px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Items</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Total</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Status</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Date</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="group hover:bg-[#F5F5F7] transition-all duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono font-bold text-black group-hover:text-blue-600 transition-colors">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-[10px] font-black text-black/40 shadow-inner">
                                                {order.user?.name?.[0]?.toUpperCase() || "G"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-black truncate">
                                                    {order.user?.name || "Guest Checkout"}
                                                </p>
                                                <p className="text-[11px] text-black/40 truncate">
                                                    {order.user?.email || "No email"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/[0.03] text-xs font-bold text-black/60 border border-black/[0.02]">
                                            {order.items.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black text-black">
                                            ${Number(order.total).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-black/40 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <StatusUpdateButton
                                                orderId={order.id}
                                                currentStatus={order.status}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="py-24 text-center bg-black/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-black/[0.03] flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 text-black/20" />
                        </div>
                        <h3 className="font-bold text-lg text-black">No orders yet</h3>
                        <p className="text-sm text-black/40 mt-1 mb-6 max-w-xs mx-auto">
                            Orders will appear here once customers start purchasing.
                        </p>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="px-6 py-4 border-t border-black/[0.04] bg-[#f9f9f9] flex items-center justify-between">
                        <p className="text-xs font-medium text-black/40">Showing {orders.length} orders</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" disabled>Previous</Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" disabled>Next</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Components ─────────────────────────────────────────────

function StatusPill({
    label,
    count,
    color,
    active,
}: {
    label: string;
    count: number;
    color?: string;
    active?: boolean;
}) {
    return (
        <button
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${active
                ? "bg-black text-white border-black"
                : "bg-white text-black/60 border-black/[0.06] hover:border-black/20 hover:text-black"
                }`}
        >
            {color && <div className={`w-2 h-2 rounded-full ${color} shadow-sm`} />}
            {label}
            <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-black/[0.06] text-black/60"
                    }`}
            >
                {count}
            </span>
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<
        string,
        { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
    > = {
        PENDING: { bg: "bg-amber-500/10", text: "text-amber-700", icon: Clock },
        CONFIRMED: {
            bg: "bg-blue-500/10",
            text: "text-blue-700",
            icon: CheckCircle,
        },
        SHIPPED: { bg: "bg-violet-500/10", text: "text-violet-700", icon: Truck },
        DELIVERED: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-700",
            icon: Package,
        },
        CANCELLED: { bg: "bg-red-500/10", text: "text-red-700", icon: XCircle },
    };

    const { bg, text, icon: Icon } = config[status] || {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: Clock,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${bg} ${text}`}
        >
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
}

function StatusUpdateButton({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const nextStatus: Record<string, { label: string; value: string; color: string }> = {
        PENDING: { label: "Confirm", value: "CONFIRMED", color: "hover:text-blue-600 hover:bg-blue-50" },
        CONFIRMED: { label: "Ship", value: "SHIPPED", color: "hover:text-violet-600 hover:bg-violet-50" },
        SHIPPED: { label: "Deliver", value: "DELIVERED", color: "hover:text-emerald-600 hover:bg-emerald-50" },
    };

    const next = nextStatus[currentStatus];

    if (!next) {
        return (
            <button disabled className="p-2 rounded-lg text-black/20 cursor-not-allowed">
                <CheckCircle className="w-4 h-4" />
            </button>
        );
    }

    return (
        <form
            action={`/api/admin/orders/${orderId}/status`}
            method="POST"
        >
            <input type="hidden" name="status" value={next.value} />
            <button
                type="submit"
                className={`text-[11px] font-bold text-black/50 bg-black/[0.04] px-3 py-1.5 rounded-lg transition-all ${next.color}`}
            >
                Mark {next.label}
            </button>
        </form>
    );
}
