# Playtest: the shipped case at real time

Lead playtester report for the three directors (systems, presentation, narrative). Evidence only; no design.

Method. Chromium (Playwright, no fake clock, real wall-clock time), `dist/index.html` built from the current `src/`.
Six full runs, all starting from the menu with NEW CASE and the intro unskipped, sampled every 500 ms (phase,
caption text, typed length, timer text, buttons, card, element rects, scroll) with a screenshot every 1 s:

| run | viewport | prompt policy | story buttons | result | length |
|---|---|---|---|---|---|
| good-1280x800 | 1280x800 | click the move 1.2 s after it appears | click 1.5 s after the caption finishes typing | LIGHTS ON THE BOARD, 7/7, A | 285 s |
| hesitant-1280x800 | 1280x800 | click 4.3 s after it appears | same | LIGHTS ON THE BOARD, 7/7, A | 307 s |
| never-1280x800 | 1280x800 | never click a move; CARRY ON after each miss | same | A VOICE IN THE DARK, 0/7, D | 317 s |
| stay-1280x800 | 1280x800 | good player, STAY WITH BELL on the roof | same | THE LAMPLIGHTER HOME, 2/2, A | 161 s |
| good-375x812 | 375x812 (mobile, touch) | good player | same | LIGHTS ON THE BOARD, 7/7, A | 283 s |
| tunnel-1280x800 | 1280x800 | scene reel CHASE -> BRAKE -> LOWER RAMP -> CUT LEFT | same | preview, GOT HIM | 85 s |

Screenshots and logs: `SHOTS = /tmp/claude-0/-home-user-last-light/57a53dce-2b2e-59b7-b8a3-159161fb1515/scratchpad/shots/playtest/<run>/`.
Each run folder holds `log.json` (every sample), `segments.json`, and frames named `NNNN-<seconds>s-<phase>.jpg`.
Driver: `scratchpad/playtest.mjs`; analysis: `scratchpad/analyze.mjs`, `scratchpad/prompts.mjs`.
Caveat on my own harness: the run stops sampling 0.4 s after the ending appears, so the CASE CLOSED row below
reads "cut"; the game itself does not cut that caption (it types out over 2.2 s and waits for RETURN TO MENU).

## 1. Timeline of the long route at real time (good-1280x800)

Columns: wall-clock start, length, caption length in chars/words, whether the caption finished typing before the
phase changed, characters cut, seconds the fully typed caption was on screen, seconds a 200 wpm reader needs,
what the player could press (and when the good player pressed it, relative to the buttons appearing), the card.
Times are +-0.5 s (sample cadence). Captions type at 70 chars/s; windup and prompt captions appear instantly.

