// 05a / THE NIGHT MARKET. Stalls under the elevated road, lit by reserve cells with Lumen Board serials, rising toward
// The Filament's sign. Marta Quill's cart; Krane sends a loaded cell-cart down the sloped aisle at Rook.
// The aisle runs along z from the arch (z -8) to the club's sign (z 46) and rises 3 degrees: everything standing on it
// takes its base from marketY(z), and the camera heights below are eye heights above that slope.
const marketY=z=>(z+8)*.05;
function marketWindow(){return clamp(7+(state.tail?2:0)-(state.misread?2:0),5,9);}
// Stall bases along the aisle. The left row keeps its gaps (the one under [1] is the only one with a lamp); the right
// row's awnings run as one ledge from the rope to the club, the way Rook runs them on the cut route.
const MARKET_STALLS=[2,6,10,14,18,22,26,30,34,38];
// The crowd: [x, z, hue, x after the cart is launched, z after]. They mill at the stall fronts; when Krane pushes the
// cart they press back to the stalls and off the band the gap and the rope occupy, so nothing stands between the camera
// and the cart, the gap or the rope during the prompt. Hues 0, 4, 6 only; nobody on the centre line.
const MARKET_CROWD=[[-3.0,3.2,4,-3.9,2.2],[3.1,5.0,0,3.9,3.0],[-3.1,6.4,6,-3.9,12.6],[3.0,7.6,0,3.9,12.0],[2.9,13.4,4,3.9,14.2],[-3.0,15.8,6,-3.9,15.8],[3.3,17.6,6,3.9,17.6],[-3.3,19.4,0,-3.9,19.4],[2.8,21.4,0,3.9,21.4],[-2.8,22.6,4,-3.9,22.6],[3.0,25.2,4,3.9,25.2],[-3.4,26,6,-3.9,26.6],[3.4,28.6,6,3.9,28.6],[-2.9,29.4,0,-3.9,29.8]];
let marketLamps=0;
const marketBlend=(a,b,s)=>({x:mix(a.x,b.x,s),y:mix(a.y,b.y,s),z:mix(a.z,b.z,s),yaw:mix(a.yaw,b.yaw,s),pitch:mix(a.pitch,b.pitch,s)});
// Krane's cart: rubber wheels, a wood bed, metal rails and twelve cells in two layers; unloaded once it has burst.
function marketCart(x,z,y,loaded=true){
 for(const dx of [-.9,.9])for(const dz of [-.8,.8])box(x+dx-.1,y,z+dz-.26,x+dx+.1,y+.5,z+dz+.26,mat('rubber'));
 box(x-1,y+.45,z-1.15,x+1,y+.75,z+1.15,mat('wood',2));
 box(x-1,y+.75,z-1.2,x+1,y+1.35,z-1.1,mat('metal'));
 for(const dx of [-1,1])box(x+dx-.05,y+.75,z-1.15,x+dx+.05,y+1.4,z+1.15,mat('metal'));
 box(x-1.05,y+1.3,z+1.1,x+1.05,y+1.4,z+1.2,mat('metal'));
 for(const dx of [-.62,.62])box(x+dx-.16,y+.95,z-1.28,x+dx+.16,y+1.22,z-1.15,mat('lamp',2));
 if(loaded)for(let i=0;i<3;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)box(x-.93+i*.64,y+.75+k*.6,z-1.05+j*1.1,x-.35+i*.64,y+1.32+k*.6,z-.1+j*1.1,mat('console',2));
}
registerSet('market',{
 chapter:'05a / NIGHT MARKET',card:'THE NIGHT MARKET',objective:()=>'REACH THE FILAMENT',
 description:'A night market under the elevated road: two rows of stalls with awnings, cells hung as lamps, a crowd, a cart of batteries and the pink sign of The Filament at the far end of a sloping aisle.',
 rain:(x,z)=>Math.abs(x)>9||z>42,
 build(){
  const y=marketY;
  // The sloped aisle under the deck; the street it climbs from; the deck's underside, columns and beams.
  quad([-9,0,-8],[-9,2.7,46],[9,2.7,46],[9,0,-8],mat('paving',0),[0,1,-.05]);
  floor(-40,-70,40,-8,-.02,'road',7);
  quad([-9,9,-4],[9,9,-4],[9,9,42],[-9,9,42],mat('ceiling'),[0,-1,0]);
  for(let z=-4;z<=44;z+=12){for(const x of [-7.5,7.5])box(x-.5,0,z-.5,x+.5,9,z+.5,mat('column'));if(z<=32)box(-9,8.6,z-.15,9,9,z+.15,mat('metal'));}
  // Market Arch: two brick piers (the cart bursts on the left one), a stone lintel and the tram halt's rail above it.
  for(const x of [-5.5,5.5])box(x-1.2,0,-7,x+1.2,9,-4,mat('stone'));
  box(-8,9,-7.2,8,9.7,-3.8,mat('stone'));box(-9,9.7,-7,9,10.2,-6.4,mat('barrier'));
  // Stalls: kiosk bodies on the slope, awnings alternating amber and rose, posters on every third, neon on two faces.
  // The first pair crowds the arch (pulled toward the aisle); the stall at z 6 sits back, so the gap behind it reads.
  for(const z of MARKET_STALLS)for(const side of [-1,1]){
   const base=y(z+1.2),near=z===2,inner=side*(near?3.4:z===6&&side<0?5:4.1),outer=side*(near?5.8:6.5);
   const x0=Math.min(inner,outer),x1=Math.max(inner,outer),hue=((z/4)|0)%2?2:3;
   box(x0,base,z,x1,base+2.2,z+2.4,((z/4)|0)%2?mat('wood',2):{kind:'kiosk',hue:1,baseY:base+.85});
   const over=near?0:1.4,ax0=side<0?x0:inner-over,ax1=side<0?inner+over:x1,az1=side>0&&z>=10&&z<38?z+3.9:z+2.5;
   box(ax0,base+2.3,z-.1,ax1,base+2.55,az1,mat('awning',hue));
   if(((z/4)|0)%3===0)box(x0+.3,base+2.55,z+.6,x1-.3,base+3.1,z+1.8,mat('poster',2));
   if(z===14&&side<0)box(inner-.02,base+.8,z+.2,inner+.02,base+1,z+2.2,mat('neon',1));
   if(z===18&&side>0)box(inner-.02,base+.8,z+.2,inner+.02,base+1,z+2.2,mat('neon',3));
  }
  // Crates of cells for sale at the near stall fronts: the foreground of the prompt frame.
  for(const [x,z] of [[-3.5,3.6],[3.6,5.2],[-3.6,15.2],[3.5,22.6]]){const b=y(z);box(x-.4,b,z-.3,x+.4,b+.5,z+.3,mat('wood',2));for(let i=0;i<2;i++)box(x-.35+i*.4,b+.5,z-.22,x-.05+i*.4,b+1,z+.22,{kind:'console',hue:2,baseY:-1});}
  // Stall lamps are reserve cells on cables across the aisle: a glowing cell with a lamp cap, each one a pool.
  for(let z=0;z<=40;z+=4){const c=y(z)+3.6;quad([-9,c,z],[9,c,z],[9,c+.03,z+.03],[-9,c+.03,z+.03],mat('cable'),[0,-1,0]);
   if(z%8===0)for(const x of [-2.9,2.9]){box(x-.17,c-.5,z-.17,x+.17,c,z+.17,mat('console',2));box(x-.15,c-.65,z-.15,x+.15,c-.5,z+.15,mat('lamp',2));lamps.push([x,z]);}}
  // The gap under [1]: the one gap on the left with a lamp over it, hung from a bar between the two stall roofs.
  {const g=y(9.2);box(-5.4,g+4,8.3,-5.2,g+4.1,10.1,mat('metal'));box(-5.5,g+3.55,9,-5.1,g+4,9.4,mat('console',2));box(-5.52,g+3.3,8.98,-5.08,g+3.55,9.42,mat('lamp',2));lamps.push([-5.3,9.2]);}
  // The awning rope under [2]: hangs from a hook on the front edge of the right awnings' ledge, knotted at the foot.
  {const r=y(9.9)+.8;quad([4.5,r,9.86],[4.85,r,9.86],[4.85,3.3,9.86],[4.5,3.3,9.86],mat('pipe',2),[0,0,-1]);quad([4.85,r,9.9],[4.5,r,9.9],[4.5,3.3,9.9],[4.85,3.3,9.9],mat('pipe',2),[0,0,1]);box(4.42,r-.3,9.78,4.93,r,9.98,mat('metal'));box(4.55,3.28,9.72,4.8,3.7,9.98,mat('metal'));}
  // Marta's cart: a wood bed on rubber wheels, eight cells in a rack, a paper plate (QUILL is the label above it).
  {const b=y(12);for(const dx of [-.45,.45])for(const dz of [-.65,.65])box(-3.6+dx-.1,b,12+dz-.2,-3.6+dx+.1,b+.4,12+dz+.2,mat('rubber'));
   box(-4.2,b+.35,11.1,-3,b+.9,12.9,mat('wood',2));for(let i=0;i<4;i++)for(let j=0;j<2;j++)box(-4.1+i*.28,b+.9,11.3+j*.8,-3.88+i*.28,b+1.42,11.9+j*.8,mat('console',2));
   box(-3.0,b+.95,11.4,-2.92,b+1.35,12.6,mat('paper',6));}
  // The far end: The Filament's sign on a gantry across the aisle, its facade behind, the back door on Vine Alley to
  // the right with Vale's red car dark beside it, the deck's ramp climbing away on the left.
  {const b=y(46);for(const x of [-3.4,3.4])box(x-.15,b,45.9,x+.15,b+5.6,46.1,mat('metal'));box(-3.6,b+5.4,45.85,3.6,b+5.6,46.15,mat('metal'));
   box(-3,b+4.4,45.85,3,b+5.3,46.15,mat('neon',3));
   box(-5,b,47.5,5,9.5,48.5,mat('brick',0));box(-1.2,b,47.4,1.2,b+3.2,47.55,{kind:'door',hue:2,baseY:b});box(-1.4,b+3.3,47.3,1.4,b+3.6,47.55,mat('lamp',2));lamps.push([0,47.4]);
   const d=y(44);box(6.4,d-.1,44.3,9,9,47.5,mat('brick',0));box(6.8,d,44.1,7.6,d+3,44.35,{kind:'door',hue:2,baseY:d});box(6.7,d+3.1,44.1,7.7,d+3.5,44.35,mat('sign'));
   quad([-12,b,46],[-6,b,46],[-6,8,70],[-12,8,70],mat('express'),[0,1,-.3]);for(const x of [-12,-6])quad([x-.1,b,46],[x+.1,b,46],[x+.1,8.6,70],[x-.1,8.6,70],mat('barrier'),[0,1,-.3]);}
  car(7.8,y(41),3,y(41),false,{dark:true});
  // The city beyond the club, and the dark district behind the arch for the shots that look back down the aisle.
  cityRow(52,120,16,-30,20);cityRow(52,120,18,12,24);cityRow(-64,-12,16,-24,10);cityRow(-64,-12,16,10,12);
  // Street lamps on the road beyond the arch, so the opening reads when the aisle shot looks back through it.
  for(const x of [-6.5,6.5]){box(x-.06,-.02,-13.06,x+.06,4.6,-12.94,mat('metal'));box(x-.34,4.15,-13.34,x+.34,4.7,-12.66,mat('lamp',2));lamps.push([x,-13]);}
  marketLamps=lamps.length;
 },
 // From the tram's rail above the arch: the fade-up looks down through the arch at the lit aisle.
 start(){return look(0,7,-16,0,2,14);},
 shot(p){
  const y=marketY,t=state.event,m=state.market;
  const qte=look(-.2,y(-2)+2.4,-2,0,2.4,24);
  if(p==='marketEntry')return look(-.4,y(-1)+1.75,-1,0,6.2,44);
  if(p==='marketAisle')return look(-1.4,y(15.5)+1.9,15.5,-1,1.9,2);
  if(p==='marketKeeper')return look(-.6,y(11)+1.9,11,-3.6,y(13.4)+1.4,13.4);
  if(p==='marketDanger')return look(1.6,y(21)+1.7,21,0,y(30)+1.3,30);
  if(p==='marketResult'&&m==='cut'){const s=reduce?1:smooth(clamp((t-1.2)/2.8,0,1)),cz=mix(6,28,s),hold=look(1.2,y(3.5)+1.9,3.5,4.9,2.8,9.9);return marketBlend(hold,look(.2,y(cz)+4.6,cz,6.4,y(cz+12)+2.4,cz+12),reduce?1:smooth(clamp((t-.9)/.8,0,1)));}
  if(p==='marketResult'&&m==='slip'){const s=reduce?1:smooth(clamp((t-.9)/2,0,1));return marketBlend(qte,look(.4,y(0)+2.8,0,-5.2,.8,-4.6),s);}
  if(p==='marketResult'){const s=reduce?0:smooth(clamp((t-4)/2,0,1));return marketBlend(qte,look(-.4,y(3)+2.2,3,0,y(46)+4.5,46),s);}
  return qte;
 },
 ease(p){return {marketEntry:8,marketAisle:3,marketKeeper:3,marketDanger:.5,marketQte:.8,marketResult:.6}[p]||1.2;},
 blocking(p){
  const y=marketY,others=[],res=p==='marketResult',m=state.market,t=state.event;
  const u=p==='marketEntry'?(reduce?1:span(8)):1,v=res?(reduce?1:span(4)):0,w=p==='marketDanger'?(reduce?1:span(2)):1;
  let rook;
  if(p==='marketEntry'){const z=mix(-6,8,u);rook={x:-1.6,y:y(z),z,pose:u<1?'walk':'watch'};}
  else if(p==='marketAisle')rook={x:-1.6,y:y(8),z:8,pose:'watch'};
  else if(p==='marketKeeper')rook={x:-2.4,y:y(10.4),z:10.4,pose:'watch'};
  else if(res&&m==='slip'){const d=reduce?1:clamp(t/.9,0,1),z=mix(4.8,9.2,d);rook={x:mix(-1.5,-5.3,d),y:y(z),z,pose:d<1?'walk':'crouch'};}
  else if(res&&m==='cut'){if(!reduce&&t<1.2)rook={x:4.1,y:y(9.4),z:9.4,pose:'reach'};else{const s=reduce?1:smooth(clamp((t-1.2)/2.8,0,1)),z=mix(10,36,s);rook={x:mix(4.4,5.3,Math.min(1,s*3)),y:y(z)+2.55,z,pose:'walk'};}}
  else if(res)rook={x:-.7,y:y(4.2)-.3,z:4.2,pose:'stumble',lean:-.5};
  else rook={x:-1.5,y:y(4.8),z:4.8,pose:'watch',lean:.1};
  others.push({x:-3.6,y:y(13.4),z:13.4,pose:p==='marketKeeper'?'read':'stand',who:'nell',hue:6});
  let krane=null;
  if(p==='marketAisle'||p==='marketKeeper'){const s=p==='marketAisle'&&!reduce?span(3):1,z=mix(-1,4,s);krane={x:1.2,y:y(z)+.3,z,pose:s<1?'walk':'stand',who:'krane'};}
  else if(p==='marketDanger'||p==='marketQte')krane={x:.3,y:y(31.6)+.3,z:31.6,pose:'reach',who:'krane'};
  else if(res&&m==='cut'){const z=mix(31.5,43.5,v);krane={x:mix(.4,7.2,v),y:y(z)+.3,z,pose:'walk',who:'krane'};}
  else if(res&&v<.95){const z=mix(31.6,47,v);krane={x:mix(.3,1.2,v),y:y(z)+.3,z,pose:'walk',who:'krane'};}
  if(krane)others.push(krane);
  const scattered=p==='marketDanger'||p==='marketQte'||res;
  for(const [x0,z0,hue,x1,z1] of MARKET_CROWD){
   const x=scattered?mix(x0,x1,w):x0,z=scattered?mix(z0,z1,w):z0;
   others.push({x,y:y(z),z,pose:scattered&&w<1?'walk':'stand',hue,who:'patron'});
  }
  return{rook,courier:null,others};
 },
 geometry(p){
  const y=marketY,t=state.event,res=p==='marketResult',m=state.market;
  lamps.length=marketLamps;
  // Krane's cart: parked on the centre line, tipped into motion in the windup, rolling down the aisle over the window.
  let cz=30,cx=0,burst=false;
  if(p==='marketDanger')cz=30-span(2)*6;
  else if(p==='marketQte')cz=mix(24,6.3,clamp(t/marketWindow(),0,1));
  else if(res&&m!=='late'){const r=reduce?1:clamp(t/1.6,0,1);cz=mix(6.3,-3.2,r);cx=mix(0,-4.6,r);burst=r>=1;}
  if(res&&m==='late'){
   // Stopped across the aisle: four cells still on the bed, six spilled and arcing on the wet paving.
   const b=y(6.3);box(-1.15,b,6.2,1.15,b+2.1,6.5,mat('metal'));box(-1.2,b+2.1,6.1,1.2,b+2.35,6.6,mat('wood',2));
   for(const dx of [-.8,.8])for(const dy of [.35,1.6])box(dx-.22,b+dy,5.95,dx+.22,b+dy+.44,6.2,mat('rubber'));
   for(let i=0;i<3;i++){const o=hash(i,2)*.3;box(-.9+i*.62,b+.5+o,6.6,-.35+i*.62,b+1.05+o,7.6,{kind:'console',hue:2,baseY:-1});}
   for(const [sx,sz,spark] of [[-1.7,3.1,1],[-.5,4.4,1],[.8,3.4,1],[1.3,5.1,0],[-1.1,5.4,0],[.2,2.4,1]]){const g=y(sz);box(sx,g,sz,sx+.5,g+.4,sz+.9,{kind:'console',hue:2,baseY:-1});if(spark)box(sx+.15,g+.4,sz+.35,sx+.33,g+.68,sz+.53,mat('arc',6));}
  }else if(!burst)marketCart(cx,cz,y(cz));
  if(burst){
   quad([-5.5,0,-2.3],[-3.5,0,-2.3],[-3.5,2.2,-3.9],[-5.5,2.2,-3.9],mat('wood',2),[0,.73,.68]);quad([-5.5,2.2,-3.9],[-3.5,2.2,-3.9],[-3.5,0,-2.3],[-5.5,0,-2.3],mat('wood',2),[0,-.73,-.68]);
   box(-5.55,2.15,-4,-3.45,2.4,-3.75,mat('metal'));for(const wx of [-5.15,-3.85])for(const [wy,wz] of [[.35,-2.55],[1.65,-3.5]])box(wx-.22,wy,wz-.1,wx+.22,wy+.44,wz+.35,mat('rubber'));
   // Cells burst white against the left pier and arc on the ground for a moment.
   for(let i=0;i<14;i++){const sx=-6.8+hash(i,1)*4.6,sz=-3.5+hash(i,2)*3;box(sx,-.02,sz,sx+.36,.28,sz+.36,mat('lamp',2));}
   lamps.push([-4.6,-2.2]);
   if(reduce||t<3.6)for(const [sx,sz,sy] of [[-6.2,-3.3,.2],[-5.3,-2.9,1.1],[-4.4,-3.5,1.9],[-3.3,-2.2,.3],[-4.9,-1.6,.15],[-2.9,-3.1,.8]])box(sx,sy,sz,sx+.26,sy+.38,sz+.26,mat('arc',6));
  }
  if(state.tail)car(-8.3,-7.5,0,-.02,false,{dark:true});
 },
 labels(p){
  const y=marketY;
  if(p==='marketEntry')worldLabel([0,8.5,-4.2],'MARKET',2);
  if(p==='marketAisle'||p==='marketKeeper')worldLabel([-3.4,y(12)+1.9,12],'QUILL',6);
  worldLabel([0,y(46)+5.8,46],'THE FILAMENT',3);
  if(p==='marketDanger')worldLabel([.3,y(31.6)+3.2,31.6],'KRANE',0);
  if(p==='marketQte'){worldLabel([-4.6,y(9.2)+2.85,9.2],'[1]',2);worldLabel([4.68,y(9.9)+3.75,9.9],'[2]',2);}
  if(p==='marketResult'&&state.market==='cut')worldLabel([7.2,y(44)+3.95,44.2],'VINE ALLEY',1);
 },
 exit(){return [0,marketY(46)+2.5,46];},
 preview(){Object.assign(state,{pursuit:'chasing',tail:true});return 'marketEntry';}
});
registerPhases('market',{
 marketEntry:{kind:'cutscene',title:'05a / THE NIGHT MARKET',duration:8,next:'marketAisle',
  enter:()=>{addClue('The night market runs on reserve cells stamped with Lumen Board serials. The stolen batteries are being sold by the cell.');},
  caption:()=>'Stalls, awnings, a crowd that does not part. Every stall lamp is a reserve cell with a Lumen Board serial. At the end of the aisle, The Filament\'s sign burns pink through the rain.'},
 marketAisle:{kind:'quiet',title:'A CART MARKED QUILL',
  caption:()=>state.tail?'A woman sells cells from a cart marked QUILL. The black car from the road is parked under the arch, empty. Rook can ask where the cells come from, or push on before its driver finds him.':'A woman sells cells from a cart marked QUILL. Behind Rook, someone big is moving through the crowd without buying anything. Rook can ask where the cells come from, or push on.',
  buttons:b=>{b('[ASK THE STALL KEEPER]',()=>enter('marketKeeper'));b('[PUSH THROUGH TO THE CLUB]',()=>enter('marketDanger'));}},
 marketKeeper:{kind:'quiet',title:'MARTA QUILL',stinger:()=>['NOTED','hit',1.6],
  enter:()=>{state.keeper=true;addClue('Marta Quill, stall keeper: the cells come from Substation Nine on the canal basin, Thursdays, in a Lumen Board van. The racks in the hall are chained on the left, loose on the right.');},
  caption:()=>'Marta Quill does not look up from her cells. "Nine, on the basin. Thursdays, Board van. They chain the racks on the left and leave the right loose, if you are thinking of going." Rook is.',
  buttons:b=>{b('[PUSH THROUGH TO THE CLUB]',()=>enter('marketDanger'));}},
 marketDanger:{kind:'windup',title:'KRANE',next:'marketQte',
  caption:()=>'The big man is Krane, Vale\'s bodyguard, and he has seen Rook. He puts his shoulder into a loaded cell-cart and sends it down the aisle. Get ready.'},
 marketQte:{kind:'prompt',title:'THE CART IS COMING',window:marketWindow,next:'marketResult',
  caption:()=>'The cart is coming down the aisle. Slip into the gap on the left, or go up the awning rope and over the stalls after Krane.',
  moves:[{label:'[1] SLIP INTO THE STALL',id:'slip',act:()=>{state.market='slip';}},{label:'[2] GO OVER THE STALLS',id:'cut',act:()=>{state.market='cut';}}],
  miss:()=>{state.market='late';}},
 marketResult:{kind:'result',title:'UNDER THE ARCH',duration:4,next:'clubEntry',
  stinger:()=>state.market==='slip'?['CLEAR','hit']:state.market==='cut'?['OVER THE STALLS','hit']:['HIT','miss'],
  enter:()=>{if(state.market==='cut')addClue('Krane entered The Filament by the back door on Vine Alley. The back door is the way out too.');},
  caption:()=>state.market==='slip'?'Rook goes into the gap. The cart goes past and into the arch pier; cells burst white against the concrete. Krane is gone.':state.market==='cut'?'Rook goes up the rope and over the awnings as the cart passes under him. Krane is ahead, moving fast, and he goes in by a door marked VINE ALLEY behind The Filament.':'The cart takes Rook at the knee. Cells spill and arc on the wet ground. He gets up cut and slow, and Krane is gone.',
  rewind:{miss:()=>state.market==='late',back:'marketDanger',reset:()=>{state.market='';}}}
});
