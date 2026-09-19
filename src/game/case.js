const caseTitles={officeEntry:'00 / NIGHT DIVISION',officeFile:'THE BELL FILE',officeWindow:'RAIN ON THE GLASS',stationEntry:'02 / NORTH STATION',stationQuiet:'THE DESK IS STILL WARM',stationListen:'READING THE MAINTENANCE TAPE',stationReady:'A USEFUL PRECAUTION',pumpEntry:'03 / PUMP ROOM 4',pumpFind:'BELL IS ALIVE',pumpDanger:'THE PIPE IS GIVING WAY',pumpQte:'THE WATER IS RISING',pumpResult:'OUT OF THE WATER',pumpTruth:'WHY BELL DISAPPEARED',roofEntry:'04 / ABOVE THE CITY',roofQuiet:'A MOMENT TO BREATHE',roofListen:'LISTENING TO THE BAND',roofSignal:'A VOICE IN THE STATIC',roofConfession:'THE FORGED ORDER',clubEntry:'05 / THE FILAMENT',clubFace:'VALE SEES ROOK',clubQte:'THE BOTTLE',clubResult:'THE BACK DOOR',chaseEntry:'06 / THE ELEVATED ROAD',chaseQteA:'FREIGHT IN YOUR LANE',chaseBank:'UNDER THE SIGNAL GANTRIES',chaseQteB:'THE BRIDGE IS LIFTING',chaseFinish:'ONE LAST TURN',tunnelEntry:'07 / THE UNDERCITY',tunnelQte:'THE DRAIN FORKS',tunnelFinish:'OUT OF THE DARK',canalEntry:'08 / FIRST LIGHT',canalEnd:'CASE CLOSED'};
const liveCase=['officeEntry','officeFile','officeWindow','stationEntry','pumpEntry','pumpDanger','pumpResult','roofEntry','clubEntry','clubFace','clubResult','chaseEntry','chaseBank','chaseFinish','tunnelEntry','tunnelFinish','canalEntry'];
const qtePhases=['qte','pumpQte','clubQte','chaseQteA','chaseQteB','tunnelQte'];
function isQte(){return qtePhases.includes(state.phase);}
function caseDuration(){
 const p=state.phase;
 if(p==='pumpQte')return state.decoded?9:7;
 if(p==='clubQte')return 7;
 if(p==='tunnelQte')return state.radio?9:7;
 if(p.startsWith('chase'))return Math.max(5,(state.radio?9:7)-(state.club==='late'?2:0));
 return qteDuration();
}
function caseEnter(phase){
 const name=sceneFor(phase);
 if(setScene(name)){Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};}
 state.phaseDistance=state.distance;
 if(phase==='tunnelQte')tunnelFork=state.distance+30;
 if(phase==='stationReady'){state.decoded=true;addClue('The maintenance tape says: close the INLET wheel before pulling someone off the flooded platform.');}
 if(phase==='pumpTruth'){
  addClue('Bell identifies Inspector Vale: Vale sold the emergency batteries, then locked Bell in the pump room to silence him.');
  addClue(state.rescue==='valve'?'Recovered: Vale\'s signed battery-transfer ledger, dry and legible.':'The flooded ledger is unreadable. Bell can testify, but the written proof is lost.');
 }
 if(phase==='roofSignal'){state.radio=true;addClue('Radio traffic: Vale is heading for the lifting bridge. The lower service ramp reaches the canal first.');}
 if(phase==='roofConfession'){state.twist=true;addClue('Nell admits forging the maintenance order to bring Bell here and expose Vale. Nell did not foresee the trap.');}
 if(phase==='clubResult'&&state.club==='vault')addClue('A Filament casino chip from Vale\'s case, stamped with the reserve-battery lot numbers. The club launders the sales.');
 if(phase==='canalEnd')state.endingSeen=true;
}
function react(move){state.reaction=move==='late'||move==='missed'?0:state.event;}
function rescue(move){if(state.phase!=='pumpQte'||state.paused)return;react(move);state.rescue=move;enter('pumpResult');}
function clubChoice(move){if(state.phase!=='clubQte'||state.paused)return;react(move);state.club=move;enter('clubResult');}
function chaseChoice(move){
 if(state.paused)return;
 if(state.phase==='chaseQteA'){react(move);state.firstMove=move;state.gap=move==='dodge'?0:move==='brake'?1:2;enter('chaseBank');}
 else if(state.phase==='chaseQteB'){
  react(move);state.pursuit=move;
  if(move==='ramp'){state.caught=false;enter('tunnelEntry');return;}
  state.caught=move==='jump'&&state.gap===0;enter('chaseFinish');
 }
}
function tunnelChoice(move){
 if(state.phase!=='tunnelQte'||state.paused)return;
 react(move);state.tunnel=move;
 // Following keeps Vale only when he is close; the shortcut needs the bridge operator's tip about the canal.
 state.caught=move==='right'?state.gap<=1:move==='left'?state.radio:false;
 enter('tunnelFinish');
}
function pursuit(){state.gap=0;state.caught=false;state.pursuit='chasing';enter('clubEntry');}
function startChase(){state.distance=20;state.phaseDistance=20;enter('chaseEntry');}
function stayWithBell(){state.pursuit='stay';state.caught=false;enter('canalEntry');}
function caseAdvance(dt){
 const p=state.phase,e=state.event;
 if(moving()&&!reduce&&!(isQte()&&state.untimed))state.distance+=dt*(isQte()?1.6:/Finish/.test(p)?13:21);
 const done=(s)=>e>=(reduce&&s>2?1:s);
 if(p==='officeEntry'&&done(8))enter('officeFile');
 else if(p==='officeFile'&&done(5))enter('officeWindow');
 else if(p==='officeWindow'&&done(6))enter('brief');
 else if(p==='stationEntry'&&done(7))enter('stationQuiet');
 else if(p==='stationListen'&&e>=8)enter('stationReady');
 else if(p==='pumpEntry'&&done(6))enter('pumpFind');
 else if(p==='pumpDanger'&&e>=2)enter('pumpQte');
 else if(p==='pumpQte'&&!state.untimed&&e>=caseDuration())rescue('late');
 else if(p==='pumpResult'&&done(4))enter('pumpTruth');
 else if(p==='roofEntry'&&done(8))enter('roofQuiet');
 else if(p==='roofListen'&&e>=8)enter('roofSignal');
 else if(p==='clubEntry'&&done(8))enter('clubFace');
 else if(p==='clubFace'&&e>=2)enter('clubQte');
 else if(p==='clubQte'&&!state.untimed&&e>=caseDuration())clubChoice('late');
 else if(p==='clubResult'&&done(4))startChase();
 else if(p==='chaseEntry'&&done(6))enter('chaseQteA');
 else if(p==='chaseQteA'&&!state.untimed&&e>=caseDuration())chaseChoice('late');
 else if(p==='chaseBank'&&done(6))enter('chaseQteB');
 else if(p==='chaseQteB'&&!state.untimed&&e>=caseDuration())chaseChoice('late');
 else if(p==='chaseFinish'&&done(6))enter('canalEntry');
 else if(p==='tunnelEntry'&&done(6))enter('tunnelQte');
 else if(p==='tunnelQte'&&!state.untimed&&e>=caseDuration())tunnelChoice('late');
 else if(p==='tunnelFinish'&&done(6))enter('canalEntry');
 else if(p==='canalEntry'&&done(7))enter('canalEnd');
}
function roofActions(){
 if(!state.radio)button('[LISTEN TO THE RADIO / 8s]',()=>enter('roofListen'));
 button('[PURSUE VALE]',pursuit);button('[STAY WITH BELL]',stayWithBell);
}
function caseUI(){
 el.phase.textContent=caseTitles[state.phase]||'THE LAST LIGHT';
 switch(state.phase){
 case 'officeEntry':el.caption.textContent='Night Division, 23:40. Nine days of rain. Rook\'s desk lamp is the only light still burning on the floor.';button('[SKIP INTRO]',()=>enter('brief'));break;
 case 'officeFile':el.caption.textContent='The file: IVO BELL, lamplighter, missing four nights. Last seen at the closed North Station. Attached, a report that someone is walking his route with his lantern.';button('[SKIP INTRO]',()=>enter('brief'));break;
 case 'officeWindow':el.caption.textContent='Rook takes his coat. Below the window the city runs on power it cannot account for, and one street on the lamplighter\'s route has gone dark.';button('[SKIP INTRO]',()=>enter('brief'));break;
 case 'stationEntry':el.caption.textContent=state.choice==='person'?'Nell opens the service door with three taps. Footsteps echo through the empty concourse.':'The service latch gives under Rook\'s shoulder. Inside, a maintenance desk glows in an otherwise empty station.';break;
 case 'stationQuiet':
  el.caption.textContent='A fresh order is stamped "INSPECTOR VALE / RESERVE BATTERIES." A maintenance tape is still turning. Below the floor, someone strikes a pipe.';
  button('[READ THE TAPE / 8s]',()=>enter('stationListen'));button('[FOLLOW THE KNOCKING]',()=>enter('pumpEntry'));break;
 case 'stationListen':el.caption.textContent='Rook feeds the tape through its reader. Rain ticks against the roof glass. The knocking below continues.';break;
 case 'stationReady':
  el.caption.textContent='The tape warns: "FLOOD RESCUE: CLOSE INLET FIRST." Rook knows which wheel to reach for. Extra reaction time earned.';
  button('[FOLLOW THE KNOCKING]',()=>enter('pumpEntry'));break;
 case 'pumpEntry':el.caption.textContent='Under the station, pumps tower above black water. A man on the far platform is tapping a wrench against a pipe.';break;
 case 'pumpFind':
  el.caption.textContent='Bell: "Vale took the reserve batteries. I found his ledger, so he locked me down here. That pipe will not hold much longer."';
  button('[GET BELL OUT]',()=>enter('pumpDanger'));break;
 case 'pumpDanger':el.caption.textContent='A joint splits. Water surges beneath the platform. The INLET wheel is beside Rook; Bell is reaching out. Get ready.';break;
 case 'pumpQte':
  el.caption.textContent=state.decoded?'The tape said to close the inlet first. Shut off the flood, or pull Bell out immediately.':'Water is climbing. Close the INLET wheel, or pull Bell away from the collapsing platform.';
  button('[1] CLOSE THE INLET',()=>rescue('valve'));button('[2] PULL BELL OUT',()=>rescue('pull'));break;
 case 'pumpResult':
  el.caption.textContent=state.rescue==='valve'?'Rook shuts the inlet, then helps Bell across. His satchel stays above the water.':state.rescue==='pull'?'Rook pulls Bell onto the walkway. His satchel drops into the torrent.':state.choice==='person'?'Nell throws a line. Rook and Nell haul Bell clear, but the water takes his satchel.':'Bell leaps as the platform breaks. Rook catches his sleeve. His satchel vanishes into the flood.';break;
 case 'pumpTruth':
  el.caption.textContent=state.rescue==='valve'?'The dry ledger bears Vale\'s signature: the city\'s emergency batteries were sold. Bell caught the theft. The locked room was meant to silence him.':'Bell: "Vale sold the emergency batteries. When I confronted him, he locked me in. The proof was in that satchel. I will say it in court."';
  button('[TAKE BELL TO THE ROOF]',()=>enter('roofEntry'));break;
 case 'roofEntry':el.caption.textContent='Rook brings Bell up the service stair. The city opens beneath them. Flying traffic passes between the towers; a medic answers the roof radio.';break;
 case 'roofQuiet':
  el.caption.textContent='Bell is safe with the medic. Far below, Vale\'s red car pulls up outside The Filament, the club across the street. A patrol car waits at the service lift. There is still time to go after him.';
  roofActions();break;
 case 'roofListen':el.caption.textContent='Rook waits on the open channel. Traffic slides through the rain. A bridge operator comes through the static.';break;
 case 'roofSignal':
  el.caption.textContent=state.choice==='person'?'Radio: "Bridge lifting at the half hour. Lower service ramp is clear to the canal." Beside the receiver, Nell goes quiet. "There is something about Bell\'s work order I should tell you."':'Radio: "Bridge lifting at the half hour. Lower service ramp is clear to the canal." Rook now knows a way to intercept Vale and has extra time at every turn.';
  if(state.choice==='person')button('[ASK NELL ABOUT THE ORDER]',()=>enter('roofConfession'));
  roofActions();break;
 case 'roofConfession':
  el.caption.textContent='Nell: "I forged the maintenance call. Bell was the only person who could prove the batteries were missing. I wanted Vale exposed. I did not know he would trap him." Rook records the confession.';
  roofActions();break;
 case 'clubEntry':el.caption.textContent='Vale\'s red car sits outside The Filament. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up.';break;
 case 'clubFace':el.caption.textContent='Vale is in the back booth. He sees Rook. His bodyguard rises, and a bottle leaves his hand. Get ready.';break;
 case 'clubQte':
  el.caption.textContent='Duck under the bottle, or go over the bar and cut the bodyguard off before Vale reaches the back door.';
  button('[1] DUCK',()=>clubChoice('duck'));button('[2] VAULT THE BAR',()=>clubChoice('vault'));break;
 case 'clubResult':
  el.caption.textContent=state.club==='duck'?'The bottle bursts on the neon behind Rook. Vale is already through the back door and into his car.':state.club==='vault'?'Rook goes over the bar and lands between the bodyguard and the booth. Vale\'s chip case spills across the table. Rook pockets one chip and follows him out.':'The bottle catches Rook\'s shoulder. He is up in a second, but Vale has the back door and a head start.';break;
 case 'chaseEntry':el.caption.textContent='Rook takes the patrol car. Vale\'s red tail lights race ahead. The empty street gives way to dense elevated traffic.';break;
 case 'chaseQteA':
  el.caption.textContent='A freight carrier swings into Rook\'s lane. The right lane is clear. Brake and lose ground, or dive right to stay close.';
  button('[1] BRAKE',()=>chaseChoice('brake'));button('[2] DIVE RIGHT',()=>chaseChoice('dodge'));break;
 case 'chaseBank':el.caption.textContent=state.firstMove==='dodge'?'Rook swings right and surges past the carrier. Vale is still within reach.':state.firstMove==='brake'?'The patrol car falls back under braking. Rook needs an interception route.':'The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.';break;
 case 'chaseQteB':
  el.caption.textContent=(state.radio?'The radio marked the lower ramp as clear. ':'The bridge ahead is lifting. ')+(state.gap===0?'Rook is close enough to follow Vale over the gap, or drop down the ramp into the storm drains.':'Vale is too far ahead for a safe jump. The lower service ramp into the storm drains is Rook\'s best chance.');
  button('[1] TAKE THE LOWER RAMP',()=>chaseChoice('ramp'));button('[2] FOLLOW OVER THE GAP',()=>chaseChoice('jump'));break;
 case 'chaseFinish':
  el.caption.textContent=state.caught?'The patrol car clears the gap. Rook forces Vale to stop at the canal exit.':state.pursuit==='late'?'Rook brakes at the rising bridge. Vale disappears into the towers.':'The gap is already too wide. Rook aborts the jump and brakes hard. Vale gets away.';break;
 case 'tunnelEntry':el.caption.textContent='The service ramp drops below the road into the storm drains. Vale\'s tail lights bounce off wet brick, and the sound of two engines fills the tunnel.';break;
 case 'tunnelQte':
  el.caption.textContent=(state.radio?'The bridge operator said the maintenance channel reaches the canal first. ':'')+'The drain forks ahead. Vale takes the right branch under the canal gate.';
  button('[1] FOLLOW RIGHT',()=>tunnelChoice('right'));button('[2] CUT LEFT',()=>tunnelChoice('left'));break;
 case 'tunnelFinish':
  el.caption.textContent=state.caught?(state.tunnel==='left'?'Rook takes the maintenance channel and bursts out of the canal outfall ahead of Vale. The red car stops with nowhere left to go.':'Rook stays on Vale\'s lights through the right branch and forces him against the canal gate.'):state.tunnel==='late'?'Rook brakes at the fork. Both branches are dark. Vale is gone.':state.tunnel==='left'?'The maintenance channel ends at a locked service gate. By the time Rook backs out, Vale is gone.':'Vale has too much road. His lights vanish under the canal gate.';break;
 case 'canalEntry':el.caption.textContent=state.pursuit==='stay'?'Rook stays with Bell and escorts him to the canal-side medics. Dawn catches the windows across the water.':state.caught?'Vale is in custody. Rook returns to Bell as the first light reaches the canal.':'Vale escaped tonight. Rook returns to Bell, who is waiting beside the canal with the medics.';break;
 case 'canalEnd':
  el.caption.textContent=state.caught?'Bell is alive. Vale is in custody. As the station lamps go dark, this time it is only because morning has arrived.':state.pursuit==='stay'?'Bell is alive, and his testimony is on record. The search for Vale continues. Rook has brought the missing man home.':'Bell is alive. Vale remains at large, but his secret is out. The missing-person case is closed; the warrant is just beginning.';
  el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+(state.rescue==='valve'?'Evidence: signed ledger recovered. ':'Evidence: Bell\'s testimony; ledger lost. ')+(state.club==='vault'?'The Filament chip ties the batteries to Vale\'s tables. ':'')+(state.caught?'Vale: arrested. ':state.pursuit==='stay'?'Vale: pursuit declined. ':'Vale: escaped. ')+(state.twist?'Nell\'s forged order is part of the case.':state.choice==='person'?'Nell remains a trusted witness.':'Rook worked without Nell.');
  button('[RETURN TO MENU]',openMenu);break;
 }
}
function reel(name){
 session.mode='preview';session.menu=false;session.confirmNew=false;reset();
 if(name==='street'){chapterCard();return;}
 if(name==='office'){enter('officeEntry');return;}
 Object.assign(state,{choice:'person',decoded:true,watched:true,rescue:'valve',clues:['Scene preview: Bell\'s trail leads from the station to Pump Room 4.']});
 if(name==='club'){state.pursuit='chasing';enter('clubEntry');return;}
 if(name==='chase'){state.radio=true;state.pursuit='chasing';startChase();return;}
 if(name==='tunnel'){state.radio=true;state.pursuit='ramp';state.gap=1;state.distance=20;state.phaseDistance=20;enter('tunnelEntry');return;}
 if(name==='canal'){state.caught=true;state.pursuit='ramp';}
 enter(name+'Entry');
}
