// ===================== çizim =====================
const cv=$('#cv'),ctx=cv.getContext('2d');cv.tabIndex=0;
function fit(){const dpr=Math.min(2,window.devicePixelRatio||1),w=cv.clientWidth||1000;cv.width=Math.round(w*dpr);cv.height=Math.round(w*620/1000*dpr)}
window.addEventListener('resize',fit);
function rr(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
function ell(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2)}

function childLook(o,L){
  L=L||S.child;
  switch(o){
    case 'sort':return{shirt:'#ffffff',pants:'#24589e',shorts:true,stripe:'#7a1f33'};
    case 'pantolon':return{shirt:'#7a1f33',pants:'#2c3e50',knit:true};
    case 'yagmurluk':return{shirt:'#f2c230',pants:'#2c3e50',boots:'#f2c230',hood:'#f2c230'};
    case 'mont':return{shirt:'#24589e',pants:'#2c3e50',hat:'#7a1f33',boots:'#4a3a30'};
    case 'pijama':return{shirt:'#a9c4ec',pants:'#a9c4ec',pj:true};
    default:return{shirt:L.shirt,pants:L.pants,stripe:L.pants}; // ev: bordo-mavi
  }
}
function drawPerson(c,x,y,L,s,o={}){
  const t=G.time;c.save();c.translate(x,y);if(o.rot)c.rotate(o.rot);
  c.fillStyle='rgba(20,30,40,.18)';ell(c,0,0,14*s,4.5*s);c.fill();
  const shirt=o.shirt||L.shirt,pants=o.pants||L.pants||'#3b4a5a',hy=-50*s;
  if(!o.sit){
    c.fillStyle=o.shorts?L.skin:pants;rr(c,-8*s,-17*s,6.5*s,16*s,2*s);c.fill();rr(c,1.5*s,-17*s,6.5*s,16*s,2*s);c.fill();
    if(o.shorts){c.fillStyle=pants;rr(c,-9*s,-19*s,18*s,8*s,2*s);c.fill()}
    c.fillStyle=o.boots||'#2b2b33';rr(c,-9*s,-4*s,8*s,5*s,2*s);c.fill();rr(c,1*s,-4*s,8*s,5*s,2*s);c.fill();
  }
  // gövde
  c.fillStyle=shirt;rr(c,-11*s,-39*s,22*s,24*s,7*s);c.fill();
  if(o.stripe){c.fillStyle=o.stripe;c.fillRect(-11*s,-31*s,22*s,3.5*s);c.fillRect(-11*s,-24*s,22*s,3.5*s)}
  if(o.pj){c.fillStyle='#7f9fd6';for(let i=0;i<3;i++)c.fillRect(-11*s,(-35+i*7)*s,22*s,2*s)}
  if(o.knit){c.strokeStyle='#5a1526';c.lineWidth=1.2*s;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-9*s,(-33+i*6)*s);c.lineTo(9*s,(-33+i*6)*s);c.stroke()}}
  if(L.pregnant){c.fillStyle=shirt;ell(c,0,-22*s,16.5*s,13*s);c.fill();c.fillStyle='rgba(255,255,255,.25)';ell(c,-5*s,-26*s,6*s,5*s);c.fill();c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=1*s;c.beginPath();c.ellipse(0,-22*s,16.5*s,13*s,0,.15*Math.PI,.85*Math.PI);c.stroke()}
  // kollar
  const sw=o.walk?Math.sin(t*12)*3*s:0;
  c.fillStyle=shirt;rr(c,-16*s,(-36)*s+sw,6*s,16*s,3*s);c.fill();rr(c,10*s,-36*s-sw,6*s,16*s,3*s);c.fill();
  c.fillStyle=L.skin;ell(c,-13*s,-20*s+sw,3*s,3*s);c.fill();ell(c,13*s,-20*s-sw,3*s,3*s);c.fill();
  // saç arkası
  c.fillStyle=L.hair;
  if(L.style==='long'){rr(c,-15*s,hy-6*s,30*s,30*s,9*s);c.fill()}
  if(o.hood){c.fillStyle=o.hood;ell(c,0,hy+1*s,16*s,16*s);c.fill()}
  // baş
  c.fillStyle=L.skin;ell(c,0,hy,13*s,13*s);c.fill();
  c.fillStyle=L.hair;
  const st=L.style;
  if(o.hat){c.fillStyle=o.hat;c.beginPath();c.ellipse(0,hy-4*s,14*s,11*s,0,Math.PI,0);c.fill();ell(c,0,hy-15*s,3.5*s,3.5*s);c.fill();c.fillRect(-14*s,hy-6*s,28*s,4*s)}
  else if(st==='short'||st==='long'||st==='bun'){c.beginPath();c.ellipse(0,hy-4*s,14*s,10.5*s,0,Math.PI,0);c.fill();
    c.beginPath();c.moveTo(-13*s,hy-4*s);c.quadraticCurveTo(-4*s,hy+1*s,6*s,hy-5*s);c.lineTo(13*s,hy-4*s);c.fill();
    if(st==='bun'){ell(c,0,hy-15*s,6*s,5*s);c.fill()}}
  else if(st==='curly'){for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;ell(c,Math.cos(a)*11*s,hy-3*s+Math.sin(a)*10*s,5*s,5*s);c.fill()}}
  else if(st==='spiky'){c.beginPath();c.moveTo(-13*s,hy-3*s);for(let i=0;i<=6;i++){const xx=-13*s+i*26*s/6;c.lineTo(xx,hy-(i%2?18:9)*s)}c.lineTo(13*s,hy-3*s);c.fill()}
  else if(st==='bald'){ell(c,-12*s,hy-1*s,3*s,5*s);c.fill();ell(c,12*s,hy-1*s,3*s,5*s);c.fill()}
  // yüz
  const ey=hy+1*s;c.fillStyle='#1d2b36';c.strokeStyle='#1d2b36';
  if(o.sleep){c.lineWidth=1.4*s;c.beginPath();c.arc(-5*s,ey,2.4*s,0,Math.PI);c.stroke();c.beginPath();c.arc(5*s,ey,2.4*s,0,Math.PI);c.stroke()}
  else if(o.dizzy){c.lineWidth=1.3*s;for(const ex of[-5,5]){c.beginPath();for(let a=0;a<12;a+=.5){const r=a*.22*s;c.lineTo(ex*s+Math.cos(a+t*6)*r,ey+Math.sin(a+t*6)*r)}c.stroke()}}
  else{const bl=(t%3.7)<.12;if(bl){c.fillRect(-7*s,ey,4*s,1.2*s);c.fillRect(3*s,ey,4*s,1.2*s)}else{ell(c,-5*s,ey,1.9*s,2.3*s);c.fill();ell(c,5*s,ey,1.9*s,2.3*s);c.fill()}}
  c.fillStyle='rgba(230,110,120,.35)';ell(c,-8.5*s,hy+5*s,2.6*s,1.6*s);c.fill();ell(c,8.5*s,hy+5*s,2.6*s,1.6*s);c.fill();
  if(L.beard){c.fillStyle=L.hair;c.globalAlpha=.85;c.beginPath();c.ellipse(0,hy+7*s,10*s,6.5*s,0,0,Math.PI);c.fill();c.globalAlpha=1}
  c.strokeStyle=L.beard?'#f3e6dc':'#7a2a2a';c.lineWidth=1.4*s;c.beginPath();
  if(o.brush){c.fillStyle='#fff';ell(c,0,hy+7*s,4.5*s,3*s);c.fill();c.strokeStyle='#4a73c0';c.lineWidth=2*s;c.beginPath();c.moveTo(2*s,hy+7*s);c.lineTo(13*s,hy+2*s+Math.sin(t*25)*2*s);c.stroke()}
  else if(o.dizzy){c.moveTo(-3*s,hy+7*s);c.quadraticCurveTo(0,hy+5*s,3*s,hy+7*s);c.stroke()}
  else{c.arc(0,hy+4*s,3.6*s,.2*Math.PI,.8*Math.PI);c.stroke()}
  if(L.glasses){c.strokeStyle='#1d2b36';c.lineWidth=1.3*s;c.beginPath();c.arc(-5*s,ey,3.8*s,0,Math.PI*2);c.stroke();c.beginPath();c.arc(5*s,ey,3.8*s,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(-1.2*s,ey);c.lineTo(1.2*s,ey);c.stroke()}
  // sersemlik yıldızları
  if(o.dizzy){c.fillStyle='#e39a2d';for(let i=0;i<3;i++){const a=t*3+i*2.09;star(c,Math.cos(a)*14*s,hy-17*s+Math.sin(a)*4*s,3.2*s)}}
  c.restore();
}
function star(c,x,y,r){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr2=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2)}c.closePath();c.fill()}

