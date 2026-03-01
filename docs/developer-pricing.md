# Arbutus — Developer Pricing & Engagement Model

> Your reference doc. What to charge, what to build, and how to structure the deal.

---

## The Situation

She has the idea and the domain knowledge. You have the skills to build it. The demo already exists — which means you've de-risked the concept and have something concrete to show her. That's leverage.

The question is how you structure the engagement: straight freelance, reduced rate + equity, or something else.

---

## What Needs to Be Built (Scope)

### Phase 1 — Launch-Ready MVP
Everything required to go live with real providers and real bookings.

| Component | Effort |
|---|---|
| Provider database + Supabase setup | 1–2 days |
| Provider onboarding form (self-serve sign-up) | 1–2 days |
| Provider dashboard (edit profile, hours, iCal URL) | 2–3 days |
| Admin panel (approve providers, view bookings) | 1–2 days |
| Real booking flow (form → email notification to provider) | 1–2 days |
| Email confirmations (patient + provider) | 1 day |
| Auth (Supabase — provider login) | 1 day |
| Polish, QA, mobile testing | 1–2 days |
| **Total** | **~10–16 days** |

With AI-assisted development (which you're already doing), cut that roughly in half in calendar time. Call it **3–5 weeks of real work** to a production-ready V1.

### Phase 2 — Growth Features (later, separate engagement)
- Stripe billing ($49/mo per provider)
- Reviews / ratings
- Waitlist / cancellation alerts
- Multi-city expansion
- Mobile PWA
- Jane App API integration (if ever available)

Don't scope or price Phase 2 now. Deliver Phase 1, prove it works, renegotiate.

---

## What to Charge

### Option A: Flat Project Fee (Cleanest)

A comparable MVP from a freelance developer in Canada would typically run **$8,000–$20,000** depending on experience and market.

You have an unfair advantage (AI tools + the demo already built), so you can undercut that and still be well-compensated for your time.

**Suggested range: $5,000–$8,000 flat for Phase 1**

- $5,000 if you're also taking a profit share (see below)
- $8,000 if it's purely a work-for-hire arrangement

Get 50% upfront, 50% on launch. Do not start without a deposit.

### Option B: Hourly

If she's cost-sensitive or the scope is unclear, hourly protects you.

- Junior freelance dev (Victoria): $50–75/hr
- Mid-level: $75–120/hr
- Your rate with AI tools and a working demo already: **$80–100/hr** is fair and defensible

Estimate: 60–100 hours of billable work for Phase 1.

**Realistic total: $5,000–$10,000**

### Option C: Reduced Rate + Revenue Share (If You Want Upside)

If you believe in the business, charge below market (e.g., $2,500–$3,000 for the build) in exchange for a percentage of revenue — typically **3–8% of monthly revenue** for an ongoing technical co-founder lite arrangement.

This only makes sense if:
- She's committed and has a real plan to sign providers
- You're willing to do ongoing maintenance at a reduced rate
- There's a written agreement (see below)

Don't do equity in the company unless you want to be on the hook long-term. Revenue share is cleaner for a contractor relationship.

---

## Ongoing Costs (What She Pays After Launch)

These are her costs, not yours — but you should walk her through them so there are no surprises.

| Item | Cost |
|---|---|
| Vercel (hosting) | $0–$20/mo |
| Supabase (database) | $0–$25/mo |
| Resend (email) | $0–$20/mo |
| Domain renewal | ~$15/yr |
| **Total** | **~$0–$65/mo** |

At early stage, this is effectively free. She's not paying for servers until she has real traffic.

**Your ongoing maintenance** (bug fixes, small updates): either a retainer ($300–$500/mo) or ad-hoc at your hourly rate. Agree on this upfront.

---

## What to Put in Writing

Even for a friendly arrangement, get a simple contract covering:

1. **Scope**: Exactly what Phase 1 includes (use the table above)
2. **Payment terms**: 50% upfront, 50% on launch. No exceptions.
3. **IP ownership**: She owns the codebase once paid in full. You retain the right to show it in your portfolio.
4. **Ongoing work**: Not included in Phase 1 fee. Billed separately at [your rate].
5. **Revenue share** (if applicable): X% of gross monthly revenue, paid monthly, for Y years or until bought out at Z multiple.
6. **Hosting access**: She has her own Vercel + Supabase accounts. You're an admin, not the owner.

A one-page agreement you both sign is enough. You don't need a lawyer for this amount.

---

## The Honest Pitch to Her

You've already built a working demo — that's not nothing. A developer starting from scratch would charge $15,000+ for what you can deliver in weeks.

What you're offering:
- A working prototype already exists
- Fast delivery (weeks, not months)
- Continued availability for updates
- Market rate is $8–20k; you're offering $5–8k

What you want in return (if taking reduced rate):
- Upfront deposit before you write a line of production code
- A small % of revenue if and when the business makes money
- Credit and portfolio rights

---

## Red Flags to Watch For

- She wants to "figure out payment later" — don't start without a deposit
- Scope keeps expanding without budget conversation — nail down Phase 1 tightly
- She wants to own everything including your tools/workflow — you retain your development methods
- No business plan beyond the idea — not your problem, but factor it into risk if taking equity

---

## Bottom Line

You've done the hard part of proving this is buildable. Charge accordingly. $5,000–$8,000 for a production MVP is fair, fast, and well below what she'd pay anyone else. If you want upside, take 5% of revenue in lieu of $2,000–$3,000 off the project fee. Get 50% upfront. Ship it.
