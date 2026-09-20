# Presentation review: the whole screen, the text, and the picture you can touch

Presentation and UX Director, after the first shipped case. Scope: the owner's first three sentences ("the whole
screen is the game", "the text appears fast", "I should click something on the screen"). Difficulty and consequences
belong to the Game Director and are not treated here; where the two meet (the prompt input contract) this document
describes only what the player sees and touches.

Method: `npm run build`, then Chromium (Playwright, fake clock) at 1440x900, 1024x768, 375x812 and 812x375 for the
menu, a cutscene, a prompt and the ending; the long route played end to end at 1024 and 375 (no console errors); and
a harness run over all 72 phases under five state configurations measuring every caption. Appendices A to C hold the
pacing table, the transition lines and the layout metrics.

## 1. Diagnosis

The picture is right. Everything around it is a web page, and the owner is reacting to the web page.

**The game does not fit the screen it is played on.** The shell is a flow document: a 32 px header, the canvas at
100% of a 1024 px `main`, then card, status, caption, buttons, options, case file, each stacked below the last.

- 1440x900: `main` is capped at 1024 px, so the picture is 996x666 with 222 px of empty margin each side, and the
  only button on the menu ([NEW CASE]) sits at y=891 in a 900 px viewport: below the fold on a desktop monitor.
- 1024x768: the picture alone is 666 px tall. With the HUD the page is 948 px at a prompt and 1104 px at the
  ending. The player either scrolls (and loses the top 124 to 169 px of the picture, where `[1]` sits in the
  street prompt) or does not scroll (and cannot see the choices). Playwright had to scroll to click every button.
- 375x812 (phone): it fits, but the picture is 407 px of an 812 px screen (50%), the header wraps to three lines
  ("REFLEX 2/2 // REWIND x3 // 05a / NIGHT MARKET // REACH THE FILAMENT"), and the text is 11 px.
- 812x375 (phone landscape): the picture is 524 px tall in a 375 px viewport. At the street prompt the visible
  part is the bottom third of the picture plus the buttons; both `[1]` and `[2]` are off screen.
- Cards reflow the page. A chapter card or GET READY is a 79 px `<pre>` inserted between the picture and the
  caption; at 1024 the caption jumps from y=507 to y=586 when a card appears and back when it clears, under the
  player's eye and, on a phone, under the thumb that was about to press a choice.

**The text is not fast, it is cut off.** Typing runs at 70 characters per second (about 840 words per minute), and
the beat ends on the picture's clock regardless of the text. Measured against 200 words per minute reading:

- 32 of 72 phases end before typing plus reading is done (Appendix A). Every timed cutscene longer than 100
  characters is one of them. `subEntry` is 48 words in an 8 s beat (needs 18 s); `officeFile` is 27 words in 5 s;
  `marketResult` 33 words in 4 s; `clubEntry` 39 words in 8 s.
- All five windups show 18 to 29 words for 2 s (they need 5 to 9 s to read) and then cut to the prompt.
- Every transition line is unreadable. The exit beat is 1.4 s; the line types for 0.6 to 1.4 s of that and is
  replaced by the next set's caption at 1.4 s. Measured: "Three knocks, or a shoulder. Either way, the hatch
  gives." had 49 of 57 characters typed at 0.7 s and was gone at 1.4 s. The AGENTS.md rule that every transition
  has a connecting line is met in code and not on screen.
- Results without a rewind offer hold 4 to 6 s for 15 to 37 words. Prompts show 13 to 29 words instantly for a
  5 to 9 s window; the player should be watching the picture, not reading 29 words.
- The OBSERVING / 8s beats are the one place the text fits: 17 to 21 words, typed in 1.5 s, read by 6.5 to 8 s.
  Tight (`tramWatch` at 7.9 s) but honest.

**The picture already points at the move and the player cannot touch it.** During a prompt the `[1]` and `[2]`
markers are world labels drawn into the grid at the courier's head, the falling book, the inlet wheel, the gap in
the stalls, the breaker. They are 3 cells wide: 17x10 px at 1440, 15x8 px at 1024, 13x7 px on a phone. Nothing
listens to a pointer on the canvas (`touch-action:pan-y` is there so the page can scroll over it). The only way to
act is the 44 px text buttons below, which on the phone are 80 to 140 px from the marker they name, and on a
landscape phone are on a different screen from it. That is the gap between us and Dragon's Lair the owner is
feeling: in the arcade the move is a direction at the thing on screen; here it is a menu item under the screen.

## 2. Full-screen layout

Principle, unchanged: the picture is never covered. What changes: the picture is fitted to the viewport and the HUD
is fitted to what is left, with fixed heights so nothing ever moves.

