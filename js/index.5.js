console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce fichier permet de faire un quiz
 */

const quizContainer = document.querySelector("#quiz");
const startbutton = document.querySelector("#btn-start");

let sec;
let question;
let image;
let answerContainer;
let answer;
let metaContainer;
let timer;
let num;
let score;
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
    quizContainer.innerHTML = `<h2>Fin du quiz</h2>
    <p>Vous avez obtenu ${points} points</p>`;

    console.log("End of quiz");
  }
}

function startTimer() {
  console.log("startTimer");
  sec = setInterval(() => {
    console.log(counter + " sec");
    timer.innerText =
      counter == 1 ? counter + " seconde" : counter + " secondes";
    counter++;
    if (counter === timeLimit) {
      clearInterval(sec);
      counter = 1;
      next++;
      timer.innerText = "Temps écoulé !";
      setTimeout(() => {
        quiz(next);
      }, 1000);
    }
  }, 1000);
}

function stopTimer(e, data) {
  // console.log('e:', e)
  clearInterval(sec);
  console.log("stopTimer");
  image.classList.remove("blur");
  e.currentTarget.classList.add("selected");
  Array.from(answerContainer.children).forEach((child) => {
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
  } else {
    timer.innerText = "Mauvaise réponse !";
  }
  setTimeout(() => {
    counter = 1;
    next++;
    quiz(next);
  }, 5000);
}

function getNextQuestion() {
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
  metaContainer = document.createElement("div");
  metaContainer.classList.add("quiz__meta");
  score = document.createElement("p");
  score.classList.add("quiz__score");
  score.innerText = "Score: " + points;
  num = document.createElement("p");
  num.classList.add("quiz__num");
  num.innerText = "Question " + next + " / " + totalQuestions;
  timer = document.createElement("p");
  timer.classList.add("quiz__timer");
  timer.innerText = "0 secondes";
  next = document.createElement("button");
  next.classList.add("quiz__next", "btn", "btn-theme1");
  next.innerText = "Question suivante →";
  next.addEventListener("click", getNextQuestion);
  metaContainer.append(timer, num, score, next);
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

  quizContainer.append(image, question, answerContainer, metaContainer);
}
