import React from 'react';
import styles from './Cell.module.css';

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

  return (
    <div 
      className={`${cellClass} ${numColorClass}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {getCellContent()}
    </div>
  );
}