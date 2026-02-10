import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package, Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";

export const metadata = {
    title: "Products — Admin | Nike",
};

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            variants: true,
        },
        orderBy: { name: "asc" },
    });

    const totalStock = products.reduce(
        (sum, p) => sum + p.variants.reduce((vs, v) => vs + v.stock, 0),
        0
    );

    return (
        <div className="space-y-8">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-black">Products</h1>
                    <p className="text-black/40 font-medium mt-1">
                        Manage your product catalog and inventory.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/[0.06] shadow-sm">
                        <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Total Inventory:</span>
                        <span className="text-sm font-bold text-black">{totalStock.toLocaleString()} units</span>
                    </div>
                    <Button
                        asChild
                        className="rounded-full bg-black text-white hover:bg-[#CCFF00] hover:text-black font-bold h-10 px-6 text-sm transition-all duration-300"
                    >
                        <Link href="/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            {/* ─── Filters & Actions ─── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[1.5rem] border border-black/[0.04] shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/[0.03] border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/[0.02] transition-all text-sm font-medium placeholder:text-black/30"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl text-sm font-bold text-black/60 hover:text-black hover:border-black/20 transition-all">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-xl text-sm font-bold text-black/60 hover:text-black hover:border-black/20 transition-all">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort
                    </button>
                </div>
            </div>

            {/* ─── Data Grid ─── */}
            <div className="bg-white rounded-[2rem] border border-black/[0.04] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f9f9f9] border-b border-black/[0.04]">
                            <tr>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Product</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Category</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Price</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Variants</th>
                                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Stock Status</th>
                                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                            {products.map((product) => {
                                const stock = product.variants.reduce(
                                    (sum, v) => sum + v.stock,
                                    0
                                );
                                const hasImage =
                                    product.images && product.images.length > 0;

                                return (
                                    <tr
                                        key={product.id}
                                        className="group hover:bg-[#F5F5F7] transition-all duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-2xl bg-white border border-black/[0.04] overflow-hidden flex items-center justify-center flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                                    {hasImage ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-black/10" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-black group-hover:text-blue-600 transition-colors truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-black/40 font-medium truncate mt-0.5">
                                                        SKU: {product.slug.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-black/[0.03] text-xs font-bold text-black/60 border border-black/[0.02]">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-sm text-black">
                                                ${Number(product.price).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {product.variants.slice(0, 3).map((v, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center text-[10px] font-bold text-black/60 shadow-sm z-10" title={`${v.size} / ${v.color}`}>
                                                        {v.size.charAt(0)}
                                                    </div>
                                                ))}
                                                {product.variants.length > 3 && (
                                                    <div className="w-6 h-6 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-[9px] font-bold text-black/40 ml-1">
                                                        +{product.variants.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${stock > 20 ? "bg-emerald-500" : stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                                                <span
                                                    className={`text-xs font-bold ${stock > 20
                                                        ? "text-emerald-600"
                                                        : stock > 0
                                                            ? "text-amber-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    {stock > 0 ? `${stock} in stock` : "Out of stock"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                                                    title="View in store"
                                                >
                                                    <Search className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    className="p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                                                    title="Edit product"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="p-2 rounded-full hover:bg-red-50 text-black/40 hover:text-red-600 transition-colors"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="py-24 text-center bg-black/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-black/[0.03] flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-black/20" />
                        </div>
                        <h3 className="font-bold text-lg text-black">No products found</h3>
                        <p className="text-sm text-black/40 mt-1 mb-6 max-w-xs mx-auto">
                            Your inventory is empty. Add your first product to start selling.
                        </p>
                        <Button
                            asChild
                            className="rounded-full bg-black text-white hover:bg-black/80 font-bold h-10 px-6 text-sm"
                        >
                            <Link href="/admin/products/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Product
                            </Link>
                        </Button>
                    </div>
                )}

                {products.length > 0 && (
                    <div className="px-6 py-4 border-t border-black/[0.04] bg-[#f9f9f9] flex items-center justify-between">
                        <p className="text-xs font-medium text-black/40">Showing {products.length} products</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" disabled>Previous</Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg" disabled>Next</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
