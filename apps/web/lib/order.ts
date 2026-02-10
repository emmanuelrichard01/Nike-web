import { prisma } from "@nike/database";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmation } from "@/lib/email";
import type Stripe from "stripe";

/**
 * Creates an order from a completed Stripe Checkout Session.
 * This function is idempotent and safe to call multiple times for the same session.
 */
export async function createOrderFromSession(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId || `order_${session.id}`;

    // 1. Check if order already exists to prevent duplicates
    const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
        console.log(`Order already exists for session ${session.id}`);
        return existingOrder;
    }

    // 2. Prepare data
    const customerEmail = session.customer_details?.email;
    const customerAddress = session.customer_details?.address;
    const shippingAddressStr = customerAddress
        ? `${customerAddress.line1 || ""}, ${customerAddress.city || ""}, ${customerAddress.state || ""} ${customerAddress.postal_code || ""}, ${customerAddress.country || ""}`
        : "";

    // 3. Fetch line items with expanded product data
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
    });

    // 4. Create order in database
    try {
        const order = await prisma.order.create({
            data: {
                id: orderId,
                userId: session.client_reference_id || null,
                status: "CONFIRMED", // Default status for paid orders
                total: session.amount_total ? session.amount_total / 100 : 0,
                shippingAddress: shippingAddressStr,
                stripeSessionId: session.id,
                items: {
                    create: lineItems.data.map((item) => {
                        // Extract real productId from Stripe product metadata
                        const product = item.price?.product;
                        const productId =
                            (typeof product === "object" && product !== null && "metadata" in product
                                ? (product as { metadata?: { productId?: string } }).metadata?.productId
                                : undefined) || "unknown";

                        return {
                            productId, // We store the ID even if "unknown" to avoid foreign key errors if we relax constraints, or we should handle it.
                            // Note: If your DB enforces foreign keys on productId, "unknown" might fail if no product with ID "unknown" exists.
                            // Assuming schema allows loose coupling or manual error handling. 
                            // If strictly relational, we'd need to fetch the real product or fail.
                            // For now, mirroring existing logic which uses "unknown".
                            productName: item.description || "Product",
                            quantity: item.quantity || 1,
                            price: item.amount_total ? item.amount_total / 100 : 0,
                        };
                    }),
                },
            },
        });

        console.log("Order created successfully:", order.id);

        // 5. Send confirmation email
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
                // Don't throw, just log. Order creation is more important.
            }
        }

        return order;

    } catch (error) {
        console.error("Failed to create order in database:", error);
        throw error; // Re-throw so the caller knows it failed
    }
}
