import React from 'react';
import styles from './cell.module.css';

export default function Cell({ data, onClick, onContextMenu }) {
  const getCellContent = () => {
    if (data.isFlagged) return '🚩';
    if (!data.isRevealed) return '';
    if (data.isMine) return '💣';
    if (data.neighborMines > 0) return data.neighborMines;
    return '';
  };

  const cellClass = `
    ${styles.cell}
    ${data.isRevealed ? styles.revealed : ''}
    ${data.isRevealed && data.isMine ? styles.mine : ''}
  `;

  // Додаємо колір для цифр залежно від кількості мін навколо
  const numColorClass = data.isRevealed && data.neighborMines > 0 ? styles[`val-${data.neighborMines}`] : '';

  // Генеруємо опис для aria-label
  const ariaLabel = `Комірка ${data.isRevealed ? 'відкрита' : 'закрита'}${data.isFlagged ? ', з прапорцем' : ''}`;

  return (
    <button
      type="button"
      className={`${cellClass} ${numColorClass}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-label={ariaLabel}
    >
      {getCellContent()}
    </button>
  );
}