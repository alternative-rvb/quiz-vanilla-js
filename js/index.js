console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce script permet de créer un quiz à partir d'un fichier JSON
 * @version 1.0.0
 * @see {@link https://github.com/alternative-rvb/quiz | Repo GitHub}
 * @see {@link https://vercel.com/alternative-rvb/quiz | Démo Vercel}
 * @see {@link https://app.mailgun.com/mg/dashboard | Mailgun}
 */

// ANCHOR Réglages du quiz
/**
 * @type {Boolean} spoilerMode - Afficher l'image en flou
 */
let spoilerMode = false;
/**
 * @type {Number} timeLimit - Durée du quiz en secondes
 * @default 10
 */
const timeLimit = 10;
/**
 * @type {String} questionsUrl - URL du fichier JSON
 * @default "js/questions/javascript-1.json"
 */
const questionsUrl = "js/questions/javascript-1.json";

const quizContainer = document.querySelector("#quiz");
const startbutton = document.querySelector("#btn-start");

let idTimeInterval;
let idDelayTransition;
let idDelayWhenStoped;
let question;
let image;
let answerContainer;
let answer;
let metaContainer;
let timer;
let num;
let score;
let nextButton;
let totalQuestions;
let counter = 1;
let next = 1;
let points = 0;

/**
 * @event click
 * @desc Démarrer le quiz
 */
startbutton.addEventListener("click", () => quiz(next)); // Démarrer le premier intervalle

/**
 * @function getQuestions
 * @desc Récupère les questions depuis le fichier JSON
 * @returns {Array} - Tableau des questions
 */
async function getQuestions() {
  const response = await fetch(questionsUrl);
  const data = await response.json();
  return data;
}

/**
 * @function quiz
 * @desc Affiche la question suivante
 * @param {Number} index - Index de la question
 * @returns {void}
 */
async function quiz(index) {
  const questions = await getQuestions();

  clearInterval(idTimeInterval);
  clearTimeout(idDelayWhenStoped);
  clearTimeout(idDelayTransition);

  if (questions[index]) {
    quizContainer.innerHTML = "";

    createQuizElements(questions[index], questions.length);
    if (!spoilerMode) image.classList.remove("blur");
    startTimer();
  } else {
    endOfQuiz(questions);

  }
}

/**
 * @function startTimer
 * @desc Démarre le timer
 * @returns {void}
 */

function startTimer() {

  idTimeInterval = setInterval(() => {

    timer.innerText =
      counter == 1 ? counter + " seconde" : counter + " secondes";
    counter++;
    if (counter === timeLimit) {
      clearInterval(idTimeInterval);
      counter = 1;
      next++;
      timer.innerText = "Temps écoulé !";
      idDelayTransition = setTimeout(() => {
        quiz(next);
      }, 1000);
    }
  }, 1000);
}

/**
 * @function stopTimer
 * @desc Arrête le timer et affiche la bonne réponse
 * @param {Event} e - Événement
 * @param {Object} data - Objet contenant les données de la question en cours
 * @returns {void}
 */
function stopTimer(e, questionObj) {

  clearInterval(idTimeInterval);


  if (spoilerMode) image.classList.remove("blur");
  e.currentTarget.classList.add("selected");
  Array.from(answerContainer.children).forEach((child) => {
    child.disabled = true;
    if (child.dataset.index == questionObj.answer) {
      child.style.backgroundColor = "green";
    } else {
      child.style.backgroundColor = "red";
    }
  });
  if (e.currentTarget.dataset.index == questionObj.answer) {
    points++;
    score.innerText = "Score: " + points;
    timer.innerText = "Bonne réponse !";
    timer.style.color = "lightgreen";
  } else {
    timer.innerText = "Mauvaise réponse !";
    timer.style.color = "lightcoral";
  }
  idDelayWhenStoped = setTimeout(() => {
    counter = 1;
    next++;
    quiz(next);
  }, 5000);
}

/**
 * @function getNextQuestion
 * @desc Affiche la question suivante
 * @param {Event} e - Événement
 * @returns {void}
 */
function getNextQuestion(e) {

  counter = 1;
  next++;
  quiz(next);
}

/**
 * @function createQuizElements
 * @desc Créer les éléments du quiz
 * @param {Object} questionObj - Objet contenant les données de la question
 * @param {Number} totalQuestions - Nombre total de questions
 * @returns {void}
 */
function createQuizElements(questionObj, totalQuestions) {
  image = document.createElement("img");
  image.src = questionObj.imageUrl ?? "images/spongebob.jpg";
  image.alt = questionObj.question;
  image.classList.add("quiz__image", "blur");
  question = document.createElement("h2");
  question.classList.add("quiz__question");
  question.innerText = questionObj.question;
  timer = document.createElement("p");
  timer.classList.add("quiz__timer");
  timer.innerText = "0 secondes";
  metaContainer = document.createElement("div");
  metaContainer.classList.add("quiz__meta");
  score = document.createElement("p");
  score.classList.add("quiz__score");
  score.innerText = "Score: " + points;
  num = document.createElement("p");
  num.classList.add("quiz__num");
  num.innerText = "Question " + next + " / " + totalQuestions;
  nextButton = document.createElement("div");
  nextButton.classList.add("quiz__next");
  nextButton.innerText = "Question suivante →";
  nextButton.addEventListener("click", (e) => getNextQuestion(e));
  metaContainer.append(num, score, nextButton);
  answerContainer = document.createElement("div");
  answerContainer.classList.add("quiz__answers");
  questionObj.options.forEach((option, i) => {
    answer = document.createElement("button");
    answer.classList.add("quiz__btn", "btn", "btn-theme" + (i + 1));
    answer.dataset.index = i;
    answer.innerText = option;
    answer.addEventListener("click", (e) => stopTimer(e, questionObj));
    answerContainer.appendChild(answer);
  });

  quizContainer.append(image, question, answerContainer, metaContainer, timer);
}

/**
 * @function endOfQuiz
 * @desc Affiche le score final et le bouton de redémarrage
 * @param {Array} questions - Tableau des questions
 * @returns {void}
 */
function endOfQuiz(questions) {
  quizContainer.innerHTML = `<h2>Fin du quiz</h2>`;
  if (points < questions.length / 2) {
    quizContainer.innerHTML += `<img src="images/loose.gif" alt="Spongebob" class="quiz__image">`;
  } else {
    quizContainer.innerHTML += `<img src="images/win.gif" alt="Spongebob" class="quiz__image">`;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
  quizContainer.innerHTML += `<p>Vous avez obtenu ${points} points sur ${questions.length}</p>`;

  // Ajouter le bouton de redémarrage
  const restartButton = document.createElement("button");
  restartButton.classList.add("btn", "btn-start");
  restartButton.innerText = "Rejouez";
  restartButton.addEventListener("click", restartQuiz);
  quizContainer.appendChild(restartButton);
}

/**
 * @function restartQuiz
 * @desc Remettre à zéro les variables et redémarrer le quiz
 * @returns {void}
 */
function restartQuiz() {
  // Remettre à zéro les variables et redémarrer le quiz
  clearInterval(idTimeInterval);
  clearTimeout(idDelayWhenStoped);
  clearTimeout(idDelayTransition);
  points = 0;
  counter = 1;
  next = 1;
  quiz(next);
}
