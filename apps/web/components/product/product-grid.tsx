import { ProductCard } from "./product-card";
import { cn } from "@nike/ui";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    category?: {
        name: string;
    };
    variants?: {
        color: string;
    }[];
}

interface ProductGridProps {
    products: Product[];
    className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-foreground-muted text-lg">No products found</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                className
            )}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductGrid;
