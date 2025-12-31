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

/* ===== ROCKET ===== */
function launch() {
  rockets.push({
    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
    y: canvas.height + 20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -10 - Math.random() * 2,
    targetY: canvas.height * (0.25 + Math.random() * 0.2),
    color: glowColor()
  });
}

/* ===== ТОМ ДЭЛБЭРЭЛТ ===== */
function explodeBig(x, y, color) {
  for (let i = 0; i < 80; i++) {
    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 90,
      alpha: 1,
      color,
      frozen: true,       // ⭐ хөдөлгөөнгүй
      timer: 60           // ⭐ 1 секунд
    });
  }
}

/* ===== ЖИЖИГ ДЭЛБЭРЭЛТ ===== */
function explodeSmall(x, y, color) {
  for (let i = 0; i < 25; i++) {
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

  // rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];

    r.vy += GRAVITY * 0.25;
    r.x += r.vx;
    r.y += r.vy;

    ctx.save();
    ctx.shadowBlur = 25;
    ctx.shadowColor = r.color;
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (r.y <= r.targetY || r.vy >= 0) {
      explodeBig(r.x, r.y, r.color);
      rockets.splice(i, 1);
    }
  }

  // particles
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
