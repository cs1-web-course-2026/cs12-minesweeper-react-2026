import Cell from './Cell.jsx';
import styles from './Board.module.css';

export default function Board({ field, cols, status, explodedCell, onOpen, onFlag }) {
    return (
        <div
            className={styles.gameBoard}
            style={{ '--board-cols': cols }}
            role="grid"
            aria-label={`Minesweeper board ${field.length} by ${cols}`}
        >
            {field.map((rowData, rowIndex) =>
                rowData.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        row={rowIndex}
                        col={colIndex}
                        status={status}
                        explodedCell={explodedCell}
                        onOpen={onOpen}
                        onFlag={onFlag}
                    />
                ))
            )}
        </div>
    );
}
