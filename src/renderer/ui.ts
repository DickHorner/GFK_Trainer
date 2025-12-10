import { GFK_CHAPTERS, Chapter, Exercise, ExerciseType } from '../gfkContent.js';
import * as stateModule from '../state/state.js';
import * as llmModule from '../llm/client.js';
import * as settingsModule from '../settings/settings.js';

/**
 * UI Rendering Module for GFK-Trainer
 * Handles display of chapters, exercises, input fields, and LLM feedback
 */

export interface UIState {
  selectedChapterId: string | null;
  selectedExerciseId: string | null;
}

interface FieldElement {
  exerciseId: string;
  fieldId: string;
  element: HTMLElement;
  type: ExerciseType;
}

let uiState: UIState = {
  selectedChapterId: null,
  selectedExerciseId: null,
};

let userProgress: stateModule.UserProgress;
let appSettings: settingsModule.AppSettings;
let fieldElements: Map<string, FieldElement> = new Map();

/**
 * Initialize the UI with chapters list and main content area
 */
export function initializeUI(container: HTMLElement): void {
  container.innerHTML = '';
  
  // Load user progress and settings
  userProgress = stateModule.loadState();
  appSettings = settingsModule.loadSettings();
  
  // Apply theme
  settingsModule.applyTheme(appSettings.theme);
  
  // Configure LLM client
  if (appSettings.llm.enabled) {
    llmClient.setLLMConfig({
      endpoint: appSettings.llm.endpoint,
      model: appSettings.llm.model,
      timeout: appSettings.llm.timeout,
      enabled: appSettings.llm.enabled
    });
  }
  
  // Create layout: sidebar + main content
  const layout = document.createElement('div');
  layout.style.display = 'grid';
  layout.style.gridTemplateColumns = '250px 1fr';
  layout.style.gap = '20px';
  layout.style.height = '100vh';
  
  const sidebar = document.createElement('aside');
  sidebar.style.overflowY = 'auto';
  sidebar.style.borderRight = '1px solid #444';
  sidebar.style.padding = '10px';
  sidebar.style.position = 'relative';
  
  const mainContent = document.createElement('main');
  mainContent.style.overflowY = 'auto';
  mainContent.style.padding = '20px';
  
  layout.appendChild(sidebar);
  layout.appendChild(mainContent);
  container.appendChild(layout);
  
  // Add settings button to sidebar header
  renderSidebarHeader(sidebar, mainContent);
  
  // Select first chapter by default
  if (GFK_CHAPTERS.length > 0) {
    selectChapter(GFK_CHAPTERS[0].id, mainContent);
  }
}

/**
 * Render sidebar header with settings button
 */
function renderSidebarHeader(sidebar: HTMLElement, mainContent: HTMLElement): void {
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';
  
  const title = document.createElement('h2');
  title.textContent = 'GFK-Trainer';
  title.style.fontSize = '1.3rem';
  title.style.color = '#64b5f6';
  title.style.margin = '0';
  
  const settingsBtn = document.createElement('button');
  settingsBtn.innerHTML = '⚙️';
  settingsBtn.title = 'Einstellungen';
  settingsBtn.style.border = 'none';
  settingsBtn.style.background = '#333';
  settingsBtn.style.color = '#e0e0e0';
  settingsBtn.style.fontSize = '1.2rem';
  settingsBtn.style.padding = '8px 12px';
  settingsBtn.style.borderRadius = '4px';
  settingsBtn.style.cursor = 'pointer';
  settingsBtn.style.transition = 'background 0.2s ease';
  
  settingsBtn.addEventListener('mouseenter', () => {
    settingsBtn.style.background = '#444';
  });
  
  settingsBtn.addEventListener('mouseleave', () => {
    settingsBtn.style.background = '#333';
  });
  
  settingsBtn.addEventListener('click', () => {
    openSettingsModal();
  });
  
  header.appendChild(title);
  header.appendChild(settingsBtn);
  sidebar.appendChild(header);
  
  // Render chapters
  renderChapterList(sidebar, mainContent);
}

/**
 * Render the chapter list in the sidebar
 */
function renderChapterList(container: HTMLElement, mainContent: HTMLElement): void {
  // Remove existing chapter list if present
  const existingList = container.querySelector('ul');
  if (existingList) {
    existingList.remove();
  }
  
  const heading = document.createElement('h3');
  heading.textContent = 'Kapitel';
  heading.style.fontSize = '1rem';
  heading.style.marginBottom = '15px';
  heading.style.color = '#aaa';
  heading.style.marginTop = '0';
  container.appendChild(heading);
  
  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.margin = '0';
  
  GFK_CHAPTERS.forEach(chapter => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    
    button.textContent = chapter.title;
    button.style.width = '100%';
    button.style.padding = '10px';
    button.style.marginBottom = '5px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.background = uiState.selectedChapterId === chapter.id ? '#64b5f6' : '#333';
    button.style.color = uiState.selectedChapterId === chapter.id ? '#1e1e1e' : '#e0e0e0';
    button.style.cursor = 'pointer';
    button.style.textAlign = 'left';
    button.style.fontSize = '0.9rem';
    button.style.transition = 'all 0.2s ease';
    
    button.addEventListener('mouseenter', () => {
      if (uiState.selectedChapterId !== chapter.id) {
        button.style.background = '#444';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (uiState.selectedChapterId !== chapter.id) {
        button.style.background = '#333';
      }
    });
    
    button.addEventListener('click', () => {
      selectChapter(chapter.id, mainContent);
      renderChapterList(container, mainContent); // Re-render to update highlight
    });
    
    listItem.appendChild(button);
    list.appendChild(listItem);
  });
  
  container.appendChild(list);
}

/**
 * Select a chapter and render its exercises
 */
function selectChapter(chapterId: string, mainContent: HTMLElement): void {
  const chapter = GFK_CHAPTERS.find(ch => ch.id === chapterId);
  if (!chapter) return;
  
  uiState.selectedChapterId = chapterId;
  uiState.selectedExerciseId = null;
  
  mainContent.innerHTML = '';
  
  // Chapter header
  const header = document.createElement('h1');
  header.textContent = chapter.title;
  header.style.marginBottom = '30px';
  header.style.color = '#64b5f6';
  mainContent.appendChild(header);
  
  // Exercise cards
  const exercisesContainer = document.createElement('div');
  exercisesContainer.style.display = 'grid';
  exercisesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  exercisesContainer.style.gap = '20px';
  
  chapter.exercises.forEach(exercise => {
    const card = createExerciseCard(exercise);
    exercisesContainer.appendChild(card);
  });
  
  mainContent.appendChild(exercisesContainer);
}

