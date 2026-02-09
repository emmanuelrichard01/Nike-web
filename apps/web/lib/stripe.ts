import Stripe from "stripe";

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
});

// Helper: Create checkout session
export async function createCheckoutSession({
    items,
    customerId,
    successUrl,
    cancelUrl,
}: {
    items: Array<{
        name: string;
        description?: string;
        price: number; // in cents
        quantity: number;
        image?: string;
    }>;
    customerId?: string;
    successUrl: string;
    cancelUrl: string;
}) {
    const lineItems = items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.name,
                description: item.description,
                images: item.image ? [item.image] : [],
            },
            unit_amount: item.price,
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        customer: customerId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "DE", "FR"],
        },
        metadata: {
            orderId: `order_${Date.now()}`,
        },
    });

    return session;
}

// Helper: Retrieve session
export async function getCheckoutSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer", "payment_intent"],
    });
}

// Helper: Verify webhook signature
export function verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
) {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
    );
}
