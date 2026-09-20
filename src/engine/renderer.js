
(() => {
const root=document.getElementById('last-light-cinema'), canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d');
const el=Object.fromEntries(['actions','caption','phase','timer','pause','timing','mono','journal','clues','outcome'].map(k=>[k,root.querySelector('.lc-'+k)]));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=168,H=66,cw=4.2,ch=7.2,dpr=1,fx=100,fy=60,zbuf,chars,ink,frame=0,lastFrame=0,lastTime=0,visible=true;
const camera={x:-.8,y:2.05,z:-5,yaw:.035,pitch:.085};
const state={t:0,paused:false,mono:false,travel:0,moving:false,phase:'brief',event:0,watched:false,choice:'',untimed:reduce,clues:[],wrong:false};
let keys=[],transitionFrom={...camera};
let sy=0,cy=1,sp=0,cp=1;
const palettes=[],gray=[];
const hues=[[129,160,181],[83,186,184],[255,190,94],[195,109,103],[100,134,210],[92,153,111],[220,228,216],[104,134,151]];
for(let h=0;h<hues.length;h++)for(let i=0;i<20;i++){const b=.18+Math.pow(i/19,.72)*1.35;palettes.push('rgb('+hues[h].map(v=>Math.min(255,Math.round(v*b))).join(',')+')');const v=Math.min(245,Math.round(22+Math.pow(i/19,.78)*223));gray.push('rgb('+[v,v+Math.min(5,255-v),v+Math.min(6,255-v)].join(',')+')');}
const fract=n=>n-Math.floor(n), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=(a,b,c=0)=>fract(Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453);
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const glyphs='.,:;=+xX%#@';
const surfaces=[],lamps=[];
function quad(a,b,c,d,mat,n){surfaces.push({v:[a,b,c,d],mat,n});}
function box(x0,y0,z0,x1,y1,z1,mat){
quad([x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],mat,[0,0,-1]);
quad([x1,y0,z1],[x0,y0,z1],[x0,y1,z1],[x1,y1,z1],mat,[0,0,1]);
quad([x0,y0,z1],[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],mat,[-1,0,0]);
quad([x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0],mat,[1,0,0]);
quad([x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1],{...mat,roof:true},[0,1,0]);
}
function ellipsoid(cx,cy,cz,rx,ry,rz,mat){
const rings=7,steps=10,point=(i,j)=>{const p=-Math.PI/2+Math.PI*i/rings,a=Math.PI*2*j/steps;return[cx+Math.cos(p)*Math.cos(a)*rx,cy+Math.sin(p)*ry,cz+Math.cos(p)*Math.sin(a)*rz]};
for(let i=0;i<rings;i++)for(let j=0;j<steps;j++){const mid=point(i+.5,j+.5),n=[(mid[0]-cx)/rx,(mid[1]-cy)/ry,(mid[2]-cz)/rz];const l=Math.hypot(...n);quad(point(i,j),point(i,j+1),point(i+1,j+1),point(i+1,j),mat,n.map(v=>v/l));}
}
function building(x,z,w,d,h,hue,seed){const m={kind:'building',hue,seed,x,z,w,d,h};box(x,0,z,x+w,h,z+d,m);box(x-.1,h,z-.1,x+w+.1,h+.25,z+d+.1,{kind:'stone',hue,seed});if(h>13)box(x+w*.22,h+.25,z+d*.25,x+w*.68,h+1.5,z+d*.7,{kind:'stone',hue,seed});}
// The geometry, surface patterns and lighting all share world coordinates.
quad([-90,0,-18],[90,0,-18],[90,0,125],[-90,0,125],{kind:'road',hue:7},[0,1,0]);
box(-8,.01,-12,-4.8,.18,69,{kind:'paving',hue:0});box(4.8,.01,-12,8,.18,69,{kind:'paving',hue:0});
building(-18,-9,10,12,17,1,3);building(-20,6,12,12,25,0,7);building(-17,22,9,10,18,3,11);building(-22,36,14,12,30,4,17);
building(8,-10,12,15,22,4,23);building(8,9,11,12,16,0,29);building(8,25,15,11,26,1,31);building(8,41,12,13,20,3,37);
building(-34,18,10,13,34,4,41);building(25,13,13,17,33,0,47);building(-25,56,17,18,36,1,53);building(12,65,18,15,39,4,61);
// Station facade, tower and roofline.
building(-8,39,16,6,8,0,65);box(-2.2,8,40,2.2,19,44,{kind:'tower',hue:0,seed:71});box(-2.45,16,39.75,2.45,16.45,44.25,{kind:'stone',hue:6});box(-2.45,18.8,39.75,2.45,19.2,44.25,{kind:'stone',hue:6});
const peak=[0,23,42],rim=[[-2.5,19.2,39.5],[2.5,19.2,39.5],[2.5,19.2,44.5],[-2.5,19.2,44.5]];
for(let i=0;i<4;i++){const a=rim[i],b=rim[(i+1)%4],cross=[(b[1]-a[1])*(peak[2]-a[2])-(b[2]-a[2])*(peak[1]-a[1]),(b[2]-a[2])*(peak[0]-a[0])-(b[0]-a[0])*(peak[2]-a[2]),(b[0]-a[0])*(peak[1]-a[1])-(b[1]-a[1])*(peak[0]-a[0])];const len=Math.hypot(...cross);quad(a,b,peak,peak,{kind:'metal',hue:1},cross.map(v=>v/len));}
box(-1.6,0,38.8,1.6,4.3,39,{kind:'door',hue:2});
// Shopfront awnings, a newsstand and street furniture.
box(-8.9,3.5,-3,-6.8,3.78,3,{kind:'awning',hue:2});box(-8.2,.2,1,-6.6,2.9,3.2,{kind:'kiosk',hue:1});
box(6.7,3.35,11,8.1,3.6,17,{kind:'awning',hue:3});box(7.1,5.5,11.5,7.55,11.8,12.35,{kind:'sign',hue:3});
for(const x of [-6.15,6.15])for(const z of [1,16,30]){box(x-.055,.15,z-.055,x+.055,4.65,z+.055,{kind:'metal',hue:0});box(x-.34,4.15,z-.34,x+.34,4.7,z+.34,{kind:'lamp',hue:2});box(x-.45,4.7,z-.45,x+.45,4.82,z+.45,{kind:'metal',hue:0});lamps.push([x,z]);}
for(const [x,z] of [[-6.15,10],[6.3,23],[-6.4,31]]){box(x-.15,.18,z-.15,x+.15,3.7,z+.15,{kind:'bark',hue:5});ellipsoid(x,4.3,z,1.8,2.05,1.6,{kind:'leaves',hue:5,seed:4});}
for(const [x,z] of [[-5.7,5],[5.6,18]]){box(x-.8,.5,z-.35,x+.8,.7,z+.35,{kind:'wood',hue:2});box(x-.8,.7,z+.28,x+.8,1.2,z+.4,{kind:'wood',hue:2});for(const dx of [-.6,.6])box(x+dx-.07,.18,z-.27,x+dx+.07,.5,z+.27,{kind:'metal',hue:0});}
// An empty tram at the far stop.
box(.1,.45,28,2.65,3.3,34,{kind:'tram',hue:3});box(.0,3.3,27.9,2.75,3.55,34.1,{kind:'metal',hue:0});box(.3,.25,28.6,.55,.7,29.1,{kind:'rubber',hue:7});box(2.2,.25,28.6,2.45,.7,29.1,{kind:'rubber',hue:7});
// Ceiling cables are thin physical surfaces; every visible mark is still a glyph.
for(const z of [8,21,35])quad([-8,8,z],[8,8,z],[8,8.035,z+.035],[-8,8.035,z+.035],{kind:'cable',hue:0},[0,-1,0]);
function cam(p){const dx=p[0]-camera.x,dy=p[1]-camera.y,dz=p[2]-camera.z;const xx=dx*cy-dz*sy,zz=dx*sy+dz*cy;return{x:xx,y:dy*cp-zz*sp,z:dy*sp+zz*cp,w:p};}
function project(p){return{x:W/2+p.x*fx/p.z,y:H/2-p.y*fy/p.z,z:p.z,w:p.w};}
function clip(poly){let out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=a.z>=.18,ib=b.z>=.18;if(ia)out.push(a);if(ia!==ib){const u=(.18-a.z)/(b.z-a.z);out.push({x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),z:.18,w:a.w.map((v,j)=>mix(v,b.w[j],u))});}}return out;}
function shade(mat,n,x,y,z,depth){
 if(mat.baseY)y-=mat.baseY;
 let hue=mat.hue||0,lum=.65,g=':',kind=mat.kind;
 const grain=hash(Math.floor(x*3),Math.floor(y*4),Math.floor(z*3));
 const face=.58+Math.max(0,n[0]*.5+n[1]*.72-n[2]*.45)*.65;
 /* EXTRA_MATERIALS */
 if(kind==='road'||kind==='paving'){
   const u=fract(x*1.25+(Math.floor(z*2)%2)*.5),v=fract(z*2);
   hue=7;lum=.29+grain*.15;g=(v<.12||u<.09)?'-':grain>.55?':':'.';
   if(kind==='paving'){lum=.5+grain*.15;g=(fract(x*1.7)<.08||fract(z*1.2)<.08)?'=':'.';}
   if(kind==='road'&&(Math.abs(Math.abs(x)-1.0)<.055||Math.abs(Math.abs(x)-2.4)<.055)){hue=6;lum=.95;g='|';}
   if(kind==='road'&&Math.abs(z-7)<1.25&&Math.abs(x)<4.5&&fract(x*.7)<.42){hue=6;lum=.68;g='=';}
   for(let i=0;i<lamps.length;i++){const l=lamps[i],d=(x-l[0])**2+(z-l[1])**2;if(d<30){const a=(1-d/30);if(a>.28){hue=2;lum=Math.max(lum,.32+a*.53);if(grain>.65)g='=';}}}
   if(kind==='road'){
     const ripple=.3*Math.sin(z*4.2+x*3.5+state.t*.75),stripe=Math.sin(x*2.7+z*.38+ripple);
     if(stripe>.2&&Math.abs(x)>2.6&&Math.abs(x)<4.6){hue=x<0?1:4;lum=.42+.37*stripe;g=grain>.55?'=':'-';}
   }
 }else if(kind==='building'){
   if(mat.roof){g=grain>.5?'=':'-';lum=.46;}
   else{
     const u=Math.abs(n[0])>.5?z-mat.z:x-mat.x,wx=fract(u/1.85),wy=fract(y/2.8),bay=Math.floor(u/1.85),floor=Math.floor(y/2.8);
     lum=.42+grain*.19;g=grain>.82?'x':grain>.57?'+':grain>.2?':':'.';
     if(wy<.055){lum=.82;g='=';}if(wx<.048){lum=.77;g='|';}
     if(wx>.23&&wx<.78&&wy>.26&&wy<.81){
       const lit=hash(bay,floor,mat.seed)>.54;
       hue=lit?(hash(bay,mat.seed,floor)>.28?2:1):4;lum=lit?1.1:.22;
       g=lit?'#':':';
       if(wx>.47&&wx<.53||wy>.52&&wy<.57){g='+';lum=lit?.6:.48;hue=0;}
       if(wx<.28||wx>.73||wy<.31||wy>.76){g=wy<.31||wy>.76?'=':'|';lum=.67;hue=mat.hue;}
     }
     if(y<2.7){lum=.44;g=fract(u*4)<.18?'|':':';if(fract(u/4)>.22&&fract(u/4)<.74&&y>.65&&y<2.2){hue=hash(Math.floor(u/4),0,mat.seed)>.4?2:1;lum=.94;g=y<1.4?'=':'#';}}
   }
 }else if(kind==='tower'){
   lum=.72;g=grain>.3?':':'+';if(fract(y/3)<.05){g='=';lum=1;}
   if(n[2]<-.5){const dx=x,dy=y-17.55,d=dx*dx+dy*dy;if(d<1.22){hue=2;lum=1;g='o';if(d<.92){hue=6;lum=.2;g='.';}if(Math.abs(dx)<.1&&dy>-.05||Math.abs(dy-dx*.5)<.11&&dx<.05){hue=2;lum=1.15;g='+';}}if(y>9&&y<14&&Math.abs(x)<.8){hue=2;lum=1;g='H';}}
 }else if(kind==='leaves'){if(grain<.12)return null;g='*+x%&'[Math.floor(grain*5)];lum=.48+grain*.45;}
 else if(kind==='lamp'){hue=2;lum=1.3;g=grain>.4?'#':'@';}
 else if(kind==='door'){hue=2;lum=.44;g=fract(x*5)<.18?'|':'.';if(y>2){lum=.98;g='H';}if(Math.abs(x)<.04){lum=1;g='|';}}
 else if(kind==='tram'){lum=.72;g=grain>.3?'+':':';if(y>1.5&&y<2.85){hue=1;lum=.8;g='=';if(fract(z*1.1)<.1||Math.abs(x-1.35)<.07){hue=6;lum=.9;g='|';}}if(y>.9&&y<1.08){hue=2;lum=1.05;g='=';}if(n[2]<-.5&&y>.65&&y<1.1&&(Math.abs(x-.5)<.18||Math.abs(x-2.25)<.18)){hue=2;lum=1.3;g='@';}}
 else if(kind==='awning'){lum=.85;g='=';if(Math.floor(z*2)%2){hue=6;lum=.7;}}
 else if(kind==='kiosk'){lum=.6;g='+';if(y>1&&y<2.5){hue=6;lum=.8;g='H';}}
 else if(kind==='sign'){hue=3;lum=1;g='#';if(y>5.8&&y<11.5){hue=2;lum=1.2;g='+';}}
 else if(kind==='bark'){lum=.45;g='|';}
 else if(kind==='wood'){lum=.58;g=fract(y*7)<.3?'=':'-';}
 else if(kind==='rubber'){lum=.16;g='#';}
 else if(kind==='cable'){lum=.7;g='-';}
 else if(kind==='metal'){lum=.8;g=grain>.5?'=':'+';}
 else{lum=.75;g=grain>.5?'=':':';}
 if(kind!=='lamp'&&kind!=='sign')lum*=face;
 // Distance dims both color and glyph weight while keeping a stable surface texture.
 const fog=Math.exp(-Math.max(0,depth-7)*.017);lum*=fog;
 if(depth>52&&g==='#')g='+';if(depth>75)g='.';
 const level=clamp(Math.round(lum*14),0,19);
 return[g,hue*20+level];
}
function triangle(a,b,c,mat,n){
 const area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(area)<.0001)return;
 const minX=clamp(Math.floor(Math.min(a.x,b.x,c.x)),0,W-1),maxX=clamp(Math.ceil(Math.max(a.x,b.x,c.x)),0,W-1),minY=clamp(Math.floor(Math.min(a.y,b.y,c.y)),0,H-1),maxY=clamp(Math.ceil(Math.max(a.y,b.y,c.y)),0,H-1);
 const ia=1/a.z,ib=1/b.z,ic=1/c.z;
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
   const xx=x+.5,yy=y+.5,u=((b.x-xx)*(c.y-yy)-(b.y-yy)*(c.x-xx))/area,v=((c.x-xx)*(a.y-yy)-(c.y-yy)*(a.x-xx))/area,w=1-u-v;
   if(u<-.00001||v<-.00001||w<-.00001)continue;
   const inv=u*ia+v*ib+w*ic,depth=1/inv,idx=y*W+x;if(depth>=zbuf[idx])continue;
   const aa=u*ia*depth,bb=v*ib*depth,cc=w*ic*depth;
   const p0=a.w[0]*aa+b.w[0]*bb+c.w[0]*cc,p1=a.w[1]*aa+b.w[1]*bb+c.w[1]*cc,p2=a.w[2]*aa+b.w[2]*bb+c.w[2]*cc;
   const s=shade(mat,n,p0,p1,p2,depth);if(!s)continue;zbuf[idx]=depth;chars[idx]=s[0];ink[idx]=s[1];
 }
}
function pixel(x,y,z,g,k){x=Math.round(x);y=Math.round(y);if(x<0||x>=W||y<0||y>=H)return;const i=y*W+x;if(z<zbuf[i]){zbuf[i]=z;chars[i]=g;ink[i]=k;}}
// Cue labels (cue:{dir,level,draw}) record their cell rectangle for pointer hit-testing; render() resets the list each frame.
let labelRects=[];
function worldLabel(p,text,hue=2,cue){const v=cam(p);if(v.z<1)return;const s=project(v),start=Math.round(s.x-text.length/2),row=Math.round(s.y);
 if(cue){labelRects.push({text,dir:cue.dir,x0:start,x1:start+text.length-1,y0:row,y1:row});if(cue.draw===false)return;}
 for(let i=0;i<text.length;i++)if(text[i]!==' ')pixel(start+i,s.y,v.z-.6,text[i],hue*20+(cue&&cue.level||16));}
