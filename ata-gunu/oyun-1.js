// ===================== yardımcılar =====================
const $=s=>document.querySelector(s);
const W=1000,H=620;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const up=s=>s.toLocaleUpperCase('tr-TR');
function gen(n){ // Türkçe iyelik: Ata'nın, Gökhan'ın, Mehmet'in
  const v='aeıioöuü',m={a:'ı',ı:'ı',e:'i',i:'i',o:'u',u:'u',ö:'ü',ü:'ü'};
  const low=n.toLocaleLowerCase('tr-TR');let lv='a';
  for(const ch of low) if(v.includes(ch)) lv=ch;
  const x=m[lv]; return n+"'"+(v.includes(low.slice(-1))?'n':'')+x+'n';
}
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// ===================== aile ayarları =====================
const DEFAULT={
  child:{name:'Ata',skin:'#f1c7a0',hair:'#3b2a1e',style:'short',shirt:'#7a1f33',pants:'#24589e',glasses:false,beard:false},
  mom:{name:'Damla',skin:'#f1c7a0',hair:'#5a3a24',style:'long',shirt:'#c8507a',pants:'#3b4a5a',glasses:false,beard:false,pregnant:true},
  dad:{name:'Gökhan',skin:'#e8b98f',hair:'#2a211b',style:'short',shirt:'#3f7d5c',pants:'#34495e',glasses:true,beard:true},
  baby:{name:'Bebek',sex:'kiz'},
};
let S=JSON.parse(JSON.stringify(DEFAULT));
const saved=store.get('atagunu.settings');
if(saved) for(const r of ['child','mom','dad','baby']) Object.assign(S[r],saved[r]||{});
const N=()=>S.child.name||'Ata', MOM=()=>S.mom.name||'Anne', DAD=()=>S.dad.name||'Baba', BABY=()=>S.baby.name||'Bebek';
const BIRTH_DAY=3; // kardeş bu günün sabahında evde
const born=()=>S.mom.pregnant&&G.day>=BIRTH_DAY;
const babyCol=()=>S.baby.sex==='erkek'?'#9cc3ef':'#f3a6bf';

// ===================== ses (Web Audio sentezi) =====================
let AC=null,muted=false;
function tone(f,d,type='triangle',v=.12,when=0){
  if(muted)return; try{
    if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();
    const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
    o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);
  }catch(e){}
}
const SFX={
  good(){tone(660,.1);tone(990,.16,'triangle',.1,.09)},
  bad(){tone(320,.14,'sawtooth',.05);tone(210,.22,'sawtooth',.05,.12)},
  tick(){tone(1500,.03,'square',.025)},
  kick(){tone(130,.12,'sine',.3)},
  eat(){tone(520,.05,'square',.03);tone(440,.05,'square',.03,.08)},
  brush(){for(let i=0;i<6;i++)tone(2400+i*40,.03,'square',.012,i*.12)},
  tv(){tone(880,.05,'square',.03);tone(1320,.05,'square',.03,.06)},
  door(){tone(420,.08);tone(520,.08,'triangle',.1,.1);tone(620,.12,'triangle',.1,.2)},
  snore(){tone(110,.4,'sine',.08)},
};

// ===================== ev geometrisi =====================
const T=12;
const WALLS=[[10,10,980,T],[10,598,980,T],[10,10,T,600],[978,10,T,470],[978,560,T,50],
  [10,294,160,T],[240,294,230,T],[530,294,250,T],[850,294,140,T],
  [394,10,T,290],[594,10,T,290],[654,306,T,114],[654,500,T,110]];
const ROOMS=[
  {n:'YATAK ODASI',r:[22,22,372,272],k:'bed'},{n:'BANYO',r:[406,22,188,272],k:'bath'},
  {n:'MUTFAK',r:[606,22,372,272],k:'kit'},{n:'SALON',r:[22,306,632,292],k:'sal'},
  {n:'HOL · OYUN ALANI',r:[666,306,312,292],k:'hall'}];
