# Story pass review: does the story blend with the game?

Game director's review of commit 9d08ad1 ("Tell the story"), read against `AGENTS.md`, `docs/design/STORY.md`, `DECISIONS.md` (three rounds) and `review/GAME.md` sections 1-3, and played. Holds were measured with `tests/harness.cjs` on the HEAD build and on a build of HEAD~1 with the same inputs (per phase: the caption queue's `captionHold()`, chunk by chunk). Timestamps come from `route.mjs` in Chromium under a fake clock, on the long route and the wrong-theory (`board`) route at 1024 wide. The Chromium bot presses a quiet beat's button 0.2 s after it appears, so the Chromium totals count only the enforced holds of cutscenes and results. The unmodified `route.mjs` stops at `officeEntry` ("waited 30 s on [SKIP INTRO]") because the cold open now holds 37 s. The writer's own `story-long.log` and `story-stay.log` stop in the same place, so this pass was never played past the first beat. I raised the wait in a scratch copy to get both runs through. `node --test` passes, 37 of 37.

**Verdict: APPROVE WITH CHANGES.** The pass does what the studio head asked for. The cold open says who Bell is and what a lamplighter does. "Not this one." gives Rook a reason. Vale's booth line ("You have countersigned a hundred of mine") pays off the file, and every ending now says what the night meant. Nothing it added breaks a windup (all still ten words or fewer, ending "Get ready.") or a prompt caption. It does fight the game in three places, and those must change before merge. (1) Rook's pump entry line, "Get him out first", tells the player to press the move that loses the ledger, which contradicts the tape. (2) The longer Bell line pushes the theory verdict and "The INLET wheel is beside Rook" to 20-22 s into a quiet beat whose only button is live from 0 s, so the payoff of the station slice is skipped. (3) The new case line at the dawn interview presupposes the answer to the room deduction, and on no-proof routes it steers the player to the wrong one. Beyond those, the pass adds about 3.5 minutes of reading hold to the long route: 69.8 s of it enforced in Chromium (438.4 s to 508.2 s to the ending, +16%), of which 27.6 s is the cold open. Most of that is entry cutscenes that now hold 20-31 s over 5-8 s pictures, and quiet beats at 20-29 s against a ~12 s budget. The station's costs are still stated rather than felt. Each finding below is a caption, a label or a small code change, with no new phases or fields.

## Findings

1. **BLOCKING. `pumpEntry`: Rook's line picks the wrong cue.** `Rook: "Get him out first. Questions after, if the water leaves us time."` is the last voice the player hears before `pumpQte`, where `>>` (PULL BELL OUT) loses the satchel and the ledger and `<<` (CLOSE THE INLET) saves both. The tape the player may have just read says "CLOSE INLET FIRST", so the line contradicts the evidence and tells the player which direction to press. Fix: set up both moves without ranking them:
   `Rook: "Bell first, and whatever he found down here, if the water lets me keep both."` Also drop the next sentence, `Under the station, pumps tower above black water.` (the picture shows it). With the line, the beat holds about 20.1 s instead of 22.8 s.

2. **BLOCKING. `pumpFind`: the theory's payoff and the inlet's setup now arrive after the button.** Holds: 23.0 s with the Vale theory (was 16.5), 27.9 s with the Board theory, 29.7 s with the courier theory. Bell's longer line pushes the verdict into chunk 1, where "Not the courier." is split from its sentence at the chunk boundary, and "The INLET wheel is beside Rook." into chunk 2, which starts at 19.7-21.8 s (it started at 10.1 s before). `[GET BELL OUT]` is live from the first frame, and in Chromium it was pressed at 0.3 s on the Board route, so "Not a Board driver: Vale's own hand on the bolt." was never shown. Fix (case.js; the verdict lands in chunk 0, and the hold is 14.3-18.5 s):
   ```js
   case 'pumpFind':{
    const late=state.wrong||lateDown();
    el.caption.textContent='Bell: "Vale locked me in. He is selling the batteries off my route, and I found his ledger." '+(theoryVerdicts[state.theory]?.()||'')+(late?'The water is at his knees now, and the INLET wheel is beside Rook.':'The INLET wheel is beside Rook.');
    button('[GET BELL OUT]',()=>enter('pumpDanger'));break;}
   ```
   with `theoryVerdicts` = vale `'It is the name Rook came down with. '`, nell `state.choice==='person'?'Not the courier; Nell heard Bell clear her. ':'Not the courier; Rook\'s call is still on the band. '`, board `'Not the Board\'s driver: Vale\'s own hand on the bolt. '`, none as in finding 12. Update the two theory tests' `includes(...)` strings to match, and assert that the verdict is in `caption.chunks[0]`.

