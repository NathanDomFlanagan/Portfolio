// lightbox.js — Opens project screenshots in an overlay instead of navigating
// away. The thumbnail links keep a real href, so middle-click / ctrl-click /
// right-click "open in new tab" still work as a natural fallback.

(function () {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const imgEl = document.getElementById('lightbox-img');
  const openLink = document.getElementById('lightbox-open');
  const closeBtn = document.getElementById('lightbox-close');
  let lastFocused = null;

  function openLightbox(thumb) {
    const img = thumb.querySelector('img');
    imgEl.src = thumb.getAttribute('href');
    imgEl.alt = img ? img.alt : '';
    openLink.href = thumb.getAttribute('href');
    lastFocused = thumb;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.hidden = true;
    imgEl.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.project-thumb[href]').forEach(function (thumb) {
    thumb.addEventListener('click', function (e) {
      // Let the browser handle new-tab/new-window requests natively
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      openLightbox(thumb);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeLightbox();
  });
})();
