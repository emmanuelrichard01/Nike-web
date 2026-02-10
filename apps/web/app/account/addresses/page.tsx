import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { Button } from "@nike/ui";

export const metadata = { title: "Addresses | Nike" };

export default async function AccountAddressesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin?callbackUrl=/account/addresses");

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
                    <h1 className="text-2xl md:text-3xl font-bold">Saved Addresses</h1>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Add New Address Card */}
                    <button className="border-2 border-dashed border-black/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-black/30 hover:bg-white transition-all min-h-[200px]">
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-black/40" />
                        </div>
                        <span className="font-semibold text-sm text-black/60">Add New Address</span>
                    </button>
                </div>

                <p className="text-center text-sm text-black/30 mt-8">
                    Saved addresses will appear here for faster checkout.
                </p>
            </div>
        </div>
    );
}
