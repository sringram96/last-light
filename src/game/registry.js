// Set and phase registries. A set is one module under src/game/sets/ that registers its picture (geometry, camera,
// blocking, labels, exit) and its beats (phases as data). The story driver in case.js reads these first and falls back
// to the hand-written code for the original sets.
//
// registerSet(name,{
//  chapter:'01b / THE DEPOT LOFT', card:'THE DEPOT LOFT', description:'aria text', objective:(phase)=>'WHAT BELL KNEW',
//  moving:false, speed:(phase)=>units per second (moving sets), rain:false|true|(x,z)=>boolean,
//  build(){ geometry into surfaces/lamps }, start(){ return look(...) }, shot(phase){ return look(...) },
//  ease(phase){ seconds the camera takes to reach shot(phase) }, blocking(phase){ return {rook,courier,others} },
//  geometry(phase){ per-frame geometry }, labels(phase){ worldLabel(...) }, exit(){ return [x,y,z] },
//  preview(){ set up state for the scene reel; return the phase to enter }
// })
// registerPhases('loft',{ loftEntry:{ kind:'cutscene', title:'THE DEPOT LOFT', duration:7, next:'loftTable',
//  caption:()=>'...', enter:()=>{ fields, addClue(...) }, buttons:(button)=>{ button('[LABEL]',()=>enter('x')) } }, ... })
// Kinds: cutscene (duration seconds, then next), quiet (waits for a button), observe (8 seconds, then next),
// windup (1.5 to 2.5 seconds jittered, no card, then next),
// prompt (cues:[{dir:'left'|'right'|'up'|'down', label:'[1] ...' for the untimed button, id, act()}], one directional input;
//  the window is base seconds +0.5 when bonus() and -0.5 when penalty(), clamped 1.25..3.5, or window() returning seconds
//  already clamped; a timeout or a wrong direction goes to death:'<death phase>' (lethal) or miss:'<result phase>' (survivable,
//  with a late() that writes the miss value); next = the result after a landed cue),
// result (stinger():[text,tone], duration seconds unless a rewind is offered, rewind:{miss(),back,reset()}, next),
// death ({duration:4, caption(), stinger(), dead:'pump'|'market'|'carrier'|'gap'|'pier'|'rack', bit, back:'<windup>', reset()}:
//  a lamp goes on entry and deaths gains bit; after the duration the night rewinds to back, or the case goes cold).
// investigate (untimed; field:'officeLooked' names the saved bitmask of examined spots, never reset by enter();
//  spots:[{id, bit, at:()=>[x,y,z] the marker's world point, label:'[1] THE BELL FILE', look:()=>caption when examined,
//  shot?:()=>look(...) the camera while it is selected, ease?:seconds, clue?:string|()=>string added on the first look,
//  enter?:()=>void on the first look, after?:bit of another spot that must be examined before this one shows}],
//  need: examined spots before the exit shows, step:'Looked over the desk' for the route line,
//  exit:{label:'[TAKE THE STAIRS]', next:'brief', early?:{label, next, when:()=>bool} an exit offered while when() holds}).
// examine (untimed; an object turned over in an insert shot, see examine.js: field, step, back:'<phase to return to>',
//  model(solid,ellipsoid), marks and details [{id, bit, label, at, normal, lines, look, clue?}] read only while their face
//  is toward the camera). A look-around spot can pick one up: pick:{label:'[TURN THE PADLOCK OVER]', phase:'pumpPadlock'}.
// A phase registered with set '*' (coldCase) belongs to whichever set the story is in.
const sets={},phaseDefs={};
function registerSet(name,def){sets[name]={name,...def};}
function registerPhases(setName,defs){for(const [id,def] of Object.entries(defs))phaseDefs[id]={id,set:setName,...def};}
function phaseDef(p){return phaseDefs[p===undefined?state.phase:p]||null;}
const nextOf=d=>typeof d.next==='function'?d.next():d.next;
// Derived story terms, never stored: what Rook is holding and where the pursuit stands.
const ledgerHeld=()=>state.rescue==='valve'&&state.club!=='late';
const manifestHeld=()=>state.hall==='breaker';
const chipHeld=()=>state.club==='vault';
const proofHeld=()=>ledgerHeld()||manifestHeld();
const kranePinned=()=>state.hall==='dive';
const pursuing=()=>state.pursuit!==''&&state.pursuit!=='stay';
