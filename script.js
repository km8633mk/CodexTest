const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const trackSelect = document.getElementById('trackSelect');
const startButton = document.getElementById('startButton');

canvas.width = 800;
canvas.height = 600;

const tracks = {
  rectangular: {
    outer: 30,
    inner: 90
  },
  oval: {
    centerX: canvas.width / 2,
    centerY: canvas.height / 2,
    outerA: canvas.width / 2 - 40,
    outerB: canvas.height / 2 - 40,
    trackWidth: 60
  }
};

tracks.oval.innerA = tracks.oval.outerA - tracks.oval.trackWidth;
tracks.oval.innerB = tracks.oval.outerB - tracks.oval.trackWidth;

const car = {
  x: 0,
  y: 0,
  angle: -Math.PI / 2,
  speed: 0,
  width: 20,
  height: 40,
  lastX: 0,
  lastY: 0
};

const keys = {};
document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

let laps = 0;
let currentTrack = trackSelect.value;
let startLineY;
let gameRunning = false;

trackSelect.addEventListener('change', () => {
  currentTrack = trackSelect.value;
  resetTrack();
  render();
});

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  trackSelect.disabled = true;
  gameRunning = true;
  requestAnimationFrame(loop);
});

function resetTrack() {
  if (currentTrack === 'rectangular') {
    startLineY = canvas.height - tracks.rectangular.inner;
    car.x = canvas.width / 2;
    car.y = canvas.height - tracks.rectangular.outer - 20;
  } else if (currentTrack === 'oval') {
    const t = tracks.oval;
    startLineY = t.centerY + t.innerB;
    car.x = t.centerX;
    car.y = t.centerY + t.outerB - 20;
  }
  car.angle = -Math.PI / 2;
  car.speed = 0;
  laps = 0;
}
resetTrack();
render();

function update() {
  car.lastX = car.x;
  car.lastY = car.y;

  if (keys.ArrowUp) car.speed += 0.2;
  if (keys.ArrowDown) car.speed -= 0.3;

  car.speed *= 0.98;
  car.speed = Math.max(Math.min(car.speed, 5), -2);

  if (keys.ArrowLeft) car.angle -= 0.05;
  if (keys.ArrowRight) car.angle += 0.05;

  car.x += Math.cos(car.angle) * car.speed;
  car.y += Math.sin(car.angle) * car.speed;

  if (currentTrack === 'rectangular') {
    const out = tracks.rectangular.outer;
    const inn = tracks.rectangular.inner;
    const w = canvas.width;
    const h = canvas.height;

    if (car.x < out) {
      car.x = out;
      car.speed = 0;
    }
    if (car.x > w - out) {
      car.x = w - out;
      car.speed = 0;
    }
    if (car.y < out) {
      car.y = out;
      car.speed = 0;
    }
    if (car.y > h - out) {
      car.y = h - out;
      car.speed = 0;
    }

    if (car.x > inn && car.x < w - inn && car.y > inn && car.y < h - inn) {
      car.x = car.lastX;
      car.y = car.lastY;
      car.speed = 0;
    }

    if (
      car.lastY > startLineY &&
      car.y <= startLineY &&
      car.x > inn &&
      car.x < w - inn
    ) {
      laps++;
    }
  } else if (currentTrack === 'oval') {
    const t = tracks.oval;
    const dx = car.x - t.centerX;
    const dy = car.y - t.centerY;
    if ((dx * dx) / (t.outerA * t.outerA) + (dy * dy) / (t.outerB * t.outerB) > 1) {
      car.x = car.lastX;
      car.y = car.lastY;
      car.speed = 0;
    }
    if ((dx * dx) / (t.innerA * t.innerA) + (dy * dy) / (t.innerB * t.innerB) < 1) {
      car.x = car.lastX;
      car.y = car.lastY;
      car.speed = 0;
    }

    if (
      car.lastY > startLineY &&
      car.y <= startLineY &&
      Math.abs(car.x - t.centerX) < t.innerA
    ) {
      laps++;
    }
  }
}

function drawTrack() {
  ctx.fillStyle = '#0a5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (currentTrack === 'rectangular') {
    const out = tracks.rectangular.outer;
    const inn = tracks.rectangular.inner;

    ctx.fillStyle = '#555';
    ctx.fillRect(out, out, canvas.width - out * 2, canvas.height - out * 2);

    ctx.fillStyle = '#0a5';
    ctx.fillRect(inn, inn, canvas.width - inn * 2, canvas.height - inn * 2);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inn, startLineY);
    ctx.lineTo(canvas.width - inn, startLineY);
    ctx.stroke();
  } else if (currentTrack === 'oval') {
    const t = tracks.oval;

    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.ellipse(t.centerX, t.centerY, t.outerA, t.outerB, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0a5';
    ctx.beginPath();
    ctx.ellipse(t.centerX, t.centerY, t.innerA, t.innerB, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t.centerX - t.innerA, startLineY);
    ctx.lineTo(t.centerX + t.innerA, startLineY);
    ctx.stroke();
  }
}

function drawCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  ctx.fillStyle = 'blue';
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

  ctx.fillStyle = 'lightblue';
  ctx.fillRect(-car.width / 2 + 2, -car.height / 2 + 5, car.width - 4, car.height / 2);

  ctx.fillStyle = 'black';
  const wheelW = 4;
  const wheelH = car.height / 4;
  ctx.fillRect(-car.width / 2 - wheelW, -car.height / 2, wheelW, wheelH);
  ctx.fillRect(car.width / 2, -car.height / 2, wheelW, wheelH);
  ctx.fillRect(-car.width / 2 - wheelW, car.height / 2 - wheelH, wheelW, wheelH);
  ctx.fillRect(car.width / 2, car.height / 2 - wheelH, wheelW, wheelH);

  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Runden: ${laps}`, 10, 25);
}

function render() {
  drawTrack();
  drawCar();
  drawHUD();
}

function loop() {
  if (!gameRunning) return;
  update();
  render();
  requestAnimationFrame(loop);
}

