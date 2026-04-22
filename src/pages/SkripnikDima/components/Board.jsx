import React from 'react';
import Cell from './Cell';
import styles from './Board.module.css';

const Board = ({ field, onCellClick, onCellContext }) => {
  return (
    <div className={styles.boardContainer}>
      <div 
        className={styles.board} 
        style={{ 
          gridTemplateColumns: `repeat(${field[0].length}, 24px)`,
          gridTemplateRows: `repeat(${field.length}, 24px)` 
        }}
      >
        {field.map((row, rIdx) => 
          row.map((cell, cIdx) => (
            <Cell 
              key={`${rIdx}-${cIdx}`}
              data={cell}
              row={rIdx} 
              col={cIdx}
              onClick={() => onCellClick(rIdx, cIdx)}
              onContextMenu={(e) => {
                e.preventDefault();
                onCellContext(rIdx, cIdx);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
