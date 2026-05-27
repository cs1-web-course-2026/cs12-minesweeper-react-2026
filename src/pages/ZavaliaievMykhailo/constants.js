export const CELL_STATE = {
  HIDDEN: 'hidden',
  OPEN: 'open',
  FLAGGED: 'flagged',
}

export const GAME_STATE = {
  READY: 'ready',
  RUNNING: 'running',
  WON: 'won',
  LOST: 'lost',
}

export const GAME_CONFIG = {
  rows: 25,
  cols: 25,
  mines: 120,
}

export const STATUS_TEXT = {
  [GAME_STATE.READY]: 'Open any square to start',
  [GAME_STATE.RUNNING]: 'Clearing the field',
  [GAME_STATE.WON]: 'Field cleared',
  [GAME_STATE.LOST]: 'Mine triggered',
}
