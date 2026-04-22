import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import { generateField } from './gameLogic';
import './App.css';

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

  const flagsCount = gameState.field.flat().filter(c => c.state === 'flagged').length;

  useEffect(() => {
    let interval;
    if (gameState.status === 'process' && gameState.gameTime < 999) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, gameTime: prev.gameTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status, gameState.gameTime]);

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

  const checkWin = (field) => {
    const closedCount = field.flat().filter(c => c.state !== 'opened').length;
    return closedCount === MINES;
  };

  const handleCellClick = (r, c) => {
    if (gameState.status !== 'process') return;
    
    let newField = JSON.parse(JSON.stringify(gameState.field));
    const cell = newField[r][c];

    if (cell.state !== 'closed') return;

    if (cell.type === 'mine') {
      newField.forEach(row => row.forEach(cell => {
        if (cell.type === 'mine') cell.state = 'opened';
      }));
      setGameState(prev => ({ ...prev, field: newField, status: 'lose' }));
      return;
    }

    const openRecursive = (row, col) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      const target = newField[row][col];
      if (target.state !== 'closed' || target.type === 'mine') return;

      target.state = 'opened';
      if (target.neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) openRecursive(row + i, col + j);
        }
      }
    };

    openRecursive(r, c);

    const isWin = checkWin(newField);
    setGameState(prev => ({ 
      ...prev, 
      field: newField, 
      status: isWin ? 'win' : 'process' 
    }));
  };

  const handleCellContext = (r, c) => {
    if (gameState.status !== 'process') return;

    let newField = [...gameState.field];
    const cell = { ...newField[r][c] };

    if (cell.state === 'opened') return;

    cell.state = cell.state === 'flagged' ? 'closed' : 'flagged';
    newField[r] = [...newField[r]];
    newField[r][c] = cell;

    setGameState(prev => ({ ...prev, field: newField }));
  };

  return (
    <div className="window">
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
