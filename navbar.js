// navbar.js — Shared navigation, injected into every page automatically.
// No need to copy-paste nav HTML across files anymore.

(function () {
  const links = [
    { href: 'index.html',    label: 'Home' },
    { href: 'about.html',   label: 'About' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'game.html',    label: 'Games' },
    { href: 'contact.html', label: 'Contact' },
  ];

  // Figure out which page we're on
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Build navbar HTML
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a class="nav-brand" href="index.html">Nathan<span class="accent">.</span></a>
    <ul class="nav-links" id="nav-links">
      ${links.map(link => `
        <li>
          <a href="${link.href}" ${link.href === currentPage ? 'class="active"' : ''}>
            ${link.label}
          </a>
        </li>
      `).join('')}
    </ul>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">&#9776;</button>
  `;

  // Insert at the very top of body
  document.body.insertBefore(nav, document.body.firstChild);

  // Mobile menu toggle
  document.getElementById('nav-toggle').addEventListener('click', function () {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('open');
    this.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.getElementById('nav-links').classList.remove('open');
    });
  });
})();
