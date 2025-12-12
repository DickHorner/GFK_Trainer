/**
 * Settings Module Tests
 * Tests for settings persistence and configuration
 */

import * as settingsModule from '../settings/settings.js';

/**
 * Test: Load default settings
 */
export function testLoadDefaultSettings(): boolean {
  const settings = settingsModule.loadSettings();
  return (
    settings.version === 1 &&
    settings.theme === 'dark' &&
    settings.language === 'de' &&
    settings.llm.enabled === false
  );
}

/**
 * Test: Save and load settings
 */
export function testSaveAndLoadSettings(): boolean {
  const settings = settingsModule.loadSettings();
  const updated = {
    ...settings,
    theme: 'light' as const,
    language: 'en' as const,
  };

  settingsModule.saveSettings(updated);
  const loaded = settingsModule.loadSettings();

  return loaded.theme === 'light' && loaded.language === 'en';
}

/**
 * Test: Update LLM config
 */
export function testUpdateLLMConfig(): boolean {
  const settings = settingsModule.loadSettings();
  const newEndpoint = 'http://localhost:8000/v1/chat/completions';

  const updated = settingsModule.updateLlmConfig(settings, {
    endpoint: newEndpoint,
    enabled: true,
  });

  return (
    updated.llm.endpoint === newEndpoint &&
    updated.llm.enabled === true
  );
}

/**
 * Test: Reset settings
 */
export function testResetSettings(): boolean {
  const settings = settingsModule.loadSettings();
  const modified = {
    ...settings,
    theme: 'light' as const,
  };
  settingsModule.saveSettings(modified);

  const reset = settingsModule.resetSettings();
  return reset.theme === 'dark';
}

/**
 * Run all settings tests
 */
export function runSettingsTests(): {
  passed: number;
  failed: number;
  results: string[];
} {
  const tests = [
    { name: 'Load Default Settings', fn: testLoadDefaultSettings },
    { name: 'Save and Load Settings', fn: testSaveAndLoadSettings },
    { name: 'Update LLM Config', fn: testUpdateLLMConfig },
    { name: 'Reset Settings', fn: testResetSettings },
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