/**
 * Create an exercise card with expandable content
 */
function createExerciseCard(exercise: Exercise): HTMLElement {
  const card = document.createElement('div');
  card.style.border = '1px solid #444';
  card.style.borderRadius = '6px';
  card.style.padding = '15px';
  card.style.background = '#2a2a2a';
  card.style.cursor = 'pointer';
  card.style.transition = 'all 0.2s ease';
  card.style.minHeight = '200px';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = '#64b5f6';
    card.style.background = '#333';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '#444';
    card.style.background = '#2a2a2a';
  });
  
  // Title
  const title = document.createElement('h3');
  title.textContent = exercise.title;
  title.style.margin = '0 0 10px 0';
  title.style.color = '#64b5f6';
  title.style.fontSize = '1.1rem';
  card.appendChild(title);
  
  // Prompt
  const prompt = document.createElement('p');
  prompt.textContent = exercise.prompt;
  prompt.style.fontSize = '0.9rem';
  prompt.style.color = '#bbb';
  prompt.style.margin = '0 0 15px 0';
  prompt.style.lineHeight = '1.5';
  card.appendChild(prompt);
  
  // Exercise type badge
  const badge = document.createElement('span');
  badge.textContent = getExerciseTypeName(exercise.type);
  badge.style.display = 'inline-block';
  badge.style.padding = '4px 8px';
  badge.style.borderRadius = '3px';
  badge.style.background = '#444';
  badge.style.color = '#aaa';
  badge.style.fontSize = '0.8rem';
  badge.style.marginTop = 'auto';
  card.appendChild(badge);
  
  card.addEventListener('click', () => {
    expandExercise(exercise);
  });
  
  return card;
}

/**
 * Get display name for exercise type
 */
function getExerciseTypeName(type: ExerciseType): string {
  const names: Record<ExerciseType, string> = {
    textarea: 'Text-Eingabe',
    matrix: 'Matrix',
    translate: 'Übersetzung',
    checklist: 'Checkliste',
    rating: 'Bewertung',
    timer: 'Timer',
  };
  return names[type] || type;
}

/**
 * Expand and show full exercise editor
 */
