import styles from './Timer.module.css'

function Timer({ time }) {
  return (
    <div className={styles.timer}>
      ⏱️ <span>{String(time).padStart(3, '0')}</span>
    </div>
  )
}

export default Timer
