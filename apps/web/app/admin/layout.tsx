import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/admin");
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { role: true },
    }).catch((e) => {
        console.error("Failed to fetch user role:", e);
        return null;
    });

    if (user?.role !== "admin") {
        redirect("/?error=unauthorized");
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-background-secondary">
                <div className="sticky top-0">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <Link href="/admin" className="flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6" />
                            <span className="font-bold text-lg">Admin</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        <NavLink href="/admin" icon={LayoutDashboard}>
                            Dashboard
                        </NavLink>
                        <NavLink href="/admin/products" icon={Package}>
                            Products
                        </NavLink>
                        <NavLink href="/admin/orders" icon={ShoppingCart}>
                            Orders
                        </NavLink>
                        <NavLink href="/admin/users" icon={Users}>
                            Users
                        </NavLink>
                        <NavLink href="/admin/settings" icon={Settings}>
                            Settings
                        </NavLink>
                    </nav>

                    {/* User Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
                                {session.user.name?.[0] || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session.user.name}</p>
                                <p className="text-xs text-foreground-muted truncate">{session.user.email}</p>
                            </div>
                        </div>
                        <Link
                            href="/api/auth/signout"
                            className="flex items-center gap-2 text-sm text-foreground-muted hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <div className="h-16 border-b border-border flex items-center px-8">
                    <Link href="/" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                        ← Back to Store
                    </Link>
                </div>
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background transition-colors"
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    );
}