function expandExercise(exercise: Exercise): void {
  uiState.selectedExerciseId = exercise.id;
  
  // Create modal/overlay
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';
  
  const dialogBox = document.createElement('div');
  dialogBox.style.background = '#1e1e1e';
  dialogBox.style.border = '1px solid #64b5f6';
  dialogBox.style.borderRadius = '8px';
  dialogBox.style.padding = '30px';
  dialogBox.style.maxWidth = '600px';
  dialogBox.style.maxHeight = '80vh';
  dialogBox.style.overflowY = 'auto';
  dialogBox.style.minWidth = '500px';
  
  // Title
  const title = document.createElement('h2');
  title.textContent = exercise.title;
  title.style.marginBottom = '10px';
  title.style.color = '#64b5f6';
  dialogBox.appendChild(title);
  
  // Prompt
  const prompt = document.createElement('p');
  prompt.textContent = exercise.prompt;
  prompt.style.color = '#bbb';
  prompt.style.marginBottom = '20px';
  prompt.style.lineHeight = '1.6';
  dialogBox.appendChild(prompt);
  
  // Input fields based on exercise type
  renderExerciseFields(exercise, dialogBox);
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Schließen';
  closeBtn.style.marginTop = '20px';
  closeBtn.style.padding = '10px 20px';
  closeBtn.style.background = '#444';
  closeBtn.style.color = '#e0e0e0';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '4px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  dialogBox.appendChild(closeBtn);
  
  modal.appendChild(dialogBox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  document.body.appendChild(modal);
}

/**
 * Render input fields for different exercise types
 */
function renderExerciseFields(exercise: Exercise, container: HTMLElement): void {
  const fieldsContainer = document.createElement('div');
  fieldsContainer.style.marginBottom = '20px';
  
  switch (exercise.type) {
    case 'textarea':
      renderTextareaField(exercise.id, fieldsContainer, exercise);
      break;
    case 'matrix':
      renderMatrixField(exercise, fieldsContainer);
      break;
    case 'translate':
      renderTranslateField(exercise, fieldsContainer);
      break;
    case 'checklist':
      renderChecklistField(exercise, fieldsContainer);
      break;
    case 'rating':
      renderRatingField(exercise.id, fieldsContainer, exercise);
      break;
    case 'timer':
      renderTimerField(exercise, fieldsContainer);
      break;
  }
  
  container.appendChild(fieldsContainer);
}

function renderTextareaField(exerciseId: string, container: HTMLElement, exercise?: Exercise): void {
  const textarea = document.createElement('textarea');
  textarea.id = `exercise-${exerciseId}`;
  textarea.style.width = '100%';
  textarea.style.height = '150px';
  textarea.style.padding = '10px';
  textarea.style.borderRadius = '4px';
  textarea.style.border = '1px solid #444';
  textarea.style.background = '#2a2a2a';
  textarea.style.color = '#e0e0e0';
  textarea.style.fontFamily = 'inherit';
  textarea.style.fontSize = '0.9rem';
  textarea.placeholder = 'Hier tippen...';
  
  // Restore saved value if exists
  if (exercise) {
    const answer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
    if (answer && answer.type === 'textarea') {
      textarea.value = answer.content;
    }
    
    // Save on input
    textarea.addEventListener('input', () => {
      const textAnswer: stateModule.TextareaAnswer = {
        type: 'textarea',
        content: textarea.value
      };
      stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', textAnswer);
      stateModule.saveState(userProgress);
    });
    
    // Add Deep-Check button for LLM feedback
    const feedbackBtn = document.createElement('button');
    feedbackBtn.textContent = '🔍 Deep-Check';
    feedbackBtn.style.marginTop = '10px';
    feedbackBtn.style.padding = '8px 15px';
    feedbackBtn.style.background = '#444';
    feedbackBtn.style.color = '#e0e0e0';
    feedbackBtn.style.border = '1px solid #64b5f6';
    feedbackBtn.style.borderRadius = '4px';
    feedbackBtn.style.cursor = 'pointer';
    feedbackBtn.style.fontSize = '0.9rem';
    
    feedbackBtn.addEventListener('click', () => {
      showLLMFeedback(exercise, 'main', textarea.value);
    });
    
    container.appendChild(feedbackBtn);
  }
  
  container.appendChild(textarea);
}

function renderMatrixField(exercise: any, container: HTMLElement): void {
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '10px';
  
  // Get saved matrix data if exists
  const savedAnswer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
  const savedData = savedAnswer && savedAnswer.type === 'matrix' ? savedAnswer.data : null;
  
  const inputs: HTMLInputElement[][] = [];
  
  // Header row
  const headerRow = table.insertRow();
  const headerCell = document.createElement('th');
  headerCell.style.padding = '8px';
  headerCell.style.border = '1px solid #444';
  headerCell.style.textAlign = 'left';
  headerRow.appendChild(headerCell);
  
  exercise.cols.forEach((col: string) => {
    const th = document.createElement('th');
    th.textContent = col;
    th.style.padding = '8px';
    th.style.border = '1px solid #444';
    th.style.textAlign = 'left';
    th.style.color = '#64b5f6';
    headerRow.appendChild(th);
  });
  
  // Data rows
  exercise.rows.forEach((row: string, rowIndex: number) => {
    const tr = table.insertRow();
    inputs[rowIndex] = [];
    
    const rowLabel = tr.insertCell();
    rowLabel.textContent = row;
    rowLabel.style.padding = '8px';
    rowLabel.style.border = '1px solid #444';
    rowLabel.style.fontWeight = 'bold';
    rowLabel.style.color = '#64b5f6';
    
    exercise.cols.forEach((_col: string, colIndex: number) => {
      const td = tr.insertCell();
      const input = document.createElement('input');
      input.type = 'text';
      input.style.width = '100%';
      input.style.padding = '6px';
      input.style.border = 'none';
      input.style.background = '#2a2a2a';
      input.style.color = '#e0e0e0';
      
      // Restore saved value
      if (savedData && savedData[rowIndex] && savedData[rowIndex][colIndex]) {
        input.value = savedData[rowIndex][colIndex];
      }
      
      // Save on input
      input.addEventListener('input', () => {
        const matrixData: string[][] = [];
        inputs.forEach((inputRow) => {
          matrixData.push(inputRow.map((inp) => inp.value));
        });
        const matrixAnswer: stateModule.MatrixAnswer = {
          type: 'matrix',
          data: matrixData
        };
        stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', matrixAnswer);
        stateModule.saveState(userProgress);
      });
      
      inputs[rowIndex].push(input);
      td.appendChild(input);
      td.style.padding = '4px';
      td.style.border = '1px solid #444';
    });
  });
  
  container.appendChild(table);
  
  // Add Deep-Check button for matrix
  const feedbackBtn = document.createElement('button');
  feedbackBtn.textContent = '🔍 Deep-Check';
  feedbackBtn.style.marginTop = '10px';
  feedbackBtn.style.padding = '8px 15px';
  feedbackBtn.style.background = '#444';
  feedbackBtn.style.color = '#e0e0e0';
  feedbackBtn.style.border = '1px solid #64b5f6';
  feedbackBtn.style.borderRadius = '4px';
  feedbackBtn.style.cursor = 'pointer';
  feedbackBtn.style.fontSize = '0.9rem';
  
  feedbackBtn.addEventListener('click', () => {
    const matrixData: string[][] = [];
    inputs.forEach((inputRow) => {
      matrixData.push(inputRow.map((inp) => inp.value));
    });
    const matrixContent = JSON.stringify(matrixData);
    showLLMFeedback(exercise, 'main', matrixContent);
  });
  
  container.appendChild(feedbackBtn);
}

function renderTranslateField(exercise: any, container: HTMLElement): void {
  // Get saved translate data if exists
  const savedAnswer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
  const savedPairs = savedAnswer && savedAnswer.type === 'translate' ? savedAnswer.pairs : null;
  
  const inputPairs: Array<{from: HTMLInputElement; to: HTMLInputElement}> = [];
  
  for (let i = 0; i < exercise.items; i++) {
    const pairContainer = document.createElement('div');
    pairContainer.style.display = 'grid';
    pairContainer.style.gridTemplateColumns = '1fr 20px 1fr';
    pairContainer.style.gap = '10px';
    pairContainer.style.marginBottom = '10px';
    pairContainer.style.alignItems = 'center';
    
    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.placeholder = 'Wolf-Sprache...';
    fromInput.style.padding = '8px';
    fromInput.style.borderRadius = '4px';
    fromInput.style.border = '1px solid #444';
    fromInput.style.background = '#2a2a2a';
    fromInput.style.color = '#e0e0e0';
    
    // Restore saved from value
    if (savedPairs && savedPairs[i]) {
      fromInput.value = savedPairs[i].from;
    }
    
    const arrow = document.createElement('span');
    arrow.textContent = '→';
    arrow.style.textAlign = 'center';
    arrow.style.color = '#64b5f6';
    
    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.placeholder = 'Giraffen-Sprache...';
    toInput.style.padding = '8px';
    toInput.style.borderRadius = '4px';
    toInput.style.border = '1px solid #444';
    toInput.style.background = '#2a2a2a';
    toInput.style.color = '#e0e0e0';
    
    // Restore saved to value
    if (savedPairs && savedPairs[i]) {
      toInput.value = savedPairs[i].to;
    }
    
    // Save on input
    const saveTranslate = () => {
      const pairs = inputPairs.map(p => ({
        from: p.from.value,
        to: p.to.value
      }));
      const translateAnswer: stateModule.TranslateAnswer = {
        type: 'translate',
        pairs
      };
      stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', translateAnswer);
      stateModule.saveState(userProgress);
    };
    
    fromInput.addEventListener('input', saveTranslate);
    toInput.addEventListener('input', saveTranslate);
    
    inputPairs.push({from: fromInput, to: toInput});
    
    pairContainer.appendChild(fromInput);
    pairContainer.appendChild(arrow);
    pairContainer.appendChild(toInput);
    container.appendChild(pairContainer);
  }
  
  // Add Deep-Check button for translate
  const feedbackBtn = document.createElement('button');
  feedbackBtn.textContent = '🔍 Deep-Check';
  feedbackBtn.style.marginTop = '10px';
  feedbackBtn.style.padding = '8px 15px';
  feedbackBtn.style.background = '#444';
  feedbackBtn.style.color = '#e0e0e0';
  feedbackBtn.style.border = '1px solid #64b5f6';
  feedbackBtn.style.borderRadius = '4px';
  feedbackBtn.style.cursor = 'pointer';
  feedbackBtn.style.fontSize = '0.9rem';
  
  feedbackBtn.addEventListener('click', () => {
    const pairs = inputPairs.map(p => ({
      from: p.from.value,
      to: p.to.value
    }));
    const translateContent = JSON.stringify(pairs);
    showLLMFeedback(exercise, 'main', translateContent);
  });
  
  container.appendChild(feedbackBtn);
}

function renderChecklistField(exercise: any, container: HTMLElement): void {
  // Get saved checklist data if exists
  const savedAnswer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
  const savedChecked = savedAnswer && savedAnswer.type === 'checklist' ? savedAnswer.checked : null;
  
  const checkboxes: HTMLInputElement[] = [];
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';
  
  exercise.items.forEach((item: string, index: number) => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.cursor = 'pointer';
    label.style.padding = '8px';
    label.style.borderRadius = '4px';
    label.style.transition = 'background 0.2s';
    
    label.addEventListener('mouseenter', () => {
      label.style.background = '#2a2a2a';
    });
    label.addEventListener('mouseleave', () => {
      label.style.background = 'transparent';
    });
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '10px';
    checkbox.style.cursor = 'pointer';
    
    // Restore saved checked state
    if (savedChecked && savedChecked[index]) {
      checkbox.checked = true;
    }
    
    // Save on change
    checkbox.addEventListener('change', () => {
      const checked = checkboxes.map(cb => cb.checked);
      const checklistAnswer: stateModule.ChecklistAnswer = {
        type: 'checklist',
        checked
      };
      stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', checklistAnswer);
      stateModule.saveState(userProgress);
    });
    
    checkboxes.push(checkbox);
    
    const text = document.createElement('span');
    text.textContent = item;
    text.style.color = '#e0e0e0';
    
    label.appendChild(checkbox);
    label.appendChild(text);
    list.appendChild(label);
  });
  
  container.appendChild(list);
  
  // Add Deep-Check button for checklist
  const feedbackBtn = document.createElement('button');
  feedbackBtn.textContent = '🔍 Deep-Check';
  feedbackBtn.style.marginTop = '10px';
  feedbackBtn.style.padding = '8px 15px';
  feedbackBtn.style.background = '#444';
  feedbackBtn.style.color = '#e0e0e0';
  feedbackBtn.style.border = '1px solid #64b5f6';
  feedbackBtn.style.borderRadius = '4px';
  feedbackBtn.style.cursor = 'pointer';
  feedbackBtn.style.fontSize = '0.9rem';
  
  feedbackBtn.addEventListener('click', () => {
    const checkedItems = exercise.items.filter((_: string, i: number) => checkboxes[i].checked);
    const checklistContent = JSON.stringify(checkedItems);
    showLLMFeedback(exercise, 'main', checklistContent);
  });
  
  container.appendChild(feedbackBtn);
}

