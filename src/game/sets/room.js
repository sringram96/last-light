// 09 / NIGHT DIVISION, DAWN. The interrogation room next to Vale's own office, 05:50. Across the table: Vale if
// caught, Krane if pinned, Bell on the stay route, nobody otherwise. The evidence in a row under the lamp; the
// player decides who signed; the corridor window goes from grey to gold.
//
// Layout (x right, z into the room): the room is x -3.5..3.5, z 0..8 under a 3.6 ceiling; the corridor runs from
// z 0 back to the end wall at z -13, where the window sits on the corridor's axis. The door gap is x -2..-.4, so
// the last camera, seated at the mirror end of the table beside the sitter, looks past Rook through the door to
// the window. Seated figures sink below the floor (y -.55) so the table hides their legs; Bell has a real sit pose.
function roomSitter(){return state.caught?'vale':kranePinned()&&!state.caught?'krane':state.pursuit==='stay'?'bell':'';}
// The camera glides between two looks inside one beat: a blend of camera fields by u.
const roomBlend=(a,b,u)=>({x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),z:mix(a.z,b.z,u),yaw:mix(a.yaw,b.yaw,u),pitch:mix(a.pitch,b.pitch,u)});
// The sitter's lean resets after a wrong pick and comes back two seconds later; the pick is not a state field.
let roomPickSeen='',roomPickAt=0;
registerSet('room',{
 chapter:'09 / NIGHT DIVISION',card:'INTERROGATION',objective:()=>'WHO SIGNED',
 description:'A small interrogation room: a metal table under one lamp, two chairs, a one-way mirror, a recorder, and through the open door a corridor whose end window is going from grey to gold.',
 build(){
  // Room shell: concrete floor with the centre seam, brick walls, the ceiling over room and corridor alike.
  floor(-3.5,0,3.5,8,0,'drain',7);wall(-3.5,8,-3.5,0,3.6,'brick',0);wall(3.5,0,3.5,8,3.6,'brick',0);wall(3.5,8,-3.5,8,3.6,'brick',0);
  quad([-4,3.6,-13],[4,3.6,-13],[4,3.6,8],[-4,3.6,8],mat('ceiling'),[0,-1,0]);
  // Front wall with the door gap x -2..-.4, a metal frame, and the door hinged open flat against the corridor face.
  box(-3.5,0,-.15,-2,3.6,.15,mat('brick',0));box(-.4,0,-.15,3.5,3.6,.15,mat('brick',0));box(-2,3.2,-.15,-.4,3.6,.15,mat('brick',0));
  for(const x of [-2.08,-.4])box(x,0,-.2,x+.08,3.28,.2,mat('metal'));box(-2.08,3.2,-.2,-.32,3.28,.2,mat('metal'));
  box(-3.62,0,-.3,-2.06,3.15,-.18,mat('door',2));
  // Corridor: floor, walls, ceiling beams every two units, a conduit pair overhead and a skirting run on each wall.
  floor(-4,-13,4,0,0,'drain',7);wall(-4,0,-4,-13,3.6,'brick',0);wall(4,-13,4,0,3.6,'brick',0);
  for(let z=-12;z<0;z+=2)box(-4,3.35,z-.12,4,3.6,z+.12,mat('metal'));
  for(const x of [-2.6,2.6])box(x-.08,3.2,-13,x+.08,3.34,-.2,mat('metal'));
  for(const x of [-4,3.85])box(x,.3,-13,x+.15,.45,-.2,mat('metal'));
  // Doors along the corridor: Vale's, dark, on the left wall by the room; two more further down; a bench and a notice board.
  box(-4,0,-3.2,-3.95,3.1,-.8,mat('hatch'));box(-4.02,3.1,-3.3,-3.93,3.25,-.7,mat('metal'));box(-3.97,2.2,-2.2,-3.94,2.45,-1.8,mat('paper',6));
  box(-4,0,-8.4,-3.95,3.1,-6,mat('hatch'));box(-4.02,3.1,-8.5,-3.93,3.25,-5.9,mat('metal'));
  box(3.95,0,-6.6,4,3.1,-4.2,mat('hatch'));box(3.93,3.1,-6.7,4.02,3.25,-4.1,mat('metal'));box(3.95,0,-11.8,4,3.1,-9.4,mat('hatch'));
  box(3.4,.5,-3.4,3.95,.62,-1.2,mat('wood',2));for(const z of [-3.2,-1.4])box(3.5,0,z-.06,3.9,.5,z+.06,mat('metal'));
  box(3.94,1.4,-9,3.97,2.5,-7,mat('board',2));
  // The corridor's end wall and window: brick around a 3 x 2 opening, a metal frame and two bars, a radiator under it.
  box(-4,0,-13,-1.5,3.6,-12.9,mat('brick',0));box(1.5,0,-13,4,3.6,-12.9,mat('brick',0));box(-1.5,0,-13,1.5,1,-12.9,mat('brick',0));box(-1.5,3,-13,1.5,3.6,-12.9,mat('brick',0));
  box(-1.6,.94,-13.05,1.6,1.06,-12.8,mat('metal'));box(-1.6,2.94,-13.05,1.6,3.06,-12.85,mat('metal'));for(const x of [-1.6,1.52])box(x,1,-13.05,x+.08,3,-12.85,mat('metal'));
  for(const x of [-.55,.45])box(x,1,-13.02,x+.1,3,-12.9,mat('metal'));
  box(-1.2,.15,-12.9,1.2,.85,-12.7,mat('grate'));
  // Beyond the window: the roofline of the block across the yard, then the sky. The sky quad's normal points up so it
  // takes the lamp-less top light and reads gold when state.dawn reaches 1.
  box(-1.4,-3,-14.4,-.1,1.25,-13.7,mat('brick',4));box(-1.5,1.25,-14.5,0,1.4,-13.6,mat('stone',0));box(.3,-3,-14.4,1.6,1.15,-13.7,mat('brick',4));box(.2,1.15,-14.5,1.7,1.3,-13.6,mat('stone',0));
  box(-.95,1.4,-14.2,-.75,2.05,-13.95,mat('metal'));box(.75,1.3,-14.25,1.25,1.75,-13.85,mat('metal'));
  quad([-9,-4,-14.7],[9,-4,-14.7],[9,9,-14.7],[-9,9,-14.7],mat('dawn',4),[0,1,0]);
  // The table on four legs, two chairs, Rook's coat over the back of his, his file at the near edge.
  box(-2.1,.9,3.4,.3,.98,4.6,mat('metal'));for(const [x,z] of [[-2,3.5],[.2,3.5],[-2,4.5],[.2,4.5]])box(x-.05,0,z-.05,x+.05,.9,z+.05,mat('metal'));
  box(-1.8,.5,2.3,-1,.55,2.7,mat('metal'));box(-1.8,.55,2.24,-1,1.2,2.3,mat('metal'));for(const [x,z] of [[-1.75,2.35],[-1.05,2.35],[-1.75,2.65],[-1.05,2.65]])box(x-.03,0,z-.03,x+.03,.5,z+.03,mat('metal'));
  box(-1.85,.6,2.16,-.95,1.28,2.36,mat('wood',2));
  box(-1.3,.5,5.3,-.5,.55,5.7,mat('metal'));box(-1.3,.55,5.7,-.5,1.2,5.76,mat('metal'));for(const [x,z] of [[-1.25,5.35],[-.55,5.35],[-1.25,5.65],[-.55,5.65]])box(x-.03,0,z-.03,x+.03,.5,z+.03,mat('metal'));
  box(-1.75,.98,3.45,-1.05,1.02,3.7,mat('paper',6));
  // The one-way mirror on the left wall, framed, and the recorder on a shelf beside it.
  box(-3.46,1.1,2,-3.4,2.6,6,mat('glass',0));box(-3.5,1.04,1.94,-3.38,1.12,6.06,mat('metal'));box(-3.5,2.58,1.94,-3.38,2.66,6.06,mat('metal'));for(const z of [1.94,6])box(-3.5,1.04,z,-3.38,2.66,z+.06,mat('metal'));
  box(-3.48,1.15,6.3,-3.05,1.22,7,mat('metal'));box(-3.44,1.22,6.35,-3.12,1.62,6.95,mat('screen',1));
  // The right wall: a pin board of division notices and a radiator; the back corner: a file cabinet with its drawers.
  box(3.4,1.3,1.4,3.5,2.5,4.6,mat('board',2));box(3.44,2.5,1.3,3.5,2.58,4.7,mat('metal'));
  box(3.3,.15,5.4,3.5,.9,7.4,mat('grate'));
  box(2.2,0,7,3.4,2.1,7.95,mat('metal'));for(let y=.25;y<2;y+=.6)box(2.3,y,6.96,3.3,y+.42,7.02,mat('paper',6));
  box(-3.5,3.3,7.2,3.5,3.6,7.5,mat('metal'));
  // The one lamp: a low shade over the table centre; the only pool in the set.
  pendant(-.9,4,3.3);
 },
 start(){return look(-1.2,1.7,-6.5,-1,1.2,5);},
 shot(p){
  if(p==='roomEntry'){
   // Through the door for four seconds, then up over Rook's shoulder to the sitter under the lamp.
   const a=look(-1.1,1.6,-2.4,-1,1.1,5),b=look(-1.3,2.75,.4,-.95,1.25,5.3);
   return roomBlend(a,b,smooth(clamp((state.event-4)/3,0,1)));
  }
  if(p==='roomDeduce')return look(-.7,2.3,2,-.9,.95,4.1);
  // The last camera of the case: seated at the mirror end of the table, looking past Rook, through the door, to the window.
  return look(-2.2,1.5,5.4,-1,1.7,-13);
 },
 ease(p){return {roomEntry:4,roomDeduce:5,roomName:6}[p]||1.5;},
 blocking(p){
  const others=[],who=roomSitter(),proof=proofHeld();
  if(p!=='roomDeduce'){roomPickSeen='';roomPickAt=0;}
  else if(state.roomPick&&state.roomPick!==roomPickSeen){roomPickSeen=state.roomPick;roomPickAt=state.event;}
  // The tell: with proof on the table the sitter leans away from the ledger and the manifest; nobody leans without it.
  const back=roomPickSeen?smooth(clamp((state.event-roomPickAt-2)/.8,0,1)):1;
  const lean=p==='roomDeduce'&&proof?.25*back:0;
  if(who)others.push(who==='bell'?{x:-.9,y:.45,z:5.3,pose:'sit',who,lean}:{x:-.9,y:-.55,z:5.3,pose:'stand',who,lean});
  return{rook:{x:-1.4,y:-.55,z:2.7,pose:'read'},courier:null,others};
 },
 geometry(p){
  state.dawn=p==='roomEntry'?.35:p==='roomDeduce'?.6:p==='roomName'?mix(.6,1,clamp((state.event-2)/4,0,1)):.35;
  // On the table, left to right under the lamp, only what the route recovered; the desk order always.
  if(ledgerHeld())box(-2.05,.98,3.8,-1.45,1.04,4.2,mat('dispatch',6));
  if(manifestHeld())box(-1.38,.98,3.78,-1.03,1.01,4.23,mat('paper',6));
  if(chipHeld())box(-.76,.98,3.84,-.64,1.1,3.96,mat('lamp',2));
  box(-.45,.98,3.82,.05,1,4.17,mat('paper',6));
  const who=roomSitter();
  if(who==='krane')box(-.7,.1,5.1,-.4,.85,5.4,mat('metal'));
  if(who==='bell'){box(-1.25,.9,5.2,-1.1,1.32,5.46,mat('paper',6));box(-.7,.9,5.2,-.55,1.32,5.46,mat('paper',6));box(-1.25,.9,5.4,-.55,1.36,5.5,mat('paper',6));}
 },
 labels(p){
  const who=roomSitter();
  if(p==='roomEntry'){
   worldLabel([-1.2,3.5,-.25],'INTERVIEW 2',1);worldLabel([-3.9,3.45,-2],'VALE',0);
   if(who)worldLabel([-.9,2.05,5.3],who==='vale'?'VALE':who==='krane'?'KRANE':'BELL',who==='vale'?3:who==='krane'?0:2);
  }
  if(p==='roomDeduce'){if(ledgerHeld())worldLabel([-1.75,1.35,4],'LEDGER',6);if(manifestHeld())worldLabel([-1.2,1.6,4],'MANIFEST',6);if(chipHeld())worldLabel([-.7,1.35,3.9],'CHIP',6);worldLabel([-.2,1.6,4],'ORDER 7731',6);}
 },
 exit(){return [-1.2,1.3,-.2];},
 preview(){Object.assign(state,{pursuit:'ramp',tunnel:'right',caught:true,hall:'breaker',club:'vault'});return 'roomEntry';}
});
registerPhases('room',{
 roomEntry:{kind:'cutscene',title:'09 / NIGHT DIVISION, DAWN',duration:7,next:'roomDeduce',
  caption:()=>{const who=roomSitter();return who==='vale'?'Night Division, 05:50. Vale sits across the table in the room next to his own office. He has asked for nothing. He is waiting to see what Rook has.':who==='krane'?'Night Division, 05:50. Krane sits across the table with his leg in a splint and a division sergeant\'s card in his wallet. He worked here too. He is waiting to see what Rook has.':who==='bell'?'Night Division, 05:50. Bell gives his statement across the table with the medic\'s blanket still on his shoulders. Nobody has gone to Vale\'s office yet. Rook has what Bell knows and what the desk order says.':'Night Division, 05:50. The room is empty except for Rook and the file. Vale\'s office across the corridor is dark and has been cleared out.';}},
 roomDeduce:{kind:'quiet',title:'WHO SIGNED THE ORDER?',
  caption:()=>{
   const proof=proofHeld(),pick=state.roomPick;
   if(!pick)return proof?'Order 7731. Rook lays out what he has. Vale\'s name is on every page, and there is a second hand on the paper. Who signed the order?':'Order 7731. Rook lays out what he has: Bell\'s word, the desk order, what he saw in the hall. Vale\'s name is on the order. Who signed it?';
   if(pick==='alone')return proof?'Vale almost smiles. Rook has shown his hand. The initials on every ledger page and the name on the manifest are the same: H. ASHE. Vale does not run the Board; the Board runs Vale.':'Vale almost smiles; the empty chair would too. A liaison does not commission reserve transfers. Somebody above him did, and Rook cannot yet say who.';
   if(pick==='above')return 'Rook believes it, and he cannot show it. The ledger is at the bottom of Pump Room 4 and the manifest is ash. Say what the paper says, not what Rook knows.';
   return 'There is enough. Rook looks again at the initials under Vale\'s signature, page after page: H.A. The manifest spells them out. Rook knows who signed.';
  },
  buttons:b=>{
   const proof=proofHeld();
   const pick=(id,right)=>()=>{if(right){enter('roomName');return;}if(!state.slip)state.slip=true;state.roomPick=id;ui();};
   b('[VALE SIGNED ALONE]',pick('alone',false));b('[SOMEONE ABOVE VALE SIGNED]',pick('above',proof));b('[NOT ENOUGH TO SAY]',pick('short',!proof));
  }},
 roomName:{kind:'quiet',title:'THE WARRANT',
  enter:()=>{addClue(proofHeld()?'Deduction: order 7731 was commissioned by Halden Ashe, Lumen Board Commissioner of Reserve. Vale signed for him. The warrant names both.':'Deduction: Vale signed for someone on the Board. Without the ledger or the manifest, the case file cannot name who.');},
  caption:()=>{
   const proof=proofHeld();
   if(proof&&state.caught)return '"Halden Ashe," Rook says, and for the first time Vale looks at the door instead of at Rook. Rook writes the name on the warrant under Vale\'s.';
   if(proof)return 'Rook writes the name on the warrant: Halden Ashe, Commissioner of Reserve, and under it Aurel Vale. Two men to find. The paper will outlast the night.';
   if(state.caught)return 'Vale says nothing, which is what his lawyer will tell him to say. Rook has Bell\'s word and Vale in the chair. The name above Vale stays off the paper for now.';
   if(kranePinned())return 'Krane says the Board\'s man never came to the hall in person and he never learned a name. Rook believes him. Vale\'s name goes on the warrant alone, for now.';
   if(state.pursuit==='stay')return 'Bell signs his statement. Vale\'s name goes on the warrant on Bell\'s word and the desk order. Whoever is above Vale will have to wait for daylight.';
   return 'Rook closes the file on Vale\'s name and a blank line under it. The batteries are gone, the hall is burned, and the man who signed for them is still a set of initials.';
  },
  buttons:b=>{b('[GO TO BELL]',()=>enter('canalEntry'));}}
});
