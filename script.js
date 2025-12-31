const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

const rockets = [];
const particles = [];

/* ---- ӨНГӨ ---- */
function glowColor() {
  const colors = ["#ffffff", "#ffd27d", "#ffb3c6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ---- ХӨӨРӨХ ---- */
function launch() {
  rockets.push({
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    vy: -8 - Math.random() * 2,
    targetY: canvas.height * (0.2 + Math.random() * 0.25),
    color: glowColor(),
    type: pickType()
  });
}

/* ---- 3 : 1 : 1 ХАРЬЦАА ---- */
function pickType() {
  const r = Math.random();
  if (r < 0.6) return "circle";   // 3
  if (r < 0.8) return "star";     // 1
  return "heart";                 // 1
}

/* ---- ДЭЛБЭРЭЛТ ---- */
function explode(x, y, color, type) {
  const count = 80;
  for (let i = 0; i < count; i++) {
    let angle, speed;

    if (type === "star") {
      angle = (Math.PI * 2 / 10) * i;
      speed = i % 2 === 0 ? 4 : 2;
    } 
    else if (type === "heart") {
      const t = Math.random() * Math.PI * 2;
      angle = t;
      speed = 2 + Math.sin(t) * 2;
    } 
    else {
      angle = Math.random() * Math.PI * 2;
      speed = Math.random() * 4 + 2;
    }

    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 45,
      color
    });
  }
}

/* ---- ANIMATION ---- */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => {
    r.y += r.vy;

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = r.color;
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (r.y <= r.targetY) {
      explode(r.x, r.y, r.color, r.type);
      rockets.splice(i, 1);
    }
  });

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
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
  });

  requestAnimationFrame(animate);
}

setInterval(launch, 700);
animate();
