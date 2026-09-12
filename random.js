(function () {
let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById('guess');
const resultEl = document.getElementById('result');
const bestEl = document.getElementById('best-score');

function updateBestDisplay() {
    const best = localStorage.getItem('guess-best');
    bestEl.textContent = best ? `Best: ${best} attempt${best === '1' ? '' : 's'}` : '';
}

function checkGuess() {
    const raw = guessInput.value.trim();
    const userGuess = Number(raw);

    if (raw === '' || Number.isNaN(userGuess)) {
        resultEl.textContent = 'Enter a number to guess.';
        return;
    }
    if (userGuess < 1 || userGuess > 100) {
        resultEl.textContent = 'Guess must be between 1 and 100.';
        return;
    }

    attempts++;

    if (userGuess === randomNumber) {
        const best = localStorage.getItem('guess-best');
        if (!best || attempts < Number(best)) {
            localStorage.setItem('guess-best', String(attempts));
        }
        resultEl.textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
        updateBestDisplay();
    } else if (userGuess < randomNumber) {
        resultEl.textContent = 'Too low! Try again.';
    } else {
        resultEl.textContent = 'Too high! Try again.';
    }
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessInput.value = '';
    resultEl.textContent = '';
}

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkGuess();
});

updateBestDisplay();

// Exposed on window so the inline onclick="" handlers in game.html can reach them
window.checkGuess = checkGuess;
window.resetGame = resetGame;

})();