function drawFloors(c){
  for(const R of ROOMS){const[x,y,w,h]=R.r;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
    if(R.k==='bed'){c.fillStyle='#cfe0ea';c.fillRect(x,y,w,h);c.strokeStyle='#bcd1dd';c.lineWidth=1;for(let yy=y;yy<y+h;yy+=24){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke()}}
    if(R.k==='bath'){c.fillStyle='#eef4f5';c.fillRect(x,y,w,h);c.strokeStyle='#d3e1e5';for(let i=x;i<x+w;i+=22){c.beginPath();c.moveTo(i,y);c.lineTo(i,y+h);c.stroke()}for(let j=y;j<y+h;j+=22){c.beginPath();c.moveTo(x,j);c.lineTo(x+w,j);c.stroke()}}
    if(R.k==='kit'){for(let i=0;i*30<w;i++)for(let j=0;j*30<h;j++){c.fillStyle=(i+j)%2?'#e8d8c2':'#f4ead9';c.fillRect(x+i*30,y+j*30,30,30)}}
    if(R.k==='sal'){c.fillStyle='#e6cda8';c.fillRect(x,y,w,h);c.strokeStyle='#d6b98f';for(let j=0;j*20<h;j++){const yy=y+j*20;c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();for(let i=(j%2)*60;i<w;i+=120){c.beginPath();c.moveTo(x+i,yy);c.lineTo(x+i,yy+20);c.stroke()}}}
    if(R.k==='hall'){c.fillStyle='#dcdfd2';c.fillRect(x,y,w,h);c.strokeStyle='#cbd0bf';for(let i=x;i<x+w;i+=40){c.beginPath();c.moveTo(i,y);c.lineTo(i,y+h);c.stroke()}for(let j=y;j<y+h;j+=40){c.beginPath();c.moveTo(x,j);c.lineTo(x+w,j);c.stroke()}}
    c.restore();
    c.fillStyle='rgba(29,43,54,.38)';c.font='800 11px Nunito,sans-serif';try{c.letterSpacing='1.5px'}catch(e){}
    c.textAlign='left';c.fillText(R.n,x+8,y+h-8);try{c.letterSpacing='0px'}catch(e){}
  }
  // halılar
  c.fillStyle='#efc0a8';ell(c,265,205,70,40);c.fill();c.strokeStyle='#e3a88c';c.lineWidth=3;ell(c,265,205,58,30);c.stroke();
  c.fillStyle='#bcd0e2';rr(c,200,416,240,138,10);c.fill();c.strokeStyle='#a5bdd3';c.lineWidth=3;rr(c,210,426,220,118,6);c.stroke();
  c.fillStyle='#cfe3c4';rr(c,690,340,262,210,14);c.fill();c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.arc(821,445,40,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(821,340);c.lineTo(821,550);c.stroke();
}
// Hava durumu sadece pencerelerden görünür.
function cloud(c,x,y,s,col){c.fillStyle=col;ell(c,x,y,9*s,6*s);c.fill();ell(c,x+8*s,y-3*s,8*s,7*s);c.fill();ell(c,x+16*s,y,9*s,6*s);c.fill()}
function drawWindow(c,x,y,w,h,vertical){
  const t=G.time,m=Math.min(w,h),wx=G.weather;
  c.fillStyle='#ffffff';rr(c,x-4,y-4,w+8,h+8,4);c.fill();
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle=WEATHER[wx].sky;c.fillRect(x,y,w,h);
  if(wx==='gunes'){
    const sx=x+w*.7,sy=y+h*.42,r=m*.22;c.strokeStyle='#ffd35a';c.lineWidth=Math.max(1.5,m*.05);
    for(let i=0;i<8;i++){const a=i*Math.PI/4+t*.3;c.beginPath();c.moveTo(sx+Math.cos(a)*r*1.35,sy+Math.sin(a)*r*1.35);c.lineTo(sx+Math.cos(a)*r*1.85,sy+Math.sin(a)*r*1.85);c.stroke()}
    c.fillStyle='#ffd35a';ell(c,sx,sy,r,r);c.fill();
    cloud(c,x+w*.12+((t*4)%(w*.3)),y+h*.35,Math.min(m/40,2.2),'#ffffff');
    c.fillStyle='#7cc46a';c.fillRect(x,y+h*.86,w,h*.14);
  }else if(wx==='yagmur'){
    const cs=Math.min(m/34,2.2);for(let i=0;i<Math.ceil(w/(26*cs))+1;i++)cloud(c,x+i*26*cs-6,y+h*.1,cs,'#6c7986');
    c.strokeStyle='#e6eef5';c.lineWidth=clamp(m*.035,1,2);const n=Math.min(110,Math.round(w*h/90)),L=clamp(m*.18,5,16);
    for(let i=0;i<n;i++){const px=x+((i*53.7)%w),py=y+((t*h*1.6+i*29.3)%(h+L))-L/2;c.beginPath();c.moveTo(px,py);c.lineTo(px-L*.3,py+L);c.stroke()}
    c.fillStyle='#5f7d8f';c.fillRect(x,y+h*.88,w,h*.12);
  }else{
    const cs=Math.min(m/34,2.2);for(let i=0;i<Math.ceil(w/(26*cs))+1;i++)cloud(c,x+i*26*cs-6,y+h*.1,cs,'#c9d5de');
    c.fillStyle='#ffffff';const n=Math.min(90,Math.round(w*h/140)),r=clamp(m*.035,1.4,3.5);
    for(let i=0;i<n;i++){const px=x+((i*41.3+Math.sin(t*1.3+i)*m*.08)%w),py=y+((t*h*.35+i*17.7)%(h+6))-3;ell(c,px,py,r,r);c.fill()}
    c.fillStyle='#ffffff';c.fillRect(x,y+h*.84,w,h*.16);
  }
  c.restore();
  c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();
  if(vertical){c.moveTo(x,y+h/2);c.lineTo(x+w,y+h/2)}else{c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h)}c.stroke();
  c.strokeStyle='#c9d4dc';c.lineWidth=1;c.strokeRect(x-4,y-4,w+8,h+8);
}
function drawFurniture(c){
  const t=G.time;
  // yatak
  c.fillStyle='#8a6a4f';rr(c,30,28,110,150,8);c.fill();c.fillStyle='#fff';rr(c,36,34,98,138,6);c.fill();
  c.fillStyle='#f3eee4';rr(c,48,40,74,28,8);c.fill();
  if(P.mode!=='sleep'||G.phase==='start'){c.fillStyle='#24589e';rr(c,36,86,98,86,6);c.fill();c.fillStyle='#7a1f33';c.fillRect(36,86,98,10)}
  c.fillStyle='#a07b5a';rr(c,146,64,30,28,4);c.fill();c.fillStyle='#ffe08a';ell(c,161,78,7,7);c.fill();
  // dolap
  c.fillStyle='#9a7454';rr(c,236,22,146,50,4);c.fill();c.strokeStyle='#7d5c41';c.lineWidth=2;c.beginPath();c.moveTo(285,24);c.lineTo(285,70);c.moveTo(334,24);c.lineTo(334,70);c.stroke();
  c.fillStyle='#e9d3a8';[279,291,328,340].forEach(x=>{ell(c,x,52,2.5,2.5);c.fill()});
  // dağınık okul kıyafeti (katlanmadıysa yere saçılır)
  if(hasTask('clothes')&&G.clothT>0){c.fillStyle=childLook(G.outfit==='ev'?'pantolon':G.outfit).shirt||'#7a1f33';c.save();c.translate(250,150);c.rotate(-.4);rr(c,-14,-9,28,18,5);c.fill();c.restore();
    c.fillStyle='#2c3e50';c.save();c.translate(290,130);c.rotate(.6);rr(c,-6,-14,12,28,4);c.fill();c.restore()}
  // masa + sandalye
  c.fillStyle='#b08860';rr(c,22,180,60,100,4);c.fill();c.fillStyle='#fff';c.fillRect(34,210,30,22);c.fillStyle='#4a73c0';c.fillRect(34,240,24,16);
  c.fillStyle='#ffe08a';ell(c,52,192,7,7);c.fill();
  c.fillStyle='#6c7a89';ell(c,106,232,13,13);c.fill();
  // banyo
  c.fillStyle='#cfe8f3';c.fillRect(472,12,66,8);
  c.fillStyle='#dfe7ea';rr(c,468,22,74,38,6);c.fill();c.fillStyle='#b9d3dc';ell(c,505,42,20,11);c.fill();
  c.fillStyle='#4a73c0';c.fillRect(530,26,6,10);c.fillStyle='#f2c230';c.fillRect(476,26,5,10);
  c.fillStyle='#fff';rr(c,410,150,58,136,14);c.fill();c.fillStyle='#bfe0ec';rr(c,416,158,46,120,10);c.fill();
  c.fillStyle='#fff';rr(c,548,214,38,46,10);c.fill();c.fillStyle='#e3ebee';ell(c,567,240,12,13);c.fill();
  // mutfak
  c.fillStyle='#c9b79c';rr(c,606,22,300,44,3);c.fill();c.fillStyle='#e4d6bf';c.fillRect(606,22,300,8);
  c.fillStyle='#596673';[[810,44],[840,44]].forEach(([x,y])=>{ell(c,x,y,10,10);c.fill()});
  c.fillStyle='#b9d3dc';rr(c,660,32,40,26,5);c.fill();
  c.fillStyle='#e8eef1';rr(c,914,22,62,86,5);c.fill();c.fillStyle='#b8c4cc';c.fillRect(922,58,4,22);c.fillRect(916,52,58,2);
  c.fillStyle='#8d6a4c';[[740,116],[800,116],[740,208],[800,208]].forEach(([x,y])=>{rr(c,x,y,30,14,4);c.fill()});
  c.fillStyle='#c08a5a';rr(c,720,128,140,78,10);c.fill();
  c.fillStyle='#fff';ell(c,768,166,16,16);c.fill();c.fillStyle='#d33b3b';ell(c,764,162,5,5);c.fill();c.fillStyle='#5ea84a';ell(c,772,168,5,5);c.fill();c.fillStyle='#f5d547';ell(c,766,172,4,4);c.fill();
  // salon
  c.fillStyle='#9b7b5c';rr(c,270,306,170,26,3);c.fill();['#d24646','#4a73c0','#e39a2d','#2e9a58','#7a1f33','#4a73c0','#e39a2d'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(278+i*22,310,14,18)});
  c.fillStyle='#7a8fb0';rr(c,40,418,80,72,14);c.fill();c.fillStyle='#93a7c6';rr(c,52,426,56,52,10);c.fill();
  c.fillStyle='#5e7fa6';rr(c,230,428,180,58,12);c.fill();c.fillStyle='#4d6d93';rr(c,230,428,180,16,8);c.fill();
  c.fillStyle='#6f90b6';rr(c,240,446,76,34,8);c.fill();rr(c,324,446,76,34,8);c.fill();
  c.fillStyle='#a37b55';rr(c,282,500,76,34,6);c.fill();
  // TV
  const on=P.mode==='tv';
  c.fillStyle='#4a3a30';rr(c,250,576,140,22,3);c.fill();c.fillStyle='#22262b';rr(c,258,566,124,14,3);c.fill();
  if(on){const hue=(Math.floor(t*3)%3);c.fillStyle=['#5fc3e4','#f2c230','#e46b8a'][hue];c.fillRect(262,568,116,10);
    c.fillStyle='rgba(150,210,255,.16)';c.beginPath();c.moveTo(262,566);c.lineTo(378,566);c.lineTo(420,440);c.lineTo(220,440);c.closePath();c.fill()}
  // kumanda
  c.fillStyle='#2b2f36';rr(c,312,508,16,24,4);c.fill();c.fillStyle='#d24646';ell(c,320,514,2.5,2.5);c.fill();
  // beşik ve kardeş
  const cry=!!hasTask('baby'),sh=cry?Math.sin(t*30)*1.5:0;
  c.save();c.translate(sh,0);
  c.fillStyle='#c9a47e';rr(c,40,318,84,56,8);c.fill();c.fillStyle='#fffaf2';rr(c,46,324,72,44,6);c.fill();
  if(born()){c.fillStyle='#f6eee2';rr(c,52,328,26,16,6);c.fill();
    c.fillStyle=S.mom.skin;ell(c,64,336,9,9);c.fill();
    c.fillStyle=S.baby.sex==='erkek'?'#7aa7dd':'#e88aab';c.beginPath();c.ellipse(64,331,9,5,0,Math.PI,0);c.fill();
    c.strokeStyle='#1d2b36';c.lineWidth=1.2;
    if(cry){c.beginPath();c.moveTo(60,334);c.lineTo(62,336);c.moveTo(68,334);c.lineTo(66,336);c.stroke();c.fillStyle='#7a2a2a';ell(c,64,340,2.5,2);c.fill()}
    else{c.beginPath();c.arc(61,336,1.6,0,Math.PI);c.stroke();c.beginPath();c.arc(67,336,1.6,0,Math.PI);c.stroke()}
    c.fillStyle=babyCol();rr(c,58,342,58,24,6);c.fill();c.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<3;i++){ell(c,70+i*14,354,3,3);c.fill()}}
  c.strokeStyle='#a9825c';c.lineWidth=2;for(let x=48;x<=116;x+=8){c.beginPath();c.moveTo(x,366);c.lineTo(x,372);c.stroke()}
  c.restore();
  if(born()&&!cry&&P.mode!=='away'){c.fillStyle='rgba(29,43,54,.55)';c.font='800 13px "Baloo 2",sans-serif';c.textAlign='left';const z=(t*.6)%1;c.globalAlpha=1-z;c.fillText('z',122,326-z*14);c.globalAlpha=1}
  // bitki, ayakkabılık, kapı
  c.fillStyle='#b5734a';ell(c,622,562,16,16);c.fill();c.fillStyle='#4f9a5b';[[612,552],[632,556],[620,570],[626,546]].forEach(([x,y])=>{ell(c,x,y,11,9);c.fill()});
  c.fillStyle='#7b6a5a';rr(c,926,566,48,30,4);c.fill();c.fillStyle='#d24646';rr(c,932,572,14,8,3);c.fill();c.fillStyle='#2b2b33';rr(c,952,572,14,8,3);c.fill();
  c.fillStyle='#8a5a3a';rr(c,968,480,16,80,3);c.fill();c.fillStyle='#e9d3a8';ell(c,972,524,2.5,2.5);c.fill();
  c.fillStyle='#e39a2d';c.font='800 10px Nunito,sans-serif';c.textAlign='center';c.save();c.translate(960,520);c.rotate(-Math.PI/2);c.fillText('KAPI',0,0);c.restore();
}
function drawWalls(c){
  c.fillStyle='#33414d';for(const w of WALLS)c.fillRect(w[0],w[1],w[2],w[3]);
  drawWindow(c,150,6,82,46);drawWindow(c,688,6,112,40);drawWindow(c,6,384,30,92,true);
}
function drawTrap(c,tr){
  const t=G.time,p=1+Math.sin(t*6)*.04;c.save();c.translate(tr.x,tr.y);c.scale(p,p);
  if(tr.type==='chips'){c.fillStyle='#f2c230';c.beginPath();c.moveTo(-12,-14);c.lineTo(12,-14);c.lineTo(14,12);c.lineTo(-14,12);c.closePath();c.fill();c.fillStyle='#d24646';c.fillRect(-13,-4,26,8);c.fillStyle='#fff';c.font='800 6px Nunito';c.textAlign='center';c.fillText('CİPS',0,2)}
  if(tr.type==='choc'){c.fillStyle='#6b3f22';rr(c,-14,-8,28,16,2);c.fill();c.strokeStyle='#4f2c16';c.lineWidth=1;for(let i=-7;i<=7;i+=7){c.beginPath();c.moveTo(i,-8);c.lineTo(i,8);c.stroke()}c.fillStyle='#c0392b';c.fillRect(4,-9,11,18)}
  if(tr.type==='remote'){c.fillStyle='#ffffff';c.globalAlpha=.5+.5*Math.sin(t*5);star(c,12,-12,5);c.globalAlpha=1}
  if(tr.type!=='remote'){c.fillStyle='#ffffff';c.globalAlpha=.4+.6*Math.max(0,Math.sin(t*4));star(c,13,-14,4.5);c.globalAlpha=1}
  if(tr.type==='bed'){}
  c.restore();
}
function bubble(c,x,y,text,warn){
  c.font='800 13px "Baloo 2",Nunito,sans-serif';const words=text.split(' '),lines=[];let cur='';
  for(const w of words){const tst=cur?cur+' '+w:w;if(c.measureText(tst).width>200&&cur){lines.push(cur);cur=w}else cur=tst}lines.push(cur);
  const bw=Math.max(...lines.map(l=>c.measureText(l).width))+20,bh=lines.length*16+12;
  let bx=clamp(x-bw/2,14,W-bw-14),by=y-bh-14;if(by<14)by=14;
  c.fillStyle=warn?'#fff4f2':'#ffffff';c.strokeStyle=warn?'#d24646':'#1d2b36';c.lineWidth=2;rr(c,bx,by,bw,bh,10);c.fill();c.stroke();
  c.beginPath();c.moveTo(clamp(x,bx+12,bx+bw-12)-6,by+bh);c.lineTo(clamp(x,bx+12,bx+bw-12),by+bh+10);c.lineTo(clamp(x,bx+12,bx+bw-12)+6,by+bh);c.fillStyle=warn?'#fff4f2':'#fff';c.fill();c.stroke();
  c.fillStyle=warn?'#b23030':'#1d2b36';c.textAlign='left';lines.forEach((l,i)=>c.fillText(l,bx+10,by+20+i*16));
}
function targetObj(){const order=['baby','brushM','dress','school','clothes','lesson','brushN','sleep'];const t=order.map(hasTask).find(Boolean);return t?OBJ.find(o=>o.id===TARGET[t.id]):null}

