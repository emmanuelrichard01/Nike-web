import { prisma } from "@nike/database";
import { NextResponse } from "next/server";

interface RouteParams {
    params: {
        slug: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: params.slug,
            },
            include: {
                category: true,
                variants: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 10,
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Calculate average rating
        const avgRating =
            product.reviews.length > 0
                ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
                product.reviews.length
                : 0;

        return NextResponse.json({
            ...product,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
        });
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
