"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CouponInput } from "@/components/CouponInput";
import { OrderSummary } from "@/components/OrderSummary";
import { ShippingForm } from "@/components/ShippingForm";
import { useCart, useCartLines } from "@/hooks/useCart";
import { useCartTotal } from "@/hooks/useCartTotal";
import { saveOrder } from "@/lib/storage";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const lines = useCartLines();
  const totals = useCartTotal();
  const [status, setStatus] = useState<"idle" | "placing" | "placed" | "error">("idle");

  async function placeOrder() {
    setStatus("placing");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error(`Order request failed: ${response.status}`);
      const { orderId } = (await response.json()) as { orderId: string };

      saveOrder({
        id: orderId,
        lines: lines.map((line) => ({
          slug: line.slug,
          name: line.product.name,
          image: line.product.image,
          quantity: line.quantity,
          lineTotal: line.lineTotal,
        })),
        total: totals.total,
      });
      setStatus("placed");
      clear();
      router.push(`/order/${orderId}`);
    } catch {
      setStatus("error");
    }
  }

  if (!ready) {
    return <CheckoutHeading />;
  }

  if (status === "placed") {
    return (
      <>
        <CheckoutHeading />
        <p className="mx-auto max-w-6xl px-6 py-12 text-muted">Order placed. One moment…</p>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <CheckoutHeading />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-lg text-muted">There is nothing in your cart to check out.</p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-sm bg-ink px-8 text-sm font-medium tracking-wide text-paper hover:bg-ink/85"
          >
            Browse the collection
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <CheckoutHeading />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-20">
        <div className="space-y-14">
          <ShippingForm />
          <CouponInput />
        </div>

        <div>
          <OrderSummary lines={lines} totals={totals} />
          <button
            type="button"
            data-testid="place-order"
            onClick={placeOrder}
            disabled={status === "placing"}
            className="mt-6 h-12 w-full rounded-sm bg-ink text-sm font-medium tracking-wide text-paper hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/60"
          >
            {status === "placing" ? "Placing order…" : "Place order"}
          </button>
          {status === "error" ? (
            <p role="alert" className="mt-4 text-sm text-danger">
              We couldn&apos;t place your order. Please try again.
            </p>
          ) : null}
          <p className="mt-4 text-center text-xs text-muted">
            By placing your order you agree to our terms of sale.
          </p>
        </div>
      </div>
    </>
  );
}

function CheckoutHeading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-16">
      <Link href="/cart" className="text-sm text-muted hover:text-ink">
        ← Back to cart
      </Link>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">Checkout</h1>
    </div>
  );
}
