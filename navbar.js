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
  ];

  // Figure out which page we're on
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Build navbar HTML
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a class="nav-brand" href="index.html">Nathan.</a>
    <ul class="nav-links" id="nav-links">
      ${links.map(link => `
        <li><a href="${link.href}" ${link.href === currentPage ? 'class="active"' : ''}>${link.label}</a></li>
      `).join('')}
    </ul>
    <div class="nav-right">
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">◐</button>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">&#9776;</button>
    </div>
  `;

  // Insert at the very top of body
  document.body.insertBefore(nav, document.body.firstChild);

  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // Theme toggle (the initial theme is already applied by the inline
  // head script, so this just wires up the button and keeps it in sync)
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function getTheme() {
    if (root.hasAttribute('data-theme')) return root.getAttribute('data-theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeBtn.textContent = theme === 'dark' ? '◑' : '◐';
  }

  applyTheme(getTheme());
  themeBtn.addEventListener('click', function () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
})();
