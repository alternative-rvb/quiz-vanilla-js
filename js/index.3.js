console.log("quiz.js loaded");

/**
 * @file index.js
 * @desc Ce fichier permet de faire un quiz
 */

const quizContainer = document.querySelector("#quiz");
const btn = document.querySelector("#btn-start");

let i = 1;
let next = 1;
const timeLimit = 2;
const questionsUrl = "js/questions/animaux.json";

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
    const timer = document.createElement("p");
    const question = document.createElement("h2");
    question.innerText = questions[id].question;
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
          quiz(next); // Redémarrer l'intervalle
        }, 1000);
      }
    }, 1000);
  } else {
    console.log("ERROR: ID NOT FOUND");
  }
}

btn.addEventListener("click", () => quiz(next)); // Démarrer le premier intervalle

function displayQuestion(time) {}
