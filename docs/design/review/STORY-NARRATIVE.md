# Story pass review: can a first-time player retell the night?

Narrative Director on commit `9d08ad1` ("Tell the story"). Read against `STORY.md`, `BRIEF.md` (the spine), `CHARACTERS.md` Part 1, the full `src/` diff and the captions around each changed line. I played two routes in Chromium under a fake clock and logged every full caption and every case-file first line: `route.mjs long 1024` (the chase, ending LIGHTS ON THE BOARD) and `route.mjs stay 1024` (Rook stays, arrests Vale in Interview 2, same ending). One process note: the unmodified script stops at `officeEntry` with "waited 30 s on [SKIP INTRO]", because the new cold open holds 35.5 s before the first input. That is finding 6. The logs were made with its wait raised in memory; nothing on disk changed.

## Verdict

**APPROVE WITH CHANGES.** The pass answers the studio head's four questions, and it does it in the right voices. The cold open says what a lamplighter is. Bell says what Vale did. Vale's "You have countersigned a hundred of mine" ties the villain to Rook's own guilt, Nell's "Nobody reads a lamplighter's complaint" gives her a motive, and Ashe's allocation line says in one sentence what the whole conspiracy is. None of this should be rewritten from scratch. It cannot ship as it stands, for four reasons. First, "why chase Vale" is answered only after the player has already chosen to chase him. Second, Rook's flaw lives only in an optional look-around spot, so on many runs the endings pay off a setup the player never saw. Third, the stay route names "Halden Ashe" when the player has no way to know that name. Fourth, two endings call a name the player has just read a "set of initials", and a third leans on Nell on the route where she has been taken. On top of that, the beats have grown long: the cold open, the roof and the pump now hold 20 to 35 seconds each before the player can act. The fixes below are line swaps. None needs a new mechanic.

## Findings

1. **BLOCKING. `roofEntry` / `roofQuiet` / `chaseEntry`: "why chase him" arrives after the choice.** Before `[PURSUE VALE]`, the player hears `Rook: "Bell is breathing, and Vale does not know it yet, but that will not last the hour."` and sees `a red car pulls away from the station forecourt`. The stakes line (`"If Vale reaches the towers tonight, nobody on our floor will ever bring him back down."`) is typed at `chaseEntry`, once the choice has been made. The roof line also reads like narration inside quote marks. Move the stakes to the roof, name the car, and give the chase its own beat.
   - `roofEntry`: `Rook: "Bell is alive, and within the hour Vale will know it. If he reaches the towers first, nobody on our floor brings him back."`
   - `roofQuiet`, first two sentences: `Bell is safe with the medic. Far below, Vale's red car pulls away from the station forecourt and heads west, toward the market and The Filament's sign.`
   - `chaseEntry`, Rook's line: `Rook: "Bell got out of the water. Vale does not get out of the city."`

2. **BLOCKING. `officeEntry` + `officeDesk` file spot: Rook's flaw and Vale's seed are both optional.** Of the two things Rook's arc needs on screen, the want (`"Not this one."`) and the flaw (`Rook has countersigned that stamp on a hundred files without asking whose it was.`), the flaw appears only in spot [1], one of four spots, of which the player must look at two. On a run that skips spot [1], nothing sets up the `home` closing (`the first file in years he has closed by reading it`) or Vale's booth line. The same holds for Vale: spot [2] and the station order are optional, so on some runs Bell at `pumpFind` is the first time the player ever hears his name. Put both setups in the cold open, which is not optional. This rewrite also brings it down to four sentences (see 5).
   - `officeEntry`: `Halvard, 23:40, the ninth night of rain. The Lumen Board sells the city's power to the towers uptown; the low streets stay lit only because lamplighters switch each lamp on by hand from its own battery. Ivo Bell, lamplighter of the station route, has been missing four nights. His file is on Rook's desk at Night Division, stamped NO FURTHER ACTION by Inspector Vale's office across the corridor, and Rook has countersigned that stamp a hundred times without reading it.`
   - File spot, so it shows the choice instead of repeating the setup: `The Bell file: last seen at the closed North Station, and since then a stranger has been walking his route with his lantern. Rook's pen is over the countersignature line. Rook: "Not this one."`
   - `officeDesk`, to keep the lamp image: `Rook's lamp is the last one burning on the floor. He looks the desk over before he takes the stairs.`

