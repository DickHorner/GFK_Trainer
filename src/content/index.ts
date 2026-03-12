// src/content/index.ts
// Zentrale Kursliste. Hier alle verfügbaren Kurse eintragen.

export type { Course, Chapter, Exercise, ExerciseType } from './types.js';
export { GFK_COURSE } from './gfkCourse.js';
export { SECOND_COURSE } from './secondCourse.js';

import { GFK_COURSE } from './gfkCourse.js';
import { SECOND_COURSE } from './secondCourse.js';
import type { Course } from './types.js';

/** Alle verfügbaren Kurse – Reihenfolge bestimmt die Anzeige. */
export const COURSES: Course[] = [GFK_COURSE, SECOND_COURSE];
