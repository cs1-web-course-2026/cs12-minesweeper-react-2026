import { formatCounter } from '../logic.js';
import styles from './Timer.module.css';

export default function Timer({ label, value, ariaLabel }) {
    return (
        <div className={styles.statusPanel} aria-label={ariaLabel}>
            <span className={styles.statusLabel}>{label}</span>
            <output className={styles.statusValue} aria-live="polite">
                {formatCounter(value)}
            </output>
        </div>
    );
}
