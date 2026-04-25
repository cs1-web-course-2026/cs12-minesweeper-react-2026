import { CELL_CONTENT, CELL_STATE } from './constants'

const NEIGHBOUR_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function createInitialCell() {
  return {
    content: CELL_CONTENT.EMPTY,
    state: CELL_STATE.CLOSED,
    adjacentMineCount: 0,
    exploded: false,
    wrongFlag: false,
  }
}

function cloneBoard(board) {
  return board.map((boardRow) => boardRow.map((cell) => ({ ...cell })))
}

export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols
}

export function createBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createInitialCell()),
  )
}

export function placeMines(board, mineCount, safeRow, safeCol) {
  const rows = board.length
  const cols = board[0].length
  const boardWithMines = cloneBoard(board)

  const maxMinesWithoutSafeCell = Math.max(0, rows * cols - 1)
  const safeMineCount = Math.min(mineCount, maxMinesWithoutSafeCell)
  let placedMines = 0

  while (placedMines < safeMineCount) {
    const randomRow = Math.floor(Math.random() * rows)
    const randomCol = Math.floor(Math.random() * cols)

    if (randomRow === safeRow && randomCol === safeCol) {
      continue
    }

    if (boardWithMines[randomRow][randomCol].content === CELL_CONTENT.MINE) {
      continue
    }

    boardWithMines[randomRow][randomCol].content = CELL_CONTENT.MINE
    placedMines += 1
  }

  return calculateAdjacency(boardWithMines)
}

export function calculateAdjacency(board) {
  const rows = board.length
  const cols = board[0].length
  const updatedBoard = cloneBoard(board)

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (updatedBoard[row][col].content === CELL_CONTENT.MINE) {
        continue
      }

      let adjacentMineCount = 0

      for (const [directionalRow, directionalCol] of NEIGHBOUR_DIRECTIONS) {
        const neighbourRow = row + directionalRow
        const neighbourCol = col + directionalCol

        if (!isInBounds(neighbourRow, neighbourCol, rows, cols)) {
          continue
        }

        if (updatedBoard[neighbourRow][neighbourCol].content === CELL_CONTENT.MINE) {
          adjacentMineCount += 1
        }
      }

      updatedBoard[row][col].adjacentMineCount = adjacentMineCount
    }
  }

  return updatedBoard
}

function floodFillReveal(board, startRow, startCol) {
  const updatedBoard = cloneBoard(board)
  const rows = updatedBoard.length
  const cols = updatedBoard[0].length
  const stack = [[startRow, startCol]]

  while (stack.length > 0) {
    const [row, col] = stack.pop()
    const currentCell = updatedBoard[row][col]

    if (currentCell.state === CELL_STATE.OPEN || currentCell.state === CELL_STATE.FLAGGED) {
      continue
    }

    currentCell.state = CELL_STATE.OPEN

    if (currentCell.adjacentMineCount !== 0 || currentCell.content === CELL_CONTENT.MINE) {
      continue
    }

    for (const [directionalRow, directionalCol] of NEIGHBOUR_DIRECTIONS) {
      const neighbourRow = row + directionalRow
      const neighbourCol = col + directionalCol

      if (!isInBounds(neighbourRow, neighbourCol, rows, cols)) {
        continue
      }

      const neighbourCell = updatedBoard[neighbourRow][neighbourCol]
      if (neighbourCell.state !== CELL_STATE.CLOSED) {
        continue
      }

      stack.push([neighbourRow, neighbourCol])
    }
  }

  return updatedBoard
}

export function revealCell(board, targetRow, targetCol) {
  const targetCell = board[targetRow][targetCol]

  if (targetCell.state === CELL_STATE.FLAGGED || targetCell.state === CELL_STATE.OPEN) {
    return { updatedBoard: cloneBoard(board), didHitMine: false }
  }

  if (targetCell.content === CELL_CONTENT.MINE) {
    const updatedBoard = cloneBoard(board)
    const mineCell = updatedBoard[targetRow][targetCol]

    mineCell.state = CELL_STATE.OPEN
    mineCell.exploded = true
    return { updatedBoard, didHitMine: true }
  }

  const updatedBoard = floodFillReveal(board, targetRow, targetCol)
  return { updatedBoard, didHitMine: false }
}

export function toggleFlag(board, targetRow, targetCol) {
  const updatedBoard = cloneBoard(board)
  const targetCell = updatedBoard[targetRow][targetCol]

  if (targetCell.state === CELL_STATE.OPEN) {
    return updatedBoard
  }

  targetCell.state =
    targetCell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED

  return updatedBoard
}

export function countFlags(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length
}

export function checkWinCondition(board) {
  const openSafeCells = board
    .flat()
    .filter(
      (cell) =>
        cell.state === CELL_STATE.OPEN &&
        cell.content !== CELL_CONTENT.MINE,
    ).length

  const actualMineCount = board
    .flat()
    .filter((cell) => cell.content === CELL_CONTENT.MINE).length

  const totalCells = board.length * board[0].length
  return openSafeCells === totalCells - actualMineCount
}

export function revealBoardAfterLoss(board) {
  const updatedBoard = cloneBoard(board)

  for (const boardRow of updatedBoard) {
    for (const cell of boardRow) {
      if (cell.content === CELL_CONTENT.MINE && cell.state !== CELL_STATE.FLAGGED) {
        cell.state = CELL_STATE.OPEN
      }

      if (cell.content !== CELL_CONTENT.MINE && cell.state === CELL_STATE.FLAGGED) {
        cell.wrongFlag = true
      }
    }
  }

  return updatedBoard
}

export function flagAllMines(board) {
  const updatedBoard = cloneBoard(board)

  for (const boardRow of updatedBoard) {
    for (const cell of boardRow) {
      if (cell.content === CELL_CONTENT.MINE) {
        cell.state = CELL_STATE.FLAGGED
      }
    }
  }

  return updatedBoard
}
