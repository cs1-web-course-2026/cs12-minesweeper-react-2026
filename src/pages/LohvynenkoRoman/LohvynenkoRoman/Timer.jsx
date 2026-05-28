import React, { useState, useEffect } from 'react';
import styles from './index.module.css'; // Перевикористаємо стилі хедера

export default function Timer({ status, resetSignal }) {
  const [seconds, setSeconds] = useState(0);

  // Явне скидання таймера при зміні сигналу рестарту з батьківського компонента
  useEffect(() => {
    setSeconds(0);
  }, [resetSignal]);

  useEffect(() => {
    let interval = null;

    if (status === 'playing') {
      interval = setInterval(() => {
        setSeconds(s => (s < 999 ? s + 1 : s));
      }, 1000);
    } else if (status === 'won' || status === 'lost') {
      clearInterval(interval);
    } else if (status === 'idle') {
      setSeconds(0); // Скидання при звичайному стані очікування
    }

    return () => clearInterval(interval);
  }, [status]);

  return <div className={styles.counter}>{String(seconds).padStart(3, '0')}</div>;
}