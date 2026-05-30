# Snap!

A mobile-first snap-style browser game with adaptive difficulty.

## Concept

Two numbers are shown at once — one for the bot, one for you. Tap SNAP when they match. The first 30 seconds are a warm-up phase where the game measures your reaction time, misses, and accuracy without scoring. The final 30 seconds are the scored run — it adjusts to your ability and turns up the pressure.

## Modes

| Mode | Rule |
| --- | --- |
| Classic | Snap matching numbers only. |
| Hard | Snap matching numbers or matching colours. |
| Extreme | Hard mode plus a moving SNAP button. |

## Scoring

- Correct snap: +5 points
- Wrong snap: −5 points
- Letting a match expire: −5 points
- Warm-up score is hidden and resets to 0 when SHOW TIME starts
- Win by finishing above 0

## Match Timing

- Bot and player numbers change on independent randomized timers.
- Matches freeze briefly so the player gets a fair reaction window.
- The first match is guaranteed within 2–6.5 seconds.
- Safety matches prevent long dry spells.
- In colour modes, guaranteed openings alternate between number and colour matches.
- Match windows are rate-limited so one success can't immediately cascade into another.
- In Hard and Extreme, a card's colour changes only when that card's number changes.
- Colour match windows are slightly more generous than number windows because colour recognition is harder than reading matching numbers.
- SNAP input registers on press-down for mouse/touch/pen, so matches are judged at press time rather than after button release.
- The anti-spam guard only blocks repeat presses when no new valid match is active.
- Successful snaps briefly hold the matched frame before changing, making hits feel less abrupt without extending the scoring window.
- Successful snap feedback never changes number colours; number colour remains a gameplay signal in Hard and Extreme.

## Classic Mode Visual Theme

Classic mode uses a full pink bubblegum aesthetic:

- Radial pink gradient background matching the home screen palette
- Circular SNAP button with a 3D-shaded pink gradient and drop shadow
- Score displayed as a frosted pill (hidden during warm-up)
- `● WARM-UP` badge pulses in the header during the learning phase
- Progress bar counts down the scored phase in real time
- Numbers stay pink throughout — no colour cycling
- WARM-UP overlay appears before any numbers or timers start
- GO! overlay freezes the game between phases; scored run begins cleanly after it dismisses
- Green border on correct snap; red flash animation on miss
- Correct and wrong snaps use green/red panel flashes instead of score text or number recolouring
- Expired match windows show a clear `MISSED!` message
- TRY AGAIN / YOU WIN! result screen in the same pink Lilita One style

## Hard Mode Visual Theme

Hard mode mirrors the Classic card/button layout with a deeper purple background, frosted number panels, a circular SNAP button, warm-up/GO overlays, a 30-second phase progress bar, and a small high-contrast colour set led by pink and blue. Its visible hints and home-screen copy reference matching either numbers or colours.

## Extreme Mode Visual Theme

Extreme mirrors the Hard in-game layout but uses a pastel red/orange home-screen palette. It also uses the same WARM-UP/GO overlays and 30-second phase bar, while the SNAP button jumps quickly across large areas of the playable screen.

## Overlay Timing

| Event | Behaviour |
| --- | --- |
| Start | WARM-UP overlay shown; game starts only after it dismisses (2.5 s) |
| Warm-up → Scored | GO! overlay shown; all timers pause; scored phase restarts cleanly after overlay dismisses (2 s) |

## How to Run

```bash
npm install
npm start
```

Then visit: `http://localhost:3000/slap-war`

## File Structure

```text
public/slap-war/
|-- index.html   # game markup and vanilla JS
|-- style.css    # shared + game-screen styles (reset, :root vars, classic mode theme, overlays, result screen)
|-- home.css     # home/start-screen styles (Google Fonts @import, #start-screen, pill buttons, tooltips, clouds, rainbows, sparkles)
|-- README.md    # this file
```

> **Styling rule**: all CSS lives in the CSS files above. Never add `style="..."` attributes or `<style>` blocks to `index.html` — only truly dynamic per-element values (e.g. JS-generated `left`/`top` positions) belong in JS.

## Tech

- Vanilla JS, HTML, and CSS
- No build step
- Express static server from the repo root
- `oklch()` colour space throughout for the pink/bubblegum palette
- Fonts: Lilita One (display/headings), Nunito (body/labels), Baloo 2 (home screen buttons) — loaded via `home.css` `@import`
- CSS animations for number pulses, panel feedback, overlays, warm-up badge, and result screen
