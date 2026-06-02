// ─── ESCENA 4: LLUVIA DE FOTOS + FUEGOS ─────────────────────────────────────

const HEART_PHOTOS = [
  'img/1.jpeg','img/2.jpeg','img/3.jpeg','img/4.jpeg','img/5.jpeg',
  'img/6.jpeg','img/7.jpeg','img/8.jpeg','img/9.jpeg','img/10.jpeg','img/11.jpeg','img/12.jpeg'
  
];

function goToScene4() {
  const s4 = document.getElementById('scene4');
  s4.style.display = 'flex';
  requestAnimationFrame(() => {
    s4.style.opacity = '1';
    initRain();
    setTimeout(initFireworks, 400);
    setTimeout(() => {
      document.getElementById('fw-message').classList.add('visible');
    }, 1600);
  });
}

// ─── LLUVIA DE FOTOS ─────────────────────────────────────────────────────────
function initRain() {
  const container = document.getElementById('heart-container');
  container.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:hidden;';

  const photos = HEART_PHOTOS;
  let photoIdx = 0;

  function spawnCard() {
    const card = document.createElement('div');
    const size = 70 + Math.random() * 60;  // 70-130px
    const x    = Math.random() * (window.innerWidth - size);
    const rot  = (Math.random() - 0.5) * 40;
    const dur  = 3.5 + Math.random() * 3;   // 3.5-6.5s de caída
    const delay = Math.random() * 0.5;

    card.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: -${size + 20}px;
      width: ${size}px;
      height: ${size}px;
      background: #fff;
      border-radius: 8px;
      padding: 5px 5px 14px 5px;
      box-shadow: 0 0 12px 3px rgba(255,30,130,0.5), 0 4px 20px rgba(0,0,0,0.5);
      overflow: hidden;
      animation: fallDown ${dur}s ${delay}s cubic-bezier(0.25,0.1,0.25,1) forwards;
      transform: rotate(${rot}deg);
      opacity: 0;
      pointer-events: auto;
    `;

    const img = document.createElement('img');
    img.src = photos[photoIdx % photos.length];
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:4px;';
    photoIdx++;

    card.appendChild(img);
    container.appendChild(card);

    // Eliminar después de caer
    setTimeout(() => card.remove(), (dur + delay + 0.5) * 1000);
  }

  // Spawn continuo
  let count = 0;
  const iv = setInterval(() => {
    spawnCard();
    count++;
  }, 280);

  // Inyectar keyframe si no existe
  if (!document.getElementById('fall-style')) {
    const st = document.createElement('style');
    st.id = 'fall-style';
    st.textContent = [
      '@keyframes fallDown {',
      '  0%   { opacity: 0; transform: translateY(0) scale(0.7); }',
      '  8%   { opacity: 1; }',
      '  90%  { opacity: 1; }',
      '  100% { opacity: 0; transform: translateY(110vh) scale(0.95); }',
      '}'
    ].join('');
    document.head.appendChild(st);
  }
}

// ─── FUEGOS ARTIFICIALES ──────────────────────────────────────────────────────
function initFireworks() {
  const canvas = document.getElementById('fw-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];

  class Particle {
    constructor(x, y, hue) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * (5 + Math.random() * 7);
      this.vy = (Math.random() - 0.5) * (5 + Math.random() * 7) - 1.5;
      this.alpha  = 1;
      this.decay  = 0.013 + Math.random() * 0.016;
      this.radius = 1.8 + Math.random() * 2.2;
      this.hue    = hue;
      this.sat    = 80 + Math.random() * 20;
      this.lit    = 55 + Math.random() * 20;
      this.gravity = 0.10;
      this.trail  = [];
    }
    update() {
      this.trail.push({ x:this.x, y:this.y });
      if (this.trail.length > 5) this.trail.shift();
      this.vx *= 0.97; this.vy *= 0.97;
      this.vy += this.gravity;
      this.x  += this.vx; this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      this.trail.forEach((t, i) => {
        const a = (i / this.trail.length) * this.alpha * 0.35;
        ctx.beginPath();
        ctx.arc(t.x, t.y, this.radius * 0.5, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${this.hue},${this.sat}%,${this.lit}%,${a})`;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${this.hue},${this.sat}%,${this.lit}%,${this.alpha})`;
      ctx.shadowColor = `hsla(${this.hue},100%,70%,0.7)`;
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class Rocket {
    constructor() { this.reset(); }
    reset() {
      this.x  = canvas.width  * (0.1 + Math.random() * 0.8);
      this.y  = canvas.height + 10;
      this.tx = canvas.width  * (0.1 + Math.random() * 0.8);
      this.ty = canvas.height * (0.08 + Math.random() * 0.4);
      const ang = Math.atan2(this.ty - this.y, this.tx - this.x);
      const spd = 5 + Math.random() * 6;
      this.vx = Math.cos(ang) * spd;
      this.vy = Math.sin(ang) * spd;
      this.trail    = [];
      this.exploded = false;
      this.hue      = Math.random() * 360;
    }
    update() {
      if (this.exploded) return;
      this.trail.push({ x:this.x, y:this.y });
      if (this.trail.length > 10) this.trail.shift();
      this.vx *= 0.98; this.vy *= 0.98; this.vy += 0.07;
      this.x += this.vx; this.y += this.vy;
      if (Math.hypot(this.x-this.tx, this.y-this.ty) < 14 || this.y < this.ty) this.explode();
    }
    explode() {
      this.exploded = true;
      const n = 90 + Math.floor(Math.random() * 50);
      for (let i = 0; i < n; i++) particles.push(new Particle(this.x, this.y, this.hue));
      const h2 = (this.hue + 50) % 360;
      for (let i = 0; i < 25; i++) particles.push(new Particle(this.x, this.y, h2));
    }
    draw() {
      if (this.exploded) return;
      this.trail.forEach((t, i) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,220,100,${i/this.trail.length*0.7})`;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#ffcc00'; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  const rockets = [];
  function launch() { rockets.push(new Rocket()); }

  // Salva inicial
  for (let i = 0; i < 6; i++) setTimeout(launch, i * 250);
  // Continuo
  setInterval(() => {
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) setTimeout(launch, i * 180);
  }, 1100);

  const stars = Array.from({length:100}, () => ({
    x:Math.random(), y:Math.random(),
    r:.2+Math.random()*1.1, ph:Math.random()*Math.PI*2, sp:.005+Math.random()*.01
  }));

  function loop(ts) {
    // Fondo semi-transparente — deja tenue el corazón de fotos visible detrás
    ctx.fillStyle = 'rgba(2,11,24,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      const a = .15+.5*Math.abs(Math.sin(ts*.001*s.sp+s.ph));
      ctx.beginPath();
      ctx.arc(s.x*canvas.width, s.y*canvas.height, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    });

    rockets.forEach(r => { r.update(); r.draw(); });
    for (let i = rockets.length-1; i >= 0; i--)
      if (rockets[i].exploded && rockets[i].trail.length === 0) rockets.splice(i,1);

    for (let i = particles.length-1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].alpha <= 0) { particles.splice(i,1); continue; }
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}