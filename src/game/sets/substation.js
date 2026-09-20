// 08 / SUBSTATION NINE. The Lumen Board's battery hall on the canal basin, lit end to end: four rows of racks of reserve
// cells on rails, chained on the left and loose on the right, gantries overhead, a breaker post on the centre aisle and
// a Board van backed up to the loading door. The manifest on the nearest loose rack carries the countersignature. Krane
// heaves that rack over onto Rook: dive clear (Krane pinned, the manifest burns) or pull the breaker (the hall goes
// dark, the manifest saved, Krane gone).
// The rack closes over the prompt's window (base 1.5 s, +0.5 with the keeper's tip, -0.5 after a survived miss on the road).
function subWindow(){return caseDuration();}
// The loose rack Krane heaves: x 2.5..4.5, z 36.5..42.5, 4.5 high. It tips toward the aisle about its aisle base edge
// (x 2.5 on the floor), the edge a rack really pivots on: at 90 degrees it lies flat across the aisle, x -2..2.5, 2 high,
// which is why the centre aisle is 4.5 wide. (Rotating about the far base edge at x 4.5 would swing the whole rack under
// the floor.) `a` is the lean in radians.
const RACK={x0:2.5,x1:4.5,z0:36.5,z1:42.5,h:4.5};
function tipPoint(x,y,z,a){const c=Math.cos(a),s=Math.sin(a),dx=x-RACK.x0;return[RACK.x0+dx*c-y*s,dx*s+y*c,z];}
function tipBox(x0,y0,z0,x1,y1,z1,m,a){
 const P=(x,y,z)=>tipPoint(x,y,z,a),c=Math.cos(a),s=Math.sin(a),N=(nx,ny,nz)=>[nx*c-ny*s,nx*s+ny*c,nz];
 quad(P(x0,y0,z0),P(x1,y0,z0),P(x1,y1,z0),P(x0,y1,z0),m,N(0,0,-1));
 quad(P(x1,y0,z1),P(x0,y0,z1),P(x0,y1,z1),P(x1,y1,z1),m,N(0,0,1));
 quad(P(x0,y0,z1),P(x0,y0,z0),P(x0,y1,z0),P(x0,y1,z1),m,N(-1,0,0));
 quad(P(x1,y0,z0),P(x1,y0,z1),P(x1,y1,z1),P(x1,y1,z0),m,N(1,0,0));
 quad(P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1),{...m,roof:true},N(0,1,0));
}
// The rack's lean per beat: upright in the entry, leaving vertical in the windup, closing over Rook across the window,
// flat in the first 0.6 s of any result.
function subLean(p){
 if(p==='subDeath')p='subResult';
 const deg=p==='subDanger'?span(2)*10:p==='subQte'?10+clamp(state.event/subWindow(),0,1)*30:p==='subResult'?40+clamp(state.event/.6,0,1)*50:0;
 return deg*Math.PI/180;
}
// One rack unit: 2 wide, 6 long, 4.5 high on rubber wheel blocks; chained units carry two cable wraps and a padlock.
function rackUnit(x,z0,m,chained){
 box(x-1,0,z0,x+1,4.5,z0+6,m);
 for(const dx of [-1,1])for(const dz of [.3,5.7])box(x+dx-.18,0,z0+dz-.25,x+dx+.18,.3,z0+dz+.25,mat('rubber'));
 if(chained){for(const y of [1.6,3.2])box(x-1.06,y,z0-.06,x+1.06,y+.1,z0+6.06,mat('cable'));box(x+1.02,1.3,z0+2.8,x+1.22,1.7,z0+3.2,mat('metal'));}
}
// The loaders' path between the loose racks and the van: s 0 at the racks, 1 at the van's doors; the dock is 1.2 lower.
const LOADERS=[[5.6,43.5],[1.6,47.5],[1.2,53.5]];
function loaderAt(s,i){
 const seg=s<.5?0:1,t=seg?(s-.5)*2:s*2,a=LOADERS[seg],b=LOADERS[seg+1],x=mix(a[0],b[0],t)+i*.25,z=mix(a[1],b[1],t);
 return{x,y:-1.2*clamp((z-49.6)/1.6,0,1),z,pose:'walk',hue:0,who:'patron'};
}
const tri=u=>1-Math.abs(2*(u-Math.floor(u))-1);
// A loader running from the hall to the dock: out through the door, then along the van.
function loaderOut(from,i,v){
 const gate=[1.4+i*.5,49.6],end=[.5+i*.4,59+i*2.5],u=Math.min(1,v*2.2);
 const x=v<.45?mix(from[0],gate[0],u):mix(gate[0],end[0],(v-.45)/.55),z=v<.45?mix(from[1],gate[1],u):mix(gate[1],end[1],(v-.45)/.55);
 return{x,y:-1.2*clamp((z-49.6)/1.6,0,1),z,pose:'walk',hue:0,who:'patron'};
}
registerSet('substation',{
 chapter:'08 / SUBSTATION NINE',card:'SUBSTATION NINE',objective:()=>'STOP THE LOADING',
 description:'A long battery hall: four rows of racks on rails, gantries overhead, a breaker post on the centre aisle, a loading door open on the canal basin with a Lumen Board van backed up to it.',
 build(){
  // The hall: 30 x 60 x 12, paving that takes lamp pools, brick walls, the hall door behind and the loading door ahead.
  floor(-15,-10,15,50,0,'paving',0);wall(-15,50,-15,-10,12,'brick',0);wall(15,-10,15,50,12,'brick',0);
  box(-15,0,-10.3,-1.2,12,-10,mat('brick',0));box(1.2,0,-10.3,15,12,-10,mat('brick',0));box(-1.2,4,-10.3,1.2,12,-10,mat('brick',0));box(-1.3,0,-10.35,-1.2,4,-9.95,mat('metal'));box(1.2,0,-10.35,1.3,4,-9.95,mat('metal'));
  box(-15,0,50,-3,12,50.3,mat('brick',0));box(3,0,50,15,12,50.3,mat('brick',0));box(-3,5.5,50,3,12,50.3,mat('brick',0));box(-3.2,5.5,49.9,3.2,8,50.4,mat('hatch'));
  for(const x of [-3.1,3.1])box(x-.1,0,49.85,x+.1,5.6,50.35,mat('metal'));
  quad([-15,12,-10],[15,12,-10],[15,12,50],[-15,12,50],mat('ceiling'),[0,-1,0]);for(let z=-5;z<50;z+=10)box(-15,11.4,z-.2,15,11.8,z+.2,mat('metal'));
  // Rails under every row, the full length of the hall.
  for(const x of [-9,-3,3.5,9.5])for(const dx of [-.8,.8])box(x+dx-.05,0,-1,x+dx+.05,.12,43.5,mat('metal'));
  // Gantries at z 12 and 30: grate walkways, handrails, hangers to the trusses, a rung ladder on the left wall.
  for(const z of [12,30]){
   box(-14,7,z-.6,14,7.3,z+.6,mat('grate'));
   for(const x of [-14,-7,7,14]){box(x-.08,7.3,z-.5,x+.08,8.3,z+.5,mat('metal'));}
   for(const dz of [-.55,.55])box(-14,8.2,z+dz-.05,14,8.3,z+dz+.05,mat('metal'));
   for(const x of [-10.5,-4.5,4.5,10.5])box(x-.08,7.3,z-.08,x+.08,11.4,z+.08,mat('metal'));
  }
  for(let y=.4;y<7;y+=.55)box(-13.9,y,29,-13.2,y+.08,29.3,mat('metal'));for(const z of [28.9,29.3])box(-13.9,0,z,-13.8,7.3,z+.1,mat('metal'));
  // The breaker: a console post on the centre aisle's right edge just short of the loose rack, a lever standing up from
  // its top with the only amber knob in the hall, and bus bars from the post to the right wall and along it.
  box(.9,0,35.2,1.5,2.2,36,mat('console',1));box(1.12,2.2,35.52,1.28,3.3,35.68,mat('metal'));box(1.0,3.3,35.4,1.4,3.6,35.8,mat('lamp',2));
  box(1.5,1.9,35.5,1.7,2.1,35.7,mat('metal'));
  // Emergency strips along both side walls: unlit metal until the breaker result, red neon after it.
  for(const x of [-15,15])box(x-.06,10.9,-10,x+.06,11.3,50,mat('metal'));
  // The dock beyond the door, the basin, the far shore and the dawn quad the door frames.
  floor(-12,50,12,66,-1.2,'road',7);box(-12,-1.2,65.5,12,-.7,66,mat('barrier'));box(-12,-2.6,66,12,-1.2,66.3,mat('brick',0));
  floor(-70,64,70,84,-2.4,'water',1);
  // A low district on the far shore, 30 units past the door, with the dawn quad behind it.
  const shore=surfaces.length;
  for(let i=0;i<10;i++){const x=-42+i*9+hash(i,5)*2;building(x,70+hash(i,9)*4,5.5+hash(i,2)*2,7,4+hash(i,7)*7,i%3===0?4:0,i*11+5);}
  for(let i=shore;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]-=2.4;surfaces[i].mat={...surfaces[i].mat,baseY:-2.4};}
  quad([-60,-3,84],[60,-3,84],[60,30,84],[-60,30,84],mat('dawn',4),[0,0,-1]);
 },
 start(){return look(0,8.5,-9.6,0,2,20);},
 shot(p){
  if(p==='subDeath')p='subResult';
  if(p==='subEntry')return look(.4,5.5,2,0,1,44);
  if(p==='subManifest'){
   // Close on the clipboard for three seconds, then a pan right and down the aisle to Krane coming from the van.
   const a=look(-.6,2,36.4,2.47,2.25,38.9),b=look(-.6,2,36.4,2.2,1.5,50),u=reduce?(state.event<3?0:1):smooth(clamp((state.event-3)/2,0,1)),o={};
   for(const k of Object.keys(a))o[k]=mix(a[k],b[k],u);return o;
  }
  // The results crane up so the fallen rack, Krane at its corner and the door beyond it share one frame.
  if(p==='subResult')return look(-1.2,5.6,29.6,1.4,1,40.5);
  if(p==='subDawn')return look(0,2.4,42,0,4,66);
  return look(-.6,1,31,1,2.6,39.5);
 },
 ease(p){return {subEntry:8,subManifest:1.2,subDanger:.5,subResult:1.5,subDeath:1.5,subDawn:5}[p]||1.2;},
 blocking(p){
  // The death holds the rack's late picture for now (the content pass builds the real one): with no hall value written,
  // the result branches below fall through to Rook under the rack.
  if(p==='subDeath')p='subResult';
  const others=[];let rook;
  // q: Rook's half-second step out of the rack's fall before it lands (0.6 s into the result).
  const u=p==='subEntry'&&!reduce?span(8):1,v=p==='subResult'?(reduce?1:span(4)):0,w=p==='subDawn'?(reduce?1:span(5)):0,q=reduce?1:clamp(state.event/.5,0,1);
  const hall=state.hall,live=['subEntry','subManifest','subDanger','subQte'].includes(p);
  if(p==='subEntry')rook={x:0,z:mix(-7,30,u),pose:u<1?'walk':'watch'};
  else if(p==='subManifest')rook={x:-1,z:40.6,pose:'read'};
  else if(p==='subResult'&&hall==='dive')rook={x:mix(0,-1,q),z:mix(38,34.6,q),pose:q<1?'walk':'crouch'};
  else if(p==='subResult'&&hall==='breaker')rook={x:mix(0,.1,q),z:mix(38,36.2,q),pose:v<.6?'reach':'stand'};
  else if(p==='subResult')rook={x:-.6,y:-.45,z:36,pose:'stumble',lean:-.6};
  else if(p==='subDawn')rook={x:mix(.6,0,w),z:mix(41,49,w),pose:w<1?'walk':'watch'};
  else rook={x:0,z:38,pose:'watch',lean:p==='subQte'?.15:.1};
  // Krane: at the van in the entry, down the aisle toward Rook in the manifest beat, round the loose rack's far end to
  // heave it, then pinned at its corner (dive) or away to the van.
  let krane=null;
  if(p==='subEntry')krane={x:2,y:-1.2,z:53,pose:'stand',who:'krane'};
  else if(p==='subManifest'){const t=clamp((state.event-1.5)/4,0,1),z=mix(53,44,t);krane={x:mix(1.5,1.6,t),y:-1.2*clamp((z-49.6)/1.6,0,1)+(z<49.6?.3:0),z,pose:t<1?'walk':'stand',who:'krane'};}
  else if(p==='subDanger'){const t=reduce?1:span(1.2);krane={x:mix(1.6,5.4,t),y:.3,z:mix(44,43.3,t),pose:t<1?'walk':'reach',who:'krane'};}
  else if(p==='subQte')krane={x:5.4,y:.3,z:43.3,pose:'reach',who:'krane'};
  else if(p==='subResult'&&hall==='dive')krane={x:3.4,y:-.3,z:43.4,pose:'stumble',lean:-.4,who:'krane'};
  else if(p==='subResult'){const z=mix(43.3,53,v);krane={x:mix(5.4,1.2,v),y:-1.2*clamp((z-49.6)/1.6,0,1)+(z<49.6?.3:0),z,pose:'walk',who:'krane'};}
  if(krane)others.push(krane);
  // Three loaders: between the loose racks and the van, then milling at the right during the prompt, then running out.
  const mill=[[6.3,45.5],[7.2,47.5],[5.6,48.9]];
  for(let i=0;i<3;i++){
   if(p==='subEntry'||p==='subManifest')others.push(loaderAt(tri(state.t*.1+i*.37),i));
   else if(live)others.push({x:mill[i][0],z:mill[i][1]+Math.sin(state.t*.6+i*2.1)*.5,pose:'walk',hue:0,who:'patron'});
   else if(p==='subResult')others.push(loaderOut(mill[i],i,reduce?1:span(3+i*.4)));
  }
  if(p==='subEntry'&&state.event<6)others.push({x:-2.5,y:-1.2,z:56,pose:'stand',who:'ashe'});
  if(state.caught&&p==='subDawn')others.push({x:-4.4,y:-.8,z:58,pose:'stand',who:'vale'});
  return{rook,courier:null,others};
 },
 geometry(p){
  if(p==='subDeath')p='subResult';
  state.dawn=p==='subDawn'?span(5)*.35:0;
  const dark=state.hall==='breaker'&&(p==='subResult'||p==='subDawn'),a=subLean(p),flat=a>=Math.PI/2-1e-6;
  // Pendants over the centre aisle: four warm pools until the breaker is thrown.
  lamps.length=0;
  for(const z of [3,15,27,39]){if(dark){box(-.04,10,z-.04,.04,11.4,z+.04,mat('metal'));box(-.5,9.7,z-.4,.5,10.15,z+.4,mat('metal'));}else pendant(0,z,10);}
  // The racks: lit cells until the breaker, dead slabs after it. The nearest loose unit is drawn tipped.
  const cells=seed=>dark?mat('ceiling'):{kind:'cell',hue:2,seed};
  for(const [x,chained] of [[-9,true],[-3,true],[3.5,false],[9.5,false]])for(let i=0;i<5;i++){
   if(x===3.5&&i===4)continue;
   rackUnit(x,i*9+(chained?0:.2+hash(i,x+10)*.7),cells(i*7+x+20),chained);
  }
  tipBox(RACK.x0,0,RACK.z0,RACK.x1,RACK.h,RACK.z1,cells(5),a);
  for(const dx of [0,2])for(const dz of [.3,5.7])tipBox(RACK.x0+dx-.18,0,RACK.z0+dz-.25,RACK.x0+dx+.18,.3,RACK.z0+dz+.25,mat('rubber'),a);
  // Bus bars from the breaker post to the right wall and along it; the wall strips go red when the hall goes dark.
  box(1.15,2.2,35.55,1.25,5,35.65,mat('cable'));box(1.1,4.85,35.45,14.9,5.1,35.75,dark?mat('metal'):mat('pipe',2));box(14.6,4.85,-10,14.9,5.1,50,dark?mat('metal'):mat('pipe',2));
  if(dark){
   for(const x of [-15,15])box(x-.08,10.9,-10,x+.08,11.3,50,mat('neon',3));
   for(const x of [-1.9,2.4])box(x-.04,.02,-1,x+.04,.2,49,mat('neon',3));
   box(-3.2,5.6,49.75,3.2,5.9,49.95,mat('neon',3));
  }
  // The manifest: clipped to the loose rack's aisle face and tipping with it; burning on the fallen rack after the dive
  // or the miss; in Rook's hand after the breaker.
  const held=p==='subResult'&&state.hall==='breaker',burnt=p==='subResult'&&!held;
  if(!held&&!(burnt&&flat))tipBox(2.45,2.05,38.7,2.5,2.55,39.05,mat('paper',6),a);
  if(burnt&&flat){const s=1-clamp((state.event-.6)/3.5,0,1)*.85;box(-.45-.2*s,2,37.1-.2*s,-.45+.2*s,2+.4*s,37.1+.2*s,mat('tail',3));}
  if(held&&(reduce||span(4)>=.6))box(.55,1.15,35.95,.58,1.6,36.3,mat('paper',6));
  // Arcs where the cells split: on the fallen rack and across the wet floor at its near end.
  if(burnt&&flat){box(-2.1,1.9,37.1,-1.5,2.25,37.9,mat('arc',6));box(-2.1,1.9,40.1,-1.5,2.25,40.9,mat('arc',6));box(1.1,1.9,36.35,1.9,2.25,36.75,mat('arc',6));box(-1.8,.02,35.5,-1.2,.25,35.85,mat('arc',6));}
  // The van on the dock, backed up to the door; it pulls away after the breaker or the miss and is gone by the dawn.
  const leaving=state.hall!=='dive'&&state.hall!=='';
  if(!(p==='subDawn'&&leaving))car(0,p==='subResult'&&leaving?mix(56,63,span(5)):56,4,-1.2,true,{freight:true});
  if(state.caught)car(-4.4,58,1,-1.2);
 },
 labels(p){
  if(p==='subDeath')p='subResult';
  // The hall's name rides the first gantry's rail (the far wall sits behind the second gantry from the entry camera);
  // LOADING is painted on the roller door, below that gantry's walkway.
  if(p==='subEntry')worldLabel([-2.6,8.75,11.4],'SUBSTATION 9',1);
  if(['subEntry','subManifest','subDawn'].includes(p))worldLabel([0,7,49.5],'LOADING',2);
  if(p==='subManifest')worldLabel([2.1,3.0,38.9],'MANIFEST',6);
  const k=['subManifest','subDanger','subResult'].includes(p)?this.blocking(p).others.find(o=>o.who==='krane'):null;
  if(k&&!(p==='subResult'&&state.hall!=='dive'))worldLabel([k.x,(k.y||0)+2.65,k.z],'KRANE',0);
  // The cues: dive clear to the left of the aisle, the breaker's lever on the right; unlit while Krane heaves.
  if(p==='subDanger'||p==='subQte'){cueLabel([-1,2.3,34.8],'left',1);cueLabel([1.2,4.05,35.6],'right',2);}
  if(p==='subDawn'&&state.caught)worldLabel([-4.4,1.95,58],'VALE',3);
 },
 exit(){return [0,1.5,50];},
 preview(){Object.assign(state,{pursuit:'ramp',tunnel:'right',caught:true,keeper:true,radio:true});return 'subEntry';}
});
registerPhases('substation',{
 subEntry:{kind:'cutscene',title:'08 / SUBSTATION NINE',duration:8,next:'subManifest',
  enter:()=>{addClue('Substation Nine, the Lumen Board\'s reserve battery hall on the canal basin: the batteries are being loaded into a Board van by Vale\'s buyers, on the Board\'s own premises.');},
  caption:()=>state.caught?'Vale is cuffed in the back of the patrol car. Rook leaves him there. The battery hall of Substation Nine is lit end to end: racks of reserve cells, a Lumen Board van backed up to the loading door, and men who are not Board engineers loading it.':'Vale\'s car is not here. The loading is. The battery hall of Substation Nine is lit end to end: racks of reserve cells, a Lumen Board van backed up to the loading door, and men who are not Board engineers loading it.'},
 subManifest:{kind:'cutscene',title:'THE MANIFEST',duration:6,next:'subDanger',
  enter:()=>{addClue('Seen on the rack: the loading manifest is countersigned H. ASHE, Commissioner of Reserve, Lumen Board. Vale is not the top of this.');},
  caption:()=>'A manifest hangs on the nearest loose rack: RESERVE TRANSFER / ORDER 7731 / A. VALE, and under it a countersignature, H. ASHE, COMMISSIONER OF RESERVE. The loaders have seen Rook. So has Krane.'},
 subDanger:{kind:'windup',title:'TWO TONNES OF CELLS',next:'subQte',
  caption:()=>'Krane puts his back to the loose rack and heaves. Two tonnes of cells tip toward Rook. The hall\'s main breaker is at Rook\'s shoulder, handle up. Get ready.'},
 subQte:{kind:'prompt',title:'THE RACK IS COMING DOWN',base:1.5,bonus:()=>state.keeper,penalty:()=>state.tunnel==='late'||state.pursuit==='late',death:'subDeath',next:'subResult',
  caption:()=>'The rack is coming down. Dive clear and let it fall, or pull the breaker so the cells cannot arc and grab the manifest as it goes.',
  cues:[{dir:'left',label:'[1] DIVE CLEAR',id:'dive',act:()=>{state.hall='dive';}},{dir:'right',label:'[2] PULL THE BREAKER',id:'breaker',act:()=>{state.hall='breaker';}}]},
 subDeath:{kind:'death',title:'UNDER THE RACK',duration:4,dead:'rack',bit:32,back:'subDanger',reset:()=>{state.hall='';},
  stinger:()=>['CRUSHED','miss',4],
  caption:()=>'The rack comes down across Rook and the cells split around him. Krane looks over the top of it once, then goes to the van.'},
 subResult:{kind:'result',title:'IN THE HALL',duration:5,next:'subDawn',
  stinger:()=>state.hall==='dive'?['PINNED','hit']:state.hall==='breaker'?['LIGHTS OUT','hit']:['CRUSHED','miss'],
  enter:()=>{
   if(state.hall==='breaker')addClue('Recovered: the Substation Nine loading manifest, countersigned H. ASHE, Commissioner of Reserve. Written proof that the Board signed above Vale.');
   else if(state.hall==='dive')addClue('Krane, Vale\'s bodyguard, arrested at Substation Nine, pinned under the rack he pushed. The manifest burned.');
   else addClue('The Substation Nine manifest burned. Krane and the loaders escaped in the Board van.');
  },
  caption:()=>state.hall==='dive'?'Rook goes left. The rack comes down on the floor and on Krane\'s leg behind it; cells split and arc white. The loaders run. The manifest curls and burns on the rack. Krane does not go anywhere.':state.hall==='breaker'?'Rook throws the breaker. The hall goes black and the rack lands dead beside him. He has the manifest in his fist. When the emergency lamps come up, the van is gone and so is Krane.':'The rack takes Rook across the legs. Cells arc; the manifest is ash before he can reach it. The van\'s doors slam. When Rook drags himself clear, the hall is empty.'},
 subDawn:{kind:'cutscene',title:'THE BASIN',duration:5,next:'roomEntry',
  caption:()=>state.caught?'Rook walks out through the loading door. Vale watches him from the back of the patrol car. Over the basin the sky is going grey.':'Rook walks out through the loading door. The basin is empty and the sky over it is going grey. Whatever is left of tonight will be said in a room at Night Division.'}
});
