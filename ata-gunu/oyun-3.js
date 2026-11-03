// ===================== pencereler (modal) =====================
function openModal(html,mount){$('#mcard').innerHTML=html;$('#modal').hidden=false;G.paused=true;updChips();mount&&mount($('#mcard'));const f=$('#mcard').querySelector('button,input');f&&f.focus()}
function closeModal(){$('#modal').hidden=true;G.paused=G.phase==='start';updChips();cv.focus()}

function dressModal(){
  const w=G.weather;
  openModal(`<h2>Bugün ne giyeceksin?</h2><p>Pencereden dışarı bak, havaya uygun kıyafeti seç.</p>
  <canvas id="winv" width="520" height="220" style="width:100%;height:auto;aspect-ratio:520/220;display:block;border-radius:10px;background:#33414d;cursor:default" aria-label="Pencereden dışarısı"></canvas>
  <div class="opts">${OUTFITS.map(o=>`<button type="button" data-o="${o.id}">${o.ad}<span class="k">${o.k}</span></button>`).join('')}</div>`,c=>{
    const wv=c.querySelector('#winv'),wc=wv.getContext('2d');
    (function paint(){if(!wv.isConnected||$('#modal').hidden)return;wc.setTransform(1,0,0,1,0,0);wc.fillStyle='#e8b4a0';wc.fillRect(0,0,520,220);
      drawWindow(wc,40,22,440,176);wc.fillStyle='#c98f7a';wc.fillRect(0,0,30,220);wc.fillRect(490,0,30,220);requestAnimationFrame(paint)})();
    c.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const o=b.dataset.o,p=FIT[w][o];closeModal();G.outfit=o;doneTask('dress');
      const msg=p>=10?'Havaya çok uygun giyindin':p>0?'İdare eder bir seçim':p===0?'Bu hava için pek uygun değil':o==='sort'?'Bu havada şort giyilmez, üşüyeceksin!':'Bu kıyafet bugün için yanlış';
      effect(msg,{s:p});startSchool()})});
}
function foldModal(){
  const steps=['Kıyafetleri çıkar','Güzelce katla','Dolaba yerleştir'];let k=0;
  const draw=c=>{c.innerHTML=`<h2>Kıyafet zamanı</h2><p>Okul kıyafetlerini sırayla düzenle. ${k}/3</p>
    <div class="opts">${steps.map((s,i)=>`<button type="button" data-i="${i}" ${i!==k?'disabled style="opacity:.45"':''}>${i<k?'✓ ':''}${s}</button>`).join('')}</div>`;
    c.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{k++;SFX.tick();if(k>=3){closeModal();doneTask('clothes');G.outfit='ev';effect('Kıyafetlerini düzgünce katladın',{s:10})}else draw(c)})};
  openModal('',draw);
}
function makeQ(){
  const r=G.rng,d=G.day,lv=Math.min(4,d);const op=['+','-',r()<.5?'+':'-',r()<.5?'×':'-'][lv-1];let a,b,ans;
  if(op==='+'){a=2+Math.floor(r()*(8+d*4));b=1+Math.floor(r()*(6+d*3));ans=a+b}
  else if(op==='-'){a=6+Math.floor(r()*(10+d*4));b=1+Math.floor(r()*(a-1));ans=a-b}
  else{a=2+Math.floor(r()*8);b=2+Math.floor(r()*8);ans=a*b}
  const s=new Set([ans]);let g=1;while(s.size<3){const c=ans+(r()<.5?-1:1)*(1+Math.floor(r()*3)*g);if(c>=0)s.add(c);g++}
  const o=[...s];for(let i=o.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[o[i],o[j]]=[o[j],o[i]]}
  return{q:`${a} ${op} ${b} = ?`,o,ans};
}
function lessonModal(){
  doneTask('lesson');P.mode='sit';P.x=112;P.y=232;
  let n=0,ok=0;const Q=[makeQ(),makeQ(),makeQ()];
  const draw=c=>{const q=Q[n];c.innerHTML=`<h2>Ders: ${n+1}/3</h2><p>Kum saati bitmeden derse oturdun, aferin! Şimdi soruyu çöz.</p>
    <p style="font-family:var(--f-display);font-size:2.2rem;font-weight:800;margin:8px 0">${q.q}</p>
    <div class="opts">${q.o.map(v=>`<button type="button" data-v="${v}" style="text-align:center;font-size:1.3rem">${v}</button>`).join('')}</div>`;
    c.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{const right=+b.dataset.v===q.ans;if(right){ok++;SFX.good()}else SFX.bad();n++;
      if(n>=3){closeModal();P.mode='idle';effect('Dersini yaptın ('+ok+'/3 doğru)',{s:5+ok*5,b:ok*3},112,232)}else draw(c)})};
  openModal('',draw);
}
const FOODS=[{id:'ekmek',ad:'Beyaz ekmek',s:-2,v:-8},{id:'cips',ad:'Cips',s:-4,v:-12},{id:'cikolata',ad:'Çikolata',s:-4,v:-12},
  {id:'elma',ad:'Elma',s:3,v:10},{id:'havuc',ad:'Havuç',s:3,v:10},{id:'brokoli',ad:'Brokoli',s:4,v:12},{id:'muz',ad:'Muz',s:3,v:8},{id:'salatalik',ad:'Salatalık',s:3,v:8}];
