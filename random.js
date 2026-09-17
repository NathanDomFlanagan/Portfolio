(function () {
const guessInput = document.getElementById('guess');
if (!guessInput) return;

const resultEl = document.getElementById('result');
const bestEl = document.getElementById('best-score');
const guessBtn = document.getElementById('guess-btn');
const resetBtn = document.getElementById('reset-btn');

let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let solved = false;

function plural(n) {
    return Number(n) === 1 ? '' : 's';
}

function updateBestDisplay() {
    const best = readStored('guess-best');
    bestEl.textContent = best ? `Best: ${best} attempt${plural(best)}` : '';
}

function checkGuess() {
    // The round is over until Reset is pressed — otherwise every extra guess
    // keeps incrementing the counter and re-announces a worse-looking win.
    if (solved) return;

    const raw = guessInput.value.trim();
    const userGuess = Number(raw);

    if (raw === '' || Number.isNaN(userGuess)) {
        resultEl.textContent = 'Enter a number to guess.';
        return;
    }
    if (!Number.isInteger(userGuess)) {
        resultEl.textContent = 'Whole numbers only.';
        return;
    }
    if (userGuess < 1 || userGuess > 100) {
        resultEl.textContent = 'Guess must be between 1 and 100.';
        return;
    }

    attempts++;

    if (userGuess === randomNumber) {
        solved = true;
        const best = readStored('guess-best');
        if (!best || attempts < Number(best)) {
            writeStored('guess-best', String(attempts));
        }
        resultEl.textContent = `Congratulations! You guessed the number in ${attempts} attempt${plural(attempts)}. Press Reset to play again.`;
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
    solved = false;
    guessInput.value = '';
    resultEl.textContent = '';
    guessInput.focus();
}

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkGuess();
});

// Deliberately unguarded. The whole file already bails if #guess is absent, so
// these two exist on any page that gets this far — and a silent `if (btn)` here
// is what previously let the buttons sit dead without anything saying so.
guessBtn.addEventListener('click', checkGuess);
resetBtn.addEventListener('click', resetGame);

updateBestDisplay();

})();
