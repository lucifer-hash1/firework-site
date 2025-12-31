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

/* --- ГЭРЭЛТЭЙ, НЭГ СТИЛИЙН ӨНГӨ --- */
function glowColor() {
  const colors = ["#ffd27d", "#ffffff", "#ffb3c6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* --- ДОРООС ХӨӨРӨХ --- */
function launch() {
  rockets.push({
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    vy: -8 - Math.random() * 2,
    targetY: canvas.height * (0.2 + Math.random() * 0.25),
    color: glowColor()
  });
}

/* --- ХУРДАН, ГЭРЭЛТЭЙ ДЭЛБЭРЭЛТ --- */
function explode(x, y, color) {
  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 4 + 2;
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 40,
      color
    });
  }
}

/* --- ANIMATION --- */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // rockets
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
      explode(r.x, r.y, r.color);
      rockets.splice(i, 1);
    }
  });

  // particles
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

/* --- ДЭЛГЭЦ ХООСОН САНАГДАХГҮЙ БОЛГОХ --- */
setInterval(launch, 700);

animate();
