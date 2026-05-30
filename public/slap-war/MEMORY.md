# Slap War — Memory & Decisions Log

This file is the persistent learning log for the Slap War game. Update it whenever a significant decision is made, a bug is fixed, or a lesson is learned. Future sessions should read this file to understand *why* things are the way they are.

---

## Session: 2026-05-30 — Initial Build

### Decisions Made

**No external dependencies**
The surrounding project (family planner) is also dependency-free vanilla JS. Keeping Slap War the same avoids introducing a build step and keeps the file trivially portable.

**Plain object `Game` instead of a class**
A class felt like over-engineering for ~80 lines of logic. A plain object literal is equally readable, avoids `this` binding pitfalls on event handlers (handlers use `Game.handleSnap()` directly, not `this.handleSnap.bind(…)`), and is simpler to extend in future sessions.

**20% forced match probability**
With a pure 1-in-100 random match the expected wait between matches would be ~200 seconds — far too slow for engagement. Forcing ~1-in-5 ticks to be a genuine match gives a match roughly every 8–12 seconds. The match timing is still random (dice roll at tick start), so the player cannot detect a pattern.

**Tick advances immediately after snap attempt (`_restartTick`)**
Without this, a player could press SNAP at the start of a tick, get feedback, and then press again on the same tick numbers. Restarting the interval prevents double-dipping and makes wrong presses feel consequential.

**`void el.offsetWidth` reflow trick for CSS animation reset**
Removing and re-adding a CSS animation class in the same JS microtask does nothing — the browser batches style changes. Forcing a reflow between the remove and re-add (`void el.offsetWidth`) ensures the pulse animation fires on every tick. This is a known browser quirk worth noting for future sessions.

**Score floor at 0**
Negative scores feel punishing and discouraging. Clamping at 0 keeps the game casual. If future sessions want a harder mode, a negative-score variant could be a separate difficulty setting.

**`clamp()` for all sizing**
All font sizes and button dimensions use `clamp(min, preferred-vw, max)` so the layout adapts correctly from the smallest phones (320 px wide) to large desktop screens without media queries.

---

---

## Session: 2026-05-30 — Independent Timer Rework

### Problem
The original single `setInterval` (2000ms fixed) made both numbers change simultaneously on the same beat. The pulse animations fired in perfect sync, creating a visible "heartbeat." Players could feel the rhythm and anticipate when the numbers would next change — eliminating tension.

### What Changed

**Replaced shared `setInterval` with two independent `setTimeout` loops**
`_scheduleBotChange()` and `_schedulePlayerChange()` each reschedule themselves after a fresh random delay. Bot uses 1500–2500ms; player uses 1700–2800ms. The deliberately different ranges prevent the two timers from phase-locking over time.

**Invisible nudge instead of forced-match ticks**
Removed `MATCH_CHANCE` (the old "this tick is a match" flag). The old approach was detectable because both numbers changed to the same value simultaneously at a predictable cadence. The new approach: 15% of the time the bot silently adopts the player's current value instead of picking randomly. Because the player's number didn't move, there's no visible "sync" event — the bot just lands on the same value as if by chance.

**Guaranteed 800ms match window via timer freeze**
When a match is detected, both timers are cancelled and a match-window countdown starts. Neither number changes until the window expires or the player snaps. Without this freeze, a number could change 50ms after a match opened (if its timer was nearly due), making the window feel arbitrarily short and unfair.

**Timers resume independently after snap or window expiry**
After a correct snap (or an expired window), both timers restart with fresh random delays — keeping them out of phase going forward.

### Why the nudge is on the bot, not the player
If the player's number were nudged to match the bot, the player's panel would show a new number arriving and then immediately equalling the target — a detectable tell. The bot changing to match the player's *existing* value produces no such tell: the player's number stayed the same, and the bot just "happened" to land there.

### Removed
`tickInterval`, `MATCH_CHANCE`, `_tickTimer`, `tick()`, `_restartTick()`

---

---

## Session: 2026-05-30 — Pause/Resume/Stop + Anti-Greedy SNAP

### What Was Added

**Pause / Resume (same button, toggles)**
`togglePause()` calls `_pause()` or `_resume()` depending on `isPaused`. On pause: all three timers (bot, player, match window) are cleared and any open match is closed — holding a match window open across a pause felt unfair to both sides. The score is preserved. On resume: both independent timers restart with fresh random delays, button label flips back to "⏸ Pause".

**Stop**
Clears all timers, resets all state (`score`, `isMatch`, `isPaused`, `_justSnapped`), resets the DOM number display to `--`, and swaps back to the start screen. Score resets to 0 as requested.

**Anti-greedy SNAP (`_justSnapped` flag)**
After a correct snap, `_justSnapped` is set to `true` for `MATCH_WINDOW` ms (800ms). Any SNAP press during that window shows a randomly selected cheeky message from `_greedyMessages` instead of decrementing the score. After 800ms `_justSnapped` clears automatically. The greedy timer duration deliberately matches `MATCH_WINDOW` so the guard expires at the same time the next tick sequence would naturally begin — no arbitrary magic numbers.

