// Examine: an object turned over in Rook's hands. The picture cuts to an insert: the object alone in the dark, lit from
// above, with the camera circling it as the player turns it (a drag on the picture, the arrow keys or WASD, or the turn
// buttons under it). A detail is a mark on one face of the object: its engraving is part of the picture and can only be
// read while that face is turned toward the camera, and while it is, the detail's examine marker [n] shows at its point.
// A tap on the marker, its number key or its button reads it: its bit is saved in the beat's field, its clue goes in the
// case file once, and its line replaces the caption. [PUT IT DOWN] cuts back to the beat the object was picked up from.
// Nothing is timed, and a pause, the menu or the drawer stops the turning.
//
// registerPhases(set,{ id:{ kind:'examine', title, field:'lanternLooked', step:'Turned the lantern over', back:'evidence',
//  caption:()=>'...', radius:3.4, model(solid,ellipsoid){ geometry in object space, the object centred on the origin },
//  marks:[{at:[x,y,z], normal:[x,y,z], lines:['TEXT'], hue, level}] engravings with no detail,
//  details:[{id, bit, label:'THE STENCIL', at:[x,y,z], normal:[x,y,z], lines:['BELL','DEPOT LOFT'], hue?, look:()=>'...',
//   clue?:string|()=>string, enter?:()=>void}] }})
// The insert is built far below every set's floor inside a room that faces inward, so the set around it never shows.
const EXAMINE_AT=[0,-80,0],EXAMINE_ROOM=7;
let turnYaw=0,turnPitch=0,turnYawTo=0,turnPitchTo=0,turnFocus='',turnShown='';
function isExamining(){return phaseDef()?.kind==='examine';}
const examineLive=()=>root.isConnected&&!session.menu&&!state.paused&&!transit&&isExamining()&&!drawerOpen();
function examineReset(d){turnYaw=turnYawTo=d.yaw||0;turnPitch=turnPitchTo=d.pitch||0;turnFocus='';turnShown='';}
// The camera on its sphere around the object; the pitch stops short of the poles so the view never rolls.
const PITCH_LIMIT=1.25;
function examineShot(){
 const d=phaseDef(),r=d.radius||3.4,c=EXAMINE_AT;
 const x=c[0]+Math.sin(turnYaw)*Math.cos(turnPitch)*r,y=c[1]+Math.sin(turnPitch)*r,z=c[2]-Math.cos(turnYaw)*Math.cos(turnPitch)*r;
 return look(x,y,z,c[0],c[1],c[2]);
}
// A face is turned toward the camera when its normal points within about sixty degrees of it.
function facing(at,normal){
 const p=[EXAMINE_AT[0]+at[0],EXAMINE_AT[1]+at[1],EXAMINE_AT[2]+at[2]],v=[camera.x-p[0],camera.y-p[1],camera.z-p[2]],l=Math.hypot(...v)||1;
 return (normal[0]*v[0]+normal[1]*v[1]+normal[2]*v[2])/l>.5;
}
const detailShown=d=>d.details.filter(s=>facing(s.at,s.normal)).map(s=>s.id).join(',');
// Turning: a step is an eighth of a turn round, or a sixth of the way up or down; a drag turns with the finger.
function examineTurn(dir,amount){
 if(!examineLive())return false;
 const step=amount??(dir==='left'||dir==='right'?Math.PI/4:Math.PI/6);
 if(dir==='left')turnYawTo-=step;else if(dir==='right')turnYawTo+=step;
 else if(dir==='up')turnPitchTo=clamp(turnPitchTo+step,-PITCH_LIMIT,PITCH_LIMIT);else if(dir==='down')turnPitchTo=clamp(turnPitchTo-step,-PITCH_LIMIT,PITCH_LIMIT);
 turned();return true;
}
// Under reduced motion the picture is not redrawn every frame, so a turn lands at once and draws itself.
function turned(){if(!reduce)return;turnYaw=turnYawTo;turnPitch=turnPitchTo;pose();examineTick(0);render();}
// [TIP IT] looks at the underside, then the top, then level again.
function examineTip(){if(!examineLive())return;turnPitchTo=turnPitchTo<-.5?PITCH_LIMIT*.8:turnPitchTo>.5?0:-PITCH_LIMIT;turned();}
function examineDrag(dx,dy){if(!examineLive())return;turnYawTo-=dx*.01;turnPitchTo=clamp(turnPitchTo+dy*.01,-PITCH_LIMIT,PITCH_LIMIT);turned();}
// The turn eases toward its target (at once under reduced motion); the buttons are rebuilt when a detail turns into or
// out of view, so the strip lists what can be read from this side.
function examineTick(dt){
 const k=reduce?1:Math.min(1,dt*9);turnYaw+=(turnYawTo-turnYaw)*k;turnPitch+=(turnPitchTo-turnPitch)*k;
 const shown=detailShown(phaseDef());if(shown!==turnShown){turnShown=shown;ui();}
}
function examineDetail(detail){
 if(!examineLive())return false;
 const d=phaseDef(),s=typeof detail==='string'?d.details.find(x=>x.id===detail):detail;
 if(!s||!(facing(s.at,s.normal)||state[d.field]&s.bit))return false;
 if(!(state[d.field]&s.bit)){state[d.field]|=s.bit;if(s.enter)s.enter();const clue=typeof s.clue==='function'?s.clue():s.clue;if(clue)addClue(clue);cue('clue');}
 if(turnFocus===s.id)replayCaption();else turnFocus=s.id;
 ui();render();checkpoint();return true;
}
function examineKey(n){const d=phaseDef();return !!d&&d.kind==='examine'&&!!d.details[n-1]&&examineDetail(d.details[n-1]);}
function examineAt(clientX,clientY){const id=labelAt(clientX,clientY,l=>l.spot)?.spot;return !!id&&examineDetail(id);}
function examineUI(d){
 const focus=turnFocus?d.details.find(s=>s.id===turnFocus):null;
 el.caption.textContent=focus?focus.look():d.caption?d.caption():'';
 button('[<< TURN]',()=>examineTurn('left'));button('[TURN >>]',()=>examineTurn('right'));button('[TIP IT]',examineTip);
 // A detail's button shows while its face is toward the camera, and stays once it has been read.
 d.details.forEach((s,i)=>{const read=!!(state[d.field]&s.bit);if(read||facing(s.at,s.normal))button('['+(i+1)+'] '+s.label,()=>examineDetail(s),read?'lc-seen':'');});
 button('[PUT IT DOWN]',()=>enter(d.back));
}
// The insert's geometry: a room whose walls face inward and draw almost nothing, and the object's model. A solid has all
// six faces, since the object is seen from below too.
function examineGeometry(){
 const d=phaseDef(),[cx,cy,cz]=EXAMINE_AT,s=EXAMINE_ROOM,dark={kind:'void',hue:7};
 const a=[cx-s,cy-s,cz-s],b=[cx+s,cy+s,cz+s];
 quad([a[0],a[1],b[2]],[b[0],a[1],b[2]],[b[0],b[1],b[2]],[a[0],b[1],b[2]],dark,[0,0,-1]);quad([b[0],a[1],a[2]],[a[0],a[1],a[2]],[a[0],b[1],a[2]],[b[0],b[1],a[2]],dark,[0,0,1]);
 quad([b[0],a[1],b[2]],[b[0],a[1],a[2]],[b[0],b[1],a[2]],[b[0],b[1],b[2]],dark,[-1,0,0]);quad([a[0],a[1],a[2]],[a[0],a[1],b[2]],[a[0],b[1],b[2]],[a[0],b[1],a[2]],dark,[1,0,0]);
 quad([a[0],b[1],a[2]],[a[0],b[1],b[2]],[b[0],b[1],b[2]],[b[0],b[1],a[2]],dark,[0,-1,0]);quad([a[0],a[1],b[2]],[a[0],a[1],a[2]],[b[0],a[1],a[2]],[b[0],a[1],b[2]],dark,[0,1,0]);
 const solid=(x0,y0,z0,x1,y1,z1,m)=>{box(cx+x0,cy+y0,cz+z0,cx+x1,cy+y1,cz+z1,m);quad([cx+x0,cy+y0,cz+z0],[cx+x0,cy+y0,cz+z1],[cx+x1,cy+y0,cz+z1],[cx+x1,cy+y0,cz+z0],m,[0,-1,0]);};
 d.model(solid,(x,y,z,rx,ry,rz,m)=>ellipsoid(cx+x,cy+y,cz+z,rx,ry,rz,m));
 return{rook:null,courier:null,book:null,others:[]};
}
// An engraving: its lines centred on its point, one row each, drawn just in front of its face and only while the face is
// turned toward the camera, so it hides behind the object like the face it is cut into. Its spaces are cut clean, so the
// words read as words against the metal.
function engrave(at,normal,lines,hue=6,level=15){
 if(!facing(at,normal))return;
 const v=cam([EXAMINE_AT[0]+at[0],EXAMINE_AT[1]+at[1],EXAMINE_AT[2]+at[2]]);if(v.z<.4)return;
 const s=project(v),top=Math.round(s.y-(lines.length-1)/2);
 lines.forEach((line,r)=>{const start=Math.round(s.x-line.length/2);for(let i=0;i<line.length;i++)pixel(start+i,top+r,v.z-.05,line[i],hue*20+level);});
}
function examineLabels(){
 const d=phaseDef();
 for(const m of d.marks||[])engrave(m.at,m.normal,m.lines,m.hue,m.level);
 d.details.forEach((s,i)=>{
  engrave(s.at,s.normal,s.lines,s.hue,s.level);
  // The marker sits beside the engraving along its face (a face that looks up or down names its own offset), so it never
  // covers the words it points at.
  if(facing(s.at,s.normal)){const n=s.normal,off=s.marker||[n[2]*.85,0,-n[0]*.85];spotLabel([0,1,2].map(k=>EXAMINE_AT[k]+s.at[k]+off[k]+n[k]*.05),i+1,!!(state[d.field]&s.bit),s.id);}
 });
}

