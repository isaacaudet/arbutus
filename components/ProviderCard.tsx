"use client";

import { useRouter } from "next/navigation";
import { TimeSlotChip } from "./TimeSlotChip";
import { Provider } from "@/lib/providers";

interface SerializedSlot {
  start: string;
  end: string;
}

interface ProviderCardProps {
  provider: Provider;
  slots: SerializedSlot[];
  date: string;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${
              i < full
                ? "text-amber-400 fill-amber-400"
                : i === full && partial >= 0.5
                ? "text-amber-400 fill-amber-200"
                : "text-gray-200 fill-gray-200"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-sm font-medium text-[#1A1A1A]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[#9A9A9A]">({reviewCount})</span>
    </span>
  );
}

const SPECIALTY_STYLES: Record<string, { dot: string; label: string; badge: string }> = {
  massage: { dot: "bg-sage",  label: "Massage", badge: "bg-sage/10 text-brand border-sage/20" },
  physio:  { dot: "bg-brand", label: "Physio",  badge: "bg-brand/8 text-brand border-brand/15" },
  chiro:   { dot: "bg-coral", label: "Chiro",   badge: "bg-coral/8 text-coral border-coral/20" },
};

export function ProviderCard({ provider, slots, date }: ProviderCardProps) {
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  });
  const isToday = date === today;

  // For marketplace multi-day slots, check if any slot is actually today
  const slotDates = slots.map((s) => ({
    start: new Date(s.start),
    end: new Date(s.end),
  }));

  const style = SPECIALTY_STYLES[provider.specialty] ?? SPECIALTY_STYLES.massage;

  // Marketplace providers book externally; internal booking page only for iCal/Jane direct
  const isExternal = !!provider.marketplace;
  const cardHref = isExternal ? provider.bookingUrl : `/book/${provider.id}?date=${date}`;

  const handleCardClick = () => {
    if (isExternal) {
      window.open(cardHref, "_blank", "noopener,noreferrer");
    } else {
      router.push(cardHref);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-cream-dark hover:border-sage/30 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 relative">
            <img
              src={provider.imageUrl}
              alt={provider.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-cream-mid"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.onerror = null;
                el.src =
                  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23E5E0D6'/%3E%3Ccircle cx='40' cy='28' r='13' fill='%23A8C4B8'/%3E%3Cellipse cx='40' cy='60' rx='20' ry='13' fill='%23A8C4B8'/%3E%3C/svg%3E`;
              }}
            />
            {slotDates.some((s) => s.start.toLocaleDateString("en-CA", { timeZone: "America/Vancouver" }) === today) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-coral border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2
                  className="font-bold text-xl text-brand truncate"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {provider.name}
                </h2>
                <p className="text-sm text-[#6A6A6A] mt-0.5">{provider.title}</p>
              </div>
              <span
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {style.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2.5">
              {provider.rating > 0 && (
                <>
                  <StarRating rating={provider.rating} reviewCount={provider.reviewCount} />
                  <span className="text-[#D0CCC5]">·</span>
                </>
              )}
              <span className="text-sm text-[#7A7A7A] flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {provider.neighborhood}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm text-[#5A5A5A] leading-relaxed line-clamp-2">
          {provider.bio}
        </p>

        {/* Divider */}
        <div className="mt-4 h-px bg-cream-mid" />

        {/* Slots */}
        <div className="mt-4">
          {slotDates.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-[#9A9A9A] uppercase tracking-widest">
                  Upcoming slots
                </span>
                {slotDates.some((s) => s.start.toLocaleDateString("en-CA", { timeZone: "America/Vancouver" }) === today) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/20">
                    <span className="w-1 h-1 rounded-full bg-coral" />
                    Today
                  </span>
                )}
                <span className="ml-auto text-xs text-[#9A9A9A]">
                  {slotDates.length} available
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {slotDates.slice(0, 8).map((slot) => (
                  <TimeSlotChip
                    key={slot.start.toISOString()}
                    start={slot.start}
                    href={isExternal ? provider.bookingUrl : `/book/${provider.id}?slot=${encodeURIComponent(slot.start.toISOString())}&date=${date}`}
                    external={isExternal}
                  />
                ))}
                {slotDates.length > 8 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(cardHref); }}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm text-[#7A7A7A] border border-cream-dark bg-cream hover:bg-cream-mid hover:border-sage/30 transition-colors"
                  >
                    +{slotDates.length - 8} more
                  </button>
                )}
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-mid transition-colors cursor-pointer"
              >
                View all availability
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#ABABAB] italic">
              No open slots for this time window
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