| # | start | len | phase | chars/words | typed | cut | visible | need | actionable | card |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0.0 | - | menu | 183/30 | yes | 0 | - | 9.0 | NEW CASE (below the fold, see 5) | LAST LIGHT |
| 1 | 0.5 | 8.2 | officeEntry | 104/19 | yes | 0 | 6.7 | 5.7 | SKIP INTRO | NIGHT DIVISION (3 s) |
| 2 | 8.8 | 5.1 | officeFile | 163/27 | yes | 0 | 3.1 | 8.1 | SKIP INTRO | |
| 3 | 13.9 | 4.6 | officeBoard | 163/26 | yes | 0 | 2.6 | 7.8 | SKIP INTRO | |
| 4 | 18.5 | 6.1 | officeWindow | 140/26 | yes | 0 | 4.1 | 7.8 | SKIP INTRO | |
| 5 | 24.6 | 1.5 | transit office>street | 68/14 | yes | 0 | 0.5 | 4.2 | nothing | |
| 6 | 26.2 | 3.6 | brief | 119/19 | yes | 0 | 2.1 | 5.7 | FOLLOW THE LANTERN @+3.2 / WATCH FIRST 8s | STATION ROAD |
| 7 | 29.8 | 7.7 | follow | 143/27 | yes | 0 | 5.7 | 8.1 | nothing | |
| 8 | 37.5 | 2.0 | danger (windup) | 103/18 | instant | 0 | 2.0 | 5.4 | nothing | GET READY (red, pulsing) |
| 9 | 39.5 | 1.5 | qte (prompt, 7 s window) | 73/13 | instant | 0 | 1.5 | 3.9 | [1] CATCH THE COURIER @+1.2 / [2] SAVE THE BOOK | |
| 10 | 41.0 | 4.1 | result | 74/14 | yes | 0 | 3.1 | 4.2 | nothing | CAUGHT |
| 11 | 45.2 | 3.1 | evidence | 90/17 | yes | 0 | 2.1 | 5.1 | CONNECT THE CLUE @+2.7 | |
| 12 | 48.2 | 2.5 | deduce | 55/10 | yes | 0 | 2.0 | 3.0 | STATION SERVICE DOOR @+2.3 / HOTEL | |
| 13 | 50.8 | 5.2 | arrival | 57/10 | yes | 0 | 4.6 | 3.0 | nothing | |
| 14 | 55.9 | 1.0 | transit street>station | 57/10 | yes | 0 | 0.5 | 3.0 | nothing | |
| 15 | 57.0 | 7.1 | stationEntry | 88/14 | yes | 0 | 5.6 | 4.2 | nothing | NORTH STATION |
| 16 | 64.1 | 4.1 | stationQuiet | 153/27 | yes | 0 | 2.0 | 8.1 | READ THE TAPE 8s @+3.7 / FOLLOW THE KNOCKING | |
| 17 | 68.2 | 7.7 | stationListen (observe) | 104/17 | yes | 0 | 6.1 | 5.1 | nothing (OBSERVING / 8s countdown) | |
| 18 | 75.9 | 4.2 | stationReady | 115/19 | yes | 0 | 2.0 | 5.7 | FOLLOW THE KNOCKING @+3.8 | DECODED |
| 19 | 80.0 | 1.0 | transit station>pump | 45/7 | yes | 0 | 0.5 | 2.1 | nothing | |
| 20 | 81.0 | 6.1 | pumpEntry | 111/21 | yes | 0 | 4.1 | 6.3 | nothing | PUMP ROOM 4 |
| 21 | 87.2 | 4.1 | pumpFind | 124/23 | yes | 0 | 2.0 | 6.9 | GET BELL OUT @+3.7 | |
| 22 | 91.2 | 2.0 | pumpDanger (windup) | 115/20 | instant | 0 | 2.0 | 6.0 | nothing | GET READY |
| 23 | 93.3 | 1.5 | pumpQte (9 s window) | 89/17 | instant | 0 | 1.5 | 5.1 | [1] CLOSE THE INLET @+1.2 / [2] PULL BELL OUT | |
| 24 | 94.8 | 4.1 | pumpResult | 80/14 | yes | 0 | 3.1 | 4.2 | nothing (REACTION 1.3s shown) | INLET CLOSED |
| 25 | 98.9 | 4.6 | pumpTruth | 194/34 | yes | 0 | 2.1 | 10.2 | TAKE BELL TO THE ROOF @+4.2 | |
| 26 | 103.5 | 1.0 | transit pump>roof | 54/9 | yes | 0 | 0.5 | 2.7 | nothing | |
| 27 | 104.5 | 8.3 | roofEntry | 141/24 | yes | 0 | 6.2 | 7.2 | nothing | ABOVE THE CITY |
| 28 | 112.8 | 5.6 | roofQuiet | 241/45 | yes | 0 | 2.0 | 13.5 | LISTEN TO THE RADIO 8s @+5.2 / PURSUE VALE / STAY WITH BELL | |
| 29 | 118.4 | 7.7 | roofListen (observe) | 108/18 | yes | 0 | 6.1 | 5.4 | nothing | |
| 30 | 126.0 | 5.1 | roofSignal | 211/37 | yes | 0 | 2.0 | 11.1 | ASK NELL @+4.7 / PURSUE / STAY | SIGNAL |
| 31 | 131.2 | 4.6 | roofConfession | 193/34 | yes | 0 | 2.1 | 10.2 | PURSUE VALE @+4.2 / STAY WITH BELL | CONFESSION |
| 32 | 135.8 | 1.0 | transit roof>tram | 86/17 | NO | 21 | 0.0 | 5.1 | nothing | |
| 33 | 136.8 | 8.1 | tramEntry | 170/33 | yes | 0 | 5.6 | 9.9 | nothing | THE LAST TRAM |
| 34 | 144.9 | 4.1 | tramRide | 144/27 | yes | 0 | 2.1 | 8.1 | WATCH THE ROAD 8s @+3.7 / RIDE ON | |
| 35 | 149.0 | 7.6 | tramWatch (observe) | 115/21 | yes | 0 | 6.1 | 6.3 | nothing | |
| 36 | 156.6 | 4.6 | tramSpotted | 146/29 | yes | 0 | 2.1 | 8.7 | RIDE ON @+4.2 | NOTED |
| 37 | 161.2 | 4.6 | tramArrive | 144/26 | yes | 0 | 2.6 | 7.8 | nothing | |
| 38 | 165.9 | 1.5 | transit tram>market | 58/12 | yes | 0 | 0.5 | 3.6 | nothing | |
| 39 | 167.4 | 8.2 | marketEntry | 180/34 | yes | 0 | 5.6 | 10.2 | nothing | THE NIGHT MARKET |
| 40 | 175.6 | 4.6 | marketAisle | 186/37 | yes | 0 | 2.1 | 11.1 | ASK THE STALL KEEPER @+4.2 / PUSH THROUGH | |
| 41 | 180.2 | 4.6 | marketKeeper | 187/36 | yes | 0 | 2.0 | 10.8 | PUSH THROUGH TO THE CLUB @+4.2 | NOTED |
| 42 | 184.8 | 2.1 | marketDanger (windup) | 146/28 | instant | 0 | 2.1 | 8.4 | nothing | GET READY |
| 43 | 186.8 | 1.5 | marketQte (9 s) | 123/26 | instant | 0 | 1.5 | 7.8 | [1] SLIP INTO THE STALL / [2] GO OVER THE STALLS @+1.2 | |
| 44 | 188.3 | 4.1 | marketResult | 165/33 | yes | 0 | 2.0 | 9.9 | nothing | OVER THE STALLS |
| 45 | 192.4 | 1.0 | transit market>club | 75/14 | NO | 9 | 0.0 | 4.2 | nothing | |
| 46 | 193.4 | 8.2 | clubEntry | 187/39 | yes | 0 | 5.1 | 11.7 | nothing | THE FILAMENT |
| 47 | 201.6 | 2.0 | clubFace (windup) | 94/19 | instant | 0 | 2.0 | 5.7 | nothing | GET READY |
| 48 | 203.6 | 1.5 | clubQte (9 s) | 94/19 | instant | 0 | 1.5 | 5.7 | [1] DUCK / [2] VAULT THE BAR @+1.2 | |
| 49 | 205.2 | 4.1 | clubResult | 146/27 | yes | 0 | 2.0 | 8.1 | nothing | OVER THE BAR |
| 50 | 209.3 | 1.0 | transit club>chase | 81/15 | NO | 14 | 0.0 | 4.5 | nothing | |
| 51 | 210.3 | 6.2 | chaseEntry | 160/29 | yes | 0 | 3.6 | 8.7 | nothing | THE PURSUIT |
| 52 | 216.5 | 1.6 | chaseQteA (9 s), no windup | 119/22 | instant | 0 | 1.6 | 6.6 | [1] BRAKE / [2] DIVE RIGHT @+1.3 | none |
| 53 | 218.1 | 5.7 | chaseBank | 74/13 | yes | 0 | 4.7 | 3.9 | nothing | CLEAR |
| 54 | 223.8 | 1.6 | chaseQteB (9 s), no windup | 136/27 | instant | 0 | 1.6 | 8.1 | [1] TAKE THE LOWER RAMP / [2] FOLLOW OVER THE GAP @+1.3 | none |
| 55 | 225.4 | 5.7 | chaseFinish | 116/22 | yes | 0 | 4.1 | 6.6 | nothing | GOT HIM |
| 56 | 231.1 | 1.5 | transit chase>substation | 87/17 | NO | 15 | 0.0 | 5.1 | nothing | |
| 57 | 232.6 | 8.3 | subEntry | 244/48 | yes | 0 | 4.6 | 14.4 | nothing | SUBSTATION NINE |
| 58 | 240.9 | 5.6 | subManifest | 193/34 | yes | 0 | 3.1 | 10.2 | nothing | |
| 59 | 246.5 | 2.1 | subDanger (windup) | 155/29 | instant | 0 | 2.1 | 8.7 | nothing | GET READY |
| 60 | 248.6 | 1.5 | subQte (9 s) | 130/27 | instant | 0 | 1.5 | 8.1 | [1] DIVE CLEAR / [2] PULL THE BREAKER @+1.2 | |
| 61 | 250.1 | 5.1 | subResult | 180/36 | yes | 0 | 2.5 | 10.8 | nothing | LIGHTS OUT |
| 62 | 255.2 | 4.6 | subDawn | 128/25 | yes | 0 | 3.1 | 7.5 | nothing | |
| 63 | 259.8 | 1.5 | transit substation>room | 88/16 | NO | 14 | 0.0 | 4.8 | nothing | |
| 64 | 261.4 | 7.2 | roomEntry | 147/29 | yes | 0 | 5.1 | 8.7 | nothing | INTERROGATION |
| 65 | 268.6 | 3.6 | roomDeduce | 131/27 | yes | 0 | 2.0 | 8.1 | VALE SIGNED ALONE / SOMEONE ABOVE @+3.3 / NOT ENOUGH | |
| 66 | 272.2 | 4.3 | roomName | 141/27 | yes | 0 | 2.0 | 8.1 | GO TO BELL @+4.1 | |
| 67 | 276.5 | 1.5 | transit room>canal | 54/10 | yes | 0 | 1.0 | 3.0 | nothing | |
| 68 | 278.0 | 6.7 | canalEntry | 78/15 | yes | 0 | 5.7 | 4.5 | nothing | FIRST LIGHT |
| 69 | 284.7 | stays | canalEnd | 156/31 | (harness stopped) | - | until RETURN TO MENU | 9.3 | RETURN TO MENU (below the fold at 1280x800) | CASE CLOSED |

