"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@nike/ui";
import { SlidersHorizontal, X } from "lucide-react";
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
        // Reset page on filter change
        params.set("page", "1");
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg">Categories</h3>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => updateFilters("category", null)}
                        className={`text-left text-sm hover:text-foreground transition-colors ${!searchParams.get("category") ? "font-bold text-foreground" : "text-foreground-muted"}`}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilters("category", cat.slug)}
                            className={`text-left text-sm hover:text-foreground transition-colors ${searchParams.get("category") === cat.slug ? "font-bold text-foreground" : "text-foreground-muted"}`}
                        >
                            {cat.name} <span className="text-xs text-gray-400">({cat._count.products})</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Sort By */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg">Sort By</h3>
                <div className="flex flex-col gap-2">
                    {[
                        { label: "Newest", value: "newest" },
                        { label: "Price: Low-High", value: "price_asc" },
                        { label: "Price: High-Low", value: "price_desc" },
                    ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <div
                                onClick={() => updateFilters("sort", option.value)}
                                className={`w-4 h-4 rounded-full border border-foreground flex items-center justify-center cursor-pointer ${(searchParams.get("sort") || "newest") === option.value ? "bg-foreground" : ""}`}
                            >
                                {(searchParams.get("sort") || "newest") === option.value && <div className="w-2 h-2 rounded-full bg-background" />}
                            </div>
                            <label onClick={() => updateFilters("sort", option.value)} className="text-sm cursor-pointer select-none">{option.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4 scrollbar-hide">
                <FilterContent />
            </div>

            {/* Mobile Trigger */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
                <span className="font-bold text-lg">Filters</span>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filter
                </Button>
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
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-xl z-50 lg:hidden p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <FilterContent />
                            <div className="mt-8 pt-6 border-t border-border">
                                <Button className="w-full" onClick={() => setIsOpen(false)}>Show Results</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
