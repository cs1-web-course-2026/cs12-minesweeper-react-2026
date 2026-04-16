import { GAME_STATUS } from '../gameConstants'

export default function StatusMessage({ status, message }) {
  return (
    <div
      className={`status-message ${status === GAME_STATUS.WIN ? 'win' : ''} ${status === GAME_STATUS.LOSE || status === GAME_STATUS.ERROR ? 'lose' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
