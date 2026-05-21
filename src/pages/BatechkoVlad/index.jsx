import React, { useState, useEffect, useRef } from 'react';
import styles from './Minesweeper.module.css';
import Cell from './components/Cell';
import { generateField, countNeighbourMines } from './utils';

export default function Minesweeper() {
  const rows = 10;
  const cols = 10;
  const minesCount = 15;

  const [field, setField] = useState([]);
  const [gameStatus, setGameStatus] = useState('process');
  const [time, setTime] = useState(0);
  
  const timerRef = useRef(null);

  const initGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    
    const newField = generateField(rows, cols, minesCount);
    countNeighbourMines(newField, rows, cols);
    
    setField(newField);
    setGameStatus('process');
    setTime(0);
  };

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameStatus === 'process' && time === 0 && field.length > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => Math.min(prevTime + 1, 999));
      }, 1000);
    }

    if (gameStatus !== 'process' && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [gameStatus, time, field]);

  const flaggedCount = field.flat().filter(cell => cell.state === 'flagged').length;
  const flagsLeft = Math.max(minesCount - flaggedCount, 0);

  const checkWinCondition = (currentField) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = currentField[r][c];
        if (cell.type !== 'mine' && cell.state !== 'opened') {
          return false;
        }
      }
    }
    return true;
  };

  const revealEmptyArea = (currentField, startR, startC) => {
    const queue = [[startR, startC]];
    
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const nr = r + i;
          const nc = c + j;
          
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = currentField[nr][nc];
            if (neighbor.state === 'closed' && neighbor.type !== 'mine') {
              neighbor.state = 'opened';
              if (neighbor.neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  };

  const handleCellClick = (r, c) => {
    if (gameStatus !== 'process') return;
    
    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];
    
    if (cell.state !== 'closed') return;

    if (cell.type === 'mine') {
      cell.state = 'exploded';
      setGameStatus('lose');
      revealAllMines(newField);
    } else {
      cell.state = 'opened';
      if (cell.neighborMines === 0) {
        revealEmptyArea(newField, r, c);
      }
      
      if (checkWinCondition(newField)) {
        setGameStatus('win');
      }
    }
    
    setField(newField);
  };

  const handleCellContextMenu = (e, r, c) => {
    e.preventDefault();
    if (gameStatus !== 'process') return;

    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];

    if (cell.state === 'closed') {
      cell.state = 'flagged';
    } else if (cell.state === 'flagged') {
      cell.state = 'closed';
    }

    setField(newField);
  };

  const revealAllMines = (currentField) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (currentField[r][c].type === 'mine' && currentField[r][c].state !== 'exploded') {
          currentField[r][c].state = 'opened';
        }
      }
    }
  };

  const getSmileIcon = () => {
    if (gameStatus === 'win') return '😎';
    if (gameStatus === 'lose') return '😵';
    return '🙂';
  };

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.minesweeperContainer}>
        <div className={styles.gameHeader}>
          <div className={styles.digitDisplay}>
            {String(flagsLeft).padStart(3, '0')}
          </div>
          
          <button className={styles.resetBtn} onClick={initGame}>
            {getSmileIcon()}
          </button>
          
          <div className={styles.digitDisplay}>
            {String(time).padStart(3, '0')}
          </div>
        </div>

        <div className={styles.grid}>
          {field.map((row, rIdx) => 
            row.map((cell, cIdx) => (
              <Cell 
                key={`${rIdx}-${cIdx}`}
                cell={cell}
                onClick={() => handleCellClick(rIdx, cIdx)}
                onContextMenu={(e) => handleCellContextMenu(e, rIdx, cIdx)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}