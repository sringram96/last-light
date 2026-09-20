# Game review: what The Last Light is missing as a game

Director's diagnosis and systems spec, written after playing the shipped case (14 sets, 8 prompts, 6 endings) against the north star. Every number below was measured in the test harness (`tests/harness.cjs` on `dist/game.js`) or in Chromium on `dist/index.html`; the scripts are not part of the repository. Nothing in this document changes the art, the camera work, the sets or the beat captions. It changes what the player's hands do and what the game does when they do it wrong.

The owner's four notes, translated: (1) the game does not fill the screen; (2) narration is paced by the clock, not the reader; (3) the input should be on the picture, not under it; (4) nothing is at stake. Notes 3 and 4 are the same fault seen from two sides, and they are the fault that matters. Fixing 1 and 2 without 3 and 4 gives a prettier menu.

## 1. Diagnosis

### Measured

| System | The Last Light today (measured) | Dragon's Lair (1983 arcade) |
| --- | --- | --- |
| Inputs available at a moment | 2 valid moves (`[1]`, `[2]`) plus silence. Keys `1`/`2`, arrows (left/up = 1, right/down = 2), or two labelled buttons under the scene. A click or tap on the canvas does nothing (verified in Chromium at `chaseQteA`). | 4 directions plus the sword: 5 inputs, of which one (rarely two) is right. |
| Wrong input | Does not exist. Pressing the other move is the other branch. | A wrong direction is a death. |
| Cue | `[1]` and `[2]` labels drawn in the world at the two targets, static for the whole window, plus a caption of 13 to 27 words shown instantly, plus a countdown bar in the status line, plus a red pulse and tick sounds in the last 3 s. | A flash or glow on the thing to act on, in the picture, for a fraction of a second. |
| Warning | A 2 s windup phase with a `GET READY` card and a caption of 18 to 29 words. Always 2.0 s. | None. The sequence is the warning. |
| Window | Base 7 s, modifiers +2/-2, clamped 5 to 9. Measured entries: 7.0 s on a plain route, 9.0 s on six of seven prompts after the four observations, 5.0 s on four of seven after stacked misses. | About 1 to 2 s from the cue. |
| Reaction speed | Recorded (`state.reaction`) and shown for one beat in the status line. Answering at 0.2 s and at 6.4 s of a 7 s window produce the same outcome, stinger, tally and grade. The street prompt never records it (`choose()` skips `react()`). | Not scored, but a late input is a death. |
| Miss | Sets a `late` value, plays a stinger (`TOO LATE`, `HIT`, `CLIPPED`, `GONE`, `CRUSHED`), a caption and, for some beats, a changed picture (the cart stopped across the aisle, the rack across Rook). Rook always survives. In two cases (`pumpQte`, `subQte`) the miss loses the same evidence as one of the valid moves. | A death animation, unique to the scene. |
| Lives | 3 rewinds per case. Cost of using one: the `flawless` discovery. Cost of not using one: nothing. Shown as `REWIND x3` in the header. | 5 lives (cabinet default; 3 by DIP switch). Shown as a counter. |
| Out of lives | The fourth miss on one prompt shows no buttons; the result auto-advances after 4 s and the story continues (verified: `clubQte` missed four times lands in `chaseQteA` with 0 rewinds). | Game over. Coin. |
| Failure state | None. Every prompt on a pursuit route left to time out, with no rewinds spent, reaches `canalEnd`: ending `A VOICE IN THE DARK`, `Reflex 0/7, grade D, rewinds used 0`, ending and two discoveries written to the records, Bell alive. It takes 162 s, the same as a perfect run. | The game ends; the record is how far you got. |
| Scene density | 1 input per action set (2 on the road). 7 inputs on the jump route, 8 on the ramp route, 2 on the stay route. Between inputs: 146.8 s of auto-advancing cutscene and result beats, 15.5 s of transitions. | 1 to 8 inputs per scene, scenes 30 to 90 s, roughly 40 scenes. |
| Difficulty curve | None by design; windows drift with knowledge (+2) and injury (-2). The last prompt (`subQte`) is 7 s on a clean route. | Rises: later scenes have more inputs, less time. |
| Replay engine | 6 endings and 20 discoveries derived from choice fields. Reflex affects endings only through the `late` branches. | Memorising the input sequence. |
| Screen | Desktop 1280x800: canvas 996x666, 83% of viewport height, page 1.4 screens tall. Laptop 1366x680: 98%, page 1.6 screens. Phone 375x812: canvas 355x407, 50% of viewport height; prompt buttons 150 px below the picture. `main` is capped at 1024 px. | The picture is the cabinet. |
| Narration pace | 779 words of auto-advancing captions in 169 s on the pursuit route (277 wpm average). Windups ask 540 to 870 wpm; results 200 to 500 wpm; `subEntry` 48 words in 8 s. Typing runs at 70 characters/s and finishes 2 to 3.5 s into a 4 to 8 s beat. Transition lines finish typing 0.1 to 0.8 s before the dissolve. | No text. |
| Render rate | 15 fps (the loop redraws at most every 66 ms; measured 15.0 fps at 1280 wide). Enough for a 4 to 8 Hz flash; not enough for a sub-100 ms cue. | 24 fps laserdisc. |

