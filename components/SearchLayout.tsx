"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Provider } from "@/lib/providers";
import { ProviderCard } from "./ProviderCard";
import { distanceKm } from "@/lib/geo";
import { Slider } from "@/components/ui/slider";

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="h-full bg-cream-mid animate-pulse rounded-2xl" /> }
);

const VICTORIA_CENTER = { lat: 48.4284, lng: -123.3656 };

export interface SerializedResult {
  provider: Provider;
  slots: { start: string; end: string }[];
}

interface SearchLayoutProps {
  results: SerializedResult[];
  date: string;
}

export function SearchLayout({ results, date }: SearchLayoutProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [geoLoading, setGeoLoading] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const center = userLocation ?? VICTORIA_CENTER;

  // Client-side radius filter (only when user location is set)
  const filteredResults = userLocation
    ? results.filter(
        (r) => distanceKm(center.lat, center.lng, r.provider.lat, r.provider.lng) <= radiusKm
      )
    : results;

  const withSlots = filteredResults
    .filter((r) => r.slots.length > 0)
    .sort((a, b) => new Date(a.slots[0].start).getTime() - new Date(b.slots[0].start).getTime());

  const withNoSlots = filteredResults.filter((r) => r.slots.length === 0);

  // All providers shown as pins, regardless of radius filter
  const allProviders = results.map((r) => r.provider);

  const handlePinClick = useCallback(
    (id: string) => {
      setActiveId(id);
      setActiveTab("list");
      const idx = filteredResults.findIndex((r) => r.provider.id === id);
      if (idx !== -1) {
        // Small delay so tab switch renders first
        setTimeout(() => {
          cardRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
      }
    },
    [filteredResults]
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const countLabel = userLocation
    ? `${withSlots.length} provider${withSlots.length !== 1 ? "s" : ""} within ${radiusKm} km`
    : `${withSlots.length} provider${withSlots.length !== 1 ? "s" : ""} available`;

  return (
    <div>
      {/* Mobile tabs */}
      <div className="lg:hidden mb-4 flex rounded-xl border border-cream-dark overflow-hidden">
        {(["list", "map"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-brand text-white"
                : "bg-white text-[#4A4A4A] hover:bg-cream-mid"
            }`}
          >
            {tab === "list" ? "List" : "Map"}
          </button>
        ))}
      </div>

      <div className="lg:flex lg:gap-6 lg:items-start">
        {/* Left panel — provider list */}
        <div
          className={`lg:w-[55%] space-y-4 ${activeTab === "map" ? "hidden lg:block" : ""}`}
        >
          <p className="text-sm text-[#7A7A7A]">{countLabel}</p>

          {withSlots.length === 0 && withNoSlots.length === 0 ? (
            <p className="text-sm text-[#ABABAB] italic py-8 text-center">
              No providers found in this area
            </p>
          ) : (
            <>
              {withSlots.map(({ provider, slots }, i) => (
                <div
                  key={provider.id}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className={`rounded-2xl ring-2 transition-all duration-150 ${
                    activeId === provider.id
                      ? "ring-coral/50 shadow-lg"
                      : hoveredId === provider.id
                      ? "ring-sage/40"
                      : "ring-transparent"
                  }`}
                  onMouseEnter={() => setHoveredId(provider.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ProviderCard provider={provider} slots={slots} date={date} />
                </div>
              ))}

              {withNoSlots.length > 0 && (
                <div className="pt-4 border-t border-cream-dark">
                  <p className="text-xs text-[#ABABAB] uppercase tracking-widest font-medium mb-3">
                    No slots in this window
                  </p>
                  <div className="space-y-3">
                    {withNoSlots.map(({ provider }, i) => (
                      <div
                        key={provider.id}
                        ref={(el) => { cardRefs.current[withSlots.length + i] = el; }}
                        className={`flex items-center gap-3 p-4 rounded-xl bg-cream-mid border transition-all ${
                          activeId === provider.id
                            ? "border-coral/40 ring-1 ring-coral/30"
                            : hoveredId === provider.id
                            ? "border-sage/40"
                            : "border-cream-dark"
                        } opacity-60`}
                        onMouseEnter={() => setHoveredId(provider.id)}
                        onMouseLeave={() => setHoveredId(null)}
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
                          <p className="text-xs text-[#9A9A9A]">
                            {provider.neighborhood} · {provider.title}
                          </p>
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
            </>
          )}
        </div>

        {/* Right panel — map */}
        <div
          className={`lg:w-[45%] lg:sticky lg:top-[120px] ${
            activeTab === "list" ? "hidden lg:block" : ""
          }`}
        >
          <div className="relative h-[500px] lg:h-[calc(100vh-160px)] max-h-[680px] rounded-2xl overflow-hidden border border-cream-dark shadow-sm">
            <MapView
              providers={allProviders}
              activeId={activeId}
              hoveredId={hoveredId}
              center={center}
              radiusKm={radiusKm}
              userLocation={userLocation}
              onPinClick={handlePinClick}
              onPinHover={setHoveredId}
            />

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/96 backdrop-blur-sm rounded-xl shadow-lg p-3.5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#7A7A7A] shrink-0">
                  Radius: <span className="font-semibold text-brand">{radiusKm} km</span>
                </span>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[radiusKm]}
                  onValueChange={([v]) => setRadiusKm(v)}
                  className="flex-1"
                />
              </div>
              <button
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-brand/20 text-brand text-xs font-medium hover:bg-brand/5 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {geoLoading ? "Locating…" : userLocation ? "Location set" : "Use my location"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
