# Stakes review: consequences, deaths and where the story is slack

Narrative Director's answer to the owner's note ("our game is more forgiving/easier. Can we add some real consequences?"). Scope: what the picture shows when the player fails, what a failure costs in the fiction, and what the case is missing to read as a thriller instead of a tour. Mechanics (windows, lives, input) and layout (screen, text pacing) are other directors' sheets; where this sheet needs a mechanism from them it says so and asks for nothing more.

Conventions are those of `BEATS.md`: phase ids are camelCase and set-prefixed, captions are final wording, present tense, one to two sentences, no exclamation marks. Nothing here touches a set's geometry, materials or camera work. Every picture below is drawn with what its set already has.

## 1. Diagnosis

### What the miss route reads like now

Played end to end at 1024 wide, skipping the intro, watching first, reading the tape, listening to the band, asking Marta, and missing every prompt (`node route.mjs miss 1024`). Every caption a player sees after a miss, verbatim:

- Street: `Rook reaches too late. The book falls into the water, and the courier limps away.` Then: `The rain has erased the entries. The cover still reads "PUMP ROOM 4." The lantern the courier dropped is stencilled BELL / DEPOT LOFT.` The trail is intact. The loft is still open. Nothing was lost that the book route would have had.
- Pump: `Bell leaps as the platform breaks. Rook catches his sleeve. His satchel vanishes into the flood.` This is the `pull` outcome with a different verb. The miss is a free pull.
- Market: `The cart takes Rook at the knee. Cells spill and arc on the wet ground. He gets up cut and slow, and Krane is gone.` Two seconds off the next window.
- Club: `The bottle catches Rook's shoulder. He is up in a second, but Vale has the back door and a head start.` Identical to `duck` in every field that matters.
- Carrier: `The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.`
- Bridge: `Rook brakes at the rising bridge. Vale disappears toward the basin. Beyond the canal, the windows of Substation Nine are lit at one in the morning.` The next set is reached on the same line as a success.
- Rack: `The rack takes Rook across the legs. Cells arc; the manifest is ash before he can reach it. The van's doors slam. When Rook drags himself clear, the hall is empty.`
- Interview, first wrong answer: `Rook believes it, and he cannot show it.` Second answer is free. `Left the line blank (second try)`.
- Canal: `Bell is alive. Vale remains at large, the hall is burned, and the man who signed for him is a set of initials.` Report line: `ENDING: A VOICE IN THE DARK. Reflex 0/7, grade D, rewinds used 0.` Records written: ending `dark`, discoveries `observe`, `tape`, `band`, `keeper` and `flawless`.

Seven misses out of seven, and the case closes with `Bell is alive`, the same first sentence as the perfect run, plus the discovery `Closed the case without a rewind`. The player who did nothing right is told they were flawless. That is the whole problem in one line: the lives are optional, so they are never spent; the misses are survivable, so they never cost; the story shrugs (`He gets up`, `He is up in a second`, `Rook recovers`, `Rook drags himself clear`) and carries on to the next set on the same transition line.

Dragon's Lair works the other way round. Dirk dies, the player watches him die, the death is specific and a little funny, the life is taken, the scene rewinds, and the player knows exactly why. The `TOO LATE` stinger and the `[CARRY ON]` button are the two things that make our misses read as nothing. `[CARRY ON]` should exist only where carrying on is a story.

### Where the story is slack

1. **Nobody can die.** Bell survives a miss at the pump by luck. Rook survives a two-tonne rack. The flood, the cells, the elevated road, the pier and the rack are all drawn as dangers and none of them is one.
2. **Vale has no face until the club, and no line until dawn.** He is a signature (office, station), tail lights (street, roof), a two-second windup (`clubFace`) and a chair (`roomEntry`). He never speaks. Krane never speaks. Ashe stands on the dock at `subEntry` for six seconds and the caption does not mention him: the man in the picture is not in the sentence.
3. **The middle sags.** The tram is a quiet beat with an optional watch. The market and the club are back to back and both are Krane throwing something at Rook. Two dangers of the same shape in a row, then three car prompts.
4. **Stay with Bell is a skip.** Two prompts, no antagonist, the room, the canal. It gates one ending (`home`) and nothing in it can be gained on no other route. A real choice would give the stay route something the pursuit cannot have.
5. **The deductions are free or nearly.** A wrong answer at the street costs two seconds at a prompt that cannot kill. The interview's wrong answers cost a discovery. Only the loft bites, and it bites a resource that is never otherwise spent.
6. **Six endings, one opening sentence.** Every closing caption begins `Bell is alive.` The endings differ in what Rook holds; none differs in who is standing at the canal.

### The eight prompts

