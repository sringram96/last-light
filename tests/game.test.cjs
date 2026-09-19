const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {game,memoryStorage}=require('./harness.cjs');

test('approved street render remains identical outside the character sprites at desktop and phone widths',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../reference/approved-complete-case.html'),'utf8');
 const original=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 for(const width of [320,732]){
  const before=game({width,script:original}),after=game({width}),a=after.audit(),cw=width/a.columns,ch=cw*1.72;
  const cell=d=>Math.round(d[1]/cw)+','+Math.round(d[2]/ch),map=f=>new Map(f.map(d=>[cell(d),d[0]+d[3]]));
  const was=map(before.frame()),now=map(after.frame());
  const inSprite=key=>{const [x,y]=key.split(',').map(Number);return a.sprites.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);};
  let changed=0;
  for(const key of new Set([...was.keys(),...now.keys()]))if(was.get(key)!==now.get(key)){changed++;assert(inSprite(key),`Scene cell ${key} changed outside a character sprite at width ${width}`);}
  assert.equal(a.sprites.length,2);assert(changed<40,`Too many sprite cells changed: ${changed}`);assert.equal(a.nonASCII,0);
 }
});
test('close-up characters keep a single pair of eyes',()=>{
 for(const width of [320,732]){
  const g=game({width,reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.run(3.5);g.phase('qte');
  const a=g.audit(),cw=width/a.columns,ch=cw*1.72,eyes=g.frame().filter(d=>d[0]==='o').map(d=>[Math.round(d[1]/cw),Math.round(d[2]/ch)]);
  for(const r of a.sprites){const inside=eyes.filter(([x,y])=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);assert(inside.length>=1&&inside.length<=2,`Expected one or two eyes per sprite, saw ${inside.length} at width ${width}`);}
 }
});
test('menus pause action, preferences persist, and previews preserve the story checkpoint',()=>{
 const g=game();g.click('NEW CASE');g.phase('officeEntry');g.click('SKIP INTRO');g.click('WATCH FIRST');g.run(8.3);g.phase('ready');
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
 const g=game({reduced:true});g.click('NEW CASE');g.run(1.3);g.phase('officeFile');g.run(1.3);g.phase('officeWindow');g.run(1.3);g.phase('brief');
 g.click('FOLLOW');g.run(3.5);g.phase('qte');g.click('CATCH');g.run(4.3);g.click('CONNECT');g.click('STATION SERVICE');g.run(1.3);g.click('ENTER');g.run(1.3);
 g.click('READ THE TAPE');g.run(8.3);assert(g.audit().state.decoded);g.click('FOLLOW THE KNOCKING');g.run(1.3);g.click('GET BELL');g.run(2.3);g.phase('pumpQte');g.click('CLOSE THE INLET');g.run(1.3);g.click('TAKE BELL');g.run(1.3);
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.phase('clubEntry');g.run(1.3);g.phase('clubFace');g.run(2.3);g.phase('clubQte');g.click('VAULT');g.run(1.3);g.phase('chaseEntry');
 g.run(1.3);g.click('DIVE RIGHT');g.run(1.3);g.click('FOLLOW OVER');g.run(2.5);g.phase('canalEnd');
 assert(g.audit().state.caught&&g.audit().state.twist);assert.equal(g.audit().state.rescue,'valve');assert.equal(g.audit().state.club,'vault');assert.equal(g.audit().nonASCII,0);assert.equal(g.audit().state.t,0);
});
test('the lower ramp leads into the undercity, where the fork decides the arrest',()=>{
 // Following right catches Vale while the gap is small; cutting left needs the bridge operator's tip.
 let g=game({reduced:true});g.click('UNDERCITY','reel-actions');g.run(1.3);g.phase('tunnelQte');g.click('FOLLOW RIGHT');g.phase('tunnelFinish');assert(g.audit().state.caught);g.run(2.5);g.phase('canalEnd');
 assert(g.audit().route.includes('Took the ramp')&&g.audit().route.includes('Followed right'));assert.equal(g.audit().reflex.grade,'A');assert.equal(g.audit().nonASCII,0);
 g=game({reduced:true});g.click('UNDERCITY','reel-actions');g.run(1.3);g.click('CUT LEFT');assert(g.audit().state.caught);assert.equal(g.audit().card,'GOT HIM');
 g=game({reduced:true});g.click('CHASE','reel-actions');g.run(1.3);g.click('BRAKE');g.run(1.3);g.click('LOWER RAMP');g.phase('tunnelEntry');assert.equal(g.audit().scene,'tunnel');
 g.elements['.lc-timing'].click();g.run(1.3);g.phase('tunnelQte');g.run(9.4);g.phase('tunnelFinish');assert(!g.audit().state.caught);assert.equal(g.audit().card,'GONE');g.run(2.5);g.phase('canalEnd');
 assert.equal(g.audit().reflex.faced-g.audit().reflex.hits,1);assert(g.audit().route.includes('Braked at the fork'));
});
test('every location previews with printable ASCII only and visible characters where expected',()=>{
 for(const [name,sprites] of [['OFFICE',1],['STREET',2],['STATION',2],['FLOOD',3],['ROOFTOP',3],['CLUB',6],['CHASE',0],['UNDERCITY',0],['DAWN',4]]){
  const g=game({reduced:true,width:732});g.click(name,'reel-actions');g.run(.5);
  const a=g.audit();assert.equal(a.nonASCII,0,name);assert(a.sprites.length>=sprites,`${name} sprites: ${a.sprites.length}`);assert(g.frame().length>2000,`${name} draws`);
 }
});
test('title cards, stingers, reflex keys and the case file follow the story',()=>{
 const g=game({reduced:true});assert.equal(g.audit().card,'LAST LIGHT');
 g.click('NEW CASE');assert.equal(g.audit().card,'NIGHT DIVISION');assert.equal(g.audit().scene,'office');g.click('SKIP INTRO');g.phase('brief');
 assert.equal(g.audit().card,'STATION ROAD');assert.deepEqual(g.audit().route,[]);g.run(3.2);assert.equal(g.audit().card,'');
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
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.run(3.5);g.click('CATCH');g.run(4.3);g.click('CONNECT');g.click('STATION SERVICE');g.run(1.3);g.click('ENTER');g.run(1.3);
 g.click('READ THE TAPE');g.run(8.3);g.click('FOLLOW THE KNOCKING');g.run(1.3);g.click('GET BELL');g.run(2.3);g.click('CLOSE THE INLET');g.run(1.3);g.click('TAKE BELL');g.run(1.3);
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.run(1.3);g.run(2.3);g.click('VAULT');assert.equal(g.audit().card,'OVER THE BAR');g.run(1.3);
 g.run(1.3);g.click('DIVE RIGHT');g.run(1.3);g.click('FOLLOW OVER');g.run(2.5);g.phase('canalEnd');
 assert.equal(g.audit().card,'CASE CLOSED');
 const records=g.audit().records;assert.deepEqual(records.endings,['arrest-ledger']);assert.equal(records.cases,1);
 assert.deepEqual(records.discoveries,['witness','tape','ledger','band','confession','jump','chip']);
 assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: THE CLEAN ARREST (1/5 found). Reflex 5/5, grade A.'));
 assert.deepEqual(g.audit().route,['Followed at once','Caught the courier','Read the tape','Closed the inlet','Listened to the band',"Heard Nell's confession",'Pursued Vale','Went over the bar','Dove right','Jumped the gap']);
 g.click('RETURN TO MENU');const lines=g.elements['.lc-records'].children.map(li=>li.textContent);
 assert(lines[0].startsWith('ENDINGS 1/5'));assert(lines.some(l=>l.startsWith('THE CLEAN ARREST')));assert(lines.some(l=>l.startsWith('?????')));
 g.click('CHASE','reel-actions');g.run(1.3);g.click('BRAKE');g.run(1.3);g.click('LOWER RAMP');g.phase('tunnelEntry');g.run(1.3);g.click('FOLLOW RIGHT');g.run(2.5);g.phase('canalEnd');
 assert.equal(g.audit().records.cases,1);assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: THE CLEAN ARREST (preview).'));
 g.elements['.lc-menu'].click();g.click('NEW CASE');g.click('START NEW CASE');g.phase('officeEntry');
 assert.equal(JSON.parse(g.storage.getItem('last-light/save/v1')).state.phase,'officeEntry');assert.equal(g.audit().records.cases,1);
 g.elements['.lc-sound'].click();assert(g.audit().state.sound);const reloaded=game({storage:g.storage});assert(reloaded.audit().state.sound);
});
test('timed misses, pausing and declining pursuit still reach coherent outcomes',()=>{
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.elements['.lc-timing'].click();g.run(1.3);g.phase('chaseQteA');
 const event=g.audit().state.event;g.document.hidden=true;g.run(3);assert.equal(g.audit().state.event,event);g.document.hidden=false;
 g.elements['.lc-pause'].click();g.run(3);assert.equal(g.audit().state.event,event);g.elements['.lc-pause'].click();
 g.run(9.4);g.phase('chaseBank');assert.equal(g.audit().card,'CLIPPED');g.run(1.3);g.run(9.4);g.run(2.5);g.phase('canalEnd');assert(!g.audit().state.caught);
 g.elements['.lc-menu'].click();g.click('ROOFTOP','reel-actions');g.run(1.3);g.click('STAY WITH');g.run(1.3);g.phase('canalEnd');assert.equal(g.audit().state.pursuit,'stay');
});
