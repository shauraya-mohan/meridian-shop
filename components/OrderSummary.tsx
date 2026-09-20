import Image from "next/image";
import type { CartLine } from "@/hooks/useCart";
import type { CartTotals } from "@/hooks/useCartTotal";
import { formatPrice } from "@/lib/money";

type OrderSummaryProps = {
  lines: CartLine[];
  totals: CartTotals;
};

// useCartTotal has already applied any discount, so format the figures as-is.
const formatAmount = (cents: number) => formatPrice(cents, 0);

export function OrderSummary({ lines, totals }: OrderSummaryProps) {
  return (
    <section aria-labelledby="order-summary-heading" className="bg-surface px-8 py-8">
      <h2 id="order-summary-heading" className="font-serif text-2xl text-ink">
        Order summary
      </h2>

      <ul className="mt-6 divide-y divide-line/80">
        {lines.map((line) => (
          <li key={line.slug} data-testid={`summary-line-${line.slug}`} className="flex items-center gap-4 py-4">
            <div className="w-14 shrink-0 bg-paper">
              <Image
                src={line.product.image}
                alt=""
                width={1000}
                height={1250}
                loading="eager"
                sizes="56px"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink">{line.product.name}</p>
              <p className="text-xs text-muted">Qty {line.quantity}</p>
            </div>
            <p className="text-sm text-ink tabular-nums">{formatAmount(line.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-3 border-t border-line pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd data-testid="summary-subtotal" className="text-ink tabular-nums">
            {formatAmount(totals.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">
            Discount{totals.discountPct > 0 ? ` (${totals.discountPct}%)` : ""}
          </dt>
          <dd data-testid="summary-discount" className="text-ink tabular-nums">
            {totals.discount > 0 ? `−${formatAmount(totals.discount)}` : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-ink tabular-nums">
            {totals.shipping === 0 ? "Free" : formatAmount(totals.shipping)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="text-base text-ink">Total</dt>
          <dd
            data-testid="order-total"
            data-total-cents={totals.total}
            className="font-serif text-2xl text-ink tabular-nums"
          >
            {formatAmount(totals.total)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
