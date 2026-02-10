import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@nike/database";
import { Skeleton } from "@nike/ui";
import Link from "next/link";
import { ProductGallery } from "@/components/product/gallery/product-gallery";
import { StickyAddToCart } from "@/components/product/sticky-add-to-cart";
import { ProductInfo } from "@/components/product/product-info";
import { ReviewSection } from "@/components/product/review-section";
import { ChevronRight, Star, Shield, Truck, RotateCcw } from "lucide-react";

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
        title: `${product.name} | Nike`,
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

    const images = product.images.length > 0 ? product.images : [];

    return (
        <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
                <Link href="/" className="text-foreground/50 hover:text-foreground transition-colors">
                    Home
                </Link>
                <ChevronRight className="w-4 h-4 text-foreground/30" />
                <Link href="/products" className="text-foreground/50 hover:text-foreground transition-colors">
                    Products
                </Link>
                {product.category && (
                    <>
                        <ChevronRight className="w-4 h-4 text-foreground/30" />
                        <Link
                            href={`/products?category=${product.category.slug}`}
                            className="text-foreground/50 hover:text-foreground transition-colors"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="w-4 h-4 text-foreground/30" />
                <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                {/* Product Gallery (Left - 7 cols) */}
                <div className="lg:col-span-7">
                    <ProductGallery images={images} productName={product.name} />
                </div>

                {/* Product Info (Right - 5 cols) */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-24">
                        <ProductInfo product={{
                            ...product,
                            price: Number(product.price),
                        }} />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-black/5">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-foreground/70" />
                                </div>
                                <p className="text-xs font-semibold">Free Shipping</p>
                                <p className="text-xs text-foreground/50">Over $100</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                                    <RotateCcw className="w-5 h-5 text-foreground/70" />
                                </div>
                                <p className="text-xs font-semibold">30-Day Returns</p>
                                <p className="text-xs text-foreground/50">Free & Easy</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-foreground/70" />
                                </div>
                                <p className="text-xs font-semibold">Secure Checkout</p>
                                <p className="text-xs text-foreground/50">256-bit SSL</p>
                            </div>
                        </div>

                        {/* Reviews Summary */}
                        {product.reviews.length > 0 && (
                            <div className="mt-8 p-6 bg-[#f5f5f5] rounded-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.round(avgRating)
                                                    ? "fill-[#c0ff00] text-[#c0ff00]"
                                                    : "fill-black/10 text-black/10"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold">{avgRating.toFixed(1)}</span>
                                    <span className="text-foreground/50 text-sm">
                                        ({product.reviews.length} {product.reviews.length === 1 ? "Review" : "Reviews"})
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/60">
                                    &quot;{product.reviews[0]?.comment || "Great product, highly recommend!"}&quot;
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection
                productId={product.id}
                initialAvgRating={avgRating}
                initialReviewCount={product.reviews.length}
            />

            {/* Sticky Mobile Bar */}
            <StickyAddToCart product={{ name: product.name, price: Number(product.price), image: images[0] }} />
        </>
    );
}

function ProductLoading() {
    return (
        <div className="space-y-8">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                {/* Gallery Skeleton */}
                <div className="lg:col-span-7">
                    <div className="flex gap-4">
                        <div className="hidden lg:flex flex-col gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="w-16 h-16 rounded-lg" />
                            ))}
                        </div>
                        <Skeleton className="aspect-square flex-1 rounded-2xl" />
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="lg:col-span-5 space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4">
                        <Skeleton className="h-5 w-20" />
                        <div className="grid grid-cols-5 gap-2 mt-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <Skeleton className="h-14 w-full rounded-full mt-6" />
                </div>
            </div>
        </div>
    );
}

export default function ProductPage({ params }: ProductPageProps) {
    return (
        <div className="min-h-screen bg-white">
            <div className="container-nike py-8 lg:py-12 pb-32 lg:pb-16">
                <Suspense fallback={<ProductLoading />}>
                    <ProductContent slug={params.slug} />
                </Suspense>
            </div>
        </div>
    );
}
