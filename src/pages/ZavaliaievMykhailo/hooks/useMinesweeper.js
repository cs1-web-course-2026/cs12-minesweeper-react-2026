import { useCallback, useMemo, useState } from 'react'

import { CELL_STATE, GAME_CONFIG, GAME_STATE, STATUS_TEXT } from '../constants'
import {
  addMines,
  countFlags,
  createEmptyBoard,
  hasWon,
  markMines,
  openCell,
  revealMines,
  toggleFlag,
} from '../utils/board'

function createInitialState(config) {
  return {
    board: createEmptyBoard(config.rows, config.cols),
    status: GAME_STATE.READY,
    message: STATUS_TEXT[GAME_STATE.READY],
    resetKey: 0,
  }
}

export function useMinesweeper(config = GAME_CONFIG) {
  const [game, setGame] = useState(() => createInitialState(config))

  const flags = useMemo(() => countFlags(game.board), [game.board])
  const remainingMines = config.mines - flags

  const restart = useCallback(() => {
    setGame((currentGame) => ({
      ...createInitialState(config),
      resetKey: currentGame.resetKey + 1,
    }))
  }, [config])

  const revealCell = useCallback(
    (row, col) => {
      setGame((currentGame) => {
        if (currentGame.status === GAME_STATE.WON || currentGame.status === GAME_STATE.LOST) {
          return currentGame
        }

        const targetCell = currentGame.board[row]?.[col]
        if (targetCell?.state !== CELL_STATE.HIDDEN) {
          return currentGame
        }

        const boardWithMines =
          currentGame.status === GAME_STATE.READY
            ? addMines(currentGame.board, config.mines, row, col)
            : currentGame.board

        const result = openCell(boardWithMines, row, col)

        if (result.hitMine) {
          return {
            ...currentGame,
            board: revealMines(result.board),
            status: GAME_STATE.LOST,
            message: STATUS_TEXT[GAME_STATE.LOST],
          }
        }

        if (hasWon(result.board)) {
          return {
            ...currentGame,
            board: markMines(result.board),
            status: GAME_STATE.WON,
            message: STATUS_TEXT[GAME_STATE.WON],
          }
        }

        return {
          ...currentGame,
          board: result.board,
          status: GAME_STATE.RUNNING,
          message: STATUS_TEXT[GAME_STATE.RUNNING],
        }
      })
    },
    [config.mines],
  )

  const flagCell = useCallback(
    (row, col) => {
      setGame((currentGame) => {
        if (currentGame.status === GAME_STATE.WON || currentGame.status === GAME_STATE.LOST) {
          return currentGame
        }

        const cell = currentGame.board[row][col]
        const isNewFlag = cell.state !== CELL_STATE.FLAGGED
        const currentFlags = countFlags(currentGame.board)

        if (isNewFlag && currentFlags >= config.mines) {
          return currentGame
        }

        return {
          ...currentGame,
          board: toggleFlag(currentGame.board, row, col),
        }
      })
    },
    [config.mines],
  )

  return {
    ...game,
    flags,
    remainingMines,
    restart,
    revealCell,
    flagCell,
  }
}
