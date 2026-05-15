"use client";

import type { CSSProperties } from "react";
import type { Card as CardModel, GameConfig } from "@/lib/types";
import { Card } from "./Card";

type Props = {
  cards: CardModel[];
  config: GameConfig;
  disabled: boolean;
  onFlip: (id: number) => void;
};

export function GameBoard({ cards, config, disabled, onFlip }: Props) {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`,
  };

  return (
    <div
      className="grid gap-2 sm:gap-3"
      style={{
        ...gridStyle,
        width: "min(80vh, 90vw)",
        aspectRatio: `${config.cols} / ${config.rows}`,
      }}
    >
      {cards.map((card) => (
        <Card key={card.id} card={card} disabled={disabled} onFlip={onFlip} />
      ))}
    </div>
  );
}
