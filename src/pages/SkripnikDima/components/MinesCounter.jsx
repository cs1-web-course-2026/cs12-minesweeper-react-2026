import React from 'react';
import styles from './Timer.module.css';

const MinesCounter = ({ count }) => {
  return (
    <div className={styles.lcd}>
      {String(Math.max(0, count)).padStart(3, '0')}
    </div>
  );
};

export default MinesCounter;