Whole-route budget for the good run (285 s): 7 prompts live for 10.9 s total (3.8%) before the player pressed;
auto-advancing cutscenes, windups and results 168 s (59%); phases waiting on a story button 91 s (32%, includes the
1.5 s reading pause my driver adds); scene transitions 14 s (5%). Hesitant run: prompts live 32 s (10%) of 307 s.
Never run: prompts live 51 s (16%) of 317 s. The phone run is within 2 s of the desktop run at every phase.

## 2. Text pacing

Typing runs at 70 chars/s, about 840 wpm, so typing is never the bottleneck; the auto-advance is. Read "fully
visible" as the time between the last character landing and the phase changing.

Text that vanished before a 200 wpm reader could finish it (visible s / needed s), all auto-advancing:
officeFile 3.1/8.1, officeBoard 2.6/7.8, officeWindow 4.1/7.8, follow 5.7/8.1, pumpEntry 4.1/6.3, roofEntry 6.2/7.2,
tramEntry 5.6/9.9, tramArrive 2.6/7.8, marketEntry 5.6/10.2, marketResult 2.0/9.9, clubEntry 5.1/11.7,
clubResult 2.0/8.1, chaseEntry 3.6/8.7, chaseFinish 4.1/6.6, subEntry 4.6/14.4, subManifest 3.1/10.2,
subResult 2.5/10.8, subDawn 3.1/7.5, roomEntry 5.1/8.7; plus result 3.1/4.2 and pumpResult 3.1/4.2 by a hair.
Twenty-one of the 34 auto-advancing captions on the route fail 200 wpm; the four longest cutscene captions
(subEntry 48 words, roofQuiet 45, clubEntry 39, marketAisle 37) are the ones the story leans on for the plot.
The office intro alone loses three of four captions: the player learns who Vale is from a caption that is
fully readable for 2.6 s. Frame: `SHOTS/good-1280x800/0017-13.9s-officeBoard.jpg`.

