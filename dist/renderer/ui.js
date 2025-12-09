import { GFK_CHAPTERS } from '../gfkContent';
let uiState = {
    selectedChapterId: null,
    selectedExerciseId: null,
};
/**
 * Initialize the UI with chapters list and main content area
 */
export function initializeUI(container) {
    container.innerHTML = '';
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
    const mainContent = document.createElement('main');
    mainContent.style.overflowY = 'auto';
    mainContent.style.padding = '20px';
    layout.appendChild(sidebar);
    layout.appendChild(mainContent);
    container.appendChild(layout);
    // Render chapters in sidebar
    renderChapterList(sidebar);
    // Select first chapter by default
    if (GFK_CHAPTERS.length > 0) {
        selectChapter(GFK_CHAPTERS[0].id, mainContent);
    }
}
/**
 * Render the chapter list in the sidebar
 */
function renderChapterList(container) {
    container.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = 'Kapitel';
    heading.style.fontSize = '1.2rem';
    heading.style.marginBottom = '15px';
    heading.style.color = '#64b5f6';
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
            const mainContent = document.querySelector('main');
            if (mainContent) {
                selectChapter(chapter.id, mainContent);
                renderChapterList(container); // Re-render to update highlight
            }
        });
        listItem.appendChild(button);
        list.appendChild(listItem);
    });
    container.appendChild(list);
}
/**
 * Select a chapter and render its exercises
 */
function selectChapter(chapterId, mainContent) {
    const chapter = GFK_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter)
        return;
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
function createExerciseCard(exercise) {
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
function getExerciseTypeName(type) {
    const names = {
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
function expandExercise(exercise) {
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
function renderExerciseFields(exercise, container) {
    const fieldsContainer = document.createElement('div');
    fieldsContainer.style.marginBottom = '20px';
    switch (exercise.type) {
        case 'textarea':
            renderTextareaField(exercise.id, fieldsContainer);
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
            renderRatingField(exercise.id, fieldsContainer);
            break;
        case 'timer':
            renderTimerField(exercise, fieldsContainer);
            break;
    }
    container.appendChild(fieldsContainer);
}
function renderTextareaField(exerciseId, container) {
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
    container.appendChild(textarea);
}
function renderMatrixField(exercise, container) {
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '10px';
    // Header row
    const headerRow = table.insertRow();
    const headerCell = document.createElement('th');
    headerCell.style.padding = '8px';
    headerCell.style.border = '1px solid #444';
    headerCell.style.textAlign = 'left';
    headerRow.appendChild(headerCell);
    exercise.cols.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        th.style.padding = '8px';
        th.style.border = '1px solid #444';
        th.style.textAlign = 'left';
        th.style.color = '#64b5f6';
        headerRow.appendChild(th);
    });
    // Data rows
    exercise.rows.forEach((row) => {
        const tr = table.insertRow();
        const rowLabel = tr.insertCell();
        rowLabel.textContent = row;
        rowLabel.style.padding = '8px';
        rowLabel.style.border = '1px solid #444';
        rowLabel.style.fontWeight = 'bold';
        rowLabel.style.color = '#64b5f6';
        exercise.cols.forEach((_col) => {
            const td = tr.insertCell();
            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '100%';
            input.style.padding = '6px';
            input.style.border = 'none';
            input.style.background = '#2a2a2a';
            input.style.color = '#e0e0e0';
            td.appendChild(input);
            td.style.padding = '4px';
            td.style.border = '1px solid #444';
        });
    });
    container.appendChild(table);
}
function renderTranslateField(exercise, container) {
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
        pairContainer.appendChild(fromInput);
        pairContainer.appendChild(arrow);
        pairContainer.appendChild(toInput);
        container.appendChild(pairContainer);
    }
}
function renderChecklistField(exercise, container) {
    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '8px';
    exercise.items.forEach((item, index) => {
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
        const text = document.createElement('span');
        text.textContent = item;
        text.style.color = '#e0e0e0';
        label.appendChild(checkbox);
        label.appendChild(text);
        list.appendChild(label);
    });
    container.appendChild(list);
}
function renderRatingField(exerciseId, container) {
    const ratingContainer = document.createElement('div');
    ratingContainer.style.display = 'flex';
    ratingContainer.style.gap = '5px';
    ratingContainer.style.marginBottom = '10px';
    for (let i = 0; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = String(i);
        btn.style.padding = '8px 12px';
        btn.style.border = '1px solid #444';
        btn.style.borderRadius = '4px';
        btn.style.background = '#2a2a2a';
        btn.style.color = '#e0e0e0';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s';
        btn.addEventListener('click', () => {
            // Update all buttons to show selection
            Array.from(ratingContainer.querySelectorAll('button')).forEach((b) => {
                b.style.background = '#2a2a2a';
                b.style.color = '#e0e0e0';
            });
            btn.style.background = '#64b5f6';
            btn.style.color = '#1e1e1e';
        });
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
    container.appendChild(comment);
}
function renderTimerField(exercise, container) {
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
        if (isRunning)
            return;
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
//# sourceMappingURL=ui.js.map