import { useMemo } from "react";
import { useCartLines } from "@/hooks/useCart";
import { discountAmount } from "@/lib/money";

// Shipping is complimentary on every order for now.
const SHIPPING_CENTS = 0;

export type AppliedCoupon = {
  code: string;
  percentOff: number;
};

export function useCartTotal(coupon: AppliedCoupon | null = null) {
  const lines = useCartLines();

  return useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
    const discountPct = coupon?.percentOff ?? 0;
    const discount = discountAmount(subtotal, discountPct);
    const shipping = SHIPPING_CENTS;

    return {
      subtotal,
      discountPct,
      discount,
      shipping,
      total: subtotal - discount + shipping,
      itemCount,
    };
  }, [lines, coupon]);
}

export type CartTotals = ReturnType<typeof useCartTotal>;
