"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { Button } from "@nike/ui";
import { ShoppingBag, ArrowRight, Heart, X, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const addToCart = useCartStore((state) => state.addItem);
    const openCart = useUIStore((state) => state.openCart);
    const [mounted, setMounted] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            productId: item.id,
            variantId: item.id,
            name: item.name,
            price: Number(item.price),
            size: "M",
            color: "Default",
            quantity: 1,
            image: item.image,
            category: item.category,
        });
        toast.success(`${item.name} added to bag`);
        openCart();
    };

    const handleImageError = (id: string) => {
        setImageErrors(prev => new Set(prev).add(id));
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#fafafa]">
                <div className="bg-white border-b border-black/5">
                    <div className="container-nike py-12">
                        <div className="animate-pulse">
                            <div className="h-4 w-32 bg-black/5 rounded mb-6" />
                            <div className="h-12 w-48 bg-black/5 rounded" />
                        </div>
                    </div>
                </div>
                <div className="container-nike py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-black/5 rounded-2xl animate-pulse" />
                                <div className="h-5 w-3/4 bg-black/5 rounded animate-pulse" />
                                <div className="h-4 w-1/4 bg-black/5 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header Section */}
            <div className="bg-white border-b border-black/5">
                <div className="container-nike py-10 md:py-14">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-black/50 mb-6">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-black font-medium">Favorites</span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <div className="w-12 h-1 bg-[#ff4d4d] rounded-full mb-4" />
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
                                <Heart className="w-10 h-10 fill-[#ff4d4d] text-[#ff4d4d]" />
                                Favorites
                            </h1>
                            <p className="text-black/50 mt-3 text-lg">
                                {items.length} {items.length === 1 ? "Item" : "Items"} saved
                            </p>
                        </div>
                        {items.length > 0 && (
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-full h-12 px-6 font-semibold hidden md:flex"
                            >
                                <Link href="/products">
                                    Continue Shopping
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container-nike py-10 md:py-14">
                {items.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 md:py-32"
                    >
                        <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <Heart className="w-14 h-14 text-black/20" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-black/50 mb-10 max-w-md mx-auto text-lg">
                            Start browsing and tap the heart icon on products you love.
                        </p>
                        <Button
                            size="lg"
                            asChild
                            className="rounded-full px-10 h-14 font-bold text-base"
                        >
                            <Link href="/products">
                                Discover Products
                                <Sparkles className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    /* Product Grid */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group relative"
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => {
                                            removeItem(item.id);
                                            toast.success("Removed from Favorites");
                                        }}
                                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                                        aria-label="Remove from favorites"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Product Card */}
                                    <Link href={`/products/${item.slug}`} className="block">
                                        {/* Image */}
                                        <div className="relative aspect-square bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] rounded-2xl overflow-hidden mb-4">
                                            {item.image && !imageErrors.has(item.id) ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                    onError={() => handleImageError(item.id)}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <Image
                                                        src="/nike_logo.png"
                                                        alt="Nike"
                                                        width={50}
                                                        height={50}
                                                        className="opacity-20"
                                                    />
                                                </div>
                                            )}

                                            {/* Quick Add Overlay */}
                                            <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAddToCart(item);
                                                    }}
                                                    className="w-full rounded-xl bg-white/95 backdrop-blur-md text-black hover:bg-white font-semibold shadow-lg"
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Add to Bag
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-1.5">
                                            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-black/70 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-black/50">
                                                {item.category || "Shoes"}
                                            </p>
                                            <p className="font-bold text-base">
                                                ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