3. **BLOCKING. `roomName` / `roomDeduce`, stay route with the ledger: "Halden Ashe" has no source.** My stay log reads `"Halden Ashe," Rook says, and for the first time Vale looks at the door`, and the case line then reads `...for Halden Ashe of the Lumen Board`. On this route the player has seen only the initials H.A. There is no dock and no manifest. In the same branch, `roomDeduce` also cites `the name on the manifest` (the `alone` pick) and `The manifest spells them out.` (the `short` pick), and no manifest exists on this route. Pay off the seed from spot [2] instead. For `!manifestHeld()` off the chase route:
   - `roomName`: `Rook sends down the corridor for the commendation off his own board: the same H.A., typed out beneath as HALDEN ASHE, COMMISSIONER OF RESERVE. For the first time Vale looks at the door instead of at Rook.`
   - `roomDeduce`, `alone`: `Vale almost smiles. Rook has shown his hand: the same initials sit under every ledger page, H.A., and Vale does not sign for himself.`
   - `roomDeduce`, `short`: `There is enough. The initials under Vale's signature, page after page, are H.A., and Rook has seen that hand on his own wall.`

4. **BLOCKING. `canalEnd` `word` and `dark` (and the last `roomName` branch): "a set of initials" contradicts the manifest.** Every chase run passes `subManifest` (`...and under it H. ASHE, COMMISSIONER OF RESERVE.`) and `subDock`. `word` then says `The name above Vale's is still a set of initials`, and `dark` and `roomName` say `the man who signed for him is a set of initials` / `whoever signed is a set of initials`. The player read the name ten minutes earlier.
   - `word`: `Bell is alive. Vale is in custody, and it is Bell's word against a Night Division inspector's. Rook has read Ashe's name on a manifest he does not hold, and the batteries are still uptown.` (keep the existing tail)
   - `dark`: `Bell is alive. Vale remains at large, the hall is burned, and the name Rook read on the manifest burned with it.` (keep the existing tail in both branches)
   - `roomName`, last branch: `Rook closes the file on Vale's name and a blank line under it. The batteries are gone, the hall is burned, and Ashe's name is something Rook read, not something he holds.`

5. **BLOCKING. `canalEnd` `home`: "Nell knows the route" when Nell is gone, or when she was never named.** The closing's last sentence is `The street will be lit tomorrow because Nell knows the route.`, whatever `state.choice` holds. With `choice==='missed'`, the report on the same screen says `The courier is missing since Station Road.` With `choice==='book'` and no loft, the name Nell never appears on screen at all. Branch it:
   - `person` / `book`: `The street will be lit tomorrow because his apprentice, Nell Marrow, knows the route.`
   - `missed`: `Nobody will light his street tomorrow: the courier who carried his lantern is still missing.`

6. **SHOULD. `officeEntry`: the cold open is five sentences, and the fake clock shows 35.5 s before the first input.** That is longer than any beat in the game, and it trips `route.mjs`'s 30 s wait. The rewrite in finding 2 is four sentences and cuts roughly eight seconds. No separate line is needed.

7. **SHOULD. `pumpFind`: five sentences while the pipe is splitting, and Vale gets no title.** `Bell: "Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark. I found his ledger, so he locked me down here. That pipe will not hold much longer." It is the name Rook came down with. The INLET wheel is beside Rook.` The cold open already explains what a battery is. What Bell has to deliver here is who Vale is, and that it is Rook's floor.
   - `Bell: "Inspector Vale. Your floor. He sells the batteries off my route, and I found his ledger, so he locked me down here. That pipe will not hold."` (then the verdict and the inlet sentence, unchanged; the `wrong` / `lateDown` variant keeps `"You took your time."` in place of `"That pipe will not hold."`)

8. **SHOULD. `pumpTruth`: five sentences, and the pull branch repeats `pumpFind`.** The valve branch runs narration (2) plus Bell (3). The pull branch has Bell say again that Vale sold the batteries and locked him in, thirty seconds after he said it the first time. `I know which lamps were never meant to come back on` is Ashe's secret whispered too early, and a first-time player cannot parse it here.
   - valve, board seen: `The dry ledger carries Vale's signature and, under every entry, H.A., the hand on Rook's own case board. Bell: "Forty years on this route. I kept this off your floor because I did not know which desk up there was safe."`
   - valve, board not seen: `The dry ledger carries Vale's signature and, under every entry, initials Bell does not know: H.A. Bell: "Forty years on this route. I kept this off your floor because I did not know which desk up there was safe."`
   - pull: `Bell: "Forty years on this route. The ledger was in that satchel. I kept it off your floor because I did not know which desk was safe, and I will say so in court."`

