import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  color: string[];
  size: string[];
  image?: string;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = (sessionClaims?.email as string) ?? "";

  const body = await req.json();
  const {
    item: cartItems,
    address,
    phone_number,
    currency,
  } = body as {
    item: CartItem[];
    address: string;
    phone_number: string;
    currency: string;
  };

  // 1. Create order in Supabase
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: userId,
      address,
      phone_number,
      status: "pending",
      total_cost: cartItems.reduce(
        (acc: number, i: CartItem) => acc + i.price * i.quantity,
        0,
      ),
    })
    .select()
    .single();

  if (orderErr)
    return NextResponse.json({ error: orderErr.message }, { status: 500 });

  // 2. Insert order items
  const orderItems = cartItems.map((i: CartItem) => ({
    order_id: order.id,
    product_id: i.product,
    quantity: i.quantity,
    color: i.color?.join(",") ?? "",
    size: i.size?.join(",") ?? "",
    price: i.price,
  }));
  await supabaseAdmin.from("order_items").insert(orderItems);

  // 3. Create Stripe session
  const origin = req.headers.get("origin") || "http://localhost:3000";
  const session = await createStripeCheckoutSession({
    cartItems: cartItems.map((i: CartItem) => ({
      name: i.name || "Product",
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    })),
    userId,
    userEmail,
    currency,
    orderId: order.id,
    successUrl: `${origin}/payments/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
    cancelUrl: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url, orderId: order.id });
}
