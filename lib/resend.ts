import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailProps {
  to: string;
  orderReference: string;
  orderId: string;
  address: string;
  totalCost: number;
  itemCount: number;
}

export async function sendOrderConfirmationEmail({
  to,
  orderReference,
  orderId,
  address,
  totalCost,
  itemCount,
}: OrderEmailProps) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject: `Order Confirmed — ${orderReference} | FORGE`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:32px 40px;text-align:center;">
            <span style="color:#F59E0B;font-size:28px;font-weight:900;letter-spacing:-1px;">⬡ FORGE</span>
          </td>
        </tr>
        <!-- Hero -->
        <tr>
          <td style="padding:40px 40px 24px;text-align:center;">
            <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
              <span style="font-size:28px;">✓</span>
            </div>
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#111;letter-spacing:-0.5px;">Order Confirmed!</h1>
            <p style="margin:0;color:#666;font-size:15px;">Your payment was successful. We're on it.</p>
          </td>
        </tr>
        <!-- Order details -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:12px;padding:24px;">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eee;">
                  <span style="color:#888;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order Reference</span><br>
                  <span style="color:#111;font-size:15px;font-weight:700;font-family:monospace;">${orderReference}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 8px;border-bottom:1px solid #eee;">
                  <span style="color:#888;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Delivery Address</span><br>
                  <span style="color:#111;font-size:14px;">${address}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 8px;border-bottom:1px solid #eee;">
                  <span style="color:#888;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Items</span><br>
                  <span style="color:#111;font-size:14px;">${itemCount} item${itemCount !== 1 ? "s" : ""}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;">
                  <span style="color:#888;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Total Paid</span><br>
                  <span style="color:#F59E0B;font-size:20px;font-weight:900;">₦${totalCost.toLocaleString()}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 40px;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/order-tracking"
               style="display:inline-block;background:#F59E0B;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:99px;">
              Track Your Order →
            </a>
            <p style="margin:20px 0 0;color:#999;font-size:13px;">
              Questions? Reply to this email or contact us at <a href="mailto:wearsbyforge@gmail.com" style="color:#F59E0B;">wearsbyforge@gmail.com</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#aaa;font-size:12px;">© 2025 FORGE — Premium Men's Bodywear</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendOrderFailureEmail({
  to,
  orderReference,
  orderId,
}: Pick<OrderEmailProps, "to" | "orderReference" | "orderId">) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject: `Payment Issue — ${orderReference} | FORGE`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#111;padding:32px 40px;text-align:center;">
          <span style="color:#F59E0B;font-size:28px;font-weight:900;">⬡ FORGE</span>
        </td></tr>
        <tr><td style="padding:40px;text-align:center;">
          <div style="width:64px;height:64px;background:#fee2e2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
            <span style="font-size:28px;">✕</span>
          </div>
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#111;">Payment Unsuccessful</h1>
          <p style="color:#666;font-size:15px;margin:0 0 8px;">Your order <strong style="font-family:monospace;">${orderReference}</strong> could not be completed.</p>
          <p style="color:#666;font-size:14px;margin:0 0 32px;">Your cart has been kept — you can try again anytime.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout"
             style="display:inline-block;background:#F59E0B;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:99px;">
            Try Again →
          </a>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;color:#aaa;font-size:12px;">© 2025 FORGE — Premium Men's Bodywear</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
