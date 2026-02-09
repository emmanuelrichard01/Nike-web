"use client";

import { useEffect, useState } from "react";
import { Button } from "@nike/ui";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface StickyAddToCartProps {
    product: {
        name: string;
        price: number;
        image?: string;
    };
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 400;
            setIsVisible(scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToOptions = () => {
        const element = document.getElementById('product-options');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-md pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        {/* Glass Bar */}
                        <div className="glass-dark backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center gap-3 border border-white/10">
                            {/* Product thumbnail */}
                            <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg">
                                        👟
                                    </div>
                                )}
                            </div>

                            {/* Product info */}
                            <div className="flex-1 min-w-0 px-1">
                                <p className="font-bold text-sm text-white truncate leading-tight">
                                    {product.name}
                                </p>
                                <p className="text-xs text-white/70">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <Button
                                size="sm"
                                onClick={scrollToOptions}
                                className="flex-shrink-0 bg-accent hover:bg-accent/90 text-black rounded-full px-6 h-10 font-bold text-sm transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(192,255,0,0.3)]"
                            >
                                <ShoppingBag className="w-4 h-4 mr-1.5" />
                                Add
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
