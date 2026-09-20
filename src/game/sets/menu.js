// THE MENU. An idle tableau behind the title: Rook on a rooftop ledge with a cigarette, the city at his back.
// It is not a story set: it has one phase, `menuIdle`, which never advances, never checkpoints and never shows
// a card. The story's clock (`state.t`) runs while the menu is open, so the picture drifts, flickers and flies.
//
// Placeholder picture: a ledge, a parapet, a skyline of lit towers and a red sign. The level artist replaces the
// contents of registerSet('menu', ...) with the designed tableau; the phase block and the wiring stay.
registerSet('menu',{
 chapter:'NIGHT DIVISION',objective:()=>'THE LAST LIGHT',
 description:'A rooftop ledge over a rain-soaked city of lit towers, neon signs and flying traffic; Detective Rook stands at the parapet with a cigarette.',
 build(){
  floor(-30,-10,30,30,0,'roof',0);
  box(-30,0,6,30,1.1,6.6,mat('stone'));
  for(let i=0;i<9;i++){const x=-40+i*10;building(x,24+hash(i,5)*20,8,9,26+hash(i,7)*30,i%2?4:1,i*13+3);}
  cityRow(60,200,18,-34,30);cityRow(60,200,18,26,34);
  box(-6,14,40,6,17,40.4,mat('neon',3));
  lamps.push([2,3]);
 },
 start(){return look(-2.6,2.2,-2,1.5,6,40);},
 shot(){const t=state.t;return look(-2.6+Math.sin(t*.05)*.6,2.2,-2,1.5+Math.sin(t*.03)*2,6,40);},
 ease(){return 1;},
 blocking(){return{rook:{x:1.4,z:4.2,pose:'smoke',lean:0},others:[]};},
 geometry(){},
 labels(){},
 exit(){return[0,2,40];},
 preview(){return 'menuIdle';},
});
registerPhases('menu',{
 menuIdle:{kind:'quiet',title:'',caption:()=>'',buttons:()=>{}},
});
