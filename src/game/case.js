// The story driver. Phases registered as data (registry.js and src/game/sets/) run through the generic rules below;
// the original hand-written phases keep their code here and in runtime.js.
const caseTitles={officeEntry:'00 / NIGHT DIVISION',officeFile:'THE BELL FILE',officeBoard:'THE CASE BOARD',officeWindow:'RAIN ON THE GLASS',stationEntry:'02 / NORTH STATION',stationQuiet:'THE DESK IS STILL WARM',stationListen:'READING THE MAINTENANCE TAPE',stationReady:'A USEFUL PRECAUTION',pumpEntry:'03 / PUMP ROOM 4',pumpFind:'BELL IS ALIVE',pumpDanger:'THE PIPE IS GIVING WAY',pumpQte:'THE WATER IS RISING',pumpResult:'OUT OF THE WATER',pumpTruth:'WHY BELL DISAPPEARED',roofEntry:'04 / ABOVE THE CITY',roofQuiet:'A MOMENT TO BREATHE',roofListen:'LISTENING TO THE BAND',roofSignal:'A VOICE IN THE STATIC',roofConfession:'THE FORGED ORDER',clubEntry:'05 / THE FILAMENT',clubBooth:'THE BACK BOOTH',clubFace:'VALE SEES ROOK',clubQte:'THE BOTTLE',clubResult:'THE BACK DOOR',chaseEntry:'06 / THE ELEVATED ROAD',chaseQteA:'FREIGHT IN YOUR LANE',chaseBank:'UNDER THE SIGNAL GANTRIES',chaseQteB:'THE BRIDGE IS LIFTING',chaseFinish:'ONE LAST TURN',tunnelEntry:'07 / THE UNDERCITY',tunnelQte:'THE DRAIN FORKS',tunnelFinish:'OUT OF THE DARK',canalEntry:'10 / FIRST LIGHT',canalEnd:'CASE CLOSED'};
const liveCase=['officeEntry','officeFile','officeBoard','officeWindow','stationEntry','pumpEntry','pumpDanger','pumpResult','roofEntry','clubEntry','clubFace','clubResult','chaseEntry','chaseBank','chaseFinish','tunnelEntry','tunnelFinish','canalEntry'];
const qtePhases=['qte','pumpQte','clubQte','chaseQteA','chaseQteB','tunnelQte'];
const observePhases=['watch','stationListen','roofListen'];
const resultPhases=['result','pumpResult','clubResult','chaseBank','chaseFinish','tunnelFinish'];
function isQte(){const d=phaseDef();return d?d.kind==='prompt':qtePhases.includes(state.phase);}
function isObserving(){const d=phaseDef();return d?d.kind==='observe':observePhases.includes(state.phase);}
function isResult(){const d=phaseDef();return d?d.kind==='result':resultPhases.includes(state.phase);}
function isLive(){const d=phaseDef();return d?['cutscene','windup','result','death'].includes(d.kind):['follow','danger','result','arrival',...liveCase].includes(state.phase);}
function isWindup(p=state.phase){const d=phaseDef(p);return d?d.kind==='windup':['danger','pumpDanger','clubFace'].includes(p);}
// Prompt windows, measured from the first flash of the cue: a base per beat, +0.5 s for an earlier observation, -0.5 s for
// an earlier injury, never under 1.25 or over 3.5 seconds. Registered prompts carry their base and modifiers (or a window()).
function caseDuration(){
 const p=state.phase,d=phaseDef(),win=(base,bonus,penalty)=>clamp(base+(bonus?.5:0)-(penalty?.5:0),1.25,3.5);
 if(d&&d.kind==='prompt')return d.window?d.window():win(d.base,d.bonus?.(),d.penalty?.());
 if(p==='qte')return win(3,state.watched,false);
 if(p==='pumpQte')return win(2.5,state.decoded,state.wrong);
 if(p==='clubQte')return win(2,state.market==='cut',state.shown||state.market==='late');
 if(p==='chaseQteA'||p==='chaseQteB')return win(2,state.radio,state.club==='late');
 if(p==='tunnelQte')return win(1.75,state.radio,false);
 return 3;
}
// The windup keeps its camera cut but no card; its length is jittered from the clock so the cue's moment cannot be counted
// down to (2 s under reduced motion or untimed play). A rewound pass shows the rewind line as the windup's caption.
let windupSeconds=2,rewindTo='',cueFirstFrame=0;
const rewindLines={danger:'The night rewinds. The courier is upright with the book under one arm, and the red car has not moved. Get ready.',pumpDanger:'The night rewinds. The joint holds, Bell is still tapping the pipe, and the INLET wheel is at Rook\'s hand. Get ready.',marketDanger:'The night rewinds. The cart is parked at the top of the aisle, and Krane has not seen Rook yet. Get ready.',clubFace:'The night rewinds. Vale is in the booth, Krane is still sitting, and the bottle is on the table. Get ready.',chaseQteA:'The night rewinds. The carrier is in its own lane and Vale\'s tail lights are twenty metres ahead. Get ready.',chaseQteB:'The night rewinds. The deck is flat and the bridge bell has not started. Get ready.',tunnelQte:'The night rewinds. The fork is ahead again and both mouths are open. Get ready.',subDanger:'The night rewinds. The rack is upright and chained to nothing, and Krane has his back to it. Get ready.'};
// The deduction ladder's wrong-answer counts, per pass; never saved.
const ladder={street:0,loft:0,room:0};
// Deaths. A lethal miss enters the beat's death phase: a lamp goes and the death's bit joins deaths (never cleared by a rewind).
// After the picture the night rewinds to the windup, or, with no lamp left, the case goes cold. The hand-written sets'
// deaths are registered here; the market and the substation register their own. Pictures reuse the late results for now.
const deathPhases={pump:'pumpDeath',market:'marketDeath',carrier:'chaseDeath',gap:'gapDeath',pier:'tunnelDeath',rack:'subDeath'};
registerPhases('pump',{pumpDeath:{kind:'death',title:'THE PLATFORM GOES',duration:4,dead:'pump',bit:1,back:'pumpDanger',reset:()=>{state.rescue='';},stinger:()=>['DROWNED','miss',4],
 caption:()=>state.choice==='person'?'The platform goes and Bell goes with it. Nell\'s line comes back empty, and the water keeps coming through the joint.':'The platform goes and Bell goes with it. Rook has his sleeve, then the sleeve, then nothing, and the water keeps coming through the joint.'}});
