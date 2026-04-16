import { formatCounter } from '../gameConstants'

export default function GameHeader({ minesLeft, gameTime, fieldInnerWidth, onFaceClick, faceStyle }) {
  return (
    <div
      className="header"
      style={{
        width: fieldInnerWidth + 'px',
      }}
    >
      <div className="counter">{formatCounter(minesLeft)}</div>
      <button
        type="button"
        className={`face-btn ${faceStyle}`}
        onClick={onFaceClick}
        aria-label="Restart game"
      />
      <div className="counter">{formatCounter(gameTime)}</div>
    </div>
  )
}
