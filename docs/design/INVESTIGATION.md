# The Last Light: investigation beats

The owner, after round two: "The intro is super slow and I'm wondering if we could add more low-key scenes in the mix. I feel like we never get the chance to really investigate a crime scene. We are always chasing something or something, never investigating."

Measured: NEW CASE to the first choice is 48 seconds of cutscene (`officeEntry`, `officeFile`, `officeBoard`, `officeWindow`, each held 13 s by the reading rule). Every quiet beat in the case is a two- or three-button choice; nowhere does the player look around a room.

The producer has decided the mechanic and a builder is making it; this sheet is the content. **The investigation beat** (registry kind `investigate`): a quiet, untimed beat in an existing set. The picture shows three to five numbered examine markers (`[1]`..`[5]`, steady amber, at world points like the prompt cues). The player taps a marker, presses its number or clicks its button under the picture; the camera eases to the spot's close shot; the spot's caption plays (chunked, tap to continue); a clue may be added, a story field set, and the marker turns cyan. Any order; a spot may reveal another (`after`); the exit button appears once `need` spots are examined. One saved bitmask per beat keeps what was examined across a resume. What was examined feeds later beats.

Conventions are `BEATS.md`'s: phase ids camelCase and set-prefixed; captions are final wording, present tense, one to two sentences, no exclamation marks; every caption, button label and clue string below is what the engineer types. Spot captions are at most 30 words. Markers are given as `[n] object: (x, y, z)` in the set's world units, with the close shot as `look(x,y,z → tx,ty,tz)`; a spot without a shot holds the beat's base shot. Nothing here adds a prompt, a death or a set.

## 1. The rhythm

The rule after this sheet: **look, choose, act.** Each act opens on an investigation (the player looks), which feeds a quiet choice (the player decides), which sets up the prompt (the player acts). Act 1 gets three investigations because it is the detective half of the case; the pursuit act keeps its pace and gets one optional booth; Act 3 gets the crime scene the chase ends in.

Where the beats go:

- `officeDesk` replaces `officeFile`, `officeBoard` and `officeWindow`. Look (the desk), then the street's choice, then the courier.
- `stationDesk` sits between `stationEntry` and `stationQuiet`. Look (the desk), choose (tape or knocking), act (the inlet).
- `pumpRoom` sits between `pumpResult` and `pumpTruth`. Act (the inlet), then look (the room Bell was locked in), then choose (pursue or stay, on the roof).
- `loftRoom` folds `loftTable` and `loftNote` into one investigation; `loftBoard` (the deduction) and `loftStair` follow it unchanged.
- `subHall` sits between `subResult` and `subDawn`. Act (the rack), look (the hall Ashe watched from), choose (who signed, in the room).
- `clubTable` (optional) sits between `clubResult` and `chaseEntry` on the vault route only.

The whole case by kind, first-time player, long route (Nell caught, tape read, radio heard, pursuit, jump). Allowances, not measurements: a quiet choice 20 s (read, decide), an observation 8, a windup 2, a prompt 2.5, a cutscene or result its reading hold from `PLAYTEST.md`'s table, a transition 4, an investigation 75 (the player paces it; 60 to 90). A bot closes today's long route in 370 s; a person takes about twice that.

| Set | Beats after this sheet (kind: seconds) | Before | After |
| --- | --- | --- | --- |
| 00 office | officeEntry (cutscene 6), **officeDesk (investigate 75)** | 48 | 81 |
| 01 street | brief (quiet 20), watch (observe 8), ready (quiet 20), follow (cutscene 10), danger (windup 2), qte (prompt 2.5), result (result 6), evidence (quiet 20), deduce (quiet 20), arrival (cutscene 5) | 114 | 114 |
| 02 station | stationEntry (cutscene 7), **stationDesk (investigate 75)**, stationQuiet (quiet 20), stationListen (observe 8), stationReady (quiet 20) | 55 | 130 |
| 03 pump | pumpEntry (cutscene 8), pumpFind (quiet 20), pumpDanger (windup 2), pumpQte (prompt 2.5), pumpResult (result 6), **pumpRoom (investigate 75)**, pumpTruth (quiet 20) | 59 | 134 |
| 04 roof | roofEntry (cutscene 9), roofQuiet (quiet 20), roofListen (observe 8), roofSignal (quiet 20), roofConfession (quiet 20) | 77 | 77 |
| 04b tram | tramEntry (cutscene 12), tramRide (quiet 20), tramWatch (observe 8), tramSpotted (quiet 20), tramArrive (cutscene 10) | 70 | 70 |
| 05a market | marketEntry (cutscene 13), marketAisle (quiet 20), marketKeeper (quiet 20), marketDanger (windup 2), marketQte (prompt 2.5), marketResult (result 12) | 70 | 70 |
| 05 club | clubEntry (cutscene 14), clubBooth (quiet 20), clubFace (windup 2), clubQte (prompt 2), clubResult (result 10), *clubTable (investigate 60, optional, vault only)* | 48 | 48 (+60) |
| 06 chase | chaseEntry (cutscene 11), chaseQteA (prompt 2), chaseBank (result 6), chaseQteB (prompt 2), chaseFinish (result 11) | 32 | 32 |
| 08 substation | subEntry (cutscene 18), subDock (cutscene 10), subManifest (cutscene 13), subDanger (windup 2), subQte (prompt 1.5), subResult (result 14), **subHall (investigate 75)**, subDawn (cutscene 12) | 71 | 146 |
| 09 room | roomEntry (cutscene 14), roomDeduce (quiet 20), roomName (quiet 20) | 54 | 54 |
| 10 canal | canalEntry (cutscene 7), canalEnd (quiet 20) | 27 | 27 |
| transitions | eleven set changes, 4 s each | 44 | 44 |
| **total** | | **769 s, 12.8 min** | **1027 s, 17.1 min** |

