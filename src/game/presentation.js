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
function chapterCard(){card(chapterCards[sceneName]||'LAST LIGHT','chapter',3);cue('chapter');}
// Each story beat can announce itself like an arcade laserdisc cut: a windup warning, a landed move or a miss.
function stingerFor(phase){
 switch(phase){
  case 'danger':case 'pumpDanger':case 'clubFace':return['GET READY','warn',2];
  case 'clubResult':return state.club==='duck'?['DUCKED','hit']:state.club==='vault'?['OVER THE BAR','hit']:['HIT','miss'];
  case 'tunnelFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'ready':return['NOTED','hit',1.6];
  case 'result':return state.choice==='person'?['CAUGHT','hit']:state.choice==='book'?['SAVED','hit']:['TOO LATE','miss'];
  case 'stationReady':return['DECODED','hit',1.6];
  case 'pumpResult':return state.rescue==='valve'?['INLET CLOSED','hit']:state.rescue==='pull'?['BELL IS OUT','hit']:['TOO LATE','miss'];
  case 'roofSignal':return['SIGNAL','hit',1.6];
  case 'roofConfession':return['CONFESSION','hit',1.6];
  case 'chaseBank':return state.firstMove==='dodge'?['CLEAR','hit']:state.firstMove==='brake'?['BRAKING','hit']:['CLIPPED','miss'];
  case 'chaseFinish':return state.caught?['GOT HIM','hit']:['GONE','miss'];
  case 'canalEnd':return['CASE CLOSED','chapter',4];
 }
 return null;
}
function presentEnter(phase,sceneChanged,wasEndingSeen){
 if(phase==='canalEnd'&&!wasEndingSeen&&session.mode==='story')recordCase();
 if(sceneChanged){chapterCard();return;}
 const s=stingerFor(phase);
 if(s){card(s[0],s[1],s[2]||1.8);cue({warn:'danger',hit:'hit',miss:'miss',chapter:'chapter'}[s[1]]);}
 else if(['chaseQteA','chaseQteB','tunnelQte'].includes(phase))cue('danger');
}
// Story order lets the case file describe how far the investigation has come.
const phaseOrder=['officeEntry','officeFile','officeWindow','brief','watch','ready','follow','danger','qte','result','evidence','deduce','arrival','ending','stationEntry','stationQuiet','stationListen','stationReady','pumpEntry','pumpFind','pumpDanger','pumpQte','pumpResult','pumpTruth','roofEntry','roofQuiet','roofListen','roofSignal','roofConfession','clubEntry','clubFace','clubQte','clubResult','chaseEntry','chaseQteA','chaseBank','chaseQteB','chaseFinish','tunnelEntry','tunnelQte','tunnelFinish','canalEntry','canalEnd'];
function reached(phase){return phaseOrder.indexOf(state.phase)>=phaseOrder.indexOf(phase);}
function routeSteps(){
 const steps=[];
 if(reached('follow'))steps.push(state.watched?'Watched first':'Followed at once');
 if(reached('result'))steps.push({person:'Caught the courier',book:'Saved the book',missed:'Missed the fall'}[state.choice]);
 if(state.wrong)steps.push('Chased a false lead');
 if(reached('pumpEntry'))steps.push(state.decoded?'Read the tape':'Followed the knocking');
 if(reached('pumpResult'))steps.push({valve:'Closed the inlet',pull:'Pulled Bell out',late:'Late at the pump'}[state.rescue]);
 if(state.radio)steps.push('Listened to the band');
 if(state.twist)steps.push("Heard Nell's confession");
 if(state.pursuit==='stay')steps.push('Stayed with Bell');
 else if(state.pursuit){
  steps.push('Pursued Vale');
  if(reached('clubResult'))steps.push({duck:'Ducked the bottle',vault:'Went over the bar',late:'Took the bottle'}[state.club]);
  if(reached('chaseBank'))steps.push({dodge:'Dove right',brake:'Braked',late:'Clipped the carrier'}[state.firstMove]);
  if(reached('chaseQteB')&&state.pursuit!=='chasing')steps.push({ramp:'Took the ramp',jump:'Jumped the gap',late:'Stopped at the bridge'}[state.pursuit]);
  if(state.pursuit==='ramp'&&reached('tunnelFinish'))steps.push({right:'Followed right',left:'Cut left',late:'Braked at the fork'}[state.tunnel]);
 }
 return steps.filter(Boolean);
}
function boardEntries(){
 const entries=[];
 entries.push('IVO BELL, lamplighter: '+(reached('roofEntry')?'safe with the medic.':reached('pumpFind')?'found alive in Pump Room 4.':reached('evidence')?(state.choice==='person'?'alive, somewhere below the station.':'last logged at Pump Room 4.'):'missing since the station closed.'));
 if(reached('result'))entries.push((state.choice==='person'?'NELL, courier: ':'THE COURIER: ')+(state.twist?'confessed to forging the work order.':state.choice==='person'?'cooperating witness.':"limped away toward the station with Bell's lantern."));
 if(reached('stationQuiet'))entries.push('INSPECTOR VALE: '+(state.caught?'in custody.':state.phase==='canalEnd'?'at large; warrant issued.':reached('pumpTruth')?'prime suspect. Sold the reserve batteries.':'named on the battery order.'));
 return entries;
}
// Reflex tally in the arcade sense: every timed prompt faced, and how many were answered before the deadline.
function reflexes(){
 let faced=0,hits=0;
 const count=(done,hit)=>{if(done){faced++;if(hit)hits++;}};
 count(reached('result'),state.choice!=='missed');
 count(reached('pumpResult'),state.rescue!=='late');
 if(state.pursuit&&state.pursuit!=='stay'){
  count(reached('clubResult'),state.club!=='late');
  count(reached('chaseBank'),state.firstMove!=='late');
  count(state.pursuit!=='ramp'&&state.pursuit!=='chasing'&&reached('chaseFinish'),state.pursuit!=='late');
  count(state.pursuit==='ramp'&&reached('tunnelFinish'),state.tunnel!=='late');
 }
 return{faced,hits,grade:!faced?'-':hits===faced?'A':hits/faced>=.75?'B':hits/faced>=.5?'C':'D'};
}
const endings=[['arrest-ledger','THE CLEAN ARREST'],['arrest-word','WORD AGAINST WORD'],['home','THE LAMPLIGHTER HOME'],['paper','THE PAPER TRAIL'],['dark','A VOICE IN THE DARK']];
const discoveries=[['observe',"Studied the courier's limp"],['witness','Made Nell a witness'],['record','Read the intact dispatch entry'],['tape','Decoded the maintenance tape'],['ledger',"Recovered Vale's signed ledger"],['band','Heard the bridge operator'],['confession',"Recorded Nell's confession"],['ramp','Cut Vale off on the service ramp'],['jump','Cleared the lifting bridge'],['chip','Pocketed a Filament chip'],['undercity','Ran Vale down in the storm drains'],['flawless','Closed the case without a rewind']];
function endingId(){
 if(state.pursuit==='stay')return 'home';
 const ledger=state.rescue==='valve';
 return state.caught?(ledger?'arrest-ledger':'arrest-word'):(ledger?'paper':'dark');
}
function discovered(){
 const found={observe:state.watched,witness:state.choice==='person',record:state.choice==='book',tape:state.decoded,ledger:state.rescue==='valve',band:state.radio,confession:state.twist,ramp:state.pursuit==='ramp'&&state.caught&&state.tunnel==='left',jump:state.pursuit==='jump'&&state.caught,chip:state.club==='vault',undercity:state.pursuit==='ramp'&&state.caught,flawless:state.rewinds===3};
 return discoveries.filter(([id])=>found[id]).map(([id])=>id);
}
function recordCase(){saveStore.record({ending:endingId(),discoveries:discovered()});}
function caseReport(){
 const r=reflexes(),name=endings.find(([id])=>id===endingId())[1];
 const found=session.mode==='preview'?'preview':saveStore.readRecords().endings.length+'/'+endings.length+' found';
 return 'ENDING: '+name+' ('+found+'). Reflex '+r.hits+'/'+r.faced+', grade '+r.grade+', rewinds used '+(3-state.rewinds)+'.';
}
function renderRecords(){
 if(!hud.records)return;
 const r=saveStore.readRecords();hud.records.replaceChildren();
 const line=text=>{const li=document.createElement('li');li.textContent=text;hud.records.appendChild(li);};
 line('ENDINGS '+r.endings.length+'/'+endings.length+(r.cases?' / CASES CLOSED '+r.cases:''));
 for(const [id,name] of endings)line((r.endings.includes(id)?name:'?????').padEnd(20,' ')+(r.endings.includes(id)?'  reached':'  not yet'));
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
  captionShown=(reduce||session.menu||isQte()||['danger','pumpDanger'].includes(state.phase))?full.length:0;
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
