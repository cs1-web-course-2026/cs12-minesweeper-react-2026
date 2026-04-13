import { CELL_CONTENT, CELL_STATE, GAME_STATUS } from './constants.js';

export function generateField(rows, cols, minesCount) {
    const maxMines = rows * cols;
    const safeMinesCount = Math.min(minesCount, maxMines);

    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            type: CELL_CONTENT.EMPTY,
            neighborMines: 0,
            state: CELL_STATE.CLOSED,
            exploded: false,
            revealedWrong: false,
        }))
    );

    let placed = 0;
    while (placed < safeMinesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (grid[row][col].type !== CELL_CONTENT.MINE) {
            grid[row][col].type = CELL_CONTENT.MINE;
            placed++;
        }
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col].type !== CELL_CONTENT.MINE) {
                let count = 0;
                for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
                    for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
                        if (directionalRow === 0 && directionalCol === 0) continue;
                        const neighbourRow = row + directionalRow;
                        const neighbourCol = col + directionalCol;
                        if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
                            if (grid[neighbourRow][neighbourCol].type === CELL_CONTENT.MINE) count++;
                        }
                    }
                }
                grid[row][col].neighborMines = count;
            }
        }
    }

    return grid;
}

export function revealCellLogic(field, targetRow, targetCol, rows, cols, minesCount) {
    let newField = field.map(row => row.map(cell => ({ ...cell })));
    let isLost = false;

    const reveal = (row, col) => {
        const curCell = newField[row][col];
        if (curCell.state === CELL_STATE.OPENED || curCell.state === CELL_STATE.FLAGGED) return;
        curCell.state = CELL_STATE.OPENED;

        if (curCell.type !== CELL_CONTENT.MINE && curCell.neighborMines === 0) {
            for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
                for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
                    if (directionalRow === 0 && directionalCol === 0) continue;
                    const neighbourRow = row + directionalRow;
                    const neighbourCol = col + directionalCol;
                    if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
                        reveal(neighbourRow, neighbourCol);
                    }
                }
            }
        }
    };

    reveal(targetRow, targetCol);

    let openedCount = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (newField[row][col].state === CELL_STATE.OPENED) {
                openedCount++;
                if (newField[row][col].type === CELL_CONTENT.MINE) {
                    isLost = true;
                    newField[row][col].exploded = true;
                }
            }
        }
    }

    let status = GAME_STATUS.PLAYING; 
    let isWon = openedCount === rows * cols - minesCount;

    if (isLost) {
        status = GAME_STATUS.LOST;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cellItem = newField[row][col];
                if (cellItem.state === CELL_STATE.FLAGGED && cellItem.type !== CELL_CONTENT.MINE) {
                    cellItem.revealedWrong = true;
                }
                if (cellItem.type === CELL_CONTENT.MINE && !cellItem.exploded) {
                    cellItem.state = CELL_STATE.OPENED;
                }
            }
        }
    } else if (isWon) {
        status = GAME_STATUS.WON;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newField[row][col].type === CELL_CONTENT.MINE && newField[row][col].state !== CELL_STATE.FLAGGED) {
                    newField[row][col].state = CELL_STATE.FLAGGED;
                }
            }
        }
    }

    return { newField, status };
}
