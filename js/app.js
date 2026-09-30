
document.addEventListener("DOMContentLoaded",()=>{const h=document.querySelector("#homeLogo");if(h)h.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));});


const cats=["전체",...new Set(works.map(work=>work[1]).filter(Boolean))];let active="전체";document.querySelector("#seriesCount").textContent=(cats.length-1)+" SERIES";
const img=id=>"https://drive.google.com/thumbnail?id="+id+"&sz=w1200";
function render(){let q=document.querySelector("#q").value.trim();let a=works.filter(w=>(active==="전체"||w[1]===active)&&(!q||w[0].includes(q)||w[1].includes(q)));count.textContent=a.length+" WORKS";gallery.innerHTML=a.map(w=>'<article class="card"><img loading="lazy" src="'+img(w[2])+'" alt="'+w[0]+'"><div class="meta"><b>'+w[0]+'</b><small>'+w[1]+'</small></div></article>').join("")||'<div class="empty">작품이 없습니다.</div>'}
series.innerHTML=cats.slice(1).map(c=>'<button data-series="'+c+'">'+c+'<br><small>'+works.filter(w=>w[1]===c).length+' WORKS</small></button>').join("");
filters.innerHTML=cats.map(c=>'<button data-c="'+c+'" onclick="active=\''+c+'\';sync()">'+c+'</button>').join("");
function sync(){document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b.dataset.c===active));render()}q.addEventListener("input",render);sync();
const seriesDescriptions={크레스트:"동물과 생물의 인상을 날카롭고 대칭적인 문장과 엠블럼으로 압축한 시리즈.",묵수:"먹과 수채의 번짐 속에서 거대한 생명과 작은 인간의 만남을 담는 서정적 판타지 시리즈.",신수:"압도적인 크기의 생명체와 풍경이 하나의 세계처럼 융합되는 회화적 판타지 시리즈.",수채화:"여백과 번짐, 색의 흐름으로 대상과 풍경을 한 장면 안에 녹여내는 수채 일러스트레이션 시리즈.",펄퍼스:"과일과 음식의 특징을 개성 있는 캐릭터 디자인으로 풀어내는 밝고 유쾌한 캐릭터 시리즈.",잉크:"검은 액체와 빛의 대비로 생명체의 형태와 움직임을 재구성한 강렬한 잉크 시리즈.",성수:"거대한 동물과 작은 인간의 스케일 대비로 신화적인 순간을 그리는 시네마틱 판타지 시리즈.",융화:"인간과 동물·생물의 특징이 하나의 존재로 융합되어 새로운 형태로 진화한 캐릭터 시리즈.",여운:"인물과 풍경이 남기는 감정과 순간의 잔상을 한 장면에 담아내는 서정적 일러스트레이션 시리즈.",포근:"작은 생명과 따뜻한 순간을 부드러운 분위기와 이야기로 담아내는 감성 일러스트레이션 시리즈.",유영:"두꺼운 임파스토 물감의 흐름과 작은 동물의 장난스러운 움직임을 결합한 컬러풀한 회화 시리즈.",몽화:"꿈결 같은 색감과 판타지 캐릭터, 섬세한 장식을 카드형 세계관으로 엮어낸 몽환적 일러스트레이션 시리즈."};
const seriesView=document.querySelector("#seriesView"),seriesTitle=document.querySelector("#seriesTitle"),seriesDesc=document.querySelector("#seriesDesc"),seriesGallery=document.querySelector("#seriesGallery"),seriesWorkCount=document.querySelector("#seriesWorkCount");
let crestPage=0;
function renderSeriesGallery(items,isPaged){
  const body=seriesGallery.closest(".series-view-body");
  body.querySelector(".crest-pager")?.remove();
  if(!isPaged){
    seriesGallery.innerHTML=items.map(([n,ss,id])=>`<article class="card"><img src="${img(id)}" alt="${n}" loading="lazy"><div class="meta"><b>${n}</b><small>${ss}</small></div></article>`).join("");
    return;
  }
  const perPage=6,totalPages=Math.max(1,Math.ceil(items.length/perPage));
  crestPage=Math.max(0,Math.min(crestPage,totalPages-1));
  const pageItems=items.slice(crestPage*perPage,crestPage*perPage+perPage);
  seriesGallery.innerHTML=pageItems.map(([n,ss,id])=>`<article class="card"><img src="${img(id)}" alt="${n}" loading="lazy"><div class="meta"><b>${n}</b><small>${ss}</small></div></article>`).join("");
  const pager=document.createElement("div");
  pager.className="crest-pager";
  pager.innerHTML=`<button type="button" class="crest-prev" aria-label="이전 페이지">‹</button><span class="crest-page-indicator">${crestPage+1} / ${totalPages}</span><button type="button" class="crest-next" aria-label="다음 페이지">›</button>`;
  const prev=pager.querySelector(".crest-prev"),next=pager.querySelector(".crest-next");
  prev.disabled=crestPage===0; next.disabled=crestPage>=totalPages-1;
  prev.addEventListener("click",()=>{if(crestPage>0){crestPage--;renderSeriesGallery(items,true)}});
  next.addEventListener("click",()=>{if(crestPage<totalPages-1){crestPage++;renderSeriesGallery(items,true)}});
  body.appendChild(pager);
}
function openSeries(s){const a=works.filter(w=>w[1]===s);seriesTitle.textContent=s;seriesDesc.textContent=seriesDescriptions[s]||"ART ARCHIVE의 "+s+" 시리즈.";seriesWorkCount.textContent=a.length+" WORKS";const isCrest=s==="크레스트",isMuksu=s==="묵수",isShinsu=s==="신수",isWatercolor=s==="수채화",isPulpus=s==="펄퍼스",isInk=s==="잉크",isSeongsu=s==="성수",isFusion=s==="융화",isBrush=s==="붓결",isPogeun=s==="포근",isYeoun=s==="여운",isYuyoung=s==="유영",isMonghwa=s==="몽화",isShowcase=isCrest||isMuksu||isShinsu||isWatercolor||isPulpus||isInk||isSeongsu||isFusion||isBrush||isPogeun||isYeoun||isYuyoung||isMonghwa;seriesView.classList.toggle("crest-mode",isCrest);seriesView.classList.toggle("muksu-mode",isMuksu);seriesView.classList.toggle("shinsu-mode",isShinsu);seriesView.classList.toggle("watercolor-mode",isWatercolor);seriesView.classList.toggle("pulpus-mode",isPulpus);seriesView.classList.toggle("ink-mode",isInk);seriesView.classList.toggle("seongsu-mode",isSeongsu);seriesView.classList.toggle("fusion-mode",isFusion);seriesView.classList.toggle("brush-mode",isBrush);seriesView.classList.toggle("pogeun-mode",isPogeun);seriesView.classList.toggle("yeoun-mode",isYeoun);seriesView.classList.toggle("yuyoung-mode",isYuyoung);seriesView.classList.toggle("monghwa-mode",isMonghwa);crestPage=0;renderSeriesGallery(a,isShowcase);const cf=document.querySelector("#crestFeature");if(isShowcase&&a.length){const x=a[0];cf.hidden=false;cf.innerHTML=`<div class="crest-feature-copy"><h3>${x[0]}</h3></div><div class="crest-feature-art"><img src="${img(x[2])}" alt="${x[0]}"></div>`}else{cf.hidden=true;cf.innerHTML=""}seriesView.classList.add("open");document.body.style.overflow="hidden";}
function closeSeries(){seriesView.classList.remove("open");document.body.style.overflow="";}document.querySelector("#seriesClose").addEventListener("click",closeSeries);document.querySelector("#seriesHome").addEventListener("click",()=>{closeSeries();history.replaceState(null,"",location.pathname);window.scrollTo({top:0,behavior:"smooth"});});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&seriesView.classList.contains("open"))closeSeries()});
document.querySelector("#series").addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.series){document.querySelectorAll("#series button").forEach(x=>x.classList.toggle("active-series",x===b));openSeries(b.dataset.series)}});
const latestWorks=[...cats.slice(1)].map(s=>{for(let i=works.length-1;i>=0;i--){if(works[i][1]===s)return works[i]}return null}).filter(Boolean);
const latestGrid=document.querySelector("#latestGrid");latestGrid.innerHTML=latestWorks.map(([n,s,id])=>`<article class="latest-card" data-id="${id}"><span class="latest-badge">LATEST</span><img src="${img(id)}" alt="${n}" loading="lazy"><div class="latest-meta"><b>${n}</b><small>${s}</small></div></article>`).join("");

