export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

export const CELL_CONTENT = {
  MINE: 'mine',
  EMPTY: 'empty',
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    rows: 8,
    cols: 8,
    mineCount: 10,
    label: 'Beginner',
  },
  INTERMEDIATE: {
    rows: 16,
    cols: 16,
    mineCount: 40,
    label: 'Intermediate',
  },
  ADVANCED: {
    rows: 16,
    cols: 30,
    mineCount: 99,
    label: 'Advanced',
  },
};

export const DIRECTIONS = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
];
