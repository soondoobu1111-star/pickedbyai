# pickedby.ai Design System

The design system for **pickedby.ai — The AI Visibility Platform**.

pickedby.ai is a SaaS tool for digital product creators (Gumroad sellers, Notion template makers, Etsy shops, indie SaaS) that measures how visible their product is to AI assistants (ChatGPT, Claude, Perplexity, Gemini). It's positioned as the "Google Search Console for AI recommendations." Solo‑founder product (THUNOVA, Republic of Korea), currently in public beta with a 100‑user founding cohort.

The brand is deliberately **anti-marketing-site**: dark, data-dense, a little bit arcade. It reads like a tool a developer built for themselves. The hero metric is the **AI Visibility Score (0–100)**, and the entire visual system orbits that score.

## Surfaces

Two real products live in the source:

1. **Landing + content site** — `pickedby.ai/` homepage with score-check widget, manifesto, methodology, 20+ blog posts. Very text-dense, lots of stat callouts, minimal imagery.
2. **Dashboard** — logged-in app where verified product owners track scores over time, see dimension breakdowns, probe results, co-recommendations, and generate llms.txt / embed badges.

Both share the same primitives: gold-on-black, Press Start 2P for anything label-like, Inter for prose, zero rounded hero sections, no gradients.

## Sources

Everything in this system was lifted from the real repo the user attached. Nothing was invented.

- **Codebase** — `soondoobu1111-star/pickedbyai @ main` (landing/ subtree). Mirrored locally into `uploads/landing/` during setup. Key files read:
  - `uploads/landing/index.html` — homepage (2,678 lines) — full hero, score widget, FAQ, all CSS variables
  - `uploads/landing/dashboard.html` — the app (2,720 lines) — tabs, probe results, tool panels, settings
  - `uploads/landing/manifesto/index.html` — long-form voice
  - `uploads/landing/methodology/index.html` — how-we-score prose
  - `uploads/landing/blog/*/index.html` — 20+ blog posts for content tone
  - `uploads/landing/llms.txt` — the brand's own public manifest to AI crawlers (excellent tone sample)
- **Assets**
  - `uploads/logo-512.svg` / `.png` — the pixel crown mark
  - `uploads/og.png` — hero poster
  - `uploads/landing/logo-128.webp`, `logo-email.png`, `og-v2.png`, `blog/score-spectrum.jpg`

No Figma was provided. No design tokens file existed in the repo — tokens here were extracted from inline `:root` declarations across `index.html`, `dashboard.html`, and the manifesto.

## Index

- `README.md` (this file)
- `colors_and_type.css` — all CSS custom properties + semantic type utility classes (`.pba-h1`, `.pba-eyebrow`, `.pba-metric-label`, …)
- `SKILL.md` — Agent-Skills-compatible entry point
- `assets/` — logos (svg + png + webp), og images, score spectrum reference
- `preview/` — Design System tab cards (one file per concept)
  - **Brand** — `logo.html`, `og-imagery.html`
  - **Colors** — `color-brand.html`, `color-neutrals.html`, `color-score.html`
  - **Type** — `type-pixel.html`, `type-body.html`, `type-numerals.html`
  - **Spacing** — `spacing.html`, `radii.html`
  - **Components** — `nav-top.html`, `buttons.html`, `inputs.html`, `cards.html`, `chips.html`, `badges.html`, `score-ring.html`, `progress-bars.html`, `probe-rows.html`, `data-table.html`, `iconography.html`, `motion.html`
- `ui_kits/`
  - `landing/` — the pickedby.ai homepage recreation (hero, score result, FAQ, ticker)
  - `dashboard/` — the logged-in app (score check, dimensions table, probe results, tools)

---

## CONTENT FUNDAMENTALS

**Voice.** The brand speaks like an indie hacker who got burned, figured out what works, and is now telling you the unglamorous truth. First-person plural (“we shipped our MVP in 10 days”) mixed with direct second-person (“If you're not in that answer, you don't exist for that buyer”). Rarely formal. Never corporate.

**Casing.** Sentence case for body and headlines. `Press Start 2P` labels are **ALL CAPS** with wide letter-spacing (`METRIC · 0.1em`). Button labels are short and pixelated: `CHECK SCORE`, `SHARE ON X`, `CLAIM BADGE`.

**Pronouns.** "We" for the team/product. "You" / "your" for the creator being addressed. Never "users" in marketing copy — it's always "you" or "creators" or a specific persona (Gumroad sellers, Etsy shops, Notion template makers).

**Emoji.** Used, but surgically. Status glyphs only: ✅ ❌ ✦ 🏆 ✓ ~ · A sprinkle of 📡 📈 🔒 💡 🔜 🔮 for callout accents. Never decorative. Never on CTAs. Never in headlines.

**Unicode glyphs are a legit icon system.** `✦`, `▼`, `→`, `·`, `+`, `×` appear where a less self-aware brand would reach for an icon library. Counting this as intentional iconography (see ICONOGRAPHY).

