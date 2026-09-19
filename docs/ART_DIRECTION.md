# Approved visual direction

The approved reference is a dense, textured 3D world rendered entirely through printable ASCII characters, with a moving cinematic camera. The user explicitly rejected flat backdrops, sparse buildings and static framing after approving this direction.

## Preserve

- World-fixed textures on physical facades, floors, roofs, water and vehicles.
- Perspective, occlusion, physical volume, layered depth and parallax.
- Warm lamps against cool architecture, wet reflections and distance fog.
- Visible third-person protagonists, expressive poses and perspective-scaled characters.
- Continuous movement within a location, with deliberate camera changes between story beats.
- Varied shots: street tracking, a concourse crane, low machinery views, rooftop sweeps and side-tracking pursuit.
- A quiet interface below the art, with readable choices and minimal explanatory text.

## Graphics rules

- Scene glyphs are printable ASCII, character codes 32 through 126.
- No bitmap backgrounds, emoji, Unicode block art or raster character sprites.
- Use the existing density, font proportions and field of view as the starting point for all screen sizes.
- Preserve the original palette unless a particular scene needs a deliberate lighting change.
- A camera must communicate what the player can act on. Frame the relevant person, mechanism, vehicle or hazard clearly.
- Ambient motion should add life without obscuring actors or evidence.

The three files in `reference/` record the approved street study, opening and complete six-location prototype. The renderer regression check compares the actual first-frame glyph output with the complete-case reference at phone and desktop widths. It does not replace visual review of new camera movement or composition.
