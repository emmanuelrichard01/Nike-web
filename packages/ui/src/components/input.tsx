import * as React from "react";
import { cn } from "../utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm",
                    "placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-all duration-200",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };
