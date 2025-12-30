const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function firework(x, y) {
  for (let i = 0; i < 80; i++) {
    particles.push({
      x,
      y,
      vx: Math.cos(i) * Math.random() * 6,
      vy: Math.sin(i) * Math.random() * 6,
      life: 100,
      color: randomColor()
    });
  }
}

const particles = [];

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life--;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  firework(e.clientX, e.clientY);
});

animate();
