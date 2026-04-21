import { useReducer, useCallback } from 'react';

import {
  GAME_STATUS,
  DIFFICULTY_LEVELS,
  CELL_STATE,
  CELL_CONTENT,
} from '../constants';
import {
  createEmptyBoard,
  createBoard,
  revealCell,
  toggleFlag,
  countFlagsPlaced,
  checkWinCondition,
  revealAllMines,
  flagAllMines,
} from '../utils/board';

const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS.BEGINNER;

function createInitialState(difficulty = DEFAULT_DIFFICULTY) {
  return {
    board: createEmptyBoard(difficulty.rows, difficulty.cols),
    gameStatus: GAME_STATUS.IDLE,
    difficulty,
    flagsPlaced: 0,
    elapsedSeconds: 0,
    isBoardGenerated: false,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'RESTART': {
      return createInitialState(state.difficulty);
    }

    case 'SET_DIFFICULTY': {
      return createInitialState(action.payload);
    }

    case 'REVEAL_CELL': {
      if (state.gameStatus === GAME_STATUS.WON || state.gameStatus === GAME_STATUS.LOST) {
        return state;
      }

      const { row, col } = action.payload;
      const { rows, cols, mineCount } = state.difficulty;
      const isFirstReveal = !state.isBoardGenerated;

      const baseBoard = isFirstReveal
        ? createBoard(rows, cols, mineCount, row, col)
        : state.board;

      let newBoard = revealCell(baseBoard, row, col, rows, cols);
      let newGameStatus = GAME_STATUS.PLAYING;

      const revealedMine = newBoard[row][col].content === CELL_CONTENT.MINE && newBoard[row][col].state === CELL_STATE.OPEN;

      if (revealedMine) {
        newBoard[row][col] = { ...newBoard[row][col], exploded: true };
        newBoard = revealAllMines(newBoard);
        newGameStatus = GAME_STATUS.LOST;
      } else if (checkWinCondition(newBoard, rows, cols, mineCount)) {
        newBoard = flagAllMines(newBoard);
        newGameStatus = GAME_STATUS.WON;
      }

      return {
        ...state,
        board: newBoard,
        gameStatus: newGameStatus,
        isBoardGenerated: true,
        flagsPlaced: countFlagsPlaced(newBoard),
      };
    }

    case 'TOGGLE_FLAG': {
      if (state.gameStatus === GAME_STATUS.WON || state.gameStatus === GAME_STATUS.LOST) {
        return state;
      }

      if (!state.isBoardGenerated) {
        return state;
      }

      const { row, col } = action.payload;
      const newBoard = toggleFlag(state.board, row, col);
      const newFlagsPlaced = countFlagsPlaced(newBoard);

      return {
        ...state,
        board: newBoard,
        flagsPlaced: newFlagsPlaced,
      };
    }

    case 'INCREMENT_TIMER': {
      if (state.gameStatus === GAME_STATUS.PLAYING) {
        return {
          ...state,
          elapsedSeconds: state.elapsedSeconds + 1,
        };
      }

      return state;
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const revealCellHandler = useCallback((row, col) => {
    dispatch({ type: 'REVEAL_CELL', payload: { row, col } });
  }, []);

  const toggleFlagHandler = useCallback((row, col) => {
    dispatch({ type: 'TOGGLE_FLAG', payload: { row, col } });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const setDifficulty = useCallback((difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  }, []);

  const incrementTimer = useCallback(() => {
    dispatch({ type: 'INCREMENT_TIMER' });
  }, []);

  return {
    state,
    revealCellHandler,
    toggleFlagHandler,
    restartGame,
    setDifficulty,
    incrementTimer,
  };
}