function renderRatingField(exerciseId: string, container: HTMLElement, exercise?: Exercise): void {
  const ratingContainer = document.createElement('div');
  ratingContainer.style.display = 'flex';
  ratingContainer.style.gap = '5px';
  ratingContainer.style.marginBottom = '10px';
  
  let selectedRating: number | null = null;
  
  // Restore saved rating
  if (exercise) {
    const answer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
    if (answer && answer.type === 'rating') {
      selectedRating = answer.score;
    }
  }
  
  const buttons: HTMLButtonElement[] = [];
  
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = String(i);
    btn.style.padding = '8px 12px';
    btn.style.border = '1px solid #444';
    btn.style.borderRadius = '4px';
    btn.style.background = selectedRating === i ? '#64b5f6' : '#2a2a2a';
    btn.style.color = selectedRating === i ? '#1e1e1e' : '#e0e0e0';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'all 0.2s';
    
    btn.addEventListener('click', () => {
      buttons.forEach((b: any) => {
        b.style.background = '#2a2a2a';
        b.style.color = '#e0e0e0';
      });
      btn.style.background = '#64b5f6';
      btn.style.color = '#1e1e1e';
      selectedRating = i;
      
      if (exercise) {
        const ratingAnswer: stateModule.RatingAnswer = {
          type: 'rating',
          score: i,
          comment: (comment.value || '').trim()
        };
        stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', ratingAnswer);
        stateModule.saveState(userProgress);
      }
    });
    
    buttons.push(btn);
    ratingContainer.appendChild(btn);
  }
  
  container.appendChild(ratingContainer);
  
  // Comment field
  const comment = document.createElement('textarea');
  comment.placeholder = 'Optional: Kommentar...';
  comment.style.width = '100%';
  comment.style.height = '80px';
  comment.style.padding = '10px';
  comment.style.borderRadius = '4px';
  comment.style.border = '1px solid #444';
  comment.style.background = '#2a2a2a';
  comment.style.color = '#e0e0e0';
  comment.style.fontFamily = 'inherit';
  
  // Restore comment
  if (exercise) {
    const answer = stateModule.getAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main');
    if (answer && answer.type === 'rating') {
      comment.value = answer.comment;
    }
    
    comment.addEventListener('input', () => {
      const ratingAnswer: stateModule.RatingAnswer = {
        type: 'rating',
        score: selectedRating,
        comment: comment.value
      };
      stateModule.setAnswer(userProgress, uiState.selectedChapterId!, exercise.id, 'main', ratingAnswer);
      stateModule.saveState(userProgress);
    });
  }
  
  container.appendChild(comment);
}

