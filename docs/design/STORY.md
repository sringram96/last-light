# The Last Light: the story on screen

This page is the story pass. `BRIEF.md` ("The spine") and `CHARACTERS.md` say what is true; this page says what a first-time player hears, where they hear it, and in whose voice. No mechanic, camera, picture, phase id or flow changed. Only caption strings, transition lines and the case file's first line did.

## The story a player should be able to retell

**The world.** Halvard is a city on rationed power. The Lumen Board sells most of it to the towers uptown. At night the low streets around North Station stay lit only because lamplighters walk their routes and switch each lamp on by hand from its own reserve battery. *(Cold open, first 40 seconds.)*

**Bell.** Ivo Bell has been the senior lamplighter of the station route for forty years. He saw lamps on his route going dark for good: their reserve batteries were being pulled and sold uptown. He found the signed ledger that moves them. He kept it in his satchel and did not take it to the Night Division, because he did not know which desk there was safe. *(Bell at pumpFind and pumpTruth.)*

**Vale.** Inspector Aurel Vale of the Night Division, whose office is across the corridor from Rook's, signs the battery orders and runs the sales through a club called The Filament. When Bell confronted him, Vale had Bell locked in Pump Room 4 under the closed station, opened the flood inlet and left the water to finish it. Above Vale's signature is a second hand: H.A., Commissioner Halden Ashe of the Lumen Board. *(Bell, then the ledger, the manifest and Ashe on the dock.)*

**Nell.** Nell Marrow is Bell's apprentice. She guessed Vale was involved and forged a maintenance call in Bell's name, so that Bell's name and Vale's order would sit side by side in a log somebody would have to read. She did not think about the water. Since then she has walked Bell's route with his lantern so that his street does not go dark. *(Nell at evidence and roofConfession, or her note in the loft.)*

**Rook.** Rook runs the missing-persons desk at Night Division. For years he has countersigned NO FURTHER ACTION on files closed by signatures he never read back, many of them Vale's. Tonight Bell's file comes across the corridor already stamped, and Rook says "Not this one." He wants the missing man home and his own desk honest. *(The office desk, and Vale at the booth: "You have countersigned a hundred of mine.")*

**Why the chase matters.** Bell alive is only half the case. Vale is the one man who connects the batteries to the Board, and the only paper that can prove it (the ledger, then the manifest) can be lost in the flood, to Krane, or in the fire. If Vale gets uptown, nobody on Rook's floor will bring him back. The morning ends every version of the night: the lamps go out because the sun is up. What changes is whose names are on the warrant and whether the station route gets its batteries back.

## The voice rule

**Rook speaks the way everyone else in the game speaks: a quoted line, `Rook: "..."`. Every set's entry caption opens with one such line, saying what he wants in that place and what it will cost him.** Everything else stays third person, present tense. There is never first-person narration outside quotes. I chose this device because the caption system, the case file and the tests are all third person. Bell, Nell, Vale, Ashe, Marta and Heddy are already heard through `Name: "..."`, so Rook joins the cast instead of becoming a narrator above it. A quoted line can be said to whoever is in the picture (Nell at the hatch, Bell on the roof) or under his breath to an empty room, which suits the genre. It also leaves the one-line-per-set rule easy to check: an entry caption either starts with `Rook: "` or it does not. Rook speaks elsewhere only where he says something to someone ("Not this one." at the file; his Vale line at the case board).

## Meaning beats

| Who | Phase | The line |
|---|---|---|
| Rook, on his desk | `officeDesk`, the file and the board | `Rook has countersigned that stamp on a hundred files without asking whose it was. Rook: "Not this one."` / `Rook: "Vale signs his name like a man who has never been asked to read it back."` |
| Bell, what the batteries are | `pumpFind` | `Bell: "Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark. I found his ledger, so he locked me down here..."` |
| Bell, why he kept the ledger | `pumpTruth` (both branches) | `Bell: "Forty years on this route. I know which lamps were never meant to come back on. I kept this instead of bringing it to your floor, because I did not know which desk up there was safe."` |
| Nell, why she forged the call | `roofConfession` | `Nell: "I wrote the maintenance call myself. Nobody reads a lamplighter's complaint, but a job logged at the station puts Bell's name beside Vale's order. I wanted Vale on paper. I did not think about the water."` |
| Vale, why nobody reads it | `clubBooth` (shown) | `"Reserve batteries. Signed. Nobody reads a maintenance order." He slides it back. "Least of all you, Rook. You have countersigned a hundred of mine."`. Unshown: `"...Go back to your desk and stamp something."` |
| Ashe, who the light is for | `subDock` | `"Detective. You are standing in my rain. There is no theft here. There is allocation: the light goes where it is paid for, and your division signed for every lot."` |
| The canal | `canalEnd`, every ending | board: `The station route gets its batteries back.` home: `the first file in years he has closed by reading it.` word: `The name above Vale's is still a set of initials, and the batteries are still uptown.` krane: `The man who turned the key on Bell is naming who paid for it.` paper: `Vale signed it, and this time somebody read it back.` dark: `The low streets will be dark again tonight...` |

