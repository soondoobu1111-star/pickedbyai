---
name: pickedby.ai Design System
description: Design system for pickedby.ai — the AI Visibility Platform. Dark arcade brand (black + gold + Press Start 2P), two surfaces (landing, dashboard), built from the real repo.
---

# pickedby.ai Design System

Use this skill whenever you design anything for **pickedby.ai** — the AI Visibility Platform.

The brand is deliberately anti-marketing-site: pure black (`#000` landing / `#0a0a0a` app), a single gold accent (`#FFD700`), Press Start 2P for any label-like text, Inter for prose, flat borders, zero gradients, chunky pixel-offset button shadows.

## How to use this system

1. **Read `README.md` first** — it's the complete brand guide (voice, color, type, spacing, animation, icon policy, hover/press states).
2. **Pull tokens from `colors_and_type.css`** — every CSS custom property (`--pba-bg`, `--pba-gold`, `--pba-font-pixel`, etc.) lives here. Import it, don't re-invent.
3. **Fork from `ui_kits/` for product work** — `ui_kits/landing/` is the homepage recreation; `ui_kits/dashboard/` is the logged-in app. Both reuse the same primitives and are the right starting point for any new landing section or dashboard view.
4. **Check `preview/` for component reference** — one HTML card per concept (buttons, cards, chips, inputs, nav, score ring, badges, data table, progress bars, iconography, motion, og imagery, logo, radii, spacing, type scales, color swatches). These render the canonical look for each element.
5. **Use `assets/` for brand marks** — pixel-crown logo in svg/png/webp, OG images, score spectrum reference.

## Non-negotiables

- **Color:** black background + gold accent + 9-step grayscale. Semantic red/orange/yellow/green is **reserved for score tiers only** — nothing else gets to be red.
- **Wordmark:** `picked` (gold) + `by` (white) + `.ai` (gold). Always in Press Start 2P.
- **Type:** Press Start 2P is used at unusually small sizes (0.35–0.85rem) — this is intentional. Never normalize up.
- **Icons:** No icon library. Use the pixel crown, Unicode glyphs (`✦ ✅ ❌ → · ▼`), or a short pixel-type label. If tempted to import Lucide/Heroicons/Material, stop.
- **Shadows:** The only shadow is the chunky gold pixel-offset (`box-shadow: 3px 3px 0 #b39700`) under CTAs. No rgba blur shadows anywhere.
- **Corner radius:** `0` on landing; dashboard allows `6/8/12px` only. Never more.
- **Imagery:** Flat infographics or none. No photography, no stock illustration, no gradients, no mesh.

## When in doubt

Read `README.md` § VISUAL FOUNDATIONS for the full rulebook. Every design decision in this system is grounded in the real repo under `/uploads/landing/` — if the rulebook is silent, go look at how `uploads/landing/index.html` or `uploads/landing/dashboard.html` handles it, not your training data.
