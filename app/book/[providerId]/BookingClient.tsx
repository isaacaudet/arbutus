"use client";

import { useState } from "react";
import Link from "next/link";
import { Provider } from "@/lib/providers";

interface SerializedSlot { start: string; end: string }

interface BookingClientProps {
  provider: Provider;
  slots: SerializedSlot[];
  date: string;
  selectedSlotIso?: string;
}

const SPECIALTY_STYLES: Record<string, { label: string; badge: string; dot: string }> = {
  massage: { label: "Massage",  badge: "bg-sage/10 text-brand border-sage/20",   dot: "bg-sage"  },
  physio:  { label: "Physio",   badge: "bg-brand/8 text-brand border-brand/15",  dot: "bg-brand" },
  chiro:   { label: "Chiro",    badge: "bg-coral/8 text-coral border-coral/20",  dot: "bg-coral" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-CA", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Vancouver",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function formatDuration(minutes: number) {
  return minutes >= 60 ? `${minutes / 60} hr` : `${minutes} min`;
}

export function BookingClient({ provider, slots, date, selectedSlotIso }: BookingClientProps) {
  const style = SPECIALTY_STYLES[provider.specialty] ?? SPECIALTY_STYLES.massage;

  // Pre-select passed slot, or first available
  const initialSlot = selectedSlotIso ?? slots[0]?.start ?? null;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(initialSlot);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
  const isToday = date === today;

  const handleConfirm = () => {
    if (!selectedSlot || !name || !email) return;
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="font-bold text-3xl text-brand mb-2"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            You&apos;re booked in.
          </h1>
          <p className="text-[#5A5A5A] mb-1">
            <strong>{provider.name}</strong> · {formatTime(selectedSlot!)}
          </p>
          <p className="text-sm text-[#9A9A9A] mb-8">
            {isToday ? "Today" : formatDate(date)} · {formatDuration(provider.slotDuration)}
          </p>
          <p className="text-sm text-[#7A7A7A] mb-6 leading-relaxed">
            We&apos;ve sent confirmation to <strong>{email}</strong>.{" "}
            To manage your appointment, visit {provider.name.split(" ")[0]}&apos;s booking system directly.
          </p>
          <a
            href={provider.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-mid transition-colors"
          >
            Open booking system
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <div className="mt-6">
            <Link href={`/search?service=${provider.specialty}&date=${date}&time=any`} className="text-sm text-brand hover:underline">
              ← Back to results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Back */}
        <Link
          href={`/search?service=${provider.specialty}&date=${date}&time=any`}
          className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-brand transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </Link>

        {/* Provider card */}
        <div className="bg-white rounded-2xl border border-cream-dark p-5 sm:p-6 mb-6">
          <div className="flex gap-4">
            <img
              src={provider.imageUrl}
              alt={provider.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-cream-mid shrink-0"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.onerror = null;
                el.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23E5E0D6'/%3E%3Ccircle cx='40' cy='28' r='13' fill='%23A8C4B8'/%3E%3Cellipse cx='40' cy='60' rx='20' ry='13' fill='%23A8C4B8'/%3E%3C/svg%3E`;
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h1
                    className="font-bold text-2xl text-brand"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {provider.name}
                  </h1>
                  <p className="text-sm text-[#6A6A6A]">{provider.title}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {style.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#5A5A5A] leading-relaxed line-clamp-2">
                {provider.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Slot picker */}
        <div className="bg-white rounded-2xl border border-cream-dark p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-bold text-xl text-brand"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {isToday ? "Today" : formatDate(date)}
            </h2>
            <span className="text-xs text-[#9A9A9A]">{formatDuration(provider.slotDuration)} sessions</span>
          </div>

          {slots.length === 0 ? (
            <p className="text-sm text-[#ABABAB] italic">No slots available for this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => {
                const isSelected = selectedSlot === s.start;
                return (
                  <button
                    key={s.start}
                    onClick={() => setSelectedSlot(s.start)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer active:scale-95 ${
                      isSelected
                        ? "bg-brand text-white border-brand shadow-sm"
                        : isToday
                        ? "bg-coral/8 border-coral/25 text-coral hover:bg-coral/15"
                        : "bg-sage/8 border-sage/25 text-brand hover:bg-sage/15"
                    }`}
                  >
                    {formatTime(s.start)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking form */}
        {selectedSlot && (
          <div className="bg-white rounded-2xl border border-cream-dark p-5 sm:p-6">
            <h2
              className="font-bold text-xl text-brand mb-5"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Your details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9A9A9A] uppercase tracking-widest mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark text-sm text-brand placeholder:text-[#C0BDB7] outline-none focus:border-sage/50 focus:ring-2 focus:ring-sage/10 transition-all bg-cream/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9A9A9A] uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark text-sm text-brand placeholder:text-[#C0BDB7] outline-none focus:border-sage/50 focus:ring-2 focus:ring-sage/10 transition-all bg-cream/40"
                />
              </div>
            </div>

            {/* Summary + CTA */}
            <div className="mt-6 pt-5 border-t border-cream-dark">
              <div className="flex items-center justify-between text-sm text-[#5A5A5A] mb-4">
                <span>{formatTime(selectedSlot)} · {isToday ? "Today" : formatDate(date)}</span>
                <span className="font-medium text-brand">{formatDuration(provider.slotDuration)}</span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={!name || !email}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-mid active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm booking
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <p className="mt-3 text-xs text-center text-[#ABABAB]">
                In production, this connects to {provider.name.split(" ")[0]}&apos;s booking system.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
