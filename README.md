# Twin Frames — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cryptotainment/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cryptotainment/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that plays offline in a desktop browser, built for the [make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). Two near-identical pictures side by side — find every difference before the clock runs out.

## The game

Three original scenes, all drawn in code with the canvas 2D API (no image files, no copied art):

- **Harbor Sunset** — 7 differences: a lighthouse, boats, birds and a buoy at dusk.
- **Forest Camp** — 8 differences: a tent, a campfire, an owl and pine trees at night.
- **Rooftop Night** — 10 differences: a city skyline, a cat, an airplane and a streetlight.

Click a difference on either picture to mark it (green ring on both panels). Wrong clicks cost 25 points; hints (H) cost 50 and pulse a ring around one unfound difference. Each level has its own countdown — finish with time to spare for a bonus. Keyboard: H hint, R restart, N next level.

## Play it

Serve `game/` with any static server and open `index.html` — it needs no network and no build step. Screenshots were staged with `?shot=cover|play|win` for a deterministic frame.

## Hand in

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

    mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

MIT licensed, see LICENSE.
