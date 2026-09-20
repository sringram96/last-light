// Menus and scene previews do not become story checkpoints.
const session={menu:true,mode:'story',confirmNew:false};
let browserStorage=null;try{browserStorage=localStorage;}catch(e){}
const saveStore=createSaveStore(browserStorage,[...Object.keys(caseTitles),'brief','watch','ready','follow','danger','qte','result','evidence','deduce','arrival','ending']);
Object.assign(state,saveStore.readSettings({mono:false,untimed:reduce,sound:false}));
function savePreferences(){saveStore.saveSettings({mono:state.mono,untimed:state.untimed,sound:state.sound});}
function checkpoint(){if(session.mode==='story'&&!session.menu)saveStore.save(state);}
function savedCase(){return saveStore.load();}
function continueCase(){
 const s=savedCase();if(!s)return;
 session.mode='story';session.menu=false;session.confirmNew=false;
 const prefs={mono:state.mono,untimed:state.untimed};reset();Object.assign(state,s,prefs,{paused:false,event:0});
 const name=sceneFor(s.phase);setScene(name);Object.assign(camera,name==='street'?shotFor():sceneStart(name));enter(s.phase,true);chapterCard();
}
function startNewCase(){
 saveStore.clear();session.mode='story';session.menu=false;session.confirmNew=false;reset();enter('officeEntry',true);
}
function requestNewCase(){if(savedCase()){session.confirmNew=true;ui();}else startNewCase();}
function openMenu(){session.menu=true;session.confirmNew=false;state.paused=false;lastTime=0;ui();render();}
function resumeSession(){session.menu=false;session.confirmNew=false;lastTime=0;ui();render();}
function menuUI(){
 el.phase.textContent='NIGHT DIVISION // CASE 01 / THE LAST LIGHT';el.outcome.hidden=true;
 if(session.confirmNew){
  el.caption.textContent='Start a new case? Your current story checkpoint will be replaced. Endings and discoveries already on record are kept.';
  button('[START NEW CASE]',startNewCase);button('[KEEP CURRENT CASE]',()=>{session.confirmNew=false;ui();});return;
 }
 const saved=savedCase(),records=saveStore.readRecords();
 el.caption.textContent='A missing lamplighter. A city running on stolen power. Follow Detective Rook through the rain, react when the picture turns, and choose what the case becomes.'+(records.endings.length?' Endings on record: '+records.endings.length+' of 6.':' Six endings are waiting.');
 if(session.mode==='story'&&state.phase!=='brief')button('[RESUME]',resumeSession);
 else if(saved)button('[CONTINUE CASE]',continueCase);
 button('[NEW CASE]',requestNewCase);
 if(session.mode==='preview'&&state.phase!=='brief')button('[RESUME SCENE PREVIEW]',resumeSession);
 if(saved&&!saveStore.isDurable())el.caption.textContent+=' Progress will last for this tab only.';
}
