import { GAME_CONFIG, GAME_STATE } from './constants'
import { useMinesweeper } from './hooks/useMinesweeper'
import { useTimer } from './hooks/useTimer'

import Board from './components/Board'
import GameStatus from './components/GameStatus'
import RestartButton from './components/RestartButton'
import Timer from './components/Timer'

import styles from './Minesweeper.module.css'

export default function ZavaliaievMykhailo() {
  const {
    board,
    status,
    message,
    resetKey,
    remainingMines,
    restart,
    revealCell,
    flagCell,
  } = useMinesweeper()

  const seconds = useTimer(status === GAME_STATE.RUNNING, resetKey)

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-label="Zavaliaiev Mykhailo Minesweeper">
        <header className={styles.header}>
          <div className={styles.counter}>
            <span className={styles.label}>Mines</span>
            <output className={styles.value} aria-label="Mines remaining">
              <span className={styles.digits}>
                {String(Math.max(0, remainingMines)).padStart(3, '0')}
              </span>
            </output>
          </div>

          <RestartButton status={status} onRestart={restart} />

          <div className={styles.counter}>
            <span className={styles.label}>Time</span>
            <Timer seconds={seconds} />
          </div>
        </header>

        <Board board={board} onReveal={revealCell} onFlag={flagCell} />

        <footer className={styles.footer}>
          <GameStatus status={status} message={message} />
          <p className={styles.meta}>
            {GAME_CONFIG.rows} x {GAME_CONFIG.cols}, {GAME_CONFIG.mines} mines
          </p>
        </footer>
      </section>
    </main>
  )
}
