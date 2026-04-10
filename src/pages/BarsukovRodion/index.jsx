import React, { useState, useCallback } from 'react';
import { GAME_STATUS, CELL_CONTENT, CELL_STATE } from './constants.js';
import { generateField } from './logic.js';

import Board from './components/Board.jsx';
import Timer from './components/Timer.jsx';
import GameStatus from './components/GameStatus.jsx';
import RestartButton from './components/RestartButton.jsx';

import styles from './Minesweeper.module.css';

export default function Minesweeper() {
    const rows = 9;
    const cols = 9;
    const minesCount = 10;

    const [field, setField] = useState(() => generateField(rows, cols, minesCount));
    const [status, setStatus] = useState(GAME_STATUS.IDLE);
    const [flagsPlaced, setFlagsPlaced] = useState(0);
    const [resetCounter, setResetCounter] = useState(0);

    const cloneField = (f) => f.map(row => row.map(cell => ({ ...cell })));

    const handleCellClick = useCallback((r, c) => {
        setStatus(prevStatus => {
            if (prevStatus === GAME_STATUS.IDLE) return GAME_STATUS.PLAYING;
            return prevStatus;
        });

        if (status !== GAME_STATUS.IDLE && status !== GAME_STATUS.PLAYING) return;

        setField((prevField) => {
            const newField = cloneField(prevField);
            const targetCell = newField[r][c];

            if (targetCell.state === CELL_STATE.OPENED || targetCell.state === CELL_STATE.FLAGGED) {
                return prevField;
            }

            const reveal = (row, col, currentField) => {
                const curCell = currentField[row][col];
                if (curCell.state === CELL_STATE.OPENED || curCell.state === CELL_STATE.FLAGGED) return;
                curCell.state = CELL_STATE.OPENED;

                if (curCell.type !== CELL_CONTENT.MINE && curCell.neighborMines === 0) {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = row + dr;
                            const nc = col + dc;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                                reveal(nr, nc, currentField);
                            }
                        }
                    }
                }
            };

            reveal(r, c, newField);

            let isLost = false;
            let openedCount = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (newField[i][j].state === CELL_STATE.OPENED) {
                        openedCount++;
                        if (newField[i][j].type === CELL_CONTENT.MINE) {
                            isLost = true;
                            newField[i][j].exploded = true;
                        }
                    }
                }
            }

            if (isLost) {
                setStatus(GAME_STATUS.LOST);
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        const cellItem = newField[i][j];
                        if (cellItem.state === CELL_STATE.FLAGGED && cellItem.type !== CELL_CONTENT.MINE) {
                            cellItem.revealedWrong = true;
                        }
                        if (cellItem.type === CELL_CONTENT.MINE && !cellItem.exploded) {
                            cellItem.state = CELL_STATE.OPENED;
                        }
                    }
                }
            } else if (openedCount === rows * cols - minesCount) {
                setStatus(GAME_STATUS.WON);
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        if (newField[i][j].type === CELL_CONTENT.MINE && newField[i][j].state !== CELL_STATE.FLAGGED) {
                            newField[i][j].state = CELL_STATE.FLAGGED;
                        }
                    }
                }
                setFlagsPlaced(minesCount);
            }

            return newField;
        });
    }, [status, rows, cols, minesCount]);

    const handleCellContextMenu = useCallback((e, r, c) => {
        e.preventDefault();

        setStatus(prevStatus => {
            if (prevStatus === GAME_STATUS.IDLE) return GAME_STATUS.PLAYING;
            return prevStatus;
        });

        if (status !== GAME_STATUS.IDLE && status !== GAME_STATUS.PLAYING) return;

        const cell = field[r][c];

        if (cell.state === CELL_STATE.OPENED) return;

        if (cell.state === CELL_STATE.FLAGGED) {
            setFlagsPlaced((prev) => prev - 1);
            setField((prevField) => {
                const newField = prevField.map(row => row.map(cell => ({ ...cell })));
                newField[r][c].state = CELL_STATE.CLOSED;
                return newField;
            });
        } else {
            if (flagsPlaced >= minesCount) return;
            setFlagsPlaced((prev) => prev + 1);
            setField((prevField) => {
                const newField = prevField.map(row => row.map(cell => ({ ...cell })));
                newField[r][c].state = CELL_STATE.FLAGGED;
                return newField;
            });
        }
    }, [status, field, flagsPlaced, minesCount]);

    const handleReset = () => {
        setStatus(GAME_STATUS.IDLE);
        setFlagsPlaced(0);
        setField(generateField(rows, cols, minesCount));
        setResetCounter((prev) => prev + 1);
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
