import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import Link from "next/link";
import { User, Package, MapPin, CreditCard, LogOut, CheckCircle, Truck, Clock, Heart, ChevronRight, Settings, ShieldCheck, Gift } from "lucide-react";

export const metadata = {
    title: "My Account | Nike",
};

export default async function AccountPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/account");
    }

    const [user, orders, wishlistCount] = await Promise.all([
        prisma.user.findUnique({
            where: { email: session.user.email! },
        }),
        prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { items: true },
        }),
        prisma.wishlistItem.count({
            where: { wishlist: { userId: session.user.id } },
        }),
    ]);

    const memberSince = new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="bg-white border-b border-black/5">
                <div className="container-nike py-10 md:py-14">
                    <div className="flex items-center gap-2 text-sm text-black/40 mb-6">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-black font-medium">Account</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl md:text-4xl font-black relative">
                            {user?.name?.[0]?.toUpperCase() || "N"}
                            {/* Online indicator */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#c0ff00] rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black">
                                {user?.name || "Nike Member"}
                            </h1>
                            <p className="text-black/40 mt-1">
                                Member since {memberSince}
                            </p>
                            {user?.role === "admin" && (
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-[#c0ff00] bg-black px-3 py-1 rounded-full"
                                >
                                    <ShieldCheck className="w-3 h-3" />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-nike py-10 md:py-14">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-black/5 p-2 sticky top-24">
                            <nav className="space-y-1">
                                <NavLink href="/account" icon={User} active>Profile</NavLink>
                                <NavLink href="/account/orders" icon={Package}>
                                    Orders
                                    {orders.length > 0 && (
                                        <span className="ml-auto text-xs bg-black text-white px-2 py-0.5 rounded-full">
                                            {orders.length}
                                        </span>
                                    )}
                                </NavLink>
                                <NavLink href="/wishlist" icon={Heart}>
                                    Favorites
                                    {wishlistCount > 0 && (
                                        <span className="ml-auto text-xs bg-[#ff4d4d] text-white px-2 py-0.5 rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </NavLink>
                                <NavLink href="/account/addresses" icon={MapPin}>Addresses</NavLink>
                                <NavLink href="/account/payment" icon={CreditCard}>Payment</NavLink>
                                <NavLink href="/account/settings" icon={Settings}>Settings</NavLink>

                                <div className="pt-2 mt-2 border-t border-black/5">
                                    <button className="flex items-center gap-3 px-4 py-3 text-black/30 hover:text-red-500 transition-colors w-full rounded-xl hover:bg-red-50">
                                        <LogOut className="h-5 w-5" />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Quick Stats - Liquid Glass Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                                icon={Package}
                                label="Orders"
                                value={orders.length.toString()}
                                href="/account/orders"
                            />
                            <StatCard
                                icon={Heart}
                                label="Favorites"
                                value={wishlistCount.toString()}
                                href="/wishlist"
                                accent
                            />
                            <StatCard
                                icon={Gift}
                                label="Rewards"
                                value="0"
                                href="/rewards"
                            />
                            <StatCard
                                icon={MapPin}
                                label="Addresses"
                                value="1"
                                href="/account/addresses"
                            />
                        </div>

                        {/* Account Details */}
                        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                            <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-black">Account Details</h2>
                                <Button variant="ghost" size="sm" className="text-sm font-semibold">
                                    Edit
                                </Button>
                            </div>
                            <div className="p-6 grid gap-6 sm:grid-cols-2">
                                <InfoField label="Full Name" value={user?.name || "Not provided"} />
                                <InfoField label="Email" value={user?.email || ""} />
                                <InfoField label="Member Since" value={memberSince} />
                                <InfoField label="Location" value="United States" />
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                            <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-black">Recent Orders</h2>
                                <Link
                                    href="/account/orders"
                                    className="text-sm font-semibold hover:underline flex items-center gap-1 text-black/60"
                                >
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-black/5">
                                {orders.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black/5 flex items-center justify-center">
                                            <Package className="w-7 h-7 text-black/20" />
                                        </div>
                                        <p className="font-semibold mb-1 text-black">No orders yet</p>
                                        <p className="text-black/40 text-sm mb-4">Start shopping to see your orders here</p>
                                        <Button asChild className="rounded-full bg-black text-white hover:bg-black/80">
                                            <Link href="/products">Shop Now</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/account/orders/${order.id}`}
                                            className="p-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#f5f5f5] flex items-center justify-center">
                                                    <StatusIcon status={order.status} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <p className="text-sm text-black/40">
                                                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} Item{order.items.length !== 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-black">${Number(order.total).toFixed(2)}</span>
                                                <ChevronRight className="w-5 h-5 text-black/20" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active
                ? "bg-black text-white"
                : "text-black/50 hover:bg-black/5 hover:text-black"
                }`}
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    href,
    accent
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href: string;
    accent?: boolean;
}) {
    return (
        <Link
            href={href}
            className="bg-white rounded-2xl border border-black/5 p-5 hover:border-black/10 hover:shadow-lg transition-all duration-300 group relative overflow-hidden shimmer"
        >
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${accent ? "bg-[#ff4d4d]/10" : "bg-black/5"
                }`}>
                <Icon className={`w-5 h-5 ${accent ? "text-[#ff4d4d]" : "text-black/40"}`} />
            </div>
            <p className="text-2xl font-black text-black">{value}</p>
            <p className="text-sm text-black/40">{label}</p>
        </Link>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-black/30 block mb-1">
                {label}
            </label>
            <p className="font-medium text-black">{value}</p>
        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "DELIVERED":
            return <CheckCircle className="h-5 w-5 text-[#00a843]" />;
        case "SHIPPED":
            return <Truck className="h-5 w-5 text-[#6366f1]" />;
        case "CONFIRMED":
            return <CheckCircle className="h-5 w-5 text-[#0ea5e9]" />;
        default:
            return <Clock className="h-5 w-5 text-[#f59e0b]" />;
    }
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string }> = {
        PENDING: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
        CONFIRMED: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
        SHIPPED: { bg: "bg-[#e0e7ff]", text: "text-[#4338ca]" },
        DELIVERED: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
        CANCELLED: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
    };

    const { bg, text } = config[status] || { bg: "bg-black/5", text: "text-black/50" };

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${bg} ${text}`}>
            {status}
        </span>
    );
}
