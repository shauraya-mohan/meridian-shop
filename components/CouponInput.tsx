"use client";

import { useState, type FormEvent } from "react";
import type { AppliedCoupon } from "@/hooks/useCartTotal";

type CouponInputProps = {
  /** Called with the coupon once it's applied, and with null when it's removed. */
  onChange?: (coupon: AppliedCoupon | null) => void;
};

type CouponResponse = {
  valid: boolean;
  code: string;
  percentOff: number;
};

type Status = "idle" | "checking" | "applied" | "invalid" | "error";

export function CouponInput({ onChange }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("checking");
    try {
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error(`Coupon check failed: ${response.status}`);
      const result = (await response.json()) as CouponResponse;

      if (result.valid) {
        const coupon = { code: result.code, percentOff: result.percentOff };
        setApplied(coupon);
        onChange?.(coupon);
        setStatus("applied");
      } else {
        setStatus("invalid");
      }
    } catch {
      setStatus("error");
    }
  }

  function removeCoupon() {
    setApplied(null);
    onChange?.(null);
    setCode("");
    setStatus("idle");
  }

  return (
    <section aria-labelledby="coupon-heading">
      <h2 id="coupon-heading" className="font-serif text-2xl text-ink">
        Discount code
      </h2>
      <form className="mt-6" onSubmit={applyCoupon}>
        <label htmlFor="coupon-code" className="block text-sm text-ink">
          Code
        </label>
        <div className="mt-2 flex gap-3">
          <input
            id="coupon-code"
            name="coupon-code"
            data-testid="coupon-input"
            autoComplete="off"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="h-11 flex-1 rounded-sm border border-line bg-paper px-3 text-sm uppercase text-ink focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            data-testid="coupon-apply"
            disabled={status === "checking"}
            className="h-11 rounded-sm border border-ink px-6 text-sm font-medium tracking-wide text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "checking" ? "Checking…" : "Apply"}
          </button>
        </div>
      </form>
      <div className="mt-3 flex min-h-6 items-baseline justify-between gap-4 text-sm">
        <p
          role="status"
          data-testid="coupon-status"
          className={status === "applied" ? "text-success" : "text-danger"}
        >
          {status === "applied" && applied
            ? `Coupon applied. ${applied.percentOff}% off your order.`
            : status === "invalid"
              ? "That code isn't valid."
              : status === "error"
                ? "We couldn't check that code. Please try again."
                : null}
        </p>
        {applied ? (
          <button
            type="button"
            onClick={removeCoupon}
            className="shrink-0 text-muted underline underline-offset-4 hover:text-ink"
          >
            Remove coupon
          </button>
        ) : null}
      </div>
    </section>
  );
}
