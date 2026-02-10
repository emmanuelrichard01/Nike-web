import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import {
    Search,
    Filter,
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
        <div className="space-y-8">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-black">Customers</h1>
                    <p className="text-black/40 font-medium mt-1">
                        Manage user accounts and permissions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/[0.06] shadow-sm">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Total Customers:</span>
                        <span className="text-sm font-bold text-black">{users.length}</span>
                    </div>
                    <Button
                        className="rounded-full bg-black text-white hover:bg-[#CCFF00] hover:text-black font-bold h-10 px-6 text-sm transition-all duration-300"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* ─── Filters & Search ─── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-black/[0.04] shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/[0.03] border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/[0.02] transition-all text-sm font-medium placeholder:text-black/30"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl text-sm font-bold text-black/60 hover:text-black hover:border-black/20 transition-all">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl text-sm font-bold text-black/60 hover:text-black hover:border-black/20 transition-all">
                        <Shield className="w-4 h-4" />
                        Roles
                    </button>
                </div>
            </div>

            {/* ─── Table ─── */}
            <div className="bg-white rounded-[2rem] border border-black/[0.04] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f9f9f9] border-b border-black/[0.04]">
                            <tr>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">User</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Role</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Orders</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Joined</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group hover:bg-[#F5F5F7] transition-all duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-xs font-black text-black/40 shadow-inner">
                                                {user.name?.[0]?.toUpperCase() || <User className="w-5 h-5 opacity-50" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-black truncate">
                                                    {user.name || "Anonymous"}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-black/40 truncate mt-0.5">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email || "No email"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${user.role === "admin"
                                            ? "bg-black text-white"
                                            : "bg-black/[0.04] text-black/60"
                                            }`}>
                                            {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-lg bg-black/[0.03] text-xs font-bold text-black/60 border border-black/[0.02]">
                                                {user._count.orders}
                                            </span>
                                            <span className="text-[11px] text-black/30 font-medium">orders</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-black/40 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button className="p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors">
                                                <ShoppingBag className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="py-24 text-center bg-black/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-black/[0.03] flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-black/20" />
                        </div>
                        <h3 className="font-bold text-lg text-black">No customers found</h3>
                        <p className="text-sm text-black/40 mt-1 mb-6 max-w-xs mx-auto">
                            Customer accounts will appear here once they sign up.
                        </p>
                    </div>
                )}

                {users.length > 0 && (
                    <div className="px-6 py-4 border-t border-black/[0.04] bg-[#f9f9f9] flex items-center justify-between">
                        <p className="text-xs font-medium text-black/40">Showing {users.length} users</p>
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
