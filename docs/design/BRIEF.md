# The Last Light: creative brief

This is the shared brief for the design team. Everything designed for the game must fit it. Where the brief is silent, the north star decides.

## North star

**Dragon's Lair + choose your own adventure, in a cyberpunk noir city, told as a mystery thriller.**

- *Dragon's Lair*: every location is a short, continuous, cinematic animated sequence with one clear physical danger and one clear move. The picture tells the player the move before the labels do. A miss has a visible consequence. The player has three rewinds per case (our lives). Reactions are graded.
- *Choose your own adventure*: quiet choices branch the route. Branches have consequences that echo later (evidence recovered, witnesses kept, time gained or lost). There are several endings and many discoveries, tracked in persistent records, so the case is replayed.
- *Cyberpunk noir*: a rain-soaked city on rationed power. Towers uptown blaze; the low districts go dark at night and lamplighters walk routes switching on reserve-battery lamps by hand. Neon, velvet, storm drains, elevated roads, flying traffic between towers, radio static, a police division that is part of the problem.
- *Mystery thriller*: the player assembles the truth from evidence and witnesses. The case file (route, persons of interest, evidence) is the player's board. Every location adds at least one clue or inference. The antagonist is seeded early and revealed in stages.

## The spine (what is true in the world)

- The city is **Halvard**. Power is rationed by the **Lumen Board**, the grid authority. Uptown towers buy priority. The low districts around **North Station** run on reserve batteries each night, switched on lamp by lamp by the **lamplighters**.
- **Ivo Bell**, senior lamplighter of the station route, discovered that the reserve batteries were being sold: a signed **battery-transfer ledger** moves them through **The Filament**, a club, to uptown buyers. He kept the ledger in his satchel.
- **Inspector Aurel Vale** of the **Night Division** (Rook's own division) runs the sales for the Board's people. When Bell confronted him, Vale locked Bell in **Pump Room 4** beneath the closed station and left the flood to do the rest.
- **Nell Marrow**, Bell's apprentice, guessed Vale was involved. She forged a maintenance call to bring Bell to the station on the record, hoping to expose Vale, not foreseeing the trap. She now walks Bell's route with his lantern so the street does not go dark, and she is looking for him.
- **Detective Rook** works the Night Division's missing-persons desk. Rook is the last honest light on that floor and does not yet know the rot is in the office next door.
- The first light of morning ends every case: the lamps go dark because day has come, not because the power is gone.

## Current game (what already exists and is approved)

Sets: `00 Night Division office` (prologue cutscene), `01 Station Road` (street, the courier and the dispatch book), `02 North Station concourse` (maintenance desk and tape), `03 Pump Room 4` (flooded machinery, Bell's rescue), `04 Rooftop` (medic, radio, the decision to pursue), `05 The Filament` (club, bottle-throw), `06 Elevated Road` (chase, lane change, lifting bridge), `07 The Undercity` (storm-drain chase, the fork), `08 Canal at first light` (ending).

Prompts (quick-time, two moves, timed): courier stumble, pump inlet, bottle, freight carrier, lifting bridge, drain fork. Quiet choices: watch or follow, read the tape or follow the knocking, connect the clue (a deduction with one right answer), pursue or stay, ask Nell. Endings: five. Discoveries: twelve.

The art, camera work and interface are approved and stay. The content is what we are building.

## Hard constraints (engine and format)

- Everything drawn is printable ASCII (codes 32 to 126). No emoji, no box drawing.
- Sets are built from boxes, quads and ellipsoids with a fixed material list: road, paving, building, tower, leaves, lamp, door, tram, awning, kiosk, sign, bark, wood, rubber, cable, metal, stone, dispatch, hatch, tiles, wall, brick, column, ceiling, water, tank, pipe, grate, console, poster, roof, vent, express, barrier, highway-sign, car, glass, tail, gap, plank, carpet, drain, blind, board, paper, screen, neon, velvet, sewer. New materials are possible but each costs work; prefer the list.
- Characters are text sprites, 9 to 11 columns by 10 to 11 rows, projected into the scene at any distance. Facial detail glyphs are only `o`, `.` and `>`. Poses today: watch, walk, stand, stumble, reach, support, read, crouch. Characters have a hue and can lean.
- Cars exist (a compact and a large freight body). Lamps light floors within a pool. Rain falls in outdoor sets. Neon flickers. Labels can be placed at world points (used for `[1]` and `[2]` markers and names).
- A prompt has exactly two moves, shown as `[1]` and `[2]` in the world and below the scene, a window of 5 to 9 seconds, a windup of 2 seconds with a `GET READY` card, and a missed outcome. A quiet choice has one to three buttons and no timer. A timed observation (8 seconds) can grant a later advantage.
- The interface below the scene shows: chapter title, objective, status/timer, a typed caption (one to three sentences), the choice buttons, the case file (route, persons of interest, evidence) and the records. Chapter cards and stingers are block-letter ASCII.
- Save state is a flat record of small enums, booleans and integers. Every branch is a field. Endings, discoveries, route and score are derived from those fields.
- Scene changes play an exit beat: the camera glides toward the set's exit point while one connecting line types in, then the picture dissolves and the next set fades up. Every set needs an exit point and every transition needs a line.
- Phone width is a first-class target: sets must read at 76 columns.

## What we are designing now

A complete, coherent case: **every location, every beat, every branch, every clue, every ending**, with characters who are consistent from the first frame to the last, and camera work per location that tells the player what matters. Then we build it.

Targets: 12 to 14 locations (the nine existing sets kept and enriched, three to five new), 8 to 10 quick-time prompts, 6 to 8 quiet choices including at least two deductions from evidence, 6 endings, 16 to 20 discoveries, and a case that a first-time player can finish in 20 to 25 minutes and explain afterwards.
