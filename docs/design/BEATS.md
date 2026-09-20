# The Last Light: beat sheet

Implementable beats for the whole case. Every caption, button label, clue and condition here is final wording. Engineers type it in as written. Where the sheet and the brief disagree, the brief wins; where the sheet and the code disagree, the sheet wins.

Conventions used below:

- `phaseId` names are camelCase and prefixed by the set. Set names (for `sceneFor`, exit points and transition lines): `office`, `street`, `loft`, `station`, `pump`, `roof`, `tram`, `market`, `club`, `chase`, `tunnel`, `substation`, `room`, `canal`.
- Kinds: **cutscene (Ns)** advances by itself; **quiet choice** waits for a button; **timed observation (8s)** runs a visible 8-second count and then advances; **windup (2s)** shows `GET READY`; **prompt (Ns)** is a two-move quick-time event; **result** shows the stinger and, after a miss, the rewind buttons.
- Prompt windows are given as a base with modifiers. The floor is 5 seconds; the ceiling is 9. Windups are always 2 seconds.
- Every prompt's miss table entry says what a rewind resets and which windup it re-enters. A rewind never restores anything else.
- Quiet-choice buttons are shown in square brackets exactly as labelled. Prompt buttons are always `[1] ...` and `[2] ...`, matching the `[1]` and `[2]` labels placed in the world.
- "Clue" is the exact string added to the case file. A clue is added once, at the phase named.

## 1. Logline

Detective Rook of the Night Division's missing-persons desk follows a stranger carrying a lost lamplighter's lantern into the closed North Station, pulls Ivo Bell out of a flooding pump room, and learns that the reserve batteries that keep the low districts lit are being sold uptown by Inspector Aurel Vale, from the office next to Rook's own. Chasing Vale through a night market, a neon club, an elevated road and the storm drains brings Rook to Substation Nine, where the Lumen Board's own people are loading the last of the batteries, and to a dawn interrogation in which Rook must decide who really signed the order. Whatever Rook chooses, the lamps go dark at first light because morning has come.

## 2. Three-act summary

**Act 1, The Missing Light.** Rook reads the Bell file in a dark office where Vale's commendation photo hangs on the same board. On Station Road a limping courier (Nell Marrow, Bell's apprentice) drops Bell's dispatch book on the wet rails: Rook catches her or the book. If Rook has Nell, she takes him straight to the station's service door; if not, Rook climbs to Bell's loft over the lamp depot, where Bell's route map, his photographs and a note from Nell tell him where the batteries are going. In the station concourse an order signed VALE sits on the maintenance desk; a tape explains how to survive a flood rescue. In Pump Room 4 Rook closes the inlet or pulls Bell clear, and either keeps or loses the signed ledger. On the roof, with Bell safe, Rook hears the bridge operator on the radio, may take Nell's confession about the forged call, and decides: pursue Vale, or stay with Bell.

**Act 2, The Filament.** Rook rides the last tram over the dark district to Market Arch and may spot the division car tailing him. In the night market under the elevated road, Vale's bodyguard Krane sends a cart of stolen cells down the aisle at him. In The Filament, Vale's bodyguard throws a bottle; going over the bar wins a chip stamped with battery lot numbers. On the elevated road Rook dodges a freight carrier, then chooses the lifting bridge or the lower ramp into the storm drains, where the fork decides whether Vale is stopped at the canal basin.

**Act 3, Substation Nine.** The chase ends at the Lumen Board's battery hall on the canal basin, whether or not Vale is in the back of the patrol car. Krane and the buyers are loading the reserve batteries into a Board van; the loading manifest bears a second signature. Krane heaves a loaded rack over onto Rook: dive clear and pin him, or pull the breaker and save the manifest. At dawn, in the Night Division interrogation room, Rook works out from the evidence whether Vale signed alone or someone on the Board signed above him. The case closes on the canal at first light with one of six endings.

## 3. State fields

All fields are flat and small. Empty string means "not yet decided". Everything derived (endings, discoveries, route, reflex, prompt windows) uses only these fields plus the current phase.

