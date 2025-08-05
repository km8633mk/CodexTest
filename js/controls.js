// Eingabe-Handler-Klasse
class Controls {
  constructor() {
    this.keys = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  getKeys() {
    return this.keys;
  }

  // Hilfsmethoden für spezifische Tasten
  isUpPressed() {
    return this.keys.ArrowUp || this.keys.w || this.keys.W;
  }

  isDownPressed() {
    return this.keys.ArrowDown || this.keys.s || this.keys.S;
  }

  isLeftPressed() {
    return this.keys.ArrowLeft || this.keys.a || this.keys.A;
  }

  isRightPressed() {
    return this.keys.ArrowRight || this.keys.d || this.keys.D;
  }
}