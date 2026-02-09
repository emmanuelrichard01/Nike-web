import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ itemId: string }> } // itemId is actually the Product ID here for simplicity
) {
    const { itemId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id },
        });

        if (!wishlist) {
            return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
        }

        await prisma.wishlistItem.deleteMany({
            where: {
                wishlistId: wishlist.id,
                productId: itemId,
            },
        });

        return NextResponse.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
