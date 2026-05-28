import React from 'react';
import styles from './Minesweeper.module.css';

export default function StatusPanel({ minesCount, flagsCount, status, gameTime, onReset }) {
  const remainingMines = minesCount - flagsCount;
  
  let smile = '😊';
  if (status === 'won') smile = '😎';
  if (status === 'lost') smile = '😵';

  return (
    <header className={styles.statusPanel}>
      <div className={styles.counter}>
        {String(Math.max(0, remainingMines)).padStart(3, '0')}
      </div>
      <button
        className={styles.resetButton}
        type="button"
        onClick={onReset}
        aria-label="Перезапустити гру"
      >
        {smile}
      </button>
      <div className={styles.counter}>
        {String(gameTime).padStart(3, '0')}
      </div>
    </header>
  );
}
