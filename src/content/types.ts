// src/content/types.ts
// Generic content model for the Kurs-Trainer.
// Chapter and Exercise types are kept compatible with the original gfkContent.ts
// so the rest of the app needs minimal changes.

export type ExerciseType =
  | "textarea"
  | "matrix"
  | "translate"
  | "checklist"
  | "rating"
  | "timer";

export interface BaseExercise {
  id: string;
  title: string;
  prompt: string;
  type: ExerciseType;
}

export interface TextareaExercise extends BaseExercise {
  type: "textarea";
}

export interface MatrixExercise extends BaseExercise {
  type: "matrix";
  rows: string[];
  cols: string[];
}

export interface TranslateExercise extends BaseExercise {
  type: "translate";
  items: number;
}

export interface ChecklistExercise extends BaseExercise {
  type: "checklist";
  items: string[];
}

export interface RatingExercise extends BaseExercise {
  type: "rating";
}

export interface TimerExercise extends BaseExercise {
  type: "timer";
  durationSec: number;
}

export type Exercise =
  | TextareaExercise
  | MatrixExercise
  | TranslateExercise
  | ChecklistExercise
  | RatingExercise
  | TimerExercise;

export interface Chapter {
  id: string;
  title: string;
  exercises: Exercise[];
}

/**
 * Generic course model.
 * isGfkBased controls whether the LLM Deep-Check feature is available
 * (Deep-Check uses a GFK-specific evaluation prompt and should only be
 * shown for GFK-based courses in v1).
 */
export interface Course {
  id: string;
  title: string;
  description?: string;
  isGfkBased?: boolean;
  chapters: Chapter[];
}
