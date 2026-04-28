import { GAME_STATUS } from '../constants'

import styles from './GameStatus.module.css'

export default function GameStatus({ gameStatus, gameMessage }) {
  const statusClassName = [
    styles.status,
    gameStatus === GAME_STATUS.WON ? styles.won : '',
    gameStatus === GAME_STATUS.LOST ? styles.lost : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <p className={statusClassName} role="status" aria-live="polite">
      {gameMessage}
    </p>
  )
}
