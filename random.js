let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
    const userGuess = document.getElementById('guess').value;
    attempts++;
    let result = '';

    if (userGuess == randomNumber) {
        result = `Congratulations! You guessed the number in ${attempts} attempts.`;
    } else if (userGuess < randomNumber) {
        result = 'Too low! Try again.';
    } else {
        result = 'Too high! Try again.';
    }

    document.getElementById('result').innerText = result;
}

function resetGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guess').value = '';
    document.getElementById('result').innerText = '';
}