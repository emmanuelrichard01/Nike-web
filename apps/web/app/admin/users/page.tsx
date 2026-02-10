import { prisma } from "@nike/database";
import {
    Search,
    User,
    Shield,
    ShieldCheck,
    Mail,
    Calendar,
    MoreHorizontal,
    ShoppingBag,
    Star
} from "lucide-react";

export const metadata = {
    title: "Customers — Admin | Nike",
};

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { orders: true, reviews: true } },
        },
    });

    return (
        <div className="max-w-7xl">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Customers</h1>
                    <p className="text-sm text-black/40 mt-1">
                        {users.length} registered users
                    </p>
                </div>

                {/* Search (Visual Only) */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="h-10 pl-9 pr-4 rounded-xl border border-black/[0.08] text-sm bg-white focus:outline-none focus:border-black/20 focus:ring-2 focus:ring-black/[0.03] transition-all w-64"
                    />
                </div>
            </div>

            {/* ─── Table ─── */}
            <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/[0.04]">
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">User</th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">Role</th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">Activity</th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">Joined</th>
                            <th className="text-right px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-black/[0.01] transition-colors group">
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black/[0.05] to-black/[0.1] flex items-center justify-center text-sm font-bold text-black/50">
                                            {user.name?.[0]?.toUpperCase() || <User className="w-5 h-5 opacity-50" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-black/90">{user.name || "No name"}</p>
                                            <div className="flex items-center gap-1.5 text-[11px] text-black/40">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5">
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${user.role === "admin"
                                            ? "bg-black text-white"
                                            : "bg-black/[0.04] text-black/60"
                                        }`}>
                                        {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5" title="Orders">
                                            <ShoppingBag className="w-3.5 h-3.5 text-black/30" />
                                            <span className="text-sm font-medium">{user._count.orders}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="Reviews">
                                            <Star className="w-3.5 h-3.5 text-black/30" />
                                            <span className="text-sm font-medium">{user._count.reviews}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-sm text-black/40">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <button className="p-2 rounded-lg hover:bg-black/[0.05] text-black/20 hover:text-black transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="py-16 text-center">
                        <User className="w-10 h-10 text-black/10 mx-auto mb-3" />
                        <p className="font-bold text-sm text-black/40">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