3. **BLOCKING. `caseLine()` at `roomEntry`/`roomDeduce` gives away the room deduction and, without proof, points to the wrong answer.** `THE CASE: Vale sold the reserve batteries for the Board and locked Bell in to keep it quiet. Who signed above him?` sits at the top of the case file while `roomDeduce` asks `[VALE SIGNED ALONE] / [SOMEONE ABOVE VALE SIGNED] / [NOT ENOUGH TO SAY]`. When `proofHeld()` is false (Bell pulled out, the rack dived, the hall lost), the right answer is NOT ENOUGH TO SAY, and the line pushes the player to the pick that costs `slip`, `ashe` and `sharp`, and with Vale or Krane in the chair can stall. On my stay route (desk: tape and hatch; no theory; Bell pulled out) nothing the player saw ties Vale to the Board, so "for the Board" is also ahead of the evidence. Fix (presentation.js):
   `if(at('roomEntry'))return 'THE CASE: Vale sold the reserve batteries and locked Bell in to keep it quiet. The warrant can carry only what Rook can prove.';`

4. **SHOULD. `officeEntry`: the cold open holds 37.2 s (was 8.8) on a 6 s picture, and nobody played past it.** Four chunks of 9.7 s, 10.3 s, 8.5 s and 8.3 s; in Chromium it ran 35.7 s. Long is allowed here, but "and the towers uptown buy most of it" is told again by the window look and the roof, and "his street is going dark" by the brief. Fix, 28.0 s in three chunks:
   `Halvard, 23:40, the ninth night of rain. The Lumen Board rations the city's power. The low streets stay lit only because lamplighters walk them, switching each lamp on by hand from its own reserve battery. Ivo Bell of the station route has been missing four nights. Missing persons is Rook's desk, and his lamp is the last one burning at Night Division.`
   Then raise `route.mjs`'s 30 s wait to 45 s and replay every route before merge.

5. **SHOULD. `roofEntry`: +16.0 s, the largest increase, and the choice after it is set up on one side only.** The line plus the caption hold 31.4 s (was 15.4) over an 8 s picture; in Chromium it ran 30.5 s between Bell's truth and the choice. The `pump>roof` line promises "a medic can reach him", then the caption introduces the medic. `Rook: "Bell is breathing, and Vale does not know it yet, but that will not last the hour."` argues only for `[PURSUE VALE]`; what `[STAY WITH BELL]` is for is said only after it is chosen (`roof>room`). Fix: `pump>roof` back to `Up the service stair, Bell's arm over Rook's shoulder.` and the caption:
   `Rook: "Within the hour Vale will know Bell is breathing. I can be on Vale when he finds out, or beside Bell." Ines Okafor, a city medic, is waiting by the roof radio with a blanket.` (about 20.3 s with the line).

6. **SHOULD. Entry cutscenes: the Rook line was added on top of each caption when it should have replaced a sentence.** Old to new hold: `stationEntry` 11.6 to 20.1, `tramEntry` 20.2 to 28.2, `marketEntry` 18.7 to 30.3, `clubEntry` 19.8 to 30.1, `chaseEntry` 20.1 to 25.2, `subEntry` 20.2 to 31.6, `roomEntry` 19.9 to 28.0, `canalEntry` 11.6 to 22.0, each over a 6-8 s picture. The chase and the substation run 23.5 s and 29.7 s in Chromium before their first beats. Fix, a cut per entry:
   - `street>station`: `Bell is under that station, and Rook is going in.` Drop `Footsteps echo through the empty concourse.` (14.5 s)
   - `marketEntry`: drop `At the aisle's end, The Filament's sign burns pink.` (26.1 s)
   - `clubEntry`: drop `I go in alone, and every table is his.` (about 26 s)
   - `chase>substation`: `Across the basin, every window of Substation Nine is lit at one in the morning.` with `subEntry` = `Rook: "If this is where Bell's batteries go, I want the name above Vale's, and there is one of me." Rook leaves Vale cuffed in the patrol car. A Lumen Board van is backed up to the loading door.` (about 24 s). The `Vale's car is not here` branch keeps its own second sentence.
   - `canalEntry`: `Rook: "I went out for one missing man, and he is coming home."` (about 20.1 s)

