import {
    ACTION_TYPE,
    CELL_CONTENT,
    CELL_STATE,
    DEFAULT_CONFIG,
    GAME_STATUS,
    NEIGHBOUR_DIRECTIONS,
} from './constants.js';

function isInsideBoard(rows, cols, row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

function createEmptyField(rows, cols) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            type: CELL_CONTENT.EMPTY,
            state: CELL_STATE.CLOSED,
            neighbourMines: 0,
        }))
    );
}

function toPositiveInt(value, fallback) {
    const parsed = Math.trunc(Number(value));
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }

    return parsed;
}

function toNonNegativeInt(value, fallback) {
    const parsed = Math.trunc(Number(value));
    if (!Number.isFinite(parsed) || parsed < 0) {
        return fallback;
    }

    return parsed;
}

function countMinesInField(field) {
    let mines = 0;

    for (let row = 0; row < field.length; row += 1) {
        for (let col = 0; col < (field[row]?.length ?? 0); col += 1) {
            if (field[row][col].type === CELL_CONTENT.MINE) {
                mines += 1;
            }
        }
    }

    return mines;
}

export function populateNeighbourMineCounts(field) {
    const rows = field.length;
    const cols = field[0]?.length ?? 0;

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            const cell = field[row][col];
            if (cell.type === CELL_CONTENT.MINE) {
                continue;
            }

            let mines = 0;

            for (const [deltaRow, deltaCol] of NEIGHBOUR_DIRECTIONS) {
                const nextRow = row + deltaRow;
                const nextCol = col + deltaCol;
                const inside = isInsideBoard(rows, cols, nextRow, nextCol);

                if (inside && field[nextRow][nextCol].type === CELL_CONTENT.MINE) {
                    mines += 1;
                }
            }

            cell.neighbourMines = mines;
        }
    }

    return field;
}

export function generateField(rows, cols, minesCount) {
    const safeRows = Math.max(0, Math.trunc(rows));
    const safeCols = Math.max(0, Math.trunc(cols));
    const maxMines = safeRows * safeCols;
    const minesToPlace = Math.min(Math.max(0, Math.trunc(minesCount)), maxMines);
    const field = createEmptyField(safeRows, safeCols);

    let placedMines = 0;

    while (placedMines < minesToPlace) {
        const row = Math.floor(Math.random() * safeRows);
        const col = Math.floor(Math.random() * safeCols);

        if (field[row][col].type !== CELL_CONTENT.MINE) {
            field[row][col].type = CELL_CONTENT.MINE;
            placedMines += 1;
        }
    }

    return populateNeighbourMineCounts(field);
}

function cloneField(field) {
    return field.map((row) => row.map((cell) => ({ ...cell })));
}

function openCellRecursive(field, rows, cols, row, col) {
    if (!isInsideBoard(rows, cols, row, col)) {
        return null;
    }

    const cell = field[row][col];
    if (cell.state === CELL_STATE.OPEN || cell.state === CELL_STATE.FLAGGED) {
        return null;
    }

    cell.state = CELL_STATE.OPEN;

    if (cell.type === CELL_CONTENT.MINE) {
        return { lost: true, explodedCell: { row, col } };
    }

    if (cell.neighbourMines === 0) {
        for (const [deltaRow, deltaCol] of NEIGHBOUR_DIRECTIONS) {
            const result = openCellRecursive(field, rows, cols, row + deltaRow, col + deltaCol);
            if (result?.lost) {
                return result;
            }
        }
    }

    return null;
}

function checkWinCondition(field, rows, cols, minesCount) {
    const safeCells = rows * cols - minesCount;
    let openedSafeCells = 0;

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            const cell = field[row][col];
            if (cell.type !== CELL_CONTENT.MINE && cell.state === CELL_STATE.OPEN) {
                openedSafeCells += 1;
            }
        }
    }

    return openedSafeCells === safeCells;
}

export function formatCounter(value) {
    return String(value).padStart(3, '0');
}

export function createInitialState(config = DEFAULT_CONFIG) {
    const rows = toPositiveInt(config?.rows, DEFAULT_CONFIG.rows);
    const cols = toPositiveInt(config?.cols, DEFAULT_CONFIG.cols);
    const mines = toNonNegativeInt(config?.minesCount, DEFAULT_CONFIG.minesCount);
    const field = generateField(rows, cols, mines);

    return {
        rows,
        cols,
        minesCount: countMinesInField(field),
        flagsPlaced: 0,
        status: GAME_STATUS.PLAYING,
        gameTime: 0,
        hasInteracted: false,
        explodedCell: null,
        field,
    };
}

export function gameReducer(state, action) {
    switch (action.type) {
        case ACTION_TYPE.RESTART: {
            const nextConfig = action.payload ?? {
                rows: state.rows,
                cols: state.cols,
                minesCount: state.minesCount,
            };

            return createInitialState(nextConfig);
        }

        case ACTION_TYPE.OPEN_CELL: {
            if (state.status !== GAME_STATUS.PLAYING) {
                return state;
            }

            const { row, col } = action.payload;
            if (!isInsideBoard(state.rows, state.cols, row, col)) {
                return state;
            }

            const currentCell = state.field[row][col];
            if (currentCell.state === CELL_STATE.OPEN || currentCell.state === CELL_STATE.FLAGGED) {
                return state;
            }

            const nextField = cloneField(state.field);
            const openResult = openCellRecursive(nextField, state.rows, state.cols, row, col);

            if (openResult?.lost) {
                return {
                    ...state,
                    field: nextField,
                    status: GAME_STATUS.LOST,
                    hasInteracted: true,
                    explodedCell: openResult.explodedCell,
                };
            }

            const won = checkWinCondition(nextField, state.rows, state.cols, state.minesCount);

            return {
                ...state,
                field: nextField,
                status: won ? GAME_STATUS.WON : GAME_STATUS.PLAYING,
                hasInteracted: true,
            };
        }

        case ACTION_TYPE.TOGGLE_FLAG: {
            if (state.status !== GAME_STATUS.PLAYING) {
                return state;
            }

            const { row, col } = action.payload;
            if (!isInsideBoard(state.rows, state.cols, row, col)) {
                return state;
            }

            const currentCell = state.field[row][col];
            if (currentCell.state === CELL_STATE.OPEN) {
                return state;
            }

            const nextField = cloneField(state.field);
            const nextCell = nextField[row][col];

            if (nextCell.state === CELL_STATE.CLOSED) {
                const flagsLeft = state.minesCount - state.flagsPlaced;
                if (flagsLeft === 0) {
                    return state;
                }

                nextCell.state = CELL_STATE.FLAGGED;

                return {
                    ...state,
                    field: nextField,
                    flagsPlaced: state.flagsPlaced + 1,
                    hasInteracted: true,
                };
            }

            if (nextCell.state === CELL_STATE.FLAGGED) {
                nextCell.state = CELL_STATE.CLOSED;

                return {
                    ...state,
                    field: nextField,
                    flagsPlaced: state.flagsPlaced - 1,
                    hasInteracted: true,
                };
            }

            return state;
        }

        case ACTION_TYPE.TICK: {
            if (state.status !== GAME_STATUS.PLAYING || !state.hasInteracted) {
                return state;
            }

            return {
                ...state,
                gameTime: state.gameTime + 1,
            };
        }

        default:
            return state;
    }
}