### What the numbers say

1. **A prompt is a reading task with two right answers.** Both moves are valid, both are explained in a caption the player is given time to read, and the labels tell them what each does. The picture never has to. Nothing is asked of the hands except to arrive within 7 s. This is a timed choose-your-own-adventure page, not a reflex.
2. **Nothing can be lost.** No death, no game over, no restart. Miss everything and the case still closes with a recorded ending in the same 162 s. Rewinds are free, and running out of them changes nothing but a button. The `flawless` discovery is the only stake, and it is a line in a list.
3. **There is no surprise.** `GET READY` for 2.0 s, a caption, static labels, a countdown, a pulse, ticks. Six warnings for a move that then waits 7 s.
4. **Misses are not distinct from moves.** `pull` and `late` at the pump both lose the ledger; `duck` and `late` at the club both lose Vale. The difference is a stinger and a tally the ending does not read. The rack is the one prompt where a miss is worse than both moves.
5. **Scenes are thin.** One input per set, then two to three minutes of watching. Dragon's Lair scenes are dense because every second can kill you; ours are dense in picture and empty in play.
6. **The reflex score is honest about this.** It counts prompts faced and not missed, which is almost always all of them. It also under-counts: the ramp route faces 8 prompts and reports 7 (`chaseQteB` answered with the ramp is not tallied).
7. **The two smaller notes are real and separate.** The layout is a web page with a canvas in it, and the narration is paced by authored seconds rather than by word count.
8. **Found while measuring: checkpoints in the five new sets never save.** `session.js` builds the save store's `validPhases` from `caseTitles` and the street phases; the registry's phase ids (`loft*`, `tram*`, `market*`, `sub*`, `room*`) are not in it, so `saveStore.save()` rejects every checkpoint written there and keeps the last one from an older set. Measured: at `marketQte` the saved phase is `roofQuiet`; at `subQte` it is `chaseFinish`; `[CONTINUE CASE]` resumes at `chaseFinish` in the chase set. A player who closes the tab at Substation Nine replays the road. This is a one-line fix (item 0 in section 5) and a prerequisite for restart-from-chapter.

### One beat, before and after

The pump room today: `pumpFind` waits on `[GET BELL OUT]`. `pumpDanger` cuts to the splitting joint, shows `GET READY` for 2.0 s over a 20-word caption. `pumpQte` holds the wide shot with `[1]` on the wheel and `[2]` over Bell, prints a 17-word caption instantly, starts a 7 s (or 9 s, or 5 s) countdown in the status line, and offers two buttons. The player reads, decides, clicks. `INLET CLOSED`. If they wait out the 7 s: `TOO LATE`, Bell leaps and Rook catches his sleeve, the satchel is lost, two buttons: rewind or carry on. Reaction time is irrelevant; the choice is a menu; the miss is a sentence.

The pump room in this spec: `pumpFind` is unchanged. `pumpDanger` cuts to the joint for 1.5 to 2.5 s with no card. The wide shot comes up; `<<` flashes on the wheel and `>>` flashes over Bell, at 4 Hz, for 2.5 s (3.0 s if the tape was read). Nothing prints, nothing counts down. The player who read the tape pushes left; `INLET CLOSED` and the result beat play exactly as today. The player who pushes up, or waits: the platform goes, the surge takes Rook off the walkway, the lamp pools on the water go out one by one, `DROWNED` in red, a lamp goes dark in the header, and the joint splits again. The third time, `NO LIGHT LEFT`, and the chapter restarts at `pumpEntry`, or the player limps on into today's `late` path with the run marked.

### What is right and stays

