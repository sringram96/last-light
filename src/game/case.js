// The story driver. Phases registered as data (registry.js and src/game/sets/) run through the generic rules below;
// the original hand-written phases keep their code here and in runtime.js.
const caseTitles={officeEntry:'00 / NIGHT DIVISION',officeFile:'THE BELL FILE',officeBoard:'THE CASE BOARD',officeWindow:'RAIN ON THE GLASS',stationEntry:'02 / NORTH STATION',stationQuiet:'THE DESK IS STILL WARM',stationListen:'READING THE MAINTENANCE TAPE',stationReady:'A USEFUL PRECAUTION',pumpEntry:'03 / PUMP ROOM 4',pumpFind:'BELL IS ALIVE',pumpDanger:'THE PIPE IS GIVING WAY',pumpQte:'THE WATER IS RISING',pumpResult:'OUT OF THE WATER',pumpTruth:'WHY BELL DISAPPEARED',roofEntry:'04 / ABOVE THE CITY',roofQuiet:'A MOMENT TO BREATHE',roofListen:'LISTENING TO THE BAND',roofSignal:'A VOICE IN THE STATIC',roofConfession:'THE FORGED ORDER',clubEntry:'05 / THE FILAMENT',clubFace:'VALE SEES ROOK',clubQte:'THE BOTTLE',clubResult:'THE BACK DOOR',chaseEntry:'06 / THE ELEVATED ROAD',chaseQteA:'FREIGHT IN YOUR LANE',chaseBank:'UNDER THE SIGNAL GANTRIES',chaseQteB:'THE BRIDGE IS LIFTING',chaseFinish:'ONE LAST TURN',tunnelEntry:'07 / THE UNDERCITY',tunnelQte:'THE DRAIN FORKS',tunnelFinish:'OUT OF THE DARK',canalEntry:'10 / FIRST LIGHT',canalEnd:'CASE CLOSED'};
const liveCase=['officeEntry','officeFile','officeBoard','officeWindow','stationEntry','pumpEntry','pumpDanger','pumpResult','roofEntry','clubEntry','clubFace','clubResult','chaseEntry','chaseBank','chaseFinish','tunnelEntry','tunnelFinish','canalEntry'];
const qtePhases=['qte','pumpQte','clubQte','chaseQteA','chaseQteB','tunnelQte'];
const observePhases=['watch','stationListen','roofListen'];
const resultPhases=['result','pumpResult','clubResult','chaseBank','chaseFinish','tunnelFinish'];
function isQte(){const d=phaseDef();return d?d.kind==='prompt':qtePhases.includes(state.phase);}
function isObserving(){const d=phaseDef();return d?d.kind==='observe':observePhases.includes(state.phase);}
function isResult(){const d=phaseDef();return d?d.kind==='result':resultPhases.includes(state.phase);}
function isLive(){const d=phaseDef();return d?['cutscene','windup','result'].includes(d.kind):['follow','danger','result','arrival',...liveCase].includes(state.phase);}
// Prompt windows: a base of 7 seconds with the beat sheet's modifiers, never under 5 or over 9.
function caseDuration(){
 const p=state.phase,d=phaseDef();
 if(d&&d.kind==='prompt')return clamp(d.window(),5,9);
 if(p==='pumpQte')return clamp(7+(state.decoded?2:0)-(state.wrong?2:0),5,9);
 if(p==='clubQte')return clamp(7+(state.market==='cut'?2:0)-(state.market==='late'?2:0),5,9);
 if(p==='tunnelQte')return clamp(7+(state.radio?2:0),5,9);
 if(p.startsWith('chase'))return clamp(7+(state.radio?2:0)-(state.club==='late'?2:0),5,9);
 return qteDuration();
}
function caseEnter(phase){
 if(phase==='chaseEntry'||phase==='tramEntry'){state.distance=20;state.phaseDistance=20;}
 const name=sceneFor(phase);
 if(setScene(name)){Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};}
 state.phaseDistance=state.distance;state.roomPick='';
 const d=phaseDef(phase);if(d){if(d.enter)d.enter();return;}
 if(phase==='tunnelQte')tunnelFork=state.distance+30;
 if(phase==='officeBoard')addClue('Case board: Inspector Aurel Vale of Night Division is the Lumen Board\'s grid security liaison. His office is next to Rook\'s.');
 if(phase==='stationQuiet')addClue('Maintenance desk: order 7731, RESERVE BATTERIES, signed INSPECTOR VALE. The same number Bell tagged on his route map.');
 if(phase==='stationReady'){state.decoded=true;addClue('The maintenance tape says: close the INLET wheel before pulling someone off the flooded platform.');}
 if(phase==='pumpTruth'){
  addClue('Bell identifies Inspector Vale: Vale sold the emergency batteries, then locked Bell in the pump room to silence him.');
  addClue(state.rescue==='valve'?'Recovered: Vale\'s signed battery-transfer ledger, dry and legible. Every page is countersigned with a second initial: H.A.':'The flooded ledger is unreadable. Bell can testify, but the written proof is lost.');
 }
 if(phase==='roofQuiet')addClue('Seen from the roof: Vale\'s red car leaves the station westward, toward the night market under the elevated road and The Filament.');
 if(phase==='roofSignal'){state.radio=true;addClue('Radio traffic: the canal bridge lifts at the half hour. The lower service ramp reaches the canal basin first. A Lumen Board van is booked through to Substation Nine.');}
 if(phase==='roofConfession'){state.twist=true;addClue('Nell admits forging the maintenance order to bring Bell here and expose Vale. Nell did not foresee the trap.');}
 if(phase==='clubResult'&&state.club==='vault')addClue('A Filament casino chip from Vale\'s case, stamped with the reserve-battery lot numbers. The club launders the sales.');
 if(phase==='canalEnd')state.endingSeen=true;
}
function react(move){state.reaction=move==='late'||move==='missed'?0:state.event;}
// Registered prompts: move i of the current prompt, or the timed miss.
function promptMove(i){const d=phaseDef();if(!d||d.kind!=='prompt'||state.paused)return;const m=d.moves[i];react(m.id);m.act();enter(nextOf(d));}
function promptMiss(){const d=phaseDef();if(!d||d.kind!=='prompt')return;react('late');d.miss();enter(nextOf(d));}
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
 // Following keeps Vale only when he is close; the shortcut needs the bridge operator's tip about the basin.
 state.caught=move==='right'?state.gap<=1:move==='left'?state.radio:false;
 enter('tunnelFinish');
}
function pursuit(){state.gap=0;state.caught=false;state.pursuit='chasing';enter('tramEntry');}
function startChase(){enter('chaseEntry');}
function stayWithBell(){state.pursuit='stay';state.caught=false;enter('roomEntry');}
function caseAdvance(dt){
 const p=state.phase,e=state.event,d=phaseDef();
 if(moving()&&!reduce&&!(isQte()&&state.untimed))state.distance+=dt*(sets[sceneName]?.speed?.(p)??(isQte()?1.6:/Finish/.test(p)?13:21));
 const done=(s)=>e>=(reduce&&s>2?1:s);
 if(d){
  if(d.kind==='cutscene'&&done(d.duration))enter(nextOf(d));
  else if(d.kind==='observe'&&e>=8)enter(nextOf(d));
  else if(d.kind==='windup'&&e>=2)enter(nextOf(d));
  else if(d.kind==='prompt'&&!state.untimed&&e>=caseDuration())promptMiss();
  else if(d.kind==='result'&&done(d.duration||4)&&!canRewind())enter(nextOf(d));
  return;
 }
 if(p==='officeEntry'&&done(8))enter('officeFile');
 else if(p==='officeFile'&&done(5))enter('officeBoard');
 else if(p==='officeBoard'&&done(5))enter('officeWindow');
 else if(p==='officeWindow'&&done(6))enter('brief');
 else if(p==='stationEntry'&&done(7))enter('stationQuiet');
 else if(p==='stationListen'&&e>=8)enter('stationReady');
 else if(p==='pumpEntry'&&done(6))enter('pumpFind');
 else if(p==='pumpDanger'&&e>=2)enter('pumpQte');
 else if(p==='pumpQte'&&!state.untimed&&e>=caseDuration())rescue('late');
 else if(p==='pumpResult'&&done(4)&&!canRewind())enter('pumpTruth');
 else if(p==='roofEntry'&&done(8))enter('roofQuiet');
 else if(p==='roofListen'&&e>=8)enter('roofSignal');
 else if(p==='clubEntry'&&done(8))enter('clubFace');
 else if(p==='clubFace'&&e>=2)enter('clubQte');
 else if(p==='clubQte'&&!state.untimed&&e>=caseDuration())clubChoice('late');
 else if(p==='clubResult'&&done(4)&&!canRewind())startChase();
 else if(p==='chaseEntry'&&done(6))enter('chaseQteA');
 else if(p==='chaseQteA'&&!state.untimed&&e>=caseDuration())chaseChoice('late');
 else if(p==='chaseBank'&&done(6)&&!canRewind())enter('chaseQteB');
 else if(p==='chaseQteB'&&!state.untimed&&e>=caseDuration())chaseChoice('late');
 else if(p==='chaseFinish'&&done(6)&&!canRewind())enter('subEntry');
 else if(p==='tunnelEntry'&&done(6))enter('tunnelQte');
 else if(p==='tunnelQte'&&!state.untimed&&e>=caseDuration())tunnelChoice('late');
 else if(p==='tunnelFinish'&&done(6)&&!canRewind())enter('subEntry');
 else if(p==='canalEntry'&&done(7))enter('canalEnd');
}
function roofActions(){
 if(!state.radio)button('[LISTEN TO THE RADIO / 8s]',()=>enter('roofListen'));
 button('[PURSUE VALE]',pursuit);button('[STAY WITH BELL]',stayWithBell);
}
const skipIntro=()=>button('[SKIP INTRO]',()=>enter('brief'));
function caseUI(){
 const d=phaseDef();
 if(d){
  el.phase.textContent=d.title||'THE LAST LIGHT';el.caption.textContent=d.caption?d.caption():'';
  if(d.kind==='prompt')d.moves.forEach((m,i)=>button(m.label,()=>promptMove(i)));
  if(d.buttons)d.buttons(button);
  if(d.kind==='result')rewindActions();
  return;
 }
 el.phase.textContent=caseTitles[state.phase]||'THE LAST LIGHT';
 switch(state.phase){
 case 'officeEntry':el.caption.textContent='Night Division, 23:40. Nine days of rain. Rook\'s desk lamp is the only light still burning on the floor.';skipIntro();break;
 case 'officeFile':el.caption.textContent='The file: IVO BELL, lamplighter, missing four nights. Last seen at the closed North Station. Attached, a report that someone is walking his route with his lantern.';skipIntro();break;
 case 'officeBoard':el.caption.textContent='On the case board, beside Bell\'s photograph, a commendation: INSPECTOR A. VALE, GRID SECURITY LIAISON, LUMEN BOARD. His office is the dark one across the corridor.';skipIntro();break;
 case 'officeWindow':el.caption.textContent='Rook takes his coat. Below the window the city runs on power it cannot account for, and one street on the lamplighter\'s route has gone dark.';skipIntro();break;
 case 'stationEntry':el.caption.textContent=state.choice==='person'?'Nell opens the service door with three taps. Footsteps echo through the empty concourse.':'The service latch gives under Rook\'s shoulder. Inside, a maintenance desk glows in an otherwise empty station.';break;
 case 'stationQuiet':
  el.caption.textContent='A fresh order on the desk: INSPECTOR VALE / RESERVE BATTERIES / ORDER 7731. A maintenance tape is still turning. Below the floor, someone strikes a pipe.';
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
  el.caption.textContent=state.rescue==='valve'?'Rook shuts the inlet, then helps Bell across. His satchel stays above the water.':state.rescue==='pull'?'Rook pulls Bell onto the walkway. His satchel drops into the torrent.':state.choice==='person'?'Nell throws a line. Rook and Nell haul Bell clear, but the water takes his satchel.':'Bell leaps as the platform breaks. Rook catches his sleeve. His satchel vanishes into the flood.';rewindActions();break;
 case 'pumpTruth':
  el.caption.textContent=state.rescue==='valve'?'The dry ledger bears Vale\'s signature, and under every entry a second set of initials Bell does not know: H.A. The city\'s emergency batteries were sold. The locked room was meant to silence him.':'Bell: "Vale sold the emergency batteries. When I confronted him, he locked me in. The proof was in that satchel. I will say it in court."';
  button('[TAKE BELL TO THE ROOF]',()=>enter('roofEntry'));break;
 case 'roofEntry':el.caption.textContent='Rook brings Bell up the service stair. The city opens beneath them. Flying traffic passes between the towers; a medic answers the roof radio.';break;
 case 'roofQuiet':
  el.caption.textContent='Bell is safe with the medic. Far below, a red car pulls away from the station forecourt and heads west under the elevated road, toward the market and the Filament\'s sign. The last tram of the night is crossing the dark district the same way.';
  roofActions();break;
 case 'roofListen':el.caption.textContent='Rook waits on the open channel. Traffic slides through the rain. A bridge operator comes through the static.';break;
 case 'roofSignal':
  el.caption.textContent=state.choice==='person'?'Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Beside the receiver, Nell goes quiet. "There is something about Bell\'s work order I should tell you."':'Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Rook now knows a way to intercept Vale and has extra time at every turn of the road.';
  if(state.choice==='person')button('[ASK NELL ABOUT THE ORDER]',()=>enter('roofConfession'));
  roofActions();break;
 case 'roofConfession':
  el.caption.textContent='Nell: "I forged the maintenance call. Bell was the only person who could prove the batteries were missing. I wanted Vale exposed. I did not know he would trap him." Rook records the confession.';
  roofActions();break;
 case 'clubEntry':el.caption.textContent=state.market==='cut'?'Vale\'s red car sits in Vine Alley. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up. Rook comes in by the back and Krane is already at the booth.':'Vale\'s red car sits outside The Filament. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up.';break;
 case 'clubFace':el.caption.textContent='Vale is in the back booth. He sees Rook. Krane rises, and a bottle leaves his hand. Get ready.';break;
 case 'clubQte':
  el.caption.textContent='Duck under the bottle, or go over the bar and cut Krane off before Vale reaches the back door.';
  button('[1] DUCK',()=>clubChoice('duck'));button('[2] VAULT THE BAR',()=>clubChoice('vault'));break;
 case 'clubResult':
  el.caption.textContent=state.club==='duck'?'The bottle bursts on the neon behind Rook. Vale is already through the back door and into his car.':state.club==='vault'?'Rook goes over the bar and lands between Krane and the booth. Vale\'s chip case spills across the table. Rook pockets one chip and follows him out.':'The bottle catches Rook\'s shoulder. He is up in a second, but Vale has the back door and a head start.';rewindActions();break;
 case 'chaseEntry':el.caption.textContent='The patrol car is in Vine Alley with the keys in, as dispatch promised. Vale\'s red tail lights race ahead. The empty street gives way to dense elevated traffic.';break;
 case 'chaseQteA':
  el.caption.textContent='A freight carrier swings into Rook\'s lane. The right lane is clear. Brake and lose ground, or dive right to stay close.';
  button('[1] BRAKE',()=>chaseChoice('brake'));button('[2] DIVE RIGHT',()=>chaseChoice('dodge'));break;
 case 'chaseBank':el.caption.textContent=state.firstMove==='dodge'?'Rook swings right and surges past the carrier. Vale is still within reach.':state.firstMove==='brake'?'The patrol car falls back under braking. Rook needs an interception route.':'The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.';rewindActions();break;
 case 'chaseQteB':
  el.caption.textContent=(state.radio?'The radio marked the lower ramp as clear. ':'The bridge ahead is lifting. ')+(state.gap===0?'Rook is close enough to follow Vale over the gap, or drop down the ramp into the storm drains.':'Vale is too far ahead for a safe jump. The lower service ramp into the storm drains is Rook\'s best chance.');
  button('[1] TAKE THE LOWER RAMP',()=>chaseChoice('ramp'));button('[2] FOLLOW OVER THE GAP',()=>chaseChoice('jump'));break;
 case 'chaseFinish':
  el.caption.textContent=state.caught?'The patrol car clears the gap. Rook forces Vale to stop at the basin exit, under the lit windows of Substation Nine.':state.pursuit==='late'?'Rook brakes at the rising bridge. Vale disappears toward the basin. Beyond the canal, the windows of Substation Nine are lit at one in the morning.':'The gap is already too wide. Rook aborts the jump and brakes hard. Vale gets away toward the basin, where Substation Nine is lit at one in the morning.';rewindActions();break;
 case 'tunnelEntry':el.caption.textContent='The service ramp drops below the road into the storm drains. Vale\'s tail lights bounce off wet brick, and the sound of two engines fills the tunnel.';break;
 case 'tunnelQte':
  el.caption.textContent=(state.radio?'The bridge operator said the maintenance channel reaches the basin first. ':'')+'The drain forks ahead. Vale takes the right branch under the canal gate.';
  button('[1] FOLLOW RIGHT',()=>tunnelChoice('right'));button('[2] CUT LEFT',()=>tunnelChoice('left'));break;
 case 'tunnelFinish':
  el.caption.textContent=state.caught?(state.tunnel==='left'?'Rook takes the maintenance channel and bursts out of the basin outfall ahead of Vale. The red car stops with nowhere left to go, under the lit windows of Substation Nine.':'Rook stays on Vale\'s lights through the right branch and forces him against the canal gate. Across the basin, Substation Nine is lit at one in the morning.'):state.tunnel==='late'?'Rook brakes at the fork. Both branches are dark. Vale is gone, but every drain here ends at the basin, and the basin is lit by Substation Nine.':state.tunnel==='left'?'The maintenance channel ends at a locked service gate. By the time Rook backs out, Vale is gone. The outfall beyond the gate opens onto the basin and the lit windows of Substation Nine.':'Vale has too much road. His lights vanish under the canal gate, toward the basin and the lit windows of Substation Nine.';rewindActions();break;
 case 'canalEntry':el.caption.textContent=state.pursuit==='stay'?'Rook stayed with Bell and escorted him to the canal-side medics. Dawn catches the windows across the water.':state.caught?'Vale is in custody. Rook returns to Bell as the first light reaches the canal.':'Vale escaped tonight. Rook returns to Bell, who is waiting beside the canal with the medics.';break;
 case 'canalEnd':{
  const ending=endingFor();
  el.caption.textContent=ending.closing;
  const evidence=(ledgerHeld()?'Evidence: signed ledger recovered. ':manifestHeld()?'Evidence: the Substation Nine manifest. ':'Evidence: Bell\'s testimony; ledger lost. ')+(chipHeld()?'The Filament chip ties the batteries to Vale\'s tables. ':'');
  const nell=state.twist?'Nell\'s forged order is part of the case.':state.choice==='person'?'Nell remains a trusted witness.':state.note?'Nell\'s note is in the file; she has not been found.':'Rook worked without Nell.';
  el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+ending.summary+' '+evidence+nell;
  button('[RETURN TO MENU]',openMenu);break;}
 }
}
// What Rook is doing right now, for the header.
function objective(){
 const s=sceneName,set=sets[s];
 if(set&&set.objective)return set.objective(state.phase);
 if(s==='office')return 'A MISSING LAMPLIGHTER';
 if(s==='street'||s==='station')return 'FIND BELL';
 if(s==='pump')return reached('pumpResult')?'GET BELL TO SAFETY':'GET BELL OUT';
 if(s==='roof')return 'VALE, OR BELL';
 if(s==='club'||s==='chase'||s==='tunnel')return 'CATCH VALE';
 return state.phase==='canalEnd'?'CASE CLOSED':'FIRST LIGHT';
}
function reel(name){
 session.mode='preview';session.menu=false;session.confirmNew=false;reset();
 if(name==='street'){chapterCard();return;}
 if(name==='office'){enter('officeEntry',true);return;}
 Object.assign(state,{choice:'person',decoded:true,watched:true,rescue:'valve',clues:['Scene preview: Bell\'s trail leads from the station to Pump Room 4.']});
 const set=sets[name];
 if(set&&set.preview){enter(set.preview(),true);return;}
 if(name==='club'){state.pursuit='chasing';enter('clubEntry',true);return;}
 if(name==='chase'){state.radio=true;state.pursuit='chasing';enter('chaseEntry',true);return;}
 if(name==='tunnel'){state.radio=true;state.pursuit='ramp';state.gap=1;state.distance=20;state.phaseDistance=20;enter('tunnelEntry',true);return;}
 if(name==='canal'){state.caught=true;state.pursuit='ramp';state.hall='dive';}
 enter(name+'Entry',true);
}
