import { GAME_STATUS } from '../constants';
import styles from './GameStatus.module.css';

function GameStatus({ gameStatus, helpMessage }) {
  const getStatusMessage = () => {
    if (helpMessage) {
      return helpMessage;
    }

    switch (gameStatus) {
      case GAME_STATUS.WON:
        return 'You win!';
      case GAME_STATUS.LOST:
        return 'Boom! You hit a mine.';
      default:
        return '';
    }
  };

  const statusClassName = [
    styles.statusMessage,
    gameStatus === GAME_STATUS.WON ? styles.won : '',
    gameStatus === GAME_STATUS.LOST ? styles.lost : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={statusClassName} role="status" aria-live="polite">
      {getStatusMessage()}
    </div>
  );
}

export default GameStatus;
