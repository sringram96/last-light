const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');

function memoryStorage(){const values=new Map();return{values,getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
// width: the canvas's clientWidth (the fixed rule, as the reference test measures it). innerWidth/innerHeight and stage
// {width,height} (the picture area's clientWidth/clientHeight) make layout() run the fill rule instead; without them the
// harness has no stage and resize() keeps the original rule.
function game({width=320,reduced=false,storage=memoryStorage(),script,innerWidth,innerHeight,stage}={}){
 let callback,clock=0,layoutCb=()=>{},draws=[];
 // Every listener registered for an event runs, in order, so the runtime's separate keydown and pointer listeners coexist.
 const listen=function(k,f){const l=this.listeners[k]||(this.listeners[k]=Object.assign(e=>{for(const g of l.fns.slice())g(e);},{fns:[]}));l.fns.push(f);};
 const element=()=>({style:{},attrs:{},listeners:{},children:[],disabled:false,hidden:false,textContent:'',setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener:listen,replaceChildren(){this.children=[]},appendChild(e){this.children.push(e)},click(){if(!this.disabled)this.listeners.click?.({timeStamp:clock})},focus(){},contains(){return true}});
 const context={font:'',fillStyle:'',setTransform(){},fillRect(){draws=[]},fillText(g,x,y){draws.push([g,x,y,this.fillStyle,this.font])}};
 // The canvas reports a client rectangle at the origin, so pointer coordinates are CSS pixels of the picture (dpr 1).
 const canvas={...element(),clientWidth:width,width,height:0,getContext:()=>context,getBoundingClientRect(){return{left:0,top:0,width:this.clientWidth,height:this.height};}};
 const names=['actions','caption','phase','timer','pause','timing','mono','journal','clues','outcome','chapter','reel-actions','reel','menu','card','said','route','board','records','records-box','score','sound','picture','card-slot','file','full','drawer','more'];
 const elements=Object.fromEntries(names.map(k=>['.lc-'+k,element()]));
 if(stage){elements['.lc-picture'].clientWidth=stage.width;elements['.lc-picture'].clientHeight=stage.height;}
 elements['.lc-drawer'].hidden=true;// as in the shell: the drawer starts closed
 const classes=new Set(['lc-stage','lc-stacked']);
 const root={...element(),isConnected:true,querySelector:k=>k==='canvas'?canvas:elements[k],classList:{toggle:(c,on)=>{on?classes.add(c):classes.delete(c)},contains:c=>classes.has(c)}};
 const document={getElementById:()=>root,createElement:element,hidden:false,listeners:{},addEventListener:listen};
 const window={matchMedia:()=>({matches:reduced}),devicePixelRatio:1};
 if(innerWidth!==undefined)window.innerWidth=innerWidth;if(innerHeight!==undefined)window.innerHeight=innerHeight;
 const environment={document,localStorage:storage,window,requestAnimationFrame:f=>{callback=f},ResizeObserver:class{constructor(f){layoutCb=f}observe(){layoutCb()}},console};
 vm.runInNewContext(script||fs.readFileSync(path.join(__dirname,'../dist/game.js'),'utf8'),environment);
 const audit=()=>JSON.parse(JSON.stringify(root.cinemaAudit()));
 const click=(part,group='actions')=>{const button=elements['.lc-'+group].children.find(b=>b.textContent.includes(part));assert(button,`Missing ${group} action: ${part}`);button.click();};
 // run(seconds, stepMs): the animation loop at a fixed step, 100 ms by default, so a short window is deterministic at any step.
 const run=(seconds,stepMs=100)=>{for(let i=0;i<Math.ceil(seconds*1000/stepMs);i++){clock+=stepMs;callback(clock)}};
 // Step until the phase changes (a cutscene or result now holds for its caption, so a fixed wait would be a guess).
 const next=(max=60)=>{const from=root.cinemaAudit().state.phase;for(let i=0;i<Math.ceil(max*10);i++){clock+=100;callback(clock);if(root.cinemaAudit().state.phase!==from)return;}assert.fail(`still at ${from} after ${max}s`);};
 const key=(k,extra={})=>document.listeners.keydown?.({key:k,target:null,preventDefault(){},timeStamp:clock,...extra});
 // Pointer input on the picture: pointerdown/pointerup with client coordinates; a tap, a swipe of `travel` px, and the
 // centre of a cue's rectangle (CSS pixels) read from the current frame.
 const pointer=(type,x,y,extra={})=>canvas.listeners[type]?.({clientX:x,clientY:y,pointerId:1,button:0,timeStamp:clock,preventDefault(){},...extra});
 const tap=(x,y)=>{pointer('pointerdown',x,y);pointer('pointerup',x,y);};
 const swipe=(dir,from=[40,40],travel=40)=>{const [x,y]=from;pointer('pointerdown',x,y);pointer('pointerup',x+(dir==='right'?travel:dir==='left'?-travel:0),y+(dir==='down'?travel:dir==='up'?-travel:0));};
 const cueCentre=dir=>{const a=audit(),l=a.labels.find(r=>r.dir===dir);assert(l,`No ${dir} cue in the frame`);const cw=canvas.clientWidth/a.columns,ch=cw*1.72;return[(l.x0+l.x1+1)/2*cw,(l.y0+.5)*ch];};
 return{audit,click,run,next,key,pointer,tap,swipe,cueCentre,storage,canvas,root,document,window,elements,frame:()=>JSON.parse(JSON.stringify(draws)),resize:w=>{canvas.clientWidth=w;layoutCb()},layout:(w,h)=>{const p=elements['.lc-picture'];if(w)p.clientWidth=w;if(h)p.clientHeight=h;layoutCb()},phase:p=>assert.equal(audit().state.phase,p)};
}
module.exports={game,memoryStorage};
