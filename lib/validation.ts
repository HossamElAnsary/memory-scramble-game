import type { Difficulty, GameConfig } from "./types";
import { IMAGE_POOL } from "./emoji";

export const MIN_ROWS = 2;
export const MAX_ROWS = 6;
export const MIN_COLS = 2;
export const MAX_COLS = 6;
export const MIN_TIMEOUT = 15;
export const MAX_TIMEOUT = 600;
export const MAX_PAIRS = IMAGE_POOL.length;

export const DEFAULT_CUSTOM_CONFIG: GameConfig = {
  difficulty: "custom",
  rows: 4,
  cols: 5,
  timeoutSeconds: 75,
};

export const DIFFICULTY_CONFIGS: Record<Exclude<Difficulty, "custom">, GameConfig> = {
  easy: {
    difficulty: "easy",
    rows: 3,
    cols: 4,
    timeoutSeconds: 90,
  },
  medium: {
    difficulty: "medium",
    rows: 4,
    cols: 4,
    timeoutSeconds: 60,
  },
  hard: {
    difficulty: "hard",
    rows: 4,
    cols: 6,
    timeoutSeconds: 45,
  },
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  custom: "Custom",
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: "12 cards · 90 seconds",
  medium: "16 cards · 60 seconds",
  hard: "24 cards · 45 seconds",
  custom: "Pick your own size & timer",
};

export type CustomConfigError =
  | "rows-range"
  | "cols-range"
  | "timeout-range"
  | "odd-total"
  | "too-many-pairs";

export function validateCustomConfig(
  rows: number,
  cols: number,
  timeoutSeconds: number,
): CustomConfigError | null {
  if (!Number.isInteger(rows) || rows < MIN_ROWS || rows > MAX_ROWS) return "rows-range";
  if (!Number.isInteger(cols) || cols < MIN_COLS || cols > MAX_COLS) return "cols-range";
  if (
    !Number.isInteger(timeoutSeconds) ||
    timeoutSeconds < MIN_TIMEOUT ||
    timeoutSeconds > MAX_TIMEOUT
  )
    return "timeout-range";
  const total = rows * cols;
  if (total % 2 !== 0) return "odd-total";
  if (total / 2 > MAX_PAIRS) return "too-many-pairs";
  return null;
}

export const CUSTOM_CONFIG_ERROR_MESSAGES: Record<CustomConfigError, string> = {
  "rows-range": `Rows must be between ${MIN_ROWS} and ${MAX_ROWS}.`,
  "cols-range": `Columns must be between ${MIN_COLS} and ${MAX_COLS}.`,
  "timeout-range": `Time must be between ${MIN_TIMEOUT} and ${MAX_TIMEOUT} seconds.`,
  "odd-total": "Rows × columns must be an even number.",
  "too-many-pairs": `Only ${MAX_PAIRS} unique pairs are available.`,
};

