"use client";

import { useState } from "react";
import type { GameConfig } from "@/lib/types";
import { useMemoryGame } from "@/lib/useMemoryGame";
import { StartScreen } from "@/components/StartScreen";
import { GameBoard } from "@/components/GameBoard";
import { HUD } from "@/components/HUD";
import { ResultOverlay } from "@/components/ResultOverlay";

const DEFAULT_CONFIG: GameConfig = {
  rows: 4,
  cols: 4,
  timeoutSeconds: 60,
};

export default function Home() {
  const game = useMemoryGame();
  const [lastConfig, setLastConfig] = useState<GameConfig>(DEFAULT_CONFIG);

  function handleStart(config: GameConfig) {
    setLastConfig(config);
    game.start(config);
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

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <HUD remainingMs={game.remainingMs} moves={game.moves} />
      </div>
      <GameBoard
        cards={game.cards}
        config={game.config}
        disabled={game.status !== "playing"}
        onFlip={game.flip}
      />
      {overlayStatus && (
        <ResultOverlay
          status={overlayStatus}
          moves={game.moves}
          timeoutSeconds={game.config.timeoutSeconds}
          remainingMs={game.remainingMs}
          onPlayAgain={game.reset}
        />
      )}
    </main>
  );
}
