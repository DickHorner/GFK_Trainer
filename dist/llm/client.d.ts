/**
 * LLM Client Module
 * Handles communication with local LLM via OpenAI-compatible API
 * Designed for services like LM Studio, Ollama, etc.
 */
import { ExerciseType, Exercise } from '../gfkContent';
import { LlmEvaluationResult } from './schema';
/**
 * LLM Client Configuration
 */
export interface LLMConfig {
    endpoint: string;
    model: string;
    timeout: number;
    enabled: boolean;
}
/**
 * Set LLM configuration
 */
export declare function setLLMConfig(newConfig: Partial<LLMConfig>): void;
/**
 * Get current LLM configuration
 */
export declare function getLLMConfig(): LLMConfig;
/**
 * Check if LLM is available and responding
 */
export declare function checkLLMAvailability(): Promise<boolean>;
/**
 * Evaluate a single field using the LLM
 */
export declare function evaluateField(exercise: Exercise, fieldId: string, fieldContent: string, fieldType: ExerciseType): Promise<LlmEvaluationResult | null>;
/**
 * Load LLM config from a JSON file (for local setup)
 * This would typically be called during app initialization
 */
export declare function loadConfigFromFile(configJson: string): void;
//# sourceMappingURL=client.d.ts.map