The picture already tells the player where the two targets are (the `[1]`/`[2]` world points are placed on the wheel, the courier, the book, the gap, the rope, the bar top, the lane, the ramp, the fork, the breaker). The windup camera cuts exist for every prompt. The miss table and the rewind-to-windup machinery work and are tested. The pause, tab and menu freezes hold deadlines. Six endings from flat fields, twenty discoveries and the case file are the CYOA half and they are good. Every death and every window below reuses these.

## 2. The input contract

### One moment, one input

At an action beat the player gives **one directional input** within a short window. The cue is in the picture: the glyph pair at the target's world point (where `[1]`/`[2]` sit today) flashes in cyan, and the glyph is the direction (`<<`, `>>`, `^^`, `vv`). The direction is the input. There is no caption to read during the window, no countdown in the status line, no buttons under the scene while the beat is live. The first input counts.

- **Right direction** (a flashing cue): the move lands; the result beat plays as today with its stinger and caption.
- **Wrong direction** (no cue there) or **no input** by the deadline: Rook goes down. The death beat plays (section 3) and a lamp goes out.

### Drawing the cue

The cue is a world label, which the art direction already allows in the scene (`[1]`, `[2]`, `KRANE`, `INLET` are drawn this way). Rules:

- Two glyphs, the direction repeated (`<<`, `>>`, `^^`, `vv`), at the same world point the `[1]`/`[2]` label uses today, drawn in the cyan reserved for landed moves so it is the one cool bright thing in a warm frame.
- Drawn only on flash-on frames: 4 Hz for the first two thirds of the window, 8 Hz for the last third. The first rendered frame of a beat is always on. Untimed mode draws it steadily with the number beside it: `<< 1`.
- Never covered by a sprite or a surface: it is drawn at the label depth (`v.z - .6`), in front of what it marks, as labels are since the Art Director's change 2.
- At phone width the two glyphs are 2 cells; the pointer hit zone is widened around them to 44 px, so the picture stays clean and the thumb still lands.
- Nothing else added to the frame flashes during a beat. Neon keeps its flicker (it is the one surface allowed to, and the club cue sits on the bar top, not the neon); the renderer is not touched.

### Two moves, or one?

Dragon's Lair has one right move because it has one story. We have branches, and the eight prompts are where the pursuit branches. Removing the second move would push every branch into the quiet choices and turn the action half into pure survival; keeping two labelled moves keeps the reading task. The answer is to keep **two right directions at a fork beat** and take away everything that made them a menu:

- The two cues flash in the picture; their directions are fixed per beat (the sequence is learnable, as in Dragon's Lair) and never share an axis pair that reads ambiguously (never left and right for two things on the same side).
- The two wrong directions and silence are deaths. A fork now has 5 inputs, 2 right, and one of the right ones is usually better because of what the player learned upstream. That is the CYOA layer riding on the reflex layer, not replacing it.
- The labels `[1] CLOSE THE INLET` / `[2] PULL BELL OUT` are not shown during a timed beat. They appear only in untimed mode, as buttons, exactly as today.
- New **survival beats** (single right direction, no branch) join the fork beats so that action sets have two to three inputs and the last sets are harder. They use existing camera work and geometry (section 3).

Recommendation: fork beats keep two moves; survival beats have one; all beats have wrong inputs and a death. The player decides at a fork from the picture and from what they know, in two seconds, which is the whole point.

### Keyboard

Arrow keys and `W A S D` are the four directions. `1` and `2` are removed from timed beats (they name a menu, not a direction) and kept in untimed mode for the buttons. Space and Enter are not directions and do nothing at a live beat. Focus rules stay: keys are read at the document level while a beat is live, ignored inside menus. A key held from before the cue does not count (`e.repeat` is already filtered; the beat also ignores any key already down at cue time).

### Mouse and touch on the canvas

The canvas takes pointer input only while a beat is live (`touch-action: none` on the canvas during the beat, `pan-y` otherwise so the page still scrolls).

- **Tap or click on a cue**: the cue's hit zone is the projected cell of the cue point widened to at least 44 CSS px square; a pointer-up inside a zone is that direction. Tapping elsewhere on the canvas is ignored, not a miss: a mis-tap should cost nothing, a wrong direction should.
- **Swipe anywhere on the canvas**: a pointer travel of 24 px or more resolves to the dominant axis and is that direction. This is the joystick. A swipe with no cue in that direction is a wrong input.
- Untimed mode keeps the two buttons under the scene and also accepts taps on the steady cues.

### Phone

Portrait: swipe is primary; the cues are 3 to 4 cells wide at 84 columns and the hit zone rule makes them tappable. Landscape: the page enters fullscreen (section 5, shell) and behaves like desktop. First two beats of a new case show a one-line hint under the scene (`SWIPE OR TAP THE FLASH`) and never again on that device (`localStorage`, per-viewer convenience).

### Accessibility path, preserved

`[UNTIMED]` (default when the OS asks for reduced motion, as today) removes every deadline, shows the cues steadily with their `[1]`/`[2]` numbers, shows the two buttons and the caption, and treats a wrong direction as ignored rather than a death. Nothing in section 3 applies in untimed mode except lives lost to the loft deduction. The `[TIMED]`/`[UNTIMED]` toggle stays in settings, not in the checkpoint.

## 3. Consequences

### Lamps (lives)

Three **lamps** per case, reusing the `rewinds` field (0..3) with no save change. Header: `LAMPS ###`, then `##.`, `#..`, `...`, in amber; the word replaces `REWIND x3`. A death costs one lamp and rewinds automatically to the beat's windup (the miss table's `back` and `reset`), after a death beat of 2.5 s. There is no `[REWIND]`/`[CARRY ON]` choice at a death; that decision is what made the miss free.

