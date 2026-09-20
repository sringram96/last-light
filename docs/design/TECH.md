# Characters on a moving camera: findings and the sprite system

Technical Director's notes for the design team. Part 1 says what went wrong when the camera moved and why. Part 2 is the sprite format and loader for content people. Part 3 is the projection and drawing rules the engine now follows, and the limits.

## Part 1: findings

The complaint: "the people still get messy when we change the camera." Diagnosed by driving the built game with Playwright at 1024 and 375 wide (station entry, roof entry, club dolly, pump room, street follow and prompt, canal) and by dumping the glyph grid inside every sprite rectangle frame by frame with the test harness.

Screenshots (session scratchpad, regenerated with `node capture.mjs before|after` from `/tmp/claude-0/-home-user-last-light/57a53dce-2b2e-59b7-b8a3-159161fb1515/scratchpad`; each shot also has `-cropN.png` crops of every sprite rectangle at 2x):

| Shot | Before | After |
|---|---|---|
| Station entry, three frames 70 ms apart, desktop | `shots/before/1024-station-4.png`, `-4.07`, `-4.14` (and `-crop1`) | `shots/after/1024-station-4.png`, `-4.07`, `-4.14` |
| Station close-up at the desk | `shots/before/1024-station-7.6.png` | `shots/after/1024-station-7.6.png` |
| Station entry, phone | `shots/before/375-station-2.png`, `-6` | `shots/after/375-station-2.png`, `-6` |
| Roof entry | `shots/before/1024-roof-0.4.png`, `-5`, `shots/before/375-roof-8.6.png` | `shots/after/...` same names |
| Club dolly and face-off | `shots/before/1024-club-3.png`, `-6`, `shots/before/375-club-qte.png` | `shots/after/...` same names |
| Pump room | `shots/before/1024-pump-3.png`, `-qte` | `shots/after/...` same names |
| Street prompt close-up | `shots/before/1024-street-qte.png` | `shots/after/1024-street-qte.png` |
| Canal, distant figures | `shots/before/375-canal-3.png` | `shots/after/375-canal-3.png` |

Camera and sprite rectangles for every shot are in `shots/<tag>/audit.json`.

### What went wrong, mechanism by mechanism

The old `actor()` projected the feet and head points, then for every screen row between them sampled `rows[floor(u * rows)]` and for every screen column `row[floor(x / w * cols)]`: nearest-neighbour sampling of an 11x11 (Rook) or 9x10 (everyone else) text sheet at whatever fractional size the projection produced.

1. **Small sizes: decimation.** At 5 to 9 rows the sampler keeps some rows and columns and drops the rest, and which ones survive depends on the sub-cell phase of the projected top and bottom. The 9x10 courier at 8 rows became `=_=_@` / `#.#..` / `.:#|.` / `:..\-`; the medic on the roof at 7 rows was `o_` / `(` / `/#`. There was no smaller art to fall back to.
2. **Large sizes: duplication.** At 16 rows Rook's 11 rows each cover 1.45 screen rows, so every other row is repeated: `_____` twice, `_/=====\_` twice, `/|~\` twice, `/|#####|\` twice, and at the desk close-up `((`, `//`, `||` double strokes. The earlier fix drew the face glyphs once, which is why the eyes stayed single while the hat, coat and legs doubled.
3. **The width formula.** `w = h * (ch/cw) * 0.41` gives 0.705 columns per row. That aspect is approved (it is how the reference frame looks), but it means an 11-column sheet drawn at 11 rows gets only 8 columns: three of eleven columns were dropped, including the `(` of Rook's face at mid distances, before any row was doubled.
4. **Row banding.** Because the sample position was `(y - ap.y) / h` with fractional `ap.y`, the boundary between two sheet rows sat at a different screen row every frame. A one-pixel camera move re-banded the whole sprite.
5. **Sub-cell jitter.** The sprite's left edge was `cx - w/2` with fractional `cx`, and the loop started at `floor(left)`; the column mapping shifted by a fraction of a cell as `ap.x` and `bp.x` moved. During a glide the three consecutive frames at 4.0, 4.07 and 4.14 s read `( =o>`, `(=o=>`, `(=o_>` with the brim appearing once, then twice.
6. **The lean offset** sheared the top of the sprite against the bottom in fractional cells, so a stumbling courier shimmered on every row, not only in the intended lean.
7. **Walk-frame flicker.** The legs alternated on `floor(state.t * 5) % 2`, a 2.5 Hz clock, regardless of whether the character moved. The courier in the brief phase stands still and flickered; a walking character changed frame at the same moment the banding shifted, which read as the whole figure twitching.
8. **Depth.** Not a cause: the per-row depth offset (`-0.06`, faces `-0.1`) kept sprites in front of the floor and behind the desk and lanterns. It is kept as it was.

