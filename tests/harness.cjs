const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');

function memoryStorage(){const values=new Map();return{values,getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
function game({width=320,reduced=false,storage=memoryStorage(),script}={}){
 let callback,clock=0,resize,draws=[];
 const element=()=>({style:{},attrs:{},listeners:{},children:[],disabled:false,hidden:false,textContent:'',setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.listeners[k]=f},replaceChildren(){this.children=[]},appendChild(e){this.children.push(e)},click(){if(!this.disabled)this.listeners.click?.()}});
 const context={font:'',fillStyle:'',setTransform(){},fillRect(){draws=[]},fillText(g,x,y){draws.push([g,x,y,this.fillStyle,this.font])}};
 const canvas={...element(),clientWidth:width,getContext:()=>context};
 const names=['actions','caption','phase','timer','pause','timing','mono','journal','clues','outcome','chapter','reel-actions','reel','menu','card','said','route','board','records','records-box','score','sound'];
 const elements=Object.fromEntries(names.map(k=>['.lc-'+k,element()]));
 const root={...element(),isConnected:true,querySelector:k=>k==='canvas'?canvas:elements[k]};
 const document={getElementById:()=>root,createElement:element,hidden:false,listeners:{},addEventListener(k,f){this.listeners[k]=f}};
 const environment={document,localStorage:storage,window:{matchMedia:()=>({matches:reduced}),devicePixelRatio:1},requestAnimationFrame:f=>{callback=f},ResizeObserver:class{constructor(f){resize=f}observe(){resize()}},console};
 vm.runInNewContext(script||fs.readFileSync(path.join(__dirname,'../dist/game.js'),'utf8'),environment);
 const audit=()=>JSON.parse(JSON.stringify(root.cinemaAudit()));
 const click=(part,group='actions')=>{const button=elements['.lc-'+group].children.find(b=>b.textContent.includes(part));assert(button,`Missing ${group} action: ${part}`);button.click();};
 const run=seconds=>{for(let i=0;i<Math.ceil(seconds*10);i++){clock+=100;callback(clock)}};
 return{audit,click,run,storage,canvas,root,document,elements,frame:()=>JSON.parse(JSON.stringify(draws)),resize:w=>{canvas.clientWidth=w;resize()},phase:p=>assert.equal(audit().state.phase,p)};
}
module.exports={game,memoryStorage};
