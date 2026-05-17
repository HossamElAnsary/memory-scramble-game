"use client";

import { useState } from "react";
import type { GameConfig } from "@/lib/types";
import { validateConfig } from "@/lib/validation";

type Props = {
  defaultConfig: GameConfig;
  onStart: (config: GameConfig) => void;
};

export function StartScreen({ defaultConfig, onStart }: Props) {
  const [rows, setRows] = useState(defaultConfig.rows);
  const [cols, setCols] = useState(defaultConfig.cols);
  const [timeoutSeconds, setTimeoutSeconds] = useState(
    defaultConfig.timeoutSeconds,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const config: GameConfig = { rows, cols, timeoutSeconds };
    const result = validateConfig(config);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onStart(config);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-indigo-200 p-8 dark:border-indigo-800 shadow-xl"
    >
      <h1 className="text-2xl font-semibold">Memory Scramble</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Rows</span>
        <input
          type="number"
          min={2}
          max={10}
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Columns</span>
        <input
          type="number"
          min={2}
          max={10}
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Timeout (seconds)</span>
        <input
          type="number"
          min={10}
          max={600}
          value={timeoutSeconds}
          onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors duration-200 shadow-md"
      >
        Start Game
      </button>
    </form>
  );
}
