import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature failed" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (order) {
        // 1. Mark order paid
        await supabaseAdmin
          .from("orders")
          .update({ status: "paid", stripe_session_id: session.id })
          .eq("id", orderId);

        // 2. Decrement stock + increment sold for each item
        for (const item of order.order_items ?? []) {
          await supabaseAdmin.rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }
      }
    }
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
