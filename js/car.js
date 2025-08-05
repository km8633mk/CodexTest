// Auto-Klasse und -Logik
class Car {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = Math.PI;
    this.speed = 0;
    this.width = 40;
    this.height = 20;
    this.lastX = 0;
    this.lastY = 0;
  }

  update(keys) {
    this.lastX = this.x;
    this.lastY = this.y;

    // Geschwindigkeitssteuerung (Pfeiltasten und WASD)
    if (keys.ArrowUp || keys.w || keys.W) this.speed += 0.2;
    if (keys.ArrowDown || keys.s || keys.S) this.speed -= 0.3;

    // Geschwindigkeitsdämpfung und Limits
    this.speed *= 0.98;
    this.speed = Math.max(Math.min(this.speed, 5), -2);

    // Lenkung (Pfeiltasten und WASD)
    if (keys.ArrowLeft || keys.a || keys.A) this.angle -= 0.05;
    if (keys.ArrowRight || keys.d || keys.D) this.angle += 0.05;

    // Bewegung
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  reset(x, y, angle = Math.PI) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 0;
  }

  revertPosition() {
    this.x = this.lastX;
    this.y = this.lastY;
    this.speed = 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const w = this.width;
    const h = this.height;

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
}