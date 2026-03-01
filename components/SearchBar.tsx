"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SERVICE_OPTIONS = [
  { value: "massage", label: "Massage Therapy", short: "Massage" },
  { value: "physio",  label: "Physiotherapy",   short: "Physio" },
  { value: "chiro",   label: "Chiropractic",    short: "Chiro" },
];

const TIME_OPTIONS = [
  { value: "any",       label: "Any time" },
  { value: "morning",   label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening",   label: "Evening" },
];

function todayVictoria(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  });
}

interface SearchBarProps {
  initialService?: string;
  initialDate?: string;
  initialTime?: string;
  compact?: boolean;
}

export function SearchBar({
  initialService = "massage",
  initialDate,
  initialTime = "any",
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [service, setService] = useState(initialService);
  const [date, setDate] = useState(initialDate ?? todayVictoria());
  const [time, setTime] = useState(initialTime);

  const handleSearch = () => {
    router.push(`/search?${new URLSearchParams({ service, date, time })}`);
  };

  // Compact mode: single row, no labels — used on the search results page
  if (compact) {
    return (
      <div className="flex items-center gap-0 bg-white rounded-xl border border-cream-dark overflow-hidden w-full">
        {/* Location — static for now, North Shore BC only */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 shrink-0">
          <svg className="w-3 h-3 text-[#9A9A9A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium text-brand whitespace-nowrap">North Shore, BC</span>
        </div>

        <div className="w-px h-5 bg-cream-dark shrink-0" />

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 text-xs font-medium text-brand bg-transparent border-none outline-none cursor-pointer appearance-none"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.short}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-cream-dark shrink-0" />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2.5 text-xs font-medium text-brand bg-transparent border-none outline-none cursor-pointer appearance-none"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="shrink-0 m-1.5 px-3 py-2 rounded-lg bg-brand hover:bg-brand-mid active:scale-95 text-white transition-all duration-150 cursor-pointer"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    );
  }

  // Full mode: used on the homepage
  return (
    <div
      className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-[0_4px_24px_rgba(28,56,41,0.08)] hover:shadow-[0_4px_32px_rgba(28,56,41,0.12)] transition-shadow duration-200 max-w-3xl w-full mx-auto"
    >
      {/* Location */}
      <div className="flex-1 border-b sm:border-b-0 sm:border-r border-cream-dark">
        <label className="block px-4 sm:px-5 pt-3 pb-0.5 text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
          Location
        </label>
        <div className="flex items-center gap-2 px-4 sm:px-5 pb-3">
          <svg className="w-3.5 h-3.5 text-[#9A9A9A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-brand">North Shore, BC</span>
        </div>
      </div>

      {/* Service */}
      <div className="flex-1 border-b sm:border-b-0 sm:border-r border-cream-dark group">
        <label className="block px-4 sm:px-5 pt-3 pb-0.5 text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
          Service
        </label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full px-4 sm:px-5 pb-3 text-sm font-medium text-brand bg-transparent border-none outline-none cursor-pointer appearance-none"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time */}
      <div className="flex-1 sm:border-r border-b sm:border-b-0 border-cream-dark">
        <label className="block px-4 sm:px-5 pt-3 pb-0.5 text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
          When
        </label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 sm:px-5 pb-3 text-sm font-medium text-brand bg-transparent border-none outline-none cursor-pointer appearance-none"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <div className="p-2.5">
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-mid active:scale-95 text-white text-sm font-medium rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find slots
        </button>
      </div>
    </div>
  );
}
