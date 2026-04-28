import Cell from './Cell'

import styles from './Board.module.css'

export default function Board({ board, onCellClick, onCellRightClick }) {
  const columnCount = board[0]?.length ?? 0

  return (
    <div
      className={styles.board}
      style={{ '--board-columns': columnCount }}
      role="grid"
      aria-label="Minesweeper board"
    >
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            onCellClick={onCellClick}
            onCellRightClick={onCellRightClick}
          />
        )),
      )}
    </div>
  )
}
