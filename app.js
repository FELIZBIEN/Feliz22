// ─── ELEMENTS ────────────────────────────────────────────────────────────────
const canvas  = document.getElementById('c');
const ctx     = canvas.getContext('2d');
const scene1  = document.getElementById('scene1');
const scene2  = document.getElementById('scene2');
const starsCv = document.getElementById('stars');
const sctx    = starsCv.getContext('2d');

let W, H, COLS, ROWS, CELL;

// ─── PIXEL FONT 5×7 ──────────────────────────────────────────────────────────
const FONT = {
  '1':[[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,0]],
  '2':[[0,1,1,1,0],[1,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  '3':[[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,1,1,1,0]],
  'H':[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  'A':[[0,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,0,1,0]],
  'P':[[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  'Y':[[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  'B':[[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
  'I':[[1,1,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[1,1,1,0,0]],
  'R':[[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0]],
  'T':[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  'D':[[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0]],
  'J':[[0,1,1,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,0,1,0,0],[1,0,1,0,0],[0,1,1,0,0]],
  'S':[[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
  'E':[[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0]],
  'Q':[[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,1,0],[0,1,1,0,1]],
  'U':[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  'N':[[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  'O':[[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  'L':[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0]],
  'F':[[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  'Z':[[1,1,1,1,0],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0]],
  'C':[[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
  'V':[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
  'M':[[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  'G':[[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  'K':[[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  '♥':[[0,0,0,0,0],[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0],[0,0,0,0,0]],
};

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
const STEPS = [
  { word:'3',           ms:1400 },
  { word:'2',           ms:1400 },
  { word:'1',           ms:1400 },
  { word:'FELIZ',       ms:2000 },
  { word:'CUMPLEANOS',  ms:2200 },
  { word:'FELICES',     ms:2000 },
  { word:'22',          ms:2500 },
  { word:'JAIRIS',      ms:1800 },
  { word:'PEQUENA',     ms:1800 },
  { word:'LAURI',       ms:1800 },
  { word:'PANA',        ms:1800 },
  { word:'PRECIOSA',    ms:1800 },
  { word:'LEAL',        ms:1600 },
  { word:'VALIENTE',    ms:1800 },
  { word:'HERMOSA',     ms:1800 },
  { word:'DULCE',       ms:1600 },
  { word:'ESPECIAL',    ms:1800 },
  { word:'BRILLANTE',   ms:1800 },
  { word:'ADMIRABLE',   ms:1800 },
  { word:'CARISMATICA', ms:2000 },
  { word:'♥',           ms:3500 },
];

// Total duration of one full loop
const TOTAL_MS = STEPS.reduce((a, s) => a + s.ms, 0);

// ─── CELL SIZE (responsive) ───────────────────────────────────────────────────
function computeCell() {
  const GW = 5, GAP = 1;
  let maxCells = 0;
  for (const s of STEPS) {
    const cells = s.word.length * (GW + GAP) - GAP;
    if (cells > maxCells) maxCells = cells;
  }
  const maxCell = Math.floor((window.innerWidth * 0.84) / maxCells);
  return Math.max(6, Math.min(18, maxCell));
}

// ─── BUILD LIT SET ────────────────────────────────────────────────────────────
function buildLitSet(word) {
  const GW = 5, GH = 7, GAP = 1;
  const lit = new Set();
  let xOff = 0;
  for (const ch of word) {
    const g = FONT[ch];
    if (!g) { xOff += 3 + GAP; continue; }
    for (let r = 0; r < GH; r++)
      for (let c = 0; c < GW; c++)
        if (g[r] && g[r][c]) lit.add(`${xOff+c},${r}`);
    xOff += GW + GAP;
  }
  return { lit, totalW: xOff - GAP, totalH: GH };
}

const RAIN = 'HAPPYBIRTHDAYJAIRISLAURIhappybirthday0123456789♥★✦❤✨';

let drops, speeds;

function setup() {
  CELL  = computeCell();
  W     = canvas.width  = starsCv.width  = window.innerWidth;
  H     = canvas.height = starsCv.height = window.innerHeight;
  COLS  = Math.floor(W / CELL);
  ROWS  = Math.floor(H / CELL);
  drops  = Array.from({length: COLS}, () => -(Math.random() * ROWS * 0.8));
  speeds = Array.from({length: COLS}, () =>  0.15 + Math.random() * 0.22);
}
setup();
window.addEventListener('resize', setup);

// ─── STARS ───────────────────────────────────────────────────────────────────
const STARS = Array.from({length: 180}, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.3 + Math.random() * 1.4,
  phase: Math.random() * Math.PI * 2,
  speed: 0.008 + Math.random() * 0.015,
}));

function drawStars(ts) {
  sctx.clearRect(0, 0, W, H);
  for (const s of STARS) {
    const a = 0.3 + 0.7 * Math.abs(Math.sin(ts * s.speed + s.phase));
    sctx.beginPath();
    sctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
    sctx.fill();
  }
}

// ─── SCENE TRANSITION ────────────────────────────────────────────────────────
let scene2Active = false;

function goToScene2() {
  if (scene2Active) return;
  scene2Active = true;
  scene1.classList.add('hidden');
  scene2.classList.add('visible');
}

// ─── STATE ───────────────────────────────────────────────────────────────────
let stepIdx = 0, stepStart = null;
let cur = buildLitSet(STEPS[0].word);
let loopCount = 0;

// ─── FRAME ───────────────────────────────────────────────────────────────────
function frame(ts) {
  if (!stepStart) stepStart = ts;

  // advance step
  if (ts - stepStart > STEPS[stepIdx].ms) {
    stepIdx++;
    stepStart = ts;
    // After one full loop → go to scene 2
    if (stepIdx >= STEPS.length) {
      stepIdx = 0;
      loopCount++;
      if (loopCount >= 1) { goToScene2(); }
    }
    cur = buildLitSet(STEPS[stepIdx].word);
  }

  // ── SCENE 2 stars loop ──
  if (scene2Active) {
    drawStars(ts);
    requestAnimationFrame(frame);
    return;
  }

  // ── SCENE 1: Matrix ──
  const { lit, totalW, totalH } = cur;
  const originCol = Math.round((COLS - totalW) / 2);
  const originRow = Math.round((ROWS - totalH) / 2);

  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.fillRect(0, 0, W, H);
  ctx.font = `bold ${CELL}px monospace`;

  for (let col = 0; col < COLS; col++) {
    const x  = col * CELL;
    const gc = col - originCol;

    // Draw all lit glyph cells in this column
    if (gc >= 0 && gc < totalW) {
      for (let gr = 0; gr < totalH; gr++) {
        if (lit.has(`${gc},${gr}`)) {
          const gy  = (originRow + gr) * CELL;
          const dist = Math.abs(drops[col] - (originRow + gr));
          const itn  = Math.max(0.55, 1 - dist * 0.07);
          ctx.shadowColor = '#ff00cc';
          ctx.shadowBlur  = 20 * itn;
          ctx.fillStyle   = `rgba(255,80,220,${itn})`;
          ctx.fillText(RAIN[Math.floor(Math.random() * RAIN.length)], x, gy);
          ctx.shadowBlur  = 0;
        }
      }
    }

    // Rain drop head (outside glyph)
    const row = Math.floor(drops[col]);
    if (row >= 0 && row < ROWS) {
      const gr2     = row - originRow;
      const onGlyph = gc >= 0 && gc < totalW && gr2 >= 0 && gr2 < totalH && lit.has(`${gc},${gr2}`);
      if (!onGlyph) {
        const bright = Math.random() > 0.82;
        ctx.shadowColor = '#aa0055';
        ctx.shadowBlur  = bright ? 10 : 3;
        ctx.fillStyle   = bright ? '#ff2299' : '#880044';
        ctx.fillText(RAIN[Math.floor(Math.random() * RAIN.length)], x, drops[col] * CELL);
        ctx.shadowBlur  = 0;
      }
    }

    drops[col] += speeds[col];
    if (drops[col] > ROWS + 5) drops[col] = -(Math.random() * 10);
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);