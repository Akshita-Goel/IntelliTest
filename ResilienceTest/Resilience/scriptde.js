const sections = [
    "Coping and Adaptation",
    "Problem-Solving and Flexibility",
    "Resilience Building and Self-Care",
    "Emotional Regulation and Bouncing Back"
];

const questions = [
    { section: "Coping and Adaptation", text: "When faced with a challenge or adversity, how often do you seek social support from friends or family?", type: "text" },
        { section: "Coping and Adaptation", text: "Rate your ability to stay calm and composed in stressful situations on a scale from 1 to 10.", type: "range" },
        { section: "Coping and Adaptation", text: "How frequently do you engage in activities (e.g., exercise, hobbies) to help manage stress?", type: "text" },
        { section: "Coping and Adaptation", text: "Describe a recent situation where you had to adapt to unexpected changes. How did you handle it?", type: "text" },
        { section: "Coping and Adaptation", text: "How comfortable are you with changes in your routine or plans?", type: "text" },
        { section: "Problem-Solving and Flexibility", text: "Rate your ability to find solutions when faced with problems on a scale from 1 to 10.", type: "range" },
        { section: "Problem-Solving and Flexibility", text: "Can you describe a challenging situation you successfully resolved? What approach did you take?", type: "text" },
        { section: "Problem-Solving and Flexibility", text: "How open are you to seeking different perspectives when dealing with a difficult situation?", type: "text" },
        { section: "Resilience Building and Self-Care", text: "How do you prioritize self-care during stressful times?", type: "text" },
        { section: "Resilience Building and Self-Care", text: "What strategies or techniques do you use to maintain a positive mindset during tough times?", type: "text" },
        { section: "Resilience Building and Self-Care", text: "Describe a time when you turned a negative experience into a learning opportunity.", type: "text" },
        { section: "Emotional Regulation and Bouncing Back", text: "How do you manage your emotions in high-pressure situations?", type: "text" },
        { section: "Emotional Regulation and Bouncing Back", text: "Rate your ability to bounce back from disappointments or failures on a scale from 1 to 10.", type: "range" },
        { section: "Emotional Regulation and Bouncing Back", text: "Describe a situation where you effectively controlled your emotions despite adversity.", type: "text" }
];

let currentPage = 0;
let answers = new Array(questions.length).fill('');

function goToInstructions() {
    document.getElementById('title-page').style.display = 'none';
    document.getElementById('instruc-page').style.display = 'block';
}

function startTest() {
    document.getElementById('instruc-page').style.display = 'none';
    document.getElementById('question-pages').style.display = 'block';
    currentPage = 0;
    displayQuestions();
}


const interpretations = {
    "Coping and Adaptation": "To what extent do we seek new knowledge about ourselves and about the situation and the wider world. To what degree are we excited by opportunities that allow us to experience new things? How open-minded are we?",
    "Problem-Solving and Flexibility": "This is our initial reaction to a challenging event or stressful circumstance and the extent to which we feel 'thrown' by it and how much it impacts our general functioning and well-being.",
    "Resilience Building and Self-Care": "How do our behaviours interact with stressful and challenging situations? Do we show that we believe in ourselves? Do we have the desire and discipline to keep going?",
    "Emotional Regulation and Bouncing Back": "How we feel about ourselves; our emotional well-being and self-esteem. Do we believe in ourselves? Do we believe that we are deserve to be happy? Do we have a good understanding of our emotions and to what extent to we have clear self-insight about why we are upset?"
};

function displayQuestions() {
    const section = sections[currentPage];
    const currentQuestions = questions.filter(q => q.section === section);

    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = '';

    document.getElementById('section-title').textContent = section;

    currentQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.text}</p>
            ${q.type === 'range' ? 
                `<input type="range" min="1" max="10" value="${answers[questions.indexOf(q)] || 5}" id="q${questions.indexOf(q)}"> 
                 <span id="q${questions.indexOf(q)}Value">${answers[questions.indexOf(q)] || 5}</span>` :
                `<textarea id="q${questions.indexOf(q)}">${answers[questions.indexOf(q)] || ''}</textarea>`
            }
        `;
        questionsContainer.appendChild(questionDiv);

        if (q.type === 'range') {
            const rangeInput = questionDiv.querySelector(`#q${questions.indexOf(q)}`);
            const rangeValue = questionDiv.querySelector(`#q${questions.indexOf(q)}Value`);
            rangeInput.addEventListener('input', () => {
                rangeValue.textContent = rangeInput.value;
                answers[questions.indexOf(q)] = rangeInput.value;
            });
        } else {
            const textarea = questionDiv.querySelector(`#q${questions.indexOf(q)}`);
            textarea.addEventListener('input', () => {
                answers[questions.indexOf(q)] = textarea.value;
            });
        }
    });

    updateNavButtons();
}

function updateNavButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    prevButton.style.display = currentPage === 0 ? 'none' : 'inline';
    nextButton.textContent = currentPage === sections.length - 1 ? 'FINISH' : 'NEXT →';
}

function nextPage() {
    if (currentPage < sections.length - 1) {
        currentPage++;
        displayQuestions();
    } else {
        showResults();
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayQuestions();
    }
}

function showResults() {
    // Hide the question pages and show the results page
    document.getElementById('question-pages').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';

    // Calculate the scores
    const scores = calculateScores();
    const resultsContainer = document.getElementById('results-page');

    // Calculate the total score
    let totalScore = Object.values(scores).reduce((sum, score) => sum + score.total, 0);

    // Send the total score to the server
    sendTestScoreToServer(totalScore);

    // Display the results on the page
    resultsContainer.innerHTML = `
    <h2 style="text-align: left; font-size: 42px; margin-left: 40px; margin-top: 1px; margin-bottom: -20px; padding: 20px 20px">Results</h2>
    <p style="text-align: left; font-size: 28px; margin-left: 60px; margin-top: -10px;">Total Score: <strong>${totalScore}/25</strong></p>
    
    <p style="margin-left: 29px">Below are your scores for each resilience aspect based on your responses:</p>
    <table id="scores-table">
        <thead>
            <tr>
                <th>Section</th>
                <th>Total</th>
                <th>Category</th>
                <th>Interpretation</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(scores).map(([section, score]) => `
                <tr>
                    <td>${section}</td>
                    <td>${score.total}</td>
                    <td>${score.category}</td>
                    <td>${interpretations[section]}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <br>
    <button id="backtodash-btn" style="background-color: #008080;
    border: none;
    border-radius: 10px;
    color: #ffffff;  padding: 10px 16px;
    font-size: 17px;
    cursor: pointer; margin-left: 550px;" >Back to Dashboard</button>
    `;

    // Add event listener to the "Back to Dashboard" button
    const backToDashboardButton = document.getElementById('backtodash-btn');
    if (backToDashboardButton) {
        backToDashboardButton.addEventListener('click', function () {
            const username = localStorage.getItem('username');
            window.location.href = `/dashboard?username=${username}`;
        });
    }
}

function sendTestScoreToServer(totalScore) {
    const username = localStorage.getItem('username');
    fetch('/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, scoreresilience: totalScore })
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

function calculateScores() {
    const scores = {};

    sections.forEach(section => {
        const sectionQuestions = questions.filter(q => q.section === section);
        let low = 0, medium = 0, high = 0, total = 0;

        sectionQuestions.forEach(question => {
            const answer = answers[questions.indexOf(question)];
            let score = 0;

            if (question.type === 'range') {
                score = parseInt(answer) > 5 ? 1 : 0;
                total += score;
                if (score === 1) high++;
                else low++;
            } else {
                const lowerAnswer = answer.toLowerCase();
                if (['frequently', 'consistently', 'always', 'often', 'very comfortable'].some(word => lowerAnswer.includes(word))) {
                    score = 2;
                    high++;
                } else if (['sometimes', 'occasionally', 'moderately'].some(word => lowerAnswer.includes(word))) {
                    score = 1;
                    medium++;
                } else {
                    score = 0;
                    low++;
                }
                total += score;
            }
        });

        let category;
        if (high > medium && high > low) {
            category = 'High';
        } else if (medium > low) {
            category = 'Medium';
        } else {
            category = 'Low';
        }

        scores[section] = { category, low, medium, high, total };
    });

    return scores;
}

// Results page script to display the Test Game score
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
            resultsContainer.innerHTML = '';
            data.results.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result';
                resultDiv.textContent = `Score: ${result.scoreresilience}/10 - Time: ${result.time}`;
                resultsContainer.appendChild(resultDiv);
            });
        })
        .catch(error => {
            console.error('There was a problem with fetching results:', error);
        });
}

displayResults();
