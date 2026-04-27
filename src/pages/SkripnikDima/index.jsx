import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import { CELL_STATE, CELL_CONTENT, generateField, checkWin, openRecursive } from './gameLogic';
import styles from './App.module.css';

const App = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [gameState, setGameState] = useState({
    rows: ROWS,
    cols: COLS,
    minesCount: MINES,
    status: 'process',
    gameTime: 0,
    field: generateField(ROWS, COLS, MINES),
  });

  const flagsCount = gameState.field.flat().filter(col => col.state === 'flagged').length;

  useEffect(() => {
    let interval;
    if (gameState.status === 'process') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  const handleRestart = () => {
    setGameState({
      rows: ROWS,
      cols: COLS,
      minesCount: MINES,
      status: 'process',
      gameTime: 0,
      field: generateField(ROWS, COLS, MINES),
    });
  };

  const handleCellClick = (row, col) => {
    if (gameState.status !== 'process') return;
    
    let newField = JSON.parse(JSON.stringify(gameState.field));
    const cell = newField[row][col];

    if (cell.state !== 'closed') return;

    if (cell.type === CELL_CONTENT.MINE) {
      newField.forEach(row => row.forEach(cell => {
        if (cell.type === CELL_CONTENT.MINE) cell.state = CELL_STATE.OPENED;
      }));
      setGameState(prev => ({ ...prev, field: newField, status: 'lose' }));
      return;
    }

    openRecursive(newField, row, col, ROWS, COLS);

    const isWin = checkWin(newField, MINES);
    setGameState(prev => ({ 
      ...prev, 
      field: newField, 
      status: isWin ? 'win' : 'process' 
    }));
  };

  const handleCellContext = (row, col) => {
    if (gameState.status !== 'process') return;

    let newField = [...gameState.field];
    const cell = { ...newField[row][col] };

    if (cell.state === CELL_STATE.OPENED) return;

    cell.state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;;
    newField[row] = [...newField[row]];
    newField[row][col] = cell;

    setGameState(prev => ({ ...prev, field: newField }));
  };

  return (
    <div className={styles.window}>
      <Header 
        time={gameState.gameTime} 
        status={gameState.status} 
        minesCount={gameState.minesCount}
        flagsCount={flagsCount}
        onRestart={handleRestart} 
      />
      <Board 
        field={gameState.field} 
        onCellClick={handleCellClick}
        onCellContext={handleCellContext} 
      />
    </div>
  );
};

export default App;