registerPhases('chase',{
 chaseDeath:{kind:'death',title:'OVER THE BARRIER',duration:4,dead:'carrier',bit:4,back:'chaseQteA',reset:()=>{state.firstMove='';state.gap=0;},stinger:()=>['OVER THE EDGE','miss',4],
  caption:()=>'The carrier\'s trailer takes the patrol car across the bonnet and puts it through the barrier. The elevated road is fifteen metres up, and the freight driver does not stop.'},
 gapDeath:{kind:'death',title:'THE FAR SPAN',duration:4,dead:'gap',bit:8,back:'chaseQteB',reset:()=>{state.pursuit='chasing';state.caught=false;},stinger:()=>['SHORT','miss',4],
  caption:()=>state.radio?'Heddy Lasko said not to follow him over her gap. The patrol car leaves the deck and the far span is not there, and Rook has time to see Substation Nine lit across the water before he is in it.':'The patrol car leaves the deck and the far span is not there. Rook has time to see Substation Nine lit across the water before he is in it.'}
});
registerPhases('tunnel',{tunnelDeath:{kind:'death',title:'THE PIER',duration:4,dead:'pier',bit:16,back:'tunnelQte',reset:()=>{state.tunnel='';state.caught=false;},stinger:()=>['THE PIER','miss',4],
 caption:()=>'Rook does not choose and the pier chooses for him. The patrol car goes into the brick at speed, and the drain\'s neon goes on flickering over it.'}});
