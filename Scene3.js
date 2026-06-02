// ─── IR A ESCENA 3 ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-scene3')?.addEventListener('click', goToScene3);
});

function goToScene3() {
  const s2 = document.getElementById('scene2');
  const s3 = document.getElementById('scene3');
  s2.style.transition = 'opacity 1.2s ease';
  s2.style.opacity    = '0';
  setTimeout(() => {
    s2.style.display = 'none';
    s3.classList.add('visible');
    initScene3();
  }, 1200);
}

// ─── SLIDES ──────────────────────────────────────────────────────────────────
const SLIDES = [
   { img: 'img/photo1.jpeg', text: '✨ Hoy celebra el mundo a una persona irrepetible ✨' },
  { img: 'img/photo2.jpeg', text: '🌸 Tu sonrisa tiene el poder de alegrar hasta los días más grises 🌸' },
  { img: 'img/photo3.jpeg', text: '💖 Eres de esas personas que dejan huellas bonitas en cada corazón que tocan 💖' },
  { img: 'img/photo4.jpeg', text: '🌟 Tu luz, tu esencia y tu forma de ser hacen que todo sea más especial 🌟' },
  { img: 'img/photo5.jpeg', text: '🎂 Que este nuevo año de vida te regale tantas alegrías como las que tú das 🎂' },
  { img: 'img/photo6.jpeg', text: '💫 Nunca olvides lo increíble, valiente y hermosa que eres 💫' },
  { img: 'img/photo7.jpeg', text: '🌹 Hay personas bonitas, y luego estás tú: única, auténtica y maravillosa 🌹' },
  { img: 'img/photo8.jpeg', text: '✨ Gracias por existir y por hacer más bonito el mundo con tu presencia ✨' },
  { img: 'img/photo9.jpeg', text: '🎁 Hoy no solo cumples años, también acumulas más historias, sueños y momentos por conquistar 🎁' },
  { img: 'img/photo10.jpeg', text: '💜 Feliz cumpleaños, Jairis. Que la vida te sonría tanto como tú nos haces sonreír a los demás 💜' },
];
const N = SLIDES.length;
let idx      = 0;
let flipping = false;

// ─── INIT ────────────────────────────────────────────────────────────────────
function initScene3() {
  document.getElementById('scene3').innerHTML = `
    <canvas id="stars3"></canvas>

    <div id="book-closed">
      <div id="book-cover">
        <div class="cover-deco">❤</div>
        <div class="cover-title">Para<br>Jairis</div>
        <div class="cover-sub">Toca para abrir ✨</div>
      </div>
    </div>

    <div id="book-open">
      <div id="book-text-area"><p id="book-text"></p></div>

      <div id="book-viewer">
        <!-- Fondo fijo -->
        <div id="book-base">
          <div id="base-left"><img id="img-base-left" src="" alt=""></div>
          <div id="book-spine-base"></div>
          <div id="base-right"><img id="img-base-right" src="" alt=""></div>
        </div>

        <!-- Hoja 3D premium -->
        <div id="flip-stage">
          <div id="flip-A">
            <img id="img-A" src="" alt="">
            <div class="page-gloss"></div>
            <canvas class="fold-canvas" id="fold-canvas-A"></canvas>
          </div>
          <div id="flip-B">
            <img id="img-B" src="" alt="">
            <div class="page-gloss"></div>
          </div>
        </div>

        <!-- Sombra proyectada sobre página izquierda -->
        <div id="cast-shadow"></div>

        <!-- Zonas de toque -->
        <div id="tap-left"><div class="page-hint left-hint">‹ anterior</div></div>
        <div class="page-hint right-hint" style="position:absolute;bottom:8px;right:8px;z-index:30;">siguiente ›</div>
      </div>
    </div>`;

  // ── Estrellas ──
  const sv  = document.getElementById('stars3');
  sv.width  = window.innerWidth;
  sv.height = window.innerHeight;
  const sc  = sv.getContext('2d');
  const ST  = Array.from({length:160}, () => ({
    x:Math.random(), y:Math.random(),
    r:.3+Math.random()*1.3, ph:Math.random()*Math.PI*2,
    sp:.007+Math.random()*.013
  }));
  (function loop(ts) {
    sc.clearRect(0,0,sv.width,sv.height);
    ST.forEach(s => {
      const a = .25+.75*Math.abs(Math.sin(ts*s.sp+s.ph));
      sc.beginPath();
      sc.arc(s.x*sv.width, s.y*sv.height, s.r, 0, Math.PI*2);
      sc.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      sc.fill();
    });
    requestAnimationFrame(loop);
  })(0);

  document.getElementById('book-closed').addEventListener('click', openBook);
}

