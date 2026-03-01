"use client";

import { useState } from "react";
import type { MarketplacePractitioner } from "@/lib/marketplace";

const DISCIPLINES = [
  { value: "massage",  label: "Massage Therapy" },
  { value: "physio",   label: "Physiotherapy" },
  { value: "chiro",    label: "Chiropractic" },
];

interface DiscoverResult {
  query: { lat: number; lng: number; discipline: string; radiusKm: number };
  count: number;
  practitioners: MarketplacePractitioner[];
  coverageNote: string | null;
}

export function DiscoverClient() {
  const [address, setAddress]       = useState("");
  const [discipline, setDiscipline] = useState("massage");
  const [radius, setRadius]         = useState(10);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<DiscoverResult | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        address,
        discipline,
        radius: String(radius),
      });
      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Search failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1
        className="font-bold text-4xl sm:text-5xl text-brand mb-2"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Discover Practitioners
      </h1>
      <p className="text-sm text-[#7A7A7A] mb-8">
        Search Jane App's marketplace by address to find real practitioners with live availability.
      </p>

      {/* Search form */}
      <div className="bg-white rounded-2xl border border-cream-dark p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
            Address or City
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. North Vancouver, BC"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream text-sm text-brand placeholder-[#ABABAB] focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Discipline
            </label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream text-sm text-brand focus:outline-none focus:ring-2 focus:ring-sage/40"
            >
              {DISCIPLINES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-1.5 uppercase tracking-wider">
              Radius (km)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-cream-dark bg-cream text-sm text-brand focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !address.trim()}
          className="w-full py-3 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-mid transition-colors disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search Jane App"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-coral/10 border border-coral/20 text-coral text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#4A4A4A]">
              <span className="font-semibold text-brand">{result.count}</span>{" "}
              {result.count === 1 ? "practitioner" : "practitioners"} found
              {" "}within {result.query.radiusKm}km of{" "}
              <span className="text-brand">
                {result.query.lat.toFixed(3)}, {result.query.lng.toFixed(3)}
              </span>
            </p>
          </div>

          {result.coverageNote && (
            <div className="p-4 rounded-xl bg-cream-mid border border-cream-dark text-sm text-[#7A7A7A]">
              <span className="font-medium">Coverage note:</span> {result.coverageNote}
            </div>
          )}

          {result.practitioners.map((p) => {
            const locId = p.clinicLocationGuid.split("-").pop();
            return (
              <div
                key={p.staffMemberGuid}
                className="bg-white rounded-2xl border border-cream-dark p-5 flex gap-4"
              >
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.fullName}
                    className="w-16 h-16 rounded-xl object-cover bg-cream-mid shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-cream-mid shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className="font-bold text-xl text-brand"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        {p.fullName}
                      </h3>
                      <p className="text-sm text-[#6A6A6A]">{p.clinicName}</p>
                      <p className="text-xs text-[#9A9A9A] mt-0.5">
                        {p.streetAddress}, {p.city} · {p.practitionerDisciplines.join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {p.firstOpening ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sage/10 text-brand border border-sage/20 text-xs font-medium">
                          Next:{" "}
                          {new Date(p.firstOpening.startAt).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric",
                            timeZone: "America/Vancouver",
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-[#ABABAB]">No upcoming slots</span>
                      )}
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-sm text-[#5A5A5A] mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={p.clinicBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand font-medium hover:underline"
                    >
                      Book on Jane App →
                    </a>
                    <code className="text-[10px] text-[#ABABAB] bg-cream-mid px-2 py-0.5 rounded font-mono">
                      guid: {p.staffMemberGuid} · loc: {locId}
                    </code>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
