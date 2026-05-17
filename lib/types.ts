export type CardStatus = "hidden" | "revealed" | "matched";

export type Card = {
  id: number;
  face: string;
  label: string;
  status: CardStatus;
};

export type GameStatus = "idle" | "playing" | "paused" | "won" | "lost";

export type Difficulty = "easy" | "medium" | "hard" | "custom";

export type GameConfig = {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  timeoutSeconds: number;
};
