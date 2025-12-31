const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const rockets = [];
const particles = [];
const GRAVITY = 0.045;

/* ===== ТОД ӨНГӨ ===== */
function glowColor() {
  const colors = [
    "#ff004c", "#00eaff", "#7cff00",
    "#ffd500", "#ff7b00", "#b300ff"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ===== 3 : 1 : 1 ХЭЛБЭР ===== */
function pickType() {
  const r = Math.random();
  if (r < 0.6) return "circle";
  if (r < 0.8) return "star";
  return "heart";
}

/* ===== ХЭЛБЭР ЗУРАХ ===== */
function drawShape(x, y, color, type, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowBlur = 25;
  ctx.shadowColor = color;
  ctx.fillStyle = color;

  ctx.beginPath();

  if (type === "circle") {
    ctx.arc(0, 0, size, 0, Math.PI * 2);
  }

  if (type === "star") {
    const spikes = 5;
    const outer = size;
    const inner = size * 0.5;
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    ctx.moveTo(0, -outer);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
      rot += step;
      ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner);
      rot += step;
    }
    ctx.closePath();
  }

  if (type === "heart") {
    const s = size * 0.9;
    ctx.moveTo(0, s / 2);
    ctx.bezierCurveTo(-s, -s / 2, -s, s, 0, s * 1.4);
    ctx.bezierCurveTo(s, s, s, -s / 2, 0, s / 2);
  }

  ctx.fill();
  ctx.restore();
}

/* ===== ROCKET (ХЭЛБЭРТЭЙ ХӨӨРНӨ) ===== */
function launch() {
  rockets.push({
    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
    y: canvas.height + 30,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -10 - Math.random() * 2,
    targetY: canvas.height * (0.25 + Math.random() * 0.2),
    color: glowColor(),
    type: pickType()
  });
}

/* ===== ТОМ ДЭЛБЭРЭЛТ ===== */
function explodeBig(x, y, color) {
  for (let i = 0; i < 60; i++) {
    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 90,
      alpha: 1,
      color,
      frozen: true,
      timer: 60 // 1 секунд
    });
  }
}

/* ===== ЖИЖИГ ДЭЛБЭРЭЛТ ===== */
function explodeSmall(x, y, color) {
  for (let i = 0; i < 20; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 2 + 1;
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 40,
      alpha: 1,
      color,
      frozen: false
    });
  }
}

/* ===== ANIMATE ===== */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* --- ROCKETS (ХЭЛБЭРТЭЙ) --- */
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];

    r.vy += GRAVITY * 0.25;
    r.x += r.vx;
    r.y += r.vy;

    // ⭐ ХӨӨРЧ БАЙХДАА СОЛИУТЫН ХЭЛБЭРТЭЙ
    drawShape(r.x, r.y, r.color, r.type, 6);

    if (r.y <= r.targetY || r.vy >= 0) {
      explodeBig(r.x, r.y, r.color);
      rockets.splice(i, 1);
    }
  }

  /* --- PARTICLES --- */
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (p.frozen) {
      p.timer--;
      if (p.timer <= 0) {
        explodeSmall(p.x, p.y, p.color);
        particles.splice(i, 1);
        continue;
      }
    } else {
      p.vy += GRAVITY;
      p.vx *= 0.99;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
    }

    p.life--;
    p.alpha -= 0.015;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 20;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 1;

    if (p.life <= 0 || p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

/* ===== 1 СЕКУНДЭД 6 ТОМ СОЛИУТ ===== */
setInterval(() => {
  for (let i = 0; i < 6; i++) {
    setTimeout(launch, i * 160);
  }
}, 1000);

animate();

animate();
