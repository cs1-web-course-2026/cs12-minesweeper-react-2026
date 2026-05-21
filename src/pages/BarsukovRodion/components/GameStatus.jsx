import React from 'react';
import { GAME_STATUS } from '../constants.js';
import styles from './GameStatus.module.css';

export default function GameStatus({ status }) {
    if (status === GAME_STATUS.IDLE || status === GAME_STATUS.PLAYING) {
        return null;
    }

    let statusText = '';
    let className = styles.gameStatus;

    if (status === GAME_STATUS.LOST) {
        statusText = 'Game over! You`ve hit a mine';
        className += ` ${styles.lose}`;
    } else if (status === GAME_STATUS.WON) {
        statusText = 'Win! You`ve cleared the field';
        className += ` ${styles.win}`;
    }

    return (
        <div className={className} role="status" aria-live="polite">
            {statusText}
        </div>
    );
}