By kind, the same route:

| Kind | Before | After |
| --- | --- | --- |
| investigate (player looks) | 0 beats, 0 s | 4 beats, 300 s (29%) |
| quiet choice (player decides) | 19 beats, 380 s (49%) | 19 beats, 380 s (37%) |
| observe | 4 beats, 32 s | 4 beats, 32 s |
| action (windup + prompt) | 5 + 7 beats, 26 s | 5 + 7 beats, 26 s |
| cutscene (player watches) | 20 beats, 221 s (29%) | 17 beats, 179 s (17%) |
| result | 7 beats, 65 s | 7 beats, 65 s |
| transitions | 44 s | 44 s |

The player is watching (cutscenes, results, windups, transitions) 44 percent of the old case and 30 percent of the new one; the player is looking around a room 29 percent of the new one. Time from NEW CASE to the player's first input drops from 48 s to 6 s.

Other routes: the loft route (book or missed courier) adds the loft set at 148 s (`loftTurn` 8, `loftEntry` 11, `loftRoom` 80, `loftBoard` 20, `loftStair` 20, `loftLeave` 5, one transition 4) for about 19.5 minutes; the ramp route adds the tunnel's 25 s; the optional booth adds 60. The longest first-time route (loft, booth, tunnel) is about 21 minutes. The stay route (two prompts, four investigations) is about 14 minutes. All inside the brief's 25.

## 2. The intro, rebuilt as an investigation

### 00 / NIGHT DIVISION (set `office`)

**officeEntry** (cutscene, 6s) [kept, shortened]
- Caption: `Night Division, 23:40. Nine days of rain. Rook's lamp is the only one burning on the floor; the office across the corridor is dark.`
- Buttons: `[SKIP INTRO]` -> `brief`. This is the only phase that carries the skip.
- Camera: the existing push from the corridor to the desk (`sceneStart` to `look(-1.6,1.7,4.4 → -1.8,1.3,9.2)`), run in 6 s.
- Next: `officeDesk`.

**officeDesk** (investigate) NEW, replaces `officeFile`, `officeBoard`, `officeWindow`
- Title: `THE DESK`. Base shot: `look(-1.6,1.7,4.4 → -1.8,1.3,9.2)` (the end of the entry). Rook `read` at (-3.3, 9.6) as now; for spot 4 he walks to (-1.2, 14.3) `watch` (the old window blocking).
- Field: `officeLooked` (bits: 1 file, 2 board, 4 dispatch, 8 window, 16 lantern). `need` 2. No early exit.
- `[1]` the Bell file, the `paper` box on the desk: marker (-0.4, 1.7, 8.2); `look(2.3,1.45,6.4 → -1.6,1.2,8.8)`; button `[1] THE BELL FILE`.
  - Caption: `IVO BELL, lamplighter. Missing four nights, last seen at the closed North Station. Clipped to the file: a report that someone is walking his route with his lantern.`
  - Clue: `Bell file: missing four nights, last seen at the closed North Station. Someone is walking his route with his lantern.`
  - Reveals `[5]`. What to hold: the lantern-walker.
- `[2]` the case board, the two pinned photographs: marker (-7.6, 3.5, 5.6); `look(-2.4,1.8,3.6 → -7.9,2.7,5.8)`; button `[2] THE CASE BOARD`.
  - Caption: `Beside Bell's photograph, a commendation: INSPECTOR A. VALE, GRID SECURITY LIAISON, LUMEN BOARD. Pinned under it, a Board memo on reserve allocation, initialled H.A.`
  - Clue: `Case board: Inspector Aurel Vale of Night Division is the Lumen Board's grid security liaison. His office is next to Rook's. A Board memo on the same board is initialled H.A.`
  - Labels while examined: `I. BELL` hue 6 at (-7.55, 2.2, 5), `A. VALE` hue 3 at (-7.55, 2.0, 6.2) (existing). What to hold: the initials H.A.
- `[3]` the dispatch terminal, the `screen` on the desk: marker (0, 2.1, 9.25); `look(-1.2,1.9,6.8 → 0,1.4,9.3)`; button `[3] THE DISPATCH LOG`.
  - Caption: `Dispatch, four nights ago, 00:17: MAINT CALL / I. BELL / PUMP ROOM 4 / JOB OPEN, phoned in from the lamp depot. Bell was on his route. Somebody else called it in.`
  - Clue: `Dispatch log: the 00:17 maintenance call that put Bell at the station was phoned in from the lamp depot by somebody else.`
  - What to hold: the 00:17 call was not Bell's. This is Nell's forgery, seeded four sets before she confesses.
- `[4]` the window: marker (0, 2.6, 15.7); `look(-2.2,2.2,6 → 0,2.4,16)`; button `[4] THE WINDOW`.
  - Caption: `Uptown blazes on power nobody accounts for; beyond the station the lamplighter's street is a band of black. In the forecourt below, a red car with its lights off.`
  - Clue: `From the office window: a red car parked in the station forecourt with its lights off, 23:40.`
  - What to hold: the red car.
- `[5]` Bell's spare lantern on the desk corner (the `glass` hue 1 box at (-2.0, 1.14..1.8, 7.4)), revealed by `[1]`: marker (-2.0, 2.2, 7.4); `look(-.6,1.6,5.6 → -2,1.4,7.4)`; button `[5] THE LANTERN`.
  - Caption: `The depot sent Bell's spare lantern up with the file. Its reserve cell is missing, the socket clean. Somebody took the cell before the lantern reached this desk.`
  - Clue: `Bell's spare lantern reached Rook's desk with its reserve cell removed.`
- Exit: `[TAKE THE STAIRS]` -> `brief` (scene change to `street`; the existing line `Rook takes the stairs down to Station Road. The rain has not let up.`).
- Facts carried over from the three cutscenes, all present: 23:40, nine days of rain, the one lamp (entry); Bell missing four nights, the closed station, the lantern report (spot 1); Vale's commendation, liaison, the dark office (entry and spot 2); the city's unaccounted power, the dark street (spot 4). Two facts are new: the H.A. memo and the 00:17 call.

