import emailjs from "emailjs-com";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export const ORDER_CONFIRMATION_TEMPLATE =
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID!;
export const ORDER_FAILURE_TEMPLATE =
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_FAILURE_TEMPLATE_ID!;

export interface OrderConfirmationParams {
  to_email: string;
  to_name: string;
  order_reference: string;
  order_address: string;
  order_total: string;
  order_items: string; // human-readable e.g. "3 items"
  tracking_url: string;
}

export interface OrderFailureParams {
  to_email: string;
  to_name: string;
  order_reference: string;
  retry_url: string;
}

export async function sendOrderConfirmationEmail(
  params: OrderConfirmationParams,
) {
  return emailjs.send(
    SERVICE_ID,
    ORDER_CONFIRMATION_TEMPLATE,
    params as unknown as Record<string, unknown>,
    PUBLIC_KEY,
  );
}

export async function sendOrderFailureEmail(params: OrderFailureParams) {
  return emailjs.send(
    SERVICE_ID,
    ORDER_FAILURE_TEMPLATE,
    params as unknown as Record<string, unknown>,
    PUBLIC_KEY,
  );
}
