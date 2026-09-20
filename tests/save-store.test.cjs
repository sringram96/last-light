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
 // The lamps, deaths and restarts fields default when absent and are bounded integers; the cold-case fields have their defaults.
 const loaded=createSaveStore(s,phases).load();assert.deepEqual([loaded.deaths,loaded.restarts,loaded.dead,loaded.stalled,loaded.faced,loaded.shown],[0,0,'',false,false,false]);
 const t=memoryStorage();createSaveStore(t,phases).save({...state,deaths:63,restarts:9,dead:'rack',stalled:true,shown:true});const kept=createSaveStore(t,phases).load();assert.deepEqual([kept.deaths,kept.restarts,kept.dead,kept.stalled,kept.shown],[63,9,'rack',true,true]);
 for(const stateValue of [{...state,phase:'unknown'},{...state,distance:'far'},{...state,gap:1.5},{...state,twist:'yes'},{...state,clues:[{}]},{...state,rewinds:5},{...state,rewinds:1.5},{...state,deaths:64},{...state,deaths:2.5},{...state,restarts:10},{...state,dead:'street'},{...state,stalled:'yes'}]){
  const storage=memoryStorage();storage.setItem('last-light/save/v1',JSON.stringify({version:1,state:stateValue}));assert.equal(createSaveStore(storage,phases).load(),null);
 }
 for(const value of ['broken','{"version":99,"state":{}}']){const storage=memoryStorage();storage.setItem('last-light/save/v1',value);assert.equal(createSaveStore(storage,phases).load(),null);}
});
test('case records accumulate endings and discoveries, survive new cases, and reject malformed data',()=>{
 const storage=memoryStorage(),store=createSaveStore(storage,phases);
 assert.deepEqual(store.readRecords(),{endings:[],discoveries:[],cases:0,cold:0,deaths:[]});
 store.record({ending:'home',discoveries:['tape','tape']});store.record({ending:'home',discoveries:['ledger'],deaths:['drowned']});
 assert.deepEqual(store.readRecords(),{endings:['home'],discoveries:['tape','ledger'],cases:2,cold:0,deaths:['drowned']});
 // A cold case counts under cold, not under the cases closed; its deaths join the list once.
 store.record({ending:'cold',cold:1,deaths:['drowned','arc']});assert.deepEqual(store.readRecords(),{endings:['home','cold'],discoveries:['tape','ledger'],cases:2,cold:1,deaths:['drowned','arc']});
 store.clear();assert.equal(createSaveStore(storage,phases).readRecords().cases,2);
 for(const value of ['broken','{"version":2,"endings":["home"],"discoveries":[]}','{"version":1,"endings":[{}],"discoveries":[]}','{"version":1,"endings":["home"],"discoveries":"tape"}']){
  const s=memoryStorage();s.setItem('last-light/records/v1',value);assert.deepEqual(createSaveStore(s,phases).readRecords(),{endings:[],discoveries:[],cases:0,cold:0,deaths:[]});
 }
 // Older records without the cold count or the deaths list read back with their defaults.
 const old=memoryStorage();old.setItem('last-light/records/v1','{"version":1,"endings":["arrest-word"],"discoveries":["tape"],"cases":1}');assert.deepEqual(createSaveStore(old,phases).readRecords(),{endings:['word'],discoveries:['tape'],cases:1,cold:0,deaths:[]});
 assert.deepEqual(createSaveStore(storage,phases).readSettings({mono:false,untimed:false,sound:false}),{mono:false,untimed:false,sound:false});
});
test('blocked browser storage keeps a session checkpoint and settings',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 const store=createSaveStore(blocked,phases);assert.equal(store.save(state),false);assert.equal(store.load().phase,'roofQuiet');assert.equal(store.isDurable(),false);
 store.saveSettings({mono:true,untimed:true});assert.deepEqual(store.readSettings({mono:false,untimed:false}),{mono:true,untimed:true});
});