## 3. Four more investigation beats

### 02 / NORTH STATION: stationDesk

**stationDesk** (investigate) NEW, between `stationEntry` and `stationQuiet`
- Title: `THE MAINTENANCE DESK`. Base shot: `look(-3.5,2.9,13 → .9,1.1,19)` (the quiet shot). Rook `read` at (-1.2, 17.2); Nell `stand` at (1.3, 18) on the witness route. The `MAINTENANCE` and `ORDER 7731` labels are hidden during this beat; the markers do their job.
- Field: `stationLooked` (bits: 1 order, 2 tape, 4 hatch, 8 board, 16 cup). `need` 2.
- `[1]` the order on the desk: marker (0.4, 1.7, 19.3); `look(-.2,1.9,17.6 → .4,1.25,19.3)`; button `[1] THE ORDER`.
  - Caption: `A fresh order on the desk: RESERVE BATTERIES / ORDER 7731 / INSPECTOR VALE. Countersigned in a second hand, H.A., and stamped by the Lumen Board. Dated tonight.`
  - Caption, `loftLooked & 2`: `A fresh order on the desk: RESERVE BATTERIES / ORDER 7731 / INSPECTOR VALE, the number from Bell's map. Countersigned in a second hand, H.A. Dated tonight.`
  - Clue: `Maintenance desk: order 7731, RESERVE BATTERIES, signed INSPECTOR VALE, countersigned H.A., stamped by the Lumen Board. Dated tonight.` (replaces the `stationQuiet` clue)
  - Reveals `[5]`. What to hold: Vale signed it tonight; H.A. again.
- `[2]` the tape reader: marker (0, 2.7, 19.75); `look(-1.2,1.9,17.4 → 0,2.05,19.6)`; button `[2] THE TAPE`.
  - Caption: `A maintenance tape, still turning. Its leader reads FLOOD PROCEDURE / PUMP ROOMS. Reading it takes time. Under the floor, the knocking keeps its own.`
  - No clue. It tells the player what the next choice buys.
- `[3]` the service hatch: marker (0, 5.3, 43.4); `look(-1.6,1.9,30 → 0,2.2,43.8)`; button `[3] THE HATCH`.
  - Caption: `PUMP ROOM 4, stencilled on the service hatch. A new padlock hangs open on its hasp, Division issue, the same pattern as the one on Rook's own locker.`
  - Clue: `The Pump Room 4 hatch carries a Division-issue padlock, hanging open.`
  - What to hold: Division hardware on a Board station.
- `[4]` the departures board: marker (0, 5.6, 21); `look(-1.2,2.2,15 → 0,4.7,21)`; button `[4] THE DEPARTURES BOARD`.
  - Caption: `The departures board still runs on the station's reserve. Last train: a year ago. Under it, tonight's line: BOARD VAN / BAY 2 / 01:30. The Board still uses this station.`
  - Clue: `Departures board: BOARD VAN / BAY 2 / 01:30. A Lumen Board van is due at the closed station tonight.`
- `[5]` a tin cup on the desk, revealed by `[1]`: marker (-1.5, 1.8, 19.6); `look(-2.4,1.8,17.8 → -1.5,1.3,19.6)`; button `[5] THE CUP`.
  - Caption: `A tin cup beside the order, still warm. Whoever signed for the batteries was sitting here ten minutes ago, and left without the cup.`
  - Clue: `The cup beside order 7731 was still warm. Vale left the desk minutes before Rook reached it.`
- Exit: `[THE KNOCKING BELOW]` -> `stationQuiet`.

**stationQuiet** (quiet choice) [kept, recaptioned]
- Caption: `Below the floor, someone strikes a pipe: three short, a rest, three short. The tape is still turning.`
- The order clue moves to spot 1. Buttons unchanged.

### 03 / PUMP ROOM 4: pumpRoom

**pumpRoom** (investigate) NEW, between `pumpResult` and `pumpTruth`, both routes
- Title: `THE ROOM BELL WAS LOCKED IN`. Base shot: `look(.3,2.7,10.5 → 3,1.4,16.4)` (the truth shot). Rook `watch` at (1.8, 15.7); Bell `sit` at (3.25, 16.2); Nell `watch` at (1.5, 14.5) on the witness route. On the valve route the water has dropped; on the pull route it laps the walkway and the platform is gone. The entry chunk (typed before any marker is lit): valve `The inlet is shut and the water is falling. Rook has a minute, and he uses it to look at the room.`; pull `The water is at the walkway's edge. Rook has less than a minute, and he uses it to look at the room.`
- Field: `pumpLooked` (bits: 1 door, 2 ledger, 4 wheel, 8 pipe). `need` 2.
- `[1]` the platform door, the `hatch` at (-2..2, 0..4, 33.6..34): marker (0, 4.4, 33.5); `look(1.2,2.2,24 → 0,1.8,33.8)`; button `[1] THE DOOR`.
  - Caption: `The platform door, bolted from the outside. On the bolt a Division padlock, closed, keyed like the one on the concourse hatch. Bell did not lock himself in.`
  - Caption, `stationLooked & 4`: `The platform door, bolted from the outside. On the bolt a Division padlock, closed, the twin of the open one upstairs. The same hand locked both.`
  - Clue: `Pump Room 4's platform door was bolted from outside and padlocked with Division issue. Someone locked Bell in.`
  - What to hold: a Division padlock. Krane's.
