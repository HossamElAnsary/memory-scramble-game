import { useState } from "react";
import type { Difficulty, GameConfig } from "../lib/types";
import { DIFFICULTY_CONFIGS, DIFFICULTY_DESCRIPTIONS, DIFFICULTY_LABELS } from "../lib/difficulty";

type Props = {
  onStart: (config: GameConfig) => void;
};

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: "🌱",
  medium: "🔥",
  hard: "💀",
};

const DIFFICULTY_COLORS: Record<Difficulty, { border: string; glow: string; badge: string }> = {
  easy: { border: "border-emerald-400", glow: "shadow-emerald-500/30", badge: "bg-emerald-500" },
  medium: { border: "border-amber-400", glow: "shadow-amber-500/30", badge: "bg-amber-500" },
  hard: { border: "border-rose-400", glow: "shadow-rose-500/30", badge: "bg-rose-500" },
};

export function StartScreen({ onStart }: Props) {
  const [selected, setSelected] = useState<Difficulty>("medium");

  function handleStart() {
    onStart(DIFFICULTY_CONFIGS[selected]);
  }

  return (
    <div className="start-screen">
      <div className="start-container">
        {/* Title */}
        <div className="start-header">
          <div className="brain-icon">🧠</div>
          <h1 className="game-title">Memory Scramble</h1>
          <p className="game-subtitle">Find all matching pairs before time runs out</p>
        </div>

        {/* Difficulty picker */}
        <div className="difficulty-section">
          <h2 className="section-label">Choose Difficulty</h2>
          <div className="difficulty-grid">
            {difficulties.map((diff) => {
              const colors = DIFFICULTY_COLORS[diff];
              const isSelected = selected === diff;
              return (
                <button
                  key={diff}
                  className={`difficulty-card ${isSelected ? `selected ${colors.border} shadow-lg ${colors.glow}` : "unselected"}`}
                  onClick={() => setSelected(diff)}
                >
                  <span className="diff-icon">{DIFFICULTY_ICONS[diff]}</span>
                  <span className="diff-name">{DIFFICULTY_LABELS[diff]}</span>
                  <span className="diff-desc">{DIFFICULTY_DESCRIPTIONS[diff]}</span>
                  {isSelected && (
                    <span className={`diff-selected-dot ${colors.badge}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* How to play */}
        <div className="how-to-play">
          <h2 className="section-label">How to Play</h2>
          <div className="steps-grid">
            <div className="step">
              <span className="step-num">1</span>
              <span className="step-text">Click any card to reveal it</span>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <span className="step-text">Find its matching pair</span>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <span className="step-text">Match all pairs to win!</span>
            </div>
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          Start Game
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

