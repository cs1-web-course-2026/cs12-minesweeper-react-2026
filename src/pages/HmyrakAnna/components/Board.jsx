import Cell from './Cell';
import styles from './Board.module.css';

function Board({ board, onReveal, onFlag, onPressStart, onPressEnd }) {
  const boardColumns = board[0]?.length ?? 0;

  return (
    <div
      className={styles.board}
      role="grid"
      aria-label="Minesweeper board"
      style={{ '--board-cols': boardColumns }}
    >
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            onReveal={onReveal}
            onFlag={onFlag}
            onPressStart={onPressStart}
            onPressEnd={onPressEnd}
          />
        ))
      )}
    </div>
  );
}

export default Board;
