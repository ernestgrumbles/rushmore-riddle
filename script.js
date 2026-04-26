
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// ── Sound effects (Web Audio API — no files needed) ──────────────────────────
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
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

// Questions grouped by president. Each game picks:
//   3 general (base of mountain) +
//   3 washington + 2 jefferson + 2 roosevelt + 2 lincoln  =  12 total
const questionPool = {
  general: [
    { q: "Which U.S. state has the longest coastline?", a: ["California", "Florida", "Alaska"], correct: 2 },
    { q: "How many stripes are on the U.S. flag?", a: ["12", "13", "15"], correct: 1 },
    { q: "What is the tallest mountain in North America?", a: ["Mount Logan", "Denali", "Mount Rainier"], correct: 1 },
    { q: "How many justices sit on the U.S. Supreme Court?", a: ["7", "9", "11"], correct: 1 },
    { q: "What is the largest U.S. state by area?", a: ["Texas", "California", "Alaska"], correct: 2 },
    { q: "What year did Pearl Harbor occur?", a: ["1939", "1941", "1943"], correct: 1 },
    { q: "What is the national bird of the United States?", a: ["Golden Eagle", "Bald Eagle", "Wild Turkey"], correct: 1 },
    { q: "Which state was the last to be admitted to the Union?", a: ["Hawaii", "Alaska", "New Mexico"], correct: 0 },
    { q: "How many senators does each U.S. state have?", a: ["1", "2", "3"], correct: 1 },
    { q: "What is the smallest U.S. state by area?", a: ["Connecticut", "Rhode Island", "Delaware"], correct: 1 },
    { q: "Which U.S. city is known as the 'Windy City'?", a: ["Detroit", "Chicago", "Cleveland"], correct: 1 },
    { q: "What is the longest river in the United States?", a: ["Colorado River", "Mississippi River", "Missouri River"], correct: 2 },
    { q: "What state is Mount Rushmore located in?", a: ["Wyoming", "Montana", "South Dakota"], correct: 2 },
    { q: "How many stars are on the U.S. flag?", a: ["48", "50", "52"], correct: 1 },
    { q: "What year was the Statue of Liberty dedicated?", a: ["1876", "1886", "1896"], correct: 1 },
    { q: "Which state is known as the 'Sunshine State'?", a: ["California", "Arizona", "Florida"], correct: 2 },
    { q: "What year did the Great Depression begin?", a: ["1927", "1929", "1931"], correct: 1 },
    { q: "What year did the U.S. land on the moon?", a: ["1967", "1969", "1971"], correct: 1 },
    { q: "Which war was known as 'The Great War'?", a: ["World War I", "World War II", "Korean War"], correct: 0 },
    { q: "Who gave the 'I Have a Dream' speech?", a: ["Malcolm X", "Martin Luther King Jr.", "Thurgood Marshall"], correct: 1 },
  ],
  washington: [
    { q: "Who was the first U.S. president?", a: ["John Adams", "George Washington", "Thomas Jefferson"], correct: 1 },
    { q: "What treaty ended the Revolutionary War?", a: ["Treaty of Paris", "Treaty of Versailles", "Treaty of Ghent"], correct: 0 },
    { q: "Which city hosted the first U.S. capital?", a: ["New York", "Philadelphia", "Boston"], correct: 0 },
    { q: "How many original colonies were there?", a: ["12", "13", "14"], correct: 1 },
    { q: "What year was the U.S. Constitution signed?", a: ["1776", "1783", "1787"], correct: 2 },
    { q: "In what year did George Washington become president?", a: ["1789", "1787", "1792"], correct: 0 },
    { q: "Which state was George Washington from?", a: ["Virginia", "Massachusetts", "New York"], correct: 0 },
    { q: "Washington famously crossed which river on Christmas night, 1776?", a: ["Potomac River", "Hudson River", "Delaware River"], correct: 2 },
    { q: "What was the first U.S. state admitted to the Union?", a: ["Virginia", "Massachusetts", "Delaware"], correct: 2 },
    { q: "Which amendment to the Constitution guarantees freedom of speech?", a: ["1st", "2nd", "4th"], correct: 0 },
  ],
  jefferson: [
    { q: "Who wrote the Declaration of Independence?", a: ["Benjamin Franklin", "Thomas Jefferson", "George Washington"], correct: 1 },
    { q: "What major document begins 'We hold these truths to be self-evident'?", a: ["The Constitution", "The Bill of Rights", "The Declaration of Independence"], correct: 2 },
    { q: "Which president made the Louisiana Purchase?", a: ["Thomas Jefferson", "John Adams", "James Madison"], correct: 0 },
    { q: "Thomas Jefferson founded which university?", a: ["Harvard", "University of Virginia", "Yale"], correct: 1 },
    { q: "In what year was the Declaration of Independence signed?", a: ["1774", "1776", "1778"], correct: 1 },
    { q: "What was Thomas Jefferson's Virginia home called?", a: ["Monticello", "Mount Vernon", "Montpelier"], correct: 0 },
    { q: "Thomas Jefferson was the ___ U.S. president.", a: ["2nd", "3rd", "4th"], correct: 1 },
  ],
  roosevelt: [
    { q: "Which president greatly expanded the U.S. National Parks system?", a: ["William Taft", "Theodore Roosevelt", "Woodrow Wilson"], correct: 1 },
    { q: "Theodore Roosevelt led which famous military unit in Cuba?", a: ["Blue Brigade", "Rough Riders", "Iron Guard"], correct: 1 },
    { q: "Which president won the Nobel Peace Prize in 1906?", a: ["William Taft", "Woodrow Wilson", "Theodore Roosevelt"], correct: 2 },
    { q: "The 'Teddy bear' was named after which president?", a: ["Theodore Roosevelt", "Franklin Roosevelt", "William Taft"], correct: 0 },
    { q: "Complete Roosevelt's motto: 'Speak softly and carry a big ___.'", a: ["gun", "club", "stick"], correct: 2 },
    { q: "Theodore Roosevelt was the ___ U.S. president.", a: ["24th", "26th", "28th"], correct: 1 },
    { q: "What was Theodore Roosevelt's famous nickname?", a: ["Old Hickory", "Teddy", "The Bull Moose"], correct: 1 },
  ],
  lincoln: [
    { q: "Which president signed the Emancipation Proclamation?", a: ["Ulysses Grant", "Abraham Lincoln", "Andrew Johnson"], correct: 1 },
    { q: "What year did the Civil War end?", a: ["1863", "1865", "1867"], correct: 1 },
    { q: "Which amendment to the Constitution abolished slavery?", a: ["13th", "14th", "15th"], correct: 0 },
    { q: "In what year was Abraham Lincoln assassinated?", a: ["1863", "1865", "1868"], correct: 1 },
    { q: "Who assassinated Abraham Lincoln?", a: ["John Wilkes Booth", "Charles Guiteau", "Leon Czolgosz"], correct: 0 },
    { q: "Lincoln delivered the Gettysburg Address in which year?", a: ["1861", "1863", "1865"], correct: 1 },
    { q: "Abraham Lincoln was the ___ U.S. president.", a: ["14th", "16th", "18th"], correct: 1 },
    { q: "What was Abraham Lincoln's famous nickname?", a: ["Honest Abe", "Old Hickory", "Rough Rider"], correct: 0 },
  ],
};

