// github-stats.js — Points the GitHub stats card at a light/dark variant
// matching the page's current theme, and keeps it in sync the same way
// navbar.js does: an explicit data-theme attribute wins, otherwise it follows
// the OS preference, and both are watched so the card updates live.

(function () {
  const card = document.getElementById('github-stats-card');
  if (!card) return;

  const USERNAME = 'NathanDomFlanagan';
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    if (root.hasAttribute('data-theme')) return root.getAttribute('data-theme') === 'dark';
    return systemDark.matches;
  }

  function updateCard() {
    const dark = isDark();
    const params = new URLSearchParams({
      username: USERNAME,
      show_icons: 'true',
      hide_border: 'true',
      theme: dark ? 'dark' : 'default',
      bg_color: dark ? '111110' : 'ffffff',
      title_color: dark ? 'f0f0ee' : '111110',
      text_color: dark ? '8a8a86' : '6e6e6b',
      icon_color: dark ? '8a8a86' : '6e6e6b'
    });
    card.src = 'https://github-readme-stats.vercel.app/api?' + params.toString();
  }

  updateCard();

  new MutationObserver(updateCard).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  systemDark.addEventListener('change', updateCard);
})();
