const SIZE = 9;

function createGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = ''; // Clear the grid
    for (let i = 0; i < SIZE; i++) {
        const row = grid.insertRow();
        for (let j = 0; j < SIZE; j++) {
            const cell = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '9';
            input.value = '';
            cell.appendChild(input);
        }
    }
}

function isSafe(board, row, col, num) {
    for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function solveSudokuUtil(board) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= SIZE; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudokuUtil(board)) {
                            return true;
                        }

                        board[row][col] = 0; // backtrack
                    }
                }
                return false; // no number can be placed
            }
        }
    }
    return true; // solved
}

function solveSudoku() {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input, index) => {
        const value = parseInt(input.value);
        board[Math.floor(index / SIZE)][index % SIZE] = isNaN(value) ? 0 : value;
    });

    if (solveSudokuUtil(board)) {
        inputs.forEach((input, index) => {
            input.value = board[Math.floor(index / SIZE)][index % SIZE] || '';
        });
    } else {
        alert("No solution exists");
    }
}

// Function to generate a new Sudoku puzzle
function generatePuzzle() {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    fillBoard(board);
    removeNumbers(board);
    updateGrid(board);
}

// Function to fill the board with a valid Sudoku solution
function fillBoard(board) {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 0) {
                const numbers = [...Array(SIZE).keys()].map(n => n + 1).sort(() => Math.random() - 0.5);
                for (let num of numbers) {
                    if (isSafe(board, i, j, num)) {
                        board[i][j] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[i][j] = 0; // backtrack
                    }
                }
                return false; // no valid number found
            }
        }
    }
    return true; // successfully filled
}

// Function to remove numbers from the board to create a puzzle
function removeNumbers(board) {
    let count = 40; // Number of cells to remove
    while (count > 0) {
        const row = Math.floor(Math.random() * SIZE);
        const col = Math.floor(Math.random() * SIZE);
        if (board[row][col] !== 0) {
            const backup = board[row][col]; // Backup the value
            board[row][col] = 0; // Remove the number

            // Check if the puzzle still has a unique solution
            const boardCopy = board.map(r => r.slice());
            if (!hasUniqueSolution(boardCopy)) {
                board[row][col] = backup; // Restore the value if not unique
            }
            count--;
        }
    }
}

// Function to check if the current board has a unique solution
function hasUniqueSolution(board) {
    let solutionCount = 0;

    function countSolutions() {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= SIZE; num++) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            countSolutions();
                            board[row][col] = 0; // backtrack
                        }
                    }
                    return; // Stop searching for more solutions
                }
            }
        }
        solutionCount++;
    }

    countSolutions();
    return solutionCount === 1; // Return true if exactly one solution exists
}

// Function to update the grid with the generated puzzle
function updateGrid(board) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.value = board[Math.floor(index / SIZE)][index % SIZE] || '';
    });
}

// Initialize the grid
createGrid();