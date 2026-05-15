import type { Card } from "./types";
import { EMOJI_POOL } from "./emoji";

export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDeck(pairCount: number): Card[] {
  if (pairCount < 1) throw new Error("pairCount must be >= 1");
  if (pairCount > EMOJI_POOL.length) {
    throw new Error(
      `pairCount ${pairCount} exceeds emoji pool size ${EMOJI_POOL.length}`,
    );
  }
  const faces = shuffle(EMOJI_POOL).slice(0, pairCount);
  const doubled = faces.flatMap((face) => [face, face]);
  const shuffled = shuffle(doubled);
  return shuffled.map((face, index) => ({
    id: index,
    face,
    status: "hidden",
  }));
}
