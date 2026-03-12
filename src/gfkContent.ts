// src/gfkContent.ts
// Kompatibilitäts-Shim: Alle Typen und Inhalte wurden nach src/content/ verschoben.
// Dieser Re-Export stellt sicher, dass bestehende Importe weiterhin funktionieren.

export type {
  ExerciseType,
  BaseExercise,
  TextareaExercise,
  MatrixExercise,
  TranslateExercise,
  ChecklistExercise,
  RatingExercise,
  TimerExercise,
  Exercise,
  Chapter,
} from './content/types.js';

export { GFK_COURSE } from './content/gfkCourse.js';

// GFK_CHAPTERS wird für Rückwärtskompatibilität direkt aus dem Kurs abgeleitet.
import { GFK_COURSE } from './content/gfkCourse.js';
export const GFK_CHAPTERS = GFK_COURSE.chapters;
