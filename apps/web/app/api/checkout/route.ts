import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
    items: z.array(
        z.object({
            productId: z.string().optional(),
            id: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            size: z.string().optional(),
            color: z.string().optional(),
            image: z.string().optional(),
        })
    ),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = checkoutSchema.parse(body);

        if (items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        // Get the authenticated user so we can link the order
        const session = await getServerSession(authOptions);

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        const checkoutSession = await createCheckoutSession({
            items: items.map((item) => ({
                name: item.name,
                description: item.size ? `Size: ${item.size}${item.color ? ` • Color: ${item.color}` : ''}` : undefined,
                price: Math.round(item.price * 100), // Convert to cents
                quantity: item.quantity,
                image: item.image,
                productId: item.productId || item.id,
            })),
            clientReferenceId: session?.user?.id,
            successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${baseUrl}/cart`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}

