import React from 'react';
import styles from './Cell.module.css';
import { CELL_STATE, CELL_CONTENT } from '../gameLogic'

const Cell = ({ data, row, col, onClick, onContextMenu }) => {
  const { state, type, neighborMines } = data;

  const cellClass = `${styles.cell} ${state === CELL_STATE.OPENED ? styles.opened : ''} ${
    state === CELL_STATE.OPENED && type === CELL_CONTENT.MINE ? styles.mine : ''
  }`;

  const renderContent = () => {
    if (state === CELL_STATE.CLOSED) return null;
    if (state === CELL_STATE.FLAGGED) return '🚩';
    if (type === CELL_CONTENT.MINE) return '💣';
    return neighborMines > 0 ? neighborMines : '';
  };

  return (
    <button
      type="button"
      aria-label={`Row ${row + 1}, column ${col + 1}, ${state}`}
      className={cellClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span className={styles[`val-${neighborMines}`]}>{renderContent()}</span>
    </button>
  );
};

export default Cell;
