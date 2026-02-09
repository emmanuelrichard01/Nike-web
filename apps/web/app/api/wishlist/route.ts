import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";

// GET: Fetch user's wishlist
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ items: [] });
    }

    const wishlist = await prisma.wishlist.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: {
                        include: { category: true, variants: true },
                    },
                },
            },
        },
    });

    if (!wishlist) {
        return NextResponse.json({ items: [] });
    }

    // Format details for frontend
    const formattedItems = wishlist.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        slug: item.product.slug,
        category: item.product.category.name,
        image: `/products/${item.product.slug}.jpg`, // Placeholder logic
    }));

    return NextResponse.json({ items: formattedItems });
}

// POST: Add item to wishlist (Sync)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId } = await request.json();

        let wishlist = await prisma.wishlist.findUnique({
            where: { userId: session.user.id },
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
                data: { userId: session.user.id },
            });
        }

        // Check if item exists
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                wishlistId_productId: {
                    wishlistId: wishlist.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            return NextResponse.json({ message: "Item already in wishlist" });
        }

        await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId,
            },
        });

        return NextResponse.json({ message: "Added to wishlist" });
    } catch (error) {
        console.error("Failed to add to wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
