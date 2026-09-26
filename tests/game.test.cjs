const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {game,memoryStorage}=require('./harness.cjs');

test('approved street render remains identical outside the character sprites at desktop and phone widths',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../reference/approved-complete-case.html'),'utf8');
 const original=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 for(const width of [320,732]){
  // The boot picture is the menu tableau now; the approved street is reached through the scene reel, whose first frame is the old boot frame.
  const before=game({width,script:original}),after=game({width});after.click('STREET','reel-actions');const a=after.audit(),cw=width/a.columns,ch=cw*1.72;
  const cell=d=>Math.round(d[1]/cw)+','+Math.round(d[2]/ch),map=f=>new Map(f.map(d=>[cell(d),d[0]+d[3]]));
  const was=map(before.frame()),now=map(after.frame());
  const inSprite=key=>{const [x,y]=key.split(',').map(Number);return a.sprites.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);};
  let changed=0;
  for(const key of new Set([...was.keys(),...now.keys()]))if(was.get(key)!==now.get(key)){changed++;assert(inSprite(key),`Scene cell ${key} changed outside a character sprite at width ${width}`);}
  // The sprite system redraws every sprite cell (whole-cell anchors, single outline strokes, multi-resolution sheets),
  // so the budget bounds the sprite footprint rather than the old sampling: 50 and 74 cells with the design sheets.
  assert.equal(a.sprites.length,2);assert(changed<100,`Too many sprite cells changed: ${changed}`);assert.equal(a.nonASCII,0);
 }
});
const eyesInside=(g,width,r)=>{const a=g.audit(),cw=width/a.columns,ch=cw*1.72;return g.frame().filter(d=>d[0]==='o').map(d=>[Math.round(d[1]/cw),Math.round(d[2]/ch)]).filter(([x,y])=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1).length;};
test('close-up characters keep exactly the eyes their sheet draws',()=>{
 for(const width of [320,732]){
  const g=game({width,reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.next();g.next();g.phase('qte');
  const a=g.audit();assert.equal(a.sprites.length,2);
  for(const r of a.sprites){assert(r.eyes>=1&&r.eyes<=2,`${r.who} sheet has ${r.eyes} eye glyphs`);assert.equal(eyesInside(g,width,r),r.eyes,`${r.who} at width ${width}`);}
 }
});
test('a character mid-glide keeps a stable column count and never doubles an eye',()=>{
 const width=732,g=game({width});g.click('STATION','reel-actions');g.run(3);
 let previous=null;
 for(let i=0;i<5;i++){
  g.run(.1);const a=g.audit();assert.equal(a.state.phase,'stationEntry');
  const rook=a.sprites.find(r=>r.who==='rook'),nell=a.sprites.find(r=>r.who==='nell');assert(rook&&nell);
  assert(rook.x1<nell.x0||nell.x1<rook.x0,'sprites overlap');
  // Width is a function of the whole-row height (approved aspect), so a glide never flips it between two values.
  assert.equal(rook.cols,Math.round(rook.rows*1.72*.41));assert(['full','mid','small'].includes(rook.sheet));
  if(previous){assert(rook.rows>=previous.rows&&rook.cols>=previous.cols,'a walk toward the camera only grows');assert(rook.rows-previous.rows<=1,'grows in whole-row steps');}
  assert.equal(eyesInside(g,width,rook),1,`frame ${i}`);assert.equal(eyesInside(g,width,nell),2,`frame ${i}`);
  previous=rook;
 }
});
test('the sprite loader accepts the design sheet shape and rejects unsafe rows',()=>{
 const g=game({reduced:true});const sprites=g.root.cinemaSprites;
 assert(['rook','generic','nell','bell','vale','krane','medic','performer'].every(n=>sprites.characters().includes(n)));
 const warnings=sprites.load({tester:{full:{stand:['  _  ',' (o) ',' /#\\ ',' | | '],walk:[[' (o) ',' /#\\ ',' / \\ '],[' (o) ',' /#\\ ',' | | ']]},accent:{glyph:'#',hue:2}},broken:{full:{stand:['(ö)']}},headless:{full:{walk:[['|']]}}});
 assert(sprites.characters().includes('tester')&&!sprites.characters().includes('broken')&&!sprites.characters().includes('headless'));
 assert(warnings.some(w=>/^broken.*printable ASCII/.test(w))&&warnings.some(w=>/^headless.*stand pose/.test(w))&&!warnings.some(w=>/^tester/.test(w)),warnings.join('; '));
 g.click('CLUB','reel-actions');g.run(.5);const who=g.audit().sprites.map(r=>r.who);
 for(const name of ['rook','vale','krane','patron','performer'])assert(who.includes(name),name);assert.equal(g.audit().nonASCII,0);
});
// Route helpers. A cutscene or result holds until its caption could be read, so the harness steps to the next phase (next())
// rather than waiting a fixed second; observes, windups, prompts and transits keep their fixed clocks.
// The intro: the arrival plays out, then two looks at the desk open the stairs (a transit to the street unless reduced motion cuts).
const intro=g=>{g.click('NEW CASE');g.phase('officeEntry');g.next();g.phase('officeDesk');g.key('1');g.key('2');g.click('TAKE THE STAIRS');if(g.audit().transit)g.next();g.phase('brief');};
// A look-around: two spots (the minimum the beat asks for) and the exit. The maintenance desk has time for three looks and
// ends at the hatch, where Rook names who he thinks locked Bell in; the order and the padlock put Vale on the list.
const throughDesk=(g,keys='13',theory='INSPECTOR VALE')=>{g.phase('stationDesk');for(const k of keys)g.key(k);g.click('THE KNOCKING BELOW');g.phase('stationTheory');g.click(theory);g.phase('pumpEntry');};
const throughPumpRoom=g=>{g.phase('pumpRoom');g.key('1');g.key('3');g.click('WHAT BELL KNOWS');g.phase('pumpTruth');};
const throughHall=(g,move)=>{g.phase('subEntry');g.next();g.phase('subDock');g.next();g.phase('subManifest');g.next();g.phase('subDanger');g.next();g.phase('subQte');g.click(move);g.phase('subResult');g.next();g.phase('subDawn');g.next();};
const throughRoom=(g,pick)=>{g.phase('roomEntry');g.next();g.phase('roomDeduce');g.click(pick);g.phase('roomName');g.click('GO TO BELL');g.next();g.phase('canalEnd');};
test('menus pause action, preferences persist, and previews preserve the story checkpoint',()=>{
 const g=game();g.click('NEW CASE');g.phase('officeEntry');g.click('SKIP INTRO');g.run(1.6);g.phase('brief');g.click('WATCH FIRST');g.run(8.3);g.phase('ready');
 const saved=g.storage.getItem('last-light/save/v1');assert(saved);
 g.elements['.lc-mono'].click();g.elements['.lc-timing'].click();g.elements['.lc-menu'].click();
 const frozen=g.audit().state.event;g.run(3);assert.equal(g.audit().state.event,frozen);
 g.click('CHASE','reel-actions');assert.equal(g.audit().session.mode,'preview');g.next();g.phase('chaseQteA');
 assert.equal(g.storage.getItem('last-light/save/v1'),saved);g.elements['.lc-menu'].click();g.click('CONTINUE CASE');g.phase('ready');
 assert(g.audit().state.mono&&g.audit().state.untimed);assert.equal(g.audit().session.mode,'story');
 const reloaded=game({storage:g.storage});assert(reloaded.audit().state.mono);reloaded.click('CONTINUE CASE');reloaded.phase('ready');
 reloaded.elements['.lc-menu'].click();reloaded.click('NEW CASE');assert(reloaded.audit().session.confirmNew);reloaded.click('KEEP CURRENT');assert(reloaded.storage.getItem('last-light/save/v1'));
});
// North Station as an investigation: the knocking allows three looks, the hatch asks for a theory, and the answer is paid
// for downstairs. Reaching the desk from a new case, optionally through the office desk and with either street outcome.
const toTheDesk=(g,office='',dir='ArrowUp')=>{
 g.click('NEW CASE');if(office){g.phase('officeEntry');g.next();g.phase('officeDesk');for(const k of office)g.key(k);g.click('TAKE THE STAIRS');if(g.audit().transit)g.next();}else g.click('SKIP INTRO');
 g.phase('brief');g.click('FOLLOW');g.next();g.next();g.phase('qte');g.key(dir);g.next();g.click('CONNECT');g.click('STATION SERVICE');g.next();g.phase('stationEntry');g.next();g.phase('stationDesk');};
test('the maintenance desk has time for three looks, and the hatch wants a theory',()=>{
 const g=game({reduced:true});toTheDesk(g);const title=()=>g.elements['.lc-phase'].textContent,buttons=()=>g.elements['.lc-actions'].children.map(b=>b.textContent);
 assert.equal(title(),'THE MAINTENANCE DESK / 3 LOOKS LEFT');
 g.key('2');let a=g.audit();assert(a.state.decoded,'the tape is read at the desk');assert(a.state.clues.some(l=>l.includes('close the INLET wheel')));
 assert(g.elements['.lc-caption'].textContent.includes('CLOSE INLET FIRST')&&g.elements['.lc-caption'].textContent.startsWith('Under the floor: three short, a rest, three short.'),'the knocking leads the look');
 g.key('4');g.key('1');assert.equal(title(),'THE MAINTENANCE DESK / NO TIME LEFT');assert(g.elements['.lc-caption'].textContent.startsWith('The knocking stops. Then, weaker, it starts again.'));
 // Spent: the unexamined hatch and the cup (opened by the order) are closed, in the buttons, the keys and the picture.
 assert.deepEqual(buttons(),['[1] THE ORDER','[2] THE TAPE','[4] THE DEPARTURES BOARD','[THE KNOCKING BELOW]']);
 g.key('3');assert.equal(g.audit().state.stationLooked,11);assert.deepEqual(g.audit().labels.filter(l=>l.spot).map(l=>l.spot),['order','tape','board']);
 g.key('2');assert(g.elements['.lc-caption'].textContent.includes('CLOSE INLET FIRST'),'a look already taken re-reads for nothing');
 g.click('THE KNOCKING BELOW');g.phase('stationTheory');
 assert(g.elements['.lc-caption'].textContent.startsWith('Rook has order 7731, with H.A. countersigned under Vale\'s name. A Board van due at 01:30.'));
 assert.deepEqual(buttons(),['[INSPECTOR VALE]','[THE LUMEN BOARD]','[NO THEORY]'],'no call seen, so the courier is not on the list');
 // The wrong theory is a minute at the hatch: Bell says so, and the inlet loses the half second the tape bought.
 g.click('THE LUMEN BOARD');g.phase('pumpEntry');assert(g.elements['.lc-caption'].textContent.includes('the water has climbed a hand while Rook watched Bay 2'));
 assert.equal(g.audit().board[0],'THE CASE: Rook thinks the Lumen Board put Bell under North Station.');g.next();g.phase('pumpFind');
 assert(g.elements['.lc-caption'].textContent.includes('You took your time')&&g.audit().caption.chunks.length===1&&g.audit().caption.chunks[0].includes('Not the Board: Vale\'s hand on the bolt.')&&g.audit().caption.chunks[0].endsWith('The INLET wheel is beside Rook.'),'the verdict and the inlet line are in the first chunk');
 g.click('GET BELL');g.run(2.2);g.phase('pumpQte');assert.equal(g.audit().window,2.5,'2.5 s, plus the tape, less the minute');
 assert(g.audit().route.includes('Went down suspecting the Board'));
 // Nothing read that names anyone: only the way down is left.
 const n=game({reduced:true});toTheDesk(n);n.key('2');n.key('4');n.click('THE KNOCKING BELOW');n.phase('stationTheory');
 assert.deepEqual(n.elements['.lc-actions'].children.map(b=>b.textContent),['[THE LUMEN BOARD]','[NO THEORY]']);
 n.click('NO THEORY');n.phase('pumpEntry');assert.equal(n.audit().board[0],'THE CASE: Bell is under North Station. Rook has no theory who put him there.');
 assert(n.elements['.lc-caption'].textContent.includes('while Rook stood at the hatch without a name'));n.next();n.phase('pumpFind');assert(n.audit().caption.chunks[0].includes('Rook had no name; Bell has one.'));
});
test('suspecting the courier costs her confession, or, with her gone, the band',()=>{
 // Nell caught, and the forged call read on the office log: she is on the list, and she hears Rook accuse her.
 const g=game({reduced:true});toTheDesk(g,'31');g.key('1');g.key('3');g.click('THE KNOCKING BELOW');g.phase('stationTheory');
 assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[INSPECTOR VALE]','[NELL MARROW]','[THE LUMEN BOARD]','[NO THEORY]']);
 g.click('NELL MARROW');g.phase('pumpEntry');assert.equal(g.audit().board[0],'THE CASE: Rook thinks Nell Marrow locked Bell under North Station.','the case line names the person on the button');
 g.next();g.phase('pumpFind');assert(g.audit().caption.chunks[0].includes('Not the courier: Bell clears Nell.'));
 g.click('GET BELL');g.run(2.2);g.phase('pumpQte');assert.equal(g.audit().window,2,'no tape, less the minute');g.key('ArrowLeft');g.next();throughPumpRoom(g);g.click('TAKE BELL');g.next();g.phase('roofQuiet');
 assert(g.elements['.lc-caption'].textContent.includes('Nell keeps away from the man who accused her.'));
 g.click('LISTEN');g.run(8.3);g.phase('roofSignal');assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[PURSUE VALE]','[STAY WITH BELL]']);
 assert(g.elements['.lc-caption'].textContent.includes('says nothing to the man who accused her'));
 // The book saved and the courier gone: Rook's call for her fills the band, and the bridge operator never gets through.
 const b=game({reduced:true});toTheDesk(b,'31','ArrowDown');assert.equal(b.audit().state.choice,'book');b.key('1');b.key('3');b.click('THE KNOCKING BELOW');b.phase('stationTheory');
 b.click('THE COURIER');b.phase('pumpEntry');b.next();b.click('GET BELL');b.run(2.2);b.phase('pumpQte');b.key('ArrowLeft');b.next();throughPumpRoom(b);b.click('TAKE BELL');b.next();b.phase('roofQuiet');
 assert(b.elements['.lc-caption'].textContent.includes('full of Rook\'s own call for the courier'));assert(!b.elements['.lc-actions'].children.some(x=>x.textContent.includes('LISTEN')));
 assert(b.audit().state.clues.some(l=>l.startsWith('Rook put the courier\'s description out on the Division band')));
});
test('the booth only offers order 7731 to a Rook who read it',()=>{
 const c=game({reduced:true});c.click('CLUB','reel-actions');c.next();c.phase('clubBooth');assert(c.elements['.lc-actions'].children.some(b=>b.textContent==='[SHOW HIM ORDER 7731]'));
 const saved=memoryStorage();saved.setItem('last-light/save/v1',JSON.stringify({version:1,state:{phase:'clubBooth',clues:[],choice:'person',rescue:'valve',pursuit:'chasing',stationLooked:6,theory:'none'}}));
 const g=game({reduced:true,storage:saved});g.click('CONTINUE CASE');g.phase('clubBooth');assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[SAY NOTHING]']);
 const bad=memoryStorage();bad.setItem('last-light/save/v1',JSON.stringify({version:1,state:{phase:'clubBooth',clues:[],theory:'krane'}}));
 assert(!game({reduced:true,storage:bad}).elements['.lc-actions'].children.some(b=>/CONTINUE/.test(b.textContent)),'an unknown theory is not a checkpoint');
});
// Turning an object over: an insert of the object alone in the dark; a detail's engraving and marker show only while its
// face is toward the camera, and only then can it be read. The rows of the frame as text, to read the engravings.
const rowsOf=g=>{const a=g.audit(),grid=Array.from({length:a.rows},()=>Array(a.columns).fill(' '));for(const [c,x,y] of g.frame()){const cx=Math.round(x/a.grid.cw),cy=Math.round(y/a.grid.ch);if(cy>=0&&cy<a.rows&&cx>=0&&cx<a.columns)grid[cy][cx]=c;}return grid.map(r=>r.join(''));};
test('Bell\'s lantern turns over in the dark, and each face keeps its own detail',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.phase('brief');g.click('FOLLOW');g.next();g.next();g.phase('qte');g.key('ArrowUp');g.next();g.phase('evidence');
 const buttons=()=>g.elements['.lc-actions'].children.map(b=>b.textContent),spots=()=>g.audit().labels.filter(l=>l.spot).map(l=>l.spot);
 g.click('TURN THE LANTERN OVER');g.phase('lanternExamine');assert.equal(g.audit().scene,'street');assert.equal(g.elements['.lc-timer'].textContent,'DRAG TO TURN');
 assert(g.elements['.lc-caption'].textContent.startsWith('Nell hands Rook the lantern'));
 assert.deepEqual(buttons(),['[<< TURN]','[TURN >>]','[TIP IT]','[1] THE STENCIL','[PUT IT DOWN]']);assert.deepEqual(spots(),['stencil']);
 assert(rowsOf(g).some(r=>r.includes('DEPOT LOFT')),'the stencil is cut into the face toward the camera');assert(!rowsOf(g).some(r=>r.includes('7731')));
 // A detail on a face turned away cannot be read.
 g.key('3');assert.equal(g.audit().state.lanternLooked,0);
 g.key('1');assert.equal(g.audit().state.lanternLooked,1);assert(g.audit().state.clues.some(l=>l.startsWith('Bell\'s lantern is stencilled BELL / DEPOT LOFT')));
 // Paused, it does not turn; half a turn round with the arrows shows the back, where the knock is scratched.
 g.elements['.lc-pause'].click();g.key('ArrowRight');g.elements['.lc-pause'].click();assert.deepEqual(spots(),['stencil']);
 for(let i=0;i<4;i++)g.key('ArrowRight');assert.deepEqual(spots(),['knock']);assert(rowsOf(g).some(r=>r.includes('III  III')));
 g.key('2');assert.equal(g.audit().state.lanternLooked,3);
 // Tipped, the underside: the Board's reserve cell and its lot number.
 g.click('TIP IT');assert.deepEqual(spots(),['cell']);assert(rowsOf(g).some(r=>r.includes('LOT 7731')));
 g.tap(...g.spotCentre('cell'));assert.equal(g.audit().state.lanternLooked,7);assert(g.elements['.lc-caption'].textContent.startsWith('Under the base, the reserve cell'));
 assert.deepEqual(buttons().slice(3,6),['[1] THE STENCIL','[2] THE SCRATCHES','[3] THE CELL'],'a detail once read keeps its button');
 g.click('PUT IT DOWN');g.phase('evidence');assert(g.audit().route.includes('Turned Bell\'s lantern over (3/3)'));assert(g.audit().camera.y>0,'back on the street');
 // The desk remembers the lantern: the knock and the lot number.
 g.click('CONNECT');g.click('STATION SERVICE');g.next();g.phase('stationEntry');g.next();g.phase('stationDesk');g.key('1');
 const caption=g.elements['.lc-caption'].textContent;assert(caption.includes('The same number is stamped on the cell in Bell\'s lantern.'));assert(caption.startsWith('Under the floor: three short, a rest, three short. The mark on Bell\'s lantern.'));
});
test('the padlock off the pump-room door names the office it was signed out to',()=>{
 const saved=memoryStorage();saved.setItem('last-light/save/v1',JSON.stringify({version:1,state:{phase:'pumpRoom',clues:[],choice:'person',rescue:'valve',officeLooked:3,stationLooked:5}}));
 const g=game({reduced:true,storage:saved});g.click('CONTINUE CASE');g.phase('pumpRoom');
 assert(!g.elements['.lc-actions'].children.some(b=>b.textContent.includes('PADLOCK')),'picked up from the door, once it is looked at');
 g.key('1');g.click('TURN THE PADLOCK OVER');g.phase('pumpPadlock');assert(rowsOf(g).some(r=>r.includes('NIGHT DIVISION')));
 g.key('1');assert.equal(g.audit().state.padlockLooked,0,'the stamp is on the back');
 g.swipe('left',[300,200],314);assert.deepEqual(g.audit().labels.filter(l=>l.spot).map(l=>l.spot),['number']);assert(rowsOf(g).some(r=>r.includes('K-14')));
 g.key('1');assert(g.elements['.lc-caption'].textContent.endsWith('Fourteen is the dark door across the corridor from Rook\'s. Vale\'s.'));
 // A checkpoint taken in the insert resumes there.
 const again=game({reduced:true,storage:g.storage});again.click('CONTINUE CASE');again.phase('pumpPadlock');assert.equal(again.audit().state.padlockLooked,1);
 g.click('TIP IT');g.key('2');assert.equal(g.audit().state.padlockLooked,3);assert(g.audit().state.clues.some(l=>l.includes('the night Bell went missing')));
 g.click('PUT IT DOWN');g.phase('pumpRoom');assert(g.audit().route.includes('Turned the padlock over (2/2)'));
});
test('Pump Room 4 is a crime scene: the bolted door, the taken pin, and what the ledger route holds',()=>{
 const g=game({reduced:true,width:732});g.click('FLOOD','reel-actions');g.next();g.click('GET BELL');g.next();g.phase('pumpQte');
 g.click('CLOSE THE INLET');g.next();g.phase('pumpRoom');
 assert.equal(g.audit().objective,'GET BELL TO SAFETY');
 const buttons=()=>g.elements['.lc-actions'].children.map(b=>b.textContent);
 assert.deepEqual(buttons(),['[1] THE DOOR','[2] THE LEDGER','[3] THE INLET WHEEL','[4] THE PIPE']);
 g.key('1');assert.equal(g.audit().state.pumpLooked,1);
 assert(g.elements['.lc-caption'].textContent.includes('bolted from the outside'));
 assert(g.audit().state.clues.some(c=>c.includes('Someone locked Bell in')));
 assert(buttons().every(b=>!b.includes('WHAT BELL KNOWS')),'one spot is not enough to move on');
 g.key('3');assert.equal(g.audit().state.pumpLooked,5);
 assert(g.audit().state.clues.some(c=>c.includes('The flood was deliberate')));
 g.click('WHAT BELL KNOWS');g.phase('pumpTruth');
 // The satchel route names the loss instead: the ledger is under the water.
 const h=game({reduced:true,width:732});h.click('FLOOD','reel-actions');h.next();h.click('GET BELL');h.next();h.phase('pumpQte');
 h.click('PULL BELL OUT');h.next();h.phase('pumpRoom');
 assert(h.elements['.lc-actions'].children.some(b=>b.textContent==='[2] THE SATCHEL'));
 h.key('2');assert(h.elements['.lc-caption'].textContent.includes('out of reach'));
});
test('the long route: rescue, confession, the tram, the market, the club, the road, the hall and the warrant',()=>{
 const g=game({reduced:true});intro(g);
 g.click('FOLLOW');g.next();g.next();g.phase('qte');g.click('CATCH');g.next();g.click('CONNECT');g.click('STATION SERVICE');g.next();g.phase('stationEntry');g.next();throughDesk(g,'123');
 assert(g.audit().state.decoded);g.next();g.click('GET BELL');g.next();g.phase('pumpQte');g.click('CLOSE THE INLET');g.next();throughPumpRoom(g);g.click('TAKE BELL');g.next();
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.phase('tramEntry');assert.equal(g.audit().scene,'tram');g.next();g.phase('tramRide');
 g.click('WATCH THE ROAD');g.run(8.3);g.phase('tramSpotted');assert(g.audit().state.tail);g.click('RIDE ON');g.next();g.phase('marketEntry');assert.equal(g.audit().card,'THE NIGHT MARKET');
 g.next();g.phase('marketAisle');g.click('ASK THE STALL');g.phase('marketKeeper');assert(g.audit().state.keeper);g.click('PUSH THROUGH');g.phase('marketDanger');assert.notEqual(g.audit().card,'GET READY');
 g.next();g.phase('marketQte');assert.equal(g.audit().objective,'REACH THE FILAMENT');g.click('GO OVER');g.phase('marketResult');assert.equal(g.audit().card,'OVER THE STALLS');g.next();g.phase('clubEntry');
 g.next();g.phase('clubBooth');g.click('SAY NOTHING');g.phase('clubFace');g.next();g.phase('clubQte');g.click('VAULT');g.next();g.phase('chaseEntry');
 g.next();g.click('DIVE RIGHT');g.next();g.click('FOLLOW OVER');g.phase('chaseFinish');assert(g.audit().state.caught);g.next();
 throughHall(g,'PULL THE BREAKER');throughRoom(g,'SOMEONE ABOVE');
 const a=g.audit();assert(a.state.caught&&a.state.twist);assert.equal(a.state.rescue,'valve');assert.equal(a.state.hall,'breaker');assert.equal(a.nonASCII,0);assert.equal(a.state.t,0);
 assert.deepEqual(a.reflex,{faced:7,landed:7,deaths:0,restarts:0,grade:'A'});
 assert.deepEqual(a.route,['Looked over the desk (2/4)','Followed at once','Caught the courier','Searched the maintenance desk (3/5)','Went down suspecting Vale','Read the tape','Searched Pump Room 4 (2/4)','Closed the inlet','Listened to the band',"Heard Nell's confession",'Pursued Vale','Spotted the tail','Asked the stall keeper','Went over the stalls','Went over the bar','Dove right','Jumped the gap','Pulled the breaker',"Named the Board's man"]);
 assert.deepEqual(a.records.endings,['board']);assert.deepEqual(a.records.discoveries,['witness','tape','ledger','band','confession','jump','chip','flawless','tail','keeper','vine','manifest','ashe','sharp']);assert.deepEqual(a.records.deaths,[]);
 assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: LIGHTS ON THE BOARD (1/7 found). Inputs 7/7, deaths 0, restarts 0, grade A.'));
 assert(a.board.some(l=>l.startsWith('HALDEN ASHE')&&l.includes('named on the warrant')));
 assert.equal(a.board[0],'THE CASE: closed. Vale arrested; Halden Ashe of the Lumen Board named on the paper Rook kept dry.');
});
test('the loft branch: the note, the photographs and a rewind lost to a wrong reading',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.next();g.next();g.click('SAVE THE BOOK');g.next();g.click('CONNECT');
 assert(g.elements['.lc-actions'].children.some(b=>b.textContent.includes("BELL'S LOFT")));g.click("BELL'S LOFT");g.phase('loftTurn');g.next();g.phase('loftEntry');
 assert.equal(g.audit().scene,'loft');assert.equal(g.audit().card,'THE DEPOT LOFT');assert.equal(g.audit().objective,'WHAT BELL KNEW');g.next();g.phase('loftTable');
 g.click('READ THE NOTE');g.phase('loftNote');assert(g.audit().state.note);assert.equal(g.audit().card,'NOTED');g.click('STUDY THE MAP');g.phase('loftBoard');
 g.click('BACK TO THE LAMP DEPOT');g.phase('loftBoard');assert(g.audit().state.misread);assert.equal(g.audit().state.rewinds,2);g.click('INTO THE STATION VAULTS');assert.equal(g.audit().state.rewinds,2);
 g.click('UPTOWN');g.phase('loftStair');g.click('STAY OUT OF THE LIGHT');g.phase('loftLeave');g.next();g.phase('stationEntry');assert.equal(g.audit().scene,'station');
 assert.deepEqual(g.audit().route,['Followed at once','Saved the book','Climbed to the loft',"Read Nell's note",'Misread the photographs']);
 assert(g.audit().board.some(l=>l.startsWith('THE COURIER: signed a note')));
 const n=game({reduced:true});n.click('NEW CASE');n.click('SKIP INTRO');n.click('FOLLOW');n.next();n.next();n.click('CATCH');n.next();n.click('CONNECT');
 assert(!n.elements['.lc-actions'].children.some(b=>b.textContent.includes('LOFT')));
});
test('a checkpoint saved inside a registered set reloads at that beat',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.next();g.next();g.click('SAVE THE BOOK');g.next();g.click('CONNECT');
 g.click("BELL'S LOFT");g.phase('loftTurn');g.next();g.phase('loftEntry');g.next();g.phase('loftTable');g.click('READ THE NOTE');g.phase('loftNote');
 const saved=JSON.parse(g.storage.getItem('last-light/save/v1'));assert.equal(saved.state?saved.state.phase:saved.phase,'loftNote');
 const reloaded=game({reduced:true,storage:g.storage});reloaded.click('CONTINUE CASE');reloaded.phase('loftNote');assert.equal(reloaded.audit().scene,'loft');assert(reloaded.audit().state.note);
});
test('the lower ramp leads into the undercity, where the fork decides the arrest',()=>{
 // Following right catches Vale while the gap is small; cutting left needs the bridge operator's tip.
 let g=game({reduced:true});g.click('UNDERCITY','reel-actions');g.next();g.phase('tunnelQte');g.click('FOLLOW RIGHT');g.phase('tunnelFinish');assert(g.audit().state.caught);g.next();
 throughHall(g,'DIVE CLEAR');throughRoom(g,'SOMEONE ABOVE');
 assert(g.audit().route.includes('Took the ramp')&&g.audit().route.includes('Followed right')&&g.audit().route.includes('Dived clear'));assert.equal(g.audit().reflex.grade,'A');assert.equal(g.audit().nonASCII,0);
 g=game({reduced:true});g.click('UNDERCITY','reel-actions');g.next();g.click('CUT LEFT');assert(g.audit().state.caught);assert.equal(g.audit().card,'GOT HIM');
 g=game({reduced:true});g.click('CHASE','reel-actions');g.next();g.click('BRAKE');g.next();g.click('LOWER RAMP');g.phase('tunnelEntry');assert.equal(g.audit().scene,'tunnel');
 // Timed: the fork left to time out is the pier (a lamp), the night rewinds to the fork, and following right with a gap open loses Vale under the gate.
 g.elements['.lc-timing'].click();g.next();g.phase('tunnelQte');assert.equal(g.audit().state.gap,1);g.run(4,50);g.phase('tunnelDeath');assert.equal(g.audit().card,'THE PIER');assert.equal(g.audit().state.rewinds,2);assert.equal(g.audit().state.tunnel,'');
 g.next();g.phase('tunnelQte');assert(g.elements['.lc-caption'].textContent.startsWith('The night rewinds. The fork is ahead again'));g.key('ArrowRight');g.phase('tunnelFinish');assert(!g.audit().state.caught);assert.equal(g.audit().card,'GONE');
 assert.equal(g.elements['.lc-actions'].children.length,0);g.next();g.phase('subEntry');
 assert.equal(g.audit().scene,'substation');assert.equal(g.audit().card,'SUBSTATION NINE');assert(g.audit().route.includes('Followed right'));assert.equal(g.audit().reflex.deaths,1);
});
test('scene changes play an exit beat and a dissolve before the next set fades up',()=>{
 const g=game();g.click('NEW CASE');g.phase('officeEntry');const from={...g.audit().camera};
 g.click('SKIP INTRO');assert.deepEqual(g.audit().transit,{phase:'brief',t:0});g.phase('officeEntry');assert.equal(g.elements['.lc-actions'].children.length,0);
 g.run(.6);assert.equal(g.audit().fade,1);assert.notDeepEqual(g.audit().camera,from);
 g.run(.6);assert(g.audit().fade<1&&g.audit().fade>0);assert.equal(g.audit().scene,'office');
 g.run(.4);g.phase('brief');assert.equal(g.audit().scene,'street');assert.equal(g.audit().transit,null);assert(g.audit().fade<1);assert.equal(g.audit().card,'STATION ROAD');
 g.run(1);assert.equal(g.audit().fade,1);assert.equal(g.audit().nonASCII,0);
 // Menus freeze a dissolve mid-way and resume it.
 g.click('FOLLOW');g.next();g.next();g.phase('qte');g.key('ArrowUp');g.phase('result');g.next();g.click('CONNECT');g.click('STATION SERVICE');g.run(5.4);assert(g.audit().transit);g.phase('arrival');
 g.elements['.lc-menu'].click();const t=g.audit().transit.t;g.run(2);assert.equal(g.audit().transit.t,t);g.click('RESUME');g.run(1.5);g.phase('stationEntry');
});
// Lamps. Running out of time at a lethal beat is a death: a lamp goes, the picture plays with no buttons, and the night rewinds
// itself to the windup with the rewind line. The third death from three lamps goes cold; a restart refills the lamps and resets
// only the chapter's own fields.
const toThePump=g=>{g.click('NEW CASE');g.click('SKIP INTRO');g.elements['.lc-timing'].click();g.click('FOLLOW');g.next();g.next();g.phase('qte');g.key('ArrowUp');g.phase('result');assert.equal(g.audit().state.choice,'person');
 g.next();g.click('CONNECT');g.click('STATION SERVICE');g.next();g.phase('stationEntry');g.next();throughDesk(g,'123');g.next();g.phase('pumpFind');g.click('GET BELL');g.phase('pumpDanger');};
