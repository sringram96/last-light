# TECH-2: engineering ground truth for the full-screen, click-in-picture, consequences pass

Technical Director's findings for the three design proposals (systems, presentation, narrative).
Everything below was measured on the built game (`dist/index.html` at commit 50f6b2c) in headless
Chromium 1194 and in the Node harness. Nothing under `src/`, `tests/` or `docs/` was changed apart
from this file. The prototype and the evidence live in the session scratchpad, referred to as `tech2/`:
`/tmp/claude-0/-home-user-last-light/57a53dce-2b2e-59b7-b8a3-159161fb1515/scratchpad/tech2/`.

- `make-proto.mjs` builds `proto.html` from a copy of dist (resize modes, label rectangles, pointer
  hit-testing, marker pulse, bench and audit hooks); `proto-game.js` is its script for the harness.
- `study.mjs` (frame cost, screenshots, phones), `click.mjs` (pointer prototype), `timing.cjs`
  (clock precision), `pacing.cjs` (caption length against holds), `edges.cjs` (revealed columns),
  `invariance.cjs` (sprite and label invariance), `probe1.cjs` (grid sizes, save reload).
- Results: `study.json`, `study.log`, `click.json`, `click-pad.json`, `pacing.log`; screenshots in `shots/`.

## 0. What the engine is today

- Grid (`resize()` in `src/game/runtime.js`): `W=clamp(floor(width/4.2),72,180)`, `H=round(W*0.39)`
  (0.67 under 480 px), `cw=width/W`, `ch=1.72*cw`, `fx=W/(2*tan 39°)`, `fy=fx/1.72`.
- From 756 px wide the picture is always 180x70 cells, the canvas aspect 1.494:1, the vertical field
  of view 56.9°. A wider window only enlarges the cells, and `main{max-width:1024px}` in
  `scripts/build.mjs` stops that at cw 5.69 px.
- Chrome: at 1440x900 the HTML around the canvas (title bar, status, caption, actions, options,
  case-file summary, paddings) measures 371 px; the page is 1037 px tall, so the current layout
  already scrolls 137 px on a 900 px screen (`study.json`, field `chrome`).
- Loop: `tick()` runs every animation frame, caps `dt` at 0.1 s, and calls `render()` only when 66 ms
  have passed. The picture updates at about 15 fps by design; the clock runs at display rate.
- Reference test (`tests/game.test.cjs`, first test): the reference script and the current script run
  through the same harness at widths 320 and 732, which gives 76x51 and 174x68 cells (not 1024). The
  harness exposes only `canvas.clientWidth`: no height, no `getBoundingClientRect`, no `innerHeight`.
- Bug found on the way, blocking for section 4: `session.js` builds the save validator from
  `Object.keys(caseTitles)` plus the street phases, and `caseTitles` (`case.js`) holds none of the
  registry phases. A checkpoint at any loft, tram, market, substation or interview-room beat fails
  validation and is dropped without a message (`saveStore.save` returns false). Measured with
  `probe1.cjs`: after playing to `tramRide`, `last-light/save/v1` still held `roofConfession`.
  Fix: `[...Object.keys(caseTitles),...Object.keys(phaseDefs),...]` in `session.js`, which is
  concatenated after the sets so `phaseDefs` is complete there. Effort S, needs a regression test.

## 1. Full-screen canvas

### What couples the picture to the fixed aspect

- `H` is derived from `W`; `fy` is derived from `fx`, so the vertical field of view follows the row
  count; the canvas is sized from `clientWidth` alone.
- Nothing else assumes 0.39. `project()` centres on `W/2,H/2`; `look()` (`scenes.js`) is aspect-free,
  a yaw and pitch toward a target that lands at screen centre; the rain is placed in world space
  (`x` in [-11,11], `z` up to camera+37, `y` up to 16) and covers whatever rows exist; `worldLabel`
  and the `HOTEL` column are clipped by `pixel()`; `actor()` uses `ch/cw` (1.72, unchanged) and `fy`
  for the row count; `fitCard()` clamps its font between 7 and 15 px from the canvas width.

