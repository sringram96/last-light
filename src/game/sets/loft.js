// 01b / THE DEPOT LOFT. Bell's room over the lamp depot: Nell's note, the route map with six lamps crossed out, and the
// photographs that put the batteries at The Filament's back door. Reached from the street deduction on the routes without Nell.
// The picture follows docs/design/LOCATIONS.md (01b): one pendant pool over the table, the map wall left of the window,
// the three prints right of it over the bench, and the street four units down beyond the window with the station clock.
function loftBlend(a,b,t){const o={};for(const k of Object.keys(a))o[k]=mix(a[k],b[k],t);return o;}
registerSet('loft',{
 chapter:'01b / THE DEPOT LOFT',card:'THE DEPOT LOFT',objective:()=>'WHAT BELL KNEW',
 description:'One room over the lamp depot: a cot, a kettle on the stove, a wall of route maps, three pinned photographs and a window onto the station clock.',
 rain:(x,z)=>z>7.2,
 build(){
  const brick=mat('brick',2),metal=mat('metal'),wood=mat('wood',2),paper=mat('paper',6);
  // The shell: plank floor, brick walls, the ceiling with one iron beam, the front wall with its open door.
  floor(-4.5,0,4.5,7,0,'plank',2);wall(-4.5,7,-4.5,0,3.2,'brick',2);wall(4.5,0,4.5,7,3.2,'brick',2);
  quad([-4.5,3.2,0],[4.5,3.2,0],[4.5,3.2,7],[-4.5,3.2,7],mat('ceiling'),[0,-1,0]);box(-4.5,3.0,3.4,4.5,3.2,3.6,metal);
  box(-4.5,0,-.05,-3.6,3.2,.05,brick);box(-2.4,0,-.05,4.5,3.2,.05,brick);box(-3.6,2.9,-.05,-2.4,3.2,.05,brick);
  box(-3.62,0,.05,-3.54,2.9,1.25,wood);
  // Outside the door: the grate landing and the top of the iron stair going down to the street.
  box(-4.5,-.1,-1.4,-2,0,0,mat('grate'));for(let i=0;i<6;i++)box(-4.4,-.7*(i+1),-1.4-.45*(i+1),-3,-.7*(i+1)+.08,-1.4-.45*i,metal);
  // The spare lantern on its hook beside the door, on the landing side, unlit: the first thing the camera sees.
  box(-2.2,1.44,-.2,-2.1,1.56,-.05,metal);box(-2.33,1.4,-.36,-1.97,1.46,-.06,metal);box(-2.28,1.0,-.34,-2.02,1.4,-.08,mat('glass',2));box(-2.24,.92,-.32,-2.06,1.0,-.1,metal);
  // Back wall with the window: frame, sill and two mullions, no glass; the street shows through it.
  box(-4.5,0,6.95,-1.5,3.2,7.05,brick);box(1.5,0,6.95,4.5,3.2,7.05,brick);box(-1.5,0,6.95,1.5,.9,7.05,brick);box(-1.5,3,6.95,1.5,3.2,7.05,brick);
  box(-1.62,.8,6.88,1.62,.92,7.12,metal);box(-1.62,2.98,6.88,1.62,3.1,7.12,metal);box(-1.62,.9,6.9,-1.5,3,7.1,metal);box(1.5,.9,6.9,1.62,3,7.1,metal);
  for(const x of [-.75,.75])box(x-.04,.9,6.92,x+.04,3,7.08,metal);
  // The map wall left of the window: Bell's route grid with six lamps crossed out in red, and the order tag beside them.
  box(-4.4,1.2,6.93,-1.8,2.8,6.96,{kind:'map',hue:6,seed:3,cross:[-3.6,-2.3,1.7,2.3]});box(-2.3,2.2,6.9,-1.9,2.45,6.94,paper);
  // The photographs right of the window: the club's neon, the Board van, the man in the division coat.
  for(const [x0,x1] of [[1.9,2.6],[2.8,3.5],[3.7,4.4]])box(x0,1.7,6.92,x1,2.2,6.95,paper);
  box(2.1,1.97,6.9,2.4,2.03,6.92,mat('neon',3));box(2.95,1.8,6.9,3.35,1.95,6.92,mat('car',4));box(3.96,1.76,6.9,4.14,2.08,6.92,mat('rubber'));box(3.92,2.08,6.9,4.18,2.14,6.92,mat('rubber'));
  // The table under the lamp: plank top on iron legs, the note under the lamp key, the kettle on its ring, a tin mug.
  box(-1.2,.82,2.4,1.2,.9,3.8,wood);for(const [x,z] of [[-1.1,2.5],[1.1,2.5],[-1.1,3.7],[1.1,3.7]])box(x-.05,0,z-.05,x+.05,.82,z+.05,metal);
  box(-.37,.9,2.87,-.03,.92,3.13,paper);box(-.26,.92,2.97,-.14,.96,3.03,metal);
  // Bell's stool, pushed back from the table's near corner.
  box(-1.9,.42,1.9,-1.5,.47,2.3,wood);for(const [x,z] of [[-1.85,1.95],[-1.55,1.95],[-1.85,2.25],[-1.55,2.25]])box(x-.03,0,z-.03,x+.03,.42,z+.03,metal);
  box(.47,.9,3.17,.93,.93,3.63,metal);box(.525,.93,3.225,.875,1.28,3.575,metal);box(.875,1.1,3.36,1.02,1.16,3.44,metal);box(.62,1.28,3.38,.78,1.34,3.42,metal);
  box(-.95,.9,3.35,-.75,1.08,3.55,metal);
  pendant(0,3.1,2.4);
  // The cot along the left wall, with its sheet and a folded blanket.
  box(-4.3,0,3,-2.3,.5,6.2,wood);box(-4.2,.5,3.1,-2.4,.56,6.1,paper);box(-4.1,.56,3.15,-2.5,.72,3.7,paper);box(-4.15,.56,5.4,-2.45,.66,6.05,mat('carpet',3));
  // The bench of lantern parts along the right wall: three glass chimneys, a coil of cable, the toolbox, loose fittings.
  box(1.5,.87,5.3,4.3,.95,6.5,wood);for(const [x,z] of [[1.6,5.4],[4.2,5.4],[1.6,6.4],[4.2,6.4]])box(x-.06,0,z-.06,x+.06,.87,z+.06,metal);box(1.5,.35,5.35,4.3,.42,6.45,wood);
  for(const x of [1.95,2.7,3.45])box(x-.12,.95,5.6,x+.12,1.26,5.85,mat('glass',1));for(const x of [1.95,2.7,3.45])box(x-.15,1.26,5.57,x+.15,1.3,5.88,metal);
  box(3.7,.95,6.0,4.2,1.12,6.4,mat('cable',0));box(3.75,.95,5.4,4.25,1.25,5.85,metal);box(1.7,.95,6.1,2.2,1.05,6.4,metal);box(2.4,.95,6.15,2.6,1.15,6.35,metal);
  for(const [x,z] of [[2.0,5.5],[3.2,5.6],[2.5,6.3]])box(x-.15,.42,z-.15,x+.15,.7,z+.15,metal);
  // The street beyond the window, four units down: the road, its lamps with their pools, the facades and the far rows.
  const cityStart=surfaces.length;
  quad([-40,0,8],[40,0,8],[40,0,80],[-40,0,80],mat('road',7),[0,1,0]);box(-8,.01,8,-4.8,.18,80,mat('paving'));box(4.8,.01,8,8,.18,80,mat('paving'));
  for(const [x,z] of [[-3,12],[3,20],[-3,28],[3,34]]){box(x-.055,.15,z-.055,x+.055,4.65,z+.055,metal);box(x-.34,4.15,z-.34,x+.34,4.7,z+.34,mat('lamp',2));box(x-.45,4.7,z-.45,x+.45,4.82,z+.45,metal);lamps.push([x,z]);}
  building(-14,20,10,8,8,4,17);building(4,20,10,8,8,0,11);building(-4,21,8,4,6,0,65);
  building(-18,32,12,8,14,4,23);building(6,32,12,8,13,0,29);building(-9,37,9,8,16,1,31);
  cityRow(44,72,12,-17,18);cityRow(44,72,12,7,18);
  for(let i=cityStart;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]-=4;surfaces[i].mat={...surfaces[i].mat,baseY:-4};}
  // The station clock: the tower's face lands at world y 7.55, nineteen degrees above the window camera.
  box(-2.2,2,21,2.2,11,25,{kind:'tower',hue:0,seed:71,baseY:-10});box(-2.45,8.9,20.75,2.45,9.3,25.25,mat('stone',6));box(-2.45,10.8,20.75,2.45,11.2,25.25,mat('stone',6));
 },
 start(){return look(-3,1.2,-1.6,-2.2,1.4,4);},
 shot(p){
  if(p==='loftEntry'){
   const a=look(-2.4,1.6,1.2,.5,1.2,4.5),b=look(-2,1.6,2,-2.9,2,7);
   return state.event<4?a:reduce?b:loftBlend(a,b,smooth(clamp((state.event-4)/3,0,1)));
  }
  if(p==='loftTable')return look(-2.9,1.7,.4,-1.2,1.1,5.2);
  if(p==='loftNote')return look(-.75,1.4,2.05,-.2,1.08,3);
  if(p==='loftBoard')return look(.9,1.7,3,3.5,1.9,7);
  const a=look(-.2,1.5,4.2,0,7.5,22),b=look(0,1.5,5.6,0,7.5,22);
  return reduce?b:loftBlend(a,b,smooth(clamp((state.event-1.5)/2.5,0,1)));
 },
 ease(p){return {loftEntry:4,loftTable:4,loftNote:4,loftBoard:5,loftLeave:4}[p]||1.5;},
 blocking(p){
  // Entry: in through the door and along the table to its far end, where he stands for the table beat. The note and the
  // window are Rook's own eyes (the camera stands where he does), the prints are read over his shoulder from the bench.
  const u=p==='loftEntry'&&!reduce?span(5):1;
  const rook=p==='loftEntry'?{x:mix(-2.7,-1.1,u),z:mix(1.9,5.2,u),pose:u<1?'walk':'watch'}:p==='loftTable'?{x:-1.1,z:5.2,pose:'watch'}:p==='loftNote'?null:p==='loftBoard'?{x:3.5,z:5,pose:'read'}:{x:1.1,z:6.4,pose:'watch'};
  return{rook,courier:null,others:[]};
 },
 geometry(){
  // The kettle is warm: two wisps of steam, drawn as thin surfaces so every mark is still a glyph.
  const t=state.t,s=Math.sin(t*1.7)*.1,r=Math.sin(t*2.3+1)*.08;
  quad([.62,1.34,3.4],[.78,1.34,3.4],[.78+s,1.74,3.42],[.62+s,1.74,3.42],mat('cable',6),[0,0,-1]);
  quad([.66+s,1.74,3.4],[.74+s,1.74,3.4],[.74+r,2.02,3.42],[.66+r,2.02,3.42],mat('cable',6),[0,0,-1]);
 },
 labels(p){
  if(p==='loftEntry')worldLabel([-2.15,1.9,-.2],'BELL',6);
  if(p==='loftBoard'){worldLabel([2.25,1.35,6.9],'FILAMENT',3);worldLabel([3.15,1.35,6.9],'BOARD VAN',4);worldLabel([4.05,1.35,6.9],'DIVISION',0);}
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
  // The deduction ladder: the first wrong answer costs a lamp and marks the misread; the second removes both wrong buttons.
  caption:()=>ladder.loft>=2?'Rook has now been wrong twice in a room with the answer pinned to the wall. The photographs are of the club, and the van is the Board\'s.':state.misread?'The depot and the station have nothing to hide; Bell would not photograph his own workplace. The club\'s back door and the Board\'s van are in the same frame. Rook has spent a rewind\'s worth of night getting it wrong.':'The photographs: a red car at a loading bay behind a neon sign, THE FILAMENT. A Lumen Board van. A man in a division coat who does not look at the camera. Where are the batteries going?',
  buttons:b=>{
   const wrong=()=>{ladder.loft++;if(!state.misread){state.misread=true;state.rewinds=Math.max(0,state.rewinds-1);}ui();};
   b('[UPTOWN, THROUGH THE FILAMENT]',()=>{addClue('Bell\'s photographs: reserve batteries leave by the Filament\'s back door into a Lumen Board van. The man in the division coat is Vale.');enter('loftLeave');});
   if(ladder.loft<2){b('[BACK TO THE LAMP DEPOT]',wrong);b('[INTO THE STATION VAULTS]',wrong);}
  }},
 loftLeave:{kind:'cutscene',title:'FIVE PAST MIDNIGHT',duration:4,next:'stationEntry',
  caption:()=>'Rook takes the photographs. Through the window, the station clock reads five past midnight. Bell\'s job is still open.'}
});