At zero lamps, Rook's death plays and then a **game-over card** (HTML under the scene, block letters): `NO LIGHT LEFT`. Under it, `caseReport()`'s line so far and two buttons:

- `[RESTART THE CHAPTER]`: lamps back to 3, the current set's entry phase, the fields that set writes reset (the union of its miss-table resets plus its quiet-choice fields; the table below names them). `restarts` +1.
- `[LIMP ON]`: the miss table's `late` value stands and the story continues exactly as today. `limped` becomes true. This keeps the existing miss captions, keeps the story finishable for a player who cannot land a beat, and keeps the `dark` ending reachable (it is unreachable without a `late`: after `subQte`, `hall` is `dive` or `breaker` and both give another ending). `A VOICE IN THE DARK` becomes, fittingly, the ending of the player who limped.

A game over is not a chapter card. It is red, it holds until a button, and it is the only place in the game where the picture waits on the player without a choice in the story. Its caption, new text, is one line: `The last light on the route goes out. Rook does not reach first light.` The picture behind it is the death picture, held and dissolved to the `.` stage of the fade and no further, so the card sits over a dark frame rather than a black one.

Why three and not five: Dragon's Lair's five lives cover roughly forty scenes and two hundred inputs; our route has eleven or twelve inputs and a chapter restart is cheap (the sets are one to three minutes). Three lamps make the substation matter on a clean run. If playtests show most players ending at the rack with one lamp, raise the base windows before raising the lamp count.

What a lamp is in the fiction: Rook's own lantern is never on screen, and it should stay that way; the lamps are the header's, a count of the night's light, the same glyph the lamplighters' posts use. When the last goes out the case does too, which is the title.

### Death beats, one per prompt

Each is a new `death` phase kind: 2.5 s, no buttons, the beat's result camera, a red stinger, and a picture built from geometry the set already has. Captions are new text; no existing caption changes.

| Beat | Right inputs | Death (stinger, picture) | Restart resets |
| --- | --- | --- | --- |
| `streetQte` courier | `^^` catch (courier), `vv` book (gutter) | `UNDER THE TRAM`. Rook is on the rail when the last tram's lamp comes round the corner: the tram body at speed, frame fills with its lamp glyphs. | `choice`, `watched`, `wrong` |
| `pumpQte` inlet | `<<` wheel, `>>` Bell | `DROWNED`. The platform goes; the surge takes Rook off the walkway; the lamp pools on the water go out one by one (Pump Room 4, the fate meant for Bell). | `rescue`, `decoded` |
| `marketQte` cart | `<<` gap, `^^` rope | `UNDER THE CART`. The cart's existing `late` picture (cells spilled and arcing) with Rook under it and the arc glyphs across the frame. | `market`, `keeper` |
| `clubQte` bottle | `vv` duck, `^^` vault | `LIGHTS OUT`. The bottle takes Rook at the temple; the neon goes out (the only surface allowed to flicker) and the frame dims to nothing. Not literal death, the same cost. | `club` |
| `chaseQteA` carrier | `vv` brake, `>>` dive | `FREIGHT`. The carrier's `FREIGHT` label fills the windscreen; the road lamps smear. | `firstMove`, `gap` |
| `chaseQteB` bridge | `<<` ramp; `^^` jump only while `gap === 0` (the cue does not flash otherwise; jumping anyway is a wrong input) | `INTO THE CANAL`. The patrol car leaves the rising deck and the water quad comes up to meet it. | `pursuit` to `chasing`, `caught` |
| `tunnelQte` fork | `>>` right, `<<` left | `THE PIER`. Brick fills the frame; the emergency neon cuts. Cutting left without the radio stays a soft outcome (the gate; Vale gone), because it is a choice, not a reflex failure. | `tunnel`, `caught` |
| `subQte` rack | `<<` dive, `>>` breaker | `CRUSHED`. The existing `late` picture (rack flat over Rook, cells arcing) held, then the pendants go out. The current soft `late` (walks with a stick) survives only through `[LIMP ON]`. | `hall` |

