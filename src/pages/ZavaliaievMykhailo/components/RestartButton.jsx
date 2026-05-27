import { GAME_STATE } from '../constants'

import styles from './RestartButton.module.css'

const BUTTON_LABEL = {
  [GAME_STATE.READY]: 'Start new game',
  [GAME_STATE.RUNNING]: 'Restart game',
  [GAME_STATE.WON]: 'Play again',
  [GAME_STATE.LOST]: 'Try again',
}

export default function RestartButton({ status, onRestart }) {
  return (
    <button
      type="button"
      className={[styles.button, styles[status]].filter(Boolean).join(' ')}
      aria-label={BUTTON_LABEL[status]}
      title={BUTTON_LABEL[status]}
      onClick={onRestart}
    >
      <span className={styles.face} aria-hidden="true">
        <span className={styles.eyes}>
          <span className={styles.eye} />
          <span className={styles.eye} />
        </span>
        <span className={styles.cheeks} />
        <span className={styles.mouth} />
      </span>
    </button>
  )
}