### Stage and fit

`#last-light-cinema` becomes a fixed stage: `position:fixed; inset:0; height:100dvh` (fallback `100vh`),
`padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`,
background `#03070b`, no page scroll (`overscroll-behavior:none`). `build.mjs` adds `viewport-fit=cover` to the
viewport meta and drops `main{max-width:1024px}`.

Two layouts, chosen by the viewport, both CSS grid:

- **Stacked** (everything except phone landscape): rows `top | picture 1fr | hud`.
- **Side** (viewport height <= 500 px and aspect >= 1.6, i.e. phone landscape): columns `picture 1fr | hud 280px`
  with the top strip spanning both.

A new `layout()` in runtime.js runs on a `ResizeObserver` of the stage (not of the canvas, which would loop),
`orientationchange` and `fullscreenchange`. It computes the picture's CSS width and hands everything else to the
existing `resize()`, which is unchanged: `W=clamp(floor(width/4.2),72,180)`, `H=round(W*(width<480?.67:.39))`,
`cw=width/W`, `ch=cw*1.72`. The grid therefore stays a pure function of the picture's CSS width, exactly as the
reference test requires (W=76 at 320, W=174 at 732, W=180 from 756 up).

Fit: the picture's pixel aspect is fixed by the grid, `W : 0.39*W*1.72 = 1 : 0.671` landscape and `1 : 1.152`
portrait. `layout()` takes the picture cell (the 1fr area), and sets `canvas.style.width = min(areaW, areaH/0.671)`
(or `/1.152` when the result would be under 480 px). The remainder is letterbox or pillarbox in the stage
background, which is the scene's own black, so no edge shows. Centre the canvas in its area. Never crop rows and
never stretch: the camera grammar is composed for these two aspects.

Resulting pictures (top strip, card band, status, two caption lines, actions, utility line deducted):

| viewport | layout | picture px | grid | cell px | note |
|---|---|---|---|---|---|
| 1440x900 | stacked | 1041x697 | 180x70 | 5.8x10.0 | 200 px pillars, whole HUD visible |
| 1024x768 | stacked | 844x565 | 180x70 | 4.7x8.1 | today it is 996x666 and does not fit; cell size is what the reference test approves at 732 wide |
| 375x812 | stacked | 375x435 | 89x60 | 4.2x7.3 | 90 px spare goes to a third caption line and 56 px choice buttons |
| 812x375 | side | 523x351 | 124x48 | 4.2x7.3 | HUD column 245 px after the 44 px notch inset |

### HUD

Top strip, 28 px desktop, 24 px phone, one line, never wraps: `.lc-title` left (phone: the cyan dot only);
`.lc-chapter` centre ("05a / NIGHT MARKET  ·  REACH THE FILAMENT"; phone drops the chapter number); `.lc-score`
right ("REFLEX 2/2 · REWIND x3"; phone "2/2 · x3"). Amber, letter-spaced, as today.

Bottom strip (stacked) or column (side), fixed heights so nothing reflows:

1. `.lc-card-slot`: a permanently reserved band, height = 5 lines of the block font at the fitted size (47 px
   desktop, 37 px phone). `.lc-card` lives inside it and keeps its `hidden` attribute and tone classes; when hidden
   the slot is empty dark. Cards therefore land where the eye already is, between picture and caption, and never
   push anything. `fitCard()` fits the font to the slot width as now, capped so five rows fit the slot.
2. `.lc-status`: 18 px, `.lc-phase` left and `.lc-timer` right, unchanged.
3. `.lc-caption`: exactly 2 lines desktop (38 px), 3 lines phone (54 px), 4 in the side column; `overflow:hidden`.
   The chunking rule in section 3 guarantees a caption fits its lines, so nothing is ever clipped.
4. `.lc-actions`: one row, 48 px desktop; on phone the two prompt moves are a two-column full-width row of 56 px
   buttons, quiet choices stack at 48 px each (max three, so at most 144 px, taken from the picture area on the
   phone only when a three-button quiet beat is live, which is never during a prompt).
5. `.lc-options`: 24 px utility line: `[MENU]  [CASE FILE]  [FULL SCREEN]`. TIMED, MONO, SOUND and PAUSE move into
   the menu screen (`menuUI()`), with the same class names, so the tests' `.lc-timing`, `.lc-mono`, `.lc-sound`,
   `.lc-pause` clicks still resolve. PAUSE stays reachable by key (Escape or P) and by the menu.

Stacked HUD total: 47+18+38+48+24 = 175 px desktop, 37+18+54+56+24 = 189 px phone.

