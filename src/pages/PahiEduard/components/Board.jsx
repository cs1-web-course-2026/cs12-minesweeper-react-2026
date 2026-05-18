import Cell from './Cell'
import styles from './Board.module.css'

const GAME_STATUS = { LOSE: 'lose' }
const CELL_TYPE = { MINE: 'mine' }
const CELL_STATE = { CLOSED: 'closed' }

function Board({ field, status, onCellClick, onCellRightClick }) {
  return (
    <div className={styles.board}>
      {field.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const revealed =
            status === GAME_STATUS.LOSE &&
            cell.type === CELL_TYPE.MINE &&
            cell.state === CELL_STATE.CLOSED

          return (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              cell={revealed ? { ...cell, state: 'opened' } : cell}
              row={rowIdx}
              col={colIdx}
              onClick={onCellClick}
              onRightClick={onCellRightClick}
            />
          )
        })
      )}
    </div>
  )
}

export default Board