// ─── ABRIR LIBRO ─────────────────────────────────────────────────────────────
function openBook() {
  const closed = document.getElementById('book-closed');
  const open   = document.getElementById('book-open');

  closed.style.transition    = 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease';
  closed.style.transformOrigin = 'left center';
  closed.style.transform     = 'perspective(800px) rotateY(-100deg) scale(0.85)';
  closed.style.opacity       = '0';

  setTimeout(() => {
    closed.style.display = 'none';
    open.classList.add('visible');
    setSlide(0);

    document.getElementById('flip-stage').addEventListener('click', () => turn('next'));
    document.getElementById('tap-left').addEventListener('click',   () => turn('prev'));
  }, 680);
}

// ─── CARGAR SLIDE (sin animación) ────────────────────────────────────────────
function setSlide(i) {
  idx = i;
  const cur  = SLIDES[i];
  const prev = SLIDES[(i - 1 + N) % N];
  const next = SLIDES[(i + 1) % N];

  // Fondo
  document.getElementById('img-base-left').src  = prev.img;
  document.getElementById('img-base-right').src = cur.img;

  // Hoja: cara A = foto actual, cara B = siguiente (precargada)
  document.getElementById('img-A').src = cur.img;
  document.getElementById('img-B').src = next.img;

  const fs = document.getElementById('flip-stage');
  fs.style.transition = 'none';
  fs.style.transform  = 'rotateY(0deg)';
  fs.classList.remove('turning');

  setText(cur.text);
}

// ─── MOTOR DE ANIMACIÓN ───────────────────────────────────────────────────────
/*
  Técnica: animación frame-by-frame con requestAnimationFrame
  para poder actualizar la sombra de curvatura en canvas cada frame.

  La hoja gira de 0° a -180° (next) o de -180° a 0° (prev).
  Cada frame:
    1. Actualiza rotateY del flip-stage
    2. Dibuja la sombra de curvatura en el canvas (gradiente que simula el pliegue)
    3. Ajusta la sombra proyectada sobre la página izquierda
    4. Cambia filter drop-shadow en función del ángulo
*/

const DURATION = 950; // ms — elegante y suave

