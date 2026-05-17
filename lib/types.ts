export type CardStatus = "hidden" | "revealed" | "matched";

export type Card = {
  id: number;
  face: string;
  label: string;
  status: CardStatus;
};

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type Difficulty = "easy" | "medium" | "hard";

export type GameConfig = {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  timeoutSeconds: number;
};
