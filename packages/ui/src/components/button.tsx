import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0",
                accent:
                    "bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-0.5",
                outline:
                    "border border-border bg-transparent hover:border-foreground hover:bg-accent/5",
                secondary:
                    "bg-background-secondary text-foreground hover:bg-background-secondary/80",
                ghost: "hover:bg-accent/10 hover:text-accent",
                link: "text-accent underline-offset-4 hover:underline",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-nike",
                sm: "h-9 px-4 rounded-lg text-sm",
                lg: "h-14 px-8 rounded-nike text-base",
                icon: "h-10 w-10 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