| Prompt | Danger drawn | Miss today | Proposed miss | Who pays |
| --- | --- | --- | --- | --- |
| `streetQte` courier | rail, gutter | book ruined, courier gone, no cost | survivable: the red car takes the courier; Nell is gone for the night | Nell, the case |
| `pumpQte` inlet | flood, breaking platform | Bell out by luck, satchel lost | lethal: Bell drowns; life taken; night rewinds | Bell |
| `marketQte` cart | cart, arcing cells | Rook cut, -2 s at the club | lethal: cells arc on the wet paving Rook is lying on; life taken | Rook |
| `clubQte` bottle | bottle at head height | shoulder hit, -2 s on the road | survivable: Rook is down; Krane goes through his coat and the ledger leaves with him | the case |
| `chaseQteA` carrier | freight carrier in the lane | clipped, gap 2 | lethal: the patrol car goes over the barrier into the basin; life taken | Rook |
| `chaseQteB` bridge | rising deck | brakes, Vale gone | timed out: survivable, Vale gone for good. `[2]` with a gap: lethal, the car goes into the gap; life taken | Rook, or Vale walks |
| `tunnelQte` fork | brick pier at speed | brakes at the pier, Vale gone | lethal: the pier; life taken. Wrong branch stays survivable, Vale gone | Rook, or Vale walks |
| `subQte` rack | two tonnes of cells, arcs | crushed, manifest ash, Krane gone, a stick for a month | lethal: crushed, Krane looks over the top once; life taken | Rook |

Rule: a miss is **lethal** when the drawn danger would kill and the story has nothing worse to say than death. A lethal miss plays its picture, takes a life and rewinds the night to the windup by itself; `[CARRY ON]` is not offered. A miss is **survivable** when the loss is the case's and the story after it is worse than either right answer (Nell taken, the ledger gone, Vale gone for good); those keep both buttons. With no lives left, a lethal miss plays its picture and the case goes cold.

## 2. Death and failure beats

Every entry: the picture (set, camera, poses from the sprite sheets: watch, walk, stand, stumble, reach, support, read, crouch, sit, radio, lantern, wrench, handsUp, throw), the death caption, the stinger, the duration, the rewind line, and whether the player may carry on. The rewind line is typed as the windup's caption on the rewound pass, in place of the windup's own caption, and ends `Get ready.` like every windup. The `REWIND` card (1.4 s) plays between the death and the windup as today. Pictures hold the prompt's fixed frame unless a result camera is named; every camera named already exists in the set.

**streetQte, missed (survivable).** Picture: the fixed wide prompt frame on the rail. The courier `stumble`, lean -0.6, flat across the rail; Rook `reach` at the curb. The red car from `streetFollow` (`car()` with `dark: true`) comes back along the rails from the far corner over three seconds, stops beside the courier for one second, then leaves with its lights off; the courier sprite is gone when it goes. The lantern stays in the gutter, lit.
- Stinger: `TAKEN`, miss tone.
- Caption: `Rook reaches too late. The courier is down across the rail, and the red car comes back round the corner with its lights off. When it pulls away the rail is empty and the lantern is still burning in the gutter.`
- Duration 5 s. Buttons: `[REWIND THE MOMENT / n LEFT]`, `[CARRY ON]` -> `streetEvidence`.
- Rewind line (`streetDanger`): `The night rewinds. The courier is upright with the book under one arm, and the red car has not moved. Get ready.`
- Carrying on: `choice = 'missed'` persists and now means Nell was taken. `streetEvidence` missed caption becomes: `The rain has erased the entries. The cover still reads "PUMP ROOM 4." The lantern is stencilled BELL / DEPOT LOFT, and its carrier is in the back of a red car.` Nell is absent from the roof and the canal on this route (already true in blocking). `roofSignal` and `roofConfession` are unreachable as now. Persons: `THE COURIER: taken from Station Road by a red car with its lights off. A second missing person on Rook's desk.` Canal Nell line: `The courier is missing since Station Road. Rook has two names on his desk now.`

**pumpQte, missed (lethal for Bell).** Picture: the prompt frame (wheel left, Bell right). The platform box (`box(3.8,0,17,6.5,1.2,18.5)`) drops below the water over 0.8 s; Bell `stumble`, lean 0.5, drops with it to y -1.2 and is removed once under the surface; the torrent from the split joint keeps pouring; Rook `reach` at the walkway's end, then `crouch` from 2 s. With `choice === 'person'`, Nell `reach` at x 1.5 z 14.5 and the line is drawn as a `cable` quad from her hand to the water. The satchel does its existing fall.
- Stinger: `DROWNED`, miss tone.
- Caption, person: `The platform goes and Bell goes with it. Nell's line comes back empty, and the water keeps coming through the joint.`
- Caption, otherwise: `The platform goes and Bell goes with it. Rook has his sleeve, then the sleeve, then nothing, and the water keeps coming through the joint.`
- Duration 4 s. No buttons. A life is taken and the night rewinds to `pumpDanger`; with no lives, `coldCase`.
- Rewind line (`pumpDanger`): `The night rewinds. The joint holds, Bell is still tapping the pipe, and the INLET wheel is at Rook's hand. Get ready.`
- `rescue = 'late'` is no longer a value a checkpoint can carry past the result. `pumpResult`'s late captions are retired.

