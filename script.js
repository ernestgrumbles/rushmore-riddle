
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

function playGoatButtSound() {
  // Goat bleat immediately, then surprised rising yell after a beat
  playGoatBleat();
  setTimeout(() => {
    const ctx = getAudio(), now = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.9);
    g.gain.setValueAtTime(0.22, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.start(now); osc.stop(now + 0.9);
  }, 500);
}
// ─────────────────────────────────────────────────────────────────────────────

const questionPool = [
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
  { q: "How many stripes are on the U.S. flag?", a: ["12", "13", "15"], correct: 1 },
  { q: "Which amendment abolished slavery?", a: ["13th", "14th", "15th"], correct: 0 },
  { q: "What is the tallest mountain in North America?", a: ["Mount Logan", "Denali", "Mount Rainier"], correct: 1 },
  { q: "How many justices sit on the U.S. Supreme Court?", a: ["7", "9", "11"], correct: 1 },
  { q: "What year did the Civil War end?", a: ["1863", "1865", "1867"], correct: 1 },
  { q: "Which president served the shortest term?", a: ["William Henry Harrison", "James Garfield", "Zachary Taylor"], correct: 0 },
  { q: "What is the largest U.S. state by area?", a: ["Texas", "California", "Alaska"], correct: 2 },
  { q: "Which war was fought at Gettysburg?", a: ["Revolutionary War", "Civil War", "War of 1812"], correct: 1 },
  { q: "Who was the 16th U.S. president?", a: ["Ulysses Grant", "Abraham Lincoln", "Andrew Jackson"], correct: 1 },
  { q: "In what year did women gain the right to vote in the U.S.?", a: ["1912", "1920", "1924"], correct: 1 },
  { q: "What river forms the border between Texas and Mexico?", a: ["Colorado River", "Rio Grande", "Pecos River"], correct: 1 },
  { q: "Which state is known as the 'Sunshine State'?", a: ["California", "Arizona", "Florida"], correct: 2 },
  { q: "What does NASA stand for?", a: ["National Aeronautics and Space Administration", "National Air and Space Agency", "North American Science Association"], correct: 0 },
  { q: "Who was the first U.S. president?", a: ["John Adams", "George Washington", "Thomas Jefferson"], correct: 1 },
  { q: "How many original colonies were there?", a: ["12", "13", "14"], correct: 1 },
  { q: "Which ocean borders the U.S. to the east?", a: ["Pacific", "Atlantic", "Indian"], correct: 1 },
  { q: "What year did the U.S. land on the moon?", a: ["1967", "1969", "1971"], correct: 1 },
  { q: "Which U.S. president appears on the $100 bill?", a: ["Benjamin Franklin", "Andrew Jackson", "Ulysses Grant"], correct: 0 },
  { q: "Where is the Liberty Bell located?", a: ["Boston", "New York", "Philadelphia"], correct: 2 },
  { q: "What is the national bird of the United States?", a: ["Golden Eagle", "Bald Eagle", "Wild Turkey"], correct: 1 },
  { q: "Which state was the last to be admitted to the Union?", a: ["Hawaii", "Alaska", "New Mexico"], correct: 0 },
  { q: "How many senators does each state have?", a: ["1", "2", "3"], correct: 1 },
  { q: "What year was the U.S. Constitution signed?", a: ["1776", "1783", "1787"], correct: 2 },
  { q: "Who gave the 'I Have a Dream' speech?", a: ["Malcolm X", "Martin Luther King Jr.", "Thurgood Marshall"], correct: 1 },
  { q: "What is the longest river in the U.S.?", a: ["Colorado River", "Mississippi River", "Missouri River"], correct: 2 },
  { q: "Which president created the New Deal?", a: ["Herbert Hoover", "Franklin D. Roosevelt", "Harry Truman"], correct: 1 },
  { q: "What state is Mount Rushmore located in?", a: ["Wyoming", "Montana", "South Dakota"], correct: 2 },
  { q: "Which amendment guarantees freedom of speech?", a: ["1st", "2nd", "4th"], correct: 0 },
  { q: "What city is the headquarters of the United Nations?", a: ["Washington D.C.", "Geneva", "New York City"], correct: 2 },
  { q: "Who invented the telephone?", a: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla"], correct: 1 },
  { q: "What is the capital of the United States?", a: ["New York City", "Washington D.C.", "Philadelphia"], correct: 1 },
  { q: "Which war was known as 'The Great War'?", a: ["World War I", "World War II", "Korean War"], correct: 0 },
  { q: "How many terms did FDR serve as president?", a: ["2", "3", "4"], correct: 2 },
  { q: "What does the 'D.C.' stand for in Washington D.C.?", a: ["District of Columbia", "District of Congress", "Department of Capital"], correct: 0 },
  { q: "Which state is known as the 'Lone Star State'?", a: ["New Mexico", "Texas", "Oklahoma"], correct: 1 },
  { q: "What year did Pearl Harbor occur?", a: ["1939", "1941", "1943"], correct: 1 },
  { q: "Who was the first female U.S. Secretary of State?", a: ["Hillary Clinton", "Condoleezza Rice", "Madeleine Albright"], correct: 2 },
  { q: "What is the smallest U.S. state by area?", a: ["Connecticut", "Rhode Island", "Delaware"], correct: 1 },
  { q: "Which president signed the Civil Rights Act of 1964?", a: ["John F. Kennedy", "Lyndon B. Johnson", "Richard Nixon"], correct: 1 },
  { q: "What is the highest peak in the contiguous U.S.?", a: ["Mount Whitney", "Mount Rainier", "Mount Elbert"], correct: 0 },
  { q: "How many stars are on the U.S. flag?", a: ["48", "50", "52"], correct: 1 },
  { q: "Who was the youngest person to become U.S. president?", a: ["John F. Kennedy", "Theodore Roosevelt", "Bill Clinton"], correct: 1 },
  { q: "What war did the U.S. fight in the 1950s on the Korean peninsula?", a: ["Vietnam War", "Korean War", "Cold War"], correct: 1 },
  { q: "Which U.S. city is known as the 'Windy City'?", a: ["Detroit", "Chicago", "Cleveland"], correct: 1 },
  { q: "What year was the Statue of Liberty dedicated?", a: ["1876", "1886", "1896"], correct: 1 },
  { q: "Which president issued the Monroe Doctrine?", a: ["John Adams", "James Monroe", "Andrew Jackson"], correct: 1 },
  { q: "What is the official language of the United States?", a: ["English", "There is no official language", "American English"], correct: 1 },
  { q: "Who was Abraham Lincoln's vice president during his second term?", a: ["Hannibal Hamlin", "Andrew Johnson", "Schuyler Colfax"], correct: 1 },
  { q: "What major document begins with 'We hold these truths to be self-evident'?", a: ["The Constitution", "The Bill of Rights", "The Declaration of Independence"], correct: 2 },
  { q: "Which state has the most national parks?", a: ["Wyoming", "Colorado", "California"], correct: 2 },
  { q: "What year did the Great Depression begin?", a: ["1927", "1929", "1931"], correct: 1 },
  { q: "Which U.S. president was the first to resign from office?", a: ["Richard Nixon", "Andrew Johnson", "Bill Clinton"], correct: 0 },
];

let questions = [];

function shuffleAndSelectQuestions() {
  const pool = questionPool.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  questions = pool.slice(0, 12);
}

// Waypoints trace a path up the mountain, through each president's face.
// Calibrated for landscape mountain-bg.png.
const climberPath = [
  { bottom: '26%', left: '10%' },  // 0: base of mountain
  { bottom: '36%', left: '10%' },  // 1: lower rock face
  { bottom: '46%', left: '11%' },  // 2: mid-mountain
  { bottom: '52%', left: '13%' },  // 3: Washington's chin
  { bottom: '56%', left: '12%' },  // 4: Washington's lips
  { bottom: '61%', left: '13%' },  // 5: Washington's nose
  { bottom: '66%', left: '16%' },  // 6: Washington's eye
  { bottom: '72%', left: '20%' },  // 7: top of Washington's head
  { bottom: '62%', left: '37%' },  // 8: Jefferson's face
  { bottom: '58%', left: '57%' },  // 9: Roosevelt's mustache
  { bottom: '58%', left: '76%' },  // 10: Lincoln's chin/beard
  { bottom: '76%', left: '50%' },  // 11: upper mountain
  { bottom: '88%', left: '47%' },  // 12: at the peak — win!
];

const arrivalReactions = {
  3:  { text: `Washington: "Watch the chin, pal."`,             left: '16%', bottom: '78%' },
  4:  { text: `Washington: "He grabbed my LIP!!"`,              left: '16%', bottom: '78%' },
  5:  { text: `Washington: "There is a BOOT in my NOSTRIL."`,   left: '18%', bottom: '78%' },
  6:  { text: `Washington: "MY EYE. He poked MY EYE."`,         left: '16%', bottom: '78%' },
  7:  { text: `Jefferson: "Ha! Look at George's face 😄"`,      left: '38%', bottom: '78%' },
  8:  { text: `Jefferson: "Oh no. Oh no no no—"`,               left: '38%', bottom: '78%' },
  9:  { text: `Roosevelt: "NOT. THE. MUSTACHE."`,               left: '58%', bottom: '74%' },
  10: { text: `Lincoln: "...deeply undignified."`,              left: '76%', bottom: '74%' },
  11: { text: `Goat: "One more question... don't blow it. 🐐"`, left: '50%', bottom: '82%' },
};

const wrongReactions = {
  3:  { text: `Washington: "Fall. Just FALL."`,              left: '16%', bottom: '78%' },
  4:  { text: `Washington: "Ha! That's for the lip!"`,       left: '16%', bottom: '78%' },
  5:  { text: `Washington: "MY NOSTRIL IS AVENGED."`,        left: '18%', bottom: '78%' },
  6:  { text: `Washington: "Good. FALL. Far."`,              left: '16%', bottom: '78%' },
  7:  { text: `Jefferson: "Ooh! So close... 😬"`,            left: '38%', bottom: '78%' },
  8:  { text: `Jefferson: "Phew. The nose is safe."`,        left: '38%', bottom: '78%' },
  9:  { text: `Roosevelt: "HA! The 'stache is SAFE!"`,       left: '58%', bottom: '74%' },
  10: { text: `Lincoln: "The beard thanks you."`,            left: '76%', bottom: '74%' },
  11: { text: `Goat: "WRONG!! 🐐💥"`,                        left: '50%', bottom: '82%' },
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
  shuffleAndSelectQuestions();
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('end-screen').style.display = 'none';
  const climber = document.getElementById('climber');
  climber.classList.remove('falling');
  climber.style.transform = '';
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
  if (currentQ === questions.length - 1) {
    goatButt();
    return;
  }
  const area = document.getElementById('climber-area');
  playWrong();
  area.classList.add('slipping');
  setTimeout(() => area.classList.remove('slipping'), 600);
  showReaction(wrongReactions[currentQ]);
}

function goatButt() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  showReaction(wrongReactions[questions.length - 1]);
  playGoatButtSound();
  const climber = document.getElementById('climber');
  setTimeout(() => {
    climber.classList.add('falling');
  }, 600);
  setTimeout(() => {
    document.getElementById('end-message').innerText = '🐐 The goat wins. You\'ve been butted off the mountain!';
    document.getElementById('end-screen').style.display = 'flex';
  }, 2000);
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
