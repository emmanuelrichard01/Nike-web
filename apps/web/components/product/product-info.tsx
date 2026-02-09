"use client";

import { useState } from "react";
import { Button, Badge } from "@nike/ui";
import { Star, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useUIStore } from "@/lib/store/ui-store";
import { toast } from "sonner";
import { cn } from "@nike/ui";

interface Variant {
    id: string;
    size: string;
    color: string;
    stock: number;
    sku: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string;
    images: string[];
    category?: { name: string };
    variants: Variant[];
    reviews: { rating: number }[];
}

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const { addItem } = useCartStore();
    const { openCart } = useUIStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    // Calculate average rating
    const avgRating =
        product.reviews.length > 0
            ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
            : 0;

    // Derived state
    const sizes = Array.from(new Set(product.variants.map((v) => v.size))).sort(
        (a, b) => Number(a) - Number(b)
    );
    const colors = Array.from(new Set(product.variants.map((v) => v.color)));

    // Check availability
    const isVariantAvailable = (size: string | null, color: string | null) => {
        if (!size || !color) return true;
        const variant = product.variants.find((v) => v.size === size && v.color === color);
        return variant && variant.stock > 0;
    };

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            toast.error("Please select a size and color");
            return;
        }

        const variant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        if (!variant) {
            toast.error("This combination is unavailable");
            return;
        }

        if (variant.stock <= 0) {
            toast.error("Out of stock");
            return;
        }

        addItem({
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            price: Number(product.price),
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
            image: product.images[0], // Add image to cart item
        });
        openCart(); // Open cart drawer
        toast.success("Added to bag");
    };

    const isIn = isInWishlist(product.id);

    const toggleWishlist = () => {
        if (isIn) {
            removeFromWishlist(product.id);
            toast.success("Removed from wishlist");
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
                slug: product.id, // Using ID as slug if slug not available in product interface, or passed prop?
                category: product.category?.name || "Shoe",
            });
            toast.success("Added to wishlist");
        }
    };

    return (
        <div className="flex flex-col relative" id="product-options">

            <div className="sticky top-24">
                {product.category && (
                    <Badge variant="secondary" className="mb-4 w-fit">
                        {product.category.name}
                    </Badge>
                )}

                <h1 className="text-display-md font-black mb-2 uppercase tracking-tight">
                    {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-4 w-4",
                                    i < Math.round(avgRating)
                                        ? "fill-accent text-accent"
                                        : "text-border"
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-foreground-muted text-sm border-b border-foreground-muted cursor-pointer hover:text-foreground">
                        {product.reviews.length} Reviews
                    </span>
                </div>

                {/* Price */}
                <p className="text-2xl font-medium mb-6">
                    ${Number(product.price).toFixed(2)}
                </p>

                {/* Description */}
                <p className="text-foreground-muted mb-8 leading-relaxed max-w-md">
                    {product.description}
                </p>

                {/* Size Selection */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Select Size</h3>
                        <button className="text-sm text-foreground-muted underline hover:text-foreground">
                            Size Guide
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {sizes.map((size) => {
                            const available = isVariantAvailable(size, selectedColor);
                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={!available && !!selectedColor} // Only disable if color is selected and combo is unavailable
                                    className={cn(
                                        "px-4 py-3 border rounded-md transition-all font-medium text-center relative",
                                        selectedSize === size
                                            ? "border-black ring-1 ring-black"
                                            : "border-border hover:border-foreground",
                                        !available && !!selectedColor && "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                    )}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                    {!selectedSize && (
                        <p className="text-destructive text-sm mt-2 opacity-0 h-0 transition-opacity">Select a size</p>
                    )}
                </div>

                {/* Color Selection */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-3">Select Color</h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "px-4 py-2 border rounded-full transition-all text-sm",
                                    selectedColor === color
                                        ? "border-black bg-black text-white"
                                        : "border-border hover:border-black"
                                )}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        size="lg"
                        onClick={handleAddToCart}
                        className="w-full rounded-full py-6 text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                        Add to Bag
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleWishlist}
                        className="w-full rounded-full py-6 text-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        Favorite <Heart className={cn("ml-2 w-5 h-5", isIn ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                </div>

                {/* Shipping Info */}
                <div className="mt-8 text-sm text-foreground-muted space-y-2">
                    <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> Free shipping on orders over $150</p>
                    <p className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Free 30-day returns</p>
                </div>
            </div>
        </div>
    );
}
