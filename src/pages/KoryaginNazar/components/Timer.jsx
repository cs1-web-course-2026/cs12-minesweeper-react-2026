import styles from './Timer.module.css'

export default function Timer({ elapsedSeconds }) {
  return (
    <div className={styles.timer} aria-live="polite" aria-label="Elapsed seconds">
      {String(elapsedSeconds).padStart(3, '0')}
    </div>
  )
}