7. **SHOULD. `subDock`: a one-line beat became a speech.** DECISIONS round two, item 11: "Ashe seen and heard, one line". The beat is now three sentences of dialogue, 30.6 s (was 22.2) on a 5 s beat, then `subManifest`, then the rack windup. Fix (23.8 s):
   `On the dock beyond the van, dry under an umbrella that has not closed all night, a man in a grey coat with a lit Board pin watches the loading. He sees Rook. "Detective. You are standing in my rain. The light goes where it is paid for." He walks, unhurried, out of the light.`

8. **SHOULD. `officeDesk` looks: the meaning lines come last, behind live buttons.** The file look holds 23.4 s (was 12.9) and `Rook: "Not this one."` is chunk 2, at 14.8 s. The board look holds 22.0 s (was 12.6) and Rook's Vale line starts at 10.5 s. Four spot buttons are live throughout, and the Chromium run picked the next spot at 1.5 s. Fix: file (14.6 s) `The Bell file came down from across the corridor already stamped NO FURTHER ACTION. Rook has countersigned that stamp a hundred times without asking whose it was. Rook: "Not this one."` The "last seen / stranger" sentence is already in the brief. Board (17.1 s) `On the case board, beside Bell's photograph, a Lumen Board commendation for INSPECTOR A. VALE, GRID SECURITY LIAISON, initialled H.A. at the foot. Rook: "Vale signs like a man nobody has ever asked to read it back."` The shot already pans to Vale's dark door, and the clue says so.

9. **SHOULD. `brief`: Rook's line invents a cost that `[WATCH FIRST / 8s]` does not have.** `If I lose it in this rain, I lose him.` tells the player that watching risks the lantern, but watching can never lose the courier and it earns the limp and +0.5 s. The phase caption holds 15.8 s (20.9 s with the line), and "toward the closed North Station" answers the street deduction before it is asked. Fix (9.5 s):
   `Rook: "Whoever has Bell's lantern knows where he went." Rook can close on it now, or watch how it moves first.`

10. **SHOULD. `pumpTruth`: 28.4 s (was 17.0) on a beat with one button.** Bell's `Forty years on this route. I know which lamps were never meant to come back on.` repeats what `pumpFind` and the cold open established. Fix: drop those two sentences from the valve branch (19.7 s with the case board read). Make the pull branch `Bell: "Vale sold my lamps, and when I faced him with it he locked me in. The ledger was in that satchel. I will say it in court."` (12.1 s), which keeps "which desk was safe" for the valve branch only.

11. **SHOULD. `stationTheory` costs: the lost minute is stated, not felt.** `pumpEntry`'s `the water is a hand higher than it was a minute ago` names no cause. The 0.5 s taken from the inlet window, the price of a wrong name, never appears as story, even at the death it can cause. Fix (case.js): add
    `const theoryMinute={nell:()=>state.choice==='person'?'while Rook put it to Nell at the hatch':'while Rook put the courier out on the band',board:()=>'while Rook watched Bay 2 for a van that never came',none:()=>'while Rook stood at the hatch without a name'};`
    In `pumpEntry`, change the ending to `+(lateDown()?', and the water has climbed a hand '+theoryMinute[state.theory]()+'.':'.')`. In `pumpDeath.caption`, append `+(lateDown()?' The pipe held four nights; it did not hold the minute Rook spent at the hatch.':'')`. The death then reads as the result of the theory (about 14.9 s at the death).

12. **SHOULD. `[NO THEORY. GO DOWN]` costs the same minute as a wrong name, and the player gets no reason.** `lateDown()` is true for `none`, so the player who "goes down" at once gets a higher water line and a shorter window, and `theoryVerdicts.none` is `''`. My stay route heard only Bell's `"You took your time."`, which the player cannot connect to anything they pressed. Fix: relabel `b('[NO THEORY]',pick('none'))` and set `none:()=>'Rook came down with no name; Bell has one. '` (with finding 11's minute clause). Update the three `buttons()` expectations in the theory tests.

13. **SHOULD. Suspecting the courier: the confession and the band are lost silently.** With Nell present, roofQuiet's `Nell stands at the far parapet and does not come over.` is the last sentence of a 24.9 s caption and does not say what was lost unless the player also listens to the radio. With Nell gone, the band line is chunk 3, at 20.0 s. After the roof nothing mentions the band again: at the fork, the locked gate reads as bad luck. Fix: put the cost line straight after `Bell is safe with the medic.`, with nellWary `Nell stands at the far parapet with Bell's lantern. Whatever else she knows about tonight, she is keeping it from the man who accused her.`, and in `tunnelFinish`'s locked-gate branch append `+(bandBusy()?' The band that might have warned him was full of Rook\'s own call for the courier.':'')`. Update the `endsWith('Nell stands...')` assertion.

