import { CELL_STATE, CELL_CONTENT, DIRECTIONS } from '../constants';

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      state: CELL_STATE.CLOSED,
      content: CELL_CONTENT.EMPTY,
      adjacentMinesCount: 0,
      exploded: false,
      wrongFlag: false,
    }))
  );
}

export function placeMines(board, mineCount, rows, cols, excludeRow, excludeCol) {
  const newBoard = cloneBoard(board);

  const allowedPositions = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const isExcluded = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1;
      if (!isExcluded) {
        allowedPositions.push({ row, col });
      }
    }
  }

  for (let positionIndex = allowedPositions.length - 1; positionIndex > 0; positionIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (positionIndex + 1));
    const temp = allowedPositions[positionIndex];
    allowedPositions[positionIndex] = allowedPositions[randomIndex];
    allowedPositions[randomIndex] = temp;
  }

  const minesToPlace = Math.min(mineCount, allowedPositions.length);

  for (let mineIndex = 0; mineIndex < minesToPlace; mineIndex += 1) {
    const position = allowedPositions[mineIndex];
    newBoard[position.row][position.col].content = CELL_CONTENT.MINE;
  }

  return newBoard;
}

export function calculateAdjacentMines(board, rows, cols) {
  const newBoard = cloneBoard(board);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (newBoard[row][col].content === CELL_CONTENT.MINE) {
        continue;
      }

      let adjacentMinesCount = 0;

      for (const direction of DIRECTIONS) {
        const neighbourRow = row + direction.row;
        const neighbourCol = col + direction.col;

        if (
          isInBounds(neighbourRow, neighbourCol, rows, cols) &&
          newBoard[neighbourRow][neighbourCol].content === CELL_CONTENT.MINE
        ) {
          adjacentMinesCount += 1;
        }
      }

      newBoard[row][col].adjacentMinesCount = adjacentMinesCount;
    }
  }

  return newBoard;
}

export function createBoard(rows, cols, mineCount, excludeRow, excludeCol) {
  let board = createEmptyBoard(rows, cols);
  board = placeMines(board, mineCount, rows, cols, excludeRow, excludeCol);
  board = calculateAdjacentMines(board, rows, cols);
  return board;
}

export function toggleFlag(board, row, col) {
  const newBoard = board.map((boardRow) => [...boardRow]);
  const cell = newBoard[row][col];

  if (cell.state === CELL_STATE.CLOSED) {
    newBoard[row][col] = { ...cell, state: CELL_STATE.FLAGGED };
  } else if (cell.state === CELL_STATE.FLAGGED) {
    newBoard[row][col] = { ...cell, state: CELL_STATE.CLOSED };
  }

  return newBoard;
}

export function floodFillReveal(board, row, col, rows, cols) {
  const newBoard = board.map((boardRow) => [...boardRow]);
  const queue = [[row, col]];
  let queueIndex = 0;
  const visited = new Set();

  while (queueIndex < queue.length) {
    const [currentRow, currentCol] = queue[queueIndex];
    queueIndex += 1;
    const key = `${currentRow}-${currentCol}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (!isInBounds(currentRow, currentCol, rows, cols)) {
      continue;
    }

    const cell = newBoard[currentRow][currentCol];

    if (cell.state === CELL_STATE.FLAGGED || cell.state === CELL_STATE.OPEN) {
      continue;
    }

    newBoard[currentRow][currentCol] = { ...cell, state: CELL_STATE.OPEN };

    if (cell.adjacentMinesCount === 0 && cell.content !== CELL_CONTENT.MINE) {
      for (const direction of DIRECTIONS) {
        const neighbourRow = currentRow + direction.row;
        const neighbourCol = currentCol + direction.col;
        const neighbourKey = `${neighbourRow}-${neighbourCol}`;

        if (!visited.has(neighbourKey)) {
          queue.push([neighbourRow, neighbourCol]);
        }
      }
    }
  }

  return newBoard;
}

export function revealCell(board, row, col, rows, cols) {
  const newBoard = board.map((boardRow) => [...boardRow]);
  const cell = newBoard[row][col];

  if (cell.state === CELL_STATE.FLAGGED || cell.state === CELL_STATE.OPEN) {
    return newBoard;
  }

  if (cell.content === CELL_CONTENT.MINE) {
    newBoard[row][col] = { ...cell, state: CELL_STATE.OPEN };
    return newBoard;
  }

  if (cell.adjacentMinesCount === 0) {
    return floodFillReveal(newBoard, row, col, rows, cols);
  }

  newBoard[row][col] = { ...cell, state: CELL_STATE.OPEN };
  return newBoard;
}

export function countFlagsPlaced(board) {
  let count = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CELL_STATE.FLAGGED) {
        count += 1;
      }
    }
  }

  return count;
}

export function checkWinCondition(board, rows, cols, mineCount) {
  let revealedCellsCount = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cell = board[row][col];

      if (cell.state === CELL_STATE.OPEN && cell.content !== CELL_CONTENT.MINE) {
        revealedCellsCount += 1;
      }
    }
  }

  return revealedCellsCount === rows * cols - mineCount;
}

export function revealAllMines(board) {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.content === CELL_CONTENT.MINE) {
        if (cell.state === CELL_STATE.FLAGGED) {
          return cell;
        }

        return { ...cell, state: CELL_STATE.OPEN };
      }

      if (cell.state === CELL_STATE.FLAGGED) {
        return { ...cell, wrongFlag: true };
      }

      return cell;
    })
  );
}

export function flagAllMines(board) {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.content === CELL_CONTENT.MINE && cell.state !== CELL_STATE.FLAGGED) {
        return { ...cell, state: CELL_STATE.FLAGGED };
      }

      return cell;
    })
  );
}
