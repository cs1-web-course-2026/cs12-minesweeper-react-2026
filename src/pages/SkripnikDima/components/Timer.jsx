import React from 'react';
import styles from './Timer.module.css';

const Timer = ({ value }) => {
  return (
    <div className={styles.lcd}>
      {String(value).padStart(3, '0')}
    </div>
  );
};

export default Timer;
