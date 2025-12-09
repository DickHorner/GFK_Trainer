# Agentenleitfaden für dieses Repository

## Kontext

Dieses Repository enthält einen **GFK-Trainer** (Gewaltfreie Kommunikation) als **lokale Electron-App**:

- Inhaltliche Basis:  
  „Konflikte lösen durch Gewaltfreie Kommunikation: Ein Gespräch mit Gabriele Seils“ (Rosenberg/Seils).
- Zielgruppe: Menschen, die GFK lernen/vertiefen wollen (nicht zwingend technisch versiert).
- Anforderungen:
  - Läuft **offline** auf dem lokalen Rechner (Windows, macOS, Linux) als Electron-App.
  - Optionale Anbindung an ein **lokales LLM** (z. B. LM Studio) via OpenAI-kompatible HTTP-API.
  - Daten bleiben lokal; kein Tracking, keine Cloud-Abhängigkeit.

## Rolle des Agents (GitHub Copilot / Copilot Agents)

Du arbeitest als **Entwicklungsassistent** für:

1. **Architektur & Refactoring**
   - Electron-Grundstruktur erstellen und pflegen.
   - Renderer-App sauber strukturieren (Module statt Monolith).
   - Den GFK-Inhalt aus dem Code entkoppeln (siehe `src/gfkContent.ts`).

2. **Productivity & Robustheit**
   - Typen, Interfaces und Utility-Funktionen vorschlagen.
   - Fehlerrobuste JSON-Verarbeitung für LLM-Antworten implementieren und testen.
   - Hilfsfunktionen und Tests ergänzen, ohne die didaktische Logik zu verwässern.

3. **Didaktische Guardrails respektieren**
   - LLM gibt **Feedback**, schreibt aber NICHT komplett neue Texte für die Nutzer:innen.
   - Keine „Vorschlag übernehmen / Auto-Rewrite“-Funktion implementieren.
   - Ziel: Nutzer:innen lernen, ihre eigenen Formulierungen zu verbessern.

## Technische Leitplanken

- **Stack**
  - Electron (Main + Preload + Renderer).
  - Renderer: TypeScript + DOM oder leichter Framework (z. B. React/Svelte) – nach Rücksprache, standardmäßig aber **leichtgewichtig** halten.
  - Keine schweren Server-Komponenten; alles lokal, ohne Login.

- **Struktur (Soll-Zustand)**
  - `src/main/` – Electron-Main-Prozess.
  - `src/preload/` – Preload-Skripte (sichere IPC-Brücke).
  - `src/renderer/` – UI-Logik.
  - `src/gfkContent.ts` – **alle Kapitel/Übungen**, Single Source of Truth.
  - `src/llm/` – LLM-Client + Antwort-Parser.
  - `src/state/` – Persistenz, Import/Export des Fortschritts.

- **Inhaltliche Daten**
  - `src/gfkContent.ts` exportiert alle Kapitel/Übungen als Struktur.
  - Keine Duplikate von Texten im UI-Code; UI soll Inhalte **nur importieren**, nicht hartkodieren.

## LLM-Feedback-Schema (wichtig!)

LLM-Feedback erfolgt pro Feld (z. B. eine Textarea oder eine Zeile in einer Übersetzungsübung).  
Antwortformat des LLM ist **ein JSON-Objekt**:

```jsonc
{
  "exerciseId": "c1e2",
  "fieldId": "main",
  "present": true,
  "score": 2,
  "confidence": 0.8,
  "issues": [
    "Beobachtung ist zu allgemein.",
    "Gefühl ist mit Bewertung vermischt."
  ],
  "suggestions": [
    "Füge eine konkrete Situation/Zeit hinzu.",
    "Formuliere das Gefühl als Wort (z. B. traurig, wütend)."
  ],
  "exampleRewrite": "Als du vorhin das Gespräch beendet hast, wurde ich traurig, weil mir Austausch wichtig ist.",
  "explainers": [
    "Stark: du nennst klar, was dir wichtig ist.",
    "Ausbaufähig: der Beobachtungsteil ist noch unscharf."
  ],
  "meta": {
    "fieldType": "textarea",
    "pairIndex": 0
  }
}
score ist 0–3:

0 = kein brauchbares GFK-Element.

1 = Mischform, viel Bewertung / Strategie.

2 = überwiegend passend, GFK-Element klar erkennbar.

3 = sehr klar und kurz, nur Feinschliff.

exampleRewrite ist maximal 1–2 Sätze, nur als Orientierung, nicht als Ghostwriting.

UX-Prinzipien

Jede Übung ist einem Kapitel zugeordnet (siehe src/gfkContent.ts).

Nutzer:innen sehen:

Kapitelliste,

Übungen als Karten,

Eingabefelder (textarea, Matrix, Translate etc.),

pro Feld einen Button z. B. „Deep-Check“,

darunter LLM-Feedback (Score + Issues + Suggestions + optional Beispiel).

Es gibt keine Funktion „Übernehme LLM-Vorschlag in mein Feld“.

Was der Agent NICHT tun soll

Keine heimliche Telemetrie / Analytics einbauen.

Keine Cloud-Backends vorschlagen, wenn es lokal geht.

Keine Änderung an den inhaltlichen Texten (src/gfkContent.ts) ohne expliziten Grund (Bugfix, Tippfehler, klare didaktische Verbesserung).

Kein Copy-Paste von langen generierten Texten in Übungen (die Inhalte sollen strukturiert und knapp bleiben).

Arbeitsmodus

Bevor du Code generierst, prüfe:

Passt der Vorschlag zur vorhandenen Struktur?

Bleibt der GFK-Inhalt in src/gfkContent.ts die zentrale Quelle?

Bevor du bestehende Dateien änderst:

Erhalte Signaturen von Exporten (export const GFK_CHAPTERS, etc.).

Erhalte Dateinamen und Schnittstellen, auf die sich andere Module stützen.