### Four resize rules prototyped (`make-proto.mjs`, `window.LL_MODE`; `ch=1.72*cw` throughout)

| mode | rule | 1440x900, 120 px chrome budget | 2560x1440 |
|---|---|---|---|
| fixed (today) | W from width, H=0.39W | 180x70, cw 5.53 (1024 max-width) | same |
| crop | W=180, H from height, fy=fx/1.72 | 180x57, cw 7.84 | 180x54, cw 14.07 |
| letterbox | 180x70, cw=min(width/180, avail/(70*1.72)) | 180x70, cw 6.48, 1166x780 px, 137 px bars | 180x70, cw 10.96, 1973x1320 px, 293 px bars |
| vfov | H=70, cw from height, W=floor(width/cw), fy from H, fx=1.72fy | 217x70, cw 6.48 | 230x70, cw 10.96 |

- Crop is what "W from width, H from height" gives on a 16:9 or 16:10 screen: fewer rows than the
  approved 70 (57 at 1440x900, 54 at 2560x1440, 34 on a landscape phone). Every shot loses six to
  eight rows top and bottom and the vertical FOV shrinks from 56.9° to 47°
  (`shots/1440x900-crop-substation.png`: `[2]` sits on row 6 of 57). Not recommended.
- The vertical field-of-view rule holds `H=70`, derives `fy=H/(2*tan 28.44°)` and `fx=1.72*fy`. At
  180x70 this reproduces today's numbers exactly (fx 111.14, fy 64.62), so the reference frame is
  unchanged by construction; wider windows add columns on both sides at the same cell size.
- Invariance measured (`invariance.cjs`; station, flood, substation, market previews at 180 vs 222
  columns): every sprite rectangle has identical rows, cols and y0; every label keeps its row; x
  shifts by exactly (W-180)/2. Shots therefore still frame the actors without per-aspect vertical
  framing: the look target stays at centre, actors keep their size, the frame gains peripheral set.
- Edge scan of all fourteen previews at 222 columns (`edges.cjs`; blank percentage of the 21 revealed
  columns per side against the adjacent 18 inner columns):

| location | outer-L | inner-L | inner-R | outer-R |
|---|---|---|---|---|
| office, street, loft, station, chase, substation, interview, dawn | 0 | 0 | 0 | 0 |
| flood | 4 | 7 | 4 | 1 |
| rooftop | 21 | 24 | 13 | 46 |
| tram | 18 | 24 | 10 | 1 |
| market | 15 | 8 | 18 | 9 |
| club | 3 | 2 | 0 | 0 |
| undercity | 4 | 3 | 3 | 4 |

  No set exposes a void; the rooftop's right edge is sky by design. Labels clipped: none.

- Screenshots, two each way. Letterbox (pillarboxed 180x70): `shots/1440x900-letterbox-market.png`,
  `1440x900-letterbox-substation.png`, `2560x1440-letterbox-substation.png`,
  `2560x1440-letterbox-street.png`. Fill (vfov): `1440x900-vfov-market.png`,
  `1440x900-vfov-substation.png`, `2560x1440-vfov-substation.png`, `2560x1440-vfov-street.png`.
  Today's layout at the same viewports: `1440x900-fixed-*.png`, `2560x1440-fixed-*.png`.

### Frame cost

Chromium, software rendering on this VM; median / p90 of 60 consecutive `render()` calls, including
the `fillText` pass and `timer()`; dpr 1 unless noted (`study.log`).

| grid | cells | market qte | substation qte | street qte |
|---|---|---|---|---|
| 180x70 today | 12,600 | 23.5 / 25.5 ms | 26.7 / 30.6 | 26.8 / 29.5 |
| 180x57 crop | 10,260 | 22.0 / 25.0 | 25.0 / 29.8 | 24.1 / 25.4 |
| 217x70 vfov, 1440x900 | 15,190 | 25.5 / 28.5 | 30.8 / 33.1 | 29.9 / 32.1 |
| 230x70 vfov, 2560x1440 | 16,100 | 27.8 / 30.2 | 33.4 / 38.3 | 33.7 / 37.6 |
| 230x70 vfov, dpr 2 | 16,100 | 38.0 / 51.1 | | |
| 260x70 (cap probe) | 18,200 | 26.9 / 29.0 | 41.8 / 63.0 | 36.0 / 57.8 |

