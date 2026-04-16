import { useCallback, useMemo, useState } from 'react';

import { DIFFICULTY_LEVELS, GAME_STATUS } from './constants';
import { useGameState } from './hooks/useGameState';
import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';

import styles from './Game.module.css';

const HELP_TEXT = 'Controls: left click opens a cell, right click toggles a flag, Options switches difficulty.';

function formatCounter(value) {
  const numericValue = Number.isFinite(value) ? Math.floor(value) : 0;
  const sign = numericValue < 0 ? '-' : '';
  const absoluteValue = String(Math.abs(numericValue)).padStart(3, '0');
  return `${sign}${absoluteValue}`;
}

function Game() {
  const [helpMessage, setHelpMessage] = useState('');
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [isFacePressed, setIsFacePressed] = useState(false);

  const { state, revealCellHandler, toggleFlagHandler, restartGame, setDifficulty, incrementTimer } =
    useGameState();

  const difficultyLevels = useMemo(() => Object.values(DIFFICULTY_LEVELS), []);
  const minesRemaining = state.difficulty.mineCount - state.flagsPlaced;
  const boardPixelWidth = state.difficulty.cols * 31;

  const handleRestart = useCallback(() => {
    restartGame();
    setHelpMessage('');
    setIsFacePressed(false);
  }, [restartGame]);

  const handleOptions = useCallback(() => {
    const nextDifficultyIndex = (difficultyIndex + 1) % difficultyLevels.length;
    const nextDifficulty = difficultyLevels[nextDifficultyIndex];

    setDifficultyIndex(nextDifficultyIndex);
    setDifficulty(nextDifficulty);
    setHelpMessage(
      `Difficulty: ${nextDifficulty.label} (${nextDifficulty.rows}x${nextDifficulty.cols}, ${nextDifficulty.mineCount} mines)`
    );
  }, [difficultyIndex, difficultyLevels, setDifficulty]);

  const handleHelp = useCallback(() => {
    setHelpMessage(HELP_TEXT);
  }, []);

  const handleCellPressStart = useCallback(() => {
    if (state.gameStatus !== GAME_STATUS.WON && state.gameStatus !== GAME_STATUS.LOST) {
      setIsFacePressed(true);
    }
  }, [state.gameStatus]);

  const handleCellPressEnd = useCallback(() => {
    setIsFacePressed(false);
  }, []);

  const faceClassName = [
    styles.faceButton,
    isFacePressed ? styles.facePressed : '',
    state.gameStatus === GAME_STATUS.WON ? styles.faceWin : '',
    state.gameStatus === GAME_STATUS.LOST ? styles.faceLose : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className={styles.game}>
      <section className={styles.titleContainer} style={{ '--board-px-width': `${boardPixelWidth}px` }}>
        <div className={styles.menuBar}>
          <RestartButton onClick={handleRestart} className={styles.menuItem} />
          <button type="button" className={styles.menuItem} onClick={handleOptions}>
            Options
          </button>
          <button type="button" className={styles.menuItem} onClick={handleHelp}>
            Help
          </button>
        </div>

        <header className={styles.header}>
          <div className={styles.counter}>{formatCounter(minesRemaining)}</div>
          <button
            type="button"
            className={faceClassName}
            onClick={handleRestart}
            aria-label="Restart game"
          />
          <Timer elapsedSeconds={state.elapsedSeconds} gameStatus={state.gameStatus} onTick={incrementTimer} />
        </header>

        <div className={styles.field}>
          <Board
            board={state.board}
            onReveal={revealCellHandler}
            onFlag={toggleFlagHandler}
            onPressStart={handleCellPressStart}
            onPressEnd={handleCellPressEnd}
          />
        </div>

        <GameStatus
          gameStatus={state.gameStatus}
          minesRemaining={minesRemaining}
          helpMessage={helpMessage}
        />
      </section>
    </main>
  );
}

export default Game;
