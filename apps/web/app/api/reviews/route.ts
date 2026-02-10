import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { z } from "zod";

const reviewSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
});

// POST: Submit a review
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
        }

        const body = await request.json();
        const { productId, rating, comment } = reviewSchema.parse(body);

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: { productId, userId: session.user.id },
        });

        if (existingReview) {
            // Update existing review
            const updated = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment },
                include: { user: { select: { id: true, name: true } } },
            });
            return NextResponse.json({ review: updated, message: "Review updated" });
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                productId,
                userId: session.user.id,
                rating,
                comment,
            },
            include: { user: { select: { id: true, name: true } } },
        });

        return NextResponse.json({ review, message: "Review submitted" }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error("Failed to submit review:", error);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}

// GET: Fetch reviews for a product
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (!productId) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { productId },
                include: { user: { select: { id: true, name: true, image: true } } },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.review.count({ where: { productId } }),
        ]);

        // Calculate rating breakdown
        const allRatings = await prisma.review.groupBy({
            by: ["rating"],
            where: { productId },
            _count: { rating: true },
        });

        const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
            stars: star,
            count: allRatings.find((r) => r.rating === star)?._count.rating || 0,
        }));

        const avgRating = total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;

        return NextResponse.json({
            reviews,
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: total,
            ratingBreakdown,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}
