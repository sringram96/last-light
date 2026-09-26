# Story playtest: THE LAST LIGHT, first play

I read three routes as scratchpad text logs: chase (`play-long.log`), stay (`play-stay.log`) and a wrong hatch theory (`play-board.log`). The stock `route.mjs` quit on the cold open, so I used a copy that waits longer and logs every caption chunk.

## 1. The story as I understood it

Halvard is a rain-soaked city. The Lumen Board, which I took for the power authority, rations the city's power, and the towers uptown buy most of it. Lamplighters keep the low streets lit, switching each lamp on from its own reserve battery.

Rook is a lone missing-persons detective at Night Division. He wants to find Ivo Bell, a senior lamplighter missing four nights, whose file came "from across the corridor" already stamped NO FURTHER ACTION. I think Rook chases Vale because Vale is on his own floor and would be untouchable once he reached the towers.

Bell is in Pump Room 4 under North Station. He discovered Vale selling the reserve batteries off his route. Someone locked him in with a Division padlock and pulled the pin on the flood inlet. I think it was Vale, because "the same hand locked both", but nobody said so.

Inspector A. Vale, "Grid Security Liaison", signs order 7731. I think he stamped Bell's file and gambles the proceeds at The Filament. I think Krane is his muscle.

H.A. is Halden Ashe, the Board's Commissioner of Reserve, who countersigned everything. I think he is the unnamed grey-coated man at Substation Nine, because he talks of "allocation". I think Substation Nine is where the stolen cells are collected for uptown.

Nell Marrow is Bell's apprentice, walking his route. On the roof she says "I wrote the maintenance call myself", and the closing mentions "Nell's forged order". I could not tell whether she was a victim, an accomplice or the cause.

All three runs ended on LIGHTS ON THE BOARD: Bell alive, Vale arrested, Ashe on the warrant, batteries back. The endings I saw meant the same thing.

## 2. Where I lost the thread

1. `brief` 40.0s: "...after the lantern." What lantern? No stranger had been mentioned. *Fix:* put the lantern in the cold open.
2. `evidence` 68.8s: "He is alive in Pump Room 4." How does Nell know, and why has she told no one? *Fix:* one clause of how.
3. `stationDesk` 94.8s: "three things here, not five", with four spots listed. *Fix:* make the numbers match what is shown.
4. `stationTheory` 99.6s: I did not know what a theory changes, and I never learned whether I was right. *Fix:* one line of feedback downstairs.
5. `roofConfession` 175.4s: "I wrote the maintenance call myself." Which call? Why confess? Nobody reacts. *Fix:* say what the call did.
6. `roofSignal` 175.2s: "Board van booked through to Nine." Nine is not explained until 348.4s. *Fix:* say "Substation Nine" the first time.
7. `tramEntry` 176.9s: "Vale's car went west." I never saw Vale, and the red car at 60.8s was never tied to him. *Fix:* show Vale leaving.
8. `tramRide` 203.9s: "Heddy on the channel." Who is Heddy? *Fix:* give her a job title.
9. `tramSpotted` 211.4s: "Plate 41, a Night Division car... following the tram." Nobody says who is driving. *Fix:* pay it off.
10. `marketEntry` 224.2s: the objective "REACH THE FILAMENT". Why a club? *Fix:* say it is Vale's.
11. `marketDanger` 254.4s: "Krane sends a loaded cell-cart." Who is Krane? *Fix:* introduce him.
12. `subDock` 390.1s: the man in grey is never named. *Fix:* have Rook say "Ashe".
13. Stay route `roomName` 206.9s: Rook names "Halden Ashe" but never saw the manifest. He had only "H.A." *Fix:* have Bell or the ledger give the name.

## 3. What landed

- "Halvard, 23:40, the ninth night of rain. The Lumen Board rations the city's power, and the towers uptown buy most of it."
- "A new padlock hangs open on its hasp, Division issue, the same pattern as the one on Rook's own locker." This is the enemy on his own floor.
- "Bell: 'Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark.'" After this I knew the crime.
- "There is allocation: the light goes where it is paid for, and your division signed for every lot."
- "As the lamps go dark along the canal, this time it is only because morning has arrived."

