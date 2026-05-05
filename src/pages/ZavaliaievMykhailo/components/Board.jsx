import Cell from './Cell'
import styles from './Board.module.css'

export default function Board({ board, onReveal, onFlag }) {
  const columnCount = board[0]?.length ?? 0

  return (
    <div
      className={styles.board}
      role="grid"
      aria-label="Minesweeper board"
      style={{ '--columns': columnCount }}
    >
      {board.flat().map((cell) => (
        <Cell key={cell.id} cell={cell} onReveal={onReveal} onFlag={onFlag} />
      ))}
    </div>
  )
}
