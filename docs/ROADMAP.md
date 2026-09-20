# Toward the first real game

## 0.2 — Development foundation

Completed: repository structure, dependency-free build and local development server, main menu, resume, persistent settings, versioned saves, prototype-save migration, safe scene previews, focused tests and GitHub checks. The approved six-location case remains the playable baseline.

Also completed: the game presentation layer. Block-letter chapter cards and action stingers, a warning card before each reaction, typed narration, arrow-key reflex input, a reflex tally, reaction times and a closing grade, the case file (route taken, persons of interest, evidence), persistent case records with endings and discoveries, and optional synthesized sound.

Also completed: fluid scene transitions (exit beat, connecting line, ASCII dissolve, fade-up), three rewinds per case in the Dragon's Lair sense, and an objective in the header.

Also completed: the studio design pack under `docs/design/` (brief, beat sheet, cast bible, location designs, sprite sheets, decisions), the set and phase registries, and the full fourteen-set case: Bell's loft, the last tram, the night market, Substation Nine and the interview room join the nine earlier sets. Six endings, twenty discoveries, three deductions and eight prompts across the routes.

Also completed, round two: the stage fills the viewport with the picture fitted at 70 rows; one directional input per action beat with cues flashing in the picture, answered by keys, swipe or tap; three lamps, six deaths with their own pictures, a cold case with a chapter restart, deaths seen in the records; captions that hold until read; deductions that bite; Vale, Krane and Ashe earlier in the night; the stay route's arrest. The reviews that led there are under `docs/design/review/`.

Also completed: three new sets with their own camera work. A Night Division office prologue cutscene, The Filament club with a bottle-throw prompt and a new evidence item, and the Undercity storm-drain chase reached from the lower ramp. Close-up character sprites no longer duplicate facial details.

## 0.3 — Detective interaction

Partly done: the street, loft and interview deductions ask the player to name a place or a person from what they have seen, and a wrong answer opens a believable detour or costs a rewind. Next, give the case file's evidence entries a witness and an interpretation, and let the player assemble the interview-room answer from those entries rather than from a caption.

Acceptance: a first-time player can explain why they suspect Ashe above Vale, and two investigation routes can reach that conclusion with different evidence.

## 0.4 — Idle investigation

Replace the short observation waits with useful assigned work: watch a location, decode a record or monitor a radio band. Persist elapsed progress across sessions. Background work may discover leads but must stop before a consequential decision or quick-time event.

Acceptance: returning after a break reveals useful progress, without silently choosing a branch or missing an action scene.

## 0.5 — Cinematic action

Partly done: every action beat has a cue in the picture, a short window and a death or a worse story. Next, the four single-input survival beats from `docs/design/review/GAME.md` so the later sets are denser, and a fresh-player playtest of the windows.

Give each action beat a clear visual warning, a response window and a visible consequence. Add authored camera tracks and vehicle/actor poses rather than increasing the number of prompts. Extend the chase into a complete pursuit with readable traffic and alternate routes.

Acceptance: the player understands the danger from the picture before reading the action labels.

## First release candidate

Finish one polished, replayable case; perform fresh-player playtests; tune phone framing and touch input; add optional audio and a considered offline-install experience. Choose desktop/web/mobile packaging after the case works without explanation from its author.
