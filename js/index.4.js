console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce fichier permet de faire un quiz
 */

const quizContainer = document.querySelector("#quiz");
const startbutton = document.querySelector("#btn-start");

let question;
let timer;
let image;
let answerContainer;
let answer;

// Réglages du quiz
let i = 1;
let next = 1;

const timeLimit = 10; // Durée du quiz en secondes
const questionsUrl = "js/questions/animaux.json";

let score = 0;

startbutton.addEventListener("click", () => quiz(next)); // Démarrer le premier intervalle

async function getQuestions() {
  const response = await fetch(questionsUrl);
  const data = await response.json();
  return data;
}

async function quiz(id) {
  const questions = await getQuestions();
  console.log("questions:", questions);

  if (questions[id]) {
    quizContainer.innerHTML = "";

    createQuizElements(questions[id]);

    const sec = setInterval(() => {
      console.log(i + " sec");
      timer.innerText = i == 1 ? i + " seconde" : i + " secondes";
      i++;
      if (i === timeLimit) {
        clearInterval(sec);
        i = 1;
        next++;
        timer.innerText = "Temps écoulé !";
        setTimeout(() => {
          quiz(next); // Redémarrer l'intervalle
        }, 1000);
      }
    }, 1000);
  } else {
    console.log("ERROR: ID NOT FOUND");
  }
}

function createQuizElements(data) {
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
  answerContainer = document.createElement("div");
  answerContainer.classList.add("quiz__answers");
  data.options.forEach((option, i) => {
    answer = document.createElement("button");
    answer.classList.add("quiz__btn", "btn", "btn-theme" + (i + 1));
    answer.dataset.index = i;
    answer.innerText = option;
    answer.addEventListener("click", () => {
      console.log("clicked");
    });
    answerContainer.appendChild(answer);
  });

  quizContainer.append(image, question, answerContainer, timer);
}
