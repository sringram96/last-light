// Additional surface types; original street shaders are retained verbatim.
if(kind==='dispatch'){hue=6;lum=.95;g=mat.roof?'=':fract(y*9)<.16?'-':'.';}
else if(kind==='hatch'){hue=0;lum=.18;g=fract(x*5)<.09?'|':'.';}
else if(kind==='tiles'){
 const a=Math.floor(x*.8),b=Math.floor(z*.8);hue=(a+b)%2?0:2;lum=(a+b)%2?.36:.64;g=fract(x*.8)<.05||fract(z*.8)<.05?'+':grain>.65?':':'.';
 if(Math.abs(x)<2.5){hue=2;lum=.65;g=fract(z*2)<.12?'=':':';}
}
else if(kind==='wall'||kind==='brick'){
 hue=kind==='wall'?2:0;lum=.37+grain*.15;g=fract(y*2)<.10?'-':fract(x*.8+z*.8+Math.floor(y*2)*.5)<.055?'|':grain>.6?':':'.';
 if(kind==='wall'&&y>3&&y<9){const u=fract((Math.abs(n[0])>.5?z:x)/6);if(u>.2&&u<.8){hue=4;lum=.48;g=u<.23||u>.77?'|':fract(y*2)<.06?'=':'+';}}
 if(kind==='wall'&&(y<.25||Math.abs(y-2.7)<.1||Math.abs(y-10.2)<.13)){hue=2;lum=.9;g='=';}
}
else if(kind==='column'){hue=0;lum=.55+grain*.12;g=fract((x+z)*8)<.2?'|':':';}
else if(kind==='ceiling'){hue=4;lum=.3;g=fract(x*.8)<.07?'|':fract(z*.5)<.1?'=':'.';}
else if(kind==='water'){
 const r=Math.sin(x*2+z*.6+state.t*1.2)+Math.sin(z*3-x*.6-state.t*.8);hue=1;lum=.22+Math.max(0,r)*.23;g=r>1.1?'=':r>.2?'-':'.';
 if(Math.abs(x)<2&&kind==='water'){hue=2;lum+=.15;}
}
else if(kind==='tank'){lum=.45+grain*.15;g=Math.abs(n[1])>.5?'=':fract(y*2)<.07?'=':fract((x+z)*2)<.05?'|':':';if(Math.abs(y-2.1)<.16){hue=2;lum=.9;g='=';}}
else if(kind==='pipe'){hue=2;lum=.65;g=fract(z*.8)<.12?'#':'=';}
else if(kind==='grate'){hue=0;lum=.6;g=fract(x*4)<.3||fract(z*4)<.25?'+':'.';}
else if(kind==='console'){hue=1;lum=.5;g=':';if(!mat.roof&&y>1.35){hue=2;lum=1;g=fract(x*7)<.25?'|':'=';}}
else if(kind==='poster'){hue=2;lum=.75;g=fract(y*4)<.32?'=':'.';}
else if(kind==='roof'){hue=0;lum=.44;g=fract(x*.8)<.025||fract(z*.8)<.03?'=':grain>.65?':':'.';}
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
else
