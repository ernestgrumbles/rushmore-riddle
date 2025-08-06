
document.getElementById('start-btn').addEventListener('click', function () {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  startGame();
});

const questions = [
  { q: "Which president is on the far left of Mt. Rushmore?", a: ["Lincoln", "Washington", "Jefferson"], correct: 1 },
  { q: "Which river carved the Grand Canyon?", a: ["Mississippi", "Colorado", "Snake"], correct: 1 },
  { q: "What’s the capital of Vermont?", a: ["Burlington", "Montpelier", "Rutland"], correct: 1 }
];

let timeLeft = 90;
let currentQ = 0;
let timerId;

function startGame() {
  updateReaction("Washington: 'Hmm... someone’s approaching my chin...'");
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
    updateReaction("Washington: 'Correct. Keep climbing!'");
    currentQ++;
    if (currentQ < questions.length) {
      showQuestion();
    } else {
      winGame();
    }
  } else {
    updateReaction("Washington: 'Wrong. Are you even trying?'");
  }
}

function updateReaction(text) {
  document.getElementById('reaction-text').innerText = text;
}

function gameOver() {
  document.getElementById('question-box').innerText = "You ran out of time!";
  document.getElementById('answers').innerHTML = "Greg the Goat falls... 🐐💨";
  updateReaction("Washington: 'Told you not to climb through my nose.'");
}

function winGame() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = "You've reached the top!";
  document.getElementById('answers').innerHTML = "🏔️ You are victorious!";
  updateReaction("Washington: 'Not bad... for a chin invader.'");
}
