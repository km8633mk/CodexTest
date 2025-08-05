// Spiel-Klasse
class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.car = new Car();
    this.track = new Track(canvas.width, canvas.height);
    this.controls = new Controls();
    this.timer = new Timer(); // Timer hinzugefügt
    
    // Spielstatus
    this.laps = 0;
    this.currentTrack = 'rectangular';
    this.startLineY = 0;
    this.gameRunning = false;
    
    // UI-Elemente
    this.trackSelect = document.getElementById('trackSelect');
    this.startButton = document.getElementById('startButton');
    
    this.setupEventListeners();
    this.resetTrack();
    this.render();
  }

  setupEventListeners() {
    this.trackSelect.addEventListener('change', () => {
      this.currentTrack = this.trackSelect.value;
      this.resetTrack();
      this.render();
    });

    this.startButton.addEventListener('click', () => {
      this.startGame();
    });
  }

  startGame() {
    this.startButton.disabled = true;
    this.trackSelect.disabled = true;
    this.gameRunning = true;
    
    // Timer starten
    this.timer.loadBestTime(this.currentTrack);
    this.timer.start();
    
    this.gameLoop();
  }

  resetTrack() {
    const position = this.track.getStartPosition(this.currentTrack);
    this.startLineY = position.startLineY;
    this.car.reset(position.carX, position.carY);
    this.laps = 0;
    
    // Timer zurücksetzen
    this.timer.reset();
    this.timer.loadBestTime(this.currentTrack);
  }

  update() {
    // Timer-Update
    this.timer.update();
    
    // Auto-Update mit aktuellen Tasteninputs
    this.car.update(this.controls.getKeys());

    // Kollisionsprüfung
    this.track.checkCollision(this.car, this.currentTrack);

    // Rundenerkennung
    if (this.track.checkLapCompletion(this.car, this.currentTrack, this.startLineY)) {
      this.laps++;
      
      // Rundenzeit erfassen
      const result = this.timer.completeLap();
      if (result) {
        if (result.isNewBest) {
          console.log('🏆 Neue Bestzeit!', this.timer.formatTime(result.lapTime));
          // Hier könnte man später eine Benachrichtigung im Spiel anzeigen
        }
        console.log(`Runde ${this.laps} beendet:`, this.timer.formatTime(result.lapTime));
      }
    }
  }

  render() {
    // Strecke zeichnen
    this.track.draw(this.ctx, this.currentTrack, this.startLineY);
    
    // Auto zeichnen
    this.car.draw(this.ctx);
    
    // HUD zeichnen
    this.drawHUD();
  }

  drawHUD() {
    // Hauptinformationen
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText(`Runden: ${this.laps}`, 10, 25);
    
    // Zeiten anzeigen
    this.ctx.font = '16px sans-serif';
    this.ctx.fillStyle = '#fff';
    
    // Aktuelle Rundenzeit (nur wenn Spiel läuft)
    if (this.gameRunning) {
      this.ctx.fillText(`Aktuelle Zeit: ${this.timer.formatTime(this.timer.getCurrentLapTime())}`, 10, 55);
    }
    
    // Letzte Rundenzeit
    if (this.timer.getLastLapTime()) {
      this.ctx.fillText(`Letzte Runde: ${this.timer.formatTime(this.timer.getLastLapTime())}`, 10, 80);
    }
    
    // Bestzeit in Gold
    if (this.timer.getBestLapTime()) {
      this.ctx.fillStyle = '#FFD700'; // Gold
      this.ctx.fillText(`🏆 Bestzeit: ${this.timer.formatTime(this.timer.getBestLapTime())}`, 10, 105);
    }
    
    // Zusätzliche Informationen
    this.ctx.fillStyle = '#CCCCCC';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(`Geschwindigkeit: ${Math.abs(this.car.speed).toFixed(1)}`, 10, 135);
    this.ctx.fillText(`Strecke: ${this.currentTrack === 'rectangular' ? 'Rechteckig' : 'Oval'}`, 10, 155);
    
    // Durchschnittszeit (wenn verfügbar)
    const avgTime = this.timer.getAverageLapTime();
    if (avgTime) {
      this.ctx.fillText(`⌀ Durchschnitt: ${this.timer.formatTime(avgTime)}`, 10, 175);
    }
  }

  gameLoop() {
    if (!this.gameRunning) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }

  // Spiel zurücksetzen
  resetGame() {
    this.gameRunning = false;
    this.timer.stop();
    this.startButton.disabled = false;
    this.trackSelect.disabled = false;
    this.resetTrack();
    this.render();
  }

  // Spiel pausieren (zusätzliche Funktion)
  pauseGame() {
    if (this.gameRunning) {
      this.gameRunning = false;
      this.timer.stop();
    }
  }

  // Spiel fortsetzen (zusätzliche Funktion)
  resumeGame() {
    if (!this.gameRunning) {
      this.gameRunning = true;
      this.timer.start();
      this.gameLoop();
    }
  }
}