import React, { useState, useEffect, useRef } from 'react';
import MenuBar from './MenuBar';
import StatusPanel from './StatusPanel';
import Board from './Board';
import styles from './Minesweeper.module.css';

const CELL_CONTENT = { MINE: 'mine', EMPTY: 'empty' };
const CELL_STATE = { CLOSED: 'closed', OPENED: 'opened', FLAGGED: 'flagged' };
const GAME_STATUS = { IDLE: 'idle', PLAYING: 'playing', WON: 'won', LOST: 'lost' };

const DEFAULT_ROWS = 10;
const DEFAULT_COLS = 10;
const DEFAULT_MINES_COUNT = 15;

function generateField(rows, cols, minesCount) {
  const field = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        type: CELL_CONTENT.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
        row,
        col,
      });
    }
    field.push(currentRow);
  }

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    if (field[randomRow][randomCol].type !== CELL_CONTENT.MINE) {
      field[randomRow][randomCol].type = CELL_CONTENT.MINE;
      minesPlaced++;
    }
  }

  countNeighbourMines(field, rows, cols);
  return field;
}

function countNeighbourMines(field, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === CELL_CONTENT.MINE) continue;
      const neighbors = getNeighbors(field, rows, cols, row, col);
      field[row][col].neighborMines = neighbors.filter(n => n.type === CELL_CONTENT.MINE).length;
    }
  }
}

function getNeighbors(field, rows, cols, row, col) {
  const neighbors = [];
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue;
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
        neighbors.push(field[nRow][nCol]);
      }
    }
  }
  return neighbors;
}

export default function Minesweeper() {
  const [status, setStatus] = useState(GAME_STATUS.IDLE);
  const [field, setField] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [flagsCount, setFlagsCount] = useState(0);
  
  const timerRef = useRef(null);

  const initGame = () => {
    clearInterval(timerRef.current);
    setStatus(GAME_STATUS.IDLE);
    setGameTime(0);
    setFlagsCount(0);
    setField(generateField(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES_COUNT));
  };

  useEffect(() => {
    initGame();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (status === GAME_STATUS.PLAYING) {
      timerRef.current = setInterval(() => {
        setGameTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const handleCellClick = (row, col) => {
    if (status === GAME_STATUS.LOST || status === GAME_STATUS.WON) return;

    let currentStatus = status;
    if (status === GAME_STATUS.IDLE) {
      currentStatus = GAME_STATUS.PLAYING;
      setStatus(GAME_STATUS.PLAYING);
    }

    const newField = field.map(r => r.map(c => ({ ...c })));
    const cell = newField[row][col];

    if (cell.state !== CELL_STATE.CLOSED) return;

    const openCellRec = (r, c) => {
      const currentCell = newField[r][c];
      if (currentCell.state !== CELL_STATE.CLOSED) return;
      
      currentCell.state = CELL_STATE.OPENED;

      if (currentCell.type === CELL_CONTENT.MINE) {
        setStatus(GAME_STATUS.LOST);
        newField.forEach(rowArr => rowArr.forEach(cellObj => {
          if (cellObj.type === CELL_CONTENT.MINE) cellObj.state = CELL_STATE.OPENED;
        }));
        return;
      }

      if (currentCell.neighborMines === 0) {
        const neighbors = getNeighbors(newField, DEFAULT_ROWS, DEFAULT_COLS, r, c);
        neighbors.forEach(n => {
          if (n.state === CELL_STATE.CLOSED) openCellRec(n.row, n.col);
        });
      }
    };

    openCellRec(row, col);

    if (currentStatus !== GAME_STATUS.LOST) {
      const allCells = newField.flat();
      const isWin = allCells
        .filter(c => c.type !== CELL_CONTENT.MINE)
        .every(c => c.state === CELL_STATE.OPENED);
      
      if (isWin) setStatus(GAME_STATUS.WON);
    }

    setField(newField);
  };

  const handleCellContextMenu = (e, row, col) => {
    e.preventDefault();
    if (status === GAME_STATUS.LOST || status === GAME_STATUS.WON) return;

    const newField = field.map(r => r.map(c => ({ ...c })));
    const cell = newField[row][col];

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsCount(prev => prev + 1);
    } else if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsCount(prev => prev - 1);
    }

    setField(newField);
  };

  return (
    <div className={styles.centerWrapper}>
      <div className={styles.gameContainer}>
        <MenuBar />
        <div className={styles.gameBox}>
          <StatusPanel 
            minesCount={DEFAULT_MINES_COUNT} 
            flagsCount={flagsCount} 
            status={status} 
            gameTime={gameTime} 
            onReset={initGame} 
          />
          <Board 
            field={field} 
            rows={DEFAULT_ROWS} 
            cols={DEFAULT_COLS} 
            onCellClick={handleCellClick} 
            onCellContextMenu={handleCellContextMenu} 
          />
          <p className={styles.gameMessage} role="status" aria-live="polite">
            {status === GAME_STATUS.WON && 'Ви виграли!'}
            {status === GAME_STATUS.LOST && 'Гра закінчена. Ви підірвалися на міні.'}
          </p>
        </div>
      </div>
    </div>
  );
}
