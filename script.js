const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const rockets = [];
const particles = [];
const GRAVITY = 0.06;

function glowColor() {
  const colors = [
    "#ffffff", "#00ffff", "#ff00ff", "#ffff00", "#ff3300", "#00ff66", "#3399ff"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function pickType() {
  const r = Math.random();
  if (r < 0.6) return "circle";
  if (r < 0.8) return "star";
  return "heart";
}

function launch() {
  rockets.push({
    x: canvas.width * 0.3 + Math.random() * canvas.width * 0.4,
    y: canvas.height + 20,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -9 - Math.random() * 2,
    targetY: canvas.height * (0.25 + Math.random() * 0.2),
    color: glowColor(),
    type: pickType()
  });
}

function explode(cx, cy, color, type) {
  const count = 90;
  for (let i = 0; i < count; i++) {
    let angle, speed;
    if (type === "star") {
      angle = (Math.PI * 2 / 10) * i;
      speed = i % 2 === 0 ? 4.5 : 2;
    } else if (type === "heart") {
      const t = Math.random() * Math.PI * 2;
      angle = t;
      speed = 2 + Math.sin(t) * 2;
    } else {
      angle = Math.random() * Math.PI * 2;
      speed = Math.random() * 4 + 2;
    }
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 50,
      color
    });
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.vy += GRAVITY * 0.3;
    r.x += r.vx;
    r.y += r.vy;

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = r.color;
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (r.y <= r.targetY || r.vy >= 0) {
      explode(r.x, r.y, r.color, r.type);
      rockets.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vy += GRAVITY;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (p.life <= 0) particles.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

// 1 секундэд 6 ракет гаргах: 1000ms / 6 ≈ 166ms
setInterval(launch, 166);

animate();

