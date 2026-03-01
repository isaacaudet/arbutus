# Arbutus — Technical Roadmap & Business Case

> For the developer. Unfiltered.

---

## What This Actually Is

An aggregator that reads availability from practitioner calendars (via iCal or API) and surfaces open slots in a single interface. Think OpenTable for same-day wellness appointments. Revenue comes from practitioners, not patients.

The demo proves the concept. The gap between the demo and a real product is mostly:
1. Real booking (not just redirecting to Jane App)
2. Provider auth + self-serve onboarding
3. A database

---

## Current State of the Demo

| Thing | Status |
|---|---|
| Public search + slot display | ✅ Done |
| Booking page (mock flow) | ✅ Done |
| iCal parsing (real calendar feeds) | ✅ Done |
| Provider data | Hardcoded JSON |
| Auth | None |
| Database | None |
| Real bookings | Redirect only |
| Payments | None |
| Email | None |

---

## What a Real V1 Needs

### 1. Database — Supabase (PostgreSQL)

Replace `providers.json` with real tables. Free tier handles early growth, $25/mo after.

```
providers         — profile, specialty, neighborhood, bio, images, working hours
provider_users    — auth, linked to provider
bookings          — patient name/email, slot, provider, status
availability_cache — parsed iCal slots, TTL-based
```

Supabase gives you auth, database, storage, and realtime out of the box. No reason to use anything else at this scale.

**Cost: $0 → $25/mo**

---

### 2. Auth — Supabase Auth or NextAuth

Two types of users:
- **Providers**: log in to manage their profile, hours, and iCal URL
- **Admin (you)**: approve providers, view metrics, manage listings

Patients don't need accounts — they book as guests (name + email only).

**Cost: Included in Supabase**

---

### 3. Provider Dashboard

A simple `/dashboard` protected route where a provider can:
- Edit bio, photo, title, neighborhood
- Set working hours per day
- Paste their iCal URL (from Jane App, Google Cal, etc.)
- Set slot duration
- Preview how their card looks on the site

This is probably 2–3 days of real work, mostly forms.

**Cost: Your time**

---

### 4. Admin Panel

A simple `/admin` route (password-protected or Supabase auth with role check):
- Approve/reject provider applications
- View total bookings, clicks, active providers
- Manually edit any provider record

Could honestly just be a Supabase table view + a few custom pages. Keep it ugly and functional.

**Cost: Your time**

---

### 5. The Booking Integration Problem (The Hard Part)

This is the biggest architectural decision. Three options:

#### Option A: Redirect (current) — Easy, low value
Patient clicks a slot → opens Jane App in a new tab → books there.

- Pro: zero integration work
- Con: you lose the booking, can't track conversions, no data, providers don't love handing off mid-flow

#### Option B: Native Booking — Hard, high value
Patient books through Arbutus. You own the full flow, collect the data, and can charge commission.

Requires:
- Your own calendar/booking system (hold a slot for 10 min while patient fills form)
- Either a Jane App API integration to block the slot in their system, or telling providers to check Arbutus bookings and manually mark them in Jane App
- Email confirmations to patient + provider
- Handling cancellations

The "sync back to Jane App" piece is the hard part. Jane App has a limited partner API — you'd need to apply for access and it may not support creating bookings programmatically. Most clinics using Jane App could also just use a Google Calendar as their availability source and accept Arbutus as a parallel booking channel for last-minute only.

#### Option C: Hybrid (recommended for V1)
- Native booking form (patient fills in name, email, picks slot)
- Arbutus sends a booking request to the provider via email
- Provider confirms in Jane App manually (or clicks a link to auto-confirm)
- Patient gets a confirmation email once confirmed

This is 80% of the value with 20% of the complexity. No Jane App API needed. Slot is held optimistically.

**Recommended path: Option C → Option B when you have traction**

---

### 6. Email — Resend

Transactional email for:
- Booking confirmation to patient
- New booking notification to provider
- Cancellation notices
- Provider onboarding welcome

Resend is $0 for 3,000 emails/month, $20/mo after. Use `react-email` for templates.

**Cost: $0 → $20/mo**

---

### 7. Image Storage — Supabase Storage

Providers upload a headshot. Stored in Supabase, served via CDN. Nothing fancy.

**Cost: Included in Supabase**

---

### 8. Search — Keep It Simple

PostgreSQL full-text search is enough for V1. If you add more cities or specialties later, consider Algolia (generous free tier). Don't add complexity before you need it.

---

## Infrastructure Cost Summary

