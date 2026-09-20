// Story and camera direction layered over the unchanged approved street renderer.
const startShot={x:-.8,y:2.05,z:-5,yaw:.035,pitch:.085};
const followShot={x:-2.8,y:2.05,z:12,yaw:.1,pitch:.085};
const dangerShot={x:-2.8,y:2.9,z:14.4,yaw:.3,pitch:-.22};
const endShot={x:-4.3,y:2.05,z:30,yaw:-.05,pitch:.05};
const span=(seconds)=>smooth(clamp(state.event/seconds,0,1));
function shotFor(){
 if(extended())return caseShot();
 if(['brief','watch','ready'].includes(state.phase))return startShot;
 if(state.phase==='follow')return followShot;
 if(['danger','qte','result'].includes(state.phase))return dangerShot;
 if(state.phase==='evidence')return state.choice==='person'?{x:-2.8,y:2.4,z:15.6,yaw:.28,pitch:-.02}:state.choice==='book'?{x:-1.5,y:2.3,z:16.3,yaw:.5,pitch:-.18}:{x:-1.8,y:1.7,z:16.3,yaw:.45,pitch:-.2};
 if(state.phase==='deduce')return look(3,2.4,0,-3.5,2.4,26);
 if(state.phase==='loftTurn')return look(-3.8,2.2,14,-8,3.2,10.2);
 return endShot;
}
function pose(){
 if(extended()){casePose();return;}
 const target=shotFor(),duration=state.phase==='follow'?8:state.phase==='arrival'?5:state.phase==='danger'?2:state.phase==='loftTurn'?4:state.phase==='deduce'?3:.9;
 const u=reduce?1:span(duration);
 for(const k of Object.keys(camera))camera[k]=mix(transitionFrom[k],target[k],u);
 state.travel=clamp((camera.z+5)/35,0,1);
 state.moving=['follow','arrival'].includes(state.phase);
}
function blocking(){
 if(extended())return caseBlocking();
 let rook={x:-3.2,z:3,pose:'watch'},courier={x:.1,z:12,pose:'walk',who:'nell'},book={x:.65,y:1.05,z:11.9,flat:false};
 if(['follow','danger','qte','result','evidence','deduce','loftTurn','arrival'].includes(state.phase)){
  const u=state.phase==='follow'&&!reduce?span(8):1;
  rook={x:mix(-3.2,-2.2,u),z:mix(3,17.8,u),pose:state.phase==='follow'?'walk':'watch'};
  courier={x:mix(.1,.6,u),z:mix(12,20,u),pose:state.phase==='follow'?'walk':'stand',who:'nell'};
  book={x:courier.x+.62,y:1.18,z:courier.z-.16,flat:false};
 }
 if(['danger','qte','result','evidence','deduce'].includes(state.phase)){
  const q=state.phase==='danger'?span(2)*.15:state.phase==='qte'?.15+.65*clamp(state.event/qteDuration(),0,1):.8;
  courier.pose='stumble';courier.lean=q*.62;
  book={x:1.2+q*.35,y:1.18-q*.7,z:19.65,flat:false};
 }
 if(['result','evidence','deduce','loftTurn','arrival'].includes(state.phase)){
  const u=state.phase==='result'&&!reduce?span(3.8):1;
  if(state.phase==='result'&&state.choice==='missed'){
   // The miss: the courier flat across the rail, Rook reaching from the curb, and the red car back for her; she is gone once it goes.
   const e=streetMissClock();
   rook={x:-2.2,z:17.8,pose:'reach'};
   courier=e<4?{x:.6,z:20,pose:'stumble',lean:-.6,who:'nell'}:null;
   book={x:1.48,y:.07,z:19.65,flat:true};
  }else if(state.choice==='person'){
   rook={x:mix(-2.2,-.85,u),z:mix(17.8,19.5,u),pose:u<.8?'reach':'support'};
   courier={x:.6,z:20,pose:'stand',lean:(1-u)*.5,who:'nell'};
   book={x:1.48,y:mix(.6,.07,u),z:19.65,flat:u>.65};
  }else{
   rook={x:mix(-2.2,state.choice==='book'?1.1:-.5,u),z:mix(17.8,19.3,u),pose:state.choice==='book'?(u<.75?'reach':'read'):'crouch'};
   courier={x:mix(.6,-4,u),z:mix(20,29,u),pose:'walk',who:'nell'};
   book=state.choice==='book'?{x:mix(1.4,1.55,u),y:mix(.6,1.3,u),z:mix(19.65,18.96,u),flat:false}:{x:1.48,y:.07,z:19.65,flat:true};
  }
 }
 if(state.phase==='loftTurn'){
  // Two doors back to the depot stair; the courier is gone.
  const u=reduce?1:span(4);
  rook={x:mix(rook.x,-7.2,u),z:mix(rook.z,12.4,u),pose:u<1?'walk':'reach'};courier=null;book=null;
 }
 if(state.phase==='arrival'){
  const u=reduce?1:span(5);
  const path=(x,z,endX,endZ)=>u<.45?{x:mix(x,-3.2,u/.45),z:mix(z,25,u/.45)}:{x:mix(-3.2,endX,(u-.45)/.55),z:mix(25,endZ,(u-.45)/.55)};
  rook={...path(rook.x,rook.z,-4.6,36.3),pose:u<1?'walk':'watch'};
  if(state.choice==='person')courier={...path(.6,20,-5.2,37.2),pose:u<1?'walk':'stand',who:'nell'};
  else courier=null;
  book=null;
 }
 return{rook,courier,book};
}
// The street miss picture's clock: the phase clock, or the still it holds under reduced motion (the car stopped beside the rail).
function streetMissClock(){return reduce?3.9:state.event;}
// The red car on the miss: back from the far corner and down the right-hand rails over three seconds (clear of Rook, who
// stands on the camera's line), a second beside the courier, then away out of the frame's right edge with its lights off.
function streetMissCar(){
 const e=streetMissClock();
 if(e<1){const u=smooth(e);car(mix(-12,-2,u),mix(36,35,u),3,0,false,{dark:true});}
 else if(e<3){const u=smooth((e-1)/2);car(mix(-2,1.9,u),mix(35,22.6,u),3,0,false,{dark:true});}
 else if(e<4)car(1.9,22.6,3,0,false,{dark:true});
 else if(e<5.2){const u=(e-4)/1.2;car(mix(1.9,4.2,u),mix(22.6,4,u*u),3,0,false,{dark:true});}
}
// Walk cycles advance with distance travelled (one frame every SPRITE_STRIDE world units), so a standing character never flickers.
// Any other pose with frames (Rook's `smoke`) is an idle cycle: it advances with the story clock, one frame every SPRITE_BEAT
// seconds, so a pause, a menu or a hidden tab holds it and reduced motion leaves it on its first frame.
const SPRITE_STRIDE=.3,SPRITE_BEAT=1.5,walkMeters=new Map();
function spriteFrame(key,a,frames){
 if(frames.length<2)return 0;
 if((a.pose||'stand')!=='walk')return Math.floor(state.t/SPRITE_BEAT)%frames.length;
 const m=walkMeters.get(key),d=m&&m.scene===sceneName?m.d+Math.hypot(a.x-m.x,a.z-m.z):0;
 walkMeters.set(key,{x:a.x,z:a.z,d,scene:sceneName});
 return Math.floor(d/SPRITE_STRIDE)%frames.length;
}
// Screen band of sprite row/column i at scale s over n cells. Bands partition the cells when s>=1; when a sheet is
// squeezed, an empty band collapses onto its centre cell and the priority order below decides what survives there.
function spriteBand(i,s,n){let a=Math.round(i*s),b=Math.round((i+1)*s);if(b<=a){a=Math.min(n-1,Math.floor((i+.5)*s+1e-6));b=a+1;}return[Math.max(0,a),Math.min(n,b)];}
// Drawing order inside one sprite: eyes and noses, then mouths, then outlines and props, then fills.
const spritePriority=g=>g==='o'||g==='>'?0:g==='.'?1:spriteFill(g)?3:2;
function actor(a,isRook=false,key){
 if(!a)return;
 const who=a.who||(isRook?'rook':'generic'),sheet=spriteFor(who);if(!sheet)return;
 const pose=a.pose||'stand',height=spriteHeight(sheet,pose);
 const bottom=cam([a.x,.16+(a.y||0),a.z]),top=cam([a.x+(a.lean||0),height+(a.y||0),a.z]);if(bottom.z<.4)return;
 const ap=project(top),bp=project(bottom),hf=bp.y-ap.y;if(hf<1)return;
 // Stable projection: the height is a whole number of rows, the feet sit on a whole cell, and the width follows the
 // approved cell aspect (0.41 of the height in world terms). A glide therefore grows the sprite in whole-row steps.
 const h=Math.round(hf),w=Math.max(1,Math.round(h*(ch/cw)*.41)),yb=Math.round(bp.y),yt=yb-h;
 const pick=spriteSize(sheet,pose,h,w),rows=pick.frames[spriteFrame(key||who,a,pick.frames)];
 const R=rows.length,C=sheet.sizes[pick.size].cols,sy=h/R,sx=w/C;
 // A lean shears the sprite: each screen row has its own whole-cell left edge.
 const lefts=new Int32Array(h);let minLeft=Infinity,maxLeft=-Infinity;
 for(let j=0;j<h;j++){const l=Math.round(mix(ap.x,bp.x,(j+.5)/h)-w/2);lefts[j]=l;if(l<minLeft)minLeft=l;if(l>maxLeft)maxLeft=l;}
 let eyes=0;for(const r of rows)for(const g of r)if(g==='o')eyes++;
 spriteRects.push({x0:minLeft-1,x1:maxLeft+w,y0:yt-1,y1:yb+1,who,sheet:pick.size,rows:h,cols:w,eyes});
 if(yb<0||yt>=H)return;
 const hue=a.hue??sheet.hue,faceHue=sheet.faceHue??hue,accents=sheet.accentHues||{};
 const inkFor=g=>(g in accents?accents[g]:spriteFace(g)?faceHue:hue)*20+sheet.level;
 const zAt=ly=>mix(top.z,bottom.z,(ly+.5)/h)-.06,faceZ=Math.min(top.z,bottom.z)-.1;
 // Each screen cell is written once per sprite, in priority order, so a squeezed sheet keeps its eyes and edges and a
 // stretched sheet never repeats a face or an outline stroke. Fill glyphs cover their whole band; outlines run once
 // along it; faces, mouths and props sit once on the band's centre row. Whatever else a band covers becomes an opaque
 // blank, so the silhouette stays solid and the set never shows through a stretched head.
 const taken=new Uint8Array(h*w),cells=[],bands=[],holes=spriteHoles(rows);
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){const g=rows[r][c];if(g!==' ')cells.push({r,c,g,p:spritePriority(g)});else if(holes[r*C+c]){const [r0,r1]=spriteBand(r,sy,h),[c0,c1]=spriteBand(c,sx,w);bands.push(r0,r1,c0,c1);}}
 cells.sort((m,n)=>m.p-n.p);
 const put=(lx,ly,g,k,z)=>{if(lx<0||lx>=w||ly<0||ly>=h)return;const i=ly*w+lx;if(taken[i])return;taken[i]=1;pixel(lefts[ly]+lx,yt+ly,z,g,k);};
 for(const {r,c,g} of cells){
  const [r0,r1]=spriteBand(r,sy,h),[c0,c1]=spriteBand(c,sx,w),n=r1-r0,m=c1-c0,k=inkFor(g);if(n<1||m<1)continue;
  bands.push(r0,r1,c0,c1);
  if(spriteFill(g)){for(let ly=r0;ly<r1;ly++)for(let lx=c0;lx<c1;lx++)put(lx,ly,g,k,zAt(ly));}
  else if(g==='/'||g==='\\'){
   for(let i=0;i<n;i++){const lx=n>1?c0+Math.round((g==='/'?1-i/(n-1):i/(n-1))*(m-1)):c0+(g==='/'?m>>1:(m-1)>>1);put(lx,r0+i,g,k,zAt(r0+i));}
  }else if(g==='|'||g==='('||g===')'){const lx=c0+(g===')'?m>>1:(m-1)>>1);for(let ly=r0;ly<r1;ly++)put(lx,ly,g,k,zAt(ly));}
  else{
   const ly=r0+(n>>1),z=spriteFace(g)?faceZ:zAt(ly);
   if(g==='_')for(let lx=c0;lx<c1;lx++)put(lx,ly,g,k,z);else put(c0+((m-1)>>1),ly,g,k,z);
  }
 }
 for(let b=0;b<bands.length;b+=4)for(let ly=bands[b];ly<bands[b+1];ly++)for(let lx=bands[b+2];lx<bands[b+3];lx++)put(lx,ly,' ',0,zAt(ly));
}
function geometry(){
 if(extended())return caseGeometry();
 surfaces.length=staticCount;
 // The only new architecture is a small service hatch on the station facade.
 box(-5.9,0,38.68,-3.9,2.6,38.8,{kind:'hatch',hue:0});
 box(-6,2.6,38.6,-3.8,2.72,38.8,{kind:'metal',hue:2});
 const a=blocking();
 if(a.book){
  const b=a.book;
  if(b.flat)box(b.x-.42,.06,b.z-.33,b.x+.42,.11,b.z+.33,{kind:'dispatch',hue:6});
  else box(b.x-.32,b.y-.35,b.z-.06,b.x+.32,b.y+.35,b.z+.06,{kind:'dispatch',hue:6});
 }
 const missed=state.phase==='result'&&state.choice==='missed';
 if(a.courier&&!missed){
  const p=a.courier;
  // A physical lantern is bright enough to lead the eye through the street.
  const y=['danger','qte'].includes(state.phase)?1.02:.95;
  box(p.x-.7,y-.22,p.z-.12,p.x-.43,y+.22,p.z+.12,{kind:'lamp',hue:2});
 }
 // The miss: the lantern already in the gutter, still burning, and the red car back for the courier.
 if(missed){box(1.35,.15,19.65,1.65,.45,19.95,{kind:'lamp',hue:2});streetMissCar();}
 // Per-phase props keep the approved first frame untouched: the red car leaving during the follow, the dropped lantern
 // in the gutter on the routes without Nell, and the depot door, stair and lit window once the deduction names them.
 if(state.phase==='follow'&&!reduce){const u=clamp((state.event-3)/4,0,1);if(u<1)car(mix(-4,-12,u),36,3,0,false,{dark:true});}
 if(['evidence','deduce','loftTurn','arrival'].includes(state.phase)&&state.choice!=='person')box(1.35,.15,19.65,1.65,.45,19.95,{kind:'lamp',hue:2});
 if(['deduce','loftTurn','arrival'].includes(state.phase)){
  box(-8.02,0,9.2,-7.9,3.2,11,{kind:'door',hue:2});box(-8.02,3.25,9,-7.9,3.6,11.2,{kind:'sign',hue:3});
  for(let i=0;i<8;i++)box(-7.6+i*.02,.2+i*.5,12-i*.25,-6.9,.28+i*.5,12.4-i*.25,{kind:'metal',hue:0});
  box(-7.5,4.2,9.2,-6.5,4.3,11.2,{kind:'grate',hue:0});box(-7.95,3.6,9.6,-7.85,4.4,10.6,{kind:'lamp',hue:2});
 }
 return a;
}
let spriteRects=[];
function render(){
 if(!W||!H)return;frame++;zbuf.fill(Infinity);chars.fill(' ');ink.fill(0);spriteRects=[];labelRects=[];
 sy=Math.sin(camera.yaw);cy=Math.cos(camera.yaw);sp=Math.sin(camera.pitch);cp=Math.cos(camera.pitch);
 const cast=geometry();
 for(const s of surfaces){
  const a=s.v[0],f=s.n[0]*(camera.x-a[0])+s.n[1]*(camera.y-a[1])+s.n[2]*(camera.z-a[2]);if(f<-.01&&s.mat.kind!=='cable')continue;
  const poly=clip(s.v.map(cam));if(poly.length<3)continue;const proj=poly.map(project);for(let i=1;i<proj.length-1;i++)triangle(proj[0],proj[i],proj[i+1],s.mat,s.n);
 }
 // Rain is rendered before people, so it does not cover their faces. Sets say where it falls (the office only beyond the window).
 const rainHere=sets[sceneName]?sets[sceneName].rain:['street','roof','chase','canal'].includes(sceneName)?true:sceneName==='office'?(x,z)=>z>16.6:false;
 if(rainHere)for(let i=0;i<125;i++){
  const x=hash(i,3)*22-11,z=camera.z+hash(i,7)*37,y=fract(hash(i,11)-state.t*.25)*16,p=cam([x,y,z]);if(p.z<.4||(typeof rainHere==='function'&&!rainHere(x,z)))continue;
  const q=project(p);pixel(q.x,q.y,p.z,'/',7*20+7);
 }
 actor(cast.courier,false,'courier');actor(cast.rook,true,'rook');(cast.others||[]).forEach((a,i)=>actor(a,false,'other'+i));
 if(sceneName==='street'){
 worldLabel([-7.95,3.05,5.5],'PRINT',1);worldLabel([0,6.5,38.75],'NORTH STATION',2);worldLabel([-4.9,2.95,38.6],'PUMP 4',2);
 const hotel=cam([7.03,11.2,11.8]);if(hotel.z>2){const p=project(hotel);'HOTEL'.split('').forEach((g,i)=>pixel(p.x,p.y+i,hotel.z-.2,g,2*20+17));}
 // The cues: catch the courier (up), save the book (down); unlit through the windup, live on the prompt.
 if(state.phase==='danger'||state.phase==='qte'){
  cueLabel([cast.courier.x,2.75,cast.courier.z],'up',1);
  cueLabel([cast.book.x,cast.book.y+.85,cast.book.z],'down',2);
 }
 if(['evidence','deduce'].includes(state.phase)&&state.choice==='book'&&cast.book)worldLabel([cast.book.x,cast.book.y+.12,cast.book.z-.1],'P4',6);
 if(['evidence','deduce','loftTurn'].includes(state.phase)&&state.choice!=='person')worldLabel([1.5,.95,19.8],'BELL/LOFT',6);
 if(['deduce','loftTurn'].includes(state.phase))worldLabel([-7.9,3,10.1],'DEPOT',2);
 }else caseLabels();
 // Dissolve: colours dim and heavy glyphs thin out, so a scene change sinks into the dark the way the art itself does with distance.
 if(fade<1)for(let i=0;i<W*H;i++){
  const g=chars[i];if(g===' ')continue;
  const level=ink[i]%20;ink[i]=ink[i]-level+Math.round(level*fade);
  if(fade<.15)chars[i]=' ';else if(fade<.35)chars[i]='.';else if(fade<.6&&(g==='#'||g==='@'||g==='%'||g==='&'||g==='H'))chars[i]='+';
 }
 const colors=state.mono?gray:palettes;
 ctx.fillStyle='#03070b';ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);ctx.font=(cw/.6)+'px "Liberation Mono",Consolas,monospace';ctx.textBaseline='top';
 let current=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,g=chars[i];if(g===' ')continue;if(ink[i]!==current){current=ink[i];ctx.fillStyle=colors[current];}ctx.fillText(g,x*cw,y*ch);}
 timer();
}
function qteDuration(){return caseDuration();}
function addClue(text){if(!state.clues.includes(text))state.clues.push(text);}
function button(text,fn){
 const b=document.createElement('button');b.type='button';b.className='cursor-interaction';b.textContent=text;b.disabled=state.paused;
 const action=()=>{if(!state.paused&&!b.disabled)fn();};b.addEventListener('click',action);el.actions.appendChild(b);keys.push(action);
}
// A scene change plays an exit beat and a dissolve before the next set fades up; previews, resumes and reduced motion cut directly.
let transit=null,fade=1,fadeIn=0;
function enter(phase,direct=false){
 if(transit&&!direct)return;
 const target=sceneFor(phase);
 if(!direct&&!reduce&&target!==sceneName&&state.phase!=='brief'){
  transit={phase,t:0,shot:exitShot(sceneName),caption:transitionLine(sceneName,target)};
  transitionFrom={...camera};ui();render();return;
 }
 transit=null;enterNow(phase);
}
function enterNow(phase){
 const scene=sceneName,wasEndingSeen=state.endingSeen;
 transitionFrom={...camera};state.phase=phase;state.event=0;
 caseEnter(phase);
 if(phase==='ready'){state.watched=true;addClue('The courier favors an injured leg. You can anticipate the stumble.');}
 if(phase==='evidence'){
  if(state.choice==='person')addClue('Nell says Bell is alive below the station, in Pump Room 4. The service knock is three short taps.');
  else if(state.choice==='book')addClue('An intact dispatch entry reads: 00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN.');
  else addClue('The dispatch pages are ruined. PUMP ROOM 4 is embossed into the cover.');
 }
 if(reduce)pose();
 if(sceneName!==scene&&!reduce&&fade<1){fadeIn=.8;}
 presentEnter(phase,sceneName!==scene,wasEndingSeen);
 ui();render();checkpoint();
}
// Lamps: a survivable miss stops at its result and offers to rewind the night to the windup for a lamp, or to carry on
// into the worse story. Registered result phases carry their own rewind entry; the original ones are listed here (the
// late entries for the lethal beats stay for old checkpoints; nothing new writes those values).
const missBeats={result:{miss:()=>state.choice==='missed',back:'danger',next:'evidence',reset:()=>{state.choice='';}},pumpResult:{miss:()=>state.rescue==='late',back:'pumpDanger',next:'pumpTruth',reset:()=>{state.rescue='';}},clubResult:{miss:()=>state.club==='late',back:'clubFace',next:'chaseEntry',reset:()=>{state.club='';}},chaseBank:{miss:()=>state.firstMove==='late',back:'chaseQteA',next:'chaseQteB',reset:()=>{state.firstMove='';state.gap=0;}},chaseFinish:{miss:()=>state.pursuit==='late',back:'chaseQteB',next:'subEntry',reset:()=>{state.pursuit='chasing';state.caught=false;}},tunnelFinish:{miss:()=>state.tunnel==='late',back:'tunnelQte',next:'subEntry',reset:()=>{state.tunnel='';state.caught=false;}}};
function missBeat(){const d=phaseDef();if(d)return d.kind==='result'&&d.rewind?{...d.rewind,next:nextOf(d)}:null;return missBeats[state.phase]||null;}
function canRewind(){const b=missBeat();return !!b&&b.miss()&&state.rewinds>0;}
function rewind(){
 const b=missBeat();if(!canRewind())return;
 state.rewinds--;b.reset();state.reaction=0;card('REWIND','hit',1.4);cue('clue');rewindTo=b.back;enter(b.back);
}
function rewindActions(){
 if(!canRewind())return;
 const b=missBeat();
 button('[REWIND THE NIGHT / '+state.rewinds+(state.rewinds===1?' LAMP]':' LAMPS]'),rewind);button('[CARRY ON]',()=>enter(b.next));
}
function choose(id){if(state.phase!=='qte'||state.paused)return;state.choice=id;enter('result');}
// The street deduction's ladder: the first wrong answer costs time at the pump; the second costs a lamp and the hotel button.
function deduce(where){
 if(where==='station'){enter('arrival');return;}
 if(where==='loft'){enter('loftTurn');return;}
 ladder.street++;
 if(ladder.street>=2){state.rewinds=Math.max(0,state.rewinds-1);card('REWIND','miss',1.4);cue('miss');}
 state.wrong=true;ui();
}
function reset(){
 Object.assign(state,{t:0,paused:false,mono:state.mono,travel:0,moving:false,phase:'brief',event:0,watched:false,choice:'',untimed:state.untimed,clues:[],wrong:false,decoded:false,radio:false,twist:false,rescue:'',gap:0,pursuit:'',caught:false,distance:20,endingSeen:false,firstMove:'',phaseDistance:20,club:'',tunnel:'',reaction:0,rewinds:3,note:false,loftSeen:false,misread:false,tail:false,keeper:false,market:'',hall:'',slip:false,roomPick:'',dawn:0,deaths:0,restarts:0,dead:'',stalled:false,faced:false,shown:false,rewound:false});
 transit=null;fade=1;fadeIn=0;
 setScene('street');
 Object.assign(camera,startShot);transitionFrom={...startShot};el.journal.open=false;lastTime=0;ui();render();
}
function timer(){
 el.timer.className='lc-timer';
 if(session.menu){el.timer.textContent='';return;}
 if(state.paused){el.timer.textContent='PAUSED';return;}
 if(transit){el.timer.textContent='LIVE';return;}
 if(isObserving())el.timer.textContent='OBSERVING / '+Math.max(0,Math.ceil(8-state.event))+'s';
 // A live beat has no countdown, pulse or ticks: the cue's flash rate is the only clock.
 else if(isQte())el.timer.textContent=state.untimed?'TAKE YOUR TIME':'LIVE';
 else if(isResult()&&state.reaction>0)el.timer.textContent='REACTION '+state.reaction.toFixed(2)+'s';
 else el.timer.textContent=phaseDef()?.kind==='death'?'':isLive()?'LIVE':'YOUR MOVE';
}
function ui(){
 el.actions.replaceChildren();keys=[];el.outcome.hidden=true;
 el.clues.replaceChildren();for(const clue of state.clues){const li=document.createElement('li');li.textContent=clue;el.clues.appendChild(li);}
 el.journal.hidden=!state.clues.length&&state.phase==='brief';
 const phases={brief:'01 / STATION ROAD',watch:'WATCH THE COURIER',ready:'A USEFUL DETAIL',follow:'FOLLOW THE LANTERN',danger:'THE COURIER STUMBLES',qte:'THE BOOK IS FALLING',result:state.choice==='person'?'COURIER CAUGHT':state.choice==='book'?'DISPATCH SAVED':'TAKEN',evidence:state.choice==='person'?'A WITNESS':state.choice==='book'?'A WRITTEN LEAD':'A DAMAGED CLUE',deduce:'WHERE DOES THE TRAIL GO?',loftTurn:'TWO DOORS BACK',arrival:'NORTH STATION / SERVICE DOOR'};
 el.phase.textContent=phases[state.phase];
 if(session.menu)menuUI();else switch(state.phase){
 case 'brief':
  el.caption.textContent="Rook's case: find lamplighter Ivo Bell. He vanished at the closed station. Tonight, a stranger is carrying his lantern.";
  button('[FOLLOW THE LANTERN]',()=>enter('follow'));button('[WATCH FIRST / 8s]',()=>enter('watch'));break;
 case 'watch':
  el.caption.textContent='Rook watches from the curb. The stranger holds a dispatch book and keeps weight off one leg.';break;
 case 'ready':
  el.caption.textContent='The courier is limping. Rook will have two extra seconds to react if that leg gives way.';
  button('[FOLLOW THE LANTERN]',()=>enter('follow'));break;
 case 'follow':
  el.caption.textContent='Rook keeps to the shadows. The stranger heads for the station clock across the wet tram rails. A red car idles at the far corner, lights off, then pulls away.';break;
 case 'danger':
  el.caption.textContent='The courier pitches forward. The book slips free. Get ready.';break;
 case 'qte':
  promptUI('Catch the courier, or save the dispatch book from the rain.',[['[1] CATCH THE COURIER','up'],['[2] SAVE THE BOOK','down']]);break;
 case 'result':
  el.caption.textContent=state.choice==='person'?'Rook catches the courier. The book hits the wet street; ink begins to run.':state.choice==='book'?'Rook saves the book. The courier catches their balance and limps away toward the station.':'Rook reaches too late. The courier is down across the rail, and the red car comes back round the corner with its lights off. When it pulls away the rail is empty and the lantern is still burning in the gutter.';
  rewindActions();break;
 case 'evidence':
  el.caption.textContent=state.choice==='person'?'Nell: "Bell is alive. Pump Room 4, below the station. Knock three times. I will take you."':state.choice==='book'?'The page is fresh: "00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN." The station is still being used. The courier\'s lantern is stencilled BELL / DEPOT LOFT.':'The rain has erased the entries. The cover still reads "PUMP ROOM 4." The lantern is stencilled BELL / DEPOT LOFT, and its carrier is in the back of a red car.';
  button('[CONNECT THE CLUE]',()=>enter('deduce'));break;
 case 'deduce':
  el.caption.textContent=ladder.street>=2?'The hotel night clerk has never heard of Bell and says so twice. Rook has spent the kind of time a life is made of, and the water under the station has spent it with him.':state.wrong?'The hotel desk has no Bell and the tram is empty. The clue says PUMP ROOM 4, and pump rooms sit under the station. Rook has lost minutes; the water below has not.':'Bell is somewhere below. Where does the trail go first?';
  button('[THE STATION SERVICE DOOR]',()=>deduce('station'));
  if(state.choice!=='person')button('[BELL\'S LOFT OVER THE DEPOT]',()=>deduce('loft'));
  if(ladder.street<2)button('[THE HOTEL ACROSS THE ROAD]',()=>deduce('hotel'));break;
 case 'loftTurn':
  el.caption.textContent='Rook wants to know what Bell knew before he goes under the station. The depot loft is two doors back, up an iron stair.';break;
 case 'arrival':
  el.caption.textContent=state.choice==='person'?'Nell leads Rook to the service hatch. Three short knocks.':'Rook follows the rails to the station and finds the pump-room service hatch.';break;
 default:caseUI();break;
 }
 // A rewound pass types the rewind line in the windup (or at the prompt itself where the beat has no windup phase).
 if(!session.menu&&state.rewound&&rewindLines[state.phase])el.caption.textContent=rewindLines[state.phase];
 if(transit&&!session.menu){el.actions.replaceChildren();keys=[];if(transit.caption)el.caption.textContent=transit.caption;}
 // The canvas takes swipes only while a beat is live; otherwise the page keeps its scroll.
 canvas.style.touchAction=!session.menu&&isQte()?'none':'';
 el.pause.disabled=session.menu;
 const menuButton=root.querySelector('.lc-menu');if(menuButton)menuButton.hidden=session.menu;
 const reelDetails=root.querySelector('.lc-reel');if(reelDetails)reelDetails.hidden=!session.menu;
 if(session.menu)el.journal.hidden=true;
 el.pause.textContent=state.paused?'[RESUME]':'[PAUSE]';el.pause.setAttribute('aria-pressed',String(state.paused));
 el.timing.textContent=state.untimed?'[UNTIMED]':'[TIMED]';el.timing.setAttribute('aria-pressed',String(state.untimed));
 el.mono.textContent=state.mono?'[COLOR]':'[MONO]';el.mono.setAttribute('aria-pressed',String(state.mono));
 const sceneDescriptions={office:'A small night-shift office: a desk lamp, a case board, filing cabinets and a rain-streaked window over the city.',street:'A dense 3D ASCII night street, warm lamps and wet tram tracks.',station:'A vaulted station hall, tiled floor, columns, warm pendant lamps and a maintenance desk.',pump:'A flooded machinery chamber. Bell is on a platform and Rook stands by the inlet wheel.',roof:'A high rooftop overlooking deep city streets and flying traffic.',club:'A neon-lit club with velvet curtains, a stage, a long bar, candlelit tables and a booth at the back.',chase:'Rook\'s cyan patrol car pursues Vale\'s red car along an elevated road.',tunnel:'A brick storm drain under the city, lit by emergency neon, with two cars racing through it.',canal:'A quiet canal at first light. Rook and Bell stand near a medical vehicle.'};
 canvas.setAttribute('aria-label',(sets[sceneName]?.description||sceneDescriptions[sceneName])+' '+el.caption.textContent);
 const chapter=root.querySelector('.lc-chapter');if(chapter)chapter.textContent=(session.mode==='preview'?'PREVIEW / ':'')+(state.phase==='coldCase'?'THE CASE GOES COLD':sets[sceneName]?.chapter||{office:'00 / NIGHT DIVISION',street:'01 / STATION ROAD',station:'02 / CONCOURSE',pump:'03 / PUMP ROOM',roof:'04 / ROOFTOP',club:'05 / THE FILAMENT',chase:'06 / PURSUIT',tunnel:'07 / UNDERCITY',canal:'10 / FIRST LIGHT'}[sceneName])+(session.menu?'':' // '+objective());
 presentUI();
 timer();
}
// The picture fills the stage's picture area by the vertical field-of-view rule: 70 rows always, the cell from the height,
// columns from the width up to 240, and fy from 70 rows at the approved 56.9 degree vertical field, so the 180x70 frame is
// reproduced exactly (fx 111.14, fy 64.62) and a wider screen gains set on both sides at the same cell. A phone portrait
// keeps its cell and field of view and reveals rows up to 70; where a cell would fall under 3.6 px (a landscape phone) the
// picture keeps the fixed grid and the HUD moves beside it. Without a stage (the harness) resize() keeps the original rule
// from canvas.clientWidth, so the reference test measures what it always did.
const FILL_FX=180/(2*Math.tan(78*Math.PI/360)),FILL_FY=FILL_FX/1.72;
function stageArea(){
 if(typeof window.innerHeight!=='number'||typeof window.innerWidth!=='number')return null;
 const picture=root.querySelector('.lc-picture');if(!picture)return null;
 const side=window.innerHeight<=500&&window.innerWidth/window.innerHeight>=1.6;
 if(root.classList){root.classList.toggle('lc-side',side);root.classList.toggle('lc-stacked',!side);}
 const width=picture.clientWidth|0,height=picture.clientHeight|0;
 return width>0&&height>0?{width,height}:null;
}
function resize(){
 const area=stageArea();
 if(!area){
  const width=canvas.clientWidth;if(width<=0)return;
  // Exact approved density, proportions, field of view, and font sizing.
  W=clamp(Math.floor(width/4.2),72,180);H=Math.round(W*(width<480?.67:.39));cw=width/W;ch=cw*1.72;
  fx=W/(2*Math.tan((width<480?66:78)*Math.PI/360));fy=fx/1.72;
 }else{
  const fit=area.height/(70*1.72);
  if(area.width<480){
   W=clamp(Math.floor(area.width/4.2),72,180);cw=area.width/W;ch=cw*1.72;H=clamp(Math.floor(area.height/ch),24,70);
   fx=W/(2*Math.tan(66*Math.PI/360));fy=fx/1.72;
  }else if(fit<3.6){
   const width=Math.min(area.width,area.height/(.39*1.72));
   W=clamp(Math.floor(width/4.2),72,180);H=Math.round(W*.39);cw=width/W;ch=cw*1.72;fx=W/(2*Math.tan(78*Math.PI/360));fy=fx/1.72;
  }else{
   H=70;cw=Math.max(3.6,Math.min(fit,area.width/180));ch=cw*1.72;W=Math.min(240,Math.floor(area.width/cw));fx=FILL_FX;fy=FILL_FY;
  }
  canvas.style.width=W*cw+'px';
 }
 dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(W*cw*dpr);canvas.height=Math.round(H*ch*dpr);canvas.style.height=H*ch+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 zbuf=new Float32Array(W*H);chars=new Array(W*H);ink=new Uint16Array(W*H);fitCard();render();
}
// layout() answers the stage observer, orientation and fullscreen changes; it is a no-op without a viewport (the harness).
function layout(){if(typeof window.innerHeight!=='number')return;resize();}
// Presentation wiring. The drawer (case file, records, reel) replaces the picture and pauses the game through the pause
// button's own handler; [FULL SCREEN] and the f key fill the screen; Escape and P pause; a tap on the picture or the caption,
// Space or Enter, pace the caption. Cue taps during a live prompt belong to the pointer handlers below and are left alone.
let drawerPaused=false,qteTap=false;
function drawerOpen(){return !!chrome.drawer&&!chrome.drawer.hidden;}
function toggleDrawer(open=!drawerOpen()){
 if(!chrome.drawer||open===drawerOpen())return;
 chrome.drawer.hidden=!open;canvas.hidden=open;if(chrome.picture)chrome.picture.hidden=open;lastTime=0;
 if(open){
  for(const d of [el.journal,hud['records-box'],root.querySelector('.lc-reel')])if(d&&!d.hidden)d.open=true;// the file opens on its contents, not on three folded headings
  if(!state.paused&&!session.menu&&!el.pause.disabled){drawerPaused=true;el.pause.click();}chrome.drawer.focus?.();
 }
 else{if(drawerPaused&&state.paused)el.pause.click();drawerPaused=false;layout();chrome.file?.focus?.();}
 presentChrome();
}
function toggleFullscreen(){
 if(document.fullscreenElement){document.exitFullscreen?.();return;}
 if(!document.fullscreenEnabled||typeof root.requestFullscreen!=='function')return;
 const request=root.requestFullscreen({navigationUI:'hide'});if(request&&request.catch)request.catch(()=>{});
}
chrome.file?.addEventListener('click',()=>toggleDrawer());
chrome.full?.addEventListener('click',toggleFullscreen);
root.querySelector('.lc-reel-actions')?.addEventListener('click',()=>toggleDrawer(false));
document.addEventListener('fullscreenchange',()=>{layout();presentChrome();});
window.addEventListener?.('orientationchange',layout);
document.addEventListener('keydown',e=>{
 if(!root.isConnected||e.repeat)return;
 const target=e.target;if(target&&target!==document.body&&target!==root&&!(typeof root.contains==='function'&&root.contains(target)))return;
 const onButton=!!target&&target.tagName==='BUTTON';
 if(e.key==='f'||e.key==='F'){toggleFullscreen();e.preventDefault();}
 else if(e.key==='Escape'){if(drawerOpen())toggleDrawer(false);else if(!session.menu&&!el.pause.disabled)el.pause.click();e.preventDefault();}
 else if(e.key==='p'||e.key==='P'){if(!session.menu&&!drawerOpen()&&!el.pause.disabled)el.pause.click();}
 else if((e.key===' '||e.key==='Enter')&&!onButton&&!isQte()&&!drawerOpen()){advanceCaption();e.preventDefault();}
});
const tapSurface=chrome.picture||canvas;
tapSurface.addEventListener('pointerdown',()=>{qteTap=isQte();});
tapSurface.addEventListener('click',()=>{if(qteTap){qteTap=false;return;}if(!isQte())advanceCaption();});
el.caption.addEventListener('click',()=>{if(!isQte())advanceCaption();});
el.pause.addEventListener('click',()=>{state.paused=!state.paused;lastTime=0;ui();render();});
el.mono.addEventListener('click',()=>{state.mono=!state.mono;savePreferences();ui();render();});
el.timing.addEventListener('click',()=>{state.untimed=!state.untimed;if(!state.untimed&&isQte())state.event=0;savePreferences();ui();render();});
root.querySelector('.lc-sound')?.addEventListener('click',()=>{state.sound=!state.sound;savePreferences();cue('clue');ui();});
root.querySelector('.lc-menu')?.addEventListener('click',openMenu);
// Action input: the arrow keys or WASD are the four directions while a beat is live; 1 and 2 press the untimed buttons only.
// Rebuilding the choices drops focus, so reflex keys are read at the document level while a prompt is live.
const dirKeys={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down'};
const promptLive=()=>root.isConnected&&!session.menu&&!state.paused&&!transit&&isQte();
document.addEventListener('keydown',e=>{
 if(!promptLive()||e.repeat)return;
 const target=e.target;if(target&&target!==document.body&&target!==root&&!(typeof root.contains==='function',root.contains?.(target)))return;
 if(e.key in dirKeys){e.preventDefault();promptInput(dirKeys[e.key],e);}
 else if((e.key==='1'||e.key==='2')&&state.untimed){e.preventDefault();keys[e.key==='1'?0:1]?.();}
});
// Pointer input on the picture: a travel of 24 px or more is a swipe in its dominant axis; a tap inside a cue's rectangle
// (padded by 22 px each side, read from the frame on screen) is that cue's direction; a tap anywhere else is ignored.
let pointerStart=null;
function cueAt(clientX,clientY){
 const r=canvas.getBoundingClientRect?.();if(!r||!r.width)return '';
 const scale=(canvas.width/dpr)/r.width,x=(clientX-r.left)*scale/cw,y=(clientY-r.top)*scale/ch,px=22/cw,py=22/ch;
 let best='',nearest=Infinity;
 for(const l of labelRects){
  if(!l.dir||x<l.x0-px||x>l.x1+1+px||y<l.y0-py||y>l.y1+1+py)continue;
  const dist=Math.hypot(x-(l.x0+l.x1+1)/2,y-l.y0-.5);if(dist<nearest){nearest=dist;best=l.dir;}
 }
 return best;
}
canvas.addEventListener('pointerdown',e=>{if(!promptLive())return;pointerStart={x:e.clientX,y:e.clientY};e.preventDefault?.();});
canvas.addEventListener('pointercancel',()=>{pointerStart=null;});
canvas.addEventListener('pointerup',e=>{
 const start=pointerStart;pointerStart=null;if(!start||!promptLive())return;
 const dx=e.clientX-start.x,dy=e.clientY-start.y;
 const dir=Math.hypot(dx,dy)>=24?(Math.abs(dx)>=Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')):cueAt(e.clientX,e.clientY);
 if(dir)promptInput(dir,e);
});
document.addEventListener('visibilitychange',()=>{lastTime=0;});
function tick(now){
 // A live beat caps the step at 50 ms so a hitch hands the player at most that much of the window.
 if(!root.isConnected)return;const dt=lastTime?Math.min(isQte()&&!state.untimed?.05:.1,Math.max(0,(now-lastTime)/1000)):0;lastTime=now;
 if(session.menu&&visible&&!document.hidden){
  if((state.phase==='brief'||state.phase==='menuIdle')&&!reduce)state.t+=dt;
  if(state.phase==='menuIdle'){state.event+=dt;pose();}
  presentTick(dt);
  if(now-lastFrame>66){render();lastFrame=now;}
 }else if(!state.paused&&visible&&!document.hidden){
  if(!reduce)state.t+=dt;
  presentTick(dt);
  if(transit){
   // Exit beat: glide toward the way out, then dissolve. The next set fades up once the picture is dark.
   transit.t+=dt;const u=smooth(clamp(transit.t/1.4,0,1));
   for(const k of Object.keys(camera))camera[k]=mix(transitionFrom[k],transit.shot[k],u);
   fade=clamp(1-(transit.t-.8)/.6,0,1);
   if(transit.t>=1.4){const next=transit.phase;transit=null;fade=0;enterNow(next);}
  }else{
   if(fadeIn>0){fadeIn=Math.max(0,fadeIn-dt);fade=1-fadeIn/.8;}else fade=1;
   if(!(isQte()&&state.untimed))state.event+=dt;
   if(extended())caseAdvance(dt);
   pose();
   if(state.phase==='watch'&&state.event>=8)enter('ready');
   else if(state.phase==='follow'&&state.event>=holdFor(reduce?1:8))enter('danger');
   else if(state.phase==='danger'&&state.event>=windupSeconds)enter('qte');
   else if(state.phase==='qte'&&!state.untimed&&state.event>=qteDuration())promptMiss();
   else if(state.phase==='result'&&state.event>=holdFor(4)&&!canRewind())enter('evidence');
   else if(state.phase==='loftTurn'&&state.event>=holdFor(reduce?1:4))enter('loftEntry');
   else if(state.phase==='arrival'&&state.event>=holdFor(reduce?1:5))enter('stationEntry');
  }
  if(now-lastFrame>66){if(!reduce)render();else timer();lastFrame=now;}
 }
 requestAnimationFrame(tick);
}
ui();pose();resize();showIdle();
const reelBox=root.querySelector('.lc-reel-actions');if(reelBox){reelBox.replaceChildren();for(const [name,label] of [['office','OFFICE'],['street','STREET'],['loft','LOFT'],['station','STATION'],['pump','FLOOD'],['roof','ROOFTOP'],['tram','TRAM'],['market','MARKET'],['club','CLUB'],['chase','CHASE'],['tunnel','UNDERCITY'],['substation','SUBSTATION'],['room','INTERVIEW'],['canal','DAWN']]){const b=document.createElement('button');b.type='button';b.className='cursor-interaction';b.textContent='['+label+']';b.addEventListener('click',()=>{reel(name);const d=root.querySelector('.lc-reel');if(d)d.open=false;});reelBox.appendChild(b);}}
// Observe the stage and the picture area, never the canvas: once the canvas has an explicit width a canvas observer stops firing for container changes.
const stageObserver=new ResizeObserver(layout);stageObserver.observe(root);if(chrome.picture)stageObserver.observe(chrome.picture);
if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(es=>{visible=es[0].isIntersecting&&es[0].intersectionRatio>.15;lastTime=0;},{threshold:.15}).observe(canvas);
requestAnimationFrame(tick);
root.cinemaSprites={load:data=>{const w=loadSprites(data);render();return w;},characters:()=>Object.keys(spriteSheets),warnings:()=>spriteWarnings.slice()};
root.cinemaAudit=()=>({state:JSON.parse(JSON.stringify(state)),session:{...session},scene:sceneName,camera:{...camera},columns:W,rows:H,frame,cast:blocking(),nonASCII:chars.filter(g=>g.charCodeAt(0)<32||g.charCodeAt(0)>126).length,card:cardText,route:routeSteps(),board:boardEntries(),reflex:reflexes(),records:saveStore.readRecords(),sprites:spriteRects.map(r=>({...r})),labels:labelRects.map(r=>({...r})),window:isQte()?caseDuration():0,transit:transit?{phase:transit.phase,t:transit.t}:null,fade,objective:objective(),grid:{W,H,cw,ch,fx,fy},layout:root.classList?.contains('lc-side')?'side':'stacked',caption:captionAudit(),drawer:drawerOpen()});
})();
