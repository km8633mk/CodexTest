# 🏁 Autorennen - Modular

Ein einfaches Rennspiel mit modularer JavaScript-Architektur.

## 📁 Projektstruktur

```
CodexTest/
├── index.html          # Haupt-HTML-Datei
├── style.css           # Styling
├── script.js           # Original (veraltet)
├── script_backup.js    # Backup der originalen script.js
├── js/                 # Modular aufgeteilte JavaScript-Komponenten
│   ├── car.js          # Auto-Klasse (Logik & Rendering)
│   ├── track.js        # Strecken-Klasse (Kollision & Rendering)
│   ├── controls.js     # Eingabe-Handler
│   ├── timer.js        # Timer-Klasse (Rundenzeiten & Bestzeiten)
│   ├── game.js         # Hauptspiel-Logik
│   └── main.js         # Initialisierung
└── README.md           # Diese Datei
```

## 🎮 Steuerung

- **Beschleunigen:** ↑ oder W
- **Bremsen/Rückwärts:** ↓ oder S  
- **Links lenken:** ← oder A
- **Rechts lenken:** → oder D

### 🔧 Tastaturkürzel
- **Pause/Fortsetzen:** P oder ESC
- **Reset:** Ctrl+R oder Cmd+R

## 🏗️ Architektur

### Car-Klasse (`js/car.js`)
- Auto-Eigenschaften (Position, Geschwindigkeit, Winkel)
- Bewegungslogik und Physik
- Detailliertes Auto-Rendering

### Track-Klasse (`js/track.js`)
- Strecken-Definitionen (rechteckig, oval)
- Kollisionserkennung
- Rundenerkennung
- Strecken-Rendering

### Controls-Klasse (`js/controls.js`)
- Tastatureingabe-Verwaltung
- Unterstützt Pfeiltasten und WASD

### Timer-Klasse (`js/timer.js`)
- Rundenzeit-Messung
- Bestzeiten-Verwaltung
- localStorage-Integration
- Zeit-Formatierung

### Game-Klasse (`js/game.js`)
- Hauptspiel-Loop
- UI-Management
- Spielstatus-Verwaltung
- HUD-Rendering mit Zeiten

### Main (`js/main.js`)
- Canvas-Initialisierung
- Spiel-Setup
- Tastaturkürzel-Verwaltung
- Entry Point

## 🚀 Features

- **Zwei Streckentypen:** Rechteckig und Oval
- **Realistische Physik:** Geschwindigkeitsdämpfung, Lenkung
- **Kollisionserkennung:** Auto prallt an Streckengrenzen ab
- **Rundenzählung:** Automatische Lap-Erkennung
- **⏱️ Zeitmessung:** Rundenzeiten, Bestzeiten, Durchschnittszeiten
- **💾 Bestzeiten-Speicherung:** Automatisches Speichern per localStorage
- **🏆 Bestzeit-Tracking:** Separate Bestzeiten für jede Strecke
- **⏸️ Pause-Funktion:** Spiel pausieren/fortsetzen (P-Taste)
- **Responsives Design:** Auto zeigt in Fahrtrichtung
- **Detailliertes Auto-Design:** Scheinwerfer, Rücklichter, Räder

## 🔧 Technische Details

- **ES6 Klassen:** Moderne JavaScript-Syntax
- **Canvas 2D:** Für Rendering
- **Modulare Architektur:** Bessere Code-Organisation
- **Event-basierte Steuerung:** Für responsive Eingabe

## 🎯 Entwicklung

Die ursprüngliche `script.js` wurde in mehrere spezialisierte Module aufgeteilt:
1. Bessere Wartbarkeit
2. Klare Trennung der Verantwortlichkeiten  
3. Einfachere Erweiterung
4. Bessere Testbarkeit

Die originale Datei ist als `script_backup.js` gesichert.