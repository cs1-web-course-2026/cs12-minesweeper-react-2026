import { GAME_STATUS } from './constants'
import { useGameState } from './hooks/useGameState'
import { useTimer } from './hooks/useTimer'

import Board from './components/Board'
import GameStatus from './components/GameStatus'
import RestartButton from './components/RestartButton'
import Timer from './components/Timer'

import styles from './Game.module.css'

export default function KoryaginNazar() {
  const {
    board,
    gameStatus,
    gameMessage,
    resetCounter,
    minesRemaining,
    handleRestart,
    handleRevealCell,
    handleToggleFlag,
  } = useGameState()

  const elapsedSeconds = useTimer(gameStatus === GAME_STATUS.PLAYING, resetCounter)

  return (
    <div className={styles.page}>
      <section className={styles.gameCard} aria-label="Minesweeper game">
        <header className={styles.header}>
          <div className={styles.indicatorBlock}>
            <span className={styles.indicatorLabel}>Mines</span>
            <output className={styles.indicatorValue} aria-live="polite">
              {String(Math.max(0, minesRemaining)).padStart(3, '0')}
            </output>
          </div>

          <RestartButton gameStatus={gameStatus} onRestart={handleRestart} />

          <div className={styles.indicatorBlock}>
            <span className={styles.indicatorLabel}>Time</span>
            <Timer elapsedSeconds={elapsedSeconds} />
          </div>
        </header>

        <main className={styles.main}>
          <Board
            board={board}
            onCellClick={handleRevealCell}
            onCellRightClick={handleToggleFlag}
          />
          <GameStatus gameStatus={gameStatus} gameMessage={gameMessage} />
        </main>
      </section>
    </div>
  )
}