**Why greedy presses don't cost -1**
Penalising rapid re-presses on a correct snap would feel punishing rather than playful. The cheeky message is enough friction — it communicates the rule without frustrating the player.

---

---

## Session: 2026-05-30 — Browser Extension Feedback Fixes

8 of 9 reported issues were fixed. **Issue 5 ("glow only on bot number") was NOT fixed** — `_glowNumbers()` already iterates `['bot-number', 'player-number']`; the reviewer was incorrect. Confirmed by reading the code.

### Changes Made

**Game-over screen** (`stop()` now shows it instead of start screen)
Score is read *before* being reset. Best score persisted in `localStorage` under `'slapwar-best'`. Game-over screen shows final score + all-time best. "Play Again" → `goToStart()` → start screen (not auto-start, so the player sees the Start button).

**Real-time match visual (`.match-active`)**
New amber CSS class applied to both numbers when `isMatch` becomes true in `_checkMatch()`. Cleared by `_setMatchActive(false)` in three places: match-window timeout, correct snap, and pause. `_setWithPulse()` also removes `match-active` so a new number tick always starts clean. Amber was chosen to be visually distinct from the post-snap green `.glow`.

**SNAP button visually disabled when paused**
`_pause()` sets `snap-btn.disabled = true`; `_resume()` and `stop()` set it back to false. CSS `#snap-btn:disabled` reduces opacity to 0.38 and sets `cursor: not-allowed`.

**Numbers diverge on pause mid-match**
`_pause()` now checks `wasMatch` before clearing `isMatch`. If true, calls `_divergePlayer()` so numbers are visually different on screen immediately — no false "Missed" on resume.

**Success message variety**
Added `_successMessages` array (5 entries, same structure as greedy messages). Picked randomly in `handleSnap()`.

**Keyboard support**
Single `keydown` listener after `Game` definition. Space/Enter maps to: `handleSnap()` if game screen visible, `Game.start()` if start screen, `Game.goToStart()` if gameover screen. `e.repeat` guard prevents held-key spam. `e.preventDefault()` stops page scroll.

**Clearer start instructions**
Rewritten to explicitly name "YOUR NUMBER (bottom)" and "TARGET (top)" and warn the window is under a second.

**Score floor feedback**
Miss at score=0 shows "Already at zero — nothing to lose!" instead of silently doing nothing.

---

---

## Session: 2026-05-30 — Speed Ramp, Match Guarantees, Auto-Stop

### What Changed

**Guaranteed first match within 2–6.5 seconds (`_scheduleFirstMatch`)**
On every `start()`, a timer fires at a random point in the 2000–6500ms window. If no match is already active, it forces the bot to adopt the player's current number and calls `_checkMatch()`. The randomised delay means the player cannot predict or feel the "charity" match.

**Safety timer — minimum 1 match per 30-second window (`_resetSafetyTimer`)**
After every match (and on resume), a 30-second countdown starts. If it elapses with no match in progress, the bot is again forced to match the player and `_checkMatch()` fires. The timer then reschedules itself. This prevents long dry spells without making the match rate feel mechanical.

**Why the first-match timer cancels after `_checkMatch()`**
`_checkMatch()` calls `clearTimeout(this._firstMatchTimer)` so a naturally-occurring early match before the guaranteed timer fires doesn't result in a double-match. The safety timer handles all subsequent windows.

**Speed ramp over 3 minutes (`_speedFactor`, `_scaledRandInt`)**
`_speedFactor()` returns 1.0 at t=0 and linearly ramps to 0.35 at t=180s (3 min). All number-timer delays go through `_scaledRandInt(min, max)`, which scales both bounds by this factor. Button movement and colour cycles intentionally stay unscaled — they're visual noise, not gameplay pressure.

**Score can go negative; auto-stop at −30 (`SCORE_FLOOR`)**
Removed the `Math.max(0, score - 5)` floor. Missed snaps always cost 5 points. When the score reaches `SCORE_FLOOR` (−30), a "Hit −30! Game over!" message appears and `stop()` fires after an 800ms delay so the player sees the message. Miss messages are contextual: negative score → "In the red! -5 ⚠️", positive → "Missed! -5".

**Peak score for localStorage best (`_peakScore`)**
Since the final score can be negative, `localStorage` best is now compared against `_peakScore` (the highest score ever reached during the session), not the final score. This means a player who peaks at 40 and ends at −30 still records 40 as their run high.

**Pause clears both guarantee timers**
`_pause()` now calls `clearTimeout` on both `_firstMatchTimer` and `_safetyTimer`. `_resume()` calls `_resetSafetyTimer()` (not `_scheduleFirstMatch` — first-match is a one-shot that only fires at game start).

---

## Known Limitations / Future Ideas

- No difficulty levels (could vary nudge chance, number range, or score floor)
- No sound effects (Web Audio API would be a natural addition)
- No back-navigation to the menu hub — browser back button works but there's no explicit back link
---

## Session: 2026-05-30 - Colour-Mode Difficulty Fixes