**marketQte, missed (lethal for Rook).** Picture: the existing late result picture (the cart stopped across the aisle, six cells spilled, `arc` boxes on the paving), held. Rook `stumble`, lean -0.5, on the paving at x -0.7 z 4.2 among the arcs; the arcs stay lit for the whole beat instead of fading; the crowd `stand`, pressed to the stalls; Krane `walk` up the aisle and gone by 3 s. The camera holds the prompt frame, then does the existing slow tilt up the aisle to the club sign over the last two seconds.
- Stinger: `DOWN`, miss tone.
- Caption: `The cart takes Rook at the knee and the cells go over with him. They arc on the wet paving, and the paving is where he is lying. Krane does not look back.`
- Duration 4 s. No buttons. Life taken; rewind to `marketDanger`; or `coldCase`.
- Rewind line (`marketDanger`): `The night rewinds. The cart is parked at the top of the aisle, and Krane has not seen Rook yet. Get ready.`

**clubQte, missed (survivable).** Picture: the existing result camera (`look(2,2.3,8,9.5,1.3,16)`). Rook `stumble`, lean 0.3, on the carpet at his mark; Krane `stand` over him at x 2, z 9.5 for two seconds, then `walk` after Vale through the back door; Vale `walk` out as now. The bottle bursts on the neon as now.
- Stinger: `SIT DOWN`, miss tone.
- Caption, `rescue === 'valve'`: `The bottle takes Rook on the temple and the carpet comes up to meet him. Krane goes through his coat, says "Sit down, detective. The set is not over," and follows Vale out with Bell's ledger in his jacket.`
- Caption, otherwise: `The bottle takes Rook on the temple and the carpet comes up to meet him. Krane stands over him long enough to say "Sit down, detective. The set is not over," and follows Vale out.`
- Duration 4 s. Buttons: rewind and `[CARRY ON]` -> `chaseEntry`.
- Rewind line (`clubFace`): `The night rewinds. Vale is in the booth, Krane is still sitting, and the bottle is on the table. Get ready.`
- Carrying on: `ledger` becomes `rescue === 'valve' && club !== 'late'`. `proof` follows. Clue: `Krane took Vale's signed ledger from Rook's coat at The Filament. The only paper with Vale's name on it left by the back door.` Persons, Krane, inserted above the market line: `club === 'late' && rescue === 'valve'`: `KRANE, Vale's bodyguard: has the signed ledger. Took it off Rook at The Filament.` Room: the LEDGER label and the dispatch box do not appear (derived). Canal evidence line, `rescue === 'valve' && club === 'late'`: `Evidence: the signed ledger, lost to Krane at The Filament. ` The -2 s on the road stays.

**chaseQteA, missed (lethal for Rook).** Picture: the existing `chaseBank` side camera (`look(-13,3.5,d-10,0,1.3,d+6)`). The carrier holds its drift into the lane; the patrol car's x goes from -2.2 to 6.4 over 1.2 s and its y from 0 to -14 over the next 1.5 s (the basin water floor sits at -15 in `chaseSet`); the roof lamp box goes with it. The carrier and Vale's car keep their speed and leave the frame. The right-hand barrier at the impact point is not moved: the car goes over it.
- Stinger: `OVER THE EDGE`, miss tone.
- Caption: `The carrier's trailer takes the patrol car across the bonnet and puts it through the barrier. The elevated road is fifteen metres up, and the freight driver does not stop.`
- Duration 4 s. No buttons. Life taken; rewind to `chaseQteA` (`GET READY` at the prompt start, as the sheet already specifies); or `coldCase`.
- Rewind line (typed at `chaseQteA`'s start on a rewound pass, before the prompt caption): `The night rewinds. The carrier is in its own lane and Vale's tail lights are twenty metres ahead. Get ready.`
- `firstMove = 'late'` and `gap = 2` are retired. `gap` is 0 or 1.

**chaseQteB, timed out (survivable).** Picture: as today (`chaseFinish`, the near-deck camera), with one change: the patrol car stops nose-down against the rising deck's brick lip, and the roof lamp goes out. Rook walks from here.
- Stinger: `GONE`, miss tone (unchanged).
- Caption: `Rook stands on the brakes and the patrol car meets the rising deck at walking pace. Vale's lights cross the far span and drop toward the basin. Rook goes down to Substation Nine on foot, under the lit windows across the water.`
- Duration 6 s. Buttons: rewind and `[CARRY ON]` -> `subEntry`. `pursuit = 'late'` keeps its -2 s at the rack.
- Rewind line (`chaseQteB`): `The night rewinds. The deck is flat and the bridge bell has not started. Get ready.`

**chaseQteB, `[2] FOLLOW OVER THE GAP` with `gap === 1` (lethal for Rook).** The wrong move at the wrong moment is a death, as in the arcade. Picture: the existing far-span caught camera (`look(4,5,bz+18,1.6,1,bz+38)`). The patrol car leaves the near deck on the existing sine arc but the arc peaks at 1.6 and falls: x holds, y goes to -14 over 2 s, through the gap. Vale's car is already on the far span and keeps going.
- Stinger: `SHORT`, miss tone.
- Caption, `radio`: `Heddy Lasko said not to follow him over her gap. The patrol car leaves the deck and the far span is not there, and Rook has time to see Substation Nine lit across the water before he is in it.`
- Caption, otherwise: `The patrol car leaves the deck and the far span is not there. Rook has time to see Substation Nine lit across the water before he is in it.`
- Duration 4 s. No buttons. Life taken; rewind to `chaseQteB`; or `coldCase`.
- The prompt caption when `gap === 1` gains Heddy's warning when `radio`: `Heddy on the channel: "Whoever you are chasing, do not follow him over my gap." ` before the gap sentence. The picture already says it (the VALE label's distance); the line makes it a choice, not a trap.
- Rewind line: as the timed-out entry above.

