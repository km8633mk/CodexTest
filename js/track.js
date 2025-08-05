// Strecken-Klasse und -Logik
class Track {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    this.tracks = {
      rectangular: {
        outer: 30,
        inner: 90
      },
      oval: {
        centerX: canvasWidth / 2,
        centerY: canvasHeight / 2,
        outerA: canvasWidth / 2 - 40,
        outerB: canvasHeight / 2 - 40,
        trackWidth: 60
      }
    };

    // Berechne ovale Innenmaße
    this.tracks.oval.innerA = this.tracks.oval.outerA - this.tracks.oval.trackWidth;
    this.tracks.oval.innerB = this.tracks.oval.outerB - this.tracks.oval.trackWidth;
  }

  getStartPosition(trackType) {
    let startLineY;
    let carX, carY;

    if (trackType === 'rectangular') {
      startLineY = this.canvasHeight - this.tracks.rectangular.inner;
      carX = this.canvasWidth / 2;
      carY = this.canvasHeight - this.tracks.rectangular.outer - 20;
    } else if (trackType === 'oval') {
      const t = this.tracks.oval;
      startLineY = t.centerY + t.innerB;
      carX = t.centerX;
      carY = t.centerY + t.outerB - 20;
    }

    return { startLineY, carX, carY };
  }

  checkCollision(car, trackType) {
    if (trackType === 'rectangular') {
      return this.checkRectangularCollision(car);
    } else if (trackType === 'oval') {
      return this.checkOvalCollision(car);
    }
    return false;
  }

  checkRectangularCollision(car) {
    const out = this.tracks.rectangular.outer;
    const inn = this.tracks.rectangular.inner;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    // Äußere Grenzen
    if (car.x < out || car.x > w - out || car.y < out || car.y > h - out) {
      car.revertPosition();
      return true;
    }

    // Innere Grenzen (Innenbereich der Strecke)
    if (car.x > inn && car.x < w - inn && car.y > inn && car.y < h - inn) {
      car.revertPosition();
      return true;
    }

    return false;
  }

  checkOvalCollision(car) {
    const t = this.tracks.oval;
    const dx = car.x - t.centerX;
    const dy = car.y - t.centerY;

    // Außerhalb der äußeren Ellipse
    if ((dx * dx) / (t.outerA * t.outerA) + (dy * dy) / (t.outerB * t.outerB) > 1) {
      car.revertPosition();
      return true;
    }

    // Innerhalb der inneren Ellipse
    if ((dx * dx) / (t.innerA * t.innerA) + (dy * dy) / (t.innerB * t.innerB) < 1) {
      car.revertPosition();
      return true;
    }

    return false;
  }

  checkLapCompletion(car, trackType, startLineY) {
    if (trackType === 'rectangular') {
      const inn = this.tracks.rectangular.inner;
      const w = this.canvasWidth;
      
      return (
        car.lastY > startLineY &&
        car.y <= startLineY &&
        car.x > inn &&
        car.x < w - inn
      );
    } else if (trackType === 'oval') {
      const t = this.tracks.oval;
      
      return (
        car.lastY > startLineY &&
        car.y <= startLineY &&
        Math.abs(car.x - t.centerX) < t.innerA
      );
    }
    
    return false;
  }

  draw(ctx, trackType, startLineY) {
    // Hintergrund
    ctx.fillStyle = '#0a5';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (trackType === 'rectangular') {
      this.drawRectangularTrack(ctx, startLineY);
    } else if (trackType === 'oval') {
      this.drawOvalTrack(ctx, startLineY);
    }
  }

  drawRectangularTrack(ctx, startLineY) {
    const out = this.tracks.rectangular.outer;
    const inn = this.tracks.rectangular.inner;

    // Streckenbelag
    ctx.fillStyle = '#555';
    ctx.fillRect(out, out, this.canvasWidth - out * 2, this.canvasHeight - out * 2);

    // Innenbereich (Gras)
    ctx.fillStyle = '#0a5';
    ctx.fillRect(inn, inn, this.canvasWidth - inn * 2, this.canvasHeight - inn * 2);

    // Startlinie
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(inn, startLineY);
    ctx.lineTo(this.canvasWidth - inn, startLineY);
    ctx.stroke();
  }

  drawOvalTrack(ctx, startLineY) {
    const t = this.tracks.oval;

    // Streckenbelag
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.ellipse(t.centerX, t.centerY, t.outerA, t.outerB, 0, 0, Math.PI * 2);
    ctx.fill();

    // Innenbereich (Gras)
    ctx.fillStyle = '#0a5';
    ctx.beginPath();
    ctx.ellipse(t.centerX, t.centerY, t.innerA, t.innerB, 0, 0, Math.PI * 2);
    ctx.fill();

    // Startlinie
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(t.centerX - t.innerA, startLineY);
    ctx.lineTo(t.centerX + t.innerA, startLineY);
    ctx.stroke();
  }
}