### Survival beats (second pass, after the fork beats work)

Four single-input beats, one right direction, using existing shots and geometry, so the later sets have more than one input and the curve rises. Each has a miss-table entry and a death beat. Captions: one windup line each, new.

| Set | Beat | Input | Death |
| --- | --- | --- | --- |
| Pump | `pumpBurst`, before the fork: the joint splits and the jet crosses the walkway | `vv` | Scalded into the water |
| Club | `clubSwing`, after the fork on the vault route: Krane's fist | `<<` | Lights out |
| Tunnel | `tunnelDip`, before the fork: a flooded dip under a low grate | `vv` (brake) | Aquaplaned into the wall |
| Substation | `subVan`, after the breaker: the van reverses at Rook in the dark | `>>` | Under the van |

That gives 11 to 12 inputs on a pursuit route, 8 of them forks, against 7 to 8 today.

### What a death costs beyond a lamp

Nothing else, and that is deliberate: the rewind resets the beat's fields, so the story is not scarred by a reflex failure; the run is. What a **wrong choice** costs is unchanged and stays in the fields: the ledger, the chip, the manifest, Krane, Vale. What a **restart** costs is the chapter's knowledge (the tape, the keeper, the tail must be earned again) and the `flawless` discovery. What **limping** costs is the `late` branch, the grade and the `dark` ending.

### Window curve

Windows are measured from the first flash of the cue. Base per beat, then modifiers, clamped to 1.25..3.5 s. The observation bonuses stay, at a quarter of their current weight, so knowledge still buys time without making the beat trivial.

| Beat | Base | +0.5 s when | -0.5 s when |
| --- | --- | --- | --- |
| courier | 3.0 | `watched` | never |
| inlet | 2.5 | `decoded` | `wrong` |
| cart | 2.5 | `tail` | `misread` |
| bottle | 2.0 | `market === 'cut'` | `market === 'late'` |
| carrier | 2.0 | `radio` | `club === 'late'` |
| bridge | 2.0 | `radio` | `club === 'late'` |
| fork | 1.75 | `radio` | never |
| rack | 1.5 | `keeper` | `tunnel === 'late' \|\| pursuit === 'late'` |
| survival beats | 1.75 (pump) to 1.25 (substation) | none | none |

The windup phase stays for its camera cut but loses the `GET READY` card and gets a length of 1.5 to 2.5 s, jittered per entry from the checkpoint's `t`, so the cue's moment cannot be counted down to. The status line shows `LIVE`. No pulse, no ticks; the cue's flash rate rises from 4 Hz to 8 Hz over the last third of the window, which is the only countdown.

### Wrong-input penalty

A wrong direction is a death at once (the death beat starts on the keypress, not at the deadline), so a wrong move is visibly a wrong move and not a slow one. There is no partial credit and no second input. In untimed mode a wrong direction is ignored.

### Quiet choices stay quiet

