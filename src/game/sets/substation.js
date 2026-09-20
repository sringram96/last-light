// 08 / SUBSTATION NINE. The Lumen Board's battery hall on the canal basin, lit end to end: racks of reserve cells,
// chained on the left and loose on the right, a Board van at the loading door. The manifest carries the countersignature.
// Krane heaves the nearest loose rack over onto Rook: dive clear, or pull the breaker and save the manifest.
function subWindow(){return clamp(7+(state.keeper?2:0)-(state.tunnel==='late'||state.pursuit==='late'?2:0),5,9);}
// A box whose top is sheared by dx along x: the rack as it tips toward the aisle.
function leanBox(x0,y0,z0,x1,y1,z1,m,dx){
 const a=[x0,y0,z0],b=[x1,y0,z0],c=[x1,y0,z1],d=[x0,y0,z1],e=[x0+dx,y1,z0],f=[x1+dx,y1,z0],g=[x1+dx,y1,z1],h=[x0+dx,y1,z1];
 quad(a,b,f,e,m,[0,0,-1]);quad(c,d,h,g,m,[0,0,1]);quad(d,a,e,h,m,[-1,0,0]);quad(b,c,g,f,m,[1,0,0]);quad(e,f,g,h,{...m,roof:true},[0,1,0]);
}
registerSet('substation',{
 chapter:'08 / SUBSTATION NINE',card:'SUBSTATION NINE',objective:()=>'STOP THE LOADING',
 description:'A long battery hall: four rows of racks on rails, gantries overhead, a breaker post on the centre aisle, a loading door open on the canal basin with a Lumen Board van backed up to it.',
 build(){
  floor(-15,-10,15,50,0,'paving',0);wall(-15,50,-15,-10,12,'brick',0);wall(15,-10,15,50,12,'brick',0);
  box(-15,0,-10.3,-1.2,12,-10,mat('brick',0));box(1.2,0,-10.3,15,12,-10,mat('brick',0));box(-1.2,4,-10.3,1.2,12,-10,mat('brick',0));box(-1.3,0,-10.35,-1.2,4,-9.95,mat('metal'));box(1.2,0,-10.35,1.3,4,-9.95,mat('metal'));
  box(-15,0,50,-3,12,50.3,mat('brick',0));box(3,0,50,15,12,50.3,mat('brick',0));box(-3,4.5,50,3,12,50.3,mat('brick',0));box(-3.2,4.5,49.9,3.2,8,50.4,mat('hatch'));
  quad([-15,12,-10],[15,12,-10],[15,12,50],[-15,12,50],mat('ceiling'),[0,-1,0]);for(let z=-5;z<50;z+=10)box(-15,11.4,z-.2,15,11.8,z+.2,mat('metal'));
  for(const [x,chained] of [[-9,true],[-3,true],[3,false],[9,false]])for(let i=0;i<5;i++){
   const z0=i*8+(chained?0:hash(i,x)*.6);
   box(x-1,0,z0,x+1,4.5,z0+6,{kind:'cell',hue:2,seed:i*7+x});
   for(const dx of [-.8,.8])box(x+dx-.05,0,-1,x+dx+.05,.15,42,mat('metal'));
   if(chained){for(const y of [1.6,3.2])box(x-1.05,y,z0-.05,x+1.05,y+.12,z0+6.05,mat('cable'));box(x+.7,1.4,z0-.15,x+1,1.8,z0+.15,mat('metal'));}
  }
  for(const z of [12,30]){box(-14,7,z-.6,14,7.3,z+.6,mat('grate'));for(const x of [-14,14])box(x-.1,7.3,z-.6,x+.1,8.3,z+.6,mat('metal'));box(-14,8.2,z-.05,14,8.3,z+.05,mat('metal'));}
  for(let y=0;y<7;y+=.5)box(-13.6,y,29,-13.2,y+.08,29.4,mat('metal'));
  for(const z of [6,18,30,42])pendant(0,z,9);
  box(.9,0,36.6,1.5,3.4,37.4,mat('console',1));box(1.1,3.4,36.9,1.3,4.7,37.1,mat('metal'));box(1,4.7,36.8,1.4,5,37.2,mat('lamp',2));
  box(1.2,6,-10,1.5,6.3,50,mat('pipe',2));for(const x of [-15,15])box(x-.06,11,-10,x+.06,11.2,50,mat('metal'));
  floor(-12,50,12,70,-1.2,'road',7);box(-12,-1.2,69.5,12,-.6,70,mat('barrier'));floor(-60,60,60,140,-2.4,'water',1);
  quad([-40,-3,62],[40,-3,62],[40,30,62],[-40,30,62],mat('dawn',4),[0,0,-1]);
  cityRow(40,100,18,30,30);
 },
 start(){return look(0,8.5,-16,0,2,20);},
 shot(p){
  if(p==='subEntry')return look(.4,5.5,-4,0,1.6,44);
  if(p==='subManifest')return state.event<3?look(-.6,1.6,34.5,2,2.3,38.4):look(-.2,1.8,35,4.8,1.9,44);
  if(p==='subDawn')return look(0,2.4,42,0,4,66);
  return look(-2.5,1,34,3,2.4,41);
 },
 ease(p){return {subEntry:8,subManifest:3,subDanger:.5,subDawn:5}[p]||1.2;},
 blocking(p){
  const others=[];let rook;
  const u=p==='subEntry'&&!reduce?span(8):1,v=p==='subResult'&&!reduce?span(4):p==='subResult'?1:0,w=p==='subDawn'&&!reduce?span(5):p==='subDawn'?1:0;
  if(p==='subEntry')rook={x:0,z:mix(-8,30,u),pose:u<1?'walk':'watch'};
  else if(p==='subManifest')rook={x:.2,z:38,pose:'read'};
  else if(p==='subResult'&&state.hall==='dive')rook={x:mix(.4,-1.6,Math.min(1,v*2)),z:mix(39.5,41.5,Math.min(1,v*2)),pose:v<.5?'walk':'crouch'};
  else if(p==='subResult'&&state.hall==='breaker')rook={x:.9,z:38,pose:v<.5?'reach':'stand'};
  else if(p==='subResult')rook={x:.8,y:-.4,z:41,pose:'stumble',lean:.3};
  else if(p==='subDawn')rook={x:mix(.6,0,w),z:mix(41,49,w),pose:w<1?'walk':'watch'};
  else rook={x:.4,z:39.5,pose:'watch',lean:.1};
  const krane=p==='subEntry'?{x:2,y:-1.2,z:53,pose:'stand',who:'krane'}:p==='subManifest'?{x:mix(2,4.8,Math.min(1,state.event/3)),z:mix(53,40,Math.min(1,state.event/3)),pose:'walk',who:'krane'}:p==='subResult'&&state.hall==='dive'?{x:4.6,y:-.3,z:41,pose:'stumble',lean:.4,who:'krane'}:p==='subResult'||p==='subDawn'?null:{x:4.9,y:.3,z:40,pose:'reach',who:'krane'};
  if(krane)others.push(krane);
  if(p==='subEntry'||p==='subManifest'||p==='subDanger'||p==='subQte')for(let i=0;i<3;i++)others.push({x:4+i*1.5,y:-1.2*(i===2?1:0),z:i===2?52:44+i*2,pose:'walk',hue:0,who:'patron'});
  if(p==='subEntry'&&state.event<6)others.push({x:-6,y:-1.2,z:56,pose:'stand',who:'ashe'});
  if(state.caught&&(p==='subEntry'||p==='subDawn'))others.push({x:-7,y:-2,z:57,pose:'stand',who:'vale'});
  return{rook,courier:null,others};
 },
 geometry(p){
  state.dawn=p==='subDawn'?span(5)*.35:0;
  const tilt=p==='subDanger'?span(2)*.15:p==='subQte'?.15+clamp(state.event/subWindow(),0,1)*.5:p==='subResult'?1:0;
  if(tilt>0){
   const angle=tilt*Math.PI/2,dx=-Math.sin(angle)*4.5,yTop=Math.cos(angle)*4.5;
   leanBox(2,0,36,4,Math.max(.3,yTop),42,{kind:'cell',hue:2,seed:5},dx);
   if(p==='subResult'&&state.hall!=='breaker')for(let i=0;i<4;i++)box(-1.5+i*.8,.1,37+hash(i,3)*4,-1.1+i*.8,.5,37.4+hash(i,3)*4,mat('arc',6));
  }else box(2,0,36,4,4.5,42,{kind:'cell',hue:2,seed:5});
  if(p==='subResult'&&state.hall==='breaker'){box(1.1,3.4,36.9,1.3,3.6,38.2,mat('metal'));for(const x of [-15,15])box(x-.06,11,-10,x+.06,11.2,50,mat('neon',3));}
  if(p!=='subResult'||state.hall==='breaker')box(1.95,2.1,38.2,2.05,2.55,38.55,mat(p==='subResult'?'paper':'paper',6));
  else box(1.95,2.1,38.2,2.05,2.55,38.55,mat('tail',3));
  const vanZ=p==='subResult'&&state.hall!=='dive'?56+span(5)*8:p==='subDawn'&&state.hall!=='dive'?70:56;
  car(0,vanZ,4,-1.2,true);
  if(state.caught)car(-7,57,1,-1.2);
 },
 labels(p){
  if(p==='subEntry')worldLabel([0,10.2,49.5],'SUBSTATION 9',1);worldLabel([0,8.6,50],'LOADING',2);
  if(p==='subManifest')worldLabel([2,3,38.4],'MANIFEST',6);
  if(['subManifest','subDanger','subQte'].includes(p))worldLabel([4.9,3.4,40],'KRANE',0);
  if(p==='subQte'){worldLabel([-1.8,2.3,41.5],'[1]',2);worldLabel([1.2,5.4,37],'[2]',2);}
  if(p==='subDawn'&&state.caught)worldLabel([-7,1.9,57],'VALE',3);
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
 subQte:{kind:'prompt',title:'THE RACK IS COMING DOWN',window:subWindow,next:'subResult',
  caption:()=>'The rack is coming down. Dive clear and let it fall, or pull the breaker so the cells cannot arc and grab the manifest as it goes.',
  moves:[{label:'[1] DIVE CLEAR',id:'dive',act:()=>{state.hall='dive';}},{label:'[2] PULL THE BREAKER',id:'breaker',act:()=>{state.hall='breaker';}}],
  miss:()=>{state.hall='late';}},
 subResult:{kind:'result',title:'IN THE HALL',duration:5,next:'subDawn',
  stinger:()=>state.hall==='dive'?['PINNED','hit']:state.hall==='breaker'?['LIGHTS OUT','hit']:['CRUSHED','miss'],
  enter:()=>{
   if(state.hall==='breaker')addClue('Recovered: the Substation Nine loading manifest, countersigned H. ASHE, Commissioner of Reserve. Written proof that the Board signed above Vale.');
   else if(state.hall==='dive')addClue('Krane, Vale\'s bodyguard, arrested at Substation Nine, pinned under the rack he pushed. The manifest burned.');
   else addClue('The Substation Nine manifest burned. Krane and the loaders escaped in the Board van.');
  },
  caption:()=>state.hall==='dive'?'Rook goes left. The rack comes down on the floor and on Krane\'s leg behind it; cells split and arc white. The loaders run. The manifest curls and burns on the rack. Krane does not go anywhere.':state.hall==='breaker'?'Rook throws the breaker. The hall goes black and the rack lands dead beside him. He has the manifest in his fist. When the emergency lamps come up, the van is gone and so is Krane.':'The rack takes Rook across the legs. Cells arc; the manifest is ash before he can reach it. The van\'s doors slam. When Rook drags himself clear, the hall is empty.',
  rewind:{miss:()=>state.hall==='late',back:'subDanger',reset:()=>{state.hall='';}}},
 subDawn:{kind:'cutscene',title:'THE BASIN',duration:5,next:'roomEntry',
  caption:()=>state.caught?'Rook walks out through the loading door. Vale watches him from the back of the patrol car. Over the basin the sky is going grey.':'Rook walks out through the loading door. The basin is empty and the sky over it is going grey. Whatever is left of tonight will be said in a room at Night Division.'}
});