**tunnelQte, timed out (lethal for Rook).** Picture: the forward prompt camera held (`look(-6,2.4,d-9,.5,1,d+12)`). The patrol car stops at the pier face (z = fork - 2.6) and its roof lamp box is removed; the pier's `highway-sign` box stays lit; Vale's tail lights bend right under the canal gate and are gone by 2 s. The tunnel's neon strips keep their flicker.
- Stinger: `THE PIER`, miss tone.
- Caption: `Rook does not choose and the pier chooses for him. The patrol car goes into the brick at speed, and the drain's neon goes on flickering over it.`
- Duration 4 s. No buttons. Life taken; rewind to `tunnelQte`; or `coldCase`.
- Rewind line (`tunnelQte`, on a rewound pass): `The night rewinds. The fork is ahead again and both mouths are open. Get ready.`
- `tunnel = 'late'` is retired as a carried value; its -2 s at the rack goes with it. The two wrong branches stay survivable with their existing captions: `left` without `radio` ends at the locked gate, and `right` with a gap loses Vale under the canal gate. Since `gap` can no longer be 2, `right` would always catch under the current rule (`gap <= 1`); to keep the fork a real choice, `right` now catches only when `gap === 0`, and the existing `right not caught` caption serves `gap === 1`.

**subQte, missed (lethal for Rook).** Picture: the existing late picture (the rack flat, Rook `stumble` at y -0.45 under its edge, the arcs, the manifest burning), on the existing `subResult` crane. Krane, instead of walking to the van at once, `stand` at the rack's near corner (x 1.2, y 0.3, z 43) for two seconds with the `KRANE` label on him, looking down, then `walk` to the van; the loaders run out as now; the van pulls away as now.
- Stinger: `CRUSHED`, miss tone (unchanged).
- Caption: `The rack comes down across Rook and the cells split around him. Krane looks over the top of it once, then goes to the van.`
- Duration 4 s. No buttons. Life taken; rewind to `subDanger`; or `coldCase`.
- Rewind line (`subDanger`): `The night rewinds. The rack is upright and chained to nothing, and Krane has his back to it. Get ready.`
- `hall = 'late'` is retired. `DETECTIVE ROOK ... walking with a stick for a month` goes with it.

### The game over

Reached from any lethal miss when `rewinds === 0`. The death picture plays for its full duration; then the card `CASE COLD` (miss tone, 4 s) and the phase `coldCase` in the set of the death, camera held on the death frame, `dawn` untouched. It is the case's seventh ending and is recorded like the others (section 5).

**coldCase** (quiet choice, terminal; set is whichever set the death was in)
- Chapter title line: `THE CASE GOES COLD`. Objective: `CASE COLD`.
- Sets `dead` to the death's id (`pump`, `market`, `carrier`, `gap`, `pier`, `rack`). Records are written here on a story session.
- Caption, `pump`: `Night Division, morning. IVO BELL, lamplighter, is recovered from Pump Room 4 by the day shift. The order on the desk is gone before they arrive. Rook's report is one page and names nobody it can prove. Inspector Vale signs it.`
- Caption, `market`: `Night Division, morning. DETECTIVE ROOK is found under a cell-cart at Market Arch. The stall keepers saw nothing. Inspector Vale signs the report, and the file goes to the cabinet with the others.`
- Caption, `carrier`: `Night Division, morning. The patrol car is lifted out of the basin at nine. The freight company's log says the lane was clear. Inspector Vale signs the report, and the file goes to the cabinet with the others.`
- Caption, `gap`: `Night Division, morning. The patrol car is lifted out of the basin at nine. Lift Bridge Two's log says the lift was announced on the half hour. Inspector Vale signs the report, and the file goes to the cabinet with the others.`
- Caption, `pier`: `Night Division, morning. The patrol car is found against the pier in the storm drain. Nobody on the floor can say what Rook was doing under the canal. Inspector Vale signs the report, and the file goes to the cabinet with the others.`
- Caption, `rack`: `Night Division, morning. The Board's day engineers find Rook in the battery hall of Substation Nine, under a rack the manifest says was never there. Commissioner Ashe expresses the Board's regret. Inspector Vale signs the report.`
- Outcome line: `caseReport()` then the cold summary: `pump`: `Bell did not come out of Pump Room 4. Vale signed the report.`; otherwise: `Rook did not see the morning. Vale signed the report.` Then the deaths line: `Deaths seen this case: n.`
- Buttons: `[RETURN TO MENU]`.
- Persons at `coldCase`: Rook, `dead !== 'pump'`: `DETECTIVE ROOK, Night Division: killed on duty. Report signed by Inspector Vale.`; Bell, `dead === 'pump'`: `IVO BELL, lamplighter: drowned in Pump Room 4. Report signed by Inspector Vale.`; Vale: `INSPECTOR VALE, Night Division: signed the report. Still on the floor.`
- Route step: `Case cold at the pump` / `at the market` / `on the elevated road` / `at the bridge` / `in the drain` / `at Substation Nine`.