function renderTimerField(exercise: any, container: HTMLElement): void {
  const timerContainer = document.createElement('div');
  timerContainer.style.textAlign = 'center';
  timerContainer.style.padding = '20px';
  
  const timeDisplay = document.createElement('div');
  timeDisplay.textContent = `${exercise.durationSec}s`;
  timeDisplay.style.fontSize = '2.5rem';
  timeDisplay.style.color = '#64b5f6';
  timeDisplay.style.marginBottom = '20px';
  timeDisplay.style.fontWeight = 'bold';
  timerContainer.appendChild(timeDisplay);
  
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Timer starten';
  startBtn.style.padding = '10px 20px';
  startBtn.style.fontSize = '1rem';
  startBtn.style.background = '#64b5f6';
  startBtn.style.color = '#1e1e1e';
  startBtn.style.border = 'none';
  startBtn.style.borderRadius = '4px';
  startBtn.style.cursor = 'pointer';
  startBtn.style.fontWeight = 'bold';
  
  let timeLeft = exercise.durationSec;
  let isRunning = false;
  
  startBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    
    const interval = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = `${timeLeft}s`;
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        isRunning = false;
        timeLeft = exercise.durationSec;
        timeDisplay.textContent = `${timeLeft}s`;
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        startBtn.textContent = 'Fertig!';
        setTimeout(() => {
          startBtn.textContent = 'Timer starten';
        }, 2000);
      }
    }, 1000);
  });
  
  timerContainer.appendChild(startBtn);
  container.appendChild(timerContainer);
}

/**
 * Display LLM feedback in a modal with comprehensive error handling
 */
function showLLMFeedback(exercise: Exercise, fieldId: string, fieldContent: string): void {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';
  
  const dialogBox = document.createElement('div');
  dialogBox.style.background = '#1e1e1e';
  dialogBox.style.padding = '30px';
  dialogBox.style.borderRadius = '8px';
  dialogBox.style.maxWidth = '600px';
  dialogBox.style.maxHeight = '80vh';
  dialogBox.style.overflowY = 'auto';
  dialogBox.style.border = '2px solid #64b5f6';
  
  const title = document.createElement('h2');
  title.textContent = '🔍 LLM Feedback';
  title.style.marginBottom = '20px';
  title.style.color = '#64b5f6';
  dialogBox.appendChild(title);
  
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Wird analysiert... 🧠';
  loadingDiv.style.color = '#999';
  loadingDiv.style.textAlign = 'center';
  loadingDiv.style.padding = '20px';
  dialogBox.appendChild(loadingDiv);
  
  modal.appendChild(dialogBox);
  document.body.appendChild(modal);
  
  // Call LLM asynchronously with enhanced error handling
  llmModule.evaluateField(exercise, fieldId, fieldContent, exercise.type)
    .then((feedback) => {
      if (!feedback) {
        throw new Error('LLM ist deaktiviert. Bitte konfiguriere einen LLM-Endpoint in den Einstellungen.');
      }
      
      loadingDiv.remove();
      
      // Score badge
      const scoreDiv = document.createElement('div');
      scoreDiv.style.display = 'flex';
      scoreDiv.style.alignItems = 'center';
      scoreDiv.style.gap = '10px';
      scoreDiv.style.marginBottom = '15px';
      
      const scoreBadge = document.createElement('div');
      const scoreNum = feedback.score ?? 0;
      scoreBadge.textContent = `${scoreNum}/3`;
      scoreBadge.style.background = scoreNum >= 2 ? '#4caf50' : scoreNum === 1 ? '#ff9800' : '#f44336';
      scoreBadge.style.color = '#fff';
      scoreBadge.style.padding = '8px 15px';
      scoreBadge.style.borderRadius = '20px';
      scoreBadge.style.fontWeight = 'bold';
      scoreBadge.style.minWidth = '60px';
      scoreBadge.style.textAlign = 'center';
      scoreDiv.appendChild(scoreBadge);
      
      const confidence = document.createElement('span');
      confidence.textContent = `Sicherheit: ${Math.round((feedback.confidence ?? 0) * 100)}%`;
      confidence.style.color = '#999';
      confidence.style.fontSize = '0.9rem';
      scoreDiv.appendChild(confidence);
      
      dialogBox.appendChild(scoreDiv);
      
      // Issues
      if (feedback.issues && feedback.issues.length > 0) {
        const issuesDiv = document.createElement('div');
        issuesDiv.style.marginBottom = '15px';
        
        const issuesLabel = document.createElement('h3');
        issuesLabel.textContent = '⚠️ Punkte zum Verbessern:';
        issuesLabel.style.color = '#ff9800';
        issuesLabel.style.fontSize = '1rem';
        issuesLabel.style.marginBottom = '8px';
        issuesDiv.appendChild(issuesLabel);
        
        const issuesList = document.createElement('ul');
        issuesList.style.marginLeft = '20px';
        issuesList.style.color = '#bbb';
        feedback.issues.forEach((issue: string) => {
          const li = document.createElement('li');
          li.textContent = issue;
          li.style.marginBottom = '5px';
          issuesList.appendChild(li);
        });
        issuesDiv.appendChild(issuesList);
        dialogBox.appendChild(issuesDiv);
      }
      
      // Suggestions
      if (feedback.suggestions && feedback.suggestions.length > 0) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.style.marginBottom = '15px';
        
        const suggestionsLabel = document.createElement('h3');
        suggestionsLabel.textContent = '💡 Vorschläge:';
        suggestionsLabel.style.color = '#4caf50';
        suggestionsLabel.style.fontSize = '1rem';
        suggestionsLabel.style.marginBottom = '8px';
        suggestionsDiv.appendChild(suggestionsLabel);
        
        const suggestionsList = document.createElement('ul');
        suggestionsList.style.marginLeft = '20px';
        suggestionsList.style.color = '#bbb';
        feedback.suggestions.forEach((suggestion: string) => {
          const li = document.createElement('li');
          li.textContent = suggestion;
          li.style.marginBottom = '5px';
          suggestionsList.appendChild(li);
        });
        suggestionsDiv.appendChild(suggestionsList);
        dialogBox.appendChild(suggestionsDiv);
      }
      
      // Example rewrite
      if (feedback.exampleRewrite) {
        const exampleDiv = document.createElement('div');
        exampleDiv.style.marginBottom = '15px';
        exampleDiv.style.background = '#2a2a2a';
        exampleDiv.style.padding = '12px';
        exampleDiv.style.borderRadius = '4px';
        exampleDiv.style.borderLeft = '3px solid #64b5f6';
        
        const exampleLabel = document.createElement('h3');
        exampleLabel.textContent = '📝 Beispiel-Umformulierung:';
        exampleLabel.style.color = '#64b5f6';
        exampleLabel.style.fontSize = '1rem';
        exampleLabel.style.marginBottom = '8px';
        exampleDiv.appendChild(exampleLabel);
        
        const exampleText = document.createElement('p');
        exampleText.textContent = feedback.exampleRewrite;
        exampleText.style.color = '#e0e0e0';
        exampleText.style.fontStyle = 'italic';
        exampleText.style.margin = '0';
        exampleDiv.appendChild(exampleText);
        dialogBox.appendChild(exampleDiv);
      }
      
      // Explainers
      if (feedback.explainers && feedback.explainers.length > 0) {
        const explainersDiv = document.createElement('div');
        explainersDiv.style.marginBottom = '15px';
        
        const explainersLabel = document.createElement('h3');
        explainersLabel.textContent = '📚 Erklärungen:';
        explainersLabel.style.color = '#64b5f6';
        explainersLabel.style.fontSize = '1rem';
        explainersLabel.style.marginBottom = '8px';
        explainersDiv.appendChild(explainersLabel);
        
        const explainersList = document.createElement('ul');
        explainersList.style.marginLeft = '20px';
        explainersList.style.color = '#bbb';
        feedback.explainers.forEach((exp: string) => {
          const li = document.createElement('li');
          li.textContent = exp;
          li.style.marginBottom = '5px';
          explainersList.appendChild(li);
        });
        explainersDiv.appendChild(explainersList);
        dialogBox.appendChild(explainersDiv);
      }
      
      // Save feedback to state
      stateModule.setLLMFeedback(userProgress, uiState.selectedChapterId!, exercise.id, fieldId, feedback);
      stateModule.saveState(userProgress);
    })
    .catch((error: Error) => {
      loadingDiv.remove();
      
      // Create error display
      const errorDiv = document.createElement('div');
      errorDiv.style.background = '#f44336';
      errorDiv.style.color = '#fff';
      errorDiv.style.padding = '15px';
      errorDiv.style.borderRadius = '4px';
      errorDiv.style.marginBottom = '20px';
      
      const errorTitle = document.createElement('h3');
      errorTitle.textContent = '❌ Fehler beim Analysieren';
      errorTitle.style.margin = '0 0 10px 0';
      errorDiv.appendChild(errorTitle);
      
      const errorMsg = document.createElement('p');
      errorMsg.textContent = error.message || 'Ein unbekannter Fehler ist aufgetreten.';
      errorMsg.style.margin = '0';
      errorDiv.appendChild(errorMsg);
      
      dialogBox.appendChild(errorDiv);
      
      // Helpful suggestions
      const suggestionsDiv = document.createElement('div');
      suggestionsDiv.style.background = '#2a2a2a';
      suggestionsDiv.style.padding = '15px';
      suggestionsDiv.style.borderRadius = '4px';
      suggestionsDiv.style.borderLeft = '3px solid #ff9800';
      
      const suggestionsTitle = document.createElement('h4');
      suggestionsTitle.textContent = '💡 Tipps:';
      suggestionsTitle.style.margin = '0 0 10px 0';
      suggestionsTitle.style.color = '#ff9800';
      suggestionsDiv.appendChild(suggestionsTitle);
      
      const suggestionsList = document.createElement('ul');
      suggestionsList.style.margin = '0';
      suggestionsList.style.paddingLeft = '20px';
      suggestionsList.style.color = '#bbb';
      
      const tips = [
        'Stelle sicher, dass LM Studio oder Ollama läuft',
        'Überprüfe die Endpoint-Konfiguration (http://localhost:1234)',
        'Versuche es später erneut (Timeout)',
        'Aktiviere den LLM in den App-Einstellungen'
      ];
      
      tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        li.style.marginBottom = '5px';
        suggestionsList.appendChild(li);
      });
      
      suggestionsDiv.appendChild(suggestionsList);
      dialogBox.appendChild(suggestionsDiv);
    });
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Schließen';
  closeBtn.style.marginTop = '20px';
  closeBtn.style.padding = '10px 20px';
  closeBtn.style.background = '#444';
  closeBtn.style.color = '#e0e0e0';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '4px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  dialogBox.appendChild(closeBtn);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Open settings modal with tabs for LLM config, language, and theme
 */
