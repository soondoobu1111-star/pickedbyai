# pickedby.ai — Dashboard UI Kit

Pixel-perfect recreation of the logged-in app. Built from `uploads/landing/dashboard.html`.

## What's here

- `index.html` — click-through prototype. Sign in → My Products → Run new check → view Dimensions/Probes/Tools.
- `Sidebar.jsx` — vertical left nav with user avatar, sections, live status
- `TopBar.jsx` — breadcrumb + score delta chip + model filter
- `ScoreCard.jsx` — big ring + tier + dimensions (dashboard variant)
- `DimensionRow.jsx` — dimension score with track, label, tooltip target
- `ProbeTable.jsx` — 50-query probe breakdown with model, status, rank
- `ToolsPanel.jsx` — llms.txt generator + embed badge snippet
- `ProductCard.jsx` — a row in "My Products" with trend and quick actions

## Design notes

- Dashboard radii are 6–8px (not 0 like landing).
- Cards have NO pixel corners — they're `.dash-card`, not `.pba-card`.
- Layout is `280px sidebar + fluid main`, max content width 1280px.