**Numbers as copy.** Stats are loud and specific: *"AI referral traffic grew 527% YoY"*, *"50 million shopping queries hit ChatGPT daily"*, *"16.8% AI-driven conversion vs Google's ~2%"*, *"$17B GEO market by 2034"*. Always cited, always concrete.

**Sentence patterns.** Short. One idea. Then another. Then a longer sentence that ties them together and makes the point land. Blog posts lean hard on this rhythm.

**Sample voice** (from `blog/chatgpt-never-mentioned-me`):
> "She tried seven variations. ChatGPT never once mentioned her product. ... Good product + good reviews + happy customers = still invisible to AI, if the right signals aren't in the right places."

**Sample voice** (from `manifesto`):
> "The old search is dying. The new search has no tools. This is 2005 all over again."

**Sample voice** (from `index.html` FAQ):
> "No — and we'll never claim that. AI recommendations are dynamic. No tool can guarantee placement."

**What to avoid.**
- AI-industry platitudes ("revolutionize," "unlock," "empower").
- Fake urgency ("Don't miss out!"). There IS urgency — beta spots are real — but it's stated flatly.
- Filler adjectives. Never "amazing," "stunning," "seamless."
- Rhetorical questions as headlines… with one loud exception: *"Does AI recommend your product?"* That's the whole hook.
- Sentences longer than ~20 words in marketing copy.

**Casing for section labels.** Always `ALL CAPS + LETTER-SPACING` in pixel type: `SCAN RESULTS · TOP QUERIES · WHAT TO DO NEXT · HOW IT WORKS · UNDER THE HOOD · CHANGELOG`.

---

## VISUAL FOUNDATIONS

**Color vibe.** Black. Like, actually black — `#000` on the landing, `#0a0a0a` on the app, **never** a neutral-800 kind of dark. Gold (`#FFD700`) is the single brand accent; it is used _only_ for CTAs, the logo, key data values, and selection/focus states. Everything else is a 9-step grayscale from `#0a0a0a` → `#ffffff`. Semantic color (red/orange/yellow/green) is reserved for **score tiers** — nothing else gets to be red.

**Backgrounds.** Flat. `#000` on marketing, `#0a0a0a` in-app. No gradients. No mesh. No images-as-backgrounds. The only "background effect" is an optional interactive particle canvas on the homepage hero (sparse gold dots, mouse-repel, `rgba(255,215,0,0.22)`) — and even that is faint enough that it doubles as texture, not decoration.

**Type.** Two families, with a very clear division of labor:
- `Inter` (400/500/600/700/800) does all prose, body, headlines.
- `Press Start 2P` is the signature — logo, eyebrows, metric labels, button labels, score denominator, progress-bar captions. **Always uppercase, always letter-spaced ~0.1em–0.2em.** Sizes are unusually _small_ (0.35rem–0.85rem) because Press Start 2P is bulky at nominal size — this is intentional and a brand tell.
- `JetBrains Mono` appears in the llms.txt generator output and API snippets.

No display-serif. No handwritten accent. No variable-font flex.

**Imagery.** Deeply limited. Blog covers are flat infographics (score spectra, before/after number pairs, single pixel-art hero). Never photography of humans. Never stock illustrations. The og image is the dim grid + a single line of copy. When in doubt, **there is no image** — the design leans on data density and typography instead.

**Icons.** Unicode glyphs (`✦ ✅ ❌ ▼ → · + ×`) + one inline pixel-art SVG (the crown logo). No icon library. See ICONOGRAPHY.

**Borders.** `1px solid #2a2a2a` on cards. `1px solid #222` on section dividers. `1px solid #181818` between list items. Often borders render as _hairlines_ — the design reads as "wireframed" on purpose.

**Pixel corner accent.** A 10×10 gold square in the top-left corner of primary cards, and often a 6×6 grey square in the bottom-right. Achieved with `::before` / `::after` absolute positioning. This is the single most repeated micro-detail in the system.

**Shadows.** NONE in the glassy/blurred sense. The one shadow in the system is a **chunky pixel button offset** — `box-shadow: 3px 3px 0 #b39700` under gold CTAs, with `transform: translate(1px, 1px)` on hover so the button visually "presses." No `rgba()` blur shadows. No elevation system.

**Corner radius.** **Zero on the landing site** (cards, buttons, inputs are all perfectly square). The dashboard allows itself some radius — `6px` on inputs/ghost buttons, `8px` on cards, `12px` on modals — because it's a long-dwell app. This split is intentional and worth preserving.

**Animation.**
- Entrance: `fade-up` via IntersectionObserver — `opacity 0→1` + `translateY(18px)→0`, 0.55s ease.
- Gold "em" in hero headline pulses a text-shadow (`emglow`, 3.5s).
- Live dot pulses green (`liveblink`, 1.5s).
- Loading is a row of 5 pixel dots that blink sequentially (`pixelblink`, 1.2s, 0.2s stagger).
- Score counter animates `0 → N` in 40 steps on reveal.
- Buttons move 1px on hover, 3px on active, shadow contracts to 0.
- Gold badge has a pulse glow (`goldPulse`, 2.5s) — the _only_ glow effect in the system.
- Never bounces. Never springs. Never rotates.

