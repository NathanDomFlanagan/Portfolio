(function () {
// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snake-score');
const statusEl = document.getElementById('snake-status');

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

// Define the snake and food objects
let snake = START_SNAKE.map(seg => ({ ...seg }));
let food = spawnFood();

// Define the game variables
let score = 0;
let direction = 'right';
let paused = true;
let speed = 100;

function updateScore() {
  scoreEl.textContent = 'Score: ' + score;
}

function setStatus(text) {
  statusEl.textContent = text;
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
      setStatus('Game over! Score: ' + score + '. Press E to play again.');
      snake = START_SNAKE.map(seg => ({ ...seg }));
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
  if (key === 'w' || key === 'arrowup') {
    if (direction !== 'down') direction = 'up';
  } else if (key === 's' || key === 'arrowdown') {
    if (direction !== 'up') direction = 'down';
  } else if (key === 'a' || key === 'arrowleft') {
    if (direction !== 'right') direction = 'left';
  } else if (key === 'd' || key === 'arrowright') {
    if (direction !== 'left') direction = 'right';
  } else if (key === 'e') {
    paused = !paused;
    setStatus(paused ? 'Paused. Press E to resume.' : '');
  } else {
    return;
  }
  if (key.startsWith('arrow')) e.preventDefault();
});

})();
