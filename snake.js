(function () {
// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snake-score');
const bestEl = document.getElementById('snake-best');
const statusEl = document.getElementById('snake-status');
const controlsEl = document.querySelector('.snake-controls');

// Set the canvas dimensions
canvas.width = 400;
canvas.height = 400;

const START_SNAKE = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Define the snake and food objects
let snake = START_SNAKE.map(seg => ({ ...seg }));
let food = spawnFood();

// Define the game variables
let score = 0;
let direction = 'right';     // the direction actually applied on the last tick
let nextDirection = 'right'; // queued input, applied once per tick
let paused = true;
let speed = 100;

function updateScore() {
  scoreEl.textContent = 'Score: ' + score;
}

function updateBestDisplay() {
  const best = localStorage.getItem('snake-best');
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

function togglePause() {
  paused = !paused;
  setStatus(paused ? 'Paused. Press E to resume.' : '');
}

// Pick a food tile that isn't currently under the snake
function spawnFood() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
  } while (snake.some(segment => segment.x === pos.x && segment.y === pos.y));
  return pos;
}

// Main game loop
function tick() {
  if (!paused) {
    // Apply the queued direction once per tick
    direction = nextDirection;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = 'green';
      ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);

    // Move the snake
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i] = { ...snake[i - 1] };
    }

    if (direction === 'right') {
      snake[0].x += 10;
    } else if (direction === 'left') {
      snake[0].x -= 10;
    } else if (direction === 'up') {
      snake[0].y -= 10;
    } else if (direction === 'down') {
      snake[0].y += 10;
    }

    // Check for collision with food
    if (snake[0].x === food.x && snake[0].y === food.y) {
      score++;
      updateScore();
      snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
      food = spawnFood();
      speed = Math.max(50, 100 - Math.floor(score / 5) * 5);
    }

    // Check for collision with wall or self
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height || checkCollision(snake[0], snake.slice(1))) {
      const best = localStorage.getItem('snake-best');
      if (!best || score > Number(best)) {
        localStorage.setItem('snake-best', String(score));
        updateBestDisplay();
      }
      setStatus('Game over! Score: ' + score + '. Press E to play again.');
      snake = START_SNAKE.map(seg => ({ ...seg }));
      direction = 'right';
      nextDirection = 'right';
      food = spawnFood();
      score = 0;
      updateScore();
      speed = 100;
      paused = true;
    }
  }
  setTimeout(tick, speed);
}

updateScore();
updateBestDisplay();
tick();

// Check for collision with self
function checkCollision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// Handle keyboard input (WASD or arrow keys)
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') requestDirection('up');
  else if (key === 's' || key === 'arrowdown') requestDirection('down');
  else if (key === 'a' || key === 'arrowleft') requestDirection('left');
  else if (key === 'd' || key === 'arrowright') requestDirection('right');
  else if (key === 'e') togglePause();
  else return;
  if (key.startsWith('arrow')) e.preventDefault();
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

})();
