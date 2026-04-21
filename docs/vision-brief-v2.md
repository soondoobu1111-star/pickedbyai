# pickedby.ai — Vision Brief v2.0

> **Last updated:** 2026-04-14
> **Status:** Vision Aligned (replaces all prior briefs)
> **Audience:** Claude Code + any future contributor
> **Related files:** `vision-rules.json`, `CLAUDE.md`

---

## ⚠️ READ THIS FIRST (Claude Code)

You have spent the last 10 days building this product under the assumption that it is a **"AI visibility score calculator for digital creators."** That understanding reflects about 10% of the founder's real vision. This document delivers the other 90%.

From this point forward, every single task — a button color change, a copy tweak, a new endpoint — must pass one test:

> **"Does this contribute to the Search Console → Analytics → Ads roadmap?"**

If the answer is "no," do not do it. If the answer is unclear, ask the founder before acting.

---

## 1. Service Direction (The Real Vision)

### One-line definition
**"The Google Stack for AI Recommendations"** — infrastructure that lets creators, content publishers, brands, and businesses **measure, analyze, optimize, and (eventually) buy** the visibility of their **products AND content** inside AI-driven recommendations.

> 🔴 **Scope update (2026-04-21, CEO confirmed):** The unit of measurement is not just "products." It's **anything that wants to be discovered by AI** — a SaaS product, a Gumroad template, a blog post, a YouTube channel, a news article, a personal brand, an Etsy shop, a D2C store, or a Substack newsletter. If Search Console is for "pages on the web," pickedby.ai is for **"anything discoverable in AI answers."**
>
> 🔴 **AI coverage rule (2026-04-21, CEO confirmed):** pickedby.ai's standard positioning is **"covers all 5 major AIs: GPT · Gemini · Claude · Grok · Perplexity."** External copy (landing, application, marketing, blog, pitch) must always reflect 5-AI coverage. Never describe the product as limited to a single AI or 2 engines. The 2-engine beta (Gemini + Perplexity) is a staged execution reality, not the product definition. v2.0 launch adds GPT/Claude/Grok.

### The three-layer roadmap

| Phase | Google Equivalent | Our Product | Status |
|-------|-------------------|-------------|--------|
| **Phase 1** | Search Console | pickedby.ai — AI visibility score + Probe | ✅ MVP shipped |
| **Phase 2** | Google Analytics (GA4) | Recommendation frequency, rank tracking, category benchmarks | 🔜 MVP possible in 2–4 weeks |
| **Phase 3** | Google Ads | AI-placement optimization (+ real ads when platforms open APIs) | 🔮 Target 2027 |

### Why this vision matters (market context)
- Google Search usage is migrating to AI chatbots (AI referral traffic +527% YoY)
- ChatGPT handles ~50M shopping queries per day
- AI-driven conversion rate is ~16.8% vs Google's ~1.76–2.8%
- **The AI recommendation layer has no measurement/optimization tools yet.** This is the 2005 SEO moment — the empty chair where Moz and Ahrefs were born.
- GEO market CAGR 40.6%, projected $17B by 2034
- **Zero creator-focused GEO tools exist.** All 24 known tools target enterprise.

### Target strategy (do not misread)
- **Phase 1 entry point = digital creators** (Gumroad / Etsy / Notion) — they are the **first seed segment**, not the **only customer**.
- **Phase 2 expansion = indie SaaS, D2C brands, marketing agencies, content publishers** (blogs · newsletters · YouTube · Substack · news media)
- **Phase 3 endgame = anyone discoverable by AI** — products, content, brands, personal presence. The entire AI answer surface.

**🚨 Mandatory copy fix:** Remove "Not for agencies. Built for creators." immediately. That sentence is actively pushing future customers away.

### Moat strategy (start building NOW)

The single most important technical task right now is the **Probe Log Database**:
- Store every AI Probe result with: timestamp, query template, AI source, result text, detected rank, co-recommended products
- This dataset is the raw material for Phase 2 (Analytics) and Phase 3 (Ads)
- **We already run Probes — we just need to record the outputs.**
- Google's 20 years of click logs are the real moat behind Google Ads. Same principle here.

