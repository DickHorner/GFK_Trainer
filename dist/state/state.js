/**
 * State Management Module
 * Handles persistence of user progress (notes, ratings, checklist items, etc.)
 * Uses localStorage as the backing store
 */
const STORAGE_KEY = 'gfk-trainer-progress';
const VERSION = 1;
/**
 * Initialize empty user progress
 */
function createEmptyProgress() {
    return {
        version: VERSION,
        createdAt: Date.now(),
        lastModified: Date.now(),
        chapters: {},
    };
}
/**
 * Load user progress from localStorage
 */
export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return createEmptyProgress();
        }
        const parsed = JSON.parse(raw);
        // Validate version
        if (parsed.version !== VERSION) {
            console.warn(`State version mismatch: expected ${VERSION}, got ${parsed.version}. Resetting.`);
            return createEmptyProgress();
        }
        return parsed;
    }
    catch (error) {
        console.error('Failed to load state:', error);
        return createEmptyProgress();
    }
}
/**
 * Save user progress to localStorage
 */
export function saveState(progress) {
    try {
        progress.lastModified = Date.now();
        const serialized = JSON.stringify(progress);
        localStorage.setItem(STORAGE_KEY, serialized);
    }
    catch (error) {
        console.error('Failed to save state:', error);
    }
}
/**
 * Get or create chapter progress
 */
export function getOrCreateChapterProgress(progress, chapterId) {
    if (!progress.chapters[chapterId]) {
        progress.chapters[chapterId] = {
            chapterId,
            exercises: {},
        };
    }
    return progress.chapters[chapterId];
}
/**
 * Get or create exercise progress
 */
export function getOrCreateExerciseProgress(chapter, exerciseId) {
    if (!chapter.exercises[exerciseId]) {
        chapter.exercises[exerciseId] = {
            exerciseId,
            answers: {},
            lastModified: Date.now(),
        };
    }
    return chapter.exercises[exerciseId];
}
/**
 * Set answer for a specific field in an exercise
 */
export function setAnswer(progress, chapterId, exerciseId, fieldId, answer) {
    const chapter = getOrCreateChapterProgress(progress, chapterId);
    const exercise = getOrCreateExerciseProgress(chapter, exerciseId);
    exercise.answers[fieldId] = answer;
    exercise.lastModified = Date.now();
    progress.lastModified = Date.now();
}
/**
 * Get answer for a specific field
 */
export function getAnswer(progress, chapterId, exerciseId, fieldId) {
    const chapter = progress.chapters[chapterId];
    if (!chapter)
        return undefined;
    const exercise = chapter.exercises[exerciseId];
    if (!exercise)
        return undefined;
    return exercise.answers[fieldId];
}
/**
 * Export progress as JSON string (for download)
 */
export function exportState(progress) {
    return JSON.stringify(progress, null, 2);
}
/**
 * Import progress from JSON string (from file upload)
 */
export function importState(json) {
    try {
        const parsed = JSON.parse(json);
        // Validate basic structure
        if (!parsed.version || !parsed.chapters) {
            console.error('Invalid progress format');
            return null;
        }
        if (parsed.version !== VERSION) {
            console.warn(`Importing progress with version ${parsed.version}, current is ${VERSION}`);
            // Could attempt migration here
        }
        return parsed;
    }
    catch (error) {
        console.error('Failed to parse progress JSON:', error);
        return null;
    }
}
/**
 * Clear all progress (destructive)
 */
export function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch (error) {
        console.error('Failed to clear state:', error);
    }
}
/**
 * Get statistics about completed work
 */
export function getProgressStats(progress) {
    let exercisesWithAnswers = 0;
    let totalExercises = 0;
    Object.values(progress.chapters).forEach(chapter => {
        Object.values(chapter.exercises).forEach(exercise => {
            totalExercises++;
            if (Object.keys(exercise.answers).length > 0) {
                exercisesWithAnswers++;
            }
        });
    });
    return {
        totalChapters: Object.keys(progress.chapters).length,
        totalExercises,
        exercisesWithAnswers,
    };
}
/**
 * Set LLM feedback for a field (caching)
 */
export function setLLMFeedback(progress, chapterId, exerciseId, fieldId, feedback) {
    const chapter = getOrCreateChapterProgress(progress, chapterId);
    const exercise = getOrCreateExerciseProgress(chapter, exerciseId);
    if (!exercise.llmFeedback) {
        exercise.llmFeedback = {};
    }
    exercise.llmFeedback[fieldId] = {
        ...feedback,
        cachedAt: Date.now(),
    };
    progress.lastModified = Date.now();
}
/**
 * Get cached LLM feedback for a field
 */
export function getLLMFeedback(progress, chapterId, exerciseId, fieldId) {
    const chapter = progress.chapters[chapterId];
    if (!chapter)
        return undefined;
    const exercise = chapter.exercises[exerciseId];
    if (!exercise || !exercise.llmFeedback)
        return undefined;
    return exercise.llmFeedback[fieldId];
}
//# sourceMappingURL=state.js.map