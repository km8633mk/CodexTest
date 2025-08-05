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
  angle: Math.PI,
  speed: 0,
  width: 40,
  height: 20,
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
  car.angle = Math.PI;
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

  const w = car.width;
  const h = car.height;

  // Schatten
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(-w/2 + 2, -h/2 + 2, w * 0.8, h);

  // Hauptkörper des Autos (Metallic Rot)
  ctx.fillStyle = '#DC143C';
  ctx.fillRect(-w/2, -h/2, w * 0.8, h);
  
  // Heck rechts (dunkler)
  ctx.fillStyle = '#B71C1C';
  ctx.fillRect(w/2 - w * 0.25, -h/2, w * 0.25, h);

  // Motorhaube links vorne (dunkler)
  ctx.fillStyle = '#B71C1C';
  ctx.fillRect(-w/2, -h/2, w * 0.15, h);

  // Windschutzscheibe
  ctx.fillStyle = '#87CEEB';
  ctx.strokeStyle = '#2F4F4F';
  ctx.lineWidth = 1;
  ctx.fillRect(-w/2 + w * 0.15, -h/2 + 2, w * 0.3, h - 4);
  ctx.strokeRect(-w/2 + w * 0.15, -h/2 + 2, w * 0.3, h - 4);

  // Türen (Linien)
  ctx.strokeStyle = '#8B0000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w/2 + w * 0.45, -h/2);
  ctx.lineTo(-w/2 + w * 0.45, h/2);
  ctx.stroke();

  // Scheinwerfer LINKS (in Fahrtrichtung)
  ctx.fillStyle = '#FFFFE0';
  ctx.strokeStyle = '#C0C0C0';
  ctx.lineWidth = 1;
  const headlightSize = 3;
  ctx.beginPath();
  ctx.arc(-w/2 + 2, -h/2 + 2, headlightSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-w/2 + 2, h/2 - 2, headlightSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rücklichter RECHTS
  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(w/2 - w * 0.07, -h/2 + 2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w/2 - w * 0.07, h/2 - 2, 2, 0, Math.PI * 2);
  ctx.fill();

  // Räder (horizontal ausgerichtet)
  const wheelW = w / 3.5;
  const wheelH = 6;
  const wheelOffset = 3;
  
  // Räder - äußerer schwarzer Ring
  ctx.fillStyle = '#1C1C1C';
  ctx.fillRect(-w/2 + 5, -h/2 - wheelOffset, wheelW, wheelH);
  ctx.fillRect(-w/2 + 5, h/2 + wheelOffset - wheelH, wheelW, wheelH);
  ctx.fillRect(w/2 - wheelW - 5, -h/2 - wheelOffset, wheelW, wheelH);
  ctx.fillRect(w/2 - wheelW - 5, h/2 + wheelOffset - wheelH, wheelW, wheelH);

  // Felgen - silberner Innenring
  ctx.fillStyle = '#C0C0C0';
  const rimW = wheelW - 2;
  const rimH = wheelH - 2;
  ctx.fillRect(-w/2 + 6, -h/2 - wheelOffset + 1, rimW, rimH);
  ctx.fillRect(-w/2 + 6, h/2 + wheelOffset - wheelH + 1, rimW, rimH);
  ctx.fillRect(w/2 - wheelW - 4, -h/2 - wheelOffset + 1, rimW, rimH);
  ctx.fillRect(w/2 - wheelW - 4, h/2 + wheelOffset - wheelH + 1, rimW, rimH);

  // Linke Stoßstange VORNE (breiter und markanter)
  ctx.fillStyle = '#2F4F4F';
  ctx.fillRect(-w/2 - 2, -h/2 - 1, 3, h + 2);
  
  // Rechte Stoßstange HINTEN
  ctx.fillStyle = '#696969';
  ctx.fillRect(w/2 - w * 0.25 - 1, -h/2 - 1, 2, h + 2);

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