Story-button phases (evidence, stationQuiet, pumpTruth, roofQuiet, marketAisle...) are not cut by the game,
but the buttons arrive while the caption is still typing in 21 of 28 button sets: e.g. roofQuiet shows
LISTEN / PURSUE / STAY at 0.1 s with "Bell is safe with the" typed (`SHOTS/good-1280x800/0138-112.8s-roofQuiet.jpg`),
evidence shows CONNECT THE CLUE under "The rain has erased the e" (`SHOTS/never-1280x800/0061-49.5s-evidence.jpg`).
The whole 241-char roofQuiet caption takes 3.4 s to type and 13.5 s to read; the buttons are there the whole time.

Typing still going when something took over:
- Every scene transition line is a 1.0 to 1.5 s black-out with its own caption typing at 70 cps. Five of the ten
  were cut mid-word in every run: roof>tram cut 21 chars ("Down the service lift to the tr", `SHOTS/good-1280x800/0168-135.8s-roofConfession>tramEntry.jpg`),
  market>club 9, club>chase 14, chase>substation 15 ("...and it is one in" `SHOTS/good-1280x800/0284-232.1s-chaseFinish>subEntry.jpg`),
  substation>room 14. The other five finished with 0.5 to 1.0 s left. None of the ten is readable at 200 wpm
  (2.1 to 5.7 s needed). The transition lines are not read; they are seen as a flicker of text under a black screen.
