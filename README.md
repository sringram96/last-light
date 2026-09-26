# The Last Light

A cinematic ASCII detective game. Watch Detective Rook move through a rain-soaked city, follow a missing lamplighter's trail, make consequential choices, and decide whether to pursue his captor in a high-speed chase.

All scenery, characters, rain, traffic and lighting are drawn with printable ASCII characters. The camera moves through a textured 3D world with perspective, depth and parallax.

The game plays like a laserdisc arcade cabinet crossed with a branching mystery: watch the picture, react when it turns, and choose the route. Every chapter opens with a block-letter title card, every landed or missed move gets a stinger, the case file tracks your route and the persons of interest, and closed cases add endings and discoveries to a persistent record.

## Run

Install Node.js 22 or newer, then:

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. No package installation is required. Source changes rebuild automatically; refresh the browser to see them.

```sh
npm run build    # Self-contained browser game: dist/index.html
npm test         # Save-system, story-route and renderer regression checks
```

`dist/index.html` also opens directly in a browser. Progress saving depends on the browser allowing local storage; use the local server for a consistent origin. There is no runtime backend or external asset dependency.

## Play

- The menu opens on Rook at a rooftop ledge over the city, a cigarette going, a billboard cycling, neon flickering and a chase in the sky; it plays for as long as you take. Choose **New Case**, or **Continue Case** to load your saved checkpoint. The game fills the window; **Full Screen** (or `f`) takes the whole display.
- Watch the characters and camera. Quiet choices are buttons under the picture; narration types in and holds until it can be read, and a tap on the picture, Space or Enter shows the next sentence without skipping a beat.
- **Look around.** At a crime scene the picture carries numbered markers on things worth a look: the bolted door, the inlet wheel with its pin taken, the order on a desk, a cup still warm. Tap a marker, press its number, or use its button; the camera moves in, Rook reads it, and the case file keeps it. Look at what you like, in any order, then take the way out. Nothing is on a clock, but at North Station the knocking under the floor leaves Rook time for three looks out of five, so what you read decides what you know.
- **Turn it over.** Some things can be picked up: Bell's lantern on Station Road, the padlock on the Pump Room 4 door. The picture cuts to the object alone in the dark; drag it, use the arrow keys, or the turn buttons, and tip it to see underneath. What is cut into a face can only be read while that face is toward you, and its marker shows beside it: tap it, press its number, or use its button.
- **Text under the picture means think; a flash in the picture means move.** At an action beat two direction cues (`<<`, `>>`, `^^`, `vv`) flash on the things Rook can act on. Press that arrow key (or WASD), swipe that way on the picture, or tap the cue, within a window of 1.5 to 3 seconds. A wrong direction or no input is the miss.
- Three **lamps** per case. Six misses are lethal: the death plays, a lamp goes out, and the night rewinds to the moment. Three are survivable with a worse story, and rewinding them costs a lamp. With no lamp left the case goes cold; restart the chapter or return to the menu.
- **Theories.** At the hatch Rook names who he thinks locked Bell in, from the names his evidence supports. The right name costs nothing; a wrong one, or none, costs the minute it took, and suspecting the courier costs more.
- Deductions cost a lamp on the second wrong answer, and Vale can stall the interview.
- The header keeps the lamps and a **REFLEX** tally. The closing report names the ending, the inputs landed, deaths, restarts and a grade.
- **Case File** shows the route taken, the persons of interest and the evidence gathered.
- **Case Records** on the menu lists endings found (of seven), discoveries (of twenty-two) and deaths seen (of six). Records survive new cases.
- Scene changes play an exit beat: the camera glides toward the way out while a connecting line types in, the picture dissolves, and the next set fades up already in motion. Reduced motion cuts directly.
- **Untimed** removes reaction deadlines and shows the cues steadily with numbered buttons. **Mono** changes to monochrome. **Sound** enables short synthesized cues. All three preferences persist and live on the menu screen.
- **Menu** pauses the story and provides resume and scene-preview controls. Opening the case file pauses too.
- **Scene Reel** previews locations without overwriting story progress or records.

Reduced-motion settings use stable shots, shortened travel, untimed prompts and instant narration by default. Background tabs and offscreen scenes pause.

