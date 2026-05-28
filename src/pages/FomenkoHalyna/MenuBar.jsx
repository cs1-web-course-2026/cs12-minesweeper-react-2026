import React from 'react';
import styles from './Minesweeper.module.css';

export default function MenuBar() {
  return (
    <div className={styles.menuBar} role="menubar">
      <button type="button" className={styles.menuBarButton} role="menuitem">Гра</button>
      <button type="button" className={styles.menuBarButton} role="menuitem">Опції</button>
      <button type="button" className={styles.menuBarButton} role="menuitem">Допомога</button>
    </div>
  );
}
