// This is a simplified, extendable snooker engine

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let isDragging = false;
let dragStart = null;
let mouseX = 0, mouseY = 0;

const table = {
  width: 800,
  height: 400,
  pocketRadius: 15,
  pockets: [
    { x: 0, y: 0 },
    { x: 400, y: 0 },
    { x: 800, y: 0 },
    { x: 0, y: 400 },
    { x: 400, y: 400 },
    { x: 800, y: 400 }
  ]
};

const friction = 0.98;

let balls = [
  { x: 400, y: 200, vx: 0, vy: 0, radius: 10, color: "white", id: "cue" },
  { x: 450, y: 200, vx: 0, vy: 0, radius: 10, color: "red", id: "red1" },
  { x: 470, y: 190, vx: 0, vy: 0, radius: 10, color: "yellow", id: "yellow" },
  { x: 470, y: 210, vx: 0, vy: 0, radius: 10, color: "green", id: "green" },
];

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawPockets() {
  table.pockets.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, table.pocketRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  });
}

function updatePhysics() {
  balls.forEach(ball => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x <= ball.radius || ball.x >= canvas.width - ball.radius) ball.vx *= -1;
    if (ball.y <= ball.radius || ball.y >= canvas.height - ball.radius) ball.vy *= -1;

    ball.vx *= friction;
    ball.vy *= friction;

    if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
    if (Math.abs(ball.vy) < 0.01) ball.vy = 0;
  });

  checkPockets();
}

function checkPockets() {
  balls = balls.filter(ball => {
    for (let pocket of table.pockets) {
      let dx = ball.x - pocket.x;
      let dy = ball.y - pocket.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < table.pocketRadius) {
        if (ball.id !== "cue") {
          console.log(`Ball pocketed: ${ball.id}`);
          return false;
        } else {
          console.log("Cue ball pocketed! Resetting...");
          ball.x = 400;
          ball.y = 200;
          ball.vx = ball.vy = 0;
          return true;
        }
      }
    }
    return true;
  });
}

function drawAimLine(start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = "lime";
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPockets();
  balls.forEach(drawBall);
  if (isDragging && dragStart) drawAimLine(dragStart, { x: mouseX, y: mouseY });
}

function gameLoop() {
  updatePhysics();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

canvas.addEventListener("mousedown", (e) => {
  if (balls[0].vx === 0 && balls[0].vy === 0) {
    isDragging = true;
    dragStart = { x: balls[0].x, y: balls[0].y };
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", (e) => {
  if (isDragging) {
    const dx = dragStart.x - mouseX;
    const dy = dragStart.y - mouseY;
    balls[0].vx = dx * 0.1;
    balls[0].vy = dy * 0.1;
    isDragging = false;
    dragStart = null;
  }
});
