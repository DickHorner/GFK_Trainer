/**
 * Import/Export UI Module
 * Handles UI for importing and exporting user data
 */

import * as importExportModule from './importExport.js';
import * as stateModule from '../state/state.js';
import * as settingsModule from '../settings/settings.js';

/**
 * Create import/export button container
 */
export function createImportExportButtons(
  userProgress: stateModule.UserProgress,
  appSettings: settingsModule.AppSettings,
  onImport: (progress: stateModule.UserProgress, settings: settingsModule.AppSettings) => void
): HTMLElement {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '10px';
  container.style.marginTop = '20px';

  // Export all button
  const exportAllBtn = document.createElement('button');
  exportAllBtn.textContent = '💾 Alles exportieren';
  exportAllBtn.setAttribute('aria-label', 'Alle Daten exportieren (Fortschritt und Einstellungen)');
  exportAllBtn.className = 'btn btn-secondary';
  exportAllBtn.addEventListener('click', () => {
    importExportModule.exportData(userProgress, appSettings);
    showNotification('✅ Daten exportiert');
  });

  // Export progress only button
  const exportProgressBtn = document.createElement('button');
  exportProgressBtn.textContent = '📊 Fortschritt exportieren';
  exportProgressBtn.setAttribute('aria-label', 'Nur Fortschritt exportieren');
  exportProgressBtn.className = 'btn btn-secondary';
  exportProgressBtn.addEventListener('click', () => {
    importExportModule.exportProgress(userProgress);
    showNotification('✅ Fortschritt exportiert');
  });

  // Import button
  const importBtn = document.createElement('button');
  importBtn.textContent = '📂 Importieren';
  importBtn.setAttribute('aria-label', 'Daten aus Datei importieren');
  importBtn.className = 'btn btn-primary';

  const fileInput = importExportModule.createFileInput(async (file) => {
    try {
      const data = await importExportModule.importData(file);
      
      // Update progress and settings
      stateModule.saveState(data.progress);
      settingsModule.saveSettings(data.settings);
      
      onImport(data.progress, data.settings);
      showNotification('✅ Daten importiert erfolgreich');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unbekannter Fehler';
      showNotification(`❌ Import fehlgeschlagen: ${errorMsg}`, 'error');
    }
  });

  importBtn.addEventListener('click', () => {
    fileInput.click();
  });

  container.appendChild(importBtn);
  container.appendChild(exportAllBtn);
  container.appendChild(exportProgressBtn);
  container.appendChild(fileInput);

  return container;
}

/**
 * Show notification message
 */
function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '16px 24px';
  notification.style.borderRadius = '8px';
  notification.style.fontSize = '0.95rem';
  notification.style.fontWeight = '500';
  notification.style.zIndex = '10000';
  notification.style.animation = 'slideIn 0.3s ease';
  
  if (type === 'success') {
    notification.style.background = '#4caf50';
    notification.style.color = 'white';
  } else {
    notification.style.background = '#f44336';
    notification.style.color = 'white';
  }

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
