import React from 'react';
import styles from './Header.module.css';
import Timer from './Timer';
import MinesCounter from './MinesCounter';
import RestartButton from './RestartButton';

const Header = ({ time, status, minesCount, flagsCount, onRestart }) => {
  return (
    <div className={styles.header}>
      <MinesCounter count={minesCount - flagsCount} />
      <RestartButton status={status} onClick={onRestart} />
      <Timer value={time} />
    </div>
  );
};

export default Header;
