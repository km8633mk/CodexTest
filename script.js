const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const track = {
  outer: 30,
  inner: 90
};

const car = {
  x: canvas.width / 2,
  y: canvas.height - track.outer - 20,
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
const startLineY = canvas.height - track.inner;

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

  const out = track.outer;
  const inn = track.inner;
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
}

function drawTrack() {
  ctx.fillStyle = '#0a5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#555';
  ctx.fillRect(
    track.outer,
    track.outer,
    canvas.width - track.outer * 2,
    canvas.height - track.outer * 2
  );

  ctx.fillStyle = '#0a5';
  ctx.fillRect(
    track.inner,
    track.inner,
    canvas.width - track.inner * 2,
    canvas.height - track.inner * 2
  );

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(track.inner, startLineY);
  ctx.lineTo(canvas.width - track.inner, startLineY);
  ctx.stroke();
}

function drawCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  ctx.fillStyle = 'red';
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
  ctx.restore();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Runden: ${laps}`, 10, 25);
}

function loop() {
  update();
  drawTrack();
  drawCar();
  drawHUD();
  requestAnimationFrame(loop);
}

loop();