Quiet choices, deductions and timed observations are untouched: buttons under the scene, a typed caption, `YOUR MOVE`. The rule the player learns in the first five minutes: **text under the picture means think; a flash in the picture means move.** The two never happen at once. The loft deduction keeps its lamp cost (the beat sheet's rule, and now it means something); the street and dawn deductions keep their softer costs.

### Narration pace (the owner's second note)

Auto-advancing beats (cutscenes, results, transitions) currently end on an authored clock. Change the rule to: a beat ends at `max(authored seconds, typing time + words / 3 + 0.8)` (about 180 wpm after the caption has finished typing), and any key or tap on the canvas ends it early once the caption is fully typed. Results after a landed move keep their 4 to 6 s (they are 13 to 36 words; the formula holds most of them as they are). `subEntry` goes from 8 s to about 20 s unless tapped through, which is right: it is the exposition of Act 3. The transition line's 1.4 s is fine as it is (the longest line finishes typing at 1.3 s); do not hold the dissolve. Typing speed stays 70 cps.

## 4. Scoring and records

**Reflex tally** becomes four numbers: `faced` (inputs the route asked for, counting `chaseQteB` on the ramp route, which is missing today), `landed` (faced minus deaths), `deaths`, `restarts`. The checkpoint stays flat: add two small integers, `deaths` (0..99) and `restarts` (0..9), and one boolean `limped`. `reaction` stays a transient shown for one beat; the street prompt starts recording it (`choose()` calls `react()`). No per-input history is stored.

**Grade**: A = no deaths; B = one or two deaths, no restart; C = three or more deaths or any restart; D = limped. The case report line: `ENDING: <name> (<n>/6 found). Inputs <landed>/<faced>, deaths <n>, restarts <n>, grade <g>.`

**Discoveries**: `flawless` becomes `deaths === 0 && restarts === 0` (its wording stays). Add `lit` (`Every lamp still burning at first light`: `rewinds === 3` at `canalEnd` on a route with at least four inputs) and `sequence` (`Landed every input on the long route first try`: `deaths === 0 && pursuing && faced >= 7`). 22 discoveries.

**Endings**: unchanged in id and condition. Their reachability changes: the `late` branches are reached only by `[LIMP ON]`, so `dark` is the limped ending and the other five are reached by choices and knowledge. The records gain `attempts` (cases started) beside `cases` (cases closed), written on `startNewCase()` and `canalEnd`, so the menu can say `3 attempts, 1 closed`.

**Route steps**: add `Restarted <chapter>` per restart (derive from `restarts` and the current set is not enough after a later chapter; store nothing, print `Restarted a chapter x2`). `Limped on` when `limped`.

**Records survive** a new case as today; the new fields are validated with defaults of 0/false so existing checkpoints load.

## 5. Change list

Priority order. Untouched throughout: set geometry, shots, blocking, labels, exit points, transition lines, chapter cards, every existing caption, the sprite system, the renderer, the reference check.

| # | File and function | Change | Effort |
| --- | --- | --- | --- |
| 0 | `src/game/session.js` `createSaveStore(...)` call | Add `Object.keys(phaseDefs)` to `validPhases` so checkpoints in the registered sets save (diagnosis point 8). Add a test that a checkpoint written at `subQte` resumes at `subQte`. Ship this before anything else. | S |
| 1 | `src/game/registry.js` | Prompt defs gain `cues:[{dir:'left'|'right'|'up'|'down', at:()=>[x,y,z], id, act}]` replacing `moves` (keep `label` per cue for untimed buttons), `base` (window seconds), `death:{card, caption}`. New phase kind `death` (duration 2.5, `next` = the windup or the game-over). Result defs unchanged. | S |
| 2 | `src/game/case.js` `caseDuration()` | Replace the 5..9 clamp and the +2/-2 table with the section 3 curve (base per prompt, ±0.5, clamp 1.25..3.5). Hand-written prompts (`pumpQte`, `clubQte`, `chaseQteA/B`, `tunnelQte`) get their bases here; `runtime.js` `qteDuration()` delegates. | S |
| 3 | `src/game/case.js` new `promptInput(dir)` | One entry point for every beat: finds the cue for `dir` in the current prompt (registered `cues`, or a table for the hand-written prompts mapping `pumpQte:{left:'valve',right:'pull'}` and so on); a match calls `react()` and the existing move function (`rescue`, `clubChoice`, `chaseChoice`, `tunnelChoice`, `choose`, registered `act`); no match calls `die()`. `promptMove(i)` survives for untimed buttons. | M |
| 4 | `src/game/runtime.js` `die()`, `missBeat()`, `rewind()`, `rewindActions()` | `die()`: `rewinds--`, `deaths++`, enter the beat's `death` phase; on its end, `rewinds > 0` re-enters `back` after `reset()` (today's `rewind()` without the button), else `gameOver()`. `rewindActions()` is removed from timed play; the miss-table entries gain `death` cards and captions for the six hand-written prompts. `promptMiss()` and the deadline branches in `tick()`/`caseAdvance()` call `die()` instead of the `late` move. | M |
| 5 | `src/game/session.js` `gameOver()`, `restartChapter()`, `limpOn()` | Game-over card and its two buttons. `restartChapter()`: table of entry phase per set (`brief`, `loftEntry`, `stationEntry`, `pumpEntry`, `roofEntry`, `tramEntry`, `marketEntry`, `clubEntry`, `chaseEntry`, `tunnelEntry`, `subEntry`) and the reset list from section 3; `rewinds = 3`, `restarts++`, checkpoint. `limpOn()`: apply the beat's `late` move, `limped = true`, enter the result as today (with no rewind buttons). | M |
| 6 | `src/game/runtime.js` keydown handler, new pointer handler | `qteKeys` becomes a direction map (arrows, WASD); `1`/`2` only when `state.untimed`. Pointer: `pointerdown`/`pointerup` on the canvas while `isQte()`; swipe ≥ 24 px → direction; tap inside a cue zone → that cue's direction; else ignored. Cue zones come from `render()` (item 7). Set `touch-action` per beat. | M |
| 7 | `src/game/runtime.js` `render()` and `scenes.js` `caseLabels()`, set `labels()` | The `[1]`/`[2]` `worldLabel` calls at prompts become `cueLabel(point, dir, index)`: draws `<<`/`>>`/`^^`/`vv` in cyan on flash-on frames (`state.event` against the window: 4 Hz, rising to 8 Hz in the last third); steady with `[1]`/`[2]` in untimed mode; records the projected cell and radius for the pointer zones. Same world points as today. | S |
| 8 | `src/game/presentation.js` `stingerFor()`, `presentEnter()` | Windups return no card. Death phases return their red card. Game over: `NO LIGHT LEFT` in a new `over` tone that holds. `chaseQteA/B`, `tunnelQte` keep `cue('danger')` at prompt start. | S |
| 9 | `src/game/runtime.js` `timer()`, `ui()` | Timed prompts: no countdown, no `lc-urgent`, no `tickCue`; status reads `LIVE`. Prompt captions and move buttons only when `state.untimed`. Header shows `LAMPS` glyphs. Hint line for the first two beats. | S |
| 10 | Death pictures: `scenes.js` `caseBlocking()`/`caseGeometry()` for street, pump, club, chase, tunnel; `sets/market.js`, `sets/substation.js` `blocking()`/`geometry()` | One picture per death phase from existing pieces: the tram body on the street rails; the pump platform gone and lamp pools removed; the club neon off and a fade; the freight body at the camera; the chase camera dropping to the water quad; the tunnel pier at the camera; the market `late` picture with Rook under the cart; the substation `late` picture with the pendants dark. Cameras: the result shot of each beat. | L |
| 11 | `src/game/case.js` `caseAdvance()`, `presentation.js` new `captionDone()` | Cutscene and result beats end at `max(authored, typing + words/3 + 0.8)`; a key or canvas tap ends a fully typed beat early. Windups and transitions unchanged. | S |
| 12 | `src/game/save-store.js` | `numbers.deaths [0,99]`, `numbers.restarts [0,9]`, `booleans.limped`; records gain `attempts`. Defaults for absent keys. | S |
| 13 | `src/game/presentation.js` `reflexes()`, `discoveries`, `caseReport()`, `routeSteps()` | Section 4. Count `chaseQteB` on the ramp route. | S |
| 14 | `src/ui/shell.html`, `runtime.js` `resize()` | Remove `main{max-width:1024px}`; the canvas fills the width up to the 180-column cap (the cell grows, the composition and the reference glyph output do not change); if the canvas would exceed the viewport minus a 3-line band, shrink the cell, never crop rows. Status, caption and buttons stay under the canvas in one band; case file, options and reel move behind `[MENU]`. `[CINEMA]` button calls `requestFullscreen()` on the root; phone landscape does it on the first tap. | M |
| 15 | Survival beats: four new prompt/result/death phases in `scenes.js` (pump, club, tunnel) and `sets/substation.js`, with miss-table entries and windup lines | Section 3, second pass. | L |
| 16 | `tests/game.test.cjs` | Rewrite the rewind test as a lives test (three deaths, game over, restart resets the chapter, limp on keeps the `late` path); a wrong-direction test; a pointer swipe test through the harness `document` listeners; the tally on the ramp route; the caption hold; the save-store defaults. The reference test is unchanged. | M |
| 17 | `docs/design/BEATS.md` conventions, prompt window table, miss table; `docs/ARCHITECTURE.md` rewinds section; `README.md` controls | Document the contract, the curve and the lamps. | S |

