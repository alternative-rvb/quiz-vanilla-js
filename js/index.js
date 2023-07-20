console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce fichier permet de faire un quiz
 */

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

// Réglages du quiz
let counter = 1;
let next = 1;
const timeLimit = 10; // Durée du quiz en secondes
const questionsUrl = "js/questions/animaux.json";

let points = 0;

startbutton.addEventListener("click", () => quiz(next)); // Démarrer le premier intervalle

async function getQuestions() {
  const response = await fetch(questionsUrl);
  const data = await response.json();
  return data;
}

async function quiz(index) {
  const questions = await getQuestions();
  console.log("questions:", questions);

  if (questions[index]) {
    quizContainer.innerHTML = "";

    createQuizElements(questions[index], questions.length);
    startTimer();
  } else {
    endOfQuiz(questions);
    console.log("End of quiz");
  }
}

function startTimer() {
  console.log("startTimer");
  idTimeInterval = setInterval(() => {
    console.log(counter + " sec");
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

function stopTimer(e, data) {
  console.log("e:", e);

  clearInterval(idTimeInterval);
  console.log("stopTimer");
  image.classList.remove("blur");
  e.currentTarget.classList.add("selected");
  Array.from(answerContainer.children).forEach((child) => {
    child.disabled = true;
    if (child.dataset.index == data.answer) {
      child.style.backgroundColor = "green";
    } else {
      child.style.backgroundColor = "red";
    }
  });
  if (e.currentTarget.dataset.index == data.answer) {
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

function getNextQuestion(e) {
  console.log("e:", e);
  clearInterval(idTimeInterval);
  clearTimeout(idDelayWhenStoped);
  clearTimeout(idDelayTransition);
  counter = 1;
  next++;
  quiz(next);
}

function createQuizElements(data, totalQuestions) {
  image = document.createElement("img");
  image.src = data.imageUrl ?? "images/spongebob.jpg";
  image.alt = data.question;
  image.classList.add("quiz__image", "blur");
  question = document.createElement("h2");
  question.classList.add("quiz__question");
  question.innerText = data.question;
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
  data.options.forEach((option, i) => {
    answer = document.createElement("button");
    answer.classList.add("quiz__btn", "btn", "btn-theme" + (i + 1));
    answer.dataset.index = i;
    answer.innerText = option;
    answer.addEventListener("click", (e) => stopTimer(e, data));
    answerContainer.appendChild(answer);
  });

  quizContainer.append(image, question, answerContainer, metaContainer, timer);
}

function endOfQuiz(questions) {
  quizContainer.innerHTML = `<h2>Fin du quiz</h2>`;
  if (points < questions.length / 2) {
    quizContainer.innerHTML += `<img src="images/loose.gif" alt="Spongebob" class="quiz__image">`;
  } else {
    quizContainer.innerHTML += `<img src="images/win.gif" alt="Spongebob" class="quiz__image">`;
  }
  quizContainer.innerHTML += `<p>Vous avez obtenu ${points} points sur ${questions.length}</p>`;

  // Ajouter le bouton de redémarrage
  const restartButton = document.createElement("button");
  restartButton.classList.add("btn", "btn-start");
  restartButton.innerText = "Rejouez";
  restartButton.addEventListener("click", restartQuiz);
  quizContainer.appendChild(restartButton);
}

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






