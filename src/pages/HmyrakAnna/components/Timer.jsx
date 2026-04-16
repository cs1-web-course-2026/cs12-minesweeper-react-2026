import { useEffect } from 'react';
import { GAME_STATUS } from '../constants';
import styles from './Timer.module.css';

function formatCounter(value) {
  const numericValue = Number.isFinite(value) ? Math.floor(value) : 0;
  return String(Math.max(0, numericValue)).padStart(3, '0');
}

function Timer({ elapsedSeconds, gameStatus, onTick }) {
  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) {
      return;
    }

    const interval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, onTick]);

  return (
    <div className={styles.counter} aria-label={`Timer ${formatCounter(elapsedSeconds)}`}>
      {formatCounter(elapsedSeconds)}
    </div>
  );
}

export default Timer;
