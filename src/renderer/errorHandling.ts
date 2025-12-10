/**
 * Error Handling Module
 * Comprehensive error handling, logging, and recovery for the GFK-Trainer
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Application error with context
 */
export interface AppError {
  severity: ErrorSeverity;
  code: string;
  message: string;
  context?: Record<string, any>;
  timestamp: number;
  stackTrace?: string;
}

/**
 * Error logging and reporting
 */
class ErrorHandler {
  private errors: AppError[] = [];
  private maxStoredErrors = 50;
  private errorCallbacks: Array<(error: AppError) => void> = [];

  /**
   * Log an error with context
   */
  logError(
    code: string,
    message: string,
    severity: ErrorSeverity = 'error',
    context?: Record<string, any>,
    stackTrace?: string
  ): AppError {
    const error: AppError = {
      code,
      message,
      severity,
      context,
      timestamp: Date.now(),
      stackTrace,
    };

    this.errors.push(error);

    // Keep only recent errors
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift();
    }

    // Log to console in development
    console.error(`[${severity.toUpperCase()}] ${code}: ${message}`, context);

    // Notify listeners
    this.errorCallbacks.forEach((cb) => cb(error));

    return error;
  }

  /**
   * Subscribe to error events
   */
  onError(callback: (error: AppError) => void): () => void {
    this.errorCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Get recent errors (for debugging/UI)
   */
  getRecentErrors(limit = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  /**
   * Clear error log
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Export errors as JSON (for debugging)
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Safe localStorage access with fallback
 */
export function safeLocalStorage(
  key: string,
  value?: string
): string | null {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, value);
      return value;
    }
    return localStorage.getItem(key);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errorHandler.logError(
      'STORAGE_ERROR',
      `Failed to access localStorage: ${msg}`,
      'warning',
      { key, value }
    );
    return null;
  }
}

/**
 * Safe JSON parsing with fallback
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T,
  context?: string
): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errorHandler.logError(
      'JSON_PARSE_ERROR',
      `Failed to parse JSON: ${msg}`,
      'warning',
      { context, jsonLength: json.length }
    );
    return fallback;
  }
}

/**
 * Safe fetch with timeout and error handling
 */
export async function safeFetch(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response | null> {
  const { timeout = 30000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      errorHandler.logError(
        'FETCH_HTTP_ERROR',
        `HTTP ${response.status}: ${response.statusText}`,
        'warning',
        { url, status: response.status }
      );
      return null;
    }

    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    const severity =
      msg.includes('timeout') || msg.includes('Aborted') ? 'warning' : 'error';

    errorHandler.logError(
      'FETCH_ERROR',
      `Fetch failed: ${msg}`,
      severity,
      { url }
    );
    return null;
  }
}

/**
 * Display user-friendly error notification
 */
export function showErrorNotification(
  error: AppError,
  container?: HTMLElement
): void {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.maxWidth = '400px';
  notification.style.padding = '15px';
  notification.style.borderRadius = '6px';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
  notification.style.animation = 'slideIn 0.3s ease';

  const bgColor =
    error.severity === 'critical'
      ? '#d32f2f'
      : error.severity === 'error'
        ? '#f44336'
        : error.severity === 'warning'
          ? '#ff9800'
          : '#2196f3';

  notification.style.background = bgColor;
  notification.style.color = '#fff';

  const title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '5px';
  title.textContent = error.code;

  const message = document.createElement('div');
  message.style.fontSize = '0.9rem';
  message.style.lineHeight = '1.4';
  message.textContent = error.message;

  notification.appendChild(title);
  notification.appendChild(message);

  const target = container || document.body;
  target.appendChild(notification);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      target.removeChild(notification);
    }, 300);
  }, 5000);
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  initialDelayMs = 1000
): Promise<T | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxAttempts) {
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  if (lastError) {
    errorHandler.logError(
      'RETRY_EXHAUSTED',
      `Operation failed after ${maxAttempts} attempts: ${lastError.message}`,
      'error',
      { maxAttempts, lastError: lastError.message }
    );
  }

  return null;
}

/**
 * Safe DOM element creation with error handling
 */
export function createDOMElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  styles?: Record<string, string>
): HTMLElementTagNameMap[K] {
  try {
    const element = document.createElement(tag);

    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }

    return element;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errorHandler.logError(
      'DOM_CREATE_ERROR',
      `Failed to create element <${tag}>: ${msg}`,
      'error'
    );
    throw error;
  }
}

/**
 * Graceful degradation for missing dependencies
 */
export function withFallback<T>(
  fn: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return fn();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errorHandler.logError(
      'FALLBACK_USED',
      `Using fallback due to: ${msg}`,
      'warning',
      { context }
    );
    return fallback;
  }
}

/**
 * Track unhandled promise rejections
 */
export function initializeGlobalErrorHandlers(): void {
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const message =
      error instanceof Error ? error.message : String(error);

    errorHandler.logError(
      'UNHANDLED_REJECTION',
      `Unhandled promise rejection: ${message}`,
      'critical',
      { error }
    );

    // Prevent default browser behavior
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    errorHandler.logError(
      'GLOBAL_ERROR',
      event.message,
      'critical',
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      event.error?.stack
    );
  });
}
