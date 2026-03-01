import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { SearchLayout, SerializedResult } from "@/components/SearchLayout";
import { Provider } from "@/lib/providers";
import { searchPractitioners, getMarketplaceOpenings, buildBounds } from "@/lib/marketplace";

// Jane App Marketplace covers North Shore BC + Squamish BC
const MARKETPLACE_CENTER = { lat: 49.3201, lng: -123.0724 };
const MARKETPLACE_RADIUS_KM = 20;

const DISCIPLINE_MAP: Record<string, string> = {
  massage: "massage_therapy",
  physio:  "physiotherapy",
  chiro:   "chiropractic",
};

const SERVICE_LABELS: Record<string, string> = {
  massage: "Massage Therapy",
  physio:  "Physiotherapy",
  chiro:   "Chiropractic",
};

const TIME_WINDOWS: Record<string, { start: number; end: number }> = {
  any:       { start: 0,  end: 24 },
  morning:   { start: 6,  end: 12 },
  afternoon: { start: 12, end: 17 },
  evening:   { start: 17, end: 21 },
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
): { start: Date; end: Date }[] {
  if (time === "any") return slots;
  const window = TIME_WINDOWS[time] ?? TIME_WINDOWS.any;
  return slots.filter((slot) => {
    const hour = parseInt(
      slot.start.toLocaleTimeString("en-CA", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/Vancouver",
      }),
      10
    );
    return hour >= window.start && hour < window.end;
  });
}

function disciplineToTitle(discipline: string): string {
  if (discipline.includes("massage")) return "Registered Massage Therapist";
  if (discipline.includes("physio"))  return "Physiotherapist";
  if (discipline.includes("chiro"))   return "Chiropractor";
  return "Practitioner";
}

interface SearchResultsProps {
  service: string;
  time: string;
}

async function SearchResults({ service, time }: SearchResultsProps) {
  const discipline = DISCIPLINE_MAP[service] ?? "massage_therapy";
  const { lat, lng } = MARKETPLACE_CENTER;
  const bounds = buildBounds(lat, lng, MARKETPLACE_RADIUS_KM);
  const now = new Date();

  const practitioners = await searchPractitioners(lat, lng, bounds, discipline, 30);

  if (practitioners.length === 0) {
    return (
      <EmptyState
        service={service}
        date={new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" })}
        time={time}
      />
    );
  }

  const results = await Promise.all(
    practitioners.map(async (p) => {
      // clinicLocationGuid is "clinic-loc" e.g. "3856-1" — extract numeric loc ID
      const locId = parseInt(p.clinicLocationGuid.split("-").pop() ?? "1", 10);
      const allSlots = await getMarketplaceOpenings(p.staffMemberGuid, locId);
      const future = allSlots.filter((s) => s.start > now);
      const filtered = filterSlotsByTime(future, time);

      // Determine specialty from disciplines array
      const specialty = p.practitionerDisciplines.some((d) => d.includes("massage"))
        ? "massage"
        : p.practitionerDisciplines.some((d) => d.includes("physio"))
        ? "physio"
        : p.practitionerDisciplines.some((d) => d.includes("chiro"))
        ? "chiro"
        : service;

      // Map to Provider shape — real name/photo/bio from marketplace
      const provider: Provider = {
        id: p.staffMemberGuid,
        name: p.fullName,
        title: disciplineToTitle(p.practitionerDisciplines[0] ?? discipline),
        specialty,
        rating: 0,
        reviewCount: 0,
        neighborhood: p.clinicName,
        lat: p.locationCoordinates.latitude,
        lng: p.locationCoordinates.longitude,
        bio: p.description ?? "",
        imageUrl: p.photo ?? "",
        icalUrl: "",
        bookingUrl: p.clinicBookingUrl,
        slotDuration: 60,
        marketplace: { staffMemberGuid: p.staffMemberGuid, locationId: locId },
        workingHours: {
          monday: null, tuesday: null, wednesday: null, thursday: null,
          friday: null, saturday: null, sunday: null,
        },
      };

      return {
        provider,
        slots: filtered.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() })),
      };
    })
  );

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });

  const withSlots = results
    .filter((r) => r.slots.length > 0)
    .sort((a, b) => new Date(a.slots[0].start).getTime() - new Date(b.slots[0].start).getTime());
  const withNoSlots = results.filter((r) => r.slots.length === 0);

  const serialized: SerializedResult[] = [
    ...withSlots,
    ...withNoSlots,
  ];

  return <SearchLayout results={serialized} date={today} />;
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
    time?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const service = params.service ?? "massage";
  const time = params.time ?? "any";

  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky search refinement bar */}
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-md border-b border-cream-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <SearchBar
            initialService={service}
            initialDate={new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" })}
            initialTime={time}
            compact
          />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Results header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="font-bold text-3xl sm:text-4xl text-brand leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {SERVICE_LABELS[service] ?? service}
              </h1>
              <p className="text-sm text-[#7A7A7A] mt-1">
                Upcoming availability · {TIME_LABELS[time] ?? time} · North Shore, BC
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/20 text-brand text-xs font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
              Live
            </span>
          </div>

          {/* Time filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(TIME_LABELS).map(([key, label]) => {
              const shortLabel = label.split(" · ")[0];
              const isActive = time === key;
              const href = `/search?${new URLSearchParams({ service, time: key })}`;
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

        {/* Results with map */}
        <Suspense
          fallback={
            <div className="lg:flex lg:gap-6">
              <div className="lg:w-[55%] space-y-4">
                {[...Array(5)].map((_, i) => (
                  <ProviderCardSkeleton key={i} />
                ))}
              </div>
              <div className="hidden lg:block lg:w-[45%]">
                <div className="h-[600px] rounded-2xl bg-cream-mid animate-pulse" />
              </div>
            </div>
          }
        >
          <SearchResults service={service} time={time} />
        </Suspense>
      </main>
    </div>
  );
}
