import { useState, useEffect, useCallback } from 'react'
import './App.css'
import {
  DEFAULT_CONFIG,
  CELL_TYPE,
  CELL_STATE,
  GAME_STATUS,
  DIFFICULTY_PRESETS,
  createCell,
  createEmptyGrid,
  inBounds,
  placeMines,
  countNeighbourMines,
} from './gameConstants'
import GameMenu from './components/GameMenu'
import GameHeader from './components/GameHeader'
import GameBoard from './components/GameBoard'
import StatusMessage from './components/StatusMessage'


export default function App() {
  const [gameConfig, setGameConfig] = useState(DIFFICULTY_PRESETS[0])
  const [difficultyIndex, setDifficultyIndex] = useState(0)
  const [gameState, setGameState] = useState({
    rows: gameConfig.rows,
    cols: gameConfig.cols,
    minesCount: gameConfig.minesCount,
    status: GAME_STATUS.PROCESS,
    gameTime: 0,
    flagsCount: 0,
    openedCells: 0,
    firstClick: true,
    started: false,
    errorMessage: '',
  })
  const [grid, setGrid] = useState(() => createEmptyGrid(gameConfig.rows, gameConfig.cols))
  const [faceStyle, setFaceStyle] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  // Timer
  useEffect(() => {
    if (gameState.status !== GAME_STATUS.PROCESS || !gameState.started) {
      return
    }

    const timer = setInterval(() => {
      setGameState((prev) => (prev.status === GAME_STATUS.PROCESS ? { ...prev, gameTime: prev.gameTime + 1 } : prev))
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.status, gameState.started])

  // Update face and status message
  useEffect(() => {
    setFaceStyle('')

    if (gameState.status === GAME_STATUS.WIN) {
      setFaceStyle('face-win')
      setStatusMessage('You win!')
    } else if (gameState.status === GAME_STATUS.LOSE) {
      setFaceStyle('face-lose')
      setStatusMessage('Boom! You hit a mine.')
    } else if (gameState.status === GAME_STATUS.ERROR) {
      setFaceStyle('face-lose')
      setStatusMessage(gameState.errorMessage || 'Unable to generate field. Try another difficulty.')
    } else {
      setStatusMessage('')
    }
  }, [gameState.status, gameState.errorMessage])

  const floodOpen = useCallback((grid, row, col, openedCells) => {
    if (!inBounds(gameState.rows, gameState.cols, row, col)) {
      return openedCells
    }

    const cell = grid[row][col]
    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
      return openedCells
    }

    if (cell.type === CELL_TYPE.MINE) {
      return openedCells
    }

    cell.state = CELL_STATE.OPENED
    let newOpenedCells = openedCells + 1

    if (cell.neighborMines === 0) {
      for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
        for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
          if (directionalRow === 0 && directionalCol === 0) {
            continue
          }

          newOpenedCells = floodOpen(grid, row + directionalRow, col + directionalCol, newOpenedCells)
        }
      }
    }

    return newOpenedCells
  }, [gameState.rows, gameState.cols])

  const revealAllMines = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })))
      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          const cell = newGrid[row][col]
          if (cell.type === CELL_TYPE.MINE) {
            if (cell.state !== CELL_STATE.FLAGGED) {
              cell.state = CELL_STATE.OPENED
            }
          } else if (cell.state === CELL_STATE.FLAGGED) {
            cell.wrongFlag = true
          }
        }
      }
      return newGrid
    })
  }, [])

  const flagAllMines = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })))
      let minesAdded = 0
      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          const cell = newGrid[row][col]
          if (cell.type === CELL_TYPE.MINE && cell.state !== CELL_STATE.FLAGGED) {
            cell.state = CELL_STATE.FLAGGED
            minesAdded++
          }
        }
      }
      if (minesAdded > 0) {
        setGameState((prev) => ({
          ...prev,
          flagsCount: prev.flagsCount + minesAdded,
        }))
      }
      return newGrid
    })
  }, [])

  const openCell = useCallback(
    (row, col) => {
      if (gameState.status !== GAME_STATUS.PROCESS) {
        return false
      }
      if (!inBounds(gameState.rows, gameState.cols, row, col)) {
        return false
      }

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })))

        if (gameState.firstClick) {
          try {
            const temp = createEmptyGrid(gameState.rows, gameState.cols)
            placeMines(temp, gameState.rows, gameState.cols, gameState.minesCount, row, col)
            countNeighbourMines(temp, gameState.rows, gameState.cols)
            for (let r = 0; r < temp.length; r++) {
              for (let c = 0; c < temp[r].length; c++) {
                newGrid[r][c] = { ...temp[r][c] }
              }
            }
            setGameState((prev) => ({
              ...prev,
              firstClick: false,
              started: true,
            }))
          } catch (error) {
            setGameState((prev) => ({
              ...prev,
              status: GAME_STATUS.ERROR,
              started: false,
              errorMessage: 'Unable to start the field with current settings.',
            }))
            return prevGrid
          }
        }

        const cell = newGrid[row][col]
        if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
          return newGrid
        }

        if (cell.type === CELL_TYPE.MINE) {
          cell.exploded = true
          setGameState((prev) => ({
            ...prev,
            status: GAME_STATUS.LOSE,
          }))
          setTimeout(() => {
            revealAllMines()
          }, 0)
          return newGrid
        }

        let openedCells = gameState.openedCells
        openedCells = floodOpen(newGrid, row, col, openedCells)

        const totalSafeCells = gameState.rows * gameState.cols - gameState.minesCount
        if (openedCells === totalSafeCells) {
          setGameState((prev) => ({
            ...prev,
            status: GAME_STATUS.WIN,
            openedCells,
          }))
          setTimeout(() => {
            flagAllMines()
          }, 0)
        } else {
          setGameState((prev) => ({
            ...prev,
            openedCells,
          }))
        }

        return newGrid
      })

      return true
    },
    [gameState, floodOpen, revealAllMines, flagAllMines]
  )

  const toggleFlag = useCallback(
    (row, col) => {
      if (gameState.status !== GAME_STATUS.PROCESS) {
        return false
      }
      if (gameState.firstClick) {
        return false
      }
      if (!inBounds(gameState.rows, gameState.cols, row, col)) {
        return false
      }

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })))
        const cell = newGrid[row][col]

        if (cell.state === CELL_STATE.OPENED) {
          return newGrid
        }

        if (cell.state === CELL_STATE.CLOSED) {
          cell.state = CELL_STATE.FLAGGED
          setGameState((prev) => ({
            ...prev,
            flagsCount: prev.flagsCount + 1,
          }))
        } else if (cell.state === CELL_STATE.FLAGGED) {
          cell.state = CELL_STATE.CLOSED
          setGameState((prev) => ({
            ...prev,
            flagsCount: prev.flagsCount - 1,
          }))
        }

        return newGrid
      })

      return true
    },
    [gameState.status, gameState.firstClick, gameState.rows, gameState.cols]
  )

  const resetGame = useCallback(() => {
    setGameState({
      rows: gameConfig.rows,
      cols: gameConfig.cols,
      minesCount: gameConfig.minesCount,
      status: GAME_STATUS.PROCESS,
      gameTime: 0,
      flagsCount: 0,
      openedCells: 0,
      firstClick: true,
      started: false,
      errorMessage: '',
    })
    setGrid(createEmptyGrid(gameConfig.rows, gameConfig.cols))
  }, [gameConfig])

  const handleCellLeftClick = (row, col) => {
    setFaceStyle('face-pressed')
    openCell(row, col)
    setFaceStyle('')
  }

  const handleCellRightClick = (row, col) => {
    toggleFlag(row, col)
  }

  const handleRestart = () => {
    resetGame()
  }

  const handleOptions = () => {
    const newIndex = (difficultyIndex + 1) % DIFFICULTY_PRESETS.length
    setDifficultyIndex(newIndex)
    const preset = DIFFICULTY_PRESETS[newIndex]
    setGameConfig(preset)
    setGameState({
      rows: preset.rows,
      cols: preset.cols,
      minesCount: preset.minesCount,
      status: GAME_STATUS.PROCESS,
      gameTime: 0,
      flagsCount: 0,
      openedCells: 0,
      firstClick: true,
      started: false,
      errorMessage: '',
    })
    setGrid(createEmptyGrid(preset.rows, preset.cols))
    setStatusMessage(`Difficulty: ${preset.name} (${preset.rows}x${preset.cols}, ${preset.minesCount} mines)`)
  }

  const handleHelp = () => {
    const helpText = [
      'Controls:',
      'Left click / Enter / Space: open a cell',
      'Right click / F: place or remove a flag',
      'Arrow keys: move between cells',
      'Restart button or smiley: start a new game',
      'Options: switch difficulty',
    ].join('\n')

    alert(helpText)
  }

  const minesLeft = gameState.minesCount - gameState.flagsCount
  const cellSize = 31
  const fieldInnerWidth = gameState.cols * cellSize
  const fieldInnerHeight = gameState.rows * cellSize
  const menuWidth = 250
  const frameBorder = 10
  const sidePadding = 20
  const desiredContainerWidth = Math.max(fieldInnerWidth + frameBorder + sidePadding, menuWidth)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'rgb(189, 187, 187)' }}>
      <div
        className="title-container"
        style={{
          width: desiredContainerWidth + 'px',
          minHeight: '360px',
        }}
      >
        <GameMenu onRestart={handleRestart} onOptions={handleOptions} onHelp={handleHelp} />

        <GameHeader
          minesLeft={minesLeft}
          gameTime={gameState.gameTime}
          fieldInnerWidth={fieldInnerWidth}
          onFaceClick={handleRestart}
          faceStyle={faceStyle}
        />

        <GameBoard
          grid={grid}
          fieldInnerWidth={fieldInnerWidth}
          fieldInnerHeight={fieldInnerHeight}
          onCellLeftClick={handleCellLeftClick}
          onCellRightClick={handleCellRightClick}
        />

        <StatusMessage status={gameState.status} message={statusMessage} />
      </div>
    </div>
  )
}
