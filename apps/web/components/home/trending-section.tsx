"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@nike/ui";

interface TrendingSectionProps {
    products: any[]; // Replace with correct type
    title: string;
}

export function TrendingSection({ products, title }: TrendingSectionProps) {
    return (
        <section className="py-20 bg-background">
            <div className="container-nike mb-8 flex items-end justify-between">
                <h2 className="text-display-md font-bold uppercase tracking-tight">{title}</h2>
                <Button variant="link" className="hidden md:flex text-lg" asChild>
                    <Link href="/products">Shop All <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
            </div>

            {/* Horizontal Scroll Snap Container */}
            <div className="snap-x-mandatory flex gap-6 px-6 md:px-12 pb-12">
                {products.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="snap-start min-w-[300px] md:min-w-[400px]"
                    >
                        <ProductCard product={product} className="h-full" />
                    </motion.div>
                ))}
                {/* "See More" Card */}
                <div className="snap-start min-w-[300px] md:min-w-[400px] flex items-center justify-center bg-background-secondary rounded-card aspect-[4/5] md:aspect-auto">
                    <Link href="/products" className="flex flex-col items-center gap-4 group">
                        <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                            <ArrowRight className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-xl uppercase">View All</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
