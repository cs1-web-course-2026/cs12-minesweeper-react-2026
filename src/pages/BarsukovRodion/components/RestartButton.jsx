import React from 'react';
import { GAME_STATUS } from '../constants.js';
import styles from './RestartButton.module.css';

export default function RestartButton({ status, onReset }) {
    let resetEmoji = '🙂';
    if (status === GAME_STATUS.LOST) resetEmoji = '😵';
    if (status === GAME_STATUS.WON) resetEmoji = '😎';

    return (
        <button
            className={styles.resetButton}
            type="button"
            aria-label="Restart game"
            title="Restart game"
            onClick={onReset}
        >
            {resetEmoji}
        </button>
    );
}
