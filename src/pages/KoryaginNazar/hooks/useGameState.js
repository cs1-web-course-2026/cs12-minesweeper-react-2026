import { useCallback, useMemo, useState } from 'react'

import {
  CELL_STATE,
  DEFAULT_GAME_CONFIG,
  GAME_STATUS,
  STATUS_MESSAGE,
} from '../constants'
import {
  checkWinCondition,
  countFlags,
  createBoard,
  flagAllMines,
  placeMines,
  revealBoardAfterLoss,
  revealCell,
  toggleFlag,
} from '../utils'

function createInitialState(config) {
  return {
    board: createBoard(config.rows, config.cols),
    gameStatus: GAME_STATUS.IDLE,
    gameMessage: STATUS_MESSAGE[GAME_STATUS.IDLE],
    resetCounter: 0,
  }
}

export function useGameState(config = DEFAULT_GAME_CONFIG) {
  const [state, setState] = useState(() => createInitialState(config))

  const flagsPlaced = useMemo(() => countFlags(state.board), [state.board])
  const minesRemaining = config.mineCount - flagsPlaced

  const handleRestart = useCallback(() => {
    setState((previousState) => {
      const restartedState = createInitialState(config)
      return {
        ...restartedState,
        resetCounter: previousState.resetCounter + 1,
      }
    })
  }, [config])

  const handleRevealCell = useCallback(
    (row, col) => {
      setState((previousState) => {
        if (
          previousState.gameStatus === GAME_STATUS.WON ||
          previousState.gameStatus === GAME_STATUS.LOST
        ) {
          return previousState
        }

        const boardWithMines =
          previousState.gameStatus === GAME_STATUS.IDLE
            ? placeMines(previousState.board, config.mineCount, row, col)
            : previousState.board

        const { updatedBoard, didHitMine } = revealCell(boardWithMines, row, col)

        if (didHitMine) {
          return {
            ...previousState,
            board: revealBoardAfterLoss(updatedBoard),
            gameStatus: GAME_STATUS.LOST,
            gameMessage: STATUS_MESSAGE[GAME_STATUS.LOST],
          }
        }

        const hasWonGame = checkWinCondition(updatedBoard)
        if (hasWonGame) {
          return {
            ...previousState,
            board: flagAllMines(updatedBoard),
            gameStatus: GAME_STATUS.WON,
            gameMessage: STATUS_MESSAGE[GAME_STATUS.WON],
          }
        }

        return {
          ...previousState,
          board: updatedBoard,
          gameStatus: GAME_STATUS.PLAYING,
          gameMessage: STATUS_MESSAGE[GAME_STATUS.PLAYING],
        }
      })
    },
    [config.mineCount],
  )

  const handleToggleFlag = useCallback((row, col) => {
    setState((previousState) => {
      if (
        previousState.gameStatus === GAME_STATUS.WON ||
        previousState.gameStatus === GAME_STATUS.LOST
      ) {
        return previousState
      }

      const currentCell = previousState.board[row][col]
      const isTryingToPlaceNewFlag = currentCell.state !== CELL_STATE.FLAGGED
      const placedFlagsCount = countFlags(previousState.board)

      if (isTryingToPlaceNewFlag && placedFlagsCount >= config.mineCount) {
        return previousState
      }

      return {
        ...previousState,
        board: toggleFlag(previousState.board, row, col),
      }
    })
  }, [config.mineCount])

  return {
    ...state,
    flagsPlaced,
    minesRemaining,
    handleRestart,
    handleRevealCell,
    handleToggleFlag,
  }
}
