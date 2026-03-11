/**
 * State Management Module Tests
 * Tests for user progress persistence and state mutations
 */

import * as stateModule from '../state/state.js';

/**
 * Test: Load empty state
 */
export function testLoadEmptyState(): boolean {
  // Clear localStorage first
  localStorage.removeItem('gfk-trainer-progress');
  
  const state = stateModule.loadState();
  return (
    state.version === 1 &&
    typeof state.createdAt === 'number' &&
    typeof state.lastModified === 'number' &&
    typeof state.chapters === 'object'
  );
}

/**
 * Test: Save and load state
 */
export function testSaveAndLoadState(): boolean {
  const state = stateModule.loadState();
  
  // Verify state has expected structure
  if (!state || typeof state.chapters !== 'object') {
    return false;
  }
  
  // Create and save an answer
  const textAnswer: stateModule.TextareaAnswer = {
    type: 'textarea',
    content: 'Test answer content',
  };
  
  // setAnswer returns void, modifies in-place
  stateModule.setAnswer(state, 'gfk-ch1', 'gfk-c1e1', 'main', textAnswer);
  stateModule.saveState(state);
  
  // Load and verify
  const loaded = stateModule.loadState();
  const retrieved = stateModule.getAnswer(loaded, 'gfk-ch1', 'gfk-c1e1', 'main');
  
  return (
    retrieved !== undefined &&
    retrieved.type === 'textarea' &&
    (retrieved as stateModule.TextareaAnswer).content === 'Test answer content'
  );
}

/**
 * Test: Save and load LLM feedback
 */
export function testSaveAndLoadFeedback(): boolean {
  const state = stateModule.loadState();
  
  const mockFeedback = {
    exerciseId: 'gfk-c1e1',
    fieldId: 'main',
    present: true,
    score: 2 as const,
    confidence: 0.85,
    issues: ['Too vague'],
    suggestions: ['Add specifics'],
    exampleRewrite: 'Example text.',
    explainers: ['Strength noted'],
  };
  
  // setLLMFeedback returns void, modifies in-place
  stateModule.setLLMFeedback(state, 'gfk-ch1', 'gfk-c1e1', 'main', mockFeedback);
  stateModule.saveState(state);
  
  const loaded = stateModule.loadState();
  const retrieved = stateModule.getLLMFeedback(loaded, 'gfk-ch1', 'gfk-c1e1', 'main');
  
  return (
    retrieved !== undefined &&
    retrieved.score === 2 &&
    Array.isArray(retrieved.issues)
  );
}

/**
 * Test: Export and import state
 */
export function testExportImportState(): boolean {
  const original = stateModule.loadState();
  
  // Add test data
  const textAnswer: stateModule.TextareaAnswer = {
    type: 'textarea',
    content: 'Test for export',
  };
  stateModule.setAnswer(original, 'ch2', 'c2e1', 'main', textAnswer);
  stateModule.saveState(original);
  
  // Export returns string
  const exported = stateModule.exportState(original);
  if (!exported || typeof exported !== 'string') {
    return false;
  }
  
  // Import returns UserProgress | null
  const imported = stateModule.importState(exported);
  if (!imported) {
    return false;
  }
  
  // Verify
  const retrievedAnswer = stateModule.getAnswer(imported, 'ch2', 'c2e1', 'main');
  return (
    retrievedAnswer !== undefined &&
    retrievedAnswer.type === 'textarea' &&
    (retrievedAnswer as stateModule.TextareaAnswer).content === 'Test for export'
  );
}

/**
 * Test: Progress statistics
 */
export function testProgressStats(): boolean {
  const state = stateModule.loadState();
  
  // Add multiple answers
  const answer1: stateModule.TextareaAnswer = {
    type: 'textarea',
    content: 'Content 1',
  };
  const answer2: stateModule.MatrixAnswer = {
    type: 'matrix',
    data: [['a', 'b']],
  };
  
  stateModule.setAnswer(state, 'gfk-ch1', 'gfk-c1e1', 'main', answer1);
  stateModule.setAnswer(state, 'gfk-ch1', 'gfk-c1e2', 'main', answer2);
  stateModule.saveState(state);
  
  const stats = stateModule.getProgressStats(state);
  
  return (
    stats.totalChapters >= 0 &&
    stats.totalExercises >= 2 &&
    stats.exercisesWithAnswers >= 2
  );
}

/**
 * Run all state tests
 */
export function runStateTests(): {
  passed: number;
  failed: number;
  results: string[];
} {
  const tests = [
    { name: 'Load Empty State', fn: testLoadEmptyState },
    { name: 'Save and Load State', fn: testSaveAndLoadState },
    { name: 'Save and Load Feedback', fn: testSaveAndLoadFeedback },
    { name: 'Export/Import State', fn: testExportImportState },
    { name: 'Progress Statistics', fn: testProgressStats },
  ];

  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  tests.forEach((test) => {
    try {
      const success = test.fn();
      if (success) {
        results.push(`✅ ${test.name}`);
        passed++;
      } else {
        results.push(`❌ ${test.name} - Assertion failed`);
        failed++;
      }
    } catch (error) {
      results.push(
        `❌ ${test.name} - ${error instanceof Error ? error.message : String(error)}`
      );
      failed++;
    }
  });

  return { passed, failed, results };
}
