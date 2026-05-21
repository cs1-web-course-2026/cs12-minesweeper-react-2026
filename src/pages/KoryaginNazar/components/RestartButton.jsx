import { GAME_STATUS } from '../constants'

import styles from './RestartButton.module.css'

function getFaceByStatus(gameStatus) {
  if (gameStatus === GAME_STATUS.WON) {
    return '😎'
  }

  if (gameStatus === GAME_STATUS.LOST) {
    return '😵'
  }

  return '🙂'
}

export default function RestartButton({ gameStatus, onRestart }) {
  return (
    <button
      type="button"
      className={styles.restartButton}
      aria-label="Restart game"
      onClick={onRestart}
    >
      {getFaceByStatus(gameStatus)}
    </button>
  )
}
