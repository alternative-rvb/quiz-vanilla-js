let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 20;
let timerId;

const url = "questions/spongebob.json"

async function fetchData(url) {
  try {
    const response = await fetch(url);
    questions = await response.json();
    displayQuestion();
  } catch (error) {
    console.log("Erreur lors du chargement des questions :", error);
  }
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const preloaderElement = document.getElementById("preloader");
  const timeElement = document.getElementById("time");

  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  preloaderElement.style.display = "flex";
  timeElement.style.display = "none";

  setTimeout(() => {
    questionElement.style.display = "block";
    optionsElement.style.display = "flex";
    preloaderElement.style.display = "none";
    timeElement.style.display = "block";

    const currentQuestionData = questions[currentQuestion];
    questionElement.textContent = currentQuestionData.question;
    optionsElement.innerHTML = "";

    currentQuestionData.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(index));
      button.classList.add("btn");

      const colors = ["primary", "success", "danger", "warning"];
      button.classList.add(`btn-${colors[index % colors.length]}`);

      optionsElement.appendChild(button);
    });

    startTimer();
  }, 1000);
}

function checkAnswer(selectedIndex) {
  clearTimeout(timerId);
  const answer = questions[currentQuestion].answer;

  if (selectedIndex === answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    displayScore();
  }
}

function displayScore() {
  const quizElement = document.getElementById("quiz");
  quizElement.innerHTML = "";

  const scoreElement = document.createElement("h2");
  scoreElement.textContent = `Score final : ${score}/${questions.length}`;
  quizElement.appendChild(scoreElement);

  const timeElement = document.getElementById("time");
  timeElement.style.display = "none";
}

function startTimer() {
  timeLeft = 20;
  countdown();
}

function countdown() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;

  if (timeLeft > 0) {
    timeLeft--;
    timerId = setTimeout(countdown, 1000);
  } else {
    clearTimeout(timerId);
    checkAnswer(-1);
  }
}

fetchData(url);
