
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// ── Sound effects (Web Audio API — no files needed) ──────────────────────────
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playCorrect() {
  const ctx = getAudio(), now = ctx.currentTime;
  [220, 330].forEach((freq, i) => {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    const t = now + i * 0.09;
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t); osc.stop(t + 0.2);
  });
}

function playWrong() {
  const ctx = getAudio(), now = ctx.currentTime;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(380, now);
  osc.frequency.exponentialRampToValueAtTime(75, now + 0.5);
  g.gain.setValueAtTime(0.2, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.start(now); osc.stop(now + 0.5);
}

function playYelp() {
  const ctx = getAudio(), now = ctx.currentTime;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.connect(g); g.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(750, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
  g.gain.setValueAtTime(0.14, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.start(now); osc.stop(now + 0.18);
}

function playGoatBleat() {
  const ctx = getAudio(), now = ctx.currentTime;
  const osc = ctx.createOscillator(), lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain(), g = ctx.createGain();
  lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
  osc.connect(g); g.connect(ctx.destination);
  osc.type = 'sawtooth'; osc.frequency.value = 290;
  lfo.frequency.value = 10; lfoGain.gain.value = 55;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.18, now + 0.06);
  g.gain.setValueAtTime(0.18, now + 0.38);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
  lfo.start(now); osc.start(now);
  lfo.stop(now + 0.65); osc.stop(now + 0.65);
}

function playWin() {
  const ctx = getAudio(), now = ctx.currentTime;
  [262, 330, 392, 523, 659].forEach((freq, i) => {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'square'; osc.frequency.value = freq;
    const t = now + i * 0.13;
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.4);
  });
}

function playLose() {
  const ctx = getAudio(), now = ctx.currentTime;
  [392, 330, 262, 196].forEach((freq, i) => {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'triangle'; osc.frequency.value = freq;
    const t = now + i * 0.22;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t); osc.stop(t + 0.5);
  });
}
// ─────────────────────────────────────────────────────────────────────────────

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

// Reactions shown when the climber ARRIVES at a step (correct answer).
// Bubbles are positioned in the sky above each president's face.
const arrivalReactions = {
  3:  { text: `Washington: "Watch the chin, pal."`,          left: '27%', bottom: '74%' },
  4:  { text: `Washington: "He grabbed my LIP!!"`,           left: '26%', bottom: '76%' },
  5:  { text: `Washington: "There is a BOOT in my NOSTRIL."`,left: '28%', bottom: '78%' },
  6:  { text: `Washington: "MY EYE. He poked MY EYE."`,      left: '26%', bottom: '73%' },
  7:  { text: `Jefferson: "Ha! Look at George's face 😄"`,   left: '45%', bottom: '73%' },
  8:  { text: `Jefferson: "Oh no. Oh no no no—"`,            left: '45%', bottom: '71%' },
  9:  { text: `Roosevelt: "NOT. THE. MUSTACHE."`,            left: '61%', bottom: '70%' },
  10: { text: `Lincoln: "...deeply undignified."`,           left: '66%', bottom: '71%' },
  11: { text: `Roosevelt: "I respect the commitment."`,      left: '54%', bottom: '73%' },
};

// Reactions shown when the player gets a WRONG answer at that position.
const wrongReactions = {
  3:  { text: `Washington: "Fall. Just FALL."`,              left: '27%', bottom: '74%' },
  4:  { text: `Washington: "Ha! That's for the lip!"`,       left: '26%', bottom: '76%' },
  5:  { text: `Washington: "MY NOSTRIL IS AVENGED."`,        left: '28%', bottom: '78%' },
  6:  { text: `Washington: "Good. FALL. Far."`,              left: '26%', bottom: '73%' },
  7:  { text: `Jefferson: "Ooh! So close... 😬"`,            left: '45%', bottom: '73%' },
  8:  { text: `Jefferson: "Phew. The nose is safe."`,        left: '45%', bottom: '71%' },
  9:  { text: `Roosevelt: "HA! The 'stache is SAFE!"`,       left: '61%', bottom: '70%' },
  10: { text: `Lincoln: "The beard thanks you."`,            left: '66%', bottom: '71%' },
  11: { text: `Goat: "Not today, friend."`,                  left: '54%', bottom: '73%' },
};

let bubbleTimer = null;

function showReaction(reaction) {
  if (!reaction) return;
  const bubble = document.getElementById('speech-bubble');
  document.getElementById('bubble-text').textContent = reaction.text;
  bubble.style.left   = reaction.left;
  bubble.style.bottom = reaction.bottom;
  bubble.classList.add('visible');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('visible'), 3200);
}

let timeLeft, currentQ, timerId;

function startGame() {
  clearInterval(timerId);
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('end-screen').style.display = 'none';
  timeLeft = 120;
  currentQ = 0;
  document.getElementById('time-left').innerText = timeLeft;
  document.getElementById('speech-bubble').classList.remove('visible');
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

  // Sprite faces right by default; flip only when moving left
  const climber = document.getElementById('climber');
  if (step > 0) {
    const prevLeft = parseFloat(climberPath[step - 1].left);
    const currLeft = parseFloat(pos.left);
    climber.style.transform = currLeft < prevLeft ? 'scaleX(-1)' : 'scaleX(1)';
  }

  if (step > 0) playCorrect();
  if (step === 11) setTimeout(playGoatBleat, 400);
  if (arrivalReactions[step]) playYelp();
  showReaction(arrivalReactions[step]);
}

function slipClimber() {
  const area = document.getElementById('climber-area');
  playWrong();
  area.classList.add('slipping');
  setTimeout(() => area.classList.remove('slipping'), 600);
  showReaction(wrongReactions[currentQ]);
}

function updateReaction(text) {
  document.getElementById('reaction-text').innerText = text;
}

function gameOver() {
  playLose();
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  document.getElementById('end-message').innerText = 'Time\'s up! Greg slides back down... 😬';
  document.getElementById('end-screen').style.display = 'flex';
}

function winGame() {
  playWin();
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  document.getElementById('end-message').innerText = '🏔️ You conquered Rushmore! The goat is impressed.';
  document.getElementById('end-screen').style.display = 'flex';
}

function restartGame() {
  startGame();
}
