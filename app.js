// Константы для игрового поля
const BOARD_SIZE = 5; // Размер доски 5x5
const NUM_MINES = 5; // Количество мин

// Состояние игры
let board = [];
let gameOver = false;

// Получаем элементы
const gameBoard = document.getElementById("game-board");
const resetButton = document.getElementById("reset-button");

// Инициализация игры
function initGame() {
    board = createBoard(BOARD_SIZE, NUM_MINES);
    gameOver = false;
    renderBoard();
}

// Создание игрового поля с минами
function createBoard(size, numMines) {
    const board = Array(size).fill(null).map(() => Array(size).fill({ mine: false, revealed: false }));

    // Расстановка мин
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }

    return board;
}

// Рендеринг игрового поля
function renderBoard() {
    gameBoard.innerHTML = ""; // Очистить доску

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement("button");
            cellElement.classList.add("cell");
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;

            if (cell.revealed) {
                if (cell.mine) {
                    cellElement.classList.add("mine");
                    cellElement.textContent = "💣";
                } else {
                    cellElement.classList.add("safe");
                    const minesAround = countMinesAround(rowIndex, colIndex);
                    cellElement.textContent = minesAround > 0 ? minesAround : "";
                }
            }

            cellElement.addEventListener("click", () => handleCellClick(rowIndex, colIndex));
            gameBoard.appendChild(cellElement);
        });
    });
}

// Обработка нажатия на клетку
function handleCellClick(row, col) {
    if (gameOver || board[row][col].revealed) return;

    const cell = board[row][col];
    cell.revealed = true;

    if (cell.mine) {
        gameOver = true;
        revealAllMines();
        alert("Game Over! You hit a mine.");
    } else {
        const minesAround = countMinesAround(row, col);
        if (minesAround === 0) {
            revealSafeCells(row, col);
        }
        if (checkWin()) {
            alert("Congratulations! You found all safe cells.");
            gameOver = true;
        }
    }

    renderBoard();
}

// Подсчёт мин вокруг клетки
function countMinesAround(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol].mine) {
            count++;
        }
        return count;
    }, 0);
}

// Открытие безопасных клеток
function revealSafeCells(row, col) {
    const stack = [[row, col]];

    while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        if (board[currentRow][currentCol].revealed) continue;

        board[currentRow][currentCol].revealed = true;

        if (countMinesAround(currentRow, currentCol) === 0) {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],         [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];

            directions.forEach(([dx, dy]) => {
                const newRow = currentRow + dx;
                const newCol = currentCol + dy;
                if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && !board[newRow][newCol].revealed) {
                    stack.push([newRow, newCol]);
                }
            });
        }
    }
}

// Проверка победы
function checkWin() {
    return board.every(row => row.every(cell => cell.revealed || cell.mine));
}

// Показать все мины
function revealAllMines() {
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.mine) {
                cell.revealed = true;
            }
        });
    });
}

// Сброс игры
resetButton.addEventListener("click", initGame);

// Инициализация игры при загрузке
initGame();