function turn(dir) {
  if (flipping) return;
  flipping = true;

  const nextIdx = dir === 'next' ? (idx + 1) % N : (idx - 1 + N) % N;
  const nextSlide  = SLIDES[nextIdx];
  const afterNext  = SLIDES[(nextIdx + 1) % N];
  const beforeNext = SLIDES[(nextIdx - 1 + N) % N];

  const fs     = document.getElementById('flip-stage');
  const shadow = document.getElementById('cast-shadow');
  const foldCv = document.getElementById('fold-canvas-A');

  // Precargar imágenes correctas
  if (dir === 'next') {
    document.getElementById('img-B').src          = nextSlide.img;
    document.getElementById('img-base-right').src = nextSlide.img;
  } else {
    document.getElementById('img-A').src          = nextSlide.img;
    document.getElementById('img-B').src          = SLIDES[(nextIdx + 1) % N].img;
    document.getElementById('img-base-right').src = nextSlide.img;
    document.getElementById('img-base-left').src  = beforeNext.img;
  }

  const startDeg = dir === 'next' ? 0   : -180;
  const endDeg   = dir === 'next' ? -180 : 0;

  // Quitar transición CSS — usaremos RAF
  fs.style.transition = 'none';
  fs.style.transform  = `rotateY(${startDeg}deg)`;
  fs.classList.add('turning');
  void fs.offsetWidth;

  const startTime = performance.now();

  // Dimensiones del canvas de curvatura
  function resizeFold() {
    const r = foldCv.parentElement.getBoundingClientRect();
    foldCv.width  = r.width;
    foldCv.height = r.height;
  }
  resizeFold();
  const fctx = foldCv.getContext('2d');

  function easeInOut(t) {
    // cubic ease-in-out + leve overshoot al llegar
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function drawFoldShadow(progress, dir) {
    // progress 0→1
    // Dibuja un degradado vertical que simula la curvatura de la hoja
    // Más intenso en el pico del giro (progress ≈ 0.5)
    fctx.clearRect(0, 0, foldCv.width, foldCv.height);

    const peak = 1 - Math.abs(progress * 2 - 1); // 0→1→0
    if (peak < 0.02) return;

    // Sombra en el borde izquierdo (lomo) de la hoja que se dobla
    const grad = fctx.createLinearGradient(0, 0, foldCv.width * 0.35, 0);
    grad.addColorStop(0,    `rgba(0,0,0,${0.45 * peak})`);
    grad.addColorStop(0.4,  `rgba(0,0,0,${0.15 * peak})`);
    grad.addColorStop(1,    'rgba(0,0,0,0)');
    fctx.fillStyle = grad;
    fctx.fillRect(0, 0, foldCv.width, foldCv.height);

    // Línea de doblez brillante en el lomo
    const lineGrad = fctx.createLinearGradient(0, 0, 0, foldCv.height);
    lineGrad.addColorStop(0,   `rgba(255,255,255,${0.12 * peak})`);
    lineGrad.addColorStop(0.5, `rgba(255,255,255,${0.22 * peak})`);
    lineGrad.addColorStop(1,   `rgba(255,255,255,${0.12 * peak})`);
    fctx.fillStyle = lineGrad;
    fctx.fillRect(0, 0, 3, foldCv.height);
  }

  function animFrame(now) {
    const elapsed  = now - startTime;
    const rawT     = Math.min(elapsed / DURATION, 1);
    const easedT   = easeInOut(rawT);
    const curDeg   = startDeg + (endDeg - startDeg) * easedT;
    const progress = dir === 'next' ? rawT : 1 - rawT;

    // 1. Rotar hoja
    fs.style.transform = `rotateY(${curDeg}deg)`;

    // 2. Curvatura en canvas
    drawFoldShadow(progress, dir);

    // 3. Sombra sobre página izquierda
    const shadowIntensity = Math.sin(progress * Math.PI); // 0→1→0
    shadow.style.opacity  = (shadowIntensity * 0.55).toFixed(3);

    // 4. Drop-shadow lateral (grosor de la hoja)
    const absAngle    = Math.abs(curDeg);
    const midProgress = 1 - Math.abs(absAngle - 90) / 90; // peak en 90°
    const dsBlur      = (midProgress * 12).toFixed(1);
    const dsOpacity   = (midProgress * 0.6).toFixed(2);
    fs.style.filter   = `drop-shadow(-${dsBlur}px 0 ${dsBlur}px rgba(0,0,0,${dsOpacity}))`;

    if (rawT < 1) {
      requestAnimationFrame(animFrame);
    } else {
      // ── FINALIZAR ──
      fs.style.transform = `rotateY(${endDeg}deg)`;
      fctx.clearRect(0, 0, foldCv.width, foldCv.height);
      shadow.style.opacity = '0';
      fs.style.filter      = 'none';
      fs.classList.remove('turning');

      idx = nextIdx;

      if (dir === 'next') {
        // Resetear hoja a cara A con la nueva foto
        fs.style.transition = 'none';
        fs.style.transform  = 'rotateY(0deg)';
        document.getElementById('img-A').src          = nextSlide.img;
        document.getElementById('img-B').src          = afterNext.img;
        document.getElementById('img-base-left').src  = beforeNext.img;
        document.getElementById('img-base-right').src = nextSlide.img;
        void fs.offsetWidth;
      } else {
        document.getElementById('img-B').src = SLIDES[(nextIdx + 1) % N].img;
      }

      setText(nextSlide.text);
      flipping = false;

      if (dir === 'next' && nextIdx === N - 1) {
        setTimeout(closeBookAndGoScene4, 3000);
      }
    }
  }

  requestAnimationFrame(animFrame);
}

// ─── CERRAR LIBRO → ESCENA 4 ─────────────────────────────────────────────────
function closeBookAndGoScene4() {
  if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
  const open = document.getElementById('book-open');
  const s3   = document.getElementById('scene3');

  open.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease';
  open.style.transform  = 'perspective(1000px) rotateX(8deg) scale(0.72)';
  open.style.opacity    = '0';

  setTimeout(() => {
    s3.style.transition = 'opacity 0.9s ease';
    s3.style.opacity    = '0';
    setTimeout(() => { s3.style.display = 'none'; goToScene4(); }, 920);
  }, 780);
}

// ─── TEXTO — MÁQUINA DE ESCRIBIR ─────────────────────────────────────────────
let typeTimer = null;

function setText(txt) {
  const el = document.getElementById('book-text');
  if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
  el.textContent = '';
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent = txt.slice(0, i) + '|';
    i++;
    if (i > txt.length) {
      clearInterval(typeTimer);
      typeTimer = null;
      el.textContent = txt;
    }
  }, 45);
}