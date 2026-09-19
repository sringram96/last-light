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
 if(['evidence','deduce'].includes(state.phase))return state.choice==='person'?{x:-2.8,y:2.4,z:15.6,yaw:.28,pitch:-.02}:state.choice==='book'?{x:-1.5,y:2.3,z:16.3,yaw:.5,pitch:-.18}:{x:-1.8,y:1.7,z:16.3,yaw:.45,pitch:-.2};
 return endShot;
}
function pose(){
 if(extended()){casePose();return;}
 const target=shotFor(),duration=state.phase==='follow'?8:state.phase==='arrival'?7:state.phase==='danger'?2:.9;
 const u=reduce?1:span(duration);
 for(const k of Object.keys(camera))camera[k]=mix(transitionFrom[k],target[k],u);
 state.travel=clamp((camera.z+5)/35,0,1);
 state.moving=['follow','arrival'].includes(state.phase);
}
function blocking(){
 if(extended())return caseBlocking();
 let rook={x:-3.2,z:3,pose:'watch'},courier={x:.1,z:12,pose:'walk'},book={x:.65,y:1.05,z:11.9,flat:false};
 if(['follow','danger','qte','result','evidence','deduce','arrival','ending'].includes(state.phase)){
  const u=state.phase==='follow'&&!reduce?span(8):1;
  rook={x:mix(-3.2,-2.2,u),z:mix(3,17.8,u),pose:state.phase==='follow'?'walk':'watch'};
  courier={x:mix(.1,.6,u),z:mix(12,20,u),pose:state.phase==='follow'?'walk':'stand'};
  book={x:courier.x+.62,y:1.18,z:courier.z-.16,flat:false};
 }
 if(['danger','qte','result','evidence','deduce'].includes(state.phase)){
  const q=state.phase==='danger'?span(2)*.15:state.phase==='qte'?.15+.65*clamp(state.event/qteDuration(),0,1):.8;
  courier.pose='stumble';courier.lean=q*.62;
  book={x:1.2+q*.35,y:1.18-q*.7,z:19.65,flat:false};
 }
 if(['result','evidence','deduce','arrival','ending'].includes(state.phase)){
  const u=state.phase==='result'&&!reduce?span(3.8):1;
  if(state.choice==='person'){
   rook={x:mix(-2.2,-.85,u),z:mix(17.8,19.5,u),pose:u<.8?'reach':'support'};
   courier={x:.6,z:20,pose:'stand',lean:(1-u)*.5};
   book={x:1.48,y:mix(.6,.07,u),z:19.65,flat:u>.65};
  }else{
   rook={x:mix(-2.2,state.choice==='book'?1.1:-.5,u),z:mix(17.8,19.3,u),pose:state.choice==='book'?(u<.75?'reach':'read'):'crouch'};
   courier={x:mix(.6,-4,u),z:mix(20,29,u),pose:'walk'};
   book=state.choice==='book'?{x:mix(1.4,1.55,u),y:mix(.6,1.3,u),z:mix(19.65,18.96,u),flat:false}:{x:1.48,y:.07,z:19.65,flat:true};
  }
 }
 if(['arrival','ending'].includes(state.phase)){
  const u=state.phase==='arrival'&&!reduce?span(7):1;
  const path=(x,z,endX,endZ)=>u<.45?{x:mix(x,-3.2,u/.45),z:mix(z,25,u/.45)}:{x:mix(-3.2,endX,(u-.45)/.55),z:mix(25,endZ,(u-.45)/.55)};
  rook={...path(rook.x,rook.z,-4.6,36.3),pose:u<1?'walk':'watch'};
  if(state.choice==='person')courier={...path(.6,20,-5.2,37.2),pose:u<1?'walk':'stand'};
  else courier=null;
  book=null;
 }
 return{rook,courier,book};
}
function actor(a,isRook=false){
 if(!a)return;
 let rows=isRook?['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /##~#\\   ',' /|#####|\\ ','  |#####|  ','  /#####\\  ',' /___|___\\ ','    | |    ','   _| |_   ']:['   ___   ',' _/===\\_ ','  (o.o)  ','   /|\\   ','  /###\\  ',' /#####\\ ',' |#####| ','  /###\\  ','   | |   ','   | |   '];
 if(a.pose==='walk'){
  const odd=Math.floor(state.t*5)%2;
  rows[rows.length-2]=isRook?(odd?'   /   |   ':'   |   \\   '):(odd?'  /   |  ':'  |   \\  ');
  rows[rows.length-1]=isRook?(odd?' _/    |_  ':'  _|    \\_ '):(odd?'_/    |_ ':' _|    \\_');
 }
 if(isRook&&['reach','support','read'].includes(a.pose)){rows[4]='  /##~#|__ ';rows[5]=a.pose==='read'?'  |####|=[]':'  |#####| \\';}
 if(!isRook&&a.pose==='stumble'){rows[3]='\\  /|\\  /';rows[4]=' \\/###\\/ ';rows[8]='  /   |  ';}
 if(isRook&&a.pose==='crouch')rows=['    ____   ','  _/====\\_ ','   ( o_>   ','   /|~\\    ','  /####\\__ ',' /######|\\ ','/_/   \\___ '];
 const height=a.pose==='crouch'?1.35:isRook?2.15:2.05,cols=isRook?11:9;
 const bottom=cam([a.x,.16+(a.y||0),a.z]),top=cam([a.x+(a.lean||0),height+(a.y||0),a.z]);if(bottom.z<.4)return;
 const ap=project(top),bp=project(bottom),h=bp.y-ap.y,w=h*(ch/cw)*.41;
 if(h<1)return;
 for(let y=Math.max(0,Math.floor(ap.y));y<=Math.min(H-1,Math.ceil(bp.y));y++){
  const u=clamp((y-ap.y)/h,0,.999),row=rows[Math.floor(u*rows.length)],cx=mix(ap.x,bp.x,u),left=cx-w/2;
  for(let x=Math.floor(left);x<left+w;x++){
   const col=clamp(Math.floor((x-left)/w*cols),0,cols-1),g=row[col]||' ';if(g===' ')continue;
   const hue=isRook?(g==='~'?2:g==='o'||g==='>'?6:1):(a.hue??6);
   pixel(x,y,mix(top.z,bottom.z,u)-.06,g,hue*20+(isRook?14:11));
  }
 }
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
 if(a.courier){
  const p=a.courier;
  // A physical lantern is bright enough to lead the eye through the street.
  const y=['danger','qte'].includes(state.phase)?1.02:.95;
  box(p.x-.7,y-.22,p.z-.12,p.x-.43,y+.22,p.z+.12,{kind:'lamp',hue:2});
 }
 return a;
}
function render(){
 if(!W||!H)return;frame++;zbuf.fill(Infinity);chars.fill(' ');ink.fill(0);
 sy=Math.sin(camera.yaw);cy=Math.cos(camera.yaw);sp=Math.sin(camera.pitch);cp=Math.cos(camera.pitch);
 const cast=geometry();
 for(const s of surfaces){
  const a=s.v[0],f=s.n[0]*(camera.x-a[0])+s.n[1]*(camera.y-a[1])+s.n[2]*(camera.z-a[2]);if(f<-.01&&s.mat.kind!=='cable')continue;
  const poly=clip(s.v.map(cam));if(poly.length<3)continue;const proj=poly.map(project);for(let i=1;i<proj.length-1;i++)triangle(proj[0],proj[i],proj[i+1],s.mat,s.n);
 }
 // Rain is rendered before people, so it does not cover their faces.
 if(['street','roof','chase','canal'].includes(sceneName))for(let i=0;i<125;i++){
  const x=hash(i,3)*22-11,z=camera.z+hash(i,7)*37,y=fract(hash(i,11)-state.t*.25)*16,p=cam([x,y,z]);if(p.z<.4)continue;
  const q=project(p);pixel(q.x,q.y,p.z,'/',7*20+7);
 }
 actor(cast.courier);actor(cast.rook,true);for(const a of cast.others||[])actor(a);
 if(sceneName==='street'){
 worldLabel([-7.95,3.05,5.5],'PRINT',1);worldLabel([0,6.5,38.75],'NORTH STATION',2);worldLabel([-4.9,2.95,38.6],'PUMP 4',2);
 const hotel=cam([7.03,11.2,11.8]);if(hotel.z>2){const p=project(hotel);'HOTEL'.split('').forEach((g,i)=>pixel(p.x,p.y+i,hotel.z-.2,g,2*20+17));}
 if(state.phase==='qte'){
  worldLabel([cast.courier.x,2.75,cast.courier.z],'[1]',2);
  worldLabel([cast.book.x,cast.book.y+.85,cast.book.z],'[2]',2);
 }
 if(['evidence','deduce'].includes(state.phase)&&state.choice==='book'&&cast.book)worldLabel([cast.book.x,cast.book.y+.12,cast.book.z-.1],'P4',6);
 }else caseLabels();
 const colors=state.mono?gray:palettes;
 ctx.fillStyle='#03070b';ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);ctx.font=(cw/.6)+'px "Liberation Mono",Consolas,monospace';ctx.textBaseline='top';
 let current=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,g=chars[i];if(g===' ')continue;if(ink[i]!==current){current=ink[i];ctx.fillStyle=colors[current];}ctx.fillText(g,x*cw,y*ch);}
 timer();
}
function qteDuration(){return state.watched?9:7;}
function addClue(text){if(!state.clues.includes(text))state.clues.push(text);}
function button(text,fn){
 const b=document.createElement('button');b.type='button';b.className='cursor-interaction';b.textContent=text;b.disabled=state.paused;
 const action=()=>{if(!state.paused&&!b.disabled)fn();};b.addEventListener('click',action);el.actions.appendChild(b);keys.push(action);
}
function enter(phase){
 transitionFrom={...camera};state.phase=phase;state.event=0;
 caseEnter(phase);
 if(phase==='ready'){state.watched=true;addClue('The courier favors an injured leg. You can anticipate the stumble.');}
 if(phase==='evidence'){
  if(state.choice==='person')addClue('Nell says Bell is alive below the station, in Pump Room 4. The service knock is three short taps.');
  else if(state.choice==='book')addClue('An intact dispatch entry reads: 00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN.');
  else addClue('The dispatch pages are ruined. PUMP ROOM 4 is embossed into the cover.');
 }
 if(reduce)pose();
 ui();render();checkpoint();
}
function choose(id){if(state.phase!=='qte'||state.paused)return;state.choice=id;enter('result');}
function deduce(correct){
 if(correct){enter('arrival');return;}state.wrong=true;ui();
}
function reset(){
 Object.assign(state,{t:0,paused:false,mono:state.mono,travel:0,moving:false,phase:'brief',event:0,watched:false,choice:'',untimed:state.untimed,clues:[],wrong:false,decoded:false,radio:false,twist:false,rescue:'',gap:0,pursuit:'',caught:false,distance:20,endingSeen:false,firstMove:'',phaseDistance:20});
 setScene('street');
 Object.assign(camera,startShot);transitionFrom={...startShot};el.journal.open=false;lastTime=0;ui();render();
}
function timer(){
 if(session.menu){el.timer.textContent='';return;}
 if(state.paused){el.timer.textContent='PAUSED';return;}
 if(['watch','stationListen','roofListen'].includes(state.phase))el.timer.textContent='OBSERVING / '+Math.max(0,Math.ceil(8-state.event))+'s';
 else if(isQte()){
  const left=Math.max(0,caseDuration()-state.event),n=Math.ceil(left/caseDuration()*10);
  el.timer.textContent=state.untimed?'TAKE YOUR TIME':'['+'='.repeat(n)+'.'.repeat(10-n)+'] '+left.toFixed(1)+'s';
 }else el.timer.textContent=['follow','danger','result','arrival',...liveCase].includes(state.phase)?'LIVE':'YOUR MOVE';
}
function ui(){
 el.actions.replaceChildren();keys=[];el.outcome.hidden=state.phase!=='ending';
 el.clues.replaceChildren();for(const clue of state.clues){const li=document.createElement('li');li.textContent=clue;el.clues.appendChild(li);}
 el.journal.hidden=!state.clues.length;
 const phases={brief:'THE LAST LIGHT',watch:'WATCH THE COURIER',ready:'A USEFUL DETAIL',follow:'FOLLOW THE LANTERN',danger:'THE COURIER STUMBLES',qte:'THE BOOK IS FALLING',result:state.choice==='person'?'COURIER CAUGHT':state.choice==='book'?'DISPATCH SAVED':'TOO LATE',evidence:state.choice==='person'?'A WITNESS':state.choice==='book'?'A WRITTEN LEAD':'A DAMAGED CLUE',deduce:'WHERE DID BELL GO?',arrival:'NORTH STATION / SERVICE DOOR',ending:'THE WAY BELOW'};
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
  el.caption.textContent='Rook keeps to the shadows. The stranger heads toward the station clock.';break;
 case 'danger':
  el.caption.textContent='A boot catches the wet tram rail. The courier pitches forward; the dispatch book slips free. Get ready.';break;
 case 'qte':
  el.caption.textContent='Catch the courier, or save the dispatch book before the rain destroys it.';
  button('[1] CATCH THE COURIER',()=>choose('person'));button('[2] SAVE THE BOOK',()=>choose('book'));break;
 case 'result':
  el.caption.textContent=state.choice==='person'?'Rook catches the courier. The book hits the wet street; ink begins to run.':state.choice==='book'?'Rook saves the book. The courier catches their balance and limps away toward the station.':'Rook reaches too late. The book falls into the water, and the courier limps away.';break;
 case 'evidence':
  el.caption.textContent=state.choice==='person'?'Nell: "Bell is alive. Pump Room 4, below the station. Knock three times. I will take you."':state.choice==='book'?'The page is fresh: "00:17 / I. BELL / PUMP ROOM 4 / JOB OPEN." The station is still being used.':'The rain has erased the entries. The cover still reads "PUMP ROOM 4." It is a lead, without a name or time.';
  button('[CONNECT THE CLUE]',()=>enter('deduce'));break;
 case 'deduce':
  el.caption.textContent=state.wrong?'The clue points to Pump Room 4 beneath the station. Rook needs the service entrance.':'Which lead should Rook pursue?';
  button('[THE STATION SERVICE ENTRANCE]',()=>deduce(true));button('[THE HOTEL]',()=>deduce(false));button('[THE EMPTY TRAM]',()=>deduce(false));break;
 case 'arrival':
  el.caption.textContent=state.choice==='person'?'Nell leads Rook to the service hatch. Three short knocks.':'Rook follows the rails to the station and finds the pump-room service hatch.';break;
 case 'ending':
  el.caption.textContent='Bell is somewhere below. Rook has found the entrance; the search can continue.';
  el.outcome.textContent=state.choice==='person'?'Your route: a cooperative witness and the correct knock. The written record was lost.':state.choice==='book'?'Your route: an intact dispatch record. You will enter alone, without the knock.':'Your route: a damaged clue. You will enter alone, with less certainty.';
  button('[ENTER THE STATION]',()=>enter('stationEntry'));break;
 default:caseUI();break;
 }
 el.pause.disabled=session.menu;
 const menuButton=root.querySelector('.lc-menu');if(menuButton)menuButton.hidden=session.menu;
 const reelDetails=root.querySelector('.lc-reel');if(reelDetails)reelDetails.hidden=!session.menu;
 if(session.menu)el.journal.hidden=true;
 el.pause.textContent=state.paused?'[RESUME]':'[PAUSE]';el.pause.setAttribute('aria-pressed',String(state.paused));
 el.timing.textContent=state.untimed?'[UNTIMED]':'[TIMED]';el.timing.setAttribute('aria-pressed',String(state.untimed));
 el.mono.textContent=state.mono?'[COLOR]':'[MONO]';el.mono.setAttribute('aria-pressed',String(state.mono));
 const sceneDescriptions={street:'A dense 3D ASCII night street, warm lamps and wet tram tracks.',station:'A vaulted station hall, tiled floor, columns, warm pendant lamps and a maintenance desk.',pump:'A flooded machinery chamber. Bell is on a platform and Rook stands by the inlet wheel.',roof:'A high rooftop overlooking deep city streets and flying traffic.',chase:'Rook\'s cyan patrol car pursues Vale\'s red car along an elevated road.',canal:'A quiet canal at first light. Rook and Bell stand near a medical vehicle.'};
 canvas.setAttribute('aria-label',sceneDescriptions[sceneName]+' '+el.caption.textContent);
 const chapter=root.querySelector('.lc-chapter');if(chapter)chapter.textContent=(session.mode==='preview'?'PREVIEW / ':'')+{street:'01 / STATION ROAD',station:'02 / CONCOURSE',pump:'03 / PUMP ROOM',roof:'04 / ROOFTOP',chase:'05 / PURSUIT',canal:'06 / FIRST LIGHT'}[sceneName];
 timer();
}
function resize(){
 const width=canvas.clientWidth;if(width<=0)return;
 // Exact approved density, proportions, field of view, and font sizing.
 W=clamp(Math.floor(width/4.2),72,180);H=Math.round(W*(width<480?.67:.39));cw=width/W;ch=cw*1.72;dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(H*ch*dpr);canvas.style.height=H*ch+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 fx=W/(2*Math.tan((width<480?66:78)*Math.PI/360));fy=fx/1.72;
 zbuf=new Float32Array(W*H);chars=new Array(W*H);ink=new Uint16Array(W*H);render();
}
el.pause.addEventListener('click',()=>{state.paused=!state.paused;lastTime=0;ui();render();});
el.mono.addEventListener('click',()=>{state.mono=!state.mono;savePreferences();ui();render();});
el.timing.addEventListener('click',()=>{state.untimed=!state.untimed;if(!state.untimed&&isQte())state.event=0;savePreferences();ui();render();});
root.querySelector('.lc-menu')?.addEventListener('click',openMenu);
root.addEventListener('keydown',e=>{if(session.menu||e.repeat||!isQte()||!['1','2'].includes(e.key))return;e.preventDefault();keys[Number(e.key)-1]?.();});
document.addEventListener('visibilitychange',()=>{lastTime=0;});
function tick(now){
 if(!root.isConnected)return;const dt=lastTime?Math.min(.1,Math.max(0,(now-lastTime)/1000)):0;lastTime=now;
 if(session.menu&&visible&&!document.hidden){
  if(state.phase==='brief'&&!reduce)state.t+=dt;
  if(now-lastFrame>66){render();lastFrame=now;}
 }else if(!state.paused&&visible&&!document.hidden){
  if(!reduce)state.t+=dt;
  if(!(isQte()&&state.untimed))state.event+=dt;
  if(extended())caseAdvance(dt);
  pose();
  if(state.phase==='watch'&&state.event>=8)enter('ready');
  else if(state.phase==='follow'&&state.event>=(reduce?1:8))enter('danger');
  else if(state.phase==='danger'&&state.event>=2)enter('qte');
  else if(state.phase==='qte'&&!state.untimed&&state.event>=qteDuration())choose('missed');
  else if(state.phase==='result'&&state.event>=4)enter('evidence');
  else if(state.phase==='arrival'&&state.event>=(reduce?1:7))enter('ending');
  if(now-lastFrame>66){if(!reduce)render();else timer();lastFrame=now;}
 }
 requestAnimationFrame(tick);
}
ui();pose();resize();
const reelBox=root.querySelector('.lc-reel-actions');if(reelBox){reelBox.replaceChildren();for(const [name,label] of [['street','STREET'],['station','STATION'],['pump','FLOOD'],['roof','ROOFTOP'],['chase','CHASE'],['canal','DAWN']]){const b=document.createElement('button');b.type='button';b.className='cursor-interaction';b.textContent='['+label+']';b.addEventListener('click',()=>{reel(name);const d=root.querySelector('.lc-reel');if(d)d.open=false;});reelBox.appendChild(b);}}
new ResizeObserver(resize).observe(canvas);
if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(es=>{visible=es[0].isIntersecting&&es[0].intersectionRatio>.15;lastTime=0;},{threshold:.15}).observe(canvas);
requestAnimationFrame(tick);
root.cinemaAudit=()=>({state:JSON.parse(JSON.stringify(state)),session:{...session},scene:sceneName,camera:{...camera},columns:W,rows:H,frame,cast:blocking(),nonASCII:chars.filter(g=>g.charCodeAt(0)<32||g.charCodeAt(0)>126).length});
})();
