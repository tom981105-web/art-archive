/* ART ARCHIVE live data refresh v1
 * Polls js/works.js without reloading the whole page.
 * When the work list changes, refreshes collection counts, latest works,
 * archive gallery, and an open series view.
 */
(function(){
  const POLL_MS = 45000;
  let busy = false;
  let lastSignature = makeSignature(works);

  function makeSignature(list){
    return list.map(w => [w[0],w[1],w[2]].join("|")).join("\n");
  }

  function parseWorksScript(text){
    const m = text.match(/const\s+works\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
    if(!m) throw new Error("works.js 형식을 해석하지 못했습니다.");
    const parsed = JSON.parse(m[1]);
    if(!Array.isArray(parsed)) throw new Error("works 데이터가 배열이 아닙니다.");
    return parsed;
  }

  function shuffleInto(target, source){
    const a = [...source];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    target.splice(0,target.length,...a);
  }

  function rebuildCategoryUI(){
    const nextCats=["전체",...new Set(works.map(work=>work[1]).filter(Boolean))];
    cats.splice(0,cats.length,...nextCats);
    if(!cats.includes(active)) active="전체";

    const seriesCount=document.querySelector("#seriesCount");
    if(seriesCount) seriesCount.textContent=(cats.length-1)+" SERIES";

    const seriesEl=document.querySelector("#series");
    if(seriesEl){
      seriesEl.innerHTML=cats.slice(1).map(c =>
        '<button data-series="'+c+'">'+c+'<br><small>'+
        works.filter(w=>w[1]===c).length+' WORKS</small></button>'
      ).join("");
    }

    const filtersEl=document.querySelector("#filters");
    if(filtersEl){
      filtersEl.innerHTML=cats.map(c =>
        '<button data-c="'+c+'" onclick="active=\''+c+'\';sync()">'+c+'</button>'
      ).join("");
    }
  }

  function rebuildLatest(){
    const latest=[...cats.slice(1)].map(s=>{
      for(let i=works.length-1;i>=0;i--){
        if(works[i][1]===s) return works[i];
      }
      return null;
    }).filter(Boolean);

    const grid=document.querySelector("#latestGrid");
    if(!grid) return;
    grid.innerHTML=latest.map(([n,s,id]) =>
      '<article class="latest-card" data-id="'+id+'">'+
      '<span class="latest-badge">LATEST</span>'+
      '<img src="'+img(id)+'" alt="'+n+'" loading="lazy">'+
      '<div class="latest-meta"><b>'+n+'</b><small>'+s+'</small></div>'+
      '</article>'
    ).join("");
  }

  function refreshVisibleUI(){
    rebuildCategoryUI();
    shuffleInto(archiveMixedOrder,works);
    sync();
    rebuildLatest();

    if(seriesView?.classList.contains("open")){
      const current=seriesTitle?.textContent?.trim();
      if(current) openSeries(current);
    }

    if(typeof applyArchiveReveals==="function") applyArchiveReveals();
  }

  async function checkForUpdates(){
    if(busy) return;
    busy=true;
    try{
      const r=await fetch("js/works.js?live="+Date.now(),{
        cache:"no-store",
        headers:{"Cache-Control":"no-cache"}
      });
      if(!r.ok) throw new Error("works.js HTTP "+r.status);
      const next=parseWorksScript(await r.text());
      const sig=makeSignature(next);
      if(sig===lastSignature) return;

      works.splice(0,works.length,...next);
      lastSignature=sig;
      refreshVisibleUI();
      document.dispatchEvent(new CustomEvent("artarchive:works-updated",{
        detail:{count:works.length,updatedAt:new Date().toISOString()}
      }));
    }catch(err){
      console.warn("[ART ARCHIVE] 자동 갱신 확인 실패:",err);
    }finally{
      busy=false;
    }
  }

  setInterval(checkForUpdates,POLL_MS);

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible") checkForUpdates();
  });

  window.addEventListener("focus",checkForUpdates);
  window.addEventListener("online",checkForUpdates);

  // GitHub Pages/Apps Script 반영 직후 접속한 경우도 빠르게 한 번 확인.
  setTimeout(checkForUpdates,8000);
})();
