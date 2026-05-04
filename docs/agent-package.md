# pickedby.ai — Agent Package (External AI Research Brief + Prompt)
> Version: 2026-05-04 v2 (single-file consolidation)
> Author: CPO
> Audience: External AI agents (ChatGPT / Gemini / Claude / Perplexity / DeepSeek / Qwen / Grok)
> Purpose: One file that gives an external AI agent both **(A) the company context** and **(B) the research task**, safe to share with any third-party AI without leaking trade secrets.

---

## How to use this file

1. Send this entire file as the prompt to an external AI agent (one of: ChatGPT Pro Deep Research, Gemini 2.5 Deep Research, Claude, Perplexity Pro, DeepSeek, Qwen, Grok).
2. No additional attachments required — Part A is self-contained.
3. Expect a research response that follows the structure in Part B.
4. Answer language: English preferred (lowest hallucination across all major AIs); Korean acceptable for the executive summary section only.

---

# PART A — Company Context (read first)

## A.1 One-line definition

> **"The Google Stack for AI Recommendations."**
>
> Infrastructure that lets anyone with a domain — products, content, brands, professional presence — **measure, analyze, and (eventually) optimize** how often they appear inside AI-driven recommendations across the major large language models.

If Google Search Console is the webmaster tool for "pages on the web," pickedby.ai is the webmaster tool for **"anything discoverable inside AI answers."**

## A.2 The three-phase roadmap

| Phase | Google equivalent | Our product | Status |
|-------|-------------------|-------------|--------|
| Phase 1 | Search Console | AI visibility score + diagnostic | ✅ Shipped to production |
| Phase 2 | Analytics (GA4) | Recommendation frequency tracking, category benchmarks, prescription engine | 🔄 In progress |
| Phase 3 | Ads | AI placement optimization (and real ads when LLM platforms open APIs) | 🔮 2027 target |

This is **not** an "AI score calculator." The score is the entry point. The roadmap is the product.

## A.3 Target audience (critical — don't narrow it)

The unit of measurement is **"anything that wants to be discovered by AI"** — products, content, brands, personal presence.

| Tier | Audience |
|------|----------|
| **Tier 1 (priority)** | Indie / B2B SaaS · Marketing & Design Agencies · Consultants & Coaches |
| **Tier 2 (expansion)** | Newsletter operators · D2C brands · Online course creators · Authors |
| **Tier 3 (endgame)** | **Anyone discoverable by AI** — the entire AI answer surface |

**Important framing rules (do not violate in any deliverable):**
- The Phase 1 entry point includes digital creators (Gumroad sellers, Notion template authors, etc.), but they are a **first seed segment, not the only customer.**
- Never describe the product as "for creators only" or "for {single platform} sellers only." That phrasing is explicitly retired.
- Market scope: **global, English-language**.

## A.4 Why now (market context)

- AI referral traffic +527% YoY (Semrush, 2025)
- LLM-driven conversion rate ≈ 16.8%, vs Google's 1.76–2.8%
- ChatGPT handles ~50M shopping queries per day
- ~70% of digital products lack Product schema → invisible to AI answer engines
- GEO/AEO tooling market CAGR ~40.6%, projected ~$17B by 2034
- **Most existing tools target enterprise/large brands.** The long tail (indie SaaS, agencies, content publishers, individuals with a domain) has almost no purpose-built tooling.

This is the "2005 SEO moment" — the empty chair where Moz, Ahrefs, and Semrush were eventually born. Our bet is that the equivalent stack for the AI recommendation layer will be built over the next 36 months.

## A.5 What we make (public surface)

### Phase 1 — shipped
1. **Free 10-second check** — enter a URL or product name → instant AI Visibility Score (no signup required for the first check).
2. **Score breakdown** — four measured dimensions (categorical only; the exact weighting and formula are private):
   - Direct Recognition across major LLMs
   - Category ranking ("best {category}" appearance)
   - Co-recommendation with peer products / content
   - Independent web authority signals
3. **Pass Indicator** — four tiers (Perfect / Strong / Emerging / Invisible).
4. **Visibility badges** — Gold / Silver / Bronze, embeddable.
5. **Daily measurement** (for registered users) — automated overnight check + Daily Pulse summary.
6. **Trend / Volume / Journey views** — historical visibility curves.

