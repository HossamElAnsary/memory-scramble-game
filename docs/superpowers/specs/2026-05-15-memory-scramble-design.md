# Memory Scramble Game — Design Spec

**Date:** 2026-05-15
**Deadline:** 2026-05-17 23:59
**Stack:** Next.js 16.2.6 (App Router) + React 19.2.4 + TypeScript (strict) + Tailwind CSS v4, pnpm.

## 1. Goal

Implement the Memory Scramble (matching pairs) game described in `docs/planning/Task-4 Software Construction Tools Memory Scramble Game.pdf` as a client-side web app, satisfying every functional requirement in the brief.

### Functional requirements (from the brief)

1. Configurable board size `nRows × nCols`; total cells must be even.
2. Generate `board_size / 2` unique faces, randomly distributed over the cells.
3. Configurable timeout for the game.
4. Countdown timer visible during play.
5. "Game Over" message when the timer reaches 0 with unmatched cards.
6. Player clicks two cells; both flip face-up; matched pairs stay face-up; mismatches flip back. Game ends when every card is matched.

### Non-functional / process requirements

- Public GitHub repo.
- README with build & run instructions.
- Many small, logical commits — no single big dump.

## 2. Architecture

Pure client-side game served by Next.js. Single route (`app/page.tsx`) renders one of three view states driven by a top-level state machine:

```
idle  ──(start)──▶  playing  ──(all matched)──▶  won
                       │
                       └──(timer = 0)─────────▶  lost

won | lost  ──(play again)─▶  idle
```

No server components, no API routes, no persistence — game state is ephemeral and lives in memory.

State is owned by a single custom hook `useMemoryGame`. UI components are presentational and receive state + callbacks via props.

## 3. File layout

```
app/
  page.tsx                         // hosts the state machine + view switch
  layout.tsx                       // (existing)
  globals.css                      // tailwind + card-flip keyframes

components/
  StartScreen.tsx                  // rows / cols / timeout inputs + Start
  GameBoard.tsx                    // grid of cards + HUD
  Card.tsx                         // single cell
  HUD.tsx                          // countdown + moves counter
  ResultOverlay.tsx                // win / game-over + Play Again

lib/
  useMemoryGame.ts                 // game state hook (reducer-based)
  deck.ts                          // generateDeck + Fisher–Yates shuffle
  emoji.ts                         // curated emoji pool
  validation.ts                    // config validation
  types.ts                         // shared types
```

## 4. Types

```ts
// lib/types.ts
export type CardStatus = 'hidden' | 'revealed' | 'matched';

export type Card = {
  id: number;          // stable per-cell id, 0..(rows*cols - 1)
  face: string;        // emoji glyph
  status: CardStatus;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type GameConfig = {
  rows: number;
  cols: number;
  timeoutSeconds: number;
};
```

## 5. Deck generation (`lib/deck.ts`)

- `EMOJI_POOL` (in `lib/emoji.ts`) is a curated list of ~50 visually distinct emoji. This caps the largest supported board at 100 cells (50 pairs), which exceeds the 10×10 UI cap.
- `generateDeck(pairCount: number): Card[]`
  1. Pick `pairCount` unique emoji from the pool (random sample without replacement).
  2. Duplicate each → `pairCount * 2` faces.
  3. Fisher–Yates shuffle.
  4. Map to `Card[]` with `id = index`, `status = 'hidden'`.

The shuffle uses `Math.random()` — no cryptographic guarantees needed.

## 6. Game state hook (`lib/useMemoryGame.ts`)

Implemented with `useReducer` for predictable transitions. The hook returns:

```ts
{
  status: GameStatus;
  cards: Card[];
  remainingMs: number;
  moves: number;
  config: GameConfig | null;
  start: (config: GameConfig) => void;
  flip: (cardId: number) => void;
  reset: () => void;     // back to idle
}
```

### Reducer actions

- `START({ config })` → builds deck, sets `status='playing'`, sets `remainingMs = timeoutSeconds * 1000`, `moves = 0`.
- `FLIP({ id })` — see selection logic below.
- `RESOLVE_PAIR` — called after the mismatch delay; flips the two revealed cards back to hidden.
- `TICK({ deltaMs })` — decrements `remainingMs`; if it reaches 0 and any card is unmatched, transitions to `lost`.
- `RESET` → `status='idle'`, clears cards.

### Selection / flip logic

State tracks `firstId: number | null` and `awaitingResolution: boolean`.

`FLIP({ id })` is a no-op when:
- `status !== 'playing'`
- the card's `status !== 'hidden'`
- `awaitingResolution === true` (the 700ms mismatch window)
- `id === firstId` (clicking the same card twice)

Otherwise:
- If `firstId === null`: set `firstId = id`, mark card `revealed`.
- Else (second card):
  - Mark card `revealed`, increment `moves`.
  - If faces match: both cards → `matched`, clear `firstId`. If every card is matched → `status = 'won'`.
  - If faces don't match: set `awaitingResolution = true`. A `useEffect` schedules `RESOLVE_PAIR` after 700ms.

### Timer

