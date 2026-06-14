"use client";
export const dynamic = "force-dynamic";
import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { sendOrderFailureEmail } from "@/lib/emailjs";

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { user } = useUser();

  const emailSentRef = useRef(false);

  useEffect(() => {
    if (!user || emailSentRef.current) return;

    const userEmail = user.primaryEmailAddress?.emailAddress;
    const userName = user.firstName ?? user.fullName ?? "Customer";

    if (!userEmail) return;

    emailSentRef.current = true;

    sendOrderFailureEmail({
      to_email: userEmail,
      to_name: userName,
      order_reference: orderId ?? "N/A",
      retry_url: `${window.location.origin}/checkout`,
    }).catch((err) => {
      console.error(err);
      emailSentRef.current = false; // optional retry on failure
    });
  }, [user, orderId]);

  return (
    <div className="text-center max-w-sm">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-black uppercase mb-3">Payment Failed</h1>
      <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
        Something went wrong with your payment. Your cart has been kept so you
        can try again.
      </p>
      <p className="text-muted-foreground text-xs mb-8">
        If you were charged, the amount will be refunded within 3-5 business
        days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
          <Link href="/checkout">Try Again</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div />}>
        <FailureContent />
      </Suspense>
    </div>
  );
}
