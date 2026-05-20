import styles from './Cell.module.css'
import { CELL_STATE, CELL_TYPE } from '../constants'

const NUM_STYLES = ['', styles.n1, styles.n2, styles.n3, styles.n4, styles.n5, styles.n6, styles.n7, styles.n8]

function Cell({ cell, row, col, onClick, onRightClick }) {
  const handleRightClick = (e) => {
    e.preventDefault()
    onRightClick(row, col)
  }

  let className = styles.cell
  let content = ''

  if (cell.state === CELL_STATE.CLOSED) {
    className += ' ' + styles.closed
  } else if (cell.state === CELL_STATE.FLAGGED) {
    className += ' ' + styles.flag
    content = '🚩'
  } else if (cell.state === CELL_STATE.OPENED) {
    if (cell.type === CELL_TYPE.MINE) {
      className += ' ' + (cell.isHit ? styles.mineHit : styles.mine)
      content = '💣'
    } else {
      className += ' ' + styles.open
      if (cell.neighborMines > 0) {
        className += ' ' + NUM_STYLES[cell.neighborMines]
        content = cell.neighborMines
      }
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick(row, col)}
      onContextMenu={handleRightClick}
      aria-label={`Row ${row + 1}, column ${col + 1}, ${cell.state}`}
    >
      {content}
    </button>
  )
}

export default Cell
