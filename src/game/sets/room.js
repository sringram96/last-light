// 09 / NIGHT DIVISION, DAWN. The interrogation room next to Vale's own office, 05:50. Across the table: Vale if
// caught, Krane if pinned, Bell on the stay route, nobody otherwise. The evidence in a row under the lamp; the
// player decides who signed; the corridor window goes from grey to gold.
function roomSitter(){return state.caught?'vale':kranePinned()&&!state.caught?'krane':state.pursuit==='stay'?'bell':'';}
registerSet('room',{
 chapter:'09 / NIGHT DIVISION',card:'INTERROGATION',objective:()=>'WHO SIGNED',
 description:'A small interrogation room: a metal table under one lamp, two chairs, a one-way mirror, a recorder, and through the open door a corridor whose end window is going from grey to gold.',
 build(){
  floor(-3.5,0,3.5,8,0,'drain',7);wall(-3.5,8,-3.5,0,3.6,'brick',0);wall(3.5,0,3.5,8,3.6,'brick',0);wall(3.5,8,-3.5,8,3.6,'brick',0);
  box(-3.5,0,-.15,-1.2,3.6,.15,mat('brick',0));box(.4,0,-.15,3.5,3.6,.15,mat('brick',0));box(-1.2,3.2,-.15,.4,3.6,.15,mat('brick',0));box(-1.25,0,-.6,-1.1,3.2,-.2,mat('door',2));
  quad([-4,3.6,-13],[4,3.6,-13],[4,3.6,8],[-4,3.6,8],mat('ceiling'),[0,-1,0]);
  floor(-4,-13,4,0,0,'drain',7);wall(-4,0,-4,-13,3.6,'brick',0);wall(4,-13,4,0,3.6,'brick',0);
  box(-4,0,-13,-1.2,3.6,-12.9,mat('brick',0));box(1.2,0,-13,4,3.6,-12.9,mat('brick',0));box(-1.2,0,-13,1.2,1,-12.9,mat('brick',0));box(-1.2,3,-13,1.2,3.6,-12.9,mat('brick',0));
  box(-1.3,.95,-13.05,1.3,1.05,-12.85,mat('metal'));box(-1.3,2.95,-13.05,1.3,3.05,-12.85,mat('metal'));for(const x of [-.4,.4])box(x-.04,1,-13.02,x+.04,3,-12.88,mat('metal'));
  quad([-6,-1,-13.4],[6,-1,-13.4],[6,8,-13.4],[-6,8,-13.4],mat('dawn',4),[0,0,1]);
  box(3.95,0,-8,4,3.2,-5.6,mat('hatch'));
  box(-1.2,.9,3.4,1.2,.98,4.6,mat('metal'));for(const [x,z] of [[-1.1,3.5],[1.1,3.5],[-1.1,4.5],[1.1,4.5]])box(x-.05,0,z-.05,x+.05,.9,z+.05,mat('metal'));
  for(const z of [2.6,5.4]){box(-.4,.5,z-.2,.4,.55,z+.2,mat('metal'));box(-.4,.55,z+(z<4?-.2:.15),.4,1.2,z+(z<4?-.15:.2),mat('metal'));}
  box(-.45,.6,2.35,.45,1.25,2.45,mat('wood',2));
  box(-3.45,1.1,2,-3.4,2.6,6,mat('glass',0));box(-3.5,1.05,1.95,-3.38,1.12,6.05,mat('metal'));box(-3.5,2.58,1.95,-3.38,2.65,6.05,mat('metal'));
  box(-3.45,1.2,6.4,-3.2,1.6,6.9,mat('screen',1));
  pendant(0,4,2.6);
  box(-.5,.98,2.05,.5,1.02,2.4,mat('paper',6));
 },
 start(){return look(-.4,1.7,-5,-.2,1.2,5);},
 shot(p){
  if(p==='roomEntry')return state.event<4?look(-.3,1.6,-2.4,-.2,1.1,5):look(-.3,1.6,.8,0,1.1,5.2);
  if(p==='roomDeduce')return look(.2,2.3,2,0,.95,4.1);
  return look(.6,1.4,6.4,-.2,1.5,-13);
 },
 ease(p){return {roomEntry:4,roomDeduce:5,roomName:6}[p]||1.5;},
 blocking(p){
  const others=[],who=roomSitter();
  const proof=proofHeld(),lean=p==='roomDeduce'&&proof&&!state.roomPick?.25:0;
  if(who)others.push({x:0,y:-.9,z:5.3,pose:who==='bell'?'sit':'stand',who,lean});
  return{rook:{x:0,y:-.9,z:2.7,pose:'read'},courier:null,others};
 },
 geometry(p){
  state.dawn=p==='roomEntry'?.35:p==='roomDeduce'?.6:p==='roomName'?mix(.6,1,clamp((state.event-2)/4,0,1)):.35;
  if(ledgerHeld())box(-1.15,.98,3.8,-.55,1.04,4.2,mat('dispatch',6));
  if(manifestHeld())box(-.45,.98,3.78,-.1,1.01,4.23,mat('paper',6));
  if(chipHeld())box(.14,.98,3.84,.26,1.1,3.96,mat('lamp',2));
  box(.45,.98,3.82,.95,1,4.17,mat('paper',6));
  if(roomSitter()==='krane')box(.2,.1,5.1,.5,.9,5.5,mat('metal'));
 },
 labels(p){
  const who=roomSitter();
  if(p==='roomEntry'){worldLabel([-.4,3.4,-.2],'INTERVIEW 2',1);worldLabel([3.9,3.5,-6.8],'VALE',0);}
  if(who&&p!=='roomDeduce')worldLabel([0,1.9,5.3],who==='vale'?'VALE':who==='krane'?'KRANE':'BELL',who==='vale'?3:who==='krane'?0:2);
  if(p==='roomDeduce'){if(ledgerHeld())worldLabel([-.85,1.35,4],'LEDGER',6);if(manifestHeld())worldLabel([-.28,1.6,4],'MANIFEST',6);if(chipHeld())worldLabel([.2,1.35,3.9],'CHIP',6);worldLabel([.7,1.6,4],'ORDER 7731',6);}
 },
 exit(){return [-.4,1.3,-.2];},
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
