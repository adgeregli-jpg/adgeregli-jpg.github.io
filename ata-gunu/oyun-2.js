// ===================== gün akışı =====================
function startDay(){
  G.rng=mulberry32(G.day*7919+13);
  G.weather=G.day===1?'yagmur':['gunes','yagmur','kar'][Math.floor(G.rng()*3)];
  Object.assign(G,{phase:'morning',tasks:[],log:[],trap:null,meals:0,chats:0,balls:0,read:false,reads:0,hugged:false,babyClock:0,nextCry:14,brushedN:false,outfit:'pijama',dayStart:G.score,clothT:0,clothAcc:0,trapClock:0,ball:null});
  Object.assign(P,{x:192,y:110,path:[],mode:'idle',act:null,dizzy:0,busy:0});
  G.morningTrap={at:5,done:false};G.paused=false;
  $('#day').textContent=G.day+'. Gün';
  const sub=born()&&G.day===BIRTH_DAY?'Evde artık '+BABY()+' var! Uyurken sessiz ol, ağlayınca yanına git.':'Günaydın '+N()+'! Pencereden dışarı bir bak.';
  G.overlay={t:0,dur:born()&&G.day===BIRTH_DAY?2.6:1.8,text:G.day+'. Gün · Sabah',sub,then:()=>{
    addTask('brushM',Math.max(12,25*factor()),()=>{effect('Sabah dişlerini fırçalamadın',{s:-5});startDress()});
  }};
  renderTasks();hud();
}
function startDress(){addTask('dress',Math.max(14,30*factor()),()=>{G.outfit=BEST[G.weather];effect('Giyinmeye geç kaldın, annen seçti',{s:-5});startSchool()})}
function startSchool(){addTask('school',Math.max(12,20*factor()),()=>{effect('Servise geç kaldın',{s:-5});goSchool()})}
function goSchool(){
  doneTask('school');SFX.door();stopTV(true);P.mode='away';P.path=[];G.phase='school';
  G.overlay={t:0,dur:3,text:'Okulda…',sub:N()+' derste, arkadaşlarıyla. Akşamüstü eve dönecek.',then:comeHome};
}
function comeHome(){
  G.phase='home';Object.assign(P,{x:940,y:520,mode:'idle',path:[]});SFX.door();
  G.clothT=0;G.clothAcc=0;G.trapClock=0;G.nextTrap=7+G.rng()*5;
  addTask('clothes',0);
  addTask('lesson',Math.max(22,45*factor()),()=>{effect('Kum saati bitti, derse oturmadın',{s:-15,b:-10})});
  addTask('free',70,startNight);
  say('Eve geldim!');
}
function startNight(){
  G.phase='night';
  G.overlay={t:0,dur:1.6,text:'Yatma vakti',sub:'Dişlerini fırçala, sonra yatağına git.',then:()=>{
    addTask('brushN',Math.max(14,30*factor()),()=>effect('Yatmadan dişlerini fırçalamadın',{s:-5}));
    addTask('sleep',40,()=>{effect('Geç yattın',{s:-5});goSleep()});
  }};
}
function goSleep(){
  stopTV(true);
  if(!G.brushedN&&!G.log.find(l=>l.text==='Yatmadan dişlerini fırçalamadın')){doneTask('brushN');effect('Dişlerini fırçalamadan yattın',{s:-10})}
  if(hasTask('sleep')){doneTask('sleep');effect('Zamanında yattın',{s:5,b:3})}
  if(hasTask('clothes')){doneTask('clothes');effect('Kıyafetler bütün gün dağınık kaldı',{s:-5})}
  G.tasks=[];G.trap=null;renderTasks();
  P.mode='sleep';P.path=[];SFX.snore();
  G.overlay={t:0,dur:2.4,text:'İyi geceler '+N(),sub:'Zzz…',dark:true,then:summary};
}
function summary(){
  G.phase='summary';
  const d=G.score-G.dayStart;
  const rows=G.log.map(l=>{const p=[];if(l.s)p.push((l.s>0?'+':'')+l.s);if(l.v)p.push('Vit '+(l.v>0?'+':'')+l.v);if(l.b)p.push('Beyin '+(l.b>0?'+':'')+l.b);
    const g=l.s>0||(!l.s&&(l.v>0||l.b>0));return `<li><span>${l.text}</span><span class="d ${g?'pos':'neg'}">${p.join(' · ')}</span></li>`}).join('');
  const mood=d>=40?'Harika bir gün!':d>=15?'Güzel bir gün.':d>=0?'Fena değil, yarın daha iyi olur.':'Zor bir gündü, yarın tekrar dene.';
  openModal(`<h2>${G.day}. Günün karnesi</h2><p><b>${mood}</b> Bugün ${d>=0?'+':''}${d} puan. Toplam ${G.score} · Vitamin ${G.vit} · Beyin ${G.brain} · En iyi ${G.best}</p>
  <ul class="log">${rows||'<li>Bugün pek bir şey olmadı.</li>'}</ul>
  <div class="row"><button class="main" id="mNext" type="button">Yeni güne uyan</button></div>`,c=>{c.querySelector('#mNext').onclick=()=>{closeModal();G.day++;if(S.mom.pregnant&&G.day===BIRTH_DAY)birthModal();else startDay()}});
}
function birthModal(){
  SFX.good();setTimeout(()=>SFX.good(),300);
  openModal(`<h2>Müjde! ${gen(N())} kardeşi doğdu</h2>
  <p>Gece ${MOM()} ve ${DAD()} hastaneye gitti, sabah eve yeni bir bebekle döndüler. Artık evde salondaki beşikte minik bir kardeş uyuyor.</p>
  <div class="fam"><fieldset><legend>Kardeş</legend>
   <label>İsmi<input type="text" id="bName" value="${BABY()}" maxlength="14"></label>
   <label>Kız mı, erkek mi?<select id="bSex"><option value="kiz" ${S.baby.sex==='kiz'?'selected':''}>Kız kardeş</option><option value="erkek" ${S.baby.sex==='erkek'?'selected':''}>Erkek kardeş</option></select></label>
  </fieldset></div>
  <ul class="rules"><li>Kardeşin uyurken TV açmak ve top oynamak gürültü yapar: <b>eksi puan</b>, bebek uyanır.</li>
   <li>Ağladığında beşiğe git, salla ya da ninni söyle: <b>artı puan</b>.</li>
   <li>Sessizce <b>kitap okumak</b> artı puan getirir.</li></ul>
  <div class="row"><button class="main" type="button" id="bGo">Hoş geldin!</button></div>`,c=>{
    c.querySelector('#bGo').onclick=()=>{S.baby.name=c.querySelector('#bName').value.trim()||'Bebek';S.baby.sex=c.querySelector('#bSex').value;store.set('atagunu.settings',S);closeModal();startDay()}});
}

