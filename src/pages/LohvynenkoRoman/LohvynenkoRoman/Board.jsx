import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

export default function Board({ boardData, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.board}>
      {boardData.map((row, rIdx) => (
        <div key={rIdx} className={styles.row}>
          {row.map((cell, cIdx) => (
            <Cell 
              key={`${rIdx}-${cIdx}`} 
              data={cell} 
              onClick={() => onCellClick(cell.row, cell.col)}
              onContextMenu={(e) => onCellRightClick(e, cell.row, cell.col)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}