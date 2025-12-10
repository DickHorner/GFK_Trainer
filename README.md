# GFK-Trainer

Eine **Electron-Anwendung zum Trainieren von Gewaltfreier Kommunikation (GFK)**, basierend auf "Konflikte lösen durch Gewaltfreie Kommunikation: Ein Gespräch mit Gabriele Seils" (Rosenberg/Seils).

## 🎯 Merkmale

### ✅ Implementiert (Phasen 1–4)

- **Offline-First** – Läuft vollständig lokal, keine Cloud-Abhängigkeit
- **12 Kapitel mit 60+ Übungen** – Strukturierter Lernpfad für GFK
- **6 Übungstypen** – Vielfältige Eingabeformate:
  - Textfelder (Textarea)
  - Matrizen (Tabellen mit Zeilen/Spalten)
  - Übersetzungsübungen (Wolf → Giraffe)
  - Checklisten (mit Häkchen)
  - Bewertungen (0–10 Skala)
  - Timer-Übungen (konfigurierbare Dauer)

- **Fortschritt speichern** – Automatische localStorage-Persistierung
- **Import/Export** – Fortschritt als JSON-Datei herunterladen/hochladen
- **LLM-Integration vorbereitet** – Kompatibilität mit OpenAI-kompatiblen APIs (LM Studio, Ollama)

### 🚀 Geplant (Phase 5+)

- LLM-Feedback pro Feld ("Deep-Check" Button)
- Feedback-Modale mit Bewertungen und Verbesserungsvorschlägen
- Robuste Fehlerbehandlung für LLM-Ausfälle
- Automatische Speicheranzeige
- Einstellungen für LLM-Konfiguration

---

## 📦 Installation & Start

### Voraussetzungen

- **Node.js** 16+ (mit npm)
- **Windows, macOS oder Linux**

### Installation

```bash
git clone https://github.com/DickHorner/GFK_Trainer.git
cd GFK_Trainer
npm install
```

### Entwicklung

```bash
npm run dev
```

Dies startet die TypeScript-Kompilierung (`tsc`) und dann die Electron-App.

### Kompilierung

```bash
npm run build        # TypeScript kompilieren
npm run watch        # TypeScript im Watch-Modus
npm start            # Bereits kompilierte App starten
```

---

## 📁 Projektstruktur

```
src/
├── main/              # Electron Main-Prozess
│   └── main.ts
├── preload/           # Preload-Script (sichere IPC-Brücke)
│   └── preload.ts
├── renderer/          # UI-Logik (TypeScript + DOM)
│   ├── main.ts        # Einstiegspunkt
│   └── ui.ts          # Render-Funktionen (~500 Zeilen)
├── state/             # Persistierung (localStorage)
│   ├── state.ts       # UserProgress-System
│   └── index.ts
├── llm/               # LLM-Integration
│   ├── client.ts      # HTTP-Client für OpenAI-kompatible APIs
│   ├── schema.ts      # Response-Typen & JSON-Reparatur
│   └── index.ts
└── gfkContent.ts      # Zentrale Inhalte (12 Kapitel, 60+ Übungen)

dist/                  # Kompiliertes JavaScript + Source Maps
index.html             # Renderer-HTML
package.json           # Dependencies & Scripts
tsconfig.json          # TypeScript-Konfiguration
```

---

## 🏗️ Architektur

### Layers

| Layer | Technologie | Verantwortung |
|-------|-------------|---------------|
| **Renderer** | TypeScript + DOM | UI-Rendering, Benutzerinteraktion |
| **State** | localStorage | Persistierung von Nutzerantworten |
| **LLM** | OpenAI-kompatible API | Feedback zu Übungsantworten |
| **Main Process** | Electron | Fenster-Management, System-Integration |

### Datenspeicherung

- **Nutzerantworten** – localStorage (Browser-API, lokal)
- **LLM-Cache** – Feedback pro Feld zwischengespeichert in localStorage
- **Kapitel/Übungen** – In `src/gfkContent.ts` hart codiert (Single Source of Truth)