- Every stinger (CAUGHT, INLET CLOSED, OVER THE STALLS, CLEAR, GOT HIM, LIGHTS OUT, and the misses) lands at the
  first frame of the result while the result caption has typed 0 to 10 characters: "Rook goes up the rope and ove"
  under OVER THE STALLS (`SHOTS/good-1280x800/0233-188.3s-marketResult.jpg`), "Rook reaches" under TOO LATE
  (`SHOTS/never-1280x800/0056-46.5s-result.jpg`). The card is 1.8 s; the caption finishes typing at 1 to 2.6 s.
- Chapter cards: 3 s, shown under the canvas while the picture fades up from black over 0.8 s, with the new
  cutscene caption typing beneath them. At the tram card the whole picture is black and the caption reads "Ro"
  (`SHOTS/good-1280x800/0169-136.8s-tramEntry.jpg`, phone `SHOTS/good-375x812/0170-135.7s-tramEntry.jpg`). Three
  seconds is long enough to read a two-word card; it is the 8 s cutscene behind it that is short.
- CASE CLOSED (4 s) sits above the ending caption, which types for 2.2 s, and the ENDING summary paragraph and
  RETURN TO MENU appear at the same instant below it (`SHOTS/good-1280x800/0348-285.0s-ending-full.jpg`).

GET READY versus the prompt caption: they do not overlap in time. The windup shows GET READY (red, pulsing, 2.0 s)
with the windup caption drawn instantly ("...Get ready."), 103 to 155 chars that need 5.4 to 8.7 s. At exactly
2.0 s the card clears, the caption is replaced by the prompt caption (73 to 136 chars, 3.9 to 8.1 s to read), the
timer bar and the two moves appear. So the player gets two separate paragraphs in 3.5 s (windup 2.0 s + 1.5 s
before a good click), and the second one carries the move descriptions. What competes is layout: a card is 79 px
tall, so the caption and buttons sit 89 px lower while GET READY is up and jump back up the moment the moves appear
(caption y 697 -> 608, actions 743 -> 654 at 1280x800). The buttons move at the instant they become clickable.

## 3. Prompt feel

Seven prompts on the long route (qte, pumpQte, marketQte, clubQte, chaseQteA, chaseQteB, subQte); the eighth
(tunnelQte) exists only on the LOWER RAMP branch and was measured from the scene reel. Windows are 7 s base,
+2 for a prior discovery, -2 for a prior miss, clamped 5 to 9. The good run, having watched nothing but read the
tape, heard the radio, spotted the tail, asked the keeper and gone over the stalls, got 7, 9, 9, 9, 9, 9, 9. The
never run got 7, 9, 9, 5, 7, 7, 7. A 4.3 s reaction left 2.8 s (first prompt) to 4.8 s on the clock; the hesitant
player never came within 2.5 s of a miss. Reaction time is displayed after a hit (REACTION 1.3s / 4.3s) but
changes nothing: hesitant and good runs produced identical endings, reflex 7/7, grade A and 14/20 discoveries.

