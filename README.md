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

- Choose **New Case**, or **Continue Case** to load your saved checkpoint.
- Watch the characters and camera; choose actions below the scene. Narration types in; chapter cards and stingers appear under the picture.
- **GET READY** warns that a reaction is coming. During quick-time events, click an action, press **1** or **2**, or use the arrow keys (left/up for the first move, right/down for the second).
- The header keeps a **REFLEX** tally of prompts answered in time. The closing report names the ending, the reflex score and a grade.
- **Case File** shows the route taken, the persons of interest and the evidence gathered.
- **Case Records** on the menu lists endings found (of six) and discoveries (of twenty). Records survive new cases.
- After a landed move, the status line shows your reaction time. After a missed one, choose **Rewind the Moment** (three per case) to replay the beat, or **Carry On** with the consequence.
- The header shows the current objective and rewinds left.
- Scene changes play an exit beat: the camera glides toward the way out while a connecting line types in, the picture dissolves, and the next set fades up already in motion. Reduced motion cuts directly.
- **Untimed** removes reaction deadlines. **Mono** changes to monochrome. **Sound** enables short synthesized cues. All three preferences persist.
- **Menu** pauses the story and provides resume and scene-preview controls.
- **Scene Reel** previews locations without overwriting story progress or records.

Reduced-motion settings use stable shots, shortened travel, untimed prompts and instant narration by default. Background tabs and offscreen scenes pause. Observation jobs progress while the visible game is active; there is no offline idle economy yet.

## Current playable case

A missing lamplighter, a city running on stolen reserve power, and one night to find who signed for it. Fourteen sets, eight reaction prompts across the routes (seven on any one pursuit), three deductions, six endings and twenty discoveries. The full beat sheet is in [docs/design/BEATS.md](docs/design/BEATS.md); the cast is in [docs/design/CHARACTERS.md](docs/design/CHARACTERS.md).

0. **Night Division:** a skippable prologue in Rook's office: the desk, the case board with the Lumen Board memo, and the Bell file.
1. **Station Road:** tail the courier, choose whom or what to save, then deduce where Bell is: the station, his loft over the depot, or the hotel.
2. **Bell's Loft:** a detour over the depot where Bell's note and his own case board explain the order, at the cost of a wrong reading.
3. **Concourse:** inspect the maintenance tape for order 7731 or follow the knocking immediately.
4. **Pump Room 4:** rescue Bell; how you respond changes the evidence recovered.
5. **Rooftop:** listen to the radio, hear Nell's confession, then pursue Vale or stay with Bell.
6. **The Last Tram:** a quiet ride across the lift bridge that decides whether Vale's man is tailing you.
7. **Night Market:** a slip through the stalls and a keeper who saw the red car, ending in a shove and a knife.
8. **The Filament:** the neon club where Vale's bodyguard throws a bottle. Duck, or vault the bar for the chip that ties the batteries to Vale's tables.
9. **Elevated Road:** the pursuit, with a lane change and a lifting bridge.
10. **The Undercity:** the lower ramp drops into the storm drains, where a fork decides the arrest.
11. **Substation Nine:** the loading dock where the Board's countersignature hangs on a rack, a breaker to throw, and dawn coming up across the basin.
12. **Interview Room:** name who signed above Vale, with whoever the night left in the chair.
13. **Canal:** an ending derived from the evidence, the witnesses, the pursuit and the name on the warrant.

Missed action prompts continue the story with their own consequence, and three rewinds per case let the player replay a missed beat. Staying with Bell on the roof skips the pursuit and reaches the interview room by the tram and the station. The case is complete and replayable; it is the foundation for a larger game, not a store-ready release.

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
