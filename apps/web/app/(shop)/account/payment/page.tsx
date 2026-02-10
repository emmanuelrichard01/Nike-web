import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Link from "next/link";
import { ArrowLeft, CreditCard, Plus, ShieldCheck } from "lucide-react";

export const metadata = { title: "Payment Methods | Nike" };

export default async function AccountPaymentPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin?callbackUrl=/account/payment");

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="container-nike py-8 md:py-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/account"
                        className="w-10 h-10 rounded-full bg-white hover:bg-[#e5e5e5] flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold">Payment Methods</h1>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
                        <CreditCard className="w-7 h-7 text-black/30" />
                    </div>
                    <h2 className="text-lg font-bold mb-2">No Payment Methods Saved</h2>
                    <p className="text-sm text-black/50 mb-6 max-w-md mx-auto">
                        Payment methods are securely managed through Stripe during checkout. Your card information is never stored on our servers.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs text-black/30 bg-black/5 px-4 py-2 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Protected by Stripe
                    </div>
                </div>
            </div>
        </div>
    );
}
