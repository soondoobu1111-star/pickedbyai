# pickedby.ai — Landing UI Kit

Pixel-perfect recreation of the pickedby.ai homepage. Built from `uploads/landing/index.html`.

## What's here

- `index.html` — click-through prototype: type a URL → loading state → score result with share/claim CTAs.
- `FoundingBar.jsx` — sticky top "100 founding spots" banner with live green dot
- `Nav.jsx` — logo + primary links + CTA (pixel offset)
- `Hero.jsx` — "Does AI recommend *your* product?" with pulsing gold `*your*`
- `ScoreCheck.jsx` — the URL input widget; primary CTA
- `ScoreResult.jsx` — circular score ring + tier label + dimension bars + share/claim buttons
- `FAQ.jsx` — accordion style, hairline dividers
- `LogoTicker.jsx` — "Trusted by Gumroad, Notion, Etsy creators" marquee
- `Footer.jsx` — pixel wordmark, 3 link columns

## Props conventions

All components accept a `className` passthrough. Score values are 0–100 and tier is derived (≥75 = PICKED, ≥50 = SEEN, ≥25 = NOTICED, else INVISIBLE).
