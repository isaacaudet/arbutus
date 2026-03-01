# Arbutus — Technical Direction & iCal Architecture

> Current implementation, why it's built this way, and where it goes next.

---

## What Arbutus Actually Is (Technical Framing)

Arbutus is a **discovery and routing layer**, not a booking system. The distinction matters architecturally:

- We don't hold appointment state
- We don't charge patients
- We don't compete with Jane App
- We surface availability and route patients to where the booking actually happens

This shapes every technical decision. We read calendars; we don't own them.

---

## How iCal Works

iCal (`.ics`) is a plain text file format, not an API. There are no keys, no SDK, no developer account. A calendar URL just returns a text file that looks like this:

```
BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20260226T140000Z
DTEND:20260226T150000Z
SUMMARY:Client appointment
END:VEVENT
END:VCALENDAR
```

Jane App, Google Calendar, Cliniko, and most booking systems expose a public iCal URL per calendar. Anyone with the URL can read it. This is intentional — it's how calendar apps sync with each other.

**There are no hard quotas.** The practical limit is "don't be aggressive enough to annoy their ops team." Fetching every few minutes across dozens of providers is completely fine.

---

## Current Caching Strategy

**Search results page:** Cache each provider's iCal feed for 5 minutes. Fast enough to feel live; infrequent enough to be respectful and keep latency low.

**On slot click-through:** Bypass the cache and do a fresh fetch for that one provider before redirecting to Jane App. This is the moment staleness matters most — the patient is about to land on a booking page. Adding 300–500ms here is worth it to send them with the freshest possible data.

**Why not fetch on every page load?** Latency. Fetching 10–20 iCal files in parallel on every search adds 1–2 seconds to load time. Users notice. The 5-minute cache eliminates that entirely.

---

## The Staleness Problem (Honest Assessment)

iCal is a pull protocol. There is no push. No webhooks. No real-time.

Even with a fresh fetch at click time, a slot could be booked in Jane App in the 10 seconds between our fetch and the patient arriving. This is unavoidable with iCal.

**How we handle it:**
1. Fresh fetch at click-through reduces the window to near-zero in practice
2. Soft slot locking (see below) prevents two Arbutus users racing to the same slot simultaneously
3. Clear error handling if a patient lands on an already-booked slot — show them the next available times immediately, don't leave them stranded

This is an acceptable tradeoff for V1. The edge case is rare. When it happens, a good error message recovers the patient.

---

## Slot Locking (V1 Feature)

When a patient clicks a slot on Arbutus, we write a temporary lock to our database:

```
provider_id: sarah-chen
slot_start: 2026-02-27T15:00:00Z
locked_until: 2026-02-27T15:15:00Z  ← 15 minutes
```

Any other Arbutus user who loads the page during that window sees that slot as dimmed/unavailable.

**What this solves:** Two Arbutus users simultaneously racing to the same Jane App page.

**What this doesn't solve:** Someone booking that slot directly in Jane App, bypassing Arbutus entirely. We can't prevent that — it's their calendar. The fresh-fetch-on-click mitigates this.

Locks are stored in Supabase. Simple table. Locks expire automatically after 15 minutes whether or not the patient completes the booking.

---

## Conversion Tracking

This is the most important feature for the business, not just the tech.

Every time a patient clicks through to a provider's Jane App booking page, we log:

```
provider_id, slot_time, clicked_at, patient_session_id
```

We cannot (without a Jane App integration) confirm whether the booking actually completed. Options:

1. **Self-reported:** Weekly email to provider — "Arbutus sent you X referrals. How many booked?" — with a simple link to confirm. Manual but it works early on.
2. **UTM parameters:** Append `?utm_source=arbutus` to booking URLs. If the provider has Google Analytics on their Jane App page, they can see conversion data. Limited but zero-effort.
3. **Post-booking survey:** After redirecting, show a "Did you book? Let us know" page with a simple Yes/No. Voluntary, but even 30% response rate gives useful signal.

The conversion data is what you show providers to justify the monthly fee. Build this before you build anything else.

---

## The Provider Data Problem

Right now providers are hardcoded in a JSON file. For real operation:

- Providers self-register via a form
- Data lives in Supabase
- Provider pastes their iCal URL from Jane App settings
- We validate the URL on save (fetch it, confirm it parses)
- Provider edits their own working hours, slot duration, bio, photo

The iCal URL from Jane App is found in:
`Jane App → Settings → Integrations → Export Calendar → Copy iCal link`

It's a permanent URL that auto-updates as their calendar changes. They paste it once and forget it.

---

## Future: Jane App Partnership

The case for approaching Jane App eventually:

- iCal gives us read-only access to their calendar data
- We can track referrals but not confirm completions
- A formal integration would give us: real-time availability (webhooks), booking creation via API, confirmed conversion data

**When to approach them:**
Not now. Approach with traction. "We have 40 Jane App practitioners and we drove X confirmed bookings last month" is a completely different conversation than a cold API request.

**What we'd ask for:**
- Webhook notifications when a calendar event is created/modified (real-time availability)
- Read access to availability slots via API (supplement or replace iCal)
- Ideally: write access to create bookings programmatically (turns us from a routing layer into a full booking flow)

**Their incentive:**
We make Jane App stickier. Practitioners who get bookings through Arbutus have more reason to stay on Jane App. We're driving retention, not competing with them. That's the framing for the partnership pitch.

**The risk:**
Jane App could view us as competitive and try to block iCal access. This is unlikely — iCal is a standard they expose publicly and practitioners would be furious if it broke. But it's the reason to move fast, get traction, and get to a partnership before they notice you.

---

## What Real-Time Would Actually Look Like

With a Jane App API partnership (or for Google Calendar users now):

**Google Calendar push notifications** are available today, no partnership required:
- Provider connects Google Calendar via OAuth
- We register a webhook with Google
- Google sends us a push notification within seconds of any calendar change
- We immediately re-fetch and update our cache

For the subset of providers on Google Calendar, this is buildable now and gives genuine real-time availability. Worth doing in V2 for early adopters.

For Jane App providers: depends on their API access program.

---

## Build Priority Order

1. **Conversion click tracking** — log every slot click to Supabase. The business metric.
2. **Reduce cache to 5 minutes** — simple config change, immediate improvement.
3. **Fresh fetch on click-through** — bypass cache at the moment of redirect.
4. **Soft slot locking** — 15-minute holds in Supabase, prevents Arbutus-side double-booking.
5. **Provider self-serve** — Supabase auth, provider dashboard, iCal URL input.
6. **Google Calendar webhooks** — real-time for Google Cal providers (V2).
7. **Jane App API** — when you have the traction to earn it (V3).
