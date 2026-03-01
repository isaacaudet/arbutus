# Arbutus — Me Thinking Out Loud

This isn't a formal pitch. I'm just writing down how I see this, what I've figured out technically, and where I'm still working things out. Take it as a starting point for a conversation.

---

## What I Built

The demo is real. It reads live calendar availability, shows open slots, and routes someone to a booking page. I put it together quickly using AI-assisted development, which is genuinely how software gets built now. The point is that the core concept works and there's something you can actually look at and click around on.

What it doesn't have yet is a real backend — actual practitioners, a database, user accounts, any of that. It's a proof of concept, not a product. But the hardest part to prove was always "can we read a Jane App calendar and show accurate availability" and the answer is yes.

---

## How It Actually Works

Jane App lets practitioners export a private calendar link. It's a URL that, when read, shows their current schedule. It updates automatically whenever something gets booked or cancelled. Getting set up takes about 10-15 minutes. A practitioner copies their calendar link from Jane App and pastes it into Arbutus. They set their working hours, because the iCal link only shows what's already booked and Arbutus needs to know the boundaries of the day to figure out what's genuinely open. And they fill in a short profile: photo, bio, neighborhood, session length. After that it's hands-off. The practitioner doesn't change anything about how they use Jane App day to day.

Arbutus checks that link every few minutes and shows whatever time slots are open within their working hours. When someone books a slot in Jane App, it disappears from Arbutus shortly after.

This calendar format (iCal) is a 30-year-old standard that pretty much every booking platform supports. So while we're starting with Jane App practitioners, expanding to others using different software is mostly a business question rather than a technical one. The system already knows how to read the data.

---

## The Limitation I Want to Be Upfront About

Because we're reading the calendar rather than being plugged directly into Jane App, there's a small gap where our data might be a few minutes behind. In a rare case, someone could click a slot that was just booked. They'd arrive at Jane App and find it taken.

We handle this two ways. Right before sending someone to Jane App, we do one final fresh check of that calendar. And when someone clicks a slot on Arbutus, we mark it as held for 15 minutes so another person browsing at the same time doesn't see the same opening.

It's not a perfect system. But it's a reasonable one for where we're starting. A deeper technical integration with Jane App down the line would fix this properly, and that conversation gets easier once there's real volume to point to.

---

## What Would Need to Be Built

To go from demo to real product, the main things are:

A way for practitioners to sign themselves up and manage their own profile, so it doesn't require me to manually add everyone. A database to store all of that. The referral tracking, so we know how many patients we're actually sending each practitioner. An admin area for you to approve new listings and see what's happening on the platform. And basic email — notifying a practitioner when a referral comes through, that kind of thing.

I can build this. The timeline depends on scope and how much time gets put into it — I don't want to commit to a number before we've talked through what exactly needs to be built.

---

## The Money Question (And I'm Being Honest Here)

Running costs are genuinely low. Hosting, database, email — we're talking under $65 a month even after things are up and running, and basically nothing while it's small.

The revenue model is where I'm less certain. The obvious approach is charging practitioners a monthly fee once we've proven we're filling slots for them. Something like $49 a month. Start free, introduce the fee once there's a track record.

The honest issue is that 20 practitioners paying $49 is about $1,000 a month. That's not nothing, but it's not a business either. To make the numbers interesting you'd need 100-plus paying practitioners, which means this has to work well enough that people actively want to be on it.

I don't have a clean answer on pricing. Commission per booking would be higher value per transaction but harder to implement and harder for practitioners to accept until they trust you. There might be a tiered model that makes more sense. This feels like something to figure out once you've actually got people using it, not something to solve on paper beforehand.

---

## What Getting Traction Looks Like

The technology is the easy part. Getting practitioners on board is the real work, and that's on you.

The pitch to a practitioner is simple: free to try, two minutes to set up, and if it fills even one or two last-minute slots a month it's paid for itself. You'd start by calling people you know and going from there. In a small professional community like Victoria, word moves fast once a few people have a positive experience.

Getting patients to find it is partly just having something useful. If someone opens Arbutus, finds a same-day slot in under a minute, and books it, they'll remember that. Some amount of local social media or targeted ads ($200-ish a month to start, just to test) would help. Local press might be worth pursuing too — a Victoria startup helping people find last-minute wellness appointments is a story worth telling.

---

## Where This Could Go

Jane App partnership is the long-term play on the technical side. Right now we're using a public standard they expose to everyone. A formal partnership would mean real-time updates and potentially completing bookings inside Arbutus without the handoff to their page. That's a better product. But you earn that conversation by showing up with real numbers, not by asking permission upfront.

Beyond that — other cities, other practitioner types, whatever the data says people actually want. That's all further out.

---

## What I Don't Know Yet

Honestly? Whether the $49/mo model is right. Whether practitioners care enough about last-minute slots to pay a recurring fee for this specifically. Whether patients will find it organically or whether it needs more pushing. These are real questions and I don't think anyone can answer them from a document.

The only way to find out is to get a few real practitioners on it and see what happens.
