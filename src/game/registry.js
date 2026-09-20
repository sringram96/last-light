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
// windup (2 seconds and GET READY, then next), prompt (window() seconds, moves:[{label,id,act}], miss(), next = result),
// result (stinger():[text,tone], duration seconds unless a rewind is offered, rewind:{miss(),back,reset()}, next).
const sets={},phaseDefs={};
function registerSet(name,def){sets[name]={name,...def};}
function registerPhases(setName,defs){for(const [id,def] of Object.entries(defs))phaseDefs[id]={id,set:setName,...def};}
function phaseDef(p){return phaseDefs[p===undefined?state.phase:p]||null;}
const nextOf=d=>typeof d.next==='function'?d.next():d.next;
// Derived story terms, never stored: what Rook is holding and where the pursuit stands.
const ledgerHeld=()=>state.rescue==='valve';
const manifestHeld=()=>state.hall==='breaker';
const chipHeld=()=>state.club==='vault';
const proofHeld=()=>ledgerHeld()||manifestHeld();
const kranePinned=()=>state.hall==='dive';
const pursuing=()=>state.pursuit!==''&&state.pursuit!=='stay';
