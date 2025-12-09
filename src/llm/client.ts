/**
 * LLM Client Module
 * Handles communication with local LLM via OpenAI-compatible API
 * Designed for services like LM Studio, Ollama, etc.
 */

import { ExerciseType, Exercise } from '../gfkContent';
import { LlmEvaluationResult, parseAndRepairJsonResponse } from './schema';

/**
 * LLM Client Configuration
 */
export interface LLMConfig {
  endpoint: string;  // e.g., "http://localhost:1234/v1/chat/completions"
  model: string;     // e.g., "local-model"
  timeout: number;   // milliseconds
  enabled: boolean;
}

/**
 * Default configuration (can be overridden)
 */
const DEFAULT_CONFIG: LLMConfig = {
  endpoint: 'http://localhost:1234/v1/chat/completions',
  model: 'local-model',
  timeout: 30000,  // 30 seconds
  enabled: false,
};

let config = { ...DEFAULT_CONFIG };

/**
 * Set LLM configuration
 */
export function setLLMConfig(newConfig: Partial<LLMConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Get current LLM configuration
 */
export function getLLMConfig(): LLMConfig {
  return { ...config };
}

/**
 * Check if LLM is available and responding
 */
export async function checkLLMAvailability(): Promise<boolean> {
  if (!config.enabled) {
    return false;
  }
  
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
      }),
      signal: AbortSignal.timeout(5000),
    });
    
    return response.ok;
  } catch (error) {
    console.warn('LLM availability check failed:', error);
    return false;
  }
}

/**
 * Construct the evaluation prompt for an exercise field
 */
function buildEvaluationPrompt(
  exercise: Exercise,
  fieldId: string,
  fieldContent: string,
  fieldType: ExerciseType
): string {
  const fieldTypeNames: Record<ExerciseType, string> = {
    textarea: 'Textfeld',
    matrix: 'Matrix-Feld',
    translate: 'Übersetzungsfeld',
    checklist: 'Checklistenpunkt',
    rating: 'Bewertungsfeld',
    timer: 'Timer-Übung',
  };
  
  return `Du bist ein Trainer für Gewaltfreie Kommunikation (GFK) nach Rosenberg/Seils.
  
Bewerte die folgende Antwort eines Nutzers auf eine Übung. Deine Aufgabe ist es, hilfreiches Feedback zu geben, ohne die Antwort für den Nutzer zu umschreiben.

**Übung:** ${exercise.title}
**Instruktion:** ${exercise.prompt}
**Feldtyp:** ${fieldTypeNames[fieldType]}
**Nutzereingabe:**
${fieldContent}

Antworte mit AUSSCHLIESSLICH einem gültigen JSON-Objekt (kein zusätzlicher Text):
{
  "exerciseId": "${exercise.id}",
  "fieldId": "${fieldId}",
  "present": true,
  "score": <0-3>,
  "confidence": <0-1>,
  "issues": [<array of strings describing problems>],
  "suggestions": [<array of strings with actionable suggestions>],
  "exampleRewrite": "<1-2 sentences as orientation, not as rewrite>",
  "explainers": [<array of strings highlighting strengths and growth areas>],
  "meta": {
    "fieldType": "${fieldType}",
    "pairIndex": 0
  }
}

Bewertungsskala (score):
- 0: Kein brauchbares GFK-Element
- 1: Mischform, viel Bewertung/Strategie
- 2: Überwiegend passend, GFK-Element erkennbar
- 3: Sehr klar und prägnant, nur Feinschliff nötig

Wichtig: exampleRewrite soll maximal 1-2 Sätze sein und nur Orientierung bieten, KEINE vollständige Neuschreibung.`;
}

/**
 * Evaluate a single field using the LLM
 */
export async function evaluateField(
  exercise: Exercise,
  fieldId: string,
  fieldContent: string,
  fieldType: ExerciseType
): Promise<LlmEvaluationResult | null> {
  if (!config.enabled) {
    console.warn('LLM evaluation requested but LLM is disabled');
    return null;
  }
  
  if (!fieldContent || fieldContent.trim().length === 0) {
    console.warn('Cannot evaluate empty field content');
    return null;
  }
  
  try {
    const prompt = buildEvaluationPrompt(exercise, fieldId, fieldContent, fieldType);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'Du antwortest AUSSCHLIESSLICH mit gültigem JSON, ohne zusätzliche Erklärungen oder Markdown-Code-Blöcke.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,  // Lower temperature for consistent JSON
        max_tokens: 1500,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`LLM API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json() as any;
    const content = data?.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('LLM returned empty response');
      return null;
    }
    
    // Parse and repair JSON
    const result = parseAndRepairJsonResponse(content);
    if (!result) {
      console.error('Failed to parse LLM response as JSON:', content.substring(0, 200));
      return null;
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`LLM evaluation timeout (>${config.timeout}ms)`);
    } else {
      console.error('LLM evaluation error:', error);
    }
    return null;
  }
}

/**
 * Load LLM config from a JSON file (for local setup)
 * This would typically be called during app initialization
 */
export function loadConfigFromFile(configJson: string): void {
  try {
    const parsed = JSON.parse(configJson);
    setLLMConfig(parsed);
  } catch (error) {
    console.error('Failed to parse LLM config:', error);
  }
}
