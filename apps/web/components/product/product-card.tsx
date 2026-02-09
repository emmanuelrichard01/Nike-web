"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, Badge } from "@nike/ui";
import { WishlistButton } from "./wishlist-button";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        category?: {
            name: string;
        };
        variants?: {
            color: string;
        }[];
        images?: string[];
    };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    // Get unique colors
    const colorSet = product.variants
        ? new Set(product.variants.map((v) => v.color))
        : new Set<string>();
    const colors = Array.from(colorSet);

    const hasValidImage = product.images && product.images.length > 0 && !imageError;

    return (
        <div className={cn("group block bg-background-secondary rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-nike relative", className)}>
            <Link href={`/products/${product.slug}`}>
                {/* Product Image */}
                <div className="relative aspect-square bg-[#f5f5f5] rounded-t-card overflow-hidden">
                    {hasValidImage ? (
                        <Image
                            src={product.images![0]}
                            alt={product.name}
                            fill
                            className="object-contain object-center p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f5f5] p-4">
                            <Image
                                src="/nike_logo.png"
                                alt="Nike"
                                width={60}
                                height={60}
                                className="opacity-20 mb-2"
                            />
                            <span className="text-xs text-foreground/30 font-medium uppercase tracking-wider">
                                Image Coming Soon
                            </span>
                        </div>
                    )}

                    {/* Category Badge */}
                    {product.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-3 left-3 backdrop-blur-md bg-white/80 shadow-sm border-none font-medium text-xs"
                        >
                            {product.category.name}
                        </Badge>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-base text-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {product.name}
                    </h3>

                    {/* Colors */}
                    {colors.length > 0 && (
                        <p className="text-sm text-foreground-muted mt-1">
                            {colors.length} {colors.length === 1 ? "Color" : "Colors"}
                        </p>
                    )}

                    {/* Price */}
                    <p className="mt-2 font-bold text-base">
                        ${Number(product.price).toFixed(2)}
                    </p>
                </div>
            </Link>

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-10">
                <WishlistButton
                    product={{
                        id: product.id,
                        name: product.name,
                        price: Number(product.price),
                        slug: product.slug,
                        category: product.category?.name || "Uncategorized",
                        image: product.images?.[0],
                    }}
                />
            </div>
        </div>
    );
}

export default ProductCard;
