/**
 * UI Rendering Module for GFK-Trainer
 * Handles display of chapters, exercises, and input fields
 */
export interface UIState {
    selectedChapterId: string | null;
    selectedExerciseId: string | null;
}
/**
 * Initialize the UI with chapters list and main content area
 */
export declare function initializeUI(container: HTMLElement): void;
//# sourceMappingURL=ui.d.ts.map