9. **SHOULD. `roofConfession`: the motive is told, but the consequence is not.** `...a job logged at the station puts Bell's name beside Vale's order. I wanted Vale on paper. I did not think about the water.` Nothing in the line says how her call put Bell in the room: Vale read the log and knew where Bell would be. Without that link, "the water" is a non sequitur.
   - `Nell: "I logged that call in his name. Nobody reads a lamplighter's complaint, but a job on the station log sits beside Vale's order, where somebody has to read it. Vale read it first. I did not think about the water." Rook writes it down.`

10. **SHOULD. `evidence` (Nell caught): she knows too much for four nights.** `He is alive in Pump Room 4. Knock three times; I will take you.` If she has known for four nights where Bell is and that he is alive, the player will ask why she is lighting lamps instead of opening the hatch. The bible has her still looking for him. Give her tonight's discovery.
    - `The courier is Nell Marrow, Bell's apprentice. Nell: "I walk his route so it stays lit. Tonight I heard his knock under the station, three short. Pump Room 4. I will take you."`

11. **SHOULD. `officeDesk` log spot and `evidence` (book): the forged call has no date.** At 23:40 the office log shows `a maintenance call at 00:17`, and the book says `The page is fresh`. A player cannot tell that the call is four nights old and is what put Bell underground. `INVESTIGATION.md` had "four nights ago", and it was lost in the build.
    - log: `The dispatch log, four nights back: a maintenance call at 00:17 for Pump Room 4, logged to I. BELL. The hand is not Bell's.`
    - book: `The entry is four nights old and still open: "00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN." The courier's lantern is stencilled BELL / DEPOT LOFT.`

12. **SHOULD. `canalEnd` `board`: the best ending has no Rook.** Rook's change lands in `home` (`closed by reading it`), `paper` (`this time somebody read it back`) and `dark` (`Rook will read every page`). It does not land in `board`, the ending a good player reaches most often.
    - `Bell is alive. Vale is in custody, and the name above his is on the warrant in Rook's hand, read line by line. The station route gets its batteries back. As the lamps go dark along the canal, this time it is only because morning has arrived.`

13. **SHOULD. `subDock`: six sentences in a five-second "seen, one line, gone" cutscene.** Ashe's line is right. The frame around it is too long.
    - `On the dock, dry under an umbrella that has not closed all night, a man with a lit Board pin watches the loading. "You are standing in my rain, detective. There is no theft here, only allocation, and your division signed for every lot." He walks out of the light, unhurried.`

14. **SHOULD. Voice rule: `loftEntry` and `clubEntry` are captions in quote marks.** Twelve set entries in a row open with `Rook: "`, so each one has to sound spoken. `"Bell knew something, and I am spending his minutes to find out what."` names the game's time mechanic. `"Vale is in there, spending what Bell's lamps were worth."` is narrator's irony. Nobody says either line under his breath.
    - `loftEntry`: `Rook: "Bell kept his work up here. Two minutes, no more."`
    - `clubEntry`: `Rook: "Vale is in there. I go in alone, and every table is his."`

15. **SHOULD. Length: set entries now hold 20 to 30 s.** Logged holds, each counting the transition line that types as chunk zero: `roofEntry` 30.5 s, `subEntry` 30.2 s, `marketEntry` 29.5 s, `clubEntry` 29.0 s, `roomEntry` 28.8 s, `tramEntry` 27.0 s, `chaseEntry` 24.0 s, `pumpEntry` 22.2 s. In a game built on Dragon's Lair's pace, that is too long between moves. The added Rook line is what pushed them over. The replacements in 1, 7 and 14 are shorter. In the same spirit, trim `roofEntry`'s scenery sentence: `The towers blaze uptown; the low streets are dark. Ines Okafor, a city medic, waits by the roof radio with a blanket.`

16. **NIT. `station>pump` and `pump>roof`: transition lines that explain the picture.** `...because whoever is striking that pipe is still alive.` and `...out of the water and up to where a medic can reach him.` are both sentences a player skips.
    - `station>pump`: `Down the service ladder, toward a man who is still knocking.`
    - `pump>roof`: `Up the service stair with Bell's arm over Rook's shoulder, toward the medic's lamp.`

