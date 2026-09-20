# Architecture

The game runs entirely in the browser. `scripts/build.mjs` inserts the new-material extension into the approved renderer and assembles the runtime in dependency order. `dist/index.html` embeds the result and is playable without network access.

## Rendering

The scene builders create 3D surfaces and lights. The camera transforms and projects them; clipped polygons become depth-tested ASCII cells. Surface materials derive glyphs and colors from world coordinates. Camera movement and actor blocking are tied to story phases.

Characters are text sprite sheets (`src/game/sprites.js`, with the design team's sheets inlined from `docs/design/sprites.json` at build time). Each character has `full`, `mid` and `small` poses; `actor()` in `runtime.js` snaps the figure to whole cells, picks the sheet that fits the projected size without squeezing it below 0.7, and draws each sheet cell into its band of screen cells so that fills tile, outlines and faces are drawn once, and enclosed spaces stay opaque. Walk frames advance with distance travelled. A blocking entry names its sheet with `who` and its pose with `pose`; `docs/design/TECH.md` has the rules and the loader API.

## Story

`case.js` owns the case phases and branch decisions. `runtime.js` retains the approved opening and calls the case code for later locations. A phase starts with `enter()`, updates the visible choices, and records a checkpoint. Timed movement and quick-time prompts advance through the animation loop. Quiet choices wait for the player.

Newer sets live in `src/game/sets/`, one file each, and register themselves through `registry.js`: `registerSet()` takes the set's chapter card, objective, geometry, camera shots, blocking, labels, exit point and preview, and `registerPhases()` takes its beats as data (kind, duration, caption, buttons, moves, clues, rewind entry and successor). `case.js`, `scenes.js`, `presentation.js` and `runtime.js` consult the registries first and fall back to the hand-written sets. The build concatenates the set files after `scenes.js` and before `case.js`.

Fourteen sets exist: office, street, loft, station, pump room, roof, tram, market, club, elevated road, undercity, substation, interview room and canal. The office is a prologue cutscene that leads into the street. The street deduction can detour through Bell's loft. From the roof, pursuing Vale goes by the tram, the market and the club to the road; the lower ramp at the bridge leads into the undercity, whose fork decides whether Vale is caught. Both chases end at Substation Nine, then the interview room and the canal. Staying with Bell goes by the tram and the station straight to the interview room. Each set is built once and cached; the road, the undercity and the tram move with the pursuit distance.

The derived helpers in `registry.js` (`ledgerHeld`, `manifestHeld`, `chipHeld`, `proofHeld`, `kranePinned`, `pursuing`) read only checkpoint fields, so a phase never stores a conclusion it can compute.

## Transitions and rewinds

`enter()` defers a phase whose set differs from the current one: it stores the pending phase, an exit shot derived from the current camera and the set's exit point, and a connecting caption, then the animation loop glides the camera, drives a fade value to zero and only then applies the phase. The fade dims palette levels and thins glyphs in `render()` after the frame is composed, so it never touches the scene builders. Menus and pauses freeze a transition in place. Direct entries (resume, previews, reduced motion) skip it.

Missed prompts stop at their result phase and offer a rewind while any remain. A rewind resets the fields that prompt wrote and re-enters its windup phase; the rewind count is part of the checkpoint.

## Presentation

`presentation.js` owns everything that makes a beat feel like a game without touching the scene: a five-row block font for chapter cards and stingers, the typed narration, the case file (route, persons of interest, evidence), the reflex tally and the case records. `enter()` reports each phase change and whether the scene changed; the presentation layer decides whether that is a chapter card, a landed or missed stinger, a warning, or nothing. Everything it draws is HTML placed below the canvas. `audio.js` synthesizes short cues from oscillators when the sound preference is on; it has no assets and is silent by default.

Narration types in from a copy of the caption. The visible caption is hidden from assistive technology and a visually hidden live region receives the full sentence once, so screen readers hear whole sentences rather than fragments.

## Sessions and persistence

`session.js` distinguishes the main menu, story play and scene previews. Previews can run every location but never write the story checkpoint. Opening the menu freezes the phase and its deadline. Starting over requires a confirmation when a checkpoint exists.

`save-store.js` validates known phase names, field types, numeric bounds and clue strings before loading. Saves use a versioned envelope under `last-light/save/v1`. Existing prototype saves from `the-last-light-case-v2` migrate. Settings are stored independently under `last-light/settings/v1` and survive new cases. Case records (endings reached, discoveries made, cases closed) live under `last-light/records/v1`; they are written only when a story session, never a preview, reaches the canal ending, and a new case does not clear them. Storage failures leave a session-only checkpoint and do not prevent play.

Endings, discoveries, the route and the reflex score are all derived from checkpoint fields. Fields added for the longer case (`note`, `loftSeen`, `misread`, `tail`, `keeper`, `market`, `hall`, `slip`) are validated like the originals; a checkpoint saved at the removed `ending` phase resumes at `arrival`, and the record ids `arrest-ledger` and `arrest-word` read back as `board` and `word`.

Checkpoints restart their current story beat. They do not promise frame-exact mid-animation restoration. Changes to save structure must include an explicit migration or graceful rejection.

## Verification

The native Node test runner checks persistence, preview isolation, menu pause behavior, selected story branches and initial-render fidelity. The rendering harness runs the same generated browser code against a small DOM/canvas substitute. It does not emulate a full browser layout or accessibility tree.

## Next separation

The newer sets already keep their beats as registry data and their camera and blocking in code. Move the original street, station, pump room, roof, club, road, undercity and canal beats into the same registry incrementally, with the current case as the compatibility check. A new framework is not required to reach the next playable milestone.
