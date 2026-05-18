import { useGameState } from './hooks/useGameState'
import { GAME_STATUS, ROWS, COLS, CELL_TYPE, CELL_STATE } from './constants'
import Board from './components/Board'
import Timer from './components/Timer'
import GameStatus from './components/GameStatus'
import RestartButton from './components/RestartButton'
import styles from './Game.module.css'

function PahiEduard() {
  const { field, status, time, flagsLeft, restart, openCell, toggleFlag } = useGameState()

  return (
    <div className={styles.wrapper}>
      <div className={styles.game}>
        <div className={styles.header}>
          <div className={styles.counter}>🚩 <span>{String(flagsLeft).padStart(3, '0')}</span></div>
          <RestartButton onRestart={restart} />
          <Timer time={time} />
        </div>
        <Board
          field={field}
          status={status}
          onCellClick={openCell}
          onCellRightClick={toggleFlag}
        />
        <GameStatus status={status} />
      </div>
    </div>
  )
}

export default PahiEduard
