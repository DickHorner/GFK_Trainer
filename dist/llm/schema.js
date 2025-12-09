/**
 * LLM Response Schema and Parsing
 * Defines the expected JSON structure for LLM evaluation results
 */
/**
 * Attempt to repair and parse a potentially malformed JSON response from LLM
 * Handles common issues like missing quotes, trailing commas, etc.
 */
export function parseAndRepairJsonResponse(raw) {
    const trimmed = raw.trim();
    // Try direct parse first
    try {
        return JSON.parse(trimmed);
    }
    catch (_e) {
        // Continue to repair attempts
    }
    // Try to extract JSON from markdown code blocks
    const jsonMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[1]);
        }
        catch (_e) {
            // Continue to manual repair
        }
    }
    // Manual repair attempts
    let repaired = trimmed;
    // Remove markdown backticks if present (but not in code blocks)
    repaired = repaired.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
    // Remove leading/trailing non-JSON characters
    repaired = repaired.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    // Try to fix trailing commas (very common)
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');
    // Try to fix missing quotes around keys (limited attempt)
    repaired = repaired.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
    // Try to fix unquoted string values in simple cases
    // This is risky, so we do it carefully
    repaired = repaired.replace(/:\s*(?![\"{[0-9tfn])[^,}\]]+(?=[,}\]])/g, (match) => {
        // Only quote if it looks like a string value
        const value = match.split(':')[1].trim();
        if (!value.startsWith('"') && !value.startsWith('{')) {
            return match.replace(/:\s*/, ': "').replace(/\s*$/, '"');
        }
        return match;
    });
    try {
        const parsed = JSON.parse(repaired);
        console.log('JSON repair successful');
        return parsed;
    }
    catch (_e) {
        // Give up
    }
    console.error('Failed to parse JSON after repair attempts');
    return null;
}
/**
 * Validate that a parsed result has required fields
 */
export function validateEvaluationResult(result) {
    return (typeof result === 'object' &&
        result !== null &&
        typeof result.exerciseId === 'string' &&
        typeof result.fieldId === 'string' &&
        typeof result.present === 'boolean' &&
        [0, 1, 2, 3].includes(result.score) &&
        typeof result.confidence === 'number' &&
        Array.isArray(result.issues) &&
        Array.isArray(result.suggestions) &&
        typeof result.exampleRewrite === 'string' &&
        Array.isArray(result.explainers));
}
/**
 * Sanitize evaluation result to ensure safety
 * (e.g., limit string lengths, validate structure)
 */
export function sanitizeEvaluationResult(result) {
    const MAX_STRING_LENGTH = 500;
    const MAX_ARRAY_LENGTH = 10;
    return {
        exerciseId: result.exerciseId.substring(0, 100),
        fieldId: result.fieldId.substring(0, 100),
        present: Boolean(result.present),
        score: [0, 1, 2, 3].includes(result.score) ? result.score : 1,
        confidence: Math.max(0, Math.min(1, result.confidence || 0)),
        issues: (result.issues || [])
            .slice(0, MAX_ARRAY_LENGTH)
            .map(s => String(s).substring(0, MAX_STRING_LENGTH)),
        suggestions: (result.suggestions || [])
            .slice(0, MAX_ARRAY_LENGTH)
            .map(s => String(s).substring(0, MAX_STRING_LENGTH)),
        exampleRewrite: String(result.exampleRewrite || '').substring(0, MAX_STRING_LENGTH),
        explainers: (result.explainers || [])
            .slice(0, MAX_ARRAY_LENGTH)
            .map(s => String(s).substring(0, MAX_STRING_LENGTH)),
        meta: result.meta ? {
            fieldType: result.meta.fieldType?.substring(0, 50),
            pairIndex: typeof result.meta.pairIndex === 'number' ? result.meta.pairIndex : 0,
        } : undefined,
    };
}
//# sourceMappingURL=schema.js.map