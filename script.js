// Global Variables
let currentQuestionIndex = 0;
let selectedQuestions = [];
let selectedCategory = "";
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let attemptedQuestions = 0;
let countdown;


// ------------------------------------------------------------------------------------------------------------------
// INDEX.HTML LOGIC
// ------------------------------------------------------------------------------------------------------------------


function EnterName() {
  const userName = document.getElementById("username").value.trim();
  if (userName === "") {
    alert("Please enter your name!");
  } else {
    localStorage.setItem('userName', userName);
    document.getElementById('User_greeting').innerHTML = `Welcome <b>${userName}</b>, please select the category of Quiz below!`;
  }
}

function selectCategory(category) {
  const userName = document.getElementById("username").value.trim();
  if (userName === "") {
    alert("Please enter your name!");
  } else {
    selectedCategory = category;
    document.getElementById('category_selected').innerHTML = `<b>${category}</b> selected: <br>- You have to attend 10 questions for the chosen category.<br>- Also, you have 220 seconds to attempt all questions.`;
    document.getElementById("start-button").disabled = false;
  }
}

function startQuiz() {
  if (selectedCategory === "") {
    alert("Please select a category to start the quiz.");
    return;
  }

  localStorage.setItem('selectedCategory', selectedCategory);
  window.location.href = 'quiz_page.html';
}


// ------------------------------------------------------------------------------------------------------------------
// QUIZ_PAGE.HTML LOGIC
// ------------------------------------------------------------------------------------------------------------------


function loadCategory() {
  const category = localStorage.getItem('selectedCategory');
  const categoryTitleElement = document.getElementById("category-title");

  if (categoryTitleElement) {
    categoryTitleElement.innerText = category;
  } else {
    console.error("Element with id 'category-title' not found.");
  }

  selectedQuestions = questions[category];

  if (!selectedQuestions || selectedQuestions.length === 0) {
    alert("No questions available for the selected category.");
    return;
  }

  loadQuestion();
  startTimer();
}

document.addEventListener('DOMContentLoaded', loadCategory);

function loadQuestion() {
  document.getElementById("message").style.display = "none";

  if (currentQuestionIndex >= selectedQuestions.length) {
    alert("Quiz completed! Press 'Submit' to view score.");
    return;
  }

  const questionData = selectedQuestions[currentQuestionIndex];
  document.getElementById("question").innerText = questionData.question;
  document.getElementById("current-question").innerText = currentQuestionIndex + 1;
  document.getElementById("total-questions").innerText = selectedQuestions.length;

  const optionsElement = document.getElementById("options");
  optionsElement.innerHTML = "";

  questionData.options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    optionButton.id = `option${index + 1}`;
    optionButton.innerText = option;
    optionButton.onclick = () => checkAnswer(index, questionData.correctAnswer);
    optionsElement.appendChild(optionButton);
  });
}

function checkAnswer(selectedOptionIndex, correctAnswerIndex) {
  attemptedQuestions++;

  const optionButtons = document.querySelectorAll('#options button');

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === selectedOptionIndex) {
      if (selectedOptionIndex === correctAnswerIndex) {
        score++;
        correctAnswers++;
        button.classList.add('correct');
        document.getElementById("score").innerText = score;
        document.getElementById('message').style.color = "Green";
      } else {
        wrongAnswers++;
        button.classList.add('incorrect');
        document.getElementById('message').style.color = "Red";
        optionButtons[correctAnswerIndex].classList.add('correct');
      }
    }
  });

  document.getElementById('message').style.display = "block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    loadQuestion();
  } else {
    alert("Quiz is over!");
    submitQuiz();
  }
}

function submitQuiz() {
  clearInterval(countdown);
  localStorage.setItem('correctAnswers', correctAnswers);
  localStorage.setItem('wrongAnswers', wrongAnswers);
  localStorage.setItem('finalScore', score);
  localStorage.setItem('totalQuestions', selectedQuestions.length);
  localStorage.setItem('attemptedQuestions', attemptedQuestions);

  window.location.href = 'quiz_result.html';
}

// Timer logic
function startTimer() {
  let timeLeft = 220;
  const timerElement = document.getElementById('timer');

  countdown = setInterval(() => {
    let seconds = timeLeft % 600;

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    timerElement.textContent = `${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert("Time out for quiz!");
      submitQuiz();
    }

    timeLeft--;

    localStorage.setItem('totalTime', `${220 - timeLeft} seconds`);
  }, 1000);
}


// ------------------------------------------------------------------------------------------------------------------
// QUIZ RESULT PAGE LOGIC
// ------------------------------------------------------------------------------------------------------------------


function loadResults() {
  const userName = localStorage.getItem('userName') || 'userName';
  const totalQuestions = localStorage.getItem('totalQuestions') || 10;
  const correctAnswers = localStorage.getItem('correctAnswers') || 0;
  const wrongAnswers = localStorage.getItem('wrongAnswers') || 0;
  const attemptedQuestions = Number(correctAnswers) + Number(wrongAnswers);
  const totalTimeTaken = localStorage.getItem('totalTime') || 'Not Available';
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  const elements = {
    'participant-name': userName,
    'total-time-taken': totalTimeTaken,
    'total-questions': totalQuestions,
    'attempted-questions': attemptedQuestions,
    'correct-questions': correctAnswers,
    'wrong-questions': wrongAnswers,
    'score-percentage': `${scorePercentage.toFixed(2)}%`
  };

  for (const [id, value] of Object.entries(elements)) {
    const element = document.getElementById(id);
    if (element) {
      element.innerText = value;
    }
  }
}

function startAgain() {
  // Clear quiz-related data but keep selected category and user name
  localStorage.removeItem('correctAnswers');
  localStorage.removeItem('wrongAnswers');
  localStorage.removeItem('finalScore');
  localStorage.removeItem('attemptedQuestions');
  localStorage.removeItem('totalTime');

  // Reset current state variables
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  attemptedQuestions = 0;

  // Redirect back to quiz page
  window.location.href = 'quiz_page.html';
}


function goToHome() {
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadResults);