Order of work: 1 to 4 and 7 first (the contract, playable in the harness within a day), then 5 and 8 to 9 (lives and the card), then 6 (pointer), 10 (deaths in the picture), 11 to 14, then 15 and 16. Items 1 to 9 and 12 to 13 together are about a week; 10 and 15 are the art-adjacent weeks.

### What does not change

- The eight fork beats keep their two outcomes, their fields, their result captions, their stingers and their clues. The miss table keeps its `back` and `reset` entries; the `late` values and captions stay for `[LIMP ON]`.
- Quiet choices, deductions, observations, the case file, the persons of interest, the route breadcrumbs, the six endings, the transition lines, the chapter cards, the scene reel, previews, the menu, settings and the records format for endings and discoveries.
- Camera work: every death uses the beat's existing result shot. Survival beats use the set's existing prompt shot.
- The renderer, the materials, the sprite system, the density rules, the reference regression.

### Why not the other fixes

- **Shorter windows alone** (say 3 s) with the labels and the countdown still there: the player reads faster. It is still a menu.
- **A wrong-input penalty that only shrinks later windows**: invisible, and it stacks into the same soft `dark` ending. Consequence has to be seen in the picture.
- **Lives that only cost score**: the current design. The score is not read by anyone.
- **Removing the second move everywhere**: kills the branching that makes our replay different from Dragon's Lair's. The survival beats bring the single-move rhythm without touching the forks.
- **Randomised cue directions**: would defeat memorisation, which is half of what makes Dragon's Lair replayable. Fixed per beat; jitter the windup, not the answer.