const F={
  bed:{x:30,y:28,w:110,h:150,b:1}, night:{x:146,y:64,w:30,h:28,b:1}, ward:{x:236,y:22,w:146,h:50,b:1},
  desk:{x:22,y:180,w:60,h:100,b:1}, sink:{x:468,y:22,w:74,h:38,b:1}, tub:{x:410,y:150,w:58,h:136,b:1},
  wc:{x:548,y:214,w:38,h:46,b:1}, counter:{x:606,y:22,w:300,h:44,b:1}, fridge:{x:914,y:22,w:62,h:86,b:1},
  ktable:{x:720,y:128,w:140,h:78,b:1}, shelf:{x:270,y:306,w:170,h:26,b:1}, arm:{x:40,y:418,w:80,h:72,b:1},
  sofa:{x:230,y:428,w:180,h:58,b:0}, ctable:{x:282,y:500,w:76,h:34,b:0}, tvs:{x:250,y:566,w:140,h:32,b:1},
  plant:{x:600,y:540,w:44,h:44,b:1}, crib:{x:40,y:318,w:84,h:56,b:1}, shoes:{x:926,y:566,w:48,h:30,b:1}, dadb:{x:866,y:398,w:38,h:30,b:1},
};
// tıklanabilir nesneler: tıklama alanı + durulacak nokta
const OBJ=[
  {id:'bed',ad:'Yatak',r:[30,28,150,150],s:[192,110]},
  {id:'ward',ad:'Dolap',r:[236,18,146,62],s:[310,100]},
  {id:'desk',ad:'Ders masası',r:[22,180,100,100],s:[112,232]},
  {id:'sink',ad:'Lavabo',r:[462,18,86,58],s:[505,92]},
  {id:'table',ad:'Mutfak masası',r:[706,118,168,104],s:[790,236]},
  {id:'remote',ad:'Kumanda',r:[300,500,44,34],s:[320,470]},
  {id:'tv',ad:'Televizyon',r:[230,420,180,76],s:[320,470]},
  {id:'tv',ad:'Televizyon',r:[250,560,140,40],s:[320,470]},
  {id:'mom',ad:'Anne',r:[40,410,90,104],s:[150,490]},
  {id:'dad',ad:'Baba',r:[850,350,64,84],s:[798,478]},
  {id:'door',ad:'Kapı',r:[940,470,50,96],s:[948,520]},
  {id:'crib',ad:'Beşik',r:[36,312,94,70],s:[150,360]},
  {id:'shelf',ad:'Kitaplık',r:[270,304,170,34],s:[355,356]},
];
const TARGET={baby:'crib',brushM:'sink',brushN:'sink',dress:'ward',clothes:'ward',school:'door',lesson:'desk',sleep:'bed'};

// ----- yol bulma ızgarası -----
const CELL=10,GW=100,GH=62,grid=new Uint8Array(GW*GH);
(function(){
  const R=9,blk=WALLS.map(w=>({x:w[0],y:w[1],w:w[2],h:w[3]})).concat(Object.values(F).filter(f=>f.b));
  for(let cy=0;cy<GH;cy++)for(let cx=0;cx<GW;cx++){
    const px=cx*CELL+5,py=cy*CELL+5;let b=px<22||py<22||px>978||py>598;
    if(!b)for(const r of blk) if(px>r.x-R&&px<r.x+r.w+R&&py>r.y-R&&py<r.y+r.h+R){b=true;break}
    grid[cy*GW+cx]=b?1:0;
  }
})();
const cidx=(x,y)=>{const cx=Math.floor(x/CELL),cy=Math.floor(y/CELL);return cx<0||cy<0||cx>=GW||cy>=GH?-1:cy*GW+cx};
const free=(x,y)=>{const i=cidx(x,y);return i>=0&&!grid[i]};
function nearestFree(i){
  if(i<0)return -1; if(!grid[i])return i;
  const seen=new Uint8Array(GW*GH),q=[i];seen[i]=1;
  while(q.length){const c=q.shift(),cx=c%GW,cy=(c/GW)|0;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=GW||ny>=GH)continue;const n=ny*GW+nx;if(seen[n])continue;if(!grid[n])return n;seen[n]=1;q.push(n)}}
  return -1;
}
function los(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d/4);for(let i=1;i<=n;i++){const t=i/n;if(!free(ax+(bx-ax)*t,ay+(by-ay)*t))return false}return true}
function findPath(sx,sy,tx,ty){
  const s=nearestFree(cidx(sx,sy)),g=nearestFree(cidx(tx,ty));if(s<0||g<0)return[];
  const gs=new Float32Array(GW*GH).fill(1e9),came=new Int32Array(GW*GH).fill(-1),closed=new Uint8Array(GW*GH);
  const heap=[];const push=(f,i)=>{heap.push([f,i]);let k=heap.length-1;while(k>0){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===k)break;[heap[m],heap[k]]=[heap[k],heap[m]];k=m}}return top};
  const gx=g%GW,gy=(g/GW)|0,hh=i=>Math.hypot(i%GW-gx,((i/GW)|0)-gy);
  gs[s]=0;push(hh(s),s);
  while(heap.length){const[,c]=pop();if(c===g)break;if(closed[c])continue;closed[c]=1;const cx=c%GW,cy=(c/GW)|0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=GW||ny>=GH)continue;const n=ny*GW+nx;if(grid[n])continue;
      if(dx&&dy&&(grid[cy*GW+nx]||grid[ny*GW+cx]))continue;const ng=gs[c]+(dx&&dy?1.414:1);if(ng<gs[n]){gs[n]=ng;came[n]=c;push(ng+hh(n),n)}}}
  if(came[g]<0&&g!==s)return[];
  const pts=[];for(let c=g;c!==-1&&c!==s;c=came[c])pts.push([(c%GW)*CELL+5,((c/GW)|0)*CELL+5]);pts.reverse();
  if(free(tx,ty))pts.push([tx,ty]);
  const out=[];let cx=sx,cy=sy,i=0;
  while(i<pts.length){let j=pts.length-1;while(j>i&&!los(cx,cy,pts[j][0],pts[j][1]))j--;out.push(pts[j]);[cx,cy]=pts[j];i=j+1}
  return out;
}

