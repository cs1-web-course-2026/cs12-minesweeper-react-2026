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

  for (let row = 0; row < rows; r++) {
    for (let col = 0; col < cols; c++) {
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
