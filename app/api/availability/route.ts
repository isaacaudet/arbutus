import { NextRequest, NextResponse } from "next/server";
import { getAllProviders } from "@/lib/providers";
import { getAvailableSlots } from "@/lib/ical";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const providerId = searchParams.get("providerId");
  const dateStr = searchParams.get("date");

  if (!providerId || !dateStr) {
    return NextResponse.json(
      { error: "providerId and date are required" },
      { status: 400 }
    );
  }

  const providers = getAllProviders();
  const provider = providers.find((p) => p.id === providerId);

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const slots = await getAvailableSlots(provider, date);

  return NextResponse.json({
    providerId,
    date: dateStr,
    slots: slots.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
    })),
  });
}
