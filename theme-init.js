// theme-init.js — Shared "avoid a flash of the wrong theme" script, loaded as a
// plain blocking <script src> in every page's <head> (same execution timing as
// an inline script) so the saved theme is applied before first paint.
// localStorage throws wherever site data is blocked, and an uncaught throw
// here would leave the page stuck on whatever prefers-color-scheme picked.
try {
  var saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
} catch (e) {
  /* fall back to prefers-color-scheme */
}