// ===================== tuzaklar =====================
const TRAP_SPOTS=[[180,380],[460,420],[560,470],[300,240],[750,380],[700,560],[120,560]];
function spawnTrap(){
  const r=G.rng,types=['remote','chips','choc','chips'],type=types[Math.floor(r()*types.length)];
  const n=up(N());let t;
  if(type==='remote')t={type,x:320,y:517,text:n+', KUMANDAYA BAS!',s:[320,470]};
  else if(type==='chips'){let sp=TRAP_SPOTS[Math.floor(r()*TRAP_SPOTS.length)];if(Math.hypot(sp[0]-P.x,sp[1]-P.y)<80)sp=TRAP_SPOTS[(TRAP_SPOTS.indexOf(sp)+3)%TRAP_SPOTS.length];
    t={type,x:sp[0],y:sp[1],text:n+', YERDEKİ CİPSİ AL, AÇ VE YE!',s:sp}}
  else{const onK=r()<.5;t=onK?{type,x:790,y:166,text:n+', MASADAKİ ÇİKOLATAYI YE!',s:[790,236]}:{type,x:300,y:514,text:n+', ŞU ÇİKOLATA SENİ BEKLİYOR!',s:[300,470]}}
  if(type==='remote'&&P.mode==='tv'){t={type:'chips',x:460,y:420,text:n+', YERDEKİ CİPSİ AL, AÇ VE YE!',s:[460,420]}}
  t.left=10;G.trap=t;G.trapClock=0;G.nextTrap=12+r()*8;SFX.tv();banner();
}
function acceptTrap(){
  const t=G.trap;G.trap=null;banner();
  if(t.type==='bed'){P.mode='sleep';P.busy=2.5;SFX.snore();const b=hasTask('brushM');if(b)b.left=Math.max(1,b.left-8);
    P.onDone=()=>{P.mode='idle';P.x=192;P.y=110;effect('5 dakika daha uyudun, zaman kaçtı',{s:-3})};return}
  if(t.type==='remote'){effect('Kumandaya bastın',{s:-3});startTV();return}
  if(t.type==='chips'){SFX.eat();effect('Yerdeki cipsi açıp yedin',{s:-5,v:-12});return}
  if(t.type==='choc'){SFX.eat();effect('Çikolatayı yedin',{s:-4,v:-10})}
}
function trapTimeout(){
  const t=G.trap;G.trap=null;banner();
  effect('Tuzağa düşmedin!',{s:t.type==='bed'?3:5},t.x,t.y);
}

