// The story driver. Phases registered as data (registry.js and src/game/sets/) run through the generic rules below;
// the original hand-written phases keep their code here and in runtime.js.
const caseTitles={stationEntry:'02 / NORTH STATION',stationQuiet:'THE DESK IS STILL WARM',stationListen:'READING THE MAINTENANCE TAPE',stationReady:'A USEFUL PRECAUTION',pumpEntry:'03 / PUMP ROOM 4',pumpFind:'BELL IS ALIVE',pumpDanger:'THE PIPE IS GIVING WAY',pumpQte:'THE WATER IS RISING',pumpResult:'OUT OF THE WATER',pumpTruth:'WHY BELL DISAPPEARED',roofEntry:'04 / ABOVE THE CITY',roofQuiet:'A MOMENT TO BREATHE',roofListen:'LISTENING TO THE BAND',roofSignal:'A VOICE IN THE STATIC',roofConfession:'THE FORGED ORDER',clubEntry:'05 / THE FILAMENT',clubBooth:'THE BACK BOOTH',clubFace:'VALE SEES ROOK',clubQte:'THE BOTTLE',clubResult:'THE BACK DOOR',chaseEntry:'06 / THE ELEVATED ROAD',chaseQteA:'FREIGHT IN YOUR LANE',chaseBank:'UNDER THE SIGNAL GANTRIES',chaseQteB:'THE BRIDGE IS LIFTING',chaseFinish:'ONE LAST TURN',tunnelEntry:'07 / THE UNDERCITY',tunnelQte:'THE DRAIN FORKS',tunnelFinish:'OUT OF THE DARK',canalEntry:'10 / FIRST LIGHT',canalEnd:'CASE CLOSED'};
const liveCase=['stationEntry','pumpEntry','pumpDanger','pumpResult','roofEntry','clubEntry','clubFace','clubResult','chaseEntry','chaseBank','chaseFinish','tunnelEntry','tunnelFinish','canalEntry'];
const qtePhases=['qte','pumpQte','clubQte','chaseQteA','chaseQteB','tunnelQte'];
const observePhases=['watch','stationListen','roofListen'];
const resultPhases=['result','pumpResult','clubResult','chaseBank','chaseFinish','tunnelFinish'];
function isQte(){const d=phaseDef();return d?d.kind==='prompt':qtePhases.includes(state.phase);}
function isObserving(){const d=phaseDef();return d?d.kind==='observe':observePhases.includes(state.phase);}
function isResult(){const d=phaseDef();return d?d.kind==='result':resultPhases.includes(state.phase);}
function isLive(){const d=phaseDef();return d?['cutscene','windup','result','death'].includes(d.kind):['follow','danger','result','arrival',...liveCase].includes(state.phase);}
function isWindup(p=state.phase){const d=phaseDef(p);return d?d.kind==='windup':['danger','pumpDanger','clubFace'].includes(p);}
function isInvestigating(){return phaseDef()?.kind==='investigate';}
// Investigate beats: a quiet look around a set. The examined spots live in the beat's saved bitmask; which spot is selected
// (its caption and camera) is a session detail, and the previous one lets the blocking walk Rook back from it.
let spotId='',spotPrev='';
const popcount=n=>{let c=0;for(;n;n>>=1)c+=n&1;return c;};
function investigateSpot(){const d=phaseDef(picturePhase());if(!d||d.kind!=='investigate')return null;return d.spots.find(s=>s.id===spotId)||null;}
function investigatePrevious(){return spotPrev;}
const spotShown=(d,s)=>!s.after||!!(state[d.field]&s.after);
const spotSeen=(d,s)=>!!(state[d.field]&s.bit);
// A beat with turns has time for that many looks; once they are spent the unexamined spots close and only the exit is left.
const lookLeft=d=>d.turns?Math.max(0,d.turns-popcount(state[d.field])):Infinity;
const spotOpen=(d,s)=>spotShown(d,s)&&(spotSeen(d,s)||lookLeft(d)>0);
function investigateOpen(d=phaseDef()){const bits=d.spots.filter(s=>spotShown(d,s)).reduce((m,s)=>m|s.bit,0);return popcount(state[d.field]&bits)>=d.need;}
// Selecting a spot: its bit is saved, its clue and enter() run once, its caption replaces the beat's line through the caption
// queue, and the camera eases to its shot from wherever it stands. An examined spot re-reads for nothing.
function investigate(spot){
 if(!isInvestigating()||state.paused||session.menu||transit)return false;
 const d=phaseDef(),s=typeof spot==='string'?d.spots.find(x=>x.id===spot):spot;
 if(!s||!spotOpen(d,s))return false;
 if(!spotSeen(d,s)){state[d.field]|=s.bit;if(s.enter)s.enter();const clue=typeof s.clue==='function'?s.clue():s.clue;if(clue)addClue(clue);cue('clue');}
 if(spotId===s.id)replayCaption();else{spotPrev=spotId;spotId=s.id;transitionFrom={...camera};state.event=0;}
 ui();render();checkpoint();return true;
}
// Number keys pick spots by their label's number; a tap picks the marker whose rectangle it lands in.
function investigateKey(n){const d=phaseDef();return !!d&&d.kind==='investigate'&&investigate(d.spots[n-1]);}
function investigateAt(clientX,clientY){const id=labelAt(clientX,clientY,l=>l.spot)?.spot;return !!id&&investigate(id);}
function investigateUI(d){
 const seen=spotId?d.spots.find(s=>s.id===spotId):null,left=lookLeft(d);
 el.caption.textContent=(seen?seen.look():d.caption?d.caption():'')+(seen&&d.pressure?' '+d.pressure():'');
 if(d.turns)el.phase.textContent=d.title+' / '+(left?left+(left===1?' LOOK':' LOOKS')+' LEFT':'NO TIME LEFT');
 for(const s of d.spots)if(spotOpen(d,s))button(typeof s.label==='function'?s.label():s.label,()=>investigate(s),spotSeen(d,s)?'lc-seen':'');
 if(investigateOpen(d))button(d.exit.label,()=>enter(nextOf(d.exit)));
 if(d.exit.early&&d.exit.early.when())button(d.exit.early.label,()=>enter(nextOf(d.exit.early)));
}
// 00 / NIGHT DIVISION. The arrival, then the desk: four spots, two of them before the stairs. The looks are the old
// cutscene captions for now; docs/design/INVESTIGATION.md replaces them.
const officeSpotShot=()=>look(3.2,2,-.5,-3,1.25,8);// from the front corner: the board left, the desk and the window right
registerPhases('office',{
 officeEntry:{kind:'cutscene',title:'00 / NIGHT DIVISION',duration:6,next:'officeDesk',
  caption:()=>'Halvard, 23:40, the ninth night of rain. The Lumen Board rations the city\'s power, and the towers uptown buy most of it. The low streets stay lit only because lamplighters walk them each night, switching every lamp on by hand from its own reserve battery. Ivo Bell, senior lamplighter of the station route, has been missing four nights, and his street is going dark. Missing persons is Rook\'s desk at Night Division, and his lamp is the last one burning on the floor.',
  buttons:b=>b('[SKIP INTRO]',()=>enter('brief'))},
 officeDesk:{kind:'investigate',title:'THE DESK',field:'officeLooked',need:2,step:'Looked over the desk',shot:officeSpotShot,
  caption:()=>'The file, the case board, the dispatch log and the window. Rook looks the desk over before he takes the stairs.',
  spots:[
   {id:'file',bit:1,at:()=>[-.45,2,8.2],label:'[1] THE BELL FILE',ease:5,shot:()=>look(2.3,1.45,6.4,-1.6,1.2,8.8),
    look:()=>'The Bell file came down from across the corridor already stamped NO FURTHER ACTION. Last seen at the closed North Station; since then a stranger has been walking his route with his lantern. Rook has countersigned that stamp on a hundred files without asking whose it was. Rook: "Not this one."'},
   // The board: three seconds on the two photographs, then a glance out through the open door across the corridor to Vale's dark door.
   {id:'board',bit:2,at:()=>[-7.55,3.55,5.6],label:'[2] THE CASE BOARD',ease:3,
    shot:()=>{const a=look(-2.4,1.8,3.6,-7.9,2.7,5.8);return state.event<3||reduce?a:blendShot(a,look(-6.6,1.6,-6.6,-14,1.5,-10.5),smooth(clamp((state.event-3)/2,0,1)));},
    clue:'Case board: Inspector Aurel Vale of Night Division is the Lumen Board\'s grid security liaison. His office is next to Rook\'s.',
    look:()=>'On the case board, beside Bell\'s photograph, a Lumen Board commendation for INSPECTOR A. VALE, GRID SECURITY LIAISON, initialled H.A. at the foot. His office is the dark one across the corridor. Rook: "Vale signs his name like a man who has never been asked to read it back."'},
   {id:'log',bit:4,at:()=>[-2.05,1.5,8.45],label:'[3] THE DISPATCH LOG',ease:4,shot:()=>look(-1,2.1,6,-2.05,1.15,8.45),
    look:()=>'The dispatch log: a maintenance call at 00:17 for Pump Room 4, logged to I. BELL. The hand is not Bell\'s.'},
   {id:'window',bit:8,at:()=>[0,2.9,15.9],label:'[4] THE WINDOW',ease:6,shot:()=>look(-2.2,2.2,6,0,2.4,16),
    look:()=>'Uptown the towers burn all night. Below the window Station Road is down to a few lamps, and one lantern is moving between them, lighting the rest. Rook takes his coat.'}
  ],
  exit:{label:'[TAKE THE STAIRS]',next:'brief'}}
});
// 02 / NORTH STATION. The maintenance desk: the order that names Vale, the tape that says which wheel, the hatch with
// its Division padlock, the departures board and, under the order, a cup somebody left warm. The knocking gives Rook time
// for three of the five; what he reads decides what he can think at the hatch and what he knows at the inlet.
const knockLines=['','The knocking goes on under the floor: three short, a rest, three short.','The knocking is slower now. The rests are getting longer.','The knocking stops, then starts again, weaker. Rook has looked long enough.'];
registerPhases('station',{
 stationDesk:{kind:'investigate',title:'THE MAINTENANCE DESK',field:'stationLooked',need:2,turns:3,step:'Searched the maintenance desk',
  caption:()=>'The desk is still lit, and under the floor someone is striking a pipe. Rook has time for three things here, not five.',
  pressure:()=>knockLines[popcount(state.stationLooked)]||'',
  spots:[
   {id:'order',bit:1,at:()=>[.4,1.7,19.3],label:'[1] THE ORDER',ease:3,shot:()=>look(-.2,1.9,17.6,.4,1.25,19.3),
    clue:'Maintenance desk: order 7731, RESERVE BATTERIES, signed INSPECTOR VALE, countersigned H.A., stamped by the Lumen Board. Dated tonight.',
    look:()=>state.loftLooked&2?'A fresh order on the desk: RESERVE BATTERIES / ORDER 7731 / INSPECTOR VALE, the number from Bell\'s map. Countersigned in a second hand, H.A. Dated tonight.':'A fresh order on the desk: RESERVE BATTERIES / ORDER 7731 / INSPECTOR VALE. Countersigned in a second hand, H.A., and stamped by the Lumen Board. Dated tonight.'},
   {id:'tape',bit:2,at:()=>[0,2.7,19.75],label:'[2] THE TAPE',ease:3,shot:()=>look(-1.2,1.9,17.4,0,2.05,19.6),enter:()=>{state.decoded=true;},
    clue:'The maintenance tape says: close the INLET wheel before pulling someone off the flooded platform.',
    look:()=>'A maintenance tape, still turning, its leader marked FLOOD PROCEDURE / PUMP ROOMS. Rook runs it back to the one line that matters: FLOOD RESCUE, CLOSE INLET FIRST.'},
   {id:'hatch',bit:4,at:()=>[0,5.3,43.4],label:'[3] THE HATCH',ease:4,shot:()=>look(-1.6,1.9,30,0,2.2,43.8),
    clue:'The Pump Room 4 hatch carries a Division-issue padlock, hanging open.',
    look:()=>'PUMP ROOM 4, stencilled on the service hatch. A new padlock hangs open on its hasp, Division issue, the same pattern as the one on Rook\'s own locker.'},
   {id:'board',bit:8,at:()=>[0,5.6,21],label:'[4] THE DEPARTURES BOARD',ease:3,shot:()=>look(-1.2,2.2,15,0,4.7,21),
    clue:'Departures board: BOARD VAN / BAY 2 / 01:30. A Lumen Board van is due at the closed station tonight.',
    look:()=>'The departures board still runs on the station\'s reserve. Last train: a year ago. Under it, tonight\'s line: BOARD VAN / BAY 2 / 01:30. The Board still uses this station.'},
   {id:'cup',bit:16,after:1,at:()=>[-1.5,1.8,19.6],label:'[5] THE CUP',ease:3,shot:()=>look(-2.4,1.8,17.8,-1.5,1.3,19.6),
    clue:'The cup beside order 7731 was still warm. Vale left the desk minutes before Rook reached it.',
    look:()=>'A tin cup beside the order, still warm. Whoever signed for the batteries was sitting here ten minutes ago, and left without the cup.'}
  ],
  exit:{label:'[THE KNOCKING BELOW]',next:'stationTheory'}},
 // The hatch: before he goes down Rook commits to who put Bell there, from what he read. The names on offer are the ones
 // his evidence supports; going down without one is always open. Vale is right. Any other answer costs the minute it took,
 // and suspecting the courier costs what she would have said on the roof, or, with her gone, the band Rook fills with her.
 stationTheory:{kind:'quiet',title:'WHO PUT BELL DOWN THERE?',
  caption:()=>{const has=theoryEvidence();return (has.length?'Rook has '+listed(has)+'.':'Rook has the knocking and nothing else.')+' Before he goes down, who does he think locked Bell under the station?';},
  buttons:b=>{
   const pick=who=>()=>{state.theory=who;if(who!=='vale')addClue(theoryClues[who]());enter('pumpEntry');};
   if(valeNamed())b('[INSPECTOR VALE]',pick('vale'));
   if(courierNamed())b(state.choice==='person'||state.note?'[NELL MARROW]':'[THE COURIER]',pick('nell'));
   if(boardNamed())b('[THE LUMEN BOARD]',pick('board'));
   b('[NO THEORY. GO DOWN]',pick('none'));
  }}
});
const listed=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function theoryEvidence(){
 const l=state.stationLooked,has=[];
 if(orderRead())has.push('order 7731, signed by Vale and countersigned H.A.');if(l&16)has.push('a cup beside it, still warm');
 if(l&4)has.push('a Division padlock on the hatch');if(l&8)has.push('a Board van due at 01:30');
 if(callSeen())has.push('a call logged to Bell in someone else\'s hand');if(state.note)has.push('a note in Bell\'s loft signed N');
 if(state.officeLooked&2&&!orderRead())has.push('Vale\'s name on the case board');
 return has;
}
const valeNamed=()=>!!(orderRead()||state.stationLooked&4||state.officeLooked&2);
const courierNamed=()=>callSeen()||state.note;
const boardNamed=()=>!!(orderRead()||state.stationLooked&8);
const theoryClues={
 nell:()=>state.choice==='person'?'Rook accused Nell at the hatch of North Station. She has not spoken to him since.':'Rook put the courier\'s description out on the Division band from North Station. Every Division car can hear it.',
 board:()=>'Rook watched Bay 2 for the Board van before he went down. It never came.',
 none:()=>'Rook went down to Pump Room 4 without a theory.'};
