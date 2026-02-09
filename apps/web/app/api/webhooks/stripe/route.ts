import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, verifyWebhookSignature } from "@/lib/stripe";
import { prisma } from "@nike/database";
import { sendOrderConfirmation } from "@/lib/email";
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
            await handleCheckoutComplete(session);
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

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId || `order_${Date.now()}`;
    const customerEmail = session.customer_details?.email;

    // Get shipping address from customer_details (collect_shipping_address option)
    const customerAddress = session.customer_details?.address;
    const shippingAddressStr = customerAddress
        ? `${customerAddress.line1 || ""}, ${customerAddress.city || ""}, ${customerAddress.state || ""} ${customerAddress.postal_code || ""}, ${customerAddress.country || ""}`
        : "";

    // Fetch line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Create order in database
    try {
        const order = await prisma.order.create({
            data: {
                id: orderId,
                userId: session.client_reference_id || null,
                status: "CONFIRMED",
                total: session.amount_total ? session.amount_total / 100 : 0,
                shippingAddress: shippingAddressStr,
                stripeSessionId: session.id,
                items: {
                    create: lineItems.data.map((item) => ({
                        productId: (item.price?.product as string) || "unknown",
                        productName: item.description || "Product",
                        quantity: item.quantity || 1,
                        price: item.amount_total ? item.amount_total / 100 : 0,
                    })),
                },
            },
        });

        console.log("Order created:", order.id);
    } catch (error) {
        console.error("Failed to create order:", error);
    }

    // Send confirmation email
    if (customerEmail) {
        try {
            await sendOrderConfirmation({
                to: customerEmail,
                orderNumber: orderId,
                items: lineItems.data.map((item) => ({
                    name: item.description || "Product",
                    quantity: item.quantity || 1,
                    price: item.amount_total || 0,
                })),
                total: session.amount_total || 0,
                shippingAddress: shippingAddressStr || "N/A",
            });
            console.log("Confirmation email sent to:", customerEmail);
        } catch (error) {
            console.error("Failed to send confirmation email:", error);
        }
    }
}
