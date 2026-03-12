// src/content/gfkCourse.ts
// GFK-Kurs (Gewaltfreie Kommunikation nach Rosenberg/Seils).
// Inhaltliche Basis: "Konflikte lösen durch Gewaltfreie Kommunikation"
// Kapitel- und Übungs-IDs sind mit "gfk-" präfixiert, damit sie global eindeutig bleiben.

import { Course, Chapter } from './types.js';

const GFK_CHAPTERS: Chapter[] = [
  {
    id: "gfk-ch1",
    title: "1. Was ist Gewaltfreie Kommunikation?",
    exercises: [
      {
        id: "gfk-c1e1",
        title: "GFK-Satzdestillat",
        prompt:
          "Formuliere in 2–3 Zeilen deinen persönlichen Leitsatz: Was ist Gewaltfreie Kommunikation (GFK) für dich – jetzt, bevor du tiefer einsteigst?",
        type: "textarea",
      },
      {
        id: "gfk-c1e2",
        title: "Wolf → Giraffe (3×)",
        prompt:
          "Nimm 3 wertende oder vorwurfsvolle Sätze aus deinem Alltag und übersetze sie in eine GFK-orientierte Formulierung (Beobachtung–Gefühl–Bedürfnis–Bitte, soweit dir möglich).",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c1e3",
        title: "Ziel-Check: Kontakt vs. Recht haben",
        prompt:
          "Reflektiere kurz: Ist dir in Konflikten Kontakt wichtiger als Recht behalten? Markiere in der Liste, was du vor einem schwierigen Gespräch konkret tun möchtest.",
        type: "checklist",
        items: [
          "Vor dem Gespräch 10–20 Sekunden bewusst atmen",
          "Innerlich entscheiden: Mir ist Verbindung wichtiger als Recht behalten",
          "Mir klar machen: Die andere Person hat ebenfalls Bedürfnisse",
          "Nach dem Gespräch 1 Lernpunkt für mich notieren",
        ],
      },
      {
        id: "gfk-c1e4",
        title: "Wolf-Scanner im Alltag",
        prompt:
          "Sammle innerhalb von 24 Stunden mindestens 5 Sätze, in denen du oder andere „Wolfssprache“ benutzen (z. B. „immer“, „nie“, „schuld“). Notiere sie und markiere, was genau daran bewertend ist.",
        type: "textarea",
      },
      {
        id: "gfk-c1e5",
        title: "Mein persönlicher GFK-Anwendungsfall",
        prompt:
          "Wähle einen konkreten aktuellen Konflikt (Familie, Schule, Arbeit, Behörde). Beschreibe in 5–10 Zeilen, wie du diese Situation innerlich erzählst. Markiere danach: Wo bewertest du? Wo könnte stattdessen eine Beobachtung stehen?",
        type: "textarea",
      },
      {
        id: "gfk-c1e6",
        title: "Meine GFK-Definition v2",
        prompt:
          "Formuliere nach den ersten Übungen deine Definition von GFK noch einmal. Was ist im Vergleich zu Übung c1e1 klarer oder anders geworden?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch2",
    title: "2. Die Logik der Gefühle",
    exercises: [
      {
        id: "gfk-c2e1",
        title: "Gefühl oder Gedanke?",
        prompt:
          "Trenne echte Gefühle von Gedanken oder Bewertungen. Ordne die Sätze den Spalten zu (nur als Denkraster, du kannst Beispiele verändern oder ergänzen).",
        type: "matrix",
        rows: [
          "Ich fühle, dass du mich ignorierst.",
          "Ich bin frustriert.",
          "Ich fühle mich übersehen.",
          "Ich fühle, dass das unfair ist.",
          "Ich bin nervös vor dem Gespräch.",
        ],
        cols: ["Gefühl (reines Wort)", "Gedanke/Bewertung"],
      },
      {
        id: "gfk-c2e2",
        title: "Somatik-Skala",
        prompt:
          "Wähle eine konkrete Situation, in der ein starkes Gefühl auftaucht. Notiere: Wie stark ist das Gefühl (0–10) und wo im Körper spürst du es am deutlichsten?",
        type: "rating",
      },
      {
        id: "gfk-c2e3",
        title: "Gefühlsfamilien",
        prompt:
          "Liste 4–8 Gefühlswörter auf und ordne sie zwei bis drei Gefühlsfamilien zu (z. B. Trauer, Wut, Freude, Angst). Schreibe jeweils dazu, wann du dieses Gefühl zuletzt erlebt hast.",
        type: "textarea",
      },
      {
        id: "gfk-c2e4",
        title: "Gefühl vs. Story",
        prompt:
          "Notiere 5 Sätze, die du spontan sagen würdest (z. B. „Ich fühle mich hintergangen.“). Zerlege jeden Satz in: (1) reines Gefühl als Wort und (2) Story/Bewertung.",
        type: "matrix",
        rows: ["Satz 1", "Satz 2", "Satz 3", "Satz 4", "Satz 5"],
        cols: ["Formulierung", "Gefühl (Wort)", "Story/Bewertung"],
      },
      {
        id: "gfk-c2e5",
        title: "Gefühlsverlauf in Phasen",
        prompt:
          "Nimm eine konkrete Situation und beschreibe deinen Gefühlsverlauf in drei Phasen: (1) vorher, (2) direkt danach, (3) 24 Stunden später. Welche Bedürfnisse standen jeweils im Vordergrund?",
        type: "textarea",
      },
      {
        id: "gfk-c2e6",
        title: "Gefühle, die ich vermeide",
        prompt:
          "Welche 2–3 Gefühle meidest du besonders (z. B. Scham, Ohnmacht, Hilflosigkeit)? Was glaubst du, schützt du durch dieses Vermeiden für Bedürfnisse?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch3",
    title: "3. Die Sprache der Bedürfnisse",
    exercises: [
      {
        id: "gfk-c3e1",
        title: "Detektivsatz (5×)",
        prompt:
          "Nimm 5 typische Vorwürfe aus deinem Alltag und ergänze sie jeweils um: „…weil mir [Bedürfnis] wichtig ist.“ Notiere die Bedürfnisse explizit (z. B. Ruhe, Respekt, Klarheit, Zugehörigkeit).",
        type: "textarea",
      },
      {
        id: "gfk-c3e2",
        title: "Bedürfnis-Landkarte",
        prompt:
          "Wähle 6 Bedürfnisse und sammle Situationen: Wann war dieses Bedürfnis genährt, wann deutlich unterversorgt?",
        type: "matrix",
        rows: ["Ruhe", "Klarheit", "Zugehörigkeit", "Autonomie", "Sicherheit", "Wirksamkeit"],
        cols: ["Beispiel genährt", "Beispiel unterversorgt"],
      },
      {
        id: "gfk-c3e3",
        title: "Strategie → Bedürfnis",
        prompt:
          "Liste 3 Strategien („Ich will …“) und finde das Bedürfnis dahinter. Ergänze zu jeder Strategie mindestens eine alternative Strategie, die das gleiche Bedürfnis nähren könnte.",
        type: "matrix",
        rows: ["Strategie 1", "Strategie 2", "Strategie 3"],
        cols: ["Strategie", "Bedürfnis dahinter", "alternative Strategien"],
      },
      {
        id: "gfk-c3e4",
        title: "Bedürfnis-Diagramm",
        prompt:
          "Für jedes Bedürfnis: Welche Gefühle sind typisches Signal? Welche Strategien wählst du häufig bei Über- oder Unterversorgung?",
        type: "matrix",
        rows: ["Ruhe", "Zugehörigkeit", "Autonomie", "Sicherheit", "Wirksamkeit", "Sinn"],
        cols: ["Gefühlssignale", "Strategien bei Mangel", "Strategien bei Erfüllung"],
      },
      {
        id: "gfk-c3e5",
        title: "Strategie oder Bedürfnis?",
        prompt:
          "Formuliere 3 Sätze wie „Ich brauche, dass du pünktlich bist.“ in echte Bedürfnis-Sprache um (z. B. „Mir ist Verlässlichkeit wichtig, deswegen …“).",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c3e6",
        title: "Top-3-Bedürfnisse gerade",
        prompt:
          "Welche 3 Bedürfnisse sind in deinem Leben gerade am lautesten? Woran merkst du das konkret im Alltag (Verhalten, Gedanken, Körpersignale)?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch4",
    title: "4. Die Philosophie der Fülle",
    exercises: [
      {
        id: "gfk-c4e1",
        title: "Sprachspur-Audit",
        prompt:
          "Finde aktuelle Sätze, die Mangel signalisieren (z. B. „Ich kann nie …“, „Niemand hilft mir.“) und formuliere sie in Fülle-Sprache um, in der Bedürfnisse und Wahlmöglichkeiten sichtbar werden.",
        type: "textarea",
      },
      {
        id: "gfk-c4e2",
        title: "Win-Win-Skizze",
        prompt:
          "Entwickle mindestens 3 Optionen, die sowohl deine Bedürfnisse als auch die der anderen Seite nähren könnten.",
        type: "matrix",
        rows: ["Option A", "Option B", "Option C"],
        cols: ["Option", "mein Bedürfnis", "Bedürfnis der anderen Seite"],
      },
      {
        id: "gfk-c4e3",
        title: "Mikro-Feier",
        prompt:
          "Nenne 3 kleine Handlungen von dir oder anderen, beschreibe ihre Wirkung und welches Bedürfnis dadurch genährt wurde.",
        type: "textarea",
      },
      {
        id: "gfk-c4e4",
        title: "Mangel-Story → Fülle-Story",
        prompt:
          "Schreibe 2–3 Mangel-Geschichten („Ich komme nie zu …“) auf und formuliere sie so um, dass Bedürfnisse und konkrete Möglichkeiten im Fokus stehen.",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c4e5",
        title: "Worst-Case-Szenario in Fülle-Sprache",
        prompt:
          "Nimm ein Angst-Szenario („Wenn ich das sage, dann …“). Erkenne das Bedürfnis dahinter und formuliere eine Fülle-Perspektive darauf (z. B. welche Unterstützung, Grenzen oder Bitten dir helfen könnten).",
        type: "textarea",
      },
      {
        id: "gfk-c4e6",
        title: "Fülle-Check im Alltag",
        prompt:
          "Kurz-Review eines Tages: Wo hast du heute Mangel-Sprache bemerkt? Wo hast du bewusst Fülle-Sprache genutzt oder hättest sie nutzen können?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch5",
    title: "5. Die Macht der Empathie",
    exercises: [
      {
        id: "gfk-c5e1",
        title: "Empathie-Loop (2 Minuten)",
        prompt:
          "Übe 2 Minuten lang (auch nur gedanklich): Spiegeln → Gefühl raten → Bedürfnis raten → Check beim Gegenüber (innerlich oder real). Notiere danach kurz, was dir leicht fiel und was schwer.",
        type: "timer",
        durationSec: 120,
      },
      {
        id: "gfk-c5e2",
        title: "Zwei-Ohren-Übung",
        prompt:
          "Nimm einen harten Satz, den du kennst. Schreibe auf, wie du ihn mit Schakal-Ohr hörst – und wie mit Giraffen-Ohr.",
        type: "matrix",
        rows: ["Harter Satz"],
        cols: ["Schakal-Ohr (Interpretation)", "Giraffen-Ohr (Bedürfnis-Ebene)"],
      },
      {
        id: "gfk-c5e3",
        title: "Empathie vor Information",
        prompt:
          "Formuliere eine kurze 2-Satz-Empathiespiegelung (Gefühl + Bedürfnis), bevor du in die Sachebene gehst. Nutze eine reale Situation als Vorlage.",
        type: "textarea",
      },
      {
        id: "gfk-c5e4",
        title: "Empathie ohne Worte",
        prompt:
          "Beschreibe eine Situation, in der du durch bloße Präsenz empathisch sein könntest. Was ist deine innere Haltung? Was würdest du bewusst NICHT sagen?",
        type: "textarea",
      },
      {
        id: "gfk-c5e5",
        title: "Vier Empathie-Killer entschärfen",
        prompt:
          "Finde je ein Beispiel für Ratschlag, Trost, Analyse und Moralpredigt – und formuliere eine empathische Alternative dazu.",
        type: "matrix",
        rows: ["Ratschlag", "Trost", "Analyse", "Moralpredigt"],
        cols: ["Beispielsatz", "Empathie-Alternative"],
      },
      {
        id: "gfk-c5e6",
        title: "Wie gut halte ich Stille aus?",
        prompt:
          "Reflektiere: Wie leicht fällt es dir, nach einem ehrlichen Satz des Gegenübers einfach still zu sein? Was passiert innerlich in dieser Stille?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch6",
    title: "6. Im Herzen des „Feindes“",
    exercises: [
      {
        id: "gfk-c6e1",
        title: "Steel-Man der Gegenseite",
        prompt:
          "Formuliere die bestmögliche, bedürfnisbasierte Motivation der „Gegenseite“ in einem konkreten Konflikt. Was könnte ihr wichtig sein, jenseits von „Rechthaben“?",
        type: "textarea",
      },
      {
        id: "gfk-c6e2",
        title: "Grenze + Respekt",
        prompt:
          "Nutze die Struktur: „Ich will X schützen, daher Nein zu Y; und ich sehe bei dir Z.“ Fülle sie für eine reale Situation aus.",
        type: "matrix",
        rows: ["Formel"],
        cols: ["X (mein Bedürfnis)", "Y (Nein wozu)", "Z (Anerkennung für die andere Seite)"],
      },
      {
        id: "gfk-c6e3",
        title: "Rumi-Brücke",
        prompt:
          "Finde eine Formulierung wie: „Uns beiden ist … wichtig“ für einen konkreten Konflikt. Notiere 2–3 Varianten.",
        type: "textarea",
      },
      {
        id: "gfk-c6e4",
        title: "Mein innerer Feind",
        prompt:
          "Wähle einen inneren Kritiker-Anteil (z. B. Perfektionist, Antreiber). Was will dieser Anteil positiv schützen? Welche Bedürfnisse stecken dahinter?",
        type: "textarea",
      },
      {
        id: "gfk-c6e5",
        title: "Nein mit Gleichwertigkeit",
        prompt:
          "Formuliere 2–3 Neinsätze so, dass sie klar sind und gleichzeitig die Würde des Gegenübers anerkennen.",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c6e6",
        title: "Wo will ich Recht behalten?",
        prompt:
          "In welchen Situationen ist dir Recht haben spürbar wichtiger als Verbindung? Was steht für dich dort auf dem Spiel?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch7",
    title: "7. Ausgleich zwischen Täter- und Opferrolle",
    exercises: [
      {
        id: "gfk-c7e1",
        title: "Ärger-Dekonstruktion",
        prompt:
          "Zerlege einen konkreten Ärger-Fall in: Auslöser, Bewertung, Bedürfnis, Bitte.",
        type: "matrix",
        rows: ["Fall A"],
        cols: ["Auslöser (Beobachtung)", "Bewertung/Story", "Bedürfnis", "Bitte"],
      },
      {
        id: "gfk-c7e2",
        title: "Reparatur-Menü",
        prompt:
          "Entwickle 3 Formen von Ausgleich (für dich oder andere) und notiere, welche Bedürfnisse dadurch genährt würden.",
        type: "matrix",
        rows: ["Variante 1", "Variante 2", "Variante 3"],
        cols: ["Ausgleichshandlung", "Bedürfnis"],
      },
      {
        id: "gfk-c7e3",
        title: "No-Shame-Sprache",
        prompt:
          "Formuliere 2 Vorwürfe so um, dass sie Wirkung und Verantwortung betonen statt Schuld (z. B. „Ich bedaure, dass …, weil mir … wichtig ist.“).",
        type: "translate",
        items: 2,
      },
      {
        id: "gfk-c7e4",
        title: "Scham-Entlastung",
        prompt:
          "Formuliere 2–3 Sätze nach der Struktur: „Ich habe X getan, und ich bedaure …, weil mir Y wichtig ist.“",
        type: "textarea",
      },
      {
        id: "gfk-c7e5",
        title: "Konkrete Reparaturplanung",
        prompt:
          "Für 2–3 reale Konflikte: Wer ist betroffen, welcher Schaden/Wirkung ist entstanden, welcher konkrete Reparaturvorschlag, bis wann?",
        type: "matrix",
        rows: ["Konflikt 1", "Konflikt 2", "Konflikt 3"],
        cols: ["Betroffene Person", "Schaden/Wirkung", "Reparaturvorschlag", "Zeitfenster"],
      },
      {
        id: "gfk-c7e6",
        title: "Schuld vs. Verantwortung",
        prompt:
          "Schreibe 3 Sätze einmal in Schuldlogik („Wer ist schuld?“) und einmal in Verantwortungslogik („Was will ich künftig anders machen?“) um.",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch8",
    title: "8. Liebesbeziehungen als Konfliktschule",
    exercises: [
      {
        id: "gfk-c8e1",
        title: "Drei konkrete Wünsche",
        prompt:
          "Formuliere 3 Bitten an deine:n Partner:in im Format „Wärst du bereit, [Handlung] bis [Zeit] …?“; achte darauf, dass sie konkret, positiv und überprüfbar sind.",
        type: "matrix",
        rows: ["Wunsch 1", "Wunsch 2", "Wunsch 3"],
        cols: ["Bitte (Handlung)", "Zeitanker/Marker"],
      },
      {
        id: "gfk-c8e2",
        title: "Drei emotionale Körbe",
        prompt:
          "Fülle 3 Körbe: 1 zum Feiern, 1 zum Bedauern, 1 mit einer Bitte – jeweils auf deinen Beziehungsalltag bezogen.",
        type: "matrix",
        rows: ["Korb 1", "Korb 2", "Korb 3"],
        cols: ["Feiern", "Bedauern", "Bitte"],
      },
      {
        id: "gfk-c8e3",
        title: "Vorwurf → Selbstaussage",
        prompt:
          "Übersetze 2 typische Vorwürfe gegenüber deiner Beziehungsperson in GFK-Formulierungen (Beobachtung–Gefühl–Bedürfnis–Bitte).",
        type: "translate",
        items: 2,
      },
      {
        id: "gfk-c8e4",
        title: "Trigger-Logbuch Beziehung",
        prompt:
          "Notiere 3 wiederkehrende Trigger mit: Situation, Gefühl, Bedürfnis, erster eigener Beitrag/Anteil.",
        type: "matrix",
        rows: ["Trigger 1", "Trigger 2", "Trigger 3"],
        cols: ["Situation", "Gefühl", "Bedürfnis", "eigener Beitrag"],
      },
      {
        id: "gfk-c8e5",
        title: "Bitte vs. Forderung",
        prompt:
          "Formuliere 3 Sätze so um, dass ein ehrliches Nein der anderen Seite möglich bleibt (also Bitte statt Forderung).",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c8e6",
        title: "Wo werde ich klein oder groß?",
        prompt:
          "Reflektiere Situationen, in denen du dich in der Beziehung sehr klein machst oder sehr groß (überlegen). Was willst du jeweils schützen?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch9",
    title: "9. Kinder gewaltfrei begleiten",
    exercises: [
      {
        id: "gfk-c9e1",
        title: "Vor-Empathie",
        prompt:
          "Formuliere 2–3 Sätze nach dem Muster: „Bist du gerade …, weil dir … wichtig ist?“ – und setze sie an die Stelle, an der du sonst direkt korrigieren würdest.",
        type: "textarea",
      },
      {
        id: "gfk-c9e2",
        title: "Bitte mit Marker",
        prompt:
          "Formuliere eine Bitte an ein Kind und wähle einen messbaren Marker (Timer, Flüsterton, Handzeichen etc.), an dem ihr beide merkt, ob es geklappt hat.",
        type: "matrix",
        rows: ["Beispiel"],
        cols: ["Bitte (Handlung)", "Messpunkt/Marker"],
      },
      {
        id: "gfk-c9e3",
        title: "Regel-Reparatur",
        prompt:
          "Formuliere eine typische Strafe so um, dass sie eine natürliche Konsequenz mit Bedürfnisbezug wird (z. B. Reparatur, Wiedergutmachung, Verantwortung teilen).",
        type: "translate",
        items: 1,
      },
      {
        id: "gfk-c9e4",
        title: "GFK-Selbstgespräch vor Eskalation",
        prompt:
          "Schreibe einen inneren 4-Schritt (Beobachtung–Gefühl–Bedürfnis–Bitte an dich selbst), den du direkt vor einer Eskalation mit einem Kind innerlich sagen könntest.",
        type: "textarea",
      },
      {
        id: "gfk-c9e5",
        title: "Grenze mit Fürsorge",
        prompt:
          "Beschreibe 2–3 typische Situationen (Zähneputzen, Medien, Schlafen) mit je: Grenze, Bedürfnis Kind, Bedürfnis Erwachsener, Formulierung.",
        type: "matrix",
        rows: ["Situation 1", "Situation 2", "Situation 3"],
        cols: ["Grenze", "Bedürfnis Kind", "Bedürfnis Erwachsener", "Formulierung"],
      },
      {
        id: "gfk-c9e6",
        title: "Wo kaufe ich Ruhe mit Macht?",
        prompt:
          "Reflektiere ehrlich Situationen, in denen du Macht nutzt, um Ruhe zu kaufen. Welche Alternativen wären denkbar, wenn du mehr Zeit/Energie hättest?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch10",
    title: "10. GFK in der Schule",
    exercises: [
      {
        id: "gfk-c10e1",
        title: "Satzwerkstatt für Lehrersätze",
        prompt:
          "Formuliere 3 typische Lehrersätze (z. B. „Ihr seid immer so laut“) so um, dass sie beobachtungsnah sind und eine klare Bitte enthalten.",
        type: "translate",
        items: 3,
      },
      {
        id: "gfk-c10e2",
        title: "Geräusch-Protokoll",
        prompt:
          "Lege für deine Klasse einen messbaren Marker für Lautstärke oder Konzentration fest (z. B. Geräuschampel, Minuten fokussierte Arbeit). Notiere Beobachtungen und Wirkung.",
        type: "textarea",
      },
      {
        id: "gfk-c10e3",
        title: "Drehscheibe",
        prompt:
          "Beschreibe einen Konflikt zwischen zwei Schüler:innen: Bedürfnis A, Bedürfnis B und eine mögliche gemeinsame Bitte.",
        type: "matrix",
        rows: ["Konflikt"],
        cols: ["Bedürfnis A", "Bedürfnis B", "gemeinsame Bitte"],
      },
      {
        id: "gfk-c10e4",
        title: "Kollektiv-Gefühle der Klasse",
        prompt:
          "Beschreibe deine Klasse als System: Welche Gefühle und Bedürfnisse sind im Kollektiv spürbar? Was könntest du als Lehrkraft konkret tun, um 1–2 Bedürfnisse zu unterstützen?",
        type: "textarea",
      },
      {
        id: "gfk-c10e5",
        title: "Konflikt-Mikrodesign",
        prompt:
          "Wähle einen typischen Konflikt (z. B. Störung im Unterricht) und designe einen kurzen Ablauf: Ziel (Bedürfnisse), Rahmen (Zeit/Ort), Satzstarter, Exit-Strategie.",
        type: "matrix",
        rows: ["Konflikt-Design"],
        cols: ["Ziel/Bedürfnisse", "Rahmen (Zeit/Ort)", "Satzstarter", "Exit-Strategie"],
      },
      {
        id: "gfk-c10e6",
        title: "Was liegt in meinem Einflussbereich?",
        prompt:
          "Liste Faktoren in Schule/Klasse, die du beeinflussen kannst, und solche, die du nicht beeinflussen kannst. Wo lohnt sich dein GFK-Fokus besonders?",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch11",
    title: "11. Die Welt verändern – jetzt!",
    exercises: [
      {
        id: "gfk-c11e1",
        title: "Mikro-Initiative",
        prompt:
          "Formuliere eine kleine wiederkehrende Handlung (Ritual), mit der du zur Veränderung beiträgst, und einen sichtbaren Marker für ihren Erfolg.",
        type: "matrix",
        rows: ["Initiative"],
        cols: ["Ritual (konkrete Handlung)", "Marker (Woran merkst du Wirkung?)"],
      },
      {
        id: "gfk-c11e2",
        title: "Verbündeten-Skizze",
        prompt:
          "Notiere für 3 Personen oder Orte eine erste kleine Bitte, wie sie dich konkret unterstützen könnten.",
        type: "matrix",
        rows: ["Person 1", "Person 2", "Person 3"],
        cols: ["Person/Ort", "Erste Bitte"],
      },
      {
        id: "gfk-c11e3",
        title: "Review-Fragen",
        prompt:
          "Was hat in deinen bisherigen Versuchen mit GFK schon funktioniert? Was schleift noch? Was möchtest du im nächsten Monat justieren?",
        type: "textarea",
      },
      {
        id: "gfk-c11e4",
        title: "Aktivismus-Burnout-Check",
        prompt:
          "Wie hoch ist deine Belastung (0–10) im Kontext „Welt verbessern / Engagement“? Welche Bedürfnisse sind hier besonders gefordert oder unterversorgt?",
        type: "rating",
      },
      {
        id: "gfk-c11e5",
        title: "System-Ebene denken",
        prompt:
          "Beschreibe einen Konflikt auf Systemebene (z. B. Schule, Verwaltung, Gesundheitswesen): Welche Regeln, Rollen und Strukturen sind beteiligt? Welche Bedürfnisse siehst du auf den verschiedenen Ebenen?",
        type: "textarea",
      },
      {
        id: "gfk-c11e6",
        title: "Mein kleinstes wirksames Muster",
        prompt:
          "Formuliere das kleinste, wiederholbare Verhalten, mit dem du real Einfluss nimmst (z. B. 1 empathische Nachfrage pro Tag, 1 Feedback in GFK-Struktur pro Woche).",
        type: "textarea",
      },
    ],
  },
  {
    id: "gfk-ch12",
    title: "12. Dankbarkeit ausdrücken und annehmen",
    exercises: [
      {
        id: "gfk-c12e1",
        title: "GFK-Dank (3×)",
        prompt:
          "Formuliere 3 Dankessätze im GFK-Format: Handlung → Wirkung → genährtes Bedürfnis.",
        type: "matrix",
        rows: ["Dank 1", "Dank 2", "Dank 3"],
        cols: ["Handlung", "Wirkung", "Bedürfnis"],
      },
      {
        id: "gfk-c12e2",
        title: "Lob annehmen",
        prompt:
          "Simuliere 2–3 Lobsätze und formuliere Antworten, die Wirkung und Bedürfnis wiedergeben statt das Lob kleinzureden oder wegzuwinken.",
        type: "translate",
        items: 2,
      },
      {
        id: "gfk-c12e3",
        title: "Retrospektive GFK-Anwendung",
        prompt:
          "Wähle 2 Situationen aus den letzten Wochen, in denen du GFK angewendet hast. Was hat funktioniert, was willst du beibehalten, was anpassen?",
        type: "textarea",
      },
      {
        id: "gfk-c12e4",
        title: "Dank an mich selbst",
        prompt:
          "Formuliere 2–3 Dankessätze an dich selbst im GFK-Format (eigene Handlung, Wirkung, Bedürfnis).",
        type: "textarea",
      },
      {
        id: "gfk-c12e5",
        title: "Lob verdauen",
        prompt:
          "Nimm 2–3 echte Lobsätze und übersetze sie jeweils in: vermutetes Bedürfnis der anderen Person & mögliche Antwort von dir.",
        type: "matrix",
        rows: ["Lob 1", "Lob 2", "Lob 3"],
        cols: ["Original-Lob", "vermutetes Bedürfnis", "Antwort in GFK"],
      },
      {
        id: "gfk-c12e6",
        title: "Was will ich mir bewahren?",
        prompt:
          "Welche 3 konkreten Verhaltensweisen aus diesem Kurs willst du in deinem Alltag bewusst bewahren?",
        type: "textarea",
      },
    ],
  },
];

export const GFK_COURSE: Course = {
  id: 'gfk',
  title: 'GFK-Trainer',
  description: 'Gewaltfreie Kommunikation nach Rosenberg/Seils – 12 Kapitel mit praktischen Übungen.',
  isGfkBased: true,
  chapters: GFK_CHAPTERS,
};
