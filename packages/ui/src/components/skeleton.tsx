import * as React from "react";
import { cn } from "../utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-border/50",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
