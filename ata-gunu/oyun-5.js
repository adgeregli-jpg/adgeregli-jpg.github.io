// ===================== güncelleme =====================
function movePlayer(dt){
  P.moving=false;
  if(['brush','tv','sit','ball','sleep','away'].includes(P.mode))return;
  const dz=isDizzy(),sp=(G.vit<30?115:175)*(dz?.55:1);
  let kx=(P.keys.ArrowRight||P.keys.d?1:0)-(P.keys.ArrowLeft||P.keys.a?1:0),ky=(P.keys.ArrowDown||P.keys.s?1:0)-(P.keys.ArrowUp||P.keys.w?1:0);
  let vx=0,vy=0;
  if(kx||ky){P.path=[];P.act=null;const l=Math.hypot(kx,ky);vx=kx/l*sp;vy=ky/l*sp}
  else if(P.path.length){const[tx,ty]=P.path[0],d=Math.hypot(tx-P.x,ty-P.y);
    if(d<Math.max(4,sp*dt*1.2)){if(free(tx,ty)){P.x=tx;P.y=ty}P.path.shift();if(!P.path.length&&P.act){const a=P.act;P.act=null;arrive(a)}return}
    vx=(tx-P.x)/d*sp;vy=(ty-P.y)/d*sp}
  if(!vx&&!vy)return;
  if(dz){const l=Math.hypot(vx,vy)||1,w=Math.sin(G.time*3.1)*sp*.7;vx+=-vy/l*w;vy+=vx/l*w*.6}
  P.moving=true;const nx=P.x+vx*dt,ny=P.y+vy*dt;
  if(free(nx,ny)){P.x=nx;P.y=ny}else if(free(nx,P.y))P.x=nx;else if(free(P.x,ny))P.y=ny;
  else if(P.path.length&&!kx&&!ky){P.path=findPath(P.x,P.y,...P.path[P.path.length-1])}
}
function arrive(a){if(a.trap){if(G.trap===a.trap)acceptTrap();return}act(a.id)}
function goTo(x,y,actn){if(P.mode==='tv')stopTV(false);P.path=findPath(P.x,P.y,x,y);P.act=actn||null;if(!P.path.length&&actn){P.act=null;if(Math.hypot(P.x-x,P.y-y)<40)arrive(actn)}}
function update(dt){
  G.time+=dt;
  for(const f of G.floats)f.age+=dt;G.floats=G.floats.filter(f=>f.age<1.8);
  if(G.paused)return;
  if(G.overlay){G.overlay.t+=dt;if(G.overlay.t>=G.overlay.dur){const f=G.overlay.then;G.overlay=null;f&&f()}return}
  for(const t of [...G.tasks]){if(!t.dur)continue;t.left-=dt;const s=Math.ceil(t.left);
    if(t.left<=5&&s!==t.last&&s>0){t.last=s;SFX.tick()}
    if(t.left<=0){doneTask(t.id);t.onFail&&t.onFail()}}
  if(hasTask('clothes')){G.clothT+=dt;if(G.clothT>10){G.clothAcc+=dt;if(G.clothAcc>=5){G.clothAcc=0;effect('Kıyafetler hâlâ dağınık',{s:-2},300,140)}}}
  if(P.mode==='tv'){G.tvAcc+=dt;if(G.tvAcc>=1.5){G.tvAcc=0;G.brain=clamp(G.brain-1,0,100)}}
  if(G.trap){G.trap.left-=dt;if(G.trap.left<=0)trapTimeout()}
  else if(G.phase==='morning'&&G.morningTrap&&!G.morningTrap.done&&hasTask('brushM')){G.morningTrap.at-=dt;if(G.morningTrap.at<=0){G.morningTrap.done=true;G.trap={type:'bed',x:90,y:100,text:up(N())+', 5 DAKİKA DAHA UYU…',s:[192,110],left:8};banner()}}
  else if((G.phase==='home'||G.phase==='night')&&!['ball','sleep'].includes(P.mode)){G.trapClock+=dt;if(G.trapClock>=G.nextTrap)spawnTrap()}
  if(born()&&(G.phase==='home'||G.phase==='night')&&!hasTask('baby')&&!['ball','sleep'].includes(P.mode)){G.babyClock+=dt;if(G.babyClock>=G.nextCry)babyCry()}
  if(P.dizzy>0)P.dizzy-=dt;
  movePlayer(dt);
  if(P.busy>0){P.busy-=dt;if(P.busy<=0){const f=P.onDone;P.onDone=null;f&&f()}}
  if(P.mode==='ball')updateBall(dt);
}
let lastHud='';
function hud(){
  $('#score').firstChild.nodeValue=G.score;
  $('#vitN').textContent=G.vit;$('#vitF').style.width=G.vit+'%';$('#brN').textContent=G.brain;$('#brF').style.width=G.brain+'%';
  $('#vitS').textContent=G.vit<30?'Halsiz: yavaş yürüyor':'';$('#brS').textContent=isDizzy()?'Sersem: yürürken sendeliyor':'';
}
function actbar(){
  const el=$('#actbar'),want=P.mode==='tv'?'tv':P.mode==='ball'?'ball':'';if(el.dataset.m===want)return;el.dataset.m=want;
  el.innerHTML=want==='tv'?'<button class="main" type="button" id="aTv">TV’yi kapat ve kalk</button>':want==='ball'?'<button class="main" type="button" id="aK">VUR!</button>':'';
  if(want==='tv')$('#aTv').onclick=()=>stopTV(false);if(want==='ball')$('#aK').onclick=kick;
}
let prev=performance.now(),hudT=0;
function loop(now){const dt=Math.min(.05,(now-prev)/1000);prev=now;update(dt);updCam(dt);draw();hudT+=dt;if(hudT>.2){hudT=0;hud();updChips();actbar();if(P.mode==='tv'||G.trap)banner()}requestAnimationFrame(loop)}