14. **SHOULD. `stationDesk` "3 LOOKS LEFT": the knocking can't be seen by anyone reading at normal speed.** `pressure()` is appended after each look, so the knocking lines appear as a second chunk at 11.4 s, 12.1 s and 10.5 s, or fused behind the tape's inlet line. The Chromium run, one look every 1.5 s, never displayed one. The title counts down, but the fiction's clock (Bell weakening) is never on screen. Fix (case.js `investigateUI`): `el.caption.textContent=(seen&&d.pressure?d.pressure()+' ':'')+(seen?seen.look():d.caption?d.caption():'');` with `knockLines=['','Under the floor: three short, a rest, three short.','The knocking is slower now.','The knocking stops. Then, weaker, it starts again.']`. The tape look then holds 15.3 s, with the knock in its first second.

15. **SHOULD. `caseLine()` at `evidence`/`deduce` answers the street deduction.** `THE CASE: Bell is alive in Pump Room 4, under the closed North Station.` (or `...last logged at...`) is in the file while `deduce` asks `[THE STATION SERVICE DOOR]` or `[THE HOTEL ACROSS THE ROAD]`. The new Nell line also dropped "below the station", so the case line is now the only place that says it. Fix:
    `if(at('arrival'))return state.choice==='person'?'THE CASE: Bell is alive in Pump Room 4, under the closed North Station.':'THE CASE: Bell was last logged at Pump Room 4, under the closed North Station.';`
    `if(at('evidence'))return state.choice==='person'?'THE CASE: Nell says Bell is alive in Pump Room 4.':'THE CASE: Bell was last logged at a place called Pump Room 4.';`

16. **SHOULD. The `home` ending contradicts two stay routes, and the case line repeats it.** Route one: stay, `[ARREST HIM]`, then two wrong deductions (stalled). The closing says `Vale walked out of his own building at dawn` and the file says `THE CASE: closed. Rook stayed with Bell. Vale is at large` while `state.caught` is true. Route two: the courier missed, then stay. The closing says `The street will be lit tomorrow because Nell knows the route.` while the report says `The courier is missing since Station Road`, and that route never names Nell. Fix (presentation.js): home `when:()=>state.pursuit==='stay'&&!state.caught`, so the stalled arrest falls to `word`, which fits. Make the closing a function ending `+(state.choice==='person'||state.note?'The street will be lit tomorrow because Nell knows the route.':state.choice==='missed'?'The courier who carried his lantern is still missing.':'Bell will light the street himself tomorrow.')`. In `dark`, change `Nell Marrow is not found.` to `The courier is not found.`

