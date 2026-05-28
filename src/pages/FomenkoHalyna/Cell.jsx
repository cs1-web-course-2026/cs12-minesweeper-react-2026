import React from 'react';
import styles from './Minesweeper.module.css';

export default function Cell({ cellData, onClick, onContextMenu }) {
  const { state, type, neighborMines, row, col } = cellData;

  let cellClass = styles.cell;
  if (state === 'opened') {
    cellClass += ` ${styles.open}`;
    if (type === 'mine') {
      cellClass += ` ${styles.mine}`;
    } else if (neighborMines > 0) {
      cellClass += ` ${styles[`n${neighborMines}`]}`;
    }
  } else if (state === 'flagged') {
    cellClass += ` ${styles.flag}`;
  }

  let cellLabel = `Рядок ${row + 1}, стовпець ${col + 1}, закрита`;
  if (state === 'flagged') {
    cellLabel = `Рядок ${row + 1}, стовпець ${col + 1}, прапорець`;
  } else if (state === 'opened' && type === 'mine') {
    cellLabel = `Рядок ${row + 1}, стовпець ${col + 1}, міна`;
  } else if (state === 'opened' && neighborMines > 0) {
    cellLabel = `Рядок ${row + 1}, стовпець ${col + 1}, ${neighborMines} мін поруч`;
  } else if (state === 'opened') {
    cellLabel = `Рядок ${row + 1}, стовпець ${col + 1}, порожня`;
  }

  return (
    <button
      type="button"
      className={cellClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={cellLabel}
    >
      {state === 'opened' && type !== 'mine' && neighborMines > 0 ? neighborMines : ''}
    </button>
  );
}