Text evidence, Rook in the station entry at 732 wide, three frames 100 ms apart. Before (the sheet re-bands and the legs flip):

```
   _____::::        _____::::        _____::::
 _/===\_::::      _/===\_::::      _/===\_::::
:o:>::::::::     _/o=>\=:::::      :::o>::::::
 |~\::::::::      (::===:::::      :::/~\:::::
/#~#\:::::::      /|~:===::::      /#~#\:::::
|####\===:::     /#~#:::==:::     /|####|::::
|####|::::::     |###|\::::::      |####|\:::
/####\::::::     |####::::::      |####|::::
/__|__\:::::     /####::::::      ####\:::::
:::::::::::      /__|___:==:      /__|__\:::
_/:==_=:::        |::\::::::      ::====::::
```

After (same sheet, same layout, growing by a whole row when the projected height crosses a row boundary):

```
..::___::==      ..:=___:::::     =---___--==
.._/===\:::      .::_/===\:==     ::_/===\:::
.==(:o>::::      .:::(:o>==::     :::(:o>::::
===/|\:::::      ::::/|\===::     :::/|\:::::
:=/##~\::::      :::/##~\===:     ::/##~\::::
::/####|:::      :::/####|::=     ::/####|:::
::/####|:==      :::/####|:::     ===/####|::
:::|####|::      :::|####|:::     :::|####|::
:::/####\::      :==/####\:::     :::/####\::
:==/__|__::      :::/__|__::=     :::/__|__::
::::|::\:::      :::::/::|:::     ::::|==\=::
```

The remaining differences between the three frames are the tiles of the set showing through the sprite's transparent cells and the legs, which change with distance walked.

### Findings that are not sprite problems

- **Roof entry hides Rook.** At phone width Rook is behind the stair housing (`box(-12,0,-4,-7,4.2,3)`) for the first six seconds of `roofEntry`; the camera starts at `(-12, 6, -5)` and glides to `(-7, 4.1, 4)`, looking over the housing's roof edge at a man walking behind it. At desktop width he is visible from about five seconds. A blocking or camera fix for the Director, not a rendering fix.
- **Transparent spaces in the art show the set through the body at close-ups.** The engine now fills enclosed spaces (see Part 3), but a gap between the legs or between Nell's pole and her hood is open on purpose and stays transparent.

## Part 2: sprite format and loader

