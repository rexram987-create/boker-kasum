import './style.css';
import {startMusic,stopMusic,duckMusic} from './music.js';
const canvas=document.querySelector('#scene'),ctx=canvas.getContext('2d'),status=document.querySelector('#status');
let speechTimer=null;
function stopAudio(){clearTimeout(speechTimer);window.speechSynthesis?.cancel();stopMusic()}
function speakGreeting(){if(!('speechSynthesis' in window)){status.textContent='הקראה אינה נתמכת בדפדפן';return}const u=new SpeechSynthesisUtterance('בוקר טוב ויום נפלא');u.lang='he-IL';u.rate=1;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang.toLowerCase().startsWith('he'))||null;u.onstart=()=>duckMusic(true);u.onend=()=>duckMusic(false);u.onerror=()=>duckMusic(false);speechSynthesis.speak(u)}
const W=360,H=640;let playing=false,start=0,elapsed=0,frame=0;
const particles=Array.from({length:105},(_,i)=>({x:(i*97.31)%W,y:(i*61.7)%H,s:2+(i%5),v:14+(i%9)*5,phase:i*1.3,star:i%4===0,hue:[45,325,195,270,35][i%5]}));
function draw(t){ctx.clearRect(0,0,W,H);let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#38295c');sky.addColorStop(.48,'#d77f9d');sky.addColorStop(1,'#ffd48b');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
const sy=375-Math.min(t/15,1)*80;let glow=ctx.createRadialGradient(180,sy,12,180,sy,185);glow.addColorStop(0,'#fff5b9bb');glow.addColorStop(1,'#fff0b900');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.beginPath();ctx.arc(180,sy,55,0,Math.PI*2);ctx.fillStyle='#fff1b0';ctx.fill();
// A colorful flower garden replaces the plain hills.
const ground=ctx.createLinearGradient(0,430,0,H);ground.addColorStop(0,'#80a86c');ground.addColorStop(.5,'#487d59');ground.addColorStop(1,'#214c42');
ctx.fillStyle=ground;ctx.beginPath();ctx.moveTo(0,467);ctx.quadraticCurveTo(120,445,230,466);ctx.quadraticCurveTo(310,448,360,462);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
for(let i=0;i<92;i++){const depth=(i*43%100)/100;const x=(i*89.7+17)%W,y=472+depth*177;const size=2.6+depth*6.7;const sway=Math.sin(t*1.35+i*.73)*(1+depth*2.2);const stem=8+depth*17;const color=['#ff79ad','#ffd85c','#e3b5ff','#fff5e6','#ff9678','#b8dcff'][i%6];
ctx.strokeStyle='#39754d';ctx.lineWidth=1+depth;ctx.beginPath();ctx.moveTo(x,y+stem);ctx.quadraticCurveTo(x+sway*.5,y+stem*.5,x+sway,y);ctx.stroke();
ctx.save();ctx.translate(x+sway,y);ctx.fillStyle=color;for(let petal=0;petal<5;petal++){const a=petal*Math.PI*2/5;ctx.beginPath();ctx.ellipse(Math.cos(a)*size*.6,Math.sin(a)*size*.6,size*.55,size*.39,a,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#ffe8a0';ctx.beginPath();ctx.arc(0,0,size*.32,0,Math.PI*2);ctx.fill();ctx.restore();
}
particles.forEach(p=>{let y=((p.y+t*p.v)% (H+30))-15,x=p.x+Math.sin(t*.8+p.phase)*13;ctx.save();ctx.translate(x,y);ctx.rotate(t*.7+p.phase);ctx.globalAlpha=.65+.3*Math.sin(t*2+p.phase);ctx.fillStyle='hsl('+p.hue+' 95% 78%)';if(p.star){ctx.beginPath();for(let j=0;j<10;j++){let a=j*Math.PI/5,r=j%2?p.s*.48:p.s*1.6;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill()}else ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.8);ctx.restore()});
}
function render(now){if(!playing)return;elapsed=(now-start)/1000;if(elapsed>=15){elapsed=15;playing=false;stopAudio();status.textContent='האנימציה הסתיימה';draw(elapsed);return}draw(elapsed);frame=requestAnimationFrame(render)}
document.querySelector('#play').addEventListener('click',()=>{cancelAnimationFrame(frame);stopAudio();elapsed=0;start=performance.now();playing=true;try{startMusic()}catch(e){status.textContent='המוזיקה אינה זמינה'}speechTimer=setTimeout(speakGreeting,3000);status.textContent='האנימציה פועלת';frame=requestAnimationFrame(render)});
document.querySelector('#pause').addEventListener('click',()=>{playing=false;cancelAnimationFrame(frame);stopAudio();status.textContent='האנימציה נעצרה'});
document.querySelector('#share').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:'בוקר קסום',url:location.href});else{await navigator.clipboard.writeText(location.href);status.textContent='הקישור הועתק'}}catch(e){if(e.name!=='AbortError')status.textContent='לא ניתן לשתף כרגע'}});
draw(0);