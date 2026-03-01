import { TimeSlot } from "./providers";
import { fetch as undiciFetch } from "undici";

const API = "https://marketplace-api.janeapp.net";
const ORIGIN = "https://discover.jane.app";
const CACHE_TTL = 5 * 60 * 1000;

export interface MarketplacePractitioner {
  staffMemberGuid: string;         // e.g. "3856-136"
  clinicLocationGuid: string;      // e.g. "3856-1"
  fullName: string;
  clinicName: string;
  clinicBookingUrl: string;
  photo: string | null;
  description: string | null;
  practitionerDisciplines: string[];
  disciplines: string[];
  locationCoordinates: { latitude: number; longitude: number };
  streetAddress: string;
  city: string;
  province: string;
  postal: string;
  firstOpening: { startAt: string } | null;
}

const searchCache = new Map<string, { data: MarketplacePractitioner[]; t: number }>();
const openingsCache = new Map<string, { data: TimeSlot[]; t: number }>();

/**
 * Search Jane App's marketplace for practitioners near a location.
 * Currently covers North Shore BC and Squamish BC.
 * Returns [] for unsupported areas (e.g., Victoria BC).
 */
export async function searchPractitioners(
  lat: number,
  lng: number,
  bounds: { top: number; right: number; bottom: number; left: number },
  discipline: string,
  maxResults = 50
): Promise<MarketplacePractitioner[]> {
  const key = `${lat.toFixed(4)}:${lng.toFixed(4)}:${discipline}`;
  const hit = searchCache.get(key);
  if (hit && hit.data.length > 0 && Date.now() - hit.t < CACHE_TTL) return hit.data;

  // Use undici directly — Next.js patches globalThis.fetch which breaks the
  // TLS fingerprint, causing the marketplace WAF to return 403.
  const body = JSON.stringify({ maxResults, boundingBox: bounds, discipline, latitude: lat, longitude: lng });

  let res: Awaited<ReturnType<typeof undiciFetch>>;
  try {
    res = await undiciFetch(`${API}/practitioners/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body,
    });
  } catch (err) {
    console.error("[marketplace] searchPractitioners error:", err);
    return [];
  }

  console.log(`[marketplace] search ${discipline} → HTTP ${res.status}`);
  if (!res.ok) return [];

  const data = await res.json() as { results?: MarketplacePractitioner[] };
  const result: MarketplacePractitioner[] = data.results ?? [];
  console.log(`[marketplace] search ${discipline} → ${result.length} practitioners`);
  searchCache.set(key, { data: result, t: Date.now() });
  return result;
}

/**
 * Get available time slots for a marketplace practitioner.
 * staffMemberGuid: e.g. "3856-136", locationId: e.g. 1
 */
export async function getMarketplaceOpenings(
  staffMemberGuid: string,
  locationId: number
): Promise<TimeSlot[]> {
  const key = `${staffMemberGuid}:${locationId}`;
  const hit = openingsCache.get(key);
  // Only use cache if result is non-empty (avoid serving stale empty arrays)
  if (hit && hit.data.length > 0 && Date.now() - hit.t < CACHE_TTL) return hit.data;

  const res = await fetch(
    `${API}/practitioners/${staffMemberGuid}/location/${locationId}/openings`,
    {
      headers: { Origin: ORIGIN },
      cache: "no-store", // always fresh — API says no-cache anyway
    }
  );

  if (!res.ok) {
    console.warn(`[marketplace] openings fetch failed: ${res.status} for ${staffMemberGuid}/${locationId}`);
    return [];
  }

  const data = await res.json();
  const slots: TimeSlot[] = (data.openings ?? []).map(
    (o: { start: string; end: string }) => ({
      start: new Date(o.start),
      end: new Date(o.end),
    })
  );
  console.log(`[marketplace] ${staffMemberGuid}/${locationId} → ${slots.length} slots`);
  openingsCache.set(key, { data: slots, t: Date.now() });
  return slots;
}

/**
 * Geocode an address to lat/lng using Nominatim (free, no API key).
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({
    q: address,
    format: "json",
    limit: "1",
    countrycodes: "ca",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: { "User-Agent": "ArbutusBooking/1.0" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data[0]) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

/**
 * Build a bounding box for a given center point and radius in km.
 */
export function buildBounds(
  lat: number,
  lng: number,
  radiusKm: number
): { top: number; right: number; bottom: number; left: number } {
  const latDeg = radiusKm / 111;
  const lngDeg = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    top: lat + latDeg,
    right: lng + lngDeg,
    bottom: lat - latDeg,
    left: lng - lngDeg,
  };
}
