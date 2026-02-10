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
        <div className="max-w-7xl">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Orders</h1>
                    <p className="text-sm text-black/40 mt-1">
                        {orders.length} total orders
                    </p>
                </div>
            </div>

            {/* ─── Status Filter Bar ─── */}
            <div className="flex gap-3 mb-6">
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

            {/* ─── Table ─── */}
            <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/[0.04]">
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Order
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Customer
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Items
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Total
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Status
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Date
                            </th>
                            <th className="text-right px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-black/[0.01] transition-colors"
                            >
                                <td className="px-6 py-3.5">
                                    <span className="text-sm font-mono font-bold text-black/70">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center text-[11px] font-bold text-black/40 flex-shrink-0">
                                            {order.user?.name?.[0]?.toUpperCase() || "G"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {order.user?.name || "Guest"}
                                            </p>
                                            <p className="text-[11px] text-black/30 truncate">
                                                {order.user?.email || "No email"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-sm text-black/50">
                                    {order.items.length}{" "}
                                    item{order.items.length !== 1 ? "s" : ""}
                                </td>
                                <td className="px-6 py-3.5 text-sm font-bold">
                                    ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-3.5">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-3.5 text-sm text-black/35">
                                    {new Date(order.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </td>
                                <td className="px-6 py-3.5">
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

                {orders.length === 0 && (
                    <div className="py-16 text-center">
                        <ShoppingCart className="w-10 h-10 text-black/10 mx-auto mb-3" />
                        <p className="font-semibold text-sm text-black/40">
                            No orders yet
                        </p>
                        <p className="text-xs text-black/25 mt-1">
                            Orders will appear here when customers check out
                        </p>
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${active
                    ? "bg-black text-white"
                    : "bg-white border border-black/[0.06] text-black/50 hover:border-black/15"
                }`}
        >
            {color && <div className={`w-1.5 h-1.5 rounded-full ${color}`} />}
            {label}
            <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${active ? "bg-white/20" : "bg-black/[0.04]"
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
        PENDING: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
        CONFIRMED: {
            bg: "bg-blue-50",
            text: "text-blue-600",
            icon: CheckCircle,
        },
        SHIPPED: { bg: "bg-violet-50", text: "text-violet-600", icon: Truck },
        DELIVERED: {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            icon: Package,
        },
        CANCELLED: { bg: "bg-red-50", text: "text-red-600", icon: XCircle },
    };

    const { bg, text, icon: Icon } = config[status] || {
        bg: "bg-gray-50",
        text: "text-gray-600",
        icon: Clock,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${bg} ${text}`}
        >
            <Icon className="w-3 h-3" />
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
    const nextStatus: Record<string, { label: string; value: string }> = {
        PENDING: { label: "Confirm", value: "CONFIRMED" },
        CONFIRMED: { label: "Ship", value: "SHIPPED" },
        SHIPPED: { label: "Deliver", value: "DELIVERED" },
    };

    const next = nextStatus[currentStatus];

    if (!next) {
        return (
            <span className="text-[11px] text-black/20 font-medium">
                Completed
            </span>
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
                className="text-[11px] font-bold text-black/50 hover:text-black bg-black/[0.03] hover:bg-black/[0.06] px-3 py-1.5 rounded-lg transition-all"
            >
                Mark {next.label}
            </button>
        </form>
    );
}
