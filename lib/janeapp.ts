import { TimeSlot } from "./providers";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface JaneOpening {
  staff_member_id: number;
  location_id: number;
  treatment_id: number;
  duration: number; // seconds
  start_at: string; // ISO 8601 with timezone
  end_at: string;
  room_id: number | null;
  parent_appointment_id: number | null;
  status: string;
}

interface JaneStaffOpenings {
  id: number;
  full_name: string;
  first_date: string;
  openings: JaneOpening[];
  shifts: { start_at: string; end_at: string; call_to_book: boolean }[];
}

const cache = new Map<string, { data: JaneStaffOpenings[]; fetchedAt: number }>();

export async function getJaneOpenings(
  subdomain: string,
  staffMemberId: number,
  treatmentId: number,
  locationId: number,
  date: string, // YYYY-MM-DD
  numDays = 7
): Promise<TimeSlot[]> {
  const cacheKey = `${subdomain}:${staffMemberId}:${treatmentId}:${date}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return toTimeSlots(cached.data);
  }

  const params = new URLSearchParams({
    location_id: String(locationId),
    staff_member_id: String(staffMemberId),
    treatment_id: String(treatmentId),
    date,
    num_days: String(numDays),
  });

  const url = `https://${subdomain}.janeapp.com/api/v2/openings?${params}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 }, // 5-min Next.js cache
  });

  if (!res.ok) throw new Error(`Jane App API error: ${res.status} for ${subdomain}`);

  const data: JaneStaffOpenings[] = await res.json();
  cache.set(cacheKey, { data, fetchedAt: Date.now() });

  return toTimeSlots(data);
}

function toTimeSlots(data: JaneStaffOpenings[]): TimeSlot[] {
  return data.flatMap((staff) =>
    staff.openings.map((opening) => ({
      start: new Date(opening.start_at),
      end: new Date(opening.end_at),
    }))
  );
}