The case file's first line (`caseLine()` in `presentation.js`) restates the case as Rook understands it, from `reached()`, `theory`, `proofHeld()`, `stalled`, `caught` and `dead`. It runs: *A lamplighter is missing and his street is dark*, then *Ivo Bell is missing, and a stranger is carrying his lantern*, then where Bell was logged, then Rook's theory at the hatch, then *Bell is alive. He says Inspector Vale locked him in*, then *Vale sold the reserve batteries and locked Bell in to keep it quiet*, then the manifest's name, then *...for the Board. Who signed above him?*, then the warrant, and finally *closed.* followed by the ending's summary. A cold case reads *gone cold*.

## Change log (old first sentence -> new first sentence)

Captions (every branch of each function was kept; some branches changed only in their added line):

- `officeEntry`: `Night Division, 23:40.` -> `Halvard, 23:40, the ninth night of rain.` (cold open, five sentences)
- `officeDesk` file: `The file: IVO BELL, lamplighter, missing four nights.` -> `The Bell file came down from across the corridor already stamped NO FURTHER ACTION.`
- `officeDesk` board: `On the case board, beside Bell's photograph, a commendation: INSPECTOR A. VALE, GRID SECURITY LIAISON, LUMEN BOARD.` -> `On the case board, beside Bell's photograph, a Lumen Board commendation for INSPECTOR A. VALE, GRID SECURITY LIAISON, initialled H.A. at the foot.` (plus Rook's Vale line)
- `officeDesk` window: `Rook takes his coat.` -> `Uptown the towers burn all night.`
- `brief`: `Rook's case: find lamplighter Ivo Bell.` -> `Rook: "Whoever has Bell's lantern knows where he went.`
- `evidence` (Nell caught): `Nell: "Bell is alive.` -> `The courier is Nell Marrow, Bell's apprentice.`
- `loftEntry`: `One room over the lamp depot.` -> `Rook: "Bell knew something, and I am spending his minutes to find out what."`
- `stationEntry`: `Nell opens the service door with three taps.` / `The service latch gives under Rook's shoulder.` -> `Rook: "Every minute I spend up here is one Bell spends down there."`
- `pumpEntry`: `Under the station, pumps tower above black water.` -> `Rook: "Get him out first.`
- `pumpFind`: `Bell: "Vale took the reserve batteries.` -> `Bell: "Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark.`
- `pumpTruth`: `The dry ledger bears Vale's signature, ...` / `Bell: "Vale sold the emergency batteries.` -> `The dry ledger carries Vale's signature, ...` / `Bell: "Forty years on this route.`
- `roofEntry`: `Rook brings Bell up the service stair.` -> `Rook: "Bell is breathing, and Vale does not know it yet, but that will not last the hour."`
- `roofConfession`: `Nell: "I forged the maintenance call.` -> `Nell: "I wrote the maintenance call myself.`
- `tramEntry`: `Rook drops from the service lift onto the roof of the last tram.` -> `Rook: "I left Bell on a roof to do this.`
- `marketEntry`: `Stalls, awnings, a crowd that does not part, and every stall lamp a reserve cell with a Lumen Board serial.` -> `Rook: "The Filament is at the far end, and every face between here and there could be Vale's."`
- `clubEntry`: `Vale's red car sits in Vine Alley.` / `...outside The Filament.` -> `Rook: "Vale is in there, spending what Bell's lamps were worth.`
- `clubBooth`: first sentences unchanged. Added: `He slides it back. "Least of all you, Rook. You have countersigned a hundred of mine."` (shown) and `Go back to your desk and stamp something.` (unshown, faced)
- `chaseEntry`: `The patrol car is in Vine Alley with the keys in, as dispatch promised.` -> `Rook: "If Vale reaches the towers tonight, nobody on our floor will ever bring him back down."`
- `tunnelEntry`: `The service ramp drops below the road into the storm drains.` -> `Rook: "Lose him down here and he comes up anywhere he likes."`
- `subEntry`: `Rook leaves Vale cuffed in the patrol car.` / `Vale's car is not here.` -> `Rook: "This is where Bell's batteries go.`
- `subDock`: `On the dock beyond the van, out of the rain under an umbrella...` -> `On the dock beyond the van, dry under an umbrella...` (Ashe's allocation line added)
- `roomEntry`: `Night Division, 05:50.` -> `Rook: "Whatever I write in this room, I write against my own floor."`
- `roomVale` (first look): the 156-character second sentence split in two: `...finds the light on in Interview 2. Ivo Bell is alive across the table, a blanket on his shoulders.`
- `canalEntry`: `Rook stayed with Bell...` / `Vale is in custody.` / `Vale escaped tonight.` -> `Rook: "I went out for one missing man.`
- `canalEnd` closings: first sentence `Bell is alive.` unchanged in all six; each gains one sentence of meaning (table above).

Transition lines (`scenes.js`, each now one sentence):

- `office>street`: `Rook takes the stairs down to Station Road.` -> `Rook takes the stairs down to Station Road, after the lantern.`
- `street>loft`: `Two doors back, up the iron stair over the lamp depot.` -> `Two doors back and up the iron stair to Bell's lit window, to learn what he knew before he went under.`
- `street>station`: `Three knocks, or a shoulder.` -> `Bell is under that station and Rook is going in, by three knocks or by his shoulder.`
- `loft>station`: `Down the stair with the photographs in his coat.` -> `Down the stair with Bell's photographs in his coat, to the station where Bell's job is still open.`
- `station>pump`: `Down the service ladder, toward the knocking.` -> `Down the service ladder toward the knocking, because whoever is striking that pipe is still alive.`
- `pump>roof`: `Up the service stair, Bell's arm over Rook's shoulder.` -> `Up the service stair with Bell's arm over Rook's shoulder, out of the water and up to where a medic can reach him.`
- `roof>tram`: `Down the service lift to the tram stop.` -> `Vale's car went west, and the last tram of the night is going the same way.`
- `roof>room`: `Rook stays.` -> `Rook stays, and the medic's van takes them both to Night Division, to get Bell's word on paper while he can still give it.`
- `tram>market`: `Over the tram rail and down into the light under the arch.` -> `Over the tram rail and down into the market, the way the red car went.`
- `market>club`: `Through the last of the stalls.` -> `Through the last of the stalls to The Filament, whose sign is loud enough to feel, and to Vale.`
- `club>chase`: `Out the back door and into the patrol car.` -> `Out the back door and into the patrol car, with Vale's tail lights already moving.`
- `chase>tunnel`: `The service ramp drops away beneath the road.` -> `The service ramp drops beneath the road, into drains that all run down to the basin where Vale is going.`
- `chase>substation`: `Across the basin, every window of Substation Nine is lit, and it is one in the morning.` -> `Across the basin every window of Substation Nine is lit at one in the morning, and Rook goes to see who is paying for it.`
- `tunnel>substation`: `The outfall opens onto the basin.` -> `The outfall opens onto the basin, and Rook walks toward the one building on it lit end to end: Substation Nine.`
- `substation>room`: `Vale watches from the back of the patrol car.` / `Back across the city with the sky going grey.` -> `Vale rides in the back of the patrol car to Night Division, where Rook means to ask him who signs above him.` / `Back across the city as the sky goes grey, to Night Division and the room next to Vale's office, to put the night on paper.`
- `room>canal`: `Down to the canal, where Bell is waiting.` -> `Down to the canal at first light, where Bell is waiting to hear what his four nights bought.`

Case file: `boardEntries()` now opens with `caseLine()`. Tests: expected strings updated for `office>street`, `street>station`, `brief` and the shifted persons-of-interest indices, and one new test covers the case line.
