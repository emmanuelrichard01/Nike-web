import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import Link from "next/link";
import { ArrowLeft, Bell, Shield, Eye, Trash2 } from "lucide-react";
import { Button } from "@nike/ui";

export const metadata = { title: "Settings | Nike" };

export default async function AccountSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin?callbackUrl=/account/settings");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { name: true, email: true },
    });

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="container-nike py-8 md:py-12 max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/account"
                        className="w-10 h-10 rounded-full bg-white hover:bg-[#e5e5e5] flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                </div>

                <div className="space-y-4">
                    {/* Notifications */}
                    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center gap-3">
                            <Bell className="w-4 h-4 text-black/40" />
                            <h2 className="font-semibold">Notifications</h2>
                        </div>
                        <div className="divide-y divide-black/5">
                            <ToggleRow label="Order updates" description="Get notified about your order status" defaultOn />
                            <ToggleRow label="Promotions" description="Receive emails about sales and new arrivals" />
                            <ToggleRow label="Product recommendations" description="Personalized product suggestions" />
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center gap-3">
                            <Eye className="w-4 h-4 text-black/40" />
                            <h2 className="font-semibold">Privacy</h2>
                        </div>
                        <div className="divide-y divide-black/5">
                            <ToggleRow label="Profile visibility" description="Allow other members to see your profile" />
                            <ToggleRow label="Activity sharing" description="Share your reviews and wishlist activity" />
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center gap-3">
                            <Shield className="w-4 h-4 text-black/40" />
                            <h2 className="font-semibold">Security</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Change Password</p>
                                    <p className="text-xs text-black/40">Update your account password</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
                                    <Link href="/auth/forgot-password">Update</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
                            <Trash2 className="w-4 h-4 text-red-400" />
                            <h2 className="font-semibold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Delete Account</p>
                                    <p className="text-xs text-black/40">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full text-xs border-red-200 text-red-500 hover:bg-red-50">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    defaultOn = false,
}: {
    label: string;
    description: string;
    defaultOn?: boolean;
}) {
    return (
        <div className="px-6 py-4 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-black/40">{description}</p>
            </div>
            <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${defaultOn ? "bg-black" : "bg-black/10"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${defaultOn ? "right-1" : "left-1"}`} />
            </div>
        </div>
    );
}