const FOOD_COL={ekmek:'#f4ead2',cips:'#f2c230',cikolata:'#6b3f22',elma:'#d33b3b',havuc:'#f08a24',brokoli:'#3f8f3f',muz:'#f5d547',salatalik:'#5ea84a'};
function foodModal(){
  if(G.phase==='school')return;
  if(G.meals>=4){say('Karnın tok, bugünlük yeter.');return}
  const r=mulberry32(G.day*31+G.meals);const pool=[...FOODS];for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const pick=pool.slice(0,6);
  openModal(`<h2>Masada neler var?</h2><p>Bir şey seç. Meyve ve sebze vitamini artırır; beyaz ekmek, cips ve çikolata azaltır. Bugün ${4-G.meals} hakkın kaldı.</p>
  <div class="opts">${pick.map(f=>`<button type="button" data-f="${f.id}"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${FOOD_COL[f.id]};border:1px solid #0003;vertical-align:-2px;margin-right:6px"></span>${f.ad}</button>`).join('')}</div>
  <div class="row"><button type="button" id="mNo">Hiçbir şey yeme</button></div>`,c=>{
    c.querySelector('#mNo').onclick=closeModal;
    c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=FOODS.find(x=>x.id===b.dataset.f);closeModal();G.meals++;SFX.eat();
      effect(f.ad+' yedin',{s:f.s,v:f.v})})});
}
function chatQs(){const n=N();return[
  {q:'Bir haftada kaç gün vardır?',a:['5','7','10'],c:1},{q:'Hangisi bir meyvedir?',a:['Havuç','Elma','Patates'],c:1},
  {q:'Güneş hangi yönden doğar?',a:['Doğu','Batı','Kuzey'],c:0},{q:'Örümceğin kaç bacağı vardır?',a:['6','8','4'],c:1},
  {q:'Hangisi sebzedir?',a:['Brokoli','Çilek','Muz'],c:0},{q:'Bir yılda kaç mevsim var?',a:['2','4','12'],c:1},
  {q:'Su kaç derecede donar?',a:['0','50','100'],c:0},{q:'Türkiye’nin başkenti neresidir?',a:['İstanbul','Ankara','İzmir'],c:1},
  {q:'Hangi hayvan uçabilir?',a:['Kedi','Kartal','Balık'],c:1},{q:'Gökkuşağında kaç renk vardır?',a:['3','7','10'],c:1},
  {q:'Bugün okulda en çok neyi sevdin?',a:['Arkadaşlarımla oynamak','Yeni bir şey öğrenmek','Resim yapmak'],c:-1},
].concat(!S.mom.pregnant?[]:born()?[
  {q:BABY()+' uyurken evde nasıl olmalıyız?',a:['Sessiz','Çok gürültülü','TV’yi sonuna kadar açık'],c:0},
  {q:BABY()+' ağlayınca ne yapabiliriz?',a:['Beşiğini sallarız','Odadan kaçarız','Biz de bağırırız'],c:0},
  {q:'Bebekler neden bu kadar çok uyur?',a:['Büyümek için','Sıkıldıkları için','Okul olmadığı için'],c:0},
  {q:n+', '+BABY()+' büyüyünce ona ne öğretmek istersin?',a:['Top oynamayı','Kitap okumayı','Diş fırçalamayı'],c:-1},
]:[
  {q:n+', kardeşin doğunca ona nasıl yardım edersin?',a:['Ona masal okurum','Oyuncaklarımı paylaşırım','Uyurken sessiz olurum'],c:-1},
  {q:'Karnımdaki bebek her gün büyüyor. Sence bebekler büyümek için ne yer?',a:['Annenin yediği sağlıklı yiyecekleri','Cips','Sadece şeker'],c:0},
])}
function chatModal(){
  if(G.chats>=2){say('Biraz dinleneyim canım, sonra yine konuşuruz.',82,478);return}
  const qs=chatQs();let i=Math.floor(G.rng()*qs.length);let tries=0;while(G.chatUsed.includes(i)&&tries++<20)i=(i+1)%qs.length;G.chatUsed.push(i);if(G.chatUsed.length>8)G.chatUsed.shift();
  const q=qs[i];
  openModal(`<h2>${MOM()} ile sohbet</h2><p>${MOM()}: “${q.q}”</p>
  <div class="opts">${q.a.map((a,k)=>`<button type="button" data-k="${k}">${a}</button>`).join('')}</div>`,c=>{
    c.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;G.chats++;
      if(q.c===-1||k===q.c){c.innerHTML=`<h2>${MOM()} gülümsedi</h2><p>${q.c===-1?'“Ne güzel düşünmüşsün, seninle konuşmak çok keyifli.”':'“Doğru bildin, aferin sana!”'}</p><div class="row"><button class="main" type="button" id="mOk">Sarıl ve devam et</button></div>`;
        c.querySelector('#mOk').onclick=()=>{closeModal();effect(MOM()+' ile sohbet ettin',{s:5,b:12},82,478)}}
      else{c.innerHTML=`<h2>Yeni bir şey öğrendin</h2><p>${MOM()}: “Doğrusu <b>${q.a[q.c]}</b>. Şimdi öğrendin işte!”</p><div class="row"><button class="main" type="button" id="mOk">Teşekkürler</button></div>`;
        c.querySelector('#mOk').onclick=()=>{closeModal();effect(MOM()+' ile sohbet ettin',{s:2,b:6},82,478)}}
    })});
}

// ----- başlangıç ve aile ayarları -----
function startModal(){
  $('#ttl').textContent=gen(N())+' Günü';
  openModal(`<h2>${gen(N())} Günü</h2>
  <p>${N()} her gün evde güzel alışkanlıklarla puan topluyor. Kum saatlerine dikkat!</p>
  <ul class="rules">
   <li>Uyanınca ve yatmadan önce <b>dişlerini fırçala</b>.</li>
   <li>Pencereye bak, <b>havaya uygun giyin</b>. Yağmurda şort eksi puan!</li>
   <li>Okuldan dönünce <b>kıyafetlerini çıkar ve katla</b>. Yapmadıkça puan düşer.</li>
   <li>Kum saati bitmeden <b>derse otur</b>.</li>
   <li>Meyve ve sebze vitamini artırır. Beyaz ekmek, cips, çikolata azaltır.</li>
   <li>TV izleyebilirsin ama süre bitince hâlâ izliyorsan beynin yorulur ve sersemlersin.</li>
   <li>${MOM()} ile sohbet et, ${DAD()} ile top oyna: beynin güçlenir.</li>
   <li>Evde seni çağıran sesler olabilir. Hepsini dinleme, iyi düşün!</li>
   <li>Kitap okumak (ders masası ya da salondaki kitaplık) artı puan getirir.</li>
   ${S.mom.pregnant?`<li>${MOM()} hamile: ${BIRTH_DAY}. gün kardeşin doğuyor! O uyurken gürültü yapma, ağlayınca yanına git.</li>`:''}
  </ul>
  <p>En iyi puan: <b>${G.best}</b></p>
  <div class="row"><button type="button" id="mFam">Aileyi ayarla</button><button class="main" type="button" id="mGo">Başla</button></div>`,c=>{
    c.querySelector('#mGo').onclick=()=>{closeModal();tone(1,.01,'sine',.0001);startDay()};
    c.querySelector('#mFam').onclick=()=>famModal(startModal);
  });
}
const SKINS=['#f6d5b8','#f1c7a0','#e2a97e','#c68a5e','#8d5a3b'];
const STYLES=[['short','Kısa'],['long','Uzun'],['curly','Kıvırcık'],['bun','Topuz'],['spiky','Dikleşik'],['bald','Az saçlı']];
function famModal(back){
  const tmp=JSON.parse(JSON.stringify(S));
  const fs=(r,t)=>{const L=tmp[r];return `<fieldset><legend>${t}</legend>
    <label>İsim<input type="text" id="n_${r}" value="${L.name}" maxlength="14"></label>
    <label>Ten rengi<span class="sw">${SKINS.map(s=>`<button type="button" data-r="${r}" data-skin="${s}" aria-pressed="${s===L.skin}" style="background:${s}" aria-label="Ten ${s}"></button>`).join('')}</span></label>
    <label>Saç rengi<input type="color" id="h_${r}" value="${L.hair}"></label>
    <label>Saç modeli<select id="y_${r}">${STYLES.map(([v,a])=>`<option value="${v}" ${v===L.style?'selected':''}>${a}</option>`).join('')}</select></label>
    <label>Tişört rengi<input type="color" id="c_${r}" value="${L.shirt}"></label>
    ${r==='child'?`<label>Pantolon rengi<input type="color" id="p_${r}" value="${L.pants}"></label>`:''}
    <label class="ck"><input type="checkbox" id="g_${r}" ${L.glasses?'checked':''}>Gözlük</label>
    ${r==='dad'?`<label class="ck"><input type="checkbox" id="b_${r}" ${L.beard?'checked':''}>Sakal</label>`:''}
    ${r==='mom'?`<label class="ck"><input type="checkbox" id="m_${r}" ${L.pregnant?'checked':''}>Hamile</label>`:''}
  </fieldset>`};
  openModal(`<h2>Aileyi ayarla</h2><p>İsimleri ve görünüşleri kendi ailene göre değiştir.</p>
  <canvas id="prev" width="600" height="220"></canvas>
  <div class="fam">${fs('child','Çocuk')}${fs('mom','Anne')}${fs('dad','Baba')}
   <fieldset><legend>Kardeş</legend><label>İsim<input type="text" id="n_baby" value="${tmp.baby.name}" maxlength="14"></label>
   <label>Cinsiyet<select id="x_baby"><option value="kiz" ${tmp.baby.sex==='kiz'?'selected':''}>Kız</option><option value="erkek" ${tmp.baby.sex==='erkek'?'selected':''}>Erkek</option></select></label>
   <label style="font-weight:400">Anne hamileyse kardeş ${BIRTH_DAY}. gün doğar.</label></fieldset></div>
  <div class="row"><button type="button" id="mReset">Varsayılana dön</button><button class="main" type="button" id="mSave">Kaydet</button></div>`,c=>{
    const pv=c.querySelector('#prev'),px=pv.getContext('2d');
    const read=()=>{for(const r of ['child','mom','dad']){const L=tmp[r];L.name=(c.querySelector('#n_'+r).value.trim()||DEFAULT[r].name);L.hair=c.querySelector('#h_'+r).value;
      L.style=c.querySelector('#y_'+r).value;L.shirt=c.querySelector('#c_'+r).value;L.glasses=c.querySelector('#g_'+r).checked;
      if(r==='child')L.pants=c.querySelector('#p_'+r).value;if(r==='dad')L.beard=c.querySelector('#b_'+r).checked;if(r==='mom')L.pregnant=c.querySelector('#m_'+r).checked}
      tmp.baby.name=c.querySelector('#n_baby').value.trim()||'Bebek';tmp.baby.sex=c.querySelector('#x_baby').value};
    const paint=()=>{px.setTransform(1,0,0,1,0,0);px.fillStyle='#e6cda8';px.fillRect(0,0,600,220);
      drawPerson(px,120,195,tmp.mom,2.1,{});drawPerson(px,300,195,tmp.child,1.7,childLook('ev',tmp.child));drawPerson(px,480,195,tmp.dad,2.2,{});
      px.fillStyle='#1d2b36';px.font='800 18px "Baloo 2",sans-serif';px.textAlign='center';
      [[120,'mom'],[300,'child'],[480,'dad']].forEach(([x,r])=>px.fillText(tmp[r].name,x,214))};
    c.addEventListener('input',()=>{read();paint()});
    c.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{tmp[b.dataset.r].skin=b.dataset.skin;c.querySelectorAll(`[data-r="${b.dataset.r}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b));read();paint()});
    c.querySelector('#mSave').onclick=()=>{read();S=tmp;store.set('atagunu.settings',S);closeModal();$('#ttl').textContent=gen(N())+' Günü';back&&back()};
    c.querySelector('#mReset').onclick=()=>{S=JSON.parse(JSON.stringify(DEFAULT));store.set('atagunu.settings',S);famModal(back)};
    paint();
  });
}

