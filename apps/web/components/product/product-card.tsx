import Link from "next/link";
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
    // Get unique colors
    const colorSet = product.variants
        ? new Set(product.variants.map((v) => v.color))
        : new Set<string>();
    const colors = Array.from(colorSet);

    return (
        <div className={cn("group block bg-background-secondary rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-nike relative", className)}>
            <Link href={`/products/${product.slug}`}>
                {/* Product Image */}
                <div className="relative aspect-square bg-white rounded-t-card overflow-hidden group">
                    {product.images && product.images.length > 0 ? (
                        <div className="relative w-full h-full">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-6xl font-bold text-gray-300 group-hover:scale-110 transition-transform duration-300 select-none">
                                👟
                            </div>
                        </div>
                    )}

                    {/* Category Badge */}
                    {product.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-3 left-3 backdrop-blur-md bg-white/70 shadow-sm border-none font-medium"
                        >
                            {product.category.name}
                        </Badge>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="relative inline-block font-semibold text-lg text-foreground transition-colors z-10">
                        <span className="relative z-20 group-hover:text-accent transition-colors duration-300">{product.name}</span>
                        <span className="absolute inset-0 -left-1 -right-1 bottom-0 bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-10" />
                    </h3>

                    {/* Colors */}
                    {colors.length > 0 && (
                        <p className="text-sm text-foreground-muted mt-1">
                            {colors.length} {colors.length === 1 ? "Color" : "Colors"}
                        </p>
                    )}

                    {/* Price */}
                    <p className="mt-2 font-semibold text-lg">
                        ${Number(product.price).toFixed(2)}
                    </p>
                </div>
            </Link>

            {/* Wishlist Button - Positioned absolutely */}
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
