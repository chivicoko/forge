"use client";
export const dynamic = "force-dynamic";
import { useCart } from "@/stores/useCartStore";
import { useUserPrefs } from "@/stores/useUserPrefs";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getRateByIdQueryOptions,
  listRatesQueryOptions,
  makeOrder,
} from "@/lib/api";
import { getCurrencySymbol } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Loader2,
  X,
  SquareMinus,
  SquarePlus,
  ArrowLeft,
} from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { useSyncExternalStore, useEffect } from "react";

const checkoutSchema = z.object({
  phone_number: z.string().min(7, "Valid phone number required"),
  streetNo: z.string().min(1, "Street address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  country: z.string().min(1, "Country required"),
  zip: z.string().optional(),
  payment_gateway: z.enum(["stripe"], {
    required_error: "Select a payment method",
  }),
});
type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotalPrice,
    cartCount,
    clearCart,
  } = useCart();
  const { rateId } = useUserPrefs();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { data: rates } = useQuery(listRatesQueryOptions);
  const effectiveRateId = rateId || rates?.[0]?.id || "";
  const { data: rateDetails } = useQuery(
    getRateByIdQueryOptions(effectiveRateId),
  );

  // Hydration-safe mounted flag — cart lives in localStorage
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Redirect to store if cart is empty (only after mount so we read real localStorage)
  useEffect(() => {
    if (mounted && cartCount() === 0) {
      toast.info("Your cart is empty");
      router.replace("/store");
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const rate = rateDetails?.naira_rate ?? 1;
  const symbol = getCurrencySymbol(rateDetails?.currency ?? "NGN");

  const mutation = useMutation({
    mutationFn: makeOrder,
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
      else {
        toast.success("Order placed!");
        clearCart();
        router.push("/order-tracking");
      }
    },
    onError: (err: Error) =>
      toast.error(err.message || "Order failed. Please try again."),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_gateway: "stripe" },
  });

  const onSubmit = (values: CheckoutData) => {
    if (!isSignedIn) {
      toast.error("Please sign in to checkout");
      return;
    }
    mutation.mutate({
      item: cart.map((i) => ({
        product: i.id,
        name: i.name,
        price: i.price / rate,
        quantity: i.quantity,
        color: i.colors ?? [],
        size: i.sizes ?? [],
        image: i.images?.[0],
      })),
      address: `${values.streetNo}, ${values.city}, ${values.state}, ${values.country}${values.zip ? ` ${values.zip}` : ""}`,
      phone_number: values.phone_number,
      payment_gateway: values.payment_gateway,
      currency: rateDetails?.currency ?? "NGN",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 pb-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/store">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase">Checkout</h1>
            <p className="text-sm text-muted-foreground">
              {mounted ? cartCount() : 0} item
              {mounted && cartCount() !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {!isSignedIn ? (
          <div className="max-w-sm mx-auto text-center py-16 space-y-4">
            <div className="text-6xl">🔒</div>
            <h2 className="text-xl font-bold">Sign in to continue</h2>
            <p className="text-muted-foreground text-sm">
              You need an account to complete your purchase.
            </p>
            <SignInButton mode="modal">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Sign In to Checkout
              </Button>
            </SignInButton>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid lg:grid-cols-5 gap-6"
          >
            {/* ── LEFT: billing + order summary ── */}
            <div className="lg:col-span-3 space-y-5">
              {/* Billing */}
              <div className="bg-background border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-6 rounded-full bg-amber-500 block" />
                  <h2 className="font-bold text-lg">Delivery Details</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "phone_number" as const,
                      label: "Phone Number*",
                      placeholder: "+234 903 473 9483",
                    },
                    {
                      name: "streetNo" as const,
                      label: "Street Address*",
                      placeholder: "4 Olukoya Azikiwe St.",
                    },
                    {
                      name: "city" as const,
                      label: "City*",
                      placeholder: "Lagos",
                    },
                    {
                      name: "state" as const,
                      label: "State / Province*",
                      placeholder: "Lagos State",
                    },
                    {
                      name: "country" as const,
                      label: "Country*",
                      placeholder: "Nigeria",
                    },
                    {
                      name: "zip" as const,
                      label: "ZIP / Postal Code",
                      placeholder: "100012",
                    },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                        {label}
                      </label>
                      <Input
                        {...register(name)}
                        placeholder={placeholder}
                        className="h-10"
                      />
                      {errors[name] && (
                        <p className="text-xs text-destructive mt-1">
                          {errors[name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order items */}
              <div className="bg-background border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-6 rounded-full bg-amber-500 block" />
                  <h2 className="font-bold text-lg">Your Items</h2>
                </div>
                {!mounted || cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Your cart is empty.</p>
                    <Button asChild variant="link" className="text-amber-500">
                      <Link href="/store">Browse store</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-4 border-b last:border-0"
                      >
                        <div className="relative h-18 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              👕
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-amber-500 font-bold text-sm">
                            {symbol}
                            {(item.price / rate).toFixed(2)}
                          </p>
                          {(item.sizes as string[])?.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Size: {(item.sizes as string[]).join(", ")}
                            </p>
                          )}
                          {(item.colors as string[])?.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Colour: {(item.colors as string[]).join(", ")}
                            </p>
                          )}
                          {/* Quantity stepper — stays in sync with cart store */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              aria-label="Decrease"
                            >
                              <SquareMinus className="h-4 w-4 hover:text-amber-500 transition-colors" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              aria-label="Increase"
                            >
                              <SquarePlus className="h-4 w-4 hover:text-amber-500 transition-colors" />
                            </button>
                            <span className="text-xs text-muted-foreground ml-1">
                              = {symbol}
                              {((item.price * item.quantity) / rate).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="self-start text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: payment + totals ── */}
            <div className="lg:col-span-2">
              <div className="bg-background border rounded-2xl p-6 sticky top-20 space-y-5">
                {/* Totals */}
                <div>
                  <h2 className="font-bold text-lg mb-4">Order Total</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal ({mounted ? cartCount() : 0} items)
                      </span>
                      <span>
                        {symbol}
                        {mounted
                          ? (cartTotalPrice() / rate).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-black text-lg">
                      <span>Total</span>
                      <span className="text-amber-500">
                        {symbol}
                        {mounted
                          ? (cartTotalPrice() / rate).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <h2 className="font-bold mb-3">Payment</h2>
                  <label className="flex items-center gap-3 p-3 border-2 border-amber-500 rounded-xl bg-amber-500/5 cursor-pointer">
                    <input
                      type="radio"
                      {...register("payment_gateway")}
                      value="stripe"
                      className="accent-amber-500 w-4 h-4"
                      defaultChecked
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-semibold text-sm">Stripe</p>
                        <p className="text-xs text-muted-foreground">
                          Cards, Apple Pay, Google Pay
                        </p>
                      </div>
                    </div>
                  </label>
                  {errors.payment_gateway && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.payment_gateway.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending || !mounted || cart.length === 0}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base gap-2 rounded-xl"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting to Stripe…
                    </>
                  ) : (
                    `Pay ${symbol}${mounted ? (cartTotalPrice() / rate).toFixed(2) : "0.00"}`
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
                  <span>256-bit SSL encryption via Stripe</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
