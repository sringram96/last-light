// Game presentation around the scene: arcade title cards, typed narration, the case file, reflex score and case records.
// Nothing here draws on the canvas. The approved ASCII scene stays exactly as rendered.
const hud=Object.fromEntries(['card','said','route','board','records','records-box','score','sound'].map(k=>[k,root.querySelector('.lc-'+k)]));
const typedText=document.createElement('span'),veiledText=document.createElement('span');
typedText.className='lc-typed';veiledText.className='lc-veil';
// A 5-row block font, printable ASCII only, for chapter cards and action stingers.
const blockFont={
 A:' # |# #|###|# #|# #',B:'## |# #|## |# #|## ',C:' ##|#  |#  |#  | ##',D:'## |# #|# #|# #|## ',E:'###|#  |## |#  |###',F:'###|#  |## |#  |#  ',G:' ##|#  |# #|# #| ##',H:'# #|# #|###|# #|# #',I:'###| # | # | # |###',J:'###|  #|  #|# #| # ',K:'# #|# #|## |# #|# #',L:'#  |#  |#  |#  |###',M:'#   #|## ##|# # #|#   #|#   #',N:'#   #|##  #|# # #|#  ##|#   #',O:' # |# #|# #|# #| # ',P:'## |# #|## |#  |#  ',Q:' # |# #|# #| # |  #',R:'## |# #|## |# #|# #',S:' ##|#  | # |  #|## ',T:'###| # | # | # | # ',U:'# #|# #|# #|# #|###',V:'# #|# #|# #|# #| # ',W:'#   #|#   #|# # #|## ##|#   #',X:'# #|# #| # |# #|# #',Y:'# #|# #| # | # | # ',Z:'###|  #| # |#  |###',
 0:'###|# #|# #|# #|###',1:' # |## | # | # |###',2:'## |  #| # |#  |###',3:'###|  #| ##|  #|###',4:'# #|# #|###|  #|  #',5:'###|#  |## |  #|## ',6:' ##|#  |###|# #|###',7:'###|  #| # | # | # ',8:'###|# #|###|# #|###',9:'###|# #|###|  #|## ',
 '/':'  #|  #| # |#  |#  ','-':'   |   |###|   |   ','.':'   |   |   |   | # ','!':' # | # | # |   | # ','?':'## |  #| # |   | # ',':':'   | # |   | # |   ',"'":' # | # |   |   |   ',' ':'  |  |  |  |  '
};
function banner(text){
 const rows=['','','','',''];
 for(const c of text.toUpperCase()){const glyph=(blockFont[c]||blockFont[' ']).split('|');for(let i=0;i<5;i++)rows[i]+=glyph[i]+' ';}
 return rows.map(r=>r.replace(/\s+$/,'')).join('\n');
}
let cardText='',cardTone='',cardLeft=0;
function fitCard(){
 if(!hud.card)return;
 // The card lives in a permanently reserved slot beside the picture, so it never moves the caption or the buttons: the font
 // fits the slot's width as before and is capped so five block-font rows (line-height 1.05) fit the slot's height.
 const slot=root.querySelector('.lc-card-slot'),cols=Math.max(1,...hud.card.textContent.split('\n').map(r=>r.length));
 const width=(slot&&slot.clientWidth)||canvas.clientWidth||320,rows=slot&&slot.clientHeight?slot.clientHeight/5.25:15;
 hud.card.style.fontSize=clamp(Math.min(width/(cols*.62),rows),7,15).toFixed(1)+'px';
}
function card(text,tone='chapter',seconds=3){
 cardText=text;cardTone=tone;cardLeft=seconds;
 if(!hud.card)return;
 hud.card.textContent=banner(text);hud.card.className='lc-card lc-card--'+tone;hud.card.hidden=false;fitCard();
}
function clearCard(){cardText='';cardTone='';cardLeft=0;if(hud.card){hud.card.hidden=true;hud.card.textContent='';}}
const chapterCards={office:'NIGHT DIVISION',street:'STATION ROAD',station:'NORTH STATION',pump:'PUMP ROOM 4',roof:'ABOVE THE CITY',club:'THE FILAMENT',chase:'THE PURSUIT',tunnel:'THE UNDERCITY',canal:'FIRST LIGHT'};
function chapterCard(){card(sets[sceneName]?.card||chapterCards[sceneName]||'LAST LIGHT','chapter',3);cue('chapter');}
// Each story beat can announce itself like an arcade laserdisc cut: a windup warning, a landed move or a miss.
function stingerFor(phase){
 // Windups carry no card: the cut is the warning and the cue's flash is the call.
 const d=phaseDef(phase);
 if(d){if(d.kind==='windup')return null;if(d.stinger)return d.stinger();return null;}
 switch(phase){
  case 'ready':return['NOTED','hit',1.6];
  case 'result':return state.choice==='person'?['CAUGHT','hit']:state.choice==='book'?['SAVED','hit']:['TAKEN','miss'];
  case 'stationReady':return['DECODED','hit',1.6];
  case 'pumpResult':return state.rescue==='valve'?['INLET CLOSED','hit']:state.rescue==='pull'?['BELL IS OUT','hit']:['TOO LATE','miss'];
  case 'roofSignal':return['SIGNAL','hit',1.6];
  case 'roofConfession':return['CONFESSION','hit',1.6];
  case 'clubResult':return state.club==='duck'?['DUCKED','hit']:state.club==='vault'?['OVER THE BAR','hit']:['SIT DOWN','miss'];
  case 'chaseBank':return state.firstMove==='dodge'?['CLEAR','hit']:state.firstMove==='brake'?['BRAKING','hit']:['CLIPPED','miss'];
  case 'chaseFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'tunnelFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'canalEnd':return['CASE CLOSED','chapter',4];
 }
 return null;
}
function presentEnter(phase,sceneChanged,wasEndingSeen){
 if((phase==='canalEnd'||phase==='coldCase')&&!wasEndingSeen&&session.mode==='story')recordCase();
 if(sceneChanged){chapterCard();return;}
 const s=stingerFor(phase);
 if(s){card(s[0],s[1],s[2]||1.8);cue({warn:'danger',hit:'hit',miss:'miss',chapter:'chapter'}[s[1]]);}
 else if(['chaseQteA','chaseQteB','tunnelQte'].includes(phase)||phaseDef(phase)?.kind==='prompt')cue('danger');
}
// Story order lets the case file describe how far the investigation has come.
const phaseOrder=['officeEntry','officeFile','officeBoard','officeWindow','brief','watch','ready','follow','danger','qte','result','evidence','deduce','loftTurn','loftEntry','loftTable','loftNote','loftBoard','loftStair','loftLeave','arrival','stationEntry','stationQuiet','stationListen','stationReady','pumpEntry','pumpFind','pumpDanger','pumpQte','pumpDeath','pumpResult','pumpTruth','roofEntry','roofQuiet','roofListen','roofSignal','roofConfession','tramEntry','tramRide','tramWatch','tramSpotted','tramArrive','marketEntry','marketAisle','marketKeeper','marketDanger','marketQte','marketDeath','marketResult','clubEntry','clubBooth','clubFace','clubQte','clubResult','chaseEntry','chaseQteA','chaseDeath','chaseBank','chaseQteB','gapDeath','chaseFinish','tunnelEntry','tunnelQte','tunnelDeath','tunnelFinish','subEntry','subDock','subManifest','subDanger','subQte','subDeath','subResult','subDawn','roomEntry','roomVale','roomDeduce','roomName','canalEntry','canalEnd','coldCase'];
// A cold case stands where the death that closed it stands.
function reached(phase){return phaseOrder.indexOf(picturePhase())>=phaseOrder.indexOf(phase);}
const deathLabels=[['pump','drowned','Watched the water take Bell'],['market','arc','Went down among the cells'],['carrier','edge','Went over the barrier'],['gap','gap','Followed Vale over the gap'],['pier','pier','Met the pier in the drain'],['rack','crushed',"Went under Krane's rack"]];
const deathsSeen=()=>deathLabels.filter((_,i)=>state.deaths&(1<<i)).map(([,id])=>id);
const coldSteps={pump:'Case cold at the pump',market:'Case cold at the market',carrier:'Case cold on the elevated road',gap:'Case cold at the bridge',pier:'Case cold in the drain',rack:'Case cold at Substation Nine'};
function routeSteps(){
 const steps=[];
 if(reached('follow'))steps.push(state.watched?'Watched first':'Followed at once');
 if(reached('result'))steps.push({person:'Caught the courier',book:'Saved the book',missed:'Missed the fall'}[state.choice]);
 if(state.wrong)steps.push('Chased a false lead');
 if(state.loftSeen)steps.push('Climbed to the loft');
 if(state.note)steps.push('Read Nell\'s note');
 if(state.misread)steps.push('Misread the photographs');
 if(reached('pumpEntry'))steps.push(state.decoded?'Read the tape':'Followed the knocking');
 if(reached('pumpResult'))steps.push({valve:'Closed the inlet',pull:'Pulled Bell out',late:'Late at the pump'}[state.rescue]);
 if(state.radio)steps.push('Listened to the band');
 if(state.twist)steps.push("Heard Nell's confession");
 if(state.pursuit==='stay')steps.push('Stayed with Bell');
 else if(state.pursuit){
  steps.push('Pursued Vale');
  if(state.tail)steps.push('Spotted the tail');
  if(state.keeper)steps.push('Asked the stall keeper');
  if(reached('marketResult'))steps.push({slip:'Slipped the cart',cut:'Went over the stalls',late:'Took the cart'}[state.market]);
  if(reached('clubResult'))steps.push({duck:'Ducked the bottle',vault:'Went over the bar',late:'Took the bottle'}[state.club]);
  if(reached('chaseBank'))steps.push({dodge:'Dove right',brake:'Braked',late:'Clipped the carrier'}[state.firstMove]);
  if(reached('chaseQteB')&&state.pursuit!=='chasing')steps.push({ramp:'Took the ramp',jump:'Jumped the gap',late:'Stopped at the bridge'}[state.pursuit]);
  if(state.pursuit==='ramp'&&reached('tunnelFinish'))steps.push({right:'Followed right',left:'Cut left',late:'Braked at the fork'}[state.tunnel]);
  if(reached('subResult'))steps.push({dive:'Dived clear',breaker:'Pulled the breaker',late:'Crushed at the rack'}[state.hall]);
 }
 if(reached('roomName'))steps.push((proofHeld()&&!state.stalled?'Named the Board\'s man':'Left the line blank')+(state.slip?' (second try)':''));
 if(state.restarts)steps.push('Restarted a chapter'+(state.restarts>1?' x'+state.restarts:''));
 if(state.dead)steps.push(coldSteps[state.dead]);
 return steps.filter(Boolean);
}
// Persons of interest: the first line whose condition holds, in the beat sheet's order.
function boardEntries(){
 const at=reached,entries=[];
 if(state.dead){
  entries.push(state.dead==='pump'?'DETECTIVE ROOK, Night Division: found Bell alive, and could not keep him that way.':'DETECTIVE ROOK, Night Division: killed on duty. Report signed by Inspector Vale.');
  entries.push(state.dead==='pump'?'IVO BELL, lamplighter: drowned in Pump Room 4. Report signed by Inspector Vale.':at('roofEntry')?'IVO BELL, lamplighter: safe with the medic.':'IVO BELL, lamplighter: found alive in Pump Room 4.');
  entries.push('INSPECTOR VALE, Night Division: signed the report. Still on the floor.');
  return entries;
 }
 entries.push(at('canalEnd')&&state.hall==='late'?'DETECTIVE ROOK, Night Division: case closed; walking with a stick for a month.':at('canalEnd')?'DETECTIVE ROOK, Night Division: case closed.':at('roomEntry')?'DETECTIVE ROOK, Night Division: back at the desk with what the night left him.':at('subEntry')?'DETECTIVE ROOK, Night Division: at Substation Nine, alone.':at('tramEntry')?'DETECTIVE ROOK, Night Division: pursuing Vale across the dark district.':at('pumpFind')?'DETECTIVE ROOK, Night Division: found Bell alive.':'DETECTIVE ROOK, Night Division, missing-persons desk.');
 entries.push(at('canalEnd')?'IVO BELL, lamplighter: home. His statement is on record.':at('roofEntry')?'IVO BELL, lamplighter: safe with the medic.':at('pumpFind')?'IVO BELL, lamplighter: found alive in Pump Room 4.':at('evidence')&&state.choice==='person'?'IVO BELL, lamplighter: alive, somewhere below the station.':at('evidence')?'IVO BELL, lamplighter: last logged at Pump Room 4.':'IVO BELL, lamplighter: missing since the station closed.');
 if(at('result'))entries.push(state.twist?'NELL MARROW, Bell\'s apprentice: confessed to forging the work order. Cooperating witness.':state.choice==='person'?'NELL MARROW, courier: cooperating witness. Says she is Bell\'s apprentice.':state.choice==='missed'?'THE COURIER: taken from Station Road by a red car with its lights off. A second missing person on Rook\'s desk.':state.note?'THE COURIER: signed a note in Bell\'s loft with an N. Made the maintenance call. Not yet found.':'THE COURIER: limped away toward the station with Bell\'s lantern.');
 // Story order is one list for both routes, so the pursuit's beats read as reached on the stay route too: pursuit-only lines are guarded.
 const chase=pursuing();
 if(at('officeBoard'))entries.push(state.caught&&at('roomName')&&proofHeld()?'INSPECTOR VALE, Night Division: in custody. Signed order 7731 for the Board.':state.caught?'INSPECTOR VALE, Night Division: in custody.':at('canalEnd')?'INSPECTOR VALE, Night Division: at large; warrant issued.':chase&&at('subEntry')?'INSPECTOR VALE, Night Division: escaped tonight. His buyers are at Substation Nine.':at('pumpTruth')?'INSPECTOR VALE, Night Division: prime suspect. Sold the reserve batteries; locked Bell in.':state.faced?'INSPECTOR VALE, Night Division: met Rook under Bell\'s loft at midnight. Knows Rook is on it.':at('stationQuiet')||(at('loftBoard')&&!state.misread)?'INSPECTOR VALE, Night Division: named on the battery order.':'INSPECTOR VALE, Night Division: grid security liaison to the Lumen Board. Office across the corridor.');
 if(chase&&(at('marketDanger')||(at('tramSpotted')&&state.tail)))entries.push(state.hall==='dive'?'KRANE, division sergeant on paper: arrested at Substation Nine under his own rack.':at('subResult')?'KRANE, division sergeant on paper: escaped from Substation Nine in the Board van.':at('subManifest')?'KRANE, Vale\'s bodyguard: at Substation Nine, loading the van.':at('clubResult')&&state.club==='late'&&state.rescue==='valve'?'KRANE, Vale\'s bodyguard: has the signed ledger. Took it off Rook at The Filament.':at('marketDanger')?'KRANE, Vale\'s bodyguard: tried to run Rook down with a cell-cart at the night market.':'PLATE 41: a black division car following the tram with its lights off.');
 if(at('roofEntry'))entries.push(at('canalEntry')?'INES OKAFOR, city medic: brought Bell to the canal-side post. Bell will walk.':'INES OKAFOR, city medic: on the roof with Bell. Answers the roof radio.');
 if(state.radio)entries.push((state.pursuit==='ramp'&&state.caught&&state.tunnel==='left'?'HEDDY LASKO, bridge operator, call sign HALF HOUR: her tip about the maintenance channel put Rook ahead of Vale.':'HEDDY LASKO, bridge operator, call sign HALF HOUR: lifts the canal bridge at the half hour. Reported a Board van booked to Substation Nine.')+(chase&&at('tramRide')?' Keeps a dated log of Vale\'s crossings.':''));
 if(state.keeper)entries.push(at('subEntry')?'MARTA QUILL, cell-stall keeper: right about the racks. Sells reserve cells on the market; will need a lawyer, and a witness fee.':'MARTA QUILL, cell-stall keeper: says the cells come from Substation Nine on Thursdays in a Board van.');
 // Ashe: seen on the dock first, then read off the manifest, then named or not at the warrant.
 if((chase&&at('subDock'))||(at('pumpTruth')&&ledgerHeld()))entries.push(at('roomName')&&proofHeld()?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: named on the warrant. Countersigned order 7731.':at('roomName')?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: suspected above Vale. No paper survives to name him.':chase&&at('subManifest')?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: countersigned the Substation Nine manifest.':chase&&at('subDock')?'THE GREY MAN: Lumen Board, by the pin. Watched the loading from the dock and left dry.':'H.A.: initials under Vale\'s signature on every ledger page. Unknown.');
 return entries;
}
// The tally in the arcade sense: every action beat faced (entered), how many were landed (a rewound beat counts once, with
// the value it finally carries; a miss or a death is not a landing), the deaths seen and the chapters restarted.
// Grade A: no deaths. B: one or two. C: otherwise.
function reflexes(){
 let faced=0,landed=0;
 const count=(done,values,value)=>{if(done){faced++;if(values.includes(value))landed++;}};
 count(reached('qte'),['person','book'],state.choice);
 count(reached('pumpQte'),['valve','pull'],state.rescue);
 if(pursuing()){
  count(reached('marketQte'),['slip','cut'],state.market);
  count(reached('clubQte'),['duck','vault'],state.club);
  count(reached('chaseQteA'),['dodge','brake'],state.firstMove);
  count(reached('chaseQteB'),['ramp','jump'],state.pursuit);
  count(state.pursuit==='ramp'&&reached('tunnelQte'),['right','left'],state.tunnel);
  count(reached('subQte'),['dive','breaker'],state.hall);
 }
 const deaths=deathsSeen().length;
 return{faced,landed,deaths,restarts:state.restarts,grade:deaths===0?'A':deaths<=2?'B':'C'};
}
// Seven endings, evaluated top to bottom; every combination of fields lands on exactly one. A cold case comes first, and
// the Board's ending stands above the stay route so an arrest in Vale's own building with the dry ledger reaches it.
const endings=[
 {id:'cold',name:'THE CASE GOES COLD',when:()=>state.dead!=='',closing:'',summary:'The case went cold. Vale signed the report.'},
 {id:'board',name:'LIGHTS ON THE BOARD',when:()=>state.caught&&proofHeld()&&!state.stalled,closing:'Bell is alive. Vale is in custody, and the name above his is on the warrant. As the station lamps go dark, this time it is only because morning has arrived.',summary:'Vale arrested; Halden Ashe of the Lumen Board named on the paper Rook kept dry.'},
 {id:'home',name:'THE LAMPLIGHTER HOME',when:()=>state.pursuit==='stay',closing:'Bell is alive, and his testimony is on record. Vale walked out of his own building at dawn with Rook\'s eyes on his back. Rook brought the missing man home, and the street will be lit tomorrow because Nell knows the route.',summary:'Rook stayed with Bell. Vale is at large; the search is a warrant now.'},
 // Closings that vary with the night are functions: the booth's words in Rook's notebook, Krane's silence, the courier taken.
 {id:'word',name:'WORD AGAINST WORD',when:()=>state.caught,closing:()=>'Bell is alive. Vale is in custody, and it is Bell\'s word against a Night Division inspector\'s. The lamps go out along the canal because the sun is up'+(state.shown?', and Vale\'s own words about the order are in Rook\'s notebook. It will have to be enough.':'. It will have to be enough.'),summary:'Vale arrested on Bell\'s testimony. Nothing on paper names the Board.'},
 {id:'krane',name:'THE BODYGUARD TALKS',when:()=>!state.caught&&kranePinned(),closing:()=>state.stalled?'Bell is alive. Vale is gone, and Krane, in a splint in the room next to Vale\'s office, has stopped talking until somebody offers him a deal. The lamps go dark along the canal; morning has come.':'Bell is alive. Vale is gone, but his bodyguard is in a splint in the room next to Vale\'s office, and Krane has begun to talk. The lamps go dark along the canal; morning has come.',summary:'Vale escaped. Krane arrested at Substation Nine; his statement opens the Board.'},
 {id:'paper',name:'THE PAPER TRAIL',when:()=>!state.caught&&proofHeld(),closing:'Bell is alive. Vale is at large, but the paper is dry and it names the Board. The warrant has two names on it, and the lamps go dark because it is morning.',summary:'Vale escaped. The signed paper names Vale and Ashe; the warrant is out.'},
 {id:'dark',name:'A VOICE IN THE DARK',when:()=>true,closing:()=>state.choice==='missed'?'Bell is alive. Nell Marrow is not found. Vale remains at large, the hall is burned, and the man who signed for him is a set of initials. One missing-person case is closed and another is open; the warrant is just beginning.':'Bell is alive. Vale remains at large, the hall is burned, and the man who signed for him is a set of initials. The missing-person case is closed; the warrant is just beginning.',summary:'Vale escaped with everything but Bell. Only Bell\'s voice remains.'}
];
function endingFor(){return endings.find(e=>e.when());}
function endingId(){return endingFor().id;}
const discoveries=[['observe',"Studied the courier's limp"],['witness','Made Nell a witness'],['record','Read the intact dispatch entry'],['tape','Decoded the maintenance tape'],['ledger',"Recovered Vale's signed ledger"],['band','Heard the bridge operator'],['confession',"Recorded Nell's confession"],['ramp','Cut Vale off on the service ramp'],['jump','Cleared the lifting bridge'],['chip','Pocketed a Filament chip'],['undercity','Ran Vale down in the storm drains'],['flawless','Closed the case without a rewind'],['note',"Found Nell's note in the loft"],['tail','Spotted the tail from the tram roof'],['keeper',"Heard the stall keeper's tip"],['vine',"Found the Filament's back door"],['manifest',"Saved the Board's manifest"],['pinned','Pinned Krane under his own rack'],['ashe',"Named the Board's man first try"],['sharp','Every deduction right first time'],['stayArrest','Arrested Vale in his own building'],['booth','Made Vale answer for order 7731']];
function discovered(){
 // Flawless: no death, no restart, and every beat faced was landed (a survivable miss carried is not flawless either).
 const r=reflexes();
 const found={observe:state.watched,witness:state.choice==='person',record:state.choice==='book',tape:state.decoded,ledger:state.rescue==='valve',band:state.radio,confession:state.twist,ramp:state.pursuit==='ramp'&&state.caught&&state.tunnel==='left',jump:state.pursuit==='jump'&&state.caught,chip:state.club==='vault',undercity:state.pursuit==='ramp'&&state.caught,flawless:state.deaths===0&&state.restarts===0&&r.landed===r.faced,note:state.note,tail:state.tail,keeper:state.keeper,vine:state.market==='cut',manifest:state.hall==='breaker',pinned:state.hall==='dive',ashe:proofHeld()&&!state.slip&&!state.stalled,sharp:!state.wrong&&!state.misread&&!state.slip&&!state.stalled,stayArrest:state.pursuit==='stay'&&state.caught,booth:state.shown};
 return discoveries.filter(([id])=>found[id]).map(([id])=>id);
}
function recordCase(){const ending=endingId();saveStore.record({ending,discoveries:discovered(),deaths:deathsSeen(),cold:ending==='cold'?1:0});}
function caseReport(){
 const r=reflexes(),name=endingFor().name;
 const found=session.mode==='preview'?'preview':saveStore.readRecords().endings.length+'/'+endings.length+' found';
 return 'ENDING: '+name+' ('+found+'). Inputs '+r.landed+'/'+r.faced+', deaths '+r.deaths+', restarts '+r.restarts+', grade '+r.grade+'.';
}
function renderRecords(){
 if(!hud.records)return;
 const r=saveStore.readRecords();hud.records.replaceChildren();
 const line=text=>{const li=document.createElement('li');li.textContent=text;hud.records.appendChild(li);};
 line('ENDINGS '+r.endings.length+'/'+endings.length+(r.cases?' / CASES CLOSED '+r.cases:'')+(r.cold?' / COLD '+r.cold:''));
 for(const e of endings)line((r.endings.includes(e.id)?e.name:'?????').padEnd(20,' ')+(r.endings.includes(e.id)?'  reached':'  not yet'));
 line('DISCOVERIES '+r.discoveries.length+'/'+discoveries.length);
 for(const [id,name] of discoveries)if(r.discoveries.includes(id))line(name);
 line('DEATHS SEEN '+r.deaths.length+'/'+deathLabels.length);
 for(const [,id,name] of deathLabels)if(r.deaths.includes(id))line(name);
}
// The header's lamps: three glyphs, one going dark per lamp spent.
const lampGlyphs=()=>'#'.repeat(clamp(state.rewinds,0,3))+'.'.repeat(3-clamp(state.rewinds,0,3));
// Narration beside the scene. A caption is split at sentence boundaries into chunks of at most 150 characters (two desktop
// lines, three phone lines); a chunk types at 45 characters a second and holds while it could be read (0.3 s a word), then
// the next one follows. A cutscene or result cannot end before every chunk has been read (holdFor); a tap on the picture or
// the caption, Space or Enter, completes the typing chunk or shows the next one, and never ends a beat early. The transition
// line of an exit beat is chunk zero of the next phase's queue, so it types during the glide and holds through the dissolve
// and the chapter card. The whole caption is announced once to assistive technology, not per chunk.
const chrome=Object.fromEntries(['file','full','drawer','picture','more','card-slot','chapter'].map(k=>[k,root.querySelector('.lc-'+k)]));
const CHUNK_MAX=150,TYPE_CPS=45;
let captionFull='',captionShown=0,captionScene='',captionPhase='',captionStash=null;
let queue={chunks:[],index:0,shown:0,time:0,instant:false,line:false,menu:false};
const words=text=>text.split(/\s+/).filter(Boolean).length;
const chunkHold=text=>{const w=words(text);return reduce?w*.3+.8:Math.max(2,text.length/TYPE_CPS+w*.3+.4);};
function chunkCaption(text){
 // Sentence ends: . ! ? with any closing quote, followed by space; an initial such as "I. BELL" is not an end. Sentences are
 // packed greedily up to the limit and never split; a single sentence over the limit is a writing bug and stays whole.
 const pieces=text.trim().split(/(?<=[.!?]["')\]]*)(?<!\b[A-Z]\.)\s+(?=\S)/).filter(Boolean),chunks=[];
 let current='';
 for(const piece of pieces){
  if(current&&current.length+1+piece.length>CHUNK_MAX){chunks.push(current);current=piece;}
  else current=current?current+' '+piece:piece;
 }
 if(current)chunks.push(current);
 return chunks.map(text=>({text,hold:chunkHold(text)}));
}
function newQueue(chunks,instant,extra={}){return{chunks,index:0,shown:0,time:0,instant,line:false,menu:session.menu,...extra};}
function startChunk(index){const c=queue.chunks[index];queue.index=index;queue.time=0;queue.shown=c&&queue.instant?c.text.length:0;typeCaption();}
function captionHold(){return queue.chunks.length?queue.chunks.reduce((s,c)=>s+c.hold,0)+.4:0;}
function captionDone(){const c=queue.chunks[queue.index];return !c||(queue.index===queue.chunks.length-1&&queue.shown>=c.text.length&&queue.time>=c.hold);}
function holdFor(seconds){return Math.max(seconds,captionHold());}
function advanceCaption(){
 const c=queue.chunks[queue.index];if(!c||state.paused)return;
 if(queue.shown<c.text.length){queue.shown=c.text.length;typeCaption();}
 else if(queue.index<queue.chunks.length-1)startChunk(queue.index+1);
}
function typeCaption(){
 const c=queue.chunks[queue.index],text=c?c.text:'',n=Math.min(text.length,Math.floor(queue.shown));captionShown=n;
 typedText.textContent=text.slice(0,n);veiledText.textContent=text.slice(n);
 if(chrome.more)chrome.more.textContent=c&&n>=text.length&&queue.index<queue.chunks.length-1?'TAP TO CONTINUE':'';
}
function captionAudit(){return{text:captionFull,chunks:queue.chunks.map(c=>c.text),holds:queue.chunks.map(c=>c.hold),index:queue.index,shown:Math.floor(queue.shown),time:queue.time,hold:captionHold(),done:captionDone(),line:queue.line,visible:typedText.textContent};}
function presentUI(){
 // The ending's report joins the closing caption as further chunks; the case file keeps the paragraph.
 const full=el.caption.textContent,extra=el.outcome&&!el.outcome.hidden?el.outcome.textContent:'',text=extra?full+' '+extra:full;
 if(text!==captionFull){
  const d=phaseDef(),inTransit=!!transit&&transit.caption===full&&!session.menu;
  const instant=reduce||session.menu||(!inTransit&&(isQte()||['danger','pumpDanger','clubFace'].includes(state.phase)||(d&&d.kind==='windup')));
  const chunks=chunkCaption(text),wasMenu=queue.menu,stash=captionStash;
  if(session.menu&&!wasMenu&&captionFull)captionStash={text:captionFull,queue};
  if(stash&&stash.text===text&&!session.menu){queue=stash.queue;captionStash=null;}// back from the menu: the beat's caption resumes where it was
  else if(inTransit)queue=newQueue(chunks,instant,{line:true});// the connecting line types during the exit beat
  else if(queue.line&&!session.menu){queue.chunks=[queue.chunks[0],...chunks];queue.line=false;queue.instant=instant;queue.menu=false;typeCaption();}// and stays chunk zero of the phase it leads to
  else{
   // Reduced motion cuts directly between sets; the connecting line then plays as chunk zero with its own hold.
   const line=reduce&&!session.menu&&captionScene&&sceneName!==captionScene&&captionPhase!=='brief'?transitionLine(captionScene,sceneName):'';
   queue=newQueue([...(line?chunkCaption(line):[]),...chunks],instant);startChunk(0);
  }
  captionFull=text;
  if(hud.said)hud.said.textContent=text;
 }
 captionScene=sceneName;captionPhase=state.phase;
 el.caption.replaceChildren();el.caption.appendChild(typedText);el.caption.appendChild(veiledText);typeCaption();
 if(hud.route)hud.route.textContent=routeSteps().join('  >  ')||'The case begins.';
 if(hud.board){hud.board.replaceChildren();for(const text of boardEntries()){const li=document.createElement('li');li.textContent=text;hud.board.appendChild(li);}}
 const r=reflexes();if(hud.score)hud.score.textContent=(r.faced?'REFLEX '+r.landed+'/'+r.faced+' // ':'')+(session.menu||state.phase==='brief'&&session.mode!=='story'?'':'LAMPS '+lampGlyphs()+' // ');
 if(hud['records-box'])hud['records-box'].hidden=!session.menu;
 if(session.menu){renderRecords();if(cardTone!=='title')card('LAST LIGHT','title',Infinity);}
 else if(cardTone==='title')clearCard();
 if(hud.sound){hud.sound.textContent=state.sound?'[SOUND ON]':'[SOUND OFF]';hud.sound.setAttribute('aria-pressed',String(state.sound));}
 presentChrome();
}
// The utility line and the top strip: settings show on the menu screen only, the drawer and fullscreen buttons reflect
// their state, and on a phone the header strings are shortened so the strip never wraps.
function presentChrome(){
 const open=drawerOpen(),fs=!!document.fullscreenElement,phone=typeof window.innerWidth==='number'&&window.innerWidth<=480;
 for(const b of [el.timing,el.mono,hud.sound])if(b)b.hidden=!session.menu;
 if(el.pause)el.pause.hidden=true;
 if(chrome.file){chrome.file.textContent=open?'[CLOSE FILE]':'[CASE FILE]';chrome.file.setAttribute('aria-expanded',String(open));}
 if(chrome.full){chrome.full.hidden=!document.fullscreenEnabled;chrome.full.textContent=fs?'[EXIT FULL SCREEN]':'[FULL SCREEN]';chrome.full.setAttribute('aria-pressed',String(fs));}
 if(phone){
  if(chrome.chapter)chrome.chapter.textContent=chrome.chapter.textContent.replace(/^(PREVIEW \/ )?[0-9]+[a-z]? \/ /,'$1').replace(/ \/\/ /g,' / ');
  if(hud.score)hud.score.textContent=hud.score.textContent.replace(/\b(REFLEX|REWIND|LAMPS) ?/g,'').replace(/ ?\/\/ ?/g,' / ').replace(/[ /]+$/,'');
 }
}
function presentTick(dt){
 if(cardText&&cardLeft!==Infinity){cardLeft-=dt;if(cardLeft<=0)clearCard();}
 const c=queue.chunks[queue.index];if(!c)return;
 queue.time+=dt;
 if(queue.shown<c.text.length){queue.shown=Math.min(c.text.length,queue.shown+dt*TYPE_CPS);typeCaption();}
 else if(queue.time>=c.hold&&queue.index<queue.chunks.length-1)startChunk(queue.index+1);
}
