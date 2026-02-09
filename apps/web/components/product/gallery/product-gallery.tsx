"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@nike/ui";

interface ProductGalleryProps {
    images: string[];
    productName?: string;
}

export function ProductGallery({ images, productName = "Product" }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    const handleImageError = (index: number) => {
        setFailedImages(prev => new Set(prev).add(index));
    };

    // Filter out failed images
    const validImages = images.filter((_, idx) => !failedImages.has(idx));

    if (!images || images.length === 0 || validImages.length === 0) {
        return (
            <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden flex flex-col items-center justify-center">
                <Image
                    src="/nike_logo.png"
                    alt="Nike"
                    width={80}
                    height={80}
                    className="opacity-20 mb-4"
                />
                <span className="text-sm text-foreground/30 font-medium uppercase tracking-wider">
                    Image Coming Soon
                </span>
            </div>
        );
    }

    // Adjust activeImage if current one failed
    const safeActiveImage = failedImages.has(activeImage)
        ? validImages.length > 0 ? images.indexOf(validImages[0]) : 0
        : activeImage;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 sticky top-20 self-start">
            {/* Thumbnails (Desktop) */}
            {validImages.length > 1 && (
                <div className="hidden lg:flex flex-col gap-3">
                    {images.map((img, idx) => {
                        if (failedImages.has(idx)) return null;
                        return (
                            <button
                                key={idx}
                                className={cn(
                                    "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 bg-[#f5f5f5]",
                                    safeActiveImage === idx ? "border-black" : "border-transparent"
                                )}
                                onMouseEnter={() => setActiveImage(idx)}
                                onClick={() => setActiveImage(idx)}
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} - Image ${idx + 1}`}
                                    fill
                                    className="object-contain p-1"
                                    sizes="64px"
                                    onError={() => handleImageError(idx)}
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden flex-1 group">
                <Image
                    src={images[safeActiveImage]}
                    alt={productName}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={() => handleImageError(safeActiveImage)}
                />
            </div>

            {/* Mobile Dots */}
            {validImages.length > 1 && (
                <div className="flex justify-center gap-2 lg:hidden">
                    {images.map((_, idx) => {
                        if (failedImages.has(idx)) return null;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    safeActiveImage === idx ? "bg-black w-6" : "bg-black/20"
                                )}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
