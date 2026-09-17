// storage.js — Shared localStorage helpers used by navbar.js, snake.js, and
// random.js. localStorage throws in Safari private mode and wherever site data
// is blocked, so every access goes through these guarded wrappers instead of a
// bare call that could crash the calling script.
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
    /* preference/score just won't persist */
  }
}
