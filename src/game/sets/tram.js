// 04b / THE LAST TRAM. A moving set: Rook rides the roof of the last tram across the dark district to Market Arch.
// Lamps 14 to 19 stand dark on their posts; a black division car follows on the road below with its lights off.
const TRAM_ARCH=420;
registerSet('tram',{
 chapter:'04b / THE LAST TRAM',card:'THE LAST TRAM',objective:()=>'CROSS THE DARK',
 description:'The roof of a tram crossing the dark district on its own reserve: unlit lamp posts, black tenements with one lit window in ten, and the elevated road ahead.',
 moving:true,rain:true,speed:p=>p==='tramArrive'?4:21,
 build(){
  floor(-4,-50,4,950,0,'road',7);for(const x of [-4,4])box(x-.13,0,-50,x+.13,.5,950,mat('barrier'));
  for(let z=-40;z<950;z+=24){for(const x of [-3.8,3.8])box(x-.07,0,z-.07,x+.07,6.4,z+.07,mat('metal'));quad([-3.8,6.4,z],[3.8,6.4,z],[3.8,6.43,z+.03],[-3.8,6.43,z+.03],mat('metal'),[0,-1,0]);}
  quad([1.3,6,-50],[1.4,6,-50],[1.4,6.03,950],[1.3,6.03,950],mat('cable'),[0,-1,0]);
  // Lamp posts along the viaduct: dark until the market's district, lit beyond it.
  for(let z=-28;z<950;z+=24){for(const x of [-3.6,3.6]){box(x-.055,.5,z-.055,x+.055,4.6,z+.055,mat('metal'));if(z<TRAM_ARCH-120)box(x-.3,4.2,z-.3,x+.3,4.6,z+.3,mat('metal'));else{box(x-.34,4.15,z-.34,x+.34,4.7,z+.34,mat('lamp',2));lamps.push([x,z]);}}}
  // The road beside the rails, and the dark district: windowless tenements with one lit window in ten.
  floor(6,-50,16,950,-1.5,'express');for(const x of [6,16])box(x-.13,-1.5,-50,x+.13,-.85,950,mat('barrier'));
  for(let z=-40,i=0;z<TRAM_ARCH-20;z+=20,i++){for(const x of [-22,24]){const h=10+hash(i,x)*6;box(x,-6,z,x+8,h-6,z+12,mat('brick',0));if(hash(i,x,5)>.9)box(x+3,h-9,z+5,x+4,h-8,z+5.1,mat('lamp',2));}}
  cityRow(-40,TRAM_ARCH,20,-44,10);cityRow(-40,TRAM_ARCH,20,40,12);
  cityRow(TRAM_ARCH-40,950,20,-44,32);cityRow(TRAM_ARCH-40,950,20,40,34);
  // Market Arch: the elevated road crossing overhead, lamps beneath it, the market beginning beyond, the club's sign.
  box(-40,9,TRAM_ARCH-4,40,10,TRAM_ARCH+6,mat('express'));for(const x of [-12,12])box(x-.6,-6,TRAM_ARCH-2,x+.6,9,TRAM_ARCH+4,mat('column'));
  for(let x=-14;x<=14;x+=4){box(x-.3,8.4,TRAM_ARCH,x+.3,8.8,TRAM_ARCH+.6,mat('lamp',2));lamps.push([x,TRAM_ARCH]);}
  for(const [x,z] of [[-6,TRAM_ARCH+10],[6,TRAM_ARCH+14],[-6,TRAM_ARCH+20],[6,TRAM_ARCH+26]]){box(x-1.2,0,z,x+1.2,2.2,z+2.4,mat('kiosk',1));box(x-1.6,2.2,z-.2,x+1.6,2.45,z+2.6,mat('awning',z%2?2:3));}
  box(-3,5,TRAM_ARCH+40,3,6,TRAM_ARCH+40.4,mat('neon',3));
  for(let i=surfaces.length-1;i>=0;i--){const s=surfaces[i];if(s.mat.kind==='building'||s.mat.kind==='stone'){for(const v of s.v)v[1]-=6;s.mat={...s.mat,baseY:-6};}}
 },
 start(){const d=state.distance;return look(1.35,7.5,d-14,1.35,3.6,d+20);},
 shot(p){
  const d=state.distance;
  if(p==='tramRide'||p==='tramWatch')return look(3.4,4.9,d+1,10,-.6,d-24);
  if(p==='tramSpotted')return state.event<2?look(3.4,4.9,d+1,10,-.6,d-24):look(1.35,4.3,d-4,1.35,2,d+70);
  if(p==='tramArrive')return look(1.35,4,d-2,0,-1.5,d+26);
  return look(1.35,4.3,d-4,1.35,3.6,d+40);
 },
 ease(p){return {tramEntry:5,tramRide:5,tramSpotted:4,tramArrive:5}[p]||1.1;},
 blocking(p){
  const d=state.distance;
  return{rook:{x:1.35,y:3.55,z:d-1,pose:p==='tramSpotted'?'watch':p==='tramArrive'?'reach':'crouch'},courier:null,others:[]};
 },
 geometry(p){
  const d=state.distance;
  box(.1,.45,d-6,2.65,3.3,d+2,mat('tram',1));box(0,3.3,d-6.1,2.75,3.55,d+2.1,mat('metal'));for(const x of [.05,2.65])box(x-.05,3.55,d-6,x+.05,4.05,d+2,mat('metal'));
  box(1.2,3.55,d-3.2,1.5,5.9,d-2.8,mat('metal'));for(const z of [d-5,d+1])for(const x of [.7,2.05])box(x-.3,.2,z-.4,x+.3,.7,z+.4,mat('rubber'));
  car(11,d-14,0,-1.5,false,{dark:true});car(12,d+38,2,-1.5);car(9,d+62,0,-1.5);
 },
 labels(p){
  if(p==='tramSpotted'&&state.tail)worldLabel([11,1.6,state.distance-14],'PLATE 41',0);
  if(p==='tramArrive')worldLabel([0,8.5,TRAM_ARCH-4],'MARKET ARCH',2);
 },
 exit(){return [1.35,3.6,camera.z+12];},
 preview(){Object.assign(state,{pursuit:'chasing',distance:20,phaseDistance:20});return 'tramEntry';}
});
registerPhases('tram',{
 tramEntry:{kind:'cutscene',title:'04b / THE LAST TRAM',duration:8,next:'tramRide',
  caption:()=>'Rook drops from the service lift onto the roof of the last tram. Below, lamps 14 to 19 stand dark on their posts. Dispatch will bring the patrol car round to Market Arch.'},
 tramRide:{kind:'quiet',title:'ACROSS THE DARK DISTRICT',
  caption:()=>'The tram crosses the dark district on its own reserve. Behind it, one pair of headlights keeps the same speed on the road below, then goes dark.',
  buttons:b=>{b('[WATCH THE ROAD / 8s]',()=>enter('tramWatch'));b('[RIDE ON]',()=>enter('tramArrive'));}},
 tramWatch:{kind:'observe',title:'WATCHING THE ROAD',next:'tramSpotted',
  caption:()=>'Rook watches the road. The car with no lights holds its distance. A division plate, black body. It is not dispatch.'},
 tramSpotted:{kind:'quiet',title:'PLATE 41',stinger:()=>['NOTED','hit',1.6],
  enter:()=>{state.tail=true;addClue('A black Night Division car, plate 41, follows the tram with its lights off. Somebody in the division wants to know where Rook goes.');},
  caption:()=>'Plate 41, a Night Division car, and it is following the tram. Whoever is driving it will be in the market before Rook is. He will see them coming.',
  buttons:b=>{b('[RIDE ON]',()=>enter('tramArrive'));}},
 tramArrive:{kind:'cutscene',title:'MARKET ARCH',duration:5,next:'marketEntry',
  caption:()=>'Market Arch. Stalls under the elevated road, lit by lamps that should be on the lamplighter\'s posts. The tram slows and Rook goes over the rail.'}
});
