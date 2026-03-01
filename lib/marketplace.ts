import { TimeSlot } from "./providers";
import { request as undiciRequest } from "undici";

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

  // Use undici.request() directly to bypass Next.js fetch patching.
  // The marketplace WAF checks User-Agent + Accept headers, so we include them.
  const reqBody = JSON.stringify({ maxResults, boundingBox: bounds, discipline, latitude: lat, longitude: lng });
  console.log(`[marketplace] POST body: ${reqBody.slice(0, 200)}`);

  let statusCode: number;
  let responseBody: Awaited<ReturnType<typeof undiciRequest>>["body"];
  try {
    ({ statusCode, body: responseBody } = await undiciRequest(`${API}/practitioners/search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "origin": ORIGIN,
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: reqBody,
    }));
  } catch (err) {
    console.error("[marketplace] searchPractitioners error:", err);
    return [];
  }

  console.log(`[marketplace] search ${discipline} → HTTP ${statusCode}`);
  if (statusCode < 200 || statusCode >= 300) {
    const errText = await responseBody.text();
    console.error(`[marketplace] search ${discipline} error body:`, errText.slice(0, 300));
    return [];
  }

  const data = await responseBody.json() as { results?: MarketplacePractitioner[] };
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

  let openStatusCode: number;
  let openBody: Awaited<ReturnType<typeof undiciRequest>>["body"];
  try {
    ({ statusCode: openStatusCode, body: openBody } = await undiciRequest(
      `${API}/practitioners/${staffMemberGuid}/location/${locationId}/openings`,
      {
        headers: {
          "origin": ORIGIN,
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    ));
  } catch (err) {
    console.warn(`[marketplace] openings fetch error for ${staffMemberGuid}/${locationId}:`, err);
    return [];
  }

  if (openStatusCode < 200 || openStatusCode >= 300) {
    console.warn(`[marketplace] openings fetch failed: ${openStatusCode} for ${staffMemberGuid}/${locationId}`);
    return [];
  }

  const data = await openBody.json() as { openings?: { start: string; end: string }[] };
  const slots: TimeSlot[] = (data.openings ?? []).map(
    (o) => ({
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
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    top: round2(lat + latDeg),
    right: round2(lng + lngDeg),
    bottom: round2(lat - latDeg),
    left: round2(lng - lngDeg),
  };
}
