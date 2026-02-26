import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/providers";
import { getAvailableSlots } from "@/lib/ical";
import { BookingClient } from "./BookingClient";

interface BookingPageProps {
  params: Promise<{ providerId: string }>;
  searchParams: Promise<{ slot?: string; date?: string }>;
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { providerId } = await params;
  const { slot, date: dateParam } = await searchParams;

  const provider = getProviderById(providerId);
  if (!provider) notFound();

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
  const date = dateParam ?? today;
  const targetDate = new Date(date + "T00:00:00");

  const allSlots = await getAvailableSlots(provider, targetDate);
  const now = new Date();
  const slots = (date === today)
    ? allSlots.filter((s) => s.start > now)
    : allSlots;

  return (
    <BookingClient
      provider={provider}
      slots={slots.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }))}
      date={date}
      selectedSlotIso={slot}
    />
  );
}
