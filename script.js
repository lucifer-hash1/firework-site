const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const fireworks = [];
const particles = [];

/* --- ЗӨӨЛӨН НЭГ ТӨРЛИЙН ӨНГӨ --- */
function calmColor() {
  const colors = ["#ffcc88", "#ffd1dc", "#cce6ff", "#e6ccff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* --- FIREWORK ДЭЭШ ХӨӨРӨХ --- */
function launchFirework() {
  fireworks.push({
    x: Math.random() * canvas.width,
    y: canvas.height,
    vy: -6 - Math.random() * 2,
    targetY: canvas.height * (0.2 + Math.random() * 0.3),
    color: calmColor()
  });
}

/* --- ДЭЛБЭРЭХ --- */
function explode(x, y, color) {
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 / 60) * i;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 80,
      color
    });
  }
}

/* --- ANIMATION --- */
function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((f, i) => {
    f.y += f.vy;
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
    ctx.fill();

    if (f.y <= f.targetY) {
      explode(f.x, f.y, f.color);
      fireworks.splice(i, 1);
    }
  });

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.life--;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

/* --- АВТОМАТ FIREWORK --- */
setInterval(launchFirework, 1200);

animate();