const lightbox=document.querySelector("#lightbox"),lightboxImg=document.querySelector("#lightboxImg"),lightboxCaption=document.querySelector("#lightboxCaption"),lightboxPrev=document.querySelector("#lightboxPrev"),lightboxNext=document.querySelector("#lightboxNext");
let lightboxItems=[],lightboxIndex=-1;
function lightboxMeta(im){
  const card=im.closest(".card,.latest-card");
  const title=im.alt||"";
  const seriesName=card?.querySelector(".meta small,.latest-meta small")?.textContent?.trim()||"";
  return {im,title,seriesName};
}
function showLightboxAt(index){
  if(!lightboxItems.length)return;
  lightboxIndex=(index+lightboxItems.length)%lightboxItems.length;
  const item=lightboxItems[lightboxIndex];
  lightboxImg.src=(item.im.currentSrc||item.im.src).replace("sz=w1200","sz=w2400");
  lightboxImg.alt=item.title;
  lightboxCaption.innerHTML='<b>'+item.title+'</b>'+(item.seriesName?'<small>'+item.seriesName+'</small>':'');
  lightboxPrev.disabled=lightboxItems.length<2;
  lightboxNext.disabled=lightboxItems.length<2;
}
document.addEventListener("click",e=>{
 const im=e.target.closest(".card img, .latest-card img");
 if(!im)return;
 const showcaseOpen=!!document.querySelector(".series-view.crest-mode, .series-view.muksu-mode, .series-view.shinsu-mode, .series-view.watercolor-mode, .series-view.pulpus-mode, .series-view.ink-mode, .series-view.seongsu-mode, .series-view.fusion-mode, .series-view.brush-mode, .series-view.pogeun-mode, .series-view.yeoun-mode, .series-view.yuyoung-mode, .series-view.monghwa-mode");
 const inShowcaseGallery=!!im.closest("#seriesGallery");
 if(showcaseOpen&&inShowcaseGallery){
   e.preventDefault();e.stopImmediatePropagation();
   const feature=document.querySelector(".crest-feature-art img");
   if(feature){
     // Use the already-loaded archive thumbnail immediately.
     // The same 1200px Drive image is more than enough for the on-screen feature size,
     // and avoids a second network request that made switching feel slow.
     feature.src=im.currentSrc||im.src;
     feature.alt=im.alt;
   }
   const title=document.querySelector(".crest-feature-copy h3");
   if(title)title.textContent=im.alt||"";
   return;
 }
 const scope=im.closest("#latestGrid")?document.querySelectorAll("#latestGrid .latest-card img"):document.querySelectorAll("#gallery .card img");
 lightboxItems=[...scope].map(lightboxMeta);
 lightboxIndex=lightboxItems.findIndex(x=>x.im===im);
 showLightboxAt(lightboxIndex<0?0:lightboxIndex);
 lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
});
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");lightboxImg.src="";lightboxItems=[];lightboxIndex=-1;document.body.style.overflow="";}
lightbox.addEventListener("click",e=>{if(e.target===lightbox||e.target.closest(".close"))closeLightbox()});
lightboxPrev.addEventListener("click",e=>{e.stopPropagation();if(lightboxItems.length>1)showLightboxAt(lightboxIndex-1)});
lightboxNext.addEventListener("click",e=>{e.stopPropagation();if(lightboxItems.length>1)showLightboxAt(lightboxIndex+1)});
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("open"))return;
  if(e.key==="Escape")closeLightbox();
  if(e.key==="ArrowLeft"&&lightboxItems.length>1)showLightboxAt(lightboxIndex-1);
  if(e.key==="ArrowRight"&&lightboxItems.length>1)showLightboxAt(lightboxIndex+1);
});

