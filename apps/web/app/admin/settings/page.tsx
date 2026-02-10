import {
    Globe,
    Bell,
    Palette,
    Database,
    ChevronRight,
    Save,
    Lock,
    Mail,
    CreditCard
} from "lucide-react";
import { Button } from "@nike/ui";

export const metadata = {
    title: "Settings — Admin | Nike",
};

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Settings</h1>
                    <p className="text-sm text-black/40 mt-1">
                        Manage your store preferences and configuration
                    </p>
                </div>
                <Button className="rounded-xl bg-black text-white hover:bg-black/80 h-10 px-5 text-sm font-bold">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                <SettingsGroup
                    icon={Globe}
                    title="General Settings"
                    description="Store details and localization"
                >
                    <SettingsRow label="Store Name" value="Nike Store" />
                    <SettingsRow label="Support Email" value="support@nike-store.com" />
                    <SettingsRow label="Currency" value="USD ($)" badge="Default" />
                    <SettingsRow label="Timezone" value="America/New_York (UTC-05:00)" />
                </SettingsGroup>

                <SettingsGroup
                    icon={Bell}
                    title="Notifications"
                    description="Email and push notification triggers"
                >
                    <ToggleRow label="Order Confirmation" description="Send email when customer places order" defaultOn />
                    <ToggleRow label="Shipping Updates" description="Notify customer when order ships" defaultOn />
                    <ToggleRow label="Low Stock Alerts" description="Notify admin when stock is below threshold" />
                    <ToggleRow label="New User Signup" description="Notify admin when a new user registers" defaultOn />
                </SettingsGroup>

                <SettingsGroup
                    icon={Palette}
                    title="Store Appearance"
                    description="Theme and branding customization"
                >
                    <SettingsRow label="Theme" value="Light Mode" badge="System" />
                    <SettingsRow label="Brand Color" value="#000000" colorPreview="#000000" />
                    <SettingsRow label="Font Family" value="Helvetica Now / Inter" />
                </SettingsGroup>

                <SettingsGroup
                    icon={Lock}
                    title="Security & Access"
                    description="Manage admin access and API keys"
                >
                    <SettingsRow label="Admin Access" value="2FA Enforced" badge="Secure" />
                    <SettingsRow label="API Tokens" value="************" action="Rotate" />
                </SettingsGroup>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100/50 text-amber-900/60 text-xs text-center font-medium">
                Note: This is a demo settings page. Configuration changes are disabled in this environment.
            </div>
        </div>
    );
}

// ─── Components ───

function SettingsGroup({
    icon: Icon,
    title,
    description,
    children
}: {
    icon: any,
    title: string,
    description: string,
    children: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center text-black/60">
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="font-bold text-sm">{title}</h2>
                    <p className="text-[11px] text-black/40 font-medium">{description}</p>
                </div>
            </div>
            <div className="divide-y divide-black/[0.03]">
                {children}
            </div>
        </div>
    );
}

function SettingsRow({
    label,
    value,
    badge,
    colorPreview,
    action
}: {
    label: string,
    value: string,
    badge?: string,
    colorPreview?: string,
    action?: string
}) {
    return (
        <div className="px-6 py-4 flex items-center justify-between group hover:bg-black/[0.01] transition-colors">
            <span className="text-sm font-medium text-black/70">{label}</span>
            <div className="flex items-center gap-3">
                {colorPreview && (
                    <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: colorPreview }} />
                )}
                {badge && (
                    <span className="text-[10px] font-bold bg-black/[0.05] text-black/60 px-2 py-0.5 rounded-md">
                        {badge}
                    </span>
                )}
                <span className="text-sm font-semibold text-black">{value}</span>
                {action ? (
                    <button className="text-xs font-bold text-black border border-black/10 px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-all ml-2">
                        {action}
                    </button>
                ) : (
                    <ChevronRight className="w-4 h-4 text-black/10 group-hover:text-black/30 transition-colors" />
                )}
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    defaultOn
}: {
    label: string,
    description: string,
    defaultOn?: boolean
}) {
    return (
        <div className="px-6 py-4 flex items-center justify-between group hover:bg-black/[0.01] transition-colors">
            <div>
                <p className="text-sm font-medium text-black/70">{label}</p>
                <p className="text-[11px] text-black/30 w-full max-w-[300px]">{description}</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${defaultOn ? "bg-black" : "bg-black/10"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${defaultOn ? "right-1" : "left-1"}`} />
            </div>
        </div>
    );
}