17. **SHOULD. Tests: the new test covers 4 of the case line's 17 branches, and nothing bounds pacing.** No expected-string update weakened a test: the `board[1]` to `board[2]` shift still targets the Bell line, and `holds[0]===11*.3+.8` is exact. But `assert(a.hold>7)` at `stationEntry` now passes at 20.1 s and has no upper bound. Missing assertions:
    - `board[0]` after each of `nell` (the name matches the button), `board` and `none`
    - `board[0]` at `deduce` does not contain "North Station"
    - `board[0]` at `roomDeduce` with `!proofHeld()` does not presuppose "above"
    - `coldCase` gives `gone cold`, and `canalEnd` gives `closed. `+summary, which on the stalled stay arrest does not say "at large"
    - the voice rule: every `entryPhases` caption outside the office starts with `Rook: "`
    - the `pumpFind` verdict is in `caption.chunks[0]`
    - `officeEntry`'s `caption.hold` stays at or under 30 s, so the Chromium route cannot silently stall again

18. **NIT. `caseLine()` says "the courier" after the player pressed `[NELL MARROW]`.** Fix: `nell:'THE CASE: Rook thinks '+(state.choice==='person'||state.note?'Nell Marrow':'the courier')+' locked Bell under North Station.'`. The map entry becomes an expression evaluated on return.

19. **NIT. Some Rook lines and room lines run against the fiction or ahead of the evidence.**
    - `chaseEntry`: `If Vale reaches the towers tonight` — Vale is driving to the basin (`chase>tunnel` says so). Use `Rook: "If Vale gets off this road tonight, nobody on our floor will ever bring him back."`
    - `subEntry`: `This is where Bell's batteries go.` comes right after the line where Rook "goes to see who is paying for it". Finding 6 fixes this with "If this is...".
    - Carried over from before the pass, on the stay route: `roomDeduce` claims `what he saw in the hall` and `the name on the manifest`, and the stay route has neither. Branch those clauses on `pursuing()`.

20. **NIT. Chunking splits speakers mid-quote and orphans short tails.**
    - `evidence` chunk 1 is `Knock three times; I will take you."` (3.3 s).
    - `roofConfession` chunk 0 is `Nell: "I wrote the maintenance call myself.` (3.5 s). Use `Nell: "I wrote the maintenance call myself, so a job at the station would put Bell's name beside Vale's order. I wanted Vale on paper. I did not think about the water." Rook writes it down.` (16.2 s, was 19.0).
    - `clubBooth` shown holds 21.2 s. Cut `He slides it back. ... You have countersigned a hundred of mine.` to `Least of all you, Rook.` (16.5 s), or keep the countersign line and drop `Signed.`
    - Carried over from before the pass: `theoryEvidence()` reads `signed by Vale and countersigned H.A. and a Board van`. Use `'order 7731, signed by Vale, countersigned H.A.'`.
    - When writing new lines, avoid a capital initial before a sentence end (`H.A. Bell:`). The chunker treats it as an initial and does not split there, which is how a 169- or 214-character single chunk gets made.

## Sign-off

Checked against commit 806a82d ("Answer the four reviews of the story pass"). I read `git show HEAD -- src/ tests/` and confirmed that `dist/game.js` is identical to a fresh build of HEAD. `node --test` passes, 39 of 39. Sources:
- `fix-long.log`, the chase route in Chromium.
- `signoff-board.log`, the wrong-theory (`board`) route in Chromium, played for this sign-off.
- Harness replays of six routes with the caption queue logged chunk by chunk: long, Board theory, courier theory with Nell caught, courier theory with the book saved, the stay route with a stalled arrest, and the stay route with the courier missed.

**The three BLOCKING findings**

- **1, `pumpEntry`: RESOLVED.** Rook's line is now `Rook: "Bell first, and whatever he found, if the water lets me keep both."`. It names both stakes and neither cue, and it comes after the description, so nothing points at `>>` any more.
- **2, `pumpFind`: RESOLVED.** Each of the five verdicts sits in chunk 0 with `The INLET wheel is beside Rook.` as the last sentence:

  | Theory | Chunk 0 | Hold |
  |---|---|---|
  | vale | 147 characters | 12.8 s |
  | board | 140 characters | 12.0 s |
  | nell, Nell caught | 135 characters | 11.3 s |
  | nell, book saved | 138 characters | 12.0 s |
  | none | 132 characters | 11.5 s |

  The chunk is fully typed about 3.3 s after `[GET BELL OUT]` appears. The Chromium board route shows the whole line, `...Not the Board: Vale's hand on the bolt. The INLET wheel is beside Rook.`, as the beat's first caption.