const dashSeries=["펄퍼스","잉크","수채화","크레스트","성수","묵수","신수"];
const show=v=>v===null||v===undefined?"—":v;
function pct(v){return v===null||v===undefined?null:Math.max(0,Math.min(100,Number(v)))}
function resetText(v){if(!v)return "";const d=new Date(v);return isNaN(d)?"":" · 초기화 "+d.toLocaleString("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}
async function loadStatus(){try{const r=await fetch("automation-status.json?ts="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error();const s=await r.json();mDone.textContent=show(s.todayTotal);mAttempts.textContent=show(s.todayAttempts);mRegens.textContent=show(s.todayRegenerations);mAvg.textContent=s.avgAttemptsPerArtwork==null?"—":Number(s.avgAttemptsPerArtwork).toFixed(2);if(s.todayAttempts!=null&&s.todayRegenerations!=null&&s.todayAttempts>0)mRegenRate.textContent="재생성률 "+Math.round(s.todayRegenerations/s.todayAttempts*100)+"%";const map=new Map((s.series||[]).map(x=>[x.name,x]));seriesStatus.innerHTML=dashSeries.map(n=>{const x=map.get(n)||{};return '<div class="series-stat"><b>'+n+'</b>오늘 '+show(x.todayCount)+'장<br>시도 '+show(x.todayAttempts)+'회<br>재생성 '+show(x.todayRegenerations)+'회</div>'}).join("");statusNote.textContent=s.updatedAt?"마지막 자동화 집계: "+new Date(s.updatedAt).toLocaleString("ko-KR")+" · 예정 "+show(s.dailyPlanned)+"장/일":"실측 데이터 대기 중 · 예정 "+show(s.dailyPlanned)+"장/일";}catch(e){statusNote.textContent="상태 데이터를 불러오지 못했습니다.";seriesStatus.innerHTML=dashSeries.map(n=>'<div class="series-stat"><b>'+n+'</b>데이터 대기</div>').join("")}}

let statusTimer=null;
async function sha256(v){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const ADMIN_ID_HASH="8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
const ADMIN_PW_HASH="47c5fbf51c636da0b48309ad799e2e4d0443b9c25b055c6b762d6b6f6d95fc52";
function openAdmin(){adminModal.classList.add("open");adminModal.setAttribute("aria-hidden","false");setTimeout(()=>adminId.focus(),0)}
function closeAdmin(){adminModal.classList.remove("open");adminModal.setAttribute("aria-hidden","true");loginError.textContent="";adminForm.reset()}
function unlockAdmin(){control.hidden=false;adminBtn.textContent="ADMIN ✓";sessionStorage.setItem("artAdmin","1");loadStatus();if(!statusTimer)statusTimer=setInterval(loadStatus,60000);setTimeout(()=>control.scrollIntoView({behavior:"smooth"}),50)}
adminBtn.addEventListener("click",()=>sessionStorage.getItem("artAdmin")==="1"?control.scrollIntoView({behavior:"smooth"}):openAdmin());
adminCancel.addEventListener("click",closeAdmin);adminModal.addEventListener("click",e=>{if(e.target===adminModal)closeAdmin()});
adminForm.addEventListener("submit",async e=>{e.preventDefault();const [u,p]=await Promise.all([sha256(adminId.value),sha256(adminPw.value)]);if(u===ADMIN_ID_HASH&&p===ADMIN_PW_HASH){closeAdmin();unlockAdmin()}else{loginError.textContent="아이디 또는 비밀번호가 올바르지 않습니다.";adminPw.value="";adminPw.focus()}});
if(sessionStorage.getItem("artAdmin")==="1")unlockAdmin();



/* archive UI navigation v2 */
const mainNavLinks=[...document.querySelectorAll("header .nav a")];
function setMainNavActive(key){
  mainNavLinks.forEach(link=>{
    const href=link.getAttribute("href");
    const activeNow=(key==="home"&&href==="#")||(key==="collection"&&href==="#collection")||(key==="works"&&href==="#works");
    link.classList.toggle("active",activeNow);
    if(activeNow)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");
  });
}
function syncMainNav(){
  const y=window.scrollY+window.innerHeight*.32;
  const collectionTop=document.querySelector("#collection")?.offsetTop??Infinity;
  const worksTop=document.querySelector("#works")?.offsetTop??Infinity;
  if(y>=worksTop)setMainNavActive("works");
  else if(y>=collectionTop)setMainNavActive("collection");
  else setMainNavActive("home");
}
const scrollTopBtn=document.querySelector("#scrollTopBtn");
function syncScrollTop(){
  if(scrollTopBtn)scrollTopBtn.classList.toggle("show",window.scrollY>520&&!seriesView.classList.contains("open"));
}
window.addEventListener("scroll",()=>{syncMainNav();syncScrollTop()},{passive:true});
window.addEventListener("resize",syncMainNav);
scrollTopBtn?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
syncMainNav();syncScrollTop();


/* UI motion v1 */
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealElements(elements,{stagger=45,threshold=.12}={}){
  const els=[...elements].filter(Boolean);
  if(!els.length)return;
  if(reduceMotion){
    els.forEach(el=>el.classList.add("reveal-in"));
    return;
  }
  els.forEach(el=>el.classList.add("reveal-ready"));
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const idx=els.indexOf(entry.target);
      setTimeout(()=>{
        entry.target.classList.add("reveal-in");
        entry.target.classList.remove("reveal-ready");
      },Math.max(0,idx)*stagger);
      io.unobserve(entry.target);
    });
  },{threshold,rootMargin:"0px 0px -6% 0px"});
  els.forEach(el=>io.observe(el));
}