// What the theory costs later: any answer but Vale is a minute at the hatch; suspecting the courier also closes her mouth
// (with her there) or fills the band with Rook's own call (without her).
const lateDown=()=>!!state.theory&&state.theory!=='vale';
const nellWary=()=>state.theory==='nell'&&state.choice==='person';
const bandBusy=()=>state.theory==='nell'&&state.choice!=='person';
// The tape told Rook which wheel: at the inlet the wheel's cue flashes alone for the first beat and Bell's comes up after it.
// Without the tape both flash together. Either direction is live from the first frame.
const inletFirst=()=>state.phase==='pumpQte'&&state.decoded&&!state.untimed&&!reduce&&state.event<.6;
// 03 / PUMP ROOM 4. The crime scene: a door bolted from outside, an inlet opened to full with its stop pin taken, and
// four nights of knocking worn into the paint. Rook has a minute before he takes Bell up.
registerPhases('pump',{
 pumpRoom:{kind:'investigate',title:'THE ROOM BELL WAS LOCKED IN',field:'pumpLooked',need:2,step:'Searched Pump Room 4',
  caption:()=>state.rescue==='valve'?'The inlet is shut and the water is falling. Rook has a minute, and he uses it to look at the room.':'The water is at the walkway\'s edge. Rook has less than a minute, and he uses it to look at the room.',
  spots:[
   {id:'door',bit:1,at:()=>[0,4.4,33.5],label:'[1] THE DOOR',ease:4,shot:()=>look(1.2,2.2,24,0,1.8,33.8),
    clue:'Pump Room 4\'s platform door was bolted from outside and padlocked with Division issue. Someone locked Bell in.',
    look:()=>state.stationLooked&4?'The platform door, bolted from the outside. On the bolt a Division padlock, closed, the twin of the open one upstairs. The same hand locked both.':'The platform door, bolted from the outside. On the bolt a Division padlock, closed, keyed like the one on the concourse hatch. Bell did not lock himself in.'},
   {id:'ledger',bit:2,at:()=>state.rescue==='valve'?[2.5,.7,15.4]:[5.1,.3,17.7],label:()=>state.rescue==='valve'?'[2] THE LEDGER':'[2] THE SATCHEL',ease:3,
    shot:()=>state.rescue==='valve'?look(1.4,1.6,13.2,2.5,.2,15.4):look(2.8,2.2,13.8,5.1,-.5,17.7),
    clue:()=>state.rescue==='valve'?'Ledger pages: lot numbers, a buyer\'s code, and THE FILAMENT named as the handover point.':'Bell\'s satchel lies under the water at the platform\'s foot. The ledger is in it and cannot be recovered tonight.',
    look:()=>state.rescue==='valve'?'Bell\'s ledger, dry. Transfer by transfer: lot numbers, a buyer\'s code, THE FILAMENT as the handover, Vale\'s signature, and under each entry the same initials, H.A.':'The satchel, a metre down in black water at the platform\'s foot, out of reach. The ledger is in it. By morning the pages will be pulp.'},
   {id:'wheel',bit:4,at:()=>[-1.25,2.3,11.8],label:'[3] THE INLET WHEEL',ease:3,shot:()=>look(-2.4,2,9.6,-1.25,1.35,11.9),
    clue:'The Pump Room 4 inlet was opened to full and its stop pin removed. The flood was deliberate.',
    look:()=>'The inlet wheel, its stop pin gone, the gate set to full. Somebody opened it full and took the pin so it would stay open. The flood was set.'},
   {id:'pipe',bit:8,at:()=>[4.8,3.3,17.3],label:'[4] THE PIPE',ease:3,shot:()=>look(2.6,3.2,12.4,5.5,7.4,17),
    clue:'Bell tapped the pipe for four nights in the lamplighters\' knock. Nobody at the desk above answered.',
    look:()=>state.stationLooked&16?'The pipe Bell struck, its paint worn bright: three short, a rest, three short, for four nights. Somebody sat upstairs with a warm cup and heard it.':'The pipe Bell struck. The paint is worn bright in one place: three short, a rest, three short, for four nights. Somebody upstairs had to have heard it.'}
  ],
  exit:{label:'[WHAT BELL KNOWS]',next:'pumpTruth'}}
});
// Prompt windows, measured from the first flash of the cue: a base per beat, +0.5 s for an earlier observation, -0.5 s for
// an earlier injury, never under 1.25 or over 3.5 seconds. Registered prompts carry their base and modifiers (or a window()).
const orderRead=()=>!!(state.stationLooked&1||state.loftLooked&2),callSeen=()=>!!(state.officeLooked&4);
const padlockSeen=()=>!!(state.pumpLooked&1),tinHeld=()=>!!(state.subLooked&8);
function caseDuration(){
 const p=state.phase,d=phaseDef(),win=(base,bonus,penalty)=>clamp(base+(bonus?.5:0)-(penalty?.5:0),1.25,3.5);
 if(d&&d.kind==='prompt')return d.window?d.window():win(d.base,d.bonus?.(),d.penalty?.());
 if(p==='qte')return win(3,state.watched,false);
 if(p==='pumpQte')return clamp(win(2.5,state.decoded,state.wrong)-(lateDown()?.5:0),1.25,3.5);
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
const setFields={street:{choice:'',watched:false,wrong:false},loft:{note:false,loftSeen:false,misread:false},station:{decoded:false,theory:''},pump:{rescue:''},roof:{radio:false,twist:false,pursuit:'',caught:false,gap:0},tram:{tail:false},market:{keeper:false,market:''},club:{club:'',shown:false},chase:{firstMove:'',gap:0,pursuit:'chasing',caught:false},tunnel:{tunnel:'',caught:false},substation:{hall:''},room:{slip:false,stalled:false,roomPick:''}};
function restartChapter(){
 const name=sceneName,entry=entryPhases[name]||'brief';
 Object.assign(state,setFields[name]||{},{rewinds:3,restarts:Math.min(9,state.restarts+1),dead:'',endingSeen:false,reaction:0,paused:false});
 if(['chase','tram','tunnel'].includes(name)){state.distance=20;state.phaseDistance=20;}
 Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};
 clearCard();enter(entry,true);chapterCard();
}
// Leaving a cold case for the menu clears the checkpoint (no case to continue); the records keep the cold count.
function abandonCase(){saveStore.clear();showIdle();}
function caseEnter(phase){
 if(phase==='chaseEntry'||phase==='tramEntry'){state.distance=20;state.phaseDistance=20;}
 const name=sceneFor(phase);
 if(setScene(name)){Object.assign(camera,name==='street'?startShot:sceneStart(name));transitionFrom={...camera};}
 state.phaseDistance=state.distance;state.roomPick='';
 state.rewound=phase===rewindTo;rewindTo='';cueFirstFrame=frame+1;
 if(isWindup(phase))windupSeconds=reduce||state.untimed?2:1.5+hash(Math.floor(state.t*1000),3);
 if(phase==='deduce')ladder.street=state.wrong?1:0;if(phase==='loftBoard')ladder.loft=state.misread?1:0;if(phase==='roomDeduce')ladder.room=state.slip?1:0;
 spotId='';spotPrev='';// an investigate beat opens on its own line with nothing selected; its examined bits are the checkpoint's
 const d=phaseDef(phase);if(d){if(d.kind==='death'){if(state.rewinds>0)state.rewinds--;state.deaths|=d.bit;}if(d.enter)d.enter();return;}
 if(phase==='tunnelQte')tunnelFork=state.distance+30;
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
 const c=cutsceneEnd();if(c){if(done(c.duration))enter(c.next);return;}
 if(d){
  if(d.kind==='observe'&&e>=8)enter(nextOf(d));
  else if(d.kind==='windup'&&e>=windupSeconds)enter(nextOf(d));
  else if(d.kind==='prompt'&&!state.untimed&&e>=caseDuration())promptMiss();
  else if(d.kind==='result'&&done(d.duration||4)&&!canRewind())enter(nextOf(d));
  else if(d.kind==='death'&&done(d.duration||4)){
   if(state.rewinds>0){d.reset();state.reaction=0;card('REWIND','hit',1.4);cue('clue');rewindTo=d.back;enter(d.back);}
   else{state.dead=d.dead;enter('coldCase');}
  }
  return;
 }
 if(p==='stationListen'&&e>=8)enter('stationReady');
 else if(p==='pumpDanger'&&e>=windupSeconds)enter('pumpQte');
 else if(p==='pumpQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='pumpResult'&&done(4)&&!canRewind())enter('pumpRoom');
 else if(p==='roofListen'&&e>=8)enter('roofSignal');
 else if(p==='clubFace'&&e>=windupSeconds)enter('clubQte');
 else if(p==='clubQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='clubResult'&&done(4)&&!canRewind())startChase();
 else if(p==='chaseQteA'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='chaseBank'&&done(6)&&!canRewind())enter('chaseQteB');
 else if(p==='chaseQteB'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='chaseFinish'&&done(6)&&!canRewind())enter('subEntry');
 else if(p==='tunnelQte'&&!state.untimed&&e>=caseDuration())promptMiss();
 else if(p==='tunnelFinish'&&done(6)&&!canRewind())enter('subEntry');
}
// Every cutscene's end: registered ones by kind, the hand-written case and street ones from these tables (the street's
// run from runtime.js's loop). A cutscene ends when its picture has played and its caption could be read; a tap, Enter or
// Space ends it as soon as both are true (endCutscene), so a fast reader is not held past the text.
const cutsceneEnds={stationEntry:['stationDesk',7],pumpEntry:['pumpFind',6],roofEntry:['roofQuiet',8],clubEntry:['clubBooth',8],chaseEntry:['chaseQteA',6],tunnelEntry:['tunnelQte',6],canalEntry:['canalEnd',7]};
const streetCutscenes={follow:['danger',8],loftTurn:['loftEntry',4],arrival:['stationEntry',5]};
function cutsceneEnd(p=state.phase){
 const d=phaseDef(p);if(d)return d.kind==='cutscene'?{next:nextOf(d),duration:d.duration}:null;
 const c=cutsceneEnds[p]||streetCutscenes[p];return c?{next:c[0],duration:c[1]}:null;
}
function endCutscene(){
 const c=cutsceneEnd();if(!c||state.paused||session.menu||transit)return false;
 const duration=reduce&&c.duration>2?1:c.duration;
 if(!captionDone()||state.event<duration)return false;
 enter(c.next);return true;
}
// Bell's answer against the name Rook brought down the ladder.
const theoryVerdicts={vale:()=>'It is the name Rook came down with. ',nell:()=>state.choice==='person'?'Not the courier. Nell heard Rook accuse her, and she heard Bell clear her. ':'Not the courier. Rook\'s call for her is still going out on the band. ',board:()=>'Not a Board driver: Vale\'s own hand on the bolt. ',none:()=>''};
function roofActions(){
 if(!state.radio&&!bandBusy())button('[LISTEN TO THE RADIO / 8s]',()=>enter('roofListen'));
 button('[PURSUE VALE]',pursuit);button('[STAY WITH BELL]',stayWithBell);
}
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
  if(d.kind==='investigate')investigateUI(d);
  if(d.kind==='prompt')promptUI(el.caption.textContent,d.cues.map(c=>[c.label,c.dir]));
  if(d.buttons)d.buttons(button);
  if(d.kind==='result')rewindActions();
  if(state.phase==='coldCase'){el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+(state.dead==='pump'?'Bell did not come out of Pump Room 4. Vale signed the report.':'Rook did not see the morning. Vale signed the report.')+' Deaths seen this case: '+deathCount()+'.';}
  return;
 }
 el.phase.textContent=caseTitles[state.phase]||'THE LAST LIGHT';
 switch(state.phase){
 case 'stationEntry':el.caption.textContent='Rook: "Every minute I spend up here is one Bell spends down there." '+(state.choice==='person'?'Nell opens the service door with three taps. Footsteps echo through the empty concourse.':'The service latch gives under Rook\'s shoulder. Inside, a maintenance desk glows in an otherwise empty station.');break;
 case 'stationQuiet':
  el.caption.textContent='Below the floor, someone strikes a pipe: three short, a rest, three short. The tape is still turning.';
  button('[READ THE TAPE / 8s]',()=>enter('stationListen'));button('[FOLLOW THE KNOCKING]',()=>enter('pumpEntry'));break;
 case 'stationListen':el.caption.textContent='Rook feeds the tape through its reader. Rain ticks against the roof glass. The knocking below continues.';break;
 case 'stationReady':
  el.caption.textContent='The tape warns: "FLOOD RESCUE: CLOSE INLET FIRST." Rook knows which wheel to reach for. Extra reaction time earned.';
  button('[FOLLOW THE KNOCKING]',()=>enter('pumpEntry'));break;
 case 'pumpEntry':el.caption.textContent='Rook: "Get him out first. Questions after, if the water leaves us time." Under the station, pumps tower above black water. A man on the far platform is tapping a wrench against a pipe'+(lateDown()?', and the water is a hand higher than it was a minute ago.':'.');break;
 case 'pumpFind':
  el.caption.textContent=(state.wrong||lateDown()?'Bell: "Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark. I found his ledger, so he locked me down here." The water is at his knees. "You took your time. That pipe will not hold much longer."':'Bell: "Vale is selling the reserve batteries off my route, and every one he sells is a lamp that stays dark. I found his ledger, so he locked me down here. That pipe will not hold much longer."')+' '+(theoryVerdicts[state.theory]?.()||'')+'The INLET wheel is beside Rook.';
  button('[GET BELL OUT]',()=>enter('pumpDanger'));break;
 case 'pumpDanger':el.caption.textContent='A joint splits. Water surges under the platform. Get ready.';break;
 case 'pumpQte':
  promptUI(state.decoded?'The tape said inlet first. Close it, or pull Bell out.':'Close the INLET wheel, or pull Bell off the platform.',[['[1] CLOSE THE INLET','left'],['[2] PULL BELL OUT','right']]);break;
 case 'pumpResult':
  el.caption.textContent=state.rescue==='valve'?'Rook shuts the inlet, then helps Bell across. His satchel stays above the water.':state.rescue==='pull'?'Rook pulls Bell onto the walkway. His satchel drops into the torrent.':state.choice==='person'?'Nell throws a line. Rook and Nell haul Bell clear, but the water takes his satchel.':'Bell leaps as the platform breaks. Rook catches his sleeve. His satchel vanishes into the flood.';rewindActions();break;
 case 'pumpTruth':
  el.caption.textContent=(state.rescue==='valve'?(state.officeLooked&2?'The dry ledger carries Vale\'s signature, and under every entry initials Bell does not know. Rook does: H.A., from the commendation on his own case board. ':'The dry ledger carries Vale\'s signature, and under every entry a second set of initials, H.A., that Bell does not know. ')+'Bell: "Forty years on this route. I know which lamps were never meant to come back on. I kept this instead of bringing it to your floor, because I did not know which desk up there was safe."':'Bell: "Forty years on this route. I know which lamps were never meant to come back on. Vale sold them, and when I faced him with it he locked me in. The ledger was in that satchel; I kept it off your floor because I did not know which desk was safe. I will say it in court."');
  button('[TAKE BELL TO THE ROOF]',()=>enter('roofEntry'));break;
 case 'roofEntry':el.caption.textContent='Rook: "Bell is breathing, and Vale does not know it yet, but that will not last the hour." On the roof the city opens beneath them: the towers uptown blazing, the low streets dark. Ines Okafor, a city medic, is waiting by the roof radio with a blanket.';break;
 case 'roofQuiet':
  el.caption.textContent='Bell is safe with the medic. Far below, a red car pulls away from the station forecourt and heads west under the elevated road, toward the market and the Filament\'s sign. The last tram of the night is crossing the dark district the same way.'+(bandBusy()?' The roof radio is full of Rook\'s own call for the courier; nothing else is getting through.':nellWary()?' Nell stands at the far parapet and does not come over.':'');
  roofActions();break;
 case 'roofListen':el.caption.textContent='Rook waits on the open channel. Traffic slides through the rain. A bridge operator comes through the static.';break;
 case 'roofSignal':
  el.caption.textContent=state.choice==='person'&&nellWary()?'Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Nell listens from the parapet. Whatever she knows about Bell\'s work order, she is not telling the man who accused her.':state.choice==='person'?'Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Beside the receiver, Nell goes quiet. "There is something about Bell\'s work order I should tell you."':'Radio: "Bridge lifting at the half hour. Lower ramp is clear to the basin. Board van booked through to Nine." Rook now knows a way to intercept Vale and has extra time at every turn of the road.';
  if(state.choice==='person'&&!nellWary())button('[ASK NELL ABOUT THE ORDER]',()=>enter('roofConfession'));
  roofActions();break;
 case 'roofConfession':
  el.caption.textContent='Nell: "I wrote the maintenance call myself. Nobody reads a lamplighter\'s complaint, but a job logged at the station puts Bell\'s name beside Vale\'s order. I wanted Vale on paper. I did not think about the water." Rook writes it down.';
  roofActions();break;
 case 'clubEntry':el.caption.textContent='Rook: "Vale is in there, spending what Bell\'s lamps were worth. I go in alone, and every table is his." '+(state.market==='cut'?'Vale\'s red car sits in Vine Alley. Inside: neon, velvet, a stage, a bar, and nobody looks up. Rook comes in by the back; Krane is already at the booth.':'Vale\'s red car sits outside The Filament. Inside: neon and velvet, a stage, a long bar, and tables full of people who do not look up.');break;
 // The back booth: Vale has a face and a line before the bottle. Showing him the order is texture with a price (half a second
 // at the bottle, Krane already up); his answer is typed here, where it is said, and the windup keeps its ten words.
 case 'clubBooth':
  el.caption.textContent=state.shown?'Rook puts order 7731 on the table. Vale reads his own signature and does not deny it. "Reserve batteries. Signed. Nobody reads a maintenance order." He slides it back. "Least of all you, Rook. You have countersigned a hundred of mine." Krane is already on his feet.':state.faced?'Vale does not get up. "Twice in one night, Rook. You are still on the wrong floor. Go back to your desk and stamp something." Krane\'s hand is on a bottle.':'Vale does not get up. "Rook. You are on the wrong floor for this. Go back to your desk and stamp something." Krane\'s hand is on a bottle.';
  if(state.shown)button('[STAND YOUR GROUND]',()=>enter('clubFace'));
  else{if(orderRead())button('[SHOW HIM ORDER 7731]',()=>{state.shown=true;addClue('Vale, shown order 7731 at The Filament, did not deny signing it. His words: "Nobody reads a maintenance order."');ui();});button('[SAY NOTHING]',()=>enter('clubFace'));}
  break;
 case 'clubFace':el.caption.textContent=state.shown?'The bottle leaves Krane\'s hand. Get ready.':'"Put the light down." Krane rises. Get ready.';break;
 case 'clubQte':
  promptUI('Duck under the bottle, or vault the bar and cut Krane off.',[['[1] DUCK','down'],['[2] VAULT THE BAR','up']]);break;
 case 'clubResult':
  el.caption.textContent=state.club==='duck'?'The bottle bursts on the neon behind Rook. Vale is already through the back door and into his car.':state.club==='vault'?'Rook goes over the bar and lands between Krane and the booth. Vale\'s chip case spills across the table. Rook pockets one chip and follows him out.':state.rescue==='valve'?'The bottle takes Rook on the temple and the carpet comes up to meet him. Krane goes through his coat, says "Sit down, detective. The set is not over," and follows Vale out with Bell\'s ledger in his jacket.':'The bottle takes Rook on the temple and the carpet comes up to meet him. Krane stands over him long enough to say "Sit down, detective. The set is not over," and follows Vale out.';rewindActions();break;
 case 'chaseEntry':el.caption.textContent='Rook: "If Vale reaches the towers tonight, nobody on our floor will ever bring him back down." The patrol car is in Vine Alley with the keys in, as dispatch promised. Vale\'s red tail lights race ahead into the elevated traffic.';break;
 case 'chaseQteA':
  promptUI('Freight in the lane. Brake and lose ground, or dive right.',[['[1] BRAKE','down'],['[2] DIVE RIGHT','right']]);break;
 case 'chaseBank':el.caption.textContent=state.firstMove==='dodge'?'Rook swings right and surges past the carrier. Vale is still within reach.':state.firstMove==='brake'?'The patrol car falls back under braking. Rook needs an interception route.':'The patrol car clips the carrier and fishtails. Rook recovers, but Vale has opened a long gap.';rewindActions();break;
 case 'chaseQteB':
  // With the gap open and the band heard, Heddy's warning makes the jump a choice, not a trap; her line is the one prompt caption over twelve words.
  promptUI(state.gap===0?'The bridge is lifting. Follow Vale over, or take the lower ramp.':(state.radio?'Heddy on the channel: "Whoever you are chasing, do not follow him over my gap." ':'The bridge is lifting. ')+'Vale is too far ahead. Take the ramp.',[['[1] TAKE THE LOWER RAMP','left'],['[2] FOLLOW OVER THE GAP','up']]);break;
 case 'chaseFinish':
  el.caption.textContent=state.caught?'The patrol car clears the gap. Rook forces Vale to stop at the basin exit, under the lit windows of Substation Nine.':state.pursuit==='late'?'Rook stands on the brakes and the patrol car meets the rising deck at walking pace. Vale\'s lights cross the far span and drop toward the basin. Rook goes down to Substation Nine on foot, under the lit windows across the water.':'The gap is already too wide. Rook aborts the jump and brakes hard. Vale gets away toward the basin, where Substation Nine is lit at one in the morning.';rewindActions();break;
 case 'tunnelEntry':el.caption.textContent='Rook: "Lose him down here and he comes up anywhere he likes." The service ramp drops below the road into the storm drains. Vale\'s tail lights bounce off wet brick, and the sound of two engines fills the tunnel.';break;
 case 'tunnelQte':
  promptUI(state.radio?'Heddy said the left channel reaches the basin first. Vale goes right.':'The drain forks. Vale goes right, under the canal gate.',[['[1] FOLLOW RIGHT','right'],['[2] CUT LEFT','left']]);break;
 case 'tunnelFinish':
  el.caption.textContent=state.caught?(state.tunnel==='left'?'Rook takes the maintenance channel and bursts from the basin outfall ahead of Vale. The red car stops with nowhere left to go, under the lit windows of Substation Nine.':'Rook stays on Vale\'s lights through the right branch and forces him against the canal gate. Across the basin, Substation Nine is lit at one in the morning.'):state.tunnel==='late'?'Rook brakes at the fork. Both branches are dark. Vale is gone, but every drain here ends at the basin, and the basin is lit by Substation Nine.':state.tunnel==='left'?'The maintenance channel ends at a locked gate. By the time Rook backs out, Vale is gone. The outfall beyond opens onto the basin and Substation Nine\'s lit windows.':'Vale has too much road. His lights vanish under the canal gate, toward the basin and the lit windows of Substation Nine.';rewindActions();break;
 case 'canalEntry':el.caption.textContent='Rook: "I went out for one missing man. Whatever else tonight cost, he is coming home." '+(state.pursuit==='stay'?'Rook stayed with Bell and escorted him to the canal-side medics. Dawn catches the windows across the water.':state.caught?'Vale is in custody. Rook returns to Bell as the first light reaches the canal.':'Vale escaped tonight. Rook returns to Bell, who is waiting beside the canal with the medics.');break;
 case 'canalEnd':{
  const ending=endingFor();
  el.caption.textContent=typeof ending.closing==='function'?ending.closing():ending.closing;
  const evidence=(ledgerHeld()?'Evidence: signed ledger recovered. ':manifestHeld()?'Evidence: the Substation Nine manifest. ':state.rescue==='valve'&&state.club==='late'?'Evidence: the signed ledger, lost to Krane at The Filament. ':'Evidence: Bell\'s testimony; ledger lost. ')+(chipHeld()?'The Filament chip ties the batteries to Vale\'s tables. ':'');
  const nell=state.twist?'Nell\'s forged order is part of the case.':nellWary()?'Nell gave her statement to the desk sergeant, not to Rook.':state.choice==='person'?'Nell remains a trusted witness.':state.choice==='missed'?'The courier is missing since Station Road. Rook has two names on his desk now.':state.note?'Nell\'s note is in the file; she has not been found.':'Rook worked without Nell.';
  el.outcome.hidden=false;el.outcome.textContent=caseReport()+' '+ending.summary+' '+evidence+nell;
  button('[RETURN TO MENU]',showIdle);break;}
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
 // Sets past the station preview a night in which Rook read the order at the desk.
 if(!['loft','station'].includes(name))state.stationLooked=1;
 const set=sets[name];
 if(set&&set.preview){enter(set.preview(),true);return;}
 if(name==='club'){state.pursuit='chasing';enter('clubEntry',true);return;}
 if(name==='chase'){state.radio=true;state.pursuit='chasing';enter('chaseEntry',true);return;}
 if(name==='tunnel'){state.radio=true;state.pursuit='ramp';state.gap=0;state.distance=20;state.phaseDistance=20;enter('tunnelEntry',true);return;}
 if(name==='canal'){state.caught=true;state.pursuit='ramp';state.hall='dive';}
 enter(name+'Entry',true);
}
