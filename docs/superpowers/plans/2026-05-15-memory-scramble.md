# Memory Scramble Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a configurable Memory Scramble (matching pairs) game per `docs/superpowers/specs/2026-05-15-memory-scramble-design.md`, deliverable to the public GitHub repo by 2026-05-17.

**Architecture:** Single-route Next.js App Router client-side game. A reducer-based hook (`useMemoryGame`) owns all state and the countdown timer. Presentational components (`StartScreen`, `GameBoard`, `Card`, `HUD`, `ResultOverlay`) render based on game status. No persistence, no server code.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript (strict), Tailwind CSS v4, pnpm.

**Testing note:** Per the spec and `CLAUDE.md` ("There is no test runner configured"), this plan uses **manual verification** instead of TDD. Each task ends with explicit manual checks plus `pnpm lint` / `pnpm build` smoke runs.

**Next.js note:** The repo's `AGENTS.md` warns this Next.js version differs from training data. Before editing routes/layouts/metadata/config, consult `node_modules/next/dist/docs/index.md` and `node_modules/next/dist/docs/01-app/` as the source of truth.

**Path alias:** `@/*` resolves from the repo root (`tsconfig.json`). Use `@/lib/...` and `@/components/...` in imports.

---

## Task 1: Scaffold cleanup and README skeleton

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `README.md`
- Delete: `public/next.svg`, `public/vercel.svg` (only if present and unused after edits)

- [ ] **Step 1: Replace `app/page.tsx` with a placeholder**

Replace the entire contents with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <h1 className="text-2xl font-semibold">Memory Scramble</h1>
    </main>
  );
}
```

- [ ] **Step 2: Update metadata in `app/layout.tsx`**

Change the `metadata` export to:

```tsx
export const metadata: Metadata = {
  title: "Memory Scramble",
  description: "A configurable memory matching-pairs game.",
};
```

Leave the rest of `app/layout.tsx` (fonts, html/body) untouched.

- [ ] **Step 3: Trim `app/globals.css`**

Replace the file with:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

(Card-flip CSS is added in Task 5.)

- [ ] **Step 4: Replace `README.md` with a skeleton**

```markdown
# Memory Scramble

A configurable memory matching-pairs game built with Next.js and React.

## Team

- [Name] — [University ID]
- [Name] — [University ID]

## Prerequisites

- Node.js 20+
- pnpm 9+

## Install

\`\`\`bash
pnpm install
\`\`\`

## Develop

\`\`\`bash
pnpm dev
\`\`\`

Open http://localhost:3000.

## Build & run production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Lint

\`\`\`bash
pnpm lint
\`\`\`

## How to play

(Filled in once the UI is built.)
```

(Replace the literal `\`\`\`` fences with real triple backticks when writing the file.)

- [ ] **Step 5: Verify build + lint pass**

Run:
```bash
pnpm lint
pnpm build
```
Expected: both exit 0. Build output reports a single static route `/`.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css README.md
git commit -m "chore: scaffold cleanup and README skeleton"
```

---

## Task 2: Types, emoji pool, deck generation

**Files:**
- Create: `lib/types.ts`
- Create: `lib/emoji.ts`
- Create: `lib/deck.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
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
```

- [ ] **Step 2: Create `lib/emoji.ts`**

```ts
export const EMOJI_POOL: readonly string[] = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺",
  "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
  "🐢", "🐍", "🦎", "🦖", "🐙", "🦑", "🦐", "🦀",
  "🐠", "🐟", "🐬", "🐳", "🐊", "🐅", "🐆", "🦓",
  "🦍", "🦧",
];
```

- [ ] **Step 3: Create `lib/deck.ts`**

```ts
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
```

- [ ] **Step 4: Manual verification via a one-off script**

Run:
```bash
pnpm exec tsx --eval "import('./lib/deck.ts').then(m => { const d = m.generateDeck(8); console.log(d.length, d.map(c => c.face).sort().join(' ')); })"
```

If `tsx` is not installed, instead temporarily import `generateDeck` in `app/page.tsx`, log to the console in a `useEffect`, and visually confirm in browser devtools — then revert the page change before committing.

Expected: 16 cards; each face appears exactly twice.

- [ ] **Step 5: Lint passes**

```bash
pnpm lint
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/emoji.ts lib/deck.ts
git commit -m "feat: add card types, emoji pool, and deck generation"
```

---

## Task 3: Config validation

**Files:**
- Create: `lib/validation.ts`

- [ ] **Step 1: Create `lib/validation.ts`**

```ts
import type { GameConfig } from "./types";
import { EMOJI_POOL } from "./emoji";

