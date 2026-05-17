import type { Difficulty, GameConfig } from "./types";

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
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
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: "12 cards · 90 seconds",
  medium: "16 cards · 60 seconds",
  hard: "24 cards · 45 seconds",
};