// ===================== eylemler =====================
function act(id){
  const ph=G.phase;
  switch(id){
  case 'sink':
    if(hasTask('brushM')||hasTask('brushN'))brush();
    else say('Dişlerin temiz. Fırçalama vakti sabah ve yatmadan önce.');break;
  case 'ward':
    if(hasTask('brushM'))say('Önce dişlerini fırçala.');
    else if(hasTask('dress'))dressModal();
    else if(hasTask('clothes'))foldModal();
    else say('Dolabın düzenli.');break;
  case 'door':
    if(hasTask('school'))goSchool();
    else if(ph==='morning')say('Önce sabah görevlerini bitir.');
    else say('Şimdi dışarı çıkma vakti değil.');break;
  case 'desk':
    if(hasTask('lesson'))lessonModal();
    else readBook(true);break;
  case 'shelf':readBook(false);break;
  case 'crib':
    if(!S.mom.pregnant)say('Bu beşik eski oyuncaklarla dolu.');
    else if(!born())say('Bu beşik kardeşin için hazırlandı. Yakında gelecek!');
    else if(hasTask('baby'))babyModal();
    else if(!G.hugged){G.hugged=true;effect(BABY()+' uyurken onu sessizce sevdin',{s:3,b:2},82,330)}
    else say(BABY()+' mışıl mışıl uyuyor. Şşş!');break;
  case 'table':foodModal();break;
  case 'remote':case 'tv':startTV();break;
  case 'mom':chatModal();break;
  case 'dad':startBall();break;
  case 'bed':
    if(ph==='night')goSleep();else say('Daha uyku vakti değil.');break;
  }
}
function brush(){
  const id=hasTask('brushM')?'brushM':'brushN';
  P.mode='brush';P.busy=2.2;SFX.brush();
  P.onDone=()=>{P.mode='idle';doneTask(id);
    if(id==='brushM'){effect('Sabah dişlerini fırçaladın',{s:10});startDress()}
    else{G.brushedN=true;effect('Yatmadan dişlerini fırçaladın',{s:10})}};
}
// ----- kitap ve kardeş -----
function readBook(atDesk){
  if(G.phase==='morning'){say('Sabah okula hazırlanma vakti, kitabı akşam oku.');return}
  if(G.reads>=3){say('Bugün çok okudun, gözlerini dinlendir.');return}
  P.mode='sit';if(atDesk){P.x=112;P.y=232}P.busy=2.5;SFX.tick();
  P.onDone=()=>{P.mode='idle';G.reads++;const quiet=born()&&!hasTask('baby');
    effect(quiet?'Kardeşin uyurken sessizce kitap okudun':'Kitap okudun',{s:quiet?7:5,b:5})};
}
function noisy(what){ // kardeş uyurken gürültü
  if(!born()||hasTask('baby')||G.phase==='morning')return;
  effect(BABY()+' uyurken '+what+'. Uyandı!',{s:-5},82,330);babyCry();
}
function babyCry(){
  if(hasTask('baby'))return;
  LABEL.baby=BABY()+' ağlıyor';
  addTask('baby',14,()=>effect(BABY()+' uzun süre ağladı, kimse gelmedi',{s:-4},82,330));
  G.babyClock=0;G.nextCry=18+G.rng()*12;
  tone(760,.35,'sine',.08);tone(620,.4,'sine',.08,.35);
}
function babyModal(){
  const b=BABY();
  openModal(`<h2>${b} ağlıyor</h2><p>${b} uyandı ve ağlıyor. Onu nasıl sakinleştirirsin?</p>
  <div class="opts">
   <button type="button" data-c="sal">Beşiği yavaşça salla<span class="k">Sallanmak bebeği rahatlatır</span></button>
   <button type="button" data-c="ninni">Ninni söyle<span class="k">Yumuşak ve sessiz bir şarkı</span></button>
   <button type="button" data-c="emzik">Emziğini ver<span class="k">Yere düşen emziği bul</span></button>
   <button type="button" data-c="anne">${MOM()}’yı çağır<span class="k">Belki karnı acıkmıştır</span></button>
  </div>`,c=>c.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{closeModal();doneTask('baby');
    const k=x.dataset.c,m={sal:['Beşiği salladın, '+b+' uyudu',{s:6,b:3}],ninni:['Ninni söyledin, '+b+' uyudu',{s:6,b:5}],
      emzik:['Emziği verdin, '+b+' sakinleşti',{s:6,b:3}],anne:[MOM()+'’yı çağırdın, birlikte sakinleştirdiniz',{s:4,b:4}]}[k];
    effect(m[0],m[1],82,330)}));
}
function startTV(){
  if(P.mode==='tv')return;
  noisy('TV’yi açtın');
  Object.assign(P,{mode:'tv',x:320,y:470,path:[]});G.tvAcc=0;SFX.tv();
  addTask('tvT',12,()=>{stopTV(true);P.dizzy=15;effect('TV süresi bitti ama izlemeye devam ettin. Sersemledin!',{s:-5,b:-20})});
  banner();
}
function stopTV(silent){
  if(P.mode!=='tv')return;P.mode='idle';P.y=478;
  const t=hasTask('tvT');if(t){doneTask('tvT');if(!silent)effect('TV’yi zamanında kapattın',{s:3})}
  banner();actbar();
}

