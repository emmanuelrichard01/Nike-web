"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import { cn } from "@nike/ui";
import { SearchX } from "lucide-react";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
    category?: {
        name: string;
    };
    variants?: {
        color: string;
    }[];
}

interface ProductGridProps {
    products: Product[];
    className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
                    <SearchX className="w-8 h-8 text-foreground/30" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-foreground/50 mb-6 max-w-sm mx-auto">
                    Try adjusting your filters or browse all products
                </p>
                <Link
                    href="/products"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-black/80 transition-colors"
                >
                    View All Products
                </Link>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6",
                className
            )}
        >
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>
    );
}

export default ProductGrid;
