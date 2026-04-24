import styles from './RestartButton.module.css';

export default function RestartButton({ onRestart }) {
    return (
        <button className={styles.startButton} type="button" onClick={() => onRestart()}>
            Start / Restart
        </button>
    );
}
