// Timer-Klasse für Rundenzeiten
class Timer {
  constructor() {
    this.startTime = 0;
    this.lapStartTime = 0;
    this.currentLapTime = 0;
    this.bestLapTime = null;
    this.lastLapTime = null;
    this.totalTime = 0;
    this.lapTimes = [];
    this.isRunning = false;
    this.trackType = 'default';
  }

  start() {
    const now = Date.now();
    this.startTime = now;
    this.lapStartTime = now;
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.startTime = 0;
    this.lapStartTime = 0;
    this.currentLapTime = 0;
    this.lastLapTime = null;
    this.totalTime = 0;
    this.lapTimes = [];
    this.isRunning = false;
    // Bestzeit bleibt erhalten
  }

  update() {
    if (!this.isRunning) return;

    const now = Date.now();
    this.currentLapTime = now - this.lapStartTime;
    this.totalTime = now - this.startTime;
  }

  completeLap() {
    if (!this.isRunning) return null;

    const now = Date.now();
    const lapTime = now - this.lapStartTime;
    
    this.lastLapTime = lapTime;
    this.lapTimes.push(lapTime);
    
    // Bestzeit prüfen und aktualisieren
    let isNewBest = false;
    if (this.bestLapTime === null || lapTime < this.bestLapTime) {
      this.bestLapTime = lapTime;
      this.saveBestTime();
      isNewBest = true;
    }
    
    // Neue Runde starten
    this.lapStartTime = now;
    
    return {
      lapTime: lapTime,
      isNewBest: isNewBest
    };
  }

  getCurrentLapTime() {
    return this.currentLapTime;
  }

  getLastLapTime() {
    return this.lastLapTime;
  }

  getBestLapTime() {
    return this.bestLapTime;
  }

  getTotalTime() {
    return this.totalTime;
  }

  formatTime(milliseconds) {
    if (milliseconds === null || milliseconds === undefined) return '--:--.---';
    
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  formatTimeShort(milliseconds) {
    if (milliseconds === null || milliseconds === undefined) return '--.-';
    
    const seconds = (milliseconds / 1000).toFixed(1);
    return `${seconds}s`;
  }

  // Bestzeit im lokalen Speicher speichern
  saveBestTime() {
    try {
      const key = `carrace_besttime_${this.trackType}`;
      localStorage.setItem(key, this.bestLapTime.toString());
    } catch (error) {
      console.warn('Konnte Bestzeit nicht speichern:', error);
    }
  }

  // Bestzeit aus lokalen Speicher laden
  loadBestTime(trackType) {
    try {
      this.trackType = trackType;
      const key = `carrace_besttime_${trackType}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        this.bestLapTime = parseInt(saved);
      }
    } catch (error) {
      console.warn('Konnte Bestzeit nicht laden:', error);
    }
  }

  getAverageLapTime() {
    if (this.lapTimes.length === 0) return null;
    const sum = this.lapTimes.reduce((a, b) => a + b, 0);
    return sum / this.lapTimes.length;
  }

  // Alle Rundenzeiten für Statistiken
  getAllLapTimes() {
    return this.lapTimes;
  }
}