# Approved visual direction

The approved reference is a dense, textured 3D world rendered entirely through printable ASCII characters, with a moving cinematic camera. The user explicitly rejected flat backdrops, sparse buildings and static framing after approving this direction.

## Preserve

- World-fixed textures on physical facades, floors, roofs, water and vehicles.
- Perspective, occlusion, physical volume, layered depth and parallax.
- Warm lamps against cool architecture, wet reflections and distance fog.
- Visible third-person protagonists, expressive poses and perspective-scaled characters.
- Continuous movement within a location, with deliberate camera changes between story beats.
- Varied shots: street tracking, a concourse crane, low machinery views, rooftop sweeps and side-tracking pursuit.
- A quiet interface beside the art, with readable choices and minimal explanatory text.
- Title cards, stingers and the case file are HTML beside the canvas, never over it. They never overlay or draw into the scene, and the block-letter font uses only `#` and spaces.
- Title-safe margin: names and the `[1]`/`[2]` cue markers are placed so their cells fall at least 2 columns in from the sides and 1 row from the top and bottom of the grid. This is a camera and label-placement rule, not a renderer change; `worldLabel()` clips at the edge, which is how a marker can otherwise be lost.
- The interface palette follows the scene: warm amber for titles and status, cyan for landed moves and the reflex tally, muted red for warnings and misses.

## Graphics rules

- Scene glyphs are printable ASCII, character codes 32 through 126.
- No bitmap backgrounds, emoji, Unicode block art or raster character sprites.
- Use the existing density, font proportions and field of view as the starting point for all screen sizes.
- Preserve the original palette unless a particular scene needs a deliberate lighting change.
- A camera must communicate what the player can act on. Frame the relevant person, mechanism, vehicle or hazard clearly.
- Ambient motion should add life without obscuring actors or evidence.

The three files in `reference/` record the approved street study, opening and complete six-location prototype. The renderer regression check compares the actual first-frame glyph output with the complete-case reference at phone and desktop widths, ignoring only the cells inside character sprites. It does not replace visual review of new camera movement or composition.

## Characters

Character sprites are text poses projected into the scene, drawn from three sizes of sheet (`full`, `mid`, `small`) so that a far figure is hand-drawn art rather than a sampled fragment of the close-up art. The figure sits on whole cells and grows in whole-row steps while the camera glides; it never shimmers. Fill glyphs (`# = : - ~`) fill their band when a character is close to the camera; outlines (`/ \ | ( ) _`) are drawn once along their band; facial details (`o`, `.`, `>`) are stamped once, so a close-up never shows a second pair of eyes. Keep faces to those three glyphs, outlines and fills to those sets, and enclose the inside of a head with outline glyphs so the set does not show through it. The width of a figure stays 0.41 of its height in world terms at every distance. Walk cycles advance with distance travelled; a standing character never flickers.

## Transitions

A scene change is never a hard cut. The leaving set plays an exit beat of about a second and a half: the camera glides part of the way toward that set's exit point (a hatch, a ladder, a door, or straight down the road) while one line of narration explains the move. The picture then dissolves the way the art itself fades with distance: colours dim toward the background and heavy glyphs thin to `+`, then `.`, then nothing. The next set fades up from the same dissolve with its camera already moving toward the first shot. Reduced motion, resumes and previews cut directly.

## Sets

Each set has its own camera language: the street tracks, the concourse cranes, the pump room stays low, the roof sweeps, the office pushes in slowly and then sits low over the desk, the club dollies past the bar and cranes over the booth, the elevated road and the undercity chase from behind, from the side and head-on. The loft sits at Bell's table height, the tram looks out of its own window and along the span, the market pushes through a narrow aisle, Substation Nine looks down from the gantry and then out across the basin as dawn comes up, and the interview room holds one low shot across the table. Interiors are lit by the same lamp pools as the street. Neon is the only surface allowed to flicker. Dawn is the only palette change: a single sky quad whose level rises with the checkpoint's `dawn` value.

`docs/design/LOCATIONS.md` is the style sheet for new sets: palette meanings, the five density rules, the camera grammar per act, and every set's geometry, shots, blocking and exit. A new set is judged against it at 1024 and at 375 pixels wide before it joins the case.