## 4. The choices

- **Clear before I chose:** WATCH FIRST (the "two extra seconds" payoff was stated), the courier cue, the stall keeper, the cart, carrier, gap and breaker cues, and WHO SIGNED, which is the best choice in the game. STATION DOOR / HOTEL was trivial after Nell said Pump Room 4.
- **Unclear before I chose:** the theory (see 5); the pump cue, since I only learned afterwards that left meant the inlet; SHOW ORDER 7731, since I could not tell what showing it would do; and the club cue, since "'Put the light down.' Krane rises." gave me no direction.
- **PURSUE / STAY:** I understood the stakes. Both led to the same ending with nearly the same text, so the choice felt fake.
- **ASK NELL:** it produced a confession I could not use. **WATCH THE ROAD:** it spotted a tail that went nowhere I could see.
- **ARREST HIM** (stay route): the next thing I saw was SIT HIM DOWN. I could not connect that result to my input.

## 5. The station

"Three things here, not five" told me there was a limit, but it did not match the four spots I could see. On the board route I guessed THE LUMEN BOARD. The only differences were "the water is a hand higher than it was a minute ago", a pump window of 2.5 s instead of 3.0 s, and the same ending. Nothing told me I was wrong, and the guess did not feel wrong: the Board stamped the order. The cost is real but invisible.

## 6. The endings

All three closings are LIGHTS ON THE BOARD, in almost identical words; the stay run drops only the chip line. I could not say how the nights differed.

## 7. Verdict

Yes, but only the spine. I would say: "You're a night-shift detective in a rain-drowned city where the power company rations light, looking for a lamplighter who vanished after he caught a cop selling his street's batteries. It turns into a chase up the chain to find out who in the power company signed for the theft."

| | Score |
|---|---|
| I understood the story | 3 / 5 |
| I cared about Rook | 2 / 5 |
| I knew why I was chasing Vale | 3 / 5 |
| I felt my choices mattered | 2 / 5 |

## 8. What I got wrong

Most of my wrong beliefs have one cause. The route script presses a choice the moment it appears, and the game accepts the press while the caption is still on its first chunk. A patient run (`play-patient.log`, about 25 s per choice) showed the missing lines. A fast-clicking player would lose them too. The fix is to hold choices until the last chunk has shown, or to put the meaning in the first chunk.

- **Rook** is not just diligent. He has countersigned NO FURTHER ACTION on a hundred unread files, many of them Vale's, and wants his desk honest. This belongs at `officeDesk`, where I left after two spots, and at `clubBooth` (shown), which I skipped.
- **The chase** is about evidence: Vale is the one link to the Board, and the paper can be lost. It is not only that he is untouchable uptown. This belongs at `chaseEntry`, and it is never said plainly.
- **Bell** found the ledger and kept it from Night Division because he did not know which desk was safe. And the game does say that Vale locked him in: "so he locked me down here". This belongs at `pumpFind` and `pumpTruth`, in later chunks.
- **The Filament** is where Vale runs the sales, not just where he spends. This belongs at `roofQuiet` and `clubBooth` (shown).
- **Nell** forged the call to put Bell's name beside Vale's order, and did not think about the water. She is also the stranger with the lantern. This belongs at `roofConfession` and `officeDesk`/`brief`, in later chunks.
- **Section 2 items 1, 2, 7, 9, 10 and 11** are answered in chunks I skipped. Plate 41 is Krane's car. **Items 3, 6, 8, 12 and 13** stay unanswered even in the patient run. **Item 4** is only partly answered: "It is the name Rook came down with" at `pumpFind` confirms a right guess, but a wrong one gets nothing.
- **The endings** are meant to differ by whose names go on the warrant. All three of my routes reached the same ending.
