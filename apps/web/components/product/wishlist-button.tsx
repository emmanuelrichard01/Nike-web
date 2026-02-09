"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn, Button } from "@nike/ui"; // Assuming Button is available, or use standard button
import { useWishlistStore, type WishlistItem } from "@/lib/store/wishlist-store";

interface WishlistButtonProps {
    product: WishlistItem;
    className?: string;
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
    const { addItem, removeItem, isInWishlist } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className={cn("p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors", className)}>
                <Heart className="w-5 h-5 text-gray-400" />
            </button>
        );
    }

    const isIn = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        if (isIn) {
            removeItem(product.id);
        } else {
            addItem(product);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={cn(
                "p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95",
                isIn && "text-red-500 bg-white",
                className
            )}
            aria-label={isIn ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={cn("w-5 h-5", isIn ? "fill-current" : "text-gray-600")} />
        </button>
    );
}
