import React from 'react';
import styles from './RestartButton.module.css';

const RestartButton = ({ status, onClick }) => {
  const getSmiley = () => {
    switch (status) {
      case 'win': return '😎';
      case 'lose': return '😵';
      default: return '🙂';
    }
  };

  return (
    <button className={styles.smileyBtn} onClick={onClick}>
      {getSmiley()}
    </button>
  );
};

export default RestartButton;