function draw(){
  const k=cv.width/W;ctx.setTransform(k,0,0,k,0,0);const c=ctx,t=G.time;
  c.fillStyle='#33414d';c.fillRect(0,0,W,H);
  drawFloors(c);drawFurniture(c);drawWalls(c);
  if(G.trap&&G.trap.type!=='bed')drawTrap(c,G.trap);
  // hedef oku
  const tg=targetObj();if(tg&&!G.overlay&&P.mode!=='ball'){const[x,y,w]=tg.r,ax=x+w/2,ay=Math.max(30,y-6+Math.sin(t*4)*4);
    c.fillStyle='#e39a2d';c.strokeStyle='#1d2b36';c.lineWidth=2;c.beginPath();c.moveTo(ax-10,ay-16);c.lineTo(ax+10,ay-16);c.lineTo(ax,ay);c.closePath();c.fill();c.stroke()}
  // karakterler (y sırasına göre)
  const list=[];
  list.push({y:506,f:()=>drawPerson(c,82,506,born()?Object.assign({},S.mom,{pregnant:false}):S.mom,1.3,{})});
  list.push({y:428,f:()=>drawPerson(c,885,428,S.dad,1.32,{rot:G.ball&&G.ball.ph==='toDad'&&G.ball.p>.8?.08:0})});
  if(!G.ball&&P.mode!=='ball'){list.push({y:432,f:()=>{c.fillStyle='#fff';ell(c,860,428,8,8);c.fill();c.strokeStyle='#1d2b36';c.lineWidth=1.5;c.stroke()}})}
  if(P.mode!=='away'){
    const look=childLook(G.outfit);
    if(P.mode==='sleep'){list.push({y:120,f:()=>{drawPerson(c,85,96,S.child,.95,Object.assign({sit:true,sleep:true},look));c.fillStyle='#24589e';rr(c,36,86,98,86,6);c.fill();c.fillStyle='#7a1f33';c.fillRect(36,86,98,10);
      c.fillStyle='#1d2b36';c.font='800 16px "Baloo 2",sans-serif';c.textAlign='left';const z=(t*.8)%1;c.globalAlpha=1-z;c.fillText('z',112,56-z*20);c.fillText('Z',120,44-z*24);c.globalAlpha=1}})}
    else{const dz=isDizzy(),sit=P.mode==='tv'||P.mode==='sit';
      const px=P.x,py=P.mode==='tv'?470:P.y;
      const bob=P.moving?-Math.abs(Math.sin(t*12))*2:0,wob=dz?Math.sin(t*5)*.2:0;
      list.push({y:py,f:()=>drawPerson(c,px+(dz?Math.sin(t*3)*3:0),py+bob,S.child,1,Object.assign({sit,dizzy:dz,rot:wob,walk:P.moving,brush:P.mode==='brush'},look))});}
  }
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  // top oyunu
  if(G.ball){const B=G.ball,D=[868,420],A=[806,470];let bx,by,hgt=0;
    if(B.ph==='toAta'){const p=clamp(B.p,0,1.12);bx=D[0]+(A[0]-D[0])*p;by=D[1]+(A[1]-D[1])*p;hgt=Math.sin(Math.PI*clamp(p,0,1))*36}
    else if(B.ph==='toDad'){bx=A[0]+(D[0]-A[0])*B.p;by=A[1]+(D[1]-A[1])*B.p;hgt=Math.sin(Math.PI*B.p)*50}
    else{bx=A[0]-70*B.p;by=A[1]+40*B.p}
    const inWin=B.ph==='toAta'&&B.p>=.7&&B.p<=1.12;
    c.strokeStyle=inWin?'#e39a2d':'rgba(29,43,54,.35)';c.lineWidth=inWin?5:3;c.beginPath();c.ellipse(A[0],A[1]+4,26,10,0,0,Math.PI*2);c.stroke();
    c.fillStyle='rgba(20,30,40,.2)';ell(c,bx,by+4,8,3);c.fill();
    c.fillStyle='#fff';ell(c,bx,by-hgt,8,8);c.fill();c.strokeStyle='#1d2b36';c.lineWidth=1.5;c.stroke();c.fillStyle='#1d2b36';ell(c,bx-2,by-hgt-1,2.5,2.5);c.fill();
    bubble(c,830,350,(B.res?B.res+' ':'')+'Tur '+(Math.min(B.round+1,3))+'/3 · Top ayağına gelince VUR!');
  }
  // konuşma balonları
  if(hasTask('baby')&&!G.overlay)bubble(c,82,316,'Ingaa! Ingaa!',true);
  else if(G.trap){const tr=G.trap;if(tr.type==='bed')bubble(c,90,60,up(N())+', 5 DAKİKA DAHA UYU…');else bubble(c,tr.x,tr.y-18,tr.text)}
  else if(!G.overlay){
    const L=hasTask('lesson'),TV=hasTask('tvT');
    if(L&&L.left<12&&$('#modal').hidden)bubble(c,82,410,N()+', kum saati bitiyor, derse otur!');
    else if(TV&&TV.left<5)bubble(c,885,360,'Hadi '+N()+', kapat artık TV’yi!');
  }
  // yüzen yazılar
  for(const f of G.floats){const a=clamp(1-(f.age-1.3)/.5,0,1),yy=f.y-f.age*22;c.globalAlpha=a;c.textAlign='center';
    c.font='800 15px "Baloo 2",sans-serif';c.lineWidth=4;c.strokeStyle='#fff';const fx=clamp(f.x,120,880);c.strokeText(f.t,fx,yy);c.fillStyle=f.c;c.fillText(f.t,fx,yy);
    if(f.sub){c.font='800 12px Nunito,sans-serif';c.strokeText(f.sub,fx,yy+15);c.fillText(f.sub,fx,yy+15)}c.globalAlpha=1}
  // kaplama yazı
  if(G.overlay){const o=G.overlay,a=Math.min(1,o.t/.3,(o.dur-o.t)/.3);c.globalAlpha=Math.max(0,a);c.fillStyle=o.dark?'rgba(18,26,40,.82)':'rgba(29,43,54,.72)';c.fillRect(0,0,W,H);
    c.fillStyle='#fff';c.textAlign='center';c.font='800 48px "Baloo 2",sans-serif';c.fillText(o.text,W/2,H/2-6);
    c.font='700 18px Nunito,sans-serif';c.fillStyle='#f4dcb5';c.fillText(o.sub,W/2,H/2+30);c.globalAlpha=1}
  if(G.paused&&G.phase!=='start'&&$('#modal').hidden){c.fillStyle='rgba(29,43,54,.5)';c.fillRect(0,0,W,H)}
}

