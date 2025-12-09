export type ExerciseType = "textarea" | "matrix" | "translate" | "checklist" | "rating" | "timer";
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
export type Exercise = TextareaExercise | MatrixExercise | TranslateExercise | ChecklistExercise | RatingExercise | TimerExercise;
export interface Chapter {
    id: string;
    title: string;
    exercises: Exercise[];
}
export declare const GFK_CHAPTERS: Chapter[];
//# sourceMappingURL=gfkContent.d.ts.map