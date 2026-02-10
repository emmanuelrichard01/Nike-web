import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";

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
        <div className="max-w-7xl">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">Products</h1>
                    <p className="text-sm text-black/40 mt-1">
                        {products.length} products · {totalStock} units in stock
                    </p>
                </div>
                <Button
                    asChild
                    className="rounded-xl bg-black text-white hover:bg-black/80 font-semibold h-10 px-5 text-sm"
                >
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            {/* ─── Table ─── */}
            <div className="bg-white rounded-2xl border border-black/[0.04] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/[0.04]">
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Product
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Category
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Price
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Variants
                            </th>
                            <th className="text-left px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Stock
                            </th>
                            <th className="text-right px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-black/30">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03]">
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
                                    className="hover:bg-black/[0.01] transition-colors"
                                >
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-11 rounded-xl bg-[#f5f5f5] overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {hasImage ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={44}
                                                        height={44}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <Package className="w-5 h-5 text-black/20" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-[11px] text-black/30 truncate">
                                                    {product.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="text-xs font-semibold bg-black/[0.04] text-black/60 px-2.5 py-1 rounded-lg">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm font-bold">
                                        ${Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3.5 text-sm text-black/50">
                                        {product.variants.length}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span
                                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${stock > 20
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : stock > 0
                                                        ? "bg-amber-50 text-amber-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            {stock > 0 ? `${stock} units` : "Out of stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                className="p-2 rounded-lg hover:bg-black/[0.04] text-black/30 hover:text-black transition-colors"
                                                title="View in store"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Link>
                                            <button
                                                className="p-2 rounded-lg hover:bg-black/[0.04] text-black/30 hover:text-black transition-colors"
                                                title="Edit product"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-red-50 text-black/30 hover:text-red-500 transition-colors"
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

                {products.length === 0 && (
                    <div className="py-16 text-center">
                        <Package className="w-10 h-10 text-black/10 mx-auto mb-3" />
                        <p className="font-semibold text-sm text-black/40">
                            No products yet
                        </p>
                        <p className="text-xs text-black/25 mt-1">
                            Add your first product to get started
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
