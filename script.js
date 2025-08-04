
document.getElementById('start-btn').addEventListener('click', function () {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  startGame();
});

const questions = [
  { q: "What year was the Declaration of Independence signed?", a: ["1776", "1789", "1812"], correct: 0 },
  { q: "Which U.S. state borders the most others?", a: ["Tennessee", "Texas", "Missouri"], correct: 2 },
  { q: "What is the capital of South Dakota?", a: ["Pierre", "Sioux Falls", "Bismarck"], correct: 0 }
];

let timeLeft = 90;
let currentQ = 0;
let timerId;

function startGame() {
  document.getElementById('president-reaction').innerText = "Washington: 'Hmm... someone's approaching my chin...'";
  timerId = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      gameOver();
    }
  }, 1000);
  showQuestion();
}

function showQuestion() {
  const qBox = document.getElementById('question-box');
  const ansBox = document.getElementById('answers');
  const q = questions[currentQ];
  qBox.innerText = q.q;
  ansBox.innerHTML = '';
  q.a.forEach((answer, idx) => {
    const btn = document.createElement('button');
    btn.innerText = answer;
    btn.onclick = () => checkAnswer(idx);
    ansBox.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const q = questions[currentQ];
  if (selected === q.correct) {
    document.getElementById('president-reaction').innerText = "Washington: 'Correct. You may climb higher...'";
    currentQ++;
    if (currentQ < questions.length) {
      showQuestion();
    } else {
      winGame();
    }
  } else {
    document.getElementById('president-reaction').innerText = "Washington: 'Wrong answer. Try again...'";
  }
}

function gameOver() {
  document.getElementById('question-box').innerText = "You ran out of time!";
  document.getElementById('answers').innerHTML = "Greg the Goat falls past you... 🐐💨";
  document.getElementById('president-reaction').innerText = "Washington: 'That’s what you get for going up my nose...'";
}

function winGame() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = "You've reached the top!";
  document.getElementById('answers').innerHTML = "🏔️ Congratulations, climber!";
  document.getElementById('president-reaction').innerText = "Washington: 'Well done... even if your methods were disturbing.'";
}