export const MIN_DIM = 2;
export const MAX_DIM = 10;
export const MIN_TIMEOUT = 10;
export const MAX_TIMEOUT = 600;
export const MAX_CELLS = EMOJI_POOL.length * 2;

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateConfig(cfg: GameConfig): ValidationResult {
  const { rows, cols, timeoutSeconds } = cfg;

  if (!Number.isInteger(rows) || rows < MIN_DIM || rows > MAX_DIM) {
    return { ok: false, error: `Rows must be an integer between ${MIN_DIM} and ${MAX_DIM}.` };
  }
  if (!Number.isInteger(cols) || cols < MIN_DIM || cols > MAX_DIM) {
    return { ok: false, error: `Columns must be an integer between ${MIN_DIM} and ${MAX_DIM}.` };
  }
  const total = rows * cols;
  if (total % 2 !== 0) {
    return { ok: false, error: "Total number of cells (rows × cols) must be even." };
  }
  if (total > MAX_CELLS) {
    return { ok: false, error: `Board has ${total} cells; max supported is ${MAX_CELLS}.` };
  }
  if (
    !Number.isInteger(timeoutSeconds) ||
    timeoutSeconds < MIN_TIMEOUT ||
    timeoutSeconds > MAX_TIMEOUT
  ) {
    return {
      ok: false,
      error: `Timeout must be an integer between ${MIN_TIMEOUT} and ${MAX_TIMEOUT} seconds.`,
    };
  }
  return { ok: true };
}
```

- [ ] **Step 2: Lint passes**

```bash
pnpm lint
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add lib/validation.ts
git commit -m "feat: add game config validation"
```

---

## Task 4: Game state hook (`useMemoryGame`)

**Files:**
- Create: `lib/useMemoryGame.ts`

- [ ] **Step 1: Create `lib/useMemoryGame.ts`**

```ts
"use client";

import { useEffect, useReducer, useRef } from "react";
import type { Card, GameConfig, GameStatus } from "./types";
import { generateDeck } from "./deck";

const MISMATCH_DELAY_MS = 700;
const TICK_MS = 250;

type State = {
  status: GameStatus;
  cards: Card[];
  config: GameConfig | null;
  remainingMs: number;
  moves: number;
  firstId: number | null;
  awaitingResolution: boolean;
};

type Action =
  | { type: "START"; config: GameConfig }
  | { type: "FLIP"; id: number }
  | { type: "RESOLVE_PAIR" }
  | { type: "TICK"; deltaMs: number }
  | { type: "RESET" };

const initialState: State = {
  status: "idle",
  cards: [],
  config: null,
  remainingMs: 0,
  moves: 0,
  firstId: null,
  awaitingResolution: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START": {
      const { rows, cols, timeoutSeconds } = action.config;
      const cards = generateDeck((rows * cols) / 2);
      return {
        status: "playing",
        cards,
        config: action.config,
        remainingMs: timeoutSeconds * 1000,
        moves: 0,
        firstId: null,
        awaitingResolution: false,
      };
    }

    case "FLIP": {
      if (state.status !== "playing") return state;
      if (state.awaitingResolution) return state;
      const card = state.cards[action.id];
      if (!card || card.status !== "hidden") return state;
      if (state.firstId === action.id) return state;

      const cards = state.cards.map((c) =>
        c.id === action.id ? { ...c, status: "revealed" as const } : c,
      );

      if (state.firstId === null) {
        return { ...state, cards, firstId: action.id };
      }

      const first = cards[state.firstId];
      const second = cards[action.id];
      const moves = state.moves + 1;

      if (first.face === second.face) {
        const matchedCards = cards.map((c) =>
          c.id === first.id || c.id === second.id
            ? { ...c, status: "matched" as const }
            : c,
        );
        const allMatched = matchedCards.every((c) => c.status === "matched");
        return {
          ...state,
          cards: matchedCards,
          moves,
          firstId: null,
          status: allMatched ? "won" : "playing",
        };
      }

      return {
        ...state,
        cards,
        moves,
        awaitingResolution: true,
      };
    }

    case "RESOLVE_PAIR": {
      if (!state.awaitingResolution) return state;
      const cards = state.cards.map((c) =>
        c.status === "revealed" ? { ...c, status: "hidden" as const } : c,
      );
      return { ...state, cards, firstId: null, awaitingResolution: false };
    }

    case "TICK": {
      if (state.status !== "playing") return state;
      const remainingMs = Math.max(0, state.remainingMs - action.deltaMs);
      if (remainingMs === 0) {
        const allMatched = state.cards.every((c) => c.status === "matched");
        return {
          ...state,
          remainingMs: 0,
          status: allMatched ? "won" : "lost",
        };
      }
      return { ...state, remainingMs };
    }

    case "RESET":
      return { ...initialState, config: state.config };

    default:
      return state;
  }
}

