# Memory Scramble

A configurable memory matching-pairs game built with Next.js and React.

## Run with Docker (recommended)

Only requirement: Docker with Compose v2.

```bash
docker compose up --build
```

Then open http://localhost:3000. Stop with `Ctrl+C`.

The first build takes about a minute (downloads `node:22-alpine` and installs dependencies); subsequent runs reuse the cache and start instantly.

### Docker helper scripts

If you also have Node and pnpm installed, these aliases save typing:

| Command | What it does |
|---|---|
| `pnpm docker:up` | Build + run in the foreground (Ctrl+C to stop) |
| `pnpm docker:start` | Build + run detached in the background |
| `pnpm docker:stop` | Stop and remove the container |
| `pnpm docker:logs` | Tail logs of the running container |
| `pnpm docker:rebuild` | Force a fresh rebuild and recreate the container |

## Run locally (without Docker)

### Prerequisites

- Node.js 22+
- pnpm 10+

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev
```

Open http://localhost:3000.

### Build & run production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## How to play

1. On the start screen, enter the number of **rows**, **columns**, and **timeout** in seconds.
   - Rows and columns must each be 2–10, and `rows × cols` must be even.
   - Timeout must be 10–600 seconds.
2. Click **Start Game**.
3. Click any two cards to flip them. Matching pairs stay face-up; mismatches flip back after a short delay.
4. Match every pair before the timer hits 0 to win.
5. If the timer reaches 0 with unmatched cards, the game ends. Click **Play Again** to retry with the same (or new) settings.
