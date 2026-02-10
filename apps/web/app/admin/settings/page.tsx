import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Settings, Globe, Bell, Palette, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin?callbackUrl=/admin/settings");

    const settingsGroups = [
        {
            icon: Globe,
            title: "General",
            description: "Store name, currency, and regional settings",
            items: [
                { label: "Store Name", value: "Nike Store" },
                { label: "Currency", value: "USD ($)" },
                { label: "Timezone", value: "America/New_York" },
            ],
        },
        {
            icon: Bell,
            title: "Notifications",
            description: "Email alerts and notification preferences",
            items: [
                { label: "Order Confirmations", value: "Enabled" },
                { label: "Low Stock Alerts", value: "Disabled" },
                { label: "New User Notifications", value: "Enabled" },
            ],
        },
        {
            icon: Palette,
            title: "Appearance",
            description: "Theme, colors, and branding",
            items: [
                { label: "Theme", value: "Light" },
                { label: "Primary Color", value: "#000000" },
                { label: "Logo", value: "Nike Swoosh" },
            ],
        },
        {
            icon: Database,
            title: "Data",
            description: "Database and storage configuration",
            items: [
                { label: "Database", value: "PostgreSQL (Supabase)" },
                { label: "File Storage", value: "Default" },
                { label: "Cache", value: "None" },
            ],
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-black/50 mt-1">Manage your store configuration</p>
            </div>

            <div className="space-y-6">
                {settingsGroups.map((group) => (
                    <div key={group.title} className="bg-white rounded-xl border border-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-black/5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-black/5 flex items-center justify-center">
                                <group.icon className="w-4 h-4 text-black/60" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">{group.title}</h2>
                                <p className="text-xs text-black/40">{group.description}</p>
                            </div>
                        </div>
                        <div className="divide-y divide-black/5">
                            {group.items.map((item) => (
                                <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                                    <span className="text-sm text-black/60">{item.label}</span>
                                    <span className="text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-black/30 mt-8">
                Settings are read-only in this demo. Connect to your admin backend to enable editing.
            </p>
        </div>
    );
}
