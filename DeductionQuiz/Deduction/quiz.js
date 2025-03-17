import { quiz4 } from './quizData.js';

let currentQuestion = 0;
let timeLeft = 1200; // 20 minutes in seconds
let timer;
let userAnswers = new Array(quiz4.questions.length).fill(null);

const questionText = document.getElementById('question-text');
const attachmentText = document.getElementById('attachment-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const timeLeftSpan = document.getElementById('time-left');
const timerBorder = document.querySelector('.timer-border');

function loadQuestion() {
  const question = quiz4.questions[currentQuestion];
  attachmentText.textContent = question.attachement;
  questionText.textContent = `${question.Sno}. ${question.question}`;
  
  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option;
    if (userAnswers[currentQuestion] === index) {
      button.classList.add('selected');
    }
    button.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(button);
  });
  
  updateProgress();
}

function selectOption(index) {
  userAnswers[currentQuestion] = index;
  const options = optionsContainer.children;
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
  }
  options[index].classList.add('selected');
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quiz4.questions.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${currentQuestion + 1}/${quiz4.questions.length}`;
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const borderWidth = (timeLeft / 1200) * 5; 
  timerBorder.style.borderWidth = `${borderWidth}px`;
  
  if (timeLeft === 0) {
    clearInterval(timer);
    finishQuiz();
  } else {
    timeLeft--;
  }
}

function finishQuiz() {
  const score = calculateScore();
  window.location.href = `result.html?score=${score}&answers=${JSON.stringify(userAnswers)}`;
}

function calculateScore() {
  return userAnswers.reduce((score, answer, index) => {
    if (answer !== null && quiz4.questions[index].options[answer] === quiz4.questions[index].correctAnswer) {
      return score + 1;
    }
    return score;
  }, 0);
}

prevBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentQuestion < quiz4.questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    finishQuiz();
  }
});

loadQuestion();
timer = setInterval(updateTimer, 1000);