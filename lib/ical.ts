import ICAL from "ical.js";
import { Provider, TimeSlot, getWorkingHoursForDate } from "./providers";

// Cache: icalUrl -> { data, fetchedAt }
const cache = new Map<string, { data: string; fetchedAt: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function fetchIcal(url: string): Promise<string> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }
  const res = await fetch(url, { next: { revalidate: 900 } });
  if (!res.ok) throw new Error(`Failed to fetch iCal: ${res.status}`);
  const data = await res.text();
  cache.set(url, { data, fetchedAt: Date.now() });
  return data;
}

interface BusyBlock {
  start: Date;
  end: Date;
}

function parseEventsForDate(icalData: string, targetDate: Date): BusyBlock[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jcal: any;
  try {
    jcal = ICAL.parse(icalData);
  } catch {
    return [];
  }

  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent");

  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  const busy: BusyBlock[] = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);

    // Handle recurring events
    if (event.isRecurring()) {
      const iter = event.iterator();
      let next: ICAL.Time;
      // eslint-disable-next-line no-cond-assign
      while ((next = iter.next())) {
        const start = next.toJSDate();
        if (start > dayEnd) break;
        const duration = event.duration;
        const end = new Date(
          start.getTime() + duration.toSeconds() * 1000
        );
        if (end >= dayStart && start <= dayEnd) {
          busy.push({ start, end });
        }
      }
    } else {
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      if (end >= dayStart && start <= dayEnd) {
        busy.push({ start, end });
      }
    }
  }

  return busy;
}

// Vancouver is UTC-8 (PST) Nov–Mar, UTC-7 (PDT) Mar–Oct
function getVancouverUtcOffset(date: Date): number {
  const month = date.getUTCMonth(); // 0-indexed
  return month >= 3 && month <= 10 ? -7 : -8;
}

// Create a Date whose UTC value represents a given Vancouver local h:mm
function vancouverTime(date: Date, hour: number, minute: number): Date {
  const offset = getVancouverUtcOffset(date);
  const d = new Date(date);
  d.setUTCHours(hour - offset, minute, 0, 0);
  return d;
}

function buildSlots(
  date: Date,
  startTime: string,
  endTime: string,
  slotDuration: number,
  busyBlocks: BusyBlock[]
): TimeSlot[] {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const slots: TimeSlot[] = [];
  const cursor = vancouverTime(date, startHour, startMin);
  const workEnd = vancouverTime(date, endHour, endMin);

  while (cursor.getTime() + slotDuration * 60_000 <= workEnd.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + slotDuration * 60_000);

    // Slot is free if no busy block overlaps it
    const blocked = busyBlocks.some(
      (b) => b.start < slotEnd && b.end > slotStart
    );

    if (!blocked) {
      slots.push({ start: slotStart, end: slotEnd });
    }

    cursor.setTime(cursor.getTime() + slotDuration * 60_000);
  }

  return slots;
}

export async function getAvailableSlots(
  provider: Provider,
  date: Date
): Promise<TimeSlot[]> {
  const hours = getWorkingHoursForDate(provider, date);
  if (!hours) return []; // Closed that day

  let busyBlocks: BusyBlock[] = [];

  // Only fetch if a real URL is configured
  if (
    provider.icalUrl &&
    !provider.icalUrl.startsWith("PLACEHOLDER")
  ) {
    try {
      const icalData = await fetchIcal(provider.icalUrl);
      busyBlocks = parseEventsForDate(icalData, date);
    } catch (err) {
      console.error(`iCal fetch failed for ${provider.id}:`, err);
      // Fall through with empty busy blocks — show all slots
    }
  }

  return buildSlots(
    date,
    hours.start,
    hours.end,
    provider.slotDuration,
    busyBlocks
  );
}
