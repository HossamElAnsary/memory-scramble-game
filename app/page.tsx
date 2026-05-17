"use client";

import { useState } from "react";
import type { GameConfig } from "@/lib/types";
import { useMemoryGame } from "@/lib/useMemoryGame";
import { StartScreen } from "@/components/StartScreen";
import { GameBoard } from "@/components/GameBoard";
import { HUD } from "@/components/HUD";
import { ResultOverlay } from "@/components/ResultOverlay";

const DEFAULT_CONFIG: GameConfig = {
  difficulty: "medium",
  rows: 4,
  cols: 4,
  timeoutSeconds: 60,
};

export default function Home() {
  const game = useMemoryGame();
  const [lastConfig, setLastConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [confirmQuit, setConfirmQuit] = useState(false);

  function handleStart(config: GameConfig) {
    setLastConfig(config);
    game.start(config);
  }

  function handleQuit() {
    setConfirmQuit(false);
    game.reset();
  }

  if (game.status === "idle" || game.config === null) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <StartScreen defaultConfig={lastConfig} onStart={handleStart} />
      </main>
    );
  }

  const overlayStatus =
    game.status === "won" || game.status === "lost" ? game.status : null;
  const isPaused = game.status === "paused";

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-4 sm:p-6">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <HUD remainingMs={game.remainingMs} moves={game.moves} paused={isPaused} />
        <div className="game-controls">
          {isPaused ? (
            <button type="button" className="ctrl-btn ctrl-primary" onClick={game.resume}>
              ▶ Resume
            </button>
          ) : (
            <button
              type="button"
              className="ctrl-btn"
              onClick={game.pause}
              disabled={!!overlayStatus}
            >
              ⏸ Pause
            </button>
          )}
          <button type="button" className="ctrl-btn" onClick={game.restart}>
            ↻ Restart
          </button>
          <button
            type="button"
            className="ctrl-btn ctrl-danger"
            onClick={() => setConfirmQuit(true)}
          >
            ⏏ Quit
          </button>
        </div>
      </div>

      <div className="board-wrap">
        <GameBoard
          cards={game.cards}
          config={game.config}
          disabled={game.status !== "playing"}
          onFlip={game.flip}
        />
        {isPaused && (
          <div className="pause-overlay" role="status" aria-live="polite">
            <div className="pause-card">
              <div className="pause-icon">⏸</div>
              <h2 className="pause-title">Paused</h2>
              <p className="pause-subtitle">The timer is on hold.</p>
              <button type="button" className="start-btn" onClick={game.resume}>
                Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmQuit && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="result-card confirm-card">
            <div className="result-icon">🚪</div>
            <h2 className="result-title">Quit game?</h2>
            <p className="result-subtitle">Your current progress will be lost.</p>
            <div className="result-actions">
              <button type="button" className="btn-primary" onClick={handleQuit}>
                Quit to Menu
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmQuit(false)}
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {overlayStatus && (
        <ResultOverlay
          status={overlayStatus}
          moves={game.moves}
          timeoutSeconds={game.config.timeoutSeconds}
          remainingMs={game.remainingMs}
          onPlayAgain={() => game.start(lastConfig)}
          onMenu={game.reset}
        />
      )}
    </main>
  );
}