// ===================== girdi =====================
function toLogical(e){const r=cv.getBoundingClientRect();return[CAM.x+(e.clientX-r.left)/r.width*W/CAM.z,CAM.y+(e.clientY-r.top)/r.height*H/CAM.z]}
cv.addEventListener('pointerdown',e=>{
  if(G.paused||G.overlay)return;const[x,y]=toLogical(e);
  if(P.mode==='ball'){kick();return}
  if(['brush','sleep','away','sit'].includes(P.mode))return;
  if(G.trap){const tr=G.trap;const hit=tr.type==='bed'?(x>30&&x<180&&y>28&&y<178):Math.hypot(x-tr.x,y-tr.y)<30;
    if(hit){goTo(tr.s[0],tr.s[1],{trap:tr});return}}
  const o=OBJ.find(o=>x>=o.r[0]&&x<=o.r[0]+o.r[2]&&y>=o.r[1]&&y<=o.r[1]+o.r[3]);
  if(o){if(o.id==='tv'&&P.mode==='tv'){stopTV(false);return}goTo(o.s[0],o.s[1],{id:o.id});return}
  goTo(x,y);
});
const KEYMAP={ArrowUp:1,ArrowDown:1,ArrowLeft:1,ArrowRight:1,w:1,a:1,s:1,d:1,W:1,A:1,S:1,D:1};
window.addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input,select,textarea'))return;
  if(!$('#modal').hidden)return;
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(KEYMAP[e.key]){P.keys[k]=true;if(P.mode==='tv')stopTV(false);e.preventDefault()}
  if(e.key===' '||k==='e'||e.key==='Enter'){e.preventDefault();if(G.paused||G.overlay)return;
    if(P.mode==='ball'){kick();return}
    if(G.trap&&Math.hypot(P.x-G.trap.s[0],P.y-G.trap.s[1])<60){acceptTrap();return}
    let best=null,bd=70;for(const o of OBJ){const d=Math.hypot(P.x-o.s[0],P.y-o.s[1]);if(d<bd){bd=d;best=o}}
    if(best&&['idle'].includes(P.mode))act(best.id);else if(P.mode==='tv')stopTV(false)}
});
window.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;P.keys[k]=false});
window.addEventListener('blur',()=>{P.keys={}});
$('#bSet').onclick=()=>{const was=G.phase;famModal(was==='start'?startModal:null)};
$('#bFull').onclick=()=>{
  if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();return}
  const el=document.documentElement;
  try{const p=el.requestFullscreen&&el.requestFullscreen();if(p&&p.catch)p.catch(()=>{$('#bFull').textContent='Tam ekran açılamadı'})}catch(e){}
};
document.addEventListener('fullscreenchange',()=>{$('#bFull').textContent=document.fullscreenElement?'Tam ekrandan çık':'Tam ekran';setTimeout(fit,50)});
$('#bZoom').onclick=()=>{zoomOn=!zoomOn;store.set('atagunu.zoom',zoomOn);zoomLabel()};
$('#bSnd').onclick=()=>{muted=!muted;$('#bSnd').textContent='Ses: '+(muted?'kapalı':'açık');$('#bSnd').setAttribute('aria-pressed',!muted)};

// ===================== açılış =====================
function boot(data){
  if(data&&data.day){G.day=data.day;G.score=data.score||0;G.vit=data.vit??70;G.brain=data.brain??70}
  fit();updCam(0,true);zoomLabel();hud();renderTasks();
  startModal();requestAnimationFrame(loop);
}
try{window.claude?.hot?.snapshot?.(()=>({day:G.day,score:G.score,vit:G.vit,brain:G.brain}))}catch(e){}
if(window.claude?.hot?.ready)window.claude.hot.ready(boot);else boot(window.claude?.hot?.data??{});
