# Slap War

A mobile-first, snap-style number-matching browser game.

## Concept

Two numbers are shown simultaneously — a **TARGET** (top) and **YOUR NUMBER** (bottom). Both change every 2 seconds. When they match, hit **SNAP!** before the numbers change again.

- Correct snap → **+5 points**
- Wrong snap → **-1 point** (minimum 0)

## Controls

| Action | How |
|--------|-----|
| Start game | Tap **Start** on the title screen |
| Snap a match | Tap the **SNAP!** button when both numbers are equal |

## Scoring

- Open-ended arcade mode — no win/loss condition, play as long as you like
- Score is shown in the header throughout
- A wrong press immediately advances to the next tick so there's no spam opportunity

## Match Timing

- Numbers change every **2 seconds**
- Numbers are random (1–100) each tick
- Roughly **1 in 5 ticks** will be a genuine match (20% probability, never pattern-predictable)
- The exact timing of matches is randomised — you can never "learn the rhythm"

## How to Run

```bash
npm install     # first time only
npm start       # starts Express on port 3000
```

Then visit: `http://localhost:3000/slap-war`

## File Structure

```
public/slap-war/
├── index.html   ← entire game (HTML + CSS + JS, no external deps)
├── README.md    ← this file
└── MEMORY.md    ← decisions log for future sessions
```

## Tech

- Pure vanilla JS, HTML, CSS — zero dependencies, zero build step
- Single self-contained `index.html`
- Mobile-first layout using `clamp()` for fluid type/sizing
- CSS keyframe animation for number pulse on each tick
- Numbers glow green on a correct snap

## Architecture

All game logic lives in a single plain-object `Game` in the `<script>` block:

| Method | Responsibility |
|--------|---------------|
| `start()` | Hide title screen, show game, begin tick loop |
| `tick()` | Pick new random numbers; decide if this tick is a match |
| `handleSnap()` | Compare numbers, update score, show message, restart tick |
| `showMessage()` | Display banner, auto-clear after 1 s |
| `_renderNumbers()` | Update DOM with pulse animation |
| `_restartTick()` | Reset interval so snap advances the clock |