### Deaths seen

Dragon's Lair players collect deaths. Each lethal picture, the first time it is seen in a case, sets a bit in `deaths` (an integer, never cleared by a rewind): pump 1, market 2, carrier 4, gap 8, pier 16, rack 32. The records gain a `deaths` list beside discoveries, shown as `DEATHS SEEN n/6` with the labels: `drowned` `Watched the water take Bell`; `arc` `Went down among the cells`; `edge` `Went over the barrier`; `gap` `Followed Vale over the gap`; `pier` `Met the pier in the drain`; `crushed` `Went under Krane's rack`. They are written at `canalEnd` and at `coldCase`. A death seen and rewound still counts: that is the arcade's deal.

## 3. Deductions with teeth

One ladder for all three: the first wrong answer costs what the fiction says it costs; the second wrong answer costs a life, with a caption that says so; the third is impossible because the last wrong button is removed after the second. A player can no longer brute-force a deduction for free.

**streetDeduce.** First wrong (`[THE HOTEL ACROSS THE ROAD]`): `wrong = true`, -2 s at the pump as now. The pump can now kill, so the two seconds mean something; make the picture say so: `pumpFind` caption when `wrong`: `Bell: "Vale took the reserve batteries. I found his ledger, so he locked me down here." The water is at his knees. "You took your time. That pipe will not hold much longer."` Second wrong (the hotel again): `rewinds = max(0, rewinds - 1)`, card `REWIND` in miss tone, caption: `The hotel night clerk has never heard of Bell and says so twice. Rook has spent the kind of time a life is made of, and the water under the station has spent it with him.` The hotel button is removed after the second pick.

**loftBoard.** As built (first wrong costs a life and `misread`), plus: the second wrong answer removes both wrong buttons and types: `Rook has now been wrong twice in a room with the answer pinned to the wall. The photographs are of the club, and the van is the Board's.` No further cost; the life is already gone.

**roomDeduce.** With a sitter, a wrong answer is the sitter's win, and the second one ends the interview.
- Vale in the chair, first wrong: `slip = true`, the existing hint caption, the existing lean. Second wrong: `stalled = true`; caption: `Vale asks for his lawyer, politely, and the recorder stops. Whatever Rook has, he has to write it without Vale in the room.` The buttons are replaced by `[WRITE THE WARRANT]` -> `roomName`. With `stalled`, `roomName` uses its no-proof captions even with proof, and the clue reads: `Deduction: Vale signed for someone on the Board. Vale stalled the interview before the name went on paper.` Ending: `board` requires `!stalled` (section 5).
- Krane in the chair, second wrong: `stalled = true`; caption: `Krane stops talking. "You want Vale? I want a name off the ledger. Mine." Rook does not have a ledger to take a name off.` Then `[WRITE THE WARRANT]`. The `krane` ending's closing caption drops `and Krane has begun to talk` when `stalled`: `and Krane, in a splint in the room next to Vale's office, has stopped talking until somebody offers him a deal.`
- Bell in the chair, wrong answers: `slip` only, as now; Bell is not a man Rook can lose to. Second wrong caption: `Bell waits. "You have my word and a piece of paper with his name on it. Say what the paper says."` The last wrong button is removed.
- Empty room: `slip` only; the last wrong button is removed after the second pick.

## 4. Antagonist presence

Three short beats, no new sets, existing cameras. Lines are from the cast bible.

**loftStair** (quiet choice) NEW, loft branch only, between `loftBoard` and `loftLeave`.
- Camera: the `loftLeave` window shot (`look(-.2,1.5,4.2,0,7.5,22)`), which already looks down at the street four units below. Vale `stand`, `who: 'vale'`, on the paving at x -3, z 12 under the lamp there, looking up; the red car `car(-1,14,3,-4)` at the kerb with its lights on. Both are drawn only in this phase.
- Caption: `Below the window, under the depot lamp, a man in a Division greatcoat is looking up at the lit loft. Vale. His red car is at the kerb with the engine running.`
- Buttons: `[GO DOWN AND FACE HIM]` -> `faced = true`, redraw with the faced caption and `[TAKE THE PHOTOGRAPHS AND GO]` -> `loftLeave`; `[STAY OUT OF THE LIGHT]` -> `loftLeave`.
- Caption, faced: `Vale does not step back from the stair. "Rook. You are on the wrong floor for this." He looks at Rook's coat where the photographs are, then at the station clock, then gets into the car.`
- Clue, faced: `Vale, at the depot at midnight: knows Rook is on the case and did not ask why. He looked at the station clock.`
- Consequence: `faced` is texture, not a window: Persons, Vale, inserted above `reached('stationQuiet')`: `INSPECTOR VALE, Night Division: met Rook under Bell's loft at midnight. Knows Rook is on it.` `roomEntry` caught caption when `faced`: `... He has asked for nothing. It is the second time tonight they have looked at each other across something, and this time the table is Rook's.` `loftLeave` caption when `faced`: `Rook takes the photographs. The red car is gone from the kerb and the station clock reads five past midnight. Bell's job is still open.`
- Camera: unchanged; the window shot already frames the paving where Vale stands.

