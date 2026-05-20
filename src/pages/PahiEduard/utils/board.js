import { CELL_TYPE, CELL_STATE } from '../constants'

export function generateField(rows, cols, minesCount, safeCell = null) {
  const field = []
  for (let row = 0; row < rows; row++) {
    field[row] = []
    for (let col = 0; col < cols; col++) {
      field[row][col] = {
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
        isHit: false,
      }
    }
  }

  let placed = 0
  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)
    if (field[row][col].type === CELL_TYPE.MINE) continue
    if (safeCell && safeCell.row === row && safeCell.col === col) continue
    field[row][col].type = CELL_TYPE.MINE
    placed++
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === CELL_TYPE.MINE) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (field[nr][nc].type === CELL_TYPE.MINE) count++
          }
        }
      }
      field[row][col].neighborMines = count
    }
  }

  return field
}

export function openCellRecursive(field, rows, cols, row, col) {
  const cell = field[row][col]
  if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return
  cell.state = CELL_STATE.OPENED
  if (cell.neighborMines === 0 && cell.type === CELL_TYPE.EMPTY) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          openCellRecursive(field, rows, cols, nr, nc)
        }
      }
    }
  }
}

export function checkWin(field, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = field[row][col]
      if (cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED) return false
    }
  }
  return true
}