function openSettingsModal(): void {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0, 0, 0, 0.8)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';
  
  // Create dialog box
  const dialogBox = document.createElement('div');
  dialogBox.style.background = '#2a2a2a';
  dialogBox.style.borderRadius = '8px';
  dialogBox.style.padding = '30px';
  dialogBox.style.maxWidth = '600px';
  dialogBox.style.width = '90%';
  dialogBox.style.maxHeight = '80vh';
  dialogBox.style.overflowY = 'auto';
  dialogBox.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
  
  modal.appendChild(dialogBox);
  document.body.appendChild(modal);
  
  // Header
  const header = document.createElement('h2');
  header.textContent = '⚙️ Einstellungen';
  header.style.margin = '0 0 20px 0';
  header.style.color = '#64b5f6';
  dialogBox.appendChild(header);
  
  // Create tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.style.display = 'flex';
  tabsContainer.style.gap = '10px';
  tabsContainer.style.marginBottom = '20px';
  tabsContainer.style.borderBottom = '1px solid #444';
  
  interface TabConfig {
    id: string;
    label: string;
    content: () => HTMLElement;
  }
  
  const tabs: TabConfig[] = [
    { id: 'llm', label: 'LLM-Konfiguration', content: createLLMTab },
    { id: 'theme', label: 'Theme', content: createThemeTab },
    { id: 'language', label: 'Sprache', content: createLanguageTab }
  ];
  
  let activeTabId = 'llm';
  const contentContainer = document.createElement('div');
  contentContainer.style.marginTop = '20px';
  
  function switchTab(tabId: string): void {
    activeTabId = tabId;
    
    // Update tab buttons
    tabButtons.forEach(btn => {
      if (btn.dataset.tabId === tabId) {
        btn.style.background = '#64b5f6';
        btn.style.color = '#1e1e1e';
      } else {
        btn.style.background = '#333';
        btn.style.color = '#e0e0e0';
      }
    });
    
    // Render content
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      contentContainer.innerHTML = '';
      contentContainer.appendChild(tab.content());
    }
  }
  
  // Create tab buttons
  const tabButtons: HTMLButtonElement[] = [];
  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.label;
    btn.dataset.tabId = tab.id;
    btn.style.padding = '10px 20px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px 4px 0 0';
    btn.style.background = tab.id === activeTabId ? '#64b5f6' : '#333';
    btn.style.color = tab.id === activeTabId ? '#1e1e1e' : '#e0e0e0';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '0.9rem';
    btn.style.transition = 'all 0.2s ease';
    
    btn.addEventListener('click', () => switchTab(tab.id));
    tabsContainer.appendChild(btn);
    tabButtons.push(btn);
  });
  
  dialogBox.appendChild(tabsContainer);
  dialogBox.appendChild(contentContainer);
  
  // Initial content
  switchTab(activeTabId);
  
  // Action buttons
  const actionsDiv = document.createElement('div');
  actionsDiv.style.display = 'flex';
  actionsDiv.style.gap = '10px';
  actionsDiv.style.marginTop = '30px';
  actionsDiv.style.justifyContent = 'flex-end';
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Speichern';
  saveBtn.style.padding = '10px 20px';
  saveBtn.style.background = '#4caf50';
  saveBtn.style.color = '#fff';
  saveBtn.style.border = 'none';
  saveBtn.style.borderRadius = '4px';
  saveBtn.style.cursor = 'pointer';
  saveBtn.style.fontSize = '0.95rem';
  saveBtn.addEventListener('click', () => {
    saveSettings();
    document.body.removeChild(modal);
  });
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Abbrechen';
  cancelBtn.style.padding = '10px 20px';
  cancelBtn.style.background = '#444';
  cancelBtn.style.color = '#e0e0e0';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '4px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '0.95rem';
  cancelBtn.addEventListener('click', () => {
    appSettings = settingsModule.loadSettings(); // Reset changes
    document.body.removeChild(modal);
  });
  
  actionsDiv.appendChild(cancelBtn);
  actionsDiv.appendChild(saveBtn);
  dialogBox.appendChild(actionsDiv);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      appSettings = settingsModule.loadSettings();
      document.body.removeChild(modal);
    }
  });
  
  // Close on Escape key
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      appSettings = settingsModule.loadSettings();
      document.body.removeChild(modal);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Create LLM configuration tab content
 */
