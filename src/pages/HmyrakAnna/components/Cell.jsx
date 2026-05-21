import { CELL_STATE, CELL_CONTENT } from '../constants';
import styles from './Cell.module.css';

function Cell({ cell, row, col, onReveal, onFlag, onPressStart, onPressEnd }) {
  const handleLeftClick = () => {
    onReveal(row, col);
  };

  const handleMouseDown = () => {
    onPressStart();
  };

  const handleMouseUp = () => {
    onPressEnd();
  };

  const handleMouseLeave = () => {
    onPressEnd();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onFlag(row, col);
  };

  const getCellLabel = () => {
    const position = `Row ${row + 1}, column ${col + 1}`;

    if (cell.state === CELL_STATE.CLOSED) {
      return `${position}, closed`;
    }

    if (cell.state === CELL_STATE.FLAGGED) {
      return `${position}, flagged`;
    }
    if (cell.content === CELL_CONTENT.MINE) {
      return `${position}, mine`;
    }
    if (cell.adjacentMinesCount > 0) {
      return `${position}, ${cell.adjacentMinesCount} adjacent mines`;
    }

    return `${position}, empty`;
  };

  const numberClassName =
    cell.state === CELL_STATE.OPEN &&
    cell.content === CELL_CONTENT.EMPTY &&
    cell.adjacentMinesCount > 0
      ? styles[`num${cell.adjacentMinesCount}`]
      : '';

  const stateClassName =
    cell.state === CELL_STATE.FLAGGED
      ? cell.wrongFlag
        ? styles.flagBang
        : styles.flag
      : cell.state === CELL_STATE.OPEN && cell.content === CELL_CONTENT.MINE
        ? cell.exploded
          ? styles.mineBang
          : styles.mine
        : cell.state === CELL_STATE.OPEN
          ? styles.openCell
          : styles.closedCell;

  const cellClassName = [styles.cellButton, stateClassName, numberClassName].filter(Boolean).join(' ');

  const isOpenedCell = cell.state === CELL_STATE.OPEN;
  const isFlaggedCell = cell.state === CELL_STATE.FLAGGED;

  return (
    <button
      type="button"
      className={cellClassName}
      aria-label={getCellLabel()}
      aria-disabled={isOpenedCell}
      aria-pressed={isFlaggedCell}
      disabled={isOpenedCell}
      onClick={handleLeftClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default Cell;
