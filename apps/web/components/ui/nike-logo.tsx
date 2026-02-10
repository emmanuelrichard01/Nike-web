import Image from "next/image";
import { cn } from "@nike/ui";

interface NikeLogoProps {
    className?: string;
    variant?: "dark" | "light";
    size?: number;
}

export function NikeLogo({ className, variant = "dark", size = 40 }: NikeLogoProps) {
    return (
        <div className={cn("relative", className)} style={{ width: size, height: size }}>
            <Image
                src="/nike_logo.png"
                alt="Nike"
                fill
                className={cn(
                    "object-contain transition-all duration-300",
                    variant === "light" && "brightness-0 invert"
                )}
                priority
            />
        </div>
    );
}
