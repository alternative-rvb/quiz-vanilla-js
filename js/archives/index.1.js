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
  const p = document.createElement("p");
  quizContainer.appendChild(p);
  const sec = setInterval(() => {
    console.log(i + " sec");
    p.innerText = i == 1 ? i + " seconde" : i + " secondes";
    i++;
    if (i === timeLimit) {
      i = 1;
      clearInterval(sec);
      next++;
      p.innerText = "Temps écoulé !";
      quiz(); // Redémarrer l'intervalle
    }
  }, intervalDuration);
}

btn.addEventListener("click", quiz); // Démarrer le premier intervalle

function displayQuestion(time) {}
