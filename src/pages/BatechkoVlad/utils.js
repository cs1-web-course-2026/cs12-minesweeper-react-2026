export function generateField(rows, cols, minesCount) {
  const arr = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        type: 'empty',
        state: 'closed',
        neighborMines: 0,
        r,
        c
      });
    }
    arr.push(row);
  }

  let plantedMines = 0;
  while (plantedMines < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (arr[r][c].type !== 'mine') {
      arr[r][c].type = 'mine';
      plantedMines++;
    }
  }
  return arr;
}

export function countNeighbourMines(field, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === 'mine') continue;
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const nr = r + i;
          const nc = c + j;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (field[nr][nc].type === 'mine') count++;
          }
        }
      }
      field[r][c].neighborMines = count;
    }
  }
}