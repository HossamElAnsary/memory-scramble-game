"use client";

type Props = {
  remainingMs: number;
  moves: number;
  paused?: boolean;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HUD({ remainingMs, moves, paused = false }: Props) {
  const lowTime = remainingMs <= 10_000 && !paused;
  return (
    <div className="hud">
      <span
        className={`hud-time ${lowTime ? "hud-time-low" : ""} ${paused ? "hud-paused" : ""}`}
        aria-live="polite"
      >
        <span className="hud-label">Time</span>
        <span className="hud-value">{paused ? "—:—" : formatTime(remainingMs)}</span>
      </span>
      <span className="hud-moves">
        <span className="hud-label">Moves</span>
        <span className="hud-value">{moves}</span>
      </span>
    </div>
  );
}