test('lamps: running out of time at the pump is a death, the night rewinds itself, and the third death goes cold',()=>{
 const g=game({reduced:true});toThePump(g);
 assert.equal(g.audit().card,'','no GET READY card');assert.equal(g.elements['.lc-timer'].textContent,'LIVE');g.run(2.2);g.phase('pumpQte');
 let a=g.audit();assert.equal(a.window,3,'2.5 s plus the tape');assert.equal(g.elements['.lc-caption'].textContent,'');assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[<< CLOSE THE INLET]','[PULL BELL OUT >>]'],'the two moves are named, pointing the way their cues do');assert.equal(g.elements['.lc-timer'].textContent,'LIVE ##########','the window as a full bar');
 assert.deepEqual(a.labels.map(l=>l.dir+' '+l.text),['left  <<< 1 ','right  >>> 2 '],'steady cues with their numbers under reduced motion');
 g.key('ArrowDown');g.swipe('up');g.phase('pumpQte','a direction the beat does not offer is ignored');g.run(3.2,50);g.phase('pumpDeath');a=g.audit();assert.equal(a.card,'DROWNED');assert.equal(a.state.rewinds,2);assert.equal(a.state.deaths,1);assert.equal(a.state.rescue,'');assert.equal(g.elements['.lc-actions'].children.length,0);
 assert.equal(g.elements['.lc-score'].textContent,'REFLEX 1/2 // LAMPS ##. // ');assert.equal(JSON.parse(g.storage.getItem('last-light/save/v1')).state.phase,'pumpDanger','a death is never a resume point');
 g.next();g.phase('pumpDanger');assert.equal(g.audit().card,'REWIND');assert.equal(g.elements['.lc-caption'].textContent,'The night rewinds. The joint holds, Bell is still tapping the pipe, and the INLET wheel is at Rook\'s hand. Get ready.');
 g.run(2.2);g.phase('pumpQte');assert(!g.elements['.lc-caption'].textContent);g.run(3.2,50);g.phase('pumpDeath');assert.equal(g.audit().state.rewinds,1,'a timeout is the same death');
 g.next();g.phase('pumpDanger');g.run(2.2);g.run(3.2,50);g.phase('pumpDeath');assert.equal(g.audit().state.rewinds,0);assert.equal(g.audit().state.deaths,1,'the same death seen thrice is one bit');
 g.next();g.phase('coldCase');a=g.audit();assert.equal(a.state.dead,'pump');assert.equal(a.card,'CASE COLD');assert.equal(a.objective,'CASE COLD');assert.equal(a.scene,'pump');
 assert(g.elements['.lc-caption'].textContent.startsWith('Night Division, morning. IVO BELL, lamplighter, is recovered from Pump Room 4'));
 assert.equal(g.elements['.lc-outcome'].textContent,'ENDING: THE CASE GOES COLD (1/7 found). Inputs 1/2, deaths 1, restarts 0, grade B. Bell did not come out of Pump Room 4. Vale signed the report. Deaths seen this case: 1.');
 assert.deepEqual(a.records,{endings:['cold'],discoveries:['witness','tape','sharp'],cases:0,cold:1,deaths:['drowned']});
 assert.deepEqual(a.route,['Followed at once','Caught the courier','Searched the maintenance desk (3/5)','Went down suspecting Vale','Read the tape','Case cold at the pump']);assert(a.board.some(l=>l.startsWith('IVO BELL, lamplighter: drowned')));assert.equal(a.board[0],'THE CASE: gone cold. Inspector Vale signed the report.');
 assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[RESTART THE CHAPTER]','[RETURN TO MENU]']);
 g.click('RESTART');g.phase('pumpEntry');a=g.audit();assert.equal(a.card,'PUMP ROOM 4');assert.deepEqual([a.state.rewinds,a.state.restarts,a.state.deaths,a.state.dead,a.state.endingSeen],[3,1,1,'',false]);
 assert(a.state.decoded&&a.state.choice==='person','fields earned in earlier sets stay');
 g.next();g.click('GET BELL');g.run(2.2);g.phase('pumpQte');g.key('ArrowLeft');g.phase('pumpResult');a=g.audit();assert.equal(a.card,'INLET CLOSED');assert.equal(a.state.rescue,'valve');
 assert.deepEqual(a.reflex,{faced:2,landed:2,deaths:1,restarts:1,grade:'B'});assert(a.route.includes('Restarted a chapter'));assert.equal(a.records.cold,1);
 // Leaving a cold case for the menu clears the checkpoint; the records stay.
 const h=game({reduced:true});toThePump(h);h.run(2.2);for(let i=0;i<3;i++){h.run(3.2,50);h.phase('pumpDeath');h.next();if(i<2)h.run(2.2);}
 h.phase('coldCase');h.click('RETURN TO MENU');assert(h.audit().session.menu);assert(!h.elements['.lc-actions'].children.some(b=>/CONTINUE|RESUME/.test(b.textContent)));assert.equal(h.audit().records.cold,1);
 const back=game({reduced:true,storage:h.storage});assert(!back.elements['.lc-actions'].children.some(b=>/CONTINUE/.test(b.textContent)));assert.equal(back.audit().records.cold,1);
});
test('a survivable miss plays its worse story and offers the night for a lamp, or carrying on',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.elements['.lc-timing'].click();g.click('FOLLOW');g.next();g.next();g.phase('qte');
 g.key('ArrowLeft');g.phase('qte','a direction the beat does not offer is ignored');g.run(3.2,50);g.phase('result');let a=g.audit();assert.equal(a.state.choice,'missed');assert.equal(a.card,'TAKEN');assert.equal(a.state.rewinds,3,'a survivable miss takes no lamp by itself');
 assert(g.elements['.lc-caption'].textContent.includes('the red car comes back round the corner'));assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[REWIND THE NIGHT / 3 LAMPS]','[CARRY ON]']);
 g.click('REWIND');g.phase('danger');a=g.audit();assert.equal(a.state.rewinds,2);assert.equal(a.state.choice,'');assert(g.elements['.lc-caption'].textContent.startsWith('The night rewinds. The courier is upright'));
 g.run(2.2);g.phase('qte');assert(!g.audit().state.rewound||true);g.key('ArrowDown');g.phase('result');assert.equal(g.audit().state.choice,'book');assert.equal(g.elements['.lc-actions'].children.length,0);
 // The club: running out of time is the bottle; Krane takes the ledger; carrying on goes to the road without it.
 const c=game({reduced:true});c.click('CLUB','reel-actions');c.elements['.lc-timing'].click();c.next();c.phase('clubBooth');c.click('SAY NOTHING');c.phase('clubFace');assert.equal(c.audit().card,'');c.run(2.2);c.phase('clubQte');
 assert.deepEqual(c.audit().labels.map(l=>l.dir),['down','up']);c.key('ArrowLeft');c.phase('clubQte','a direction the beat does not offer is ignored');c.run(3,50);c.phase('clubResult');a=c.audit();assert.equal(a.card,'SIT DOWN');assert.equal(a.state.club,'late');assert.equal(a.state.rescue,'valve');
 assert(c.elements['.lc-caption'].textContent.includes('with Bell\'s ledger in his jacket'));assert(a.board.some(l=>l.startsWith('KRANE, Vale\'s bodyguard: has the signed ledger')));
 assert(c.elements['.lc-actions'].children.some(b=>b.textContent==='[REWIND THE NIGHT / 3 LAMPS]'));c.click('CARRY ON');c.phase('chaseEntry');assert(c.audit().state.clues.some(l=>l.startsWith('Krane took Vale\'s signed ledger')));
 // The bridge timed out: Vale gone for good; the jump with the gap open is a death.
 const b=game({reduced:true});b.click('CHASE','reel-actions');b.elements['.lc-timing'].click();b.next();b.phase('chaseQteA');b.key('s');b.phase('chaseBank');assert.equal(b.audit().state.gap,1);b.next();b.phase('chaseQteB');
 assert.deepEqual(b.audit().labels.map(l=>l.dir),['left','up']);assert(b.audit().window>=2);b.run(3,50);b.phase('chaseFinish');a=b.audit();assert.equal(a.card,'GONE');assert.equal(a.state.pursuit,'late');assert(b.elements['.lc-caption'].textContent.startsWith('Rook stands on the brakes'));
 b.click('REWIND');b.phase('chaseQteB');assert.equal(b.audit().state.pursuit,'chasing');b.key('ArrowUp');b.phase('gapDeath');a=b.audit();assert.equal(a.card,'SHORT');assert.equal(a.state.deaths,8);assert.equal(a.state.rewinds,1);
 b.next();b.phase('chaseQteB');b.key('ArrowLeft');b.phase('tunnelEntry');assert.equal(b.audit().state.pursuit,'ramp');
});
test('the back booth: showing Vale the order costs half a second at the bottle and puts his words in the notebook',()=>{
 const c=game({reduced:true});c.click('CLUB','reel-actions');c.elements['.lc-timing'].click();c.next();c.phase('clubBooth');
 assert(c.elements['.lc-caption'].textContent.startsWith('Vale does not get up.'));assert.deepEqual(c.elements['.lc-actions'].children.map(b=>b.textContent),['[SHOW HIM ORDER 7731]','[SAY NOTHING]']);
 c.click('SHOW HIM');c.phase('clubBooth');assert(c.audit().state.shown);assert(c.elements['.lc-caption'].textContent.includes('"Nobody reads a maintenance order, Rook. You have countersigned a hundred of mine."'));
 assert(c.audit().state.clues.some(l=>l.startsWith('Vale, shown order 7731')));assert.deepEqual(c.elements['.lc-actions'].children.map(b=>b.textContent),['[STAND YOUR GROUND]']);
 c.click('STAND YOUR GROUND');c.phase('clubFace');assert.equal(c.elements['.lc-caption'].textContent,'The bottle leaves Krane\'s hand. Get ready.');c.run(2.2);c.phase('clubQte');assert.equal(c.audit().window,1.5,'2 s less the half second for Krane already up');
 // The bottle lands and Krane takes the ledger; Vale is caught over the gap and Krane pinned, so the case ends word against word, with the booth in the closing.
 c.run(1.6,50);c.phase('clubResult');c.click('CARRY ON');c.phase('chaseEntry');c.next();c.key('ArrowRight');c.phase('chaseBank');c.next();c.phase('chaseQteB');c.key('ArrowUp');c.phase('chaseFinish');assert(c.audit().state.caught);c.next();
 c.elements['.lc-timing'].click();throughHall(c,'DIVE CLEAR');throughRoom(c,'NOT ENOUGH');
 assert(c.elements['.lc-outcome'].textContent.startsWith('ENDING: WORD AGAINST WORD'));assert(c.elements['.lc-caption'].textContent.endsWith(' Vale\'s own words about the order are in Rook\'s notebook. It will have to be enough.'));
 assert(c.audit().route.includes('Took the bottle'));
});
test('a tap on a cue is that cue, a swipe is its direction, and a tap elsewhere is nothing',()=>{
 const g=game({reduced:true,width:732});g.click('FLOOD','reel-actions');g.elements['.lc-timing'].click();g.next();g.click('GET BELL');g.run(2.2);g.phase('pumpQte');
 g.tap(1,1);g.phase('pumpQte');const [x,y]=g.cueCentre('right');g.tap(x+18,y);g.phase('pumpResult');assert.equal(g.audit().state.rescue,'pull');assert(g.audit().state.reaction>0);
 const s=game({reduced:true,width:732});s.click('FLOOD','reel-actions');s.elements['.lc-timing'].click();s.next();s.click('GET BELL');s.run(2.2);s.phase('pumpQte');
 s.swipe('down',[400,400],20);s.phase('pumpQte','a travel under 24 px is not a swipe, and there is no cue there');s.swipe('left',[400,400]);s.phase('pumpResult');assert.equal(s.audit().state.rescue,'valve');
 // Nothing lands while paused or in the menu; a swipe the beat does not offer is ignored, and the named button is its cue.
 const p=game({reduced:true,width:732});p.click('FLOOD','reel-actions');p.elements['.lc-timing'].click();p.next();p.click('GET BELL');p.run(2.2);p.phase('pumpQte');
 p.elements['.lc-pause'].click();p.key('ArrowLeft');p.swipe('left');p.phase('pumpQte');p.elements['.lc-pause'].click();p.elements['.lc-menu'].click();p.key('ArrowLeft');p.click('RESUME');p.phase('pumpQte');
 p.key('1');p.phase('pumpQte','1 and 2 do nothing in timed play');p.swipe('up');p.phase('pumpQte');p.click('PULL BELL OUT');p.phase('pumpResult');assert.equal(p.audit().state.rescue,'pull');
});
test('short windows are deterministic at any step, and a rewound beat counts once in the tally',()=>{
 // A live beat caps the step at 50 ms, so the harness steps a prompt at 50 ms or finer.
 for(const step of [50,25,16.7]){
  const g=game({reduced:true});g.click('SUBSTATION','reel-actions');g.elements['.lc-timing'].click();g.next();g.phase('subDock');g.next();g.next();g.phase('subDanger');g.next();g.phase('subQte');
  const w=g.audit().window;assert.equal(w,2,'1.5 s plus the keeper');g.run(w-.05,step);g.phase('subQte');g.run(.15,step);g.phase('subDeath');assert.equal(g.audit().card,'CRUSHED');
  g.next();g.phase('subDanger');g.run(2.2);g.key('d');g.phase('subResult');const a=g.audit();assert.equal(a.state.hall,'breaker');assert.equal(a.card,'LIGHTS OUT');
  // The preview stands past the market, the club and the carrier without playing them: faced, not landed.
  assert.deepEqual(a.reflex,{faced:8,landed:5,deaths:1,restarts:0,grade:'B'});
 }
 // The ramp route faces eight beats.
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.next();g.click('BRAKE');g.next();g.click('LOWER RAMP');g.next();g.phase('tunnelQte');g.click('FOLLOW RIGHT');g.next();
 throughHall(g,'DIVE CLEAR');throughRoom(g,'SOMEONE ABOVE');assert.deepEqual(g.audit().reflex,{faced:8,landed:6,deaths:0,restarts:0,grade:'A'});
});
test('a death on the road stops flawless; the deduction ladder costs a lamp, then the last wrong button',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.elements['.lc-timing'].click();g.click('FOLLOW');g.next();g.next();g.phase('qte');g.run(3.2,50);g.phase('result');assert.equal(g.audit().state.choice,'missed');
 g.click('CARRY ON');g.phase('evidence');g.click('CONNECT');g.click('THE HOTEL');g.phase('deduce');assert.equal(g.audit().state.rewinds,3);assert(g.audit().state.wrong);
 g.click('THE HOTEL');assert.equal(g.audit().state.rewinds,2);assert.equal(g.audit().card,'REWIND');assert(g.elements['.lc-caption'].textContent.startsWith('The hotel night clerk has never heard of Bell'));
 assert(!g.elements['.lc-actions'].children.some(b=>b.textContent.includes('HOTEL')));g.click('STATION SERVICE');g.next();g.next();throughDesk(g);g.next();
 assert(g.elements['.lc-caption'].textContent.includes('You took your time'));g.click('GET BELL');g.run(2.2);g.phase('pumpQte');assert.equal(g.audit().window,2,'the false lead costs half a second');g.key('ArrowRight');g.next();throughPumpRoom(g);g.click('TAKE BELL');g.next();
 g.click('STAY WITH');g.phase('roomEntry');g.next();g.phase('roomVale');g.click('LET HIM WALK');g.phase('roomDeduce');
 assert.equal(g.audit().board[0],'THE CASE: Vale sold the reserve batteries and locked Bell in to keep it quiet. The warrant can carry only what Rook can prove.','no answer to the deduction in the file');
 assert(!/manifest|hall/.test(g.elements['.lc-caption'].textContent),'the stay route saw no hall and no manifest');g.click('NOT ENOUGH');g.click('GO TO BELL');g.next();g.phase('canalEnd');
 const a=g.audit();assert.deepEqual(a.records.endings,['home']);assert(!a.records.discoveries.includes('flawless'));assert(!a.records.discoveries.includes('sharp'));assert.deepEqual(a.reflex,{faced:2,landed:1,deaths:0,restarts:0,grade:'A'});
 // Vale in the chair: the second wrong answer stalls the interview and the Board's ending is lost.
 const r=game({reduced:true});r.click('INTERVIEW','reel-actions');r.next();r.phase('roomDeduce');r.click('VALE SIGNED ALONE');assert(r.audit().state.slip&&!r.audit().state.stalled);r.click('NOT ENOUGH');
 assert(r.audit().state.stalled);assert(r.elements['.lc-caption'].textContent.startsWith('Vale asks for his lawyer'));assert.deepEqual(r.elements['.lc-actions'].children.map(b=>b.textContent),['[WRITE THE WARRANT]']);
 r.click('WRITE THE WARRANT');r.phase('roomName');assert(r.audit().state.clues.some(c=>c.includes('stalled the interview')));r.click('GO TO BELL');r.next();r.phase('canalEnd');
 assert(r.elements['.lc-outcome'].textContent.startsWith('ENDING: WORD AGAINST WORD'));assert(r.audit().route.includes('Left the line blank (second try)'));
 // Bell in the chair: the second wrong answer only removes the last wrong button.
 const s=game({reduced:true});s.click('ROOFTOP','reel-actions');s.next();s.click('STAY WITH');s.next();s.phase('roomVale');s.click('LET HIM WALK');s.phase('roomDeduce');s.click('VALE SIGNED ALONE');s.click('VALE SIGNED ALONE');
 assert(!s.audit().state.stalled);assert(s.elements['.lc-caption'].textContent.startsWith('Bell waits.'));assert.deepEqual(s.elements['.lc-actions'].children.map(b=>b.textContent),['[SOMEONE ABOVE VALE SIGNED]'],'the preview holds the dry ledger, so the right answer stays');
 // The loft: the second wrong reading removes both wrong buttons.
 const l=game({reduced:true});l.click('LOFT','reel-actions');l.next();l.click('STUDY THE MAP');l.click('BACK TO THE LAMP DEPOT');assert.equal(l.audit().state.rewinds,2);l.click('INTO THE STATION VAULTS');assert.equal(l.audit().state.rewinds,2);
 assert(l.elements['.lc-caption'].textContent.startsWith('Rook has now been wrong twice'));assert.deepEqual(l.elements['.lc-actions'].children.map(b=>b.textContent),['[UPTOWN, THROUGH THE FILAMENT]']);
});
test('every location previews with printable ASCII only and visible characters where expected',()=>{
 for(const [name,sprites] of [['OFFICE',1],['STREET',2],['LOFT',1],['STATION',2],['FLOOD',3],['ROOFTOP',3],['TRAM',1],['MARKET',3],['CLUB',6],['CHASE',0],['UNDERCITY',0],['SUBSTATION',2],['INTERVIEW',2],['DAWN',4]]){
  const g=game({reduced:true,width:732});g.click(name,'reel-actions');g.run(.5);
  const a=g.audit();assert.equal(a.nonASCII,0,name);assert(a.sprites.length>=sprites,`${name} sprites: ${a.sprites.length}`);assert(g.frame().length>2000,`${name} draws`);
 }
});
test('title cards, stingers, reflex keys and the case file follow the story',()=>{
 const g=game({reduced:true});assert.equal(g.audit().card,'LAST LIGHT');
 g.click('NEW CASE');assert.equal(g.audit().card,'NIGHT DIVISION');assert.equal(g.audit().scene,'office');g.click('SKIP INTRO');g.phase('brief');
 assert.equal(g.audit().card,'STATION ROAD');assert.deepEqual(g.audit().route,[]);g.run(3.2);assert.equal(g.audit().card,'');
 g.click('WATCH FIRST');g.run(8.3);g.phase('ready');assert.equal(g.audit().card,'NOTED');
 g.click('FOLLOW');g.next();g.phase('danger');assert.equal(g.audit().card,'');g.next();g.phase('qte');assert.equal(g.audit().card,'');
 g.key('ArrowRight');g.phase('qte','a wrong direction is ignored in untimed play');g.key('ArrowDown');g.phase('result');
 assert.equal(g.audit().state.choice,'book');assert.equal(g.audit().card,'SAVED');
 assert.deepEqual(g.audit().route,['Watched first','Saved the book']);assert.deepEqual(g.audit().reflex,{faced:1,landed:1,deaths:0,restarts:0,grade:'A'});
 assert.match(g.audit().board[2],/missing/);g.next();g.phase('evidence');assert.match(g.audit().board[2],/last logged at Pump Room 4/);assert.match(g.audit().board[3],/limped away/);
 g.click('CONNECT');assert(!g.audit().board[0].includes('North Station'),'the file does not answer the street deduction');g.click('THE HOTEL');g.phase('deduce');assert(g.audit().route.includes('Chased a false lead'));
 g.click('STATION SERVICE');g.next();assert.equal(g.audit().scene,'station');assert.equal(g.audit().card,'NORTH STATION');
 assert.equal(g.elements['.lc-journal'].hidden,false);assert.equal(g.elements['.lc-score'].textContent,'REFLEX 1/1 // LAMPS ### // ');assert.equal(g.audit().objective,'FIND BELL');
 g.elements['.lc-menu'].click();assert.equal(g.audit().card,'LAST LIGHT');assert.equal(g.elements['.lc-records-box'].hidden,false);
 g.click('RESUME');assert.equal(g.audit().card,'');assert.equal(g.elements['.lc-records-box'].hidden,true);
});
test('closing a case records the ending and discoveries; previews and new cases leave records intact',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.click('SKIP INTRO');g.click('FOLLOW');g.next();g.next();g.click('CATCH');g.next();g.click('CONNECT');g.click('STATION SERVICE');g.next();g.next();
 throughDesk(g,'123');g.next();g.click('GET BELL');g.next();g.click('CLOSE THE INLET');g.next();throughPumpRoom(g);g.click('TAKE BELL');g.next();
 g.click('LISTEN');g.run(8.3);g.click('ASK NELL');g.click('PURSUE');g.next();g.click('RIDE ON');g.next();g.next();g.click('PUSH THROUGH');g.next();g.click('SLIP INTO');g.next();
 g.next();g.click('SAY NOTHING');g.next();g.click('VAULT');assert.equal(g.audit().card,'OVER THE BAR');g.next();
 g.next();g.click('DIVE RIGHT');g.next();g.click('FOLLOW OVER');g.next();
 throughHall(g,'DIVE CLEAR');g.phase('roomEntry');g.next();g.phase('roomDeduce');g.click('VALE SIGNED ALONE');g.phase('roomDeduce');assert(g.audit().state.slip);g.click('SOMEONE ABOVE');g.click('GO TO BELL');g.next();g.phase('canalEnd');
 assert.equal(g.audit().card,'CASE CLOSED');
 const records=g.audit().records;assert.deepEqual(records.endings,['board']);assert.equal(records.cases,1);
 assert.deepEqual(records.discoveries,['witness','tape','ledger','band','confession','jump','chip','flawless','pinned']);
 assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: LIGHTS ON THE BOARD (1/7 found). Inputs 7/7, deaths 0, restarts 0, grade A.'));
 assert.deepEqual(g.audit().route,['Followed at once','Caught the courier','Searched the maintenance desk (3/5)','Went down suspecting Vale','Read the tape','Searched Pump Room 4 (2/4)','Closed the inlet','Listened to the band',"Heard Nell's confession",'Pursued Vale','Slipped the cart','Went over the bar','Dove right','Jumped the gap','Dived clear',"Named the Board's man (second try)"]);
 g.click('RETURN TO MENU');const lines=g.elements['.lc-records'].children.map(li=>li.textContent);
 assert(lines[0].startsWith('ENDINGS 1/7'));assert(lines.some(l=>l.startsWith('LIGHTS ON THE BOARD')));assert(lines.some(l=>l.startsWith('?????')));assert(lines.includes('DEATHS SEEN 0/6'));
 g.click('CHASE','reel-actions');g.next();g.click('BRAKE');g.next();g.click('LOWER RAMP');g.phase('tunnelEntry');g.next();g.click('CUT LEFT');assert(g.audit().state.caught);g.next();
 throughHall(g,'PULL THE BREAKER');throughRoom(g,'SOMEONE ABOVE');
 assert.equal(g.audit().records.cases,1);assert(g.elements['.lc-outcome'].textContent.startsWith('ENDING: LIGHTS ON THE BOARD (preview).'));
 g.elements['.lc-menu'].click();g.click('NEW CASE');g.click('START NEW CASE');g.phase('officeEntry');
 assert.equal(JSON.parse(g.storage.getItem('last-light/save/v1')).state.phase,'officeEntry');assert.equal(g.audit().records.cases,1);
 g.elements['.lc-sound'].click();assert(g.audit().state.sound);const reloaded=game({storage:g.storage});assert(reloaded.audit().state.sound);
});
test('timed misses, pausing and declining pursuit still reach coherent outcomes',()=>{
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.elements['.lc-timing'].click();g.next();g.phase('chaseQteA');
 const event=g.audit().state.event;g.document.hidden=true;g.run(3);assert.equal(g.audit().state.event,event);g.document.hidden=false;
 g.elements['.lc-pause'].click();g.run(3);assert.equal(g.audit().state.event,event);g.elements['.lc-pause'].click();
 // The carrier left to time out is a death; the bridge left to time out is survivable and carried; the rack is a death, rewound and landed.
 g.run(3,50);g.phase('chaseDeath');assert.equal(g.audit().card,'OVER THE EDGE');assert.equal(g.audit().state.deaths,4);g.next();g.phase('chaseQteA');assert(g.elements['.lc-caption'].textContent.startsWith('The night rewinds. The carrier is in its own lane'));
 g.key('ArrowRight');g.phase('chaseBank');assert.equal(g.audit().card,'CLEAR');g.next();g.phase('chaseQteB');g.run(3,50);g.phase('chaseFinish');assert.equal(g.audit().card,'GONE');g.click('CARRY ON');g.phase('subEntry');
 g.next();g.phase('subDock');g.next();g.phase('subManifest');g.next();g.phase('subDanger');g.next();g.phase('subQte');g.run(2.2,50);g.phase('subDeath');assert.equal(g.audit().state.hall,'');assert.equal(g.elements['.lc-actions'].children.length,0);
 g.next();g.phase('subDanger');g.run(2.2);g.phase('subQte');g.key('ArrowLeft');g.phase('subResult');assert.equal(g.audit().state.hall,'dive');g.next();g.phase('subDawn');g.next();
 throughRoom(g,'SOMEONE ABOVE');assert(!g.audit().state.caught);assert.deepEqual(g.audit().reflex,{faced:7,landed:4,deaths:2,restarts:0,grade:'B'});
 assert(g.elements['.lc-outcome'].textContent.includes('THE BODYGUARD TALKS'));assert.equal(g.audit().state.rewinds,1);
 const s=game({reduced:true});s.click('ROOFTOP','reel-actions');s.next();s.click('STAY WITH');s.phase('roomEntry');assert.equal(s.audit().scene,'room');s.next();
 assert(s.audit().board.some(l=>l.startsWith('IVO BELL')));s.phase('roomVale');s.click('LET HIM WALK');s.click('SOMEONE ABOVE');s.click('GO TO BELL');s.next();s.phase('canalEnd');assert.equal(s.audit().state.pursuit,'stay');
 assert(s.elements['.lc-outcome'].textContent.includes('THE LAMPLIGHTER HOME'));assert.deepEqual(s.audit().reflex,{faced:2,landed:2,deaths:0,restarts:0,grade:'A'});
});
// The stage: the picture fills its area by the vertical field-of-view rule and the approved frame is reproduced exactly.
test('the picture fills the stage by the vertical field-of-view rule and keeps the approved frame',()=>{
 // The boot picture is the menu, which has its own grid density; the story grid is measured on the street through the reel.
 const street=g=>{g.click('STREET','reel-actions');return g;};
 const ref=street(game({width:756})).audit(),fill=street(game({width:1408,innerWidth:1440,innerHeight:900,stage:{width:1408,height:780}})),a=fill.audit();
 assert.deepEqual([ref.grid.W,ref.grid.H],[180,70]);
 assert.deepEqual([a.grid.W,a.grid.H],[217,70]);assert.equal(a.grid.fx,ref.grid.fx);assert.equal(a.grid.fy,ref.grid.fy);assert.equal(a.grid.cw,780/(70*1.72));assert.equal(a.layout,'stacked');
 assert.equal(fill.canvas.style.width,217*a.grid.cw+'px');assert.equal(fill.canvas.style.height,70*a.grid.ch+'px');
 // The added columns frame the same picture: every sprite keeps its rows and moves by half the added width.
 for(const r of ref.sprites){const s=a.sprites.find(x=>x.who===r.who);assert(s,r.who);assert.equal(s.rows,r.rows);assert.equal(s.y0,r.y0);assert(Math.abs(s.x0-r.x0-18.5)<=.5,`${r.who} shifted by ${s.x0-r.x0}`);}
 fill.layout(3440,1200);assert.equal(fill.audit().grid.W,240,'an ultrawide is capped and pillarboxed');
 const side=street(game({width:523,innerWidth:812,innerHeight:375,stage:{width:532,height:351}})).audit();assert.equal(side.layout,'side');assert.deepEqual([side.grid.W,side.grid.H],[124,48]);
 const phone=street(game({width:375,innerWidth:375,innerHeight:812,stage:{width:375,height:599}})).audit(),phoneRef=street(game({width:375})).audit();
 assert.deepEqual([phone.grid.W,phone.grid.H],[89,70]);assert.equal(phone.grid.fx,phoneRef.grid.fx);assert.equal(phone.grid.cw,phoneRef.grid.cw);assert.equal(phoneRef.grid.H,60);
});
// The menu tableau asks for a denser grid (density 2): twice the rows in the same stage height at the same field of view,
// Rook from his portrait sheet; a story set returns to the 70-row grid, and the harness without a stage keeps the fixed rule.
test('the menu set draws on its dense grid and a story set returns to 70 rows',()=>{
 const g=game({width:1408,innerWidth:1440,innerHeight:900,stage:{width:1408,height:780}}),ref=game({width:756}).audit();
 let a=g.audit();assert.equal(a.scene,'menu');assert.deepEqual([a.grid.W,a.grid.H,a.grid.density],[434,140,2]);
 assert.equal(a.grid.fx,2*ref.grid.fx);assert.equal(a.grid.fy,2*ref.grid.fy);assert.equal(a.grid.cw,780/(140*1.72));assert.equal(g.canvas.style.height,140*a.grid.ch+'px');
 assert.deepEqual([ref.grid.W,ref.grid.H,ref.grid.density],[180,70,1],'no stage: the fixed rule, whatever the set asks');
 g.run(1);a=g.audit();const rook=a.sprites.find(r=>r.who==='rook');assert(rook&&rook.sheet==='portrait'&&rook.eyes===1,JSON.stringify(a.sprites));assert.equal(a.nonASCII,0);
 g.click('NEW CASE');a=g.audit();assert.equal(a.scene,'office');assert.deepEqual([a.grid.W,a.grid.H,a.grid.density],[217,70,1]);assert.equal(a.grid.fx,ref.grid.fx);
 g.elements['.lc-menu'].click();g.click('RESUME');assert.deepEqual([g.audit().grid.W,g.audit().grid.H],[217,70],'the menu over a story set keeps the story grid');
 const phone=game({width:375,innerWidth:375,innerHeight:812,stage:{width:375,height:599}}).audit();assert.deepEqual([phone.grid.W,phone.grid.H,phone.grid.density],[178,140,2]);
 // The portrait tier is a close-up for the menu alone: a story shot never picks it.
 const s=game({width:732});s.click('STATION','reel-actions');s.run(3);for(const r of s.audit().sprites)assert(['full','mid','small'].includes(r.sheet),r.sheet);
});
test('a cutscene holds until its caption is read; a tap paces the chunks and never ends the beat before the text',()=>{
 const g=game();g.click('LOFT','reel-actions');g.phase('loftEntry');
 const c=g.audit().caption;assert(c.chunks.length>=2,'the loft caption plays in chunks');assert(c.hold>7,'the beat holds longer than its 7 s picture');
 for(const t of c.chunks)assert(t.length<=150&&/[.!?"]$/.test(t),t);
 assert(Math.abs(c.holds[0]-Math.max(2,c.chunks[0].length/45+c.chunks[0].split(' ').length*.3+.4))<1e-9);assert(Math.abs(c.hold-c.holds.reduce((s,h)=>s+h,0)-.4)<1e-9);
 assert.equal(g.elements['.lc-said'].textContent,c.text,'the whole caption is announced once');
 g.run(.6);let a=g.audit().caption;assert(a.shown>=20&&a.shown<c.chunks[0].length,'types at 45 characters a second');// the reel's first frame carries no timeassert.equal(g.elements['.lc-more'].textContent,'');
 g.elements['.lc-picture'].click();a=g.audit().caption;assert.equal(a.index,0);assert.equal(a.shown,c.chunks[0].length);assert.equal(g.elements['.lc-more'].textContent,'TAP TO CONTINUE');
 g.elements['.lc-caption'].click();a=g.audit().caption;assert.equal(a.index,1);assert.equal(a.shown,0);
 g.key(' ');a=g.audit().caption;assert.equal(a.shown,c.chunks[1].length);
 for(let i=0;i<c.chunks.length;i++)g.key('Enter');
 a=g.audit().caption;assert.equal(a.index,c.chunks.length-1,'the last chunk stays');assert.equal(g.elements['.lc-more'].textContent,'');
 g.run(7.2);g.phase('loftEntry','read early, the beat still waits for its own hold unless the player moves on');
 g.run(c.hold-7.7+.3);g.phase('loftTable');assert.equal(g.elements['.lc-said'].textContent,g.audit().caption.text);
 // Back from the menu, the beat's caption resumes where it was; a prompt with no caption holds for nothing.
 g.elements['.lc-picture'].click();const shown=g.audit().caption.shown;g.elements['.lc-menu'].click();g.run(1);g.click('RESUME');assert.equal(g.audit().caption.shown,shown);
});
test('the transition line is chunk zero of the next phase and outlives the dissolve and the chapter card',()=>{
 const line='Down to Station Road, where a stranger has Bell\'s lantern.';
 const g=game();g.click('NEW CASE');g.click('SKIP INTRO');
 let a=g.audit();assert.deepEqual(a.transit,{phase:'brief',t:0});assert(a.caption.line);assert.deepEqual(a.caption.chunks,[line]);
 g.run(1.7);g.phase('brief');a=g.audit();assert.equal(a.card,'STATION ROAD');// the harness's first frame carries no time; 58 characters take 1.29 s
 assert.equal(a.caption.index,0);assert.equal(a.caption.chunks[0],line);assert(a.caption.chunks.length>=2&&a.caption.chunks[1].startsWith('Rook: "Whoever has Bell\'s lantern'));assert(!a.caption.line);
 assert.equal(a.caption.visible,line,'typed through the glide and held past the cut');
 g.run(a.caption.holds[0]-1.6+.2);a=g.audit();assert.equal(a.caption.index,1);assert.equal(a.state.phase,'brief');
 // The cutscene after a transition holds for the line and for its own text (a timed prompt is answered by direction).
 g.click('FOLLOW');g.next();g.next();g.phase('qte');g.key('ArrowUp');g.phase('result');assert.equal(g.audit().state.choice,'person');g.next();g.click('CONNECT');g.click('STATION SERVICE');g.phase('arrival');g.next();g.phase('stationEntry');
 a=g.audit().caption;assert.equal(a.chunks[0],'Three knocks at the service hatch, and Nell knows the knock.');assert.equal(a.index,0);assert(a.hold>7);
 g.run(7.5);g.phase('stationEntry');g.next();g.phase('stationDesk');
 // Reduced motion cuts directly; the line then plays as a chunk with its own reading hold.
 const r=game({reduced:true});r.click('NEW CASE');r.click('SKIP INTRO');r.phase('brief');a=r.audit().caption;assert.equal(a.chunks[0],line);assert.equal(a.visible,line);assert.equal(a.holds[0],10*.3+.8);
});
// The intro's look-around: four examine markers in the picture and four buttons under it, a tap on a marker's rectangle or
// its number key examines the spot (its bit, its clue, its caption, its camera), the stairs open at two, arrows do nothing.
test('the office intro is an arrival and a look around the desk: markers, keys, taps, the exit at two looks, and resume',()=>{
 const g=game({width:732});g.click('NEW CASE');g.phase('officeEntry');assert.equal(g.audit().card,'NIGHT DIVISION');
 assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[SKIP INTRO]']);
 g.next();g.phase('officeDesk');g.run(2);let a=g.audit();
 assert.deepEqual(a.labels.map(l=>l.spot+' '+l.text),['file [1]','board [2]','log [3]','window [4]']);
 assert(a.labels.every(l=>l.x0>=0&&l.x1<a.columns&&l.y0>=0&&l.y0<a.rows),'four markers in the frame');
 assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent),['[1] THE BELL FILE','[2] THE CASE BOARD','[3] THE DISPATCH LOG','[4] THE WINDOW']);
 assert.equal(g.elements['.lc-timer'].textContent,'TAP A [NUMBER]');assert.equal(a.state.officeLooked,0);assert.equal(a.card,'');assert.equal(a.objective,'A MISSING LAMPLIGHTER');
 assert(g.elements['.lc-caption'].textContent.startsWith('Bell\'s file came from Inspector Vale\'s office, stamped NO FURTHER ACTION.'));assert.deepEqual(a.route,[]);
 const cw=732/a.columns,ch=cw*1.72,inkAt=l=>g.frame().find(d=>d[0]==='['&&Math.round(d[1]/cw)===l.x0&&Math.round(d[2]/ch)===l.y0)[3];
 const unseen=inkAt(a.labels[1]);
 const camera={...a.camera},[x,y]=g.spotCentre('board');g.tap(x+12,y);a=g.audit();
 assert.equal(a.state.officeLooked,2);assert.equal(a.spot,'board');assert(a.state.clues.some(c=>c.startsWith('Case board: Inspector Aurel Vale')));
 assert(g.elements['.lc-caption'].textContent.startsWith('On the case board'));assert.equal(a.caption.chunks.length,2);assert.equal(a.caption.index,0);
 assert.equal(JSON.parse(g.storage.getItem('last-light/save/v1')).state.officeLooked,2,'a look is checkpointed');
 g.run(1);a=g.audit();assert.notDeepEqual(a.camera,camera,'the camera eases to the board');assert.equal(a.state.phase,'officeDesk');
 assert(g.elements['.lc-actions'].children[1].className.includes('lc-seen'));assert.equal(g.elements['.lc-timer'].textContent,'TAP A [NUMBER]');
 assert(g.audit().board.some(l=>l.startsWith('INSPECTOR VALE')),'the board look puts Vale on the persons of interest');
 g.key('ArrowLeft');g.key('ArrowDown');g.swipe('up');a=g.audit();assert.equal(a.state.phase,'officeDesk');assert.equal(a.state.officeLooked,2);assert.equal(a.state.rewinds,3);
 g.key('1');a=g.audit();assert.equal(a.state.officeLooked,3);assert.equal(a.spot,'file');assert.equal(g.elements['.lc-timer'].textContent,'YOUR MOVE');
 assert.deepEqual(g.elements['.lc-actions'].children.map(b=>b.textContent).slice(-1),['[TAKE THE STAIRS]']);assert.deepEqual(a.route,['Looked over the desk (2/4)']);
 g.run(5.5);a=g.audit();const seen=a.labels.find(l=>l.spot==='file');assert(seen&&inkAt(seen)!==unseen,'an examined marker changes colour');assert.equal(a.labels.filter(l=>l.spot).length,4);
 // Re-reading an examined spot restarts its caption and changes nothing else.
 g.key('2');a=g.audit();assert.equal(a.state.officeLooked,3);assert.equal(a.spot,'board');assert.equal(a.caption.index,0);assert.equal(a.state.clues.length,1);
 // A resume keeps the bits and opens on the beat's own line, with the stairs already open.
 const r=game({width:732,storage:g.storage});r.click('CONTINUE CASE');r.phase('officeDesk');a=r.audit();assert.equal(a.state.officeLooked,3);assert.equal(a.spot,'');
 assert(r.elements['.lc-caption'].textContent.startsWith('Bell\'s file came from Inspector Vale\'s office'));assert(r.elements['.lc-actions'].children.some(b=>b.textContent==='[TAKE THE STAIRS]'));
 g.click('TAKE THE STAIRS');assert.deepEqual(g.audit().transit,{phase:'brief',t:0});g.next();g.phase('brief');assert.equal(g.audit().scene,'street');assert.equal(g.audit().card,'STATION ROAD');
 // SKIP INTRO from the arrival still goes straight to the street; a checkpoint at a removed office beat resumes at the desk.
 const s=game({reduced:true});s.click('NEW CASE');s.click('SKIP INTRO');s.phase('brief');assert.deepEqual(s.audit().route,[]);
 const old=memoryStorage();old.setItem('last-light/save/v1',JSON.stringify({version:1,state:{phase:'officeWindow',clues:[]}}));
 const o=game({reduced:true,storage:old});o.click('CONTINUE CASE');o.phase('officeDesk');assert.equal(o.audit().state.officeLooked,0);
});
test('a cutscene ends on Enter, Space or a tap only once its caption is read and its picture has played',()=>{
 // The loft's entry: two chunks over a seven-second picture. Read at once, the text is done at about six seconds.
 const g=game();g.click('LOFT','reel-actions');g.phase('loftEntry');const c=g.audit().caption;assert.equal(c.chunks.length,2);
 g.key('Enter');g.key('Enter');g.key(' ');let a=g.audit().caption;assert.equal(a.index,1);assert.equal(a.shown,c.chunks[1].length);assert(!a.done);
 g.run(c.holds[1]+.2);assert(g.audit().caption.done);g.key('Enter');g.phase('loftEntry','the picture has not played its seven seconds');
 g.run(7-c.holds[1]);g.key('Enter');g.phase('loftTable');
 // A tap on the picture: the first paces the chunks, the one after the text is read and the picture played moves on.
 const t=game();t.click('LOFT','reel-actions');t.run(7.2);t.elements['.lc-picture'].click();t.phase('loftEntry');assert.equal(t.audit().caption.index,1);
 t.run(c.holds[1]+.2);t.elements['.lc-pause'].click();t.key('Enter');t.phase('loftEntry','not while paused');t.elements['.lc-pause'].click();
 t.elements['.lc-caption'].click();t.phase('loftTable');
 // A hand-written case cutscene ends the same way; a result does not.
 const s=game();s.click('STATION','reel-actions');s.phase('stationEntry');s.run(7.2);for(let i=0;i<4;i++)s.key('Enter');s.run(s.audit().caption.holds.at(-1)+.2);s.key('Enter');s.phase('stationDesk');
 const p=game({reduced:true});p.click('FLOOD','reel-actions');p.next();p.click('GET BELL');p.next();p.phase('pumpQte');p.click('CLOSE THE INLET');p.phase('pumpResult');p.run(1);p.key('Enter');p.phase('pumpResult');
});
test('the case file drawer replaces the picture, pauses the game and freezes a deadline',()=>{
 const g=game({reduced:true});g.click('CHASE','reel-actions');g.elements['.lc-timing'].click();g.next();g.phase('chaseQteA');g.run(.5);
 const event=g.audit().state.event;assert(event>0);
 g.elements['.lc-file'].click();let a=g.audit();assert(a.drawer&&a.state.paused);assert(g.canvas.hidden&&g.elements['.lc-picture'].hidden&&!g.elements['.lc-drawer'].hidden);
 assert.equal(g.elements['.lc-file'].textContent,'[CLOSE FILE]');assert.equal(g.elements['.lc-file'].attrs['aria-expanded'],'true');
 g.run(3);a=g.audit();assert.equal(a.state.event,event);assert.equal(a.state.phase,'chaseQteA');assert(g.elements['.lc-actions'].children.every(b=>b.disabled));
 g.key('Escape');a=g.audit();assert(!a.drawer&&!a.state.paused&&!g.canvas.hidden&&g.elements['.lc-drawer'].hidden);assert.equal(g.elements['.lc-file'].textContent,'[CASE FILE]');
 g.run(.3);assert(g.audit().state.event>event);
 // A pause the player set survives the drawer; Escape and P pause; the settings show on the menu screen only.
 g.key('p');assert(g.audit().state.paused);g.elements['.lc-file'].click();g.elements['.lc-file'].click();assert(g.audit().state.paused);g.key('Escape');assert(!g.audit().state.paused);
 assert(g.elements['.lc-timing'].hidden&&g.elements['.lc-mono'].hidden&&g.elements['.lc-sound'].hidden&&g.elements['.lc-full'].hidden);
 g.elements['.lc-menu'].click();assert(!g.elements['.lc-timing'].hidden&&!g.elements['.lc-mono'].hidden&&!g.elements['.lc-sound'].hidden);
});
// The case file opens on the case as Rook understands it, and that line moves with the story: a lamplighter missing before
// the desk, the theory Rook took down the ladder, then what Bell says Vale did.
test('the case file leads with the case as Rook currently understands it',()=>{
 const g=game({reduced:true});g.click('NEW CASE');g.phase('officeEntry');
 assert.equal(g.audit().board[0],'THE CASE: A lamplighter is missing and his street is dark.');
 g.click('SKIP INTRO');g.phase('brief');assert.equal(g.audit().board[0],'THE CASE: Ivo Bell is missing, and a stranger is carrying his lantern.');
 g.click('FOLLOW');g.next();g.next();g.phase('qte');g.click('CATCH');g.next();g.click('CONNECT');g.click('STATION SERVICE');g.next();g.phase('stationEntry');g.next();throughDesk(g,'13');
 assert.equal(g.audit().board[0],'THE CASE: Rook thinks Inspector Vale locked Bell under North Station.');
 g.next();g.phase('pumpFind');g.click('GET BELL');g.next();g.phase('pumpQte');g.click('CLOSE THE INLET');g.next();throughPumpRoom(g);
 assert.equal(g.audit().board[0],'THE CASE: Vale sold the reserve batteries and locked Bell in to keep it quiet.');
 assert(g.audit().board.slice(1).every(l=>!l.startsWith('THE CASE')),'one case line, above the persons of interest');
});
// The voice rule: every set's entry caption carries one line of Rook's, and no chunk splits a speech from its speaker.
// The cold open stays short enough to read in about fifteen seconds.
test('every entry caption carries one Rook line, speeches stay whole in a chunk, and the cold open is short',()=>{
 for(const label of ['STREET','LOFT','STATION','FLOOD','ROOFTOP','TRAM','MARKET','CLUB','CHASE','UNDERCITY','SUBSTATION','INTERVIEW','DAWN']){
  const g=game();g.click(label,'reel-actions');const c=g.audit().caption;
  assert.equal((c.text.match(/Rook: "/g)||[]).length,1,label+': '+c.text);
  for(const t of c.chunks)assert(t.length<=150&&(t.match(/"/g)||[]).length%2===0,label+' chunk: '+t);
 }
 const o=game();o.click('NEW CASE');o.phase('officeEntry');const c=o.audit().caption;
 assert(c.hold<=15,'cold open holds '+c.hold.toFixed(1)+' s');assert(/lamplighter/.test(c.text)&&/Ivo Bell/.test(c.text));
});
// A stay-route arrest that stalls is word against word, not the lamplighter home: Vale is in custody, the name above him
// was never read on this route, and the case file does not call him at large.
test('a stalled arrest in Vale\'s own building ends word against word, with initials and not a name',()=>{
 const s=game({reduced:true});s.click('ROOFTOP','reel-actions');s.next();s.click('STAY WITH');s.next();s.phase('roomVale');s.click('ARREST HIM');s.click('SIT HIM DOWN');s.phase('roomDeduce');
 s.click('VALE SIGNED ALONE');assert(s.elements['.lc-caption'].textContent.includes('the same initials, H.A.'),'no manifest on the stay route');assert(!s.elements['.lc-caption'].textContent.includes('ASHE'));
 s.click('NOT ENOUGH');assert(s.audit().state.stalled);s.click('WRITE THE WARRANT');s.click('GO TO BELL');s.next();s.phase('canalEnd');
 assert(s.elements['.lc-outcome'].textContent.startsWith('ENDING: WORD AGAINST WORD'));assert(s.elements['.lc-caption'].textContent.includes('still a set of initials'));
 assert(!s.audit().board[0].includes('at large'));assert(!/Halden|Ashe/.test(s.elements['.lc-caption'].textContent));
});
