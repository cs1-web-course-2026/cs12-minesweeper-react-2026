import GameCell from './GameCell'

export default function GameBoard({ grid, fieldInnerWidth, fieldInnerHeight, onCellLeftClick, onCellRightClick }) {
  return (
    <div
      className="field"
      role="grid"
      aria-label="Minesweeper field"
      tabIndex="0"
      style={{
        width: fieldInnerWidth + 'px',
        height: fieldInnerHeight + 'px',
      }}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="field-row" role="row">
          {row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onLeftClick={onCellLeftClick}
              onRightClick={onCellRightClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