The case file, records and scene reel move into `.lc-drawer`, a panel toggled by [CASE FILE] (or the menu). The
drawer is a pause screen: it replaces the picture area in the grid (`canvas` gets `hidden`, the existing
`IntersectionObserver` then stops the clock and `timer()` already handles the paused text), scrolls internally, and
returns to the picture on close. The picture is never half covered by the board, and the AGENTS.md rule that menus
stop deadlines holds by construction. The three `<details>` keep their classes (`.lc-journal`, `.lc-records-box`,
`.lc-reel`, `.lc-reel-actions`) and their `hidden` logic in `ui()`/`presentUI()`.

Safe zone: the whole canvas rect. No DOM element, not even a transparent one, is positioned over it. For the picture
itself, ART_DIRECTION gains a title-safe margin: names and `[1]`/`[2]` markers are placed so their cells fall at
least 2 columns in from the sides and 1 row from top and bottom of the grid (a camera and label-placement rule, not
a renderer change; `worldLabel()` already clips at the edge, which is how a marker can currently be lost).

### Fullscreen API

- `[FULL SCREEN]` in the utility line and the `f` key call `root.requestFullscreen({navigationUI:'hide'})`; the
  button reads `[EXIT FULL SCREEN]` while `document.fullscreenElement` is set. Hidden when
  `!document.fullscreenEnabled`.
- iOS Safari on iPhone has no element fullscreen. The stage already fills the viewport; add
  `<meta name="apple-mobile-web-app-capable" content="yes">` so Add to Home Screen runs without browser chrome, and
  accept the address bar otherwise (100dvh follows it). Do not call `screen.orientation.lock`; it only works inside
  a fullscreen element on Android and rejects elsewhere.
- Entering or leaving fullscreen is a resize, not a pause. Reduced-motion players get the same layout.

### DOM (class names the runtime, harness and tests rely on, all kept)

```
<div id="last-light-cinema" class="lc-stage lc-stacked" tabindex="-1">
  <div class="lc-top"><span class="lc-title">..</span><span class="lc-chapter">..</span><span class="lc-small"><span class="lc-score"></span></span></div>
  <div class="lc-picture"><canvas role="img"></canvas></div>
  <div class="lc-hud">
    <div class="lc-card-slot"><pre class="lc-card" aria-hidden="true" hidden></pre></div>
    <div class="lc-status"><span class="lc-phase"></span><span class="lc-timer" aria-hidden="true"></span></div>
    <p class="lc-said lc-sr" aria-live="polite"></p>
    <p class="lc-caption" aria-hidden="true"></p><p class="lc-outcome" hidden></p>
    <div class="lc-actions" role="group" aria-label="Story choices"></div>
    <div class="lc-options"><button class="lc-menu">[MENU]</button><button class="lc-file">[CASE FILE]</button><button class="lc-full">[FULL SCREEN]</button>
      <button class="lc-timing" hidden></button><button class="lc-mono" hidden></button><button class="lc-sound" hidden></button><button class="lc-pause" hidden></button></div>
  </div>
  <div class="lc-drawer" hidden>
    <details class="lc-journal">.. .lc-route .lc-board .lc-clues ..</details>
    <details class="lc-records-box">.. .lc-records ..</details>
    <details class="lc-reel">.. .lc-reel-actions ..</details>
  </div>
</div>
```

Kept and queried by code or tests: `canvas`, `.lc-top`, `.lc-title`, `.lc-chapter`, `.lc-small`, `.lc-score`,
`.lc-card` (+ `lc-card--title|chapter|hit|miss|warn`), `.lc-status`, `.lc-phase`, `.lc-timer`, `.lc-urgent`,
`.lc-said`, `.lc-sr`, `.lc-caption`, `.lc-typed`, `.lc-veil`, `.lc-outcome`, `.lc-actions`, `.lc-options`,
`.lc-menu`, `.lc-timing`, `.lc-mono`, `.lc-sound`, `.lc-pause`, `.lc-journal`, `.lc-route`, `.lc-board`,
`.lc-clues`, `.lc-label`, `.lc-records-box`, `.lc-records`, `.lc-reel`, `.lc-reel-actions`, `cursor-interaction`.
New: `.lc-stage`, `.lc-stacked`/`.lc-side`, `.lc-picture`, `.lc-hud`, `.lc-card-slot`, `.lc-file`, `.lc-full`,
`.lc-drawer`, `.lc-hit` (the pulse state of a marker, section 4). The harness mocks elements by class through
`root.querySelector`; the four moved toggles resolve as before, and `layout()` must be a no-op when
`window.innerHeight` is undefined so the harness keeps exercising `resize()` from `canvas.clientWidth` alone.