### Phase 2 — in progress
The product is shifting from a **measurement tool** to a **growth coach**:
- **Diagnose**: explain *why* the score is what it is (which engines don't recognize, which competitors are recommended instead).
- **Prescribe**: produce a small list of prioritized actions ("publish a Show HN post," "add llms.txt," "ship the missing schema") with severity and estimated impact.
- **Track**: log when the user marks an action complete; correlate with score change on the next measurement.
- **Reward**: streaks, milestones, growth report cards.
- **Viral**: shareable "27 → 68 in 3 weeks" cards.
- **Organic loop**: shared cards bring new users → measurement → diagnosis → ... → flywheel.

### AI coverage
Standard positioning: **covers all five major large language models** — GPT, Gemini, Claude, Grok, Perplexity. Lower-tier plans use a subset; higher-tier plans cover all five.

## A.6 Differentiation (the public claims)

1. **Whole-domain scope.** Products *and* content *and* personal brand — not limited to a single asset type.
2. **Five-LLM coverage** as the standard positioning, not a single AI.
3. **10 seconds, no signup** for the first check.
4. **Coach, not scale.** We don't just show a number; we tell users what to do next and track whether it worked.
5. **Honesty principle.** We do not promise "AI will recommend you." We promise infrastructure: if you don't have it, you definitely won't be visible.

## A.7 Pricing (public structure only)

A free tier exists. Paid plans scale across power-user, professional (full 5-LLM coverage), and agency (white-label) segments. Exact prices are public on the site. We do not share private launch promotions in this brief.

## A.8 Competitive landscape (named players, neutral framing)

| Category | Examples (public) | How we frame the difference |
|----------|-------------------|------------------------------|
| Enterprise AEO platforms | Otterly AI, Profound | Built for marketing teams and large brands. We focus on the long tail and the entry-point free flow. |
| Free AI visibility checkers | trysight.ai, llmclicks, amionai, amivisibleonai | Focused on measurement only. We add diagnosis, prescription, and tracking. |
| Vertical AEO tools | Durable (local biz), Goodie AI (B2B SaaS) | Single-segment. We are scope-wide (Search Console analogy). |
| Established SEO suites entering AEO | Ahrefs, Semrush, HubSpot | Strong distribution; we differentiate via the coach loop and the long-tail audience. |

We do **not** target Fortune 500 / large enterprise sales motions. That market is already served well.

## A.9 Team & operating shape

- Solo founder + AI agents acting in product / engineering / growth / QA roles.
- Bootstrapped. No outside capital.
- Lean operating cost: serverless edge stack, managed Postgres, off-the-shelf transactional email, free + paid LLM tiers. Internal vendor choices are not required for this research.
- Time budget for marketing work: roughly half a working day per day (the founder also runs an unrelated product).

## A.10 Distribution stance (today)

We are mid-experiment on channel mix. Lessons learned so far:
- **Long-form, building-in-public communities** with high ICP density (e.g. founder-focused forums) outperform broad social platforms for a zero-network account.
- **SEO + dev-community cross-posting** compounds; ephemeral platforms do not.
- **Single high-stakes launches** (Product Hunt, Show HN) are scheduled for an upcoming launch window, sequenced with prepared LLM-native distribution surfaces (custom GPTs, Gemini Gems, Perplexity Spaces, Poe).
- We have an explicit policy against any form of automated posting on social platforms.

## A.11 What we will not do (hard constraints)

- ❌ "AI will recommend you" claims (legal + trust risk)
- ❌ Automated posting / engagement on any social platform
- ❌ Narrowing copy to "creators only" or single-platform-only audiences
- ❌ Enterprise sales motion (we cede that to the existing enterprise vendors)
- ❌ Korean-language marketing or Korea-specific channels (the product is global English)
- ❌ Spam-flavored growth tactics (paid Reddit comment ops, low-cost "viral seeding" gigs, etc.)

## A.12 What this brief intentionally omits

- The exact score formula and weighting of the four dimensions
- Internal probe prompts, prompt-engineering details
- Internal database schemas, vendor names, environment configuration
- Beta signup numbers, ARR, MRR, exact runway, exact ad spend
- Specific internal codenames for sprints / features / experiments
- Specific dollar amounts for individual plan tiers (already public, but not duplicated here)

If an answer requires any of the above, please answer with: "out of scope of this brief — please ask the founder directly."

---

# PART B — Research task (what we want from you)

You are a **senior independent marketing analyst** with the following assumed expertise:
- Has analyzed 100+ bootstrapped indie SaaS companies that went from 0 → $10K MRR (or 0 → 100K monthly UV) between 2020–2026.
- Knows the GEO / AEO / SEO tool landscape well (Otterly, Profound, trysight, Ahrefs, Semrush, etc.).
- Familiar with Indie Hackers, Hacker News, Product Hunt, Dev.to, programmatic-SEO, free-tool, and building-in-public playbooks.
- Will mark uncertain claims as uncertain ("approximate," "no verifiable source") rather than fabricate.

Answer the three tasks below, in order, in clearly separated sections. Do not blend them.

---

## Task 1 — Reference companies

Find at least **10 reference companies** that resemble pickedby.ai's *current state*. "Resembles" means **all** of the following must be true:

- ✅ Bootstrapped, solo or 2–3 person team. No Series A or larger funding.
- ✅ In an adjacent or comparable domain: GEO / AEO / SEO / web visibility / web analytics / free measurement tools / building-in-public SaaS that targets long-tail audiences.
- ✅ Demonstrably reached **0 → $10K MRR or 0 → 100K monthly UV** between 2020 and 2026.
- ❌ Not enterprise sales-led.
- ❌ Not pure consumer apps unrelated to measurement / discoverability.

For each company, return a row with the following columns:

| Column | Detail |
|--------|--------|
| Company + URL | |
| Founded | YYYY-MM |
| Team size | 1 / 2 / 3+ |
| Domain | GEO / AEO / SEO / Visibility / Analytics / Other |
| ICP | Specific audience |
| Differentiation | One line |
| Pricing model | Free + Pro $X / lifetime / subscription |
| 0 → 1 channel | How they got first ~100 users |
| 1 → 10 channel | How they grew to ~1,000 users |
| Key success driver | One phrase (e.g. "pre-built Twitter audience of 7K," "programmatic SEO long-tail," "Product Hunt #1 of the day") |
| Failure modes (if any) | What went wrong, if applicable |
| **Where pickedby.ai differs in a way that matters** | Important — what would be dangerous to blindly copy |
| **Patterns we can borrow** | 1–3 concrete actions |

Distribute the 10+ across these buckets, with at least one per bucket:
1. **GEO / AEO tools** (e.g. trysight.ai, llmclicks, amionai, Goodie AI, plus any dark-horse candidates you find)
2. **Free SEO / visibility tools** (e.g. early Ubersuggest, Detailed.com, X-ray.tools)
3. **Indie analytics SaaS** (e.g. Plausible, Fathom, Simple Analytics, early Splitbee)
4. **AI-era free-tool virality cases** (e.g. There's An AI For That, AI Tool Report, Insidr.ai)
5. **Solo-founder Product Hunt / Show HN top launches** (e.g. Marc Lou's launches, Tony Dinh's TypingMind, Pat Walls' Starter Story) — only when their playbook is reproducible by a 1-person team without a pre-existing audience

Exclude:
- ❌ Series-A+ funded companies (CrowdStrike, SentinelOne, Datadog scale)
- ❌ Pure AI agent builders (CrewAI, LangChain, n8n) — different domain
- ❌ Mega SEO suites (Ahrefs, Semrush) — too large to be a useful template

---

## Task 2 — Marketing success patterns and an applied 8-week plan

### 2.1 Pattern extraction
From the reference companies in Task 1, identify:
- **Common Success Patterns** — behaviors repeated by 3+ companies
- **Outlier Wins** — single-company moves that produced disproportionate results
- **Anti-Patterns** — moves that look attractive but failed for similar profiles

### 2.2 Match score
For each pattern, score how well pickedby.ai can apply it given the constraints in Part A:

| Pattern | Source companies | Applicability (0–10) | Reason |
|---------|------------------|----------------------|--------|
| e.g. Free tool → result page → SEO long-tail capture | NeilPatel, X-ray.tools | 9 | Compatible with our existing free check + result page |
| e.g. Pre-built Twitter audience → launch | Marc Lou, Tony Dinh | **0** | Not applicable — see Part A.10 / A.11 |
| ... | ... | ... | ... |

If applicability is 0, mark it explicitly and explain why.

### 2.3 Eight-week tactical plan
**Window:** 2026-05-05 (W1 start) → 2026-07-04 (high-stakes launch day).

**Constraints:**
- Founder time: ~30 hrs/week
- Team: solo + AI agents
- Marketing budget: minimal (existing infra spend only)
- Channels available: Indie Hackers, blog SEO + Dev.to cross-posting, Hacker News (Show HN — single-shot, save for launch week), prepared LLM-native distribution surfaces (custom GPTs / Gemini Gems / Perplexity Spaces / Poe)
- Channels not available: any social platform requiring an established follower base from zero, automated posting tools

Return a week-by-week table:

| Week | Dates | Channel | Concrete action | Hours | Expected outcome | Source case |
|------|-------|---------|-----------------|-------|------------------|-------------|
| W1 | 05-05 – 05-09 | Indie Hackers | ... | 5h | First 5–10 followers | ... |
| ... | ... | ... | ... | ... | ... | ... |

Total hours across 8 weeks must fit within ~240 hours (30 × 8).

### 2.4 Launch-day plan (the high-stakes day in week 7)
For Product Hunt + Hacker News Show HN sequenced on the same launch window, return a **minute-level action list** for:
- D-30 → D-7 (maker-network warmup, tease content, hunter outreach)
- D-1 (final hunter contact, asset finalization)
- D-day 00:00 PT (launch trigger)
- D-day +6h, +12h, +18h (sustain push)
- D+1 and D+7 (post-launch follow-up)

Include at least one concrete message template per touchpoint (LinkedIn, Indie Hackers, Hacker News — **no Twitter / X templates**, see A.11).

---

## Task 3 — Probability stack and risk map

### 3.1 Define success
Pick one of the following success definitions for the launch window and justify the choice for our team profile (solo + AI, no pre-built social audience, English-only global market):

- 🟢 **Modest:** PH top 10 / 1,000 launch-day UV / 50 signups
- 🟡 **Median:** PH top 5 / 5,000 UV / 200 signups / 10 paid
- 🔴 **Stretch:** PH #1 of the day / 20,000 UV / 1,000 signups / 50 paid + Hacker News front page

### 3.2 Probability tree
Decompose:
```
P(success) = P(launch readiness) × P(launch-day traffic) × P(conversion) × P(7-day retention)
```
Estimate each factor with a base-rate citation (e.g. "Marc Lou ShipFast PH #1 case study, 14K Twitter audience" — and explain how we differ).

### 3.3 Probability boosters
List **5 high-leverage, low-cost actions** that move the probability tree the most:

| Action | Affects | Boost | Hour cost | Source case |
|--------|---------|-------|-----------|-------------|
| e.g. D-30 hunter outreach to 5 people | P(launch traffic) | 0.40 → 0.55 | 3h | Marc Lou ShipFast |
| ... | ... | ... | ... | ... |

### 3.4 Honest limits
Explicitly state:
- "No marketing plan can guarantee success."
- The **realistic ceiling probability** for the chosen success definition, with reasoning.
- Top 3 risks with mitigation for each.
- External variables outside our control (algorithm changes, competing launches, geopolitical events, etc.).

### 3.5 Plan B and Plan C
What we should do if the launch underperforms:
- Within 24 hours
- Within W+1 to W+4
- Within 6 months (e.g. switch to a steady programmatic-SEO build, or reset for a second launch window)

---

## Answer format requirements

1. Answer in **English** (preferred). A **Korean executive summary** at the very end is welcome but optional.
2. Use Markdown tables wherever this brief asks for tables.
3. Cite sources by company name + URL. If you cannot verify a number, say "approximate, no verifiable source."
4. **Do not fabricate.** If a fact is not known, say "unknown."
5. Length: 5,000–15,000 words is appropriate. Prefer density over filler.
6. Answer Tasks 1 → 2 → 3 in order. Do not interleave.
7. End with two final lines:
   - **One-sentence headline insight.**
   - **The single highest-priority action we should take in the next 48 hours.**

## Self-check before answering

Tick all five before you start writing:
1. Did I read Part A in full?
2. Do I understand the four hard constraints (no automated social, no enterprise motion, no "creators only" framing, English-only global market)?
3. Am I prepared to cite sources for every claim?
4. Will I avoid recommending channels we have already retired (no automated social posting; ephemeral channels with sub-zero ROI for a zero-network account)?
5. Will I treat "unknown" as a legal answer rather than guess?

If you cannot tick all five, do not start.

---

*pickedby.ai · agent package · single-file consolidation · CPO 2026-05-04 v2*
