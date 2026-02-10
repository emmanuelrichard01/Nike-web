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
    Search,
    Bell,
    Menu
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
        <div className="flex min-h-screen bg-[#F5F5F7] font-sans selection:bg-[#CCFF00] selection:text-black">
            {/* ─── Sidebar ─── */}
            <aside className="hidden lg:flex w-[280px] bg-[#111111] text-white flex-col fixed inset-y-0 left-0 z-50 border-r border-[#333]">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-white/[0.08]">
                    <Link href="/admin" className="flex items-center gap-4 group">
                        <svg className="h-6 w-auto transition-transform duration-300 group-hover:scale-110" viewBox="0 0 69 32" fill="white">
                            <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.12 2.96-.24 5.36 .56 1.52 1.76 2.08 1.2.56 3.2.56 2.72 0 11.2-4.64L68.56 4z" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tight leading-none">ADMIN</span>
                            <span className="text-[10px] font-bold text-[#CCFF00] tracking-widest uppercase">Workspace</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
                            Main Menu
                        </p>
                    </div>
                    <NavLink href="/admin" icon={LayoutDashboard}>
                        Dashboard
                    </NavLink>

                    <div className="mt-8 mb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
                            Management
                        </p>
                    </div>
                    <NavLink href="/admin/products" icon={Package}>
                        Products Catalog
                    </NavLink>
                    <NavLink href="/admin/orders" icon={ShoppingCart}>
                        Orders & Sales
                    </NavLink>
                    <NavLink href="/admin/users" icon={Users}>
                        Customers
                    </NavLink>

                    <div className="mt-8 mb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
                            Configuration
                        </p>
                    </div>
                    <NavLink href="/admin/settings" icon={Settings}>
                        Settings
                    </NavLink>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/[0.08] bg-[#1a1a1a]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#9eff00] flex items-center justify-center text-black text-sm font-black ring-2 ring-white/10">
                                {session.user.name?.[0]?.toUpperCase() || "A"}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                                {session.user.name || "Administrator"}
                            </p>
                            <p className="text-[11px] text-white/40 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg py-2.5 transition-all duration-200 group"
                        >
                            <ExternalLink className="w-3 h-3 transition-transform group-hover:scale-110" />
                            Store
                        </Link>
                        <Link
                            href="/api/auth/signout"
                            className="flex items-center justify-center gap-2 text-[11px] font-bold text-white/60 hover:text-[#ff4d4d] bg-white/[0.05] hover:bg-[#ff4d4d]/10 rounded-lg py-2.5 transition-all duration-200 group"
                        >
                            <LogOut className="w-3 h-3 transition-transform group-hover:scale-110" />
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ─── Main Content Wrapper ─── */}
            <main className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] sticky top-0 z-30 px-8 flex items-center justify-between transition-all duration-300">
                    {/* Left: Search & Breadcrumbs */}
                    <div className="flex items-center gap-6 flex-1">
                        <button className="lg:hidden p-2 -ml-2 text-black/60">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex items-center gap-2 text-sm text-black/40 font-medium">
                            <span className="text-black/20">Nike Admin</span>
                            <ChevronRight className="w-3.5 h-3.5 text-black/20" />
                            <span className="text-black bg-black/[0.03] px-2 py-0.5 rounded-md">Dashboard</span>
                        </div>

                        <div className="relative max-w-md w-full hidden md:block ml-4">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full h-10 pl-10 pr-4 rounded-full bg-black/[0.03] border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/[0.02] transition-all text-sm font-medium placeholder:text-black/30"
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors text-black/60 hover:text-black">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#CCFF00] border border-white rounded-full"></span>
                        </button>
                        <div className="h-6 w-px bg-black/[0.06] mx-1"></div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.04]">
                            <div className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
                            <span className="text-xs font-bold text-black/60">System Online</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full animate-fade-in">
                    {children}
                </div>
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
            className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group relative overflow-hidden"
        >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#CCFF00] rounded-r-full group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <Icon className="h-5 w-5 group-hover:text-[#CCFF00] transition-colors duration-300" />
            <span className="text-sm font-medium tracking-wide">{children}</span>
        </Link>
    );
}
