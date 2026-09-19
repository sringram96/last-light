// Optional synthesized cues. There are no audio files; short tones come from oscillators when sound is switched on.
let audioContext=null,lastTickSecond=0;
function audioReady(){
 if(!state.sound)return null;
 const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return null;
 if(!audioContext){try{audioContext=new Context();}catch(e){return null;}}
 if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
 return audioContext;
}
function tone(ctx,frequency,start,length,type='square',volume=.04){
 const o=ctx.createOscillator(),g=ctx.createGain(),at=ctx.currentTime+start;
 o.type=type;o.frequency.value=frequency;
 g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+length);
 o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+length+.05);
}
const cues={
 danger:c=>{tone(c,110,0,.18,'sawtooth',.05);tone(c,110,.28,.18,'sawtooth',.05);},
 tick:c=>tone(c,1320,0,.05,'square',.025),
 hit:c=>{tone(c,660,0,.09);tone(c,880,.1,.09);tone(c,1320,.2,.22,'triangle',.05);},
 miss:c=>{tone(c,220,0,.25,'sawtooth',.05);tone(c,150,.2,.45,'sawtooth',.05);},
 chapter:c=>{tone(c,440,0,.45,'triangle',.035);tone(c,660,.06,.6,'sine',.03);},
 clue:c=>{tone(c,988,0,.06,'square',.03);tone(c,1319,.08,.1,'square',.03);}
};
function cue(name){const ctx=audioReady();if(ctx&&cues[name])cues[name](ctx);}
// Countdown ticks for the final seconds of a timed prompt; each second sounds once.
function tickCue(secondsLeft){
 const second=Math.ceil(secondsLeft);
 if(secondsLeft>3||second===lastTickSecond)return;
 lastTickSecond=second;cue('tick');
}
