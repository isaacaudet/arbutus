import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand text-white/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span
              className="text-2xl font-display font-semibold text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Arbutus
            </span>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Same-day wellness appointments across Victoria, BC.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Browse
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/search?service=massage&time=any", label: "Massage therapy" },
                { href: "/search?service=physio&time=any",  label: "Physiotherapy" },
                { href: "/search?service=chiro&time=any",   label: "Chiropractic" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/for-providers", label: "For providers" },
                { href: "#",             label: "How it works" },
                { href: "#",             label: "About" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
              Location
            </h4>
            <p className="text-sm text-white/70">Victoria, BC</p>
            <p className="text-sm text-white/70">Canada</p>
            <p className="mt-3 text-xs text-white/40">
              Expanding to other cities in 2026.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Arbutus. Built to fill the gaps.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