**clubBooth** (quiet choice) NEW, every pursuit route, between `clubEntry` and `clubFace`.
- Camera: the `clubFace` shot (`look(-4,4.8,4,7,1.2,13)`), which frames the booth. Vale `stand` at the booth, Krane `stand` beside it, Rook `watch` at his mark, as `clubEntry` ends.
- Caption, `faced`: `Vale does not get up. "Twice in one night, Rook. You are still on the wrong floor." Krane's hand is on a bottle.`
- Caption, otherwise: `Vale does not get up. "Rook. You are on the wrong floor for this." Krane's hand is on a bottle.`
- Buttons: `[SHOW HIM ORDER 7731]` -> `shown = true` -> `clubFace`; `[SAY NOTHING]` -> `clubFace`.
- `clubFace` caption, shown: `Vale reads his own signature and does not deny it. "Reserve batteries. Signed. Nobody reads a maintenance order." Krane is already up, and a bottle leaves his hand. Get ready.`
- `clubFace` caption, otherwise: `"Put the light down. There is nothing here to see." Krane rises, and a bottle leaves his hand. Get ready.`
- Clue, shown: `Vale, shown order 7731 at The Filament, did not deny signing it. His words: "Nobody reads a maintenance order."`
- Cost: `shown` takes 2 s off the bottle window (Krane is already on his feet). Benefit: with `shown`, the `word` ending's closing caption ends `... and Vale's own words about the order are in Rook's notebook. It will have to be enough.` and `roomDeduce`'s `alone` hint with Vale in the chair begins `Vale almost smiles, the way he did at the booth.` This is the beat that makes the club a confrontation instead of a second thrown object, which is the middle act's sag.

**subDock** (cutscene, 5 s) NEW, every pursuit route, between `subEntry` and `subManifest`.
- Camera: the end of the `subEntry` crane (`look(.4,5.5,2,0,1,44)`), held; Ashe `stand` on the dock at x -2.5, y -1.2, z 56 as he is blocked now, for the whole beat, then `walk` right out of the door's frame in the last second. He is in the sentence this time.
- Caption: `On the dock beyond the van, out of the rain under an umbrella that has not closed all night, a man in a grey coat with a lit Board pin watches the loading. He sees Rook, says "Detective. You are standing in my rain," and walks, unhurried, out of the light.`
- Clue: `Seen on the dock at Substation Nine: a Lumen Board man in grey, dry under an umbrella, watching the loading. He left when he saw Rook. He was not hurrying.`
- Persons, Ashe, inserted above the `subManifest` line: `reached('subDock')`: `THE GREY MAN: Lumen Board, by the pin. Watched the loading from the dock and left dry.` (The manifest beat names him a moment later; the sequence is see him, then read his name.)
- No field. The producer's open question ("Ashe is seen but never confronted") is answered: seen, one line, gone. The confrontation is the next case.

**Krane's lines**, in existing captions:
- `subResult`, dive: `... Krane does not go anywhere. From under the rack, to nobody: "I locked the door. He said the pumps would run."` This is the seed of the `krane` ending and Krane's confession about Pump Room 4; it lands while he is pinned.
- `roomName`, kranePinned and no proof, as now, and with `stalled` as in section 3.
- `clubResult`, late: his line is in section 2.

