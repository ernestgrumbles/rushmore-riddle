
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);

const questions = [
  { q: "Which U.S. state has the longest coastline?", a: ["California", "Florida", "Alaska"], correct: 2 },
  { q: "What treaty ended the Revolutionary War?", a: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Ghent"], correct: 0 },
  { q: "What's the smallest U.S. capital city by population?", a: ["Montpelier", "Pierre", "Juneau"], correct: 0 },
  { q: "Which U.S. president had a pet alligator?", a: ["John Quincy Adams", "Jefferson", "Lincoln"], correct: 0 },
  { q: "Which state has the most electoral votes?", a: ["Texas", "Florida", "California"], correct: 2 },
  { q: "What year did the U.S. enter World War I?", a: ["1914", "1917", "1918"], correct: 1 },
  { q: "Which city hosted the first U.S. capital?", a: ["New York", "Philadelphia", "Boston"], correct: 0 },
  { q: "Who was the first president born in a hospital?", a: ["Jimmy Carter", "John F. Kennedy", "Ronald Reagan"], correct: 0 },
  { q: "Who wrote the Declaration of Independence?", a: ["Benjamin Franklin", "Thomas Jefferson", "George Washington"], correct: 1 },
  { q: "What was the first U.S. state admitted to the Union?", a: ["Virginia", "Massachusetts", "Delaware"], correct: 2 },
  { q: "Which president signed the Emancipation Proclamation?", a: ["Ulysses Grant", "Abraham Lincoln", "Andrew Johnson"], correct: 1 },
  { q: "How many stripes are on the U.S. flag?", a: ["12", "13", "15"], correct: 1 }
];

// Waypoints trace a path up the mountain, through each president's face.
// Each step corresponds to one correct answer.
// Tweak left/bottom percentages here if positions need adjusting.
const climberPath = [
  { bottom: '13%', left: '28%' },  // 0: base of mountain
  { bottom: '22%', left: '26%' },  // 1: lower rock face
  { bottom: '33%', left: '23%' },  // 2: mid-mountain
  { bottom: '44%', left: '20%' },  // 3: Washington's chin
  { bottom: '50%', left: '17%' },  // 4: Washington's lips — grabs 'em!
  { bottom: '56%', left: '15%' },  // 5: Washington's nose — boot in nostril!
  { bottom: '61%', left: '18%' },  // 6: Washington's eye — poke!
  { bottom: '67%', left: '27%' },  // 7: top of Washington's head
  { bottom: '58%', left: '42%' },  // 8: Jefferson's face
  { bottom: '51%', left: '60%' },  // 9: Roosevelt's mustache
  { bottom: '50%', left: '76%' },  // 10: Lincoln's chin/beard
  { bottom: '67%', left: '60%' },  // 11: upper mountain
  { bottom: '80%', left: '52%' },  // 12: at the peak — win!
];

let timeLeft, currentQ, timerId;

function startGame() {
  clearInterval(timerId);
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('end-screen').style.display = 'none';
  timeLeft = 120;
  currentQ = 0;
  document.getElementById('time-left').innerText = timeLeft;
  positionClimber(0);
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
    currentQ++;
    positionClimber(currentQ);
    if (currentQ < questions.length) {
      showQuestion();
    } else {
      winGame();
    }
  } else {
    slipClimber();
  }
}

function positionClimber(step) {
  const area = document.getElementById('climber-area');
  const pos = climberPath[Math.min(step, climberPath.length - 1)];
  area.style.left = pos.left;
  area.style.bottom = pos.bottom;

  // Flip sprite to face direction of travel
  const climber = document.getElementById('climber');
  if (step > 0) {
    const prevLeft = parseFloat(climberPath[step - 1].left);
    const currLeft = parseFloat(pos.left);
    climber.style.transform = currLeft > prevLeft ? 'scaleX(-1)' : 'scaleX(1)';
  }
}

function slipClimber() {
  const area = document.getElementById('climber-area');
  area.classList.add('slipping');
  setTimeout(() => area.classList.remove('slipping'), 600);
}

function updateReaction(text) {
  document.getElementById('reaction-text').innerText = text;
}

function gameOver() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  document.getElementById('end-message').innerText = 'Time\'s up! Greg slides back down... 😬';
  document.getElementById('end-screen').style.display = 'flex';
}

function winGame() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  document.getElementById('end-message').innerText = '🏔️ You conquered Rushmore! The goat is impressed.';
  document.getElementById('end-screen').style.display = 'flex';
}

function restartGame() {
  startGame();
}
