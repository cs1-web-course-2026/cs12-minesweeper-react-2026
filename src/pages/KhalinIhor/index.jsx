import Board from './components/Board.jsx';
import GameStatus from './components/GameStatus.jsx';
import RestartButton from './components/RestartButton.jsx';
import Timer from './components/Timer.jsx';
import useGameState from './hooks/useGameState.js';
import styles from './Minesweeper.module.css';

export default function KhalinIhor() {
    const { state, flagsLeft, openCell, toggleFlag, restart } = useGameState({
        rows: 10,
        cols: 10,
        minesCount: 15,
    });

    return (
        <main className={styles.gameShell}>
            <header className={styles.gameHeader}>
                <Timer label="Flags" value={flagsLeft} ariaLabel="Flags indicator" />
                <RestartButton onRestart={restart} />
                <Timer label="Time" value={state.gameTime} ariaLabel="Game timer" />
            </header>

            <GameStatus status={state.status} />

            <section className={styles.boardWrap} aria-label="Board container">
                <Board
                    field={state.field}
                    cols={state.cols}
                    status={state.status}
                    explodedCell={state.explodedCell}
                    onOpen={openCell}
                    onFlag={toggleFlag}
                />
            </section>
        </main>
    );
}
