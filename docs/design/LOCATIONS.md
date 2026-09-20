# The Last Light: locations

Level design for every set of the case, existing and new. It answers to `docs/design/BRIEF.md` (binding), `docs/ART_DIRECTION.md` (approved look) and `docs/design/BEATS.md` (the beat sheet: phase ids, captions, buttons, exit points). Where this document and the beat sheet differ on what happens, the beat sheet wins; this document says what the picture is, where the camera is and where everyone stands.

Coordinates are world units in the renderer's frame: `x` right, `y` up, `z` into the scene; a camera is `look(x, y, z → targetX, targetY, targetZ)`; sets are built from `box`, `quad`, `ellipsoid`, `building`, `cityRow`, `pillar`, `pendant`, `bench`, `car` and the material list in `src/engine/renderer.js` and `src/engine/materials.js`. Set names follow the sheet: `office`, `street`, `loft`, `station`, `pump`, `roof`, `tram`, `market`, `club`, `chase`, `tunnel`, `substation`, `room`, `canal`.

Every number here was chosen against screenshots of the nine built sets at 180 and 84 columns (the survey is described in the Notes). They are starting values for the build, to be checked at both widths before a set is approved.

---

## Style sheet

### Palette (the eight hues in `renderer.js`, index → meaning)

| Hue | RGB | Who owns it in the world |
| --- | --- | --- |
| 0 steel | 129,160,181 | The city's bones: stone, columns, metal, unlit facades, the division's cars and Krane. Never a light source. |
| 1 cyan | 83,186,184 | Honest machinery and Rook: his coat, the patrol car, consoles, tape readers, screens, service neon, the canal boats, the last tram. The reflex tally in the interface. |
| 2 amber | 255,190,94 | The lamplighters' light: every lamp, every lamp pool, lit windows, wood, doors, the medic, Bell. The interface's title colour. |
| 3 rose | 195,109,103 | Vale and the Board's money: his car, tail lights, velvet, carpet, club neon, emergency strips, misses. Rose on a surface means it belongs to the antagonist. |
| 4 blue | 100,134,210 | The unlit city: dark windows, ceilings, blinds, the gap, the night sky before dawn, the Lumen Board's van. |
| 5 green | 92,153,111 | What grows or rots: leaves, sewer brick, drain slime. Only the street trees and the undercity. |
| 6 paper | 220,228,216 | Evidence and the witness: paper, the dispatch book, the ledger, the manifest, Nell, Marta Quill, road markings. |
| 7 slate | 104,134,151 | Wet ground: road, drain, rubber, rain glyphs. |

Actors: Rook cyan with the amber scarf glyph. Bell amber (2). Nell and Marta paper (6). Vale rose (3). Krane and the loaders steel (0). Medics amber (2). Crowds mix 0, 4 and 6 and never wear 3 or 1. Krane is drawn with `y: .3` so he stands a head taller than a crowd.

### Lighting rules

- Warm lamps against cool architecture. Every set has at least one `lamp` box in the `lamps` list, and its floor must be a material that takes pools (`road`, `paving`, `plank`, `carpet`, `drain`). A pool is the only thing that makes a floor read; without one a floor is a field of dots (the rooftop and concourse survey frames). Change 1 below extends pools to `tiles`, `roof` and `water`.
- Interiors are lit by pendant pools like the street, every 9 to 12 units along the walking line, never a grid.
- Neon flickers and is allowed only in The Filament, the Night Market and Substation Nine, plus the Undercity's existing emergency strips. Hue 1 neon is service light; hue 3 neon is money or danger.
- Emergency red (hue 3 `neon` or `lamp`) appears only when the power is failing: the undercity strips, the substation after the breaker, arcing cells. Never decorative.
- Facade windows are hash-lit (about half, amber or cyan). Uptown rows use tall seeds so the towers blaze; low-district rows are short (h0 8 to 19) so their few lit windows read as rationed. The dark district under the tram is built from windowless `brick` tenements with one `lamp` window in ten.
- Dawn is a material (`dawn`, new) driven by `state.dawn` (0..1, set per phase, not saved). It is used in exactly three places: the substation's loading door (`subDawn`), the interrogation room's corridor window (`roomEntry` → `roomName`) and the canal's sky. Nowhere else does the sky brighten.

### Density rules (what fills a frame)

A frame is approved when it has all five:

1. A repeated structure on at least two depth layers (windows behind columns, racks behind rungs, stalls behind cables). Repetition is what the glyph field turns into texture; one flat surface turns into noise.
2. One warm pool on the floor under the actors.
3. A far layer between 25 and 60 units (a `cityRow`, a patterned wall, a far gantry). Fog turns `#` into `+` beyond 52 and everything into `.` beyond 75, so a far layer beyond 60 is not there.
4. The lower third of the frame holds objects, or the camera pitches so the floor takes fewer than 40 percent of the rows.
5. Actors whose pose matters are within 10 units of the camera; the actor of a prompt within 4 to 7; a face is a face only within 6. At phone width an actor at 8 units is 9 rows tall, at 20 units 4 rows and faceless.

