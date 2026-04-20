# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Orbara — Institutional Website

**Artifact**: `artifacts/orbara` (React + Vite, previewPath `/`)

Institutional site for Orbara, a Brazilian boutique advertising agency.

### Brand
- Orange: `#ff5d00`
- Deep Black: `#0d0101`
- Starlight off-white: `#fffafa`
- Font: **Onest** (Google Fonts, all weights)

### Features
- Single-page scroll experience, fully in Portuguese
- Giant Onest typography, pill-shaped blocks
- CSS 3D orbit planet animation in the hero (no WebGL — uses CSS perspective + keyframes for rings, dots, and the planet with surface bands)
- Light/dark mode toggle (light default); ThemeProvider in `src/context/theme.tsx` updates `document.body` background and `document.documentElement` class
- OrbitDecoration CSS 3D rings scattered across sections (Manifesto, Serviços, Processo, Para Quem, Resultados, Contato, Footer)
- Framer Motion scroll-triggered animations
- Radix Accordion FAQ
- React Hook Form + Zod contact form with Portuguese validation
- Animated counter numbers in Results section
- Floating WhatsApp CTA button
- Custom orange cursor (desktop only)
- Responsive mobile menu

### Key Files
- `src/pages/Home.tsx` — all page sections + theme-aware classes
- `src/components/OrbScene.tsx` — CSS 3D planet + orbital rings animation
- `src/components/OrbitDecoration.tsx` — decorative CSS orbit ring elements
- `src/context/theme.tsx` — ThemeProvider, useTheme hook
- `src/index.css` — Onest font, HSL palette, `orbitSpin` keyframe
- `src/App.tsx` — wrapped with ThemeProvider
