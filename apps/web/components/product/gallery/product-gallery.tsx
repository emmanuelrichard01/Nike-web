"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@nike/ui";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square bg-background-secondary rounded-card overflow-hidden flex items-center justify-center">
                <div className="text-[100px] transform -rotate-12 opacity-20">👟</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 sticky top-24 self-start">
            {/* Thumbnails (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        className={cn(
                            "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                            activeImage === idx ? "border-black" : "border-transparent"
                        )}
                        onMouseEnter={() => setActiveImage(idx)}
                        onClick={() => setActiveImage(idx)}
                    >
                        <Image
                            src={img}
                            alt={`Product image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square bg-background-secondary rounded-card overflow-hidden flex-1 group">
                {/* Mobile: Scrollable if we wanted, but let's stick to main image click for now or swipe. 
             For MVP, just showing active image with simple transition */}
                <div className="w-full h-full relative">
                    <Image
                        src={images[activeImage]}
                        alt="Product Main Image"
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>

            {/* Mobile Dots */}
            <div className="flex justify-center gap-2 lg:hidden mt-4">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            activeImage === idx ? "bg-black w-4" : "bg-gray-300"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
