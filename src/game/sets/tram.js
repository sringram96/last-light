// 04b / THE LAST TRAM. A moving set: Rook rides the roof of the last tram across the dark district to Market Arch.
// Lamps 14 to 19 stand dark on their posts; a black division car follows on the road below with its lights off.
// The viaduct, the road beside it, the tenements and the far rows are built long. The tram, the cars, the lamp posts
// (dark until the market's district) and Market Arch itself are drawn each frame relative to the distance travelled,
// so the arch is where the arrival beat needs it however long the player rode before choosing to ride on.
const TRAM_FAR=1200,TRAM_GROUND=-6,TRAM_BAY=24;
// Market Arch's piers stand 39 units ahead of where tramArrive began (within the fog's 52 when they appear); the tram
// brakes over the first second and stops with its front rail a few units short of them. The lit posts begin 26 before.
const tramArch=()=>state.phaseDistance+43;
// Buildings from cityRow/building stand on the district's ground, six units under the viaduct.
function tramSunk(from){for(let i=from;i<surfaces.length;i++){const s=surfaces[i];if(s.mat.kind==='building'||s.mat.kind==='stone'){for(const v of s.v)v[1]+=TRAM_GROUND;s.mat={...s.mat,baseY:TRAM_GROUND};}}}
// A lamp post on the viaduct: an unlit blue lantern on its head until the market's district, then a lamp with a pool.
function tramPost(x,z,lit){
 box(x-.055,.5,z-.055,x+.055,4.6,z+.055,mat('metal'));
 box(x-.3,4.15,z-.3,x+.3,4.7,z+.3,lit?mat('lamp',2):mat('blind',4));box(x-.45,4.7,z-.45,x+.45,4.82,z+.45,mat('metal'));
 if(lit)lamps.push([x,z]);
}
// Market Arch: the elevated road crossing overhead on column piers, the lamplighter's lamps hung beneath it, the market
// beginning on the ground to the left of the viaduct (Rook goes over the rail and down to it), and uptown's towers behind.
function tramMarket(A){
 const g=TRAM_GROUND;
 box(-40,9,A-4,40,10.2,A+16,mat('metal'));
 for(const z of [A-3,A+11])for(const x of [-24,-5,5,27.5])box(x-.7,g,z,x+.7,9,z+2.4,mat('column'));
 for(const x of [-14,-10,-6,-2,2,6,10,14]){box(x-.3,8.35,A-1.2,x+.3,8.8,A-.6,mat('lamp',2));lamps.push([x,A-.9]);}
 floor(-14,A-4,-7,A+18,g+.02,'paving',0);
 for(let i=0;i<5;i++){const z=A-1+i*3.4,x0=-13.2+(i%2)*.6;box(x0,g,z,x0+2.4,g+2.2,z+2.4,{...mat('kiosk',1),baseY:g});box(x0-.2,g+2.3,z-.1,x0+3.4,g+2.55,z+2.5,mat('awning',i%2?2:3));}
 quad([-9.43,g+3.4,A-2],[-9.37,g+3.4,A-2],[-9.37,g+3.43,A+16],[-9.43,g+3.43,A+16],mat('cable'),[0,-1,0]);
 for(let z=A;z<A+16;z+=4){box(-9.6,g+2.9,z-.2,-9.2,g+3.4,z+.2,mat('lamp',2));lamps.push([-9.4,z]);}
 box(-14,g+5,A+44,-8,g+6,A+44.4,mat('neon',3));
 const from=surfaces.length;for(let i=0;i<6;i++){const z=A+16+i*20;building(-30,z,7,15,32+hash(i,1)*16,i%2?4:1,i*11+5);building(33,z+8,6,15,34+hash(i,2)*14,i%2?1:4,i*13+9);}tramSunk(from);
}
const tramMix=(a,b,u)=>({x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),z:mix(a.z,b.z,u),yaw:mix(a.yaw,b.yaw,u),pitch:mix(a.pitch,b.pitch,u)});
registerSet('tram',{
 chapter:'04b / THE LAST TRAM',card:'THE LAST TRAM',objective:()=>'CROSS THE DARK',
 description:'The roof of a tram crossing the dark district on its own reserve: unlit lamp posts, black tenements with one lit window in ten, and the elevated road ahead.',
 moving:true,rain:true,
 // The tram runs at the chase's pace and brakes for the arch over the first second of the arrival beat.
 speed:p=>p==='tramArrive'?mix(21,4,clamp(state.event,0,1)):21,
 build(){
  const z0=-50,z1=TRAM_FAR,g=TRAM_GROUND;
  // The district's ground, the viaduct on its brick wall with barrier edges, and the road deck beside it on columns.
  floor(-60,z0,60,z1,g,'road',7);
  floor(-4,z0,4,z1,0,'road',7);for(const x of [-4,4]){box(x-.2,g,z0,x+.2,0,z1,mat('brick',0));box(x-.13,0,z0,x+.13,.5,z1,mat('barrier'));}
  floor(6,z0,16,z1,-1.5,'road',7);for(const x of [6,16])box(x-.13,-1.5,z0,x+.13,-1.1,z1,mat('brick',0));
  for(let z=z0+10;z<z1;z+=TRAM_BAY)for(const x of [6.6,15.4])box(x-.3,g,z-.3,x+.3,-1.5,z+.3,mat('column'));
  // Catenary: masts on the left every 24 with cantilever beams, the wire along x 1.35 at y 6 hung from droppers.
  for(let z=-40;z<z1;z+=TRAM_BAY){box(-3.87,0,z-.07,-3.73,7.2,z+.07,mat('metal'));box(-3.8,7.05,z-.08,2,7.2,z+.08,mat('metal'));box(1.31,6,z-.04,1.39,7.05,z+.04,mat('metal'));}
  quad([1.27,6,z0],[1.43,6,z0],[1.43,6.03,z1],[1.27,6.03,z1],mat('cable'),[0,-1,0]);
  // The service lift Rook dropped from, beside the track where the tram starts: a cage on its shaft rails.
  box(2.9,5.4,18.2,5.3,5.6,21.2,mat('grate'));box(2.9,8.4,18.2,5.3,8.6,21.2,mat('metal'));
  for(const x of [2.95,5.25])for(const z of [18.25,21.15])box(x-.05,5.4,z-.05,x+.05,8.4,z+.05,mat('metal'));
  for(const z of [18.1,21.3])box(5.45,5.4,z-.06,5.57,30,z+.06,mat('metal'));
  // The dark district: windowless tenements with one lit window in ten (set back on the left, where the market will
  // stand under the arch), and the far rows fogged behind them.
  for(let z=-40,i=0;z<z1;z+=20,i++)for(const x of [-22,18]){const h=10+hash(i,x)*6;box(x,g,z,x+8,g+h,z+12,mat('brick',0));if(hash(i,x,5)>.9){const f=x<0?x+8:x;box(f-.06,g+h-4,z+5,f+.06,g+h-3,z+5.9,mat('lamp',2));}}
  const far=surfaces.length;cityRow(-40,z1,20,-44,10);cityRow(-40,z1,20,40,12);tramSunk(far);
 },
 // High and behind, dropping: the lift's descent continued.
 start(){const d=state.distance;return look(.6,6.8,d-14,1.35,3.6,d+20);},
 shot(p){
  const d=state.distance,back=look(2,5.4,d+1,10,-.6,d-24);
  if(p==='tramRide'||p==='tramWatch')return back;
  // Hold on the road for two seconds, then turn forward as the district comes up.
  if(p==='tramSpotted')return tramMix(back,look(.6,4.3,d-4,1.35,2,d+70),smooth(clamp((state.event-2)/4,0,1)));
  if(p==='tramArrive')return look(.3,5,d-3,-8,-1.5,d+21);
  return look(.6,4.3,d-4,1.35,3.6,d+40);
 },
 ease(p){return {tramEntry:5,tramRide:5,tramSpotted:.01,tramArrive:5}[p]||1.1;},
 blocking(p){
  const d=state.distance;
  if(p==='tramArrive'){const u=span(1.5);return{rook:{x:mix(1.5,.55,u),y:3.55,z:d+mix(.7,1.5,u),pose:'reach'},courier:null,others:[]};}
  return{rook:{x:1.5,y:3.55,z:d+.7,pose:p==='tramSpotted'?'watch':'crouch'},courier:null,others:[]};
 },
 geometry(p){
  const d=state.distance,arch=p==='tramArrive'?tramArch():Infinity;
  lamps.length=0;
  // Lamp posts every 24, half a bay from the masts, unlit on the world's grid up to the market's district. From 26 units
  // before the arch the lit posts run on the arch's own grid, so the tram always stops between two of them.
  for(let z=Math.floor((d-60)/TRAM_BAY)*TRAM_BAY+20;z<Math.min(d+110,arch-38);z+=TRAM_BAY)for(const x of [-3.6,3.6])tramPost(x,z,false);
  if(arch<Infinity)for(let z=arch-26;z<d+110;z+=TRAM_BAY)for(const x of [-3.6,3.6])tramPost(x,z,true);
  // The tram under the camera: body, ribbed roof, edge rails on posts, the front rail, the pantograph at the rear, bogies.
  box(.1,.45,d-6,2.65,3.3,d+2,mat('tram',1));box(0,3.3,d-6.1,2.75,3.55,d+2.1,mat('vent'));
  for(const x of [.12,2.63]){box(x-.04,3.95,d-6,x+.04,4.03,d+2,mat('metal'));for(let i=0;i<4;i++){const z=d-5.8+i*1.95;box(x-.06,3.55,z-.06,x+.06,3.98,z+.06,mat('metal'));}}
  box(.08,3.95,d+1.96,2.67,4.03,d+2.04,mat('metal'));box(1.3,3.55,d+1.94,1.4,3.98,d+2.06,mat('metal'));
  box(1.2,3.55,d-5.2,1.5,5.9,d-4.8,mat('metal'));box(.6,5.85,d-5.4,2.1,5.97,d-4.6,mat('metal'));
  for(const z of [d-4.6,d+.6])for(const x of [.7,2.05])box(x-.3,.2,z-.45,x+.3,.7,z+.45,mat('rubber'));
  // The road below: the black division car holds its distance and its headlights go dark early in the ride; ordinary
  // cars far ahead and behind keep their lamps.
  car(11,d-14,0,-1.5,false,{dark:!(p==='tramEntry'||(p==='tramRide'&&state.event<3.5))});
  car(12,d+38,4,-1.5);car(9,d+62,0,-1.5);car(14.2,d-26,0,-1.5);
  if(p==='tramArrive')tramMarket(tramArch());
 },
 labels(p){
  if(p==='tramSpotted'&&state.tail)worldLabel([11,1.15,state.distance-14],'PLATE 41',0);
  if(p==='tramArrive')worldLabel([-5,8.3,tramArch()-4.3],'MARKET ARCH',2);
 },
 exit(){return [1.35,3.6,camera.z+12];},
 preview(){Object.assign(state,{pursuit:'chasing',distance:20,phaseDistance:20});return 'tramEntry';}
});
registerPhases('tram',{
 tramEntry:{kind:'cutscene',title:'04b / THE LAST TRAM',duration:8,next:'tramRide',
  caption:()=>'Rook drops from the service lift onto the last tram; below, lamps 14 to 19 on Bell\'s route stand dark. Rook: "I left Bell on a roof for this."'},
 // With the roof radio still open, Heddy's second line rides the quiet bridge: a witness with a dated book. No field; `radio`
 // and reached('tramRide') carry it into the case file.
 tramRide:{kind:'quiet',title:'ACROSS THE DARK DISTRICT',
  enter:()=>{if(state.radio)addClue('Heddy Lasko keeps a dated log of the red car crossing Lift Bridge Two at the same hour every week. A second witness with paper.');},
  caption:()=>state.radio?'Heddy Lasko of Lift Bridge Two, on the channel: "Red car again, same hour as last week. I write these down." Headlights on the road below go dark.':'The tram crosses the dark district. Behind it, one pair of headlights on the road below keeps pace, then goes dark.',
  buttons:b=>{b('[WATCH THE ROAD / 8s]',()=>enter('tramWatch'));b('[RIDE ON]',()=>enter('tramArrive'));}},
 tramWatch:{kind:'observe',title:'WATCHING THE ROAD',next:'tramSpotted',
  caption:()=>'Rook watches the road. The car with no lights holds its distance. A division plate, black body. It is not dispatch.'},
 tramSpotted:{kind:'quiet',title:'PLATE 41',stinger:()=>['NOTED','hit',1.6],
  enter:()=>{state.tail=true;addClue('A black Night Division car, plate 41, follows the tram with its lights off. Somebody in the division wants to know where Rook goes.');},
  caption:()=>'Plate 41, a Night Division car, is following the tram. Whoever drives it will reach the market first.',
  buttons:b=>{b('[RIDE ON]',()=>enter('tramArrive'));}},
 tramArrive:{kind:'cutscene',title:'MARKET ARCH',duration:5,next:'marketEntry',
  caption:()=>'Market Arch. Stalls under the elevated road, lit by lamps that should be on the lamplighter\'s posts. The tram slows and Rook goes over the rail.'}
});
