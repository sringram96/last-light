// Save data is independent of the renderer and validated before it reaches the game.
function createSaveStore(storage, validPhases) {
 const SAVE='last-light/save/v1', SETTINGS='last-light/settings/v1', LEGACY='the-last-light-case-v2';
 const phases=new Set(validPhases);
 const booleans=['watched','wrong','decoded','radio','twist','caught','endingSeen'];
 const enums={choice:['','person','book','missed'],rescue:['','valve','pull','late'],pursuit:['','chasing','stay','ramp','jump','late'],firstMove:['','dodge','brake','late']};
 const numbers={t:[0,86400],distance:[0,950],phaseDistance:[0,950],gap:[0,2]};
 let memory=null,settingsMemory=null,durable=true;
 const copy=v=>v===null?null:JSON.parse(JSON.stringify(v));
 const get=key=>{try{return storage?.getItem(key)||null;}catch(e){durable=false;return null;}};
 function put(key,value){try{if(!storage)throw new Error('Storage unavailable');storage.setItem(key,JSON.stringify(value));return true;}catch(e){durable=false;return false;}}
 function parse(value){try{return JSON.parse(value);}catch(e){return null;}}
 function clean(raw){
  if(!raw||typeof raw!=='object'||!phases.has(raw.phase)||!Array.isArray(raw.clues)||raw.clues.length>100||raw.clues.some(s=>typeof s!=='string'||s.length>1000))return null;
  const result={phase:raw.phase,clues:[...new Set(raw.clues)],event:0,paused:false};
  for(const key of booleans){if(raw[key]!==undefined&&typeof raw[key]!=='boolean')return null;result[key]=raw[key]??false;}
  for(const [key,values] of Object.entries(enums)){if(raw[key]!==undefined&&!values.includes(raw[key]))return null;result[key]=raw[key]??'';}
  for(const [key,[min,max]] of Object.entries(numbers)){
   const value=raw[key]??(key==='distance'||key==='phaseDistance'?20:0);
   if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)return null;
   result[key]=value;
  }
  if(!Number.isInteger(result.gap))return null;
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
 function readSettings(defaults){
  const raw=settingsMemory||parse(get(SETTINGS));
  return{mono:typeof raw?.mono==='boolean'?raw.mono:defaults.mono,untimed:typeof raw?.untimed==='boolean'?raw.untimed:defaults.untimed};
 }
 function saveSettings(value){settingsMemory={mono:!!value.mono,untimed:!!value.untimed};return put(SETTINGS,settingsMemory);}
 return{load,save,clear,readSettings,saveSettings,isDurable:()=>durable};
}
if(typeof module!=='undefined'&&module.exports)module.exports={createSaveStore};