function applyArchiveReveals(){
  revealElements(document.querySelectorAll("#collection>.eyebrow,#collection>h2"),{stagger:70,threshold:.2});
  revealElements(document.querySelectorAll("#series button"),{stagger:50,threshold:.08});
  revealElements(document.querySelectorAll("#latest .latest-head"),{stagger:0,threshold:.18});
  revealElements(document.querySelectorAll("#latestGrid .latest-card"),{stagger:55,threshold:.08});
  revealElements(document.querySelectorAll("#works>.eyebrow,#works>h2,#works>.toolbar,#works>#count"),{stagger:60,threshold:.16});
  revealElements(document.querySelectorAll("#gallery .card"),{stagger:35,threshold:.05});
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",applyArchiveReveals,{once:true});
}else{
  applyArchiveReveals();
}

const archiveGalleryObserver=new MutationObserver(()=>{
  if(reduceMotion)return;
  const fresh=[...document.querySelectorAll("#gallery .card")].filter(el=>!el.classList.contains("reveal-ready")&&!el.classList.contains("reveal-in"));
  if(fresh.length)revealElements(fresh,{stagger:28,threshold:.04});
});
archiveGalleryObserver.observe(document.querySelector("#gallery"),{childList:true});


/* PC intro motion v2 */
(function(){
  const desktop=window.matchMedia("(min-width:1100px)").matches;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body=document.body;
  const hero=document.querySelector(".hero");
  const cue=document.querySelector(".hero-scroll");

  function markImageReady(im){
    if(im.complete) requestAnimationFrame(()=>im.classList.add("img-ready"));
    else im.addEventListener("load",()=>im.classList.add("img-ready"),{once:true});
  }
  function wireHomeImages(root=document){
    root.querySelectorAll?.("#latestGrid .latest-card img,#gallery .card img").forEach(markImageReady);
  }

  if(!desktop||reduced){
    body.classList.remove("intro-pending");
    wireHomeImages();
    return;
  }

  const alreadyShown=sessionStorage.getItem("artArchiveIntroShown")==="1";
  if(alreadyShown){
    body.classList.remove("intro-pending");
  }else{
    requestAnimationFrame(()=>{
      body.classList.remove("intro-pending");
      body.classList.add("intro-run");
      sessionStorage.setItem("artArchiveIntroShown","1");
      setTimeout(()=>body.classList.remove("intro-run"),6800);
    });
  }

  function syncHeroMotion(){
    const y=window.scrollY;
    hero?.classList.toggle("hero-shifted",y>32&&y<420);
    cue?.classList.toggle("is-hidden",y>72);
  }
  window.addEventListener("scroll",syncHeroMotion,{passive:true});
  syncHeroMotion();
  wireHomeImages();

  const imageObserver=new MutationObserver(records=>{
    records.forEach(r=>r.addedNodes.forEach(node=>{
      if(node.nodeType!==1)return;
      if(node.matches?.("#gallery .card,#latestGrid .latest-card")) node.querySelectorAll("img").forEach(markImageReady);
      else wireHomeImages(node);
    }));
  });
  const galleryRoot=document.querySelector("#gallery");
  if(galleryRoot)imageObserver.observe(galleryRoot,{childList:true});
})();
