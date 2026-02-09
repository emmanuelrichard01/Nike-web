import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@nike/database";
import { Button, Badge, Skeleton } from "@nike/ui";
import { ShoppingBag, Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "@/components/product/gallery/product-gallery";
import { StickyAddToCart } from "@/components/product/sticky-add-to-cart";
import { ProductInfo } from "@/components/product/product-info";

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ProductPageProps) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
    });

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: product.name,
        description: product.description,
    };
}

async function ProductContent({ slug }: { slug: string }) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            variants: true,
            reviews: {
                include: {
                    user: {
                        select: { id: true, name: true },
                    },
                },
                take: 5,
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!product) {
        notFound();
    }

    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) /
            product.reviews.length
            : 0;

    // Get unique sizes and colors
    const sizes = Array.from(new Set(product.variants.map((v: { size: string }) => v.size))).sort((a, b) => Number(a) - Number(b)); // Simple sort, improves UX
    const colors = Array.from(new Set(product.variants.map((v: { color: string }) => v.color)));

    // Use images from DB or placeholder
    const images = product.images.length > 0 ? product.images : [];

    return (
        <div className="grid lg:grid-cols-12 gap-12">
            {/* Product Gallery (Left - 7 cols) */}
            <div className="lg:col-span-7">
                <ProductGallery images={images} />
            </div>

            {/* Product Info (Right - 5 cols) */}
            <div className="lg:col-span-5 flex flex-col relative">
                <ProductInfo product={product} />
            </div>

            {/* Sticky Mobile Bar */}
            <StickyAddToCart product={{ name: product.name, price: Number(product.price), image: images[0] }} />
        </div>
    );
}

function ProductLoading() {
    return (
        <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-card" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    );
}

export default function ProductPage({ params }: ProductPageProps) {
    return (
        <div className="container-nike py-12 lg:py-12 pb-32 lg:pb-12">
            <Suspense fallback={<ProductLoading />}>
                <ProductContent slug={params.slug} />
            </Suspense>
        </div>
    );
}