| prompt | windup -> moves clickable | window | hesitant player has | picture when the moves appear | markers | right move from the picture alone? |
|---|---|---|---|---|---|---|
| qte, the book | GET READY 2.0 s | 7 s (9 if WATCH FIRST) | 2.8 s spare | Nell mid-stumble at centre right, book in her hand, Rook at centre left; danger clear | [1] over Nell's head, [2] beside the book, 4 rows apart, both inside the picture | No: both are valid; nothing in the picture says catching the person leads to a witness and the book to the loft |
| pumpQte, the flood | GET READY 2.0 s | 9 s (7 without the tape) | 4.4 s | Big yellow INLET wheel left, Bell on the far platform top centre, Rook right; water not visibly rising | [1] over the wheel; [2] over Bell, but at 1280x800 Bell's rows 10-24 put [2] in the 10 rows scrolled off the top: not visible (`SHOTS/never-1280x800/0130-106.4s-pumpQte.jpg`) | Only if the tape was read; the caption then says it outright ("The tape said to close the inlet first") |
| marketQte, the cart | GET READY 2.0 s | 9 s | 4.5 s | The cart is a small shape at the far end of the aisle rolling toward camera; Krane is not on screen; the crowd is | [1] left stall, [2] right awning rope, far apart, both visible (`SHOTS/good-1280x800/0230-186.8s-marketQte-buttons.jpg`) | No: nothing shows that going over leads to Vine Alley; the keeper's tip is about the substation |
| clubQte, the bottle | GET READY 2.0 s | 9 s (5 after a market miss) | 4.7 s | Krane at the bar with a red bottle mark, Vale beside him, Rook down front; NO EXIT sign; danger readable | [1] on the floor centre, [2] by Krane at the bar (`SHOTS/good-1280x800/0249-203.7s-clubQte-buttons.jpg`) | Partly: the caption says the vault cuts Krane off; the picture shows the bar between Rook and the booth |
| chaseQteA, freight | none: 6.2 s driving cutscene, then the timer | 9 s (7 after a club miss) | 4.8 s | FREIGHT labelled carrier ahead in Rook's lane, VALE beyond, right lane open; the clearest of the set | [1] under FREIGHT, [2] in the open lane (`SHOTS/good-1280x800/0264-216.5s-chaseQteA-buttons.jpg`) | Yes: the open lane is drawn and labelled |
| chaseQteB, the bridge | none: 5.7 s CLEAR result, then the timer | 9 s | 4.5 s | BRIDGE UP label, Vale's car climbing the ramp, lower road at left | [1] lower ramp left, [2] beside VALE (`SHOTS/good-1280x800/0274-223.9s-chaseQteB-buttons.jpg`) | Yes for the jump if Rook is close; the picture cannot show the gap variable that decides it |
| subQte, the rack | GET READY 2.0 s | 9 s (7 after a chase miss) | 4.6 s | Rook centre, racks both sides, the loose rack tipping from 10 to 40 degrees over the window; subtle | [1] left of Rook; [2] over the breaker post at the top edge, half clipped by the scroll at 1280x800 (`SHOTS/good-1280x800/0302-248.7s-subQte-buttons.jpg`) | No: the breaker is a post; the manifest is a small paper on the rack |
| tunnelQte, the fork | none: 6.1 s tunnel cutscene | 9 s | - | CANAL GATE, MAINT and VALE labelled; both branches drawn | [1] beside VALE, [2] at MAINT (`SHOTS/tunnel-1280x800/0030-23.1s-tunnelQte-buttons.jpg`) | Only with the radio tip |

In every prompt the two moves are text buttons under the caption; the in-picture [1]/[2] markers are two-cell
labels in the scene ink colour and do not blink, grow, or change with the countdown. Nothing in the picture
is clickable: clicking the courier, the wheel or the marker does nothing (the canvas has no listener). The
timer is a 10-cell bar plus tenths on the right of the status line, red and pulsing under 3 s; sound is off by
default, so the tick cues never played in any run.

What a miss looks like (never run). At 0.0 s of the timer the picture cuts to the result pose, a red stinger
(TOO LATE, TOO LATE, HIT, HIT, CLIPPED, GONE, CRUSHED) fills the card row for 1.8 s, the result caption starts
typing, and REWIND THE MOMENT / 3 LEFT and CARRY ON appear 0.1 s later under a caption that so far reads
"Rook reaches" (`SHOTS/never-1280x800/0057-46.5s-result-buttons.jpg`), "The cart ta"
(`SHOTS/never-1280x800/0246-201.8s-marketResult.jpg`), "The rack takes Ro" (`SHOTS/never-1280x800/0336-278.9s-subResult.jpg`).
The story then waits indefinitely; the never player pressed CARRY ON after 2.7 to 4.3 s and the next scene
began 3.1 to 5.6 s after the miss. Nothing is replayed; the picture after a miss is a still (cart stopped,
Krane gone; bottle burst; rack down). The miss costs no time, no scene and no prompt: the never run played the
same 70 segments as the good run, 32 s longer, and the chase after a CLIPPED miss still offered the bridge jump.

## 4. Consequence feel (never-1280x800 versus good-1280x800)

