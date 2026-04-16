export default function GameMenu({ onRestart, onOptions, onHelp }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <button className="menu-item" onClick={onRestart}>
        Restart
      </button>
      <button className="menu-item" onClick={onOptions}>
        Options
      </button>
      <button className="menu-item" onClick={onHelp}>
        Help
      </button>
    </div>
  )
}
