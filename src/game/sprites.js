// Character sprite sheets and their loader.
// A character has up to four resolutions (hero, full, mid, small), each holding text poses. actor() in runtime.js
// picks the sheet that fits the projected size and draws it in whole screen cells, so glyphs never tile or shimmer.
// docs/design/sprites.json (same shape as the defaults below) is inlined by the build and loaded over the defaults.
const SPRITE_SIZES=['hero','full','mid','small']; // hero: a close-up sheet for the menu tableau; most characters have none
const SPRITE_MIN_SCALE=.7; // a sheet is never squeezed below this in either axis; a smaller sheet is stretched instead
const SPRITE_ALIAS={watch:'stand',smoke:'stand'}; // poses that may borrow another pose at sizes where they are not drawn
const spriteFace=g=>g==='o'||g==='.'||g==='>';
const spriteOutline=g=>g==='/'||g==='\\'||g==='|'||g==='('||g===')'||g==='_';
const spriteFill=g=>'#=:-~%@+xX*&'.includes(g);
const spriteSheets={};
const spriteWarnings=[];
const defaultSprites={
 rook:{
  hue:1,faceHue:6,level:14,height:2.15,heights:{crouch:1.35},accent:{glyph:'~',hue:2},
  full:{
   stand:['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#\\   ',' /|#####|\\ ','  |#####|  ','  /#####\\  ',' /___|___\\ ','    | |    ','   _| |_   '],
   walk:[['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#\\   ',' /|#####|\\ ','  |#####|  ','  /#####\\  ',' /___|___\\ ','   |   \\   ','  _|    \\_ '],
         ['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#\\   ',' /|#####|\\ ','  |#####|  ','  /#####\\  ',' /___|___\\ ','   /   |   ',' _/    |_  ']],
   reach:['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#|__ ','  |#####| \\','  |#####|  ','  /#####\\  ',' /___|___\\ ','    | |    ','   _| |_   '],
   support:['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#|__ ','  |#####| \\','  |#####|  ','  /#####\\  ',' /___|___\\ ','    | |    ','   _| |_   '],
   read:['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#|__ ','  |####|=[]','  |#####|  ','  /#####\\  ',' /___|___\\ ','    | |    ','   _| |_   '],
   crouch:['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /####\\__ ',' /######|\\ ','/_/   \\___ ']
  },
  mid:{
   stand:[' _/==\\_','  (o_> ','  /|~\\ ',' /##~#\\',' |####|',' /_|_\\ ',' _| |_ '],
   walk:[[' _/==\\_','  (o_> ','  /|~\\ ',' /##~#\\',' |####|',' /_|_\\ ',' _|  \\_'],
         [' _/==\\_','  (o_> ','  /|~\\ ',' /##~#\\',' |####|',' /_|_\\ ',' _/  |_']],
   reach:[' _/==\\_','  (o_> ','  /|~\\ ',' /##~#|',' |###|_',' /_|_\\ ',' _| |_ '],
   support:[' _/==\\_','  (o_> ','  /|~\\ ',' /##~#|',' |###|_',' /_|_\\ ',' _| |_ '],
   read:[' _/==\\_','  (o_> ','  /|~\\ ',' /##~#|',' |###[]',' /_|_\\ ',' _| |_ '],
   crouch:[' _/==\\_','  (o_> ',' /###\\_','/#####|','/_/ \\__']
  },
  small:{
   stand:[' _=_ ',' (o> ',' /#\\ ','|###|',' | | '],
   walk:[[' _=_ ',' (o> ',' /#\\ ','|###|',' | | '],[' _=_ ',' (o> ',' /#\\ ','|###|',' / \\ ']],
   reach:[' _=_ ',' (o> ',' /#|_','|###|',' | | '],
   support:[' _=_ ',' (o> ',' /#|_','|###|',' | | '],
   read:[' _=_ ',' (o> ',' /#|_','|###|',' | | '],
   crouch:[' (o> ',' /##\\','/_\\__']
  }
 },
 generic:{
  hue:6,level:11,height:2.05,
  full:{
   stand:['   ___   ',' _/===\\_ ','  (o.o)  ','   /|\\   ','  /###\\  ',' /#####\\ ',' |#####| ','  /###\\  ','   | |   ','   | |   '],
   walk:[['   ___   ',' _/===\\_ ','  (o.o)  ','   /|\\   ','  /###\\  ',' /#####\\ ',' |#####| ','  /###\\  ','  |   \\  ',' _|    \\_'],
         ['   ___   ',' _/===\\_ ','  (o.o)  ','   /|\\   ','  /###\\  ',' /#####\\ ',' |#####| ','  /###\\  ','  /   |  ','_/    |_ ']],
   stumble:['   ___   ',' _/===\\_ ','  (o.o)  ','\\  /|\\  /',' \\/###\\/ ',' /#####\\ ',' |#####| ','  /###\\  ','  /   |  ','   | |   ']
  },
  mid:{
   stand:[' _/=\\_ ',' (o.o) ','  /|\\  ',' /###\\ ',' |###| ','  /#\\  ','  | |  '],
   walk:[[' _/=\\_ ',' (o.o) ','  /|\\  ',' /###\\ ',' |###| ','  /#\\  ','  | \\  '],[' _/=\\_ ',' (o.o) ','  /|\\  ',' /###\\ ',' |###| ','  /#\\  ','  / |  ']],
   stumble:[' _/=\\_ ',' (o.o) ','\\ /|\\ /',' \\/#\\/ ',' |###| ','  /#\\  ','  / |  ']
  },
  small:{
   stand:[' _=_ ','(o.o)',' /#\\ ','|###|',' | | '],
   walk:[[' _=_ ','(o.o)',' /#\\ ','|###|',' | \\ '],[' _=_ ','(o.o)',' /#\\ ','|###|',' / | ']],
   stumble:[' _=_ ','(o.o)','\\/#\\/','|###|',' / | ']
  }
 }
};
// Registers sheets from data shaped like defaultSprites (and docs/design/sprites.json). A character that already
// exists keeps whatever the new data leaves out, so a file can supply only one size or one pose. Returns warnings.
function loadSprites(data){
 const warnings=[];
 for(const [name,raw] of Object.entries(data||{})){
  if(!raw||typeof raw!=='object'){warnings.push(name+': expected an object');continue;}
  const prev=spriteSheets[name]||{};
  // `accent` is one {glyph, hue} or a list of them (Rook: the amber scarf and the rose ember). `accent` on the sheet stays
  // the first for callers that expect one; `accentHues` maps every accent glyph to its hue.
  const accentOf=x=>x&&typeof x.glyph==='string'&&x.glyph.length===1&&/[ -~]/.test(x.glyph)?{glyph:x.glyph,hue:Number.isInteger(x.hue)?x.hue:2}:null;
  const accents=raw.accent===undefined?prev.accents||[]:(Array.isArray(raw.accent)?raw.accent:[raw.accent]).map(accentOf).filter(Boolean);
  const sheet={hue:Number.isInteger(raw.hue)?raw.hue:prev.hue??6,faceHue:Number.isInteger(raw.faceHue)?raw.faceHue:prev.faceHue??null,level:Number.isInteger(raw.level)?raw.level:prev.level??11,height:typeof raw.height==='number'&&raw.height>0?raw.height:prev.height??2.05,heights:{...(prev.heights||{}),...(raw.heights&&typeof raw.heights==='object'?raw.heights:{})},accent:accents[0]||null,accents,accentHues:Object.fromEntries(accents.map(x=>[x.glyph,x.hue])),sizes:{...(prev.sizes||{})}};
  for(const size of SPRITE_SIZES){
   const poses=raw[size];if(poses===undefined)continue;
   if(!poses||typeof poses!=='object'){warnings.push(`${name}.${size}: expected an object of poses`);continue;}
   const out={};let cols=0;
   for(const [pose,value] of Object.entries(poses)){
    const list=Array.isArray(value)&&Array.isArray(value[0])?value:[value],ok=[];
    for(const frame of list){
     if(!Array.isArray(frame)||!frame.length||!frame.every(r=>typeof r==='string'&&r.length)){warnings.push(`${name}.${size}.${pose}: a frame is an array of row strings`);continue;}
     if(frame.some(r=>/[^ -~]/.test(r))){warnings.push(`${name}.${size}.${pose}: rows must be printable ASCII (codes 32 to 126)`);continue;}
     ok.push(frame);for(const r of frame)cols=Math.max(cols,r.length);
    }
    if(ok.length)out[pose]=ok;
   }
   if(!out.stand){warnings.push(`${name}.${size}: needs a stand pose; sheet ignored`);continue;}
   for(const pose of Object.keys(out))out[pose]=out[pose].map(f=>f.map(r=>r.padEnd(cols)));
   sheet.sizes[size]={cols,poses:out};
  }
  if(!Object.keys(sheet.sizes).length){warnings.push(name+': no usable sheet');continue;}
  spriteSheets[name]=sheet;
 }
 spriteWarnings.push(...warnings);
 return warnings;
}
function spriteFor(who){return spriteSheets[who]||spriteSheets.generic;}
// Spaces are transparent unless the sprite encloses them (the inside of a head, a hat crown): those are part of the
// body and are drawn as opaque blanks. Computed once per frame of art by flood-filling spaces from the sheet border.
const spriteHoleCache=new WeakMap();
function spriteHoles(rows){
 let holes=spriteHoleCache.get(rows);if(holes)return holes;
 const R=rows.length,C=rows[0].length;holes=new Uint8Array(R*C);
 for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(rows[r][c]===' ')holes[r*C+c]=1;
 const stack=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++)if((r===0||c===0||r===R-1||c===C-1)&&holes[r*C+c]){holes[r*C+c]=0;stack.push(r,c);}
 while(stack.length){const c=stack.pop(),r=stack.pop();for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const rr=r+dr,cc=c+dc;if(rr>=0&&rr<R&&cc>=0&&cc<C&&holes[rr*C+cc]){holes[rr*C+cc]=0;stack.push(rr,cc);}}}
 spriteHoleCache.set(rows,holes);return holes;
}
function spriteHeight(sheet,pose){return sheet.heights[pose]??(pose==='crouch'?sheet.height*.63:sheet.height);}
// The frames of a pose at one size, or null when that size does not draw it (an alias such as watch->stand may stand in).
function spriteFrames(sheet,size,pose){const s=sheet.sizes[size];return s?s.poses[pose]||(SPRITE_ALIAS[pose]&&s.poses[SPRITE_ALIAS[pose]])||null:null;}
// The hero tier is a close-up for poses drawn nowhere else (Rook's `smoke` in the menu tableau). It is never chosen for a
// pose the full sheet draws itself, so a story shot that walks a character past the camera keeps the approved art.
const heroDraws=(sheet,pose)=>!!(sheet.sizes.hero&&sheet.sizes.hero.poses[pose]&&!(sheet.sizes.full&&sheet.sizes.full.poses[pose]));
const spriteDraws=(sheet,size,pose)=>spriteFrames(sheet,size,pose)&&(size!=='hero'||heroDraws(sheet,pose));
// Chooses the sheet for a projected size of h rows by w columns: among the sizes that draw the pose, the largest one
// that is not squeezed below SPRITE_MIN_SCALE in rows or columns, else the smallest of them. A pose no size draws
// falls back to stand. Returns {size, frames}.
function spriteSize(sheet,pose,h,w){
 let sizes=SPRITE_SIZES.filter(size=>spriteDraws(sheet,size,pose));
 if(!sizes.length){pose='stand';sizes=SPRITE_SIZES.filter(size=>spriteDraws(sheet,size,pose));}
 let pick=null;
 for(const size of sizes){
  const frames=spriteFrames(sheet,size,pose);pick={size,frames};
  if(w/sheet.sizes[size].cols>=SPRITE_MIN_SCALE&&h/frames[0].length>=SPRITE_MIN_SCALE)break;
 }
 return pick;
}
loadSprites(defaultSprites);
/* SPRITE_SHEETS */
