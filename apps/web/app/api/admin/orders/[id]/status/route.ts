import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@nike/database";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { role: true },
    });

    if (user?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const status = formData.get("status") as string;
        const { status: validStatus } = statusSchema.parse({ status });

        await prisma.order.update({
            where: { id },
            data: { status: validStatus },
        });

        return NextResponse.redirect(new URL("/admin/orders", request.url));
    } catch (error) {
        console.error("Failed to update order status:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
