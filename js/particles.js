/* ═══════════════════════════════════════
   particles.js — پارتیکل و انیمیشن
═══════════════════════════════════════ */

function initCanvas() {
  const cv = document.getElementById('cvs');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W = innerWidth, H = innerHeight;

  function rs() {
    W = innerWidth; H = innerHeight;
    cv.width = W; cv.height = H;
  }
  rs();
  addEventListener('resize', rs);

  const N = 100;
  const pts = [];
  const hues = [270, 220, 180, 300, 200, 160, 340];
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.8 + .3,
      hue: hues[Math.floor(Math.random() * hues.length)],
      a: Math.random() * .26 + .06,
      ph: Math.random() * Math.PI * 2,
      sp: .01 + Math.random() * .02,
    });
  }

  let mx = -9999, my = -9999;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  addEventListener('touchmove', e => {
    mx = e.touches[0].clientX; my = e.touches[0].clientY;
  }, {passive: true});

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 155) {
          const alpha = .075 * (1 - d / 155);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          const h = (pts[i].hue + pts[j].hue) / 2;
          ctx.strokeStyle = `hsla(${h},72%,64%,${alpha})`;
          ctx.lineWidth = .38;
          ctx.stroke();
        }
      }
    }

    pts.forEach(p => {
      // mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) {
        p.vx += dx / d * .3;
        p.vy += dy / d * .3;
      }
      // speed cap
      const sp = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      if (sp > .75) { p.vx *= .94; p.vy *= .94; }
      // pulsate
      p.ph += p.sp;
      const r = p.r * (1 + .32 * Math.sin(p.ph));
      const a = p.a * (.65 + .35 * Math.sin(p.ph + 1));
      // draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},76%,68%,${a})`;
      ctx.fill();
      // move
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ── Particle FX ──
function spawnSp(el, emoji) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 4; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.textContent = emoji;
    s.style.cssText = `left:${r.left + r.width/2 - 10 + Math.random()*20 - 10}px;top:${r.top + scrollY + Math.random()*8}px;font-size:${13 + Math.random()*13}px;animation-delay:${i * .08}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
}

function spawnConf(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const cols = [
    'var(--gold)','var(--pur)','var(--grn)','var(--blue)',
    'var(--ora)','var(--pink)','var(--cyan)','var(--teal)',
    'var(--lime)','var(--rose)','var(--violet)','var(--amber)',
  ];

  // streak text
  const st = document.createElement('div');
  st.className = 'strk';
  st.textContent = 'روز کامل! 🔥';
  st.style.cssText = `left:${r.left + r.width/2 - 55}px;top:${r.top + scrollY - 14}px`;
  document.body.appendChild(st);
  setTimeout(() => st.remove(), 1100);

  // confetti burst
  for (let i = 0; i < 42; i++) {
    const p = document.createElement('div');
    p.className = 'conf';
    p.style.cssText = `left:${r.left + Math.random() * r.width}px;top:${r.top + scrollY}px;width:${4+Math.random()*9}px;height:${4+Math.random()*9}px;background:${cols[i%cols.length]};--cx:${Math.random()*200-100}px;--cy:${-(80+Math.random()*90)}px;animation-delay:${Math.random()*.38}s;border-radius:${Math.random()>.5?'50%':'4px'}`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2100);
  }
}
