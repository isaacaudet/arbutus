"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-2xl">🎉</span>
        <p className="text-white font-medium text-sm">You&apos;re on the list!</p>
        <p className="text-white/60 text-xs">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:border-white/40 transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-white text-brand text-sm font-medium hover:bg-cream transition-colors whitespace-nowrap"
      >
        Join waitlist
      </button>
    </form>
  );
}
