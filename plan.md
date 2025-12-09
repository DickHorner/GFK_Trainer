# Entwicklungsplan – GFK-Trainer als Electron-App

Ziel:  
Die bestehende HTML-Variante des GFK-Trainers soll in eine **strukturierte Electron-App** überführt werden,  
ohne die didaktische Logik zu verlieren. Die Inhalte werden aus `src/gfkContent.ts` geladen.

---

## Phase 0 – Basis-Repo & Inhalte

**Ziel:** Inhalte und Leitplanken sauber festlegen.

1. Dateien anlegen:
   - `agents.md` (Agentenleitfaden für Copilot)
   - `plan.md` (dieses Dokument)
   - `src/gfkContent.ts` (siehe separate Datei, enthält alle Kapitel/Übungen)

2. Git-Repo initialisieren:
   - `git init`
   - `.gitignore` mit `node_modules`, `dist`, `out`, etc.
   - Erste Commits:  
     - `chore: initial repo with content model`  
     - `docs: add agents and development plan`

---

## Phase 1 – Electron-Grundgerüst

**Ziel:** Minimal lauffähige Electron-App.

1. `package.json` anlegen:
   - Scripts:
     - `"dev": "electron ."` (oder mit bundler später anpassen)
     - `"build": ...` (später)
   - Dependencies:
     - `electron` als devDependency.

2. Dateien:
   - `electron/main.ts` oder `electron/main.js`:
     - BrowserWindow erstellen.
     - `index.html` im Renderer laden.
   - `electron/preload.ts`:
     - IPC-Brücke für später (z. B. LLM-Aufrufe über Main oder direkt via fetch im Renderer).

3. Einfaches `index.html` im Renderer:
   - Minimaler Container-DIV (z. B. `<div id="root"></div>`).
   - Einbindung eines Renderer-Bundles (z. B. `renderer.js`).

**Ergebnis:** `npm run dev` startet ein Fenster mit „Hello GFK-Trainer“.

---

## Phase 2 – Renderer-Struktur & Content-Import

**Ziel:** Inhalte aus `src/gfkContent.ts` im Renderer anzeigen.

1. Renderer-Stack festlegen:
   - Minimal: TypeScript + DOM oder kleines Framework (React/Svelte).  
   - Annahme für Copilot: **TypeScript + DOM** (kein großes Framework, solange nicht nötig).

2. Module anlegen:
   - `src/renderer/main.ts` – Einstiegspunkt Renderer.
   - `src/renderer/ui.ts` – Renderfunktionen (Kapitel-Navigation, Exercise-Cards).
   - `src/state/state.ts` – Laden/Speichern des Fortschritts (z. B. `localStorage`).
   - `src/llm/client.ts` – LLM-HTTP-Client (später).

3. `src/gfkContent.ts` einbinden:
   - `import { GFK_CHAPTERS } from "../gfkContent";`
   - Kapitelübersicht in der linken Spalte rendern.
   - Übungen eines Kapitels als Karten in der Mitte anzeigen.

**Ergebnis:**  
Electron-Fenster zeigt alle Kapitel und Übungen, Eingabefelder funktionieren lokal (Noch ohne LLM).

---

## Phase 3 – State-Persistenz (Fortschritt)

**Ziel:** Fortschritt lokal speichern/ladbar machen.

1. `src/state/state.ts`:
   - Typen definieren für:
     - Notizen (textarea-Inhalte),
     - Matrix-Inhalte,
     - Checklisten,
     - Ratings,
     - Translate-Paare.
   - `loadState()`, `saveState()`, `exportState()`, `importState()` implementieren.
   - Storage-Backend: `localStorage` oder `IndexedDB` (anfangs localStorage reicht).

2. UI-Hooks:
   - Eingabefelder (textarea, input, checkbox) beim `input/change` den State aktualisieren.
   - Buttons:
     - „Fortschritt exportieren“ → JSON-Datei speichern.
     - „Fortschritt importieren“ → JSON-Datei einlesen.

**Ergebnis:**  
Nutzer:innen können über längere Zeit mit ihren Daten arbeiten.

---

## Phase 4 – LLM-Integration (Deep-Check)

**Ziel:** Pro Feld optionales Feedback vom lokalen LLM.

1. `src/llm/client.ts`:
   - Konfigurierbare Endpoint-Struktur:
     - z. B. `http://localhost:1234/v1/chat/completions` für LM Studio.
   - Typen für Request/Response definieren (OpenAI-kompatibel).
   - Eine Hauptfunktion:
     - `deepCheckField(exercise, fieldId, fieldType, text, extraContext): Promise<LlmEvaluationResult>`.

2. `src/llm/schema.ts`:
   - Typ `LlmEvaluationResult` definieren (entspricht JSON-Schema aus `agents.md`).
   - Parser-Funktion:
     - Roh-Content (`string`) → JSON-Parsing mit Minimal-Reparatur und Fallback.

3. Renderer-Integration:
   - Pro Feld ein Button „Deep-Check“.
   - Klick:
     - Request an LLM,
     - Ergebnis unter dem Feld darstellen (Score, Issues, Suggestions, Example, Explainers).

4. Konfig-Import:
   - Optional: kleine Datei `config.local.json` laden (Pfad z. B. im User-Verzeichnis oder im Projektverzeichnis),
   - UI-Element, um anzuzeigen, ob ein LLM konfiguriert ist.

---

## Phase 5 – UX-Feinschliff & Stabilisierung

**Ziel:** Bedienung flüssig, robust, verständlich.

1. UI:
   - Klare Kapitelnavigation, aktuell gewähltes Kapitel hervorheben.
   - Knappes, konsistentes Styling (Dunkelmodus wie in der HTML-Version möglich).

2. Error-Handling:
   - Saubere Meldungen bei LLM-Fehlern (Timeout, falsche Config).
   - Kein App-Crash bei JSON-Parsing-Problemen.

3. Tests (optional, aber empfohlen):
   - Unit-Tests für:
     - LLM-Parser,
     - State-Speicher/Import-Export.
   - Snapshot-Tests oder leichte UI-Tests bei Bedarf.

---

## Phase 6 – Packaging (später)

**Ziel:** Optionale Installationspakete für Windows/macOS/Linux.

- Einsatz von `electron-builder` oder ähnlichem Tool.
- App-Name, Icons, Versionen definieren.
- Getrennte Profile:
  - Dev-Build (schnell, mit Source Maps),
  - Release-Build (minifiziert, signiert – falls nötig).

---

Stand: 9.12.2025
