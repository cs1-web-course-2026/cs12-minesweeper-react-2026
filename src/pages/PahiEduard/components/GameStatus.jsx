import styles from './GameStatus.module.css'

const GAME_STATUS = { WIN: 'win', LOSE: 'lose', PROCESS: 'process' }

function GameStatus({ status }) {
  if (status === GAME_STATUS.PROCESS) return null
  return (
    <p className={styles.message}>
      {status === GAME_STATUS.WIN ? '🎉 Ви виграли!' : '💥 Ви програли!'}
    </p>
  )
}

export default GameStatus
