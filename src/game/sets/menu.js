// THE MENU. An idle tableau behind the title: Rook on a rooftop ledge with a cigarette, the city at his back.
// It is not a story set: it has one phase, `menuIdle`, which never advances, never checkpoints and never shows
// a card. The story's clock (`state.t`) runs while the menu is open, so the picture drifts, flickers and flies.
//
// The picture: Rook at the corner of a high roof, right of frame, three-quarter to the city. The roof is an L: the
// near wing ends at a parapet two units from the camera, the far wing carries Rook to the front parapet. Beyond the
// parapets the street is forty-five units down and the city rises past the top of the frame: a canyon of stepped
// towers running away to the left of centre, a video billboard hung off the near tower on the left, a rose sign
// board of pseudo-ideograms projecting from its flank and a steady cyan one on the low block to Rook's left, lamp
// pools and a puddle on the wet roof, steam off a vent stack, THE FILAMENT's sign at the end of the canyon and a
// stepped megastructure fading into the fog behind it. Two cars chase each other round the near right tower, far
// traffic crosses the top of the frame, and smoke rises off Rook's cigarette. Nothing here is interface.
//
// The signs cannot carry real Chinese characters: the picture is a single-width grid of printable ASCII (codes 32
// to 126), so the boards stack 5-by-5 clusters of ASCII strokes (the `ideogram` material) that read as ideograms
// at their distance. The billboard is the `video` material, four pictures cycling on the clock.
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
// The billboard's four pictures (28 by 10 glyphs): a face, the LUMEN logo in block letters, a sweep of scan bands
// and the Lumen Board's crest (a lamp in a ring). Each frame inks its own glyphs.
const MENU_LOGO={L:['#   ','#   ','#   ','#   ','####'],U:['#  #','#  #','#  #','#  #','####'],M:['#   #','## ##','# # #','#   #','#   #'],E:['####','#   ','### ','#   ','####'],N:['#  #','## #','# ##','#  #','#  #']};
const MENU_FRAMES=[
 {rows:['       ##############       ','     ##################     ','    ###::::::::::::::###    ','    ##::::::::::::::::##    ','    ##:::o::::::::o:::##    ','    ##::::::::::::::::##    ','     ##::::::>:::::::##     ','     ##::::::::::::::##     ','       ::::::::::::         ','        ==========          '],
  ink:{'#':[4,.45],'=':[6,.9],':':[6,.75],'o':[1,1.3],'>':[3,1.2]}},
 {rows:['                            ','                            ',...[0,1,2,3,4].map(r=>(' '+'LUMEN'.split('').map(c=>MENU_LOGO[c][r]).join(' ')).padEnd(28,' ')),'                            ','  ========================  ','                            '],
  ink:{'#':[2,1.25],'=':[1,.9]}},
 {bands:true,hue:1},
 {rows:['          ########          ','       ###        ###       ','      ##    @@@@    ##      ','     ##    @@@@@@    ##     ','     ##    @@@@@@    ##     ','     ##     @@@@     ##     ','      ##     ||     ##      ','       ###   ||   ###       ','          ########          ','    ====================    '],
  ink:{'#':[1,.95],'@':[2,1.3],'|':[6,.9],'=':[4,.85]}},
];
// A tower from the street: a lit facade (the building material's window grid) with a stone rim and a cap.
function menuTower(x,z,w,d,top,hue,seed){
 const G=MENU_GROUND,m={kind:'building',hue,seed,x,z,w,d,h:top-G,baseY:G};
 box(x,G,z,x+w,top,z+d,m);box(x-.1,top,z-.1,x+w+.1,top+.25,z+d+.1,{kind:'stone',hue,seed});
 if(top-G>40)box(x+w*.22,top+.25,z+d*.25,x+w*.68,top+1.5,z+d*.7,{kind:'stone',hue,seed});
}
// A dark tower: an unlit mass (the `gap` material, near black) with a sparse grid of lit windows on its front face
// and, when asked, its right face: amber mostly, some cold white-cyan. Only the floors that can show over the
// parapet get windows; a facade at twenty units and more is what makes the mass read as a building.
function menuDark(x,z,w,d,top,seed,faces='z'){
 const G=MENU_GROUND;box(x,G,z,x+w,top,z+d,{kind:'gap',hue:4});
 const win=(f,b)=>hash(f,b,seed)>.8?(hash(b,f,seed+1)>.35?mat('lamp',2):mat('awning',1)):null;
 for(let f=0,y=Math.max(G+2,-8);y<top-1.6;y+=2.8,f++){
  if(faces.includes('z'))for(let b=0,u=x+.7;u<x+w-1;u+=2.4,b++){const m=win(f,b);if(m)quad([u,y,z-.02],[u+.8,y,z-.02],[u+.8,y+.6,z-.02],[u,y+.6,z-.02],m,[0,0,-1]);}
  if(faces.includes('x'))for(let b=0,u=z+.7;u<z+d-1;u+=2.4,b++){const m=win(f,b+40);if(m)quad([x+w+.02,y,u+.8],[x+w+.02,y,u],[x+w+.02,y+.6,u],[x+w+.02,y+.6,u+.8],m,[1,0,0]);}
 }
}
// A sign board of stroke clusters standing on its base y0 in the plane z, glyphs on its front face (normal -z).
function menuSign(x0,y0,z,w,cell,count,hue,seed,flicker){
 const h=cell*1.72*(6.5*count+1.5);
 box(x0,y0,z,x0+w,y0+h,z+.28,{kind:'ideogram',hue,seed,x0,y0,cell,pad:(w-cell*5)/2,count,glyphs:MENU_IDEOGRAMS,flicker});
 box(x0-.08,y0-.15,z-.02,x0+w+.08,y0,z+.3,mat('metal'));box(x0-.08,y0+h,z-.02,x0+w+.08,y0+h+.15,z+.3,mat('metal'));
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
// light trail, three short segments back along the path fading from the car's colour to glass.
function menuFlyer(u,hue,trail){
 const p=menuPath(u),q=menuPath(u+.004),d=[q[0]-p[0],q[1]-p[1],q[2]-p[2]],r=menuPath(u+.03),e=[r[0]-p[0],r[2]-p[2]];
 const turn=(d[0]*e[1]-d[2]*e[0])/(Math.hypot(d[0],d[2])*Math.hypot(e[0],e[1])+1e-6),roll=clamp(-turn*2.2,-.7,.7);
 const yaw=Math.atan2(d[0],d[2]),pitch=Math.atan2(d[1],Math.hypot(d[0],d[2])),cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);
 const R=([x,y,z])=>{const rx=x*cr-y*sr,ry=x*sr+y*cr,py=ry*cp+z*sp,pz=-ry*sp+z*cp;return[rx*cy+pz*sy,py,-rx*sy+pz*cy];};
 const T=v=>{const w=R(v);return[w[0]+p[0],w[1]+p[1],w[2]+p[2]];};
 menuBox(-1.3,-.35,-2.6,1.3,.35,2.6,mat('car',hue),T,R);menuBox(-.85,.35,-1.3,.85,.95,.9,mat('glass',hue),T,R);
 menuBox(-1.05,-.05,2.6,1.05,.25,2.72,mat('lamp',2),T,R);menuBox(-1.1,-.1,-2.72,1.1,.25,-2.6,mat('tail',3),T,R);
 trail.forEach((m,i)=>{const b=menuPath(u-.014*(i+1)),c=menuPath(u-.014*(i+1)+.004),dd=[c[0]-b[0],c[1]-b[1],c[2]-b[2]],yw=Math.atan2(dd[0],dd[2]),cw=Math.cos(yw),sw=Math.sin(yw);
  const Rt=([x,y,z])=>[x*cw+z*sw,y,-x*sw+z*cw],Tt=v=>{const w=Rt(v);return[w[0]+b[0],w[1]+b[1]+.05,w[2]+b[2]];};menuBox(-.3,-.08,-.7,.3,.08,.7,m,Tt,Rt);});
}
// Far traffic: a small lit body crossing the sky slowly along x at (y, z), leading lamp and trailing tail.
function menuFarCar(x,y,z,dir,hue){box(x-1.1,y,z-.5,x+1.1,y+.5,z+.5,mat('car',hue));box(x+dir*1.1-.1,y+.1,z-.35,x+dir*1.1+.1,y+.4,z+.35,mat('lamp',2));box(x-dir*1.1-.1,y+.1,z-.35,x-dir*1.1+.1,y+.4,z+.35,mat('tail',3));}
// Three framings, all with Rook in the right third and the horizon in the upper half: A, the low three-quarter on
// him; B, the push-out that takes in the billboard and the vent; C, lower and a shade closer than A.
const MENU_SHOTS={A:[[-.5,1.75,.4],[.4,1.55,6]],B:[[-1.9,2.5,-1.4],[-.3,1.25,6]],C:[[-.2,1.45,.6],[.9,1.35,5.6]]};
function menuLook(k){const [c,t]=MENU_SHOTS[k];return look(c[0],c[1],c[2],t[0],t[1],t[2]);}
function menuBlend(a,b,u){const [c0,t0]=MENU_SHOTS[a],[c1,t1]=MENU_SHOTS[b],s=smooth(u);return look(mix(c0[0],c1[0],s),mix(c0[1],c1[1],s),mix(c0[2],c1[2],s),mix(t0[0],t1[0],s),mix(t0[1],t1[1],s),mix(t0[2],t1[2],s));}
const MENU_ROOK={x:1.6,z:4};
registerSet('menu',{
 chapter:'NIGHT DIVISION',objective:()=>'THE LAST LIGHT',
 description:'A rooftop ledge over a rain-soaked city of lit towers, a video billboard, neon sign boards and flying traffic; Detective Rook stands at the parapet with a cigarette, smoke rising, two cars chasing through the sky behind him.',
 rain:true,
 build(){
  const G=MENU_GROUND;
  // The roof: the far wing carries Rook to the front parapet, the near wing ends two units from the camera.
  floor(-2.6,-12,16,5.6,0,'roof',0);floor(-16,-12,-2.6,2.6,0,'roof',0);
  for(const [x0,z0,x1,z1] of [[-2.6,5.6,16,6.2],[-2.6,2.0,-2.0,6.2],[-16,2.0,-2.6,2.6],[-16,-12,-15.4,2.6],[15.4,-12,16,6.2]])box(x0,0,z0,x1,1.15,z1,mat('brick',0));
  // Puddles: one under Rook's feet, one on the near wing. The wall lamp on the parapet's inner face lights both.
  // A low duct runs along the return parapet at Rook's left.
  floor(-1.3,3.1,1.1,5.4,.012,'water',1);floor(-12,-3,-7.5,1,.012,'water',1);
  box(-2,0,2.4,-1.25,.62,5.55,mat('ceiling'));box(-2.08,.62,2.3,-1.17,.7,5.6,mat('hatch'));
  box(.88,1.15,5.55,.96,1.34,5.65,mat('metal'));box(.8,1.34,5.48,1.06,1.52,5.7,mat('lamp',2));lamps.push([.9,5.6]);
  // Near-wing furniture: a lamp on a post, the vent, a stair housing with its hatch, an aerial.
  box(-6.05,0,-.55,-5.95,2.3,-.45,mat('metal'));box(-6.4,2.1,-.9,-5.6,2.4,-.1,mat('lamp',2));lamps.push([-6,-.5]);
  box(-9.5,0,-1,-6.8,1.2,1.2,mat('vent'));box(-8.6,1.2,-.4,-7.7,1.9,.5,mat('metal'));
  box(9,0,-6,13,2.8,-1,mat('brick',0));box(10.2,0,-1.02,11.8,2.3,-.98,mat('hatch'));box(12.9,0,-5.9,13,5.5,-5.8,mat('metal'));
  // The low block beyond the corner (its roof just over the parapet line) with tanks and the steam stack, and the
  // low block to Rook's left carrying the cyan sign.
  menuTower(-10,8,6.6,8,2.5,1,5);ellipsoid(-7.6,3.7,12.5,1.3,1.3,1.3,mat('tank',1));box(-4.3,2.5,14.6,-3.5,4.3,15.4,mat('vent'));
  box(-10,2.5,8,-3.4,2.62,8.15,mat('neon',1));
  menuTower(3,14,11,10,-1.2,0,11);menuSign(3.6,-1.2,15,1.25,.135,6,1,3,false);
  // The canyon's left wall: the billboard tower, its board hung out over the drop on two struts, the rose sign
  // projecting from its flank; then the lower towers beyond and the flank blocks the wide frame sees.
  menuTower(-12,22,8,12,22,4,9);box(-12,G,21.9,-11.85,22,22.05,mat('neon',1));
  const b0=[-11.2,17.6],b1=[-4.2,21],bw=Math.hypot(b1[0]-b0[0],b1[1]-b0[1]),ux=(b1[0]-b0[0])/bw,uz=(b1[1]-b0[1])/bw;
  quad([b0[0],4.6,b0[1]],[b1[0],4.6,b1[1]],[b1[0],8.2,b1[1]],[b0[0],8.2,b0[1]],{kind:'video',x0:b0[0],z0:b0[1],ux,uz,w:bw,y0:4.6,h:3.6,frames:MENU_FRAMES},[uz,0,-ux]);
  box(-11.35,4.2,17.5,-11.05,8.5,22,mat('metal'));box(-4.35,4.2,20.9,-4.05,8.5,22,mat('metal'));box(-11.3,4.15,17.6,-4.1,4.35,21.1,mat('metal'));
  menuSign(-4,-1.6,24.4,1.7,.2,6,3,5,true);
  menuTower(-9,37,7.4,12,8,1,21);box(-9,8,36.9,-1.6,8.15,37.1,mat('neon',1));
  menuDark(-22,9,9,11,12,7,'x');box(-13.1,G,9,-12.95,12,9.15,mat('neon',3));
  menuTower(-26,22,13,14,8,0,33);menuDark(-28,40,18,12,12,17);
  // The right wall: the dark block beside Rook with a rose strip on its roof edge, the lit tower behind it with a
  // warning light, the flank blocks behind Rook.
  menuDark(10,26,10,12,6,23,'zx');box(10,6,25.9,20,6.15,26.1,mat('neon',3));
  menuTower(14,42,10,14,14,1,27);box(14,G-10,41.9,14.15,14,42.05,mat('neon',1));box(18.8,14.25,48,19.2,14.85,48.4,mat('tail',3));
  menuTower(17,6,10,10,4,0,31);menuTower(20,20,10,12,10,4,37);
  // The end of the canyon: the block that carries THE FILAMENT's sign, then the megastructure in three dark stages
  // with a cyan spine and red warning lights, a silhouette going into the fog.
  menuTower(-2,48,14,6,14,0,43);box(1,11.6,47.85,9,12.2,48,mat('neon',3));
  menuDark(-8,58,32,14,22,51);menuDark(-2,60,20,10,44,53);menuDark(3,62,8,6,70,55);
  box(6.9,22,61.9,7.1,70,62.05,mat('neon',1));for(const [x,y,z] of [[-8,22.2,58],[24,22.2,58],[-2,44.2,60],[18,44.2,60],[7,70.2,62]])box(x-.3,y,z-.3,x+.3,y+.7,z+.3,mat('tail',3));
  // Far rows on both flanks, fogged.
  const far=surfaces.length;cityRow(26,64,12,-40,42);cityRow(24,66,13,30,40);menuSunk(far);
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
  const t=state.t;
  // Rook's cigarette smoke: four wisps rising in a slow S from the cigarette's ember (the hero sheet holds it in his
  // right hand, at the sprite's right edge, three quarters of the way up), dashes that thin to dots.
  for(let i=0;i<4;i++){
   const ph=fract(t/3.8+i*.25),x=MENU_ROOK.x+.46-.12*ph+Math.sin(ph*7.5)*.14*ph,y=1.8+ph*1.7,w=.07+.2*ph,h=.05+.09*ph,z=MENU_ROOK.z-.1;
   quad([x-w,y,z],[x+w,y,z],[x+w,y+h,z],[x-w,y+h,z],ph<.6?mat('cable',7):mat('gap',4),[0,0,-1]);
  }
  // Steam off the low block's stack: seven small puffs rising, widening and wandering toward the canyon, white then
  // thinning to dots; small and overlapping so the column reads as vapour and not as bars.
  for(let i=0;i<7;i++){
   const ph=fract(t/5+i/7),x=-3.9+ph*1.8+Math.sin(ph*6+i*1.7)*.4,y=4.3+ph*3.4+hash(i,3)*.3,w=.22+ph*.6,h=.18+ph*.3;
   quad([x-w,y,14.9],[x+w,y,14.9],[x+w,y+h,14.9],[x-w,y+h,14.9],ph<.6?mat('cable',6):mat('gap',4),[0,0,-1]);
  }
  // The chase: the red car and its pursuer eight units behind on a 22-second loop.
  const u=t/22;
  menuFlyer(u,3,[mat('tail',3),mat('metal',3),mat('glass',3)]);
  menuFlyer(u-.075,6,[mat('metal',6),mat('metal',1),mat('glass',1)]);
  // Far traffic: two lanes across the top of the canyon, slow and small.
  for(let i=0;i<3;i++){menuFarCar(-38+fract(t*.028+i/3)*72,19,50,1,0);menuFarCar(34-fract(t*.022+i/3+.15)*72,23,55,-1,4);}
 },
 labels(){worldLabel([5,13.2,47.8],'THE FILAMENT',3);},
 exit(){return[0,2,40];},
 preview(){return 'menuIdle';},
});
registerPhases('menu',{
 menuIdle:{kind:'quiet',title:'',caption:()=>'',buttons:()=>{}},
});
