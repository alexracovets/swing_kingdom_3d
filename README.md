# Swing Kingdom 3D Configurator

New web configurator for Swing Kingdom playground sets. Replaces the legacy
`swingkingdom.com/design-center/`.

**Stack:** Next.js 16 (App Router, React Compiler, Turbopack) · React 19 ·
React-Three-Fiber + three.js · Tailwind CSS v4 · Zustand · Vitest.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (runs `tsc` type-check) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm test` | Vitest (unit) |
| `pnpm test:watch` | Vitest watch mode |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the layer map, dependency rules,
naming/export conventions, path aliases and the Building model spec.

Short version:

- `src/configurator/brain/` — pure configurator logic (no React, no three.js).
- `src/configurator/eyes/` — the React-Three-Fiber rendering layer.
- `src/store/` — Zustand bridge between `brain`, `eyes` and `ui`.
- `src/ui/` — presentation only (atomic design + shadcn primitives).

## 3D assets

Optimised GLB models live under `public/models/`, one folder per part. The
current test model is `public/models/buildings/Super59_5ft_Deck.glb`.
