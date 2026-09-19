# Architecture

The game runs entirely in the browser. `scripts/build.mjs` inserts the new-material extension into the approved renderer and assembles the runtime in dependency order. `dist/index.html` embeds the result and is playable without network access.

## Rendering

The scene builders create 3D surfaces and lights. The camera transforms and projects them; clipped polygons become depth-tested ASCII cells. Surface materials derive glyphs and colors from world coordinates. Characters are projected text poses. Camera movement and actor blocking are tied to story phases.

## Story

`case.js` owns the case phases and branch decisions. `runtime.js` retains the approved opening and calls the case code for later locations. A phase starts with `enter()`, updates the visible choices, and records a checkpoint. Timed movement and quick-time prompts advance through the animation loop. Quiet choices wait for the player.

## Sessions and persistence

`session.js` distinguishes the main menu, story play and scene previews. Previews can run every location but never write the story checkpoint. Opening the menu freezes the phase and its deadline. Starting over requires a confirmation when a checkpoint exists.

`save-store.js` validates known phase names, field types, numeric bounds and clue strings before loading. Saves use a versioned envelope under `last-light/save/v1`. Existing prototype saves from `the-last-light-case-v2` migrate. Settings are stored independently under `last-light/settings/v1` and survive new cases. Storage failures leave a session-only checkpoint and do not prevent play.

Checkpoints restart their current story beat. They do not promise frame-exact mid-animation restoration. Changes to save structure must include an explicit migration or graceful rejection.

## Verification

The native Node test runner checks persistence, preview isolation, menu pause behavior, selected story branches and initial-render fidelity. The rendering harness runs the same generated browser code against a small DOM/canvas substitute. It does not emulate a full browser layout or accessibility tree.

## Next separation

Move dialogue and branch definitions into a case-data format while keeping camera choreography and physical blocking in code. Do this incrementally with the current case as the compatibility check. A new framework is not required to reach the next playable milestone.
