import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { EmptyState } from "@/components/EmptyState";
import { getAllProviders } from "@/lib/providers";
import { getAvailableSlots } from "@/lib/ical";

// Time window filtering
const TIME_WINDOWS: Record<string, { start: number; end: number }> = {
  any:       { start: 0,  end: 24 },
  morning:   { start: 6,  end: 12 },
  afternoon: { start: 12, end: 17 },
  evening:   { start: 17, end: 21 },
};

const SERVICE_LABELS: Record<string, string> = {
  massage: "Massage Therapy",
  physio:  "Physiotherapy",
  chiro:   "Chiropractic",
};

const TIME_LABELS: Record<string, string> = {
  any:       "Any time",
  morning:   "Morning · 6am–12pm",
  afternoon: "Afternoon · 12pm–5pm",
  evening:   "Evening · 5pm–9pm",
};

function filterSlotsByTime(
  slots: { start: Date; end: Date }[],
  time: string,
  date: string
): { start: Date; end: Date }[] {
  const window = TIME_WINDOWS[time] ?? TIME_WINDOWS.any;
  return slots.filter((slot) => {
    const slotHour = slot.start.getUTCHours() + getVancouverOffset(date);
    const normalizedHour = ((slotHour % 24) + 24) % 24;
    return normalizedHour >= window.start && normalizedHour < window.end;
  });
}

function getVancouverOffset(dateStr: string): number {
  const date = new Date(dateStr + "T12:00:00Z");
  const month = date.getUTCMonth();
  return month >= 3 && month <= 9 ? -7 : -8;
}

interface SearchResultsProps {
  service: string;
  date: string;
  time: string;
}

async function SearchResults({ service, date, time }: SearchResultsProps) {
  const providers = getAllProviders().filter((p) => p.specialty === service);
  const targetDate = new Date(date + "T00:00:00");

  const results = await Promise.all(
    providers.map(async (provider) => {
      const allSlots = await getAvailableSlots(provider, targetDate);
      const filteredSlots = filterSlotsByTime(allSlots, time, date);
      return { provider, slots: filteredSlots };
    })
  );

  const sorted = results
    .filter((r) => r.slots.length > 0)
    .sort((a, b) => {
      const aFirst = a.slots[0]?.start.getTime() ?? Infinity;
      const bFirst = b.slots[0]?.start.getTime() ?? Infinity;
      return aFirst - bFirst;
    });

  const withNoSlots = results.filter((r) => r.slots.length === 0);

  if (sorted.length === 0) {
    return <EmptyState service={service} date={date} time={time} />;
  }

  return (
    <div className="space-y-4">
      {sorted.map(({ provider, slots }) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          slots={slots.map((s) => ({
            start: s.start.toISOString(),
            end: s.end.toISOString(),
          }))}
          date={date}
        />
      ))}

      {/* Providers with no slots in this window */}
      {withNoSlots.length > 0 && (
        <div className="mt-8 pt-6 border-t border-cream-dark">
          <p className="text-xs text-[#ABABAB] uppercase tracking-widest font-medium mb-4">
            No slots in this window
          </p>
          <div className="space-y-3">
            {withNoSlots.map(({ provider }) => (
              <div
                key={provider.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-cream-mid border border-cream-dark opacity-60"
              >
                <img
                  src={provider.imageUrl}
                  alt={provider.name}
                  className="w-10 h-10 rounded-xl object-cover bg-cream-dark"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display text-base font-medium text-brand truncate"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {provider.name}
                  </p>
                  <p className="text-xs text-[#9A9A9A]">{provider.neighborhood} · {provider.title}</p>
                </div>
                <a
                  href={provider.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand hover:underline shrink-0"
                >
                  Check schedule →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProviderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-cream-dark p-5 sm:p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cream-mid shrink-0" />
        <div className="flex-1">
          <div className="h-5 w-40 bg-cream-mid rounded mb-2" />
          <div className="h-4 w-28 bg-cream-mid rounded mb-3" />
          <div className="h-4 w-32 bg-cream-mid rounded" />
        </div>
      </div>
      <div className="mt-4 h-px bg-cream-mid" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 bg-cream-mid rounded-full" />
        <div className="h-8 w-20 bg-cream-mid rounded-full" />
        <div className="h-8 w-20 bg-cream-mid rounded-full" />
        <div className="h-8 w-16 bg-cream-mid rounded-full" />
      </div>
    </div>
  );
}

interface SearchPageProps {
  searchParams: Promise<{
    service?: string;
    date?: string;
    time?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const service = params.service ?? "massage";
  const date =
    params.date ??
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
  const time = params.time ?? "any";

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  });
  const isToday = date === today;

  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky search refinement bar */}
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-md border-b border-cream-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <SearchBar
            initialService={service}
            initialDate={date}
            initialTime={time}
            compact
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Results header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="font-bold text-3xl sm:text-4xl text-brand leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {SERVICE_LABELS[service] ?? service}
              </h1>
              <p className="text-sm text-[#7A7A7A] mt-1">
                {isToday ? "Today, " : ""}{displayDate} · {TIME_LABELS[time] ?? time} · Victoria, BC
              </p>
            </div>
            {isToday && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                Today
              </span>
            )}
          </div>

          {/* Time filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(TIME_LABELS).map(([key, label]) => {
              const shortLabel = label.split(" · ")[0];
              const isActive = time === key;
              const href = `/search?${new URLSearchParams({ service, date, time: key })}`;
              return (
                <a
                  key={key}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    isActive
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-[#4A4A4A] border-cream-dark hover:border-brand/30 hover:text-brand"
                  }`}
                >
                  {shortLabel}
                </a>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <ProviderCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <SearchResults service={service} date={date} time={time} />
        </Suspense>
      </main>
    </div>
  );
}
