// 05a / THE NIGHT MARKET. Stalls under the elevated road, lit by reserve cells with Lumen Board serials, rising toward
// The Filament's sign. Marta Quill's cart; Krane sends a loaded cell-cart down the sloped aisle at Rook.
const marketY=z=>(z+8)*.05;
function marketWindow(){return clamp(7+(state.tail?2:0)-(state.misread?2:0),5,9);}
registerSet('market',{
 chapter:'05a / NIGHT MARKET',card:'THE NIGHT MARKET',objective:()=>'REACH THE FILAMENT',
 description:'A night market under the elevated road: two rows of stalls with awnings, cells hung as lamps, a crowd, a cart of batteries and the pink sign of The Filament at the far end of a sloping aisle.',
 rain:(x,z)=>Math.abs(x)>9||z>42,
 build(){
  quad([-9,0,-8],[-9,2.7,46],[9,2.7,46],[9,0,-8],mat('paving',0),[0,1,-.05]);
  quad([-9,9,-8],[9,9,-8],[9,9,46],[-9,9,46],mat('ceiling'),[0,-1,0]);
  for(let z=-4;z<46;z+=12){for(const x of [-7.5,7.5])box(x-.5,0,z-.5,x+.5,9,z+.5,mat('column'));box(-9,8.6,z-.15,9,9,z+.15,mat('metal'));}
  for(const x of [-5.5,5.5])box(x-1.5,0,-7,x+1.5,9,-4,mat('brick',0));box(-7,9,-7,7,9.6,-4,mat('stone'));
  for(let z=2;z<40;z+=4)for(const side of [-1,1]){
   const x0=side<0?-6.5:4.1,x1=side<0?-4.1:6.5,y=marketY(z);
   box(x0,y,z,x1,y+2.2,z+2.4,mat('kiosk',1));box(side<0?x0:x0-1.4,y+2.3,z-.1,side<0?x1+1.4:x1,y+2.55,z+2.5,mat('awning',((z/4)|0)%2?2:3));
   if(((z/4)|0)%3===0)box(x0+.3,y+2.55,z+.6,x1-.3,y+3.1,z+1.8,mat('sign'));
   if(z===14&&side<0)box(x1-.02,y+.8,z+.2,x1+.02,y+1,z+2.2,mat('neon',1));if(z===18&&side>0)box(x0-.02,y+.8,z+.2,x0+.02,y+1,z+2.2,mat('neon',3));
  }
  for(let z=0;z<=40;z+=4){quad([-9,3.6,z],[9,3.6,z],[9,3.63,z+.03],[-9,3.63,z+.03],mat('cable'),[0,-1,0]);
   if(z%8===0)for(const x of [-2.9,2.9]){box(x-.17,3.1,z-.17,x+.17,3.6,z+.17,mat('console',2));box(x-.15,2.95,z-.15,x+.15,3.1,z+.15,mat('lamp',2));lamps.push([x,z]);}}
  box(-4.2,marketY(12),11.1,-3,marketY(12)+.9,12.9,mat('wood',2));for(const dz of [-.6,.6])box(-3.9,marketY(12)-.2,12+dz-.2,-3.3,marketY(12)+.3,12+dz+.2,mat('rubber'));
  for(let i=0;i<4;i++)box(-4.1+i*.3,marketY(12)+.9,11.3,-3.9+i*.3,marketY(12)+1.4,12.7,mat('console',2));
  quad([4.2,marketY(9)+1,9.2],[5.8,marketY(9)+3.3,9.6],[5.84,marketY(9)+3.3,9.66],[4.24,marketY(9)+1,9.26],mat('cable'),[0,0,-1]);box(4.1,marketY(9)+.8,9.1,4.35,marketY(9)+1.05,9.35,mat('metal'));
  box(-3,marketY(46)+5,46,3,marketY(46)+6,46.4,mat('neon',3));for(const x of [-3.2,3.2])box(x-.15,0,45.8,x+.15,marketY(46)+6,46.2,mat('metal'));
  box(6.8,marketY(44),43.8,7.6,marketY(44)+3,44.2,mat('door',2));box(6.7,marketY(44)+3.1,43.7,7.7,marketY(44)+3.5,44.3,mat('sign'));
  cityRow(50,120,16,-30,20);cityRow(50,120,18,12,24);
  quad([-12,marketY(46),46],[-6,marketY(46),46],[-6,8,70],[-12,8,70],mat('express'),[0,1,-.3]);
 },
 start(){return look(0,6.5,-12,0,2,14);},
 shot(p){
  if(p==='marketEntry')return look(-1.2,1.9,-2,0,3.2,44);
  if(p==='marketAisle')return look(-2.6,1.7,15,-1,1.4,3);
  if(p==='marketKeeper')return look(-3.2,1.5,9.6,-3.6,1.35,12.4);
  if(p==='marketDanger')return look(1.6,1.7,21,0,1.8,30);
  if(p==='marketResult'&&state.market==='cut')return look(2.4,4.2,6,5.2,3,26);
  if(p==='marketResult'&&state.event>4)return look(-.4,2.2,3,0,4.5,46);
  return look(-.4,2.2,3,0,1.6,22);
 },
 ease(p){return {marketEntry:8,marketAisle:3,marketKeeper:3,marketDanger:.5,marketResult:2}[p]||1.2;},
 blocking(p){
  const others=[],y=marketY;let rook;
  const u=p==='marketEntry'&&!reduce?span(8):1,v=p==='marketResult'&&!reduce?span(4):1;
  if(p==='marketEntry')rook={x:-1,y:y(mix(-6,8,u)),z:mix(-6,8,u),pose:u<1?'walk':'watch'};
  else if(p==='marketKeeper')rook={x:-2.4,y:y(10.4),z:10.4,pose:'watch'};
  else if(p==='marketResult'&&state.market==='slip')rook={x:mix(-.8,-5.3,Math.min(1,v*2)),y:y(9.2),z:9.2,pose:v<.5?'walk':'crouch'};
  else if(p==='marketResult'&&state.market==='cut')rook={x:mix(4.4,5.3,v),y:y(10)+mix(0,2.55,v),z:mix(9.2,mix(10,38,v),v),pose:v<.2?'reach':'walk'};
  else if(p==='marketResult')rook={x:0,y:y(8.5)-.3,z:8.5,pose:'stumble',lean:-.5};
  else rook={x:-.8,y:y(9),z:9,pose:'watch',lean:p==='marketDanger'||p==='marketQte'?.1:0};
  others.push({x:-3.6,y:y(13.4),z:13.4,pose:'stand',who:'nell',hue:6});
  const krane=p==='marketAisle'||p==='marketKeeper'?{x:1.2,y:y(4)+.3,z:4,pose:'stand',who:'krane'}:p==='marketResult'&&state.market==='cut'?{x:mix(.4,7.2,v),y:y(mix(31.5,43.5,v))+.3,z:mix(31.5,43.5,v),pose:'walk',who:'krane'}:p==='marketResult'?null:{x:.4,y:y(31.5)+.3,z:31.5,pose:p==='marketEntry'?'walk':'reach',who:'krane'};
  if(krane)others.push(krane);
  for(let i=0;i<10;i++){const z=1+i*3,side=i%2?1:-1;others.push({x:side*3.4,y:y(z),z,pose:'stand',hue:[0,4,6][i%3],who:'patron'});}
  return{rook,courier:null,others};
 },
 geometry(p){
  const y=marketY;
  if(['marketEntry','marketAisle','marketKeeper','marketDanger','marketQte'].includes(p)||(p==='marketResult'&&state.market==='late')){
   const u=p==='marketQte'?clamp(state.event/marketWindow(),0,1):p==='marketResult'?1:0,z=p==='marketDanger'?30-span(2)*2:mix(30,7,u);
   box(-.8,y(z),z-1.1,.8,y(z)+1.3,z+1.1,mat('wood',2));for(let i=0;i<3;i++)box(-.6+i*.45,y(z)+1.3,z-.9,-.25+i*.45,y(z)+1.9,z+.9,mat('console',2));
   if(p==='marketResult')for(let i=0;i<5;i++)box(-1.5+i*.6,y(6)+.1,5.5+hash(i,4),-1.2+i*.6,y(6)+.35,5.8+hash(i,4),mat('arc',6));
  }
  if(p==='marketResult'&&state.market!=='late')for(let i=0;i<8;i++)box(-6+hash(i,1)*2,-.1,-6+hash(i,2)*2,-5.7+hash(i,1)*2,.2,-5.7+hash(i,2)*2,mat('lamp',2));
  car(-7.2,42,3,y(42),false,{dark:true});if(state.tail)car(-7,-6,0,0,false,{dark:true});
 },
 labels(p){
  const y=marketY;
  if(p==='marketEntry')worldLabel([0,9.8,-5],'MARKET',2);
  if(p!=='marketEntry')worldLabel([-3.6,y(12)+2.3,12],'QUILL',6);
  worldLabel([0,y(46)+6.6,46],'THE FILAMENT',3);
  if(['marketDanger','marketQte'].includes(p))worldLabel([.4,y(31.5)+3.1,31.5],'KRANE',0);
  if(p==='marketQte'){worldLabel([-5.3,y(9)+2.4,9.2],'[1]',2);worldLabel([5.4,y(9)+3.7,9.4],'[2]',2);}
  if(p==='marketResult'&&state.market==='cut')worldLabel([7.2,y(44)+3.8,44],'VINE ALLEY',1);
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
