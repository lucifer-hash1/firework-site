const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const rockets = [];
const gravity = 0.05;

function launch() {
  rockets.push({
    x: canvas.width / 2,
    y: canvas.height,
    vy: -8
  });
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((r, i) => {
    r.vy += gravity;
    r.y += r.vy;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (r.vy >= 0) rockets.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

setInterval(launch, 800);
animate();