## 6. Risks and what to playtest

**Risks**

- **Two-second windows at 15 fps.** The cue's first frame can land up to 66 ms after the beat starts and the flash is 2 frames on, 2 off. Input latency is not the problem (keys are handled on the event, not the frame); the risk is a cue that is not seen. Mitigation: the first flash-on is forced on the beat's first rendered frame; test at 375 wide where cues are 3 to 4 cells.
- **Deaths in a CYOA audience.** Players who came for the mystery may find the tram harsh on the first beat. Mitigation: the street window is 3.0 s, the first two beats show the hint, and `[LIMP ON]` exists. Do not soften by adding the countdown back.
- **Swipe versus scroll on phones.** `touch-action: none` only during a live beat; if the page scrolls during a beat on some browser, the beat is lost. Test iOS Safari and Android Chrome; fall back to tap-on-cue if swipe is unreliable.
- **Wrong-key deaths from habit.** A player who learned `1`/`2` will press them. They do nothing in timed mode (not a death); say so in the hint.
- **The `dark` ending narrows to the limped route.** That is intended, but the records screen will show five endings reachable by play and one by failure; the menu copy should not promise "six endings are waiting" without that being fair. Consider a soft `late` for exactly one beat (the club, where the miss is a knockout) if the ending needs a clean road.
- **Restart resets knowledge.** Restarting the pump chapter loses `decoded`; the player re-reads the tape (8 s). Acceptable; watch for players restarting the chase and losing `radio`, which they cannot re-earn there. Rule: the restart never resets a field earned in an earlier set.
- **Longer cutscenes.** Hold-until-read makes `subEntry` 20 s for a slow reader and 8 s for a tapper. The tap-to-advance must be discoverable: one `TAP TO CONTINUE` glyph in the status line after the caption finishes typing.
- **The reference check.** Cues replace `[1]`/`[2]` only at prompt phases, which the reference first frame never shows; the check is unaffected. The fullscreen layout changes `cw`, not glyphs; confirm the check passes at 320 and 732 before touching the shell.
- **Checkpoint mid-death.** A death phase must not be a valid resume point; `enter()` checkpoints at every phase, so the death phase writes a checkpoint that resumes at its `back` phase (add it to `legacyPhases`-style mapping).

**Playtest plan** (five fresh players, two of them on phones, one with reduced motion on)

1. Time to first input and whether the player understood the flash without the hint. Target: four of five act on the courier cue within 3 s on the first try.
2. Deaths per route and where. Target: 2 to 5 deaths on a first pursuit route, at least one game over among five players, no player losing three lamps on the courier.
3. Whether players read the picture at forks: ask after the pump which way they went and why. Target: players who read the tape choose the wheel and can say so.
4. Whether anyone prefers the labelled buttons: offer untimed mode after the first run and ask.
5. Reading: count taps-through on cutscenes and whether anyone asks what a caption said. Target: nobody asks to re-read.
6. Screen: does the desktop player notice the page at all; does the phone player find the cues without being told; does landscape fullscreen ever trap someone (make the exit obvious).
7. Replay: after a game over, does the player restart the chapter or limp on, and do they try a different route the second time. Target: at least two of five restart, and the second run is faster by a third.
8. Grade sense: ask what they think their grade meant. Target: they can name deaths and restarts, not "rewinds used".
