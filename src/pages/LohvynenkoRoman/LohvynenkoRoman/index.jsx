import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import Timer from './Timer';
import RestartButton from './RestartButton';
import styles from './index.module.css';

const ROWS = 10;
const COLS = 10;
const MINES = 10;

// Допоміжна функція генерації порожнього поля
const createEmptyBoard = () => {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      row: r, col: c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
    }))
  );
};

export default function MinesweeperGame() {
  const [board, setBoard] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, playing, won, lost
  const [flagsLeft, setFlagsLeft] = useState(MINES);

  // Ініціалізація гри
  const initGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    
    // Розставляємо міни
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Рахуємо сусідні міни
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c].isMine) continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
              if (newBoard[r + i][c + j].isMine) count++;
            }
          }
        }
        newBoard[r][c].neighborMines = count;
      }
    }

    setBoard(newBoard);
    setStatus('playing');
    setFlagsLeft(MINES);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCellClick = (r, c) => {
    if (status !== 'playing') return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell }))); // Глибока копія
    const cell = newBoard[r][c];

    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      cell.isRevealed = true;
      setStatus('lost');
      revealAllMines(newBoard);
      setBoard(newBoard);
      return;
    }

    // Рекурсивне відкриття
    const revealEmptyCells = (row, col) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      const currentCell = newBoard[row][col];
      if (currentCell.isRevealed || currentCell.isFlagged || currentCell.isMine) return;

      currentCell.isRevealed = true;
      if (currentCell.neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmptyCells(row + i, col + j);
          }
        }
      }
    };

    revealEmptyCells(r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const handleRightClick = (e, r, c) => {
    e.preventDefault();
    if (status !== 'playing') return;

    const newBoard = [...board];
    newBoard[r] = [...board[r]];
    const cell = { ...newBoard[r][c] };

    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsLeft(prev => prev + 1);
    } else if (flagsLeft > 0) {
      cell.isFlagged = true;
      setFlagsLeft(prev => prev - 1);
    }

    newBoard[r][c] = cell;
    setBoard(newBoard);
  };

  const revealAllMines = (currentBoard) => {
    currentBoard.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      });
    });
  };

  const checkWin = (currentBoard) => {
    let revealedCount = 0;
    currentBoard.forEach(row => row.forEach(cell => {
      if (cell.isRevealed) revealedCount++;
    }));
    if (revealedCount === (ROWS * COLS) - MINES) {
      setStatus('won');
    }
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <div className={styles.counter}>{String(flagsLeft).padStart(3, '0')}</div>
        <RestartButton status={status} onRestart={initGame} />
        <Timer status={status} />
      </div>
      <Board 
        boardData={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={handleRightClick} 
      />
    </div>
  );
}