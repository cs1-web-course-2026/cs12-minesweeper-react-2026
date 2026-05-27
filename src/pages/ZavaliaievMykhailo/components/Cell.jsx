import { CELL_STATE } from '../constants'

import styles from './Cell.module.css'

const NUMBER_CLASS = {
  1: styles.one,
  2: styles.two,
  3: styles.three,
  4: styles.four,
  5: styles.five,
  6: styles.six,
  7: styles.seven,
  8: styles.eight,
}

function getCellContent(cell) {
  if (cell.state === CELL_STATE.FLAGGED) {
    return <span className={styles.flagIcon} aria-hidden="true" />
  }

  if (cell.state !== CELL_STATE.OPEN) {
    return ''
  }

  if (cell.hasMine) {
    if (cell.exploded) {
      return <span className={styles.blastIcon} aria-hidden="true" />
    }

    return (
      <span className={styles.mineIcon} aria-hidden="true">
        <span className={styles.mineSpikes} />
        <span className={styles.mineBody} />
        <span className={styles.mineFuse} />
      </span>
    )
  }

  return cell.adjacentMines > 0 ? (
    <span className={styles.numberValue}>{cell.adjacentMines}</span>
  ) : (
    ''
  )
}

function getAriaLabel(cell) {
  const position = `row ${cell.row + 1}, column ${cell.col + 1}`

  if (cell.state === CELL_STATE.FLAGGED) {
    return `${position}, flagged`
  }

  if (cell.state === CELL_STATE.HIDDEN) {
    return `${position}, hidden`
  }

  if (cell.hasMine) {
    return `${position}, mine`
  }

  return cell.adjacentMines > 0
    ? `${position}, ${cell.adjacentMines} neighbouring mines`
    : `${position}, empty`
}

export default function Cell({ cell, onReveal, onFlag }) {
  const className = [
    styles.cell,
    cell.state === CELL_STATE.OPEN ? styles.open : styles.hidden,
    cell.state === CELL_STATE.FLAGGED ? styles.flagged : '',
    cell.hasMine && cell.state === CELL_STATE.OPEN ? styles.mine : '',
    cell.exploded ? styles.exploded : '',
    cell.incorrectFlag ? styles.incorrectFlag : '',
    cell.state === CELL_STATE.OPEN && !cell.hasMine ? NUMBER_CLASS[cell.adjacentMines] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      aria-label={getAriaLabel(cell)}
      onClick={() => onReveal(cell.row, cell.col)}
      onContextMenu={(event) => {
        event.preventDefault()
        onFlag(cell.row, cell.col)
      }}
    >
      {getCellContent(cell)}
    </button>
  )
}
