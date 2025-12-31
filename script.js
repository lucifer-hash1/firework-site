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
const GRAVITY = 0.06;

/* ===== ТОД НЕОН ӨНГӨ ===== */
function glowColor() {
  const colors = [
    "#ff003c", "#00eaff", "#7CFF00",
    "#ffd500", "#ff6a00", "#b400ff"
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

/* ===== ROCKET ===== */
function launch() {
  rockets.push({
    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
    y: canvas.height + 30,
    vx: (Math.random() - 0.5) * 0.7,
    vy: -9 - Math.random() * 2,
    targetY: canvas.height * (0.25 + Math.random() * 0.25),
    color: glowColor(),
    type: pickType()
  });
}

/* ===== EXPLOSION ===== */
function explode(cx, cy, color, secondary = false) {
  const count = secondary ? 40 : 90;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = secondary
      ? Math.random() * 2 + 1.2
      : Math.random() * 4 + 2;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: secondary ? 35 : 60,
      alpha: 1,
      color
    });
  }
}

/* ===== ANIMATE ===== */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];

    r.vy += GRAVITY * 0.3;
    r.x += r.vx;
    r.y += r.vy;

    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = r.color;
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (r.y <= r.targetY || r.vy >= 0) {
      explode(r.x, r.y, r.color);

      // 1 секундийн дараа secondary дэлбэрэлт
      setTimeout(() => {
        explode(r.x, r.y, r.color, true);
      }, 1000);

      rockets.splice(i, 1);
    }
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.vy += GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    p.alpha -= 0.018;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 25;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 1;
    if (p.life <= 0) particles.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

/* ===== 1 СЕКУНДЭД 6 СОЛИУТ (ДАРААЛЛАН) ===== */
setInterval(() => {
  for (let i = 0; i < 6; i++) {
    setTimeout(launch, i * 150);
  }
}, 1000);

animate();