let questions = [];

function pickRandom(pool, n) {
  const arr = pool.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

function shuffleAndSelectQuestions() {
  // Q0-Q2: general (base of mountain)
  // Q3-Q5: Washington's face
  // Q6-Q7: Jefferson's face
  // Q8-Q9: Roosevelt's face
  // Q10-Q11: Lincoln's face
  questions = [
    ...pickRandom(questionPool.general, 3),
    ...pickRandom(questionPool.washington, 3),
    ...pickRandom(questionPool.jefferson, 2),
    ...pickRandom(questionPool.roosevelt, 2),
    ...pickRandom(questionPool.lincoln, 2),
  ];
}

// ── Face expression overlay system ───────────────────────────────────────────

// Face centers as fractions of the original image (cx/cy from top-left, fw = face width / image width).
// Image is 1024×1536. Tune these if faces don't line up on screen.
const faceDefs = {
  washington: { cx: 0.215, cy: 0.400, fw: 0.250 },
  jefferson:  { cx: 0.390, cy: 0.315, fw: 0.210 },
  roosevelt:  { cx: 0.525, cy: 0.245, fw: 0.190 },
  lincoln:    { cx: 0.665, cy: 0.190, fw: 0.180 },
};

// Which president is the climber standing on at each question index
const faceAtQ = {
  3:'washington', 4:'washington', 5:'washington',
  6:'jefferson',  7:'jefferson',
  8:'roosevelt',  9:'roosevelt',
  10:'lincoln',   11:'lincoln',
};

const faceSVGs = {
  washington: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" style="width:100%;height:100%;overflow:visible">
    <g class="face-expr face-expr-alert">
      <path d="M12 27 Q30 15 48 24" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M52 24 Q70 15 88 27" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="30" cy="47" rx="14" ry="15" fill="white" opacity="0.60"/>
      <ellipse cx="70" cy="47" rx="14" ry="15" fill="white" opacity="0.60"/>
      <ellipse cx="50" cy="82" rx="9" ry="10" fill="white" stroke="#6A2A10" stroke-width="2.5" opacity="0.75"/>
    </g>
    <g class="face-expr face-expr-smug">
      <path d="M52 22 Q70 13 88 25" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M34 80 Q48 71 63 77" stroke="#6A2A10" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`,

  jefferson: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" style="width:100%;height:100%;overflow:visible">
    <g class="face-expr face-expr-alert">
      <path d="M14 29 Q32 18 50 25" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M50 25 Q68 18 86 29" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="31" cy="47" rx="13" ry="14" fill="white" opacity="0.60"/>
      <ellipse cx="69" cy="47" rx="13" ry="14" fill="white" opacity="0.60"/>
      <ellipse cx="50" cy="80" rx="8" ry="9" fill="white" stroke="#6A2A10" stroke-width="2.5" opacity="0.75"/>
    </g>
    <g class="face-expr face-expr-smug">
      <path d="M50 23 Q68 15 86 26" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M35 78 Q49 70 63 76" stroke="#6A2A10" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`,

  roosevelt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" style="width:100%;height:100%;overflow:visible">
    <g class="face-expr face-expr-alert">
      <path d="M14 27 Q32 16 50 23" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M50 23 Q68 16 86 27" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <circle cx="31" cy="47" r="15" fill="none" stroke="#2A1808" stroke-width="3.5" opacity="0.75"/>
      <circle cx="69" cy="47" r="15" fill="none" stroke="#2A1808" stroke-width="3.5" opacity="0.75"/>
      <ellipse cx="50" cy="82" rx="8" ry="9" fill="white" stroke="#6A2A10" stroke-width="2.5" opacity="0.75"/>
    </g>
    <g class="face-expr face-expr-smug">
      <path d="M50 21 Q68 13 86 24" stroke="#3A2010" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M26 65 Q38 57 50 62 Q62 57 74 65" stroke="#2A1808" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M34 78 Q50 70 66 76" stroke="#6A2A10" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`,

  lincoln: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" style="width:100%;height:100%;overflow:visible">
    <g class="face-expr face-expr-alert">
      <path d="M14 25 Q32 14 50 21" stroke="#2A1808" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M50 21 Q68 14 86 25" stroke="#2A1808" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="31" cy="44" rx="13" ry="14" fill="white" opacity="0.60"/>
      <ellipse cx="69" cy="44" rx="13" ry="14" fill="white" opacity="0.60"/>
      <ellipse cx="50" cy="75" rx="8" ry="8" fill="white" stroke="#3A1808" stroke-width="2.5" opacity="0.75"/>
    </g>
    <g class="face-expr face-expr-smug">
      <path d="M50 20 Q68 12 86 23" stroke="#2A1808" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M30 74 Q50 66 70 72" stroke="#3A1808" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`,
};

let faceOverlaysReady = false;

function setupFaceOverlays() {
  Object.keys(faceDefs).forEach(name => {
    const el = document.getElementById('face-' + name);
    if (el && !el.innerHTML) el.innerHTML = faceSVGs[name];
  });
  positionFaceOverlays();
  if (!faceOverlaysReady) {
    window.addEventListener('resize', positionFaceOverlays);
    faceOverlaysReady = true;
  }
}

function positionFaceOverlays() {
  const img = document.getElementById('mountain-bg');
  if (!img || !img.naturalWidth) return;
  const container = document.getElementById('game-container');
  const cW = container.offsetWidth;
  const cH = container.offsetHeight;
  const iW = img.naturalWidth;
  const iH = img.naturalHeight;
  const scale = Math.max(cW / iW, cH / iH);
  const rW = iW * scale;
  const rH = iH * scale;
  const oX = (cW - rW) / 2;
  const oY = 0;
  Object.entries(faceDefs).forEach(([name, d]) => {
    const el = document.getElementById('face-' + name);
    if (!el) return;
    const x = d.cx * rW + oX;
    const y = d.cy * rH + oY;
    const w = d.fw * rW;
    const h = w * 1.15;
    el.style.left = (x - w / 2) + 'px';
    el.style.top  = (y - h / 2) + 'px';
    el.style.width  = w + 'px';
    el.style.height = h + 'px';
  });
}

function setExpression(president, expr) {
  const el = document.getElementById('face-' + president);
  if (el) el.dataset.expr = expr;
}

function clearAllExpressions() {
  ['washington', 'jefferson', 'roosevelt', 'lincoln'].forEach(p => setExpression(p, 'neutral'));
}
// ─────────────────────────────────────────────────────────────────────────────

// Climber path calibrated for the diagonal portrait image.
// Steps 3-5 → Washington, 6-7 → Jefferson, 8-9 → Roosevelt, 10-11 → Lincoln, 12 → peak.
const climberPath = [
  { bottom: '23%', left: '10%' },  // 0: base of mountain
  { bottom: '31%', left: '12%' },  // 1: lower rock face
  { bottom: '39%', left: '17%' },  // 2: approaching Washington
  { bottom: '43%', left: '20%' },  // 3: Washington's chin
  { bottom: '49%', left: '21%' },  // 4: Washington's nose
  { bottom: '54%', left: '23%' },  // 5: Washington's eye
  { bottom: '57%', left: '37%' },  // 6: Jefferson's chin
  { bottom: '62%', left: '40%' },  // 7: Jefferson's eye
  { bottom: '65%', left: '52%' },  // 8: Roosevelt's nose/mustache
  { bottom: '70%', left: '54%' },  // 9: Roosevelt's eye
  { bottom: '72%', left: '64%' },  // 10: Lincoln's chin
  { bottom: '77%', left: '66%' },  // 11: Lincoln's eye — goat warning!
  { bottom: '89%', left: '53%' },  // 12: at the peak — win!
];

// Sky is in the upper-left of this image; bubbles sit there so they're always visible.
const arrivalReactions = {
  3:  { text: `Washington: "Watch where you're grabbing."`,    left: '26%', bottom: '64%' },
  4:  { text: `Washington: "BOOT. IN. MY. NOSTRIL."`,          left: '26%', bottom: '64%' },
  5:  { text: `Washington: "MY EYE. He poked MY EYE."`,        left: '26%', bottom: '64%' },
  6:  { text: `Jefferson: "Oh no. Oh no no no—"`,              left: '26%', bottom: '72%' },
  7:  { text: `Jefferson: "This is NOT what I envisioned."`,   left: '26%', bottom: '72%' },
  8:  { text: `Roosevelt: "NOT. THE. MUSTACHE."`,              left: '26%', bottom: '79%' },
  9:  { text: `Roosevelt: "I respect the commitment."`,        left: '26%', bottom: '79%' },
  10: { text: `Lincoln: "...deeply undignified."`,             left: '26%', bottom: '84%' },
  11: { text: `Goat: "One more question... don't blow it. 🐐"`,left: '46%', bottom: '88%' },
};

const wrongReactions = {
  3:  { text: `Washington: "Fall. Just FALL."`,              left: '26%', bottom: '64%' },
  4:  { text: `Washington: "MY NOSTRIL IS AVENGED."`,        left: '26%', bottom: '64%' },
  5:  { text: `Washington: "Good. FALL. Far."`,              left: '26%', bottom: '64%' },
  6:  { text: `Jefferson: "Phew. The nose is safe."`,        left: '26%', bottom: '72%' },
  7:  { text: `Jefferson: "HA! Back down you go!"`,          left: '26%', bottom: '72%' },
  8:  { text: `Roosevelt: "HA! The 'stache is SAFE!"`,       left: '26%', bottom: '79%' },
  9:  { text: `Roosevelt: "Almost! Almost."`,                left: '26%', bottom: '79%' },
  10: { text: `Lincoln: "The beard thanks you."`,            left: '26%', bottom: '84%' },
  11: { text: `Goat: "WRONG!! 🐐💥"`,                        left: '46%', bottom: '88%' },
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
  clearAllExpressions();
  const img = document.getElementById('mountain-bg');
  if (img.complete && img.naturalWidth) setupFaceOverlays();
  else img.addEventListener('load', setupFaceOverlays, { once: true });
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

  // Update face expressions
  clearAllExpressions();
  if (faceAtQ[step]) setExpression(faceAtQ[step], 'alert');
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
  const face = faceAtQ[currentQ];
  if (face) {
    setExpression(face, 'smug');
    setTimeout(() => setExpression(face, 'alert'), 2200);
  }
}

function goatButt() {
  clearInterval(timerId);
  document.getElementById('question-box').innerText = '';
  document.getElementById('answers').innerHTML = '';
  showReaction(wrongReactions[questions.length - 1]);
  playGoatButtSound();
  const climber = document.getElementById('climber');
  setTimeout(() => climber.classList.add('falling'), 600);
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
