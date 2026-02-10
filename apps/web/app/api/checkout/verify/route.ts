import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrderFromSession } from "@/lib/order";
import { prisma } from "@nike/database";

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
        }

        // 1. Check if order already exists in our DB
        const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: sessionId },
        });

        if (existingOrder) {
            return NextResponse.json({
                success: true,
                order: existingOrder,
                message: "Order already verified"
            });
        }

        // 2. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "customer", "payment_intent"],
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        if (session.payment_status !== "paid") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        // 3. Create order using shared logic
        const order = await createOrderFromSession(session);

        return NextResponse.json({
            success: true,
            order,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Order verification failed:", error);
        return NextResponse.json(
            { error: "Failed to verify order" },
            { status: 500 }
        );
    }
}
