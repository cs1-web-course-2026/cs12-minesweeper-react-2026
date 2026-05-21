import React, { useState, useEffect, memo } from 'react';
import { GAME_STATUS } from '../constants.js';
import styles from './Timer.module.css';

const Timer = memo(({ status, onReset }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        setTime(0);
    }, [onReset]);

    useEffect(() => {
        let timerId;
        if (status === GAME_STATUS.PLAYING) {
            timerId = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [status]);

    return (
        <output className={styles.value} aria-live="polite" aria-label="Time in seconds">
            {time.toString().padStart(3, '0')}
        </output>
    );
});

export default Timer;
