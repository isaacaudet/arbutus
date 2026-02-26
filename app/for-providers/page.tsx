import Link from "next/link";
import type { Metadata } from "next";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "For Providers — Arbutus Victoria",
  description:
    "Fill last-minute cancellations automatically. Connect your calendar and let Arbutus surface your open slots to people looking right now.",
};

const STEPS = [
  {
    n: "01",
    title: "Connect your calendar",
    desc: "Share a read-only iCal link from Google Calendar, Jane App, Cliniko, or any system that exports iCal. We never touch your bookings.",
    icon: "📅",
  },
  {
    n: "02",
    title: "Set your working hours",
    desc: "Tell us when you're available. We'll only show slots that fall within your set hours — nothing outside, no exceptions.",
    icon: "🕐",
  },
  {
    n: "03",
    title: "Cancellations fill themselves",
    desc: "When a patient cancels, their time slot immediately becomes visible to people searching for last-minute availability near you.",
    icon: "✨",
  },
];

const BENEFITS = [
  { icon: "💰", title: "Recover lost revenue", desc: "The average practitioner loses 4–8% of bookings to same-day cancellations. Arbutus puts those hours back." },
  { icon: "🔒", title: "Zero new software", desc: "Keep using Jane App, Cliniko, or whatever you already use. We only read your calendar — never write to it." },
  { icon: "📍", title: "Local discovery", desc: "Patients in Victoria who need an appointment today will find you. Not a random provider across the country." },
  { icon: "⚡", title: "Instant visibility", desc: "Slots go live the moment they open up. No manual posting, no last-minute scramble." },
  { icon: "🎯", title: "Direct booking", desc: "We send patients straight to your booking page. No middleman, no commission, no platform fee." },
  { icon: "🔄", title: "Works with any schedule", desc: "Variable hours, rotating days, block scheduling — if your calendar reflects it, we show it accurately." },
];

const FAQS = [
  {
    q: "Do I need to change how I take bookings?",
    a: "No. Your existing booking system stays exactly as it is. Arbutus only reads your availability — patients book directly through your normal system.",
  },
  {
    q: "What calendar systems work?",
    a: "Anything that exports a standard iCal feed (.ics). Google Calendar, Apple Calendar, Jane App, Cliniko, Mindbody, Acuity, and most practice management software support this.",
  },
  {
    q: "Can I control which slots show up?",
    a: "Yes. You define your working hours per day of week. Only slots within those hours and free on your calendar will appear. Mark a block as busy on your calendar and it immediately disappears.",
  },
  {
    q: "Is there a cost?",
    a: "Arbutus is free during our Victoria launch. We're focused on building the right product with real practitioners before discussing monetization.",
  },
  {
    q: "How quickly do changes show up?",
    a: "We cache calendars for 15 minutes, so changes reflect within that window. A cancellation booked in your system will be visible on Arbutus within 15 minutes.",
  },
];

export default function ForProvidersPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="bg-brand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            For practitioners in Victoria, BC
          </span>

          <h1
            className="font-bold text-4xl sm:text-6xl text-white leading-[1.06] tracking-[-0.01em] max-w-3xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Your calendar cancellations
            <br />
            <em className="not-italic font-medium text-sage-light">become someone&apos;s appointment.</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
            Arbutus reads your existing calendar and surfaces open slots to
            patients looking for last-minute appointments in Victoria —
            automatically, with zero extra work.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand text-sm font-medium hover:bg-cream transition-colors"
            >
              Join the waitlist
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              See the patient side →
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { stat: "Free", label: "during Victoria launch" },
              { stat: "15 min", label: "calendar update interval" },
              { stat: "0%", label: "booking commission" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p
                  className="font-display text-3xl font-medium text-white"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {stat}
                </p>
                <p className="text-sm text-white/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2
          className="font-bold text-3xl sm:text-4xl text-brand mb-12"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Three steps, then it runs itself.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map(({ n, title, desc, icon }) => (
            <div key={n} className="relative">
              <div className="w-12 h-12 rounded-2xl bg-cream-mid border border-cream-dark flex items-center justify-center text-2xl mb-4">
                {icon}
              </div>
              <span
                className="absolute top-0 left-14 font-display text-4xl font-bold text-cream-dark"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {n}
              </span>
              <h3
                className="font-display text-xl font-semibold text-brand mb-2"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {title}
              </h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Benefits grid ────────────────────────────────────── */}
      <section className="bg-cream-mid border-y border-cream-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-brand mb-10"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Built around how you work.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-cream-dark">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-medium text-[#1A1A1A] text-sm mb-1">{title}</h3>
                <p className="text-sm text-[#6A6A6A] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2
          className="font-display text-3xl sm:text-4xl font-bold text-brand mb-10"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Common questions.
        </h2>
        <div className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="border-b border-cream-dark pb-6 last:border-0">
              <h3 className="font-medium text-[#1A1A1A] mb-2">{q}</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Waitlist CTA ─────────────────────────────────────── */}
      <section id="waitlist" className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-brand rounded-3xl px-8 py-12 sm:px-12 sm:py-14 text-center">
          <h2
            className="font-display text-3xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Ready to fill those gaps?
          </h2>
          <p className="text-white/70 text-base max-w-md mx-auto leading-relaxed mb-8">
            We&apos;re onboarding practitioners in Victoria now. Drop your email
            and we&apos;ll reach out to get you set up — takes under 10 minutes.
          </p>
          <WaitlistForm />
          <p className="mt-4 text-xs text-white/40">
            Free during launch. No credit card. No spam.
          </p>
        </div>
      </section>
    </div>
  );
}
