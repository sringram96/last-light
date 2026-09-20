const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createSaveStore}=require('../src/game/save-store.js');
const {memoryStorage}=require('./harness.cjs');
const phases=['brief','roofQuiet','chaseQteA'];
const state={phase:'roofQuiet',clues:['Radio lead'],choice:'person',rescue:'valve',distance:20,phaseDistance:20,gap:0};
test('save is versioned, independent of preferences, and returned as a copy',()=>{
 const storage=memoryStorage(),store=createSaveStore(storage,phases);assert(store.save({...state,mono:true,event:7,paused:true}));
 const loaded=store.load();assert.equal(loaded.event,0);assert.equal(loaded.paused,false);assert.equal(loaded.mono,undefined);
 loaded.clues.push('Uncommitted');assert.equal(store.load().clues.length,1);
 assert.equal(JSON.parse(storage.getItem('last-light/save/v1')).version,1);
});
test('legacy prototype checkpoints migrate; clearing also prevents legacy resurrection',()=>{
 const storage=memoryStorage();storage.setItem('the-last-light-case-v2',JSON.stringify(state));
 const store=createSaveStore(storage,phases);assert.equal(store.load().phase,'roofQuiet');assert(storage.getItem('last-light/save/v1'));
 store.clear();assert.equal(createSaveStore(storage,phases).load(),null);
});
test('malformed saves and future schemas never enter the runtime',()=>{
 assert.equal(createSaveStore(memoryStorage(),phases).save(state)&&createSaveStore(memoryStorage(),phases).load(),null);
 const s=memoryStorage();createSaveStore(s,phases).save(state);assert.equal(createSaveStore(s,phases).load().rewinds,3);
 for(const stateValue of [{...state,phase:'unknown'},{...state,distance:'far'},{...state,gap:1.5},{...state,twist:'yes'},{...state,clues:[{}]},{...state,rewinds:5},{...state,rewinds:1.5}]){
  const storage=memoryStorage();storage.setItem('last-light/save/v1',JSON.stringify({version:1,state:stateValue}));assert.equal(createSaveStore(storage,phases).load(),null);
 }
 for(const value of ['broken','{"version":99,"state":{}}']){const storage=memoryStorage();storage.setItem('last-light/save/v1',value);assert.equal(createSaveStore(storage,phases).load(),null);}
});
test('case records accumulate endings and discoveries, survive new cases, and reject malformed data',()=>{
 const storage=memoryStorage(),store=createSaveStore(storage,phases);
 assert.deepEqual(store.readRecords(),{endings:[],discoveries:[],cases:0});
 store.record({ending:'home',discoveries:['tape','tape']});store.record({ending:'home',discoveries:['ledger']});
 assert.deepEqual(store.readRecords(),{endings:['home'],discoveries:['tape','ledger'],cases:2});
 store.clear();assert.equal(createSaveStore(storage,phases).readRecords().cases,2);
 for(const value of ['broken','{"version":2,"endings":["home"],"discoveries":[]}','{"version":1,"endings":[{}],"discoveries":[]}','{"version":1,"endings":["home"],"discoveries":"tape"}']){
  const s=memoryStorage();s.setItem('last-light/records/v1',value);assert.deepEqual(createSaveStore(s,phases).readRecords(),{endings:[],discoveries:[],cases:0});
 }
 assert.deepEqual(createSaveStore(storage,phases).readSettings({mono:false,untimed:false,sound:false}),{mono:false,untimed:false,sound:false});
});
test('blocked browser storage keeps a session checkpoint and settings',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 const store=createSaveStore(blocked,phases);assert.equal(store.save(state),false);assert.equal(store.load().phase,'roofQuiet');assert.equal(store.isDurable(),false);
 store.saveSettings({mono:true,untimed:true});assert.deepEqual(store.readSettings({mono:false,untimed:false}),{mono:true,untimed:true});
});
