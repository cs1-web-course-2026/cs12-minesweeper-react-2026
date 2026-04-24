export const CELL_STATE = Object.freeze({
    OPEN: 'open',
    CLOSED: 'closed',
    FLAGGED: 'flagged',
});

export const GAME_STATUS = Object.freeze({
    PLAYING: 'playing',
    WON: 'won',
    LOST: 'lost',
});

export const CELL_CONTENT = Object.freeze({
    MINE: 'mine',
    EMPTY: 'empty',
});

export const DEFAULT_CONFIG = Object.freeze({
    rows: 10,
    cols: 10,
    minesCount: 15,
});

export const NEIGHBOUR_DIRECTIONS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];