- The budget is the 66 ms frame gate in `tick()`, not 16 ms, so up to about 240 columns is safe
  here; the rasteriser scales with covered cells, the text pass with drawn glyphs, dpr 2 adds 35%.
- Cap `W` at 240 and pillarbox beyond it (a 3440x1440 ultrawide would otherwise ask for 309 columns
  and, by the 260 probe, land at the gate). A GPU-backed desktop browser is faster than this VM.
- Cells stay legible wherever the fill applies: 6.5 px at 1440x900, 11 px at 2560x1440.

### Phones (`study.json`, `phone`)

| viewport | mode | grid | canvas px | note |
|---|---|---|---|---|
| 375x812 | fixed | 84x56 | 355x407 | today, no scroll |
| 375x812 | crop (fill height) | 82x95 | 347x691 | more foreground road under the actors, `shots/375x812-crop-street.png` |
| 812x375 | fixed | 180x70 | 784x524 | scrolls 520 px |
| 812x375 | crop | 180x34 | 784x255 | `[1]` on row 11, `shots/812x375-crop-street.png` |
| 812x375 | letterbox | 180x70 | 381x255 | cw 2.1 px, unreadable |

Recommendation: portrait fills up to a maximum of 70 rows (letterbox past that); landscape keeps the
scrolling layout with the chrome folded into an overlay; a cell width under 3.6 px falls back to the
fixed rule.

### Mechanism (recommended)

1. Wrap the canvas in a `.lc-stage` element that flexes into the space left after the chrome.
   `resize()` reads `stage.clientWidth/clientHeight` when the stage exists, otherwise today's rule
   from `canvas.clientWidth`. The harness has no stage, so the reference test is untouched
   (174x68 and 76x51 either way).
2. Desktop rule: `H=70; cw=clamp(availH/(H*1.72), 3.6, width/180); W=min(240, floor(width/cw));
   fy=H/(2*tan 28.44°); fx=1.72*fy`. Explicit `canvas.style.width/height`, `margin:auto`; the bars
   are the page background.
3. Observe the stage, not the canvas. Measured trap: once `resize()` sets an explicit canvas width, a
   `ResizeObserver` on the canvas never fires again for container changes; my first study run kept
   180x70 in every mode for exactly this reason.
4. `main{max-width}` becomes `none` in fill mode; the chrome folds to a 28 px title strip and a
   caption-plus-actions band of about 90 px, which is the 120 px budget used above.
5. Harness gains a `height` option (stage size); `cinemaAudit()` gains `grid:{W,H,cw,ch,fx,fy}`.

## 2. Clicking in the picture

Labels are drawn by `worldLabel()` in `renderer.js` into the cell grid with no record of where. The
pattern for sprites exists already: `spriteRects` filled in `actor()`, reset in `render()`, exposed
through `cinemaAudit().sprites`. The prototype (`make-proto.mjs`, patches 2 to 4) follows it:

- `worldLabel` pushes `{text,x0,x1,y0,y1,z}` to `labelRects` when `text` matches `/^\[\d\]$/` and the
  row is on screen; `render()` resets it next to `spriteRects`; `cinemaAudit().labels` exposes it.
  Markers behind geometry are still recorded (the depth test lives in `pixel()`): the player aims at
  the thing, not at the glyphs.
- Hit test `markerAt(clientX,clientY)`: `rect=canvas.getBoundingClientRect()`,
  `scale=(canvas.width/dpr)/rect.width` (1 unless CSS scales the canvas),
  `x=(clientX-rect.left)*scale/cw`, `y=(clientY-rect.top)*scale/ch`, then the nearest marker whose
  box padded by `22/cw` columns and `22/ch` rows contains the point.
- Padding 22 px on every side makes each target at least 44 px in both dimensions: 63x55 px at
  cw 6.48, 57x51 px at the phone's 4.23.