export function useMemoryGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mismatch resolution timer.
  useEffect(() => {
    if (!state.awaitingResolution) return;
    resolveTimerRef.current = setTimeout(() => {
      dispatch({ type: "RESOLVE_PAIR" });
    }, MISMATCH_DELAY_MS);
    return () => {
      if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    };
  }, [state.awaitingResolution]);

  // Countdown timer.
  useEffect(() => {
    if (state.status !== "playing") return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK", deltaMs: TICK_MS });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [state.status]);

  return {
    status: state.status,
    cards: state.cards,
    config: state.config,
    remainingMs: state.remainingMs,
    moves: state.moves,
    start: (config: GameConfig) => dispatch({ type: "START", config }),
    flip: (id: number) => dispatch({ type: "FLIP", id }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
```

- [ ] **Step 2: Lint + type-check via build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0. (The hook isn't used yet, so build will tree-shake it.)

- [ ] **Step 3: Commit**

```bash
git add lib/useMemoryGame.ts
git commit -m "feat: add useMemoryGame reducer hook with countdown"
```

---

## Task 5: Card component + flip animation

**Files:**
- Create: `components/Card.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Append card-flip CSS to `app/globals.css`**

Append these blocks to the existing file:

```css
.card {
  perspective: 800px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 300ms;
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 0.75rem;
  user-select: none;
}

.card-back {
  transform: rotateY(180deg);
}
```

- [ ] **Step 2: Create `components/Card.tsx`**

```tsx
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
```

- [ ] **Step 3: Lint + build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/Card.tsx app/globals.css
git commit -m "feat: add Card component with flip animation"
```

---

## Task 6: GameBoard component

**Files:**
- Create: `components/GameBoard.tsx`

- [ ] **Step 1: Create `components/GameBoard.tsx`**

```tsx
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
```

- [ ] **Step 2: Lint + build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/GameBoard.tsx
git commit -m "feat: add GameBoard grid component"
```

---

## Task 7: HUD component (timer + moves)

**Files:**
- Create: `components/HUD.tsx`

- [ ] **Step 1: Create `components/HUD.tsx`**

```tsx
"use client";

type Props = {
  remainingMs: number;
  moves: number;
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function HUD({ remainingMs, moves }: Props) {
  const lowTime = remainingMs <= 10_000;
  return (
    <div className="flex w-full items-center justify-between px-2 py-3 text-lg font-medium">
      <span
        className={lowTime ? "text-red-600 dark:text-red-400" : ""}
        aria-live="polite"
      >
        Time: {formatTime(remainingMs)}
      </span>
      <span>Moves: {moves}</span>
    </div>
  );
}
```

- [ ] **Step 2: Lint + build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/HUD.tsx
git commit -m "feat: add HUD with countdown timer and moves counter"
```

---

## Task 8: StartScreen component

**Files:**
- Create: `components/StartScreen.tsx`

- [ ] **Step 1: Create `components/StartScreen.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { GameConfig } from "@/lib/types";
import { validateConfig } from "@/lib/validation";

type Props = {
  defaultConfig: GameConfig;
  onStart: (config: GameConfig) => void;
};

export function StartScreen({ defaultConfig, onStart }: Props) {
  const [rows, setRows] = useState(defaultConfig.rows);
  const [cols, setCols] = useState(defaultConfig.cols);
  const [timeoutSeconds, setTimeoutSeconds] = useState(
    defaultConfig.timeoutSeconds,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const config: GameConfig = { rows, cols, timeoutSeconds };
    const result = validateConfig(config);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onStart(config);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-700"
    >
      <h1 className="text-2xl font-semibold">Memory Scramble</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Rows</span>
        <input
          type="number"
          min={2}
          max={10}
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Columns</span>
        <input
          type="number"
          min={2}
          max={10}
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm">Timeout (seconds)</span>
        <input
          type="number"
          min={10}
          max={600}
          value={timeoutSeconds}
          onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
          className="rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Start Game
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Lint + build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/StartScreen.tsx
git commit -m "feat: add StartScreen with config inputs and validation"
```

---

## Task 9: ResultOverlay + wire everything in `app/page.tsx`

**Files:**
- Create: `components/ResultOverlay.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/ResultOverlay.tsx`**

```tsx
"use client";

type Props = {
  status: "won" | "lost";
  moves: number;
  timeoutSeconds: number;
  remainingMs: number;
  onPlayAgain: () => void;
};

export function ResultOverlay({
  status,
  moves,
  timeoutSeconds,
  remainingMs,
  onPlayAgain,
}: Props) {
  const elapsedSeconds = Math.max(
    0,
    timeoutSeconds - Math.ceil(remainingMs / 1000),
  );
  const title = status === "won" ? "You Win!" : "Game Over";
  const subtitle =
    status === "won"
      ? `Finished in ${elapsedSeconds}s and ${moves} moves.`
      : "Time's up — better luck next time.";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full bg-zinc-900 px-6 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { GameConfig } from "@/lib/types";
import { useMemoryGame } from "@/lib/useMemoryGame";
import { StartScreen } from "@/components/StartScreen";
import { GameBoard } from "@/components/GameBoard";
import { HUD } from "@/components/HUD";
import { ResultOverlay } from "@/components/ResultOverlay";

const DEFAULT_CONFIG: GameConfig = {
  rows: 4,
  cols: 4,
  timeoutSeconds: 60,
};

export default function Home() {
  const game = useMemoryGame();
  const [lastConfig, setLastConfig] = useState<GameConfig>(DEFAULT_CONFIG);

  function handleStart(config: GameConfig) {
    setLastConfig(config);
    game.start(config);
  }

  if (game.status === "idle" || game.config === null) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <StartScreen defaultConfig={lastConfig} onStart={handleStart} />
      </main>
    );
  }

  const overlayStatus =
    game.status === "won" || game.status === "lost" ? game.status : null;

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <HUD remainingMs={game.remainingMs} moves={game.moves} />
      </div>
      <GameBoard
        cards={game.cards}
        config={game.config}
        disabled={game.status !== "playing"}
        onFlip={game.flip}
      />
      {overlayStatus && (
        <ResultOverlay
          status={overlayStatus}
          moves={game.moves}
          timeoutSeconds={game.config.timeoutSeconds}
          remainingMs={game.remainingMs}
          onPlayAgain={game.reset}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 3: Lint + build**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 4: Manual smoke test**

Run `pnpm dev` and open http://localhost:3000. Verify the full flow:

1. Start screen shows with defaults 4 / 4 / 60.
2. Try invalid configs (rows=3, cols=3 → odd total): inline error shows, no transition.
3. Submit valid 4×4 / 60s: board renders, timer counts down, moves counter at 0.
4. Click two non-matching cards → they flip up, ~700ms later they flip back. Moves = 1.
5. Click two matching cards → they stay up (matched, green tint). Moves = 2.
6. Match all pairs → "You Win!" overlay with stats; click Play Again → returns to start screen with last config pre-filled.
7. Start a 4×4 / 10s game and let the timer hit 0 with cards still hidden → "Game Over" overlay.
8. Try 2×2, 4×6, 6×6, 10×10 — grid scales correctly.

Stop the dev server after testing.

- [ ] **Step 5: Commit**

```bash
git add components/ResultOverlay.tsx app/page.tsx
git commit -m "feat: wire start screen, board, HUD, and result overlay"
```

---

## Task 10: README polish

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Fill in "How to play" and any missing sections**

Update `README.md` so the "How to play" section reads:

```markdown
## How to play

1. On the start screen, enter the number of **rows**, **columns**, and **timeout** in seconds.
   - Rows and columns must each be 2–10, and `rows × cols` must be even.
   - Timeout must be 10–600 seconds.
2. Click **Start Game**.
3. Click any two cards to flip them. Matching pairs stay face-up; mismatches flip back after a short delay.
4. Match every pair before the timer hits 0 to win.
5. If the timer reaches 0 with unmatched cards, the game ends. Click **Play Again** to retry with the same (or new) settings.
```

Confirm the Team section has placeholders the team can fill in, and that the prereqs and command sections still reflect Task 1.

- [ ] **Step 2: Final lint + build pass**

```bash
pnpm lint
pnpm build
```
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: complete README with gameplay instructions"
```

- [ ] **Step 4: Final git log review**

Run:
```bash
git log --oneline
```
Expected: 10 commits since `Initial commit from Create Next App`, each describing a focused step (no single "big commit"). This satisfies the brief's "no one big commit" rule.

---

## Out of scope (do not implement)

- Automated test suite (Vitest/Jest).
- LocalStorage best-score persistence.
- Sound effects, difficulty presets, theming toggles.
- Accessibility beyond semantic buttons + visible focus and the timer's `aria-live="polite"`.

## After implementation

- Push to the public GitHub repo (team to confirm the URL).
- One team member submits the text file to Google Classroom with team names, IDs, and the repo URL, by 2026-05-17 23:59.
