"use client";
import { useCart } from "@/stores/useCartStore";
import { useUserPrefs } from "@/stores/useUserPrefs";
import { useQuery } from "@tanstack/react-query";
import { getRateByIdQueryOptions, listRatesQueryOptions } from "@/lib/api";
import {
  X,
  SquareMinus,
  SquarePlus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrencySymbol } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotalPrice,
  } = useCart();
  const { rateId } = useUserPrefs();
  const { data: rates } = useQuery(listRatesQueryOptions);
  const { data: rateDetails } = useQuery(
    getRateByIdQueryOptions(rateId || rates?.[0]?.id || ""),
  );

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const rate = rateDetails?.naira_rate ?? 1;
  const symbol = getCurrencySymbol(rateDetails?.currency ?? "NGN");

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background shadow-xl z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            Cart ({cart.length})
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="font-medium">Your cart is empty</p>
            <Button asChild variant="outline" onClick={onClose}>
              <Link href="/store">Browse Store</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b last:border-0"
                >
                  <div className="relative h-20 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-amber-500 font-medium text-sm">
                      {symbol}
                      {(item.price / rate).toFixed(2)}
                    </p>
                    {item.sizes?.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Size: {item.sizes.join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="hover:text-amber-500 transition-colors"
                      >
                        <SquareMinus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="hover:text-amber-500 transition-colors"
                      >
                        <SquarePlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-amber-500">
                  {symbol}
                  {(cartTotalPrice() / rate).toFixed(2)}
                </span>
              </div>
              <Button
                asChild
                className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2"
                onClick={onClose}
              >
                <Link href="/checkout">
                  Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                asChild
              >
                <Link href="/store">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
