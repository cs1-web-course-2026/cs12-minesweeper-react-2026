export const generateField = (rows, cols, minesCount) => {
  let field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (field[row][col].type !== 'mine') {
      field[row][col].type = 'mine';
      minesPlaced++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === 'mine') continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (field[row + i]?.[col + j]?.type === 'mine') count++;
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
  const target = newField[row][col];
  if (target.state !== 'closed' || target.type === 'mine') return;

  target.state = 'opened';
  if (target.neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        openRecursive(field, row + i, col + j, rows, cols);
    }
  }
};