function createLLMTab(): HTMLElement {
  const container = document.createElement('div');
  
  // Enable/Disable toggle
  const enableDiv = document.createElement('div');
  enableDiv.style.marginBottom = '20px';
  
  const enableLabel = document.createElement('label');
  enableLabel.style.display = 'flex';
  enableLabel.style.alignItems = 'center';
  enableLabel.style.gap = '10px';
  enableLabel.style.cursor = 'pointer';
  
  const enableCheckbox = document.createElement('input');
  enableCheckbox.type = 'checkbox';
  enableCheckbox.checked = appSettings.llm.enabled;
  enableCheckbox.style.width = '20px';
  enableCheckbox.style.height = '20px';
  enableCheckbox.style.cursor = 'pointer';
  enableCheckbox.addEventListener('change', () => {
    appSettings.llm.enabled = enableCheckbox.checked;
    endpointInput.disabled = !enableCheckbox.checked;
    modelInput.disabled = !enableCheckbox.checked;
    timeoutInput.disabled = !enableCheckbox.checked;
  });
  
  const enableText = document.createElement('span');
  enableText.textContent = 'LLM aktivieren (für Deep-Check)';
  enableText.style.color = '#e0e0e0';
  enableText.style.fontSize = '1rem';
  
  enableLabel.appendChild(enableCheckbox);
  enableLabel.appendChild(enableText);
  enableDiv.appendChild(enableLabel);
  container.appendChild(enableDiv);
  
  // Endpoint input
  const endpointDiv = document.createElement('div');
  endpointDiv.style.marginBottom = '20px';
  
  const endpointLabel = document.createElement('label');
  endpointLabel.textContent = 'API Endpoint';
  endpointLabel.style.display = 'block';
  endpointLabel.style.marginBottom = '5px';
  endpointLabel.style.color = '#aaa';
  endpointLabel.style.fontSize = '0.9rem';
  
  const endpointInput = document.createElement('input');
  endpointInput.type = 'text';
  endpointInput.value = appSettings.llm.endpoint;
  endpointInput.disabled = !appSettings.llm.enabled;
  endpointInput.placeholder = 'http://localhost:1234/v1/chat/completions';
  endpointInput.style.width = '100%';
  endpointInput.style.padding = '10px';
  endpointInput.style.background = '#1e1e1e';
  endpointInput.style.color = '#e0e0e0';
  endpointInput.style.border = '1px solid #444';
  endpointInput.style.borderRadius = '4px';
  endpointInput.style.fontSize = '0.9rem';
  endpointInput.addEventListener('input', () => {
    appSettings.llm.endpoint = endpointInput.value;
  });
  
  const endpointHint = document.createElement('small');
  endpointHint.textContent = 'Standard: LM Studio (http://localhost:1234) oder Ollama (http://localhost:11434)';
  endpointHint.style.display = 'block';
  endpointHint.style.marginTop = '5px';
  endpointHint.style.color = '#888';
  endpointHint.style.fontSize = '0.8rem';
  
  endpointDiv.appendChild(endpointLabel);
  endpointDiv.appendChild(endpointInput);
  endpointDiv.appendChild(endpointHint);
  container.appendChild(endpointDiv);
  
  // Model input
  const modelDiv = document.createElement('div');
  modelDiv.style.marginBottom = '20px';
  
  const modelLabel = document.createElement('label');
  modelLabel.textContent = 'Modell';
  modelLabel.style.display = 'block';
  modelLabel.style.marginBottom = '5px';
  modelLabel.style.color = '#aaa';
  modelLabel.style.fontSize = '0.9rem';
  
  const modelInput = document.createElement('input');
  modelInput.type = 'text';
  modelInput.value = appSettings.llm.model;
  modelInput.disabled = !appSettings.llm.enabled;
  modelInput.placeholder = 'llama-3.1-8b-instruct';
  modelInput.style.width = '100%';
  modelInput.style.padding = '10px';
  modelInput.style.background = '#1e1e1e';
  modelInput.style.color = '#e0e0e0';
  modelInput.style.border = '1px solid #444';
  modelInput.style.borderRadius = '4px';
  modelInput.style.fontSize = '0.9rem';
  modelInput.addEventListener('input', () => {
    appSettings.llm.model = modelInput.value;
  });
  
  const modelHint = document.createElement('small');
  modelHint.textContent = 'Beliebig leer lassen oder LM Studio Modell-ID eintragen';
  modelHint.style.display = 'block';
  modelHint.style.marginTop = '5px';
  modelHint.style.color = '#888';
  modelHint.style.fontSize = '0.8rem';
  
  modelDiv.appendChild(modelLabel);
  modelDiv.appendChild(modelInput);
  modelDiv.appendChild(modelHint);
  container.appendChild(modelDiv);
  
  // Timeout slider
  const timeoutDiv = document.createElement('div');
  timeoutDiv.style.marginBottom = '20px';
  
  const timeoutLabel = document.createElement('label');
  timeoutLabel.textContent = `Timeout: ${appSettings.llm.timeout / 1000}s`;
  timeoutLabel.style.display = 'block';
  timeoutLabel.style.marginBottom = '10px';
  timeoutLabel.style.color = '#aaa';
  timeoutLabel.style.fontSize = '0.9rem';
  
  const timeoutInput = document.createElement('input');
  timeoutInput.type = 'range';
  timeoutInput.min = '5000';
  timeoutInput.max = '60000';
  timeoutInput.step = '5000';
  timeoutInput.value = String(appSettings.llm.timeout);
  timeoutInput.disabled = !appSettings.llm.enabled;
  timeoutInput.style.width = '100%';
  timeoutInput.addEventListener('input', () => {
    appSettings.llm.timeout = Number(timeoutInput.value);
    timeoutLabel.textContent = `Timeout: ${appSettings.llm.timeout / 1000}s`;
  });
  
  timeoutDiv.appendChild(timeoutLabel);
  timeoutDiv.appendChild(timeoutInput);
  container.appendChild(timeoutDiv);
  
  return container;
}

