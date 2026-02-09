"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@nike/ui";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
    category?: { name: string };
    variants?: { color: string }[];
}

interface TrendingSectionProps {
    products: Product[];
    title: string;
    subtitle?: string;
    accentColor?: string;
    variant?: "default" | "dark" | "gradient";
}

// Modern Product Card with proper dark variant support
function ModernProductCard({
    product,
    index,
    isDark
}: {
    product: Product;
    index: number;
    isDark: boolean;
}) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const colors = product.variants
        ? Array.from(new Set(product.variants.map(v => v.color)))
        : [];

    const hasValidImage = product.images && product.images.length > 0 && !imageError;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.slug}`} className="block">
                {/* Image Container */}
                <div className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden mb-4",
                    isDark
                        ? "bg-white/5"
                        : "bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]"
                )}>
                    {hasValidImage ? (
                        <Image
                            src={product.images![0]}
                            alt={product.name}
                            fill
                            className={cn(
                                "object-contain p-6 transition-all duration-700 ease-out",
                                isHovered ? "scale-110" : "scale-100"
                            )}
                            sizes="(max-width: 768px) 80vw, 320px"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Image
                                src="/nike_logo.png"
                                alt="Nike"
                                width={50}
                                height={50}
                                className={isDark ? "opacity-10 invert" : "opacity-20"}
                            />
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "absolute inset-0 backdrop-blur-[2px]",
                                    isDark ? "bg-white/5" : "bg-black/5"
                                )}
                            />
                        )}
                    </AnimatePresence>

                    {/* Category Badge */}
                    {product.category && (
                        <div className="absolute top-4 left-4">
                            <span className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md",
                                isDark
                                    ? "bg-white/10 text-white"
                                    : "bg-white/90 text-black/80"
                            )}>
                                {product.category.name}
                            </span>
                        </div>
                    )}

                    {/* Quick View Button */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-4 left-4 right-4"
                            >
                                <div className={cn(
                                    "rounded-xl px-4 py-3 flex items-center justify-between backdrop-blur-md",
                                    isDark
                                        ? "bg-white/10 text-white"
                                        : "bg-white/95 text-black"
                                )}>
                                    <span className="text-sm font-semibold">Quick View</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Info - FIXED: proper text colors for dark variant */}
                <div className="space-y-1.5">
                    <h3 className={cn(
                        "font-semibold text-base line-clamp-1 transition-colors",
                        isDark
                            ? "text-white group-hover:text-white/70"
                            : "text-foreground group-hover:text-foreground/70"
                    )}>
                        {product.name}
                    </h3>
                    {colors.length > 0 && (
                        <p className={isDark ? "text-sm text-white/50" : "text-sm text-foreground/50"}>
                            {colors.length} {colors.length === 1 ? "Color" : "Colors"}
                        </p>
                    )}
                    <p className={cn(
                        "text-base font-bold",
                        isDark ? "text-white" : "text-foreground"
                    )}>
                        ${Number(product.price).toFixed(2)}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

export function TrendingSection({
    products,
    title,
    subtitle,
    accentColor = "#c0ff00",
    variant = "default"
}: TrendingSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const isDark = variant === "dark";

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 340;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const bgClasses = {
        default: "bg-white",
        dark: "bg-[#111]",
        gradient: "bg-gradient-to-br from-[#f8f8f8] to-[#efefef]"
    };

    return (
        <section
            ref={sectionRef}
            className={cn("py-20 md:py-28 overflow-hidden", bgClasses[variant])}
        >
            {/* Header */}
            <div className="container-nike mb-10">
                <div className="flex items-end justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Accent Line */}
                        <motion.div
                            className="w-12 h-1 rounded-full mb-4"
                            style={{ backgroundColor: accentColor }}
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 48 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />

                        <h2 className={cn(
                            "text-3xl md:text-5xl font-black tracking-tight",
                            isDark ? "text-white" : "text-foreground"
                        )}>
                            {title}
                        </h2>

                        {subtitle && (
                            <p className={cn(
                                "mt-2 text-base md:text-lg max-w-md",
                                isDark ? "text-white/50" : "text-foreground/50"
                            )}>
                                {subtitle}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {/* Shop All Link */}
                        <Link
                            href="/products"
                            className={cn(
                                "hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105",
                                isDark
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-black text-white hover:bg-black/80"
                            )}
                        >
                            Shop All
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Navigation Arrows */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll("left")}
                                className={cn(
                                    "w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105",
                                    isDark
                                        ? "bg-white/10 hover:bg-white/20 text-white"
                                        : "bg-black/5 hover:bg-black/10 text-black"
                                )}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className={cn(
                                    "w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105",
                                    isDark
                                        ? "bg-white/10 hover:bg-white/20 text-white"
                                        : "bg-black/5 hover:bg-black/10 text-black"
                                )}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Products Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-4 scroll-smooth"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {products.map((product, i) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-[260px] md:w-[320px]"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        <ModernProductCard product={product} index={i} isDark={isDark} />
                    </div>
                ))}

                {/* View All Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-[260px] md:w-[320px]"
                    style={{ scrollSnapAlign: "start" }}
                >
                    <Link
                        href="/products"
                        className={cn(
                            "flex flex-col items-center justify-center h-full min-h-[360px] rounded-2xl transition-all hover:scale-[1.02] group",
                            isDark
                                ? "bg-white/5 hover:bg-white/10 border border-white/10"
                                : "bg-gradient-to-br from-black to-black/90 text-white"
                        )}
                    >
                        <motion.div
                            className={cn(
                                "w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                isDark ? "border-white" : "border-white"
                            )}
                            whileHover={{ rotate: 45 }}
                        >
                            <ArrowRight className="w-6 h-6" />
                        </motion.div>
                        <span className={cn(
                            "font-bold text-lg",
                            isDark ? "text-white" : "text-white"
                        )}>
                            View All
                        </span>
                        <span className={cn(
                            "text-sm mt-1",
                            isDark ? "text-white/50" : "text-white/60"
                        )}>
                            {products.length}+ Products
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
