// ART ARCHIVE — Mobile UI V1 navigation
(() => {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
  const nav = document.createElement('nav');
  nav.className = 'mobile-nav';
  nav.setAttribute('aria-label', '모바일 빠른 메뉴');
  nav.innerHTML = `
    <button type="button" data-target="top"><span>⌂</span>HOME</button>
    <button type="button" data-target="collection"><span>▦</span>SERIES</button>
    <button type="button" data-target="works"><span>⌕</span>ARCHIVE</button>`;
  document.body.appendChild(nav);

  nav.addEventListener('click', e => {
    const button = e.target.closest('button[data-target]');
    if (!button) return;
    const target = button.dataset.target;
    if (target === 'top') {
      window.scrollTo({top:0,behavior:'smooth'});
      return;
    }
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
  });

  // Keep the mobile navigation out of the artwork lightbox.
  const syncNav = () => {
    if (!isMobile()) { nav.style.display = ''; return; }
    const lightboxOpen = document.getElementById('lightbox')?.classList.contains('open');
    nav.style.visibility = lightboxOpen ? 'hidden' : 'visible';
  };
  new MutationObserver(syncNav).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','aria-hidden']});
  window.addEventListener('resize',syncNav,{passive:true});
  syncNav();
})();
