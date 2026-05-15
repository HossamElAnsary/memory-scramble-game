export type CardStatus = "hidden" | "revealed" | "matched";

export type Card = {
  id: number;
  face: string;
  status: CardStatus;
};

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type GameConfig = {
  rows: number;
  cols: number;
  timeoutSeconds: number;
};
