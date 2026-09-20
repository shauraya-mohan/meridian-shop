// All amounts are integer cents. Only convert to a display string at the edge.

export function lineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/** Cents taken off an amount by a percentage discount, rounded to the nearest cent. */
export function discountAmount(cents: number, percentOff: number): number {
  return Math.round((cents * percentOff) / 100);
}

/**
 * Formats cents as a dollar string. Pass `discountPct` to format the amount
 * after a percentage discount, so the discount is applied in one place rather
 * than at every call site.
 */
export function formatPrice(cents: number, discountPct = 0): string {
  const net = cents * (1 - discountPct / 100);
  return `$${(net / 100).toFixed(2)}`;
}
