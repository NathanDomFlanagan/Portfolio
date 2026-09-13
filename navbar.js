// navbar.js — Shared navigation + theme toggle, injected into every page.
// Keeps the nav markup and toggle behaviour in one place instead of
// copy-pasted across every HTML file.

(function () {
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'game.html', label: 'Games' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'resume.html', label: 'Resume' },
  ];

  // localStorage throws in Safari private mode and wherever site data is
  // blocked, so every access is guarded. A forgetful toggle beats a script
  // that dies half-way through wiring up the page.
  function readStored(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeStored(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* preference just won't persist */
    }
  }

  // GitHub Pages serves 404.html for ANY unmatched path, so a relative href in
  // the injected nav would resolve against that bogus path (/Portfolio/a/b/)
  // and 404 in turn. This script is always served from the site root, so
  // resolve every link against the directory it came from instead.
  const siteRoot = new URL('.', document.currentScript ? document.currentScript.src : window.location.href);
  const url = (path) => new URL(path, siteRoot).href;

  // Figure out which page we're on, relative to the site root
  const path = window.location.pathname;
  const currentPage = (path.startsWith(siteRoot.pathname)
    ? path.slice(siteRoot.pathname.length)
    : path.split('/').pop()) || 'index.html';

  // Keyboard users land here first, so it has to come before the nav
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to content';

  // Build navbar HTML
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a class="nav-brand" href="${url('index.html')}">Nathan.</a>
    <ul class="nav-links" id="nav-links">
      ${links.map(link => `
        <li><a href="${url(link.href)}"${link.href === currentPage ? ' class="active" aria-current="page"' : ''}>${link.label}</a></li>
      `).join('')}
    </ul>
    <div class="nav-right">
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Dark mode">◐</button>
      <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-links">&#9776;</button>
    </div>
  `;

  // Insert at the very top of body
  const frag = document.createDocumentFragment();
  frag.appendChild(skip);
  frag.appendChild(nav);
  document.body.insertBefore(frag, document.body.firstChild);

  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function menuOpen() {
    return navLinks.classList.contains('open');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(menuOpen()));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Above 600px the toggle is display:none and the links show unconditionally,
  // so a menu left open would strand aria-expanded="true" on a button that is
  // no longer there — the markup would claim an expanded menu that the visitor
  // has no way to collapse.
  const mobile = window.matchMedia('(max-width: 600px)');
  mobile.addEventListener('change', function (e) {
    if (!e.matches) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen()) {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (menuOpen() && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Theme toggle. The initial theme is already applied by the inline head
  // script (for a saved choice) or by the prefers-color-scheme media query
  // (for everyone else), so there is nothing to apply here on load.
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    if (root.hasAttribute('data-theme')) return root.getAttribute('data-theme');
    return systemDark.matches ? 'dark' : 'light';
  }

  // Reflects the active theme on the button and deliberately does NOT write to
  // localStorage. Persisting on load would freeze whatever the OS happened to
  // prefer on a first visit into an explicit choice the visitor never made,
  // permanently opting them out of the auto light/dark media query.
  //
  // Only aria-pressed moves. The label stays the fixed "Dark mode" set in the
  // markup: a toggle button's name has to describe the thing being toggled, so
  // that aria-pressed reads as its state. Swapping the label to describe the
  // action instead would announce "switch to light mode, pressed", which states
  // the opposite of what the button is currently doing.
  function syncButton() {
    const dark = currentTheme() === 'dark';
    themeBtn.textContent = dark ? '◑' : '◐';
    themeBtn.setAttribute('aria-pressed', String(dark));
  }

  syncButton();

  themeBtn.addEventListener('click', function () {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    writeStored('theme', next);
    syncButton();
  });

  // Keep following the OS for as long as the visitor hasn't chosen for themselves
  systemDark.addEventListener('change', function () {
    if (!readStored('theme')) syncButton();
  });
})();
