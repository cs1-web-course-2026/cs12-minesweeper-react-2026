function RestartButton({ onClick, className }) {
  return (
    <button type="button" className={className} onClick={onClick} aria-label="Restart game">
      Restart
    </button>
  );
}

export default RestartButton;