- `pointerdown` on the canvas: ignored when `session.menu`, `state.paused`, `!isQte()` or no markers;
  otherwise `keys[n-1]()`, the action array `button()` fills for the prompt. Keyboard already does
  `keys[qteKeys[e.key]]()`, so mouse, touch and keys converge on the same `choose`, `promptMove`,
  `rescue`, `clubChoice`, `chaseChoice` or `tunnelChoice`. `pointermove` sets `cursor:pointer` over a
  marker; `touch-action:pan-y` on the canvas already lets a vertical swipe scroll without a tap.
- Pulse without new materials: `worldLabel` alternates the palette level of marker glyphs on
  `floor(state.t*3)%2` (off under reduced motion). Amber level 13 vs 19 is rgb(255,229,113) vs
  (255,255,144): too subtle at 6 px cells (`shots/pulse-a.png`, `pulse-b.png`). Use hue 2 vs hue 6
  (amber vs white) or level 10 vs 19 (255,196,97 vs 255,255,144), or swap `[2]` for `>2<`; each is
  one expression in `worldLabel`. Whatever pair is chosen must not touch level 16 in the harness's
  reduced-motion runs, or the reference cells outside the sprites would differ.

Evidence (`click.json`, `click-pad.json`, `shots/click-pump-before-a.png`, `click-pump-after.png`),
1440x900 vfov, cw 6.48, ch 11.14, pump prompt with the camera settled:

| click | marker `[2]` | result |
|---|---|---|
| centre of the label (cells 126-128, row 6) | `rescue='pull'`, phase `pumpResult`, reaction 2.58 s | hit |
| 18 px right of the last cell | same, reaction 1.97 s | hit (inside the pad) |
| 40 px right of the last cell | `rescue` unchanged, still `pumpQte` | no hit |
| centre, 300 ms after entry while the shot still eases | `rescue='pull'`, reaction 0.47 s | hit |

The first study run missed because it clicked at a position read 1.5 s earlier: `pumpQte` eases its
shot over 1.5 s from wherever the camera was, so the marker had moved by more than the pad. The
listener saw the click at the right coordinates (`pd` in `study.log`); `markerAt` found nothing near
them. Rects must always come from the frame on screen, never cached by the UI layer.

Harness: give the fake canvas `getBoundingClientRect()` returning `{left:0,top:0,width:W*cw,
height:H*ch}` and a way to dispatch `pointerdown` with `clientX/clientY`; a test can then click `[2]`
at cell coordinates read from `audit().labels`.

## 3. Timing precision

Measured with a harness copy that steps at any interval (`timing.cjs`) and in Chromium:

