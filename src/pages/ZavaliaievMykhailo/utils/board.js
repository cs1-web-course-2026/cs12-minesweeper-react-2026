import { CELL_STATE } from '../constants'

const NEIGHBOURS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function createCell(row, col) {
  return {
    id: `${row}-${col}`,
    row,
    col,
    state: CELL_STATE.HIDDEN,
    hasMine: false,
    adjacentMines: 0,
    exploded: false,
    incorrectFlag: false,
  }
}

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => createCell(row, col)),
  )
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function isInside(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length
}

function eachNeighbour(board, row, col, callback) {
  for (const [rowOffset, colOffset] of NEIGHBOURS) {
    const nextRow = row + rowOffset
    const nextCol = col + colOffset

    if (isInside(board, nextRow, nextCol)) {
      callback(board[nextRow][nextCol], nextRow, nextCol)
    }
  }
}

export function addMines(board, mineCount, safeRow, safeCol) {
  const nextBoard = cloneBoard(board)
  const safeCells = new Set([`${safeRow}-${safeCol}`])

  eachNeighbour(nextBoard, safeRow, safeCol, (_cell, row, col) => {
    safeCells.add(`${row}-${col}`)
  })

  const candidates = nextBoard
    .flat()
    .filter((cell) => !safeCells.has(cell.id))
    .map((cell) => cell.id)

  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]]
  }

  candidates.slice(0, mineCount).forEach((cellId) => {
    const [row, col] = cellId.split('-').map(Number)
    nextBoard[row][col].hasMine = true
  })

  return countAdjacentMines(nextBoard)
}

function countAdjacentMines(board) {
  const nextBoard = cloneBoard(board)

  for (const row of nextBoard) {
    for (const cell of row) {
      if (cell.hasMine) {
        continue
      }

      let count = 0
      eachNeighbour(nextBoard, cell.row, cell.col, (neighbour) => {
        if (neighbour.hasMine) {
          count += 1
        }
      })
      cell.adjacentMines = count
    }
  }

  return nextBoard
}

export function openCell(board, row, col) {
  const nextBoard = cloneBoard(board)
  const targetCell = nextBoard[row][col]

  if (targetCell.state !== CELL_STATE.HIDDEN) {
    return { board: nextBoard, hitMine: false }
  }

  if (targetCell.hasMine) {
    targetCell.state = CELL_STATE.OPEN
    targetCell.exploded = true
    return { board: nextBoard, hitMine: true }
  }

  const stack = [[row, col]]
  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop()
    const cell = nextBoard[currentRow][currentCol]

    if (cell.state !== CELL_STATE.HIDDEN) {
      continue
    }

    cell.state = CELL_STATE.OPEN

    if (cell.adjacentMines > 0) {
      continue
    }

    eachNeighbour(nextBoard, currentRow, currentCol, (neighbour, nextRow, nextCol) => {
      if (neighbour.state === CELL_STATE.HIDDEN && !neighbour.hasMine) {
        stack.push([nextRow, nextCol])
      }
    })
  }

  return { board: nextBoard, hitMine: false }
}

export function toggleFlag(board, row, col) {
  const nextBoard = cloneBoard(board)
  const cell = nextBoard[row][col]

  if (cell.state === CELL_STATE.OPEN) {
    return nextBoard
  }

  cell.state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.HIDDEN : CELL_STATE.FLAGGED
  return nextBoard
}

export function revealMines(board) {
  const nextBoard = cloneBoard(board)

  for (const row of nextBoard) {
    for (const cell of row) {
      if (cell.hasMine) {
        cell.state = CELL_STATE.OPEN
      }

      if (!cell.hasMine && cell.state === CELL_STATE.FLAGGED) {
        cell.incorrectFlag = true
      }
    }
  }

  return nextBoard
}

export function markMines(board) {
  const nextBoard = cloneBoard(board)

  for (const row of nextBoard) {
    for (const cell of row) {
      if (cell.hasMine) {
        cell.state = CELL_STATE.FLAGGED
      }
    }
  }

  return nextBoard
}

export function countFlags(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length
}

export function hasWon(board) {
  return board.flat().every((cell) => cell.hasMine || cell.state === CELL_STATE.OPEN)
}