/**
 * Create theme selection tab content
 */
function createThemeTab(): HTMLElement {
  const container = document.createElement('div');
  
  const themeOptions: Array<{ value: 'dark' | 'light' | 'auto'; label: string }> = [
    { value: 'dark', label: 'Dunkel' },
    { value: 'light', label: 'Hell' },
    { value: 'auto', label: 'Automatisch (System)' }
  ];
  
  themeOptions.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.style.marginBottom = '15px';
    
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '10px';
    label.style.cursor = 'pointer';
    label.style.padding = '15px';
    label.style.background = appSettings.theme === option.value ? '#333' : '#1e1e1e';
    label.style.borderRadius = '6px';
    label.style.border = appSettings.theme === option.value ? '2px solid #64b5f6' : '1px solid #444';
    label.style.transition = 'all 0.2s ease';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'theme';
    radio.value = option.value;
    radio.checked = appSettings.theme === option.value;
    radio.style.width = '18px';
    radio.style.height = '18px';
    radio.style.cursor = 'pointer';
    radio.addEventListener('change', () => {
      if (radio.checked) {
        appSettings.theme = option.value;
        // Re-render to update selection
        const parent = container.parentElement;
        if (parent) {
          parent.innerHTML = '';
          parent.appendChild(createThemeTab());
        }
      }
    });
    
    const text = document.createElement('span');
    text.textContent = option.label;
    text.style.color = '#e0e0e0';
    text.style.fontSize = '1rem';
    
    label.appendChild(radio);
    label.appendChild(text);
    optionDiv.appendChild(label);
    container.appendChild(optionDiv);
  });
  
  return container;
}

/**
 * Create language selection tab content
 */
function createLanguageTab(): HTMLElement {
  const container = document.createElement('div');
  
  const languageOptions: Array<{ value: 'de' | 'en'; label: string }> = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' }
  ];
  
  languageOptions.forEach(option => {
    const optionDiv = document.createElement('div');
    optionDiv.style.marginBottom = '15px';
    
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '10px';
    label.style.cursor = 'pointer';
    label.style.padding = '15px';
    label.style.background = appSettings.language === option.value ? '#333' : '#1e1e1e';
    label.style.borderRadius = '6px';
    label.style.border = appSettings.language === option.value ? '2px solid #64b5f6' : '1px solid #444';
    label.style.transition = 'all 0.2s ease';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'language';
    radio.value = option.value;
    radio.checked = appSettings.language === option.value;
    radio.style.width = '18px';
    radio.style.height = '18px';
    radio.style.cursor = 'pointer';
    radio.addEventListener('change', () => {
      if (radio.checked) {
        appSettings.language = option.value;
        // Re-render to update selection
        const parent = container.parentElement;
        if (parent) {
          parent.innerHTML = '';
          parent.appendChild(createLanguageTab());
        }
      }
    });
    
    const text = document.createElement('span');
    text.textContent = option.label;
    text.style.color = '#e0e0e0';
    text.style.fontSize = '1rem';
    
    label.appendChild(radio);
    label.appendChild(text);
    optionDiv.appendChild(label);
    container.appendChild(optionDiv);
  });
  
  const hint = document.createElement('p');
  hint.textContent = 'Hinweis: Sprache wird beim nächsten Start übernommen (aktuell nur Platzhalter).';
  hint.style.color = '#888';
  hint.style.fontSize = '0.85rem';
  hint.style.marginTop = '20px';
  container.appendChild(hint);
  
  return container;
}

/**
 * Save settings and apply changes
 */
function saveSettings(): void {
  settingsModule.saveSettings(appSettings);
  settingsModule.applyTheme(appSettings.theme);
  
  // Update LLM client configuration
  if (appSettings.llm.enabled) {
    llmClient.setLLMConfig({
      endpoint: appSettings.llm.endpoint,
      model: appSettings.llm.model,
      timeout: appSettings.llm.timeout
    });
  }
}

