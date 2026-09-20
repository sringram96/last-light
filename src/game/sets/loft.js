// 01b / THE DEPOT LOFT. Bell's room over the lamp depot: Nell's note, the route map with six lamps crossed out, and the
// photographs that put the batteries at The Filament's back door. Reached from the street deduction on the routes without Nell.
registerSet('loft',{
 chapter:'01b / THE DEPOT LOFT',card:'THE DEPOT LOFT',objective:()=>'WHAT BELL KNEW',
 description:'One room over the lamp depot: a cot, a kettle on the stove, a wall of route maps, three pinned photographs and a window onto the station clock.',
 rain:(x,z)=>z>7.2,
 build(){
  floor(-4.5,0,4.5,7,0,'plank',2);wall(-4.5,7,-4.5,0,3.2,'brick',2);wall(4.5,0,4.5,7,3.2,'brick',2);
  // Front wall with the door gap; the landing and the top of the iron stair outside.
  box(-4.5,0,-.05,-3.6,3.2,.05,mat('brick',2));box(-2.4,0,-.05,4.5,3.2,.05,mat('brick',2));box(-3.7,0,-.3,-3.55,3,-.08,mat('door',2));
  box(-4.5,-.1,-1.4,-2,0,0,mat('grate'));for(let i=0;i<6;i++)box(-4.4,-.7*(i+1),-1.4-.5*i-.5,-3,-.7*(i+1)+.08,-1.4-.5*i,mat('metal'));
  quad([-4.5,3.2,0],[4.5,3.2,0],[4.5,3.2,7],[-4.5,3.2,7],mat('ceiling'),[0,-1,0]);box(-4.5,3.05,3.4,4.5,3.2,3.6,mat('metal'));
  // Back wall with the window; the map to its left, the photographs to its right.
  box(-4.5,0,6.95,-1.5,3.2,7.05,mat('brick',2));box(1.5,0,6.95,4.5,3.2,7.05,mat('brick',2));box(-1.5,0,6.95,1.5,.9,7.05,mat('brick',2));box(-1.5,3,6.95,1.5,3.2,7.05,mat('brick',2));
  box(-1.6,.85,6.9,1.6,.95,7.1,mat('metal'));box(-1.6,2.95,6.9,1.6,3.05,7.1,mat('metal'));box(-.05,.9,6.92,.05,3,7.08,mat('metal'));
  box(-4.4,1.2,6.93,-1.8,2.8,6.96,{kind:'map',hue:6,seed:3,cross:[-3.9,-2.1,1.85,2.15]});box(-2.3,2.2,6.9,-1.9,2.45,6.94,mat('paper',6));
  for(const [x0,x1] of [[1.9,2.6],[2.8,3.5],[3.7,4.4]])box(x0,1.7,6.92,x1,2.2,6.95,mat('paper',6));
  box(2.05,1.85,6.9,2.35,1.91,6.92,mat('neon',3));box(2.95,1.9,6.9,3.35,2.05,6.92,mat('car',4));box(3.9,1.8,6.9,4.2,2.1,6.92,mat('metal'));
  // Table, note, key, kettle; cot; bench with lantern parts; the one lamp.
  box(-1.2,0,2.4,1.2,.9,3.8,mat('wood',2));box(-.35,.9,2.88,-.05,.92,3.12,mat('paper',6));box(-.26,.92,2.97,-.14,.96,3.03,mat('metal'));
  box(.55,.9,3.25,.9,1.25,3.6,mat('metal'));box(1.0,.9,3.3,1.15,1.05,3.45,mat('metal'));
  box(-4.3,0,3,-2.3,.5,6.2,mat('wood',2));box(-4.2,.5,3.1,-2.4,.56,6.1,mat('paper',6));
  box(1.4,0,4.6,4.3,.95,6.4,mat('wood',2));for(const x of [1.9,2.7,3.5])box(x-.12,.95,5.3,x+.12,1.4,5.55,mat('glass',1));box(3.7,.95,4.8,4.2,1.25,5.2,mat('metal'));
  box(-3.2,1.6,.15,-3.0,1.9,.3,mat('metal'));box(-3.25,1.05,.12,-2.95,1.6,.32,mat('lamp',2));
  pendant(0,2.4,3.1);
  // The street beyond the window, four units down: lamps, the station clock and two facades.
  const cityStart=surfaces.length;
  quad([-40,0,8],[40,0,8],[40,0,40],[-40,0,40],mat('road',7),[0,1,0]);box(-8,.01,8,-4.8,.18,40,mat('paving'));box(4.8,.01,8,8,.18,40,mat('paving'));
  for(const [x,z] of [[-3,12],[3,20],[-3,28],[3,34]]){box(x-.055,.15,z-.055,x+.055,4.65,z+.055,mat('metal'));box(x-.34,4.15,z-.34,x+.34,4.7,z+.34,mat('lamp',2));lamps.push([x,z]);}
  building(4,20,10,8,8,0,11);building(-14,20,10,8,8,4,17);box(-2.2,0,21,2.2,11,25,mat('tower',0));box(-2.45,8,20.75,2.45,8.45,25.25,mat('stone',6));
  for(let i=cityStart;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]-=4;surfaces[i].mat={...surfaces[i].mat,baseY:-4};}
 },
 start(){return look(-3,1.2,-1.6,-1.5,1.4,4);},
 shot(p){
  if(p==='loftEntry')return state.event<4?look(-2.4,1.6,1.2,.5,1.2,4.5):look(-2,1.6,2,-3.1,2,7);
  if(p==='loftTable')return look(-2.9,1.7,.4,-1.2,1.1,5.2);
  if(p==='loftNote')return look(-.9,1.5,1.7,-.2,.92,3);
  if(p==='loftBoard')return look(1.6,1.8,4.5,3.15,1.95,7);
  return look(0,1.5,5.6,0,7.5,22);
 },
 ease(p){return {loftEntry:4,loftTable:4,loftNote:4,loftBoard:5,loftLeave:4}[p]||1.5;},
 blocking(p){
  const u=p==='loftEntry'&&!reduce?span(4):1;
  const rook=p==='loftEntry'?{x:mix(-3,-1,u),z:mix(-1,2.2,u),pose:u<1?'walk':'watch'}:p==='loftTable'?{x:-2.2,z:1.6,pose:'watch'}:p==='loftNote'?{x:-.9,z:2,pose:'read'}:p==='loftBoard'?{x:2.8,z:5.2,pose:'read'}:{x:0,z:5.8,pose:'watch'};
  return{rook,courier:null,others:[]};
 },
 geometry(){box(.62,1.25,3.38,.72,1.45+Math.sin(state.t*3)*.05,3.48,mat('cable',6));},
 labels(p){
  if(p==='loftEntry')worldLabel([-3.1,2.1,.2],'BELL',6);
  if(p==='loftBoard'){worldLabel([2.25,1.35,6.9],'FILAMENT',3);worldLabel([3.15,1.35,6.9],'BOARD VAN',4);worldLabel([4.05,1.35,6.9],'DIVISION',0);}
  worldLabel([-3.1,3,6.9],'ROUTE 14-19',2);
 },
 exit(){return [0,1.9,7.05];},
 preview(){Object.assign(state,{choice:'book',clues:['Scene preview: the dispatch entry named Pump Room 4; the lantern was stencilled BELL / DEPOT LOFT.']});return 'loftEntry';}
});
registerPhases('loft',{
 loftEntry:{kind:'cutscene',title:'01b / THE DEPOT LOFT',duration:7,next:'loftTable',
  enter:()=>{state.loftSeen=true;},
  caption:()=>'One room over the lamp depot. A cot, a kettle, a wall of route maps pinned with battery tags. Someone has been here since Bell went missing: the kettle is warm.'},
 loftTable:{kind:'quiet',title:'THE TABLE UNDER THE LAMP',
  caption:()=>'On the table, a folded note weighted with a lamp key. On the wall, Bell\'s route map: lamps 14 to 19 crossed out in red and tagged RESERVE PULLED / ORDER 7731 / A.V. Beside it, photographs.',
  buttons:b=>{b('[READ THE NOTE]',()=>enter('loftNote'));b('[STUDY THE MAP AND PHOTOGRAPHS]',()=>enter('loftBoard'));}},
 loftNote:{kind:'quiet',title:'A NOTE SIGNED N.',stinger:()=>['NOTED','hit',1.6],
  enter:()=>{state.note=true;addClue('A note in Bell\'s loft, signed N.: the maintenance call that put Bell at the station was made by someone who wanted the Board to log him there.');},
  caption:()=>'The note, in a quick hand: "Ivo. I called it in so the Board would have to log you at the station. I did not think. Forgive me. N." Rook folds it into the file.',
  buttons:b=>{b('[STUDY THE MAP AND PHOTOGRAPHS]',()=>enter('loftBoard'));}},
 loftBoard:{kind:'quiet',title:'WHERE ARE THE BATTERIES GOING?',
  caption:()=>state.misread?'The depot and the station have nothing to hide; Bell would not photograph his own workplace. The club\'s back door and the Board\'s van are in the same frame. Rook has spent a rewind\'s worth of night getting it wrong.':'The photographs: a red car at a loading bay behind a neon sign, THE FILAMENT. A Lumen Board van. A man in a division coat who does not look at the camera. Where are the batteries going?',
  buttons:b=>{
   const wrong=()=>{if(!state.misread){state.misread=true;state.rewinds=Math.max(0,state.rewinds-1);}ui();};
   b('[UPTOWN, THROUGH THE FILAMENT]',()=>{addClue('Bell\'s photographs: reserve batteries leave by the Filament\'s back door into a Lumen Board van. The man in the division coat is Vale.');enter('loftLeave');});
   b('[BACK TO THE LAMP DEPOT]',wrong);b('[INTO THE STATION VAULTS]',wrong);
  }},
 loftLeave:{kind:'cutscene',title:'FIVE PAST MIDNIGHT',duration:4,next:'stationEntry',
  caption:()=>'Rook takes the photographs. Through the window, the station clock reads five past midnight. Bell\'s job is still open.'}
});
