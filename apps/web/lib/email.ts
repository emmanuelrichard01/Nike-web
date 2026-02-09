import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.FROM_EMAIL || "noreply@nike-store.com";

// Order confirmation email
export async function sendOrderConfirmation({
    to,
    orderNumber,
    items,
    total,
    shippingAddress,
}: {
    to: string;
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
}) {
    const itemsHtml = items
        .map(
            (item) =>
                `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
        </tr>`
        )
        .join("");

    return resend.emails.send({
        from: `Nike Store <${fromEmail}>`,
        to,
        subject: `Order Confirmed - ${orderNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #111; color: #fff; padding: 24px; text-align: center; }
            .content { padding: 32px 24px; }
            .order-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            .order-table th { text-align: left; padding: 12px; background: #f8f8f8; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 16px; }
            .footer { background: #f8f8f8; padding: 24px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">✓ Order Confirmed</h1>
            </div>
            <div class="content">
              <p>Thank you for your order!</p>
              <p><strong>Order Number:</strong> ${orderNumber}</p>
              
              <table class="order-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div class="total">Total: $${(total / 100).toFixed(2)}</div>
              
              <h3>Shipping Address</h3>
              <p>${shippingAddress}</p>
            </div>
            <div class="footer">
              <p>Nike Store - Just Do It</p>
              <p>Questions? Contact us at support@nike-store.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
}

// Password reset email  
export async function sendPasswordReset({
    to,
    resetUrl,
}: {
    to: string;
    resetUrl: string;
}) {
    return resend.emails.send({
        from: `Nike Store <${fromEmail}>`,
        to,
        subject: "Reset Your Password",
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #111; color: #fff; padding: 24px; text-align: center; }
            .content { padding: 32px 24px; text-align: center; }
            .button { display: inline-block; background: #111; color: #fff !important; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; }
            .footer { background: #f8f8f8; padding: 24px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">Reset Password</h1>
            </div>
            <div class="content">
              <p>You requested to reset your password.</p>
              <p>Click the button below to create a new password:</p>
              <p style="margin: 32px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>
            <div class="footer">
              <p>Nike Store - Just Do It</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
}

// Welcome email
export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
    return resend.emails.send({
        from: `Nike Store <${fromEmail}>`,
        to,
        subject: "Welcome to Nike Store!",
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #111; color: #fff; padding: 32px; text-align: center; }
            .content { padding: 32px 24px; }
            .button { display: inline-block; background: #111; color: #fff !important; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; }
            .footer { background: #f8f8f8; padding: 24px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Welcome, ${name}!</h1>
            </div>
            <div class="content">
              <p>Thanks for joining Nike Store. You now have access to:</p>
              <ul>
                <li>Exclusive member-only products</li>
                <li>Early access to new releases</li>
                <li>Free shipping on orders over $100</li>
                <li>Easy order tracking</li>
              </ul>
              <p style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXTAUTH_URL}/products" class="button">Start Shopping</a>
              </p>
            </div>
            <div class="footer">
              <p>Nike Store - Just Do It</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
}