**The tram** gets Heddy's second line when `radio`, so the quiet bridge carries a witness: `tramRide` caption, radio: `The tram crosses the dark district on its own reserve. Heddy on the channel, unasked: "Red car again. Same hour as last week. I write these down, detective." Behind the tram, one pair of headlights keeps the same speed on the road below, then goes dark.` Clue: `Heddy Lasko keeps a dated log of the red car crossing Lift Bridge Two at the same hour every week. A second witness with paper.` Persons, Heddy, when `radio && reached('tramRide')`: `... Keeps a dated log of Vale's crossings.` No field; `radio` and `reached()` carry it.

## 5. Endings and records

**Stay with Bell becomes a choice.** On the stay route, Vale comes to the room.

**roomVale** (quiet choice) NEW, `pursuit === 'stay'` only, between `roomEntry` and `roomDeduce`.
- Camera: the `roomName` shot (`look(-2.2,1.5,5.4,-1,1.7,-13)`), seated at the mirror end, looking past Rook and Bell through the open door: Vale `stand`, `who: 'vale'`, in the door gap at x -1.2, z -0.5, for this phase only. Bell `sit`, Rook `read`.
- Caption: `05:55. Vale comes down the corridor to clear his office and finds the light on in Interview 2, and Ivo Bell alive across the table with a blanket on his shoulders. He stops in the door. "Rook. You are on the wrong floor for this."`
- Buttons, `ledger`: `[ARREST HIM]` -> `caught = true` -> redraw with the arrest caption, then `[SIT HIM DOWN]` -> `roomDeduce`; `[LET HIM WALK]` -> `roomDeduce`.
- Buttons, otherwise: `[ARREST HIM ON BELL'S WORD]` -> redraw with the walk caption, then `[GET ON WITH THE STATEMENT]` -> `roomDeduce`; `[LET HIM WALK]` -> `roomDeduce`.
- Caption, arrest: `Rook puts the dry ledger on the table with Vale's signature up. Vale looks at it for a long time, then at Bell, then holds out his wrists, because he knows what the floor will say if he runs.` Vale's pose changes to `handsUp` on the redraw.
- Caption, walk on Bell's word: `Vale looks at Bell. "A lamplighter found in a pump room by a detective who was sent there by a forged order. Bring the paper, Rook." He walks. Nobody on the floor stops him.` (Nell's forgery is the crack Vale puts his thumb in; a player who has `twist` has already heard it.)
- After the arrest, `roomDeduce` and `roomName` run with Vale in the chair as on any caught route (`roomSitter()` already returns `vale` when `caught`); `canalEntry` uses its caught caption. `stayWithBell()` keeps `caught = false`; only this beat sets it.
- The `home` ending's closing caption is rewritten, since Vale's office is no longer "empty by dawn": `Bell is alive, and his testimony is on record. Vale walked out of his own building at dawn with Rook's eyes on his back. Rook brought the missing man home, and the street will be lit tomorrow because Nell knows the route.` Summary unchanged.

**Endings, evaluated top to bottom.** Seven, with the cold case; `board` moves above `home` so a stay-route arrest with the ledger reaches it.

| # | id | Name | Condition | Change |
| --- | --- | --- | --- | --- |
| 1 | `cold` | `THE CASE GOES COLD` | `dead !== ''` | new; closing caption is the `coldCase` caption |
| 2 | `board` | `LIGHTS ON THE BOARD` | `caught && proof && !stalled` | reachable on stay with the ledger; lost if Vale stalls the interview |
| 3 | `home` | `THE LAMPLIGHTER HOME` | `pursuit === 'stay'` | closing caption rewritten above |
| 4 | `word` | `WORD AGAINST WORD` | `caught` | closing caption gains the `shown` sentence; now includes stalled interviews |
| 5 | `krane` | `THE BODYGUARD TALKS` | `!caught && kranePinned` | closing caption variant when `stalled` |
| 6 | `paper` | `THE PAPER TRAIL` | `!caught && proof` | unchanged; note `proof` can now be lost at the club |
| 7 | `dark` | `A VOICE IN THE DARK` | otherwise | closing caption when `choice === 'missed'`: `Bell is alive. Nell Marrow is not found. Vale remains at large ...` |

Every closing caption but the first still opens `Bell is alive.` That is now earned: the water can take him.

**Records.** `endings` gains `cold`; the menu shows `ENDINGS n/7`. `cases` counts closed cases; a new integer `cold` counts cold ones: `CASES CLOSED 3 / COLD 1`. A new `deaths` list (section 2). `flawless` is corrected to `rewinds === 3 && reflexes().hits === reflexes().faced` so an all-miss run cannot earn it; `sharp` gains `&& !stalled`. New discoveries, two: `stayArrest` `Arrested Vale in his own building` (`pursuit === 'stay' && caught`); `booth` `Made Vale answer for order 7731` (`shown`). Twenty-two discoveries; the brief said sixteen to twenty, and the two are the stay route's and the club's reasons to exist.

**Reflex.** A death is not a hit. `hits` counts a prompt as landed only when its value is not `late`/`missed` and no death bit for that prompt was set on the pass that produced the value; the simplest rule is that a rewound prompt counts once, with the value it finally carries, and `faced` counts every prompt entered. Grade `A` with deaths seen is impossible only if the mechanics sheet wants it so; this sheet has no opinion beyond the death not being a hit.

**Second playthrough.** The records now hold seven endings, twenty-two discoveries, six deaths and a cold count. A first run that ended at the canal has not seen the stay arrest, the booth, the loft stair, or any death picture unless it missed; a first run that went cold has seen one death and no ending. The route table tells the player which deduction went wrong twice. The deaths list is the arcade's reason to replay: nobody has seen all six without trying to.

## 6. Change list

