import styles from './Timer.module.css'

export default function Timer({ seconds }) {
  return (
    <output className={styles.timer} aria-label="Elapsed time">
      <span className={styles.digits}>{String(seconds).padStart(3, '0')}</span>
    </output>
  )
}
