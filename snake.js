(function () {
const canvas = document.getElementById('gameCanvas');
if (!canvas) return;

const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snake-score');
const bestEl = document.getElementById('snake-best');
const statusEl = document.getElementById('snake-status');
const controlsEl = document.querySelector('.snake-controls');

const GRID = 10;
const SNAKE_COLOUR = 'green';
const FOOD_COLOUR = 'red';
const BASE_SPEED = 100;

const START_SNAKE = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

// The on-screen D-pad only renders under (pointer: coarse) — which is exactly
// the set of devices with no E key — so every prompt has to name whichever
// control the player can actually reach.
const coarsePointer = window.matchMedia('(pointer: coarse)');
function resumeHint() {
  return coarsePointer.matches ? 'Tap ⏯ to' : 'Press E to';
}

let snake = [];
let food = { x: 0, y: 0 };
let score = 0;
let direction = 'right';     // the direction actually applied on the last tick
let nextDirection = 'right'; // queued input, applied once per tick
let paused = true;
let dead = false;
let speed = BASE_SPEED;
let timer = null;

// localStorage throws in private browsing and with site data blocked, and an
// uncaught throw in here would take the whole game loop down with it.
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
    /* high score just won't persist */
  }
}

function updateScore() {
  scoreEl.textContent = 'Score: ' + score;
}

function updateBestDisplay() {
  const best = readStored('snake-best');
  bestEl.textContent = best ? 'Best: ' + best : '';
}

function setStatus(text) {
  statusEl.textContent = text;
}

// Only accept a turn if it isn't a direct reversal of the snake's actual
// last movement — validating against a queued-but-not-yet-applied direction
// would let two quick 90-degree turns add up to an effective 180 reversal.
function requestDirection(dir) {
  if (dir !== OPPOSITE[direction]) {
    nextDirection = dir;
  }
}

// Pick a food tile that isn't currently under the snake
function spawnFood() {
  const cols = canvas.width / GRID;
  const rows = canvas.height / GRID;
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * cols) * GRID,
      y: Math.floor(Math.random() * rows) * GRID
    };
  } while (snake.some(segment => segment.x === pos.x && segment.y === pos.y));
  return pos;
}

function resetGame() {
  snake = START_SNAKE.map(seg => ({ ...seg }));
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  speed = BASE_SPEED;
  dead = false;
  food = spawnFood();
  updateScore();
}

// Advance one tick. Movement and collision resolve BEFORE anything is painted,
// so the frame on screen is always the current state rather than a tick behind.
// On a wall death the head ends up outside the canvas and is simply clipped, so
// the final frame shows the snake stopped at the edge rather than the impact.
function step() {
  direction = nextDirection;

  // Drag each segment into the position of the one ahead of it, then move the head
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = { ...snake[i - 1] };
  }

  const head = snake[0];
  if (direction === 'right') head.x += GRID;
  else if (direction === 'left') head.x -= GRID;
  else if (direction === 'up') head.y -= GRID;
  else if (direction === 'down') head.y += GRID;

  // Wall or self
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
      checkCollision(head, snake.slice(1))) {
    gameOver();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    snake.push({ ...snake[snake.length - 1] });
    food = spawnFood();
    speed = Math.max(50, BASE_SPEED - Math.floor(score / 5) * 5);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = SNAKE_COLOUR;
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, GRID, GRID);
  }

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x, food.y, GRID, GRID);
}

// The board is left exactly as it died — it only resets when the player
// restarts, so they can see what they ran into.
function gameOver() {
  const best = readStored('snake-best');
  if (!best || score > Number(best)) {
    writeStored('snake-best', String(score));
    updateBestDisplay();
  }
  dead = true;
  paused = true;
  setStatus('Game over! Score: ' + score + '. ' + resumeHint() + ' play again.');
}

function loop() {
  step();
  draw();
  timer = paused ? null : setTimeout(loop, speed);
}

function startLoop() {
  if (timer === null) timer = setTimeout(loop, speed);
}

function stopLoop() {
  clearTimeout(timer);
  timer = null;
}

function togglePause() {
  if (dead) {
    resetGame();
    paused = false;
    setStatus('');
    draw();
    startLoop();
    return;
  }

  paused = !paused;
  setStatus(paused ? 'Paused. ' + resumeHint() + ' resume.' : '');
  if (paused) stopLoop();
  else startLoop();
}

// Check for collision with self
function checkCollision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// This listener is on document, but Snake shares the page with two other games
// and the navbar. Anything else that can hold focus keeps its own keystrokes:
// the Number Guesser's input (where arrows drive the spinner and "e" is legal
// as scientific notation), and the Tic-Tac-Toe cells, which are focusable divs
// rather than form controls. Snake's own D-pad buttons are deliberately NOT
// excluded, so E still works right after tapping one.
const snakeRoot = canvas.closest('section') || canvas.parentElement;

function ownsKeystrokes(target) {
  if (!target || target === document.body) return false;
  if (target.isContentEditable) return true;
  if (/^(input|textarea|select)$/i.test(target.tagName || '')) return true;
  if (!target.matches || !target.matches('a[href], button, [tabindex]')) return false;
  return !snakeRoot.contains(target);
}

// Handle keyboard input (WASD or arrow keys)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey || ownsKeystrokes(e.target)) return;

  const key = e.key.toLowerCase();
  let handled = true;

  if (key === 'w' || key === 'arrowup') requestDirection('up');
  else if (key === 's' || key === 'arrowdown') requestDirection('down');
  else if (key === 'a' || key === 'arrowleft') requestDirection('left');
  else if (key === 'd' || key === 'arrowright') requestDirection('right');
  else if (key === 'e') togglePause();
  else handled = false;

  // Only swallow the arrow keys while the game is actually running, so they
  // still scroll the page when Snake is paused or over.
  if (handled && !paused && key.startsWith('arrow')) e.preventDefault();
});

// On-screen D-pad for touch devices
if (controlsEl) {
  controlsEl.querySelectorAll('[data-dir]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      requestDirection(btn.dataset.dir);
    });
  });
  const pauseBtn = controlsEl.querySelector('[data-action="pause"]');
  if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
}

resetGame();
updateBestDisplay();
draw();
// Overwrites the static prompt in the markup, which has to assume a keyboard
// because it is also the no-JS fallback.
setStatus(resumeHint() + ' start.');

})();
