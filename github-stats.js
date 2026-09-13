// github-stats.js — Points every .reactive-embed image at its light or dark
// variant to match the page's current theme, the same way navbar.js decides
// the theme: an explicit data-theme attribute wins, otherwise it follows the
// OS preference — and both are watched so the images update live.

(function () {
  const images = document.querySelectorAll('.reactive-embed');
  if (!images.length) return;

  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    if (root.hasAttribute('data-theme')) return root.getAttribute('data-theme') === 'dark';
    return systemDark.matches;
  }

  function updateAll() {
    const src = isDark() ? 'srcDark' : 'srcLight';
    images.forEach(function (img) {
      img.src = img.dataset[src];
    });
  }

  updateAll();

  new MutationObserver(updateAll).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  systemDark.addEventListener('change', updateAll);
})();
