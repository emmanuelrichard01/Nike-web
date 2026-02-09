"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@nike/ui";
import { Truck, RotateCcw, CreditCard, ShieldCheck } from "lucide-react";

const marqueeItems = [
    { text: "Free Delivery on Orders Over $100", icon: Truck },
    { text: "Nike Members Get Free Shipping", icon: ShieldCheck },
    { text: "60-Day Free Returns", icon: RotateCcw },
    { text: "Buy Now, Pay Later Available", icon: CreditCard },
];

export function Marquee() {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [rippleOrigin, setRippleOrigin] = useState<{ x: number; y: number } | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setRippleOrigin({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const getMaxRippleSize = () => {
        if (!containerRef.current) return 2000;
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        return Math.sqrt(width * width + height * height) * 2.5;
    };

    // Build the content block to repeat
    const itemsContent = marqueeItems.map((item, i) => {
        const Icon = item.icon;
        return (
            <span
                key={i}
                className={cn(
                    "inline-flex items-center gap-2 mx-8 transition-all duration-300",
                    isHovered ? "font-bold" : "font-medium"
                )}
            >
                <Icon className={cn(
                    "w-3.5 h-3.5 flex-shrink-0 transition-colors duration-300",
                    isHovered ? "text-black/80" : "text-black/30"
                )} />
                <span className="text-[11px] uppercase tracking-[0.08em] whitespace-nowrap">
                    {item.text}
                </span>
                <span className={cn(
                    "mx-6 transition-colors duration-300",
                    isHovered ? "text-black/30" : "text-black/15"
                )}>
                    ·
                </span>
            </span>
        );
    });

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden py-3 border-y border-black/5 cursor-pointer bg-[#f5f5f5]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ripple Effect Layer */}
            <AnimatePresence>
                {isHovered && rippleOrigin && (
                    <motion.div
                        key="ripple"
                        initial={{
                            width: 0,
                            height: 0,
                            x: rippleOrigin.x,
                            y: rippleOrigin.y,
                        }}
                        animate={{
                            width: getMaxRippleSize(),
                            height: getMaxRippleSize(),
                            x: rippleOrigin.x - getMaxRippleSize() / 2,
                            y: rippleOrigin.y - getMaxRippleSize() / 2,
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.3 }
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            background: "radial-gradient(circle at center, #c0ff00 0%, #b8f000 40%, #a8e600 100%)",
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Marquee Track — CSS animation for smoothness */}
            <div
                className={cn(
                    "marquee-track relative z-10 text-black/80",
                    isHovered && "[animation-play-state:paused]"
                )}
            >
                {/* Repeat content 4x for seamless loop */}
                {itemsContent}
                {itemsContent}
                {itemsContent}
                {itemsContent}
            </div>
        </div>
    );
}
