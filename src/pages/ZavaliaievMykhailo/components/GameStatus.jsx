import { GAME_STATE } from '../constants'

import styles from './GameStatus.module.css'

const STATUS_CLASS = {
  [GAME_STATE.READY]: styles.ready,
  [GAME_STATE.RUNNING]: styles.running,
  [GAME_STATE.WON]: styles.won,
  [GAME_STATE.LOST]: styles.lost,
}

export default function GameStatus({ status, message }) {
  return (
    <p className={[styles.status, STATUS_CLASS[status]].join(' ')} aria-live="polite">
      {message}
    </p>
  )
}
