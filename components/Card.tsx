"use client";

import type { Card as CardModel } from "@/lib/types";

type Props = {
  card: CardModel;
  disabled: boolean;
  onFlip: (id: number) => void;
};

export function Card({ card, disabled, onFlip }: Props) {
  const isFlipped = card.status !== "hidden";
  const isMatched = card.status === "matched";

  return (
    <button
      type="button"
      className="card aspect-square w-full"
      onClick={() => onFlip(card.id)}
      disabled={disabled || isMatched}
      aria-label={isFlipped ? `Card showing ${card.face}` : "Hidden card"}
    >
      <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
        <div className="card-face bg-zinc-200 dark:bg-zinc-700 text-3xl font-bold text-zinc-500">
          ?
        </div>
        <div
          className={`card-face card-back text-4xl sm:text-5xl ${
            isMatched
              ? "bg-green-200 dark:bg-green-800"
              : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          {card.face}
        </div>
      </div>
    </button>
  );
}