// ----- top oyunu -----
function startBall(){
  if(G.balls>=2){say('Bugünlük bu kadar, yarın yine oynarız!',885,428);return}
  Object.assign(P,{mode:'ball',x:798,y:478,path:[]});G.ball={round:0,hits:0,ph:'toAta',p:-.4,res:''};
  noisy(DAD()+' ile top oynayıp gürültü yaptın');banner();
}
function kick(){const B=G.ball;if(!B||B.ph!=='toAta'||B.p<0)return;
  if(B.p>=.7){B.hits++;B.ph='toDad';B.p=0;B.res='Süper vuruş!';SFX.kick()}else{B.ph='miss';B.p=0;B.res='Erken vurdun!';SFX.bad()}}
function updateBall(dt){
  const B=G.ball;if(!B)return;
  const next=()=>{B.round++;if(B.round>=3){const h=B.hits;G.ball=null;P.mode='idle';G.balls++;banner();
      effect(DAD()+' ile top oynadın ('+h+'/3)',{s:2+h*2,b:5+h*2,v:3});return}B.ph='toAta';B.p=-.3;B.res=''};
  if(B.ph==='toAta'){B.p+=dt/1.05;if(B.p>1.12){B.ph='miss';B.p=0;B.res='Kaçtı!';SFX.bad()}}
  else if(B.ph==='toDad'){B.p+=dt/.8;if(B.p>=1)next()}
  else if(B.ph==='miss'){B.p+=dt/.7;if(B.p>=1)next()}
}

