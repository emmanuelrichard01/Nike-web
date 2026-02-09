import { prisma } from "@nike/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "12");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const where = category
            ? {
                category: {
                    slug: category,
                },
            }
            : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: true,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