// The case goes cold in whichever set the last death was in; the picture holds that death's frame. Records are written here.
const coldCaptions={pump:'Night Division, morning. IVO BELL, lamplighter, is recovered from Pump Room 4 by the day shift. The order on the desk is gone before they arrive. Rook\'s report is one page and names nobody it can prove. Inspector Vale signs it.',market:'Night Division, morning. DETECTIVE ROOK is found under a cell-cart at Market Arch. The stall keepers saw nothing. Inspector Vale signs the report, and the file goes to the cabinet with the others.',carrier:'Night Division, morning. The patrol car is lifted out of the basin at nine. The freight company\'s log says the lane was clear. Inspector Vale signs the report, and the file goes to the cabinet with the others.',gap:'Night Division, morning. The patrol car is lifted out of the basin at nine. Lift Bridge Two\'s log says the lift was announced on the half hour. Inspector Vale signs the report, and the file goes to the cabinet with the others.',pier:'Night Division, morning. The patrol car is found against the pier in the storm drain. Nobody on the floor can say what Rook was doing under the canal. Inspector Vale signs the report, and the file goes to the cabinet with the others.',rack:'Night Division, morning. The Board\'s day engineers find Rook in the battery hall of Substation Nine, under a rack the manifest says was never there. Commissioner Ashe expresses the Board\'s regret. Inspector Vale signs the report.'};
registerPhases('*',{coldCase:{kind:'quiet',title:'THE CASE GOES COLD',stinger:()=>['CASE COLD','miss',Infinity],
 enter:()=>{state.endingSeen=true;},caption:()=>coldCaptions[state.dead]||'',
 buttons:b=>{b('[RESTART THE CHAPTER]',restartChapter);b('[RETURN TO MENU]',abandonCase);}}});
