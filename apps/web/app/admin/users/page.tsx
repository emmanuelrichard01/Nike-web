import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import { User, Shield, ShieldCheck, Mail, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin?callbackUrl=/admin/users");

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
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-sm text-black/50 mt-1">{users.length} registered users</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/5 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4">Reviews</th>
                            <th className="px-6 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-black/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                            {user.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name || "No name"}</p>
                                            <p className="text-xs text-black/40">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "admin"
                                            ? "bg-black text-white"
                                            : "bg-black/5 text-black/60"
                                        }`}>
                                        {user.role === "admin" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-black/60">{user._count.orders}</td>
                                <td className="px-6 py-4 text-sm text-black/60">{user._count.reviews}</td>
                                <td className="px-6 py-4 text-sm text-black/40">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
