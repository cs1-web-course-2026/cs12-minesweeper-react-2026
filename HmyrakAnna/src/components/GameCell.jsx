import { getCellClass, getCellAriaLabel } from '../gameConstants'

export default function GameCell({ cell, row, col, onLeftClick, onRightClick }) {
  const handleContextMenu = (e) => {
    e.preventDefault()
    onRightClick(row, col)
  }

  return (
    <button
      type="button"
      className={`cell-btn ${getCellClass(cell)}`}
      data-row={row}
      data-col={col}
      aria-rowindex={row + 1}
      aria-colindex={col + 1}
      aria-label={getCellAriaLabel(cell, row, col)}
      aria-disabled={cell.state === 'opened' ? 'true' : 'false'}
      aria-pressed={cell.state === 'flagged' ? 'true' : 'false'}
      onClick={() => onLeftClick(row, col)}
      onContextMenu={handleContextMenu}
    />
  )
}
