// New sets use the approved renderer: world-fixed textures, depth, occlusion and lamps.
const sceneCache={street:{surfaces:surfaces.slice(),lamps:lamps.slice()}};
let sceneName='street',staticCount=surfaces.length;
Object.assign(state,{decoded:false,radio:false,twist:false,rescue:'',gap:0,pursuit:'',caught:false,distance:20,endingSeen:false});
const mat=(kind,hue=0)=>({kind,hue});
function floor(x0,z0,x1,z1,y,kind='tiles',hue=0){quad([x0,y,z0],[x0,y,z1],[x1,y,z1],[x1,y,z0],mat(kind,hue),[0,1,0]);}
function wall(x0,z0,x1,z1,h,kind='wall',hue=0){
 const dx=x1-x0,dz=z1-z0,l=Math.hypot(dx,dz);
 quad([x0,0,z0],[x1,0,z1],[x1,h,z1],[x0,h,z0],mat(kind,hue),[-dz/l,0,dx/l]);
}
function pillar(x,z,h=10){box(x-.32,0,z-.32,x+.32,h,z+.32,mat('column'));box(x-.65,0,z-.65,x+.65,.5,z+.65,mat('stone'));box(x-.6,h-.5,z-.6,x+.6,h,z+.6,mat('stone'));}
function pendant(x,z,y=7){box(x-.04,y,z-.04,x+.04,11,z+.04,mat('metal'));box(x-.5,y-.3,z-.4,x+.5,y+.15,z+.4,mat('lamp',2));lamps.push([x,z]);}
function bench(x,z){box(x-1.5,.55,z-.35,x+1.5,.8,z+.4,mat('wood',2));box(x-1.5,.8,z+.3,x+1.5,1.5,z+.5,mat('wood',2));for(const a of [-1.2,1.2])box(x+a-.1,0,z-.25,x+a+.1,.55,z+.3,mat('metal'));}
function cityRow(z0,z1,spacing,x,h0){for(let z=z0,i=0;z<z1;z+=spacing,i++){const h=h0+hash(i,x)*20;building(x,z,7+hash(i,3)*6,spacing-3,h,i%3===0?4:0,i*7+37);}}
function stationSet(){
 floor(-13,-15,13,46,0);wall(-13,46,-13,-15,12);wall(13,-15,13,46,12);wall(13,46,-13,46,12);
 // A high ribbed roof; broad spaces between columns keep the actors readable.
 for(let z=-8;z<45;z+=9){pillar(-8,z);pillar(8,z);box(-13,10,z-.12,13,10.3,z+.12,mat('metal'));pendant(0,z,7.8);}
 quad([-13,12,-15],[13,12,-15],[13,12,46],[-13,12,46],mat('ceiling'),[0,-1,0]);
 for(const x of [-6.5,6.5])for(const z of [9,23,35])bench(x,z);
 for(const x of [-10,10]){box(x-1.2,0,28,x+1.2,2.2,33,mat('wood',2));box(x-1.4,3,27.8,x+1.4,3.35,33.2,mat('awning',2));}
 box(-2.5,0,43.6,2.5,4.5,44,mat('hatch'));box(-3,4.7,43.4,3,5.8,43.9,mat('sign'));
 box(-2.3,0,18.7,2.3,1.15,20.4,mat('wood',2));box(-1.9,1.15,19,1.9,1.24,20.2,mat('dispatch',6));
 box(-.8,1.24,19.5,.8,1.7,20,mat('console',1));
 for(const x of [-10,10])box(x-.9,3,15,x+.9,6,15.2,mat('poster',2));
}
function pumpSet(){
 floor(-15,-12,15,36,-.7,'water',1);wall(-15,36,-15,-12,11,'brick');wall(15,-12,15,36,11,'brick');wall(15,36,-15,36,11,'brick');
 box(-2.6,-.3,-12,2.6,0,20,mat('grate'));box(-2.6,-.3,16,10,0,25,mat('grate'));
 for(const x of [-2.5,2.5])for(let z=-8;z<16;z+=4){box(x-.035,0,z-.035,x+.035,.8,z+.035,mat('metal'));box(x-.03,.8,z,x+.03,.84,z+4,mat('metal'));}
 for(const x of [-8,8])for(const z of [7,24]){ellipsoid(x,3,z,2.2,3.5,2.2,mat('tank',1));box(x-.8,5,z-.8,x+.8,7.5,z+.8,mat('metal'));box(x-.27,7.2,-10,x+.27,7.65,33,mat('pipe',2));}
 for(const z of [-4,12,29]){box(-15,9,z-.18,15,9.4,z+.18,mat('metal'));pendant(0,z,6.5);}
 box(-1.7,.3,12,-.9,2.3,12.6,mat('console',2));
 box(3.8,0,17,6.5,1.2,18.5,mat('metal'));box(-2,0,33.6,2,4,34,mat('hatch'));
 box(5.3,2.3,31,5.6,8,31.3,mat('metal'));box(6.7,2.3,31,7,8,31.3,mat('metal'));for(let y=2.4;y<8;y+=.45)box(5.3,y,31,7,y+.08,31.3,mat('metal'));
}
function roofSet(){
 floor(-16,-14,16,26,0,'roof');for(const x of [-16,16])box(x-.15,0,-14,x+.15,1.15,26,mat('brick'));
 box(-16,0,25.8,16,1.25,26.2,mat('brick'));box(-12,0,-4,-7,4.2,3,mat('brick'));box(-10.7,0,3.01,-8.4,3,3.2,mat('hatch'));
 box(7,0,7,11,1.8,12,mat('vent'));box(9,0,-3,12,2,-.5,mat('vent'));
 for(const x of [-2,2])box(x-.1,0,17,x+.1,3,17.2,mat('metal'));
 box(-2,2.3,17,2,2.6,17.3,mat('metal'));box(-2.1,0,16.7,2.1,1.2,18,mat('wood',2));box(-.6,1.2,17,.6,1.8,17.5,mat('console',1));
 box(-5,0,20,-4.85,10,20.2,mat('metal'));for(let y=5;y<10;y+=1.4)box(-7,y,20,-2.8,y+.06,20.1,mat('metal'));
 const cityStart=surfaces.length;
 for(const x of [-29,22])cityRow(-15,100,16,x,12);cityRow(39,115,19,-15,19);cityRow(46,125,19,1,23);
 cityRow(25,130,20,48,28);cityRow(50,145,22,70,20);
 for(let i=cityStart;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]-=20;surfaces[i].mat={...surfaces[i].mat,baseY:-20};}
 // Far traffic travels through actual 3D space behind the parapet.
 pendant(-12,13,5.5);
}
function chaseSet(){
 floor(-7,-55,7,950,0,'express');
 for(const x of [-7,7]){box(x-.13,0,-55,x+.13,.65,950,mat('barrier'));for(let z=-30;z<940;z+=24){box(x-.07,.65,z-.08,x+.07,6.5,z+.08,mat('metal'));box(x-.6,6.15,z-.3,x+.6,6.5,z+.3,mat('lamp',2));}}
 cityRow(-40,930,20,-24,22);cityRow(-40,930,20,15,26);
 for(let z=36;z<940;z+=80){box(-7,7,z,7,7.3,z+.3,mat('metal'));box(-3.5,5.5,z-.12,3.5,7,z+.15,mat('highway-sign',1));}
 floor(-100,-50,100,1000,-15,'water',1);
}
function canalSet(){
 floor(-45,-20,-4,130,-1.6,'water',1);floor(-4,-20,25,110,0,'paving');box(-4.3,-1.8,-20,-3.9,.45,110,mat('brick'));
 for(let z=-6;z<100;z+=12){box(-3.4,0,z-.1,-3.2,4.7,z+.1,mat('metal'));box(-3.7,4.2,z-.3,-2.9,4.7,z+.3,mat('lamp',2));lamps.push([-3.3,z]);}
 cityRow(-10,125,15,14,12);cityRow(28,140,17,-39,17);
 box(-45,6,49,25,6.6,54,mat('brick'));for(const x of [-30,-15,0,15])box(x-1,-2,49,x+1,6,54,mat('brick'));
 for(const z of [17,38]){box(-12,-1.4,z,-7,-.2,z+8,mat('wood',2));box(-11.5,-.2,z+2,-7.5,1.6,z+6,mat('tram',1));}
 bench(3,18);box(7,0,24,11,2.8,30,mat('tram',6));
}
const builders={station:stationSet,pump:pumpSet,roof:roofSet,chase:chaseSet,canal:canalSet};
function setScene(name){
 if(name===sceneName)return false;
 if(!sceneCache[name]){surfaces.length=0;lamps.length=0;builders[name]();sceneCache[name]={surfaces:surfaces.slice(),lamps:lamps.slice()};}
 surfaces.length=0;surfaces.push(...sceneCache[name].surfaces);lamps.length=0;lamps.push(...sceneCache[name].lamps);staticCount=surfaces.length;sceneName=name;return true;
}
function car(x,z,hue=1,y=0,large=false){
 const w=large?1.45:1.05,l=large?3.6:2.2;
 box(x-w,y+.35,z-l,x+w,y+1.05,z+l,mat('car',hue));
 box(x-w*.78,y+1.05,z-l*.52,x+w*.78,y+1.9,z+l*.55,mat('glass',hue));
 box(x-w*.85,y+1.9,z-l*.55,x+w*.85,y+2.06,z+l*.58,mat('metal',hue));
 for(const dx of [-w,w])for(const dz of [-l*.67,l*.67])box(x+dx-.16,y+.13,z+dz-.4,x+dx+.16,y+.7,z+dz+.4,mat('rubber'));
 for(const dx of [-w*.7,w*.7]){box(x+dx-.22,y+.58,z-l-.06,x+dx+.22,y+.83,z-l,mat('tail',3));box(x+dx-.22,y+.65,z+l,x+dx+.22,y+.88,z+l+.06,mat('lamp',2));}
}
function extended(){return !['brief','watch','ready','follow','danger','qte','result','evidence','deduce','arrival','ending'].includes(state.phase);}
function sceneFor(p){return p.startsWith('station')?'station':p.startsWith('pump')?'pump':p.startsWith('roof')?'roof':p.startsWith('chase')?'chase':p.startsWith('canal')?'canal':'street';}
const look=(x,y,z,tx,ty,tz)=>({x,y,z,yaw:Math.atan2(tx-x,tz-z),pitch:Math.atan2(ty-y,Math.hypot(tx-x,tz-z))});
function caseShot(){
 const p=state.phase;
 if(sceneName==='station')return p==='stationEntry'?look(-3.5,3.1,10,0,1.5,19):look(-3.5,2.9,13,0,1.1,19);
 if(sceneName==='pump')return ['pumpEntry','pumpFind'].includes(p)?look(-1.5,2.5,3,1.8,1.25,14):p==='pumpTruth'?look(.3,2.7,10.5,3,1.4,16.4):look(-1.7,3.1,8,1.1,1,14);
 if(sceneName==='roof'){
  if(p==='roofEntry')return look(-7,4.1,4,1,1.2,15);
  if(['roofListen','roofSignal'].includes(p))return look(-3.2,2.8,10.3,.1,1.1,16.6);
  return look(-5.5,4.8,8,1.5,1.5,18);
 }
 if(sceneName==='chase'){
  const d=state.distance;
  if(p==='chaseBank')return look(-13,3.5,d-10,0,1.3,d+6);
  if(p==='chaseFinish'&&state.pursuit==='ramp')return look(-9,7,d-14,-8,-1,d+9);
  return look(-.6,p==='chaseEntry'?5:3.3,d-11,.3,1.2,d+13);
 }
 return look(-1.2,3.1,5,3,1.5,15);
}
function sceneStart(name){
 return name==='station'?look(5,10,-4,0,0,24):name==='pump'?look(-4.5,1.8,-7,2,1.5,18):name==='roof'?look(-12,6,-5,1.3,1.5,15):name==='chase'?look(-7,9,state.distance-15,0,1,state.distance+16):look(8,2.3,7,3,1,15);
}
function casePose(){
 const duration={stationEntry:7,pumpEntry:6,pumpDanger:2,roofEntry:8,canalEntry:7}[state.phase]||1.5;
 if(sceneName==='chase'){
  const target=caseShot(),u=reduce?1:span(state.phase==='chaseEntry'?5:1.1);
  const origin={...transitionFrom,z:transitionFrom.z+state.distance-(state.phaseDistance||state.distance)};
  for(const k of Object.keys(camera))camera[k]=mix(origin[k],target[k],u);
 }else{const target=caseShot(),u=reduce?1:span(duration);for(const k of Object.keys(camera))camera[k]=mix(transitionFrom[k],target[k],u);}
 state.moving=/Entry|Bank|Finish|Result/.test(state.phase);
}
function caseBlocking(){
 const p=state.phase,others=[];let rook=null,courier=null;
 if(sceneName==='station'){
  const u=p==='stationEntry'&&!reduce?span(7):1;
  rook={x:mix(-1.6,-1.2,u),z:mix(8,17.2,u),pose:u<1?'walk':'read'};
  if(state.choice==='person')courier={x:1.3,z:mix(9,18,u),pose:u<1?'walk':'stand'};
 }
 if(sceneName==='pump'){
  const u=p==='pumpEntry'&&!reduce?span(6):1,v=p==='pumpResult'&&!reduce?span(4):p==='pumpTruth'?1:0;
  rook={x:mix(-.6,1.8,v),z:mix(mix(1,11,u),15.7,v),pose:u<1?'walk':v>0?'support':'watch'};
  others.push({x:mix(4.8,3.25,v),y:1.2*(1-v),z:mix(17.8,16.2,v),pose:'stand',hue:2});
  if(state.choice==='person')courier={x:1.5,z:14.5,pose:'watch'};
 }
 if(sceneName==='roof'){
  const u=p==='roofEntry'&&!reduce?span(8):1;
  rook={x:mix(-8,-1.6,u),z:mix(5,15.8,u),pose:u<1?'walk':'watch'};
  others.push({x:2.4,z:16.4,pose:'stand',hue:2});
  if(state.choice==='person')courier={x:1,z:18,pose:'stand'};
 }
 if(sceneName==='canal'){
  rook={x:2,z:14,pose:'watch'};others.push({x:3.4,z:15.2,pose:'stand',hue:2});
  if(state.choice==='person')courier={x:4.8,z:16.5,pose:'stand'};
  if(state.caught)others.push({x:6.2,z:19.2,pose:'stand',hue:3});
 }
 return{rook,courier,book:null,others};
}
function caseGeometry(){
 surfaces.length=staticCount;
 if(sceneName==='pump'){
  const spin=state.phase==='pumpResult'&&state.rescue==='valve'?span(4)*Math.PI:0;
  const x=-1.25,z=11.88,y=1.35;
  for(let i=0;i<12;i++){const a=i*Math.PI/6+spin,b=(i+1)*Math.PI/6+spin;quad([x+Math.cos(a)*.6,y+Math.sin(a)*.6,z],[x+Math.cos(b)*.6,y+Math.sin(b)*.6,z],[x+Math.cos(b)*.43,y+Math.sin(b)*.43,z],[x+Math.cos(a)*.43,y+Math.sin(a)*.43,z],mat('lamp',2),[0,0,-1]);}
  box(-1.3,1.29,11.85,-1.2,1.41,12,mat('metal'));
 }
 if(sceneName==='roof'){
  const d=reduce?4:state.t*3;
  for(let i=0;i<4;i++)car(-27+fract(i*.27+d*.008)*65,43+i*8,i%2?3:1,3+i*2);
 }
 if(sceneName==='chase'){
  const d=state.distance,p=state.phase,shift=p==='chaseBank'||p==='chaseQteB'||p==='chaseFinish'?state.firstMove==='dodge'?2.4:-2.2:-2.2;
  let y=0,x=shift;
  if(p==='chaseBank'&&!reduce)x=mix(-2.2,shift,span(3));
  if(p==='chaseFinish'&&state.pursuit==='jump'&&state.caught)y=reduce?1.5:Math.sin(clamp((state.event-.5)/4.5,0,1)*Math.PI)*3.2;
  if(p==='chaseFinish'&&state.pursuit==='ramp'){
   x=mix(shift,-10.2,span(4));y=-clamp((d-state.phaseDistance-29)/50,0,1)*7.5;
   const a=state.phaseDistance+16,b=a+64;
   quad([-7,0,a],[-3,0,a],[-8.2,-8,b],[-12.2,-8,b],mat('express'),[0,1,.12]);
   for(const side of [-1,1]){const x0=-5+side*2,x1=-10.2+side*2;quad([x0,0,a],[x1,-8,b],[x1,-7.5,b],[x0,.5,a],mat('barrier'),[side,0,0]);}
   // Open the left guardrail where the service ramp leaves the main deck.
   for(let i=1;i<=5;i++)surfaces[i]={...sceneCache.chase.surfaces[i],v:sceneCache.chase.surfaces[i].v.map(v=>[v[0],v[1],v[2]>900?a:v[2]])};
   box(-7.13,0,a+45,-6.87,.65,950,mat('barrier'));
  }else for(let i=1;i<=5;i++)surfaces[i]=sceneCache.chase.surfaces[i];
  car(x,d,1,y);box(x-.45,y+2.07,d-.2,x+.45,y+2.15,d+.2,mat('lamp',2));
  const bridgeZ=(state.phaseDistance||d)+26;
  const valeZ=d+16+state.gap*7,valeY=p==='chaseFinish'&&state.pursuit==='jump'&&state.caught?Math.sin(clamp((valeZ-bridgeZ+7)/32,0,1)*Math.PI)*2.7:0;
  car(1.6,valeZ,3,valeY);
  for(let i=0;i<3;i++){const z=d+28+i*24+Math.sin(state.t*.3+i)*5;car(i%2?2.3:-2.3,z,i%2?0:2,0,i===0);}
  if(['chaseEntry','chaseQteA'].includes(p))car(-2.2,d+13,0,0,true);
  if(['chaseQteB','chaseFinish'].includes(p)){
   const z=p==='chaseFinish'?bridgeZ:d+29;for(const dx of [-7,7])box(dx-.3,0,z,dx+.3,6,z+.6,mat('metal'));
   box(-7,5.5,z,7,5.85,z+.5,mat('barrier'));
   if(p==='chaseFinish'&&state.pursuit==='jump'&&state.caught){
    // Split the physical deck so the canal is visible through the gap.
    surfaces[0]={...surfaces[0],v:[[-7,0,-55],[-7,0,bridgeZ],[7,0,bridgeZ],[7,0,-55]]};
    floor(-7,bridgeZ+15,7,950,0,'express');
    box(-7,-1,bridgeZ-1,7,0,bridgeZ,mat('brick'));box(-7,-1,bridgeZ+15,7,0,bridgeZ+16,mat('brick'));
   }else surfaces[0]=sceneCache.chase.surfaces[0];
  }
 }
 return caseBlocking();
}
function caseLabels(){
 if(sceneName==='station'){worldLabel([0,5.25,43.2],'PUMP ROOM 4',2);worldLabel([0,2.2,19.1],'MAINTENANCE',2);}
 if(sceneName==='pump'){worldLabel([-1.25,2.65,11.8],'INLET',2);if(!['pumpResult','pumpTruth'].includes(state.phase))worldLabel([4.8,3.9,17.7],'BELL',2);if(state.phase==='pumpQte'){worldLabel([-1.25,3.3,11.8],'[1]',2);worldLabel([4.8,4.5,17.7],'[2]',2);}}
 if(sceneName==='roof')worldLabel([0,3.2,17],'NORTH / RADIO',2);
 if(sceneName==='chase'){
  worldLabel([1.6,3.3,state.distance+16+state.gap*7],'VALE',3);
  if(state.phase==='chaseQteA')worldLabel([-2.2,3.3,state.distance+13],'FREIGHT',2);
  if(state.phase==='chaseQteB')worldLabel([0,5.1,state.distance+28],'BRIDGE LIFTING',2);
 }
 if(sceneName==='canal')worldLabel([9,3.5,24],'CITY MEDIC',2);
}