A single `useEffect` while `status === 'playing'` runs `setInterval` every 250ms and dispatches `TICK({ deltaMs: 250 })`. 250ms (not 1000ms) keeps the displayed countdown responsive without measurable cost. Cleanup on status change.

The HUD displays `Math.ceil(remainingMs / 1000)` as whole seconds.

## 7. Validation (`lib/validation.ts`)

```ts
validateConfig(cfg): { ok: true } | { ok: false; error: string }
```

Rules:
- `rows` integer, 2 ≤ rows ≤ 10
- `cols` integer, 2 ≤ cols ≤ 10
- `rows * cols` must be even
- `rows * cols` ≥ 2 and ≤ EMOJI_POOL.length × 2
- `timeoutSeconds` integer, 10 ≤ t ≤ 600

`StartScreen` calls this on submit and renders inline error text; the Start button stays enabled (we show the error rather than silently disabling).

## 8. Components

### `StartScreen` (`components/StartScreen.tsx`)

Three number inputs (rows, cols, timeout in seconds) with default values `4 / 4 / 60`, a "Start Game" button, and an inline error region. Props: `defaultConfig`, `onStart(config)`.

### `GameBoard` (`components/GameBoard.tsx`)

Renders the HUD and a CSS grid of `Card` components. Grid columns set via inline style: `gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))'`. Board container uses `min(80vh, 90vw)` so it scales on any viewport.

### `Card` (`components/Card.tsx`)

A button element with a flip animation. Two faces inside a `.card-inner` div; CSS `transform: rotateY(180deg)` is applied when `status !== 'hidden'`. Disabled (not clickable) when `status === 'matched'` or during the mismatch window (the parent passes a `disabled` prop).

### `HUD` (`components/HUD.tsx`)

Shows `Time: MM:SS` and `Moves: N`. Time text turns red below 10 seconds.

### `ResultOverlay` (`components/ResultOverlay.tsx`)

Absolute-positioned overlay shown when status is `won` or `lost`. Contains:
- Title — "You Win!" or "Game Over"
- Stats — moves taken, time elapsed (or "Time's up")
- "Play Again" button → calls `reset()` (returns to start screen with previous config pre-filled).

## 9. Page wiring (`app/page.tsx`)

```tsx
'use client';
const game = useMemoryGame();
if (game.status === 'idle')         return <StartScreen defaultConfig={...} onStart={game.start} />;
if (game.status === 'won' || 'lost') return <><GameBoard ... /><ResultOverlay ... onPlayAgain={game.reset} /></>;
return <GameBoard ... />;
```

## 10. Styling

Tailwind v4 utility classes throughout. Custom CSS in `globals.css` for the 3D flip:

```css
.card-inner { transform-style: preserve-3d; transition: transform 300ms; }
.card-inner.is-flipped { transform: rotateY(180deg); }
.card-face { backface-visibility: hidden; }
.card-back { transform: rotateY(180deg); }
```

Matched cards get a subtle green tint via a Tailwind class swap.

## 11. Edge cases

- Click a card that's already revealed/matched → no-op.
- Click the same first card twice → no-op (treated as already revealed).
- Click during the 700ms mismatch window → ignored.
- Timer expires while a mismatch is animating → still transitions to `lost` (matched cards count; if not all matched, game is lost).
- All cards matched on the very last flip → win state takes precedence over any remaining time.
- "Play Again" pre-fills the previous config so the user can quickly retry with the same settings.

## 12. Testing strategy

No test runner is configured (per `CLAUDE.md`) and the brief does not require automated tests. Verification is manual:

1. Even-total validation rejects 3×3, 5×5, 3×4 wrong combos.
2. Timer counts down and triggers Game Over at 0.
3. Win triggers when all pairs matched before time-out.
4. Mismatches flip back after the delay; matches stay up.
5. Try 2×2 (smallest), 4×4, 4×6, 6×6, 10×10 (largest).
6. Run `pnpm build` and `pnpm lint` clean before final commit.

## 13. README

The README must cover:
- What the game is (1 paragraph).
- Prerequisites (Node version, pnpm).
- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.
- How to play (configure rows / cols / timeout → Start → click cards).
- Team members and university IDs (filled in by the team).
- Link back to the public GitHub repo.

## 14. Commit plan (~10 commits)

1. Repo scaffold cleanup + README skeleton.
2. `lib/emoji.ts` + `lib/types.ts` + `lib/deck.ts` (deck + shuffle).
3. `lib/validation.ts`.
4. `lib/useMemoryGame.ts` (reducer + timer, no UI yet).
5. `components/Card.tsx` + flip CSS in `globals.css`.
6. `components/GameBoard.tsx` (grid + click wiring).
7. `components/HUD.tsx` (timer + moves).
8. `components/StartScreen.tsx`.
9. `components/ResultOverlay.tsx` (win/lose).
10. README polish + final lint/build fix-ups.

## 15. Out of scope (YAGNI)

- Automated tests (Vitest/Jest). Could be added later if scope allows.
- High-score persistence to localStorage.
- Multi-player / online play.
- Sound effects.
- Theming / dark-mode toggle.
- Difficulty presets.
- Accessibility beyond default semantic buttons + visible focus (no announced live region for timer / status).