### Phase 2 core technical challenge

**Problem:** How do you track when an AI actually recommends your product? (This is what GA4 fundamentally solves with browser tags — but AI chatbots don't run your JavaScript.)

**Solution (hybrid):**

1. **Estimation-based** (possible today): Daily automated Probes across hundreds of query templates → derive "recommendation probability" as a proxy metric
2. **Direct tracking** (medium-term): A pickedby.ai SDK/tag that creators install on their own site — captures `utm_source=chatgpt` style referrals → **this SDK itself becomes Moat Layer 2**

Start with #1 immediately. Prototype #2 within 3–4 weeks.

---

## 2. Site — Description & Content Overhaul

### Current problem
- Hero sells a **feature**, not a **vision**: *"Does ChatGPT recommend your product?"*
- The roadmap is invisible. The ambition is invisible.
- Visitors conclude: "oh, a score calculator."
- This single framing is losing us investors, press, top-tier early adopters, and future hires.

### Fixes

#### 2.1 Hero section (required, P0)

**H1 (large):**
> The AI Visibility Platform

**Subhead (smaller):**
> Search Console, Analytics, and (soon) Ads — for the AI era.
> Start free. No signup.

**Primary CTA:** `CHECK MY SCORE FREE ▶▶`

**Supporting line below CTA:**
> Starting with digital creators. Built for the entire AI economy.

Design notes:
- The word `(soon)` is intentional — it hints at the roadmap and triggers early-adopter FOMO
- Completely remove "Not for agencies"
- Move the current 5-dimension explainer below the fold

#### 2.2 New section: Roadmap diagram (directly under hero)

Render visually in HTML/CSS:

```
┌─────────────────────────────────────────────────────┐
│       The Google Stack for AI Recommendations       │
├─────────────────┬──────────────────┬─────────────────┤
│   ✅ AVAILABLE  │  🔜 COMING Q3    │     🔮 2027     │
│                 │                  │                 │
│     MEASURE     │     ANALYZE      │    OPTIMIZE     │
│  Search Console │  Analytics (GA4) │  Ads Platform   │
│                 │                  │                 │
│   Know if AI    │   Track your AI  │  Optimize for   │
│    knows you    │  traffic & trends│   AI placement  │
└─────────────────┴──────────────────┴─────────────────┘
```

**This single section converts the perception from "calculator" to "platform" in under 10 seconds.** Lowest-cost, highest-impact change on the entire site.

#### 2.3 New page: `/manifesto`

Title: **"Why we're building the Google of AI recommendations"**

Structure (5 sections, roughly 150–250 words each):

1. **The old search is dying** — data on migration from Google to AI chatbots (527%, 50M queries, 16.8% conversion)
2. **The new search has no tools** — no Search Console, no GA4, no Ads for AI recommendations
3. **This is 2005 all over again** — the empty seat where Moz/Ahrefs were founded
4. **We're filling that gap — in three layers** — the roadmap
5. **We're starting small but thinking big** — creators today, the entire AI economy tomorrow

**This single page replaces the investor pitch, the press release, the recruiting post, and the early-adopter pitch.** Write once, reuse everywhere.

#### 2.4 FAQ additions

- **"Is this just for creators?"** → "We're starting with creators because they need it most and have no existing tools. Our roadmap extends to D2C brands, SaaS, and every business that sells online."
- **"What's coming next?"** → Roadmap summary + Phase 2 ETA
- **"Why should I trust this will grow?"** → Market data + 10-day build velocity

#### 2.5 Header nav restructure

```
Before: BLOG | HOW WE SCORE | DASHBOARD
After:  PLATFORM ▾ | MANIFESTO | BLOG | DASHBOARD
        └─ Search Console (now)
        └─ Analytics (soon)
        └─ Ads (2027)
```

#### 2.6 Implementation priority

1. 🔴 **P0 (today)** — Hero copy + remove "Not for agencies" + roadmap diagram section
2. 🟠 **P1 (this week)** — `/manifesto` page
3. 🟡 **P2 (next week)** — Nav restructure, FAQ update
4. 🟢 **P3 (within 2 weeks)** — Probe Log DB schema + start recording

---

## 3. Distribution Strategy — How We Actually Get Users

### Principles
- **Stop coding, start talking.** 275 commits is already excessive. The next 30 days are for talking to humans.
- **1:1 give-first over 1:N broadcast.** Blogs, SEO, and ads are secondary.
- **Two-track strategy.** Different targets demand different channels and different messages.

### Track A — Creators (Reddit, email, Discord)

**Goal:** Phase 1 seed users, Probe log data collection, testimonials
**KPI:** 100 emails, 10 calls, 10 paying seeds in 30 days

**Tactic: "Top 100 Preemptive Scan"**

1. Manually list 100 top-selling creators on Gumroad, Etsy, Notion marketplaces
2. Scan every single one through pickedby.ai
3. Draft 3 personalized improvement tips per creator
4. DM/email each one with **an unsolicited gift report**
5. Book 15-minute calls with responders → ask "what is this worth per month to you?"
6. Feed answers back into pricing, UX, and messaging

**Sample message:**
> Hey [name], I'm a fan of [product name] so I ran it through pickedby.ai. It scored 34/100 and Perplexity doesn't know it exists yet. I put together 3 specific fixes — happy to send them over. Ignore if not useful.

**Do NOT:**
- Re-spam r/SideProject or r/Entrepreneur
- Rebuild X automation
- Pay for AI directories

### Track B — Vision Audience (LinkedIn) ⭐ NEW

**Goal:** Phase 2/3 pilot partners, investor network, press, vision believers
**KPI:** 20 real conversations, 3 pilots, 2 investor meetings in 30 days

**Target (5 groups × 20 people = 100 total):**

| Group | LinkedIn search query | Why |
|-------|------------------------|-----|
| Marketing execs (CMO/VPM) | "VP Marketing" + "DTC" + "Shopify" | Phase 2 pilot customers |
| SEO/GEO consultants | "GEO", "Answer Engine Optimization", "AI SEO" | One consultant = 100 downstream users |
| D2C founders | "Founder" + "Shopify" + "DTC" | 10× the willingness-to-pay of creators |
| AI/SaaS seed investors | "Seed" + "AI" + "MarTech" | Prep the seed round |
| Tech journalists | "TechCrunch", "The Information", AI beat | The "Google for AI" story sells |

**Signal scanning criteria for Claude Code:**
- Mentioned any of: "AI search", "GEO", "ChatGPT recommendation", "AI visibility", "AEO", "answer engine", "AI shopping" — within the last 30 days
- Liked/commented on related posts
- Company is shipping AI-related features

**Message template (this is "insider seat," not "free gift"):**
> Hey [name], saw your post on [specific topic]. I'm building the Search Console + GA4 layer for AI recommendations — pickedby.ai. MVP shipped 10 days ago, already running real Probes against Perplexity and GPT.
>
> I'm opening 5 early pilot seats. Free 30-day Analytics report for up to 3 of your products. All I need back is feedback. Ignore if not useful.

**🚨 NO AUTOMATION.** The original Czerny playbook sells "1-click, 300 skills, full automation." **Do not follow that part.** We already lost the X account to an automated bot — the same mistake on LinkedIn would be fatal.

**Cadence:** 10 manual sends per day × 10 days = 100 total. Claude does research and drafting. A human sends.

### Secondary channels (priority order)

1. **IndieHackers** (post scheduled 2026-04-16) — ship it, but rewrite with vision language
2. **YouTube reviewer outreach** — 10 Notion/Gumroad reviewers, free gift report each
3. **Facebook/Discord groups** — Notion Template Creators, Gumroad Founders, etc.
4. **Product Hunt** — raise gate from 50 to 100 emails before launching
5. **AlternativeTo** — unlocks 2026-04-20

---

## 4. Additional Work Claude Code Needs to Cover

### 4.1 🔴 Urgent technical work (Week 1)

**(a) Probe Log Database**
- Schema: `probe_logs(product_id, query_template, ai_source, result_text, detected_rank, co_recommendations[], timestamp)`
- Backfill existing Probe runs
- This is the raw material of Phase 2 and Phase 3

**(b) Hero / roadmap / manifesto build-out** — everything marked P0 and P1 in section 2

**(c) Full copy audit**
- Search and fix every instance of "Not for agencies," "creators only," or similar shrinking language
- Audit all 13 blog posts for the same issue

### 4.2 🟠 Short-term (Weeks 2–3)

**(d) Daily Auto-Probe cron expansion** — scale from current setup to ~100 query templates, begin accumulating category benchmarks

**(e) Dashboard "Analytics (Coming Soon)" tab** — not fake UI, but a real preview powered by live Probe Log data. This is how we show early adopters that Phase 2 is real.

**(f) Email capture recopy** — change "Get your score in email" to **"Join the AI Visibility Platform early access (100 spots)"**. Scarcity + vision in one line.

### 4.3 🟡 Medium-term (Weeks 3–4)

**(g) SDK/tag prototype** — the direct-tracking half of the Phase 2 solution. Doesn't need to be polished; test with 3 pilot creators.

**(h) `/investors` page (noindex)** — Manifesto + roadmap + market data + 10-day shipping log + vision. Shared privately via Track B.

**(i) Category benchmark pages** — `/benchmarks/notion-templates`, `/benchmarks/etsy-printables`, etc. Built from Probe Log data. SEO + viral + funnel in one move.

### 4.4 🟢 Strategic items Claude Code tends to miss

**(j) User tracking cleanup** — "registered users = unknown" is unacceptable. Google OAuth is hooked up but not measured. Build a minimal internal analytics view.

**(k) Public Probe history** — let anyone see how a product's score evolved over time. Transparency = trust + auto-generated SEO content.

**(l) Weekly leaderboard** — "Most recommended products this week" auto-generated from Probe logs. Creates a viral hook, a return reason, and organic sharing all at once.

**(m) Legal & security re-review** — we probe third-party products. Confirm GDPR/CCPA alignment for stored external product data.

**(n) Localization roadmap** — if Korea is a target (see 모두의 창업 2026-05-15 deadline), we need at minimum a Korean landing + Manifesto before applying.

**(o) Runbook documentation** — solo-founder risk mitigation. Claude Code should maintain `/docs/runbook.md` covering architecture, deployment, recovery steps — so the site survives founder absence.

---

## 5. Standing Orders for Claude Code

### Execution order (strict)

1. Read this brief and `vision-rules.json` in full.
2. Before any code change, list every file/copy that conflicts with this vision. Get founder approval on the list.
3. Once approved, work strictly in P0 → P1 → P2 → P3 order. Do not start P1 before P0 is done.
4. For every task, answer first: **"Which roadmap layer does this serve — Search Console, Analytics, or Ads?"** If the answer is "none," do not do the task.
5. After each task, report in 3 lines: *(1) what changed, (2) vision-alignment check, (3) proposed next step.*

### Hard prohibitions

- ❌ Any copy that narrows the audience to "creators only"
- ❌ New blog posts, new landing pages, or new features that are not already in this brief
- ❌ Automated posting/messaging bots on any platform (the X ban was not a fluke)
- ❌ Skipping P0 to work on P3 because it's more interesting

### Version control

- Canonical location: `/docs/vision-brief-v2.md`
- Companion machine-readable rules: `/docs/vision-rules.json`
- Session entry point: `/CLAUDE.md` (must reference both above)
- On conflict between this brief and older instructions: **this brief wins**.

---

*End of brief. Save as `/docs/vision-brief-v2.md` and load it at the start of every session.*
