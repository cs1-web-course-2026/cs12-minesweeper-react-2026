import React, { useCallback } from 'react';
import { useGameState } from './hooks/useGameState.js';

import Board from './components/Board.jsx';
import Timer from './components/Timer.jsx';
import GameStatus from './components/GameStatus.jsx';
import RestartButton from './components/RestartButton.jsx';

import styles from './Minesweeper.module.css';

export default function Minesweeper() {
    const { state, restart, revealCell, toggleFlag } = useGameState();
    const { field, status, flagsPlaced, resetCounter, config } = state;
    const { minesCount } = config;

    const handleCellClick = useCallback((row, col) => {
        revealCell(row, col);
    }, [revealCell]);

    const handleCellContextMenu = useCallback((event, row, col) => {
        event.preventDefault();
        toggleFlag(row, col);
    }, [toggleFlag]);

    const handleReset = () => {
        restart();
    };

    let flagsLeft = minesCount - flagsPlaced;

    return (
        <div className={styles.gameContainer}>
            <div className={styles.game}>
                <header className={styles.gameHeader} aria-label="Game control panel">
                    <div className={styles.headerItem}>
                        <span className={styles.label}>Flags</span>
                        <output className={styles.value} aria-live="polite">
                            {flagsLeft.toString().padStart(3, '0')}
                        </output>
                    </div>

                    <RestartButton status={status} onReset={handleReset} />

                    <div className={styles.headerItem}>
                        <span className={styles.label}>Time</span>
                        <Timer status={status} onReset={resetCounter} />
                    </div>
                </header>
                <main className={styles.gameMain}>
                    <Board
                        field={field}
                        onCellClick={handleCellClick}
                        onCellContextMenu={handleCellContextMenu}
                    />
                    <GameStatus status={status} />
                </main>
            </div>
        </div>
    );
}
