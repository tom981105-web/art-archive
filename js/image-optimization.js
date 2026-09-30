// ART ARCHIVE image loading optimization
// Keeps existing gallery logic intact while reducing initial Drive thumbnail bandwidth.
(() => {
  const THUMB_WIDTH = 720;
  const FEATURE_WIDTH = 1200;
  const LIGHTBOX_WIDTH = 2400;

  const resizeDriveImage = (url, width) => {
    if (!url || !url.includes('drive.google.com/thumbnail')) return url;
    if (/([?&])sz=w\d+/.test(url)) return url.replace(/([?&])sz=w\d+/, `$1sz=w${width}`);
    return url + (url.includes('?') ? '&' : '?') + `sz=w${width}`;
  };

  const optimizeImage = img => {
    if (!(img instanceof HTMLImageElement)) return;
    if (img.id === 'lightboxImg' || img.closest('.crest-feature-art')) return;
    if (!img.matches('.card img, .latest-card img')) return;
    const src = img.getAttribute('src');
    const optimized = resizeDriveImage(src, THUMB_WIDTH);
    if (optimized && optimized !== src) img.setAttribute('src', optimized);
    img.loading = 'lazy';
    img.decoding = 'async';
  };

  const optimizeTree = root => {
    if (root instanceof HTMLImageElement) optimizeImage(root);
    root.querySelectorAll?.('.card img, .latest-card img').forEach(optimizeImage);
  };

  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) optimizeTree(node);
      });
    }
  });

  const start = () => {
    optimizeTree(document);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  // Existing app.js handles the click first. This listener then upgrades only the
  // image that actually needs a larger rendition.
  document.addEventListener('click', event => {
    const img = event.target.closest?.('.card img, .latest-card img');
    if (!img) return;

    const inSeriesGallery = !!img.closest('#seriesGallery');
    const feature = document.querySelector('.crest-feature-art img');
    if (inSeriesGallery && feature) {
      feature.src = resizeDriveImage(img.currentSrc || img.src, FEATURE_WIDTH);
      feature.decoding = 'async';
      return;
    }

    const lightboxImg = document.querySelector('#lightboxImg');
    const lightbox = document.querySelector('#lightbox');
    if (lightboxImg && lightbox?.classList.contains('open')) {
      lightboxImg.src = resizeDriveImage(img.currentSrc || img.src, LIGHTBOX_WIDTH);
      lightboxImg.decoding = 'async';
    }
  });
})();
