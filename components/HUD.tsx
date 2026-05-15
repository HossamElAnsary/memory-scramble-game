"use client";

type Props = {
  remainingMs: number;
  moves: number;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HUD({ remainingMs, moves }: Props) {
  const lowTime = remainingMs <= 10_000;
  return (
    <div className="flex w-full items-center justify-between px-2 py-3 text-lg font-medium">
      <span
        className={lowTime ? "text-red-600 dark:text-red-400" : ""}
        aria-live="polite"
      >
        Time: {formatTime(remainingMs)}
      </span>
      <span>Moves: {moves}</span>
    </div>
  );
}
