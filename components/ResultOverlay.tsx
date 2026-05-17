type Props = {
  status: "won" | "lost";
  moves: number;
  timeoutSeconds: number;
  remainingMs: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function ResultOverlay({
  status,
  moves,
  timeoutSeconds,
  remainingMs,
  onPlayAgain,
  onMenu,
}: Props) {
  const elapsedSeconds = Math.max(0, timeoutSeconds - Math.ceil(remainingMs / 1000));
  const won = status === "won";

  return (
    <div className="overlay">
      <div className={`result-card ${won ? "result-win" : "result-lose"}`}>
        <div className="result-icon">{won ? "🏆" : "⏱️"}</div>
        <h2 className="result-title">{won ? "You Win!" : "Time's Up!"}</h2>
        <p className="result-subtitle">
          {won
            ? `Completed in ${elapsedSeconds}s with ${moves} moves`
            : "Better luck next time!"}
        </p>
        {won && (
          <div className="result-stars">
            <span className={`star ${moves <= 12 ? "star-filled" : "star-empty"}`}>★</span>
            <span className={`star ${moves <= 18 ? "star-filled" : "star-empty"}`}>★</span>
            <span className={`star ${moves <= 24 ? "star-filled" : "star-empty"}`}>★</span>
          </div>
        )}
        <div className="result-actions">
          <button className="btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn-secondary" onClick={onMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
