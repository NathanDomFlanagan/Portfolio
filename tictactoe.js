(function () {
const cells = document.querySelectorAll('.cell');
if (!cells.length) return;

const statusEl = document.getElementById('ttt-status');
const scoreEl = document.getElementById('ttt-score');

let currentPlayer = 'X';
let gameOver = false;
const board = Array(9).fill(null);
const scores = { X: 0, O: 0, draws: 0 };

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// data-index is what `board` is keyed on, so everything that maps an index back
// to an element goes through here. Using the NodeList position instead would
// silently highlight and label the wrong squares if the markup were reordered.
const cellByIndex = [];
cells.forEach(cell => {
    cellByIndex[Number(cell.getAttribute('data-index'))] = cell;
});

function updateStatus(text) {
    statusEl.textContent = text;
}

function updateScore() {
    scoreEl.textContent = `X: ${scores.X} · O: ${scores.O} · Draws: ${scores.draws}`;
}

// An empty cell has no text, so without this it reaches a screen reader as an
// unlabelled button — nine of them in a row.
function refreshLabels() {
    cellByIndex.forEach((cell, i) => {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        cell.setAttribute('aria-label', `Row ${row}, column ${col}, ${board[i] || 'empty'}`);
    });
}

function getWinningPattern() {
    return winPatterns.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || null;
}

function playMove(cell) {
    const index = Number(cell.getAttribute('data-index'));
    if (board[index]) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    refreshLabels();

    const winPattern = getWinningPattern();
    if (winPattern) {
        gameOver = true;
        winPattern.forEach(i => cellByIndex[i].classList.add('win'));
        scores[currentPlayer]++;
        updateScore();
        updateStatus(`${currentPlayer} wins! Click any cell to play again.`);
    } else if (board.every(v => v)) {
        gameOver = true;
        scores.draws++;
        updateScore();
        updateStatus('Draw! Click any cell to play again.');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus(`Turn: ${currentPlayer}`);
    }
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
    currentPlayer = 'X';
    gameOver = false;
    refreshLabels();
    updateStatus('Turn: X');
}

function handleCell(cell) {
    if (gameOver) {
        resetGame();
        return;
    }
    playMove(cell);
}

cells.forEach(cell => {
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');

    cell.addEventListener('click', () => handleCell(cell));

    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCell(cell);
        }
    });
});

refreshLabels();
updateStatus('Turn: X');
updateScore();

})();
