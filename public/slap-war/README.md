# Slap War

A mobile-first snap-style browser game with adaptive difficulty.

## Concept

Two numbers are shown at once:

- TARGET at the top
- YOUR NUMBER at the bottom

Press SNAP when a valid match appears. The first 30 seconds are a learning phase where the game measures reaction time, misses, and match accuracy. The final 30 seconds are the scored run: it starts from the player's profile, then turns up the pressure.

## Modes

| Mode | Rule |
| --- | --- |
| Classic | Snap matching numbers only. |
| Hard | Snap matching numbers or matching colours. |
| Extreme | Hard mode plus a moving SNAP button. |

## Scoring

- Correct snap: +5 points
- Wrong snap: -5 points
- Letting a number or colour match expire: -5 points
- Learning phase score is hidden and resets to 0 when SHOW TIME starts
- Final screen shows win/loss based on the final score

## Match Timing

- Bot and player numbers change on independent randomized timers.
- Matches freeze briefly so the player gets a fair reaction window.
- The first match is guaranteed within 2-6.5 seconds.
- Safety matches prevent long dry spells.
- In colour modes, guaranteed openings alternate between number and colour matches.
- Match windows are rate-limited so one success cannot immediately cascade into another.

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
|-- style.css    # game styles
|-- README.md    # current game overview
`-- MEMORY.md    # decisions log for future sessions
```

## Tech

- Vanilla JS, HTML, and CSS
- No build step
- Express static server from the repo root
- CSS animations for number pulses, feedback, start screen, and show-time overlay
