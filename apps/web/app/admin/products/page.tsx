import { prisma } from "@nike/database";
import { Button } from "@nike/ui";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const metadata = {
    title: "Products - Admin",
};

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            variants: true,
        },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-display-sm font-bold">Products</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <div className="bg-background-secondary rounded-card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Product</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Category</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Price</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold">Variants</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-background transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-border/30 rounded flex items-center justify-center">
                                            <span>👟</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-foreground-muted">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">{product.category.name}</td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    ${Number(product.price).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {product.variants.length} variants
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <form action={`/api/admin/products/${product.id}/delete`} method="POST">
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12 text-foreground-muted">
                        No products found. Add your first product!
                    </div>
                )}
            </div>
        </div>
    );
}
