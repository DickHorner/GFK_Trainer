import { initializeUI } from './ui.js';

// Renderer entry point – Initialize the GFK-Trainer UI
console.log('GFK-Trainer renderer loaded');

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    initializeUI(root);
  }
});
