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
test('timed misses, pausing and declining pursuit still reach coherent outcomes',()=>{
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.elements['.lc-timing'].click();g.run(1.3);g.phase('chaseQteA');
 const event=g.audit().state.event;g.document.hidden=true;g.run(3);assert.equal(g.audit().state.event,event);g.document.hidden=false;
 g.elements['.lc-pause'].click();g.run(3);assert.equal(g.audit().state.event,event);g.elements['.lc-pause'].click();
 g.run(9.4);g.phase('chaseBank');g.run(1.3);g.run(9.4);g.run(2.5);g.phase('canalEnd');assert(!g.audit().state.caught);
 g.elements['.lc-menu'].click();g.click('ROOFTOP','reel-actions');g.run(1.3);g.click('STAY WITH');g.run(1.3);g.phase('canalEnd');assert.equal(g.audit().state.pursuit,'stay');
});
