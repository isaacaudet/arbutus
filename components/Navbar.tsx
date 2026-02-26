"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NAV_LINKS = [
  { href: "/search?service=massage&time=any", label: "Massage", service: "massage" },
  { href: "/search?service=physio&time=any",  label: "Physio",  service: "physio" },
  { href: "/search?service=chiro&time=any",   label: "Chiro",   service: "chiro" },
];

function ArbutusIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/arbutus-icon.svg" alt="" className={className} />
  );
}

function NavContent() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentService = searchParams.get("service");

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => setOpen(false)}
          >
            <ArbutusIcon className="h-11 w-auto" />
            <div className="flex flex-col leading-none">
              <span
                className="text-[1.5625rem] font-bold text-brand tracking-tight leading-none"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Arbutus
              </span>
              <span className="text-[9px] font-semibold text-[#A8A4A0] tracking-[0.15em] uppercase mt-[3px]">
                Victoria
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, service }) => {
              const isActive = pathname === "/search" && currentService === service;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand text-white"
                      : "text-[#3A3A3A] hover:text-brand hover:bg-brand/6"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/for-providers"
              className={`text-sm font-medium transition-colors ${
                pathname === "/for-providers"
                  ? "text-brand"
                  : "text-[#3A3A3A] hover:text-brand"
              }`}
            >
              For providers
            </Link>
            <Link
              href="/search?service=massage&time=any"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-mid transition-colors shadow-[0_2px_8px_rgba(28,56,41,0.2)]"
            >
              Find a slot
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden p-2 rounded-lg hover:bg-[#F5F2EC] transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-[#1A1A1A] transition-all duration-200 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-[#1A1A1A] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-[#1A1A1A] transition-all duration-200 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-200 ${open ? "max-h-72" : "max-h-0"}`}>
        <div className="border-t border-[#E8E4DC] px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label, service }) => {
            const isActive = pathname === "/search" && currentService === service;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-[#3A3A3A] hover:text-brand hover:bg-brand/6"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-[#E8E4DC] space-y-1">
            <Link
              href="/for-providers"
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-[#3A3A3A] hover:text-brand hover:bg-brand/6 transition-colors"
            >
              For providers
            </Link>
            <Link
              href="/search?service=massage&time=any"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-mid transition-colors"
            >
              Find a slot
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<nav className="sticky top-0 z-50 bg-white border-b border-[#E8E4DC] h-16" />}>
      <NavContent />
    </Suspense>
  );
}
