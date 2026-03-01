import providersData from "@/data/providers.json";

export type DayHours = { start: string; end: string } | null;

export interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  neighborhood: string;
  lat: number;
  lng: number;
  bio: string;
  imageUrl: string;
  icalUrl: string;
  bookingUrl: string;
  slotDuration: number;
  // Jane App direct API config (replaces iCal when present)
  jane?: {
    subdomain: string;    // e.g. "organicwellness"
    locationId: number;
    staffMemberId: number;
    treatmentId: number;
  };
  workingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export function getAllProviders(): Provider[] {
  return providersData as Provider[];
}

export function getProviderById(id: string): Provider | undefined {
  return getAllProviders().find((p) => p.id === id);
}

export function getProvidersBySpecialty(specialty: string): Provider[] {
  return getAllProviders().filter((p) => p.specialty === specialty);
}

export function getWorkingHoursForDate(
  provider: Provider,
  date: Date
): DayHours {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const dayName = days[date.getDay()];
  return provider.workingHours[dayName];
}
