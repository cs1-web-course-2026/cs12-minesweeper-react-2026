import { CELL_CONTENT, CELL_STATE, GAME_STATUS } from '../constants.js';
import styles from './Cell.module.css';

function getNumberClass(neighbourMines) {
    const numberClassMap = {
        1: styles.cellN1,
        2: styles.cellN2,
        3: styles.cellN3,
        4: styles.cellN4,
        5: styles.cellN5,
        6: styles.cellN6,
        7: styles.cellN7,
        8: styles.cellN8,
    };

    return numberClassMap[neighbourMines] ?? '';
}

export default function Cell({ cell, row, col, status, explodedCell, onOpen, onFlag }) {
    const isGameOver = status !== GAME_STATUS.PLAYING;
    const isExploded = explodedCell?.row === row && explodedCell?.col === col;
    const isMine = cell.type === CELL_CONTENT.MINE;

    const classNames = [styles.cell];
    let textContent = '';

    if (cell.state === CELL_STATE.OPEN) {
        classNames.push(styles.cellOpen);

        if (isMine) {
            classNames.push(isExploded ? styles.cellMineHit : styles.cellMine);
            textContent = '*';
        } else if (cell.neighbourMines > 0) {
            classNames.push(getNumberClass(cell.neighbourMines));
            textContent = String(cell.neighbourMines);
        }
    } else {
        classNames.push(styles.cellClosed);

        if (cell.state === CELL_STATE.FLAGGED) {
            classNames.push(styles.cellFlag);
            textContent = 'F';

            if (isGameOver) {
                classNames.push(isMine ? styles.cellMine : styles.cellWrong);
            }
        } else if (isGameOver && isMine) {
            classNames.length = 1;
            classNames.push(styles.cellOpen, styles.cellMine);
            textContent = '*';
        }
    }

    const isDisabled = cell.state === CELL_STATE.OPEN || isGameOver;

    return (
        <button
            type="button"
            className={classNames.filter(Boolean).join(' ')}
            disabled={isDisabled}
            onClick={() => onOpen(row, col)}
            onContextMenu={(event) => {
                event.preventDefault();
                onFlag(row, col);
            }}
            aria-label={`Row ${row + 1}, Col ${col + 1}`}
        >{textContent}</button>
    );
}
