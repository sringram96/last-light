# Architecture

The game runs entirely in the browser. `scripts/build.mjs` inserts the new-material extension into the approved renderer and assembles the runtime in dependency order. `dist/index.html` embeds the result and is playable without network access.

## Rendering

The scene builders create 3D surfaces and lights. The camera transforms and projects them; clipped polygons become depth-tested ASCII cells. Surface materials derive glyphs and colors from world coordinates. Characters are projected text poses. Camera movement and actor blocking are tied to story phases.

## Story

`case.js` owns the case phases and branch decisions. `runtime.js` retains the approved opening and calls the case code for later locations. A phase starts with `enter()`, updates the visible choices, and records a checkpoint. Timed movement and quick-time prompts advance through the animation loop. Quiet choices wait for the player.

Nine sets exist: office, street, station, pump room, roof, club, elevated road, undercity and canal. The office is a prologue cutscene that leads into the street. Pursuing Vale goes through the club before the road, and the lower ramp at the bridge leads into the undercity, whose fork decides the arrest. Each set is built once and cached; the road and the undercity move with the pursuit distance.

## Transitions and rewinds

`enter()` defers a phase whose set differs from the current one: it stores the pending phase, an exit shot derived from the current camera and the set's exit point, and a connecting caption, then the animation loop glides the camera, drives a fade value to zero and only then applies the phase. The fade dims palette levels and thins glyphs in `render()` after the frame is composed, so it never touches the scene builders. Menus and pauses freeze a transition in place. Direct entries (resume, previews, reduced motion) skip it.

Missed prompts stop at their result phase and offer a rewind while any remain. A rewind resets the fields that prompt wrote and re-enters its windup phase; the rewind count is part of the checkpoint.

## Presentation

`presentation.js` owns everything that makes a beat feel like a game without touching the scene: a five-row block font for chapter cards and stingers, the typed narration, the case file (route, persons of interest, evidence), the reflex tally and the case records. `enter()` reports each phase change and whether the scene changed; the presentation layer decides whether that is a chapter card, a landed or missed stinger, a warning, or nothing. Everything it draws is HTML placed below the canvas. `audio.js` synthesizes short cues from oscillators when the sound preference is on; it has no assets and is silent by default.

Narration types in from a copy of the caption. The visible caption is hidden from assistive technology and a visually hidden live region receives the full sentence once, so screen readers hear whole sentences rather than fragments.

## Sessions and persistence

`session.js` distinguishes the main menu, story play and scene previews. Previews can run every location but never write the story checkpoint. Opening the menu freezes the phase and its deadline. Starting over requires a confirmation when a checkpoint exists.

`save-store.js` validates known phase names, field types, numeric bounds and clue strings before loading. Saves use a versioned envelope under `last-light/save/v1`. Existing prototype saves from `the-last-light-case-v2` migrate. Settings are stored independently under `last-light/settings/v1` and survive new cases. Case records (endings reached, discoveries made, cases closed) live under `last-light/records/v1`; they are written only when a story session, never a preview, reaches the ending, and a new case does not clear them. Storage failures leave a session-only checkpoint and do not prevent play.

Endings, discoveries, the route and the reflex score are all derived from existing checkpoint fields, so the checkpoint schema did not change.

Checkpoints restart their current story beat. They do not promise frame-exact mid-animation restoration. Changes to save structure must include an explicit migration or graceful rejection.

## Verification

The native Node test runner checks persistence, preview isolation, menu pause behavior, selected story branches and initial-render fidelity. The rendering harness runs the same generated browser code against a small DOM/canvas substitute. It does not emulate a full browser layout or accessibility tree.

## Next separation

Move dialogue and branch definitions into a case-data format while keeping camera choreography and physical blocking in code. Do this incrementally with the current case as the compatibility check. A new framework is not required to reach the next playable milestone.