Core CSS:

```
.lc-stage{position:fixed;inset:0;height:100dvh;display:grid;grid-template-rows:auto 1fr auto;background:#03070b;
  padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);overscroll-behavior:none}
.lc-side{grid-template-rows:auto 1fr;grid-template-columns:1fr 280px}
.lc-side .lc-top{grid-column:1/3}
.lc-picture{display:flex;align-items:center;justify-content:center;min-height:0;overflow:hidden}
.lc-picture canvas{touch-action:none}          /* taps act in the picture and never scroll */
.lc-hud{display:grid;grid-template-rows:47px 18px 38px 48px 24px;padding:0 16px}
.lc-card-slot{overflow:hidden} .lc-caption{overflow:hidden;line-height:19px}
@media(max-width:480px){.lc-hud{grid-template-rows:37px 18px 54px 56px 24px}}
```

## 3. Text pacing

Dragon's Lair never stops for text, and this game should not either. But a line the player was never given time to
read might as well not be there. Both hold if the text has its own clock and the beat respects it.

### Rules

1. **Chunk.** A caption is split at sentence boundaries into chunks of at most 150 characters (two desktop lines,
   three phone lines at 53 characters). A chunk is never split mid-sentence; a single sentence over 150 characters
   is a writing bug and the caption gets rewritten.
2. **Type at 45 cps.** Down from 70. Reading is about 17 cps; 70 cps finishes four times ahead of the reader and
   is what "appears fast" looks like. 45 keeps the teletype (150 characters in 3.3 s) without racing the eye.
3. **Hold per chunk** = max(2.0, typing + words x 0.3 s + 0.4 s). Words x 0.3 is 200 words per minute.
4. **Hold per beat** = max(picture duration, sum of chunk holds + 0.4 s). Cutscenes and results end on this, not on
   the picture alone. The picture keeps moving throughout; the camera's ease and blocking already stop at their
   targets, so a longer hold is a held shot, not a frozen one. Quiet beats wait for a button as now. Observe
   beats stay at 8 s (their captions fit). Prompts and windups are unchanged in timing and show text instantly.
5. **Tap to advance, never to skip.** During a cutscene or result, a click or tap on the caption or the picture,
   Space or Enter: if a chunk is typing, complete it; else show the next chunk. On the last chunk it does nothing.
   The beat still cannot end before its picture duration. So a fast reader can pace themselves and a slow one is
   never cut off, and nobody can skip a beat by accident.
6. **Prompts and windups carry almost no text.** Prompt caption <= 12 words; the marker and the picture say the
   rest ("The cart is coming. Slip left, or take the rope."). Windup caption <= 10 words plus the GET READY card;
   the description they carry today moves into the preceding cutscene or quiet beat, which now has the time.
7. **Reduced motion**: chunks appear whole; hold = words x 0.3 + 0.8; tap-to-advance works the same.
8. **Menu and cards**: unchanged. Card durations (chapter 3 s, GET READY 2 s, hit/miss 1.8 s, NOTED 1.6 s, CASE
   CLOSED 4 s, REWIND 1.4 s) are fine once they stop reflowing the page.

### Transition lines

