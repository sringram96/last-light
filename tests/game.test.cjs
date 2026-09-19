const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {game,memoryStorage}=require('./harness.cjs');

test('approved street render remains identical at desktop and phone widths',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../reference/approved-complete-case.html'),'utf8');
 const original=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 for(const width of [320,732]){
  const before=game({width,script:original}),after=game({width});assert.deepEqual(after.frame(),before.frame());assert.equal(after.audit().nonASCII,0);
 }
});
test('menus pause action, preferences persist, and previews preserve the story checkpoint',()=>{
 const g=game();g.click('NEW CASE');g.click('WATCH FIRST');g.run(8.3);g.phase('ready');
 const saved=g.storage.getItem('last-light/save/v1');assert(saved);
 g.elements['.lc-mono'].click();g.elements['.lc-timing'].click();g.elements['.lc-menu'].click();
 const frozen=g.audit().state.event;g.run(3);assert.equal(g.audit().state.event,frozen);
 g.click('CHASE','reel-actions');assert.equal(g.audit().session.mode,'preview');g.run(6.4);g.phase('chaseQteA');
 assert.equal(g.storage.getItem('last-light/save/v1'),saved);g.elements['.lc-menu'].click();g.click('CONTINUE CASE');g.phase('ready');
 assert(g.audit().state.mono&&g.audit().state.untimed);assert.equal(g.audit().session.mode,'story');
 const reloaded=game({storage:g.storage});assert(reloaded.audit().state.mono);reloaded.click('CONTINUE CASE');reloaded.phase('ready');
 reloaded.elements['.lc-menu'].click();reloaded.click('NEW CASE');assert(reloaded.audit().session.confirmNew);reloaded.click('KEEP CURRENT');assert(reloaded.storage.getItem('last-light/save/v1'));
});
test('the connected case reaches rescue, confession, chase and capture',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('FOLLOW');g.run(3.5);g.phase('qte');g.click('CATCH');g.run(4.3);g.click('CONNECT');g.click('STATION SERVICE');g.run(1.3);g.click('ENTER');g.run(1.3);
 g.click('READ THE TAPE');g.run(8.3);assert(g.audit().state.decoded);g.click('FOLLOW THE KNOCKING');g.run(1.3);g.click('GET BELL');g.run(2.3);g.phase('pumpQte');g.click('CLOSE THE INLET');g.run(1.3);g.click('TAKE BELL');g.run(1.3);
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.run(1.3);g.click('DIVE RIGHT');g.run(1.3);g.click('FOLLOW OVER');g.run(2.5);g.phase('canalEnd');
 assert(g.audit().state.caught&&g.audit().state.twist);assert.equal(g.audit().state.rescue,'valve');assert.equal(g.audit().nonASCII,0);assert.equal(g.audit().state.t,0);
});
test('title cards, stingers, reflex keys and the case file follow the story',()=>{
 const g=game({reduced:true});assert.equal(g.audit().card,'LAST LIGHT');
 g.click('NEW CASE');assert.equal(g.audit().card,'STATION ROAD');assert.deepEqual(g.audit().route,[]);g.run(3.2);assert.equal(g.audit().card,'');
 g.click('WATCH FIRST');g.run(8.3);g.phase('ready');assert.equal(g.audit().card,'NOTED');
 g.click('FOLLOW');g.run(1.3);g.phase('danger');assert.equal(g.audit().card,'GET READY');g.run(2.2);g.phase('qte');assert.equal(g.audit().card,'');
 g.document.listeners.keydown({key:'ArrowRight',target:null,preventDefault(){}});g.phase('result');
 assert.equal(g.audit().state.choice,'book');assert.equal(g.audit().card,'SAVED');
 assert.deepEqual(g.audit().route,['Watched first','Saved the book']);assert.deepEqual(g.audit().reflex,{faced:1,hits:1,grade:'A'});
 assert.match(g.audit().board[0],/missing/);g.run(4.3);g.phase('evidence');assert.match(g.audit().board[0],/last logged at Pump Room 4/);assert.match(g.audit().board[1],/limped away/);
 g.click('CONNECT');g.click('THE HOTEL');g.phase('deduce');assert(g.audit().route.includes('Chased a false lead'));
 g.click('STATION SERVICE');g.run(1.3);g.click('ENTER');assert.equal(g.audit().scene,'station');assert.equal(g.audit().card,'NORTH STATION');
 assert.equal(g.elements['.lc-journal'].hidden,false);assert.equal(g.elements['.lc-score'].textContent,'REFLEX 1/1 // ');
 g.elements['.lc-menu'].click();assert.equal(g.audit().card,'LAST LIGHT');assert.equal(g.elements['.lc-records-box'].hidden,false);
 g.click('RESUME');assert.equal(g.audit().card,'');assert.equal(g.elements['.lc-records-box'].hidden,true);
});
test('closing a case records the ending and discoveries; previews and new cases leave records intact',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('FOLLOW');g.run(3.5);g.click('CATCH');g.run(4.3);g.click('CONNECT');g.click('STATION SERVICE');g.run(1.3);g.click('ENTER');g.run(1.3);
 g.click('READ THE TAPE');g.run(8.3);g.click('FOLLOW THE KNOCKING');g.run(1.3);g.click('GET BELL');g.run(2.3);g.click('CLOSE THE INLET');g.run(1.3);g.click('TAKE BELL');g.run(1.3);
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.run(1.3);g.click('DIVE RIGHT');g.run(1.3);g.click('FOLLOW OVER');g.run(2.5);g.phase('canalEnd');
 assert.equal(g.audit().card,'CASE CLOSED');
 const records=g.audit().records;assert.deepEqual(records.endings,['arrest-ledger']);assert.equal(records.cases,1);
 assert.deepEqual(records.discoveries,['witness','tape','ledger','band','confession','jump']);
 assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: THE CLEAN ARREST (1/5 found). Reflex 4/4, grade A.'));
 assert.deepEqual(g.audit().route,['Followed at once','Caught the courier','Read the tape','Closed the inlet','Listened to the band',"Heard Nell's confession",'Pursued Vale','Dove right','Jumped the gap']);
 g.click('RETURN TO MENU');const lines=g.elements['.lc-records'].children.map(li=>li.textContent);
 assert(lines[0].startsWith('ENDINGS 1/5'));assert(lines.some(l=>l.startsWith('THE CLEAN ARREST')));assert(lines.some(l=>l.startsWith('?????')));
 g.click('CHASE','reel-actions');g.run(1.3);g.click('BRAKE');g.run(1.3);g.click('LOWER RAMP');g.run(2.5);g.phase('canalEnd');
 assert.equal(g.audit().records.cases,1);assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: THE CLEAN ARREST (preview).'));
 g.elements['.lc-menu'].click();g.click('NEW CASE');g.click('START NEW CASE');g.phase('brief');
 assert.equal(JSON.parse(g.storage.getItem('last-light/save/v1')).state.phase,'brief');assert.equal(g.audit().records.cases,1);
 g.elements['.lc-sound'].click();assert(g.audit().state.sound);const reloaded=game({storage:g.storage});assert(reloaded.audit().state.sound);
});
test('timed misses, pausing and declining pursuit still reach coherent outcomes',()=>{
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.elements['.lc-timing'].click();g.run(1.3);g.phase('chaseQteA');
 const event=g.audit().state.event;g.document.hidden=true;g.run(3);assert.equal(g.audit().state.event,event);g.document.hidden=false;
 g.elements['.lc-pause'].click();g.run(3);assert.equal(g.audit().state.event,event);g.elements['.lc-pause'].click();
 g.run(9.4);g.phase('chaseBank');g.run(1.3);g.run(9.4);g.run(2.5);g.phase('canalEnd');assert(!g.audit().state.caught);
 g.elements['.lc-menu'].click();g.click('ROOFTOP','reel-actions');g.run(1.3);g.click('STAY WITH');g.run(1.3);g.phase('canalEnd');assert.equal(g.audit().state.pursuit,'stay');
});
