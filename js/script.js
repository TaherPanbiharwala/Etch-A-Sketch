const container = document.getElementById('grid');
const generateBtn = document.getElementById('generate-btn');
const gridSizeInput = document.getElementById('grid-size');
const colorPicker = document.getElementById('color');
const eraseBtn = document.getElementById('erase-btn');
const resetBtn = document.getElementById('reset-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const toggleGridBtn = document.getElementById('toggle-grid-btn');
const fillBtn = document.getElementById('fill-btn');

let isErasing = false;
let currentGridSize = 16;
let isDrawingEnabled = false;
let history = []; 
let historyIndex = -1; 

function createGrid(size) {
    container.innerHTML = '';
    const squareSize = 500 / size;
    
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.backgroundColor = 'lightblue';
        
        square.addEventListener('mousedown', function(e) {
            isDrawingEnabled = !isDrawingEnabled;
            if (isDrawingEnabled) {
                updateSquareColor(this);
                saveState(); 
            }
        });
        
        square.addEventListener('mouseover', function() {
            if (isDrawingEnabled) {
                updateSquareColor(this);
            }
        });
        
        container.appendChild(square);
    }
    saveState(); 
}
function toggleGrid() {
    container.classList.toggle('grid-hidden');
    const isHidden = container.classList.contains('grid-hidden');
    toggleGridBtn.textContent = isHidden ? 'Show Grid' : 'Hide Grid';
}

function updateSquareColor(square) {
    if (isErasing) {
        square.style.backgroundColor = 'lightblue';
    } else {
        square.style.backgroundColor = colorPicker.value;
    }
}function fillGrid() {
    const squares = document.querySelectorAll('.square');
    const fillColor = colorPicker.value;
    
    squares.forEach(square => {
        square.style.backgroundColor = fillColor;
    });
    
    saveState(); 
}

function saveState() {
    history = history.slice(0, historyIndex + 1);
    const squares = document.querySelectorAll('.square');
    const state = Array.from(squares).map(sq => sq.style.backgroundColor);
    history.push(state);
    historyIndex++;
    
    updateUndoRedoButtons();
}

function restoreState(index) {
    const state = history[index];
    const squares = document.querySelectorAll('.square');
    
    squares.forEach((square, i) => {
        square.style.backgroundColor = state[i];
    });
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyIndex);
        updateUndoRedoButtons();
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState(historyIndex);
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

function resetGrid() {
    createGrid(currentGridSize);
}
toggleGridBtn.addEventListener('click', toggleGrid);
generateBtn.addEventListener('click', function() {
    let size = parseInt(gridSizeInput.value);
    if (isNaN(size) || size < 1) size = 1;
    if (size > 100) size = 100;
    currentGridSize = size;
    createGrid(size);
});

eraseBtn.addEventListener('click', function() {
    isErasing = !isErasing;
    eraseBtn.textContent = isErasing ? 'Drawing Mode' : 'Eraser';
    eraseBtn.style.backgroundColor = isErasing ? '#ffcccc' : '';
});

resetBtn.addEventListener('click', resetGrid);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
createGrid(currentGridSize);
container.addEventListener('mouseup', () => {
    if (isDrawingEnabled) {
        saveState();
    }
});
container.addEventListener('mouseleave', () => {
    if (isDrawingEnabled) {
        isDrawingEnabled = false;
        saveState();
    }
});

fillBtn.addEventListener('click', fillGrid);