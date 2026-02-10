import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    ExternalLink,
    ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/admin");
    }

    const user = await prisma.user
        .findUnique({
            where: { email: session.user.email! },
            select: { role: true, name: true },
        })
        .catch((e) => {
            console.error("Failed to fetch user role:", e);
            return null;
        });

    if (user?.role !== "admin") {
        redirect("/?error=unauthorized");
    }

    return (
        <div className="flex min-h-screen bg-[#f5f5f5]">
            {/* ─── Sidebar ─── */}
            <aside className="w-[260px] bg-[#111] text-white flex flex-col fixed inset-y-0 left-0 z-30">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
                    <Link href="/admin" className="flex items-center gap-3">
                        <svg className="h-5 w-auto" viewBox="0 0 69 32" fill="white">
                            <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.12 2.96-.24 5.36 .56 1.52 1.76 2.08 1.2.56 3.2.56 2.72 0 11.2-4.64L68.56 4z" />
                        </svg>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-wide">ADMIN</span>
                            <span className="text-[10px] font-bold bg-[#c0ff00] text-black px-1.5 py-0.5 rounded-md leading-none">
                                PRO
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mb-2">
                        Overview
                    </p>
                    <NavLink href="/admin" icon={LayoutDashboard}>
                        Dashboard
                    </NavLink>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mt-6 mb-2">
                        Manage
                    </p>
                    <NavLink href="/admin/products" icon={Package}>
                        Products
                    </NavLink>
                    <NavLink href="/admin/orders" icon={ShoppingCart}>
                        Orders
                    </NavLink>
                    <NavLink href="/admin/users" icon={Users}>
                        Customers
                    </NavLink>

                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-3 mt-6 mb-2">
                        System
                    </p>
                    <NavLink href="/admin/settings" icon={Settings}>
                        Settings
                    </NavLink>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c0ff00] to-[#00d4ff] flex items-center justify-center text-black text-sm font-black">
                            {session.user.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {session.user.name || "Admin"}
                            </p>
                            <p className="text-[11px] text-white/30 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg py-2 transition-all"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Store
                        </Link>
                        <Link
                            href="/api/auth/signout"
                            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/40 hover:text-red-400 bg-white/[0.04] hover:bg-red-500/10 rounded-lg py-2 transition-all"
                        >
                            <LogOut className="w-3 h-3" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 ml-[260px]">
                {/* Top Bar */}
                <div className="h-16 bg-white border-b border-black/[0.04] flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-sm">
                        <Link
                            href="/admin"
                            className="text-black/30 hover:text-black transition-colors"
                        >
                            Admin
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-black/15" />
                        <span className="text-black font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
                        <span className="text-xs text-black/40">System Online</span>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

function NavLink({
    href,
    icon: Icon,
    children,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all group text-[13px] font-medium"
        >
            <Icon className="h-[18px] w-[18px] group-hover:text-[#c0ff00] transition-colors" />
            {children}
        </Link>
    );
}
