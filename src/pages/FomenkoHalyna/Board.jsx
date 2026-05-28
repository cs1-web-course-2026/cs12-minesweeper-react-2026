import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

export default function Board({ field, rows, cols, onCellClick, onCellContextMenu }) {
  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
  };

  return (
    <main className={styles.gameGrid} style={gridStyle}>
      {field.map((rowArr, rowIndex) =>
        rowArr.map((cellData, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cellData={cellData}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onContextMenu={(e) => onCellContextMenu(e, rowIndex, colIndex)}
          />
        ))
      )}
    </main>
  );
}
