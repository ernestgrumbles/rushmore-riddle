
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);

const questions = [
  { q: "Which U.S. state has the longest coastline?", a: ["California", "Florida", "Alaska"], correct: 2 },
  { q: "What treaty ended the Revolutionary War?", a: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Ghent"], correct: 0 },
  { q: "What’s the smallest U.S. capital city by population?", a: ["Montpelier", "Pierre", "Juneau"], correct: 0 },
  { q: "Which U.S. president had a pet alligator?", a: ["Jackson", "Jefferson", "Lincoln"], correct: 0 },
  { q: "Which state has the most electoral votes?", a: ["Texas", "Florida", "California"], correct: 2 },
  { q: "What year did the U.S. enter World War I?", a: ["1914", "1917", "1918"], correct: 1 },
  { q: "Which city hosted the first U.S. capital?", a: ["New York", "Philadelphia", "Boston"], correct: 0 },
  { q: "Who was the first president born in a hospital?", a: ["Jimmy Carter", "John F. Kennedy", "Ronald Reagan"], correct: 0 }
];

let timeLeft, currentQ, timerId;

function startGame() {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('end-screen').style.display = 'none';
  timeLeft = 90;
  currentQ = 0;
  document.getElementById('time-left').innerText = timeLeft;
  updateReaction("Washington: 'Back so soon?'");
  document.getElementById('climber').style.top = '0px';
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
  const q = questions[currentQ];
  document.getElementById('question-box').innerText = q.q;
  const ansBox = document.getElementById('answers');
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
    animateClimber();
    currentQ++;
    if (currentQ < questions.length) {
      showQuestion();
    } else {
      winGame();
    }
  } else {
    updateReaction("Washington: 'Wrong. Try again.'");
  }
}

function animateClimber() {
  const climber = document.getElementById('climber');
  let currentTop = parseInt(climber.style.top || '0');
  climber.style.top = (currentTop - 20) + 'px';
}

function updateReaction(text) {
  document.getElementById('reaction-text').innerText = text;
}

function gameOver() {
  document.getElementById('question-box').innerText = "";
  document.getElementById('answers').innerHTML = "";
  updateReaction("Washington: 'Told you not to climb through my nose.'");
  document.getElementById('end-message').innerText = "Greg the Goat falls... 🐐💨";
  document.getElementById('end-screen').style.display = 'block';
}

function winGame() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = "";
  document.getElementById('answers').innerHTML = "";
  updateReaction("Washington: 'You made it. Somehow.'");
  document.getElementById('end-message').innerText = "🏔️ You conquered Rushmore!";
  document.getElementById('end-screen').style.display = 'block';
}

function restartGame() {
  location.reload();
}
