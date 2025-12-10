/**
 * Import/Export Module
 * Handles exporting and importing user progress and settings
 */

import { UserProgress } from '../state/state.js';
import { AppSettings } from '../settings/settings.js';

export interface ExportData {
  version: number;
  timestamp: string;
  progress: UserProgress;
  settings: AppSettings;
}

/**
 * Export user progress and settings as JSON file
 */
export function exportData(progress: UserProgress, settings: AppSettings): void {
  const exportData: ExportData = {
    version: 1,
    timestamp: new Date().toISOString(),
    progress,
    settings,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `gfk-trainer-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import user progress and settings from JSON file
 */
export async function importData(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;

        // Validate version
        if (data.version !== 1) {
          reject(new Error(`Unsupported export version: ${data.version}`));
          return;
        }

        // Validate required fields
        if (!data.progress || !data.settings || !data.timestamp) {
          reject(new Error('Invalid export file format'));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(
          new Error(
            `Failed to parse import file: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read import file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Export only progress (without settings)
 */
export function exportProgress(progress: UserProgress): void {
  const jsonString = JSON.stringify(progress, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `gfk-progress-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export only settings (without progress)
 */
export function exportSettings(settings: AppSettings): void {
  const jsonString = JSON.stringify(settings, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `gfk-settings-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create file input element for importing
 */
export function createFileInput(onSelect: (file: File) => void): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.style.display = 'none';

  input.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      onSelect(file);
    }
  });

  return input;
}
