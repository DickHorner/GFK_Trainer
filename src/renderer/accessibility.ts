/**
 * Accessibility Helper Module
 * Provides utility functions for ARIA labels, keyboard navigation, and screen reader support
 */

/**
 * Add ARIA attributes to an element
 */
export function setAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute('aria-label', label);
}

/**
 * Add ARIA pressed state to toggle buttons
 */
export function setAriaPressed(element: HTMLElement, pressed: boolean): void {
  element.setAttribute('aria-pressed', String(pressed));
}

/**
 * Add keyboard navigation to a button (Enter and Space keys)
 */
export function addButtonKeyboardSupport(
  element: HTMLElement,
  callback: () => void
): void {
  element.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  });
}

/**
 * Add Escape key handler to close modals
 */
export function addEscapeKeyHandler(callback: () => void): () => void {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };
  
  document.addEventListener('keydown', handler);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handler);
  };
}

/**
 * Set focus trap for modal dialogs
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handler);
  
  // Set initial focus
  if (firstElement) {
    firstElement.focus();
  }
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handler);
  };
}

/**
 * Announce content to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcer = document.getElementById('aria-live-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

/**
 * Create hidden announcer element for screen readers
 */
function createAnnouncer(): HTMLElement {
  const announcer = document.createElement('div');
  announcer.id = 'aria-live-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  return announcer;
}
