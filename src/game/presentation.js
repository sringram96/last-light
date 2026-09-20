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
 const cols=Math.max(1,...hud.card.textContent.split('\n').map(r=>r.length)),width=canvas.clientWidth||320;
 hud.card.style.fontSize=clamp(width/(cols*.62),7,15).toFixed(1)+'px';
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
 const d=phaseDef(phase);
 if(d){if(d.kind==='windup')return['GET READY','warn',2];if(d.stinger)return d.stinger();return null;}
 switch(phase){
  case 'danger':case 'pumpDanger':case 'clubFace':return['GET READY','warn',2];
  case 'ready':return['NOTED','hit',1.6];
  case 'result':return state.choice==='person'?['CAUGHT','hit']:state.choice==='book'?['SAVED','hit']:['TOO LATE','miss'];
  case 'stationReady':return['DECODED','hit',1.6];
  case 'pumpResult':return state.rescue==='valve'?['INLET CLOSED','hit']:state.rescue==='pull'?['BELL IS OUT','hit']:['TOO LATE','miss'];
  case 'roofSignal':return['SIGNAL','hit',1.6];
  case 'roofConfession':return['CONFESSION','hit',1.6];
  case 'clubResult':return state.club==='duck'?['DUCKED','hit']:state.club==='vault'?['OVER THE BAR','hit']:['HIT','miss'];
  case 'chaseBank':return state.firstMove==='dodge'?['CLEAR','hit']:state.firstMove==='brake'?['BRAKING','hit']:['CLIPPED','miss'];
  case 'chaseFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'tunnelFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'canalEnd':return['CASE CLOSED','chapter',4];
 }
 return null;
}
function presentEnter(phase,sceneChanged,wasEndingSeen){
 if(phase==='canalEnd'&&!wasEndingSeen&&session.mode==='story')recordCase();
 if(sceneChanged){chapterCard();return;}
 const s=stingerFor(phase);
 if(s){card(s[0],s[1],s[2]||1.8);cue({warn:'danger',hit:'hit',miss:'miss',chapter:'chapter'}[s[1]]);}
 else if(['chaseQteA','chaseQteB','tunnelQte'].includes(phase)||phaseDef(phase)?.kind==='prompt')cue('danger');
}
// Story order lets the case file describe how far the investigation has come.
const phaseOrder=['officeEntry','officeFile','officeBoard','officeWindow','brief','watch','ready','follow','danger','qte','result','evidence','deduce','loftTurn','loftEntry','loftTable','loftNote','loftBoard','loftLeave','arrival','stationEntry','stationQuiet','stationListen','stationReady','pumpEntry','pumpFind','pumpDanger','pumpQte','pumpResult','pumpTruth','roofEntry','roofQuiet','roofListen','roofSignal','roofConfession','tramEntry','tramRide','tramWatch','tramSpotted','tramArrive','marketEntry','marketAisle','marketKeeper','marketDanger','marketQte','marketResult','clubEntry','clubFace','clubQte','clubResult','chaseEntry','chaseQteA','chaseBank','chaseQteB','chaseFinish','tunnelEntry','tunnelQte','tunnelFinish','subEntry','subManifest','subDanger','subQte','subResult','subDawn','roomEntry','roomDeduce','roomName','canalEntry','canalEnd'];
function reached(phase){return phaseOrder.indexOf(state.phase)>=phaseOrder.indexOf(phase);}
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
 if(reached('roomName'))steps.push((proofHeld()?'Named the Board\'s man':'Left the line blank')+(state.slip?' (second try)':''));
 return steps.filter(Boolean);
}
// Persons of interest: the first line whose condition holds, in the beat sheet's order.
function boardEntries(){
 const at=reached,entries=[];
 entries.push(at('canalEnd')&&state.hall==='late'?'DETECTIVE ROOK, Night Division: case closed; walking with a stick for a month.':at('canalEnd')?'DETECTIVE ROOK, Night Division: case closed.':at('roomEntry')?'DETECTIVE ROOK, Night Division: back at the desk with what the night left him.':at('subEntry')?'DETECTIVE ROOK, Night Division: at Substation Nine, alone.':at('tramEntry')?'DETECTIVE ROOK, Night Division: pursuing Vale across the dark district.':at('pumpFind')?'DETECTIVE ROOK, Night Division: found Bell alive.':'DETECTIVE ROOK, Night Division, missing-persons desk.');
 entries.push(at('canalEnd')?'IVO BELL, lamplighter: home. His statement is on record.':at('roofEntry')?'IVO BELL, lamplighter: safe with the medic.':at('pumpFind')?'IVO BELL, lamplighter: found alive in Pump Room 4.':at('evidence')&&state.choice==='person'?'IVO BELL, lamplighter: alive, somewhere below the station.':at('evidence')?'IVO BELL, lamplighter: last logged at Pump Room 4.':'IVO BELL, lamplighter: missing since the station closed.');
 if(at('result'))entries.push(state.twist?'NELL MARROW, Bell\'s apprentice: confessed to forging the work order. Cooperating witness.':state.choice==='person'?'NELL MARROW, courier: cooperating witness. Says she is Bell\'s apprentice.':state.note?'THE COURIER: signed a note in Bell\'s loft with an N. Made the maintenance call. Not yet found.':'THE COURIER: limped away toward the station with Bell\'s lantern.');
 if(at('officeBoard'))entries.push(state.caught&&at('roomName')&&proofHeld()?'INSPECTOR VALE, Night Division: in custody. Signed order 7731 for the Board.':state.caught?'INSPECTOR VALE, Night Division: in custody.':at('canalEnd')?'INSPECTOR VALE, Night Division: at large; warrant issued.':at('subEntry')?'INSPECTOR VALE, Night Division: escaped tonight. His buyers are at Substation Nine.':at('pumpTruth')?'INSPECTOR VALE, Night Division: prime suspect. Sold the reserve batteries; locked Bell in.':at('stationQuiet')||(at('loftBoard')&&!state.misread)?'INSPECTOR VALE, Night Division: named on the battery order.':'INSPECTOR VALE, Night Division: grid security liaison to the Lumen Board. Office across the corridor.');
 if(at('marketDanger')||(at('tramSpotted')&&state.tail))entries.push(state.hall==='dive'?'KRANE, division sergeant on paper: arrested at Substation Nine under his own rack.':at('subResult')?'KRANE, division sergeant on paper: escaped from Substation Nine in the Board van.':at('subManifest')?'KRANE, Vale\'s bodyguard: at Substation Nine, loading the van.':at('marketDanger')?'KRANE, Vale\'s bodyguard: tried to run Rook down with a cell-cart at the night market.':'PLATE 41: a black division car following the tram with its lights off.');
 if(at('roofEntry'))entries.push(at('canalEntry')?'INES OKAFOR, city medic: brought Bell to the canal-side post. Bell will walk.':'INES OKAFOR, city medic: on the roof with Bell. Answers the roof radio.');
 if(state.radio)entries.push(state.pursuit==='ramp'&&state.caught&&state.tunnel==='left'?'HEDDY LASKO, bridge operator, call sign HALF HOUR: her tip about the maintenance channel put Rook ahead of Vale.':'HEDDY LASKO, bridge operator, call sign HALF HOUR: lifts the canal bridge at the half hour. Reported a Board van booked to Substation Nine.');
 if(state.keeper)entries.push(at('subEntry')?'MARTA QUILL, cell-stall keeper: right about the racks. Sells reserve cells on the market; will need a lawyer, and a witness fee.':'MARTA QUILL, cell-stall keeper: says the cells come from Substation Nine on Thursdays in a Board van.');
 if(at('subManifest')||(at('pumpTruth')&&ledgerHeld()))entries.push(at('roomName')&&proofHeld()?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: named on the warrant. Countersigned order 7731.':at('roomName')?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: suspected above Vale. No paper survives to name him.':at('subManifest')?'HALDEN ASHE, Commissioner of Reserve, Lumen Board: countersigned the Substation Nine manifest.':'H.A.: initials under Vale\'s signature on every ledger page. Unknown.');
 return entries;
}
// Reflex tally in the arcade sense: every timed prompt faced, and how many were answered before the deadline.
function reflexes(){
 let faced=0,hits=0;
 const count=(done,hit)=>{if(done){faced++;if(hit)hits++;}};
 count(reached('result'),state.choice!=='missed');
 count(reached('pumpResult'),state.rescue!=='late');
 if(pursuing()){
  count(reached('marketResult'),state.market!=='late');
  count(reached('clubResult'),state.club!=='late');
  count(reached('chaseBank'),state.firstMove!=='late');
  count(state.pursuit!=='ramp'&&state.pursuit!=='chasing'&&reached('chaseFinish'),state.pursuit!=='late');
  count(state.pursuit==='ramp'&&reached('tunnelFinish'),state.tunnel!=='late');
  count(reached('subResult'),state.hall!=='late');
 }
 return{faced,hits,grade:!faced?'-':hits===faced?'A':hits/faced>=.75?'B':hits/faced>=.5?'C':'D'};
}
// Six endings, evaluated top to bottom; every combination of fields lands on exactly one.
const endings=[
 {id:'home',name:'THE LAMPLIGHTER HOME',when:()=>state.pursuit==='stay',closing:'Bell is alive, and his testimony is on record. Vale\'s office was empty by dawn. Rook brought the missing man home, and the street will be lit tomorrow because Nell knows the route.',summary:'Rook stayed with Bell. Vale is at large; the search is a warrant now.'},
 {id:'board',name:'LIGHTS ON THE BOARD',when:()=>state.caught&&proofHeld(),closing:'Bell is alive. Vale is in custody, and the name above his is on the warrant. As the station lamps go dark, this time it is only because morning has arrived.',summary:'Vale arrested; Halden Ashe of the Lumen Board named on the paper Rook kept dry.'},
 {id:'word',name:'WORD AGAINST WORD',when:()=>state.caught,closing:'Bell is alive. Vale is in custody, and it is Bell\'s word against a Night Division inspector\'s. The lamps go out along the canal because the sun is up. It will have to be enough.',summary:'Vale arrested on Bell\'s testimony. Nothing on paper names the Board.'},
 {id:'krane',name:'THE BODYGUARD TALKS',when:()=>!state.caught&&kranePinned(),closing:'Bell is alive. Vale is gone, but his bodyguard is in a splint in the room next to Vale\'s office, and Krane has begun to talk. The lamps go dark along the canal; morning has come.',summary:'Vale escaped. Krane arrested at Substation Nine; his statement opens the Board.'},
 {id:'paper',name:'THE PAPER TRAIL',when:()=>!state.caught&&proofHeld(),closing:'Bell is alive. Vale is at large, but the paper is dry and it names the Board. The warrant has two names on it, and the lamps go dark because it is morning.',summary:'Vale escaped. The signed paper names Vale and Ashe; the warrant is out.'},
 {id:'dark',name:'A VOICE IN THE DARK',when:()=>true,closing:'Bell is alive. Vale remains at large, the hall is burned, and the man who signed for him is a set of initials. The missing-person case is closed; the warrant is just beginning.',summary:'Vale escaped with everything but Bell. Only Bell\'s voice remains.'}
];
function endingFor(){return endings.find(e=>e.when());}
function endingId(){return endingFor().id;}
const discoveries=[['observe',"Studied the courier's limp"],['witness','Made Nell a witness'],['record','Read the intact dispatch entry'],['tape','Decoded the maintenance tape'],['ledger',"Recovered Vale's signed ledger"],['band','Heard the bridge operator'],['confession',"Recorded Nell's confession"],['ramp','Cut Vale off on the service ramp'],['jump','Cleared the lifting bridge'],['chip','Pocketed a Filament chip'],['undercity','Ran Vale down in the storm drains'],['flawless','Closed the case without a rewind'],['note',"Found Nell's note in the loft"],['tail','Spotted the tail from the tram roof'],['keeper',"Heard the stall keeper's tip"],['vine',"Found the Filament's back door"],['manifest',"Saved the Board's manifest"],['pinned','Pinned Krane under his own rack'],['ashe',"Named the Board's man first try"],['sharp','Every deduction right first time']];
function discovered(){
 const found={observe:state.watched,witness:state.choice==='person',record:state.choice==='book',tape:state.decoded,ledger:state.rescue==='valve',band:state.radio,confession:state.twist,ramp:state.pursuit==='ramp'&&state.caught&&state.tunnel==='left',jump:state.pursuit==='jump'&&state.caught,chip:state.club==='vault',undercity:state.pursuit==='ramp'&&state.caught,flawless:state.rewinds===3,note:state.note,tail:state.tail,keeper:state.keeper,vine:state.market==='cut',manifest:state.hall==='breaker',pinned:state.hall==='dive',ashe:proofHeld()&&!state.slip,sharp:!state.wrong&&!state.misread&&!state.slip};
 return discoveries.filter(([id])=>found[id]).map(([id])=>id);
}
function recordCase(){saveStore.record({ending:endingId(),discoveries:discovered()});}
function caseReport(){
 const r=reflexes(),name=endingFor().name;
 const found=session.mode==='preview'?'preview':saveStore.readRecords().endings.length+'/'+endings.length+' found';
 return 'ENDING: '+name+' ('+found+'). Reflex '+r.hits+'/'+r.faced+', grade '+r.grade+', rewinds used '+(3-state.rewinds)+'.';
}
function renderRecords(){
 if(!hud.records)return;
 const r=saveStore.readRecords();hud.records.replaceChildren();
 const line=text=>{const li=document.createElement('li');li.textContent=text;hud.records.appendChild(li);};
 line('ENDINGS '+r.endings.length+'/'+endings.length+(r.cases?' / CASES CLOSED '+r.cases:''));
 for(const e of endings)line((r.endings.includes(e.id)?e.name:'?????').padEnd(20,' ')+(r.endings.includes(e.id)?'  reached':'  not yet'));
 line('DISCOVERIES '+r.discoveries.length+'/'+discoveries.length);
 for(const [id,name] of discoveries)if(r.discoveries.includes(id))line(name);
}
// Narration types in below the scene; the full sentence is announced once to assistive technology.
let captionFull='',captionShown=0;
function typeCaption(){
 const n=Math.min(captionFull.length,Math.floor(captionShown));
 typedText.textContent=captionFull.slice(0,n);veiledText.textContent=captionFull.slice(n);
}
function presentUI(){
 const full=el.caption.textContent;
 if(full!==captionFull){
  captionFull=full;
  const d=phaseDef();
  captionShown=(reduce||session.menu||isQte()||['danger','pumpDanger','clubFace'].includes(state.phase)||(d&&d.kind==='windup'))?full.length:0;
  if(hud.said)hud.said.textContent=full;
 }
 el.caption.replaceChildren();el.caption.appendChild(typedText);el.caption.appendChild(veiledText);typeCaption();
 if(hud.route)hud.route.textContent=routeSteps().join('  >  ')||'The case begins.';
 if(hud.board){hud.board.replaceChildren();for(const text of boardEntries()){const li=document.createElement('li');li.textContent=text;hud.board.appendChild(li);}}
 const r=reflexes();if(hud.score)hud.score.textContent=(r.faced?'REFLEX '+r.hits+'/'+r.faced+' // ':'')+(session.menu||state.phase==='brief'&&session.mode!=='story'?'':'REWIND x'+state.rewinds+' // ');
 if(hud['records-box'])hud['records-box'].hidden=!session.menu;
 if(session.menu){renderRecords();if(cardTone!=='title')card('LAST LIGHT','title',Infinity);}
 else if(cardTone==='title')clearCard();
 if(hud.sound){hud.sound.textContent=state.sound?'[SOUND ON]':'[SOUND OFF]';hud.sound.setAttribute('aria-pressed',String(state.sound));}
}
function presentTick(dt){
 if(cardText&&cardLeft!==Infinity){cardLeft-=dt;if(cardLeft<=0)clearCard();}
 if(captionShown<captionFull.length){captionShown+=dt*70;typeCaption();}
}
