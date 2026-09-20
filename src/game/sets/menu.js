// THE MENU. An idle tableau behind the title: Rook on a rooftop ledge with a cigarette, the city at his back.
// It is not a story set: it has one phase, `menuIdle`, which never advances, never checkpoints and never shows
// a card. The story's clock (`state.t`) runs while the menu is open, so the picture drifts, flickers and flies.
//
// The picture: Rook at the corner of a high roof, right of frame, three-quarter to the city. The roof is an L: the
// near wing ends at a parapet two units from the camera, the far wing carries Rook to the front parapet. Beyond the
// parapets the street is forty-five units down and the city rises past the top of the frame: a canyon of stepped
// towers running away to the left of centre, a video billboard hung off the near tower on the left with chase lights
// round it, a rose sign board of pseudo-ideograms projecting from its flank, a steady cyan one on the low block to
// Rook's left and an amber one with a burnt-out cluster on the block to his right, lamp pools and puddles on the wet
// roof catching the signs, a cable strung over the roof beading with rain, an aerial with a red lamp, steam off a
// vent stack drifting on a slow wind, lit rooms with figures in the nearest towers, fire escapes, pipes, tanks, a
// construction crane, an LED ticker wrapped round a block, advertising panels, HOTEL stacked down a far tower, THE
// FILAMENT's sign at the end of the canyon, a searchlight sweeping the fog, an airship crossing high over the city, a
// stepped megastructure with warning lights climbing its spine, and three lanes of far traffic. Two cars chase each
// other round the near right tower, a third joining from a side street every third pass, and smoke rises off Rook's
// cigarette. Nothing here is interface.
//
// The signs cannot carry real Chinese characters: the picture is a single-width grid of printable ASCII (codes 32
// to 126), so the boards stack 5-by-5 clusters of ASCII strokes (the `ideogram` material) that read as ideograms
// at their distance. The billboard is the `video` material, six pictures cycling on the clock.
//
// The menu draws on a denser grid than the story (`density: 2`: 140 rows on desktop, the cell halved, the same
// field of view) and denser rain; Rook is drawn from his `portrait` sheet (72 rows) at close range.
const MENU_GROUND=-45;
// Stroke clusters for the sign boards, 5 rows of 5, read top to bottom.
const MENU_IDEOGRAMS=[
 ['#===#','  |  ','=====',' /|\\ ','# | #'],
 ['[===]','|   |','[=+=]','  |  ','====='],
 ['=====',' #|# ','=====','/ | \\','  #  '],
 ['|=+=|','| | |','|=+=|','| | |','#   #'],
 ['  #  ','=====',' [+] ','=====','/   \\'],
 ['#===#','|#|#|','#===#','  |  ',' /=\\ '],
 ['=+=+=','  |  ','[===]','  |  ','/===\\'],
];
// A picture frame for a screen: rows padded to `w` and centred vertically in `h` rows, with the glyph inks.
function menuPicture(rows,w,h,ink,extra){
 const pad=Math.floor((h-rows.length)/2),out=[];
 for(let r=0;r<h;r++){const s=rows[r-pad]||'';const l=Math.floor((w-s.length)/2);out.push((' '.repeat(Math.max(0,l))+s).padEnd(w,' ').slice(0,w));}
 return{rows:out,ink,...extra};
}
// Block letters (the title cards' font) as picture rows.
function menuWord(text){return banner(text).split('\n');}
// The billboard's six pictures (40 by 14 glyphs): a face, the LUMEN letters on a slow pan, a sweep of scan bands, the
// Lumen Board's crest (a lamp in a ring), a painted face whose eyes blink, and RESERVE / POWER in block letters.
let menuFrames=null;
function menuBillboardFrames(){
 if(menuFrames)return menuFrames;
 const face=['            ################            ','         ######################         ','       ####::::::::::::::::::####       ','      ###::::::::::::::::::::::###      ','      ##::::::::::::::::::::::::##      ','      ##::::o:::::::::::::::o:::##      ','      ##::::::::::::::::::::::::##      ','       ##:::::::::>::::::::::::##       ','       ##::::::::::::::::::::::##       ','        ##::::::::====:::::::::##       ','         ###:::::::::::::::::###        ','           ####::::::::::####           ','              ============              ','                                        '];
 const crest=['              ############              ','          ####            ####          ','        ##        @@@@        ##        ','       ##       @@@@@@@@       ##       ','      ##       @@@@@@@@@@       ##      ','      ##       @@@@@@@@@@       ##      ','      ##        @@@@@@@@        ##      ','       ##         ||||         ##       ','        ##        ||||        ##        ','          ####    ||||    ####          ','              ############              ','                                        ','        ========================        ','                                        '];
 const geisha=['         ######################         ','       ##########################       ','      ####::::::::::::::::::::####      ','     ###::::::::::::::::::::::::###     ','     ##::::::::::::::::::::::::::##     ','     ##::::::o::::::::::::o::::::##     ','     ##::::::::::::::::::::::::::##     ','     ##::::::::::::::::::::::::::##     ','      ##:::::::::::==::::::::::::##     ','      ###:::::::::::::::::::::::###     ','       ####:::::::::::::::::::####      ','        ######::::::::::::######        ','           ####################         ','                                        '];
 menuFrames=[
  {rows:face,ink:{'#':[4,.45],'=':[6,.9],':':[6,.75],'o':[1,1.3],'>':[3,1.2]}},
  menuPicture([...menuWord('LUMEN'),'','========================'],40,14,{'#':[2,1.25],'=':[1,.9]},{pan:.025}),
  {bands:true,hue:1},
  {rows:crest,ink:{'#':[1,.95],'@':[2,1.3],'|':[6,.9],'=':[4,.85]}},
  {rows:geisha,ink:{'#':[4,.5],':':[6,.95],'o':[4,1.2],'=':[3,1.3]},blink:3.7},
  menuPicture([...menuWord('RESERVE'),'',...menuWord('POWER')],40,14,{'#':[3,1.2]}),
 ];
 return menuFrames;
}
// A tower from the street: a lit facade (the building material's window grid) with a stone rim and a cap.
function menuTower(x,z,w,d,top,hue,seed){
 const G=MENU_GROUND,m={kind:'building',hue,seed,x,z,w,d,h:top-G,baseY:G};
 box(x,G,z,x+w,top,z+d,m);box(x-.1,top,z-.1,x+w+.1,top+.25,z+d+.1,{kind:'stone',hue,seed});
 if(top-G>40)box(x+w*.22,top+.25,z+d*.25,x+w*.68,top+1.5,z+d*.7,{kind:'stone',hue,seed});
}
// A dark tower: an unlit mass (near black; dimmer still in the far fog bands) with a sparse grid of lit windows on its
// front face and, when asked, its right face: amber mostly, some cold white-cyan, at the band's brightness. Only the
// floors that can show over the parapet get windows; a facade at twenty units and more is what makes the mass read.
function menuDark(x,z,w,d,top,seed,faces='z',band=1){
 const G=MENU_GROUND;box(x,G,z,x+w,top,z+d,band<1?{kind:'haze',lum:.13*band}:{kind:'gap',hue:4});
 const win=(f,b)=>hash(f,b,seed)>.8?{kind:'glow',hue:hash(b,f,seed+1)>.35?2:1,lum:1.3*band}:null;
 for(let f=0,y=Math.max(G+2,-8);y<top-1.6;y+=2.8,f++){
  if(faces.includes('z'))for(let b=0,u=x+.7;u<x+w-1;u+=2.4,b++){const m=win(f,b);if(m)quad([u,y,z-.02],[u+.8,y,z-.02],[u+.8,y+.6,z-.02],[u,y+.6,z-.02],m,[0,0,-1]);}
  if(faces.includes('x'))for(let b=0,u=z+.7;u<z+d-1;u+=2.4,b++){const m=win(f,b+40);if(m)quad([x+w+.02,y,u+.8],[x+w+.02,y,u],[x+w+.02,y+.6,u],[x+w+.02,y+.6,u+.8],m,[1,0,0]);}
 }
}
// A sign board of stroke clusters standing on its base y0 in the plane z, glyphs on its front face (normal -z).
function menuSign(x0,y0,z,w,cell,count,hue,seed,flicker,dead=-1){
 const h=cell*1.72*(6.5*count+1.5);
 box(x0,y0,z,x0+w,y0+h,z+.28,{kind:'ideogram',hue,seed,x0,y0,cell,pad:(w-cell*5)/2,count,glyphs:MENU_IDEOGRAMS,flicker,dead});
 box(x0-.08,y0-.15,z-.02,x0+w+.08,y0,z+.3,mat('metal'));box(x0-.08,y0+h,z-.02,x0+w+.08,y0+h+.15,z+.3,mat('metal'));
}
// A screen (the video material) on a vertical face: its bottom edge runs from (x0,z0) to (x1,z1) left to right as the
// camera sees it, so the normal is that edge turned toward the viewer.
function menuScreen(x0,z0,x1,z1,y0,y1,frames,extra={}){
 const w=Math.hypot(x1-x0,z1-z0),ux=(x1-x0)/w,uz=(z1-z0)/w;
 quad([x0,y0,z0],[x1,y0,z1],[x1,y1,z1],[x0,y1,z0],{kind:'video',x0,z0,ux,uz,w,y0,h:y1-y0,frames,...extra},[uz,0,-ux]);
}
// A lit room on a face: a window quad on the front face (normal -z, along x) or the right face (normal +x, along z),
// amber or cold, with a figure standing in it now and then.
function menuRoom(face,a0,a1,y0,y1,fixed,hue,figure){
 const m={kind:'room',hue,y0,h:y1-y0,lum:hue===1?.9:1.05};if(figure!==undefined){m.figure=figure;m.fw=.11;}
 if(face==='z')quad([a0,y0,fixed],[a1,y0,fixed],[a1,y1,fixed],[a0,y1,fixed],m,[0,0,-1]);
 else quad([fixed,y0,a1],[fixed,y0,a0],[fixed,y1,a0],[fixed,y1,a1],m,[1,0,0]);
}
// A fire escape zigzagging down a front face (plane z) between x0 and x1 from yTop to yBottom: flights of `/` and `\`
// with a landing between each pair, and rails at the landings.
function menuEscape(x0,x1,z,yTop,yBottom){
 let i=0;for(let y=yTop;y>yBottom;y-=1.5,i++){
  const g=i%2?'\\':'/';
  quad([x0,y-1.4,z],[x1,y-1.4,z],[x1,y,z],[x0,y,z],{kind:'iron',g,lum:.75},[0,0,-1]);
  quad([x0-.15,y-.12,z-.01],[x1+.15,y-.12,z-.01],[x1+.15,y,z-.01],[x0-.15,y,z-.01],{kind:'iron',g:'=',lum:.85},[0,0,-1]);
  quad([x0-.15,y,z-.01],[x1+.15,y,z-.01],[x1+.15,y+.35,z-.01],[x0-.15,y+.35,z-.01],{kind:'iron',g:'+',lum:.5},[0,0,-1]);
 }
}
// A cable slung between two points with a sag, as short two-sided segments (so it draws from either side), beading
// with rain (the wire material's marks).
function menuCable(a,b,sag,segments=10){
 for(let i=0;i<segments;i++){
  const u0=i/segments,u1=(i+1)/segments,p=u=>[mix(a[0],b[0],u),mix(a[1],b[1],u)-sag*4*u*(1-u),mix(a[2],b[2],u)],p0=p(u0),p1=p(u1);
  const m={kind:'iron',g:'-',lum:.62};
  quad(p0,p1,[p1[0],p1[1]+.05,p1[2]],[p0[0],p0[1]+.05,p0[2]],m,[0,0,-1]);quad(p1,p0,[p0[0],p0[1]+.05,p0[2]],[p1[0],p1[1]+.05,p1[2]],m,[0,0,1]);
  if(i%3===1)box(p1[0]-.03,p1[1]-.08,p1[2]-.03,p1[0]+.03,p1[1]+.02,p1[2]+.03,{kind:'glow',hue:6,lum:.8});
 }
}
function menuSunk(from){const G=MENU_GROUND;for(let i=from;i<surfaces.length;i++){for(const v of surfaces[i].v)v[1]+=G;surfaces[i].mat={...surfaces[i].mat,baseY:G};}}
// The sky chase's loop: a closed Catmull-Rom path round the near right tower, in front of it on the near leg and
// behind it on the far one. u in 0..1.
const MENU_LOOP=[[-5.5,4.2,17],[6,3.8,18],[17,4.4,24],[24,5.5,33],[17,3.4,42],[3,3.8,44],[-2.5,4.6,36],[-1.2,5.5,28.5]];
function menuPath(u){
 const P=MENU_LOOP,N=P.length,f=fract(u)*N,i=Math.floor(f),s=f-i,p0=P[(i+N-1)%N],p1=P[i],p2=P[(i+1)%N],p3=P[(i+2)%N],o=[];
 for(let k=0;k<3;k++)o[k]=.5*(2*p1[k]+(-p0[k]+p2[k])*s+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*s*s+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*s*s*s);
 return o;
}
// A box placed by a rigid transform: every corner through T, the normals through N.
function menuBox(x0,y0,z0,x1,y1,z1,m,T,N){const i=surfaces.length;box(x0,y0,z0,x1,y1,z1,m);for(let k=i;k<surfaces.length;k++){const q=surfaces[k];surfaces[k]={...q,v:q.v.map(T),n:N(q.n)};}}
// A flying car at p heading along d, rolled into its turn: body, canopy, a headlamp bar and a tail bar, then its
// light trail, short segments back along the path fading from the car's colour to glass. `at` maps the loop position
// to a world point (the third car's side-street entry blends toward the loop).
function menuFlyer(u,hue,trail,at=menuPath){
 const p=at(u),q=at(u+.004),d=[q[0]-p[0],q[1]-p[1],q[2]-p[2]],r=at(u+.03),e=[r[0]-p[0],r[2]-p[2]];
 const turn=(d[0]*e[1]-d[2]*e[0])/(Math.hypot(d[0],d[2])*Math.hypot(e[0],e[1])+1e-6),roll=clamp(-turn*2.2,-.7,.7);
 const yaw=Math.atan2(d[0],d[2]),pitch=Math.atan2(d[1],Math.hypot(d[0],d[2])),cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);
 const R=([x,y,z])=>{const rx=x*cr-y*sr,ry=x*sr+y*cr,py=ry*cp+z*sp,pz=-ry*sp+z*cp;return[rx*cy+pz*sy,py,-rx*sy+pz*cy];};
 const T=v=>{const w=R(v);return[w[0]+p[0],w[1]+p[1],w[2]+p[2]];};
 menuBox(-1.3,-.35,-2.6,1.3,.35,2.6,mat('car',hue),T,R);menuBox(-.85,.35,-1.3,.85,.95,.9,mat('glass',hue),T,R);
 menuBox(-1.36,-.42,-2.4,1.36,-.3,2.4,{kind:'glow',hue,lum:1.25},T,R);
 menuBox(-1.05,-.05,2.6,1.05,.25,2.72,mat('lamp',2),T,R);menuBox(-1.1,-.1,-2.72,1.1,.25,-2.6,mat('tail',3),T,R);
 trail.forEach((m,i)=>{const b=at(u-.012*(i+1)),c=at(u-.012*(i+1)+.004),dd=[c[0]-b[0],c[1]-b[1],c[2]-b[2]],yw=Math.atan2(dd[0],dd[2]),cw=Math.cos(yw),sw=Math.sin(yw);
  const Rt=([x,y,z])=>[x*cw+z*sw,y,-x*sw+z*cw],Tt=v=>{const w=Rt(v);return[w[0]+b[0],w[1]+b[1]+.05,w[2]+b[2]];};menuBox(-.3,-.08,-.7,.3,.08,.7,m,Tt,Rt);});
}
// Far traffic: a small lit body crossing the sky slowly along x at (y, z), leading lamp and trailing tail.
function menuFarCar(x,y,z,dir,hue){box(x-1.1,y,z-.5,x+1.1,y+.5,z+.5,mat('car',hue));box(x+dir*1.1-.1,y+.1,z-.35,x+dir*1.1+.1,y+.4,z+.35,mat('lamp',2));box(x-dir*1.1-.1,y+.1,z-.35,x-dir*1.1+.1,y+.4,z+.35,mat('tail',3));}
// Three framings, all with Rook in the right third and the horizon in the upper half, the billboard and the cyan sign
// board in frame, and Rook near enough for his portrait sheet (72 rows, cell for cell in A): A, the low three-quarter
// on him; B, the push-out that takes in the billboard tower's flank, the vent and the roof; C, lower and a shade
// closer than A, looking up the canyon.
const MENU_SHOTS={A:[[-.35,1.72,.62],[.5,1.76,6]],B:[[-1.2,2.0,.05],[-.6,1.55,6]],C:[[-.1,1.42,.85],[1.05,1.62,5.6]]};
function menuLook(k){const [c,t]=MENU_SHOTS[k];return look(c[0],c[1],c[2],t[0],t[1],t[2]);}
function menuBlend(a,b,u){const [c0,t0]=MENU_SHOTS[a],[c1,t1]=MENU_SHOTS[b],s=smooth(u);return look(mix(c0[0],c1[0],s),mix(c0[1],c1[1],s),mix(c0[2],c1[2],s),mix(t0[0],t1[0],s),mix(t0[1],t1[1],s),mix(t0[2],t1[2],s));}
const MENU_ROOK={x:1.6,z:4};
const MENU_TICKER='LUMEN BOARD   RESERVE POWER   ALLOCATION NOTICE   SECTOR 4 CURFEW 02:00   ';
registerSet('menu',{
 chapter:'NIGHT DIVISION',objective:()=>'THE LAST LIGHT',
 description:'A rooftop ledge over a rain-soaked city of lit towers, a video billboard, neon sign boards, an airship, a searchlight and flying traffic; Detective Rook stands at the parapet with a cigarette, smoke rising, cars chasing through the sky behind him.',
 rain:true,rainDensity:600,density:2,
 build(){
  const G=MENU_GROUND,F=menuBillboardFrames();
  // The roof: the far wing carries Rook to the front parapet, the near wing ends two units from the camera. Coping
  // stones cap every parapet.
  floor(-2.6,-12,16,5.6,0,'roof',0);floor(-16,-12,-2.6,2.6,0,'roof',0);
  for(const [x0,z0,x1,z1] of [[-2.6,5.6,16,6.2],[-2.6,2.0,-2.0,6.2],[-16,2.0,-2.6,2.6],[-16,-12,-15.4,2.6],[15.4,-12,16,6.2]]){box(x0,0,z0,x1,1.15,z1,mat('brick',0));box(x0-.06,1.15,z0-.06,x1+.06,1.32,z1+.06,{kind:'stone',hue:0,seed:3});}
  // Puddles: one under Rook's feet catching the cyan sign, one on the near wing catching the billboard's pictures. The
  // wall lamp on the parapet's inner face lights both. A low duct runs along the return parapet at Rook's left.
  floor(-1.3,3.1,1.1,5.4,.012,'water',1);quad([-.6,.016,4.2],[-.6,.016,5.35],[.7,.016,5.35],[.7,.016,4.2],{kind:'wet',hue:1,lum:.34},[0,1,0]);
  floor(-12,-3,-7.5,1,.012,'water',1);quad([-11.4,.016,-1.2],[-11.4,.016,.8],[-8.2,.016,.8],[-8.2,.016,-1.2],{kind:'wet',hues:[6,2,1,1,6,3],period:2.6,lum:.3},[0,1,0]);
  box(-2,0,2.4,-1.25,.62,5.55,mat('ceiling'));box(-2.08,.62,2.3,-1.17,.7,5.6,mat('hatch'));
  box(-2.72,1.32,3.3,-2.6,1.52,3.7,mat('metal'));box(-2.95,1.5,3.2,-2.55,1.72,3.8,mat('lamp',2));lamps.push([-2.7,3.5]);
  box(-8.2,0,.3,-5.2,.5,2.2,{kind:'glass',hue:0});box(-4.8,0,.4,-3.2,1.6,2.3,mat('brick',0));box(-4.4,1.6,.7,-3.6,2.2,2,mat('vent'));
  box(.88,1.15,5.55,.96,1.34,5.65,mat('metal'));box(.8,1.34,5.48,1.06,1.52,5.7,mat('lamp',2));lamps.push([.9,5.6]);
  // Front parapet furniture: a fire-escape ladder head hooked over the coping, a bottle left on the coping, a dish
  // antenna on a short post, and the aerial mast with its red lamp, which carries a cable back to the return parapet.
  for(const x of [-1.9,-1.35])box(x-.04,1.2,5.75,x+.04,2.6,5.83,mat('metal'));for(let y=1.45;y<2.5;y+=.32)box(-1.9,y,5.74,-1.35,y+.05,5.84,{kind:'iron',g:'=',lum:.85});
  box(3.4,1.32,5.85,3.55,1.72,6,{kind:'glass',hue:5});
  box(-2.45,1.32,5.9,-2.35,2.4,6,mat('metal'));box(-2.95,2.2,5.86,-1.85,2.9,6.02,{kind:'iron',g:'+',lum:.6,hue:0});
  box(4.45,1.32,5.86,4.55,5.4,5.96,mat('metal'));box(4.2,4.9,5.85,4.8,4.96,5.97,mat('metal'));box(4.35,5.4,5.83,4.65,5.7,5.99,{kind:'beacon',hue:3,period:1.4,duty:.3});
  menuCable([4.5,4.8,5.9],[-2.4,3.3,2.2],.55,12);
  // Near-wing furniture: a lamp on a post, the vent with steam, a stair housing with its hatch, an aerial.
  box(-6.05,0,-.55,-5.95,2.3,-.45,mat('metal'));box(-6.4,2.1,-.9,-5.6,2.4,-.1,mat('lamp',2));lamps.push([-6,-.5]);
  box(-9.5,0,-1,-6.8,1.2,1.2,mat('vent'));box(-8.6,1.2,-.4,-7.7,1.9,.5,mat('metal'));
  box(9,0,-6,13,2.8,-1,mat('brick',0));box(10.2,0,-1.02,11.8,2.3,-.98,mat('hatch'));box(12.9,0,-5.9,13,5.5,-5.8,mat('metal'));
  // The low block beyond the corner (its roof just over the parapet line) with tanks, ducts, a pipe run, the steam
  // stack and a rooftop doorway with a lit sign; and the low block to Rook's left carrying the cyan sign.
  menuTower(-10,8,6.6,8,2.5,1,5);ellipsoid(-7.6,3.7,12.5,1.3,1.3,1.3,mat('tank',1));box(-4.3,2.5,14.6,-3.5,4.3,15.4,mat('vent'));
  box(-10,2.5,8,-3.4,2.62,8.15,mat('neon',1));box(-6.2,2.5,9.2,-4.4,3.3,10.6,mat('vent'));box(-9.9,2.62,11,-3.6,2.9,11.3,mat('pipe',2));
  box(-9.6,2.5,8.6,-7.6,4.1,10.4,mat('brick',0));box(-9.1,2.5,8.58,-8.1,3.7,8.62,mat('hatch'));box(-9.5,3.8,8.5,-7.7,4.05,8.6,mat('neon',3));
  menuTower(3,14,11,10,-1.2,0,11);menuSign(3.6,-1.2,15,1.25,.135,6,1,3,false);box(3.3,-1.2,14.7,3.4,4.2,14.8,mat('metal'));
  // The canyon's left wall: the billboard tower, its board hung out over the drop on two struts with chase lights
  // round it, the rose sign projecting from its flank, lit rooms and a fire escape on its faces, pipes up its flank;
  // then the lower towers beyond and the flank blocks the wide frame sees.
  menuTower(-12,22,8,12,22,4,9);box(-12,G,21.9,-11.85,22,22.05,mat('neon',1));
  const b0=[-10.9,17.6],b1=[-3.6,21.2];
  menuScreen(b0[0],b0[1],b1[0],b1[1],3.7,8.2,F,{chase:true,period:3.1});
  box(-11.05,3.25,17.5,-10.75,8.5,22,mat('metal'));box(-3.75,3.25,21.1,-3.45,8.5,22,mat('metal'));box(-11,3.2,17.6,-3.5,3.4,21.3,mat('metal'));
  menuSign(-4,-1.6,24.4,1.7,.2,6,3,5,true);
  for(let f=0;f<4;f++){const y=10.2+f*3;menuRoom('x',23.6,25.4,y,y+1.7,-3.98,f%3===1?1:2,f===1?24.6:undefined);menuRoom('x',27.2,29,y,y+1.7,-3.98,2,f===2?28.2:undefined);menuRoom('x',31,32.6,y,y+1.7,-3.98,f===3?1:2,undefined);}
  for(let f=0;f<3;f++){const y=11+f*3.2;menuRoom('z',-11.2,-9.4,y,y+1.7,21.98,2,f===0?-10.2:undefined);menuRoom('z',-8.4,-6.8,y,y+1.7,21.98,f===2?1:2,undefined);}
  menuEscape(-6.4,-4.4,21.97,20.5,.5);
  box(-3.98,G,32.4,-3.7,21,32.7,mat('pipe',2));box(-3.98,G,33.2,-3.78,21,33.4,mat('pipe',2));box(-12,16,25,-3.9,16.4,25.6,{kind:'iron',g:'=',lum:.55});
  menuScreen(-3.96,26.4,-3.96,29.6,12.2,13.9,[{bands:true,hue:2},menuPicture(menuWord('24'),12,5,{'#':[3,1.25]})],{period:2.1,border:.08});
  menuTower(-9,37,7.4,12,8,1,21);box(-9,8,36.9,-1.6,8.15,37.1,mat('neon',1));ellipsoid(-3.2,9.5,40,1.2,1.3,1.2,mat('tank',1));
  menuScreen(-8.6,36.97,-2,36.97,2.2,7.4,[menuPicture(menuWord('RATION'),32,10,{'#':[2,1.2]}),{bands:true,hue:3},menuPicture([...menuWord('LUMEN'),'','=================='],32,10,{'#':[1,1.15],'=':[6,.8]})],{period:3.4});
  box(-6.6,8.25,41.6,-5.4,8.9,42.8,mat('metal'));box(-6.3,8.9,41.9,-5.7,9.3,42.5,mat('metal'));
  menuDark(-22,9,9,11,12,7,'x');box(-13.1,G,9,-12.95,12,9.15,mat('neon',3));
  menuTower(-26,22,13,14,8,0,33);menuDark(-28,40,18,12,12,17,'z',.8);
  // The right wall: the dark block beside Rook with a rose strip on its roof edge, an LED ticker wrapped round its
  // corner and an amber sign board with a burnt-out cluster on its roof; the lit tower behind it with a cyan halo under
  // its roofline, a fire escape, HOTEL is elsewhere; a crane on its roof with a blinking tip; the flank blocks behind Rook.
  menuDark(10,26,10,12,6,23,'zx');box(10,6,25.9,20,6.15,26.1,mat('neon',3));
  for(const [x,z] of [[10.2,26.2],[19.8,26.2],[10.2,37.8]])box(x-.08,6.15,z-.08,x+.08,6.6,z+.08,mat('metal'));
  box(9.96,6.6,25.96,20.04,7.5,38.04,{kind:'led',hue:2,x0:9.96,z0:25.96,w:10.08,d:12.08,y0:6.6,h:.9,text:MENU_TICKER,pitch:8,speed:1.1});
  menuSign(16.6,6,25.7,1.4,.16,5,2,8,false,2);
  menuTower(14,42,10,14,14,1,27);box(14,G-10,41.9,14.15,14,42.05,mat('neon',1));box(13.9,12.9,41.85,24.1,13.5,56.15,{kind:'halo',hue:1});
  menuScreen(15,41.97,21,41.97,7,10.5,[menuPicture(menuWord('CELLS'),24,8,{'#':[1,1.2]}),{bands:true,hue:1},menuPicture(menuWord('POWER'),24,8,{'#':[3,1.2]})],{period:2.8});
  menuEscape(22,23.6,41.97,12.5,.5);
  box(18.6,14.25,47.6,19.4,24,48.4,{kind:'iron',g:'x',lum:.7});box(4,24,47.7,26,24.5,48.3,{kind:'iron',g:'=',lum:.8});box(23,23,47.5,26,24,48.5,{kind:'iron',g:'#',lum:.5});
  box(10.9,18,47.97,11.1,24,48.03,mat('metal'));box(10.5,17.3,47.7,11.5,18,48.3,{kind:'iron',g:'#',lum:.6});
  box(3.7,24.5,47.7,4.3,25.1,48.3,{kind:'beacon',hue:3,period:1.8,duty:.25});box(18.7,24,47.7,19.3,24.6,48.3,{kind:'beacon',hue:3,period:1.8,phase:.5,duty:.25});
  menuTower(17,6,10,10,4,0,31);menuTower(20,20,10,12,10,4,37);ellipsoid(25,11.3,26,1.4,1.5,1.4,mat('tank',1));
  // The end of the canyon: the block that carries THE FILAMENT's sign with HOTEL stacked down its face, then the
  // megastructure in three dark stages with a cyan spine and red warning lights climbing it, going into the fog.
  menuTower(-2,48,14,6,14,0,43);box(1,11.6,47.85,9,12.2,48,mat('neon',3));
  menuDark(-8,58,32,14,22,51,'z',.85);menuDark(-2,60,20,10,44,53,'z',.75);menuDark(3,62,8,6,70,55,'z',.65);
  box(6.9,22,61.9,7.1,70,62.05,mat('neon',1));
  [[-8,22.2,58,0],[24,22.2,58,.1],[-2,44.2,60,.4],[18,44.2,60,.5],[7,70.2,62,.9]].forEach(([x,y,z,ph])=>box(x-.3,y,z-.3,x+.3,y+.7,z+.3,{kind:'beacon',hue:3,period:2.4,phase:ph,duty:.3}));
  for(let i=0;i<7;i++)box(6.6,26+i*6,61.8,7.4,26.6+i*6,62.1,{kind:'beacon',hue:3,period:2.4,phase:.15+i*.09,duty:.2});
  // Far rows on both flanks, fogged, and a band of dark masses beyond them where the fog closes.
  const far=surfaces.length;cityRow(26,64,12,-40,42);cityRow(24,66,13,30,40);menuSunk(far);
  for(const [x,z,w,h] of [[-46,72,14,30],[-30,78,12,24],[28,74,12,28],[40,80,14,20],[-12,84,18,34],[14,86,16,26]])box(x,G,z,x+w,h,z+10,{kind:'haze',lum:.07});
 },
 start(){return menuLook('A');},
 // A 52-second drift with no cut: A to B over the first 22 seconds, a hold on B, B to C, and C back to A.
 shot(){
  if(reduce)return menuLook('A');
  const u=fract(state.t/52);
  if(u<.42)return menuBlend('A','B',u/.42);
  if(u<.5)return menuLook('B');
  if(u<.78)return menuBlend('B','C',(u-.5)/.28);
  return menuBlend('C','A',(u-.78)/.22);
 },
 ease(){return 1;},
 blocking(){return{rook:{x:MENU_ROOK.x,z:MENU_ROOK.z,pose:'smoke',lean:0},others:[]};},
 geometry(){
  const t=state.t,wind=Math.sin(t/23)*.5;
  // Rook's cigarette smoke: five wisps rising in a slow S from the cigarette's ember (the portrait holds it in his
  // right hand at the sprite's right edge, three quarters of the way up), dashes that thin to dots and lean with the wind.
  for(let i=0;i<5;i++){
   const ph=fract(t/3.8+i*.2),x=MENU_ROOK.x+.42-.1*ph+Math.sin(ph*7.5)*.14*ph+wind*.3*ph,y=1.78+ph*1.7,w=.06+.2*ph,h=.05+.09*ph,z=MENU_ROOK.z-.1;
   quad([x-w,y,z],[x+w,y,z],[x+w,y+h,z],[x-w,y+h,z],ph<.6?mat('cable',7):mat('gap',4),[0,0,-1]);
  }
  // Steam off the low block's stack: nine small puffs rising, widening and drifting with the wind toward the canyon,
  // white then thinning to dots; small and overlapping so the column reads as vapour and not as bars.
  for(let i=0;i<9;i++){
   const ph=fract(t/5+i/9),x=-3.9+ph*(1.8+wind*2)+Math.sin(ph*6+i*1.7)*.4,y=4.3+ph*3.6+hash(i,3)*.3,w=.22+ph*.6,h=.18+ph*.3;
   quad([x-w,y,14.9],[x+w,y,14.9],[x+w,y+h,14.9],[x-w,y+h,14.9],ph<.6?mat('cable',6):mat('gap',4),[0,0,-1]);
  }
  // The chase: the red car and its pursuer eight units behind on a 22-second loop; the pursuer's spotlight stabs ahead
  // of it for a fifth of a second every three seconds. Every third pass a third car joins from the side street between
  // the right towers, falls in behind the pursuer round the far leg, and peels off behind the near tower.
  const u=t/22,pass=Math.floor(u)%3;
  menuFlyer(u,3,[mat('tail',3),mat('metal',3),mat('metal',3),mat('glass',3),mat('glass',3)]);
  menuFlyer(u-.075,6,[mat('metal',6),mat('metal',1),mat('metal',1),mat('glass',1),mat('glass',1)]);
  if(fract(t/3)<.067){const s=menuPath(u-.075+.02);box(s[0]-.5,s[1]-.25,s[2]-.5,s[0]+.5,s[1]+.35,s[2]+.5,{kind:'glow',hue:6,lum:1.5});}
  if(pass===2){
   const u3=fract(u)-.16;
   if(u3>.42&&u3<.98){
    const side=[24,7,27],at=v=>{const p=menuPath(v),s=smooth(clamp((fract(v)-.42)/.12,0,1)),e=smooth(clamp((fract(v)-.9)/.08,0,1)),q=[mix(side[0],p[0],s),mix(side[1],p[1],s),mix(side[2],p[2],s)];return[mix(q[0],14,e),mix(q[1],3,e),mix(q[2],22,e)];};
    menuFlyer(u3,2,[mat('metal',2),mat('metal',2),mat('glass',2)],at);
   }
  }
  // Far traffic: three lanes across the top of the canyon at different heights, speeds and hues, slow and small.
  for(let i=0;i<3;i++){menuFarCar(-38+fract(t*.028+i/3)*72,19,50,1,0);menuFarCar(34-fract(t*.022+i/3+.15)*72,23,55,-1,4);menuFarCar(-38+fract(t*.04+i/3+.4)*72,27.5,60,1,1);}
  // The airship: a ninety-second crossing high over the canyon, right to left, its flank screen lit.
  const ax=44-fract(t/90)*88;
  ellipsoid(ax,33,60,8,2,2.4,mat('metal',4));box(ax-1.8,30.6,59.2,ax+1.8,31.2,60.8,mat('metal',0));box(ax+7.4,32.4,59.4,ax+8.8,33.6,60.6,mat('metal',0));
  menuScreen(ax-5.5,57.55,ax+5.5,57.55,32,34.2,[menuPicture(menuWord('LUMEN'),24,6,{'#':[2,1.3]}),{bands:true,hue:1}],{period:4,border:.06});
  box(ax-8.4,32.6,59.6,ax-7.6,33.4,60.4,{kind:'beacon',hue:3,period:2,duty:.3});box(ax+8.6,32.6,59.6,ax+9.2,33.4,60.4,{kind:'beacon',hue:3,period:2,phase:.5,duty:.3});
  // The searchlight on the tower beyond the billboard: a long thin beam swinging through the fog.
  const a=t*.21,src=[-6,9.3,42.2],d=[Math.cos(a)*.75,.62,Math.sin(a)*.75],L=34,end=[src[0]+d[0]*L,src[1]+d[1]*L,src[2]+d[2]*L],wd=[-Math.sin(a)*1.3,0,Math.cos(a)*1.3];
  const bm={kind:'beam',x0:src[0],y0:src[1],z0:src[2],ux:d[0],uy:d[1],uz:d[2],len:L},n=[d[1]*wd[2]-d[2]*wd[1],d[2]*wd[0]-d[0]*wd[2],d[0]*wd[1]-d[1]*wd[0]],nl=Math.hypot(...n)||1;
  const c=[[src[0]-wd[0]*.05,src[1],src[2]-wd[2]*.05],[src[0]+wd[0]*.05,src[1],src[2]+wd[2]*.05],[end[0]+wd[0],end[1],end[2]+wd[2]],[end[0]-wd[0],end[1],end[2]-wd[2]]];
  quad(c[0],c[1],c[2],c[3],bm,n.map(v=>v/nl));quad(c[1],c[0],c[3],c[2],bm,n.map(v=>-v/nl));
 },
 labels(){
  worldLabel([5,13.2,47.8],'THE FILAMENT',3);
  worldLabel([-8,4.45,8.4],'OPEN',hash(Math.floor(state.t*5),2)>.1?2:4);worldLabel([-5.2,1.95,7.9],'24',1);
  // HOTEL stacked down the far block's face, one letter a row, flickering as neon does.
  const p=cam([10.6,10.4,47.9]);if(p.z>2){const s=project(p),on=hash(Math.floor(state.t*6),5)>.1;'HOTEL'.split('').forEach((g,i)=>pixel(s.x,s.y+i*Math.max(1,Math.round(.9*fy/p.z)),p.z-.2,on?g:'-',2*20+(on?17:6)));}
 },
 exit(){return[0,2,40];},
 preview(){return 'menuIdle';},
});
registerPhases('menu',{
 menuIdle:{kind:'quiet',title:'',caption:()=>'',buttons:()=>{}},
});
