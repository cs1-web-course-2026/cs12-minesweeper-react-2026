import { useState, useEffect, useCallback } from 'react'
import { GAME_STATUS, CELL_STATE, CELL_TYPE, ROWS, COLS, MINES_COUNT } from '../constants'
import { generateField, openCellRecursive, checkWin } from '../utils/board'

export function useGameState() {
  const [field, setField] = useState(() => generateField(ROWS, COLS, MINES_COUNT))
  const [status, setStatus] = useState(GAME_STATUS.PROCESS)
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [firstClick, setFirstClick] = useState(true)

  useEffect(() => {
    if (!timerActive) return
    const id = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [timerActive])

  const flagsLeft = MINES_COUNT - field.flat().filter(c => c.state === CELL_STATE.FLAGGED).length

  const restart = useCallback(() => {
    setField(generateField(ROWS, COLS, MINES_COUNT))
    setStatus(GAME_STATUS.PROCESS)
    setTime(0)
    setTimerActive(false)
    setFirstClick(true)
  }, [])

  const openCell = useCallback((row, col) => {
    if (status !== GAME_STATUS.PROCESS) return

    let currentField = field

    if (firstClick) {
      const safeField = generateField(ROWS, COLS, MINES_COUNT, { row, col })
      setFirstClick(false)
      setTimerActive(true)
      currentField = safeField
    }

    const newField = currentField.map(r => r.map(c => ({ ...c })))
    const cell = newField[row][col]

    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return

    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.OPENED
      cell.isHit = true
      setField(newField)
      setStatus(GAME_STATUS.LOSE)
      setTimerActive(false)
      return
    }

    openCellRecursive(newField, ROWS, COLS, row, col)

    if (checkWin(newField, ROWS, COLS)) {
      setStatus(GAME_STATUS.WIN)
      setTimerActive(false)
    }

    setField(newField)
  }, [field, status, firstClick])

  const toggleFlag = useCallback((row, col) => {
    if (status !== GAME_STATUS.PROCESS) return

    const newField = field.map(r => r.map(c => ({ ...c })))
    const cell = newField[row][col]

    if (cell.state === CELL_STATE.OPENED) return
    if (cell.state === CELL_STATE.CLOSED && flagsLeft <= 0) return

    cell.state = cell.state === CELL_STATE.CLOSED ? CELL_STATE.FLAGGED : CELL_STATE.CLOSED
    setField(newField)
  }, [field, status, flagsLeft])

  return { field, status, time, flagsLeft, restart, openCell, toggleFlag }
}
