console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce fichier permet de faire un quiz
 */

const quizContainer = document.querySelector("#quiz");
const btn = document.querySelector("#btn-start");

let i = 1;
let next = 1;
const intervalDuration = 1000;
const timeLimit = 10;

function quiz() {
  quizContainer.innerHTML = "";
  const timer = document.createElement("p");
  const question = document.createElement("h2");
  question.innerText = "Question " + next;
  quizContainer.append(question, timer);
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
        quiz(); // Redémarrer l'intervalle
      }, 1000);
    }
  }, intervalDuration);
}

btn.addEventListener("click", quiz); // Démarrer le premier intervalle

function displayQuestion(time) {}
