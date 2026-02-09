import Link from "next/link";
import { prisma } from "@nike/database";
import { ProductGrid } from "@/components/product";
import { Button } from "@nike/ui";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
    title?: string;
    limit?: number;
}

export async function FeaturedProducts({
    title = "Featured Products",
    limit = 4,
}: FeaturedProductsProps) {
    const products = await prisma.product.findMany({
        take: limit,
        include: {
            category: true,
            variants: true,
        },
        orderBy: {
            id: "desc",
        },
    });

    // Convert Decimal to number for serialization
    const serializedProducts = products.map((product) => ({
        ...product,
        price: Number(product.price),
    }));

    return (
        <section className="py-20 bg-background">
            <div className="container-nike">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-display-md font-bold">{title}</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/products" className="group">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
                <ProductGrid products={serializedProducts} />
            </div>
        </section>
    );
}

export default FeaturedProducts;
