export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
}

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
}

export const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose',
  ERROR: 'error',
}

export const DIFFICULTY_PRESETS = [
  { name: 'Beginner', rows: 8, cols: 8, minesCount: 10 },
  { name: 'Intermediate', rows: 12, cols: 12, minesCount: 24 },
  { name: 'Expert', rows: 16, cols: 16, minesCount: 40 },
]

export function createCell() {
  return {
    type: CELL_TYPE.EMPTY,
    state: CELL_STATE.CLOSED,
    neighborMines: 0,
    exploded: false,
    wrongFlag: false,
  }
}

export function createEmptyGrid(rows, cols) {
  const result = []
  for (let row = 0; row < rows; row++) {
    const currentRow = []
    for (let col = 0; col < cols; col++) {
      currentRow.push(createCell())
    }
    result.push(currentRow)
  }
  return result
}

export function inBounds(rows, cols, row, col) {
  return row >= 0 && row < rows && col >= 0 && col < cols
}

export function placeMines(grid, rows, cols, minesCount, excludeRow, excludeCol) {
  const allowedPositions = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isInclude = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1
      if (!isInclude) {
        allowedPositions.push({ row, col })
      }
    }
  }

  if (minesCount > allowedPositions.length) {
    throw new Error('Too many mines for the given field size and first click position.')
  }

  for (let i = allowedPositions.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = allowedPositions[i]
    allowedPositions[i] = allowedPositions[j]
    allowedPositions[j] = temp
  }

  for (let i = 0; i < minesCount; i++) {
    const position = allowedPositions[i]
    grid[position.row][position.col].type = CELL_TYPE.MINE
  }
}

export function countNeighbourMines(grid, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].type === CELL_TYPE.MINE) {
        continue
      }

      let count = 0
      for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
        for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
          const neighbourRow = row + directionalRow
          const neighbourCol = col + directionalCol
          if (
            inBounds(rows, cols, neighbourRow, neighbourCol) &&
            grid[neighbourRow][neighbourCol].type === CELL_TYPE.MINE
          ) {
            count++
          }
        }
      }

      grid[row][col].neighborMines = count
    }
  }
}

export function formatCounter(value) {
  const numericValue = Number.isFinite(value) ? Math.floor(value) : 0
  const sign = numericValue < 0 ? '-' : ''
  return sign + String(Math.abs(numericValue)).padStart(3, '0')
}

export function getCellClass(cell) {
  if (cell.state === CELL_STATE.FLAGGED) {
    return cell.wrongFlag ? 'flag-bang' : 'flag'
  }

  if (cell.state === CELL_STATE.OPENED) {
    if (cell.type === CELL_TYPE.MINE) {
      return cell.exploded ? 'open-cage mine-bang' : 'open-cage mine'
    }

    if (cell.neighborMines > 0) {
      return 'open-cage num' + cell.neighborMines
    }

    return 'open-cage'
  }

  return 'closed-cage'
}

export function getCellAriaLabel(cell, row, col) {
  const basePosition = 'Row ' + (row + 1) + ', column ' + (col + 1) + '. '

  if (cell.state === CELL_STATE.FLAGGED) {
    return basePosition + (cell.wrongFlag ? 'Wrong flag.' : 'Flagged cell.')
  }

  if (cell.state === CELL_STATE.CLOSED) {
    return basePosition + 'Closed cell.'
  }

  if (cell.type === CELL_TYPE.MINE) {
    return basePosition + (cell.exploded ? 'Exploded mine.' : 'Mine.')
  }

  if (cell.neighborMines > 0) {
    return basePosition + cell.neighborMines + ' neighboring mines.'
  }

  return basePosition + 'Open empty cell.'
}

export const DEFAULT_CONFIG = {
  rows: 8,
  cols: 8,
  minesCount: 10,
}
