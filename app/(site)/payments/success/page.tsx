"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/stores/useCartStore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import { toast } from "sonner";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { user } = useUser();
  const [emailSent, setEmailSent] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!orderId || !user || emailSent) return;

    // Fetch order to get reference + details for email
    fetch(`/api/orders/${orderId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (order) => {
        if (!order) return;
        setOrderRef(order.reference);

        const userEmail = user.primaryEmailAddress?.emailAddress;
        const userName = user.firstName ?? user.fullName ?? "Customer";

        if (!userEmail) return;

        await sendOrderConfirmationEmail({
          to_email: userEmail,
          to_name: userName,
          order_reference: order.reference ?? orderId,
          order_address: order.address,
          order_total: `₦${Number(order.total_cost).toLocaleString()}`,
          order_items: `${order.order_items?.length ?? 0} item${order.order_items?.length !== 1 ? "s" : ""}`,
          tracking_url: `${window.location.origin}/order-tracking`,
        }).catch((err) => {
          console.error("Email send failed:", err);
          toast.error(
            "We couldn't send your confirmation email, but your order is confirmed.",
          );
        });

        setEmailSent(true);
      })
      .catch(console.error);
  }, [orderId, user, emailSent]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-black uppercase mb-3">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">
        Your payment was successful. We&apos;ll process your order right away.
      </p>
      {orderRef && (
        <p className="text-xs text-muted-foreground mb-2 font-mono bg-muted px-3 py-1 rounded-full inline-block">
          {orderRef}
        </p>
      )}
      {emailSent && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-6">
          ✓ Confirmation email sent
        </p>
      )}
      {!emailSent && (
        <p className="text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" /> Sending confirmation
          email…
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
        >
          <Link href="/order-tracking">
            <Package className="h-4 w-4" />
            Track Order
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Suspense
        fallback={
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Processing your order…</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
