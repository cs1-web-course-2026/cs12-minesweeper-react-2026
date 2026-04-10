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
            {field.map((row, r) => (
                <div key={r} className={styles.row} role="row">
                    {row.map((cell, c) => (
                        <Cell
                            key={`${r}-${c}`}
                            rowIdx={r}
                            colIdx={c}
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
