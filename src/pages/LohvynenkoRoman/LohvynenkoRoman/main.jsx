import React from 'react';
import ReactDOM from 'react-dom/client';
// Імпортуємо твою гру. Переконайся, що шлях збігається з назвою папки!
import LohvynenkoRomanGame from './index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <LohvynenkoRomanGame />
    </div>
  </React.StrictMode>
);