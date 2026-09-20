# The Last Light: characters

This is the cast bible and the sprite sheet for the case described in `BRIEF.md`. Part 1 says who each person is, what they want, what they hide, how they change, which hue the renderer gives them and how they talk. Part 2 gives every sprite the engine needs to draw them, at three sizes, as arrays an engineer can paste. `sprites.json` next to this file holds the same arrays.

The house voice for captions and lines: present tense, terse, concrete. People say what they see and what they want. Nobody explains the theme.

Palette hues, as the renderer numbers them: 0 slate-blue, 1 cyan, 2 amber, 3 red, 4 blue, 5 green, 6 white, 7 grey.

## Part 1: the cast

### Detective Rook

- **Role.** Night Division, missing-persons desk. The last honest light on that floor. He is "Rook" on the desk plate and in every caption; no first name is ever given.
- **Age and look.** Forty-four. Tall and heavy in the shoulders, a fedora with the brim pulled down, a long dark coat and one warm thing on him, an amber scarf; he is always drawn in profile because he is always looking at something.
- **Wants.** To bring the missing man home. To keep his own desk lamp honest.
- **Hides.** He has filed "no further action" on Night Division cases for years without asking whose signature closes them. He chose the desk over the floor, and he knows it.
- **Change.** He starts the night following a stranger's lantern and ends it either arresting the colleague next door or watching his tail lights go. Either way he stands at the canal with Bell as the lamps go out because morning has come, and the office he goes back to is not the one he left.
- **Hue.** 1 cyan. The `~` scarf is amber (2); the face glyphs are white (6). This is the existing rule and it stays.
- **Appears in.** Every set: 00 Night Division, 01 Station Road, 02 Concourse, 03 Pump Room 4, 04 Rooftop, 05 The Filament, 06 Elevated Road (in the patrol car), 07 The Undercity (in the patrol car), 08 Canal; the planned Night Market and Substation Nine.
- **Lines.**
  - "The lamp is out. Someone switched it off, or nobody came."
  - "Three knocks. If nobody answers, I use my shoulder."
  - "Vale signs his name like a man who has never been asked to read it back."

### Nell Marrow

