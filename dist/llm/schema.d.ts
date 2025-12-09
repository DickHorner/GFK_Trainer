/**
 * LLM Response Schema and Parsing
 * Defines the expected JSON structure for LLM evaluation results
 */
/**
 * LLM evaluation result for a single field
 * This matches the format specified in .copilot-instructions.md
 */
export interface LlmEvaluationResult {
    exerciseId: string;
    fieldId: string;
    present: boolean;
    score: 0 | 1 | 2 | 3;
    confidence: number;
    issues: string[];
    suggestions: string[];
    exampleRewrite: string;
    explainers: string[];
    meta?: {
        fieldType?: string;
        pairIndex?: number;
    };
}
/**
 * Attempt to repair and parse a potentially malformed JSON response from LLM
 * Handles common issues like missing quotes, trailing commas, etc.
 */
export declare function parseAndRepairJsonResponse(raw: string): LlmEvaluationResult | null;
/**
 * Validate that a parsed result has required fields
 */
export declare function validateEvaluationResult(result: any): result is LlmEvaluationResult;
/**
 * Sanitize evaluation result to ensure safety
 * (e.g., limit string lengths, validate structure)
 */
export declare function sanitizeEvaluationResult(result: LlmEvaluationResult): LlmEvaluationResult;
//# sourceMappingURL=schema.d.ts.map