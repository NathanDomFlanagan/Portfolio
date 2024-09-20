// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 400;
canvas.height = 400;

// Define the snake and food objects
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 }
];

let food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };

// Define the game variables
let score = 0;
let direction = 'right';
let paused = true;

// Main game loop
setInterval(() => {
  if(!paused) 
  {

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
      food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
      snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    }

    // Check for collision with wall or self
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height || checkCollision(snake[0], snake.slice(1))) {
      alert('Game Over! Your score is ' + score);
      snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
      ];
      food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
      score = 0;
      paused = true;
    }
  }
}, 100);

// Check for collision with self
function checkCollision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'w' && direction !== 'down') {
    direction = 'up';
  } else if (e.key === 's' && direction !== 'up') {
    direction = 'down';
  } else if (e.key === 'a' && direction !== 'right') {
    direction = 'left';
  } else if (e.key === 'd' && direction !== 'left') {
    direction = 'right';
  } else if (e.key === 'e') { // Space bar to pause/start the game
    paused = !paused;
  }
});