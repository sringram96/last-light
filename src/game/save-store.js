// Save data is independent of the renderer and validated before it reaches the game.
function createSaveStore(storage, validPhases) {
 const SAVE='last-light/save/v1', SETTINGS='last-light/settings/v1', RECORDS='last-light/records/v1', LEGACY='the-last-light-case-v2';
 const phases=new Set(validPhases);
 const booleans=['watched','wrong','decoded','radio','twist','caught','endingSeen','note','loftSeen','misread','tail','keeper','slip','stalled','faced','shown'];
 // The late values stay valid for old checkpoints; nothing new writes them. dead is the death that closed a cold case.
 const enums={choice:['','person','book','missed'],rescue:['','valve','pull','late'],pursuit:['','chasing','stay','ramp','jump','late'],firstMove:['','dodge','brake','late'],club:['','duck','vault','late'],tunnel:['','right','left','late'],market:['','slip','cut','late'],hall:['','dive','breaker','late'],dead:['','pump','market','carrier','gap','pier','rack']};
 const legacyPhases={ending:'arrival'};
 const legacyEndings={'arrest-ledger':'board','arrest-word':'word'};
 // deaths is a bitmask of the deaths seen this case (pump 1, market 2, carrier 4, gap 8, pier 16, rack 32); rewinds are the lamps.
 const numbers={t:[0,86400],distance:[0,950],phaseDistance:[0,950],gap:[0,2],rewinds:[0,3],deaths:[0,63],restarts:[0,9]};
 const integers=['gap','rewinds','deaths','restarts'];
 let memory=null,settingsMemory=null,recordsMemory=null,durable=true;
 const copy=v=>v===null?null:JSON.parse(JSON.stringify(v));
 const get=key=>{try{return storage?.getItem(key)||null;}catch(e){durable=false;return null;}};
 function put(key,value){try{if(!storage)throw new Error('Storage unavailable');storage.setItem(key,JSON.stringify(value));return true;}catch(e){durable=false;return false;}}
 function parse(value){try{return JSON.parse(value);}catch(e){return null;}}
 function clean(raw){
  if(raw&&typeof raw==='object'&&legacyPhases[raw.phase])raw={...raw,phase:legacyPhases[raw.phase]};
  if(!raw||typeof raw!=='object'||!phases.has(raw.phase)||!Array.isArray(raw.clues)||raw.clues.length>100||raw.clues.some(s=>typeof s!=='string'||s.length>1000))return null;
  const result={phase:raw.phase,clues:[...new Set(raw.clues)],event:0,paused:false};
  for(const key of booleans){if(raw[key]!==undefined&&typeof raw[key]!=='boolean')return null;result[key]=raw[key]??false;}
  for(const [key,values] of Object.entries(enums)){if(raw[key]!==undefined&&!values.includes(raw[key]))return null;result[key]=raw[key]??'';}
  for(const [key,[min,max]] of Object.entries(numbers)){
   const value=raw[key]??(key==='distance'||key==='phaseDistance'?20:key==='rewinds'?3:0);
   if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)return null;
   result[key]=value;
  }
  if(integers.some(key=>!Number.isInteger(result[key])))return null;
  return result;
 }
 function load(){
  if(memory)return copy(memory);
  const encoded=get(SAVE);
  if(encoded){const envelope=parse(encoded);if(envelope?.version!==1)return null;memory=clean(envelope.state);return copy(memory);}
  const old=clean(parse(get(LEGACY)));
  if(old){memory=old;put(SAVE,{version:1,state:old});}
  return copy(old);
 }
 function save(raw){const value=clean(raw);if(!value)return false;memory=value;return put(SAVE,{version:1,state:value});}
 function clear(){memory=null;for(const key of [SAVE,LEGACY])try{storage?.removeItem(key);}catch(e){durable=false;}}
 // Settings are a flat set of booleans; unknown or malformed keys fall back to the defaults.
 function readSettings(defaults){
  const raw=settingsMemory||parse(get(SETTINGS));
  return Object.fromEntries(Object.keys(defaults).map(key=>[key,typeof raw?.[key]==='boolean'?raw[key]:defaults[key]]));
 }
 function saveSettings(value){settingsMemory=Object.fromEntries(Object.keys(value).map(key=>[key,!!value[key]]));return put(SETTINGS,settingsMemory);}
 // Records outlive individual cases: which endings, discoveries and deaths the player has seen, how many cases were closed
 // and how many went cold. Keys absent from older records default to empty.
 const ids=value=>Array.isArray(value)&&value.length<=64&&value.every(s=>typeof s==='string'&&s.length>0&&s.length<=40)?[...new Set(value)]:null;
 const count=value=>Number.isInteger(value)&&value>=0?value:0;
 function readRecords(){
  if(!recordsMemory){
   const raw=parse(get(RECORDS));
   const endings=raw?.version===1?ids((raw.endings||[]).map(id=>legacyEndings[id]||id)):null,discoveries=raw?.version===1?ids(raw.discoveries):null;
   recordsMemory=endings&&discoveries?{endings,discoveries,cases:count(raw.cases),cold:count(raw.cold),deaths:ids(raw.deaths||[])||[]}:{endings:[],discoveries:[],cases:0,cold:0,deaths:[]};
  }
  return copy(recordsMemory);
 }
 // A cold case counts under cold, not under cases closed.
 function record({ending,discoveries=[],deaths=[],cold=0}){
  const current=readRecords(),found=ids(discoveries)||[],seen=ids(deaths)||[];
  recordsMemory={endings:[...new Set([...current.endings,...(ids([ending])||[])])],discoveries:[...new Set([...current.discoveries,...found])],cases:current.cases+(cold?0:1),cold:current.cold+(cold?1:0),deaths:[...new Set([...current.deaths,...seen])]};
  put(RECORDS,{version:1,...recordsMemory});
  return copy(recordsMemory);
 }
 return{load,save,clear,readSettings,saveSettings,readRecords,record,isDurable:()=>durable};
}
if(typeof module!=='undefined'&&module.exports)module.exports={createSaveStore};
