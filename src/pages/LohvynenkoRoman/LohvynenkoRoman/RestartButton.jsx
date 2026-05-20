import React from 'react';
import styles from './index.module.css';

export default function RestartButton({ status, onRestart }) {
  let face = '🙂';
  if (status === 'lost') face = '😵';
  if (status === 'won') face = '😎';

  return (
    <button className={styles.restartBtn} onClick={onRestart}>
      {face}
    </button>
  );
}