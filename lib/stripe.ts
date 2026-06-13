import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

export async function createStripeCheckoutSession({
  cartItems,
  userId,
  userEmail,
  currency,
  orderId,
  successUrl,
  cancelUrl,
}: {
  cartItems: Array<{ name: string; price: number; quantity: number; image?: string }>
  userId: string
  userEmail: string
  currency: string
  orderId: string
  successUrl: string
  cancelUrl: string
}) {
  const normalizedCurrency = currency.toLowerCase()
  const supportedCurrencies = ["usd", "gbp", "eur", "cad"]
  const finalCurrency = supportedCurrencies.includes(normalizedCurrency) ? normalizedCurrency : "usd"

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: finalCurrency,
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // in cents
      },
      quantity: item.quantity,
    })),
    metadata: { orderId, userId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}
