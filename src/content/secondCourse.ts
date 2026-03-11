// src/content/secondCourse.ts
// Platzhalter für einen zweiten Kurs.
// Dient als technischer Nachweis der Mehrkursfähigkeit.
// Inhalte sind neutral gehalten; kein fachlicher Anspruch.

import { Course } from './types.js';

export const SECOND_COURSE: Course = {
  id: 'course2',
  title: 'Begleitkurs (Platzhalter)',
  description: 'Zweiter Kurs als Begleittrainer: Kapitelübersicht, Übungen und Reflexion. Audioinhalte werden in v1 nur als Hinweis referenziert.',
  isGfkBased: false,
  chapters: [
    {
      id: 'course2-ch1',
      title: 'Kapitel 1: Einführung',
      exercises: [
        {
          id: 'course2-c1e1',
          title: 'Erste Reflexion',
          prompt: 'Notiere in 2–3 Sätzen, was du von diesem Kapitel mitnimmst.',
          type: 'textarea',
        },
        {
          id: 'course2-c1e2',
          title: 'Selbsteinschätzung',
          prompt: 'Wie vertraut bist du mit dem Thema dieses Kapitels? (0 = gar nicht, 10 = sehr gut)',
          type: 'rating',
        },
      ],
    },
    {
      id: 'course2-ch2',
      title: 'Kapitel 2: Kernkonzepte',
      exercises: [
        {
          id: 'course2-c2e1',
          title: 'Transferübung',
          prompt: 'Beschreibe ein Beispiel aus deinem Alltag, das zu einem Kernkonzept dieses Kapitels passt.',
          type: 'textarea',
        },
        {
          id: 'course2-c2e2',
          title: 'Begriffe zuordnen',
          prompt: 'Ordne die folgenden Begriffe den passenden Kategorien zu.',
          type: 'matrix',
          rows: ['Begriff A', 'Begriff B', 'Begriff C'],
          cols: ['Kategorie 1', 'Kategorie 2'],
        },
        {
          id: 'course2-c2e3',
          title: 'Checkliste Verständnis',
          prompt: 'Markiere, was du nach diesem Kapitel für dich bestätigen kannst.',
          type: 'checklist',
          items: [
            'Ich kann das Hauptkonzept in eigenen Worten erklären.',
            'Ich habe ein konkretes Beispiel aus meinem Leben gefunden.',
            'Ich habe offene Fragen notiert.',
          ],
        },
      ],
    },
    {
      id: 'course2-ch3',
      title: 'Kapitel 3: Vertiefung und Transfer',
      exercises: [
        {
          id: 'course2-c3e1',
          title: 'Reflexion',
          prompt: 'Was hat sich nach diesem Kapitel in deiner Wahrnehmung verändert?',
          type: 'textarea',
        },
        {
          id: 'course2-c3e2',
          title: 'Abschluss-Timer',
          prompt: 'Nimm dir 3 Minuten Zeit für eine stille Reflexion des Gelernten.',
          type: 'timer',
          durationSec: 180,
        },
      ],
    },
  ],
};
