import React from 'react';
import Cell from './Cell.jsx';
import styles from './Board.module.css';

export default function Board({ field, onCellClick, onCellContextMenu }) {
    const rows = field.length;
    const cols = field[0].length;

    return (
        <div
            className={styles.board}
            role="grid"
            aria-rowcount={rows}
            aria-colcount={cols}
        >
            {field.map((boardRow, row) => (
                <div key={row} className={styles.row} role="row">
                    {boardRow.map((cell, col) => (
                        <Cell
                            key={`${row}-${col}`}
                            row={row}
                            col={col}
                            cell={cell}
                            onClick={onCellClick}
                            onContextMenu={onCellContextMenu}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
