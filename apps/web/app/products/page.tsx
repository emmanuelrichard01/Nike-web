import { Suspense } from "react";
import { prisma, Prisma } from "@nike/database";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Skeleton, Button } from "@nike/ui";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface ProductsPageProps {
    searchParams: {
        category?: string;
        page?: string;
        sort?: string;
    };
}

export const metadata = {
    title: "All Products | Nike",
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
        }).catch((e) => {
            console.error("Failed to fetch products:", e);
            return [];
        }),
        prisma.product.count({ where }).catch((e) => {
            console.error("Failed to count products:", e);
            return 0;
        }),
        prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        }).catch((e) => {
            console.error("Failed to fetch categories:", e);
            return [];
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const serializedProducts = products.map((product) => ({
        ...product,
        price: Number(product.price),
    }));

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            <FilterSidebar categories={categories} />

            <div className="flex-1">
                {/* Results Count & Sort */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                    <p className="text-sm text-black/50">
                        <span className="font-semibold text-black">{total}</span> Results
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-black/50">Sort by:</span>
                            <select
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                                defaultValue={sort || "newest"}
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <ProductGrid products={serializedProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-black/5">
                        {page > 1 && (
                            <Link
                                href={`/products?${category ? `category=${category}&` : ""}${sort ? `sort=${sort}&` : ""}page=${page - 1}`}
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full h-12 px-6 font-semibold hover:bg-black hover:text-white transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                            </Link>
                        )}

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 mx-4">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const pageNum = i + 1;
                                const isActive = pageNum === page;
                                return (
                                    <Link
                                        key={pageNum}
                                        href={`/products?${category ? `category=${category}&` : ""}${sort ? `sort=${sort}&` : ""}page=${pageNum}`}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${isActive
                                            ? "bg-black text-white"
                                            : "hover:bg-black/5"
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                            {totalPages > 5 && (
                                <span className="px-2 text-black/30">...</span>
                            )}
                        </div>

                        {page < totalPages && (
                            <Link
                                href={`/products?${category ? `category=${category}&` : ""}${sort ? `sort=${sort}&` : ""}page=${page + 1}`}
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full h-12 px-6 font-semibold hover:bg-black hover:text-white transition-all"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
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
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-64 space-y-8">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-xl" />
                    ))}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between mb-8 pb-4 border-b border-black/5">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square rounded-2xl" />
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

    const categoryTitle = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "All Products";

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Hero Header */}
            <div className="bg-white border-b border-black/5">
                <div className="container-nike py-12 md:py-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-black/40 mb-6">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-black font-medium">{categoryTitle}</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="w-12 h-1 bg-[#c0ff00] rounded-full mb-4" />
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                                {categoryTitle}
                            </h1>
                            <p className="text-black/40 mt-3 text-lg max-w-lg">
                                Discover the latest Nike innovations. From running to lifestyle, find your perfect fit.
                            </p>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <Button
                            variant="outline"
                            className="lg:hidden rounded-full h-12 px-5"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-nike py-10 lg:py-14">
                <Suspense fallback={<ProductsLoading />}>
                    <ProductsContent category={category} page={page} sort={sort} />
                </Suspense>
            </div>
        </div>
    );
}
