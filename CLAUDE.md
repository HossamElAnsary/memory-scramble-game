# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js version

This repo runs **Next.js 16.2.6** with **React 19.2.4**. The pinned `AGENTS.md` warning is load-bearing: APIs, conventions, and file layout differ from older Next.js versions that dominate training data. Before writing or modifying any Next.js code (routing, server components, caching, `fetch` semantics, metadata, config, etc.), read the relevant page under `node_modules/next/dist/docs/` (entry: `index.md`, app-router specifics under `01-app/`). Treat that local doc tree — not memory — as the source of truth, and respect any deprecation notices it surfaces.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`, `pnpm-workspace.yaml`).

- `pnpm dev` — start the Next.js dev server on http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + TypeScript presets)

There is no test runner configured.

## Architecture

- **App Router** project. All routes live under `app/` (`layout.tsx`, `page.tsx`, `globals.css`). No `pages/` directory, no `src/` directory.
- **Styling**: Tailwind CSS v4 via the `@tailwindcss/postcss` plugin (`postcss.config.mjs`). Global styles in `app/globals.css`.
- **TypeScript**: strict mode on; path alias `@/*` resolves from the repo root (`tsconfig.json`).
- **pnpm built-dependency allowlist**: `sharp` and `unrs-resolver` are listed under `ignoredBuiltDependencies` in `pnpm-workspace.yaml` — do not "fix" this by enabling their build scripts without a reason.
