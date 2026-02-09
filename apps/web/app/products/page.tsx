import { Suspense } from "react";
import { prisma, Prisma } from "@nike/database";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Skeleton } from "@nike/ui";
import { Button } from "@nike/ui"; // Keeping import if needed by other parts, but page mostly uses components now
import Link from "next/link";

interface ProductsPageProps {
    searchParams: {
        category?: string;
        page?: string;
        sort?: string;
    };
}

export const metadata = {
    title: "All Products",
    description: "Shop all Nike shoes and apparel",
};

async function ProductsContent({
    category,
    page,
    sort,
}: {
    category?: string;
    page: number;
    sort?: string;
}) {
    const limit = 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
        where.category = {
            slug: category,
        };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const [products, total, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: true,
                variants: true,
            },
            skip,
            take: limit,
            orderBy,
        }),
        prisma.product.count({ where }),
        prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Serialize Decimal to number
    const serializedProducts = products.map((product) => ({
        ...product,
        price: Number(product.price),
    }));

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar categories={categories} />

            <div className="flex-1">
                {/* Results Count */}
                <div className="mb-4 text-sm text-foreground-muted">
                    Showing {products.length} of {total} results
                </div>

                {/* Products Grid */}
                <ProductGrid products={serializedProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                        {page > 1 && (
                            <Link
                                href={`/products?${category ? `category=${category}&` : ""}${sort ? `sort=${sort}&` : ""}page=${page - 1}`}
                            >
                                <Button variant="outline">Previous</Button>
                            </Link>
                        )}
                        <span className="flex items-center px-4 text-foreground-muted">
                            Page {page} of {totalPages}
                        </span>
                        {page < totalPages && (
                            <Link
                                href={`/products?${category ? `category=${category}&` : ""}${sort ? `sort=${sort}&` : ""}page=${page + 1}`}
                            >
                                <Button variant="outline">Next</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductsLoading() {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-64 space-y-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square rounded-card" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
    const category = searchParams.category;
    const sort = searchParams.sort;
    const page = parseInt(searchParams.page || "1", 10);

    return (
        <div className="container-nike py-8 lg:py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-display-md font-bold mb-2">
                    {category
                        ? category.charAt(0).toUpperCase() + category.slice(1)
                        : "All Products"}
                </h1>
                <p className="text-foreground-muted">
                    Discover the latest Nike innovations
                </p>
            </div>

            <Suspense fallback={<ProductsLoading />}>
                <ProductsContent category={category} page={page} sort={sort} />
            </Suspense>
        </div>
    );
}