### Problem
Hard and Extreme are presented as colour-aware modes, but the adaptive logic treated number matches as the main source of truth. Guaranteed first/safety matches only forced number matches, and the shared false-snap calculation counted number hits plus misses while ignoring successful colour snaps. That made colour performance under-sampled and could make the final 30 seconds easier or harder than the player's actual learning-phase behaviour justified.

### What Changed

**Colour hits now count in shared accuracy**
`_buildPlayerProfile()` now calculates false-snap rate from number hits, colour hits, and misses. This keeps colour-mode difficulty from over-penalising players who mostly succeeded on colour opportunities.

**Reaction profiling uses trimmed samples**
Reaction averages and consistency now run through `_reactionProfile()`, which sorts samples and trims outliers when there are enough readings. This keeps one accidental very-late or ultra-fast press from skewing the post-learning difficulty.

**Guaranteed matches alternate by type in colour modes**
`_forceGuaranteedMatch()` alternates forced openings between number and colour matches for Hard/Extreme. Classic still forces number matches only.

**Match openings are rate-limited**
`MIN_MATCH_GAP` prevents a newly closed match window from immediately cascading into another natural match. Guaranteed safety openings can still bypass the cooldown so the anti-dry-spell promise remains intact.

### Notes
The menu copy now says number OR colour snap opportunities to match the implemented rules. If the intended rule becomes truly simultaneous number-plus-colour matching, that should be a future gameplay redesign rather than a wording tweak.

---

## Session: 2026-05-30 - Missed Match Penalty

### What Changed
Number and colour match-window expiry now counts as a miss: score decreases by 5, a miss pop appears, and the message calls out whether the player missed a number match or a colour match. During the learning phase, expired matches also increment `_learningMisses`, so the adaptive profile accounts for hesitation as well as wrong presses.

### Why
Previously, ignoring an open match had no direct consequence. Penalising expired opportunities makes the reflex challenge clearer and aligns missed windows with bad SNAP presses.

---

## Session: 2026-05-30 - Friendly Tamper Resistance

### What Changed
The game object is now scoped inside an IIFE instead of exposed as `window.Game`, and all inline `onclick` handlers were replaced with event listeners bound from inside that closure. This removes the easiest console cheats such as `Game.score = 9999`.

**Friendly decoys**
`window.Game` is now a playful decoy that logs teasing messages when inspected or assigned to. A `cheatCode()` function returns `FLAG{client_side_games_are_not_security_boundaries}` as a deliberate find for anyone poking around.

**Wording**
The start screen now says "Learns your pace, then turns up the pressure" because Show Time still ramps speed after calibration.

### Security Note
This is tamper resistance, not real security. A determined tester can still patch browser code, set breakpoints, alter event handlers, or edit the script at runtime because the client still owns the game logic.

---

## Session: 2026-05-30 - Snap Home Styling Import

### What Changed
The start screen was restyled to match the downloaded `Snap Home (standalone).html` page: crown/title treatment, pink rainbow background, cloud base, format banner, and rounded difficulty pills.

### Boundary
Only the home/start-screen markup and CSS were changed. The mode buttons still use the same `data-mode` event listener path into `Game.start(mode)`, and no gameplay timers, scoring logic, match logic, or tamper-resistance logic were changed.

---

## Session: 2026-05-30 - Home Mode Selection Flow

### What Changed
The home screen now matches the standalone Snap Home flow more closely: difficulty pills select a mode and update the background colour wash, while a separate PLAY button starts the selected mode. Classic is selected by default.

### Boundary
This changes only the start-screen interaction flow. `Game.start(mode)` still receives the same mode ids (`classic`, `hard`, `extreme`), and no in-game scoring, timers, or match rules were changed.

---

## Session: 2026-05-30 - Difficulty Highlight Bubbles

### What Changed
Difficulty pills now include hover/focus/selected highlight bubbles explaining each mode, matching the standalone Snap Home design direction. The bubbles describe Classic, Hard, and Extreme without changing the mode ids or gameplay behaviour.

### Follow-Up
The home screen no longer defaults to Classic. PLAY is disabled until the player selects a mode, and difficulty descriptions now show only on hover/focus rather than staying visible for the selected mode.

---

## Session: 2026-05-30 - In-Game Home Button

### What Changed
The game header now includes a Home button. It stops the active run, clears all game timers, hides any overlays, resets the number/message display, and returns to the start screen without showing the result screen.

### Implementation Note
The previous `_endGame()` cleanup block was split into `_stopRun()` so both normal game end and manual home navigation share the same timer cleanup path.

---

## Session: 2026-05-30 - Home Decoration Cleanup

### What Changed
The old random emoji sparkle background was disabled. The home page now relies on the deliberate top rainbows and bottom cloud layer from the Snap Home design, with z-index overrides so those decorative layers sit behind the home content.

### Follow-Up
The decoration selectors were strengthened to `#start-screen .home-*` because an older `#start-screen > *:not(.sparkle)` rule had enough specificity to override `position: fixed` on the rainbow/cloud layers.