// Restarting a chapter: three lamps back, restarts +1, the current set's entry phase, and only the fields that set writes
// reset; a field earned in an earlier set is never touched. deaths stays.
const entryPhases={office:'officeEntry',street:'brief',loft:'loftEntry',station:'stationEntry',pump:'pumpEntry',roof:'roofEntry',tram:'tramEntry',market:'marketEntry',club:'clubEntry',chase:'chaseEntry',tunnel:'tunnelEntry',substation:'subEntry',room:'roomEntry',canal:'canalEntry'};
const setFields={street:{choice:'',watched:false,wrong:false},loft:{note:false,loftSeen:false,misread:false},station:{decoded:false},pump:{rescue:''},roof:{radio:false,twist:false,pursuit:'',caught:false,gap:0},tram:{tail:false},market:{keeper:false,market:''},club:{club:'',shown:false},chase:{firstMove:'',gap:0,pursuit:'chasing',caught:false},tunnel:{tunnel:'',caught:false},substation:{hall:''},room:{slip:false,stalled:false,roomPick:''}};
function restartChapter(){
 const name=sceneName,entry=entryPhases[name]||'brief';
 Object.assign(state,setFields[name]||{},{rewinds:3,restarts:Math.min(9,state.restarts+1),dead:'',endingSeen:false,reaction:0,paused:false});
 if(['chase','tram','tunnel'].includes(name)){state.distance=20;state.phaseDistance=20;}
 Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};
 clearCard();enter(entry,true);chapterCard();
}
// Leaving a cold case for the menu clears the checkpoint (no case to continue); the records keep the cold count.
function abandonCase(){saveStore.clear();reset();openMenu();}
function caseEnter(phase){
 if(phase==='chaseEntry'||phase==='tramEntry'){state.distance=20;state.phaseDistance=20;}
 const name=sceneFor(phase);
 if(setScene(name)){Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};}
 state.phaseDistance=state.distance;state.roomPick='';
 state.rewound=phase===rewindTo;rewindTo='';cueFirstFrame=frame+1;
 if(isWindup(phase))windupSeconds=reduce||state.untimed?2:1.5+hash(Math.floor(state.t*1000),3);
 if(phase==='deduce')ladder.street=state.wrong?1:0;if(phase==='loftBoard')ladder.loft=state.misread?1:0;if(phase==='roomDeduce')ladder.room=state.slip?1:0;
 const d=phaseDef(phase);if(d){if(d.kind==='death'){if(state.rewinds>0)state.rewinds--;state.deaths|=d.bit;}if(d.enter)d.enter();return;}
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
 if(phase==='clubResult'&&state.club==='late'&&state.rescue==='valve')addClue('Krane took Vale\'s signed ledger from Rook\'s coat at The Filament. The only paper with Vale\'s name on it left by the back door.');
 if(phase==='canalEnd')state.endingSeen=true;
}
// The reaction is read at the input event: the accumulator plus the event's offset from the last frame, when it has one.
function react(event){const ts=event&&typeof event.timeStamp==='number'&&lastTime?clamp((event.timeStamp-lastTime)/1000,0,.1):0;state.reaction=state.event+ts;}
// One entry point for every action beat: the direction pressed, swiped or tapped. A cue in that direction lands its move;
// any other direction is the beat's miss at once (ignored in untimed play). The hand-written prompts' cues live in a table.
const handCues={qte:{up:'person',down:'book'},pumpQte:{left:'valve',right:'pull'},clubQte:{down:'duck',up:'vault'},chaseQteA:{down:'brake',right:'dodge'},chaseQteB:{left:'ramp',up:'jump'},tunnelQte:{right:'right',left:'left'}};
function promptInput(dir,event){
 if(!isQte()||state.paused||session.menu||transit)return;
 const d=phaseDef(),p=state.phase;
 if(d){const c=d.cues.find(c=>c.dir===dir);if(!c){if(!state.untimed)promptMiss();return;}react(event);c.act();enter(nextOf(d));return;}
 const id=handCues[p]?.[dir];
 if(!id){if(!state.untimed)promptMiss();return;}
 react(event);({qte:choose,pumpQte:rescue,clubQte:clubChoice,chaseQteA:chaseChoice,chaseQteB:chaseChoice,tunnelQte:tunnelChoice})[p](id);
}
// The miss: a death where the drawn danger kills, the worse story where it does not.
function promptMiss(){
 if(!isQte())return;const d=phaseDef(),p=state.phase;state.reaction=0;
 if(d){if(d.death){die(d.death);return;}if(typeof d.late==='function')d.late();enter(d.miss||nextOf(d));return;}
 ({qte:()=>choose('missed'),pumpQte:()=>die('pumpDeath'),clubQte:()=>clubChoice('late'),chaseQteA:()=>die('chaseDeath'),chaseQteB:()=>chaseChoice('late'),tunnelQte:()=>die('tunnelDeath')})[p]?.();
}
function die(deathPhase){state.reaction=0;enter(deathPhase);}
function rescue(move){if(state.phase!=='pumpQte'||state.paused)return;state.rescue=move;enter('pumpResult');}
function clubChoice(move){if(state.phase!=='clubQte'||state.paused)return;state.club=move;enter('clubResult');}
function chaseChoice(move){
 if(state.paused)return;
 if(state.phase==='chaseQteA'){state.firstMove=move;state.gap=move==='dodge'?0:move==='brake'?1:2;enter('chaseBank');}
 else if(state.phase==='chaseQteB'){
  // The jump with a gap open is the wrong move at the wrong moment: the car goes into the gap.
  if(move==='jump'&&state.gap>0){die('gapDeath');return;}
  state.pursuit=move;
  if(move==='ramp'){state.caught=false;enter('tunnelEntry');return;}
  state.caught=move==='jump';enter('chaseFinish');
 }
}
function tunnelChoice(move){
 if(state.phase!=='tunnelQte'||state.paused)return;
 state.tunnel=move;
 // Following keeps Vale only when he is right behind him; the shortcut needs the bridge operator's tip about the basin.
 state.caught=move==='right'?state.gap===0:move==='left'?state.radio:false;
 enter('tunnelFinish');
}
function pursuit(){state.gap=0;state.caught=false;state.pursuit='chasing';enter('tramEntry');}
function startChase(){enter('chaseEntry');}
function stayWithBell(){state.pursuit='stay';state.caught=false;enter('roomEntry');}
function caseAdvance(dt){
 const p=state.phase,e=state.event,d=phaseDef();
 // The world holds still through a death picture and a cold case.
 if(moving()&&!reduce&&!(isQte()&&state.untimed)&&!(d&&d.kind==='death')&&p!=='coldCase')state.distance+=dt*(sets[sceneName]?.speed?.(p)??(isQte()?1.6:/Finish/.test(p)?13:21));
 // A cutscene or result holds for its picture or until its caption could be read, whichever is longer (presentation.js holdFor).
 const done=(s)=>e>=holdFor(reduce&&s>2?1:s);
 if(d){
  if(d.kind==='cutscene'&&done(d.duration))enter(nextOf(d));
  else if(d.kind==='observe'&&e>=8)enter(nextOf(d));
  else if(d.kind==='windup'&&e>=windupSeconds)enter(nextOf(d));
  else if(d.kind==='prompt'&&!state.untimed&&e>=caseDuration())promptMiss();
  else if(d.kind==='result'&&done(d.duration||4)&&!canRewind())enter(nextOf(d));
  else if(d.kind==='death'&&done(d.duration||4)){
   if(state.rewinds>0){d.reset();state.reaction=0;card('REWIND','hit',1.4);cue('clue');rewindTo=d.back;enter(d.back);}
   else{state.dead=d.dead;enter('coldCase');}
  }
  return;
 }
 if(p==='officeEntry'&&done(8))enter('officeFile');
 else if(p==='officeFile'&&done(5))enter('officeBoard');
 else if(p==='officeBoard'&&done(5))enter('officeWindow');
 else if(p==='officeWindow'&&done(6))enter('brief');
 else if(p==='stationEntry'&&done(7))enter('stationQuiet');
 else if(p==='stationListen'&&e>=8)enter('stationReady');
 else if(p==='pumpEntry'&&done(6))enter('pumpFind');
 else if(p==='pumpDanger'&&e>=windupSeconds)enter('pumpQte');
 else if(p==='pumpQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='pumpResult'&&done(4)&&!canRewind())enter('pumpTruth');
 else if(p==='roofEntry'&&done(8))enter('roofQuiet');
 else if(p==='roofListen'&&e>=8)enter('roofSignal');
 else if(p==='clubEntry'&&done(8))enter('clubBooth');
 else if(p==='clubFace'&&e>=windupSeconds)enter('clubQte');
 else if(p==='clubQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='clubResult'&&done(4)&&!canRewind())startChase();
 else if(p==='chaseEntry'&&done(6))enter('chaseQteA');
 else if(p==='chaseQteA'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='chaseBank'&&done(6)&&!canRewind())enter('chaseQteB');
 else if(p==='chaseQteB'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='chaseFinish'&&done(6)&&!canRewind())enter('subEntry');
 else if(p==='tunnelEntry'&&done(6))enter('tunnelQte');
 else if(p==='tunnelQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='tunnelFinish'&&done(6)&&!canRewind())enter('subEntry');
 else if(p==='canalEntry'&&done(7))enter('canalEnd');
}
function roofActions(){
 if(!state.radio)button('[LISTEN TO THE RADIO / 8s]',()=>enter('roofListen'));
 button('[PURSUE VALE]',pursuit);button('[STAY WITH BELL]',stayWithBell);
}
const skipIntro=()=>button('[SKIP INTRO]',()=>enter('brief'));
// A live timed beat shows nothing under the picture: the cues are the interface. Untimed play keeps the caption and the buttons.
function promptUI(caption,cues){
 el.caption.textContent=state.untimed?caption:'';
 if(state.untimed)for(const [label,dir] of cues)button(label,()=>promptInput(dir));
}
const deathCount=()=>[1,2,4,8,16,32].filter(bit=>state.deaths&bit).length;
function caseUI(){
 const d=phaseDef();
 if(d){
  el.phase.textContent=d.title||'THE LAST LIGHT';el.caption.textContent=d.caption?d.caption():'';
  if(d.kind==='prompt')promptUI(el.caption.textContent,d.cues.map(c=>[c.label,c.dir]));
  if(d.buttons)d.buttons(button);
  if(d.kind==='result')rewindActions();
  if(state.phase==='coldCase'){el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+(state.dead==='pump'?'Bell did not come out of Pump Room 4. Vale signed the report.':'Rook did not see the morning. Vale signed the report.')+' Deaths seen this case: '+deathCount()+'.';}
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
  el.caption.textContent=(state.wrong?'Bell: "Vale took the reserve batteries. I found his ledger, so he locked me down here." The water is at his knees. "You took your time. That pipe will not hold much longer."':'Bell: "Vale took the reserve batteries. I found his ledger, so he locked me down here. That pipe will not hold much longer."')+' The INLET wheel is beside Rook.';
  button('[GET BELL OUT]',()=>enter('pumpDanger'));break;
 case 'pumpDanger':el.caption.textContent='A joint splits. Water surges under the platform. Get ready.';break;
 case 'pumpQte':
  promptUI(state.decoded?'The tape said inlet first. Close it, or pull Bell out.':'Close the INLET wheel, or pull Bell off the platform.',[['[1] CLOSE THE INLET','left'],['[2] PULL BELL OUT','right']]);break;
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
 case 'clubEntry':el.caption.textContent=state.market==='cut'?'Vale\'s red car sits in Vine Alley. Inside: neon, velvet, a stage, a bar, and nobody looks up. Rook comes in by the back; Krane is already at the booth.':'Vale\'s red car sits outside The Filament. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up.';break;
 // The back booth: Vale has a face and a line before the bottle. Showing him the order is texture with a price (half a second
 // at the bottle, Krane already up); his answer is typed here, where it is said, and the windup keeps its ten words.
 case 'clubBooth':
  el.caption.textContent=state.shown?'Rook puts order 7731 on the table. Vale reads his own signature and does not deny it. "Reserve batteries. Signed. Nobody reads a maintenance order." Krane is already on his feet.':state.faced?'Vale does not get up. "Twice in one night, Rook. You are still on the wrong floor." Krane\'s hand is on a bottle.':'Vale does not get up. "Rook. You are on the wrong floor for this." Krane\'s hand is on a bottle.';
  if(state.shown)button('[STAND YOUR GROUND]',()=>enter('clubFace'));
  else{button('[SHOW HIM ORDER 7731]',()=>{state.shown=true;addClue('Vale, shown order 7731 at The Filament, did not deny signing it. His words: "Nobody reads a maintenance order."');ui();});button('[SAY NOTHING]',()=>enter('clubFace'));}
  break;
 case 'clubFace':el.caption.textContent=state.shown?'The bottle leaves Krane\'s hand. Get ready.':'"Put the light down." Krane rises. Get ready.';break;
 case 'clubQte':
  promptUI('Duck under the bottle, or vault the bar and cut Krane off.',[['[1] DUCK','down'],['[2] VAULT THE BAR','up']]);break;
 case 'clubResult':
  el.caption.textContent=state.club==='duck'?'The bottle bursts on the neon behind Rook. Vale is already through the back door and into his car.':state.club==='vault'?'Rook goes over the bar and lands between Krane and the booth. Vale\'s chip case spills across the table. Rook pockets one chip and follows him out.':state.rescue==='valve'?'The bottle takes Rook on the temple and the carpet comes up to meet him. Krane goes through his coat, says "Sit down, detective. The set is not over," and follows Vale out with Bell\'s ledger in his jacket.':'The bottle takes Rook on the temple and the carpet comes up to meet him. Krane stands over him long enough to say "Sit down, detective. The set is not over," and follows Vale out.';rewindActions();break;
 case 'chaseEntry':el.caption.textContent='The patrol car is in Vine Alley with the keys in, as dispatch promised. Vale\'s red tail lights race ahead. The empty street gives way to dense elevated traffic.';break;
 case 'chaseQteA':
  promptUI('Freight in the lane. Brake and lose ground, or dive right.',[['[1] BRAKE','down'],['[2] DIVE RIGHT','right']]);break;
 case 'chaseBank':el.caption.textContent=state.firstMove==='dodge'?'Rook swings right and surges past the carrier. Vale is still within reach.':state.firstMove==='brake'?'The patrol car falls back under braking. Rook needs an interception route.':'The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.';rewindActions();break;
 case 'chaseQteB':
  // With the gap open and the band heard, Heddy's warning makes the jump a choice, not a trap; her line is the one prompt caption over twelve words.
  promptUI(state.gap===0?'The bridge is lifting. Follow Vale over, or take the lower ramp.':(state.radio?'Heddy on the channel: "Whoever you are chasing, do not follow him over my gap." ':'The bridge is lifting. ')+'Vale is too far ahead. Take the ramp.',[['[1] TAKE THE LOWER RAMP','left'],['[2] FOLLOW OVER THE GAP','up']]);break;
 case 'chaseFinish':
  el.caption.textContent=state.caught?'The patrol car clears the gap. Rook forces Vale to stop at the basin exit, under the lit windows of Substation Nine.':state.pursuit==='late'?'Rook stands on the brakes and the patrol car meets the rising deck at walking pace. Vale\'s lights cross the far span and drop toward the basin. Rook goes down to Substation Nine on foot, under the lit windows across the water.':'The gap is already too wide. Rook aborts the jump and brakes hard. Vale gets away toward the basin, where Substation Nine is lit at one in the morning.';rewindActions();break;
 case 'tunnelEntry':el.caption.textContent='The service ramp drops below the road into the storm drains. Vale\'s tail lights bounce off wet brick, and the sound of two engines fills the tunnel.';break;
 case 'tunnelQte':
  promptUI(state.radio?'Heddy said the left channel reaches the basin first. Vale goes right.':'The drain forks. Vale goes right, under the canal gate.',[['[1] FOLLOW RIGHT','right'],['[2] CUT LEFT','left']]);break;
 case 'tunnelFinish':
  el.caption.textContent=state.caught?(state.tunnel==='left'?'Rook takes the maintenance channel and bursts from the basin outfall ahead of Vale. The red car stops with nowhere left to go, under the lit windows of Substation Nine.':'Rook stays on Vale\'s lights through the right branch and forces him against the canal gate. Across the basin, Substation Nine is lit at one in the morning.'):state.tunnel==='late'?'Rook brakes at the fork. Both branches are dark. Vale is gone, but every drain here ends at the basin, and the basin is lit by Substation Nine.':state.tunnel==='left'?'The maintenance channel ends at a locked gate. By the time Rook backs out, Vale is gone. The outfall beyond opens onto the basin and Substation Nine\'s lit windows.':'Vale has too much road. His lights vanish under the canal gate, toward the basin and the lit windows of Substation Nine.';rewindActions();break;
 case 'canalEntry':el.caption.textContent=state.pursuit==='stay'?'Rook stayed with Bell and escorted him to the canal-side medics. Dawn catches the windows across the water.':state.caught?'Vale is in custody. Rook returns to Bell as the first light reaches the canal.':'Vale escaped tonight. Rook returns to Bell, who is waiting beside the canal with the medics.';break;
 case 'canalEnd':{
  const ending=endingFor();
  el.caption.textContent=typeof ending.closing==='function'?ending.closing():ending.closing;
  const evidence=(ledgerHeld()?'Evidence: signed ledger recovered. ':manifestHeld()?'Evidence: the Substation Nine manifest. ':state.rescue==='valve'&&state.club==='late'?'Evidence: the signed ledger, lost to Krane at The Filament. ':'Evidence: Bell\'s testimony; ledger lost. ')+(chipHeld()?'The Filament chip ties the batteries to Vale\'s tables. ':'');
  const nell=state.twist?'Nell\'s forged order is part of the case.':state.choice==='person'?'Nell remains a trusted witness.':state.choice==='missed'?'The courier is missing since Station Road. Rook has two names on his desk now.':state.note?'Nell\'s note is in the file; she has not been found.':'Rook worked without Nell.';
  el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+ending.summary+' '+evidence+nell;
  button('[RETURN TO MENU]',openMenu);break;}
 }
}
// What Rook is doing right now, for the header.
function objective(){
 const s=sceneName,set=sets[s];
 if(state.phase==='coldCase')return 'CASE COLD';
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
 if(name==='tunnel'){state.radio=true;state.pursuit='ramp';state.gap=0;state.distance=20;state.phaseDistance=20;enter('tunnelEntry',true);return;}
 if(name==='canal'){state.caught=true;state.pursuit='ramp';state.hall='dive';}
 enter(name+'Entry',true);
}