| Service | Free Tier | Paid |
|---|---|---|
| Vercel (hosting) | Hobby: free | Pro: $20/mo |
| Supabase (DB + auth + storage) | 500MB, 50k rows | $25/mo |
| Resend (email) | 3k emails/mo | $20/mo |
| Domain (arbutus.ca or .com) | — | ~$15/yr |
| **Total** | **~$0** | **~$65/mo** |

**Before you have 20 paying providers, your infra bill is effectively $0.**

---

## Business Registration (BC)

- Sole proprietor: ~$40 to register a business name with BC Registry
- Incorporate a BC company: ~$350 + ~$500 legal (optional for early stage)
- GST registration required once you hit $30k/yr revenue
- Business bank account: Scotiabank/TD startup accounts are free

You don't need to incorporate to start. Do it when you have revenue.

---

## Legal

- **Terms of Service**: Use a template (Termly, Bonterms) and customize. $0 if you do it yourself, $500–$2k if a lawyer touches it
- **Privacy Policy**: Same — required once you collect patient emails
- **Provider Agreement**: One page covering: what Arbutus provides, what the provider agrees to (accurate info, respond to bookings), liability limits

Don't overthink this early. A clear, plain-English TOS is fine at demo stage.

---

## Monetization Options

### Option 1: Monthly SaaS (Recommended to start)
Charge providers a flat monthly fee to be listed.

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Listed, up to 3 bookings/mo |
| Standard | $49/mo | Unlimited bookings, priority listing |
| Pro | $99/mo | Featured placement, analytics, multi-location |

**Unit economics at 50 paying providers:**
- Revenue: 50 × $49 = $2,450/mo
- Infra: ~$65/mo
- Gross margin: ~97%

**At 200 providers:**
- Revenue: 200 × $49 = $9,800/mo
- Infra: ~$200/mo (scaled Supabase, Vercel)
- Margin: ~98%

This is a software business. Margins are exceptional once past fixed costs.

---

### Option 2: Commission per Booking
Take a % of each booking that comes through Arbutus. Requires Stripe, more complex.

- Average massage: $120–$180
- 10% commission = $12–18/booking
- Requires you to collect payment (or at least track it)
- Providers hate commission models until they see results

Harder to sell, harder to implement. Better for V2 when you have proven ROI to show.

---

### Option 3: Hybrid (Long-term)
Free to list, commission only on bookings above a threshold. Aligns incentives. Come back to this.

---

## Development Phases

### Phase 0: Demo (Done)
- Static provider data, iCal parsing, mock booking, Vercel deploy

### Phase 1: Private Beta (2–4 weeks with AI)
- Supabase setup, provider table
- Manual provider onboarding (you add them via Supabase dashboard)
- Real booking request flow (form → email to provider)
- Email confirmations (Resend)
- 3–5 real Victoria providers, real iCal URLs

**Goal: One real provider using it, one real patient booking through it**

### Phase 2: Self-Serve (4–6 weeks)
- Provider sign-up + dashboard
- Admin approval flow
- Stripe billing ($49/mo)
- Better search (by neighborhood, time, rating)

**Goal: 10 paying providers**

### Phase 3: Scale (ongoing)
- Mobile app or PWA
- Multi-city (Vancouver, Kelowna, etc.)
- Commission tracking
- Reviews system
- Waitlist / cancellation notifications

---

## Key Risks

| Risk | Mitigation |
|---|---|
| Jane App blocks iCal access | Use Google Calendar as the canonical source for providers, Jane App as optional |
| Providers don't update their calendar | Build in a "stale calendar" warning on the dashboard |
| Double-booking | Slot locking + real-time cache invalidation |
| Low patient volume | Focus on providers first — they'll drive awareness to their own patients |
| Competitors (Jane, Mindbody) | They're booking systems, not aggregators. Different job. |

---

## What AI Can Build For You

With Claude Code or Cursor:
- All UI components and pages: fast
- Supabase schema + queries: fast
- Email templates: fast
- CRUD provider dashboard: fast
- iCal parsing edge cases: manageable

What takes real attention:
- Slot locking / race conditions (two patients booking same slot)
- Jane App API (if you go that route — docs are sparse)
- Stripe billing + webhooks
- Production monitoring / error handling

Realistic timeline to a functional private beta with daily AI-assisted work: **3–5 weeks**.

---

## Bottom Line

This is a real business. The tech is not the hard part — practitioner distribution is. Your advantage is that you can call one massage therapist, get her listed, and let her tell her colleagues. Victoria is a small market; word travels fast.

Start with 5 providers and one working booking flow. Charge nothing. Prove it fills slots. Then charge $49/mo and watch them happily pay it.