- **3, `caseLine()` at `roomEntry` and `roomDeduce`: RESOLVED.** The line is now `...locked Bell in to keep it quiet. The warrant can carry only what Rook can prove.`, the same text whether or not Rook holds proof and whoever sits in the chair. It restates the deduction's rule and names no answer. `state.dead` and `roomName` still take precedence, and `roomVale` gets the same neutral line. The same line appeared on every route I replayed, and a test pins it.

**Pacing**

- The writer's figures reproduce. `fix-long.log` reaches `brief` (the first story choice) at 18.5 s against 40.5 s after the story pass, and `canalEnd` at 431.7 s against my 508.2 s baseline and 438.4 s before the pass. The board route reaches `canalEnd` at 438.9 s.
- The cold open holds 14.0 s. Every windup and prompt caption is unchanged. `pumpFind` fell from 23.0-29.7 s to 11.3-12.8 s.

Quiet beats still over the ~12 s budget:
- **`stationTheory`: 18.0 s** on the long route. Chunk 0 is one 174-character sentence, over the 150-character limit, and the question arrives at 13.9 s. It is 15.5 s on the courier routes.
- **`roofQuiet`: 15.9 s** when Nell is wary and **17.0 s** when the band is busy (11.8 s otherwise).
- **`roofSignal`: 14.4 s.**
- **`pumpTruth`: 13.6 s.**
- Just over budget: `marketKeeper` 12.4 s, `tramRide` 12.4 s, `roomName` 12.0-13.1 s.

Cutscenes: after the transition line, the entry cutscenes still hold 19-24 s against 6-8 s pictures:
- `pumpEntry` 17.0 s, and 23.8-24.6 s on the wrong-theory routes
- `roofEntry` 20.7 s, `tramEntry` 20.8 s, `marketEntry` 24.0 s, `clubEntry` 22.1 s, `chaseEntry` 22.6 s
- `subEntry` 21.1 s, `subDock` 22.2 s, `roomEntry` 24.3 s

They can be tapped through once read, and the total is back under the pre-pass figure. None of this blocks sign-off.

**The two non-caption changes**

- **`[NO THEORY]`:** safe. The saved value is still `theory: 'none'`, and no code or route script matches the old label. The three test expectations were updated. `DECISIONS.md` round three, item 4 still names `[NO THEORY. GO DOWN]`: stale documentation only.
- **`home` now requires `!state.caught`:** safe. The endings still run in the same order and `dark` still catches everything, so every field combination lands on exactly one ending:
  - A stay-route arrest with proof and no stall is still `board`.
  - A stalled arrest now falls to `word`. Its closing uses the initials branch because `pursuing()` is false, and the case line no longer says "at large".
  - A stay-route arrest without proof cannot happen, because `[ARREST HIM]` needs `ledgerHeld()`.

  Records are keyed by ending id, the ids did not change, and `legacyEndings` is untouched. An existing record holding `home` from a stalled arrest stays valid, and the `stayArrest` discovery is unaffected.

**SHOULD findings 4-17:** all confirmed as described in STORY.md's review round. Finding 5 is partly declined: the `pump>roof` revert conflicts with the atmosphere review's blocker 3. I accept that, because `roofQuiet` now argues both sides before the choice.

**New findings (none blocking)**

- **SHOULD, `stationTheory`:** split `theoryEvidence()`'s list into two sentences once it has three or more items. For example: `Rook has order 7731, with H.A. countersigned under Vale's name. He also has ...`. That keeps each chunk at 150 characters or fewer and brings the question forward.
- **NIT:** update `DECISIONS.md`'s `[NO THEORY. GO DOWN]` to `[NO THEORY]`.

**Final: APPROVE.**