// ===================== oyun durumu =====================
const G={day:1,score:0,best:store.get('atagunu.best')||0,vit:70,brain:70,phase:'start',tasks:[],log:[],floats:[],trap:null,
  trapClock:0,nextTrap:0,meals:0,chats:0,balls:0,read:false,brushedN:false,outfit:'pijama',weather:'yagmur',
  dayStart:0,clothT:0,clothAcc:0,overlay:null,rng:mulberry32(1),tvAcc:0,paused:true,time:0,ball:null,chatUsed:[]};
const P={x:192,y:110,path:[],mode:'idle',act:null,dizzy:0,busy:0,onDone:null,moving:false,keys:{}};
const WEATHER={gunes:{ad:'Güneşli',sky:'#8fd0f5'},yagmur:{ad:'Yağmurlu',sky:'#8796a4'},kar:{ad:'Karlı',sky:'#9fb2c3'}};
const OUTFITS=[{id:'sort',ad:'Şort + tişört',k:'Hafif ve serin'},{id:'pantolon',ad:'Pantolon + kazak',k:'Orta kalınlıkta'},
  {id:'yagmurluk',ad:'Yağmurluk + çizme',k:'Su geçirmez'},{id:'mont',ad:'Mont + bere',k:'Kalın ve sıcak'}];
const FIT={gunes:{sort:10,pantolon:4,yagmurluk:-5,mont:-10},yagmur:{yagmurluk:10,mont:3,pantolon:0,sort:-10},kar:{mont:10,yagmurluk:0,pantolon:-3,sort:-10}};
const BEST={gunes:'sort',yagmur:'yagmurluk',kar:'mont'};
const isDizzy=()=>P.dizzy>0||G.brain<25;
const factor=()=>Math.max(.6,1-(G.day-1)*.08);

function effect(text,{s=0,v=0,b=0}={},x,y){
  G.score+=s;G.vit=clamp(G.vit+v,0,100);G.brain=clamp(G.brain+b,0,100);
  G.log.push({text,s,v,b});
  const parts=[];if(s)parts.push((s>0?'+':'')+s+' puan');if(v)parts.push('Vitamin '+(v>0?'+':'')+v);if(b)parts.push('Beyin '+(b>0?'+':'')+b);
  const good=s>0||(!s&&(v>0||b>0));
  G.floats.push({t:text,sub:parts.join(' · '),x:x??P.x,y:(y??P.y)-78,age:0,c:good?'#2e9a58':'#d24646'});
  (good?SFX.good:SFX.bad)();
  if(G.score>G.best){G.best=G.score;store.set('atagunu.best',G.best)}
  hud();
}
function say(text,x,y){G.floats.push({t:text,sub:'',x:x??P.x,y:(y??P.y)-78,age:0,c:'#1d2b36'})}

// ----- görevler (kum saatleri) -----
const LABEL={brushM:'Sabah dişlerini fırçala',dress:'Havaya göre giyin',school:'Okul servisi kapıda',clothes:'Kıyafetlerini çıkar, katla',
  lesson:'Derse otur',free:'Yatma vaktine',tvT:'TV süresi',brushN:'Yatmadan dişlerini fırçala',sleep:'Yatağa git'};
