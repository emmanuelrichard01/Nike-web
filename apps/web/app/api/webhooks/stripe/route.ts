import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, verifyWebhookSignature } from "@/lib/stripe";
import { createOrderFromSession } from "@/lib/order";
import type Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = verifyWebhookSignature(body, signature);
    } catch (error) {
        console.error("Webhook signature verification failed:", error);
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            try {
                await createOrderFromSession(session);
            } catch (error) {
                console.error("Error processing checkout.session.completed:", error);
                return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
            }
            break;
        }
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("Payment succeeded:", paymentIntent.id);
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("Payment failed:", paymentIntent.id);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
