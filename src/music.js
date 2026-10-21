// Original cheerful 15-second morning theme, generated locally using Web Audio.
let ctx=null, master=null, sources=[];
const BEAT=60/124;
const tune=[
 [0,0],[.5,4],[1,7],[1.5,12],[2,9],[2.5,7],[3,4],[3.5,7],
 [4,9],[4.5,12],[5,14],[5.5,12],[6,9],[6.5,7],[7,5],[7.5,4],
 [8,7],[8.5,11],[9,14],[9.5,19],[10,16],[10.5,14],[11,12],[11.5,9],
 [12,7],[12.5,9],[13,12],[13.5,16],[14,12],[14.5,12]
];
function tone(freq,at,duration,volume,type='sine',decay=.3){
 if(!ctx||!master)return;
 const osc=ctx.createOscillator(),env=ctx.createGain();
 osc.type=type;osc.frequency.setValueAtTime(freq,at);
 env.gain.setValueAtTime(.0001,at);
 env.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.012);
 env.gain.exponentialRampToValueAtTime(.0001,at+duration);
 osc.connect(env).connect(master);osc.start(at);osc.stop(at+duration+.01);sources.push(osc);
}
function note(n,at,dur=.27,vol=.13){
 const f=523.25*Math.pow(2,n/12);
 tone(f,at,dur,vol,'sine');
 tone(f*2,at,dur*.65,vol*.23,'triangle');
}
export function startMusic(recordDestination=null){
 stopMusic();
 const AC=window.AudioContext||window.webkitAudio;
 const AudioClass=window.AudioContext||window.webkitAudioContext;
 if(!AudioClass)return false;
 ctx=new AudioClass();ctx.resume().catch(()=>{});
 master=ctx.createGain();master.gain.value=.72;master.connect(ctx.destination);if(recordDestination){const output=ctx.createMediaStreamDestination();master.connect(output);recordDestination(output.stream)}
 const start=ctx.currentTime+.05;
 tune.forEach(([beat,n],i)=>note(n,start+beat*BEAT, i%4===3?.38:.25, .12));
 // A buoyant waltz-like accompaniment and soft ticking percussion.
 const chords=[[0,4,7],[5,9,12],[7,11,14],[0,4,7]];
 for(let bar=0;bar<8;bar++){
   const chord=chords[bar%4],base=start+bar*4*BEAT;
   tone(130.81*Math.pow(2,chord[0]/12),base,.45,.11,'triangle');
   for(let beat=1;beat<4;beat++){
     const at=base+beat*BEAT;
     chord.forEach(n=>tone(261.63*Math.pow(2,n/12),at,.19,.018,'triangle'));
   }
 }
 // Tiny bell flourishes between phrases.
 [3.75,7.75,11.75,14.25].forEach((beat,i)=>[12,16,19].forEach((n,j)=>note(n,start+(beat+j*.12)*BEAT,.17,.04)));
 // Fade gently before the 15-second end.
 master.gain.setValueAtTime(.72,start+13.8);
 master.gain.linearRampToValueAtTime(0,start+14.9);
 return true;
}
export function duckMusic(on){
 if(master&&ctx){
   const now=ctx.currentTime;
   master.gain.cancelScheduledValues(now);
   master.gain.setTargetAtTime(on?.18:.72,now,.09);
 }
}
export function stopMusic(){
 for(const s of sources){try{s.stop()}catch{}}
 sources=[];
 if(ctx){const old=ctx;ctx=null;old.close().catch(()=>{})}
 master=null;
}