const HINT={brushM:'Banyodaki lavaboya git.',dress:'Odandaki dolaba git, pencereden havaya bak.',school:'Kapıya git, servis bekliyor.',
  clothes:'Okul kıyafetlerin üstünde. Dolaba git, çıkar ve katla. Yapmadıkça puan düşer!',lesson:'Kum saati bitmeden ders masana otur.',
  free:'Serbest zaman: annenle sohbet et, babanla top oyna, kitap oku, mutfakta sağlıklı atıştır.',brushN:'Banyoya git, dişlerini fırçala.',sleep:'Yatağına git ve uyu.'};
function addTask(id,dur,onFail){if(hasTask(id))return;G.tasks.push({id,dur,left:dur,onFail,last:99});renderTasks()}
const hasTask=id=>G.tasks.find(t=>t.id===id);
function doneTask(id){G.tasks=G.tasks.filter(t=>t.id!==id);renderTasks()}
function hgSVG(i){return `<svg viewBox="0 0 20 28" aria-hidden="true"><defs><clipPath id="ct${i}"><rect id="rt${i}" x="0" y="4" width="20" height="10"/></clipPath><clipPath id="cb${i}"><rect id="rb${i}" x="0" y="24" width="20" height="0"/></clipPath></defs>
<path d="M2 2h16M2 26h16" stroke="#1d2b36" stroke-width="2.2" stroke-linecap="round"/>
<path d="M4 3c0 6 4 8 6 11c2-3 6-5 6-11zM4 25c0-6 4-8 6-11c2 3 6 5 6 11z" fill="#fff" stroke="#1d2b36" stroke-width="1.4"/>
<path d="M5 4h10l-5 9z" fill="#e39a2d" clip-path="url(#ct${i})"/><path d="M5 24h10l-5-9z" fill="#e39a2d" clip-path="url(#cb${i})"/>
<line id="st${i}" x1="10" y1="13" x2="10" y2="23" stroke="#e39a2d" stroke-width="1.2"/></svg>`}
function renderTasks(){
  const el=$('#tasks');el.innerHTML='';
  G.tasks.forEach((t,i)=>{const c=document.createElement('div');c.className='chip';c.id='chip'+i;
    c.innerHTML=(t.dur?hgSVG(i):'<svg viewBox="0 0 20 28" aria-hidden="true"><circle cx="10" cy="14" r="7" fill="#d24646"/><path d="M10 9v6M10 18v1" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>')+
    `<span>${LABEL[t.id]}</span><span class="sec" id="sec${i}"></span>`;el.appendChild(c)});
  updChips();banner();
}
function updChips(){
  G.tasks.forEach((t,i)=>{const sec=$('#sec'+i),chip=$('#chip'+i);if(!sec)return;
    if(t.dur){const f=clamp(t.left/t.dur,0,1);sec.textContent=Math.ceil(t.left)+' sn';
      $('#rt'+i).setAttribute('y',4+9*(1-f));$('#rb'+i).setAttribute('y',24-10*(1-f));$('#rb'+i).setAttribute('height',10);
      $('#st'+i).style.display=G.paused?'none':'';chip.classList.toggle('low',t.left<=5);}
    else{sec.textContent=G.clothT>10?'puan düşüyor':'';chip.classList.toggle('warn',G.clothT>10)}});
}
function banner(){
  const b=$('#banner');
  b.className='banner';
  if(G.trap){b.textContent='“'+G.trap.text+'”';return}
  if(G.phase==='start'){b.textContent='Başlamak için “Başla”ya bas.';return}
  if(hasTask('baby')){b.className='banner trap';b.textContent=BABY()+' ağlıyor! Salondaki beşiğe git, onu sakinleştir.';return}
  if(P.mode==='tv'){b.textContent='TV izliyorsun. Kum saati bitmeden kalk, yoksa beynin yorulur ve sersemlersin!';return}
  if(P.mode==='ball'){b.textContent='Top sana gelirken tam ayağına ulaşınca tıkla ya da boşluğa bas.';return}
  const order=['brushM','dress','school','clothes','lesson','brushN','sleep','free'];
  const t=order.map(hasTask).find(Boolean);
  b.textContent=t?LABEL[t.id]+': '+HINT[t.id]:'Etrafı keşfet.';
  if(born()&&(G.phase==='home'||G.phase==='night'))b.textContent+=' Şşş, '+BABY()+' uyuyor: TV ve top gürültü yapar, kitap okumak sessizdir.';
}

