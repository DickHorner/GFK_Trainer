/**
 * Settings Module
 * Manages user preferences: LLM config, language, theme
 */

export interface LlmSettings {
  enabled: boolean;
  endpoint: string;
  model: string;
  timeout: number;
}

export interface AppSettings {
  llm: LlmSettings;
  language: 'de' | 'en';
  theme: 'dark' | 'light' | 'auto';
  version: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  llm: {
    enabled: false,
    endpoint: 'http://localhost:1234/v1/chat/completions',
    model: '',
    timeout: 30000,
  },
  language: 'de',
  theme: 'dark',
  version: 1,
};

const SETTINGS_KEY = 'gfk-trainer-settings';

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };

    const parsed = JSON.parse(stored) as AppSettings;
    
    // Version check
    if (parsed.version !== DEFAULT_SETTINGS.version) {
      console.warn('Settings version mismatch, using defaults');
      return { ...DEFAULT_SETTINGS };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * Reset settings to defaults
 */
export function resetSettings(): AppSettings {
  const defaults = { ...DEFAULT_SETTINGS };
  saveSettings(defaults);
  return defaults;
}

/**
 * Get LLM configuration
 */
export function getLlmConfig(settings: AppSettings): LlmSettings {
  return settings.llm;
}

/**
 * Update LLM configuration
 */
export function updateLlmConfig(
  settings: AppSettings,
  config: Partial<LlmSettings>
): AppSettings {
  const updated = {
    ...settings,
    llm: { ...settings.llm, ...config },
  };
  saveSettings(updated);
  return updated;
}

/**
 * Set theme
 */
export function setTheme(settings: AppSettings, theme: AppSettings['theme']): AppSettings {
  const updated = { ...settings, theme };
  saveSettings(updated);
  applyTheme(theme);
  return updated;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: AppSettings['theme']): void {
  const body = document.body;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }

  body.classList.remove('theme-dark', 'theme-light');
  body.classList.add(`theme-${theme}`);
}

/**
 * Set language
 */
export function setLanguage(settings: AppSettings, language: AppSettings['language']): AppSettings {
  const updated = { ...settings, language };
  saveSettings(updated);
  return updated;
}
