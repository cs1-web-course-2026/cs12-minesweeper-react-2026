import { CELL_CONTENT, CELL_STATE } from '../constants'

import styles from './Cell.module.css'

function getCellLabel(cell, row, col) {
  if (cell.state === CELL_STATE.FLAGGED) {
    return `Row ${row + 1}, column ${col + 1}, flagged`
  }

  if (cell.state === CELL_STATE.CLOSED) {
    return `Row ${row + 1}, column ${col + 1}, hidden`
  }

  if (cell.content === CELL_CONTENT.MINE) {
    return `Row ${row + 1}, column ${col + 1}, mine`
  }

  if (cell.adjacentMineCount === 0) {
    return `Row ${row + 1}, column ${col + 1}, empty`
  }

  return `Row ${row + 1}, column ${col + 1}, ${cell.adjacentMineCount} adjacent mines`
}

function getCellContent(cell) {
  if (cell.state === CELL_STATE.CLOSED) {
    return ''
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return '🚩'
  }

  if (cell.content === CELL_CONTENT.MINE) {
    return cell.exploded ? '💥' : '💣'
  }

  return cell.adjacentMineCount > 0 ? cell.adjacentMineCount : ''
}

function getNumberClassName(adjacentMineCount) {
  if (adjacentMineCount <= 0) {
    return ''
  }

  return styles[`value${adjacentMineCount}`]
}

export default function Cell({ cell, row, col, onCellClick, onCellRightClick }) {
  const isOpen = cell.state === CELL_STATE.OPEN
  const isFlagged = cell.state === CELL_STATE.FLAGGED
  const isMine = cell.content === CELL_CONTENT.MINE

  const buttonClassName = [
    styles.cell,
    isOpen ? styles.open : styles.closed,
    isFlagged ? styles.flagged : '',
    isMine && isOpen ? styles.mine : '',
    cell.exploded ? styles.exploded : '',
    cell.wrongFlag ? styles.wrongFlag : '',
    getNumberClassName(cell.adjacentMineCount),
  ]
    .filter(Boolean)
    .join(' ')

  const cellLabel = getCellLabel(cell, row, col)

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={cellLabel}
      onClick={() => onCellClick(row, col)}
      onContextMenu={(event) => {
        event.preventDefault()
        onCellRightClick(row, col)
      }}
    >
      {getCellContent(cell)}
    </button>
  )
}