- **Role.** Bell's apprentice lamplighter. The courier with the lantern. She forged the maintenance order.
- **Age and look.** Nineteen. Small and quick, hood up against the rain, a courier strap across her chest, Bell's hand lantern in her right fist and the long lighting pole in her left. She keeps her weight off her right leg: a fall on the tram rail three nights ago, walking a route that is not hers.
- **Wants.** Bell found alive. The route lit until he is.
- **Hides.** She wrote the "00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN" call herself to put Bell in the station on the record and Vale's stamp beside him. She guessed Vale. She did not guess the water. The forged order is in the dispatch book she is carrying.
- **Change.** From the stranger who limps away to the witness who knocks three times; on the roof she says what she did; at the canal she is either a trusted witness or a name in the case, depending on whether Rook caught her and whether he asked.
- **Hue.** 6 white (the courier's existing default). The lantern `@` is amber (2).
- **Appears in.** 01 Station Road; 02 Concourse and 03 Pump Room 4 (if Rook caught her); 04 Rooftop; 08 Canal (if caught). The Night Market, optionally, walking the route.
- **Lines.**
  - "He is alive. Pump Room 4. Three knocks, short. I will take you."
  - "I walk his route so the street stays lit. That is all I am doing."
  - "I wrote the order. I wanted Vale on paper. I did not think about the water."

### Ivo Bell

- **Role.** Senior lamplighter of the station route. Missing four nights. Locked in Pump Room 4.
- **Age and look.** Sixty-one. Short and broad, a flat cap with a peak, a grey beard, a work jacket over a satchel on the left hip and a wrench in the right hand that he taps against the pipe so someone will hear. He is the only adult drawn shorter than the others.
- **Wants.** The reserve batteries back on his route. Someone to read the ledger.
- **Hides.** He half-knew the maintenance order was Nell's and went anyway; he wanted Vale in the station too. He kept the ledger instead of reporting it because he did not know which desk on the Night Division floor was safe, and he says so only if asked.
- **Change.** Prisoner, then rescued, then witness. Sitting hurt on a breaking platform at the start; standing at the canal in first light at the end, with or without the ledger.
- **Hue.** 2 amber (existing). The wrench `Y` is white (6).
- **Appears in.** 03 Pump Room 4; 04 Rooftop; 08 Canal. He is present in 00 Night Division as the file on the desk.
- **Lines.**
  - "Vale took the reserve batteries. I found his ledger, so he locked me down here."
  - "That pipe will not hold. Close the inlet first. Then me."
  - "Forty years on this route. I know which lamps were never meant to come back on."

### Inspector Aurel Vale

- **Role.** Night Division, the office next door to Rook's. Runs the battery sales for the Board's people.
- **Age and look.** Fifty. Tall, narrow and upright, a peaked Division cap, a long double-breasted greatcoat buttoned to the throat, gloves, and the badge worn high on the chest and polished. He looks like the Division's poster and he knows it.
- **Wants.** The sales invisible until the Board moves him uptown. No paper with his name on it.
- **Hides.** That he works for Coyle. That The Filament launders the lots as casino chips. That he locked Bell in and left the flood to finish the job.
- **Change.** Seeded in the prologue as a signature on the concourse order and an empty chair in the office; then the man in the back booth who sees Rook; then red tail lights; then hands up at the canal or gone into the towers. He never raises his voice.
- **Hue.** 3 red (existing). The badge `*` is white (6).
- **Appears in.** 00 Night Division (his empty desk, his stamp on the board); 05 The Filament; 06 Elevated Road and 07 The Undercity (his red car); 08 Canal (if caught); Substation Nine.
- **Lines.**
  - "Rook. You are on the wrong floor for this."
  - "Reserve batteries. Signed. Nobody reads a maintenance order."
  - "Put the light down. There is nothing here to see."

### Krane

- **Role.** Vale's bodyguard. The bottle thrower. Later, the tail through the Night Market.
- **Age and look.** Thirty-eight. The widest man in any room, no hat, a shaved square head on a thick neck, a short jacket that does not close over him. Hands like tools.
- **Wants.** To be paid and to be the last one standing when it goes wrong.
- **Hides.** He is the one who turned the key on Pump Room 4. He keeps one Filament chip from every job in a tin, counting evidence against Vale in case he ever needs something to trade.
- **Change.** The thug at the booth, then the shadow between market stalls, then, if Rook plays him right, the man who offers his name off the ledger for Vale's. Rook can take the deal or refuse it.
- **Hue.** 0 slate-blue (the existing guard). The bottle `!` is cyan (1), the glass hue, and appears only in the throw pose.
- **Appears in.** 05 The Filament; the Night Market; 08 Canal (if Vale is caught); Substation Nine, optionally, at Vale's shoulder.
- **Lines.**
  - "Sit down, detective. The set is not over."
  - "I locked the door. He said the pumps would run."
  - "You want Vale? I want a name off the ledger. Mine."

### Ines Okafor, the roof medic

- **Role.** City Medical night post. She answers the roof radio and runs the canal-side post at dawn.
- **Age and look.** Thirty-three. A helmet-cap with the cross on it, a boxy high-visibility vest with reflective bands on the chest and both sleeves, a kit bag on the right hip, sleeves rolled to the elbow.
- **Wants.** Bell warm and off the roof. Nobody else on her table tonight.
- **Hides.** Nothing about the case. What she does not volunteer is how many lamplighters she has patched this month, and that the cold cases started when the low streets went dark. She says it once, and it is a clue.
- **Change.** She does not change; she is the fixed point the roof turns on. She hands Rook the radio and the choice, and she is there at the canal whichever way he chose.
- **Hue.** 5 green. The cross `+` is white (6).
- **Appears in.** 04 Rooftop; 08 Canal.
- **Lines.**
  - "Sit him down. Talk later. Blanket first."
  - "Third lamplighter this month. The first two were not in a pump room."
  - "Take the radio. The channel is open. I do not want to know what you do with it."

### Heddy Lasko, the bridge operator

- **Role.** Lift Bridge Two control. Voice only, on the roof radio.
- **Age and look.** Fifties, by the voice: gravel and tea. She is never drawn.
- **Wants.** Her bridge lifted on the half hour and nobody dead on it.
- **Hides.** She has been writing down the red car that crosses at the same hour every week. She has a book too, and it is dated.
- **Change.** From static to a name. If Rook listens, her tip buys him the lower ramp and time at every turn; at the end her log is a possible second witness against Vale.
- **Hue.** None; no sprite. Her radio lines are set in the interface's cyan, like every landed move, and captioned "Radio:".
- **Appears in.** 04 Rooftop (the radio); optionally 06 Elevated Road and 08 Canal, as a voice.
- **Lines.**
  - "Bridge lifting at the half hour. Lower service ramp is clear to the canal."
  - "Red car again. Same hour as last week. I write these down, detective."
  - "Whoever you are chasing, do not follow him over my gap."

### Delphine Arlo, the Filament's singer

- **Role.** The stage performer at The Filament. A possible informant.
- **Age and look.** Twenty-nine. A plume, hair up, a white sequined gown to the floor; she never steps off the stage while Vale is in the room.
- **Wants.** Out of The Filament with her contract, which the club holds against her.
- **Hides.** She can see the back booth from the stage every night: who sits, who pays, who leaves by the door marked NO EXIT. She has seen the grey woman with the umbrella there once. She will say so only to someone who stays for the second set.
- **Change.** From set dressing to an informant, if Rook spends a quiet beat listening instead of moving on the booth. Her tip is the optional door to Substation Nine.
- **Hue.** 6 white (the existing stage figure). The plume `^` is amber (2), lit by the spot.
- **Appears in.** 05 The Filament; the Night Market, optionally, off stage and hooded.
- **Lines.**
  - "I sing to the back booth. Everybody does."
  - "The grey woman came once. Nobody at that table laughed after."
  - "Not the stage door. Stay for the second set. I will be looking at you."

### Director Maren Coyle, Lumen Board

- **Role.** Lumen Board, Director of Reserves and Allocation. The figure above Vale.
- **Age and look.** Fifty-eight. Tall and thin under an umbrella that never closes, a grey pencil coat to the shin, the Board's lumen pin lit on her lapel. The only dry person in Halvard.
- **Wants.** The low districts written off as unmetered loss in the quarterly, and the reserve lots sold before the audit.
- **Hides.** That Vale's sales were her allocation policy: the batteries were never meant to come back to the station route. The Board did not lose the dark streets. It sold them.
- **Change.** Seeded early (a Board memo on the office case board, a Board stamp on the concourse order, Delphine's "grey woman"), revealed at Substation Nine. She does not run and she is not arrested tonight. The ending says so, and that is the hook for the next case.
- **Hue.** 7 grey. The lumen pin `&` is cyan (1).
- **Appears in.** Substation Nine. In 05 The Filament only as Delphine's memory.
- **Lines.**
  - "Detective. You are standing in my rain."
  - "There is no theft. There is allocation. Your division signed it."
  - "Arrest the inspector. It changes nothing on the grid."

### Extras

- **Who.** Filament patrons at the candlelit tables; the Night Market crowd; the uptown buyers at Substation Nine.
- **Look.** One generic figure (bare head, plain coat), told apart by hue and placement, never by an accent glyph. Patrons: 4 blue and 0 slate-blue, as blocked today. Market crowd: 0 slate-blue, 4 blue, 7 grey, some seated (`y` offset). Buyers: 7 grey, standing in a row, dry-looking, all the same height.
- **Rules.** Extras never stand between the camera and the person or hazard the player must act on. They do not move during a prompt. They never say a line; the caption may describe them ("tables full of people who do not look up").
- **Appear in.** 05 The Filament; the Night Market; Substation Nine.

## Part 2: sprite sheets

### How the engine draws a sprite, and what that means for these sheets

`actor()` in `src/game/runtime.js` takes an array of equal-width rows, projects the character's foot and head points, and fills the screen band between them: each screen row samples `rows[floor(u * rows.length)]` and each screen column samples `row[floor(x / w * cols)]`. Any row count and any column count work, as long as every row in a sprite is the same width. Two consequences shaped these sheets:

- **The sprite is squeezed on screen.** The band is `w = h * 1.72 * 0.41` columns wide for `h` rows tall, so an 11 by 11 sprite drawn at 11 rows is only about 8 columns wide. Everything here was designed at full width and checked through the engine's own sampling; silhouettes that survive the squeeze are the ones that read (a hat brim, a pole, a plume, a full-width shoulder line, a gown hem).
- **Far characters lose columns and rows, not detail.** At 7 rows a full sprite keeps 7 of its 11 rows and about 5 of its 11 columns; at 5 rows it keeps 5 rows and 3 or 4 columns. That is why each character has a hand-drawn `mid` (7 by 7) and `small` (5 by 5) set for `stand` and `walk`. **Size selection:** the intent is that a character drawn at 9 rows or more uses `full`, 5 to 8 rows `mid`, and anything smaller `small`. The loader being built in `src/game/sprites.js` implements this as "the largest sheet not squeezed below 0.85 of its size in either axis, else the smallest", which with the 0.7 width squeeze lands close to those thresholds; either rule works with these sheets.
- **Faces are stamped once.** The engine draws `o`, `.` and `>` at the centre of their sprite cell instead of filling the band, so a close-up never grows a second pair of eyes. That is why no sprite here uses those three glyphs for anything but a face, and why every face sits in a single row.
- **Colour.** The engine paints the whole sprite in the character's hue and brightens named characters (`hue * 20 + 14` for Rook, `+ 11` for others; named characters should all get `+ 14`). The only exceptions are Rook's `~` scarf (amber) and his face glyphs (white). Each new character gets exactly one accent glyph that takes a second hue, listed below; the face glyphs of everyone but Rook stay in the character's hue, as today.

### Hard rules every sprite obeys (and the check script enforces)

1. Printable ASCII only, codes 32 to 126.
2. Every row in a sprite has exactly the same length: 11 for `full`, 7 for `mid`, 5 for `small`.
3. Facial glyphs are only `o` (eye), `.` (eye or mouth) and `>` (nose or mouth in profile); nothing else in a sprite uses those three glyphs, and they appear in one row only.
4. Body fill is `#`; shading is `=`, `:` and `-`; outlines are `/ \ | ( ) _`; space is transparent.
5. At most one accent glyph per character, taking a second hue (table below). Krane's bottle `!` appears only in his throw pose.
6. The book prop in a `read` pose is drawn with `[` and `]`, as Rook's existing read pose already does. They are the only glyphs outside the sets above, and only in `read`.
7. Row counts: 11 rows for adults; Bell is 10 rows and 1.95 units tall; `crouch` is 7 rows at 1.35 units (Bell 1.3); Bell's `sit` is 6 rows at 1.15 units. Heights are in `sprites.json`: `height` is the standing height and `heights` holds the per-pose overrides.

### The file: `docs/design/sprites.json`

One object per character, keyed `rook`, `nell`, `bell`, `vale`, `krane`, `medic`, `performer`, `ashe` and `generic` (the extras, under the name the loader falls back to). Each has `full`, `mid` and `small` (an object of poses; `walk` is an array of two frames, every other pose one array of rows), `accent` (`{glyph, hue}` or `null`), and the metadata the loader reads: `hue`, `level` (ink brightness, 14 for named characters, 11 for extras), `faceHue` (Rook only, 6), `height` and `heights`. Blocking selects a sheet with `who: 'nell'` and so on on the actor; an actor without `who` draws `generic` (Rook keeps `isRook`).

### Accent table

| Character | Hue | Accent glyph | Accent hue | What it is |
|---|---|---|---|---|
| Rook | 1 cyan | `~` | 2 amber | scarf (existing; face glyphs are white) |
| Nell Marrow | 6 white | `@` | 2 amber | Bell's hand lantern |
| Ivo Bell | 2 amber | `Y` | 6 white | the wrench |
| Inspector Vale | 3 red | `*` | 6 white | the badge |
| Krane | 0 slate-blue | `!` | 1 cyan | the bottle, throw pose only |
| Ines Okafor | 5 green | `+` | 6 white | the medic's cross (cap and chest) |
| Delphine Arlo | 6 white | `^` | 2 amber | the plume |
| Maren Coyle | 7 grey | `&` | 1 cyan | the lumen pin |
| Extras | 0 / 4 / 7 by placement | none | | |

### Silhouette cues at a glance

| Character | Full-size cue | What survives at 5 by 5 |
|---|---|---|
| Rook | wide fedora brim, profile face, scarf, arms akimbo, mid-length coat | brim `_/=\_`, scarf `~`, profile `(o>` |
| Nell | hood, pole down the whole left edge, strap across the chest, lantern at the right hip, stiff right leg | pole `\|` on the left edge, `@` at the hip |
| Bell | flat cap with a peak, beard, broadest torso, satchel `(=)` at the left hip, wrench hanging right, ten rows | cap `(===)`, satchel and `Y` on one row |
| Vale | peaked cap, long coat with a `:` centre seam, badge `*`, narrow and upright | cap `_\|=\|_`, `*`, seam `:` |
| Krane | no hat, square boxed head, full-width shoulders, short jacket, wide stance | boxed head `\|o.o\|` over a full-width body |
| Okafor | helmet-cap with `+`, boxy banded vest with sleeve bands, kit bag | `/+\` cap, `\|=+=\|` band |
| Arlo | plume, fitted bodice, gown flaring to the floor, no legs | `^^^` and a flared hem |
| Coyle | umbrella across the top three rows, narrow coat, shaft down the right side, pin | canopy `/===\`, shaft on the right, single leg line |
| Extra | bare head, plain coat, nothing carried | a head and a column |

### Which pose goes where

The existing blocking in `scenes.js` maps onto these sheets without new logic; the new poses replace a few generic ones.

- **01 Station Road.** Nell `walk` (the stiff right leg is the tell the watch beat promises), `stumble` with the existing lean, `stand` with lean when caught; Rook `watch`, `walk`, `reach` then `support`, `read`, `crouch` as today.
- **02 Concourse.** Rook `read` at the desk; Nell `stand`.
- **03 Pump Room 4.** Bell `wrench` while the knocking plays (`pumpEntry`, `pumpFind`), `reach` during `pumpDanger` and `pumpQte`, `sit` on the walkway after `pumpResult` (replaces the `stand` at `y: 1.2`), `stand` for `pumpTruth`; Rook `watch`, `support`; Nell `watch`, `reach` when she throws the line.
- **04 Rooftop.** Okafor `radio` during `roofListen`, `crouch` beside Bell otherwise; Bell `sit` then `stand`; Nell `stand`, `lantern` when she signals the patrol car at the lift.
- **05 The Filament.** Arlo `stage` on the stage box (`y: .8`); Krane `stand` then `throw` for `clubFace` and `clubQte` (replaces `stumble` with negative lean); Vale `stand`, then `walk` out; patrons `extra` seated and standing; Rook `crouch`, `reach`, `stumble` when the bottle catches his shoulder.
- **06 Elevated Road, 07 The Undercity.** Cars only.
- **08 Canal.** Bell `stand`; Okafor `stand`; Nell `stand`; Vale `handsUp` if caught (replaces the hue-3 `stand` at `x: 6.2, z: 19.2`); Krane `stand` behind him.
- **Night Market (planned).** Krane `walk` and `stand` half-hidden between stalls; Nell `walk`; crowd `extra` at all three sizes; Arlo `stand`, hooded, optional.
- **Substation Nine (planned).** Coyle `stand` under the umbrella, `read` when she signs, `walk` to her car; Vale `stand` then `handsUp`; buyers `extra`; Krane `stand`.

### Reading the sheets

Each character below has a picture of every pose (as the check script prints them) followed by the arrays. `walk` is always two frames; the engine alternates them at `floor(t * 5) % 2` as it does today. Reduced sizes cover `stand` and `walk` only: `crouch`, `sit`, `stumble`, `reach`, `support`, `read` and the character-specific poses happen close to the camera, and the engine falls back to sampling the full sprite for them at any size.

### Rook (`rook`)

Sheet:

```text
full watch     full stand     full walk 1    full walk 2    full reach     full support 
[    ____   ]  [    ____   ]  [    ____   ]  [    ____   ]  [    ____   ]  [    ____   ]
[  _/====\_ ]  [  _/====\_ ]  [  _/====\_ ]  [  _/====\_ ]  [  _/====\_ ]  [  _/====\_ ]
[   ( o_>   ]  [   ( o_>   ]  [   ( o_>   ]  [   ( o_>   ]  [   ( o_>   ]  [   ( o_>   ]
[   /|~\    ]  [   /|~\    ]  [   /|~\    ]  [   /|~\    ]  [   /|~\    ]  [   /|~\    ]
[  /##~#\   ]  [  /##~#\   ]  [  /##~#\   ]  [  /##~#\   ]  [  /##~#|__ ]  [  /##~#\___]
[ /|#####|\ ]  [ /|#####|\ ]  [ /|#####|\ ]  [ /|#####|\ ]  [  |#####| \]  [  |#####|\ ]
[  |#####|  ]  [ ||#####|| ]  [  |#####|  ]  [  |#####|  ]  [  |#####|  ]  [  |#####| |]
[  /#####\  ]  [ \/#####\/ ]  [  /#####\  ]  [  /#####\  ]  [  /#####\  ]  [  /#####\  ]
[ /___|___\ ]  [ /___|___\ ]  [ /___|___\ ]  [ /___|___\ ]  [ /___|___\ ]  [ /___|___\ ]
[    | |    ]  [    | |    ]  [   /   |   ]  [   |   \   ]  [    | |    ]  [    | |    ]
[   _| |_   ]  [   _| |_   ]  [ _/    |_  ]  [  _|    \_ ]  [   _| |_   ]  [   _| |_   ]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[    ____   ]  [    ____   ]  [    ____   ]  [ ____  ]  [ ____  ]  [ ____  ]
[  _/====\_ ]  [  _/====\_ ]  [  _/====\_ ]  [_/==\_ ]  [_/==\_ ]  [_/==\_ ]
[   ( o_>   ]  [   ( o_>   ]  [   ( o_>   ]  [ (o_>  ]  [ (o_>  ]  [ (o_>  ]
[   /|~\    ]  [   /|~\    ]  [ \ /|~\ /  ]  [ /|~\  ]  [ /|~\  ]  [ /|~\  ]
[  /##~#|__ ]  [  /####\__ ]  [  \/#~#\/  ]  [/|##|\ ]  [/|##|\ ]  [/|##|\ ]
[  |####|=[]]  [ /######|\ ]  [   |###|   ]  [ |##|  ]  [ |##|  ]  [ |##|  ]
[  |#####|  ]  [/_/   \___ ]  [  /#####\  ]  [ _| |_ ]  [_/  |_ ]  [ _|  \_]
[  /#####\  ]  [           ]  [  |#####|  ]  [       ]  [       ]  [       ]
[ /___|___\ ]  [           ]  [ /___|___\ ]  [       ]  [       ]  [       ]
[    | |    ]  [           ]  [   /   \   ]  [       ]  [       ]  [       ]
[   _| |_   ]  [           ]  [  /     \_ ]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[_/=\_]  [_/=\_]  [_/=\_]
[ (o> ]  [ (o> ]  [ (o> ]
[ #~# ]  [ #~# ]  [ #~# ]
[/###\]  [/###\]  [/###\]
[ | | ]  [/  | ]  [ |  \]
```

Arrays:

```js
const rook = {
  hue: 1,
  faceHue: 6,
  level: 14,
  height: 2.15,
  heights: {"crouch":1.35},
  full: {
    watch: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /##~#\\   ",
      " /|#####|\\ ",
      "  |#####|  ",
      "  /#####\\  ",
      " /___|___\\ ",
      "    | |    ",
      "   _| |_   ",
    ],
    stand: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /##~#\\   ",
      " /|#####|\\ ",
      " ||#####|| ",
      " \\/#####\\/ ",
      " /___|___\\ ",
      "    | |    ",
      "   _| |_   ",
    ],
    walk: [
      [
        "    ____   ",
        "  _/====\\_ ",
        "   ( o_>   ",
        "   /|~\\    ",
        "  /##~#\\   ",
        " /|#####|\\ ",
        "  |#####|  ",
        "  /#####\\  ",
        " /___|___\\ ",
        "   /   |   ",
        " _/    |_  ",
      ],
      [
        "    ____   ",
        "  _/====\\_ ",
        "   ( o_>   ",
        "   /|~\\    ",
        "  /##~#\\   ",
        " /|#####|\\ ",
        "  |#####|  ",
        "  /#####\\  ",
        " /___|___\\ ",
        "   |   \\   ",
        "  _|    \\_ ",
      ],
    ],
    reach: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /##~#|__ ",
      "  |#####| \\",
      "  |#####|  ",
      "  /#####\\  ",
      " /___|___\\ ",
      "    | |    ",
      "   _| |_   ",
    ],
    support: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /##~#\\___",
      "  |#####|\\ ",
      "  |#####| |",
      "  /#####\\  ",
      " /___|___\\ ",
      "    | |    ",
      "   _| |_   ",
    ],
    read: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /##~#|__ ",
      "  |####|=[]",
      "  |#####|  ",
      "  /#####\\  ",
      " /___|___\\ ",
      "    | |    ",
      "   _| |_   ",
    ],
    crouch: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      "   /|~\\    ",
      "  /####\\__ ",
      " /######|\\ ",
      "/_/   \\___ ",
    ],
    stumble: [
      "    ____   ",
      "  _/====\\_ ",
      "   ( o_>   ",
      " \\ /|~\\ /  ",
      "  \\/#~#\\/  ",
      "   |###|   ",
      "  /#####\\  ",
      "  |#####|  ",
      " /___|___\\ ",
      "   /   \\   ",
      "  /     \\_ ",
    ],
  },
  mid: {
    stand: [
      " ____  ",
      "_/==\\_ ",
      " (o_>  ",
      " /|~\\  ",
      "/|##|\\ ",
      " |##|  ",
      " _| |_ ",
    ],
    walk: [
      [
        " ____  ",
        "_/==\\_ ",
        " (o_>  ",
        " /|~\\  ",
        "/|##|\\ ",
        " |##|  ",
        "_/  |_ ",
      ],
      [
        " ____  ",
        "_/==\\_ ",
        " (o_>  ",
        " /|~\\  ",
        "/|##|\\ ",
        " |##|  ",
        " _|  \\_",
      ],
    ],
  },
  small: {
    stand: [
      "_/=\\_",
      " (o> ",
      " #~# ",
      "/###\\",
      " | | ",
    ],
    walk: [
      [
        "_/=\\_",
        " (o> ",
        " #~# ",
        "/###\\",
        "/  | ",
      ],
      [
        "_/=\\_",
        " (o> ",
        " #~# ",
        "/###\\",
        " |  \\",
      ],
    ],
  },
  accent: {"glyph":"~","hue":2},
};
```

### Nell Marrow (`nell`)

Sheet:

```text
full stand     full walk 1    full walk 2    full lantern   full reach     full support 
[|  _____   ]  [|  _____   ]  [|  _____   ]  [|  _____  @]  [|  _____   ]  [|  _____   ]
[| /=====\  ]  [| /=====\  ]  [| /=====\  ]  [| /=====\ |]  [| /=====\  ]  [| /=====\  ]
[| |(o.o)|  ]  [| |(o.o)|  ]  [| |(o.o)|  ]  [| |(o.o)| |]  [| |(o.o)|  ]  [| |(o.o)|  ]
[| \_\|/_/  ]  [| \_\|/_/  ]  [| \_\|/_/  ]  [| \_\|/_/_/]  [| \_\|/_/  ]  [| \_\|/_/  ]
[|  /#\#\   ]  [|  /#\#\   ]  [|  /#\#\   ]  [|  /#\#\/  ]  [|  /#\#\__@]  [|  /#\#\___]
[|_/##\##\  ]  [|_/##\##\  ]  [|_/##\##\  ]  [|_/##\##|  ]  [|_/##\##|  ]  [|_/##\##|\ ]
[|  |###\|  ]  [|  |###\|  ]  [|  |###\|  ]  [|  |###\|  ]  [|  |###\|  ]  [|  |###\| |]
[|  |####|@ ]  [|  |####|@ ]  [|  |####|@ ]  [|  |####|  ]  [|  |####|  ]  [|  |####|@ ]
[|  /_____\ ]  [|  /_____\ ]  [|  /_____\ ]  [|  /_____\ ]  [|  /_____\ ]  [|  /_____\ ]
[|   |   |  ]  [|   /   |  ]  [|   \   |  ]  [|   |   |  ]  [|   |   |  ]  [|   |   |  ]
[|  _|   |_ ]  [|  _/   |_ ]  [|   \_  |_ ]  [|  _|   |_ ]  [|  _|   |_ ]  [|  _|   |_ ]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[|  _____   ]  [|  _____   ]  [|  _____   ]  [| ___  ]  [| ___  ]  [| ___  ]
[| /=====\  ]  [| /=====\  ]  [| /=====\  ]  [|/===\ ]  [|/===\ ]  [|/===\ ]
[| |(o.o)|  ]  [| |(o.o)|  ]  [| |(o.o)|  ]  [||o.o| ]  [||o.o| ]  [||o.o| ]
[| \_\|/_/  ]  [| \_\|/_/  ]  [|\ \_|_/ /@]  [|\_|_/ ]  [|\_|_/ ]  [|\_|_/ ]
[|  /#\#\   ]  [|_/####\__ ]  [| \/#\#\/  ]  [|_/#\# ]  [|_/#\# ]  [|_/#\# ]
[|_/##\##\  ]  [| /#####|\@]  [|  |##\#|  ]  [| |#\|@]  [| |#\|@]  [| |#\|@]
[|  |#[=]|  ]  [|/_/   \___]  [|  |###\|  ]  [| _| |_]  [| _/ | ]  [| \_ | ]
[|  |####|@ ]  [           ]  [|  |####|  ]  [       ]  [       ]  [       ]
[|  /_____\ ]  [           ]  [|  /_____\ ]  [       ]  [       ]  [       ]
[|   |   |  ]  [           ]  [|  /    \  ]  [       ]  [       ]  [       ]
[|  _|   |_ ]  [           ]  [| /      \_]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[|/=\ ]  [|/=\ ]  [|/=\ ]
[|o.o ]  [|o.o ]  [|o.o ]
[|/#\@]  [|/#\@]  [|/#\@]
[||#| ]  [||#| ]  [||#| ]
[|| | ]  [|/ | ]  [|\ | ]
```

Arrays:

```js
const nell = {
  hue: 6,
  level: 14,
  height: 2.05,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "| \\_\\|/_/  ",
      "|  /#\\#\\   ",
      "|_/##\\##\\  ",
      "|  |###\\|  ",
      "|  |####|@ ",
      "|  /_____\\ ",
      "|   |   |  ",
      "|  _|   |_ ",
    ],
    walk: [
      [
        "|  _____   ",
        "| /=====\\  ",
        "| |(o.o)|  ",
        "| \\_\\|/_/  ",
        "|  /#\\#\\   ",
        "|_/##\\##\\  ",
        "|  |###\\|  ",
        "|  |####|@ ",
        "|  /_____\\ ",
        "|   /   |  ",
        "|  _/   |_ ",
      ],
      [
        "|  _____   ",
        "| /=====\\  ",
        "| |(o.o)|  ",
        "| \\_\\|/_/  ",
        "|  /#\\#\\   ",
        "|_/##\\##\\  ",
        "|  |###\\|  ",
        "|  |####|@ ",
        "|  /_____\\ ",
        "|   \\   |  ",
        "|   \\_  |_ ",
      ],
    ],
    lantern: [
      "|  _____  @",
      "| /=====\\ |",
      "| |(o.o)| |",
      "| \\_\\|/_/_/",
      "|  /#\\#\\/  ",
      "|_/##\\##|  ",
      "|  |###\\|  ",
      "|  |####|  ",
      "|  /_____\\ ",
      "|   |   |  ",
      "|  _|   |_ ",
    ],
    reach: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "| \\_\\|/_/  ",
      "|  /#\\#\\__@",
      "|_/##\\##|  ",
      "|  |###\\|  ",
      "|  |####|  ",
      "|  /_____\\ ",
      "|   |   |  ",
      "|  _|   |_ ",
    ],
    support: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "| \\_\\|/_/  ",
      "|  /#\\#\\___",
      "|_/##\\##|\\ ",
      "|  |###\\| |",
      "|  |####|@ ",
      "|  /_____\\ ",
      "|   |   |  ",
      "|  _|   |_ ",
    ],
    read: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "| \\_\\|/_/  ",
      "|  /#\\#\\   ",
      "|_/##\\##\\  ",
      "|  |#[=]|  ",
      "|  |####|@ ",
      "|  /_____\\ ",
      "|   |   |  ",
      "|  _|   |_ ",
    ],
    crouch: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "| \\_\\|/_/  ",
      "|_/####\\__ ",
      "| /#####|\\@",
      "|/_/   \\___",
    ],
    stumble: [
      "|  _____   ",
      "| /=====\\  ",
      "| |(o.o)|  ",
      "|\\ \\_|_/ /@",
      "| \\/#\\#\\/  ",
      "|  |##\\#|  ",
      "|  |###\\|  ",
      "|  |####|  ",
      "|  /_____\\ ",
      "|  /    \\  ",
      "| /      \\_",
    ],
  },
  mid: {
    stand: [
      "| ___  ",
      "|/===\\ ",
      "||o.o| ",
      "|\\_|_/ ",
      "|_/#\\# ",
      "| |#\\|@",
      "| _| |_",
    ],
    walk: [
      [
        "| ___  ",
        "|/===\\ ",
        "||o.o| ",
        "|\\_|_/ ",
        "|_/#\\# ",
        "| |#\\|@",
        "| _/ | ",
      ],
      [
        "| ___  ",
        "|/===\\ ",
        "||o.o| ",
        "|\\_|_/ ",
        "|_/#\\# ",
        "| |#\\|@",
        "| \\_ | ",
      ],
    ],
  },
  small: {
    stand: [
      "|/=\\ ",
      "|o.o ",
      "|/#\\@",
      "||#| ",
      "|| | ",
    ],
    walk: [
      [
        "|/=\\ ",
        "|o.o ",
        "|/#\\@",
        "||#| ",
        "|/ | ",
      ],
      [
        "|/=\\ ",
        "|o.o ",
        "|/#\\@",
        "||#| ",
        "|\\ | ",
      ],
    ],
  },
  accent: {"glyph":"@","hue":2},
};
```

### Ivo Bell (`bell`)

Sheet:

```text
full stand     full walk 1    full walk 2    full wrench    full sit       full reach   
[  _______  ]  [  _______  ]  [  _______  ]  [  _______ Y]  [  _______  ]  [  _______  ]
[ (=======)_]  [ (=======)_]  [ (=======)_]  [ (=======)|]  [ (=======)_]  [ (=======)_]
[   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)  |]  [   (o.o)   ]  [   (o.o)   ]
[  _\===/_  ]  [  _\===/_  ]  [  _\===/_  ]  [  _\===/_/ ]  [  _\===/_  ]  [  _\===/_  ]
[ /#######\ ]  [ /#######\ ]  [ /#######\ ]  [ /#######/ ]  [ /##(=)##\_]  [ /#######\ ]
[|#|#####|#|]  [|#|#####|#|]  [|#|#####|#|]  [|#|#####|  ]  [|_______|_|]  [__|#####|#|]
[|#|#####|#|]  [|#|#####|#|]  [|#|#####|#|]  [|#|#####|  ]  [           ]  [  |#####|#Y]
[(=)_____|_Y]  [(=)_____|_Y]  [(=)_____|_Y]  [(=)_____/  ]  [           ]  [ (=)____|_ ]
[  |     |  ]  [  /     |  ]  [  |     \  ]  [  |     |  ]  [           ]  [  |     |  ]
[ _|     |_ ]  [ _/     |_ ]  [  |_     \_]  [ _|     |_ ]  [           ]  [ _|     |_ ]

full support   full read      full crouch    full stumble   mid stand  mid walk 1
[  _______  ]  [  _______  ]  [  _______  ]  [  _______  ]  [ _____ ]  [ _____ ]
[ (=======)_]  [ (=======)_]  [ (=======)_]  [ (=======)_]  [(=====)]  [(=====)]
[   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [  o.o  ]  [  o.o  ]
[  _\===/_  ]  [  _\===/_  ]  [  _\===/_  ]  [\_ \===/ _Y]  [ _\=/_ ]  [ _\=/_ ]
[_/#######\ ]  [ /#######\ ]  [ /########_]  [ \/#####\/ ]  [/#####\]  [/#####\]
[ \|#####|#|]  [|#|#[=]#|#|]  [(=)######|Y]  [  |#####|  ]  [(=)##|Y]  [(=)##|Y]
[ ||#####|#Y]  [|#|#####|#Y]  [/_/    \___]  [  |#####|  ]  [ |   | ]  [ /   | ]
[ (=)____|_ ]  [(=)_____|_ ]  [           ]  [ (=)_____\ ]  [       ]  [       ]
[  |     |  ]  [  |     |  ]  [           ]  [  /     \  ]  [       ]  [       ]
[ _|     |_ ]  [ _|     |_ ]  [           ]  [ /       \_]  [       ]  [       ]

mid walk 2  small stand  small walk 1  small walk 2
[ _____ ]  [(===)]  [(===)]  [(===)]
[(=====)]  [ o.o ]  [ o.o ]  [ o.o ]
[  o.o  ]  [/###\]  [/###\]  [/###\]
[ _\=/_ ]  [(=)#Y]  [(=)#Y]  [(=)#Y]
[/#####\]  [ | | ]  [ / | ]  [ | \ ]
[(=)##|Y]  [     ]  [     ]  [     ]
[ |   \ ]  [     ]  [     ]  [     ]
```

Arrays:

```js
const bell = {
  hue: 2,
  level: 14,
  height: 1.95,
  heights: {"crouch":1.3,"sit":1.15},
  full: {
    stand: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      " /#######\\ ",
      "|#|#####|#|",
      "|#|#####|#|",
      "(=)_____|_Y",
      "  |     |  ",
      " _|     |_ ",
    ],
    walk: [
      [
        "  _______  ",
        " (=======)_",
        "   (o.o)   ",
        "  _\\===/_  ",
        " /#######\\ ",
        "|#|#####|#|",
        "|#|#####|#|",
        "(=)_____|_Y",
        "  /     |  ",
        " _/     |_ ",
      ],
      [
        "  _______  ",
        " (=======)_",
        "   (o.o)   ",
        "  _\\===/_  ",
        " /#######\\ ",
        "|#|#####|#|",
        "|#|#####|#|",
        "(=)_____|_Y",
        "  |     \\  ",
        "  |_     \\_",
      ],
    ],
    wrench: [
      "  _______ Y",
      " (=======)|",
      "   (o.o)  |",
      "  _\\===/_/ ",
      " /#######/ ",
      "|#|#####|  ",
      "|#|#####|  ",
      "(=)_____/  ",
      "  |     |  ",
      " _|     |_ ",
    ],
    sit: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      " /##(=)##\\_",
      "|_______|_|",
    ],
    reach: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      " /#######\\ ",
      "__|#####|#|",
      "  |#####|#Y",
      " (=)____|_ ",
      "  |     |  ",
      " _|     |_ ",
    ],
    support: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      "_/#######\\ ",
      " \\|#####|#|",
      " ||#####|#Y",
      " (=)____|_ ",
      "  |     |  ",
      " _|     |_ ",
    ],
    read: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      " /#######\\ ",
      "|#|#[=]#|#|",
      "|#|#####|#Y",
      "(=)_____|_ ",
      "  |     |  ",
      " _|     |_ ",
    ],
    crouch: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "  _\\===/_  ",
      " /########_",
      "(=)######|Y",
      "/_/    \\___",
    ],
    stumble: [
      "  _______  ",
      " (=======)_",
      "   (o.o)   ",
      "\\_ \\===/ _Y",
      " \\/#####\\/ ",
      "  |#####|  ",
      "  |#####|  ",
      " (=)_____\\ ",
      "  /     \\  ",
      " /       \\_",
    ],
  },
  mid: {
    stand: [
      " _____ ",
      "(=====)",
      "  o.o  ",
      " _\\=/_ ",
      "/#####\\",
      "(=)##|Y",
      " |   | ",
    ],
    walk: [
      [
        " _____ ",
        "(=====)",
        "  o.o  ",
        " _\\=/_ ",
        "/#####\\",
        "(=)##|Y",
        " /   | ",
      ],
      [
        " _____ ",
        "(=====)",
        "  o.o  ",
        " _\\=/_ ",
        "/#####\\",
        "(=)##|Y",
        " |   \\ ",
      ],
    ],
  },
  small: {
    stand: [
      "(===)",
      " o.o ",
      "/###\\",
      "(=)#Y",
      " | | ",
    ],
    walk: [
      [
        "(===)",
        " o.o ",
        "/###\\",
        "(=)#Y",
        " / | ",
      ],
      [
        "(===)",
        " o.o ",
        "/###\\",
        "(=)#Y",
        " | \\ ",
      ],
    ],
  },
  accent: {"glyph":"Y","hue":6},
};
```

### Inspector Aurel Vale (`vale`)

Sheet:

```text
full stand     full walk 1    full walk 2    full handsUp   full reach     full support 
[   _____   ]  [   _____   ]  [   _____   ]  [|  _____  |]  [   _____   ]  [   _____   ]
[ _|=====|_ ]  [ _|=====|_ ]  [ _|=====|_ ]  [|_|=====|_|]  [ _|=====|_ ]  [ _|=====|_ ]
[  \(o.o)/  ]  [  \(o.o)/  ]  [  \(o.o)/  ]  [\  (o.o)  /]  [  \(o.o)/  ]  [  \(o.o)/  ]
[   _\|/_   ]  [   _\|/_   ]  [   _\|/_   ]  [ \_ \|/ _/ ]  [   _\|/_   ]  [   _\|/_   ]
[  /#*#:#\  ]  [  /#*#:#\  ]  [  /#*#:#\  ]  [  /#*#:#\  ]  [  /#*#:#|__]  [  /#*#:#\__]
[ /|##:##|\ ]  [ /|##:##|\ ]  [ /|##:##|\ ]  [  |##:##|  ]  [ /|##:##| \]  [ /|##:##|\ ]
[ ||##:##|| ]  [ ||##:##|| ]  [ ||##:##|| ]  [  |##:##|  ]  [ ||##:##|  ]  [ ||##:##| |]
[ ||##:##|| ]  [ ||##:##|| ]  [ ||##:##|| ]  [  |##:##|  ]  [ ||##:##|  ]  [ ||##:##|  ]
[  /__:__\  ]  [  /__:__\  ]  [  /__:__\  ]  [  /__:__\  ]  [  /__:__\  ]  [  /__:__\  ]
[   |   |   ]  [   /   |   ]  [   |   \   ]  [   |   |   ]  [   |   |   ]  [   |   |   ]
[  _|   |_  ]  [  _/   |_  ]  [   |_   \_ ]  [  _|   |_  ]  [  _|   |_  ]  [  _|   |_  ]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[   _____   ]  [   _____   ]  [   _____   ]  [ _____ ]  [ _____ ]  [ _____ ]
[ _|=====|_ ]  [ _|=====|_ ]  [ _|=====|_ ]  [_|===|_]  [_|===|_]  [_|===|_]
[  \(o.o)/  ]  [  \(o.o)/  ]  [  \(o.o)/  ]  [ (o.o) ]  [ (o.o) ]  [ (o.o) ]
[   _\|/_   ]  [   _\|/_   ]  [ \ _\|/_ / ]  [ /#*:\ ]  [ /#*:\ ]  [ /#*:\ ]
[  /#*#:#\  ]  [  /#*#:#\__]  [  \/#*#:\/ ]  [/|#:#|\]  [/|#:#|\]  [/|#:#|\]
[ /|##:##|\ ]  [ /|##:###|\]  [   |#:##|  ]  [ |#:#| ]  [ |#:#| ]  [ |#:#| ]
[ ||#[=]#|| ]  [/_/    \___]  [   |#:##|  ]  [ _| |_ ]  [ _/ |_ ]  [ _| \_ ]
[ ||##:##|| ]  [           ]  [   |#:##|  ]  [       ]  [       ]  [       ]
[  /__:__\  ]  [           ]  [  /__:__\  ]  [       ]  [       ]  [       ]
[   |   |   ]  [           ]  [   /   \   ]  [       ]  [       ]  [       ]
[  _|   |_  ]  [           ]  [  /     \_ ]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[_|=|_]  [_|=|_]  [_|=|_]
[ o.o ]  [ o.o ]  [ o.o ]
[/#*#\]  [/#*#\]  [/#*#\]
[|#:#|]  [|#:#|]  [|#:#|]
[ |_| ]  [ /_| ]  [ |_\ ]
```

Arrays:

```js
const vale = {
  hue: 3,
  level: 14,
  height: 2.15,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      "   _\\|/_   ",
      "  /#*#:#\\  ",
      " /|##:##|\\ ",
      " ||##:##|| ",
      " ||##:##|| ",
      "  /__:__\\  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    walk: [
      [
        "   _____   ",
        " _|=====|_ ",
        "  \\(o.o)/  ",
        "   _\\|/_   ",
        "  /#*#:#\\  ",
        " /|##:##|\\ ",
        " ||##:##|| ",
        " ||##:##|| ",
        "  /__:__\\  ",
        "   /   |   ",
        "  _/   |_  ",
      ],
      [
        "   _____   ",
        " _|=====|_ ",
        "  \\(o.o)/  ",
        "   _\\|/_   ",
        "  /#*#:#\\  ",
        " /|##:##|\\ ",
        " ||##:##|| ",
        " ||##:##|| ",
        "  /__:__\\  ",
        "   |   \\   ",
        "   |_   \\_ ",
      ],
    ],
    handsUp: [
      "|  _____  |",
      "|_|=====|_|",
      "\\  (o.o)  /",
      " \\_ \\|/ _/ ",
      "  /#*#:#\\  ",
      "  |##:##|  ",
      "  |##:##|  ",
      "  |##:##|  ",
      "  /__:__\\  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    reach: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      "   _\\|/_   ",
      "  /#*#:#|__",
      " /|##:##| \\",
      " ||##:##|  ",
      " ||##:##|  ",
      "  /__:__\\  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    support: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      "   _\\|/_   ",
      "  /#*#:#\\__",
      " /|##:##|\\ ",
      " ||##:##| |",
      " ||##:##|  ",
      "  /__:__\\  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    read: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      "   _\\|/_   ",
      "  /#*#:#\\  ",
      " /|##:##|\\ ",
      " ||#[=]#|| ",
      " ||##:##|| ",
      "  /__:__\\  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    crouch: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      "   _\\|/_   ",
      "  /#*#:#\\__",
      " /|##:###|\\",
      "/_/    \\___",
    ],
    stumble: [
      "   _____   ",
      " _|=====|_ ",
      "  \\(o.o)/  ",
      " \\ _\\|/_ / ",
      "  \\/#*#:\\/ ",
      "   |#:##|  ",
      "   |#:##|  ",
      "   |#:##|  ",
      "  /__:__\\  ",
      "   /   \\   ",
      "  /     \\_ ",
    ],
  },
  mid: {
    stand: [
      " _____ ",
      "_|===|_",
      " (o.o) ",
      " /#*:\\ ",
      "/|#:#|\\",
      " |#:#| ",
      " _| |_ ",
    ],
    walk: [
      [
        " _____ ",
        "_|===|_",
        " (o.o) ",
        " /#*:\\ ",
        "/|#:#|\\",
        " |#:#| ",
        " _/ |_ ",
      ],
      [
        " _____ ",
        "_|===|_",
        " (o.o) ",
        " /#*:\\ ",
        "/|#:#|\\",
        " |#:#| ",
        " _| \\_ ",
      ],
    ],
  },
  small: {
    stand: [
      "_|=|_",
      " o.o ",
      "/#*#\\",
      "|#:#|",
      " |_| ",
    ],
    walk: [
      [
        "_|=|_",
        " o.o ",
        "/#*#\\",
        "|#:#|",
        " /_| ",
      ],
      [
        "_|=|_",
        " o.o ",
        "/#*#\\",
        "|#:#|",
        " |_\\ ",
      ],
    ],
  },
  accent: {"glyph":"*","hue":6},
};
```

### Krane (`krane`)

Sheet:

```text
full stand     full walk 1    full walk 2    full throw     full reach     full support 
[  _=====_  ]  [  _=====_  ]  [  _=====_  ]  [  _=====_ !]  [  _=====_  ]  [  _=====_  ]
[  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)| |]  [  |(o.o)|  ]  [  |(o.o)|  ]
[  \_____/  ]  [  \_____/  ]  [  \_____/  ]  [  \_____/_/]  [  \_____/  ]  [  \_____/  ]
[ __\###/__ ]  [ __\###/__ ]  [ __\###/__ ]  [ __\###/#/ ]  [ __\###/__ ]  [ __\###/___]
[/#########\]  [/#########\]  [/#########\]  [/########  ]  [/########|_]  [/########|\]
[|#|#####|#|]  [|#|#####|#|]  [|#|#####|#|]  [|#|#####|  ]  [|#|#####| \]  [|#|#####| |]
[|#|#####|#|]  [|#|#####|#|]  [|#|#####|#|]  [|#|#####|  ]  [|#|#####|  ]  [|#|#####|  ]
[\_|#####|_/]  [\_|#####|_/]  [\_|#####|_/]  [\_|#####|  ]  [\_|#####|  ]  [\_|#####|  ]
[  /_____\  ]  [  /_____\  ]  [  /_____\  ]  [  /_____\  ]  [  /_____\  ]  [  /_____\  ]
[  |     |  ]  [  /     |  ]  [  |     \  ]  [  /     |  ]  [  |     |  ]  [  |     |  ]
[ _|     |_ ]  [ _/     |_ ]  [  |_     \_]  [ /      |_ ]  [ _|     |_ ]  [ _|     |_ ]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[  _=====_  ]  [  _=====_  ]  [  _=====_  ]  [ _===_ ]  [ _===_ ]  [ _===_ ]
[  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)|  ]  [ |o.o| ]  [ |o.o| ]  [ |o.o| ]
[  \_____/  ]  [  \_____/  ]  [  \_____/  ]  [ \___/ ]  [ \___/ ]  [ \___/ ]
[ __\###/__ ]  [ __\###/___]  [\_ \###/ _/]  [/#####\]  [/#####\]  [/#####\]
[/#########\]  [/#########\]  [ \/#####\/ ]  [|#|#|#|]  [|#|#|#|]  [|#|#|#|]
[|#|#[=]#|#|]  [\_|######|/]  [  |#####|  ]  [\_|#|_/]  [\_|#|_/]  [\_|#|_/]
[|#|#####|#|]  [/_/    \___]  [  |#####|  ]  [ _| |_ ]  [ _/ |_ ]  [ _| \_ ]
[\_|#####|_/]  [           ]  [  |#####|  ]  [       ]  [       ]  [       ]
[  /_____\  ]  [           ]  [  /_____\  ]  [       ]  [       ]  [       ]
[  |     |  ]  [           ]  [  /     \  ]  [       ]  [       ]  [       ]
[ _|     |_ ]  [           ]  [ /       \_]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[|o.o|]  [|o.o|]  [|o.o|]
[\___/]  [\___/]  [\___/]
[/###\]  [/###\]  [/###\]
[|###|]  [|###|]  [|###|]
[|   |]  [/   |]  [|   \]
```

Arrays:

```js
const krane = {
  hue: 0,
  level: 14,
  height: 2.15,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      " __\\###/__ ",
      "/#########\\",
      "|#|#####|#|",
      "|#|#####|#|",
      "\\_|#####|_/",
      "  /_____\\  ",
      "  |     |  ",
      " _|     |_ ",
    ],
    walk: [
      [
        "  _=====_  ",
        "  |(o.o)|  ",
        "  \\_____/  ",
        " __\\###/__ ",
        "/#########\\",
        "|#|#####|#|",
        "|#|#####|#|",
        "\\_|#####|_/",
        "  /_____\\  ",
        "  /     |  ",
        " _/     |_ ",
      ],
      [
        "  _=====_  ",
        "  |(o.o)|  ",
        "  \\_____/  ",
        " __\\###/__ ",
        "/#########\\",
        "|#|#####|#|",
        "|#|#####|#|",
        "\\_|#####|_/",
        "  /_____\\  ",
        "  |     \\  ",
        "  |_     \\_",
      ],
    ],
    throw: [
      "  _=====_ !",
      "  |(o.o)| |",
      "  \\_____/_/",
      " __\\###/#/ ",
      "/########  ",
      "|#|#####|  ",
      "|#|#####|  ",
      "\\_|#####|  ",
      "  /_____\\  ",
      "  /     |  ",
      " /      |_ ",
    ],
    reach: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      " __\\###/__ ",
      "/########|_",
      "|#|#####| \\",
      "|#|#####|  ",
      "\\_|#####|  ",
      "  /_____\\  ",
      "  |     |  ",
      " _|     |_ ",
    ],
    support: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      " __\\###/___",
      "/########|\\",
      "|#|#####| |",
      "|#|#####|  ",
      "\\_|#####|  ",
      "  /_____\\  ",
      "  |     |  ",
      " _|     |_ ",
    ],
    read: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      " __\\###/__ ",
      "/#########\\",
      "|#|#[=]#|#|",
      "|#|#####|#|",
      "\\_|#####|_/",
      "  /_____\\  ",
      "  |     |  ",
      " _|     |_ ",
    ],
    crouch: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      " __\\###/___",
      "/#########\\",
      "\\_|######|/",
      "/_/    \\___",
    ],
    stumble: [
      "  _=====_  ",
      "  |(o.o)|  ",
      "  \\_____/  ",
      "\\_ \\###/ _/",
      " \\/#####\\/ ",
      "  |#####|  ",
      "  |#####|  ",
      "  |#####|  ",
      "  /_____\\  ",
      "  /     \\  ",
      " /       \\_",
    ],
  },
  mid: {
    stand: [
      " _===_ ",
      " |o.o| ",
      " \\___/ ",
      "/#####\\",
      "|#|#|#|",
      "\\_|#|_/",
      " _| |_ ",
    ],
    walk: [
      [
        " _===_ ",
        " |o.o| ",
        " \\___/ ",
        "/#####\\",
        "|#|#|#|",
        "\\_|#|_/",
        " _/ |_ ",
      ],
      [
        " _===_ ",
        " |o.o| ",
        " \\___/ ",
        "/#####\\",
        "|#|#|#|",
        "\\_|#|_/",
        " _| \\_ ",
      ],
    ],
  },
  small: {
    stand: [
      "|o.o|",
      "\\___/",
      "/###\\",
      "|###|",
      "|   |",
    ],
    walk: [
      [
        "|o.o|",
        "\\___/",
        "/###\\",
        "|###|",
        "/   |",
      ],
      [
        "|o.o|",
        "\\___/",
        "/###\\",
        "|###|",
        "|   \\",
      ],
    ],
  },
  accent: {"glyph":"!","hue":1},
};
```

### Ines Okafor, the roof medic (`medic`)

Sheet:

```text
full stand     full walk 1    full walk 2    full radio     full reach     full support 
[   _____   ]  [   _____   ]  [   _____   ]  [   _____   ]  [   _____   ]  [   _____   ]
[  /==+==\  ]  [  /==+==\  ]  [  /==+==\  ]  [  /==+==\  ]  [  /==+==\  ]  [  /==+==\  ]
[  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)|(=]  [  |(o.o)|  ]  [  |(o.o)|  ]
[   _\|/_   ]  [   _\|/_   ]  [   _\|/_   ]  [   _\|/_ | ]  [   _\|/_   ]  [   _\|/_   ]
[ _/=====\_ ]  [ _/=====\_ ]  [ _/=====\_ ]  [ _/=====\| ]  [ _/=====\__]  [ _/=====\__]
[|=|##+##|=|]  [|=|##+##|=|]  [|=|##+##|=|]  [|=|##+##|/ ]  [|=|##+##| \]  [|=|##+##|\ ]
[|#|#===#|#|]  [|#|#===#|#|]  [|#|#===#|#|]  [|#|#===#|  ]  [|#|#===#|  ]  [|#|#===#| |]
[|_|#===#(=)]  [|_|#===#(=)]  [|_|#===#(=)]  [|_|#===#(=)]  [|_|#===#(=)]  [|_|#===#(=)]
[  |_____|  ]  [  |_____|  ]  [  |_____|  ]  [  |_____|  ]  [  |_____|  ]  [  |_____|  ]
[   |   |   ]  [   /   |   ]  [   |   \   ]  [   |   |   ]  [   |   |   ]  [   |   |   ]
[  _|   |_  ]  [  _/   |_  ]  [   |_   \_ ]  [  _|   |_  ]  [  _|   |_  ]  [  _|   |_  ]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[   _____   ]  [   _____   ]  [   _____   ]  [  ___  ]  [  ___  ]  [  ___  ]
[  /==+==\  ]  [  /==+==\  ]  [  /==+==\  ]  [ /=+=\ ]  [ /=+=\ ]  [ /=+=\ ]
[  |(o.o)|  ]  [  |(o.o)|  ]  [  |(o.o)|  ]  [ (o.o) ]  [ (o.o) ]  [ (o.o) ]
[   _\|/_   ]  [   _\|/_   ]  [ \ _\|/_ / ]  [ _\|/_ ]  [ _\|/_ ]  [ _\|/_ ]
[ _/=====\_ ]  [ _/=====\__]  [  \/===\/  ]  [|=#+#=|]  [|=#+#=|]  [|=#+#=|]
[|=|##+##|=|]  [|=|##+###|\]  [   |#+#|   ]  [|_#=#_|]  [|_#=#_|]  [|_#=#_|]
[|#|#[=]#|#|]  [/_/    \___]  [   |===|   ]  [ _| |_ ]  [ _/ |_ ]  [ _| \_ ]
[|_|#===#(=)]  [           ]  [   |###(=) ]  [       ]  [       ]  [       ]
[  |_____|  ]  [           ]  [  /_____\  ]  [       ]  [       ]  [       ]
[   |   |   ]  [           ]  [   /   \   ]  [       ]  [       ]  [       ]
[  _|   |_  ]  [           ]  [  /     \_ ]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[ /+\ ]  [ /+\ ]  [ /+\ ]
[ o.o ]  [ o.o ]  [ o.o ]
[|=+=|]  [|=+=|]  [|=+=|]
[|_#_|]  [|_#_|]  [|_#_|]
[ | | ]  [ / | ]  [ | \ ]
```

Arrays:

```js
const medic = {
  hue: 5,
  level: 14,
  height: 2.05,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      "   _\\|/_   ",
      " _/=====\\_ ",
      "|=|##+##|=|",
      "|#|#===#|#|",
      "|_|#===#(=)",
      "  |_____|  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    walk: [
      [
        "   _____   ",
        "  /==+==\\  ",
        "  |(o.o)|  ",
        "   _\\|/_   ",
        " _/=====\\_ ",
        "|=|##+##|=|",
        "|#|#===#|#|",
        "|_|#===#(=)",
        "  |_____|  ",
        "   /   |   ",
        "  _/   |_  ",
      ],
      [
        "   _____   ",
        "  /==+==\\  ",
        "  |(o.o)|  ",
        "   _\\|/_   ",
        " _/=====\\_ ",
        "|=|##+##|=|",
        "|#|#===#|#|",
        "|_|#===#(=)",
        "  |_____|  ",
        "   |   \\   ",
        "   |_   \\_ ",
      ],
    ],
    radio: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|(=",
      "   _\\|/_ | ",
      " _/=====\\| ",
      "|=|##+##|/ ",
      "|#|#===#|  ",
      "|_|#===#(=)",
      "  |_____|  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    reach: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      "   _\\|/_   ",
      " _/=====\\__",
      "|=|##+##| \\",
      "|#|#===#|  ",
      "|_|#===#(=)",
      "  |_____|  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    support: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      "   _\\|/_   ",
      " _/=====\\__",
      "|=|##+##|\\ ",
      "|#|#===#| |",
      "|_|#===#(=)",
      "  |_____|  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    read: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      "   _\\|/_   ",
      " _/=====\\_ ",
      "|=|##+##|=|",
      "|#|#[=]#|#|",
      "|_|#===#(=)",
      "  |_____|  ",
      "   |   |   ",
      "  _|   |_  ",
    ],
    crouch: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      "   _\\|/_   ",
      " _/=====\\__",
      "|=|##+###|\\",
      "/_/    \\___",
    ],
    stumble: [
      "   _____   ",
      "  /==+==\\  ",
      "  |(o.o)|  ",
      " \\ _\\|/_ / ",
      "  \\/===\\/  ",
      "   |#+#|   ",
      "   |===|   ",
      "   |###(=) ",
      "  /_____\\  ",
      "   /   \\   ",
      "  /     \\_ ",
    ],
  },
  mid: {
    stand: [
      "  ___  ",
      " /=+=\\ ",
      " (o.o) ",
      " _\\|/_ ",
      "|=#+#=|",
      "|_#=#_|",
      " _| |_ ",
    ],
    walk: [
      [
        "  ___  ",
        " /=+=\\ ",
        " (o.o) ",
        " _\\|/_ ",
        "|=#+#=|",
        "|_#=#_|",
        " _/ |_ ",
      ],
      [
        "  ___  ",
        " /=+=\\ ",
        " (o.o) ",
        " _\\|/_ ",
        "|=#+#=|",
        "|_#=#_|",
        " _| \\_ ",
      ],
    ],
  },
  small: {
    stand: [
      " /+\\ ",
      " o.o ",
      "|=+=|",
      "|_#_|",
      " | | ",
    ],
    walk: [
      [
        " /+\\ ",
        " o.o ",
        "|=+=|",
        "|_#_|",
        " / | ",
      ],
      [
        " /+\\ ",
        " o.o ",
        "|=+=|",
        "|_#_|",
        " | \\ ",
      ],
    ],
  },
  accent: {"glyph":"+","hue":6},
};
```

### Delphine Arlo, the Filament's singer (`performer`)

Sheet:

```text
full stand     full walk 1    full walk 2    full stage     full reach     full support 
[    ^^^    ]  [    ^^^    ]  [    ^^^    ]  [    ^^^    ]  [    ^^^    ]  [    ^^^    ]
[   _/=\_   ]  [   _/=\_   ]  [   _/=\_   ]  [   _/=\_   ]  [   _/=\_   ]  [   _/=\_   ]
[   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]
[    \|/    ]  [    \|/    ]  [    \|/    ]  [\_  \|/  _/]  [    \|/    ]  [    \|/    ]
[   /###\   ]  [   /###\   ]  [   /###\   ]  [  \_/###\_/]  [   /###\__ ]  [   /###\___]
[  (|###|)  ]  [  (|###|)  ]  [  (|###|)  ]  [   |###|   ]  [  (|###|  \]  [  (|###|\  ]
[   |###|   ]  [   |###|   ]  [   |###|   ]  [   |###|   ]  [   |###|   ]  [   |###| | ]
[  /#####\  ]  [  /#####\  ]  [  /#####\  ]  [  /#####\  ]  [  /#####\  ]  [  /#####\  ]
[ /#=#=#=#\ ]  [ /#=#=#=#\ ]  [ /#=#=#=#\ ]  [ /#=#=#=#\ ]  [ /#=#=#=#\ ]  [ /#=#=#=#\ ]
[/#=#=#=#=#\]  [/#=#=#=#=#\]  [/#=#=#=#=#\]  [/#=#=#=#=#\]  [/#=#=#=#=#\]  [/#=#=#=#=#\]
[|_________|]  [|________/ ]  [ \________|]  [|_________|]  [|_________|]  [|_________|]

full read      full crouch    full stumble   mid stand  mid walk 1  mid walk 2
[    ^^^    ]  [    ^^^    ]  [    ^^^    ]  [  ^^^  ]  [  ^^^  ]  [  ^^^  ]
[   _/=\_   ]  [   _/=\_   ]  [   _/=\_   ]  [ _/=\_ ]  [ _/=\_ ]  [ _/=\_ ]
[   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [ (o.o) ]  [ (o.o) ]  [ (o.o) ]
[    \|/    ]  [    \|/    ]  [ \ _\|/_ / ]  [  |#|  ]  [  |#|  ]  [  |#|  ]
[   /###\   ]  [   /###\__ ]  [  \/###\/  ]  [ /###\ ]  [ /###\ ]  [ /###\ ]
[  (|[=]|)  ]  [ _/#=#=#=\ ]  [   |###|   ]  [/#=#=#\]  [/#=#=#\]  [/#=#=#\]
[   |###|   ]  [/_________\]  [   |###|   ]  [|_____|]  [|____/ ]  [ \____|]
[  /#####\  ]  [           ]  [  /#####\  ]  [       ]  [       ]  [       ]
[ /#=#=#=#\ ]  [           ]  [ /#=#=#=#\ ]  [       ]  [       ]  [       ]
[/#=#=#=#=#\]  [           ]  [/#=#=#=#=#\]  [       ]  [       ]  [       ]
[|_________|]  [           ]  [|________/ ]  [       ]  [       ]  [       ]

small stand  small walk 1  small walk 2
[ ^^^ ]  [ ^^^ ]  [ ^^^ ]
[ o.o ]  [ o.o ]  [ o.o ]
[ |#| ]  [ |#| ]  [ |#| ]
[/#=#\]  [/#=#\]  [/#=#\]
[|___|]  [|__/ ]  [ \__|]
```

Arrays:

```js
const performer = {
  hue: 6,
  level: 14,
  height: 2.1,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "    \\|/    ",
      "   /###\\   ",
      "  (|###|)  ",
      "   |###|   ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|_________|",
    ],
    walk: [
      [
        "    ^^^    ",
        "   _/=\\_   ",
        "   (o.o)   ",
        "    \\|/    ",
        "   /###\\   ",
        "  (|###|)  ",
        "   |###|   ",
        "  /#####\\  ",
        " /#=#=#=#\\ ",
        "/#=#=#=#=#\\",
        "|________/ ",
      ],
      [
        "    ^^^    ",
        "   _/=\\_   ",
        "   (o.o)   ",
        "    \\|/    ",
        "   /###\\   ",
        "  (|###|)  ",
        "   |###|   ",
        "  /#####\\  ",
        " /#=#=#=#\\ ",
        "/#=#=#=#=#\\",
        " \\________|",
      ],
    ],
    stage: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "\\_  \\|/  _/",
      "  \\_/###\\_/",
      "   |###|   ",
      "   |###|   ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|_________|",
    ],
    reach: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "    \\|/    ",
      "   /###\\__ ",
      "  (|###|  \\",
      "   |###|   ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|_________|",
    ],
    support: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "    \\|/    ",
      "   /###\\___",
      "  (|###|\\  ",
      "   |###| | ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|_________|",
    ],
    read: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "    \\|/    ",
      "   /###\\   ",
      "  (|[=]|)  ",
      "   |###|   ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|_________|",
    ],
    crouch: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      "    \\|/    ",
      "   /###\\__ ",
      " _/#=#=#=\\ ",
      "/_________\\",
    ],
    stumble: [
      "    ^^^    ",
      "   _/=\\_   ",
      "   (o.o)   ",
      " \\ _\\|/_ / ",
      "  \\/###\\/  ",
      "   |###|   ",
      "   |###|   ",
      "  /#####\\  ",
      " /#=#=#=#\\ ",
      "/#=#=#=#=#\\",
      "|________/ ",
    ],
  },
  mid: {
    stand: [
      "  ^^^  ",
      " _/=\\_ ",
      " (o.o) ",
      "  |#|  ",
      " /###\\ ",
      "/#=#=#\\",
      "|_____|",
    ],
    walk: [
      [
        "  ^^^  ",
        " _/=\\_ ",
        " (o.o) ",
        "  |#|  ",
        " /###\\ ",
        "/#=#=#\\",
        "|____/ ",
      ],
      [
        "  ^^^  ",
        " _/=\\_ ",
        " (o.o) ",
        "  |#|  ",
        " /###\\ ",
        "/#=#=#\\",
        " \\____|",
      ],
    ],
  },
  small: {
    stand: [
      " ^^^ ",
      " o.o ",
      " |#| ",
      "/#=#\\",
      "|___|",
    ],
    walk: [
      [
        " ^^^ ",
        " o.o ",
        " |#| ",
        "/#=#\\",
        "|__/ ",
      ],
      [
        " ^^^ ",
        " o.o ",
        " |#| ",
        "/#=#\\",
        " \\__|",
      ],
    ],
  },
  accent: {"glyph":"^","hue":2},
};
```

### Director Maren Coyle, Lumen Board (`ashe`)

Sheet:

```text
full stand     full walk 1    full walk 2    full reach     full support   full read    
[   _______ ]  [   _______ ]  [   _______ ]  [   _______ ]  [   _______ ]  [   _______ ]
[  /=======\]  [  /=======\]  [  /=======\]  [  /=======\]  [  /=======\]  [  /=======\]
[ /__|___|_\]  [ /__|___|_\]  [ /__|___|_\]  [ /__|___|_\]  [ /__|___|_\]  [ /__|___|_\]
[  (o.o) |  ]  [  (o.o) |  ]  [  (o.o) |  ]  [  (o.o) |  ]  [  (o.o) |  ]  [  (o.o) |  ]
[  _\|/_ |  ]  [  _\|/_ |  ]  [  _\|/_ |  ]  [  _\|/_ |  ]  [  _\|/_ |  ]  [  _\|/_ |  ]
[ /#&#:#\|  ]  [ /#&#:#\|  ]  [ /#&#:#\|  ]  [ /#&#:#\|  ]  [ /#&#:#\|  ]  [ /#&#:#\|  ]
[ ||##:#|/  ]  [ ||##:#|/  ]  [ ||##:#|/  ]  [_/|##:#|/  ]  [_/|##:#|/  ]  [ ||#[=]|/  ]
[  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]  [\ |##:#|   ]  [  |##:#|   ]
[  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]  [  |##:#|   ]
[  /__:_\   ]  [  /__:_\   ]  [  /__:_\   ]  [  /__:_\   ]  [  /__:_\   ]  [  /__:_\   ]
[   | |     ]  [  _/  |    ]  [   |  \_   ]  [   | |     ]  [   | |     ]  [   | |     ]

full crouch    full stumble   mid stand  mid walk 1  mid walk 2  small stand
[   _______ ]  [   _______ ]  [ _____ ]  [ _____ ]  [ _____ ]  [/===\]
[  /=======\]  [  /=======\]  [/=====\]  [/=====\]  [/=====\]  [ o.o|]
[ /__|___|_\]  [ /__|___|_\]  [/____|\]  [/____|\]  [/____|\]  [ #&#|]
[  (o.o) |  ]  [  (o.o) |  ]  [(o.o)| ]  [(o.o)| ]  [(o.o)| ]  [ |#| ]
[  _\|/_ |  ]  [\ _\|/_ |/ ]  [ /#&\| ]  [ /#&\| ]  [ /#&\| ]  [  |  ]
[ /#&##:#\|_]  [ \/#&#:\/  ]  [ |#:|/ ]  [ |#:|/ ]  [ |#:|/ ]  [     ]
[/_/    \___]  [  |##:#|   ]  [  | |  ]  [ _/ |  ]  [  | \_ ]  [     ]
[           ]  [  |##:#|   ]  [       ]  [       ]  [       ]  [     ]
[           ]  [  /__:_\   ]  [       ]  [       ]  [       ]  [     ]
[           ]  [  /   \    ]  [       ]  [       ]  [       ]  [     ]
[           ]  [ /     \_  ]  [       ]  [       ]  [       ]  [     ]

small walk 1  small walk 2
[/===\]  [/===\]
[ o.o|]  [ o.o|]
[ #&#|]  [ #&#|]
[ |#| ]  [ |#| ]
[ /|  ]  [  |\ ]
```

Arrays:

```js
const coyle = {
  hue: 7,
  level: 14,
  height: 2.15,
  heights: {"crouch":1.35},
  full: {
    stand: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "  _\\|/_ |  ",
      " /#&#:#\\|  ",
      " ||##:#|/  ",
      "  |##:#|   ",
      "  |##:#|   ",
      "  /__:_\\   ",
      "   | |     ",
    ],
    walk: [
      [
        "   _______ ",
        "  /=======\\",
        " /__|___|_\\",
        "  (o.o) |  ",
        "  _\\|/_ |  ",
        " /#&#:#\\|  ",
        " ||##:#|/  ",
        "  |##:#|   ",
        "  |##:#|   ",
        "  /__:_\\   ",
        "  _/  |    ",
      ],
      [
        "   _______ ",
        "  /=======\\",
        " /__|___|_\\",
        "  (o.o) |  ",
        "  _\\|/_ |  ",
        " /#&#:#\\|  ",
        " ||##:#|/  ",
        "  |##:#|   ",
        "  |##:#|   ",
        "  /__:_\\   ",
        "   |  \\_   ",
      ],
    ],
    reach: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "  _\\|/_ |  ",
      " /#&#:#\\|  ",
      "_/|##:#|/  ",
      "  |##:#|   ",
      "  |##:#|   ",
      "  /__:_\\   ",
      "   | |     ",
    ],
    support: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "  _\\|/_ |  ",
      " /#&#:#\\|  ",
      "_/|##:#|/  ",
      "\\ |##:#|   ",
      "  |##:#|   ",
      "  /__:_\\   ",
      "   | |     ",
    ],
    read: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "  _\\|/_ |  ",
      " /#&#:#\\|  ",
      " ||#[=]|/  ",
      "  |##:#|   ",
      "  |##:#|   ",
      "  /__:_\\   ",
      "   | |     ",
    ],
    crouch: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "  _\\|/_ |  ",
      " /#&##:#\\|_",
      "/_/    \\___",
    ],
    stumble: [
      "   _______ ",
      "  /=======\\",
      " /__|___|_\\",
      "  (o.o) |  ",
      "\\ _\\|/_ |/ ",
      " \\/#&#:\\/  ",
      "  |##:#|   ",
      "  |##:#|   ",
      "  /__:_\\   ",
      "  /   \\    ",
      " /     \\_  ",
    ],
  },
  mid: {
    stand: [
      " _____ ",
      "/=====\\",
      "/____|\\",
      "(o.o)| ",
      " /#&\\| ",
      " |#:|/ ",
      "  | |  ",
    ],
    walk: [
      [
        " _____ ",
        "/=====\\",
        "/____|\\",
        "(o.o)| ",
        " /#&\\| ",
        " |#:|/ ",
        " _/ |  ",
      ],
      [
        " _____ ",
        "/=====\\",
        "/____|\\",
        "(o.o)| ",
        " /#&\\| ",
        " |#:|/ ",
        "  | \\_ ",
      ],
    ],
  },
  small: {
    stand: [
      "/===\\",
      " o.o|",
      " #&#|",
      " |#| ",
      "  |  ",
    ],
    walk: [
      [
        "/===\\",
        " o.o|",
        " #&#|",
        " |#| ",
        " /|  ",
      ],
      [
        "/===\\",
        " o.o|",
        " #&#|",
        " |#| ",
        "  |\\ ",
      ],
    ],
  },
  accent: {"glyph":"&","hue":1},
};
```

### Extras (patrons, market crowd, buyers) (`generic`)

Sheet:

```text
full stand     full walk 1    full walk 2    full stumble   mid stand  mid walk 1
[    ___    ]  [    ___    ]  [    ___    ]  [    ___    ]  [  ___  ]  [  ___  ]
[   /===\   ]  [   /===\   ]  [   /===\   ]  [   /===\   ]  [  /=\  ]  [  /=\  ]
[   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [   (o.o)   ]  [ (o.o) ]  [ (o.o) ]
[    /|\    ]  [    /|\    ]  [    /|\    ]  [ \  /|\  / ]  [  /|\  ]  [  /|\  ]
[   /###\   ]  [   /###\   ]  [   /###\   ]  [  \/###\/  ]  [ /###\ ]  [ /###\ ]
[  /#####\  ]  [  /#####\  ]  [  /#####\  ]  [  |#####|  ]  [ |###| ]  [ |###| ]
[  |#####|  ]  [  |#####|  ]  [  |#####|  ]  [  |#####|  ]  [  | |  ]  [  / |  ]
[  |#####|  ]  [  |#####|  ]  [  |#####|  ]  [  |#####|  ]  [       ]  [       ]
[   /###\   ]  [   /###\   ]  [   /###\   ]  [   /###\   ]  [       ]  [       ]
[    | |    ]  [   /   |   ]  [   |   \   ]  [   /   |   ]  [       ]  [       ]
[    | |    ]  [ _/    |_  ]  [  _|    \_ ]  [  /    |_  ]  [       ]  [       ]

mid walk 2  small stand  small walk 1  small walk 2
[  ___  ]  [  _  ]  [  _  ]  [  _  ]
[  /=\  ]  [ o.o ]  [ o.o ]  [ o.o ]
[ (o.o) ]  [ |#| ]  [ |#| ]  [ |#| ]
[  /|\  ]  [ |#| ]  [ |#| ]  [ |#| ]
[ /###\ ]  [ | | ]  [ / | ]  [ | \ ]
[ |###| ]  [     ]  [     ]  [     ]
[  | \  ]  [     ]  [     ]  [     ]
```

Arrays:

```js
const generic = {
  hue: 6,
  level: 11,
  height: 2.05,
  heights: {},
  full: {
    stand: [
      "    ___    ",
      "   /===\\   ",
      "   (o.o)   ",
      "    /|\\    ",
      "   /###\\   ",
      "  /#####\\  ",
      "  |#####|  ",
      "  |#####|  ",
      "   /###\\   ",
      "    | |    ",
      "    | |    ",
    ],
    walk: [
      [
        "    ___    ",
        "   /===\\   ",
        "   (o.o)   ",
        "    /|\\    ",
        "   /###\\   ",
        "  /#####\\  ",
        "  |#####|  ",
        "  |#####|  ",
        "   /###\\   ",
        "   /   |   ",
        " _/    |_  ",
      ],
      [
        "    ___    ",
        "   /===\\   ",
        "   (o.o)   ",
        "    /|\\    ",
        "   /###\\   ",
        "  /#####\\  ",
        "  |#####|  ",
        "  |#####|  ",
        "   /###\\   ",
        "   |   \\   ",
        "  _|    \\_ ",
      ],
    ],
    stumble: [
      "    ___    ",
      "   /===\\   ",
      "   (o.o)   ",
      " \\  /|\\  / ",
      "  \\/###\\/  ",
      "  |#####|  ",
      "  |#####|  ",
      "  |#####|  ",
      "   /###\\   ",
      "   /   |   ",
      "  /    |_  ",
    ],
  },
  mid: {
    stand: [
      "  ___  ",
      "  /=\\  ",
      " (o.o) ",
      "  /|\\  ",
      " /###\\ ",
      " |###| ",
      "  | |  ",
    ],
    walk: [
      [
        "  ___  ",
        "  /=\\  ",
        " (o.o) ",
        "  /|\\  ",
        " /###\\ ",
        " |###| ",
        "  / |  ",
      ],
      [
        "  ___  ",
        "  /=\\  ",
        " (o.o) ",
        "  /|\\  ",
        " /###\\ ",
        " |###| ",
        "  | \\  ",
      ],
    ],
  },
  small: {
    stand: [
      "  _  ",
      " o.o ",
      " |#| ",
      " |#| ",
      " | | ",
    ],
    walk: [
      [
        "  _  ",
        " o.o ",
        " |#| ",
        " |#| ",
        " / | ",
      ],
      [
        "  _  ",
        " o.o ",
        " |#| ",
        " |#| ",
        " | \\ ",
      ],
    ],
  },
  accent: null,
};
```
## Verification

The sheets were built and checked with a Node script that loads every sprite, asserts equal row widths, the printable-ASCII range, the face-glyph rule (only `o . >`, in one row, never elsewhere), the glyph sets above and the presence of each accent, then prints every sprite authored and as the engine samples it at 11, 7 and 5 rows, and a distinctness matrix (fraction of differing cells between each pair of `stand` sprites). Final results: all 130 sprite arrays pass; the least distinct named pair is Vale/Okafor at full size (0.31 of cells differ, with different hats, accents and hues) and Bell/Vale at small size (0.40). The script and its source live in the session scratchpad (`sprites.mjs`, `check.mjs`, `emit.mjs`); `sprites.json` is emitted from the same source, so the arrays in this document and the file are identical.

## Decisions taken

1. **Rook's approved art is kept.** His `watch`, `walk`, `reach`, `read` and `crouch` rows are the ones the engine draws today, transcribed. `stand` (arms down along the coat) and `support` (arm over the other person's shoulder) are new variants of the same figure, and `stumble` is new. `watch` stays the pose of the first frame.
2. **The bridge operator has no sprite.** She is voice only, as briefed. If a later set ever shows the bridge control box, she gets a cameo built from the extra with hue 1; nothing here depends on it.
3. **Bell is ten rows and 1.95 units tall.** Everyone else is 11 rows at 2.05 to 2.15. His shortness is part of his silhouette, so `actor()` needs the height to come from the sprite table rather than the `isRook` branch.
4. **Accent hues avoid clashes inside a set.** Vale's badge is white, not amber, because Arlo's amber plume shares the club with him and the club's neon is red. Coyle's pin is cyan, not amber, so it does not read as a lamp. Krane's bottle is cyan because glass is hue 1 in the material list, and it exists only in the throw pose so the accent never sits on him otherwise.
5. **Nell's pole is in her left hand (column 0) and the lantern in her right.** The pole gives her a full-height vertical that reads at every size and stays out of the way of her reaching arm. The physical lantern box the street set draws beside the courier (`p.x - .7 .. p.x - .43`) should move to her right side (`p.x + .43 .. p.x + .7`) or be dropped in favour of the sprite's `@`; if it stays, it stays as the light source that pools on the floor.
6. **Nell's limp lives in the walk frames.** Her right leg never swings, so the `lean` parameter is free for the stumble and the watch beat ("keeps weight off one leg") is visible before the caption says it.
7. **Arlo has no legs.** The gown hem sways between walk frames. She walks rarely and never in a prompt.
8. **Coyle's umbrella is part of her sprite.** It takes the top three rows, so under a 2.15 height her body is drawn a little shorter than Vale's; that is acceptable because she is never in a prompt and always framed from a distance or a low angle. Her `stumble` and `crouch` keep the umbrella up; she does not drop it.
9. **The book prop keeps `[` `]`.** Rook's existing read pose already uses them; every `read` pose here does the same and no other pose may.
10. **Reduced sizes cover `stand` and `walk` only.** Every other pose happens near the camera; the engine's sampling of the full sprite is adequate there, and hand-drawing 7 by 7 crouches would not be seen.
11. **One extra sprite, no variants.** Crowd variety comes from hue, placement, seating offset and the two walk frames. If the Night Market needs more, the first variant to add is a hooded one built from Nell's hood without the pole.
12. **Names invented here:** Ines Okafor (medic), Heddy Lasko (bridge operator), Delphine Arlo (singer), Maren Coyle (Lumen Board). Rook's first name is deliberately not given. Krane has no first name on the record.
13. **Faces stay in the character's hue** for everyone but Rook, as today. If the team wants white faces for all named characters, it is a one-line change in `inkFor`, and no sprite here would need to change.
14. **`sprites.json` matches the loader in progress.** Beyond the required shape (`full`, `mid`, `small`, `accent`) each entry carries `hue`, `level`, `faceHue` (Rook), `height` and `heights`, which is what `loadSprites()` in `src/game/sprites.js` reads, and the extras publish as `generic`, the name it falls back to. Two things for that loader when it takes these sheets: its fill-priority list (`spriteFill`) should include the accent glyphs `Y`, `!` and `^` so they survive a squeeze the way `@`, `+` and `&` already do; and its walk frames start on the opposite leg from these, which does not matter. Nothing in `src/` was modified by this document.