The exit beat keeps its 1.4 s picture (glide 0.8, dissolve 0.6, fade-up 0.8: ART_DIRECTION's "about a second and a
half"). The line no longer shares that clock: `enter()` pushes the transition line as chunk 0 of the next phase's
caption queue. It types during the glide, holds through the dissolve, the fade-up and the chapter card, and the new
set's own first chunk starts when its hold (2.9 to 4.7 s for the current lines) is met. Nothing in the picture
timing changes; the "connecting line" finally connects.

### Adjustments (rule 4 applied to today's text; "chunks" is how many pieces it plays in)

| phase | hold now | words | new hold | action |
|---|---|---|---|---|
| officeFile, officeBoard | 5 s | 27, 26 | 12.5 s | keep; 2 chunks each |
| officeWindow, follow, roofEntry | 6, 8, 8 s | 26, 27, 24 | 11 to 12 s | keep |
| loftTurn, loftLeave, loftEntry | 4, 4, 7 s | 24, 19, 31 | 10.6, 9.1, 13.7 s | keep |
| pumpEntry, stationEntry, canalEntry, arrival | 6, 7, 7, 5 s | 21, 17, 18, 13 | 8 to 10 s | keep |
| result, pumpResult, chaseBank | 4, 4, 6 s | 15, 16, 17 | 7.3, 7.7, 8 s | keep |
| tramArrive, tunnelEntry, chaseEntry, clubResult, chaseFinish | 5, 6, 6, 4, 6 s | 26 to 29 | 12 to 13 s | keep |
| tramEntry, marketEntry, clubEntry | 8 s | 33, 34, 39 | 14.5 to 16.7 s | trim to <= 30 words |
| marketResult, tunnelFinish, subResult | 4, 6, 5 s | 33, 34, 37 | 14 to 16 s | trim to <= 30 words |
| subEntry, subManifest, subDawn, roomEntry | 8, 6, 5, 7 s | 48, 34, 33, 36 | 14 to 21 s | trim to <= 30 words; subEntry's second sentence moves to a caption on subManifest |
| danger, pumpDanger, clubFace, marketDanger, subDanger (windups) | 2 s | 18 to 29 | 2 s | cut to <= 10 words; move the rest one beat earlier |
| qte, pumpQte, marketQte, chaseQteB, subQte, tunnelQte (prompts) | window | 13 to 29 | window | cut to <= 12 words |

Cost: timed holds on the longest route go from 186 s to about 330 s after trims, +2.5 min on a 20 to 25 min case.

## 4. Clicking in the picture

The markers already exist in the world. They become the primary input for a prompt; the buttons below stay as the
keyboard-and-screen-reader parity and as the fallback for a thumb that misses.

- **Hit rectangles from the labels.** `worldLabel()` records every label it draws in a per-frame list
  `labelRects` (`{text, x0, x1, y, hue}` in cells), the way `actor()` fills `spriteRects`. During a prompt,
  `render()` turns the `[1]` and `[2]` entries into hit targets in CSS px: the label's cells expanded to at least
  44x44 px (64x64 on touch, `pointerType==='touch'`), i.e. +-4 columns and +-3 rows at 1440, +-6 columns and +-4
  rows on a phone. Targets are per frame, so a marker that moves with the courier is tracked.
- **Pointer handling** on the canvas only: `pointerdown` (not click, to save the 300 ms and the double-tap zoom;
  `touch-action:none`). Convert to cells with `cw`/`ch`, find targets containing the point; if two overlap (the
  street prompt on a phone: `[1]` and `[2]` are 47 px apart), take the nearer label centre. A hit calls
  `keys[index]()`, exactly what the keyboard path does, so `promptMove`/`choose` and the reflex clock see no
  difference. A press outside both targets does nothing but a 200 ms brightening of both markers (a nudge, not a
  penalty; penalties are the Game Director's).
- **Visible pulse while live.** In the grid, not over it: while a prompt is live the marker's ink alternates
  between its lamp level and the bright level at 2 Hz (`ink = hue*20 + (t*2|0)%2 ? 19 : 16`), and the label gains
  a one-cell bracket pad of the same hue (` [1] ` drawn as `<[1]>` is Unicode-free and reads as a target). On
  hover or press the marker goes cyan, the "landed" tone. `cursor:pointer` over a target, default elsewhere.
  Reduced motion: no pulse, the marker is simply bright.
- **Windup.** During GET READY the markers are already drawn for the danger beat's blocking; they are visible but
  inert and unlit (no pulse), so the player has 2 s to see where the two moves are before the clock starts.
- **Keyboard parity.** Unchanged: 1/2, arrows in the joystick sense; the two buttons keep their labels and stay
  focusable. Add the marker text to each button's `aria-label` ("Move 1, catch the courier").
- **On the phone.** Portrait: the picture is 435 px tall and the two 56 px buttons sit just under it; the marker is
  the fast path, the button the sure path. Landscape: the picture is 523x351 on the left, both markers on screen
  (they are not today), the two buttons stacked in the right column under the caption. Hit targets at 64 px on a
  7 px glyph mean a slightly missed thumb still lands.
- **Quiet choices stay in the HUD.** Only timed moves live in the picture; a quiet choice is the CYOA half.

## 5. Change list (priority order; nothing here touches the renderer, the sets' geometry, cameras or blocking)

| # | file / function | change | effort |
|---|---|---|---|
| 1 | `src/ui/shell.html` | stage grid, HUD strip with fixed rows, card slot, drawer, utility line, side layout media query, safe-area padding; keep every class | M |
| 2 | `scripts/build.mjs` | `viewport-fit=cover`, `apple-mobile-web-app-capable`, drop `main{max-width}`, `body{overflow:hidden}` | S |
| 3 | `src/game/runtime.js` `layout()` (new), `resize()` untouched | fit the picture to the stage, choose stacked/side, observe the stage; no-op without `window.innerHeight` | M |
| 4 | `src/game/presentation.js` `typeCaption`/`presentUI`/`presentTick` | caption queue: chunking, 45 cps, per-chunk hold, tap/Space to advance, `captionHold()` and `captionDone()` exported; transition line as chunk 0 | M |
| 5 | `src/game/case.js` `caseAdvance()` and `src/game/runtime.js` `tick()` | `done()` becomes `event >= duration && captionDone()` for cutscene and result kinds; observe, windup, prompt unchanged | S |
| 6 | `src/game/runtime.js` `enter()` | push `transitionLine()` into the queue instead of `el.caption.textContent` | S |
| 7 | `src/engine/renderer.js` `worldLabel()` + `src/game/runtime.js` | `labelRects`, hit targets, `pointerdown` on the canvas, pulse ink, hover tone, `cursor` toggle | M |
| 8 | `src/game/runtime.js` `ui()`/`timer()`, `presentation.js` `fitCard()` | header strings that never wrap; card font capped to the slot | S |
| 9 | `src/game/session.js` `menuUI()` | TIMED/MONO/SOUND/PAUSE rows in the menu; drawer open/close; fullscreen button and `f` key | S |
| 10 | captions in `sets/*.js`, `case.js`, `runtime.js` | trims from the table in section 3 (5 windups, 6 prompts, 10 long cutscenes/results) | M |
| 11 | `tests/game.test.cjs`, `tests/harness.cjs` | harness gains `innerWidth/innerHeight` and `clientHeight`; tests: fit picks the right width at the four viewports; a cutscene holds until its caption is read; a tap at a marker cell equals key 1; reference first-frame test unchanged | M |
| 12 | `AGENTS.md`, `docs/ART_DIRECTION.md`, `docs/design/BRIEF.md` | wording below | S |

Untouched: `src/engine/renderer.js` apart from the one-line `labelRects` push in `worldLabel()`; `materials.js`;
every set's `build`, `shot`, `ease`, `blocking`, `geometry`, `exit`; `scenes.js` cameras; `save-store.js`;
`sprites.js`; `reference/`; the checkpoint shape (no new state fields: chunk index and pulse phase are transient).

AGENTS.md wording. Replace

> Keep the scene unobstructed. Put concise player choices below the scene. Title cards, stingers, the case file and
> any other game presentation are HTML under the canvas, never drawn into the scene.

with

> The game fills the viewport and never scrolls. Keep the picture unobstructed: no element is ever positioned over
> the canvas, and the canvas is fitted, never cropped or stretched. Concise player choices, the caption, title cards
> and stingers are HTML in a fixed-height strip beside the picture (below it, or to its right on a landscape phone);
> the case file, records and settings sit behind a toggle that pauses the game. Nothing drawn into the scene is
> interface, with one exception: a live prompt's `[1]`/`[2]` world markers are tap targets and may pulse.

Add under the quick-time rule: "A cutscene or result holds at least until its caption has typed and could be read
(presentation.js `captionHold`); a transition line gets the same hold across the dissolve."

ART_DIRECTION.md line 14 ("HTML placed under the canvas") becomes "HTML beside the canvas, never over it", plus the
title-safe margin rule for labels. BRIEF.md "The interface below the scene shows" becomes "beside the scene".

## 6. Risks

- **Reference first-frame test.** It measures glyphs at canvas widths 320 and 732 through `canvas.clientWidth`
  alone. `resize()` is untouched and `layout()` must not run in the harness, so the test is unaffected; a layout
  test that fakes `innerWidth/innerHeight` covers the new code. If anyone later "improves" the W formula for big
  monitors, the test breaks first: good.
- **The 1024x768 picture shrinks** from 996 to 844 px wide (cells 5.5 to 4.7 px). It is the same density the
  reference approves at 732, but the owner should see it side by side before sign-off. Fullscreen on that monitor
  returns 950 px.
- **Screen readers.** The `.lc-said` live region stays the whole sentence, announced once per caption, not per
  chunk (chunking is visual). The canvas keeps `role="img"` with the scene description plus caption. Markers in the
  picture are not reachable by assistive tech; the two buttons are, and keep the marker in their `aria-label`.
  The drawer must move focus into itself on open and back to [CASE FILE] on close; the fullscreen button needs
  `aria-pressed`.
- **Reduced motion.** No pulse, no typing, holds computed from reading time only; transitions still cut directly
  and the transition line then plays as a chunk with its own hold, so it is finally readable there too.
- **Touch is positional, not directional.** In `tunnelQte` `[1]` is on the right and `[2]` on the left, so a
  "left half / right half" tap fallback would contradict the labels and must not be added. Keys stay as they are.
- **Long holds.** Rule 4 doubles some cutscenes; the trims bring the worst to about 12 s. A beat that still feels
  long is a writing problem, not a case for a faster typewriter.
- **Dynamic viewport on phones.** `100dvh` moves with the address bar; a mid-prompt resize re-fits the picture by a
  few px. The hit test reads the current frame's rects, so a tap is never judged against a stale layout.
- **The drawer as a pause.** Opening the case file mid-prompt pauses the deadline (the AGENTS.md rule for menus).
  Whether it should be reachable during a prompt is the Game Director's call; presentation hides [CASE FILE] then.

## Appendix A: pacing per phase (max caption over five state configurations; typing at today's 70 cps; reading 200 wpm)

```
phase          kind      set        hold   words chars  type  read  type+read  finding
officeEntry    cutscene  office     8      19    104    1.5   5.7   7.2        ok
officeFile     cutscene  office     5      27    163    2.3   8.1   10.4       unread
officeBoard    cutscene  office     5      26    163    2.3   7.8   10.1       unread
officeWindow   cutscene  office     6      26    140    2.0   7.8   9.8        unread
brief          quiet     street     -      19    119    1.7   5.7   7.4        waits
watch          observe   street     8      17    92     1.3   5.1   6.4        ok
ready          quiet     street     -      17    88     1.3   5.1   6.4        waits
follow         cutscene  street     8      27    143    2.0   8.1   10.1       unread
danger         windup    street     2      18    103    inst  5.4   5.4        unread (instant text)
qte            prompt    street     7-9    13    73     inst  3.9   3.9        ok
result         result    street     4      15    89     1.3   4.5   5.8        unread
evidence       quiet     street     -      30    150    2.1   9.0   11.1       waits
deduce         quiet     street     -      33    162    2.3   9.9   12.2       waits
loftTurn       cutscene  street     4      24    119    1.7   7.2   8.9        unread
loftEntry      cutscene  loft       7      31    160    2.3   9.3   11.6       unread
loftTable      quiet     loft       -      37    188    2.7   11.1  13.8       waits
loftNote       quiet     loft       -      35    160    2.3   10.5  12.8       waits
loftBoard      quiet     loft       -      40    215    3.1   12.0  15.1       waits
loftLeave      cutscene  loft       4      19    117    1.7   5.7   7.4        unread
arrival        cutscene  street     5      13    76     1.1   3.9   5.0        ok (by 0.0 s)
stationEntry   cutscene  station    7      17    110    1.6   5.1   6.7        ok
stationQuiet   quiet     station    -      27    153    2.2   8.1   10.3       waits
stationListen  observe   station    8      17    104    1.5   5.1   6.6        ok
stationReady   quiet     station    -      19    115    1.6   5.7   7.3        waits
pumpEntry      cutscene  pump       6      21    111    1.6   6.3   7.9        unread
pumpFind       quiet     pump       -      23    124    1.8   6.9   8.7        waits
pumpDanger     windup    pump       2      20    115    inst  6.0   6.0        unread (instant text)
pumpQte        prompt    pump       5-9    17    89     inst  5.1   5.1        ok
pumpResult     result    pump       4      16    96     1.4   4.8   6.2        unread
pumpTruth      quiet     pump       -      34    194    2.8   10.2  13.0       waits
roofEntry      cutscene  roof       8      24    141    2.0   7.2   9.2        unread
roofQuiet      quiet     roof       -      45    241    3.4   13.5  16.9       waits
roofListen     observe   roof       8      18    108    1.5   5.4   6.9        ok
roofSignal     quiet     roof       -      38    211    3.0   11.4  14.4       waits
roofConfession quiet     roof       -      34    193    2.8   10.2  13.0       waits
tramEntry      cutscene  tram       8      33    170    2.4   9.9   12.3       unread
tramRide       quiet     tram       -      27    144    2.1   8.1   10.2       waits
tramWatch      observe   tram       8      21    115    1.6   6.3   7.9        ok (by 0.1 s)
tramSpotted    quiet     tram       -      29    146    2.1   8.7   10.8       waits
tramArrive     cutscene  tram       5      26    144    2.1   7.8   9.9        unread
marketEntry    cutscene  market     8      34    180    2.6   10.2  12.8       unread
marketAisle    quiet     market     -      37    186    2.7   11.1  13.8       waits
marketKeeper   quiet     market     -      36    187    2.7   10.8  13.5       waits
marketDanger   windup    market     2      28    146    inst  8.4   8.4        unread (instant text)
marketQte      prompt    market     5-9    26    123    inst  7.8   7.8        over a 7 s window
marketResult   result    market     4      33    165    2.4   9.9   12.3       unread
clubEntry      cutscene  club       8      39    187    2.7   11.7  14.4       unread
clubFace       windup    club       2      19    94     inst  5.7   5.7        unread (instant text)
clubQte        prompt    club       5-9    19    94     inst  5.7   5.7        ok
clubResult     result    club       4      27    146    2.1   8.1   10.2       unread
chaseEntry     cutscene  chase      6      29    160    2.3   8.7   11.0       unread
chaseQteA      prompt    chase      5-9    22    119    inst  6.6   6.6        ok
chaseBank      result    chase      6      17    94     1.3   5.1   6.4        unread (by 0.4 s)
chaseQteB      prompt    chase      5-9    29    148    inst  8.7   8.7        over a 7 s window
chaseFinish    result    chase      6      29    151    2.2   8.7   10.9       unread
tunnelEntry    cutscene  tunnel     6      27    148    2.1   8.1   10.2       unread
tunnelQte      prompt    tunnel     7-9    24    146    inst  7.2   7.2        over a 7 s window
tunnelFinish   result    tunnel     6      34    185    2.6   10.2  12.8       unread
subEntry       cutscene  substation 8      48    244    3.5   14.4  17.9       unread, worst in the case
subManifest    cutscene  substation 6      34    193    2.8   10.2  13.0       unread
subDanger      windup    substation 2      29    155    inst  8.7   8.7        unread (instant text)
subQte         prompt    substation 5-9    27    130    inst  8.1   8.1        over a 7 s window
subResult      result    substation 5      37    192    2.7   11.1  13.8       unread
subDawn        cutscene  substation 5      33    164    2.3   9.9   12.2       unread
roomEntry      cutscene  room       7      36    206    2.9   10.8  13.7       unread
roomDeduce     quiet     room       -      32    154    2.2   9.6   11.8       waits
roomName       quiet     room       -      34    166    2.4   10.2  12.6       waits
canalEntry     cutscene  canal      7      18    107    1.5   5.4   6.9        ok
canalEnd       quiet     canal      -      36    180    2.6   10.8  13.4       waits
```

Results are measured without a rewind offer (with one they wait). A prompt's "hold" is its window, clamped 5 to 9 s.

## Appendix B: transition lines (exit beat 1.4 s; the line is replaced at 1.4 s)

```
office>street      14 w   68 ch   typed by 1.0 s   needs 4.2 s to read
street>loft        15 w   73 ch   typed by 1.0 s   needs 4.5 s
street>station     10 w   57 ch   typed by 0.8 s   needs 3.0 s
loft>station       18 w   97 ch   typed by 1.4 s   needs 5.4 s   (still typing at the cut)
station>pump        7 w   45 ch   typed by 0.6 s   needs 2.1 s
pump>roof           9 w   54 ch   typed by 0.8 s   needs 2.7 s
roof>tram          17 w   86 ch   typed by 1.2 s   needs 5.1 s
roof>room          19 w   98 ch   typed by 1.4 s   needs 5.7 s   (still typing at the cut)
tram>market        12 w   58 ch   typed by 0.8 s   needs 3.6 s
market>club        14 w   75 ch   typed by 1.1 s   needs 4.2 s
club>chase         15 w   81 ch   typed by 1.2 s   needs 4.5 s
chase>tunnel        8 w   45 ch   typed by 0.6 s   needs 2.4 s
chase>substation   17 w   87 ch   typed by 1.2 s   needs 5.1 s
tunnel>substation  13 w   68 ch   typed by 1.0 s   needs 3.9 s
substation>room    17 w   93 ch   typed by 1.3 s   needs 5.1 s
room>canal         10 w   54 ch   typed by 0.8 s   needs 3.0 s
```

## Appendix C: measured layout today (CSS px from the viewport top; negative = scrolled off)

```
viewport   state     page height  canvas          grid     cell   caption   actions
1440x900   menu      1081         56..722 (996w)  180x70   5.53   845..885  891..935
1024x768   prompt    948          -124..542       180x70   5.53   576..616  622..666
1024x768   ending    1104         -124..542       180x70   5.53   665..705  778..822
375x812    prompt    812          74..481 (355w)  84x56    4.23   515..555  561..605
812x375    prompt    806          -375..150 (784w) 180x70  4.36   183..223  229..273
```

Screenshots: scratchpad `shots/ux/` (four viewports x menu, cutscene, prompt, ending, plus mid-transition, windup and
exit-line frames) and `shots/route-long-1024/`, `shots/route-long-375/` (every phase of the long route).
