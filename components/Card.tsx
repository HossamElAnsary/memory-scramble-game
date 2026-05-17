import Image from "next/image";
import type { Card as CardModel } from "../lib/types";

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
      className={`card-container aspect-square w-full ${isMatched ? "matched" : ""}`}
      onClick={() => onFlip(card.id)}
      disabled={disabled || isMatched}
      aria-label={isFlipped ? `Card showing ${card.label}` : "Hidden card"}
    >
      <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* Front face — question mark */}
        <div className="card-face card-front">
          <span className="card-question">?</span>
        </div>
        {/* Back face — image */}
        <div className={`card-face card-back ${isMatched ? "card-matched" : ""}`}>
          <div className="card-image-wrap">
            <Image
              src={card.face}
              alt={card.label}
              fill
              sizes="(max-width: 640px) 25vw, 160px"
              className="card-image"
              draggable={false}
              unoptimized
            />
            {isMatched && (
              <div className="card-match-overlay">
                <svg viewBox="0 0 24 24" fill="none" className="match-check">
                  <circle cx="12" cy="12" r="11" fill="rgba(34,197,94,0.9)" />
                  <path
                    d="M7 12l3.5 3.5L17 8"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <span className="card-label">{card.label}</span>
        </div>
      </div>
    </button>
  );
}