| Field | Type | Values | Set by | Kept / new |
| --- | --- | --- | --- | --- |
| `watched` | boolean | true/false | `streetReady` (after the 8s watch) | kept |
| `choice` | enum | `''` `person` `book` `missed` | `streetResult` (courier prompt) | kept |
| `wrong` | boolean | true/false | `streetDeduce` on a wrong answer (street deduction) | kept |
| `note` | boolean | true/false | `loftNote` (Rook read Nell's note) | new |
| `loftSeen` | boolean | true/false | `loftEntry` (Rook climbed to Bell's loft) | new |
| `misread` | boolean | true/false | `loftBoard` on a wrong answer (loft deduction) | new |
| `decoded` | boolean | true/false | `stationReady` (tape read) | kept |
| `rescue` | enum | `''` `valve` `pull` `late` | `pumpResult` (inlet prompt) | kept |
| `radio` | boolean | true/false | `roofSignal` (bridge operator heard) | kept |
| `twist` | boolean | true/false | `roofConfession` (Nell's confession recorded) | kept |
| `pursuit` | enum | `''` `chasing` `stay` `ramp` `jump` `late` | `roofQuiet` buttons set `chasing` or `stay`; `chaseQteB` sets `ramp`, `jump` or `late` | kept |
| `tail` | boolean | true/false | `tramSpotted` (Rook spotted Krane's car from the tram roof) | new |
| `keeper` | boolean | true/false | `marketKeeper` (Rook heard the stall keeper) | new |
| `market` | enum | `''` `slip` `cut` `late` | `marketResult` (cart prompt) | new |
| `club` | enum | `''` `duck` `vault` `late` | `clubResult` (bottle prompt) | kept |
| `firstMove` | enum | `''` `dodge` `brake` `late` | `chaseBank` (carrier prompt) | kept |
| `gap` | integer | 0, 1, 2 | `chaseQteA`: dodge 0, brake 1, late 2 | kept |
| `tunnel` | enum | `''` `right` `left` `late` | `tunnelFinish` (fork prompt) | kept |
| `caught` | boolean | true/false | `chaseQteB` (jump with gap 0) or `tunnelQte` (right with gap <= 1; left with radio) | kept |
| `hall` | enum | `''` `dive` `breaker` `late` | `subResult` (rack prompt) | new |
| `slip` | boolean | true/false | `roomDeduce` on a wrong answer (dawn deduction) | new |
| `rewinds` | integer | 0..3 | rewinds; also decremented by one at `loftDeduce` on a wrong answer | kept |

Derived terms used throughout this sheet (never stored):

- `ledger` = `rescue === 'valve'` (the signed battery-transfer ledger is dry and legible).
- `chip` = `club === 'vault'` (the Filament chip with the lot numbers).
- `manifest` = `hall === 'breaker'` (the Substation Nine loading manifest with the countersignature).
- `proof` = `ledger || manifest` (a document that carries a Lumen Board signature above Vale's; the chip ties the batteries to Vale but names nobody above him).
- `kranePinned` = `hall === 'dive'`.
- `pursuing` = `pursuit !== '' && pursuit !== 'stay'`.

Prompt windows (seconds), computed from fields at the prompt's entry, clamped to 5..9:

| Prompt | Base | Plus 2 when | Minus 2 when |
| --- | --- | --- | --- |
| `streetQte` (courier) | 7 | `watched` | never |
| `pumpQte` (inlet) | 7 | `decoded` | `wrong` |
| `marketQte` (cart) | 7 | `tail` | `misread` |
| `clubQte` (bottle) | 7 | `market === 'cut'` | `market === 'late'` |
| `chaseQteA` (carrier) | 7 | `radio` | `club === 'late'` |
| `chaseQteB` (bridge) | 7 | `radio` | `club === 'late'` |
| `tunnelQte` (fork) | 7 | `radio` | never |
| `subQte` (rack) | 7 | `keeper` | `tunnel === 'late' || pursuit === 'late'` |

## 4. Locations and beats

### 00 / NIGHT DIVISION (set `office`)

- Chapter card: `NIGHT DIVISION`. Objective: `A MISSING LAMPLIGHTER`.
- Exit point: the stairwell door at the end of the corridor, past the dark desks.
- Whole location is a skippable prologue; every phase carries `[SKIP INTRO]`, which enters `streetBrief`.

**officeEntry** (cutscene, 8s)
- Caption: `Night Division, 23:40. Nine days of rain. Rook's desk lamp is the only light still burning on the floor.`
- Buttons: `[SKIP INTRO]` -> `streetBrief`.
- Camera: a slow push from the dark corridor toward the one lit desk, the rain-streaked window beyond it.
- Next: `officeFile`.

**officeFile** (cutscene, 5s)
- Caption: `The file: IVO BELL, lamplighter, missing four nights. Last seen at the closed North Station. Attached, a report that someone is walking his route with his lantern.`
- Buttons: `[SKIP INTRO]` -> `streetBrief`.
- Camera: down onto the desk, the file open under the lamp, the name I. BELL readable.
- Next: `officeBoard`.

**officeBoard** (cutscene, 5s) NEW
- Caption: `On the case board, beside Bell's photograph, a commendation: INSPECTOR A. VALE, GRID SECURITY LIAISON, LUMEN BOARD. His office is the dark one across the corridor.`
- Clue: `Case board: Inspector Aurel Vale of Night Division is the Lumen Board's grid security liaison. His office is next to Rook's.`
- Buttons: `[SKIP INTRO]` -> `streetBrief`.
- Camera: pans left to the case board, two pinned photographs, then a glance across the corridor to a closed door with no light under it.
- Next: `officeWindow`.

**officeWindow** (cutscene, 6s)
- Caption: `Rook takes his coat. Below the window the city runs on power it cannot account for, and one street on the lamplighter's route has gone dark.`
- Buttons: `[SKIP INTRO]` -> `streetBrief`.
- Camera: rises to the window; uptown towers blaze, the low district beyond the station is a band of black.
- Next: `streetBrief` (scene change to `street`).

### 01 / STATION ROAD (set `street`)

- Chapter card: `STATION ROAD`. Objective: `FIND BELL`.
- Exit point: the pump-room service hatch beside the station steps (existing exit), or, on the loft branch, the lamp depot's stair door on the left of the street.
- These phases keep the existing ids where they exist (`brief`, `watch`, `ready`, `follow`, `danger`, `qte`, `result`, `evidence`, `deduce`, `arrival`). The names below are the sheet's ids; engineers may keep the old names.

**streetBrief** (quiet choice) [existing `brief`]
- Caption: `Rook's case: find lamplighter Ivo Bell. He vanished at the closed station. Tonight, a stranger is carrying his lantern.`
- Buttons: `[FOLLOW THE LANTERN]` -> `streetFollow`; `[WATCH FIRST / 8s]` -> `streetWatch`.
- Camera: the long street from the curb, the lantern a warm point moving away between the tram rails.

**streetWatch** (timed observation, 8s) [existing `watch`]
- Caption: `Rook watches from the curb. The stranger holds a dispatch book and keeps weight off one leg.`
- Timed out: -> `streetReady`.
- Camera: holds on the stranger at mid distance; the limp is the only motion that breaks rhythm.

**streetReady** (quiet choice) [existing `ready`]
- Sets `watched = true`. Stinger `NOTED`.
- Caption: `The courier is limping. Rook will have two extra seconds to react if that leg gives way.`
- Clue: `The courier favors an injured leg. You can anticipate the stumble.`
- Buttons: `[FOLLOW THE LANTERN]` -> `streetFollow`.
- Camera: same as the watch, tightened on the leg and the book under the arm.

**streetFollow** (cutscene, 6s) [existing `follow`]
- Caption: `Rook keeps to the shadows. The stranger heads toward the station clock. A red car idles at the far corner with its lights off, then pulls away.`
- Camera: tracks Rook along the shopfronts; the red car is a shape at the end of the street, tail lights only as it leaves.
- Next: `streetDanger`.

**streetDanger** (windup, 2s) [existing `danger`]
- Caption: `A boot catches the wet tram rail. The courier pitches forward; the dispatch book slips free. Get ready.`
- Camera: cuts in close and low on the rail, the courier's boot, the book leaving the hand.
- Next: `streetQte`.

**streetQte** (prompt, 7s, +2 `watched`) [existing `qte`]
- Danger: the courier falls toward the rail; the book falls toward a running gutter. Telegraph: the limp seen in the watch, the gutter water under the `[2]` label, the courier's outstretched arm under `[1]`.
- Caption: `Catch the courier, or save the dispatch book before the rain destroys it.`
- `[1] CATCH THE COURIER` -> `choice = 'person'` -> `streetResult`. Right: Rook has a witness; the book is ruined.
- `[2] SAVE THE BOOK` -> `choice = 'book'` -> `streetResult`. Right: Rook has the intact entry; the courier limps away.
- Missed: `choice = 'missed'` -> `streetResult`. The book is ruined and the courier is gone.
- Rewind: resets `choice = ''`, re-enters `streetDanger`.
- Camera: fixed wide on the rail with both targets in frame; the `[1]` over the courier, the `[2]` over the book.

**streetResult** (result) [existing `result`]
- Stinger: person `CAUGHT`; book `SAVED`; missed `TOO LATE`.
- Caption, person: `Rook catches the courier. The book hits the wet street; ink begins to run.`
- Caption, book: `Rook saves the book. The courier catches their balance and limps away toward the station.`
- Caption, missed: `Rook reaches too late. The book falls into the water, and the courier limps away.`
- Buttons: after a miss, `[REWIND THE MOMENT / n LEFT]` and `[CARRY ON]` -> `streetEvidence`. Otherwise advances after 4s to `streetEvidence`.
- Camera: holds the prompt frame, then settles on what Rook is holding.

**streetEvidence** (quiet choice) [existing `evidence`]
- Clue, person: `Nell says Bell is alive below the station, in Pump Room 4. The service knock is three short taps.`
- Clue, book: `An intact dispatch entry reads: 00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN.`
- Clue, missed: `The dispatch pages are ruined. PUMP ROOM 4 is embossed into the cover.`
- Caption, person: `Nell: "Bell is alive. Pump Room 4, below the station. Knock three times. I will take you."`
- Caption, book: `The page is fresh: "00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN." The station is still being used. The courier's lantern is stencilled BELL / DEPOT LOFT.`
- Caption, missed: `The rain has erased the entries. The cover still reads "PUMP ROOM 4." The lantern the courier dropped is stencilled BELL / DEPOT LOFT.`
- Buttons: `[CONNECT THE CLUE]` -> `streetDeduce`.
- Camera: close on the page or the cover in Rook's hands; on the non-person routes the dropped lantern sits in the gutter behind it.

**streetDeduce** (quiet choice, deduction 1) [existing `deduce`, improved]
- Caption, first visit: `Bell is somewhere below. Where does the trail go first?`
- Caption, after a wrong answer: `The hotel desk has no Bell and the tram is empty. The clue says PUMP ROOM 4, and pump rooms sit under the station. Rook has lost minutes; the water below has not.`
- Buttons (person route, 2): `[THE STATION SERVICE DOOR]` (right) -> `streetArrival`; `[THE HOTEL ACROSS THE ROAD]` (wrong) -> `wrong = true`, redraw this phase with the wrong caption.
- Buttons (book or missed route, 3): `[THE STATION SERVICE DOOR]` (right) -> `streetArrival`; `[BELL'S LOFT OVER THE DEPOT]` (right, the long way) -> `streetLoftTurn`; `[THE HOTEL ACROSS THE ROAD]` (wrong) -> `wrong = true`, redraw.
- Cost of a wrong answer: `wrong = true`, which takes 2 seconds off the pump-room window and adds `Chased a false lead` to the route. Only the first wrong answer costs anything; the button stays wrong but the caption already explains.
- Camera: pulls back to the wide street so the station steps, the hotel sign and the depot stair are all visible.

**streetLoftTurn** (cutscene, 4s) NEW (book or missed routes only)
- Caption: `Rook wants to know what Bell knew before he goes under the station. The depot loft is two doors back, up an iron stair.`
- Camera: turns from the station to the lamp depot on the left of the street; a lit window over the depot doors.
- Next: `loftEntry` (scene change to `loft`).

**streetArrival** (cutscene, 5s) [existing `arrival`]
- Caption, person: `Nell leads Rook to the service hatch. Three short knocks.`
- Caption, otherwise: `Rook follows the rails to the station and finds the pump-room service hatch.`
- Camera: glides toward the hatch beside the station steps; the PUMP 4 stencil comes into focus.
- Next: `stationEntry` (scene change to `station`). The old `ending` phase and its `[ENTER THE STATION]` button are removed; the exit beat carries the line.

### 01b / BELL'S LOFT (set `loft`) NEW

- Chapter card: `THE DEPOT LOFT`. Objective: `WHAT BELL KNEW`.
- Exit point: the loft's street window, open on the rain, the station clock visible through it.
- Reached only when `choice !== 'person'` and the player chose the loft at `streetDeduce`. It costs the player nothing in fields; it gives a second deduction, a clue about the batteries' destination and Nell's note.

**loftEntry** (cutscene, 7s)
- Sets `loftSeen = true`.
- Caption: `One room over the lamp depot. A cot, a kettle, a wall of route maps pinned with battery tags. Someone has been here since Bell went missing: the kettle is warm.`
- Camera: up the iron stair, through the door, a slow pan across the room ending on the map wall.
- Next: `loftTable`.

**loftTable** (quiet choice)
- Caption: `On the table, a folded note weighted with a lamp key. On the wall, Bell's route map: lamps 14 to 19 crossed out in red and tagged RESERVE PULLED / ORDER 7731 / A.V. Beside it, photographs.`
- Buttons: `[READ THE NOTE]` -> `loftNote`; `[STUDY THE MAP AND PHOTOGRAPHS]` -> `loftBoard`.
- Camera: from the doorway, the table in the foreground and the map wall behind, the red crosses legible.

**loftNote** (quiet choice)
- Sets `note = true`. Stinger `NOTED`.
- Caption: `The note, in a quick hand: "Ivo. I called it in so the Board would have to log you at the station. I did not think. Forgive me. N." Rook folds it into the file.`
- Clue: `A note in Bell's loft, signed N.: the maintenance call that put Bell at the station was made by someone who wanted the Board to log him there.`
- Buttons: `[STUDY THE MAP AND PHOTOGRAPHS]` -> `loftBoard`.
- Camera: close on the note under the lamp key.

**loftBoard** (quiet choice, deduction 2)
- Caption, first visit: `The photographs: a red car at a loading bay behind a neon sign, THE FILAMENT. A Lumen Board van. A man in a division coat who does not look at the camera. Where are the batteries going?`
- Caption, after a wrong answer: `The depot and the station have nothing to hide; Bell would not photograph his own workplace. The club's back door and the Board's van are in the same frame. Rook has spent a rewind's worth of night getting it wrong.`
- Buttons: `[UPTOWN, THROUGH THE FILAMENT]` (right) -> `loftLeave`; `[BACK TO THE LAMP DEPOT]` (wrong) -> `misread = true`, `rewinds = max(0, rewinds - 1)`, redraw with the wrong caption; `[INTO THE STATION VAULTS]` (wrong) -> same as the other wrong answer.
- Only the first wrong answer costs a rewind and sets `misread`. `misread` also takes 2 seconds off the night-market window: Rook arrives with Krane closer.
- Clue (on the right answer): `Bell's photographs: reserve batteries leave by the Filament's back door into a Lumen Board van. The man in the division coat is Vale.`
- Camera: tight on the three photographs pinned in a row; the club's sign is the brightest thing in them.

**loftLeave** (cutscene, 4s)
- Caption: `Rook takes the photographs. Through the window, the station clock reads five past midnight. Bell's job is still open.`
- Camera: to the open window and the station clock across the street.
- Next: `stationEntry` (scene change to `station`).

### 02 / NORTH STATION (set `station`)

- Chapter card: `NORTH STATION`. Objective: `FIND BELL`.
- Exit point: the PUMP ROOM 4 service ladder at the end of the concourse (existing).

**stationEntry** (cutscene, 7s)
- Caption, person: `Nell opens the service door with three taps. Footsteps echo through the empty concourse.`
- Caption, otherwise: `The service latch gives under Rook's shoulder. Inside, a maintenance desk glows in an otherwise empty station.`
- Camera: the existing concourse entry, pendants lit one after another toward the desk.
- Next: `stationQuiet`.

**stationQuiet** (quiet choice)
- Caption: `A fresh order on the desk: INSPECTOR VALE / RESERVE BATTERIES / ORDER 7731. A maintenance tape is still turning. Below the floor, someone strikes a pipe.`
- Clue: `Maintenance desk: order 7731, RESERVE BATTERIES, signed INSPECTOR VALE. The same number Bell tagged on his route map.`
- Buttons: `[READ THE TAPE / 8s]` -> `stationListen`; `[FOLLOW THE KNOCKING]` -> `pumpEntry`.
- Camera: the desk from Rook's height, the order on top, the tape reels turning; the MAINTENANCE label and the PUMP ROOM 4 label both in frame.

**stationListen** (timed observation, 8s)
- Caption: `Rook feeds the tape through its reader. Rain ticks against the roof glass. The knocking below continues.`
- Timed out: -> `stationReady`.
- Camera: close on the reels, then a slow tilt toward the floor where the knocking comes from.

**stationReady** (quiet choice)
- Sets `decoded = true`. Stinger `DECODED`.
- Caption: `The tape warns: "FLOOD RESCUE: CLOSE INLET FIRST." Rook knows which wheel to reach for. Extra reaction time earned.`
- Clue: `The maintenance tape says: close the INLET wheel before pulling someone off the flooded platform.`
- Buttons: `[FOLLOW THE KNOCKING]` -> `pumpEntry`.
- Camera: same as the listen; the ladder to PUMP ROOM 4 comes up on the right.

### 03 / PUMP ROOM 4 (set `pump`)

- Chapter card: `PUMP ROOM 4`. Objective: `GET BELL OUT`, then `GET BELL TO SAFETY` from `pumpResult`.
- Exit point: the service stair up beside the far pump (existing).

**pumpEntry** (cutscene, 6s)
- Caption: `Under the station, pumps tower above black water. A man on the far platform is tapping a wrench against a pipe.`
- Camera: the existing descent; the platform and BELL label far across the water.
- Next: `pumpFind`.

**pumpFind** (quiet choice)
- Caption: `Bell: "Vale took the reserve batteries. I found his ledger, so he locked me down here. That pipe will not hold much longer."`
- Buttons: `[GET BELL OUT]` -> `pumpDanger`.
- Camera: across the water to Bell on the platform, the satchel strap across his chest.

**pumpDanger** (windup, 2s)
- Caption: `A joint splits. Water surges beneath the platform. The INLET wheel is beside Rook; Bell is reaching out. Get ready.`
- Camera: cuts close to the splitting joint, then to the wheel at Rook's hand.
- Next: `pumpQte`.

**pumpQte** (prompt, 7s, +2 `decoded`, -2 `wrong`)
- Danger: the platform is breaking up under Bell while the inlet floods the chamber. Telegraph: the INLET wheel labelled `[1]` at Rook's hand, the water rising past the platform legs under Bell's `[2]`; the tape, if read, has already said which comes first.
- Caption, decoded: `The tape said to close the inlet first. Shut off the flood, or pull Bell out immediately.`
- Caption, otherwise: `Water is climbing. Close the INLET wheel, or pull Bell away from the collapsing platform.`
- `[1] CLOSE THE INLET` -> `rescue = 'valve'` -> `pumpResult`. Right: the water stops, Bell walks across, the satchel and ledger stay dry.
- `[2] PULL BELL OUT` -> `rescue = 'pull'` -> `pumpResult`. Right, at a cost: Bell is safe; the satchel and ledger go into the torrent.
- Missed: `rescue = 'late'` -> `pumpResult`. Bell is pulled out by luck (or by Nell's line); the ledger is lost.
- Rewind: resets `rescue = ''`, re-enters `pumpDanger`.
- Camera: fixed wide with the wheel on the left and Bell on the right, water level visible against the platform legs.

**pumpResult** (result)
- Stinger: valve `INLET CLOSED`; pull `BELL IS OUT`; late `TOO LATE`.
- Caption, valve: `Rook shuts the inlet, then helps Bell across. His satchel stays above the water.`
- Caption, pull: `Rook pulls Bell onto the walkway. His satchel drops into the torrent.`
- Caption, late + person: `Nell throws a line. Rook and Nell haul Bell clear, but the water takes his satchel.`
- Caption, late otherwise: `Bell leaps as the platform breaks. Rook catches his sleeve. His satchel vanishes into the flood.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `pumpTruth`. Otherwise advances after 4s to `pumpTruth`.
- Camera: holds the prompt frame; on valve the water drops visibly, on the others the platform is gone.

**pumpTruth** (quiet choice)
- Clue: `Bell identifies Inspector Vale: Vale sold the emergency batteries, then locked Bell in the pump room to silence him.`
- Clue, valve: `Recovered: Vale's signed battery-transfer ledger, dry and legible. Every page is countersigned with a second initial: H.A.`
- Clue, otherwise: `The flooded ledger is unreadable. Bell can testify, but the written proof is lost.`
- Caption, valve: `The dry ledger bears Vale's signature, and under every entry a second set of initials Bell does not know: H.A. The city's emergency batteries were sold. The locked room was meant to silence him.`
- Caption, otherwise: `Bell: "Vale sold the emergency batteries. When I confronted him, he locked me in. The proof was in that satchel. I will say it in court."`
- Buttons: `[TAKE BELL TO THE ROOF]` -> `roofEntry` (scene change to `roof`).
- Camera: Rook and Bell on the dry walkway, the ledger open between them or the empty strap across Bell's chest.

### 04 / ABOVE THE CITY (set `roof`)

- Chapter card: `ABOVE THE CITY`. Objective: `VALE, OR BELL`.
- Exit point: the roof's service lift cage (existing), used for both the tram and the stay routes.

**roofEntry** (cutscene, 8s)
- Caption: `Rook brings Bell up the service stair. The city opens beneath them. Flying traffic passes between the towers; a medic answers the roof radio.`
- Camera: the existing roof entry; the medic and the NORTH / RADIO mast.
- Next: `roofQuiet`.

**roofQuiet** (quiet choice)
- Caption: `Bell is safe with the medic. Far below, a red car pulls away from the station forecourt and heads west under the elevated road, toward the market and the Filament's sign. The last tram of the night is crossing the dark district the same way.`
- Clue: `Seen from the roof: Vale's red car leaves the station westward, toward the night market under the elevated road and The Filament.`
- Buttons: `[LISTEN TO THE RADIO / 8s]` -> `roofListen` (hidden once `radio` is true); `[PURSUE VALE]` -> `pursuit = 'chasing'`, `gap = 0`, `caught = false` -> `tramEntry`; `[STAY WITH BELL]` -> `pursuit = 'stay'`, `caught = false` -> `roomEntry`.
- Camera: from behind Rook at the parapet, the red tail lights small on the road below, the tram's lit windows crossing the black district.

**roofListen** (timed observation, 8s)
- Caption: `Rook waits on the open channel. Traffic slides through the rain. A bridge operator comes through the static.`
- Timed out: -> `roofSignal`.
- Camera: close on the radio set, the towers behind it.

**roofSignal** (quiet choice)
- Sets `radio = true`. Stinger `SIGNAL`.
- Clue: `Radio traffic: the canal bridge lifts at the half hour. The lower service ramp reaches the canal basin first. A Lumen Board van is booked through to Substation Nine.`
- Caption, person: `Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Beside the receiver, Nell goes quiet. "There is something about Bell's work order I should tell you."`
- Caption, otherwise: `Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Rook now knows a way to intercept Vale and has extra time at every turn of the road.`
- Buttons: person only: `[ASK NELL ABOUT THE ORDER]` -> `roofConfession`; then `[PURSUE VALE]` and `[STAY WITH BELL]` as in `roofQuiet`.
- Camera: the radio in the foreground, Nell (when present) at the parapet with the lantern at her feet.

**roofConfession** (quiet choice)
- Sets `twist = true`. Stinger `CONFESSION`.
- Clue: `Nell admits forging the maintenance order to bring Bell here and expose Vale. Nell did not foresee the trap.`
- Caption: `Nell: "I forged the maintenance call. Bell was the only person who could prove the batteries were missing. I wanted Vale exposed. I did not know he would trap him." Rook records the confession.`
- Buttons: `[PURSUE VALE]` and `[STAY WITH BELL]` as in `roofQuiet`.
- Camera: two-shot, Nell and Rook, Bell and the medic out of focus behind.

### 04b / THE LAST TRAM (set `tram`) NEW, bridge between the acts

- Chapter card: `THE LAST TRAM`. Objective: `CROSS THE DARK`.
- Exit point: the tram's front rail, looking down at Market Arch as the tram slows.
- A moving cutscene set. The camera rides the tram roof; the dark district slides past below, unlit lamps on their posts, one lit window in ten. Rook rides the roof because the road under the elevated is jammed with the night-market crowd and the tram is the only thing moving over it. Dispatch will bring the patrol car round to Market Arch.

**tramEntry** (cutscene, 8s)
- Caption: `Rook drops from the service lift onto the roof of the last tram. Below, lamps 14 to 19 stand dark on their posts. Dispatch will bring the patrol car round to Market Arch.`
- Camera: low on the tram roof, looking forward along the wire; dark lamp posts pass on both sides.
- Next: `tramRide`.

**tramRide** (quiet choice)
- Caption: `The tram crosses the dark district on its own reserve. Behind it, one pair of headlights keeps the same speed on the road below, then goes dark.`
- Buttons: `[WATCH THE ROAD / 8s]` -> `tramWatch`; `[RIDE ON]` -> `tramArrive`.
- Camera: turns to look back and down along the tram's length at the road running beside the rails.

**tramWatch** (timed observation, 8s)
- Caption: `Rook watches the road. The car with no lights holds its distance. A division plate, black body. It is not dispatch.`
- Timed out: -> `tramSpotted`.
- Camera: holds on the road behind, the black car a shape with no lights catching the wet.

**tramSpotted** (quiet choice)
- Sets `tail = true`. Stinger `NOTED`.
- Clue: `A black Night Division car, plate 41, follows the tram with its lights off. Somebody in the division wants to know where Rook goes.`
- Caption: `Plate 41, a Night Division car, and it is following the tram. Whoever is driving it will be in the market before Rook is. He will see them coming.`
- Buttons: `[RIDE ON]` -> `tramArrive`.
- Camera: same, then forward as the market lights come up ahead.

**tramArrive** (cutscene, 5s)
- Caption: `Market Arch. Stalls under the elevated road, lit by lamps that should be on the lamplighter's posts. The tram slows and Rook goes over the rail.`
- Camera: forward and down over the rail to the arch, the market a pool of stolen light under the concrete.
- Next: `marketEntry` (scene change to `market`).

### 05a / THE NIGHT MARKET (set `market`) NEW

- Chapter card: `THE NIGHT MARKET`. Objective: `REACH THE FILAMENT`.
- Exit point: the far end of the market aisle where the neon of The Filament shows through the stalls.

**marketEntry** (cutscene, 8s)
- Caption: `Stalls, awnings, a crowd that does not part. Every stall lamp is a reserve cell with a Lumen Board serial. At the end of the aisle, The Filament's sign burns pink through the rain.`
- Clue: `The night market runs on reserve cells stamped with Lumen Board serials. The stolen batteries are being sold by the cell.`
- Camera: tracks Rook into the aisle at shoulder height; stall lamps pass close, the club sign a pink smear at the far end.
- Next: `marketAisle`.

**marketAisle** (quiet choice)
- Caption, tail: `A woman sells cells from a cart marked QUILL. The black car from the road is parked under the arch, empty. Rook can ask where the cells come from, or push on before its driver finds him.`
- Caption, otherwise: `A woman sells cells from a cart marked QUILL. Behind Rook, someone big is moving through the crowd without buying anything. Rook can ask where the cells come from, or push on.`
- Buttons: `[ASK THE STALL KEEPER]` -> `marketKeeper`; `[PUSH THROUGH TO THE CLUB]` -> `marketDanger`.
- Camera: the cart in the foreground with its rack of cells; the crowd behind Rook, one head taller than the rest.

**marketKeeper** (quiet choice)
- Sets `keeper = true`. Stinger `NOTED`.
- Clue: `Marta Quill, stall keeper: the cells come from Substation Nine on the canal basin, Thursdays, in a Lumen Board van. The racks in the hall are chained on the left, loose on the right.`
- Caption: `Marta Quill does not look up from her cells. "Nine, on the basin. Thursdays, Board van. They chain the racks on the left and leave the right loose, if you are thinking of going." Rook is.`
- Buttons: `[PUSH THROUGH TO THE CLUB]` -> `marketDanger`.
- Camera: close on Marta and the cart, the serials on the cells legible.

**marketDanger** (windup, 2s)
- Caption: `The big man is Krane, Vale's bodyguard, and he has seen Rook. He puts his shoulder into a loaded cell-cart and sends it down the aisle. Get ready.`
- Camera: cuts to Krane at the top of the aisle, the cart tipping into motion, the crowd scattering.
- Next: `marketQte`.

**marketQte** (prompt, 7s, +2 `tail`, -2 `misread`)
- Danger: a cart of reserve cells comes down the sloped aisle at Rook; the cells will spill and short on the wet ground. Telegraph: the cart's line down the aisle, a gap between two stalls on the left under `[1]`, an awning rope on the right under `[2]` that leads up and over the stalls toward Krane.
- Caption: `The cart is coming down the aisle. Slip into the gap on the left, or go up the awning rope and over the stalls after Krane.`
- `[1] SLIP INTO THE STALL` -> `market = 'slip'` -> `marketResult`. Right: the cart passes, Rook is unhurt, Krane is gone by the time Rook is back in the aisle.
- `[2] GO OVER THE STALLS` -> `market = 'cut'` -> `marketResult`. Right, with a reward: Rook clears the cart, keeps Krane in sight and watches him go in by the Filament's back door on Vine Alley; the club prompt gains 2 seconds.
- Missed: `market = 'late'` -> `marketResult`. The cart takes Rook's legs; cells spill and arc; Rook is cut and slow; the club prompt loses 2 seconds.
- Rewind: resets `market = ''`, re-enters `marketDanger`.
- Camera: fixed wide down the aisle; the cart in the middle distance, the stall gap and the rope framing it left and right.

**marketResult** (result)
- Stinger: slip `CLEAR`; cut `OVER THE STALLS`; late `HIT`.
- Caption, slip: `Rook goes into the gap. The cart goes past and into the arch pier; cells burst white against the concrete. Krane is gone.`
- Caption, cut: `Rook goes up the rope and over the awnings as the cart passes under him. Krane is ahead, moving fast, and he goes in by a door marked VINE ALLEY behind The Filament.`
- Caption, late: `The cart takes Rook at the knee. Cells spill and arc on the wet ground. He gets up cut and slow, and Krane is gone.`
- Clue, cut: `Krane entered The Filament by the back door on Vine Alley. The back door is the way out too.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `clubEntry`. Otherwise advances after 4s to `clubEntry` (scene change to `club`).
- Camera: holds the prompt frame, then looks up the aisle to the club sign.

### 05 / THE FILAMENT (set `club`)

- Chapter card: `THE FILAMENT`. Objective: `CATCH VALE`.
- Exit point: the back door under the NO EXIT sign (existing).

**clubEntry** (cutscene, 8s)
- Caption, cut: `Vale's red car sits in Vine Alley. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up. Rook comes in by the back and Krane is already at the booth.`
- Caption, otherwise: `Vale's red car sits outside The Filament. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up.`
- Camera: the existing club entry along the bar toward the back booth.
- Next: `clubFace`.

**clubFace** (windup, 2s)
- Caption: `Vale is in the back booth. He sees Rook. Krane rises, and a bottle leaves his hand. Get ready.`
- Camera: cuts to the booth, Vale's face turning, Krane's arm.
- Next: `clubQte`.

**clubQte** (prompt, 7s, +2 `market === 'cut'`, -2 `market === 'late'`)
- Danger: a thrown bottle at head height. Telegraph: the bottle's arc from the booth toward the neon behind Rook; the bar top clear and lit under `[2]`; the floor under `[1]`.
- Caption: `Duck under the bottle, or go over the bar and cut Krane off before Vale reaches the back door.`
- `[1] DUCK` -> `club = 'duck'` -> `clubResult`. Right: unhurt, but Vale reaches the back door and his car.
- `[2] VAULT THE BAR` -> `club = 'vault'` -> `clubResult`. Right, with a reward: Rook lands between Krane and the booth; Vale's chip case spills; Rook pockets a chip stamped with the lot numbers.
- Missed: `club = 'late'` -> `clubResult`. The bottle catches Rook's shoulder; the road prompts lose 2 seconds.
- Rewind: resets `club = ''`, re-enters `clubFace`.
- Camera: fixed on the bar from Rook's side, booth at the far end, `[1]` low, `[2]` on the bar top.

**clubResult** (result)
- Stinger: duck `DUCKED`; vault `OVER THE BAR`; late `HIT`.
- Caption, duck: `The bottle bursts on the neon behind Rook. Vale is already through the back door and into his car.`
- Caption, vault: `Rook goes over the bar and lands between Krane and the booth. Vale's chip case spills across the table. Rook pockets one chip and follows him out.`
- Caption, late: `The bottle catches Rook's shoulder. He is up in a second, but Vale has the back door and a head start.`
- Clue, vault: `A Filament casino chip from Vale's case, stamped with the reserve-battery lot numbers. The club launders the sales.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `chaseEntry`. Otherwise advances after 4s to `chaseEntry` (scene change to `chase`, distance reset to 20).
- Camera: holds the prompt frame; on vault the chips scatter as lamp glyphs on the table.

### 06 / THE ELEVATED ROAD (set `chase`)

- Chapter card: `THE PURSUIT`. Objective: `CATCH VALE`.
- Exit point: the road ahead, 40 units beyond the camera (existing).

**chaseEntry** (cutscene, 6s)
- Caption: `The patrol car is in Vine Alley with the keys in, as dispatch promised. Vale's red tail lights race ahead. The empty street gives way to dense elevated traffic.`
- Camera: the existing chase entry, behind the patrol car, red tail lights ahead.
- Next: `chaseQteA`.

**chaseQteA** (prompt, 7s, +2 `radio`, -2 `club === 'late'`)
- Danger: a freight carrier swings across into Rook's lane. Telegraph: the carrier's FREIGHT label drifting left to right across the lane, the right lane lit and clear under `[2]`, brake lights ahead under `[1]`.
- Caption: `A freight carrier swings into Rook's lane. The right lane is clear. Brake and lose ground, or dive right to stay close.`
- `[1] BRAKE` -> `firstMove = 'brake'`, `gap = 1` -> `chaseBank`. Right, at a cost: safe, but Vale opens a gap; the bridge jump will not be possible.
- `[2] DIVE RIGHT` -> `firstMove = 'dodge'`, `gap = 0` -> `chaseBank`. Right: Rook stays on Vale's bumper.
- Missed: `firstMove = 'late'`, `gap = 2` -> `chaseBank`. The patrol car clips the carrier and fishtails; Vale opens a long gap.
- Rewind: resets `firstMove = ''`, `gap = 0`, re-enters `chaseQteA` directly (no separate windup; the entry cutscene serves as the windup and `GET READY` shows at the prompt's start).
- Camera: behind and slightly above the patrol car; the carrier fills the left half of the frame.

**chaseBank** (result)
- Stinger: dodge `CLEAR`; brake `BRAKING`; late `CLIPPED`.
- Caption, dodge: `Rook swings right and surges past the carrier. Vale is still within reach.`
- Caption, brake: `The patrol car falls back under braking. Rook needs an interception route.`
- Caption, late: `The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `chaseQteB`. Otherwise advances after 6s to `chaseQteB`.
- Camera: the road under the signal gantries, the gap to Vale readable by the VALE label's distance.

**chaseQteB** (prompt, 7s, +2 `radio`, -2 `club === 'late'`)
- Danger: the canal bridge is lifting; the deck splits ahead. Telegraph: the BRIDGE LIFTING label and the rising deck under `[2]`; the lower service ramp peeling off left under `[1]`; the VALE label's distance says whether a jump can be made.
- Caption, radio: `The radio marked the lower ramp as clear. ` followed by the gap sentence.
- Caption, otherwise: `The bridge ahead is lifting. ` followed by the gap sentence.
- Gap sentence, `gap === 0`: `Rook is close enough to follow Vale over the gap, or drop down the ramp into the storm drains.`
- Gap sentence, otherwise: `Vale is too far ahead for a safe jump. The lower service ramp into the storm drains is Rook's best chance.`
- `[1] TAKE THE LOWER RAMP` -> `pursuit = 'ramp'`, `caught = false` -> `tunnelEntry` (scene change to `tunnel`). Right: the drains reach the basin first; the fork decides it.
- `[2] FOLLOW OVER THE GAP` -> `pursuit = 'jump'`, `caught = gap === 0` -> `chaseFinish`. Right only when the gap is 0; otherwise Rook aborts the jump and Vale is gone.
- Missed: `pursuit = 'late'`, `caught = false` -> `chaseFinish`. Rook brakes at the rising deck.
- Rewind: resets `pursuit = 'chasing'`, `caught = false`, re-enters `chaseQteB`.
- Camera: forward over the patrol car's roof; the bridge deck rising centre, the ramp mouth low left.

**chaseFinish** (result)
- Stinger: caught `GOT HIM`; otherwise `GONE`.
- Caption, caught: `The patrol car clears the gap. Rook forces Vale to stop at the basin exit, under the lit windows of Substation Nine.`
- Caption, late: `Rook brakes at the rising bridge. Vale disappears toward the basin. Beyond the canal, the windows of Substation Nine are lit at one in the morning.`
- Caption, jump with gap: `The gap is already too wide. Rook aborts the jump and brakes hard. Vale gets away toward the basin, where Substation Nine is lit at one in the morning.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `subEntry`. Otherwise advances after 6s to `subEntry` (scene change to `substation`).
- Camera: the far side of the bridge, or the raised deck; in every case the substation's lit windows across the basin.

### 07 / THE UNDERCITY (set `tunnel`)

- Chapter card: `THE UNDERCITY`. Objective: `CATCH VALE`.
- Exit point: the drain ahead, 40 units beyond the camera (existing).

**tunnelEntry** (cutscene, 6s)
- Caption: `The service ramp drops below the road into the storm drains. Vale's tail lights bounce off wet brick, and the sound of two engines fills the tunnel.`
- Camera: the existing drain entry; emergency neon on brick.
- Next: `tunnelQte`.

**tunnelQte** (prompt, 7s, +2 `radio`)
- Danger: the drain forks at a brick pier at speed; the left channel is unlit. Telegraph: Vale's tail lights bending right under the canal gate under `[1]`; the left channel's mouth under `[2]`, marked MAINT on the brick; the radio, if heard, has said the maintenance channel reaches the basin first.
- Caption, radio: `The bridge operator said the maintenance channel reaches the basin first. ` followed by the fork sentence.
- Fork sentence: `The drain forks ahead. Vale takes the right branch under the canal gate.`
- `[1] FOLLOW RIGHT` -> `tunnel = 'right'`, `caught = gap <= 1` -> `tunnelFinish`. Right when Vale is close; with a long gap Vale has too much road.
- `[2] CUT LEFT` -> `tunnel = 'left'`, `caught = radio` -> `tunnelFinish`. Right when Rook heard the operator; otherwise the channel ends at a locked gate.
- Missed: `tunnel = 'late'`, `caught = false` -> `tunnelFinish`. Rook brakes at the pier.
- Rewind: resets `tunnel = ''`, `caught = false`, re-enters `tunnelQte`.
- Camera: forward, the pier centre, both mouths visible, the MAINT stencil on the left.

**tunnelFinish** (result)
- Stinger: caught `GOT HIM`; otherwise `GONE`.
- Caption, caught left: `Rook takes the maintenance channel and bursts out of the basin outfall ahead of Vale. The red car stops with nowhere left to go, under the lit windows of Substation Nine.`
- Caption, caught right: `Rook stays on Vale's lights through the right branch and forces him against the canal gate. Across the basin, Substation Nine is lit at one in the morning.`
- Caption, late: `Rook brakes at the fork. Both branches are dark. Vale is gone, but every drain here ends at the basin, and the basin is lit by Substation Nine.`
- Caption, left not caught: `The maintenance channel ends at a locked service gate. By the time Rook backs out, Vale is gone. The outfall beyond the gate opens onto the basin and the lit windows of Substation Nine.`
- Caption, right not caught: `Vale has too much road. His lights vanish under the canal gate, toward the basin and the lit windows of Substation Nine.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `subEntry`. Otherwise advances after 6s to `subEntry` (scene change to `substation`).
- Camera: the outfall or the gate, then the basin and the substation windows beyond.

### 08 / SUBSTATION NINE (set `substation`) NEW

- Chapter card: `SUBSTATION NINE`. Objective: `STOP THE LOADING`.
- Exit point: the loading door at the end of the battery hall, open on the basin and the first grey in the sky.
- Reached on every pursuit route. `caught` decides whether Vale is in the patrol car outside or already gone.

**subEntry** (cutscene, 8s)
- Caption, caught: `Vale is cuffed in the back of the patrol car. Rook leaves him there. The battery hall of Substation Nine is lit end to end: racks of reserve cells, a Lumen Board van backed up to the loading door, and men who are not Board engineers loading it.`
- Caption, otherwise: `Vale's car is not here. The loading is. The battery hall of Substation Nine is lit end to end: racks of reserve cells, a Lumen Board van backed up to the loading door, and men who are not Board engineers loading it.`
- Clue: `Substation Nine, the Lumen Board's reserve battery hall on the canal basin: the batteries are being loaded into a Board van by Vale's buyers, on the Board's own premises.`
- Camera: from the hall door down the length of the racks to the van at the far end; the racks on the left chained, the right loose.
- Next: `subManifest`.

**subManifest** (cutscene, 6s)
- Caption: `A manifest hangs on the nearest loose rack: RESERVE TRANSFER / ORDER 7731 / A. VALE, and under it a countersignature, H. ASHE, COMMISSIONER OF RESERVE. The loaders have seen Rook. So has Krane.`
- Clue: `Seen on the rack: the loading manifest is countersigned H. ASHE, Commissioner of Reserve, Lumen Board. Vale is not the top of this.`
- Camera: close on the clipboard on the rack, the two signatures legible, then a rack move to Krane at the van.
- Next: `subDanger`.

**subDanger** (windup, 2s)
- Caption: `Krane puts his back to the loose rack and heaves. Two tonnes of cells tip toward Rook. The hall's main breaker is at Rook's shoulder, handle up. Get ready.`
- Camera: cuts to the rack's top edge leaving vertical, the breaker handle in the near foreground.
- Next: `subQte`.

**subQte** (prompt, 7s, +2 `keeper`, -2 `tunnel === 'late' || pursuit === 'late'`)
- Danger: a loaded battery rack falls toward Rook; when it lands, live cells will short across the wet floor and arc. Telegraph: the rack's lean (the loose racks are on the right, as Marta said), the open floor to the left under `[1]`, the breaker handle up beside Rook under `[2]`, the manifest clipped to the falling rack.
- Caption: `The rack is coming down. Dive clear and let it fall, or pull the breaker so the cells cannot arc and grab the manifest as it goes.`
- `[1] DIVE CLEAR` -> `hall = 'dive'` -> `subResult`. Right: Rook is unhurt. The rack lands on Krane's leg as he loses his footing behind it; the cells arc and burn the manifest; the loaders run; Krane is pinned and arrested.
- `[2] PULL THE BREAKER` -> `hall = 'breaker'` -> `subResult`. Right, at a cost: the hall goes dark, the rack lands dead beside Rook, the manifest is in his hand. In the dark Krane and the loaders are out the loading door and gone. Rook is bruised.
- Missed: `hall = 'late'` -> `subResult`. The rack lands across Rook's legs; the cells arc; the manifest burns; Krane and the loaders leave by the van. Rook drags himself clear.
- Rewind: resets `hall = ''`, re-enters `subDanger`.
- Camera: fixed low and wide at Rook's position; the rack tilts across the top of the frame, the breaker on the right edge, the open floor on the left.

**subResult** (result)
- Stinger: dive `PINNED`; breaker `LIGHTS OUT`; late `CRUSHED`.
- Caption, dive: `Rook goes left. The rack comes down on the floor and on Krane's leg behind it; cells split and arc white. The loaders run. The manifest curls and burns on the rack. Krane does not go anywhere.`
- Caption, breaker: `Rook throws the breaker. The hall goes black and the rack lands dead beside him. He has the manifest in his fist. When the emergency lamps come up, the van is gone and so is Krane.`
- Caption, late: `The rack takes Rook across the legs. Cells arc; the manifest is ash before he can reach it. The van's doors slam. When Rook drags himself clear, the hall is empty.`
- Clue, breaker: `Recovered: the Substation Nine loading manifest, countersigned H. ASHE, Commissioner of Reserve. Written proof that the Board signed above Vale.`
- Clue, dive: `Krane, Vale's bodyguard, arrested at Substation Nine, pinned under the rack he pushed. The manifest burned.`
- Clue, late: `The Substation Nine manifest burned. Krane and the loaders escaped in the Board van.`
- Buttons: after a miss, rewind buttons; `[CARRY ON]` -> `subDawn`. Otherwise advances after 5s to `subDawn`.
- Camera: holds the prompt frame; on dive the rack is down and Krane's sprite is under its edge, on breaker the picture drops to emergency lamps only.

**subDawn** (cutscene, 5s)
- Caption, caught: `Rook walks out through the loading door. Vale watches him from the back of the patrol car. Over the basin the sky is going grey.`
- Caption, otherwise: `Rook walks out through the loading door. The basin is empty and the sky over it is going grey. Whatever is left of tonight will be said in a room at Night Division.`
- Camera: through the loading door to the basin, the patrol car (when Vale is caught) at the kerb, the sky lightening.
- Next: `roomEntry` (scene change to `room`).

### 09 / NIGHT DIVISION, DAWN (set `room`) NEW

- Chapter card: `INTERROGATION`. Objective: `WHO SIGNED`.
- Exit point: the room's door into the corridor, the window at the corridor's end showing first light.
- Reached on every route. Who sits across the table depends on the fields: Vale (`caught`), Krane (`kranePinned` and not `caught`), Bell (`pursuit === 'stay'`), or nobody (everything else: Rook alone with the file).

**roomEntry** (cutscene, 7s)
- Caption, caught: `Night Division, 05:50. Vale sits across the table in the room next to his own office. He has asked for nothing. He is waiting to see what Rook has.`
- Caption, kranePinned and not caught: `Night Division, 05:50. Krane sits across the table with his leg in a splint and a division sergeant's card in his wallet. He worked here too. He is waiting to see what Rook has.`
- Caption, stay: `Night Division, 05:50. Bell gives his statement across the table with the medic's blanket still on his shoulders. Nobody has gone to Vale's office yet. Rook has what Bell knows and what the desk order says.`
- Caption, otherwise: `Night Division, 05:50. The room is empty except for Rook and the file. Vale's office across the corridor is dark and has been cleared out.`
- Camera: from the corridor through the door into the small bright room, the table, whoever sits at it, the corridor window behind Rook.
- Next: `roomDeduce`.

**roomDeduce** (quiet choice, deduction 3)
- The right answer depends on `proof`. With `proof` true the right answer is `[SOMEONE ABOVE VALE SIGNED]`. With `proof` false the right answer is `[NOT ENOUGH TO SAY]`. A wrong answer sets `slip = true` on the first wrong pick only, shows the hint caption, and leaves the buttons in place.
- Caption, first visit, proof: `Order 7731. Rook lays out what he has. Vale's name is on every page, and there is a second hand on the paper. Who signed the order?`
- Caption, first visit, no proof: `Order 7731. Rook lays out what he has: Bell's word, the desk order, what he saw in the hall. Vale's name is on the order. Who signed it?`
- Caption, wrong pick `[VALE SIGNED ALONE]` with proof: `Vale almost smiles. Rook has shown his hand. The initials on every ledger page and the name on the manifest are the same: H. ASHE. Vale does not run the Board; the Board runs Vale.`
- Caption, wrong pick `[VALE SIGNED ALONE]` without proof: `Vale almost smiles; the empty chair would too. A liaison does not commission reserve transfers. Somebody above him did, and Rook cannot yet say who.`
- Caption, wrong pick `[SOMEONE ABOVE VALE SIGNED]` without proof: `Rook believes it, and he cannot show it. The ledger is at the bottom of Pump Room 4 and the manifest is ash. Say what the paper says, not what Rook knows.`
- Caption, wrong pick `[NOT ENOUGH TO SAY]` with proof: `There is enough. Rook looks again at the initials under Vale's signature, page after page: H.A. The manifest spells them out. Rook knows who signed.`
- Buttons (always three): `[VALE SIGNED ALONE]`; `[SOMEONE ABOVE VALE SIGNED]`; `[NOT ENOUGH TO SAY]`. The right one -> `roomName`. A wrong one -> `slip = true` (first time only), redraw with the matching hint caption.
- Cost of a wrong answer: `slip = true`, which forfeits the `ashe` discovery and colours the ending summary ("Vale saw Rook hesitate"). No time or rewind cost this late; the case is already decided by the fields.
- Camera: down onto the table: the ledger (when recovered), the manifest (when recovered), the chip, the desk order, arranged in a row under the lamp.

**roomName** (quiet choice)
- Clue, proof: `Deduction: order 7731 was commissioned by Halden Ashe, Lumen Board Commissioner of Reserve. Vale signed for him. The warrant names both.`
- Clue, no proof: `Deduction: Vale signed for someone on the Board. Without the ledger or the manifest, the case file cannot name who.`
- Caption, proof and caught: `"Halden Ashe," Rook says, and for the first time Vale looks at the door instead of at Rook. Rook writes the name on the warrant under Vale's.`
- Caption, proof and not caught: `Rook writes the name on the warrant: Halden Ashe, Commissioner of Reserve, and under it Aurel Vale. Two men to find. The paper will outlast the night.`
- Caption, no proof and caught: `Vale says nothing, which is what his lawyer will tell him to say. Rook has Bell's word and Vale in the chair. The name above Vale stays off the paper for now.`
- Caption, no proof and kranePinned: `Krane says the Board's man never came to the hall in person and he never learned a name. Rook believes him. Vale's name goes on the warrant alone, for now.`
- Caption, no proof, stay: `Bell signs his statement. Vale's name goes on the warrant on Bell's word and the desk order. Whoever is above Vale will have to wait for daylight.`
- Caption, no proof, otherwise: `Rook closes the file on Vale's name and a blank line under it. The batteries are gone, the hall is burned, and the man who signed for them is still a set of initials.`
- Buttons: `[GO TO BELL]` -> `canalEntry` (scene change to `canal`).
- Camera: the table, then up to Rook's face and the corridor window going from grey to gold.

### 10 / FIRST LIGHT (set `canal`)

- Chapter card: `FIRST LIGHT`. Objective: `FIRST LIGHT`, then `CASE CLOSED` at `canalEnd`.
- Exit point: none (the case ends here). For previews and the menu, the camera rests on the water.

**canalEntry** (cutscene, 7s)
- Caption, stay: `Rook stayed with Bell and escorted him to the canal-side medics. Dawn catches the windows across the water.`
- Caption, caught: `Vale is in custody. Rook returns to Bell as the first light reaches the canal.`
- Caption, otherwise: `Vale escaped tonight. Rook returns to Bell, who is waiting beside the canal with the medics.`
- Camera: the existing canal shot; Rook, Bell and the medic's van, the water going from black to grey.
- Next: `canalEnd`.

**canalEnd** (quiet choice)
- Stinger `CASE CLOSED` (chapter tone, 4s). Records are written here on a story session.
- Caption: the ending's closing caption from section 7.
- Outcome line (the `lc-outcome` element): `caseReport()` followed by the ending's one-line summary from section 7, then the evidence line, then the Nell line.
- Evidence line: `ledger` -> `Evidence: signed ledger recovered. `; `manifest` and not `ledger` -> `Evidence: the Substation Nine manifest. `; neither -> `Evidence: Bell's testimony; ledger lost. `. Then `chip` -> `The Filament chip ties the batteries to Vale's tables. `.
- Nell line: `twist` -> `Nell's forged order is part of the case.`; `choice === 'person'` -> `Nell remains a trusted witness.`; `note` -> `Nell's note is in the file; she has not been found.`; otherwise `Rook worked without Nell.`
- Buttons: `[RETURN TO MENU]`.
- Camera: the lamps along the canal going out one after another as the sun clears the towers.

## 5. Transition lines

One line per ordered pair of sets that can follow each other. The line types in while the camera glides to the exit point.

| From > to | Line |
| --- | --- |
| office > street | `Rook takes the stairs down to Station Road. The rain has not let up.` |
| street > loft | `Two doors back, up the iron stair over the lamp depot. The window is lit.` |
| street > station | `Three knocks, or a shoulder. Either way, the hatch gives.` |
| loft > station | `Down the stair with the photographs in his coat. The station clock says Bell's job is still open.` |
| station > pump | `Down the service ladder, toward the knocking.` |
| pump > roof | `Up the service stair, Bell's arm over Rook's shoulder.` |
| roof > tram | `Down the service lift to the tram stop. The last tram of the night is already slowing.` |
| roof > room | `Rook stays. The medic's van takes them both to Night Division to put it on paper before the canal.` |
| tram > market | `Over the tram rail and down into the light under the arch.` |
| market > club | `Through the last of the stalls. The Filament's sign is loud enough to feel.` |
| club > chase | `Out the back door and into the patrol car. Vale's tail lights are already moving.` |
| chase > tunnel | `The service ramp drops away beneath the road.` |
| chase > substation | `Across the basin, every window of Substation Nine is lit, and it is one in the morning.` |
| tunnel > substation | `The outfall opens onto the basin. Substation Nine is lit end to end.` |
| substation > room | `Back across the city with the sky going grey. Night Division, the room next to Vale's office.` |
| room > canal | `Down to the canal, where Bell is waiting. First light.` |

## 6. Persons of interest

Status text shown in the case file. Each person appears once they are introduced and shows the latest line whose condition holds (conditions are tested top to bottom; the first true line wins). `reached(x)` means the current phase is at or after `x` in story order.

**DETECTIVE ROOK** (always shown)
1. `reached('canalEnd')` and `hall === 'late'`: `DETECTIVE ROOK, Night Division: case closed; walking with a stick for a month.`
2. `reached('canalEnd')`: `DETECTIVE ROOK, Night Division: case closed.`
3. `reached('roomEntry')`: `DETECTIVE ROOK, Night Division: back at the desk with what the night left him.`
4. `reached('subEntry')`: `DETECTIVE ROOK, Night Division: at Substation Nine, alone.`
5. `reached('tramEntry')`: `DETECTIVE ROOK, Night Division: pursuing Vale across the dark district.`
6. `reached('pumpFind')`: `DETECTIVE ROOK, Night Division: found Bell alive.`
7. otherwise: `DETECTIVE ROOK, Night Division, missing-persons desk.`

**IVO BELL, lamplighter** (always shown)
1. `reached('canalEnd')`: `IVO BELL, lamplighter: home. His statement is on record.`
2. `reached('roofEntry')`: `IVO BELL, lamplighter: safe with the medic.`
3. `reached('pumpFind')`: `IVO BELL, lamplighter: found alive in Pump Room 4.`
4. `reached('streetEvidence')` and `choice === 'person'`: `IVO BELL, lamplighter: alive, somewhere below the station.`
5. `reached('streetEvidence')`: `IVO BELL, lamplighter: last logged at Pump Room 4.`
6. otherwise: `IVO BELL, lamplighter: missing since the station closed.`

**NELL MARROW / THE COURIER** (shown from `reached('streetResult')`)
1. `twist`: `NELL MARROW, Bell's apprentice: confessed to forging the work order. Cooperating witness.`
2. `choice === 'person'`: `NELL MARROW, courier: cooperating witness. Says she is Bell's apprentice.`
3. `note`: `THE COURIER: signed a note in Bell's loft with an N. Made the maintenance call. Not yet found.`
4. otherwise: `THE COURIER: limped away toward the station with Bell's lantern.`

**INSPECTOR AUREL VALE** (shown from `reached('officeBoard')`)
1. `caught` and `reached('roomName')` and `proof`: `INSPECTOR VALE, Night Division: in custody. Signed order 7731 for the Board.`
2. `caught`: `INSPECTOR VALE, Night Division: in custody.`
3. `reached('canalEnd')`: `INSPECTOR VALE, Night Division: at large; warrant issued.`
4. `reached('subEntry')`: `INSPECTOR VALE, Night Division: escaped tonight. His buyers are at Substation Nine.`
5. `reached('pumpTruth')`: `INSPECTOR VALE, Night Division: prime suspect. Sold the reserve batteries; locked Bell in.`
6. `reached('stationQuiet')` or (`reached('loftBoard')` and not `misread`): `INSPECTOR VALE, Night Division: named on the battery order.`
7. otherwise: `INSPECTOR VALE, Night Division: grid security liaison to the Lumen Board. Office across the corridor.`

**KRANE, Vale's bodyguard** (shown from `reached('marketDanger')`, or from `reached('tramSpotted')` when `tail`)
1. `hall === 'dive'`: `KRANE, division sergeant on paper: arrested at Substation Nine under his own rack.`
2. `reached('subResult')`: `KRANE, division sergeant on paper: escaped from Substation Nine in the Board van.`
3. `reached('subManifest')`: `KRANE, Vale's bodyguard: at Substation Nine, loading the van.`
4. `reached('marketDanger')`: `KRANE, Vale's bodyguard: tried to run Rook down with a cell-cart at the night market.`
5. otherwise: `PLATE 41: a black division car following the tram with its lights off.`

**THE CITY MEDIC** (shown from `reached('roofEntry')`)
1. `reached('canalEntry')`: `THE CITY MEDIC: brought Bell to the canal-side post. Bell will walk.`
2. otherwise: `THE CITY MEDIC: on the roof with Bell. Answers the roof radio.`

**THE BRIDGE OPERATOR** (shown when `radio`)
1. `pursuit === 'ramp'` and `caught` and `tunnel === 'left'`: `THE BRIDGE OPERATOR, call sign HALF HOUR: his tip about the maintenance channel put Rook ahead of Vale.`
2. otherwise: `THE BRIDGE OPERATOR, call sign HALF HOUR: lifts the canal bridge at the half hour. Reported a Board van booked to Substation Nine.`

**MARTA QUILL, stall keeper** (shown when `keeper`)
1. `reached('subEntry')`: `MARTA QUILL, cell-stall keeper: right about the racks. Sells reserve cells on the market; will need a lawyer, and a witness fee.`
2. otherwise: `MARTA QUILL, cell-stall keeper: says the cells come from Substation Nine on Thursdays in a Board van.`

**HALDEN ASHE, Lumen Board** (shown from `reached('subManifest')`, or from `reached('pumpTruth')` when `ledger`)
1. `reached('roomName')` and `proof`: `HALDEN ASHE, Commissioner of Reserve, Lumen Board: named on the warrant. Countersigned order 7731.`
2. `reached('roomName')`: `HALDEN ASHE, Commissioner of Reserve, Lumen Board: suspected above Vale. No paper survives to name him.`
3. `reached('subManifest')`: `HALDEN ASHE, Commissioner of Reserve, Lumen Board: countersigned the Substation Nine manifest.`
4. otherwise: `H.A.: initials under Vale's signature on every ledger page. Unknown.`

## 7. Endings

Exactly six. Evaluated top to bottom; the first true condition is the ending, so every combination of fields maps to exactly one. `proof`, `pursuing` and `kranePinned` are the derived terms from section 3.

| # | id | Name (block letters) | Condition | Closing caption (`canalEnd`) | Records summary |
| --- | --- | --- | --- | --- | --- |
| 1 | `home` | `THE LAMPLIGHTER HOME` | `pursuit === 'stay'` | `Bell is alive, and his testimony is on record. Vale's office was empty by dawn. Rook brought the missing man home, and the street will be lit tomorrow because Nell knows the route.` | `Rook stayed with Bell. Vale is at large; the search is a warrant now.` |
| 2 | `board` | `LIGHTS ON THE BOARD` | `caught && proof` | `Bell is alive. Vale is in custody, and the name above his is on the warrant. As the station lamps go dark, this time it is only because morning has arrived.` | `Vale arrested; Halden Ashe of the Lumen Board named on the paper Rook kept dry.` |
| 3 | `word` | `WORD AGAINST WORD` | `caught` | `Bell is alive. Vale is in custody, and it is Bell's word against a Night Division inspector's. The lamps go out along the canal because the sun is up. It will have to be enough.` | `Vale arrested on Bell's testimony. Nothing on paper names the Board.` |
| 4 | `krane` | `THE BODYGUARD TALKS` | `!caught && kranePinned` | `Bell is alive. Vale is gone, but his bodyguard is in a splint in the room next to Vale's office, and Krane has begun to talk. The lamps go dark along the canal; morning has come.` | `Vale escaped. Krane arrested at Substation Nine; his statement opens the Board.` |
| 5 | `paper` | `THE PAPER TRAIL` | `!caught && proof` | `Bell is alive. Vale is at large, but the paper is dry and it names the Board. The warrant has two names on it, and the lamps go dark because it is morning.` | `Vale escaped. The signed paper names Vale and Ashe; the warrant is out.` |
| 6 | `dark` | `A VOICE IN THE DARK` | otherwise (`!caught`, no proof, Krane free; includes `pursuit === 'late'` and every escape) | `Bell is alive. Vale remains at large, the hall is burned, and the man who signed for him is a set of initials. The missing-person case is closed; the warrant is just beginning.` | `Vale escaped with everything but Bell. Only Bell's voice remains.` |

The `caseReport()` line keeps its format: `ENDING: <name> (<n>/6 found). Reflex <hits>/<faced>, grade <grade>, rewinds used <n>.` Endings are recorded by id. The existing ids `arrest-ledger`, `arrest-word` map to `board` and `word` in the records migration; `home`, `paper` and `dark` keep their ids.

## 8. Discoveries

Twenty. The first twelve are the existing ones; `ramp`, `jump` and `undercity` are unchanged in meaning.

| id | Label (max 40) | Condition |
| --- | --- | --- |
| `observe` | `Studied the courier's limp` | `watched` |
| `witness` | `Made Nell a witness` | `choice === 'person'` |
| `record` | `Read the intact dispatch entry` | `choice === 'book'` |
| `tape` | `Decoded the maintenance tape` | `decoded` |
| `ledger` | `Recovered Vale's signed ledger` | `rescue === 'valve'` |
| `band` | `Heard the bridge operator` | `radio` |
| `confession` | `Recorded Nell's confession` | `twist` |
| `ramp` | `Cut Vale off on the service ramp` | `pursuit === 'ramp' && caught && tunnel === 'left'` |
| `jump` | `Cleared the lifting bridge` | `pursuit === 'jump' && caught` |
| `chip` | `Pocketed a Filament chip` | `club === 'vault'` |
| `undercity` | `Ran Vale down in the storm drains` | `pursuit === 'ramp' && caught` |
| `flawless` | `Closed the case without a rewind` | `rewinds === 3` |
| `note` | `Found Nell's note in the loft` | `note` |
| `tail` | `Spotted the tail from the tram roof` | `tail` |
| `keeper` | `Heard the stall keeper's tip` | `keeper` |
| `vine` | `Found the Filament's back door` | `market === 'cut'` |
| `manifest` | `Saved the Board's manifest` | `hall === 'breaker'` |
| `pinned` | `Pinned Krane under his own rack` | `hall === 'dive'` |
| `ashe` | `Named the Board's man first try` | `proof && !slip` |
| `sharp` | `Every deduction right first time` | `!wrong && !misread && !slip` |

The loft visit itself is a route step (`Climbed to the loft`, from `loftSeen`) rather than a discovery; its two discoveries are the note and the map read right, which `note` and `sharp` already reward.

## 9. Route steps

Breadcrumbs in story order. Each line is pushed when its condition holds.

| Condition | Label |
| --- | --- |
| `reached('streetFollow')` | `watched` ? `Watched first` : `Followed at once` |
| `reached('streetResult')` | `choice`: person `Caught the courier`; book `Saved the book`; missed `Missed the fall` |
| `wrong` | `Chased a false lead` |
| `loftSeen` | `Climbed to the loft` |
| `note` | `Read Nell's note` |
| `misread` | `Misread the photographs` |
| `reached('pumpEntry')` | `decoded` ? `Read the tape` : `Followed the knocking` |
| `reached('pumpResult')` | `rescue`: valve `Closed the inlet`; pull `Pulled Bell out`; late `Late at the pump` |
| `radio` | `Listened to the band` |
| `twist` | `Heard Nell's confession` |
| `pursuit === 'stay'` | `Stayed with Bell` |
| `pursuing` | `Pursued Vale` |
| `pursuing && tail` | `Spotted the tail` |
| `pursuing && keeper` | `Asked the stall keeper` |
| `pursuing && reached('marketResult')` | `market`: slip `Slipped the cart`; cut `Went over the stalls`; late `Took the cart` |
| `pursuing && reached('clubResult')` | `club`: duck `Ducked the bottle`; vault `Went over the bar`; late `Took the bottle` |
| `pursuing && reached('chaseBank')` | `firstMove`: dodge `Dove right`; brake `Braked`; late `Clipped the carrier` |
| `pursuing && reached('chaseQteB') && pursuit !== 'chasing'` | `pursuit`: ramp `Took the ramp`; jump `Jumped the gap`; late `Stopped at the bridge` |
| `pursuit === 'ramp' && reached('tunnelFinish')` | `tunnel`: right `Followed right`; left `Cut left`; late `Braked at the fork` |
| `pursuing && reached('subResult')` | `hall`: dive `Dived clear`; breaker `Pulled the breaker`; late `Crushed at the rack` |
| `reached('roomName')` | `proof` ? `Named the Board's man` : `Left the line blank`; add ` (second try)` when `slip` |

Reflex tally: count `streetResult`, `pumpResult`, and when `pursuing`: `marketResult`, `clubResult`, `chaseBank`, `chaseFinish` (only when `pursuit` is `jump` or `late`), `tunnelFinish` (only when `pursuit === 'ramp'`), `subResult`. Hits are the non-`late`, non-`missed` values. Eight prompts are faced on a full pursuit route, two on the stay route.

## 10. Notes

**Changes from the producer's roster**

- The chase now ends at Substation Nine on the canal basin instead of at the canal. Reason: Act 3 has to be reachable whether or not Vale is caught, and the player must not need a clue to know where to go. Putting the substation on the basin, where the bridge, the drains and every chase outcome already arrive, makes the geography carry the plot. Every chase and tunnel finish caption now ends on the substation's lit windows so the player is looking at the next set before the exit beat.
- The tram crossing is included. It earns its place three ways: it seeds Krane (the tail) as the telegraph for the market prompt, it shows the dark district that the whole case is about (lamps 14 to 19 dark on their posts), and it gives the player a breath between the rescue and the three prompts of Act 2. It is a cutscene with one optional timed observation and no prompt, and it can be cut to a transition line without touching any field except `tail` (then give `tail` from the market watch instead).
- The stay route now passes through the interrogation room before the canal, so the dawn deduction and the final case-file entries are reached on every route and the `home` ending still says something about Vale. If this makes the stay route too long, `roomEntry`'s stay caption and `roomName`'s stay caption can be merged into one phase.
- Bell's loft is reached by the player's choice at the street deduction, not automatically on the non-person routes. Reason: the deduction then has two right answers of different value, which is the "improved connect the clue" the brief asks for, and a player who wants the short route keeps it. The loft is still impossible on the Nell route (she takes Rook straight in), which matches the roster.
- The old `ending` phase on Station Road (`THE WAY BELOW`, with its outcome text and `[ENTER THE STATION]` button) is removed; the exit beat and its line do that job now.

**Counts against the brief**

- Locations: 14 (nine kept, five new: loft, tram, market, substation, room).
- Prompts: 8 (courier, inlet, cart, bottle, carrier, bridge, fork, rack). Extra 1 in the optional list would make 9.
- Quiet choices with consequences: 8 (watch or follow, connect the clue, note or map, the loft deduction, tape or knocking, pursue or stay with ask Nell, ask the stall keeper or push through, the dawn deduction). `tramRide` is an observation offer like `[WATCH FIRST]`, not counted.
- Deductions: 3 (street, loft, dawn), each with one right answer per state, a hint and a cost.
- Timed observations: 4 (courier, tape, radio, tram).
- Endings: 6. Discoveries: 20. New fields: 8 (`note`, `loftSeen`, `misread`, `tail`, `keeper`, `market`, `hall`, `slip`).

**Risks**

- Windows stack. A player who takes the cart late and then the bottle late has 5-second windows on the road. This is intended (misses cost), but the floor of 5 must hold and the untimed setting must still remove every deadline.
- The loft deduction takes a rewind on a wrong answer. It is the only place a life is lost outside a prompt. If playtests find it punitive, change the cost to `misread` alone (the 2 seconds at the market) and keep the wording.
- `roomDeduce` has a state-dependent right answer. The hint captions are written for every wrong pick in both states; engineers should test all six.
- Persons of interest now number up to nine lines. On a phone the case file grows long; consider showing only the four most recent.
- New sets: loft (interior, small), tram (moving, exterior), market (exterior, crowd), substation (interior, large), room (interior, tiny). Materials fit the existing list (wood, paper, lamp, awning, kiosk, tram, metal, tank, cable, console, wall, screen). The rack needs a `tank` or `metal` body and a `cable` top; no new materials are required.
- Krane's sprite is the only one that needs to lie under a rack (`crouch` pose with a lean should do).

**Optional extras, ranked by value**

1. A ninth prompt on the tram crossing: a low signal gantry over the roof, `[1] DROP FLAT` or `[2] SWING UNDER THE RAIL`; the miss knocks Rook down onto the road and costs `tail`. Adds a Dragon's Lair beat to a cutscene set and brings the prompt count to nine.
2. Nell at the substation: when `choice === 'person'` and `twist`, Nell arrives with the patrol car at Vine Alley and again at the substation, and it is her lantern that lights the hall after the breaker. Costs one boolean (`nellDrove`) and three captions; pays off her arc.
3. A fourth deduction at the market: which of Marta's cells came from lamps 14 to 19 (serial ranges on the route map). Right answer gives `keeper` without the stall-keeper conversation; wrong answer costs two seconds at the cart. Only worth it if the loft is on the route, so it favours the book and missed branches.
