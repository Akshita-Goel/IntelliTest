const startScreen = document.getElementById('start-screen');
const instrScreen = document.getElementById('instr-screen');
const startPracticeAsk = document.getElementById('start-practice-ask');
const gameScreen = document.getElementById('game-screen');
const scoreScreen = document.getElementById('score-screen');
const startTestAsk = document.getElementById('start-test-ask');

const startButton = document.getElementById('start-btn');
const contButton = document.getElementById('cont-btn');
const startPracticeBtn = document.getElementById('start-practice-game');
const playTestBtn = document.getElementById('play-test');
const playAgainBtn = document.getElementById('play-again');
const startTestBtn = document.getElementById('start-test-game');
const backToDashboardButton = document.getElementById('backtodash-btn');

const gameTitle = document.getElementById('game-title');
const symbolKey = document.getElementById('symbol-key');
const conveyorBelt = document.getElementById('conveyor-belt');
const options = document.getElementById('options');
const scoreMode = document.getElementById('score-mode');
const scoreDetails = document.getElementById('score-details');
const interpretation = document.getElementById('interpretation');

const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const timerElement = document.getElementById('time-left');
const timerBorder = document.querySelector('.timer-border');



const symbols = ['×', '⊏', '\\', '←', '>', '∩', 'Π', '=', 'ᴑ'];
let currentMode = '';
let timeLeft = 30;
let timer;
let score = 0;
let currentNumberIndex = 0;
let numbers = [];
let userResponses = [];
let startTime;

startButton.addEventListener('click', showInstructions);
contButton.addEventListener('click', showStartPracticeAsk);
startPracticeBtn.addEventListener('click', () => startGame('Practice Game'));
playTestBtn.addEventListener('click', showStartTestAsk);
playAgainBtn.addEventListener('click', showStartPracticeAsk);
startTestBtn.addEventListener('click', () => startGame('Test Game'));

function showInstructions() {
    startScreen.style.display = 'none';
    instrScreen.style.display = 'block';
}

function showStartPracticeAsk() {
    instrScreen.style.display = 'none';
    scoreScreen.style.display = 'none';
    startPracticeAsk.style.display = 'block';
}

function showStartTestAsk() {
    scoreScreen.style.display = 'none';
    startTestAsk.style.display = 'block';
}

function startGame(mode) {
    currentMode = mode;
    score = 0;
    currentNumberIndex = 0;
    timeLeft = 30;
    userResponses = new Array(10).fill(null);

    startPracticeAsk.style.display = 'none';
    startTestAsk.style.display = 'none';
    gameScreen.style.display = 'block';

    symbolKey.innerHTML = '';
    symbols.forEach((symbol, index) => {
        const box = document.createElement('div');
        box.className = 'symbol-box';
        box.innerHTML = `<div class="number-box">${index + 1}</div><div class="symbol">${symbol}</div>`;
        symbolKey.appendChild(box);
    });

    generateNumbers();
    updateConveyorBelt();
    updateOptions();
    updateProgress();

    startTime = Date.now();
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timerElement.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progress = (timeLeft / 30) * 100;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameScreen.style.display = 'none';
    scoreScreen.style.display = 'block';
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    scoreMode.textContent = `Time Taken: ${elapsedTime} s`;
    scoreDetails.textContent = `Final Score: ${score}/10`;
    interpretation.textContent = `Interpretation: ${getScoreInterpretation(score)}`;

    if (currentMode === 'Test Game') {
        sendTestScoreToServer(score);
        playTestBtn.style.display = 'none';
        playAgainBtn.style.display = 'none';
        backToDashboardButton.style.display = 'block';
    } else {
        playTestBtn.style.display = 'block';
        playAgainBtn.style.display = 'block';
        backToDashboardButton.style.display = 'none';
    }
}

function handleSymbolClick(symbol) {
    const currentNumber = numbers[currentNumberIndex];
    userResponses[currentNumberIndex] = symbol;

    if (symbols[currentNumber - 1] === symbol) {
        score++;
    }

    const blankBox = conveyorBelt.querySelector(`.blank-box[data-index="${currentNumberIndex}"]`);
    blankBox.textContent = symbol;
    blankBox.classList.remove('highlighted');

    currentNumberIndex++;
    if (currentNumberIndex < numbers.length) {
        updateConveyorBelt();
        updateProgress();
    } else {
        endGame();
    }
}

function updateProgress() {
    const progress = ((currentNumberIndex + 1) / numbers.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentNumberIndex + 1}/${numbers.length}`;
}

function generateNumbers() {
    numbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 9) + 1);
}

function updateConveyorBelt() {
    conveyorBelt.innerHTML = '';

    numbers.forEach((number, index) => {
        const boxContainer = document.createElement('div');
        boxContainer.className = 'box-container';

        const numberBox = document.createElement('div');
        numberBox.className = 'number-box symbol-box';
        numberBox.textContent = number;
        boxContainer.appendChild(numberBox);

        const blankBox = document.createElement('div');
        blankBox.className = 'blank-box symbol-box';
        blankBox.dataset.index = index;
        if (userResponses[index]) {
            blankBox.textContent = userResponses[index];
        }
        boxContainer.appendChild(blankBox);

        if (index === currentNumberIndex) {
            blankBox.classList.add('highlighted');
            const pointer = document.createElement('div');
            pointer.className = 'pointer';
            pointer.textContent = '↑';
            boxContainer.appendChild(pointer);
        }

        conveyorBelt.appendChild(boxContainer);
    });
}

function updateOptions() {
    options.innerHTML = '';
    symbols.forEach(symbol => {
        const button = document.createElement('button');
        button.textContent = symbol;
        button.addEventListener('click', () => handleSymbolClick(symbol));
        options.appendChild(button);
    });
}

function getScoreInterpretation(score) {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    if (score >= 3) return 'Average';
    return 'Below Average';
}

function sendTestScoreToServer(score) {
    const username = localStorage.getItem('username');
    fetch('/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, scoreattention: score })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Test Game score saved successfully:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

if (backToDashboardButton) {
    backToDashboardButton.addEventListener('click', function () {
        const username = localStorage.getItem('username');
        window.location.href = `/dashboard?username=${username}`;
    });
}

function displayResults() {
    fetch('/get-results', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = '<h3>Test Game Results</h3>';
            data.results.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result';
                resultDiv.textContent = `Score: ${result.scoreattention}/10 - Time: ${result.time}`;
                resultsContainer.appendChild(resultDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem with fetching results:', error);
        });
}

displayResults();