Ending text. Never: "ENDING: A VOICE IN THE DARK (1/6 found). Reflex 0/7, grade D, rewinds used 0. Vale escaped
with everything but Bell. Only Bell's voice remains. Evidence: Bell's testimony; ledger lost. Rook worked
without Nell." (`SHOTS/never-1280x800/0385-317.2s-ending.jpg`). Good: "ENDING: LIGHTS ON THE BOARD (1/6 found).
Reflex 7/7, grade A, rewinds used 0. Vale arrested; Halden Ashe of the Lumen Board named on the paper Rook kept
dry. Evidence: signed ledger recovered. The Filament chip ties the batteries to Vale's tables. Nell's forged
order is part of the case." Both end on the same canal picture with the same CASE CLOSED card and the same
"Bell is alive." opening words. Stay route: THE LAMPLIGHTER HOME, 2/2, A, in 161 s, 8 route steps, same
CASE CLOSED (`SHOTS/stay-1280x800/0201-160.4s-ending.jpg`).

Case file. Never run route: Followed at once > Missed the fall > Read the tape > Late at the pump > Listened to the
band > Pursued Vale > Spotted the tail > Asked the stall keeper > Took the cart > Took the bottle > Clipped the
carrier > Stopped at the bridge > Crushed at the rack > Left the line blank (second try). Persons of interest:
"DETECTIVE ROOK ... case closed; walking with a stick for a month", "THE COURIER: limped away toward the station
with Bell's lantern" (Nell never gets a name), "INSPECTOR VALE ... at large; warrant issued", "HALDEN ASHE ...
suspected above Vale. No paper survives to name him." Records: 5/20 discoveries against 14/20; one of them is
"Closed the case without a rewind", awarded for 0/7. The good run's file is the same shape with more lines
(`SHOTS/good-1280x800/0349-285.4s-ending-casefile-full.jpg`).

What was actually lost, in order: missing the book prompt removed Nell from the rest of the case (no witness,
no confession, no ASK NELL button on the roof); missing the pump lost the ledger; missing the club lost the chip;
missing both chase prompts lost the arrest; missing the rack lost the manifest. None of it was felt at the time:
every miss led to the same next chapter card, Bell was still rescued by "Bell leaps as the platform breaks. Rook
catches his sleeve", the pursuit still reached Substation Nine, the interview still ran, and the only branch that
closed was the deduction (SOMEONE ABOVE VALE SIGNED was refused once: "Rook believes it, and he cannot show it",
`SHOTS/never-1280x800/0363-300.8s-roomDeduce.jpg`, then NOT ENOUGH TO SAY was accepted). Total time
penalty for seven misses: 32 s. Bell's line "Vale sold the emergency batteries... I will say it in court" is the
consolation; the picture that follows a miss is a still, not a death scene.

The rewind offer appeared seven times, always with 3 LEFT, and never mattered: CARRY ON always continues, the
reflex grade is the only scoreboard, and a rewind would have cost the "flawless" discovery that a 0/7 run
kept. In the hesitant and good runs the offer never appeared at all, so a first-time player who hits everything
does not learn that rewinds exist until the ending line "rewinds used 0".

## 5. Screen use

1280x800. The page is `main{max-width:1024px}` centred: 128 px of empty page each side. Canvas 996x666 px =
65% of the viewport area, 83% of its height, 180x70 cells. At the menu (scrollY 0) the picture runs y=56..722, the
LAST LIGHT card 732..811, the caption starts at 845 and NEW CASE at 891: below the fold (document 1081 px). A
first click on NEW CASE scrolls the page to 148 px and it stays there for the whole case, which hides the
header (title, REFLEX/REWIND score, chapter and objective) and the top 92 px of every picture, about 10 of 70 rows
(`SHOTS/good-1280x800/0009-6.7s-officeEntry.jpg` shows the picture cropped at the top edge). In that layout: picture
y=-92..574, status line (title left, timer right) 574..602, caption 608..648, buttons 654..698, MENU/TIMED/MONO/SOUND/PAUSE
698..742, CASE FILE 742..786. A stinger pushes caption and buttons down 89 px. At the ending, RETURN TO MENU is at
810..854: below the fold again (document 1104 px), and the case file needs a further scroll (2289 px full page,
`SHOTS/good-1280x800/0349-285.4s-ending-casefile-full.jpg`).
Eye path at a prompt: [1]/[2] markers at y=100..250 in the picture; timer at x=1009..1138, y=584; caption at
x=142, y=608; moves at x=152..452, y=654: about 450 px down and to the far left from the danger, with the timer
in the opposite corner from the buttons. Nothing on the picture responds to a click.

