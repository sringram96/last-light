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
 quad([-70,0,58],[70,0,58],[70,40,58],[-70,40,58],mat('dawn',4),[0,0,-1]);
}
function officeSet(){
 // Night Division: a small office, one lamp, a case board, and a window onto the city below.
 floor(-8,-6,8,16,0,'plank',2);wall(-8,16,-8,-6,5,'brick',2);wall(8,-6,8,16,5,'brick',2);
 box(-8,0,16,-5,5,16.3,mat('brick',2));box(5,0,16,8,5,16.3,mat('brick',2));box(-5,0,16,5,1,16.3,mat('brick',2));box(-5,4.2,16,5,5,16.3,mat('brick',2));
 box(-5.1,.9,15.9,5.1,1.1,16.4,mat('metal'));box(-5.1,4.1,15.9,5.1,4.3,16.4,mat('metal'));for(const x of [-1.7,1.7])box(x-.06,1,16,x+.06,4.2,16.3,mat('metal'));
 box(-5,3.3,16.05,5,4.2,16.15,mat('blind',4));
 quad([-8,5,-6],[8,5,-6],[8,5,16],[-8,5,16],mat('ceiling'),[0,-1,0]);
 for(const x of [-8,8])box(x-.12,2.2,-6,x+.12,2.4,16,mat('metal'));
 box(-2.6,0,7,2.6,1.05,9.6,mat('wood',2));box(-2.7,1.05,6.9,2.7,1.14,9.7,mat('metal'));box(-2.1,.05,7.2,-.3,1,9.4,mat('metal'));
 floor(-4.5,4.5,4.5,12.5,.01,'carpet',3);
 box(1.5,1.14,8.6,2.2,1.3,9.2,mat('metal'));box(1.78,1.3,8.85,1.92,2.05,8.95,mat('metal'));box(1.5,2.05,8.55,2.2,2.3,9.25,mat('lamp',2));lamps.push([1.85,8.9]);
 box(-1.5,1.14,7.5,.6,1.22,8.9,mat('paper',6));box(-.5,1.14,9,.6,1.8,9.5,mat('screen',1));box(-2.3,1.14,9.1,-1.7,1.5,9.5,mat('metal'));
 box(-.6,0,10.3,.6,.55,11.1,mat('wood',2));box(-.6,.55,11,.6,1.9,11.2,mat('wood',2));
 box(-7.95,1.4,2.5,-7.7,4.3,10.5,mat('board',2));
 for(const z of [1,2.6,4.2])box(6.9,0,z,8,3.2,z+1.4,mat('metal'));
 box(6.7,0,7,8,4.4,13,mat('metal'));for(let y=.5;y<4;y+=1.1)box(6.6,y,7.1,7.1,y+.8,12.9,mat('paper',6));
 box(-7.9,0,11.5,-5.9,2.8,15.5,mat('metal'));box(-7.8,2.8,11.6,-6,3.2,15.4,mat('paper',6));
 box(-6.5,0,-2,-6.3,2.6,-1.8,mat('metal'));box(-6.9,2.2,-2.4,-5.9,2.6,-1.4,mat('wood',2));
 pendant(-3,-3,3.8);pendant(5.5,13.5,3.8);
 // Bell's lantern on the desk corner, and the two photographs pinned to the board: Bell's, and Vale's commendation with its ribbon.
 box(-2.2,1.14,7.2,-1.8,1.8,7.6,mat('glass',1));box(-2.25,1.8,7.15,-1.75,1.88,7.65,mat('metal'));box(-2.06,1.88,7.36,-1.94,1.98,7.44,mat('metal'));
 box(-7.7,2.55,4.75,-7.62,3.15,5.25,mat('dispatch',6));box(-7.7,2.55,5.95,-7.62,3.15,6.45,mat('dispatch',6));box(-7.7,2.36,6.05,-7.62,2.52,6.35,mat('sign'));
 // The front wall and the office door, hinged open against the corridor wall. Beyond it the corridor: three dark desks,
 // Vale's dark door opposite with its name plate and no light under it, and the stairwell door under the only lit box.
 box(-5,0,-6.1,8,5,-5.9,mat('brick',2));box(-5,0,-6.35,-2,4,-6.15,mat('door',2));
 floor(-22,-11,8,-6,0,'plank',2);wall(8,-11,-22,-11,4,'brick',0);wall(-22,-6,-22,-11,4,'brick',0);wall(-8,-6,-22,-6,4,'brick',0);
 quad([-22,4,-11],[8,4,-11],[8,4,-6],[-22,4,-6],mat('ceiling'),[0,-1,0]);
 for(const x of [-20,-16,-12]){box(x-1.3,.95,-9.9,x+1.3,1.05,-8.3,mat('wood',2));for(const [dx,dz] of [[-1.15,-9.75],[1.15,-9.75],[-1.15,-8.45],[1.15,-8.45]])box(x+dx-.05,0,dz-.05,x+dx+.05,.95,dz+.05,mat('metal'));}
 box(-14,0,-10.95,-11.6,3.2,-10.9,mat('hatch'));box(-13.4,3.25,-10.95,-12.2,3.5,-10.9,mat('sign'));
 box(-21.98,0,-9.5,-21.9,3.2,-7.5,mat('door',2));box(-21.9,3.45,-8.95,-21.6,3.85,-8.05,mat('lamp',2));lamps.push([-21.75,-8.5]);
 const cityStart=surfaces.length;cityRow(24,110,16,-14,14);cityRow(30,120,18,4,18);cityRow(40,130,20,22,24);cityRow(34,125,19,-30,20);
 for(let i=cityStart;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]-=6;surfaces[i].mat={...surfaces[i].mat,baseY:-6};}
}
function clubSet(){
 // The Filament: neon and velvet, a stage, a long bar and Vale's booth at the back.
 floor(-12,-4,12,22,0,'carpet',3);wall(-12,22,-12,-4,6,'velvet',3);wall(12,-4,12,22,6,'brick');wall(12,22,-12,22,6,'velvet',3);
 quad([-12,6,-4],[12,6,-4],[12,6,22],[-12,6,22],mat('ceiling'),[0,-1,0]);
 box(8,0,4,11.5,1.1,12,mat('wood',2));box(7.9,1.1,3.9,11.6,1.2,12.1,mat('metal'));box(11.5,0,3.5,11.9,3.6,12.5,mat('metal'));
 box(11.45,1.25,3.6,11.55,1.3,12.4,mat('neon',1));box(11.45,2.5,3.6,11.55,2.55,12.4,mat('neon',3));
 for(let z=4.3;z<12;z+=.8)box(11.3,1.3,z-.12,11.5,2.1,z+.12,mat('glass',1));
 box(-5,0,16,5,.8,21,mat('wood',2));box(-5.2,.8,15.9,5.2,.86,21.1,mat('metal'));box(-5.3,4.8,15.8,5.3,5,16,mat('neon',3));
 for(const x of [-5.6,5.6])box(x-.15,0,15.8,x+.15,6,16.1,mat('metal'));
 for(const [x,z] of [[-6,6],[-3,11],[2,8],[-7,13],[3,13]]){box(x-.7,.9,z-.7,x+.7,1,z+.7,mat('metal'));box(x-.1,0,z-.1,x+.1,.9,z+.1,mat('metal'));box(x-.15,1,z-.15,x+.15,1.3,z+.15,mat('lamp',2));lamps.push([x,z]);}
 box(-11.9,3,2,-11.7,4.2,9,mat('neon',1));box(11.7,3.6,14,11.9,4.4,19,mat('neon',3));
 for(const z of [13.5,16.5])box(11.6,1.5,z,11.8,3.2,z+2.5,mat('screen',1));
 box(6.5,0,14.6,11.5,1.4,15.4,mat('velvet',3));box(7,0,12.6,10.5,.95,14,mat('wood',2));box(7.1,.95,12.7,10.4,1,13.9,mat('metal'));
 for(const x of [-8,8])for(const z of [1,9])pillar(x,z,6);
 box(11.7,0,17,12,3.6,19,mat('door',2));
 for(const z of [2,9,15])pendant(0,z,4.2);
}
function tunnelSet(){
 // The Undercity: a storm drain running under the elevated road, lit by emergency neon.
 floor(-6,-60,6,1000,0,'drain');floor(-7.5,-60,-6,1000,-.35,'water',1);floor(6,-60,7.5,1000,-.35,'water',1);
 wall(-7.5,1000,-7.5,-60,7,'sewer',5);wall(7.5,-60,7.5,1000,7,'sewer',5);
 quad([-7.5,7,-60],[7.5,7,-60],[7.5,7,1000],[-7.5,7,1000],mat('sewer',5),[0,-1,0]);
 for(const x of [-7.3,7.3])box(x-.2,5.2,-60,x+.2,5.6,1000,mat('pipe',2));
 for(let z=-40;z<1000;z+=20){box(-1.5,6.7,z,1.5,6.95,z+.6,mat('neon',1));box(-7.45,2.5,z+7,-7.25,3.2,z+8.5,mat('neon',3));box(7.25,2.5,z+13,7.45,3.2,z+14.5,mat('neon',1));}
 for(let z=-50;z<1000;z+=45)box(-7.5,0,z,-6,3,z+.4,mat('grate'));
}
const builders={office:officeSet,station:stationSet,pump:pumpSet,roof:roofSet,club:clubSet,chase:chaseSet,tunnel:tunnelSet,canal:canalSet};
function setScene(name){
 if(name===sceneName)return false;
 if(!sceneCache[name]){surfaces.length=0;lamps.length=0;(builders[name]||sets[name].build)();sceneCache[name]={surfaces:surfaces.slice(),lamps:lamps.slice()};}
 surfaces.length=0;surfaces.push(...sceneCache[name].surfaces);lamps.length=0;lamps.push(...sceneCache[name].lamps);staticCount=surfaces.length;sceneName=name;return true;
}
// A car body. large: the freight carrier's long body. dark: no lamps or tail lights (a car with its lights off).
function car(x,z,hue=1,y=0,large=false,{dark=false,freight=false}={}){
 const w=large?1.45:1.05,l=large?3.6:2.2;
 box(x-w,y+.35,z-l,x+w,y+1.05,z+l,mat('car',hue));
 if(freight)box(x-w*.9,y+1.05,z-l*.9,x+w*.9,y+2.4,z+l*.45,mat('metal',hue));
 else box(x-w*.78,y+1.05,z-l*.52,x+w*.78,y+1.9,z+l*.55,mat('glass',hue));
 box(x-w*.85,y+(freight?2.4:1.9),z-l*.55,x+w*.85,y+(freight?2.5:2.06),z+l*.58,mat('metal',hue));
 for(const dx of [-w,w])for(const dz of [-l*.67,l*.67])box(x+dx-.16,y+.13,z+dz-.4,x+dx+.16,y+.7,z+dz+.4,mat('rubber'));
 if(!dark)for(const dx of [-w*.7,w*.7]){box(x+dx-.22,y+.58,z-l-.06,x+dx+.22,y+.83,z-l,mat('tail',3));box(x+dx-.22,y+.65,z+l,x+dx+.22,y+.88,z+l+.06,mat('lamp',2));}
}
function extended(){return !['brief','watch','ready','follow','danger','qte','result','evidence','deduce','loftTurn','arrival'].includes(state.phase);}
function sceneFor(p){const d=phaseDef(p);if(d)return d.set;for(const name of ['office','station','pump','roof','club','chase','tunnel','canal'])if(p.startsWith(name))return name;return 'street';}
const moving=()=>sceneName==='chase'||sceneName==='tunnel'||!!sets[sceneName]?.moving;
const look=(x,y,z,tx,ty,tz)=>({x,y,z,yaw:Math.atan2(tx-x,tz-z),pitch:Math.atan2(ty-y,Math.hypot(tx-x,tz-z))});
// A shot part-way between two others: the second half of a beat that pans or tilts after its first move has settled.
function blendShot(a,b,t){const o={};for(const k of Object.keys(a))o[k]=mix(a[k],b[k],t);return o;}
function caseShot(){
 const p=state.phase,set=sets[sceneName];
 if(set&&set.shot)return set.shot(p);
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
  return look(-.6,p==='chaseEntry'?5:3.3,d-11,.3,1.2,d+13);
 }
 if(sceneName==='office'){
  // A slow push-in from the door, a low shot across the desk, then the window and the city.
  if(p==='officeEntry')return look(-1.6,1.7,4.4,-1.8,1.3,9.2);
  if(p==='officeFile')return look(2.3,1.45,6.4,-1.6,1.2,8.8);
  // The board beat: three seconds on the two photographs, then a glance out through the open door across the corridor to Vale's dark door.
  if(p==='officeBoard'){const a=look(-2.4,1.8,3.6,-7.9,2.7,5.8);return state.event<3||reduce?a:blendShot(a,look(-6.6,1.6,-6.6,-14,1.5,-10.5),smooth(clamp((state.event-3)/2,0,1)));}
  return look(-2.2,2.2,6,0,2.4,16);
 }
 if(sceneName==='club'){
  if(p==='clubEntry')return look(-1.5,1.7,5,3,1.3,13);
  if(p==='clubFace')return look(-4,4.8,4,7,1.2,13);
  if(p==='clubQte')return look(-2.5,1.3,7.5,6.5,1.5,12);
  return look(2,2.3,8,9.5,1.3,16);
 }
 if(sceneName==='tunnel'){
  const d=state.distance;
  if(p==='tunnelQte')return look(-6,2.4,d-9,.5,1,d+12);
  if(p==='tunnelFinish')return state.caught?look(2,3.2,d+24,-.5,1,d-2):look(-.5,2.6,d-8,.5,1,d+16);
  return look(-.5,2.4,d-10,0,1,d+14);
 }
 return look(-1.2,3.1,5,3,1.5,15);
}
function sceneStart(name){
 const d=state.distance;
 if(sets[name]&&sets[name].start)return sets[name].start();
 return {office:look(-3.2,2.1,1.5,-1.8,1.2,9),station:look(5,10,-4,0,0,24),pump:look(-4.5,1.8,-7,2,1.5,18),roof:look(-12,6,-5,1.3,1.5,15),club:look(-9,2.2,-3,2,1.5,12),chase:look(-7,9,d-15,0,1,d+16),tunnel:look(-5,3,d-12,0,1,d+18)}[name]||look(8,2.3,7,3,1,15);
}
function casePose(){
 const set=sets[sceneName];
 const duration=set&&set.ease?set.ease(state.phase):{stationEntry:7,pumpEntry:6,pumpDanger:2,roofEntry:8,canalEntry:7,officeEntry:8,officeFile:5,officeBoard:3,officeWindow:6,clubEntry:8,clubFace:2}[state.phase]||1.5;
 if(moving()){
  const target=caseShot(),u=reduce?1:span(set&&set.ease?duration:/Entry/.test(state.phase)?5:1.1);
  const origin={...transitionFrom,z:transitionFrom.z+state.distance-(state.phaseDistance||state.distance)};
  for(const k of Object.keys(camera))camera[k]=mix(origin[k],target[k],u);
 }else{const target=caseShot(),u=reduce?1:span(duration);for(const k of Object.keys(camera))camera[k]=mix(transitionFrom[k],target[k],u);}
 state.moving=/Entry|Bank|Finish|Result|File|Window/.test(state.phase);
}
function caseBlocking(){
 const p=state.phase,others=[];let rook=null,courier=null;
 const set=sets[sceneName];if(set&&set.blocking){const b=set.blocking(p);return{rook:b.rook||null,courier:b.courier||null,book:null,others:b.others||[]};}
 if(sceneName==='station'){
  const u=p==='stationEntry'&&!reduce?span(7):1;
  rook={x:mix(-1.6,-1.2,u),z:mix(8,17.2,u),pose:u<1?'walk':'read'};
  if(state.choice==='person')courier={x:1.3,z:mix(9,18,u),pose:u<1?'walk':'stand',who:'nell'};
 }
 if(sceneName==='pump'){
  const u=p==='pumpEntry'&&!reduce?span(6):1,v=p==='pumpResult'&&!reduce?span(4):p==='pumpTruth'?1:0;
  rook={x:mix(-.6,1.8,v),z:mix(mix(1,11,u),15.7,v),pose:u<1?'walk':v>0?'support':'watch'};
  others.push({x:mix(4.8,3.25,v),y:1.2*(1-v),z:mix(17.8,16.2,v),pose:['pumpEntry','pumpFind'].includes(p)?'wrench':['pumpDanger','pumpQte'].includes(p)?'reach':'stand',who:'bell'});
  if(state.choice==='person')courier={x:1.5,z:14.5,pose:'watch',who:'nell'};
 }
 if(sceneName==='roof'){
  const u=p==='roofEntry'&&!reduce?span(8):1;
  rook={x:mix(-6,-1.6,u),z:mix(5.5,15.8,u),pose:u<1?'walk':'watch'};
  others.push({x:2.4,z:16.4,pose:p==='roofListen'?'radio':'stand',who:'medic'},{x:3.4,z:16.6,pose:'sit',who:'bell'});
  if(state.choice==='person')courier={x:1,z:18,pose:'stand',who:'nell'};
 }
 if(sceneName==='canal'){
  rook={x:2,z:14,pose:'watch'};others.push({x:3.4,z:15.2,pose:'stand',who:'bell'},{x:7.6,z:22,pose:'stand',who:'medic'});
  if(state.choice==='person')courier={x:4.8,z:16.5,pose:'stand',who:'nell'};
  if(state.caught)others.push({x:6.2,z:19.2,pose:'handsUp',who:'vale'});
  if(state.caught&&kranePinned())others.push({x:7.4,z:20.4,pose:'stand',who:'krane'});
 }
 if(sceneName==='office'){
  // Seated at the desk: the sprite sinks below the floor plane and the desk hides the rest.
  const u=p==='officeWindow'&&!reduce?span(4):p==='officeWindow'?1:0;
  rook=u>0?{x:mix(-3.3,-1.2,u),z:mix(9.6,14.3,u),pose:u<1?'walk':'watch'}:{x:-3.3,z:9.6,pose:'read'};
 }
 if(sceneName==='club'){
  const u=p==='clubEntry'&&!reduce?span(8):1,v=p==='clubResult'&&!reduce?span(4):p==='clubResult'?1:0;
  rook={x:mix(-1,.5,u),z:mix(-2,9,u),pose:u<1?'walk':'watch'};
  if(p==='clubQte'||(p==='clubResult'&&state.club==='duck'))rook={x:.5,z:9,pose:'crouch'};
  if(p==='clubResult'&&state.club==='vault')rook={x:mix(.5,7.4,v),z:mix(9,12.4,v),pose:v<1?'walk':'reach'};
  if(p==='clubResult'&&state.club==='late')rook={x:.5,z:9,pose:'crouch',lean:.3*(1-v)};
  const vale=p==='clubResult'?{x:mix(9,11,v),z:mix(14,18,v),pose:'walk',who:'vale'}:{x:9,z:14,pose:'stand',who:'vale'};
  const guard=['clubFace','clubQte'].includes(p)?{x:6.5,z:11,pose:'throw',who:'krane'}:{x:6.5,z:11.5,pose:'stand',who:'krane'};
  others.push(vale,guard,{x:-5,z:5.5,pose:'stand',hue:4,who:'patron'},{x:-2.5,z:10.5,pose:'stand',hue:0,who:'patron'},{x:2.6,z:7.5,pose:'stand',hue:4,who:'patron'},{x:0,y:.8,z:18.5,pose:'stage',who:'performer'});
 }
 return{rook,courier,book:null,others};
}
function caseGeometry(){
 surfaces.length=staticCount;
 const set=sets[sceneName];if(set){if(set.geometry)set.geometry(state.phase);return caseBlocking();}
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
 if(sceneName==='tunnel'){
  const d=state.distance,p=state.phase,fork=forkZ(),u=p==='tunnelFinish'?span(4):0,vale=tunnelVale();
  const rookX=p==='tunnelFinish'?mix(-1.8,state.tunnel==='left'?-3.6:state.caught?1:-1.8,u):-1.8;
  car(rookX,d,1,0);box(rookX-.45,2.07,d-.2,rookX+.45,2.15,d+.2,mat('lamp',2));
  car(vale.x,vale.z,3,0);
  if(['tunnelQte','tunnelFinish'].includes(p)){
   // The drain forks around a brick pier; a service gate closes the left branch when the shortcut fails.
   box(-1,0,fork,1,7,fork+30,mat('brick'));box(-2.6,5.4,fork-.4,2.6,6.4,fork,mat('highway-sign',1));
   if(p==='tunnelFinish'&&state.tunnel==='left'&&!state.caught)box(-7.5,0,fork+24,-1,6.8,fork+24.6,mat('grate'));
  }
 }
 if(sceneName==='canal')state.dawn=state.phase==='canalEnd'?mix(.5,1,clamp(state.event/8,0,1)):.5*clamp(state.event/7,0,1);
 if(sceneName==='club'){
  // The bottle crosses the room during the prompt and bursts on the neon if it is not answered.
  const p=state.phase;
  if(p==='clubQte'){const u=clamp(state.event/caseDuration(),0,1),x=mix(6,.8,u),y=1.4+Math.sin(u*Math.PI)*1.6,z=mix(11,9.4,u);box(x-.12,y-.2,z-.12,x+.12,y+.2,z+.12,mat('glass',1));}
  if(p==='clubResult'&&state.club==='vault')for(let i=0;i<4;i++)box(7.4+i*.5,1,12.9+hash(i,2)*.6,7.7+i*.5,1.08,13.2+hash(i,2)*.6,mat('lamp',2));
 }
 return caseBlocking();
}
// Leaving a set: the camera glides toward its exit before the picture dissolves, and one line explains the move.
function exitPoint(name){
 if(sets[name]&&sets[name].exit)return sets[name].exit();
 if(name==='street'&&state.phase==='loftTurn')return [-7.4,4.2,10.2];
 // The office leaves by the stairwell door at the end of the corridor; from inside the room the glide goes through the office door first.
 if(name==='office'&&camera.z>-6)return [-6.6,1.6,-6.4];
 return {office:[-21.5,1.5,-8.5],street:[-4.9,1.3,38.7],station:[0,2,43.8],pump:[6.15,5,31.1],roof:[-9.5,1.5,3.1],club:[11.85,1.8,18],chase:[0,1,camera.z+40],tunnel:[0,1,camera.z+40]}[name]||null;
}
function exitShot(name){
 const e=exitPoint(name);if(!e)return{...camera};
 const mv=moving()?.6:.35;
 return look(camera.x+(e[0]-camera.x)*mv,camera.y,camera.z+(e[2]-camera.z)*mv,e[0],e[1],e[2]);
}
function transitionLine(from,to){
 return {
  'office>street':'Rook takes the stairs down to Station Road. The rain has not let up.',
  'street>loft':'Two doors back, up the iron stair over the lamp depot. The window is lit.',
  'street>station':'Three knocks, or a shoulder. Either way, the hatch gives.',
  'loft>station':'Down the stair with the photographs in his coat. The station clock says Bell\'s job is still open.',
  'station>pump':'Down the service ladder, toward the knocking.',
  'pump>roof':'Up the service stair, Bell\'s arm over Rook\'s shoulder.',
  'roof>tram':'Down the service lift to the tram stop. The last tram of the night is already slowing.',
  'roof>room':'Rook stays. The medic\'s van takes them both to Night Division to put it on paper before the canal.',
  'tram>market':'Over the tram rail and down into the light under the arch.',
  'market>club':'Through the last of the stalls. The Filament\'s sign is loud enough to feel.',
  'club>chase':'Out the back door and into the patrol car. Vale\'s tail lights are already moving.',
  'chase>tunnel':'The service ramp drops away beneath the road.',
  'chase>substation':'Across the basin, every window of Substation Nine is lit, and it is one in the morning.',
  'tunnel>substation':'The outfall opens onto the basin. Substation Nine is lit end to end.',
  'substation>room':state.caught?'Vale watches from the back of the patrol car. Night Division, before the floor wakes up.':'Back across the city with the sky going grey. Night Division, the room next to Vale\'s office.',
  'room>canal':'Down to the canal, where Bell is waiting. First light.'
 }[from+'>'+to]||'';
}
// The fork is fixed where the prompt began, so the pier does not move when the finish phase resets the phase distance.
let tunnelFork=0;
function forkZ(){return tunnelFork||(state.phaseDistance||state.distance)+30;}
function tunnelVale(){
 const d=state.distance,p=state.phase,u=p==='tunnelFinish'?span(4):0;
 const z=p==='tunnelFinish'?(state.caught?d+9+(1-u)*8:d+17+state.gap*7+state.event*9):d+16+state.gap*7;
 return{x:p==='tunnelFinish'&&state.tunnel==='left'&&state.caught?3.2:1.6,z};
}
function caseLabels(){
 const set=sets[sceneName];if(set){if(set.labels)set.labels(state.phase);return;}
 if(sceneName==='station'){worldLabel([0,5.25,43.2],'PUMP ROOM 4',2);worldLabel([0,2.2,19.1],'MAINTENANCE',2);if(state.phase==='stationQuiet')worldLabel([.4,1.7,19.3],'ORDER 7731',6);}
 if(sceneName==='pump'){worldLabel([-1.25,2.65,11.8],'INLET',2);if(!['pumpResult','pumpTruth'].includes(state.phase))worldLabel([4.8,3.9,17.7],'BELL',2);if(state.phase==='pumpQte'){worldLabel([-1.25,3.3,11.8],'[1]',2);worldLabel([4.8,4.5,17.7],'[2]',2);}}
 if(sceneName==='roof')worldLabel([0,3.2,17],'NORTH / RADIO',2);
 if(sceneName==='chase'){
  worldLabel([1.6,3.3,state.distance+16+state.gap*7],'VALE',3);
  if(state.phase==='chaseQteA')worldLabel([-2.2,3.3,state.distance+13],'FREIGHT',2);
  if(state.phase==='chaseQteB')worldLabel([0,5.1,state.distance+28],'BRIDGE LIFTING',2);
 }
 if(sceneName==='canal')worldLabel([9,3.5,24],'CITY MEDIC',2);
 if(sceneName==='office'){worldLabel([-7.4,4.5,7],'CASE BOARD',2);worldLabel([0,4.6,16.2],'NIGHT DIVISION',1);if(state.phase!=='officeEntry')worldLabel([-.4,1.55,8.3],'I. BELL',6);if(state.phase==='officeBoard'){worldLabel([-7.6,2.3,5],'I. BELL',6);worldLabel([-7.6,2.2,6.2],'A. VALE',3);worldLabel([-12.8,3.9,-10.6],'VALE',0);}}
 if(sceneName==='club'){
  worldLabel([0,5.5,16],'THE FILAMENT',3);worldLabel([11.6,4.7,16.5],'NO EXIT',3);
  if(state.phase!=='clubEntry')worldLabel([9,3.4,14],'VALE',3);
  if(state.phase==='clubQte'){worldLabel([.5,1.85,9],'[1]',2);worldLabel([8.3,2,10.5],'[2]',2);}
 }
 if(sceneName==='tunnel'){
  const vale=tunnelVale();worldLabel([vale.x,3.3,vale.z],'VALE',3);
  if(state.phase==='tunnelQte'){const f=forkZ();worldLabel([3.4,4.6,f-1],'[1]',2);worldLabel([-3.4,4.6,f-1],'[2]',2);worldLabel([0,6.3,f-.5],'CANAL GATE',1);}
 }
}
