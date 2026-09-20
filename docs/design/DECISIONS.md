# Producer's decisions and build plan

The four design documents (`BEATS.md`, `CHARACTERS.md`, `LOCATIONS.md`, `TECH.md`) were written in parallel against `BRIEF.md`. This page reconciles them where they differ and says what gets built, in what order. Where this page and another document differ, this page wins.

## Reconciliations

1. **The figure above Vale is Halden Ashe, Commissioner of Reserve, Lumen Board.** The beat sheet builds the mystery on the initials H.A. (the ledger's countersignature, the manifest, the dawn deduction), so the Character Director's "Director Maren Coyle" becomes Ashe. The grey coat, the umbrella that never closes, the lit lumen pin and the three lines all carry over; the sprite key `coyle` is renamed `ashe`. Ashe is seen once: standing dry on the dock at Substation Nine in the entry crane, and gone by the manifest beat. He is not arrested tonight; that is the hook for the next case.
2. **Names from the cast bible are used everywhere the beat sheet said "the medic" or "the bridge operator".** Ines Okafor, city medic (green, white cross). Heddy Lasko, Lift Bridge Two, voice only, call sign HALF HOUR; she, not he. Delphine Arlo sings at The Filament and is set dressing this case (her informant beat is optional extra 4). Marta Quill keeps the stall.
3. **Phase ids.** The street keeps its existing ids (`brief`, `watch`, `ready`, `follow`, `danger`, `qte`, `result`, `evidence`, `deduce`, `arrival`) and gains `loftTurn`. The old `ending` phase is removed; a checkpoint saved at `ending` resumes at `arrival`. Every other set uses the beat sheet's ids.
4. **Records migration.** Ending ids `arrest-ledger` and `arrest-word` become `board` and `word` when records are read; `home`, `paper`, `dark` keep their ids; `krane` is new. Discoveries keep their ids.
5. **The tram is built as the beat sheet's quiet bridge**, no prompt. The ninth prompt (the gantry over the tram roof) is optional extra 1 and is not in this build.
6. **The loft deduction costs a rewind on the first wrong answer**, as the beat sheet says. It is the one place a life is lost outside a prompt; if playtests find it harsh, the fallback is `misread` alone.
7. **Materials.** Four new: `cell`, `dawn`, `map`, `arc`, plus the Art Director's change 1 (lamp pools on `tiles`, `roof` and `water`) and change 2 (labels drawn in front of their surface). The `car()` helper gains a `dark` flag (no lamps or tail lights) and a freight body.
8. **Sprites.** The Technical Director's system is in. The sheet thresholds in `CHARACTERS.md` (full from 9 rows) are superseded by `TECH.md` (full from 11); no sheet changes are needed. Bell's `sit` pose is used on the pump walkway and in the interrogation room.
9. **The interrogation room's evidence labels** are `LEDGER`, `MANIFEST`, `CHIP`, `ORDER 7731`, as the Art Director decided.
10. **Roof entry at phone width** hides Rook behind the stair housing for six seconds (Technical Director's finding). Rook's entry path moves to x -6, so he walks clear of the housing from the second second.

## What gets built

Sets, in the order of play: office (extended with the corridor and the board beat), street (per-frame props: the red car, the gutter lantern, the depot stair), **loft** (new), station, pump, roof (the westward view), **tram** (new), **market** (new), club, chase (the substation across the basin), tunnel (the basin opening), **substation** (new), **room** (new), canal (the dawn and the lamps going out).

Story: the full beat sheet, all six endings, all twenty discoveries, the persons-of-interest table, the route table, the eight prompts with their window modifiers, the three deductions, the sixteen transition lines.

## How it gets built

1. **Pipeline first (producer).** A set registry so a set is one file under `src/game/sets/` (build, start shot, shots per phase, blocking, per-frame geometry, labels, exit point, chapter text) and a phase registry so a beat is data (kind, duration, caption, buttons, fields, clue, next, stinger, rewind). The existing case keeps working through the current code while new sets and phases go through the registries. New materials, the save fields, the records migration, the endings, discoveries, persons and route tables, and the flow rewiring (roof to tram, club and chase to the substation, the room before the canal, the loft branch) go in at the same time, by one hand, so the spine is consistent.
2. **Sets in parallel (five agents).** Loft, tram, market, substation, room: each agent builds its module from `LOCATIONS.md` and types its phases from `BEATS.md`, then drives the set in Chromium at 1024 and 375 wide and checks the frames against the density rules before calling it done.
3. **Existing sets (one agent, in parallel with 2).** The Art Director's change list for the nine built sets, in its priority order.
4. **Integration (producer).** Full-case runs on every route in the harness and in Chromium, the reference check, phone frames of every prompt, docs and the README.

## Open questions for the studio head

- The stay route now passes through the interrogation room before the canal; it adds a quiet beat to the short route. Keep, or merge the room's stay captions into one phase?
- Ashe is seen but never confronted. Is that the right amount of him for case one?
- The case is now about 25 minutes on the long route. The brief said 20 to 25.