Fields (flat, in `save-store.js`'s lists):

| Field | Type | Values | Set by | Note |
| --- | --- | --- | --- | --- |
| `dead` | enum | `''` `pump` `market` `carrier` `gap` `pier` `rack` | `coldCase` enter | the death that closed the case |
| `deaths` | integer | 0..63 | each lethal result's enter, bit per prompt | never reset by a rewind |
| `stalled` | boolean | | `roomDeduce`, second wrong pick with Vale or Krane | ends the interview |
| `faced` | boolean | | `loftStair` | texture only |
| `shown` | boolean | | `clubBooth` | -2 s at the bottle; `word` caption; discovery |
| `rewound` | transient, not saved | | `rewind()`; cleared when the windup advances | selects the rewind line |

Retired values: `rescue = 'late'`, `firstMove = 'late'`, `gap = 2`, `tunnel = 'late'`, `hall = 'late'` no longer survive a result. The enum lists may keep them for old checkpoints; a checkpoint carrying one resumes at the prompt's windup with `rewinds` as saved.

Window table changes (for the mechanics sheet): `clubQte` minus 2 when `shown`; `chaseQteA`/`chaseQteB` minus 2 when `club === 'late'` unchanged; `subQte` loses its `tunnel === 'late'` term and keeps `pursuit === 'late'`.

| # | Item | Where | Effort |
| --- | --- | --- | --- |
| 1 | Lethal results: no buttons, life taken on enter, auto-rewind after the duration, `coldCase` at zero lives; `rewound` and the rewind line in the windup | `runtime.js` (`rewind`, `rewindActions`, `caseAdvance`), `registry.js` result kind | M (mechanics sheet owns the mechanism; this sheet owns the captions) |
| 2 | Street miss picture: red car returns, courier removed, `TAKEN`; three captions and two persons/canal lines | `runtime.js` blocking and geometry for `result`, `case.js` | S |
| 3 | Pump death: platform drop, Bell under the surface, Nell's line, `DROWNED`; retire the late captions | `scenes.js` pump geometry and blocking, `case.js` | M |
| 4 | Market death: hold the arcs, Rook among them, `DOWN` | `sets/market.js` geometry, blocking, phases | S |
| 5 | Club miss: Rook down, Krane over him, the ledger taken; `ledger` derivation; Krane and evidence lines | `scenes.js` club blocking, `case.js`, `presentation.js` (`ledgerHeld`) | S |
| 6 | Carrier death: car through the barrier and down; `OVER THE EDGE`; retire `gap = 2` | `scenes.js` chase geometry, `case.js` | M |
| 7 | Bridge: timed-out stop picture and caption; the jump with a gap as a death on the far-span camera; Heddy's warning in the prompt caption | `scenes.js`, `case.js` | M |
| 8 | Fork death at the pier; `right` catches only at `gap === 0` | `scenes.js` tunnel geometry, `case.js` | S |
| 9 | Rack death: Krane pauses at the corner; caption; retire `hall = 'late'` lines | `sets/substation.js` | S |
| 10 | `coldCase` phase, card, six captions, outcome line, persons, route step; records write | `case.js` or a new `sets/cold.js` phases block, `presentation.js`, `save-store.js` | M |
| 11 | `deaths` bitmask, records `deaths` list, menu line, six labels | `presentation.js`, `save-store.js`, tests | M |
| 12 | Deduction ladder: second wrong costs a life, buttons removed, `stalled`, `[WRITE THE WARRANT]`, captions | `runtime.js` (`deduce`), `sets/loft.js`, `sets/room.js` | M |
| 13 | `loftStair` beat with Vale and the car under the window; `faced` lines | `sets/loft.js` | S |
| 14 | `clubBooth` beat, two `clubFace` captions, `shown`, clue, window term | `case.js`, `scenes.js` club blocking | S |
| 15 | `subDock` beat and Ashe's walk-out; persons line | `sets/substation.js` | S |
| 16 | Krane's line under the rack; Heddy's line on the tram and her persons line | `sets/substation.js`, `sets/tram.js`, `presentation.js` | S |
| 17 | `roomVale` beat, Vale in the door, arrest and walk captions, `handsUp`; `home` caption rewrite; ending order | `sets/room.js`, `presentation.js` | M |
| 18 | Endings table: `cold`, `board` condition and order, `word`/`krane`/`dark` variants; `flawless` fix; `sharp`; two discoveries; `ENDINGS n/7`; `cold` count | `presentation.js`, `save-store.js`, tests | M |
| 19 | `BEATS.md` sections 3, 4, 7, 8, 9 updated to match; `DECISIONS.md` note that the brief's six endings and twenty discoveries become seven and twenty-two | docs | S |

Untouched: every set's build, materials, labels, exit points, transition lines and every camera. The pictures above are blocking and per-frame geometry inside frames the sets already draw: a car's `y`, a platform's `y`, a sprite's pose and lean, a box removed. The story's spine, the route table's order, the persons table's structure and the save format's shape (flat enums, booleans, integers) are unchanged.

Test coverage to add (`npm test`): a lethal miss at 0 lives reaches `coldCase` and writes `cold`; a lethal miss at 1 life re-enters the windup with `rewinds` 0 and the death bit set; the all-miss route no longer records `flawless`; stay + `valve` + `[ARREST HIM]` records `board`; `stalled` maps a caught-with-proof run to `word`; a checkpoint carrying `rescue = 'late'` resumes at `pumpDanger`.
