// Active promotions, keyed by code, as percent off the order subtotal.
const PROMOTIONS: Record<string, number> = {
  SAVE20: 20,
  SAVE10: 10,
  WELCOME: 15,
};

// Hold the response briefly so the "Checking…" state reads as a real
// round trip instead of a flicker.
const RESPONSE_DELAY_MS = 250;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";

  await new Promise((resolve) => setTimeout(resolve, RESPONSE_DELAY_MS));

  if (code && !Object.hasOwn(PROMOTIONS, code)) {
    return Response.json({ valid: false, code, percentOff: 0 });
  }

  return Response.json({ valid: true, code, percentOff: PROMOTIONS[code] ?? 0 });
}