375x812 (mobile). Canvas 355x407 px = 47% of the viewport area, 50% of its height, 84x56 cells (each cell
4.2x7.3 px; the [1]/[2] markers are 8 px wide, `SHOTS/good-375x812/0049-39.1s-qte-buttons.jpg`). The header wraps
to two lines (REFLEX 2/2 // REWIND x3 // 05a / NIGHT MARKET // REACH THE FILAMENT). Picture y=74..500, status
481..509, caption 515..585 (three lines at a prompt), moves 561..635, options 605..649, CASE FILE 649..693. The
menu, every cutscene, every prompt and the ending's RETURN TO MENU (788..832, 20 px under the fold) fit in one
screen; scrollY stayed 0 for the entire run, and no press needed a scroll. The cost is the picture: at a prompt
it is 355 px wide and the characters are 10 to 20 rows tall; at a chapter card the whole upper half of the phone
is black for 0.8 s and the card row is 79 px of the 812 (`SHOTS/good-375x812/0170-135.7s-tramEntry.jpg`). Below
the picture, 150 px of the phone screen are the options row, CASE FILE and empty space during every cutscene.

## 6. Ten things a first-time player would say, ranked by how much they hurt

1. "I never lost. I didn't touch a single button through the whole chase and the case still closed, Bell still
   went home, and the game told me I had 'closed the case without a rewind'." (never run: 0/7, D, 317 s, same scenes)
2. "The text is gone before I finish it." (21 of 34 auto-advancing captions unreadable at 200 wpm; the office
   intro that names Vale is up 2.6 s; the substation reveal, 48 words, is up 4.6 s)
3. "Why am I reading the move? The picture is right there. Let me click the wheel." (all seven prompts are
   text buttons 450 px below the danger; the canvas takes no clicks; the [1]/[2] markers are 2-cell labels
   that never move)
4. "GET READY, then a paragraph, then a paragraph, then a 9-second bar. Ready for what? I had time to read the
   choices twice." (2.0 s windup, 7 to 9 s windows, hesitant 4.3 s reaction still 2.8 to 4.8 s spare and identical
   grade to a 1.2 s reaction; REACTION time shown and not scored)
5. "Half the screen is black bars and the buttons are under the fold. Where's NEW CASE?" (1280x800: 1024 px
   column, NEW CASE at y=891 of 800, then the page stays scrolled 148 px and the header and top 10 rows of every
   picture are cut off, RETURN TO MENU under the fold again)
6. "When I miss, nothing happens. A red word, a still picture, and a button that says carry on." (miss: 1.8 s
   stinger, result caption typing under the buttons, no replay, 3 to 6 s to the next scene, same next scene)
7. "The screen went black and some words started typing and then a title card ate them." (10 transition
   lines of 1.0 to 1.5 s, 5 cut mid-word, none readable)
8. "The words in the picture aren't the choices I get." (chase A is the only prompt whose picture shows the
   right lane; pump, market, substation and tunnel depend on a tip in an earlier caption; at 1280x800 the pump [2]
   marker over Bell and the substation [2] over the breaker are in the cropped rows)
9. "Buttons pop in while the sentence is still typing, and every card shoves them 90 px down and back up."
   (21 of 28 button sets appear mid-typing; card row 79 px; the moves jump up at the instant they go live)
10. "On my phone the movie is a postcard and the bottom third is settings." (375x812: picture 47% of the screen,
    8 px markers, 150 px of options and empty space under the caption during every cutscene; everything does fit
    without scrolling)

Verified constants behind these observations: caption typing 70 chars/s; windup 2.0 s; observe 8 s; cutscenes
5 to 8 s; results 4 to 6 s unless a rewind is offered, then indefinite; card 1.8 s (stinger) / 2 s (GET READY) /
3 s (chapter) / 4 s (CASE CLOSED); transit 1.4 s (glide 0.8 s, dissolve 0.6 s, fade-up 0.8 s); windows 7 +-2
clamped 5..9; canvas 180x70 cells above 480 px width, 84x56 at 355 px; sound off by default; no console errors in
any run.
