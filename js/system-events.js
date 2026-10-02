const eventClass=level=>level==='error'||level==='failure'?'bad':level==='warning'||level==='cancelled'?'warn':level==='success'?'good':'neutral';
const eventFmt=v=>v?new Date(v).toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}):'—';
async function loadSystemEvents(){
  const log=document.querySelector('#eventLog'),sync=document.querySelector('#eventSync');
  if(!log||!sync)return;
  try{
    const headers={Accept:'application/vnd.github+json'};
    const [er,ar]=await Promise.all([
      fetch('system-events.json?ts='+Date.now(),{cache:'no-store'}),
      fetch('https://api.github.com/repos/tom981105-web/art-archive/actions/runs?per_page=12',{headers})
    ]);
    const local=er.ok?await er.json():{events:[]};
    const actions=ar.ok?await ar.json():{workflow_runs:[]};
    const deploy=(actions.workflow_runs||[]).map(x=>({
      at:x.updated_at||x.created_at,
      service:'GitHub Pages',
      level:x.conclusion==='success'?'success':x.conclusion==='cancelled'?'warning':x.status==='completed'?'error':'info',
      status:x.conclusion||x.status,
      title:'Deploy '+String(x.conclusion||x.status).toUpperCase(),
      message:(x.head_commit&&x.head_commit.message)||x.head_sha
    }));
    const merged=[...(local.events||[]),...deploy].sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,30);
    sync.textContent='EVENT SYNC '+eventFmt(local.updatedAt||new Date());
    log.innerHTML=merged.map(e=>`<div class="event"><time>${eventFmt(e.at)}</time><span class="tag">${e.service||'SYSTEM'}</span><b>${e.title||e.status||'Event'}<small style="display:block;color:#65706d;font-weight:400;margin-top:4px">${e.message||''}</small></b><em class="${eventClass(e.level)}">${String(e.status||e.level||'INFO').toUpperCase()}</em></div>`).join('')||'<p class="muted">기록된 시스템 이벤트가 없습니다.</p>';
  }catch(e){
    sync.textContent='EVENT DATA ERROR';
    log.innerHTML='<p class="muted">이벤트 이력을 불러오지 못했습니다.</p>';
  }
}
loadSystemEvents();
setInterval(loadSystemEvents,60000);
