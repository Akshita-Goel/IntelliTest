import { quiz4 } from '/Deduction/quizData.js';

const finalScoreSpan = document.getElementById('final-score');
const interpretationDiv = document.getElementById('interpretation');
const showDetailsBtn = document.getElementById('show-details-btn');
const detailedResults = document.getElementById('detailed-results');
const homeBtn = document.getElementById('home-btn');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displayResults() {
    const score = getQueryParam('score');
    finalScoreSpan.textContent = `${score}/${quiz4.questions.length}`;
    interpretationDiv.innerHTML = getInterpretation(score);

    // Send final score to the server
    const username = localStorage.getItem('username');
    fetch('/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, scorededuction: score })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score saved successfully:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function getInterpretation(score) {
    const percentage = (score / quiz4.questions.length) * 100;
    let interpretation;

    if (percentage <= 50) {
        interpretation = `The performance suggests challenges in systematically analyzing information, inferring relationships, and extrapolating logical implications.`;
    } else {
        interpretation = `The performance reflects a capacity for systematic and analytical thinking, as well as the ability to recognize and apply logical rules or principles to solve problems.`;
    }

    return interpretation;
}

function toggleDetailedResults() {
    if (detailedResults.style.display === 'none' || detailedResults.style.display === '') {
        showDetailedResults();
    } else {
        detailedResults.style.display = 'none';
        showDetailsBtn.textContent = 'Show Detailed Results';
    }
}

function showDetailedResults() {
    detailedResults.style.display = 'block';
    detailedResults.innerHTML = '';
    const userAnswers = JSON.parse(getQueryParam('answers'));
    quiz4.questions.forEach((question, index) => {
        const questionResult = document.createElement('div');
        questionResult.className = 'question-result';
        const userAnswer = userAnswers[index] !== null ? question.options[userAnswers[index]] : 'Not answered';
        const isCorrect = userAnswer === question.correctAnswer;
        questionResult.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
            <p>Your Answer: ${userAnswer}</p>
            <p>Correct Answer: ${question.correctAnswer}</p>
            <p style="color: ${isCorrect ? 'green' : 'red'}">${isCorrect ? 'Correct' : 'Incorrect'}</p>
            <p>Explanation: ${question.explanation || 'No explanation provided.'}</p>
        `;
        detailedResults.appendChild(questionResult);
    });
    showDetailsBtn.textContent = 'Hide Detailed Results';
}

showDetailsBtn.addEventListener('click', toggleDetailedResults);
homeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

displayResults();

// Back to dashboard functionality
const backToDashboardButton = document.getElementById('backtodash-btn');
if (backToDashboardButton) {
    backToDashboardButton.addEventListener('click', function() {
        const username = localStorage.getItem('username');
        window.location.href = `/dashboard?username=${username}`;
    });
}
