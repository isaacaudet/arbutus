import { NextResponse } from "next/server";
import { getMarketplaceOpenings } from "@/lib/marketplace";

export async function GET() {
  const now = new Date();
  const slots = await getMarketplaceOpenings("3856-136", 1);
  const future = slots.filter((s) => s.start > now);
  return NextResponse.json({
    now: now.toISOString(),
    totalSlots: slots.length,
    futureSlots: future.length,
    rawSlots: slots.map((s) => ({ start: s.start.toISOString(), isFuture: s.start > now })),
  });
}
