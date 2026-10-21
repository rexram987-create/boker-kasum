import './style.css';
const canvas=document.querySelector('#scene'),ctx=canvas.getContext('2d'),status=document.querySelector('#status');
const W=360,H=640;let playing=false,start=0,elapsed=0,frame=0;
const particles=Array.from({length:105},(_,i)=>({x:(i*97.31)%W,y:(i*61.7)%H,s:2+(i%5),v:14+(i%9)*5,phase:i*1.3,star:i%4===0,hue:[45,325,195,270,35][i%5]}));
function draw(t){ctx.clearRect(0,0,W,H);let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#38295c');sky.addColorStop(.48,'#d77f9d');sky.addColorStop(1,'#ffd48b');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
const sy=375-Math.min(t/15,1)*80;let glow=ctx.createRadialGradient(180,sy,12,180,sy,185);glow.addColorStop(0,'#fff5b9bb');glow.addColorStop(1,'#fff0b900');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);ctx.beginPath();ctx.arc(180,sy,55,0,Math.PI*2);ctx.fillStyle='#fff1b0';ctx.fill();
ctx.fillStyle='#59745e';ctx.beginPath();ctx.moveTo(0,460);ctx.quadraticCurveTo(85,405,190,466);ctx.quadraticCurveTo(280,418,360,465);ctx.lineTo(360,H);ctx.lineTo(0,H);ctx.fill();ctx.fillStyle='#345a54';ctx.beginPath();ctx.moveTo(0,520);ctx.quadraticCurveTo(140,440,360,520);ctx.lineTo(360,H);ctx.lineTo(0,H);ctx.fill();
particles.forEach(p=>{let y=((p.y+t*p.v)% (H+30))-15,x=p.x+Math.sin(t*.8+p.phase)*13;ctx.save();ctx.translate(x,y);ctx.rotate(t*.7+p.phase);ctx.globalAlpha=.65+.3*Math.sin(t*2+p.phase);ctx.fillStyle='hsl('+p.hue+' 95% 78%)';if(p.star){ctx.beginPath();for(let j=0;j<10;j++){let a=j*Math.PI/5,r=j%2?p.s*.48:p.s*1.6;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill()}else ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.8);ctx.restore()});
}
function render(now){if(!playing)return;elapsed=(now-start)/1000;if(elapsed>=15){elapsed=15;playing=false;status.textContent='האנימציה הסתיימה';draw(elapsed);return}draw(elapsed);frame=requestAnimationFrame(render)}
document.querySelector('#play').addEventListener('click',()=>{cancelAnimationFrame(frame);elapsed=0;start=performance.now();playing=true;status.textContent='האנימציה פועלת';frame=requestAnimationFrame(render)});
document.querySelector('#pause').addEventListener('click',()=>{playing=false;cancelAnimationFrame(frame);status.textContent='האנימציה נעצרה'});
document.querySelector('#share').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:'בוקר קסום',url:location.href});else{await navigator.clipboard.writeText(location.href);status.textContent='הקישור הועתק'}}catch(e){if(e.name!=='AbortError')status.textContent='לא ניתן לשתף כרגע'}});
draw(0);