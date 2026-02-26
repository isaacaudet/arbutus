import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

const SPECIALTIES = [
  {
    key: "massage",
    label: "Massage Therapy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    desc: "Deep tissue, relaxation, prenatal, sports",
    count: 3,
    borderColor: "border-sage/30",
    bg: "hover:bg-sage/5",
    iconColor: "text-sage bg-sage/10",
  },
  {
    key: "physio",
    label: "Physiotherapy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    desc: "Rehabilitation, sports injury, post-surgery",
    count: 1,
    borderColor: "border-brand/20",
    bg: "hover:bg-brand/3",
    iconColor: "text-brand bg-brand/8",
  },
  {
    key: "chiro",
    label: "Chiropractic",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    desc: "Spinal health, posture correction, headaches",
    count: 1,
    borderColor: "border-coral/20",
    bg: "hover:bg-coral/3",
    iconColor: "text-coral bg-coral/8",
  },
];

const NEIGHBORHOODS = [
  "Downtown", "Oak Bay", "Fernwood", "James Bay", "Saanich",
  "Fairfield", "Vic West", "Esquimalt",
];


export default function HomePage() {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  });

  return (
    <div className="bg-cream min-h-screen">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E8E4DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">

          {/* Eyebrow */}
          <div className="opacity-0-init animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4EDE5] bg-[#EBF6F1] text-brand text-xs font-semibold tracking-wide mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A86C] animate-pulse" />
            Live availability · Victoria, BC
          </div>

          {/* Headline — Playfair Display 800 = strong and editorial */}
          <h1
            className="opacity-0-init animate-fade-up delay-100 font-extrabold text-[2.75rem] sm:text-[4rem] lg:text-[4.75rem] text-brand leading-[1.06] tracking-[-0.02em] max-w-3xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Same-day wellness.
            <span className="block text-coral italic">Last-minute slots.</span>
          </h1>

          <p className="opacity-0-init animate-fade-up delay-200 mt-6 text-[1.0625rem] text-[#4A4A4A] max-w-lg leading-relaxed">
            Cancellations leave practitioners with empty hours. Arbutus surfaces
            those gaps in real time — so you get the appointment you need, today.
          </p>

          {/* Search */}
          <div className="opacity-0-init animate-fade-up delay-300 mt-10">
            <SearchBar initialDate={today} />
          </div>

          {/* Trust */}
          <div className="opacity-0-init animate-fade-up delay-400 mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {[
              "No account needed",
              "Real-time availability",
              "Book directly with the provider",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-[#7A7A7A]">
                <svg className="w-4 h-4 text-[#34A86C] shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
                {item}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ─── Browse by specialty ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-baseline justify-between mb-7">
          <h2
            className="font-bold text-2xl sm:text-3xl text-brand"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Browse by specialty
          </h2>
          <span className="text-sm text-[#9A9A9A] hidden sm:block">Victoria, BC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SPECIALTIES.map(({ key, label, icon, desc, count, borderColor, bg, iconColor }) => (
            <Link
              key={key}
              href={`/search?service=${key}&date=${today}&time=any`}
              className={`group flex flex-col p-5 sm:p-6 rounded-2xl bg-white border ${borderColor} ${bg} transition-all duration-200 hover:shadow-md`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${iconColor}`}>
                {icon}
              </div>
              <h3
                className="font-bold text-lg text-[#1A1A1A] leading-tight mb-1"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {label}
              </h3>
              <p className="text-sm text-[#6A6A6A] leading-snug mb-5">{desc}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-[#9A9A9A]">
                  {count} provider{count !== 1 ? "s" : ""} in Victoria
                </span>
                <svg
                  className="w-4 h-4 text-[#C0BDB7] group-hover:text-brand group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────────────── */}
      <section className="border-y border-[#E8E4DC] bg-[#F7F4EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
          <h2
            className="font-bold text-2xl sm:text-3xl text-brand mb-12 text-center"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              {
                n: "1",
                title: "Search",
                desc: "Choose a service, date, and time of day. We poll live calendars across every listed provider.",
              },
              {
                n: "2",
                title: "Pick a slot",
                desc: "See who's available and when — sorted by soonest opening. No guessing, no phone calls.",
              },
              {
                n: "3",
                title: "Book direct",
                desc: "Click any slot to go to the provider's own booking page. We never touch your appointment.",
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <span className="text-white font-bold text-base tabular-nums">
                    {n}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-bold text-xl text-brand mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-[#5A5A5A] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Neighbourhoods ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-4 mb-5">
          <h2
            className="font-semibold text-xl sm:text-2xl text-brand shrink-0"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Across Victoria
          </h2>
          <div className="flex-1 h-px bg-[#E8E4DC]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n}
              href={`/search?service=massage&date=${today}&time=any`}
              className="px-4 py-2 rounded-full bg-white border border-[#E0DDD7] text-sm text-[#3A3A3A] hover:border-brand/40 hover:text-brand transition-colors"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── For providers CTA ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-2xl bg-brand px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1.5">For practitioners</p>
            <h2
              className="font-bold text-xl sm:text-2xl text-white leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Stop leaving revenue on the table.
            </h2>
            <div className="flex flex-wrap gap-3 mt-2.5">
              <span className="text-white/55 text-xs">✓ Free during launch</span>
              <span className="text-white/55 text-xs">✓ 0% commission</span>
            </div>
          </div>
          <Link
            href="/for-providers"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand text-sm font-semibold hover:bg-cream transition-colors"
          >
            Learn how it works
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
