import {
    Globe,
    Bell,
    Palette,
    Lock,
    ChevronRight,
    Save,
    CreditCard,
    Smartphone,
    Mail
} from "lucide-react";
import { Button } from "@nike/ui";

export const metadata = {
    title: "Settings — Admin | Nike",
};

export default function AdminSettingsPage() {
    return (
        <div className="max-w-5xl space-y-8">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-black">Settings</h1>
                    <p className="text-black/40 font-medium mt-1">
                        Manage your store preferences and configuration.
                    </p>
                </div>
                <Button className="rounded-full bg-black text-white hover:bg-[#CCFF00] hover:text-black font-bold h-10 px-6 text-sm transition-all duration-300 shadow-xl hover:shadow-[#CCFF00]/20">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-8">
                {/* ─── General Settings ─── */}
                <SettingsGroup
                    icon={Globe}
                    title="General Settings"
                    description="Store details, localization, and regional preferences."
                >
                    <SettingsRow
                        label="Store Name"
                        value="Nike Store"
                        description="The name displayed in title bars and emails."
                    />
                    <SettingsRow
                        label="Support Email"
                        value="support@nike.com"
                        description="Customer support contact address."
                    />
                    <SettingsRow
                        label="Currency"
                        value="USD ($)"
                        badge="Default"
                    />
                    <SettingsRow
                        label="Timezone"
                        value="America/New_York (UTC-05:00)"
                    />
                </SettingsGroup>

                {/* ─── Notifications ─── */}
                <SettingsGroup
                    icon={Bell}
                    title="Notifications"
                    description="Manage email alerts and push notification triggers."
                >
                    <ToggleRow
                        label="Order Confirmation"
                        description="Send automated email when customer places an order."
                        defaultOn
                    />
                    <ToggleRow
                        label="Shipping Updates"
                        description="Notify customer via email/SMS when order ships."
                        defaultOn
                    />
                    <ToggleRow
                        label="Low Stock Alerts"
                        description="Notify admin when stock falls below threshold (10 units)."
                    />
                    <ToggleRow
                        label="New User Signup"
                        description="Notify admin team when a new user registers."
                        defaultOn
                    />
                </SettingsGroup>

                {/* ─── Appearance ─── */}
                <SettingsGroup
                    icon={Palette}
                    title="Store Appearance"
                    description="Customize the look and feel of your storefront."
                >
                    <SettingsRow
                        label="Theme"
                        value="System"
                        badge="Auto"
                    />
                    <SettingsRow
                        label="Brand Color"
                        value="#111111"
                        colorPreview="#111111"
                    />
                    <SettingsRow
                        label="Font Family"
                        value="Inter / Helvetica Now"
                    />
                </SettingsGroup>

                {/* ─── Security ─── */}
                <SettingsGroup
                    icon={Lock}
                    title="Security & Access"
                    description="Manage admin access, API keys, and 2FA."
                >
                    <SettingsRow
                        label="Two-Factor Authentication"
                        value="Enforced"
                        badge="Secure"
                        badgeColor="bg-emerald-50 text-emerald-600"
                    />
                    <SettingsRow
                        label="API Tokens"
                        value="• • • • • • • • • • • •"
                        action="Rotate"
                    />
                    <SettingsRow
                        label="Admin Session Timeout"
                        value="30 Minutes"
                    />
                </SettingsGroup>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-bold text-amber-600 text-[10px]">!</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-900">Demo Environment</p>
                    <p className="text-xs text-amber-800/60 mt-0.5 font-medium leading-relaxed">
                        Settings changes are disabled in this preview environment. Any changes made here will not be persisted to the production database.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Components ─────────────────────────────────────────────

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
        <div className="bg-white rounded-[2rem] border border-black/[0.04] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="px-8 py-6 border-b border-black/[0.04] flex items-start gap-4 bg-[#fcfcfc]">
                <div className="w-10 h-10 rounded-2xl bg-black/[0.03] border border-black/[0.02] flex items-center justify-center text-black shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-black">{title}</h2>
                    <p className="text-sm text-black/40 font-medium leading-relaxed">{description}</p>
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
    description,
    badge,
    badgeColor,
    colorPreview,
    action
}: {
    label: string,
    value: string,
    description?: string,
    badge?: string,
    badgeColor?: string,
    colorPreview?: string,
    action?: string
}) {
    return (
        <div className="px-8 py-5 flex items-center justify-between group hover:bg-[#F5F5F7] transition-all duration-200 cursor-default">
            <div>
                <span className="text-sm font-bold text-black group-hover:text-black transition-colors">{label}</span>
                {description && <p className="text-xs text-black/40 font-medium mt-0.5">{description}</p>}
            </div>
            <div className="flex items-center gap-4">
                {colorPreview && (
                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5" style={{ backgroundColor: colorPreview }} />
                )}
                {badge && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${badgeColor || "bg-black text-white"}`}>
                        {badge}
                    </span>
                )}
                <span className="text-sm font-semibold text-black/60">{value}</span>
                {action ? (
                    <button className="text-[11px] font-bold text-black border border-black/10 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all ml-2 shadow-sm">
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
        <div className="px-8 py-5 flex items-center justify-between group hover:bg-[#F5F5F7] transition-all duration-200 cursor-pointer">
            <div>
                <p className="text-sm font-bold text-black">{label}</p>
                <p className="text-xs text-black/40 font-medium mt-0.5 max-w-md leading-relaxed">{description}</p>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${defaultOn ? "bg-[#CCFF00]" : "bg-black/10"}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${defaultOn ? "translate-x-6" : "translate-x-1"}`} />
            </div>
        </div>
    );
}