- `[2]` the ledger, or the satchel: valve, the `dispatch` box on the walkway at (2.2..2.8, 0, 15.2..15.6), marker (2.5, 0.7, 15.4), `look(1.4,1.6,13.2 → 2.5,.2,15.4)`, button `[2] THE LEDGER`; pull, the satchel under the water at the platform's foot, marker (5.1, 0.3, 17.7), `look(2.8,2.2,13.8 → 5.1,-.5,17.7)`, button `[2] THE SATCHEL`.
  - Caption, valve: `Bell's ledger, dry. Transfer by transfer: lot numbers, a buyer's code, THE FILAMENT as the handover, Vale's signature, and under each entry the same initials, H.A.`
  - Caption, pull: `The satchel, a metre down in black water at the platform's foot, out of reach. The ledger is in it. By morning the pages will be pulp.`
  - Clue, valve: `Ledger pages: lot numbers, a buyer's code, and THE FILAMENT named as the handover point.`
  - Clue, pull: `Bell's satchel lies under the water at the platform's foot. The ledger is in it and cannot be recovered tonight.`
- `[3]` the inlet wheel: marker (-1.25, 2.3, 11.8); `look(-2.4,2,9.6 → -1.25,1.35,11.9)` (the windup's wheel cut); button `[3] THE INLET WHEEL`.
  - Caption: `The inlet wheel, its stop pin gone, the gate set to full. Somebody opened it full and took the pin so it would stay open. The flood was set.`
  - Clue: `The Pump Room 4 inlet was opened to full and its stop pin removed. The flood was deliberate.`
  - What to hold: it was not an accident.
- `[4]` the pipe Bell struck, the `pipe` run over the platform at (3.5..7.8, 7.2..7.65, 16.8..17.2): marker (5.5, 8.1, 17); `look(2.6,3.2,12.4 → 5.5,7.4,17)`; button `[4] THE PIPE`.
  - Caption: `The pipe Bell struck. The paint is worn bright in one place: three short, a rest, three short, for four nights. Somebody upstairs had to have heard it.`
  - Caption, `stationLooked & 16`: `The pipe Bell struck, its paint worn bright: three short, a rest, three short, for four nights. Somebody sat upstairs with a warm cup and heard it.`
  - Clue: `Bell tapped the pipe for four nights in the lamplighters' knock. Nobody at the desk above answered.`
- Exit: `[WHAT BELL KNOWS]` -> `pumpTruth`. `pumpTruth` keeps its captions and its `[TAKE BELL TO THE ROOF]`.

### 01b / THE DEPOT LOFT: loftRoom

**loftRoom** (investigate) NEW, replaces `loftTable` and `loftNote`
- Title: `ONE ROOM OVER THE DEPOT`. Base shot: `look(-2.9,1.7,.4 → -1.2,1.1,5.2)` (the table shot). Rook `watch` at (-1.1, 5.2); for spot 3 `read` at (3.5, 5), for spot 5 `watch` at (1.1, 6.4).
- Field: `loftLooked` (bits: 1 note, 2 map, 4 photographs, 8 kettle, 16 window). `need` 2, and the exit needs the photographs (`gate` 4): the deduction that follows is about them. If the mechanic counts only, `need` 3 with the photographs listed first.
- `[1]` the note under the lamp key: marker (-0.2, 1.4, 3.0); `look(-.75,1.4,2.05 → -.2,1.08,3)`; button `[1] THE NOTE`.
  - Sets `note = true`. Stinger `NOTED`.
  - Caption: `The note, in a quick hand: "Ivo. I called it in so the Board would log you at the station. I did not think. Forgive me. N." Rook keeps it.`
  - Caption, `officeLooked & 4`: `The note, in a quick hand: "Ivo. I called it in so the Board would log you at the station. Forgive me. N." The depot's line, 00:17. Rook keeps it.`
  - Clue: as `loftNote` today.
- `[2]` the route map: marker (-3.1, 3.1, 6.9); `look(-2.9,1.9,4.6 → -3.1,2.0,7)`; button `[2] THE ROUTE MAP`.
  - Caption: `Bell's route map. Lamps 14 to 19 crossed out in red and tagged RESERVE PULLED / ORDER 7731 / A.V. Six lamps, six reserve cells, one order number.`
  - Clue: `Bell's route map: lamps 14 to 19 tagged RESERVE PULLED / ORDER 7731 / A.V.`
- `[3]` the photographs: marker (3.15, 2.6, 6.9); `look(.9,1.7,3 → 3.5,1.9,7)`; button `[3] THE PHOTOGRAPHS`.
  - Caption: `Three prints. A red car at a loading bay under a neon sign, THE FILAMENT. A Lumen Board van. A man in a Division greatcoat, not looking at the camera.`
  - Labels while examined: `FILAMENT`, `BOARD VAN`, `DIVISION` as in `loftBoard`. No clue; the deduction awards it.
- `[4]` the kettle: marker (0.7, 1.9, 3.4); `look(-.3,1.5,2.2 → .7,1.1,3.4)`; button `[4] THE KETTLE`.
  - Caption: `The kettle is warm, the mug beside it rinsed. Someone with a key was here inside the hour and did not sit down. N., or the man on the order.`
  - Clue: `Someone with a key was in Bell's loft within the hour and did not stay.`
- `[5]` the window: marker (0, 3.3, 6.9); `look(-.2,1.5,4.2 → 0,7.5,22)`; button `[5] THE WINDOW`.
  - Caption: `Through the window, the station clock: five past midnight. Bell's job is still open. On the street under the depot lamp, nobody yet.`
- Exit: `[WHERE ARE THE BATTERIES GOING?]` -> `loftBoard`. `loftBoard`, `loftStair` and `loftLeave` are unchanged; the lamp cost on the first wrong answer stays.

### 08 / SUBSTATION NINE: subHall

**subHall** (investigate) NEW, between `subResult` and `subDawn`
- Title: `THE HALL`. Base shot: `look(-1.2,5.6,29.6 → 1.4,1,40.5)` (the result crane). Rook `watch` at (-1, 36); dive: Krane `stumble` under the rack's edge as in the result, the loaders gone; breaker: the hall dark under the red strips, the van gone. The markers are interface and stay amber in the dark.
- Field: `subLooked` (bits: 1 manifest, 2 dock, 4 chains, 8 tin, 16 breaker). `need` 2.
- `[1]` the manifest, or its ash: breaker, in Rook's hand, marker (0.55, 1.9, 36.1), `look(-.4,1.6,34.6 → .55,1.4,36.1)`, button `[1] THE MANIFEST`; dive, on the fallen rack, marker (-0.45, 2.6, 37.1), `look(-1.8,2.4,35 → -.45,2.1,37.1)`, button `[1] THE ASH`.
  - Caption, breaker: `The manifest, in Rook's fist. RESERVE TRANSFER / ORDER 7731 / A. VALE, and under it H. ASHE, COMMISSIONER OF RESERVE. Bay 2, 01:30. The Board's own paper, the Board's own hall.`
  - Caption, dive: `What is left of the manifest on the fallen rack. The Board's letterhead survives in one corner, and the order number. The signatures are ash. Rook read them first.`
  - Clue, dive: `The manifest's letterhead survived the fire: LUMEN BOARD / RESERVE TRANSFER / ORDER 7731. The signatures did not.`
- `[2]` the dock: marker (-2.5, -0.6, 56); `look(0,2.4,44 → -2.5,-1,56)`; button `[2] THE DOCK`.
  - Caption: `The dock. Twin tyre tracks where the van stood, and beside them a dry rectangle of concrete the size of an umbrella. He stood here and never got wet.`
  - Clue: `On the dock: the van's tracks and a dry patch where the grey man stood under his umbrella through the whole loading.`
- `[3]` the chained racks, the padlock on the nearest left unit: marker (-1.9, 2.2, 39); `look(-.4,1.7,35.5 → -1.9,1.5,39)`; button `[3] THE CHAINS`.
  - Caption: `The left rows are chained and padlocked. The right rows are loose. What is chained stays the Board's; what is loose was sold tonight, by the rack.`
  - Caption, `pumpLooked & 1`: `The padlocks on the left rows are Division issue, the pattern from Pump Room 4. Whoever chained the Board's racks is the man who locked Bell in.`
  - Clue, `pumpLooked & 1`: `The Substation Nine chains carry Division padlocks of the pattern used on Pump Room 4's door.`
- `[4]` Krane's tin, dropped where he stood: marker (4.2, 0.6, 44); `look(2,1.6,40.5 → 4.2,.2,44)`; button `[4] THE TIN`.
  - Caption: `A tobacco tin, dropped where Krane stood. Inside, eleven Filament chips, each stamped with a lot number, each a night's work. Somebody was keeping evidence against somebody.`
  - Clue: `Krane's tin: eleven Filament chips, one lot number each, kept as insurance against Vale.`
- `[5]` the breaker's tally plate: marker (1.2, 4.05, 35.6); `look(-.2,1.8,33.6 → 1.2,2.2,35.6)`; button `[5] THE BREAKER`.
  - Caption: `The breaker's tally plate: reserve draw logged every Thursday at 01:30 for eleven weeks, signed A.V. The dark streets were on a schedule.`
  - Clue: `Substation Nine's breaker log: reserve draw every Thursday at 01:30, eleven weeks, signed A.V.`
- Exit: `[OUT TO THE DOCK]` -> `subDawn`.

### 05 / THE FILAMENT: clubTable (optional)

**clubTable** (investigate) NEW, `club === 'vault'` only, between `clubResult` and `chaseEntry`
- Title: `THE BACK BOOTH`. Base shot: `look(2,2.3,8 → 9.5,1.3,16)` (the result shot). Rook `watch` at (7.4, 12.4); Vale and Krane gone through the open door; the patrons as blocked. Entry chunk: `Vale's car is starting in Vine Alley. Dispatch has the patrol car at the kerb. Rook gives the booth thirty seconds.`
- Field: `clubLooked` (bits: 1 case, 2 glass, 4 phone, 8 door). `need` 1. No cost in any field: the chase's first caption already has Vale's tail lights ahead.
- `[1]` the chip case on the booth table: marker (8.7, 1.5, 13.3); `look(6.8,1.8,11.2 → 8.7,1,13.3)`; button `[1] THE CHIP CASE`.
  - Caption: `Vale's chip case, spilled. Every chip stamped with a lot number. The club pays out in reserve batteries and calls it a game.`
- `[2]` a second glass: marker (9.6, 1.5, 13.6); `look(7.6,1.7,11.6 → 9.6,1,13.6)`; button `[2] THE GLASSES`.
  - Caption: `Two glasses. One is Vale's. The other has lipstick on the rim and has not been touched since the set began. Vale was not drinking alone tonight.`
  - Clue: `A second glass at Vale's booth, lipstick on the rim. Someone left the booth before Rook came in.`
- `[3]` a phone under the table: marker (8.2, 1.2, 14.6); `look(6.6,1.6,12.4 → 8.2,.7,14.6)`; button `[3] THE PHONE`.
  - Caption: `A club phone under the table, one number in its memory: a Lumen Board exchange, Reserve. Rook writes it down.`
  - Clue: `The booth phone holds one number: the Lumen Board's Reserve exchange.`
- `[4]` the door marked NO EXIT: marker (11.6, 4.6, 18); `look(8,2,12 → 11.85,1.8,18)`; button `[4] THE BACK DOOR`.
  - Caption: `The door marked NO EXIT stands open on Vine Alley and rain. Vale's tail lights are already turning for the ramp.`
- Exit: `[GO AFTER HIM]` -> `chaseEntry`. Persons, Delphine Arlo, when `clubLooked & 2`: `DELPHINE ARLO, singer at The Filament: sings to the back booth every night. Somebody with lipstick left it before Rook arrived.`

## 4. Fields

| Field | Type | Values | Set by | Note |
| --- | --- | --- | --- | --- |
| `officeLooked` | integer | 0..31 | `officeDesk` spots: 1 file, 2 board, 4 dispatch, 8 window, 16 lantern | |
| `stationLooked` | integer | 0..31 | `stationDesk` spots: 1 order, 2 tape, 4 hatch, 8 board, 16 cup | |
| `pumpLooked` | integer | 0..15 | `pumpRoom` spots: 1 door, 2 ledger or satchel, 4 wheel, 8 pipe | |
| `loftLooked` | integer | 0..31 | `loftRoom` spots: 1 note, 2 map, 4 photographs, 8 kettle, 16 window | |
| `subLooked` | integer | 0..31 | `subHall` spots: 1 manifest, 2 dock, 4 chains, 8 tin, 16 breaker | |
| `clubLooked` | integer | 0..15 | `clubTable` spots: 1 case, 2 glass, 4 phone, 8 door | optional beat |
| `note` | boolean | | `loftRoom` spot 1 | kept; a spot sets it |

No other new field. Derived terms (never stored): `orderRead` = `(stationLooked & 1) || (loftLooked & 2)`; `callSeen` = `officeLooked & 4`; `padlockSeen` = `pumpLooked & 1`; `tinHeld` = `subLooked & 8`. A bitmask resumes with its markers already cyan; a spot's clue is added once, on examine. Checkpoints at `officeFile`, `officeBoard`, `officeWindow` resume at `officeDesk`; at `loftTable` or `loftNote` resume at `loftRoom` (legacy phase map in `save-store.js`). The `restartChapter` field table gains each set's bitmask (reset to 0 with that set's fields).

## 5. Payoff table

Every later line, label, bonus or availability keyed on what was examined. Where a caption gains a sentence it is appended as its own chunk unless the whole caption is given.

| When | Where | Effect, exact text |
| --- | --- | --- |
| `officeLooked & 8` | `follow` (runtime.js) | Caption ends: `A red car idles at the far corner, lights off, then pulls away. The car from the forecourt.` |
| `officeLooked & 8` | `roofQuiet` | Clue reads: `Seen from the roof: the red car from the station forecourt leaves westward, toward the night market under the elevated road and The Filament.` |
| `officeLooked & 4` and `choice === 'person'` | `roofQuiet` | `[ASK NELL ABOUT THE ORDER]` is available here, before the radio, not only at `roofSignal`. |
| `officeLooked & 4` | `roofConfession` | Caption ends: `Rook has known since the dispatch log that the call came from the depot. He records it anyway.` |
| `officeLooked & 4` | `evidence`, book route | Caption ends: `The same call the dispatch log carried.` |
| `officeLooked & 2` | `pumpTruth`, valve | Caption: `The dry ledger bears Vale's signature, and under every entry a second set of initials Bell does not know. Rook does: H.A., from the memo on his own case board.` |
| `officeLooked & 2` or `stationLooked & 1` | persons, Ashe | Shown from that beat: `H.A.: initials on a Board memo and under Vale's name. Unknown.` (the existing fourth line, reachable earlier) |
| `officeLooked & 16` | `marketEntry` | Clue ends: `The socket in Bell's spare lantern was one of these.` |
| `orderRead` | persons, Vale | The line `INSPECTOR VALE, Night Division: named on the battery order.` is keyed on `orderRead`, no longer on `reached('stationQuiet')`. |
| `orderRead` | `clubBooth` | `[SHOW HIM ORDER 7731]` appears only when `orderRead`. A player who never read the order cannot show it; the `booth` discovery needs the look. |
| `stationLooked & 16` | `clubBooth`, shown | Vale's line: `"Reserve batteries. Signed. Nobody reads a maintenance order." He looks at Rook's hands. "You found my cup."` |
| `stationLooked & 16` | persons, Vale | Inserted above the order line: `INSPECTOR VALE, Night Division: left the station desk minutes before Rook reached it. Named on the battery order.` |
| `stationLooked & 8` | `roofSignal` | Caption's radio line ends `"Board van booked through to Nine, half past one."`, and a chunk follows: `The van the departures board promised.` |
| `stationLooked & 8` | `subEntry` | Clue ends: `Bay 2, half past one, as the departures board said.` |
| `stationLooked & 4` | `pumpRoom` spot 1 | The twin-padlock caption (section 3). |
| `stationLooked & 16` | `pumpRoom` spot 4 | The warm-cup caption (section 3). |
| `stationLooked & 2` | `stationQuiet` | `[READ THE TAPE / 8s]` becomes `[READ THE FLOOD PROCEDURE / 8s]`. |
| `pumpLooked & 1` | `subHall` spot 3 | The Division-padlock caption and clue (section 3). |
| `pumpLooked & 1` | `subResult`, dive | Caption ends: `Rook has the padlock from Pump Room 4 in his pocket. It is the pattern on Krane's belt.` |
| `pumpLooked & 4` | `subResult`, dive | After Krane's line: `Rook: "The pumps were never going to run. Somebody pulled the pin."` |
| `pumpLooked & 4` | ending `krane`, closing | `... and Krane has begun to talk, starting with who told him the pumps would run.` replaces `and Krane has begun to talk.` |
| `pumpLooked & 1` | persons, Krane | From `subResult`: `KRANE, division sergeant on paper: locked Pump Room 4 with a Division padlock. ` prefixed to the pinned or escaped line. |
| `pumpLooked & 1` | `roomName`, kranePinned no proof | Caption: `Krane says the Board's man never came to the hall and he never learned a name. The padlock from Pump Room 4 is on the table, signed out to him. Rook believes the first part.` |
| `pumpLooked & 2`, valve | `marketEntry` | Clue ends: `The serials match the lots in Bell's ledger.` |
| `pumpLooked & 2`, valve | `clubResult`, vault | Clue: `A Filament casino chip from Vale's case, stamped with a lot number from Bell's ledger. The club launders the sales.` |
| `pumpLooked & 8` and `choice === 'person'` | `roofConfession` | Caption ends: `"I heard him," Nell says. "Four nights. I could not get the hatch open."` |
| `pumpLooked & 8` | persons, Bell | From `pumpFind`: `IVO BELL, lamplighter: found alive in Pump Room 4. Tapped the pipe for four nights.` |
| `loftLooked & 2` | `stationDesk` spot 1 | The map-number caption (section 3). |
| `loftLooked & 2` | `tramEntry` | Caption: `... Below, lamps 14 to 19 stand dark on their posts: the six Bell crossed out. Dispatch will bring the patrol car round to Market Arch.` |
| `loftLooked & 8` | `loftStair` | Caption ends: `Not his first visit tonight. The kettle.` |
| `loftLooked & 8` | `loftStair`, faced | Caption ends: `He has a key to this room, Rook thinks, and did not use the stair.` |
| `loftLooked & 16` | `loftStair` | Caption opens: `Five minutes ago the lamp pool was empty. Now, below the window, ...` |
| `loftLooked & 1` (`note`) | canal Nell line | unchanged (`Nell's note is in the file; she has not been found.`) |
| `subLooked & 1`, dive | `roomDeduce`, wrong pick `[SOMEONE ABOVE VALE SIGNED]` no proof | Caption: `Rook believes it, and he cannot show it. The letterhead in his pocket says whose hall it was; the signatures are ash. Say what the paper says, not what Rook knows.` |
| `subLooked & 2` | persons, Ashe | Dock line becomes: `THE GREY MAN: Lumen Board, by the pin. Stood dry on the dock through the whole loading and left when he saw Rook.` |
| `subLooked & 2` | `roomName`, proof and caught | Caption ends: `"He stood on the dock," Rook says. "He never got wet."` |
| `subLooked & 8` | `roomDeduce`, Krane in the chair, second wrong pick | `stalled` is not set. Caption: `Krane stops talking. "You want Vale? I want a name off the ledger. Mine." Rook puts the tin on the table, eleven chips, eleven nights. Krane keeps talking.` The buttons stay; the last wrong one is removed as with Bell. |
| `subLooked & 8` | `canalEnd` evidence line | Appended: `Krane's tin ties eleven nights to Vale's tables.` |
| `subLooked & 16` and `radio` | persons, Heddy | Appended: ` Her Thursdays match the breaker log.` |
| `subLooked & 16` and `keeper` | persons, Marta | The `subEntry` line becomes: `MARTA QUILL, cell-stall keeper: right about the racks and right about Thursdays. Sells reserve cells on the market; will need a lawyer, and a witness fee.` |
| `clubLooked & 4` | `roomName`, proof | Caption ends: `The number under the booth table rings the same exchange.` |
| any investigation | route steps | `officeLooked` nonzero: `Read the desk`; `stationLooked`: `Searched the maintenance desk`; `pumpLooked`: `Searched Pump Room 4`; `loftLooked`: `Searched the loft` (replaces `Read Nell's note`, which stays as its own step); `subLooked`: `Searched the hall`; `clubLooked`: `Searched the booth`. |
| all five bits of `officeLooked`, `stationLooked`, `subLooked` and all four of `pumpLooked` | discovery `thorough` | `Left nothing on the desk unread` (id `thorough`). Twenty-three discoveries. |

No investigation changes a prompt window. The action beats keep their bonuses from the observations and their penalties from the injuries; looking is free, and what it buys is story, labels, a button and a second chance with Krane.

## 6. Change list

| # | Item | Where | Effort |
| --- | --- | --- | --- |
| 1 | The `investigate` kind: markers from `spots[]` (`at`, `dir`-less `cueLabel` in amber, cyan when examined), `look()` per spot, the caption queue per spot, `after`, `need`, `gate`, the exit button, the bitmask write, number keys and taps | mechanics builder (registry, runtime, presentation) | out of scope here |
| 2 | Hand-written sets take a spot shot: `caseShot()` for `office`, `station`, `pump`, `club` returns the active spot's `look` when the investigation has one, else the base shot; blocking per spot as listed | `scenes.js` | S |
| 3 | `officeEntry` 6 s and its caption; `officeDesk` via `registerPhases('office', …)`; `officeFile`, `officeBoard`, `officeWindow` removed from `caseAdvance`, `caseUI`, `caseTitles`, `casePose`; the board clue moves to spot 2 | `case.js`, `scenes.js` | S |
| 4 | Office props: the H.A. memo on the board, the red car in the forecourt beyond the window, the empty cell socket on the lantern (section 7) | `scenes.js` `officeSet` and per-phase geometry | S |
| 5 | `stationDesk` phases; `stationQuiet` recaptioned, its clue moved; `MAINTENANCE` and `ORDER 7731` labels hidden during the beat; the cup, the hatch padlock, the leader tag | `case.js`, `scenes.js` | S |
| 6 | `pumpRoom` phases with the route variants; the bolt and padlock on the platform door, the sunk satchel box, the wheel's missing pin (a removed `metal` sliver), the bright patch on the pipe | `case.js`, `scenes.js` | M |
| 7 | `loftRoom` replaces `loftTable` and `loftNote`; `loftBoard` gated on the photographs; `preview()` unchanged | `sets/loft.js` | S |
| 8 | `subHall` phases with dive and breaker variants; the tin, the dry patch and tyre marks, the tally plate; labels for the dark hall | `sets/substation.js` | M |
| 9 | `clubTable` (optional) with its four props | `case.js`, `scenes.js` | S |
| 10 | Payoff captions and lines of section 5: `follow`, `evidence`, `roofQuiet`, `roofSignal`, `roofConfession`, `pumpTruth`, `tramEntry`, `marketEntry`, `clubBooth`, `clubResult`, `subEntry`, `subResult`, `loftStair`, `roomDeduce`, `roomName`, the `krane` closing | `runtime.js`, `case.js`, `sets/tram.js`, `sets/market.js`, `sets/loft.js`, `sets/substation.js`, `sets/room.js`, `presentation.js` | M |
| 11 | Persons lines (Vale, Krane, Bell, Ashe, Heddy, Marta, Delphine), route steps, the `thorough` discovery, the canal evidence line | `presentation.js` | S |
| 12 | Fields: six bitmasks in `numbers` and `integers`; legacy phase map `officeFile`/`officeBoard`/`officeWindow` -> `officeDesk`, `loftTable`/`loftNote` -> `loftRoom`; `phaseOrder` updated; `setFields` gains the bitmasks | `save-store.js`, `presentation.js`, `case.js` | S |
| 13 | Tests: a resume at `stationDesk` with `stationLooked` 5 shows two cyan markers and no exit; `need` gates the exit; `orderRead` false hides the booth button; the tin prevents `stalled`; old checkpoints at the retired phases resume; the `thorough` discovery | `tests/game.test.cjs`, `tests/save-store.test.cjs` | M |
| 14 | `BEATS.md` sections 3, 4, 6, 8, 9 and `LOCATIONS.md` 00, 01b, 02, 03, 08 updated to match | docs | S |

Untouched: every camera that exists (spot shots reuse the sets' own shots or add a close look at an object the set already draws); every prompt, its window, its cues and its miss table; every death and the cold case; every set's build beyond the small props listed in section 7; every exit point and transition line; the deduction ladder; the endings' conditions; the save format's shape.

## 7. Objects a level artist must add

1. Office: a Board memo on the case board, `paper` hue 6 box 0.4 x 0.3 at (-7.92, 2.0..2.3, 7.4..7.8) with a `sign` strip under it, and a lit `lamp` hue 2 pin 0.06 at its corner (the Board's mark); drawn always.
2. Office: the red car in the forecourt, `car(2, 22, 3, -6, false, {dark: true})` on a `road` hue 7 strip x -6..10, z 18..26 at y -6, beyond the window; drawn in `officeEntry` and `officeDesk` only.
3. Office: the empty cell socket on Bell's spare lantern, a `metal` hue 0 box 0.1 cube at (-1.95, 1.14, 7.55) replacing the lantern's `glass` base band; drawn always.
4. Station: the tin cup, `metal` box 0.12 x 0.16 x 0.12 at (-1.5, 1.24, 19.6); the hatch padlock, `metal` box 0.14 x 0.2 x 0.06 hanging at (2.3, 2.1..2.3, 43.55) with a `cable` hue 0 shackle; the tape leader tag, `paper` 0.2 x 0.08 at (0, 2.14, 19.53); all drawn always.
5. Pump: a bolt and padlock on the platform door, `metal` box 0.6 x 0.08 at (0.6..1.2, 2.0, 33.55) and a `metal` padlock 0.16 x 0.22 at (1.2, 1.85..2.07, 33.5); the bright patch on the pipe, a `metal` hue 6 quad 0.4 x 0.3 on the pipe's near face at (5.3..5.7, 7.25..7.55, 16.8); the wheel's empty pin hole, a `metal` hue 0 sliver at the wheel's rim (-0.65, 1.35, 11.86); the sunk satchel, the existing `wood` hue 2 satchel box at (4.95, -1.0, 17.7) under the `water` floor on the pull route from `pumpRoom` on.
6. Substation: Krane's tin, `metal` box 0.3 x 0.1 x 0.2 at (4.2, 0, 44) with a `lamp` hue 2 sliver 0.08 inside its lid; the dry patch, a `paving` hue 6 quad x -3.3..-1.7, z 55.2..56.8 at y -1.19; the tyre tracks, two `rubber` strips 0.3 wide at x +-1.45, z 50..58, y -1.19; the tally plate, `paper` hue 6 box 0.3 x 0.2 on the breaker post's aisle face at (0.88, 1.6..1.8, 35.6); the tin, patch and tracks drawn from `subHall` on.
7. Club (optional): the chip case, `metal` box 0.4 x 0.06 x 0.3 at (8.7, 1.0, 13.3) with the existing scattered `lamp` chips; two `glass` hue 1 boxes 0.1 x 0.18 at (9.5, 1.0, 13.5) and (9.7, 1.0, 13.7), the second with a `tail` hue 3 fleck at its rim; the phone, `console` hue 1 box 0.2 x 0.08 x 0.14 at (8.2, 0.55, 14.6); all drawn in `clubTable` only.

## 8. Open questions for the owner

1. The office is now 81 seconds where it was 48, but the player is doing something from second six. Is the desk the right first room, or should the case open on the street with the desk as a look-back beat after the courier?
2. `stationDesk` and `pumpRoom` are two investigations eleven minutes apart with a prompt between them. Is Act 1 now too slow before the first death, or is that the rhythm wanted (look, choose, act)?
3. The order clue moves off `stationQuiet` and onto a spot. A player who takes the hatch and the tape and leaves never reads Vale's name until the pump room. Acceptable, or should the order be a forced first spot?
4. The tin lets Rook keep Krane talking after two wrong answers. That softens one of round two's teeth for the careful player. Keep it as the reward for looking, or make the tin a clue only?
5. The club booth is optional and costless because the chase's own caption already has Vale ahead. Include it in this build, or hold it for a second pass with Delphine's informant beat?
6. `thorough` needs every spot in four rooms. Is a discovery for exhaustive looking wanted, or does it turn looking into a checklist?
7. Should examining the window in the office (the red car) or the departures board (the van at 01:30) buy half a second anywhere, as observations do? This sheet keeps looking free; the owner asked for low-key, not for more advantage.
