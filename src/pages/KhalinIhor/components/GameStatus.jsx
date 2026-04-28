import { GAME_STATUS } from '../constants.js';
import styles from './GameStatus.module.css';

function getStatusMessage(status) {
    if (status === GAME_STATUS.WON) {
        return 'Victory! All safe cells are opened.';
    }

    if (status === GAME_STATUS.LOST) {
        return 'Defeat! You stepped on a mine.';
    }

    return '';
}

export default function GameStatus({ status }) {
    const stateClass =
        status === GAME_STATUS.WON ? styles.win : status === GAME_STATUS.LOST ? styles.lose : '';

    return (
        <p className={[styles.gameMessage, stateClass].filter(Boolean).join(' ')} role="status" aria-live="polite">
            {getStatusMessage(status)}
        </p>
    );
}