17. **NIT. `street>station`: one line hedges both branches.** `Bell is under that station and Rook is going in, by three knocks or by his shoulder.` By this point the player knows which it is. Branch on `state.choice`:
    - `person`: `Bell is under that station, and Nell knows the knock.`
    - otherwise: `Bell is under that station, and the service door is about to meet Rook's shoulder.`

18. **NIT. `room>canal` on the stay route: Bell is "waiting" at the canal.** Bell was just across the table, and `canalEntry` then says `Rook stayed with Bell and escorted him`. For `pursuit==='stay'`:
    - `Down to the canal at first light with Bell beside him, to see what his four nights bought.`

19. **NIT. `marketEntry`: "every face ... could be Vale's" reads as though Vale might be anywhere.**
    - `Rook: "The Filament is at the far end, and every face between here and there could be working for Vale."`

## Three lines to keep at any cost

- `clubBooth` (shown): `He slides it back. "Least of all you, Rook. You have countersigned a hundred of mine."`
- `subDock`: `"There is no theft here. There is allocation: the light goes where it is paid for, and your division signed for every lot."` (the clause I compress in finding 13 is the frame around it, not this line; keep its substance)
- `tramEntry`: `Rook: "I left Bell on a roof to do this. Vale had better be where this tram is going."`

## Sign-off

Checked against `806a82d` ("Answer the four reviews of the story pass"): the `src/` diff, STORY.md's "Review round", the chase log `fix-long.log`, and a fresh stay-route log `signoff-stay.log`. The stay route plays through to LIGHTS ON THE BOARD with no console errors. The cold open now holds 13.8 s before the first input, so the route script no longer stalls on it.

| # | Result | Evidence |
|---|---|---|
| 1 | RESOLVED | `roofQuiet` now gives the reason for the chase before the player can choose it, next to `[PURSUE VALE]`: `Rook: "Once Vale is uptown, nobody on our floor brings him back, and Bell is my only witness."` It shows on both routes. |
| 2 | RESOLVED | The flaw and the Vale seed are now in `officeDesk`'s own line, which every run through the office shows: `Bell's file came from Inspector Vale's office, stamped NO FURTHER ACTION. Rook has signed under that stamp a hundred times without reading it.` |
| 3 | RESOLVED | On the stay route the name now comes from the commendation: `Rook sends for the commendation off his own board: the same H.A., typed out beneath as HALDEN ASHE...`. `roomDeduce` cites a manifest only when `pursuing()`, and the file's line at `roomEntry` no longer gives the answer away. |
| 4 | RESOLVED | `word` says `Rook has read Ashe's name` on chase routes and keeps "initials" only off them. `dark` says `the name Rook read on the manifest burned with it`, and I confirmed it is reachable only by chase. The last `roomName` branch says `something Rook read, not something he holds`. |
| 5 | RESOLVED | `home` now branches: Nell is named only when `person && !wary`. A missed courier reads `The courier who carried his lantern is still missing.`, and every other case reads `Bell will light the street himself tomorrow.` |

**Skipping the intro.** A player who presses `[SKIP INTRO]` misses the premise and the flaw together, because the button jumps straight to `brief`. I accept that: skipping is the player's own choice, and anyone who does it has chosen not to be told the setup. The things the plot needs come back later on every route: Bell names Vale at `pumpFind`, and Vale's "Go back to your desk and stamp something" or "You have countersigned a hundred of mine" at the booth names the flaw back to Rook. The endings no longer lean on the flaw either ("read it back" is gone). The one thing I would have wanted instead is to offer SKIP INTRO only once a case has been played, but that is a mechanic, not a caption, and it does not block.

**What the cuts took (follow-ups, not blocking):**
- The cold open lost its subject. `Halvard rations its power` no longer says who does the rationing. Nothing on screen now says the Lumen Board is the grid authority, and "uptown" survives only in an optional window spot and in Rook's roof line. That leaves Ashe's pin and the Board van with less weight than they should carry. The fix costs four words: `The Lumen Board rations Halvard's power, so lamplighters keep the low streets lit by hand, one battery to a lamp.`
- Ashe on the dock is down to `"The light goes where it is paid for."` That keeps the core of the allocation line, which I asked to keep, but drops `your division signed for every lot`, the line that tied the Board to Rook's floor. If it fits the chunk, restore it: `"You are standing in my rain, detective. The light goes where it is paid for, and your division signed for it."`

**Final: APPROVE.**
