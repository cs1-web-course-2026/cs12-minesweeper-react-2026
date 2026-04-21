import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ data, onClick, onContextMenu }) => {
  const { state, type, neighborMines } = data;

  const cellClass = `${styles.cell} ${state === 'opened' ? styles.opened : ''} ${
    state === 'opened' && type === 'mine' ? styles.mine : ''
  }`;

  const renderContent = () => {
    if (state === 'closed') return null;
    if (state === 'flagged') return '🚩';
    if (type === 'mine') return '💣';
    return neighborMines > 0 ? neighborMines : '';
  };

  return (
    <button
      className={cellClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span className={styles[`val-${neighborMines}`]}>{renderContent()}</span>
    </button>
  );
};

export default Cell;
