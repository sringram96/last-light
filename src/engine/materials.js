// Additional surface types; original street shaders are retained verbatim.
if(kind==='dispatch'){hue=6;lum=.95;g=mat.roof?'=':fract(y*9)<.16?'-':'.';}
else if(kind==='hatch'){hue=0;lum=.18;g=fract(x*5)<.09?'|':'.';}
else if(kind==='tiles'){
 const a=Math.floor(x*.8),b=Math.floor(z*.8);hue=(a+b)%2?0:2;lum=(a+b)%2?.36:.64;g=fract(x*.8)<.05||fract(z*.8)<.05?'+':grain>.65?':':'.';
 if(Math.abs(x)<2.5){hue=2;lum=.65;g=fract(z*2)<.12?'=':':';}
 for(let i=0;i<lamps.length;i++){const l=lamps[i],d=(x-l[0])**2+(z-l[1])**2;if(d<22){const a2=(1-d/22);if(a2>.25){hue=2;lum=Math.max(lum,.3+a2*.55);if(grain>.6)g='=';}}}
}
else if(kind==='wall'||kind==='brick'){
 hue=kind==='wall'?2:(mat.hue||0);lum=(kind==='brick'&&!mat.hue?.43:.37)+grain*.15;g=fract(y*2)<.10?'-':fract(x*.8+z*.8+Math.floor(y*2)*.5)<.055?'|':grain>.6?':':'.';
 if(kind==='wall'&&y>3&&y<9){const u=fract((Math.abs(n[0])>.5?z:x)/6);if(u>.2&&u<.8){hue=4;lum=.48;g=u<.23||u>.77?'|':fract(y*2)<.06?'=':'+';}}
 if(kind==='wall'&&(y<.25||Math.abs(y-2.7)<.1||Math.abs(y-10.2)<.13)){hue=2;lum=.9;g='=';}
}
else if(kind==='column'){hue=0;lum=.55+grain*.12;g=fract((x+z)*8)<.2?'|':':';}
else if(kind==='ceiling'){hue=4;lum=.3;g=fract(x*.8)<.07?'|':fract(z*.5)<.1?'=':'.';}
else if(kind==='water'){
 const r=Math.sin(x*2+z*.6+state.t*1.2)+Math.sin(z*3-x*.6-state.t*.8);hue=1;lum=.22+Math.max(0,r)*.23+(state.dawn||0)*.2;g=r>1.1?'=':r>.2?'-':'.';
 if(Math.abs(x)<2&&kind==='water'){hue=2;lum+=.15;}
 for(let i=0;i<lamps.length;i++){const l=lamps[i],d=(x-l[0])**2+(z-l[1])**2;if(d<22){const a2=(1-d/22);if(a2>.25){hue=2;lum=Math.max(lum,.28+a2*.5);if(r>.2)g='=';}}}
}
else if(kind==='tank'){lum=.45+grain*.15;g=Math.abs(n[1])>.5?'=':fract(y*2)<.07?'=':fract((x+z)*2)<.05?'|':':';if(Math.abs(y-2.1)<.16){hue=2;lum=.9;g='=';}}
else if(kind==='pipe'){hue=2;lum=.65;g=fract(z*.8)<.12?'#':'=';}
else if(kind==='grate'){hue=0;lum=.6;g=fract(x*4)<.3||fract(z*4)<.25?'+':'.';}
else if(kind==='console'){hue=1;lum=.5;g=':';if(!mat.roof&&y>1.35){hue=2;lum=1;g=fract(x*7)<.25?'|':'=';}}
else if(kind==='poster'){hue=2;lum=.75;g=fract(y*4)<.32?'=':'.';}
else if(kind==='roof'){hue=0;lum=.44;g=fract(x*.8)<.025||fract(z*.8)<.03?'=':grain>.65?':':'.';for(let i=0;i<lamps.length;i++){const l=lamps[i],d=(x-l[0])**2+(z-l[1])**2;if(d<22){const a2=(1-d/22);if(a2>.25){hue=2;lum=Math.max(lum,.3+a2*.55);if(grain>.6)g='=';}}}}
else if(kind==='vent'){hue=0;lum=.58;g=fract(y*7)<.48?'=':'.';if(mat.roof){g=fract(x*5)<.3?'|':'-';}}
else if(kind==='express'){
 hue=7;lum=.34+grain*.12;g=grain>.6?':':'.';
 if(Math.abs(x)<.09&&fract(z*.12)<.5||Math.abs(Math.abs(x)-5.7)<.08){hue=2;lum=1;g='|';}
 if(Math.abs(x)>5.9){hue=0;lum=.64;g='=';}
 const r=Math.sin(x*3+z*.07);if(r>.6&&Math.abs(x)>3){hue=x<0?1:3;lum=.6;g='-';}
}
else if(kind==='barrier'){hue=Math.floor(z*.7+x*.4)%2?2:0;lum=.8;g=fract(y*6)<.3?'=':'#';}
else if(kind==='highway-sign'){hue=1;lum=.85;g=fract(x*.6)<.25?'>':'=';}
else if(kind==='car'){lum=.64+grain*.14;g=mat.roof?'=':fract(y*6)<.14?'=':grain>.5?'+':':';}
else if(kind==='glass'){lum=.35;g=mat.roof?'=':fract((x+z)*1.5)<.06?'|':'/';}
else if(kind==='tail'){hue=3;lum=1.3;g='#';}
else if(kind==='gap'){hue=4;lum=.13;g='.';}
// Interiors and the undercity. Floors that carry lamps use the same pool lighting as the street.
else if(kind==='plank'||kind==='carpet'||kind==='drain'){
 if(kind==='plank'){hue=2;lum=.4+grain*.14;g=fract(z*1.6)<.1?'-':fract(x*.9)<.07?'|':grain>.7?':':'.';}
 else if(kind==='carpet'){hue=3;lum=.28+grain*.1;g=grain>.8?'+':grain>.5?':':'.';if(Math.abs(x)<1.2&&z<16){hue=2;lum=.4;g=fract(z*2)<.15?'=':':';}}
 else{hue=7;lum=.3+grain*.12;g=grain>.6?':':'.';if(Math.abs(x)<.08){hue=0;lum=.55;g='|';}if(fract(z*.08)<.02){lum=.5;g='=';}if(Math.abs(x)>4.2&&fract(x*3)<.3){hue=5;lum=.4;g='~';}}
 for(let i=0;i<lamps.length;i++){const l=lamps[i],d=(x-l[0])**2+(z-l[1])**2;if(d<22){const a=(1-d/22);if(a>.25){hue=2;lum=Math.max(lum,.3+a*.55);if(grain>.6)g='=';}}}
}
else if(kind==='blind'){hue=4;lum=fract(y*4)<.45?.9:.25;g=fract(y*4)<.45?'=':'-';}
else if(kind==='board'){hue=2;lum=.4;g='.';const c=hash(Math.floor(z*1.6),Math.floor(y*2.2));if(c>.55){hue=6;lum=.75;g=fract(y*2.2)<.3?'-':'=';}if(fract(z*1.6)<.06&&c>.55){hue=3;lum=.9;g='+';}}
else if(kind==='paper'){hue=6;lum=mat.roof?.95:.7;g=mat.roof?(fract(z*7)<.4?'-':' '):'=';if(g===' ')g='.';}
else if(kind==='screen'){hue=1;lum=.5+.4*(fract(y*6-state.t*.4)<.5?1:0);g=fract(y*6-state.t*.4)<.5?'=':'-';if(mat.roof){lum=.4;g='=';}}
else if(kind==='neon'){const on=hash(Math.floor(state.t*6),mat.hue)>.08;hue=mat.hue;lum=on?1.45:.4;g=on?(mat.roof?'=':'#'):'-';}
else if(kind==='velvet'){hue=3;lum=.28+(fract(x*.9+z*.9)<.5?.16:0)+grain*.06;g=fract((x+z)*.9)<.12?'|':grain>.6?':':'.';if(y<.4){hue=2;lum=.6;g='=';}}
else if(kind==='sewer'){hue=5;lum=.46+grain*.14;g=fract(y*1.5)<.12?'-':fract(z*.6+Math.floor(y*1.5)*.5)<.06?'|':grain>.86?'~':grain>.5?':':'.';if(y>5.6){lum=.3;g=grain>.5?':':'.';}}
// Substation Nine: battery racks. Shelves, dividers, and cell faces lit (charged) or dark (drained) by hash.
else if(kind==='cell'){
 const along=Math.abs(n[0])>.5?z:x,shelf=Math.floor(y/.9),bay=Math.floor(along/.6);
 if(fract(y/.9)<.1){hue=0;lum=.7;g='=';}
 else if(fract(along/.6)<.1){hue=0;lum=.5;g='|';}
 else if(mat.roof){hue=0;lum=.45;g='=';}
 else{const charged=hash(shelf,bay,mat.seed||9)>.35;hue=charged?2:4;lum=charged?1:.25;g=charged?(fract(y/.9)>.78?'-':'#'):':';if(charged&&fract(y/.9)>.78){hue=1;lum=.8;}}
}
// Dawn: a sky quad driven by state.dawn (0 night, 1 gold). Used only where the story says the sky brightens.
else if(kind==='dawn'){const u=state.dawn||0;if(u<.3){hue=4;lum=.12+u;g='.';}else if(u<.6){hue=4;lum=.45;g=':';}else if(u<.85){hue=6;lum=.75;g='=';}else{hue=2;lum=1;g='#';}}
// Bell's route map: streets as a grid, lamps as dots, and six lamps crossed out in red.
else if(kind==='map'){
 const along=Math.abs(n[0])>.5?z:x;hue=6;lum=.55;g='.';
 if(fract(along*2)<.12){lum=.6;g='-';}if(fract(y*2.85)<.12){lum=.6;g='|';}
 const cx=Math.floor(along*2),cy=Math.floor(y*2.85);
 if(fract(along*2)<.25&&fract(y*2.85)<.3&&hash(cx,cy,mat.seed||3)>.75){hue=2;lum=1;g='@';}
 if(mat.cross&&along>mat.cross[0]&&along<mat.cross[1]&&y>mat.cross[2]&&y<mat.cross[3]&&fract(along*2)<.3&&fract(y*2.85)<.35){hue=3;lum=1.1;g='x';}
}
// An electrical arc: bright, flickering, white to cyan.
else if(kind==='arc'){const on=hash(Math.floor(state.t*14),Math.floor(x*3),Math.floor(y*3))>.35;hue=on?6:1;lum=on?1.5:.9;g=on?'#':'%';}
// A video billboard: a quad whose picture cycles through the material's frames on the story clock. mat carries the
// face's frame: origin (x0,y0,z0), the unit direction (ux,uz) and length w of its bottom edge, its height h, and
// frames, each {rows:[...28-glyph strings...],ink:{glyph:[hue,lum]}} or {bands:true,hue} (a sweep of scan bands).
// A bright border, a scanline rolling down the picture, and the dark cells of a frame are the material's own.
else if(kind==='video'){
 const u=((x-mat.x0)*mat.ux+(z-mat.z0)*mat.uz)/mat.w,v=(y-mat.y0)/mat.h,F=mat.frames,f=F[Math.floor(state.t/(mat.period||2.6))%F.length];
 if(u<.04||u>.96||v<.075||v>.925){hue=6;lum=1.15;g='#';}
 else if(f.bands){const b=fract(v*3-state.t*.6);hue=f.hue;lum=.35+.9*Math.max(0,1-Math.abs(b-.5)*3);g=b>.3&&b<.7?'=':'-';}
 else{const R=f.rows,row=R[clamp(Math.floor((1-v)*R.length),0,R.length-1)],c=row[clamp(Math.floor(u*row.length),0,row.length-1)],ink=f.ink[c];if(ink){hue=ink[0];lum=ink[1];g=c;}else{hue=4;lum=.16;g='.';}}
 if(fract(v*1.5-state.t*.4)<.06)lum*=.45;
}
// A neon sign board: stacked clusters of ASCII strokes on a dark board that read as ideograms at a distance (the grid
// is single-width printable ASCII, so real characters cannot be drawn). Glyphs sit on the faces whose normal runs
// along z; mat carries x0/y0 (the board's lower-left on that face), cell (a glyph cell's width; a cluster is 5 by 5
// cells in the screen's aspect), pad, count, seed, glyphs (the pattern table) and flicker (the neon rule).
else if(kind==='ideogram'){
 const on=!mat.flicker||hash(Math.floor(state.t*6),mat.hue+7)>.08;
 hue=mat.hue;lum=.12;g='.';
 if(!mat.roof&&Math.abs(n[2])>.5){
  const gw=mat.cell,gh=gw*1.72,pitch=gh*6.5,u=x-mat.x0-mat.pad,v=y-mat.y0-gh*.75,gi=Math.floor(v/pitch),cy=Math.floor((v-gi*pitch)/gh),cx=Math.floor(u/gw);
  if(gi>=0&&gi<mat.count&&cx>=0&&cx<5&&cy>=0&&cy<5){const P=mat.glyphs,c=P[Math.floor(hash(gi,mat.seed)*P.length)][4-cy][cx];if(c!==' '){lum=on?1.4:.3;g=on?c:'-';}}
 }
}
else
