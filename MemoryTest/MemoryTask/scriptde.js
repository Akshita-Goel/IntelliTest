const startScreen = document.getElementById('start-screen');
const instrScreen = document.getElementById('instr-screen');
const practiceScreen = document.getElementById('practice-screen');
const gameScreen = document.getElementById('game-screen');
const practiceScoreScreen = document.getElementById('practice-score-screen');
const testScreen = document.getElementById('test-screen');
const testScoreScreen = document.getElementById('test-score-screen');
const startBtn = document.getElementById('start-btn');
const contBtn = document.getElementById('cont-btn');
const practiceStartBtn = document.getElementById('practice-start-btn');
const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const scoreModeElement = document.getElementById('score-mode');
const scoreMovesElement = document.getElementById('score-moves');
const scoreTimeElement = document.getElementById('score-time');
const quitBtn = document.getElementById('quit-btn');
const startTestBtn = document.getElementById('start-test-btn');

const emojis = ['🤖', '💻', '👾', '⚙️', '🕹️', '🖱️', '💽', '🖨️', '📧', '🔗', '🌐', '🔋', '📁', ' 📱', ' 📡', '🦾', '⚛️', '📊'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameSize = '';
let timer;
let seconds = 0;
let isTestMode = false;

function showInstructions() {
    startScreen.classList.add('hidden');
    instrScreen.classList.remove('hidden');
}

function showPracticeScreen() {
    instrScreen.classList.add('hidden');
    practiceScreen.classList.remove('hidden');
}

function startPracticeGame() {
    practiceScreen.classList.add('hidden');
    startGame('4x5', false);
}

function showTestScreen() {
    practiceScoreScreen.classList.add('hidden');
    testScreen.classList.remove('hidden');
}

function startTestGame(size) {
    testScreen.classList.add('hidden');
    startGame(size, true);
}

function startGame(size, isTest) {
    gameSize = size;
    isTestMode = isTest;
    gameScreen.classList.remove('hidden');
    quitBtn.style.display = 'inline-block';

    const [rows, cols] = size.split('x').map(Number);
    const totalCards = rows * cols;
    const emojisNeeded = totalCards / 2;
    
    cards = [...emojis.slice(0, emojisNeeded), ...emojis.slice(0, emojisNeeded)].sort(() => Math.random() - 0.5);
    
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 80px)`;
    gameBoard.style.width = `${cols * 90}px`;
    gameBoard.innerHTML = cards.map((emoji, index) => `
        <div class="card" data-index="${index}">
            <span class="emoji" style="display: none;">${emoji}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    updateMovesAndTimer();
    startTimer();
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.querySelector('.emoji').style.display = 'block';
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            updateMovesAndTimer();
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const emoji1 = card1.querySelector('.emoji').textContent;
    const emoji2 = card2.querySelector('.emoji').textContent;
    
    if (emoji1 === emoji2) {
        matchedPairs++;
        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('.emoji').style.display = 'none';
        card2.querySelector('.emoji').style.display = 'none';
    }
    
    flippedCards = [];
}

document.addEventListener('DOMContentLoaded', function() {
    const testScreen = document.getElementById('test-screen');
    const gameScreen = document.getElementById('game-screen');
    const scoreScreen = document.getElementById('test-score-screen');
    const testButtons = document.querySelectorAll('.test-btn');
    const endGameButton = document.getElementById('end-game');
    const backToDashButton = document.getElementById('backtodash-btn');

    function startGame(size) {
        testScreen.classList.add('hidden');
        scoreScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        // Here you would initialize your game with the selected size
        console.log(`Starting game with size ${size}`);
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        scoreScreen.classList.remove('hidden');
        // Here you would update the score screen with game results
    }

    testButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            startGame(size);
        });
    });

    endGameButton.addEventListener('click', endGame);

    backToDashButton.addEventListener('click', function() {
        scoreScreen.classList.add('hidden');
        testScreen.classList.remove('hidden');
    });
});

function updateMovesAndTimer() {
    movesElement.textContent = `Moves: ${moves}`;
    timerElement.textContent = formatTime(seconds);
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        updateMovesAndTimer();
    }, 1000);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    
    if (isTestMode) {
        testScoreScreen.classList.remove('hidden');
        document.getElementById('test-score-mode').textContent = `Mode: ${gameSize}`;
        document.getElementById('test-score-moves').textContent = `Moves: ${moves}`;
        document.getElementById('test-score-time').textContent = `taken: ${formatTime(seconds)}`;
        
        const currentDate = new Date().toISOString();
        const username = localStorage.getItem('username');
        
        fetch('/save-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                scoretest2: moves,
                date: currentDate
            })
        }).then(response => response.json())
          .then(data => {
              if (data.message) {
                  console.log(data.message);
              }
          }).catch(error => console.error('Error:', error));
    } else {
        practiceScoreScreen.classList.remove('hidden');
        scoreModeElement.textContent = `Mode: ${gameSize}`;
        scoreMovesElement.textContent = `Moves: ${moves}`;
        scoreTimeElement.textContent = `taken: ${formatTime(seconds)}`;
    }

    quitBtn.style.display = 'none';
}

function quitGame() {
    clearInterval(timer);
    endGame();
}

startBtn.addEventListener('click', showInstructions);
contBtn.addEventListener('click', showPracticeScreen);
practiceStartBtn.addEventListener('click', startPracticeGame);
quitBtn.addEventListener('click', quitGame);
startTestBtn.addEventListener('click', showTestScreen);

document.querySelectorAll('.test-btn').forEach(btn => {
    btn.addEventListener('click', () => startTestGame(btn.dataset.size));
});

document.addEventListener('DOMContentLoaded', () => {
    startScreen.classList.remove('hidden');
});

const backToDashboardButton = document.getElementById('backtodash-btn');
if (backToDashboardButton) {
    backToDashboardButton.addEventListener('click', function() {
        const username = localStorage.getItem('username');
        window.location.href = `/dashboard?username=${username}`;
    });
}