import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@nike/ui";
import Link from "next/link";
import { User, Package, MapPin, CreditCard } from "lucide-react";

export const metadata = {
    title: "My Account",
};

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/account");
    }

    const [user, orders] = await Promise.all([
        prisma.user.findUnique({
            where: { email: session.user.email! },
        }),
        prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { items: true },
        }),
    ]);

    return (
        <div className="container-nike py-12">
            <h1 className="text-display-md font-bold mb-8">My Account</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold">
                                    {user?.name?.[0] || "U"}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{user?.name || "User"}</p>
                                    <p className="text-foreground-muted text-sm">{user?.email}</p>
                                </div>
                            </div>
                            {user?.role === "admin" && (
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/admin">Go to Admin</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <nav className="space-y-1">
                        <NavLink href="/account" icon={User} active>Profile</NavLink>
                        <NavLink href="/account/orders" icon={Package}>Orders</NavLink>
                        <NavLink href="/account/addresses" icon={MapPin}>Addresses</NavLink>
                        <NavLink href="/account/payment" icon={CreditCard}>Payment Methods</NavLink>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Account Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-sm text-foreground-muted">Name</label>
                                    <p className="font-medium">{user?.name || "Not set"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-foreground-muted">Email</label>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-foreground-muted">Member Since</label>
                                    <p className="font-medium">
                                        {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/account/orders">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {orders.length === 0 ? (
                                <p className="text-foreground-muted">No orders yet</p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {orders.map((order) => (
                                        <div key={order.id} className="py-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                                <p className="text-sm text-foreground-muted">
                                                    {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                                                <StatusBadge status={order.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function NavLink({
    href,
    icon: Icon,
    children,
    active,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                }`}
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    return (
        <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}
