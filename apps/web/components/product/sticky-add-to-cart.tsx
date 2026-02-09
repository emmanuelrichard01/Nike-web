"use client";

import { useEffect, useState } from "react";
import { Button } from "@nike/ui";
import { ShoppingBag, ChevronUp } from "lucide-react";
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
            const threshold = 500;
            setIsVisible(scrollY > threshold);
        };

        window.addEventListener("scroll", handleScroll);
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
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
                    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                    {/* Glass morphism container */}
                    <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                        <div className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                {/* Product thumbnail */}
                                <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl text-gray-300">
                                            👟
                                        </div>
                                    )}
                                </div>

                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-900 truncate leading-tight">
                                        {product.name}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-600 mt-0.5">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    size="lg"
                                    onClick={scrollToOptions}
                                    className="flex-shrink-0 bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Add to Bag
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
