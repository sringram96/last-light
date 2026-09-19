# The Last Light

A cinematic ASCII detective game. Watch Detective Rook move through a rain-soaked city, follow a missing lamplighter's trail, make consequential choices, and decide whether to pursue his captor in a high-speed chase.

All scenery, characters, rain, traffic and lighting are drawn with printable ASCII characters. The camera moves through a textured 3D world with perspective, depth and parallax.

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
- Watch the characters and camera; choose actions below the scene.
- During quick-time events, click an action or press **1** or **2** while the game has focus.
- **Untimed** removes reaction deadlines. **Mono** changes to monochrome. Both preferences persist.
- **Menu** pauses the story and provides resume and scene-preview controls.
- **Scene Reel** previews locations without overwriting story progress.

Reduced-motion settings use stable shots, shortened travel and untimed prompts by default. Background tabs and offscreen scenes pause. Observation jobs progress while the visible game is active; there is no offline idle economy yet.

## Current playable case

1. **Station Road:** tail a courier and choose whom or what to save.
2. **Concourse:** inspect a maintenance tape or follow the knocking immediately.
3. **Pump Room 4:** rescue Bell; your response changes the evidence recovered.
4. **Rooftop:** listen to radio traffic and optionally uncover Nell's confession.
5. **Elevated Road:** optional pursuit with lane changes, a bridge jump or a descending ramp.
6. **Canal:** an ending reflecting the evidence, witnesses and pursuit outcome.

Missed action prompts continue the story. The prototype has a complete short case; it is the foundation for a larger game, not a store-ready release.

## Project layout

| Path | Responsibility |
| --- | --- |
| `src/engine/` | Approved ASCII projection, rasterizer and materials |
| `src/game/scenes.js` | Physical sets, characters, vehicles and camera direction |
| `src/game/case.js` | Case dialogue, choices and branching events |
| `src/game/session.js` | Start menu, resume, settings and preview isolation |
| `src/game/save-store.js` | Validated, versioned checkpoints and legacy migration |
| `src/game/runtime.js` | Opening sequence, drawing, controls and animation loop |
| `src/ui/` | Minimal interface around the scene |
| `reference/` | Immutable approved visual references |
| `tests/` | Focused game and persistence checks |
| `docs/` | Art direction, architecture and development milestones |

The dependency-free build currently assembles the existing game into one private runtime scope. This preserves the approved renderer while systems are separated incrementally. Generated `dist/` files are not source files.

See [art direction](docs/ART_DIRECTION.md), [architecture](docs/ARCHITECTURE.md), and [roadmap](docs/ROADMAP.md) before making changes.