## Current playable case

A missing lamplighter, a city running on stolen reserve power, and one night to find who signed for it. Fourteen sets, eight action beats across the routes (seven on any one pursuit), three deductions, seven endings, twenty-two discoveries and six deaths to see. The full beat sheet is in [docs/design/BEATS.md](docs/design/BEATS.md); the cast is in [docs/design/CHARACTERS.md](docs/design/CHARACTERS.md).

0. **Night Division:** a skippable arrival in Rook's office, then a look around the desk: the Bell file, the case board with Vale's commendation, the dispatch log and the window, any two of them before the stairs.
1. **Station Road:** tail the courier, choose whom or what to save, then deduce where Bell is: the station, his loft over the depot, or the hotel.
2. **Bell's Loft:** a detour over the depot where Bell's note and his own case board explain the order, at the cost of a wrong reading.
3. **Concourse:** three looks at the maintenance desk before the knocking takes the choice away (the order, the tape, the hatch, the departures board, a cup still warm), then a theory at the hatch. The tape shows Rook which wheel to reach for; the order is what he can put on Vale's table at The Filament; the wrong name loses the water a minute.
4. **Pump Room 4:** rescue Bell, then search the room he was locked in: a door bolted from outside, an inlet opened to full with its stop pin taken, four nights of knocking worn into the paint.
5. **Rooftop:** listen to the radio, hear Nell's confession, then pursue Vale or stay with Bell.
6. **The Last Tram:** a quiet ride across the lift bridge that decides whether Vale's man is tailing you.
7. **Night Market:** a slip through the stalls and a keeper who saw the red car, ending in a shove and a knife.
8. **The Filament:** the neon club where Vale's bodyguard throws a bottle. Duck, or vault the bar for the chip that ties the batteries to Vale's tables.
9. **Elevated Road:** the pursuit, with a lane change and a lifting bridge.
10. **The Undercity:** the lower ramp drops into the storm drains, where a fork decides the arrest.
11. **Substation Nine:** the loading dock where the Board's countersignature hangs on a rack, a breaker to throw, and dawn coming up across the basin.
12. **Interview Room:** name who signed above Vale, with whoever the night left in the chair.
13. **Canal:** an ending derived from the evidence, the witnesses, the pursuit and the name on the warrant.

Six missed beats are deaths that spend a lamp and rewind the night; three are survivable with a worse story. With no lamp left the case goes cold and the chapter can be restarted. Staying with Bell on the roof skips the pursuit and reaches the interview room by the tram and the station. The case is complete and replayable; it is the foundation for a larger game, not a store-ready release.

## Project layout

| Path | Responsibility |
| --- | --- |
| `src/engine/` | Approved ASCII projection, rasterizer and materials |
| `src/game/scenes.js` | The original sets, vehicles, transition lines and camera direction |
| `src/game/registry.js` | Set and phase registries plus the derived story helpers |
| `src/game/sets/` | One file per newer set: geometry, camera, blocking and its beats |
| `src/game/case.js` | Case dialogue, choices and branching events |
| `src/game/session.js` | Start menu, resume, settings and preview isolation |
| `src/game/save-store.js` | Validated, versioned checkpoints, settings, case records and legacy migration |
| `src/game/presentation.js` | Title cards, stingers, typed narration, case file, reflex score and records |
| `src/game/audio.js` | Optional synthesized sound cues |
| `src/game/runtime.js` | Opening sequence, drawing, controls and animation loop |
| `src/ui/` | Minimal interface around the scene |
| `reference/` | Immutable approved visual references |
| `tests/` | Focused game and persistence checks |
| `docs/` | Art direction, architecture and development milestones |
| `docs/design/` | The studio design pack: brief, beat sheet, cast bible, locations, sprite sheets and decisions |

The dependency-free build currently assembles the existing game into one private runtime scope. This preserves the approved renderer while systems are separated incrementally. Generated `dist/` files are not source files.

See [art direction](docs/ART_DIRECTION.md), [architecture](docs/ARCHITECTURE.md), and [roadmap](docs/ROADMAP.md) before making changes.
