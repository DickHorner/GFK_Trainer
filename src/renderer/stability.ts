/**
 * Stability and Resilience Module
 * Handles LLM timeouts, fallbacks, and graceful degradation
 */

import { errorHandler } from './errorHandling.js';

/**
 * Circuit breaker pattern for LLM calls
 * Prevents cascading failures when LLM is unavailable
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(
    failureThreshold = 5,
    successThreshold = 2,
    resetTimeoutMs = 30000
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  /**
   * Check if call is allowed
   */
  canExecute(): boolean {
    if (this.state === 'closed') {
      return true;
    }

    if (this.state === 'open') {
      // Check if reset timeout has passed
      if (
        this.lastFailureTime &&
        Date.now() - this.lastFailureTime > this.resetTimeoutMs
      ) {
        this.state = 'half-open';
        this.successCount = 0;
        return true;
      }
      return false;
    }

    // half-open state
    return true;
  }

  /**
   * Record success
   */
  recordSuccess(): void {
    this.failureCount = 0;

    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'closed';
      }
    }
  }

  /**
   * Record failure
   */
  recordFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  /**
   * Get current state
   */
  getState(): string {
    return this.state;
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
  }
}

/**
 * Global LLM circuit breaker
 */
export const llmCircuitBreaker = new CircuitBreaker(5, 2, 30000);

/**
 * Timeout helper with promise race
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Safe LLM call with circuit breaker and timeout
 */
export async function safeLLMCall<T>(
  fn: () => Promise<T>,
  timeoutMs = 30000
): Promise<T | null> {
  // Check circuit breaker
  if (!llmCircuitBreaker.canExecute()) {
    errorHandler.logError(
      'CIRCUIT_BREAKER_OPEN',
      'LLM call blocked - circuit breaker is open',
      'warning'
    );
    return null;
  }

  try {
    const result = await withTimeout(fn(), timeoutMs);
    llmCircuitBreaker.recordSuccess();
    return result;
  } catch (error) {
    llmCircuitBreaker.recordFailure();

    const msg = error instanceof Error ? error.message : 'Unknown error';
    errorHandler.logError(
      'LLM_CALL_FAILED',
      `LLM call failed: ${msg}`,
      'warning',
      { circuitBreakerState: llmCircuitBreaker.getState() }
    );

    return null;
  }
}

/**
 * Caching layer for LLM responses
 */
export class LLMResponseCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly ttlMs: number;

  constructor(ttlMs = 3600000) {
    // 1 hour default
    this.ttlMs = ttlMs;
  }

  /**
   * Generate cache key from params
   */
  private getCacheKey(exerciseId: string, fieldId: string): string {
    return `${exerciseId}:${fieldId}`;
  }

  /**
   * Get cached result
   */
  get(exerciseId: string, fieldId: string): any | null {
    const key = this.getCacheKey(exerciseId, fieldId);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store result
   */
  set(exerciseId: string, fieldId: string, data: any): void {
    const key = this.getCacheKey(exerciseId, fieldId);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; ttlMs: number } {
    return { size: this.cache.size, ttlMs: this.ttlMs };
  }
}

export const llmResponseCache = new LLMResponseCache();

/**
 * Fallback for LLM feedback when unavailable
 */
export function getFallbackFeedback(
  exerciseId: string,
  fieldId: string,
  fieldContent: string
): any {
  return {
    exerciseId,
    fieldId,
    present: fieldContent.length > 0,
    score: 1, // Neutral middle score
    confidence: 0, // No confidence in AI feedback
    issues: [
      'LLM ist momentan nicht verfügbar. Deine Antwort wird gespeichert, aber kein automatisches Feedback ist möglich.',
    ],
    suggestions: [
      'Überprüfe, dass dein LLM-Server läuft (z. B. LM Studio, Ollama).',
      'Aktiviere LLM in den Einstellungen.',
      'Versuche es später erneut.',
    ],
    exampleRewrite: '',
    explainers: [
      'Deine Eingabe ist gespeichert. GFK-Feedback wird verfügbar, sobald dein LLM-Server antwortet.',
    ],
    meta: {
      fieldType: 'fallback',
      isOffline: true,
    },
  };
}

/**
 * Health check for LLM availability
 */
export async function checkLLMHealth(endpoint: string, timeoutMs = 5000): Promise<boolean> {
  try {
    const response = await withTimeout(
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'health-check',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
        }),
      }),
      timeoutMs
    );

    return response.ok;
  } catch (error) {
    errorHandler.logError(
      'LLM_HEALTH_CHECK_FAILED',
      `LLM health check failed at ${endpoint}`,
      'warning'
    );
    return false;
  }
}

/**
 * Performance monitor for LLM calls
 */
export class LLMPerformanceMonitor {
  private calls: Array<{ duration: number; success: boolean; timestamp: number }> = [];
  private readonly maxSamples = 100;

  /**
   * Record LLM call
   */
  record(durationMs: number, success: boolean): void {
    this.calls.push({ duration: durationMs, success, timestamp: Date.now() });

    if (this.calls.length > this.maxSamples) {
      this.calls.shift();
    }
  }

  /**
   * Get performance stats
   */
  getStats(): {
    avgDuration: number;
    successRate: number;
    totalCalls: number;
    slowestCall: number;
    fastestCall: number;
  } {
    if (this.calls.length === 0) {
      return {
        avgDuration: 0,
        successRate: 0,
        totalCalls: 0,
        slowestCall: 0,
        fastestCall: 0,
      };
    }

    const successful = this.calls.filter((c) => c.success).length;
    const durations = this.calls.map((c) => c.duration);

    return {
      avgDuration: durations.reduce((a, b) => a + b, 0) / this.calls.length,
      successRate: successful / this.calls.length,
      totalCalls: this.calls.length,
      slowestCall: Math.max(...durations),
      fastestCall: Math.min(...durations),
    };
  }

  /**
   * Clear history
   */
  clear(): void {
    this.calls = [];
  }
}

export const llmPerformanceMonitor = new LLMPerformanceMonitor();

/**
 * Graceful UI degradation when LLM is unavailable
 */
export function disableLLMUIElements(): void {
  const deepCheckButtons = document.querySelectorAll('button[data-action="deep-check"]');
  deepCheckButtons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    button.disabled = true;
    button.style.opacity = '0.5';
    button.title = 'LLM ist nicht verfügbar. Überprüfe deine Einstellungen.';
  });
}

/**
 * Re-enable LLM UI elements
 */
export function enableLLMUIElements(): void {
  const deepCheckButtons = document.querySelectorAll('button[data-action="deep-check"]');
  deepCheckButtons.forEach((btn) => {
    const button = btn as HTMLButtonElement;
    button.disabled = false;
    button.style.opacity = '1';
    button.title = 'GFK-Antwort analysieren (Deep-Check)';
  });
}
