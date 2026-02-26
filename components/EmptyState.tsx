import Link from "next/link";

interface EmptyStateProps {
  service: string;
  date: string;
  time: string;
}

const SERVICE_LABELS: Record<string, string> = {
  massage: "massage therapists",
  physio: "physiotherapists",
  chiro: "chiropractors",
};

const OTHER_TIMES: Record<string, string[]> = {
  any:       [],
  morning:   ["afternoon", "evening"],
  afternoon: ["morning", "evening"],
  evening:   ["morning", "afternoon"],
};

const TIME_LABELS: Record<string, string> = {
  any:       "Any time",
  morning:   "Morning",
  afternoon: "Afternoon",
  evening:   "Evening",
};

export function EmptyState({ service, date, time }: EmptyStateProps) {
  const serviceLabel = SERVICE_LABELS[service] ?? service;
  const otherTimes = OTHER_TIMES[time] ?? [];

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  });
  const isToday = date === today;

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-mid border border-cream-dark flex items-center justify-center text-3xl mb-6">
        🗓️
      </div>
      <h3
        className="font-display text-2xl font-medium text-brand mb-2"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        No open slots found
      </h3>
      <p className="text-[#6A6A6A] max-w-sm text-sm leading-relaxed">
        No {serviceLabel} are available {isToday ? "today" : `on ${displayDate}`}
        {time !== "any" ? ` in the ${time}` : ""}. Try a different time or date.
      </p>

      {/* Suggestions */}
      {otherTimes.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-widest font-medium">
            Try instead
          </p>
          <div className="flex gap-2">
            {otherTimes.map((t) => (
              <Link
                key={t}
                href={`/search?${new URLSearchParams({ service, date, time: t })}`}
                className="px-4 py-2 rounded-full bg-white border border-cream-dark text-sm text-[#4A4A4A] hover:border-brand/30 hover:text-brand transition-colors"
              >
                {TIME_LABELS[t]}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
