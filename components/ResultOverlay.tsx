"use client";

type Props = {
  status: "won" | "lost";
  moves: number;
  timeoutSeconds: number;
  remainingMs: number;
  onPlayAgain: () => void;
};

export function ResultOverlay({
  status,
  moves,
  timeoutSeconds,
  remainingMs,
  onPlayAgain,
}: Props) {
  const elapsedSeconds = Math.max(
    0,
    timeoutSeconds - Math.ceil(remainingMs / 1000),
  );
  const title = status === "won" ? "You Win!" : "Game Over";
  const subtitle =
    status === "won"
      ? `Finished in ${elapsedSeconds}s and ${moves} moves.`
      : "Time's up — better luck next time.";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full bg-zinc-900 px-6 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
