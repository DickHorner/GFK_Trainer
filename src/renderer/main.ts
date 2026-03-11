import { initializeUI } from './ui.js';

// Renderer entry point – Initialize the Kurs-Trainer UI
console.log('Kurs-Trainer renderer loaded');

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    initializeUI(root);
  }
});