### IPC-Brücke

Preload-Script stellt sichere Kommunikation zwischen Renderer und Main bereit. Aktuell minimal, kann für LLM-Aufrufe oder Dateizugriffe erweitert werden.

---

## 🧠 GFK-Konzepte

Die Übungen basieren auf den **vier GFK-Schritten**:

1. **Beobachtung** – Fakten ohne Wertung
2. **Gefühl** – Emotionale Reaktion
3. **Bedürfnis** – Zugrunde liegende menschliche Bedürfnisse
4. **Bitte** – Konkrete, verhandelbare Handlung

**Wolf-Sprache** ↔ **Giraffen-Sprache**
- Wolf: Vorwürfe, Verallgemeinerungen, Bewertungen
- Giraffe: Beobachtung, Gefühl, Bedürfnis, empathische Bitten

---

## ⚙️ LLM-Konfiguration (Optional)

Für LLM-Feedback benötigst du einen lokalen LLM-Server wie **LM Studio** oder **Ollama**:

1. **LM Studio** (für Anfänger empfohlen):
   - Download: https://lmstudio.ai
   - Modell laden und Server starten (standardmäßig `localhost:1234`)

2. **Ollama** (weitere Option):
   - Download: https://ollama.ai
   - `ollama run [modellname]`

3. **In der App**:
   - (Phase 5+) Einstellungen öffnen und Endpoint konfigurieren:
     - Standard: `http://localhost:1234/v1/chat/completions`
   - Die App testet die Verbindung und aktiviert LLM-Feedback, falls verfügbar

---

## 🛠️ Entwicklung

### TypeScript

Das Projekt nutzt **strict mode**:

```bash
npm run build    # Fehler bei Typ-Problemen
```

### Debugging

1. Öffne die **DevTools** durch Abkommentieren in `src/main/main.ts`:
   ```typescript
   // mainWindow.webContents.openDevTools();
   ```

2. Oder drücke **Ctrl+Shift+I** (Entwickler-Shortcut – muss implementiert werden)

### Testing (Optional)

Aktuell keine Tests vorhanden. Geplant für Phase 5:

```bash
npm test        # (noch nicht implementiert)
```

---

## 📋 Lizenz

MIT – Siehe [LICENSE](LICENSE) für Details.

---

## 🤝 Beitragen

Contributions sind willkommen! Bitte beachte die Richtlinien in [.copilot-instructions.md](.copilot-instructions.md) für Entwicklungs-Standards.

### Für Agent-Entwicklung:

Lies [agents.md](agents.md) für Rollen und Anforderungen.

Lies [PROGRESS.md](PROGRESS.md) für den aktuellen Entwicklungsstand.

---

## 📞 Support

Für Fragen oder Probleme, öffne ein **Issue** auf GitHub:
https://github.com/DickHorner/GFK_Trainer/issues

---

## 🎓 Über GFK

**Gewaltfreie Kommunikation (GFK)** wurde entwickelt von **Marshall B. Rosenberg**.

Weitere Ressourcen:
- 📖 [Nonviolent Communication – The Language of Compassion](https://www.cnvc.org/)
- 🎬 Rosenberg/Seils: "Konflikte lösen durch Gewaltfreie Kommunikation"

---

## 🗓️ Entwicklungsplan

| Phase | Status | Fokus |
|-------|--------|-------|
| 1 | ✅ Done | Electron-Scaffold |
| 2 | ✅ Done | UI-Renderer |
| 3 | ✅ Done | State-Persistierung |
| 4 | ✅ Done | LLM-Integration |
| 5 | 🚧 In Arbeit | UI-Polishing + State-Binding |
| 6 | ⏳ Geplant | Packaging (electron-builder) |

Aktueller Stand: [PROGRESS.md](PROGRESS.md)

---

**Zuletzt aktualisiert:** 10. Dezember 2025