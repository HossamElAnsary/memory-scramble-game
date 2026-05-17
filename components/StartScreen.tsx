import { useState } from "react";
import type { Difficulty, GameConfig } from "../lib/types";
import {
  CUSTOM_CONFIG_ERROR_MESSAGES,
  DEFAULT_CUSTOM_CONFIG,
  DIFFICULTY_CONFIGS,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
  MAX_COLS,
  MAX_ROWS,
  MAX_TIMEOUT,
  MIN_COLS,
  MIN_ROWS,
  MIN_TIMEOUT,
  validateCustomConfig,
} from "../lib/validation";

type Props = {
  defaultConfig?: GameConfig;
  onStart: (config: GameConfig) => void;
};

const difficulties: Difficulty[] = ["easy", "medium", "hard", "custom"];

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: "🌱",
  medium: "🔥",
  hard: "💀",
  custom: "🛠️",
};

const DIFFICULTY_COLORS: Record<
  Difficulty,
  { border: string; glow: string; badge: string }
> = {
  easy: { border: "border-emerald-400", glow: "shadow-emerald-500/30", badge: "bg-emerald-500" },
  medium: { border: "border-amber-400", glow: "shadow-amber-500/30", badge: "bg-amber-500" },
  hard: { border: "border-rose-400", glow: "shadow-rose-500/30", badge: "bg-rose-500" },
  custom: { border: "border-violet-400", glow: "shadow-violet-500/30", badge: "bg-violet-500" },
};

export function StartScreen({ defaultConfig, onStart }: Props) {
  const initialDifficulty: Difficulty = defaultConfig?.difficulty ?? "medium";
  const [selected, setSelected] = useState<Difficulty>(initialDifficulty);

  const initialCustom =
    defaultConfig?.difficulty === "custom" ? defaultConfig : DEFAULT_CUSTOM_CONFIG;
  const [rows, setRows] = useState<number>(initialCustom.rows);
  const [cols, setCols] = useState<number>(initialCustom.cols);
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(initialCustom.timeoutSeconds);

  const customError =
    selected === "custom" ? validateCustomConfig(rows, cols, timeoutSeconds) : null;

  function handleStart() {
    if (selected === "custom") {
      if (customError) return;
      onStart({ difficulty: "custom", rows, cols, timeoutSeconds });
      return;
    }
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
                  type="button"
                  className={`difficulty-card ${
                    isSelected
                      ? `selected ${colors.border} shadow-lg ${colors.glow}`
                      : "unselected"
                  }`}
                  onClick={() => setSelected(diff)}
                >
                  <span className="diff-icon">{DIFFICULTY_ICONS[diff]}</span>
                  <span className="diff-name">{DIFFICULTY_LABELS[diff]}</span>
                  <span className="diff-desc">{DIFFICULTY_DESCRIPTIONS[diff]}</span>
                  {isSelected && <span className={`diff-selected-dot ${colors.badge}`} />}
                </button>
              );
            })}
          </div>

          {selected === "custom" && (
            <div className="custom-form">
              <div className="custom-fields">
                <label className="custom-field">
                  <span className="custom-field-label">Rows</span>
                  <input
                    type="number"
                    min={MIN_ROWS}
                    max={MAX_ROWS}
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="custom-input"
                  />
                  <span className="custom-hint">
                    {MIN_ROWS}–{MAX_ROWS}
                  </span>
                </label>
                <label className="custom-field">
                  <span className="custom-field-label">Columns</span>
                  <input
                    type="number"
                    min={MIN_COLS}
                    max={MAX_COLS}
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="custom-input"
                  />
                  <span className="custom-hint">
                    {MIN_COLS}–{MAX_COLS}
                  </span>
                </label>
                <label className="custom-field">
                  <span className="custom-field-label">Time (s)</span>
                  <input
                    type="number"
                    min={MIN_TIMEOUT}
                    max={MAX_TIMEOUT}
                    value={timeoutSeconds}
                    onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                    className="custom-input"
                  />
                  <span className="custom-hint">
                    {MIN_TIMEOUT}–{MAX_TIMEOUT}
                  </span>
                </label>
              </div>
              <p className={`custom-status ${customError ? "error" : "ok"}`}>
                {customError
                  ? CUSTOM_CONFIG_ERROR_MESSAGES[customError]
                  : `${rows * cols} cards · ${rows * cols / 2} pairs · ${timeoutSeconds}s`}
              </p>
            </div>
          )}
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

        <button
          type="button"
          className="start-btn"
          onClick={handleStart}
          disabled={selected === "custom" && customError !== null}
        >
          Start Game
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            width="20"
            height="20"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
