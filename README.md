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
- **Case Records** on the menu lists endings found (of five) and discoveries (of eleven). Records survive new cases.
- After a landed move, the status line shows your reaction time. After a missed one, choose **Rewind the Moment** (three per case) to replay the beat, or **Carry On** with the consequence.
- The header shows the current objective and rewinds left.
- Scene changes play an exit beat: the camera glides toward the way out while a connecting line types in, the picture dissolves, and the next set fades up already in motion. Reduced motion cuts directly.
- **Untimed** removes reaction deadlines. **Mono** changes to monochrome. **Sound** enables short synthesized cues. All three preferences persist.
- **Menu** pauses the story and provides resume and scene-preview controls.
- **Scene Reel** previews locations without overwriting story progress or records.

Reduced-motion settings use stable shots, shortened travel, untimed prompts and instant narration by default. Background tabs and offscreen scenes pause. Observation jobs progress while the visible game is active; there is no offline idle economy yet.

## Current playable case

0. **Night Division:** a skippable prologue cutscene in Rook's office: the desk, the case board, and the Bell file.
1. **Station Road:** tail a courier and choose whom or what to save.
2. **Concourse:** inspect a maintenance tape or follow the knocking immediately.
3. **Pump Room 4:** rescue Bell; your response changes the evidence recovered.
4. **Rooftop:** listen to radio traffic and optionally uncover Nell's confession.
5. **The Filament:** a neon club where Vale's bodyguard throws a bottle. Duck, or vault the bar and pocket a chip that ties the batteries to Vale's tables.
6. **Elevated Road:** the pursuit, with a lane change and a lifting bridge.
7. **The Undercity:** taking the lower ramp drops into the storm drains, where a fork decides the arrest.
8. **Canal:** an ending reflecting the evidence, witnesses and pursuit outcome.

Missed action prompts continue the story. The prototype has a complete short case; it is the foundation for a larger game, not a store-ready release.

## Project layout

| Path | Responsibility |
| --- | --- |
| `src/engine/` | Approved ASCII projection, rasterizer and materials |
| `src/game/scenes.js` | Physical sets, characters, vehicles and camera direction |
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

The dependency-free build currently assembles the existing game into one private runtime scope. This preserves the approved renderer while systems are separated incrementally. Generated `dist/` files are not source files.

See [art direction](docs/ART_DIRECTION.md), [architecture](docs/ARCHITECTURE.md), and [roadmap](docs/ROADMAP.md) before making changes.
