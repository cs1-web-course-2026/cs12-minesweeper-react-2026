export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
}

export const CELL_CONTENT = {
  MINE: 'mine',
  EMPTY: 'empty',
}

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
}

export const DEFAULT_GAME_CONFIG = {
  rows: 9,
  cols: 9,
  mineCount: 10,
}

export const STATUS_MESSAGE = {
  [GAME_STATUS.IDLE]: 'Click any cell to start game',
  [GAME_STATUS.PLAYING]: 'Game in progress',
  [GAME_STATUS.WON]: 'You won! Great job.',
  [GAME_STATUS.LOST]: 'You hit a mine. Try again.',
}