Sheets live in `docs/design/sprites.json` (the Character Director's file) and are inlined by the build (`scripts/build.mjs`) over the built-in placeholders in `src/game/sprites.js`. Nothing is fetched at runtime; run `npm run build` (or `npm run dev`, which rebuilds) after editing the file. Invalid JSON fails the build with the parser's message.

### Shape

```json
{
  "rook": {
    "hue": 1, "faceHue": 6, "level": 14,
    "height": 2.15, "heights": { "crouch": 1.35 },
    "accent": [{ "glyph": "~", "hue": 2 }, { "glyph": "*", "hue": 3 }, { "glyph": "+", "hue": 3 }],
    "hero":  { "stand": ["..."], "smoke": [["..."], ["..."]] },
    "full":  { "stand": ["    ____   ", "..."], "walk": [["..."], ["..."]], "reach": ["..."] },
    "mid":   { "stand": ["..."], "walk": [["..."], ["..."]] },
    "small": { "stand": ["..."], "walk": [["..."], ["..."]] }
  },
  "generic": { "...": "the sheet every actor without a who, or with an unknown who, draws" }
}
```

- **Character key** is what blocking names in `who` (`rook`, `nell`, `bell`, `vale`, `krane`, `medic`, `performer`, `patron`, `ashe`, ...). An actor without `who` draws `generic`; `actor(a, true)` draws `rook`. An unknown `who` also draws `generic`.
- **Sizes** are `hero` (a close-up sheet; Rook's is 36 rows by 25 for the menu tableau, nobody else has one), `full`, `mid` (about 7x7) and `small` (about 5x5). Any row and column counts work; the engine reads them from the art. Every row of one size is padded to the widest row of that size, so keep all rows of a size the same length.
- **Poses** are arrays of row strings. `walk` (or any pose with frames) is an array of frames, each an array of rows. Existing pose names: `stand`, `walk`, `watch`, `reach`, `support`, `read`, `crouch`, `stumble`; the design sheets add `wrench`, `sit`, `lantern`, `radio`, `throw`, `stage`, `handsUp`. Any name works; blocking picks it with `pose:`. `watch` and `smoke` borrow `stand` at sizes that do not draw them. A pose that no size draws falls back to `stand`.
- **Frames.** `walk` frames advance with distance walked. Any other pose given frames is an idle cycle (Rook's `hero` `smoke`): the engine shows `floor(state.t / 1.5) % frames` and the story clock only runs while the game is live, so a pause, the drawer, a hidden tab and reduced motion hold the frame.
- **`stand` is required** for every size; a size without it is ignored with a warning.
- **Glyphs** are printable ASCII (codes 32 to 126) only; a frame with anything else is rejected with a warning. Faces are only `o`, `.` and `>` (drawn once, never tiled). Outlines are `/ \ | ( ) _`. Fills are `# = : - ~ % @ + x X * &`. Anything else (`[ ] Y ! ^` and so on) is a prop: drawn once per cell. Spaces are transparent unless the sprite encloses them.
- **Colour.** `hue` is the palette hue (0 slate-blue, 1 cyan, 2 amber, 3 red, 4 blue, 5 green, 6 white, 7 grey), `level` the brightness (14 named characters, 11 extras), `faceHue` an optional hue for the face glyphs (Rook: 6). `accent` is one `{glyph, hue}` drawn in a second hue, a list of them (Rook: the amber scarf `~` and the rose ember `*`/`+`), or `null`; the loader keeps `accent` as the first entry and `accentHues` as the glyph-to-hue map the renderer reads. A blocking entry's `hue:` overrides the sheet's hue (patrons are told apart this way).
- **Height.** `height` is the standing height in world units (default 2.05); `heights` overrides per pose (`crouch` defaults to 0.63 of the height if unlisted).
- **Merging.** Loading a character that already exists keeps everything the new data leaves out, so a file can supply one size, one pose or one field at a time.

### Loader API (`src/game/sprites.js`)

- `loadSprites(data)` registers the sheets and returns an array of warning strings (empty when everything loaded). Called for the built-in placeholders, then for the inlined `docs/design/sprites.json`.
- `spriteFor(who)` returns the character's sheet, or `generic`.
- `spriteSize(sheet, pose, h, w)` picks `{size, frames}` for a projected size (Part 3).
- `spriteFrames(sheet, size, pose)` and `spriteHeight(sheet, pose)` are the lookups behind it.
- In the browser, `document.getElementById('last-light-cinema').cinemaSprites` exposes `load(data)` (loads and redraws, returns warnings), `characters()` and `warnings()`. Paste a sheet into the console to preview it without rebuilding.
- `cinemaAudit().sprites` lists every drawn sprite as `{x0, x1, y0, y1, who, sheet, rows, cols, eyes}`: the screen rectangle with a one-cell margin, which sheet was used, the drawn height and width in cells, and how many `o` glyphs the frame contains.

### Adding a character or a pose

1. Add the character object to `docs/design/sprites.json` with `stand` at all three sizes and `walk` frames at least at `full`; give it `hue`, `level`, `height` and an `accent` or `null`.
2. Name it in blocking: `{x, z, pose: 'stand', who: 'ashe'}` in `caseBlocking()` (`src/game/scenes.js`).
3. `npm run build` and `npm test`. The reel previews every set; the audit's `sprites` shows which sheet each figure used.
4. A new pose is an array under the size that draws it. Give it `heights` if it is not standing height. Poses only at `full` are drawn from `full` at every distance, squeezed as Part 3 describes, so keep far-away poses at `mid` and `small` too.

## Part 3: projection and drawing rules

`actor()` in `src/game/runtime.js`:

1. **Whole cells.** The feet project to `bp`, the head to `ap`. The height is `h = round(bp.y - ap.y)` rows, the feet row `round(bp.y)`, and the width `w = round(h * (ch/cw) * 0.41)` columns, the approved aspect (about 0.705 columns per row). A camera glide grows the sprite in whole-row steps and never moves it by a fraction of a cell. A `lean` shears each row to its own whole-cell left edge. Sprites under one projected row are not drawn.
2. **Sheet choice.** Among the sizes that draw the pose, the largest sheet that is not squeezed below 0.7 in rows or in columns; if none fits, the smallest of them. With the approved aspect this means `full` from about 11 rows up, `mid` from 7 to 10, `small` at 6 and below. The `hero` tier (Rook's is 36 rows, chosen from 26 rows up) is offered only for a pose the hero sheet draws and the full sheet does not (`smoke`): story shots do walk Rook past the camera at 40 to 120 rows (the loft entry, the market aisle), and those keep the approved `full` art stretched, as before, rather than switching to a sheet drawn for the menu. The mid-glide test asserts `full`/`mid`/`small` in the station and the reference frame is unchanged. Stretching is preferred over squeezing because the drawing rules absorb a stretch but a squeeze must drop cells.
3. **Bands.** Sheet row `r` owns screen rows `[round(r * sy), round((r+1) * sy))` and column `c` owns `[round(c * sx), round((c+1) * sx))`. When a band is empty (squeeze), it collapses onto its centre cell and competes for it.
4. **Priority.** Each screen cell is written once per sprite: eyes and noses (`o`, `>`) first, then mouths (`.`), then outlines and props, then fills. A squeezed sheet keeps its eyes and edges; a stretched sheet never repeats a face or a stroke.
5. **Per glyph.** Fills cover their whole band. `|`, `(` and `)` run down the band's centre column. `/` and `\` run diagonally across the band, one glyph per row. `_`, faces and props sit once on the band's centre row (`_` across the band's width). Every band cell not written this way becomes an opaque blank, as does every band of an enclosed space, so the silhouette stays solid at any scale.
6. **Colour.** Face glyphs take `faceHue`, each accent glyph its hue (`accentHues`), everything else the actor's hue; brightness is the sheet's `level`.
7. **Depth.** As before: each row at the interpolated feet-to-head depth minus 0.06, faces minus 0.1, so the whole sprite sits in front of the floor and behind nearer geometry (the office desk, lanterns, the bar).
8. **Walk cycle.** Frames advance with distance travelled: one frame every 0.3 world units, which is about 4 Hz at walking speed. A character that does not move keeps its frame; nothing flickers while standing. The odometer is keyed by cast slot (`rook`, `courier`, `other<i>`) and resets on a set change.
9. **Idle cycle.** A pose other than `walk` that has frames advances on the story clock instead, one frame every 1.5 s (`SPRITE_BEAT`): Rook's `smoke` at `hero` draws, then lowers the hand with the ember dimmed from `*` to `+`. The clock stops with the game, so the cycle holds through pauses and menus and stays on its first frame under reduced motion.

### Limits

- **Close-ups beyond the full sheet.** Between about 17 and 25 rows the full sheet is stretched more than 1.6x. Fills tile (a coat gets wider), outlines and faces stay single, blanks fill the rest. It reads as a solid figure but has no more detail than the 11x11 art. A `hero` sheet takes over only for a pose it alone draws (Rook's `smoke`, from 26 rows); to give a story close-up hero art, give the pose a name of its own on the hero sheet, drawn at `round(rows * 1.72 * 0.41)` columns for the height it is meant to be seen at.
- **Squeezes drop cells.** Poses that exist only at `full` (`crouch`, `stumble`, `reach`, `read`, and the character-specific poses) are squeezed to the projected size at any distance. Below about 8 rows they keep their outline and face but lose shading. Keep such poses close to the camera, or give them `mid` and `small` art.
- **Transparent gaps in the art** show the set through the figure at close-ups. Enclosed spaces are filled; spaces open to the sheet border (between the legs, beside a held pole) are not, by design.
- **Reference budget.** The renderer regression test compares the first frame with the approved reference outside the sprite rectangles (still identical) and allows up to 100 changed cells inside them; the measured values are 50 (phone) and 74 (desktop) with the design sheets, against 6 and 2 for the face-only fix. The old bound of 40 was calibrated for that fix.
- The Character Director's notes in `CHARACTERS.md` describe the old sampler and the `floor(t*5)` walk clock; the sheets themselves need no change for the new rules, and the size thresholds there (full from 9 rows) are two rows lower than what the 0.7 squeeze limit produces (full from 11).
