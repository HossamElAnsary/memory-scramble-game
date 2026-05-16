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
        <div className="card-face bg-indigo-500 dark:bg-indigo-700 text-3xl font-bold text-white shadow-lg">
          ?
        </div>
        <div
          className={`card-face card-back text-4xl sm:text-5xl ${
            isMatched
              ? "bg-green-200 dark:bg-green-800"
              :  "bg-white dark:bg-zinc-800 shadow-lg border-2 border-indigo-200"
          }`}
        >
          {card.face}
        </div>
      </div>
    </button>
  );
}
