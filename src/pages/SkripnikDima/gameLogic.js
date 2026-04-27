export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
};

export const CELL_CONTENT = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const generateField = (rows, cols, minesCount) => {
  let field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_CONTENT.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (field[row][col].type !== CELL_CONTENT.MINE) {
      field[row][col].type = CELL_CONTENT.MINE;
      minesPlaced++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === CELL_CONTENT.MINE) continue;
      let count = 0;
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (field[row + rowOffset]?.[col + colOffset]?.type === CELL_CONTENT.MINE) count++;
        }
      }
      field[row][col].neighborMines = count;
    }
  }
  return field;
};

export const checkWin = (field, minesCount) => {
  const closedCount = field.flat().filter(c => c.state !== 'opened').length;
  return closedCount === minesCount;
};

export const openRecursive = (field ,row, col, rows, cols) => {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  const target = field[row][col];
  if (target.state !== CELL_STATE.CLOSED || target.type === CELL_CONTENT.MINE) return;

  target.state = CELL_STATE.OPENED;
  if (target.neighborMines === 0) {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        openRecursive(field, row + rowOffset, col + colOffset, rows, cols);
      }
    }
  }
};
