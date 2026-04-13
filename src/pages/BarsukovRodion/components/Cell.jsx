import React, { memo } from 'react';
import { CELL_STATE, CELL_CONTENT } from '../constants.js';
import styles from './Cell.module.css';

const Cell = memo(({ row, col, cell, onClick, onContextMenu }) => {
    let className = styles.cell;
    let content = null;

    if (cell.state === CELL_STATE.CLOSED) {
        className += ` ${styles.closed}`;
    } else if (cell.state === CELL_STATE.FLAGGED) {
        if (cell.revealedWrong) {
            className += ` ${styles.flagWrong}`;
        } else {
            className += ` ${styles.flag}`;
        }
    } else if (cell.state === CELL_STATE.OPENED) {
        className += ` ${styles.open}`;
        if (cell.type === CELL_CONTENT.MINE) {
            className += ` ${styles.mine}`;
            if (cell.exploded) {
                className += ` ${styles.exploded}`;
            }
        } else if (cell.neighborMines > 0) {
            className += ` ${styles[`number${cell.neighborMines}`]}`;
            content = cell.neighborMines;
        }
    }

    const label = `Row ${row + 1}, column ${col + 1}, ${cell.state}`;

    return (
        <button
            type="button"
            className={className}
            aria-label={label}
            onClick={() => onClick(row, col)}
            onContextMenu={(event) => onContextMenu(event, row, col)}
        >
            {content}
        </button>
    );
});

export default Cell;
