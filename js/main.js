// Hauptdatei - Initialisierung des Spiels
document.addEventListener('DOMContentLoaded', () => {
  // Canvas-Setup
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 600;

  // Spiel initialisieren
  const game = new Game(canvas, ctx);

  // Zusätzliche Tastaturkürzel
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'Escape':
      case 'p':
      case 'P':
        // Pause/Resume
        if (game.gameRunning) {
          game.pauseGame();
          console.log('⏸️ Spiel pausiert');
        } else {
          game.resumeGame();
          console.log('▶️ Spiel fortgesetzt');
        }
        break;
      case 'r':
      case 'R':
        // Reset
        if (e.ctrlKey || e.metaKey) {
          game.resetGame();
          console.log('🔄 Spiel zurückgesetzt');
        }
        break;
    }
  });

  // Debug-Funktionen (optional)
  window.game = game; // Für Debugging im Browser-Konsole

  console.log('🏁 Autorennen mit Timer initialisiert!');
  console.log('Steuerung: Pfeiltasten oder WASD');
  console.log('Tastaturkürzel: P = Pause, Ctrl+R = Reset');
  console.log('Wähle eine Strecke und drücke Start!');
});