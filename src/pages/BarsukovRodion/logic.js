import { CELL_CONTENT, CELL_STATE } from './constants.js';

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

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].type !== CELL_CONTENT.MINE) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            if (grid[nr][nc].type === CELL_CONTENT.MINE) count++;
                        }
                    }
                }
                grid[r][c].neighborMines = count;
            }
        }
    }

    return grid;
}