// 01 / STATION ROAD. Bell's lantern: a lamplighter's hand lantern, the chimney still burning. The stencil on the front
// names its owner and his loft; the brass by the latch carries the lamplighters' knock; the reserve cell under the base
// is Board issue with a lot number the maintenance desk will repeat.
const brass={kind:'metal',hue:2},steel={kind:'metal',hue:0};
registerPhases('street',{
 lanternExamine:{kind:'examine',title:'BELL\'S LANTERN',field:'lanternLooked',step:'Turned Bell\'s lantern over',back:'evidence',radius:3.3,
  caption:()=>(state.choice==='person'?'Nell hands Rook the lantern and does not let go of the handle straight away.':'Rook lifts the lantern out of the gutter. It is still burning.')+' Turn it over: drag the picture, or use the arrows.',
  model(solid,ellipsoid){
   solid(-.62,-1.05,-.62,.62,-.55,.62,brass);// the base band, where the stencil and the knock are cut
   solid(-.46,-.55,-.46,.46,.62,.46,{kind:'lamp',hue:2});// the lit chimney
   for(const x of [-.56,.5])for(const z of [-.56,.5])solid(x,-.55,z,x+.06,.62,z+.06,steel);// the four posts
   solid(-.62,.62,-.62,.62,.8,.62,brass);ellipsoid(0,.92,0,.46,.22,.46,brass);// the cap and its dome
   solid(-.5,1.12,-.05,-.42,1.6,.05,steel);solid(.42,1.12,-.05,.5,1.6,.05,steel);solid(-.5,1.52,-.05,.5,1.62,.05,steel);// the handle
  },
  details:[
   {id:'stencil',bit:1,label:'THE STENCIL',at:[0,-.8,-.63],normal:[0,0,-1],lines:['BELL','DEPOT LOFT'],hue:6,
    clue:'Bell\'s lantern is stencilled BELL / DEPOT LOFT. A lamplighter does not lend his lantern.',
    look:()=>'Stencilled on the base: BELL / DEPOT LOFT. A lamplighter\'s lantern goes where he goes. Whoever carries this one is walking his route for him.'},
   {id:'knock',bit:2,label:'THE SCRATCHES',at:[0,-.8,.63],normal:[0,0,1],lines:['III  III'],hue:6,
    clue:'Scratched on Bell\'s lantern by the latch: three strokes, a gap, three strokes. The lamplighters\' knock.',
    look:()=>'Scratched into the brass by the latch: three strokes, a gap, three strokes. Lamplighters knock like that on each other\'s doors. Rook will know it if he hears it.'},
   {id:'cell',bit:4,label:'THE CELL',at:[0,-1.06,0],normal:[0,-1,0],lines:['LUMEN BOARD','RESERVE','LOT 7731'],hue:2,marker:[0,0,-.5],
    clue:'The reserve cell in Bell\'s lantern is Board issue, stamped LOT 7731.',
    look:()=>'Under the base, the reserve cell: LUMEN BOARD / RESERVE / LOT 7731. Board issue, nearly flat. Every lamp on Bell\'s route runs on a cell like this one.'}
  ]}
});
// 03 / PUMP ROOM 4. The padlock off the platform door: Division stores issue, the crest on its face, the office it was
// signed out to stamped on its back, and the day stores let it go stamped underneath.
registerPhases('pump',{
 pumpPadlock:{kind:'examine',title:'THE PADLOCK',field:'padlockLooked',step:'Turned the padlock over',back:'pumpRoom',radius:3.2,
  caption:()=>'Rook works the padlock off the bolt and turns it under his light.',
  model(solid){
   solid(-.85,-.95,-.32,.85,.45,.32,steel);// the body
   solid(-.62,.45,-.11,-.4,1.25,.11,brass);solid(.4,.45,-.11,.62,1.25,.11,brass);solid(-.62,1.18,-.11,.62,1.4,.11,brass);// the shackle
   solid(-.12,-.62,-.36,.12,-.28,-.32,{kind:'rubber',hue:7});// the keyway
  },
  marks:[{at:[0,.02,-.33],normal:[0,0,-1],lines:['NIGHT DIVISION'],hue:1,level:13}],
  details:[
   {id:'number',bit:1,label:'THE STAMP',at:[0,-.2,.33],normal:[0,0,1],lines:['K-14'],hue:6,
    clue:'The Pump Room 4 padlock is Division stores issue, stamped K-14: signed out to Room 14. Vale\'s office.',
    look:()=>state.officeLooked&2?'Stamped on the back: K-14. Stores stamp a lock with the office it goes to. Fourteen is the dark door across the corridor from Rook\'s. Vale\'s.':'Stamped on the back: K-14. Stores stamp a lock with the office it goes to. Rook\'s own says 12. Fourteen is across the corridor. Vale\'s.'},
   {id:'issued',bit:2,label:'THE STORES MARK',at:[0,-.96,0],normal:[0,-1,0],lines:['STORES','OUT WED'],hue:6,marker:[0,0,-.45],
    clue:'Stores signed the Pump Room 4 padlock out on Wednesday, the night Bell went missing.',
    look:()=>'Underneath, the stores mark: OUT WED. Wednesday. Four nights ago, the night Bell went missing. Somebody drew this lock for this door.'}
  ]}
});
