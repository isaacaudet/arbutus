import { NextRequest, NextResponse } from "next/server";
import { searchPractitioners, geocodeAddress, buildBounds } from "@/lib/marketplace";

const DISCIPLINE_MAP: Record<string, string> = {
  massage: "massage_therapy",
  physio:  "physiotherapy",
  chiro:   "chiropractic",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const address   = searchParams.get("address");
  const discipline = searchParams.get("discipline") ?? "massage";
  const radiusKm  = parseFloat(searchParams.get("radius") ?? "10");

  // Accept explicit lat/lng OR geocode an address string
  let lat = parseFloat(searchParams.get("lat") ?? "");
  let lng = parseFloat(searchParams.get("lng") ?? "");

  if ((isNaN(lat) || isNaN(lng)) && address) {
    const coords = await geocodeAddress(address);
    if (!coords) {
      return NextResponse.json({ error: "Could not geocode address" }, { status: 400 });
    }
    lat = coords.lat;
    lng = coords.lng;
  }

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Provide address= or lat= + lng= parameters" },
      { status: 400 }
    );
  }

  const janeDisc = DISCIPLINE_MAP[discipline] ?? discipline;
  const bounds   = buildBounds(lat, lng, radiusKm);

  const practitioners = await searchPractitioners(lat, lng, bounds, janeDisc);

  return NextResponse.json({
    query: { lat, lng, discipline: janeDisc, radiusKm },
    count: practitioners.length,
    practitioners,
    coverageNote:
      practitioners.length === 0
        ? "Jane's marketplace currently covers North Shore BC and Squamish BC. This location may not yet be in their coverage area."
        : null,
  });
}
