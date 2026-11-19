[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/xnightgarap-95jp/gta6-trophy-guide-01-zeef-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/xnightgarap-95jp/gta6-trophy-guide-01-zeef-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger — GTA 6 Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with its names, descriptions and grades, a checklist saved in your browser, a roadmap to the platinum, the missable trophies flagged, and a guide to each trophy in our own words that cites its sources.

## What it does

- **Checklist** — all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden on PSN) with official name, description and grade. Tick a trophy when you earn it; progress saves in localStorage.
- **Guides with sources** — click any trophy to open its guide beside the checklist. Every guide is written for this entry and cites its sources (the official list on Exophase for name, description and grade; PSNProfiles for the tracked count where one exists). Where the official description does not name a place or a step, the guide says so instead of inventing one.
- **Roadmap** — five stages to the platinum, built from the official descriptions: story, side characters and strangers, activities and challenges, collectibles and exploration, then money, robberies and cleanup.
- **Missables** — 23 trophies flagged as tied to one story moment, one mission or one partner window, with a note before each story session.
- **Filters & search** — by kind (story, missable, collectibles, activities, online), by earned state, and by free text.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned. Turn it on in the toolbar before you start the story, and the checklist will not spoil a mission's name.
- **Export & import** — save progress to a JSON file and import it back.
- **Two themes** — light "paper" and dark "night", one coral accent, serif display face.

## Offline

Every file the app loads lives under `app/` — it makes no network request at run time. It shows no Rockstar logo or official artwork. Serve `app/` with any static file server and open `index.html`.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE).
