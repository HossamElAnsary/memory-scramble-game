import type { GameConfig } from "./types";
import { EMOJI_POOL } from "./emoji";

export const MIN_DIM = 2;
export const MAX_DIM = 10;
export const MIN_TIMEOUT = 10;
export const MAX_TIMEOUT = 600;
export const MAX_CELLS = EMOJI_POOL.length * 2;

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateConfig(cfg: GameConfig): ValidationResult {
  const { rows, cols, timeoutSeconds } = cfg;

  if (!Number.isInteger(rows) || rows < MIN_DIM || rows > MAX_DIM) {
    return { ok: false, error: `Rows must be an integer between ${MIN_DIM} and ${MAX_DIM}.` };
  }
  if (!Number.isInteger(cols) || cols < MIN_DIM || cols > MAX_DIM) {
    return { ok: false, error: `Columns must be an integer between ${MIN_DIM} and ${MAX_DIM}.` };
  }
  const total = rows * cols;
  if (total % 2 !== 0) {
    return { ok: false, error: "Total number of cells (rows × cols) must be even." };
  }
  if (total > MAX_CELLS) {
    return { ok: false, error: `Board has ${total} cells; max supported is ${MAX_CELLS}.` };
  }
  if (
    !Number.isInteger(timeoutSeconds) ||
    timeoutSeconds < MIN_TIMEOUT ||
    timeoutSeconds > MAX_TIMEOUT
  ) {
    return {
      ok: false,
      error: `Timeout must be an integer between ${MIN_TIMEOUT} and ${MAX_TIMEOUT} seconds.`,
    };
  }
  return { ok: true };
}
