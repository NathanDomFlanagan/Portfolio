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
    // removeAttribute, not src = '' — an empty src resolves to the current
    // document URL, so the browser re-requests the whole page behind the scenes.
    imgEl.removeAttribute('src');
    imgEl.alt = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  // The overlay claims aria-modal, so Tab has to stay inside it — otherwise
  // focus walks straight out into the page hidden behind it.
  function trapFocus(e) {
    const items = overlay.querySelectorAll('a[href], button');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (!overlay.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.querySelectorAll('.project-thumb[href]').forEach(function (thumb) {
    thumb.addEventListener('click', function (e) {
      // Let the browser handle new-tab/new-window requests natively. Middle
      // click needs no check here — it fires auxclick, never click, so it
      // reaches the browser untouched already.
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      openLightbox(thumb);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'Tab') trapFocus(e);
  });
})();
