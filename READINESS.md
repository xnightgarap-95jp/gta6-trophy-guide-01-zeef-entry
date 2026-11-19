# Leonida Ledger — readiness

## What it is
An offline static web app (app/index.html + modules + styles + data) that is
the best GTA 6 trophy guide and tracker we could build in one recorded
session: all 55 official PS5 trophies with a guide to each in our own words
that cites its sources, a saved checklist, filters, a spoiler setting,
export/import, a five-stage roadmap to the platinum, and 23 missable
trophies flagged — all built from the official descriptions.

## Files
- `main.ts` — Node 22, stdlib only; copies app/ + screenshots/ to /output
  and writes dossier.json with vendor/makefun-frontend.ts (kit copy, unchanged).
- `serve.ts` — serves app/ on http://localhost:8080.
- `app/index.html`, `app/style.css` — paper + night themes, coral accent,
  serif display face.
- `app/app.js` — boot and wiring. `app/data.js` — loads the data.
  `app/store.js` — localStorage progress, export, import, demo seed.
  `app/filters.js` — kind filters, search, spoiler rule.
  `app/views.js` — checklist, guide pane, roadmap, missables.
- `app/data/trophies.json` — 55 trophies: official name, description, grade,
  hidden flag, kind, missable flag, PSN-tracked target where one exists, our
  own guide and its sources for every trophy.
- `app/data/roadmap.json` — five stages to the platinum + the missables note.
- `screenshots/` — 4 real Playwright Chromium renders of the app.

## Verified
- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden; every
  name, description and grade matches the official list exactly; no blank guide.
- main.ts runs twice with byte-identical dossier output.
- Kit check passes what it can locally (transcript checks run server-side).
- App opens offline in a browser with no console errors; tracker,
  export/import, filters and spoiler setting all work.
- Screenshots visually checked: checklist with a guide open, roadmap,
  missables, and the dark theme with spoilers on.