**Hover states.**
- Links: `#888 → #fff`.
- Gold buttons: shadow shortens + button moves 1px toward it.
- Ghost (outlined-gold) buttons: background fills gold, text inverts to black.
- Cards with `.vital-card` or hoverable blocks: border becomes `rgba(255,215,0,0.35)`, bg shifts to `#0e0c00`.

**Press / active.**
- Primary buttons: shadow collapses to 0, button translates by the full offset amount (4px). Looks like a physical key press.
- Destructive: reverses color — red text on dark → white text on red.

**Transparency / blur.** Used **once**, for the grounding toast (`backdrop-filter: blur(8px)`, `rgba(30,30,40,0.96)`). Otherwise, every layer is opaque.

**Layout rules.**
- Landing max-width `1080px`, blog articles `640px`, dashboard `1280px`.
- Sticky `founding-bar` at top on landing (gold-on-black, live green dot).
- Fixed bottom waitlist bar ("floatBar") slides up after 50% scroll.
- Fixed cookie banner at viewport bottom.
- Everything else scrolls normally in a single column.

**Cards.** Black `#141414` body, `1px #2a2a2a` border, zero or `8px` radius depending on surface, `1.75rem` inner padding on landing / `1.5rem` on dashboard. Almost all primary cards carry the 10×10 gold pixel-corner accent.

**Density.** Analytics tool, not marketing site. Typical spacing between stacked rows is `0.5rem`–`0.75rem`, not `2rem`. Section dividers are hairlines, not giant whitespace gaps. This is deliberate and should be preserved.

**Transforms.** 1px translate on button hover; 4px on press. Score counter uses `transform: scaleY()` only inside the pixel-blink loading dots. No 3D transforms.

---

## ICONOGRAPHY

The brand deliberately **does not use an icon library**. This is a brand tell. Three sources of glyphs, in priority order:

1. **The pixel crown logo** (the only bespoke SVG). Inline, ~20×16, drawn with ~11 `<rect>` elements in gold. Used at 14px in footers, 16–20px in nav, 44px on badges. Copy from `assets/logo-512.svg` for high-res, or use the inline SVG string below for anywhere you need it recolored (bronze/silver/gold tier badges reuse the same shape, just with a different `fill`).

   ```svg
   <svg width="20" height="16" viewBox="0 0 20 16" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
     <rect x="0" y="0" width="2" height="4"/><rect x="9" y="0" width="2" height="4"/><rect x="18" y="0" width="2" height="4"/>
     <rect x="0" y="4" width="20" height="2"/><rect x="0" y="6" width="2" height="6"/><rect x="18" y="6" width="2" height="6"/>
     <rect x="4" y="8" width="2" height="2"/><rect x="9" y="8" width="2" height="2"/><rect x="14" y="8" width="2" height="2"/>
     <rect x="0" y="12" width="20" height="2"/><rect x="2" y="14" width="16" height="2"/>
   </svg>
   ```

2. **Unicode glyphs** do the work most brands would give to an icon font. Inventory:
   - Status: `✅` (found), `❌` (missing), `✓` (inline check), `·` (mid-dot separator), `—` / `–` (em/en dashes as copy), `→` (callout arrows in step lists), `▼` (select chevron)
   - Tier: `✦` (badge sparkle, in gold/silver/bronze copy e.g. `✦ GOLD BADGE`)
   - Callouts (rare): `📡 📈 🔒 💡 🚀 🔜 🔮 🏆 🖼 📋 📧`
   - Math: `+` `×` for inline-sign accent ("<span class='gold'>+</span> Lifetime free access")

3. **Social/brand logos** — only when embedding a third-party badge (FoundrList, Dang.ai, Google OAuth G). Google's "G" is reproduced as inline SVG in the login button. Everything else is a remote image URL.

**Never draw new icons.** If a concept lacks a glyph, use a pixel crown in a different color, use a Unicode symbol, use a short pixel-type label (`QUERIES`, `PROBE`, `DAY 0`), or use no icon at all.

**Emoji policy.** Allowed as status glyphs and callout accents, *never* as decorative blobs, *never* in headlines, *never* on CTAs, *never* more than one per element.

No Lucide. No Heroicons. No Material. No Font Awesome. If an agent is tempted to reach for one, it is likely about to violate the brand.

---

## Font substitution note

Both brand fonts (`Press Start 2P` and `Inter`) are Google Fonts and load from `fonts.googleapis.com` — no local font files needed. No substitutions were made. If you ever need to ship offline, both are SIL Open Font License and safe to self-host.

## Font-size quirk (important)

`Press Start 2P` is a **bulky, pixel-grid** font. At nominal sizes it looks oversized. The codebase uses it at **unusually small sizes** — `0.35rem`–`0.85rem` — which looks strange in isolation but is exactly right in context. Preserve this. Don't normalize pixel-label sizes up to "legible" defaults.