Labels: 12 characters or fewer, placed 0.4 to 0.6 units above the object, never on a surface (the object's own glyphs win the depth test at its edges). `[1]` and `[2]` sit directly over the thing the move touches and are the only labels in the central band during a prompt; name labels move up or hide during the window.

### Camera grammar per act

- Act 1, investigation (00, 01, 01b, 02, 03, 04): slow tracking behind Rook and push-ins onto evidence; one crane in the concourse; the pump room stays low. Entries 6 to 8 seconds, pushes 4 to 6. The camera never moves faster than Rook walks, with one exception noted on the roof.
- Bridge (04b): a moving set that only looks: forward along the wire, back and down at the road, forward again. No cuts faster than 5 seconds.
- Act 2, pursuit (05a, 05, 06, 07): dollies past the bar, cranes over the booth and the market aisle, side-tracking on the road, from-behind and head-on in the drain. Changes in 1 to 3 seconds; entries 5 to 8. The camera may move faster than the actors, always in the direction of the chase.
- Act 3, climax (08, 09, 10): low and head-on for the confrontation, high and wide for consequence, and a still frame at the end. A 7-second crane in, then holds of 5 seconds or more; the case ends on a camera that has stopped moving.

Transitions: every set names an exit point; the exit beat glides 35 percent of the way toward it (60 percent in moving sets) while one line types in. The next set's `sceneStart` is chosen so its first move continues the direction the exit glide was travelling.

---

## Roster and order of play

| # | Set | Act | Status | Prompt | Quiet choices / observations |
| --- | --- | --- | --- | --- | --- |
| 00 | Night Division office | 1 | existing, extended | none | skip only |
| 01 | Station Road | 1 | existing | courier stumble | watch; connect the clue (deduction 1) |
| 01b | Bell's Loft | 1 | new | none | the note; the map and photographs (deduction 2) |
| 02 | North Station concourse | 1 | existing | none | read the tape or follow the knocking |
| 03 | Pump Room 4 | 1 | existing | pump inlet | none |
| 04 | Rooftop | 1 | existing | none | listen; ask Nell; pursue or stay |
| 04b | The Last Tram | bridge | new | none | watch the road (observation) |
| 05a | Night Market | 2 | new | Krane's cart | ask the stall keeper |
| 05 | The Filament | 2 | existing | bottle | none |
| 06 | Elevated Road | 2 | existing | freight carrier; lifting bridge | none |
| 07 | The Undercity | 2 | existing | drain fork | none |
| 08 | Substation Nine | 3 | new | the falling rack | none |
| 09 | Night Division, dawn | 3 | new | none | who signed (deduction 3) |
| 10 | Canal at first light | 3 | existing | none | ending |

Prompts: 6 existing + cart + rack = 8 (the brief's floor). The producer's optional tram crossing is designed here as the sheet's cutscene bridge (04b), without a prompt; a prompt version is described in the Notes if a ninth is wanted.

Flow (from the sheet): 00 → 01 → (01b, non-witness routes only) → 02 → 03 → 04 → { stay: 09 | pursue: 04b → 05a → 05 → 06 → { ramp: 07 → 08 | jump or late: 08 } } → 09 → 10.

---

## 00 Night Division office (existing, extended)

**Purpose.** Prologue: the file, the case board where Vale's commendation hangs beside Bell's photograph, the dark office across the corridor, the city below. The player acts on nothing; every phase can skip.

**Set (as built, plus the corridor).** 16 × 22 × 5 (x −8..8, z −6..16). `plank` floor with a `carpet` rug, `brick` hue 2 walls at x ±8 and z 16, `ceiling`. Desk `wood` at z 7..9.6, desk `lamp` (1.85, 2.2, 8.9) with a pool, the file `paper`, a `screen`, the chair. Case board `board` on the left wall z 2.5..10.5. Cabinets `metal` with `paper` drawers on the right wall. Window at z 16 (x −5..5, y 1..4.2) with a `blind` and four `cityRow`s dropped 6 units behind it. Door `door` at (−8..−5, z −5.9). Pendants at (−3, −3) and (5.5, 13.5). Rain only beyond z 16.6. Labels `CASE BOARD`, `NIGHT DIVISION` hue 1, `I. BELL`.

New for `officeBoard` and the sheet's exit point: the corridor. Beyond the front wall line z −6, a `plank` corridor x −22..8, z −11..−6 with `brick` hue 0 walls at z −11 and x −22, `ceiling` at y 4. Along it three dark desks (`wood` tops on `metal` legs at x −20, −16, −12, z −9) with no lamps. Vale's door opposite the office door: a `hatch` box (dark, hue 0) at (−14..−11.6, 0..3.2, −10.95) with a `sign` name plate above it and no light strip under it. The stairwell door at the corridor's end: `door` hue 2 at (−21.95, 0..3.2, −9.5..−7.5) with a `lamp` hue 2 exit box above it (the only light down there, and the exit point). Two pinned photographs on the case board: `paper` boxes 0.4 × 0.5 at (−7.92, 2.6..3.1, 5.0) and (−7.92, 2.6..3.1, 6.2), the second with a `sign`-material ribbon strip under it (the commendation). Labels during `officeBoard`: `I. BELL` hue 6 under the first, `A. VALE` hue 3 under the second, `VALE` hue 0 over the dark door when the camera glances across.

**Camera (Act 1, as built plus the board beat).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| `officeEntry` | `sceneStart look(−3.2, 2.1, 1.5 → −1.8, 1.2, 9)` → `look(−1.6, 1.7, 4.4 → −1.8, 1.3, 9.2)` | 8 s | The push from the door to the one lit desk. Keep. |
| `officeFile` | → `look(2.3, 1.45, 6.4 → −1.6, 1.2, 8.8)` | 5 s | Low across the desk, `I. BELL` readable. Keep. |
| `officeBoard` (new) | → `look(−2.4, 1.8, 3.6 → −7.9, 2.7, 5.8)` for 3 s, then → `look(−4.6, 1.6, −2.4 → −12.8, 1.5, −10.9)` for 2 s | 5 s | Pan left onto the two photographs, then a glance out through the open office door across the corridor to Vale's dark door: the antagonist seeded as a door with no light under it. |
| `officeWindow` | → `look(−2.2, 2.2, 6 → 0, 2.4, 16)` | 6 s | Rises to the window and the towers. Keep. |
| Exit | glide toward the stairwell door | 1.4 s | Through the office door and left along the dark desks. |

**Blocking.** Rook seated `read` at (−3.3, 9.6) through `officeBoard`; for the window beat he walks to (−1.2, 14.3). No one else.

**Exit / entry.** Entry: the camera fades up inside the doorway. Exit point (−21.5, 1.5, −8.5), the stairwell door at the end of the corridor (moved from the office door). Line to 01: "Rook takes the stairs down to Station Road. The rain has not let up."

**Phone.** The glance across the corridor is a 2-second shot of a dark door at 10 units: it needs the `VALE` label and the lit stairwell box in the same frame or it reads as nothing. `CASE BOARD` clips at the left edge in the window shot: shift it to (−7.4, 4.5, 7).

**Telegraph.** No prompt.

**Changes.** (a) The corridor and the two photographs above: M. (b) Raise `board` base luminance .3 → .4: S. (c) Bell's lantern on the desk corner as a `glass` hue 1 box at (−2.0, 1.14..1.8, 7.4): S.

---

## 01 Station Road (existing, approved)

**Purpose.** Rook follows the stranger with Bell's lantern; a red car leaves the far corner; the courier stumbles; the player chooses the witness or the book; the deduction sends Rook under the station or, on the non-witness routes, up to the loft first.

**Set (as built, immutable static geometry).** The road, paving, twelve `building`s, the station facade and clock tower at z 39..44, the `door`, awnings, kiosk, six street lamps with pools, trees, benches, the empty tram at z 28..34, cables. Rain. Labels `PRINT`, `NORTH STATION`, `PUMP 4`, vertical `HOTEL`, `[1]`, `[2]`, `P4`.

Per-frame additions (drawn in `geometry()` by phase, like the service hatch, so the first frame and the regression reference are untouched):

- `streetFollow`: Vale's red `car` hue 3 at (−4, 0, 36) with lights off (a `dark` flag on `car()` that skips its `lamp` and `tail` boxes), pulling away −x from t 3 s to leave frame at x −12 through the gap between the third left building (z 22..32) and the station.
- `streetEvidence` and after, non-witness routes: the dropped lantern in the gutter, a `lamp` hue 2 box at (1.5, 0.15..0.45, 19.8) with the label `BELL/LOFT` hue 6 at (1.5, 0.95, 19.8).
- `streetDeduce` and after: the depot on the left of the street, in the facade of the second left building (x −8, z 6..18): a `door` hue 2 box at (−8.02..−7.9, 0..3.2, 9.2..11.0), a `sign` plate above it, an iron stair of `metal` treads climbing the facade from (−7.6, 0.2, 12) to a `grate` landing at (−7.5..−6.5, 4.2, 9.2..11.2), and the lit window over the depot doors: a `lamp` hue 2 box at (−7.95, 3.6..4.4, 9.6..10.6). Label `DEPOT` hue 2 at (−7.9, 3.0, 10.1).

**Camera.** As built for brief, watch, ready, follow, danger, prompt, result and evidence (the street tracking is the reference grammar). `streetFollow` keeps the tracking shot; the red car is at the frame's far end for its 3 seconds of tail light. New: `streetDeduce` pulls back to `look(3, 2.4, 0 → −3.5, 2.4, 26)` (the hotel sign right at 31°, the depot stair and lit window left at 34°, the station steps centre far); `streetLoftTurn` turns to `look(−3.8, 2.2, 14 → −8, 3.2, 10.2)` over 4 s onto the lit window and the stair. `streetArrival` as built.

**Blocking.** As built. In `streetLoftTurn` Rook walks from (−2.2, 17.8) to the stair foot (−7.2, 12.4) and `reach`es for the rail.

**Exit / entry.** Exit point (−4.9, 1.3, 38.7), the `PUMP 4` hatch (station route); (−7.4, 4.2, 10.2), the stair landing (loft route). Lines: "Three knocks, or a shoulder. Either way, the hatch gives." / "Up the iron stair. Bell's window is the one with the light on."

**Phone.** Both markers, the facade and `PUMP 4` read at 84 columns. `NORTH STATION` loses its first letters at the frame edge in the prompt shot; leave it. `BELL/LOFT` (9 characters) over a 0.3-unit lantern at 5 units is fine.

**Telegraph.** The limp seen in the watch beat, the boot on the wet rail glyphs, the gutter water under `[2]`, the outstretched arm under `[1]`. Approved; do not touch.

**Changes.** Only the per-frame additions above. S each, plus the `dark` flag on `car()`.

---

## 01b Bell's Loft (new)

**Purpose.** One room over the lamp depot: the warm kettle, Nell's note under the lamp key, Bell's route map with lamps 14 to 19 crossed out and tagged with Vale's order, and three photographs that put the batteries at The Filament's back door. Reached only when Rook has no witness. The player reads the note (a clue) and deduces where the batteries go (deduction 2).

**Set.** 9 × 7 × 3.2: x −4.5..4.5, z 0..7. One floor above Station Road; the window looks across at the station clock.

- Floor `plank` hue 2. Walls `brick` hue 2 at x ±4.5. Front wall z 0 in two `brick` boxes leaving a door gap at x −3.6..−2.4 with an open `door`. Outside the door a `grate` landing (−4.5..−2, 0, −1.4..0) and `metal` stair treads descending to z −4 at y −4 (the top of the street's iron stair, seen in the entry). `ceiling` at 3.2 with one `metal` beam at z 3.5.
- Window in the back wall z 7 at x −1.5..1.5, y 0.9..3.0, `metal` frame and mullion, no glass. Beyond it, dropped 4 units (`baseY: −4`): a `road` quad x −40..40, z 8..40, `paving` strips, street lamps at (−3, 12), (3, 20), (−3, 28), (3, 34) with pools, and the station clock: a `tower` box (−2.2..2.2, 2..11, 21..25) with `baseY: −10` so the material's clock face lands at world y 7.55, 19° above a camera at (0, 1.5, 5) and inside both fields of view, plus a `stone` roofline and two `building`s beside it (x 4..14 and −14..−4, z 20..28, h 8). Rain beyond z 7.2 only.
- Table under the lamp: `wood` (−1.2, 0, 2.4)–(1.2, .9, 3.8). On it the note, a `paper` hue 6 box 0.3 × 0.02 × 0.25 at (−.2, .9, 3.0), weighted by a `metal` key box 0.12 × 0.04 × 0.06; the kettle, a `metal` box 0.35 cube at (.7, .9, 3.4) on a `metal` stove ring, with a `cable` hue 6 wisp quad 0.15 × 0.4 above it (steam: the "kettle is warm" drawn); a tin mug.
- The one lamp: `pendant(0, 3.1, 2.4)` (lamp box y 2.1..2.55, `lamps.push([0, 3.1])`): a pool on the floor around the table; the note is in it.
- Map wall: the back wall left of the window, a `map` box (−4.4..−1.8, 1.2..2.8, 6.95..7.0). **New material `map`**: hue 6 base `.` lum .55; street lines `-` every 0.5 along the wall's x and `|` every 0.35 in y; lamp dots `@` hue 2 at hash-chosen crossings (about one in four); in the band x −3.9..−2.1, y 1.85..2.15 six crossings are drawn `x` in hue 3 at lum 1.1 (lamps 14 to 19 crossed out). A `paper` tag box (−2.3..−1.9, 2.2..2.45, 6.94) beside the band. Fallback: `board` with six `lamp` hue 3 pin boxes.
- Photographs: the back wall right of the window, three `paper` boxes 0.7 × 0.5 at (1.9..2.6), (2.8..3.5), (3.7..4.4), y 1.7..2.2, z 6.95. The first carries a `neon` hue 3 strip 0.3 × 0.06 on its face (the club's sign is the brightest thing in the prints and it flickers); the second a `car`-material hue 4 sliver 0.4 × 0.15 (the Board van); the third a `metal` sliver (a coat). Labels appear only in `loftBoard`: `FILAMENT` hue 3, `BOARD VAN` hue 4, `DIVISION` hue 0, each 0.35 below its print.
- Cot: `wood` frame (−4.3, 0, 3.0)–(−2.3, .5, 6.2) with a `paper` sheet; bench with lantern parts (the producer's roster): `wood` (1.4, 0, 4.6)–(4.3, .95, 6.4) with three `glass` hue 1 chimneys, a `cable` coil, a `metal` toolbox and one unlit spare lantern on a `metal` hook by the door with the label `BELL` hue 6 in the entry only.
- Far background: the facades across the road at 14 to 30 units and the clock tower at 18: seen only through the window.
- No neon except the strip inside the photograph.

**Camera (Act 1: push-ins).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| Establishing (from 01's stair landing) | `sceneStart look(−3.0, 1.2, −1.6 → −1.5, 1.4, 4)` | fade-up | On the landing, looking through the open door into the pool of light; the street exit glided up the stair, so this continues upward and in. |
| `loftEntry` | → `look(−2.4, 1.6, 1.2 → 0.5, 1.2, 4.5)` for 4 s, then → `look(−2.0, 1.6, 2.0 → −3.1, 2.0, 7)` for 3 s | 7 s | Through the door, a slow pan across cot, table and bench, ending on the map wall. |
| `loftTable` | `look(−2.9, 1.7, 0.4 → −1.2, 1.1, 5.2)` | 4 s | From the doorway: the note on the table in the foreground pool, the map wall with its red crosses behind. |
| `loftNote` | → `look(−.9, 1.5, 1.7 → −.2, .92, 3.0)` | 4 s | Close on the note under the key; the pool's `=` glyphs around it. |
| `loftBoard` | → `look(1.6, 1.8, 4.5 → 3.15, 1.95, 7)` | 5 s then hold | Tight on the three prints in a row; the neon strip in the first is the only flicker in the set. |
| `loftLeave` | → `look(−.2, 1.5, 4.2 → 0, 7.5, 22)` then → `look(0, 1.5, 5.6 → 0, 7.5, 22)` | 4 s | To the open window and the clock across the street: the exit point drawn before the exit beat. |
| Exit | glide toward the window | 1.4 s | Continues the leave push. |

**Blocking.** Entry: Rook `walk` (−3, −1) → (−1, 2.2). Table: Rook `watch` at (−2.2, 1.6) facing the table. Note: Rook `read` at (−.9, 2.0). Board: Rook `read` at (2.8, 5.2) facing the prints (the camera at 2.5 units sees his shoulder at the frame's left). Leave: Rook `watch` at (0, 5.8) at the sill. No one else; the kettle's steam is the only other motion.

**Exit / entry.** Entry point (−3, 0, −1), the landing. Exit point (0, 1.9, 7.05), the window. Line to 02: "Down the stair and along the rails to the station's service hatch. Bell's job is still open."

**Phone.** The map at 3 units fills 84 columns; the six `x` marks are single cells and must stay inside the central 40 columns (the `loftTable` yaw is set for it). The three prints at 2.5 units are 8 columns each; three labels of 8 to 9 characters need the prints spaced 0.9 apart, as placed. The clock through the window at 18 units is a 6-column `o` ring at phone width: the label `00:05` is not needed, the caption carries the time.

**Telegraph.** No prompt. The deduction's picture is the first print: the only neon in the room, flickering rose. The wrong answers (depot, station vaults) have no picture in the room at all.

---

## 02 North Station concourse (existing)

**Purpose.** The maintenance desk with order 7731 signed VALE; the tape; the knocking below. The player reads the tape (grants the inlet knowledge) or follows the knocking.

**Set (as built).** 26 × 61 × 12 (x −13..13, z −15..46). `tiles` floor, `wall` walls, `ceiling`, ribs every 9 z with `pillar`s at x ±8 and a `pendant` at x 0 (pools that `tiles` ignores until change 1), benches, kiosks, the pump-room `hatch` at z 43.6..44 with a `sign`, the maintenance desk `wood`/`dispatch`/`console` at z 18.7..20.4, posters. Labels `PUMP ROOM 4` (0, 5.25, 43.2), `MAINTENANCE` (0, 2.2, 19.1).

Additions: the order on the desk, a `paper` hue 6 box 0.5 × 0.02 × 0.35 at (.4, 1.25, 19.3), label `ORDER 7731` hue 6 during `stationQuiet`; the tape reels, two `metal` ellipsoids r 0.18 on the `console` top, rotated per frame in `caseGeometry` (the pump wheel's construction) so they turn.

**Camera.** Start crane lowered and nearer, `look(4, 7.5, −2 → 0, 1, 22)` (the survey's crane from (5, 10, −4) shows actors 3 rows tall over a dot field), entry 7 s to `look(−3.5, 3.1, 10 → 0, 1.5, 19)`. `stationQuiet` `look(−3.5, 2.9, 13 → 0.9, 1.1, 19)` (6° right of the built shot so `MAINTENANCE` and `PUMP ROOM 4` are both inside the central band). `stationListen`: push to `look(−1.6, 1.7, 16.5 → 0.2, 1.3, 19.6)` over 3 s, then tilt over 5 s to `look(−1.6, 1.7, 16.5 → 0.6, 0.2, 21)` toward the floor where the knocking is. `stationReady`: pan right to `look(−1.6, 1.9, 16.5 → 2.5, 1.5, 43)` so the hatch comes up on the right. Exit: glide to the hatch.

**Blocking (as built).** Rook walks (−1.6, 8) → (−1.2, 17.2) and `read`s; Nell beside him at x 1.3 on the witness route, `stand`, then `watch` at (2.4, 21) facing the hatch during the listen.

**Exit / entry.** Entry: the service hatch on the street facade (camera high at the near end). Exit point (0, 2, 43.8); line "Down the service ladder, toward the knocking."

**Phone.** The lowered crane makes the actors 5 rows instead of 3. `PUMP ROOM 4` (11 characters) reads only inside the central 60 columns: the yaw fix above.

**Telegraph.** No prompt; the knocking's direction is drawn by the tilt to the floor, Nell's stance and the centred sign.

**Changes.** (a) Change 1 (pools on `tiles`): eight amber pools on the floor. S. (b) `glass` hue 0 quads between the ribs instead of the flat `ceiling`: S. (c) A departures `screen` 4 × 1 at (−2..2, 4.2..5.2, 21) and two luggage carts (`metal` + `rubber`) by the kiosks: S. (d) The order and reels above: S. (e) Enlarge the hatch `sign` to 8 wide: S.

---

## 03 Pump Room 4 (existing)

**Purpose.** Bell on the far platform; the joint splits; close the inlet (the ledger stays dry, and with it the initials H.A.) or pull Bell out.

**Set (as built).** 30 × 48 × 11, `water` floor at −.7, `brick` walls, `grate` walkway and spur, railings, four `tank` ellipsoids with `pipe` runs, three beams with pendants, the inlet `console` and wheel at (−1.25, 1.35, 11.88), Bell's platform at (3.8..6.5, 0..1.2, 17..18.5), the `hatch` at z 33.6, the ladder at x 5.3..7 z 31 (exit). Labels `INLET`, `BELL`, `[1]`, `[2]`.

Additions: the splitting joint, a `pipe` box (2.5..3.5, 6.8..7.6, 16.5..17.5) that drops 0.6 during the windup with a `water` box 1 × 0.3 × 1 spilling under it; the satchel, a `wood` hue 2 box 0.35 × 0.45 × 0.15 at Bell's hip; in `pumpTruth` on the valve route the ledger open between them, a `dispatch` box 0.6 × 0.06 × 0.4 at (1.4, 1.3, 15.8).

**Camera.** Start `look(−4.5, 1.8, −7 → 2, 1.5, 18)`, entry 6 s to `look(−1.5, 2.5, 3 → 1.8, 1.25, 14)` (keep). `pumpDanger`: two 1-second cuts, the joint `look(1.8, 3.4, 12 → 3, 7.0, 17)` then the wheel `look(−2.4, 2.0, 9.6 → −1.25, 1.35, 11.9)`. `pumpQte` fixed wide `look(−1.7, 3.1, 8 → 1.1, 1, 14)` (keep: wheel left, Bell right, the platform legs against the water). `pumpResult` holds; on valve the `water` floor drops 0.4 over 4 s (a per-frame y on the floor quad). `pumpTruth` `look(.3, 2.7, 10.5 → 3, 1.4, 16.4)` (keep).

**Blocking (as built).** Rook (−.6, 1) → (−.6, 11) `watch`; Bell `stand` on the platform, carried to (3.25, 16.2) with `support`; Nell `watch` at (1.5, 14.5) on the witness route and, on the late-witness result, `reach` at (1.2, 15) with a `cable` line to Bell.

**Exit / entry.** Entry: the ladder foot (0, 0, −8). Exit point (6.15, 5, 31.1); line "Up the service stair, Bell's arm over Rook's shoulder."

**Phone.** The wheel, Rook and Bell read. `[1]` currently floats a full block above `INLET` in empty air at the top-left of the phone frame: move `[1]` to (−1.25, 2.15, 11.8) over the wheel rim and `INLET` to the console's side (−2.1, 1.6, 12.2). `[2]` over `BELL` is right.

**Telegraph.** The wheel is the only amber machine part in frame and sits under `[1]`; the water against the platform legs under `[2]`; the joint dropping in the windup; the tape's advice if read.

**Changes.** (a) Change 1 (pools on `water`): the black lower half of every pump frame becomes rippled amber. (b) Move the far tank pair from z 24 to z 20 so the entry has tanks on both sides at 8 to 12 units: S. (c) Raise `brick` hue 0 base luminance by .06: S. (d) The joint, satchel and ledger props: S.

---

## 04 Rooftop (existing)

**Purpose.** Bell to the medic; far below Vale's red car heads west under the elevated road toward the market and the club, and the last tram crosses the dark district the same way; the radio; Nell's confession; pursue or stay.

**Set (as built).** 32 × 40 `roof` floor, parapets, the stair housing with the `hatch` at z 3 (the service lift cage; exit for both routes), two `vent`s, the radio mast and `console` at z 17, a ladder, one pendant at (−12, 13), city rows dropped 20 units, four cars circling beyond z 43 (behind the parapet in every built shot). Rain. Label `NORTH / RADIO`.

Additions for `roofQuiet`: the westward view over the north parapet. At y −12, an `express` strip x −60..30, z 50..56 (the elevated road, seen end-on from above) with `barrier` edges and lamp posts; on it Vale's `car` hue 3 driving −x from x 4 to x −40 over 8 s; a parallel tram viaduct `road` strip at y −13, z 42..46 with a `tram` hue 1 box driving −x (its lit band reads as windows); at the far left the market's glow, eight `lamp` boxes under the road at x −34..−26, z 50..56, y −14, and a `neon` hue 3 box at (−30, −8, 58) with the label `THE FILAMENT` hue 3. Flying traffic raised to y 8..16, z 30..50 so it crosses the sky above the parapet.

**Camera.** Start `look(−12, 6, −5 → 1.3, 1.5, 15)`, entry 8 s sweep to `look(−7, 4.1, 4 → 1, 1.2, 15)` (keep). `roofQuiet`: from behind Rook at the parapet, `look(−2.4, 3.4, 20.5 → −22, −12, 52)`, 4 s crane over the parapet to it and hold: the red tail lights small on the road, the tram's lit band crossing the black district, the market glow and the club's neon at the far left. This is the one Act 1 move faster than Rook walks; it is a look, not a walk. `roofListen`: `look(−3.2, 2.8, 10.3 → .1, 1.1, 16.6)` (keep; the radio close, the towers behind). `roofSignal`: `look(−1.8, 2.2, 12.8 → 1.0, 1.2, 17.4)`, the receiver foreground, Nell at the parapet with the lantern (a `lamp` box at her feet). `roofConfession`: two-shot `look(−1.6, 2.0, 13.5 → 2.0, 1.4, 17.2)`, 4 s push. Exit: glide to the lift cage.

**Blocking (as built, plus).** Rook (−8, 5) → (−1.6, 15.8) `watch`; for `roofQuiet` he walks to the north parapet (−1.5, 24.5) `watch`; the medic `support` beside Bell `stand` at (2.4, 16.4) and (3.4, 16.6); Nell `stand` at (1, 18), lean .15 toward Rook in the confession.

**Exit / entry.** Entry: the stair hatch. Exit point (−9.5, 1.5, 3.1), the lift cage, for both routes. Lines: to 04b "Down the service lift. The last tram is passing under it, and Rook does not wait for the doors." To 09 (stay) "Rook stays. The medic's van takes them both to Night Division, where the statement is written before dawn."

**Phone.** The built quiet shot is 60 percent bare roof; the parapet crane fixes it (the parapet line at 40 percent height, the city below). `NORTH / RADIO` (13 characters) becomes `RADIO`.

**Telegraph.** No prompt. The choice's picture: the medic's hand on Bell, and, over the parapet, the red lights going away toward the pink sign.

**Changes.** (a) Change 1 (pool on `roof`). (b) Floor furniture: a water tank `ellipsoid` (−9, 2.2, 20, r 2 × 2.2 × 2) on a `metal` cradle, a `glass` skylight box (2..6, 0..0.6, −8..−4), three aerial rods, a hoarding `sign` at (10..16, 1.25..4.5, 25.8) with a `neon` hue 1 strip: M. (c) The westward view props and raised traffic: M. (d) A `metal` lift cage grille on the stair housing face: S.

---

## 04b The Last Tram (new, bridge)

**Purpose.** Rook rides the roof of the last tram across the dark district to Market Arch. The player may watch the road behind (8 s) and spot the black division car with its lights off (grants `tail`, time at the market).

**Set.** A moving set (`moving()` includes `tram`; `state.distance` advances as in the chase).

- The tram viaduct: `road` hue 7 floor x −4..4, z −50..950 (the material's world-fixed rails at |x| 1 and 2.4 are the tram's tracks), `barrier` edges 0.5 high, `metal` catenary posts every 24 z at x ±3.8 with a `cable` quad along x 1.35 at y 6 (the wire the camera looks along).
- Lamp posts on the viaduct every 24 z, offset from the catenary posts: `metal` posts with `metal` heads and no `lamp` box for z < 420 (lamps 14 to 19 dark, and the rest of the district with them); from z 420 on, `lamp` heads with pools: the market's district coming up lit.
- The road beside the rails: an `express` deck x 6..16 at y −1.5, z −50..950 with `barrier`s; on it the black `car` hue 0 with the `dark` flag at (11, −1.5, d − 14), holding distance; two ordinary cars far ahead with lights.
- The dark district: near rows of windowless `brick` hue 0 tenements (boxes 8 × 12 × 10 to 16 high) at x −22 and x 24, every 20 z, with one `lamp` hue 2 window box per ten tenements; far rows `cityRow(−40, 950, 20, −44, 10)` and `cityRow(−40, 950, 20, 40, 12)`, fogged. At z 520 onward, tall rows (`cityRow` h0 32) on both sides: uptown beginning. At z 600 the elevated road crosses overhead: an `express` box x −40..40, y 9..10, z 596..606 on `column` piers, with eight `lamp` boxes under it at y 8 and the market's stalls beginning beyond (six `kiosk`/`awning` boxes at x ±6, z 606..630) and the `neon` hue 3 sign at (−3..3, 5..6, 640). Label `MARKET ARCH` hue 2 on the pier at (0, 8.5, 596) during `tramArrive`.
- The tram under the camera: `tram` hue 1 body x 0.1..2.65, y .45..3.3, z d−6..d+2 with a `metal` roof, a `metal` roof rail 0.1 × 0.5 along both edges and a `metal` pantograph frame at d−3; `rubber` bogies. Its lit band is the material's own.
- Rain: yes (the runtime list gets `tram`).
- Labels: `PLATE 41` hue 0 over the black car during `tramSpotted` only; `MARKET ARCH` as above.

**Camera (bridge: looks only).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| Establishing (from the roof's lift) | `sceneStart look(1.35, 7.5, d−14 → 1.35, 3.6, d+20)` | fade-up | High and behind, dropping: the lift's descent continued. |
| `tramEntry` | → `look(1.35, 4.3, d−4 → 1.35, 3.6, d+40)` | 8 s | Low on the roof, forward along the wire; dark posts pass on both sides at 2.5 units. |
| `tramRide` | → `look(3.4, 4.9, d+1 → 10, −.6, d−24)` | 5 s | Turns back and down along the tram's length to the road beside the rails; the black car a wet shape without lights. |
| `tramWatch` | hold | 8 s | The observation is the shot. |
| `tramSpotted` | hold 2 s, then → `look(1.35, 4.3, d−4 → 1.35, 2.0, d+70)` | 6 s | Forward again as the lit posts and the arch come up. |
| `tramArrive` | → `look(1.35, 4.0, d−2 → 0, −1.5, d+26)` as the distance rate falls to 4 | 5 s | Forward and down over the front rail to the arch: the market a pool of stolen light under the concrete. |
| Exit | glide 60 percent toward the exit point | 1.4 s | Over the rail. |

**Blocking.** Rook `crouch` on the roof at (1.35, 3.55, d−1) throughout; `watch` (standing, one hand on the pantograph frame) during `tramSpotted`; `reach` at the front rail in `tramArrive`.

**Exit / entry.** Entry point (1.35, 3.55, d−1), the roof under the lift. Exit point (1.35, 3.6, camera.z + 12), the front rail over Market Arch. Line to 05a: "Over the rail and down onto the arch. The market's light is stolen light, and it is on."

**Phone.** The tram roof under the camera fills the lower third at both widths: good. The black car at 25 units behind is a 4-column `car` at phone width with no lights: the `PLATE 41` label is what makes the observation legible, so it appears the moment `tail` is set, not before. The arch at 26 units in `tramArrive` must be within 52 units at fade so its `#` glyphs are not thinned.

**Telegraph.** No prompt. The observation's picture: every other car on the road below has `@` headlamps and rose tail lights; one has none.

---

## 05a Night Market (new)

**Purpose.** The market under the elevated road, lit by reserve cells with Lumen Board serials, rising toward The Filament's pink sign; Marta Quill's cart; Krane sends a loaded cell-cart down the aisle at Rook: slip into the stall gap on the left, or go up the awning rope on the right and over the stalls after him.

**Set.** The aisle runs along z under the road deck and rises toward the club: x −9..9, z −8..46.

- Floor: `paving` hue 0 as a sloped quad from y 0 at z −8 to y 2.7 at z 46 (a 3° slope: the cart rolls, the pools still work because pools use x and z only). Everything standing on it takes its base y from the slope: `yAt(z) = (z + 8) × 0.05`.
- Deck underside: `ceiling` at y 9 (flat: the deck does not slope, so the headroom closes toward the club, which is right), `column` pillars at x ±7.5 every 12 z from −4, `metal` beams under the deck at each pair. The arch pier at the bottom: two `brick` hue 0 boxes 3 × 9 × 3 at x ±5.5, z −7..−4 with a `stone` lintel (the cart bursts against the left one). The tram halt above the arch is the exit of 04b, seen as a `barrier` edge at y 9.5.
- Stalls: two rows, left x −6.5..−4.1, right x 4.1..6.5, at z 2, 6, 10, 14, 18, 22, 26, 30, 34, 38 (2.4 long, 1.6 gaps). Each a `kiosk` hue 1 box 2.2 high on its slope base with an `awning` (alternating hue 2 and 3) at +2.3..+2.55 overhanging 1.4 toward the centre. Every third stall a `sign` on top; the stalls at z 14 and 18 carry a `neon` strip on their face (hue 1 left, hue 3 right).
- Stall lamps are reserve cells: on a `cable` across the aisle at y 3.6 every 4 z from 0 to 40, at x −2.9 and 2.9 on every other cable (z 0, 8, 16, 24, 32, 40), a `console` box 0.35 × 0.5 (its amber top band reads as a glowing cell) with a `lamp` hue 2 cap 0.3 × 0.15, each pushed to `lamps`: twelve pools making a continuous amber walk on both sides.
- Marta's cart at (−3.6, yAt(12), 12): `wood` bed 1.2 × 0.9 × 1.8 on `rubber` wheels, a rack of eight `console` cells on top, a `sign` plate; label `QUILL` hue 6 at (−3.6, +2.3, 12) from `marketAisle` on.
- Krane's cart: `wood` + `metal` frame 1.6 × 1.3 × 2.2 loaded with twelve `console` cells, parked at (0, yAt(30), 30) on the aisle's centre line, launched in `marketDanger` and rolling to z −5 during the prompt (12 units/s, following the slope), bursting on the left pier: eight `lamp` boxes scattered plus an `arc` flash.
- The stall gap under `[1]`: the 1.6-unit gap between the left stalls at z 6 and z 10 (x −6.5..−4.1, z 8.4..10), kept clear of crowd, with a stall lamp directly over it.
- The awning rope under `[2]`: a `cable` quad from (4.2, yAt(9)+1.0, 9.2) to (5.8, yAt(9)+3.3, 9.6), 0.08 wide, plus a `metal` cleat at its foot; the right awnings from z 10 to 38 form a continuous walkable row at +2.55.
- Vale's route: the far end. The club's `neon` hue 3 sign at (−3..3, 5..6, 46) on a `sign` gantry across the aisle, label `THE FILAMENT` hue 3 at (0, 6.6, 46); to its right, the back door marked VINE ALLEY: a `door` box at (6.8..7.6, yAt(44)..+3, 44) under a `sign` plate with the label `VINE ALLEY` hue 1 in `marketResult` (cut) only. Vale's red `car` hue 3 at (−7.2, yAt(42), 42) with its lights off.
- The black car (tail route): `car` hue 0, `dark`, at (−7, 0, −6) under the arch.
- Crowd: fourteen sprites (`stand`/`walk`, hues 0, 4, 6) at stall fronts between z 0 and 30, none on the centre line or in the gap; in `marketDanger` they `walk` to the stall fronts. Krane hue 0 with `y: .3`.
- Rain: for |x| > 9 (the open flanks) and z > 42 (beyond the deck, where the sign burns through it): a runtime filter like the office's.
- Far background: beyond the sign, `cityRow(50, 120, 16, −30, 20)` and `cityRow(50, 120, 18, 12, 24)` rising with the road deck (`express` ramp from z 46 to 70 at x −12..−6 with `barrier`s: where the patrol car will go in 06).
- Labels: `MARKET` hue 2 on the arch lintel (0, 9.8, −5) in the entry; `QUILL`; `THE FILAMENT`; `KRANE` hue 0 over Krane from `marketDanger`; `[1]` at (−5.3, yAt(9)+2.4, 9.2) over the gap; `[2]` at (5.4, yAt(9)+3.7, 9.4) over the rope's top.

**Camera (Act 2).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| Establishing (from the tram's front rail) | `sceneStart look(0, 6.5, −12 → 0, 2.0, 14)` | fade-up | Dropping from the arch; the tram exit glided over the rail. |
| `marketEntry` | → `look(−1.2, 1.9, −2 → 0, 3.2, 44)` | 8 s | Tracks Rook into the aisle at shoulder height; cells pass close at 2.4 units; the pink sign at the far end, up the slope. |
| `marketAisle` | → `look(−2.6, 1.7, 15 → −1, 1.4, 3)` | 3 s | Turns back down the aisle: Marta's cart foreground left, Rook mid, the crowd behind him, Krane a head above it. |
| `marketKeeper` | → `look(−3.2, 1.5, 9.6 → −3.6, 1.35, 12.4)` | 3 s | Close on Marta and the cart; the serials are the `console` bands. |
| `marketDanger` | cut to `look(1.6, 1.7, 21 → 0, 1.8, 30)` | 2 s | Krane at the top of the aisle with his back to the cart, the cart's top edge tipping, the crowd scattering to the stall fronts. |
| `marketQte` | `look(−.4, 2.2, 3 → 0, 1.6, 22)` | window | Fixed wide up the aisle from behind Rook: the cart in the middle distance coming down the centre line, the gap and its lamp at the left of frame, the rope at the right. |
| `marketResult` slip | hold; the cart passes the camera's right at 0.5 s and bursts behind it (heard, then seen as the camera pans down to the pier over 2 s) | 4 s | Rook in the gap at the left; cells burst white on the pier. |
| `marketResult` cut | → `look(2.4, 4.2, 6 → 5.2, 3.0, 26)` | 4 s | Dolly up and along the right awnings as Rook runs them; the cart passes under; Krane reaches the door at the far right. |
| `marketResult` late | hold; the cart stops at z 7 across the aisle | 4 s | Rook down under its edge; `arc` flashes on the spilled cells; the crowd stays back. |
| End of result | → `look(−.4, 2.2, 3 → 0, 4.5, 46)` | 2 s | Up the aisle to the sign. |
| Exit | glide toward the sign | 1.4 s | Up the slope. |

**Blocking.** Entry: Rook `walk` (−1, 0, −6) → (−1, 8) on the slope. Aisle: Rook `watch` at (−1, 8); Marta `stand` at (−3.6, 13.4) behind the cart; Krane `walk` at (1.6, −2) then (1.2, 4) among the crowd. Keeper: Rook `watch` at (−2.4, 10.4). Danger: Krane `reach` at (0.4, 31.5) facing the camera with the cart in front of him; Rook `watch` at (−.8, 9), lean .1. Prompt: Rook holds at (−.8, 9). Slip: Rook `walk` → (−5.3, 9.2) `crouch`. Cut: Rook `reach` at the rope foot (4.4, 9.2), then `walk` along the awning tops (5.3, +2.55, 10 → 38), then down at (6.4, 42); Krane `walk` (0.4, 31.5) → (7.2, 43.5) through the door. Late: Rook `stumble` at (0, 8.5), lean −.5, `y: −.3`; Krane `walk` out of frame up the aisle. Crowd: `stand` at stall fronts; in `marketDanger` six of them `walk` 1 unit sideways.

**Exit / entry.** Entry point (−1, 0, −7), under the arch. Exit point (0, yAt(46)+2.5, 46), the far end under the sign. Line to 05: "Up the aisle and under the sign. Vale's red car is in Vine Alley with its lights off."

**Phone.** The prompt shot is a single-vanishing-point corridor: the gap at x −5.3 and the rope at x 5.4 at 6 units are 40° apart, inside the 66° field with margin; the cart on the centre line is a 12-column block at phone width when it is 10 units away and grows to 40 as it arrives. `THE FILAMENT` (12 characters) sits at the vanishing point and reads at both widths. `QUILL` and `KRANE` never share rows with the markers.

**Telegraph.** The slope is visible from the entry (the deck's ceiling closes toward the sign); the cart sits on the centre line in the entry frame; in `marketDanger` it tips; in the prompt its lamps come straight at the camera. The left gap has been the one gap on the left row with a lamp over it since the entry; the rope hangs from the awning under `[2]` and the awning tops on the right are a continuous ledge leading toward the door Krane runs for. Nothing on the centre line takes a marker.

---

## 05 The Filament (existing)

**Purpose.** Vale in his booth; Krane's bottle; duck (Vale gets away clean) or vault the bar (the chip with the lot numbers).

**Set (as built).** 24 × 26 × 6, `carpet`, `velvet` and `brick` walls, the bar at x 8..11.5 z 4..12 with `neon` strips and `glass` bottles, the stage with a `neon` header, five candle tables with pools, wall neon, `screen`s, Vale's booth, four pillars, the back `door` at x 11.7..12 z 17..19, three pendants. Labels `THE FILAMENT`, `NO EXIT`, `VALE`, `[1]`, `[2]`.

Additions: Vale's red `car` hue 3 outside the back door, seen through it when it opens in the result (a `car` at (14, 0, 18.5) beyond a `gap` quad); a `VINE ALLEY` `sign` plate over the door outside; Krane's name label `KRANE` hue 0 over the guard sprite (already `who: 'krane'` in the parallel sprite work).

**Camera.** Dolly in `look(−9, 2.2, −3 → 2, 1.5, 12)` → 8 s `look(−1.5, 1.7, 5 → 3, 1.3, 13)` (keep). Cut-route entry (Rook comes in by the back): `sceneStart look(11, 2.0, 20.5 → 2, 1.4, 8)` → 8 s to the same `look(−1.5, 1.7, 5 → 3, 1.3, 13)` through the booth end of the room, so the prompt frame is shared. `clubFace`: keep the 2 s crane to `look(−4, 4.8, 4 → 7, 1.2, 13)`: from above, Vale's face turning and Krane's arm are both in frame, and the crane is the club's signature shot. `clubQte` `look(−2.5, 1.3, 7.5 → 6.5, 1.5, 12)` (keep: fixed on the bar from Rook's side, booth at the far end). `clubResult` `look(2, 2.3, 8 → 9.5, 1.3, 16)` (keep; on vault the chips scatter as lamp glyphs).

**Blocking (as built).** Rook (−1, −2) → (.5, 9), `crouch` for duck, vault to (7.4, 12.4) `reach`; on the cut route Rook (10.5, 17.5) → (.5, 9) past the booth. Vale (9, 14) → (11, 18); Krane `stumble` lean −.4 at (6.5, 11); four patrons and a singer.

**Exit / entry.** Entry: the front door (−9, 0, −3.5) or the back door (11.85, 0, 18). Exit point (11.85, 1.8, 18); line to 06: "Out the back door and into the patrol car in Vine Alley. Vale's tail lights are already moving."

**Phone.** In the prompt shot `[1]` (over Rook at y 1.85) shares rows with `VALE` and the `NO EXIT` neon: three labels in one 10-column patch. Hide `VALE` during `clubQte` and raise `NO EXIT` to (11.6, 5.3, 16.5).

**Telegraph.** Krane's `stumble` with negative lean is the throw; the bottle is a `glass` box crossing the frame; the bar top is the only flat lit surface between Rook and Vale, under `[2]`; the floor under `[1]`. Raise the bottle's arc peak from 1.6 to 2.3 so it passes through the rows of `[1]` and the duck reads as ducking under something. S.

**Changes.** (a) Two more pendants and a `cable` over the tables (the entry ceiling is bare): S. (b) Label fixes: S. (c) A `neon` hue 3 spot pendant over the stage at (0, 5, 18.5): S. (d) The car through the back door: S.

---

## 06 Elevated Road (existing)

**Purpose.** The car chase: the freight carrier; the lifting bridge; jump the gap (Vale stopped at the basin exit under the substation's windows) or the ramp (the undercity).

**Set (as built).** `express` deck x −7..7, `barrier` edges, lamp posts every 24 z, city rows at x −24 and 15, gantries every 80 z, `water` 15 below. Cars: Rook cyan, Vale rose, three traffic cars, the freight carrier, the bridge gantry pair with its `barrier` bar; the ramp opens the left rail. Rain. Labels `VALE`, `FREIGHT`, `BRIDGE LIFTING`.

Additions: Substation Nine across the basin. Beyond the bridge, on the water level, a long lit `building` (x 28..68, z bridgeZ+50..+64, h 9, seed chosen for a dense lit row) with a `sign` box on its roof and the label `SUBSTATION 9` hue 1 at (48, −4, bridgeZ+50), plus a `neon` hue 1 strip along its eave; visible in `chaseQteB` and every `chaseFinish` frame, which the sheet asks for.

**Camera.** Start high `look(−7, 9, d−15 → 0, 1, d+16)` → 5 s `look(−.6, 5, d−11 → .3, 1.2, d+13)`; `chaseQteA` behind and slightly above `look(−.6, 3.3, d−11 → .3, 1.2, d+13)` with the carrier filling the left half (see the freight change); `chaseBank` side-tracking `look(−13, 3.5, d−10 → 0, 1.3, d+6)`; `chaseQteB` forward over the roof `look(−.6, 3.3, d−11 → 0, 2.0, d+29)` pitched up 4° so the rising deck is centre and the ramp mouth low left; `chaseFinish` caught: the far side `look(3, 4.5, bridgeZ+30 → 30, −4, bridgeZ+56)`, a 3 s pan from Vale's stopped car to the lit building across the water; not caught: from the raised deck `look(−.6, 3.3, bridgeZ−12 → 20, −4, bridgeZ+60)`. All keep the three-view grammar.

**Blocking.** Cars only. The carrier drifts 0.8 units toward Rook's lane during the entry's last 2 s (the sheet's "FREIGHT label drifting left to right").

**Exit / entry.** Entry: Vine Alley (the camera fades up already high and moving). Exit point (0, 1, camera.z + 40). Lines: to 07 "The service ramp drops away beneath the road."; to 08 "The far span is the Board's approach road. Vale's lights turn in under the substation's windows."

**Phone.** The carrier at 24 units is a smear beside its label in the survey: bring it to d+9 for the prompt and give `car()` a freight body (w 2.2, l 5, h 2.6, a `metal` container instead of the glass cabin). `BRIDGE LIFTING` (14 characters) becomes `BRIDGE UP`.

**Telegraph.** The carrier's drift; the right lane lit and clear under `[2]`; brake lights ahead under `[1]` (the traffic car ahead gets `tail` boxes brightened in `chaseQteA`); the `barrier` bar and, with change (b), the far span rising 1.5 units in the windup; the ramp peeling off left under `[1]` of the second prompt.

**Changes.** (a) Freight body and drift: S. (b) Animate the far span: S. (c) Five traffic cars instead of three: S. (d) The substation building across the basin: S.

---

## 07 The Undercity (existing)

**Purpose.** The drain chase; the fork under the canal gate; follow right (needs a short gap) or cut left along the maintenance channel (needs the radio). Every outcome ends at the basin under Substation Nine's windows.

**Set (as built).** `drain` floor (pools available but the set has no `lamp` entries, so none appear), `water` gutters, `sewer` walls, `sewer` ceiling, `pipe` runs, `neon` strips, `grate`s. The fork: a `brick` pier with a `highway-sign`, and a `grate` gate on the failed shortcut. Labels `VALE`, `[1]`, `[2]`, `CANAL GATE`.

Additions: the `MAINT` stencil, a label hue 1 at (−4.4, 5.2, fork−1) beside `[2]` from `tunnelQte`; the basin at the finish: at the finish distance the right wall opens for 30 units onto a `water` floor at −.35 and the lit substation `building` (x 30..70, z finish+20..+34, h 9) with its `SUBSTATION 9` label, so the finish shot has the basin in every variant.

**Camera (as built, keep).** From behind `look(−.5, 2.4, d−10 → 0, 1, d+14)`; `tunnelQte` from the left wall `look(−6, 2.4, d−9 → .5, 1, d+12)`; `tunnelFinish` caught: head-on reverse `look(2, 3.2, d+24 → −.5, 1, d−2)` then a 2 s pan right to the opening and the basin; not caught: `look(−.5, 2.6, d−8 → 12, 1, d+30)` toward the opening.

**Exit / entry.** Entry: the ramp's foot. Exit point (0, 1, camera.z + 40); line to 08: "The outfall opens onto the basin. Above it, every window of Substation Nine is lit at one in the morning."

**Phone.** The darkest set at both widths (walls at .36 to .5 luminance). `CANAL GATE` loses its first letters to the sign face it sits on (change 2).

**Telegraph.** The pier splits the frame into two mouths; Vale's tail lights bend right under the gate; the left mouth carries the `MAINT` stencil and, when the radio tip is held, a `lamp` hue 2 cage light at (−5, 4.5, fork+6) (the lit channel): S.

**Changes.** (a) Service cage lights `lamp` hue 2 at x ±7.1, y 4.6, every 40 z, pushed to `lamps`: amber pools alternating with the neon: S. (b) `sewer` luminance +.1 and a `pipe` hue 2 conduit at y 6.2 on both walls: S. (c) A `brick` arch every 60 z: S. (d) The basin opening at the finish: M.

---

## 08 Substation Nine (new)

**Purpose.** The Lumen Board's battery hall on the canal basin, lit end to end: racks of reserve cells, chained on the left and loose on the right, a Board van backed up to the loading door and loaders who are not engineers. The manifest on the nearest loose rack carries the countersignature. Krane heaves the rack over onto Rook: dive clear (Krane pinned, the manifest burns) or pull the breaker at Rook's shoulder (the hall goes dark, the manifest saved, Krane gone).

**Set.** 30 × 60 × 12: x −15..15, z −10..50, ceiling 12.

- Floor `paving` hue 0 (pools). Walls `brick` hue 0 at x ±15; near wall z −10 with the hall door (a `door` box 2.4 wide at x −1.2..1.2, the entry); back wall z 50 with the loading door: a roller `hatch` raised to y 4.5..8 over an opening x −3..3, y 0..4.5. `ceiling` at 12 on `metal` trusses every 10 z.
- Racks: four rows at x −9, −3 (left, chained), 3, 9 (right, loose), each 2.0 wide, from z 0 to 40 in five units of 6 long with 2-unit gaps, 4.5 high, material **`cell` (new)**: shelf lines `=` hue 0 every 0.9 in y; dividers `|` every 0.6 along the rack's long axis; cell faces of `#` hue 2 lum 1.0 (charged) or `:` hue 4 lum .25 (drained) by hash of (shelf, bay, seed); a `-` hue 1 line at the top of each cell (the gauge). Fallback: `console` stacked in 1.3-high boxes (loses the grid). The material is worth its line count because the racks are most of every frame.
- Rails: two `metal` rails under each row along its full length; `rubber` wheel blocks at unit corners. Left rows: `cable` quads wrapped around each unit at y 1.6 and 3.2 with a `metal` padlock box, and the units flush on their rails. Right rows: no chains; units offset 0.6 along z from each other so they read as loose. The nearest right unit (x 2..4, z 36..42) is the one Krane heaves.
- Gantries at z 12 and z 30: `grate` walkways x −14..14 at y 7..7.3, `metal` beams and handrails, a rung ladder at x −13.5. `pendant`s at x 0, z 6, 18, 30, 42 (y 9): four warm pools on the centre aisle.
- The breaker: a `console` hue 1 post 0.6 × 3.4 × 0.8 at (0.9..1.5, 0..3.4, 36.6..37.4) on the centre aisle's right edge, just short of the loose rack, with a `metal` lever 0.15 × 1.3 standing up from its top (handle up) and a `lamp` hue 2 knob: the only amber knob in the hall. `pipe` hue 2 bus bars run from its top along the right wall at y 6.
- Emergency: a `neon` hue 3 strip at y 11 along both side walls, present as `metal` (unlit) until the breaker result, then swapped to `neon`.
- The van: `car` large body hue 4 (the Board's blue) with a `metal` container box, backed up to the loading door on the dock beyond it at (0, −1.2, 56) facing +z; the dock `road` at y −1.2, x −12..12, z 50..70 with a `barrier` edge; beyond it the basin `water` at −2.4 and, 12 units past the door, the **`dawn`** sky quad x −40..40, y −3..30, z 62 (black at entry, grey at `subDawn`). The patrol car (when `caught`) at the dock kerb (−7, −1.2, 57) with Vale `stand` at `y: −.8` inside it (head and shoulders above the body: sitting in the back).
- Manifest: a `paper` hue 6 clipboard box 0.35 × 0.45 × 0.03 clipped to the loose rack's aisle face at (1.98, 2.3, 38.4); label `MANIFEST` hue 6 during `subManifest`; after the dive and late results its material becomes `tail` (rose `#`: burning), after the breaker it moves to Rook's hand.
- Loaders: three sprites hue 0 `walk` between the loose racks and the van; Krane hue 0, `y: .3`, at the van in the entry, at the loose rack's far side (4.8, 40) from `subManifest`.
- Rain: none inside; the door frames the basin without it.
- Far background: the dawn quad and, on the basin's far shore, `cityRow(40, 100, 18, 30, 30)` seen through the door, 40 to 60 units off.
- Labels: `SUBSTATION 9` hue 1 at (0, 10.2, 49.5); `LOADING` hue 2 over the door at (0, 8.6, 50); `KRANE` hue 0; `MANIFEST`; `[1]` at (−1.8, 2.3, 41.5) over the open floor of the centre aisle left of the rack's fall; `[2]` at (1.2, 3.9, 37) over the breaker knob. `VALE` hue 3 over the patrol car in `subDawn` when caught.

**Camera (Act 3).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| Establishing (from the road or the drain) | `sceneStart look(0, 8.5, −16 → 0, 2, 20)` | fade-up | High at the hall door, moving forward: the chase exits glided straight ahead. |
| `subEntry` | → `look(0.4, 5.5, −4 → 0, 1.6, 44)` | 8 s | Down the length of the racks to the van in the open door at the far end; chained rows left, loose right; the gantries cross the frame. |
| `subManifest` | → `look(−.6, 1.6, 34.5 → 2.0, 2.3, 38.4)` for 3 s, then → `look(−.2, 1.8, 35 → 4.8, 1.9, 44)` | 6 s | Close on the clipboard, the two signatures the caption reads; then a rack move right to Krane at the van. |
| `subDanger` | cut to `look(−2.5, 1.0, 34 → 3, 2.4, 41)` | 2 s | Low and wide behind Rook: the rack's top edge leaving vertical across the top of the frame, the breaker post and knob at the right edge in the near foreground. |
| `subQte` | hold | window | Fixed low and wide: the rack tilting (rotated about its far base edge at x 4, z 36..42, from 0° to 55° across the window), the breaker right, the open aisle left under `[1]`. |
| `subResult` dive | hold; the rack completes to 90° in 0.6 s | 5 s | The rack flat across the aisle with Krane's sprite under its far edge; `arc` flashes on the cells; the clipboard turns rose and curls (its box shrinks); the loaders run out of frame right. |
| `subResult` breaker | hold; `lamps` emptied, the strips turn `neon` hue 3; the rack lands dead | 5 s | The picture drops to red strips, console faces and the van's tail lights leaving through the door; the clipboard is in Rook's hand. |
| `subResult` late | hold; the rack lands on Rook | 5 s | Rook `stumble` under its edge at `y: −.4`; arcs; the van's doors slam (its boxes move 6 units out). |
| `subDawn` | → `look(0, 2.4, 42 → 0, 4, 66)` | 5 s | Through the loading door to the basin, the patrol car at the kerb when Vale is caught, the `dawn` quad from .0 to .35. |
| Exit | glide toward the loading door | 1.4 s | Out to the dock. |

**Blocking.** Entry: Rook `walk` (0, −8) → (0, 30); loaders `walk` between (4, 44) and the van; Krane `stand` at the van (2, −1.2, 53). Manifest: Rook `read` at (0.2, 38) facing the rack; Krane `walk` (2, 53) → (4.8, 40) behind the rack. Danger and prompt: Rook `watch` at (0.4, 39.5), lean .1 toward the rack; Krane `reach` at (4.9, 40), `y: .3`. Dive: Rook `walk` → (−1.6, 41.5) `crouch`; Krane `stumble` at (4.6, 41), `y: −.3`, lean .4 (a leg under the edge). Breaker: Rook `reach` at (0.9, 38) toward the lever, then `stand` with the clipboard box at his hand; Krane and the loaders `walk` out through the door in the dark. Late: Rook `stumble` at (0.8, 41), `y: −.4`; Krane `walk` to the van. `subDawn`: Rook `walk` (0.6, 41) → (0, 49) toward the door; Vale in the patrol car when caught.

**Exit / entry.** Entry point (0, 0, −8), the hall door (all routes arrive by the road round the basin, as the sheet's entry caption frames it). Exit point (0, 1.5, 50), the loading door. Line to 09: "Rook walks out past the empty dock. Night Division, before the floor wakes up." (caught: "Vale watches from the back of the patrol car. Night Division, before the floor wakes up.")

**Phone.** The entry crane at 84 columns: the rows are 2-column stripes of amber cells, the van a 6-column block in the door at 54 units (inside the `#` threshold only just; keep it at z 56, no farther). The prompt shot is fixed and wide: `[1]` at x −1.8 and `[2]` at x 1.2 are 18° apart at 6 to 8 units; the rack's tilt covers the top rows. `SUBSTATION 9` (12 characters) appears in the entry only. The arc must span 3 units to be a 6-column patch at phone width.

**Telegraph.** The right rows have been visibly loose (offset, unchained) since the entry crane, and Marta said so; Krane goes behind the nearest one in `subManifest`; in the windup its top edge leaves vertical. The breaker post with the only amber knob in the hall has stood at Rook's right since the manifest close-up, handle up, under `[2]`. The open aisle to the left is the only floor without a rack shadow, under `[1]`. Nothing in the picture suggests holding the rack.

---

## 09 Night Division, dawn (new)

**Purpose.** The interrogation room next to Vale's own office, 05:50. Across the table: Vale if caught, Krane if pinned and Vale free, Bell on the stay route, nobody otherwise. The evidence in a row under the lamp; the player decides who signed (deduction 3); the corridor window behind Rook goes from grey to gold.

**Set.** Room 7 × 8 × 3.6 (x −3.5..3.5, z 0..8) plus a corridor.

- Floor `drain` hue 7 (grey concrete with a centre seam; pools). Walls `brick` hue 0. `ceiling`. The front wall z 0 in two `brick` boxes leaving a door gap x −1.2..0.4 (1.6 wide) with the `door` hinged open against the corridor wall. The corridor: `drain` floor x −4..4, z −13..0, `brick` walls at x ±4, `ceiling` at 3.6; at its end the corridor window: a `metal` frame at z −12.95, x −1.2..1.2, y 1.0..3.0 with two bars, and behind it at z −13.4 a **`dawn`** quad x −6..6, y −1..8. **New material `dawn`**: `u = state.dawn`; `u < .3`: hue 4, lum .12 + u, `.`; `< .6`: hue 4, lum .45, `:`; `< .85`: hue 6, lum .75, `=`; else hue 2, lum 1.0, `#` (gold). `state.dawn` is set by the case code: 0 at `subDawn` entry rising to .35 by its end; .35 at `roomEntry`; .6 at `roomDeduce`; 1 during `roomName`'s last 4 s. It is not saved; a resume re-enters the phase and sets it again. Fallback: a `blind` hue 4 quad, which loses the point.
- Table `metal` (−1.2, .9, 3.4)–(1.2, .98, 4.6) on four legs; two `metal` chairs at z 2.6 and z 5.4; Rook's chair with a `wood` hue 2 coat box over its back. On the table only what the route recovered, in a row under the lamp from left to right: the ledger (`dispatch` 0.6 × 0.06 × 0.4 at (−.85, .98, 4.0)) when `ledger`; the manifest (`paper` 0.35 × 0.03 × 0.45 at (−.3, .98, 4.0)) when `manifest`; the chip (`lamp` hue 2 0.12 cube at (.2, .98, 3.9)) when `chip`; the desk order (`paper` 0.5 × 0.02 × 0.35 at (.7, .98, 4.0)) always. Rook's file `paper` at the near edge.
- The one lamp: `pendant(0, 4, 2.6)` (`lamps.push([0, 4])`): a pool on the table and the two sitters, nothing else.
- One-way window: the left wall x −3.45, z 2..6, y 1.1..2.6, `glass` hue 0 with a `metal` frame (opaque, dim `/` glyphs: a mirror from this side). A `screen` hue 1 recorder beside it at z 6.4 (cyan scanlines: recording).
- Vale's office is across the corridor: a `hatch` door at (3.95, 0..3.2, −8..−5.6) on the corridor's right wall, dark, label `VALE` hue 0 in `roomEntry` (the caption says it has been cleared out on the empty route).
- Labels: `INTERVIEW 2` hue 1 over the door in `roomEntry`; `VALE` hue 3 / `KRANE` hue 0 / `BELL` hue 2 over the sitter; in `roomDeduce`, `LEDGER`, `MANIFEST`, `CHIP`, `ORDER 7731` in hue 6 over the items present, at alternating heights 1.35 and 1.6. No markers.

**Camera (Act 3).**

| Beat | Shot | Time | Why |
| --- | --- | --- | --- |
| Establishing (from the loading door) | `sceneStart look(−.4, 1.7, −5 → −.2, 1.2, 5)` | fade-up | In the corridor, walking toward the lit doorway; the dock exit glided forward, so does this. |
| `roomEntry` | → `look(−.3, 1.6, −2.4 → −.2, 1.1, 5)` for 4 s, then → `look(−.3, 1.6, 0.8 → 0, 1.1, 5.2)` | 7 s | Through the door into the small bright room: the table, the sitter, the pool; the door is 1.6 wide at 2.4 units, a 37° window, so the room fills the frame before we are inside. |
| `roomDeduce` | → `look(0.2, 2.3, 2.0 → 0, .95, 4.1)` | 5 s then hold | Down onto the row of evidence under the lamp: each item a lit block with its label; the sitter's hands at the top of frame. |
| `roomDeduce` wrong pick | hold; the sitter's lean resets | 0 s | The picture does not change; the caption does. |
| `roomName` | → `look(0.6, 1.4, 6.4 → −.2, 1.5, −13)` | 6 s then hold | From the sitter's side: Rook in the near-mid, the open door behind him, the corridor and its window at the end going from grey to gold. The last camera move of the case; it stops here. |
| Exit | glide toward the door | 1.4 s | Into the corridor. |

**Blocking.** Rook `read` at (0, 2.7), seated (`y: −.9`, the office trick), facing +z. The sitter `stand` seated at (0, 5.3), `y: −.9`, facing −z: Vale hue 3, Krane hue 0 (with a `metal` splint box at his leg), or Bell hue 2 in a `paper` blanket. During `roomDeduce` the sitter's `lean` is .25 away from the correct answer's evidence (Vale leans from the ledger and manifest; nobody leans on the no-proof routes, which is itself the tell); it resets after a wrong pick and returns after 2 s. Empty-room variant: Rook alone, the far chair empty, the pool on the empty side of the table.

**Exit / entry.** Entry point (−.4, 0, −6), the corridor. Exit point (−.4, 1.3, −0.2), the door into the corridor, the window at its end showing first light. Line to 10: "The floor is waking up. Rook signs the sheet and drives to the canal, where Bell is waiting."

**Phone.** `roomDeduce` at 84 columns: the table 30 columns wide at 2.4 units, each item 3 to 6 cells, four labels of 4 to 10 characters at two heights: fits. The corridor window in `roomName` at 19 units is a 9-column slot; its glyph goes `.` → `:` → `=` → `#`, which reads even in a slot that small because it is the only thing in that part of the frame.

**Telegraph.** No timed prompt. The deduction's picture is presence and absence under the lamp: the ledger and the manifest are the documents with a second hand on them, and they are on the table only when the player kept them. The sitter's lean is the tell. The corridor's dawn is the case's clock: the player is told by the window, not the interface, that this is the last question.

---

## 10 Canal at first light (existing)

**Purpose.** The ending: Rook, Bell, the medic, Nell if kept, Vale in custody if caught; the water goes from black to grey; the lamps along the canal go out one after another because the sun has cleared the towers.

**Set (as built).** `water` x −45..−4 at −1.6, `paving` bank x −4..25, the quay wall, lamp posts at x −3.3 every 12 z (pools on the paving only until change 1), city rows at x 14 and −39, the bridge at z 49..54, two barges, a bench, the medic van (`tram` hue 6) at x 7..11 z 24..30. Rain. Label `CITY MEDIC`.

Additions: the sky: a `dawn` quad x −70..70, y 0..40 at z 58, behind the bridge and in front of the far row's fog limit, `state.dawn` .5 at `canalEntry` rising to 1 through `canalEnd`; the `water` material takes `+ state.dawn × .2` luminance so the water goes from black to grey; the medic `stand` hue 2 at (7.6, 22) by the van's door; a barge moored near the camera at (−9, 8) with a cabin `lamp` (a pool on the water after change 1).

**Camera.** Start `look(8, 2.3, 7 → 3, 1, 15)`, entry 7 s to `look(−1.2, 3.1, 5 → 3, 1.5, 15)` (keep). `canalEnd`: a 10 s crane back and up to `look(−6, 5.5, −2 → 2, 1.2, 20)` that ends still, the near lamp post at the frame's left foreground at 4 units, the bridge and the city row in the top half; over the last 6 s the lamp posts' `lamp` boxes are swapped to `metal` from far to near and the `lamps` list emptied in the same order, so the pools go out one after another while the sky quad goes to gold.

**Blocking (as built, plus).** Rook `watch` (2, 14); Bell `stand` (3.4, 15.2); Nell (4.8, 16.5); Vale hue 3 (6.2, 19.2) when caught; the medic at the van.

**Exit / entry.** Entry point (8, 0, 6), the quay road. No exit point; for previews and the menu the camera rests on the water at the end shot.

**Phone.** The built end frame has the group at 10 to 12 units (6 rows) and 55 percent water; the crane-back keeps the group at that size but puts the lamp post, the bridge and the sky in the frame, and change 1 puts light on the water.

**Telegraph.** No prompt.

**Changes.** (a) Change 1 (pools on `water`). (b) The barge, the medic, the van moved to x 5..9, z 19..25: S. (c) The sky quad and the water's dawn term: S (with the `dawn` material). (d) The lamps-out crane: M.

---

## Transition lines (every edge in the flow)

| From → to | Exit point | Line |
| --- | --- | --- |
| 00 → 01 | stairwell door (−21.5, 1.5, −8.5) | "Rook takes the stairs down to Station Road. The rain has not let up." |
| 01 → 02 | hatch (−4.9, 1.3, 38.7) | "Three knocks, or a shoulder. Either way, the hatch gives." |
| 01 → 01b | stair landing (−7.4, 4.2, 10.2) | "Up the iron stair. Bell's window is the one with the light on." |
| 01b → 02 | window (0, 1.9, 7.05) | "Down the stair and along the rails to the station's service hatch. Bell's job is still open." |
| 02 → 03 | hatch (0, 2, 43.8) | "Down the service ladder, toward the knocking." |
| 03 → 04 | stair (6.15, 5, 31.1) | "Up the service stair, Bell's arm over Rook's shoulder." |
| 04 → 04b | lift cage (−9.5, 1.5, 3.1) | "Down the service lift. The last tram is passing under it, and Rook does not wait for the doors." |
| 04 → 09 | lift cage | "Rook stays. The medic's van takes them both to Night Division, where the statement is written before dawn." |
| 04b → 05a | front rail (1.35, 3.6, z+12) | "Over the rail and down onto the arch. The market's light is stolen light, and it is on." |
| 05a → 05 | under the sign (0, yAt(46)+2.5, 46) | "Up the aisle and under the sign. Vale's red car is in Vine Alley with its lights off." |
| 05 → 06 | back door (11.85, 1.8, 18) | "Out the back door and into the patrol car in Vine Alley. Vale's tail lights are already moving." |
| 06 → 07 | ahead (0, 1, z+40) | "The service ramp drops away beneath the road." |
| 06 → 08 | ahead | "The far span is the Board's approach road. Vale's lights turn in under the substation's windows." |
| 07 → 08 | ahead | "The outfall opens onto the basin. Above it, every window of Substation Nine is lit at one in the morning." |
| 08 → 09 | loading door (0, 1.5, 50) | "Rook walks out past the empty dock. Night Division, before the floor wakes up." / caught variant above |
| 09 → 10 | door (−.4, 1.3, −0.2) | "The floor is waking up. Rook signs the sheet and drives to the canal, where Bell is waiting." |

---

## Recommended changes to the existing sets (summary with cost)

S = under an hour, M = half a day, L = a day or more. All are edits in `src/`; none touch `reference/`; none change the street's static geometry or its first frame.

1. **Lamp pools on `tiles`, `roof` and `water`** (`materials.js`): the pool loop the `plank/carpet/drain` branch uses; for `water`, mixed into the ripple (hue 2, `=` on crests). Fixes the concourse floor, the rooftop floor, the pump-room water and the canal at once. S. Highest value of anything here.
2. **Labels drawn in front of their surface** (`worldLabel` depth `v.z − .6`; callers place labels 0.4 to 0.6 above objects). Fixes `CANAL GATE`, `PUMP ROOM 4`, `NO EXIT`. S.
3. **Pump `[1]`/`INLET` placement**, the joint drop, the satchel and the ledger prop (03). S.
4. **Club labels during the prompt, bottle arc 2.3, the car through the back door, cut-route entry** (05). S.
5. **Freight body, lane drift, far span rising, five traffic cars, the substation across the basin** (06). S each.
6. **Undercity cage lights, brighter sewer, arches, `MAINT` label, basin opening at the finish** (07). M.
7. **Concourse: lower crane, roof glass, departures board, carts, the order and reels, larger hatch sign, listen tilt, ready pan** (02). M.
8. **Rooftop: floor furniture, the westward view props (road, tram, market glow, club neon), raised traffic, parapet crane, `RADIO` label** (04). M.
9. **Canal: sky quad, water dawn term, barge, medic, van moved, lamps-out crane** (10). M.
10. **Office: corridor with dark desks, Vale's dark door, the stairwell door and exit point, two photographs, board beat shots, board luminance, Bell's lantern** (00). M.
11. **Street per-frame props by phase: the red car (with a `dark` flag on `car()`), the gutter lantern, the depot door, stair, landing and lit window; the deduce and loft-turn shots** (01). S each; the first frame is unchanged.
12. **Rain list** (`runtime.js`): `loft` (z > 7.2 only), `tram`, `market` (|x| > 9 or z > 42). S.
13. **Scene reel and previews**: LOFT, TRAM, MARKET, SUBSTATION, INTERVIEW buttons with preview state, `sceneDescriptions` and chapter titles for each. S.
14. **`moving()` and `sceneFor()`** include `tram`; `substation` and `room` are static. S.

New materials, in priority order: `cell` (the substation's racks), `dawn` (the substation door, the corridor window, the canal sky), `map` (the loft's clue), `arc` (one quad, four glyphs; ships as `neon` hue 6 if cut). Four materials for four new sets, each the thing its set is about.

---

## Notes and decisions

- **Survey.** All nine built sets were run through the scene reel in Chromium at 1024 and 375 CSS pixels (180 and 84 columns) with canvas screenshots at entry, at the settled shot, at each prompt and at each result. What read well: the street; the club's bar and crowd; the elevated road from every angle; the concourse's pendant row; the pump room's tanks and wheel; the city rows through the office window; any facade grid. What did not: the concourse crane (actors 3 rows over a dot field), the rooftop's quiet shot (bare floor), the undercity (walls at .36 luminance), the canal's water, the freight carrier at 24 units, and three label collisions (`[1]` above `INLET`, `[1]` on `VALE`/`NO EXIT`, `CANAL GATE` on its sign). The density rules and change 1 come from these frames.
- **The beat sheet arrived while this document was being written.** It is binding on what happens. This document was aligned to it: the loft has no prompt (the producer's roster had none either; an earlier draft of this document added footsteps on the stair, dropped here); the tram is the cutscene bridge the sheet describes and not a prompt set; the market's danger is Krane's cart, not a tram; the substation's danger is the rack and the breaker, not an arc across the aisle; the stay route goes to the room; Substation Nine is entered by the hall door on every route. Two things the sheet leaves open were decided here: the office corridor exists as geometry (the sheet's exit point needs it), and the interrogation room's evidence labels are `LEDGER`, `MANIFEST`, `CHIP`, `ORDER 7731`.
- **Numbering** follows the sheet: 04b plays between 04 and 05a, 05a before 05. The producer's two 08s are resolved as the sheet resolves them: Substation Nine 08, the room 09, the canal 10.
- **A ninth prompt, if wanted.** The sheet's tram is quiet. If the count needs to rise, the cheapest prompt is on the tram: the bridge bell at Market Arch, `[1] DOWN THE LADDER` (to the roof rail's ladder at the tram's rear) or `[2] HOLD ON` as the tram takes the arch curve; a miss leaves Rook on the roof past the halt and costs 2 seconds at the market. It reuses the set as built here; only the beat sheet would need the entry.
- **Materials.** Every object above uses an existing material except `cell`, `dawn`, `map` and `arc`. Where an existing material fights a set (the `tiles` amber runner, `plank`'s fixed warm hue, `poster`'s fixed hue, `door`'s fixed amber), the set uses another material rather than asking for a parameter: the interrogation room's floor is `drain`, Vale's dark doors are `hatch`.
- **Characters.** No new poses. The arrest and the rescue use `support`; the lever and the rope use `reach`; seated sitters and a man in the back of a car use a negative `y`; Krane's height is a positive `y`; the lean field carries the interrogation tell, Krane's throw and the cart's hit. The parallel sprite work (`src/game/sprites.js`, the `who` field) can give Krane, Marta and the loaders their own sheets without changing any position here.
- **The one fast move in Act 1** is the rooftop crane over the parapet. It is a look at where Vale is going, which the pursue/stay choice needs, and it moves while Rook stands still.
- **Phone target.** The survey ran at 84 columns (375 px less padding). At the brief's 76 columns the glyph size is the same (`resize()` fixes the cell at about 4.2 px) and the horizontal field is the same 66°, so the same picture is drawn across 10 percent fewer cells: what reads at 84 by a margin reads at 76; a label that just fits at 84 does not. Every label here is 12 characters or fewer and every prompt shot keeps both markers within 25° of the axis.
- **Verification while building.** Each new set should be checked the way the survey was made: drive the reel in Chromium at 1024 and 375 wide, screenshot the canvas at entry, settled, prompt and result, and read the frames against the five density rules before the set is called done. The regression check covers only the street's first frame.
