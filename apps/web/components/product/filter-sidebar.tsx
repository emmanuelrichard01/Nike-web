"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, cn } from "@nike/ui";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
    categories: { id: string; name: string; slug: string; _count: { products: number } }[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const updateFilters = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const currentCategory = searchParams.get("category");
    const currentSort = searchParams.get("sort") || "newest";

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-foreground/40 mb-4">
                    Categories
                </h3>
                <div className="space-y-1">
                    <button
                        onClick={() => updateFilters("category", null)}
                        className={cn(
                            "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            !currentCategory
                                ? "bg-black text-white"
                                : "hover:bg-black/5"
                        )}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilters("category", cat.slug)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                                currentCategory === cat.slug
                                    ? "bg-black text-white"
                                    : "hover:bg-black/5"
                            )}
                        >
                            <span>{cat.name}</span>
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                currentCategory === cat.slug
                                    ? "bg-white/20"
                                    : "bg-black/5"
                            )}>
                                {cat._count.products}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-black/5" />

            {/* Sort By */}
            <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-foreground/40 mb-4">
                    Sort By
                </h3>
                <div className="space-y-1">
                    {[
                        { label: "Newest", value: "newest" },
                        { label: "Price: Low to High", value: "price_asc" },
                        { label: "Price: High to Low", value: "price_desc" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => updateFilters("sort", option.value)}
                            className={cn(
                                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                                currentSort === option.value
                                    ? "bg-black text-white"
                                    : "hover:bg-black/5"
                            )}
                        >
                            <span>{option.label}</span>
                            {currentSort === option.value && (
                                <Check className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range (Visual placeholder) */}
            <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-foreground/40 mb-4">
                    Price Range
                </h3>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-xs text-foreground/50 mb-1 block">Min</label>
                        <input
                            type="text"
                            placeholder="$0"
                            className="w-full px-4 py-3 rounded-xl bg-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-foreground/50 mb-1 block">Max</label>
                        <input
                            type="text"
                            placeholder="$500"
                            className="w-full px-4 py-3 rounded-xl bg-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-black/5">
                                <h2 className="text-xl font-black">Filters</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <FilterContent />
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-black/5 bg-white">
                                <Button
                                    className="w-full rounded-full h-12 font-bold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Show Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
