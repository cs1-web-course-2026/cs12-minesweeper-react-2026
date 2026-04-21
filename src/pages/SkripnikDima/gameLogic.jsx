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
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (field[r][c].type !== 'mine') {
      field[r][c].type = 'mine';
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === 'mine') continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (field[r + i]?.[c + j]?.type === 'mine') count++;
        }
      }
      field[r][c].neighborMines = count;
    }
  }
  return field;
};