| probe | result |
|---|---|
| resolution of `state.event` and of `react()` | equals the frame period: reaction 0.5000 s at 100 ms and 4 ms steps, 0.5010 s at 16.7 ms |
| 300 ms stall during a prompt | prompt advanced by 0.100 s (the cap hands the player 200 ms) |
| miss after a 9 s window, 16.7 ms steps | fires 1.3 ms after the deadline |
| miss after a 9 s window, 100 ms steps | fires 100 ms after (ninety additions of 0.1 do not reach 9.0; the tests' `run(9.4)` absorbs this) |
| hidden 1 s, then a 400 ms first frame | event moved 0.000 s |
| paused 600 ms, then a 250 ms first frame | event moved 0.000 s |
| key repeat | ignored; key `2` reaches `chaseBank` with `firstMove='dodge'` |
| Chromium pointerdown 2.556 s after entry (wall clock) | `event` 2.583 s (evaluate round trip plus one frame) |

Conclusions:

- Windows of 1.5 to 2.5 s work on the existing accumulator; the deadline lands within one display
  frame. `caseDuration()` clamps registered windows to 5..9; that clamp moves to 1.5..9. The 2 s
  windup hold stays.
- Reliable 50 ms measurement needs one change in `react()`:
  `reaction = state.event + (e.timeStamp - lastTime)/1000` (Event.timeStamp and the rAF timestamp
  share the time origin), falling back to `state.event` when there is no `timeStamp` (harness).
  The prompt handlers (`choose`, `promptMove`, `rescue`, ...) receive the event, or the document
  listener stamps a module variable before calling `keys[i]()`.
- Keep the deadline on the accumulator: pauses, menus and background tabs freeze it for free
  (`lastTime=0` after `visibilitychange`, the pause button and `openMenu()`), and a wall-clock
  deadline would have to re-implement all three.
- Lower the cap to 0.05 s during prompts so a hitch hands out at most 50 ms per frame.
- `timer()` shows one decimal; two decimals when the window is under 3 s.
- Harness: `run(seconds, stepMs=100)`; the `callback(clock)` loop already accepts any step, and
  fixed steps keep `state.event` exact, so a short-window test is deterministic at 16.7 ms.

## 4. Lives, deaths and game over

Checkpoint and records (`src/game/save-store.js`):

- `lives` joins `numbers` as `[0,3]`, integer-checked with `gap` and `rewinds`, default 3 when absent
  (the `rewinds` pattern), and `reset()` in `runtime.js` sets `lives:3`. Existing saves migrate by
  the default; no envelope version bump, the key is additive and `clean()` already defaults missing
  keys. The save-store test's malformed list gains `lives:5` and `lives:1.5`.
- Records: `readRecords()` adds `deaths: ids(raw.deaths||[])` and `cold` (integer, 0 default);
  `record()` accepts `{ending, discoveries, deaths, cold}`. Old records read back with empty lists;
  the "future schema rejected" test stays valid because the version stays 1.
- Deaths seen is never stored in the checkpoint. It is derived from the miss fields
  (`choice==='missed'`, `rescue==='late'`, `market==='late'`, ...) the way `reflexes()` already does,
  and written to records at death time and at case end.

Registry and flow (`registry.js`, `case.js`, `runtime.js`):

- New phase kind `death`: `{kind:'death', duration, caption, stinger, back, reset, id}`; a prompt
  def names it with `death:'marketDeath'`.
- `promptMiss()` becomes `react('late'); d.miss(); enter(d.death||nextOf(d))`.
- `caseAdvance()`: `d.kind==='death' && done(d.duration)`: if `state.lives>0` then `lives--`,
  `d.reset()`, `enter(d.back)`; else `enter('gameOver')`.
- `sceneFor()` returns the current `sceneName` for a set-less phase (`set:'*'`), needed by
  `gameOver` and any death phase shared between sets.
- `gameOver` is a registered `quiet` phase: `presentEnter` shows a `CASE COLD` card, a `recordCase`
  variant writes `{cold:1, deaths:[...]}`, the button returns to the menu and `saveStore.clear()`
  runs so `[CONTINUE CASE]` disappears; records survive by design.
- Hand-written prompts (`qte`, `pumpQte`, `clubQte`, `chaseQteA/B`, `tunnelQte`) route their `late`
  through `choose('missed')`, `rescue('late')`, `clubChoice('late')`, `chaseChoice('late')`,
  `tunnelChoice('late')`. Cheapest hook: the `missBeats` table in `runtime.js` gains a `death` id per
  entry and those five callers `enter()` it when present.
- `missBeat()`, `canRewind()` and `rewind()` keep the rewind path; when the current phase is a death,
  `canRewind()` reads `state.lives` instead of `state.rewinds`, and `rewind()` decrements the one it
  read. The `flawless` discovery (`rewinds===3`) gains `&& state.lives===3` if the proposals fold
  rewinds into lives.
- `phaseOrder` in `presentation.js` gains the death and game-over ids so `reached()` stays monotonic.
- The death phases are registry phases, so the validator fix in section 0 is a precondition.

## 5. Text pacing hooks

Where a hold is decided today:

- Registered `duration` per `cutscene` and `result`, consumed by `done(s)` in `caseAdvance()`
  (`reduce && s>2` collapses to 1 s).
- Literal seconds for the hand-written phases in `caseAdvance()`.
- The street phases in `tick()`: `watch` 8, `follow` 8, `danger` 2, `result` 4, `loftTurn` 4,
  `arrival` 5.
- Windups 2 s and observes 8 s in both places; the exit beat 1.4 s in `tick()`.
- Typing at 70 chars/s in `presentTick()`; prompt, windup and menu captions appear at once
  (`presentUI`).

Measured along the long route at real durations, 1024 wide (`pacing.log`, `pacing.cjs`). Hold is
seconds in the phase including any exit beat; "after type" is hold minus typing minus exit beat;
"needed" is words/4 (240 wpm).

| phase | chars | words | typing s | hold | exit beat | after type | needed |
|---|---|---|---|---|---|---|---|
| officeEntry | 104 | 19 | 1.5 | 8.2 | 0 | 6.7 | 4.8 |
| officeFile | 163 | 27 | 2.3 | 5.1 | 0 | 2.8 | 6.8 |
| officeBoard | 163 | 26 | 2.3 | 5.1 | 0 | 2.8 | 6.5 |
| officeWindow | 140 | 26 | 2.0 | 7.5 | 1.4 | 4.1 | 6.5 |
| follow | 143 | 27 | 2.0 | 8.1 | 0 | 6.1 | 6.8 |
| danger (windup) | 103 | 18 | instant | 2.1 | 0 | 2.1 | 4.5 |
| result | 74 | 14 | 1.1 | 3.9 | 0 | 2.8 | 3.5 |
| arrival | 57 | 10 | 0.8 | 6.5 | 1.4 | 4.3 | 2.5 |
| stationEntry | 88 | 14 | 1.3 | 7.1 | 0 | 5.8 | 3.5 |
| stationListen | 104 | 17 | 1.5 | 8.1 | 0 | 6.6 | 4.3 |
| pumpEntry | 111 | 21 | 1.6 | 6.1 | 0 | 4.5 | 5.3 |
| pumpDanger (windup) | 115 | 20 | instant | 2.1 | 0 | 2.1 | 5.0 |
| pumpResult | 80 | 14 | 1.1 | 3.9 | 0 | 2.8 | 3.5 |
| roofEntry | 141 | 24 | 2.0 | 8.1 | 0 | 6.1 | 6.0 |
| roofListen | 108 | 18 | 1.5 | 8.1 | 0 | 6.6 | 4.5 |
| tramEntry | 170 | 33 | 2.4 | 8.1 | 0 | 5.7 | 8.3 |
| tramWatch | 115 | 21 | 1.6 | 8.1 | 0 | 6.5 | 5.3 |
| tramArrive | 144 | 26 | 2.1 | 6.5 | 1.4 | 3.0 | 6.5 |
| marketEntry | 180 | 34 | 2.6 | 8.1 | 0 | 5.5 | 8.5 |
| marketDanger (windup) | 146 | 28 | instant | 2.1 | 0 | 2.1 | 7.0 |
| marketResult | 121 | 23 | 1.7 | 5.3 | 1.4 | 2.2 | 5.8 |
| clubEntry | 133 | 26 | 1.9 | 8.1 | 0 | 6.2 | 6.5 |
| clubFace (windup) | 94 | 19 | instant | 2.1 | 0 | 2.1 | 4.8 |
| clubResult | 98 | 19 | 1.4 | 5.3 | 1.4 | 2.5 | 4.8 |
| chaseEntry | 160 | 29 | 2.3 | 6.2 | 0 | 3.9 | 7.3 |
| chaseBank | 74 | 12 | 1.1 | 6.1 | 0 | 5.0 | 3.0 |
| tunnelEntry | 148 | 27 | 2.1 | 6.2 | 0 | 4.1 | 6.8 |
| tunnelFinish | 155 | 28 | 2.2 | 7.4 | 1.4 | 3.8 | 7.0 |
| subEntry | 244 | 48 | 3.5 | 8.1 | 0 | 4.6 | 12.0 |
| subManifest | 193 | 34 | 2.8 | 6.1 | 0 | 3.3 | 8.5 |
| subDanger (windup) | 155 | 29 | instant | 2.1 | 0 | 2.1 | 7.3 |
| subResult | 192 | 37 | 2.7 | 5.0 | 0 | 2.3 | 9.3 |
| subDawn | 128 | 25 | 1.8 | 6.5 | 1.4 | 3.3 | 6.3 |
| roomEntry | 147 | 29 | 2.1 | 7.1 | 0 | 5.0 | 7.3 |
| canalEntry | 78 | 15 | 1.1 | 7.1 | 0 | 6.0 | 3.8 |

- 19 of the 32 auto-advancing beats hold for less time than 240 wpm needs, after typing; every
  windup shows 18 to 29 words for 2 s (720 to 870 wpm).
- Exit beats type their connecting line (45 to 86 chars) inside the 1.4 s glide: the
  `roofConfession>tram` line alone needs 1.2 s of typing; the player reads it during the dissolve.
- Quiet beats wait for a button and are fine.

Cheapest mechanism:

- One function `holdFor(seconds)` returning `max(seconds, chars/70 + words/3.5 + 0.4)` over
  `captionFull` (already kept by `presentation.js`), applied inside `done()` in `case.js` and to the
  six comparisons in `tick()`. Windups keep 2 s (their captions are instant already). Exit beats show
  the connecting line at once (add `transit` to the instant list in `presentUI`) or stretch `1.4` to
  `holdFor(1.4)` in `tick()`.
- Reduced motion: typing is instant, so the rule reduces to `words/3.5+0.4`; the `s>2 → 1` collapse
  must apply after `holdFor`, or the reduced-motion tests keep their 1.3 s steps only for short
  captions. Either way the route tests' `run()` values change.
- Camera eases and blocking spans use their own constants and clamp at 1, so a longer hold only rests
  the shot at its end; no set code changes.
- Press to continue: a `wait:true` flag on a cutscene def. `caseAdvance()` skips auto-advance for it;
  `caseUI()` adds `[CONTINUE]`, disabled until `captionShown>=captionFull.length` (`presentTick`
  calls `ui()` once when typing completes). Pause already disables buttons (`button()` reads
  `state.paused`); menus rebuild the UI; the button's `enter()` takes the normal exit-beat path;
  reduced motion types instantly, so the button is live at once. Map Enter and Space on `document`
  the way `qteKeys` are, only while a `wait` cutscene is showing.

## 6. Fullscreen API and layout plumbing

- Entry: `root.requestFullscreen()` from a `[FULL SCREEN]` button (a user gesture is required);
  `fullscreenchange` toggles a `data-fill` attribute on the root; the stage observer from section 1
  then resizes. Esc exits through the same event. Prompt keys keep working because they are read on
  `document`.
- CSS in fill mode: `#last-light-cinema{display:flex;flex-direction:column;height:100dvh}`,
  `.lc-stage{flex:1;min-height:0}`, chrome folded to about 120 px. `100dvh` avoids the mobile
  address-bar jump; `100svh` for the first paint.
- iOS: Safari on iPhone has no `Element.requestFullscreen` for anything but video (iPad has it).
  Fallback is the `100dvh` layout plus `apple-mobile-web-app-capable`, so a home-screen launch is
  chromeless. `screen.orientation.lock('landscape')` works only inside fullscreen on Chrome for
  Android and rejects on iOS; use a CSS rotate prompt rather than relying on it.
- Resize path: the stage's `ResizeObserver` fires on fullscreen entry, window resizes and
  orientation changes; `resize()` recomputes the grid and re-renders as today; a running transition
  or prompt is unaffected because only `W,H,cw,ch,fx,fy` and the buffers change.
- Harness: no layout and no `requestFullscreen`; guard `root.requestFullscreen?.()` and the stage
  lookup, and every fill branch is skipped, so the existing tests run the fixed rule unchanged.

## Per-file change plan

| file | change | effort | risk |
|---|---|---|---|
| `src/game/runtime.js` `resize()` | stage-based fill rule, vfov `fy`, W cap 240, explicit canvas size, phone limits | M | M: the one place the approved frame can move; guarded by the reference test and the invariance test |
| `src/ui/shell.html`, `scripts/build.mjs` | `.lc-stage` wrapper, flex column under `data-fill`, `main{max-width:none}` in fill, `[FULL SCREEN]` button, meta tags | M | L |
| `src/engine/renderer.js` `worldLabel`, `render()` | `labelRects`, marker pulse expression | S | L: additive; keep level 16 out of the pulse pair |
| `src/game/runtime.js` input | `markerAt`, `pointerdown`/`pointermove` on the canvas, sub-frame reaction stamp, prompt `dt` cap 0.05, two-decimal timer | S | L |
| `src/game/case.js` | `caseDuration` clamp 1.5..9, `promptMiss` death routing, `death` kind in `caseAdvance`, `holdFor()` in `done()`, `wait` cutscenes, `gameOver` | M | M: touches every timed beat; the route tests cover it |
| `src/game/runtime.js` `tick()`, `missBeats`, `rewind`, `reset` | `holdFor` on the street holds, `death` ids in the miss table, lives in `canRewind`, `lives:3` | S | M |
| `src/game/registry.js`, `src/game/scenes.js` `sceneFor` | document `death` and `wait`; set-less phases | S | L |
| `src/game/sets/*.js` | one death phase per prompt (five registered, six hand-written through `missBeats`) with caption, stinger, `back`, `reset` | M (content) | L |
| `src/game/save-store.js` | `lives` number, `deaths`/`cold` in records, registry phases in the validator (section 0) | S | L: additive, tolerant reader |
| `src/game/session.js` | validator list, clear on game over | S | L |
| `src/game/presentation.js` | `phaseOrder` additions, `CASE COLD` card, instant transit captions, records lines for deaths, `[CONTINUE]` enabling | S | L |
| `tests/harness.cjs` | `height` option, `run(seconds, stepMs)`, fake `getBoundingClientRect` and pointer dispatch, `labels` in audit | S | L |

About three M and eight S changes; no new packages, no renderer replacement.

## Test plan

Existing tests that change:

- None in behaviour from the fill rule alone: without a stage the harness gives 174x68 and 76x51 as
  today, so the reference first-frame test passes unchanged.
- "a missed move can be rewound three times, or carried" and "timed misses, pausing and declining
  pursuit": misses enter a death phase before the result, so their `run()` steps and expected `card`
  values move.
- The long route and records tests: `records.discoveries` if `flawless` includes lives; every
  `run()` value that steps a cutscene once `holdFor` lengthens holds.
- `save-store.test.cjs`: malformed list gains `lives:5` and `lives:1.5`; default assertion `lives===3`.

New tests, one per mechanism:

1. Fill grid: with `height`, `resize` yields `H=70`, `fx=111.14`, `fy=64.62` at 180 and at 222
   columns, `W<=240`, and sprite and label rectangles are identical up to the column shift.
2. Reference frame under fill: the first-frame comparison at width 732 with a stage height that
   reproduces 174x68, so the fill path is covered by the same approved reference.
3. Registry-phase checkpoints load (section 0): save at `tramRide`, reload, `[CONTINUE CASE]` resumes
   at `tramRide`.
4. Label hit test: at the pump prompt `audit().labels` lists `[1]` and `[2]`; a pointerdown at the
   centre of `[2]` and at 18 px outside it choose `pull`; 40 px outside does nothing; nothing happens
   while paused, in the menu or outside a prompt; key `2` and the click reach the same state.
5. Short windows: a 2 s prompt stepped at 16.7 ms misses within one frame of the deadline; a keydown
   whose `timeStamp` is 8 ms after the last frame records `event+0.008`; hidden, pause and menu
   still freeze it.
6. Lives: a miss enters the death phase, `lives` drops to 2 and the windup re-enters with the miss
   field reset; at 0 lives `gameOver` follows, records gain `deaths` and `cold`, the save is cleared,
   records survive a new case, and a preview never writes them.
7. Pacing: a cutscene with a 48-word caption holds at least `words/3.5+chars/70+0.4` s; a `wait`
   cutscene does not advance on its own, offers `[CONTINUE]` only after typing, and the button is
   disabled while paused.
8. Save-store: `lives` bounds and default, `deaths` id validation, tolerant read of records that
   lack the new keys.
