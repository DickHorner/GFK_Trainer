/**
 * State Management Module
 * Handles persistence of user progress (notes, ratings, checklist items, etc.)
 * Uses localStorage as the backing store
 */
/**
 * Answer for a textarea field
 */
export interface TextareaAnswer {
    type: 'textarea';
    content: string;
}
/**
 * Answer for a matrix field (2D grid of inputs)
 */
export interface MatrixAnswer {
    type: 'matrix';
    data: string[][];
}
/**
 * Answer for a translate field (pairs of inputs)
 */
export interface TranslateAnswer {
    type: 'translate';
    pairs: Array<{
        from: string;
        to: string;
    }>;
}
/**
 * Answer for a checklist field
 */
export interface ChecklistAnswer {
    type: 'checklist';
    checked: boolean[];
}
/**
 * Answer for a rating field
 */
export interface RatingAnswer {
    type: 'rating';
    score: number | null;
    comment: string;
}
/**
 * Answer for a timer field (just completion mark)
 */
export interface TimerAnswer {
    type: 'timer';
    completed: boolean;
    timestamps: number[];
}
export type ExerciseAnswer = TextareaAnswer | MatrixAnswer | TranslateAnswer | ChecklistAnswer | RatingAnswer | TimerAnswer;
/**
 * Answers for a single exercise
 */
export interface ExerciseProgress {
    exerciseId: string;
    answers: Partial<Record<string, ExerciseAnswer>>;
    lastModified: number;
    llmFeedback?: Record<string, any>;
}
/**
 * Answers for a chapter
 */
export interface ChapterProgress {
    chapterId: string;
    exercises: Record<string, ExerciseProgress>;
}
/**
 * Complete user progress state
 */
export interface UserProgress {
    version: 1;
    createdAt: number;
    lastModified: number;
    chapters: Record<string, ChapterProgress>;
    metadata?: {
        username?: string;
        locale?: string;
    };
}
/**
 * Load user progress from localStorage
 */
export declare function loadState(): UserProgress;
/**
 * Save user progress to localStorage
 */
export declare function saveState(progress: UserProgress): void;
/**
 * Get or create chapter progress
 */
export declare function getOrCreateChapterProgress(progress: UserProgress, chapterId: string): ChapterProgress;
/**
 * Get or create exercise progress
 */
export declare function getOrCreateExerciseProgress(chapter: ChapterProgress, exerciseId: string): ExerciseProgress;
/**
 * Set answer for a specific field in an exercise
 */
export declare function setAnswer(progress: UserProgress, chapterId: string, exerciseId: string, fieldId: string, answer: ExerciseAnswer): void;
/**
 * Get answer for a specific field
 */
export declare function getAnswer(progress: UserProgress, chapterId: string, exerciseId: string, fieldId: string): ExerciseAnswer | undefined;
/**
 * Export progress as JSON string (for download)
 */
export declare function exportState(progress: UserProgress): string;
/**
 * Import progress from JSON string (from file upload)
 */
export declare function importState(json: string): UserProgress | null;
/**
 * Clear all progress (destructive)
 */
export declare function clearState(): void;
/**
 * Get statistics about completed work
 */
export declare function getProgressStats(progress: UserProgress): {
    totalChapters: number;
    totalExercises: number;
    exercisesWithAnswers: number;
};
/**
 * Set LLM feedback for a field (caching)
 */
export declare function setLLMFeedback(progress: UserProgress, chapterId: string, exerciseId: string, fieldId: string, feedback: any): void;
/**
 * Get cached LLM feedback for a field
 */
export declare function getLLMFeedback(progress: UserProgress, chapterId: string, exerciseId: string, fieldId: string): any | undefined;
//# sourceMappingURL=state.d.ts.map