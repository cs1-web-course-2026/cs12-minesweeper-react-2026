import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Cell({ cell, onClick, onContextMenu }) {
  const classNames = [styles.cell];
  let content = '';

  if (cell.state === 'opened' || cell.state === 'exploded') {
    classNames.push(styles.open);
    
    if (cell.state === 'exploded') {
      classNames.push(styles.exploded);
      content = '💥';
    } else if (cell.type === 'mine') {
      classNames.push(styles.mine);
      content = '💣';
    } else if (cell.neighborMines > 0) {
      content = cell.neighborMines;
      if (styles[`count_${cell.neighborMines}`]) {
        classNames.push(styles[`count_${cell.neighborMines}`]);
      }
    }
  } else if (cell.state === 'flagged') {
    classNames.push(styles.flag);
    content = '🚩';
  }

  return (
    <div 
      className={classNames.join(' ')}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  );
}