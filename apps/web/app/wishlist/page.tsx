"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@nike/ui"; // Assuming generic button import
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { WishlistButton } from "@/components/product/wishlist-button";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="container-nike py-12">
                <h1 className="text-display-md font-bold mb-8">Wishlist</h1>
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-background-secondary rounded-card" />
                    <div className="h-32 bg-background-secondary rounded-card" />
                </div>
            </div>
        );
    }

    return (
        <div className="container-nike py-12">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="w-8 h-8 text-accent" />
                <h1 className="text-display-md font-bold">Wishlist</h1>
                <span className="text-foreground-muted text-lg font-normal">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-background-secondary/50 rounded-card border-dashed border-2 border-border">
                    <Heart className="w-16 h-16 mx-auto text-foreground-muted mb-4 opacity-20" />
                    <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
                    <p className="text-foreground-muted mb-6 max-w-md mx-auto">
                        Save items you love to verify them later.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">
                            Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative bg-background-secondary rounded-card overflow-hidden hover:shadow-nike transition-all duration-300">
                            {/* Image */}
                            <Link href={`/products/${item.slug}`} className="block relative aspect-square bg-white">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-secondary to-border/10">
                                        <span className="text-5xl">👟</span>
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <Link href={`/products/${item.slug}`} className="hover:underline">
                                            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                                        </Link>
                                        <p className="text-sm text-foreground-muted">{item.category}</p>
                                    </div>
                                    <WishlistButton product={item} />
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <p className="font-bold text-lg">${Number(item.price).toFixed(2)}</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={(e) => {
                                            e.preventDefault();
                                            useCartStore.getState().addItem({
                                                productId: item.id,
                                                variantId: item.id,
                                                name: item.name,
                                                price: Number(item.price),
                                                size: "M",
                                                color: "Default",
                                                quantity: 1,
                                                image: item.image
                                            });
                                        }}>
                                            Add to Cart
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href={`/products/${item.slug}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
