# Agent Guide — Bhāṣā (Sanskrit Learning Platform)

This file is the AI agent's cross-session reference. Read this first in every session.

## What is this project?

A Sanskrit learning platform (PWA) that teaches reading, pronunciation, and grammar through structured lessons, spaced repetition, and a tap-to-understand Reader. Supports English and Tamil learners. Product name: Bhāṣā (भाषा · பாஷா).

## Key Documents

| File | Purpose | Modify? |
|------|---------|--------|
| `SPEC.md` | Product specification (user perspective) | No |
| `DESIGN.md` | Visual/interaction design spec | No |
| `docs/architecture.md` | System architecture & tech stack | Update as needed |
| `docs/database.md` | Database schema | Update as needed |
| `docs/api.md` | API routes | Update as needed |
| `docs/project-structure.md` | File/folder layout & conventions | Update as needed |
| `docs/sprints.md` | Sprint plan with task checklists | Update on completion |
| `agent.md` | This file | Update as needed |

## Tech Stack (quick ref)

- **Next.js 15** (App Router, RSC)
- **TypeScript** (strict)
- **React 19** + **Tailwind CSS v4**
- **Zustand** (state)
- **Supabase** (PostgreSQL + Auth + Storage)
- **Drizzle ORM**
- **Redis / Upstash** (cache, rate limits)
- **Vitest** (unit) + **Playwright** (E2E)
- **Vercel** (deploy)

## Development Approach

1. **Sprint-based:** Each sprint (~1 week) delivers one user-facing feature
2. **Test-driven:** Write tests within each sprint. Run tests before marking tasks done
3. **Incremental:** Each sprint builds on the previous. Never skip sprints
4. **Content-seeded:** Seed real Sanskrit content (not placeholder) for each feature

## Current Sprint

> **Sprint 1 — Project Setup & Landing Page** (COMPLETED)
> **Sprint 2 — Onboarding Flow** (COMPLETED)
> **Sprint 3 — Home Screen & Navigation** (COMPLETED)
> **Sprint 4 — Lesson Engine (Core)** (COMPLETED)
> **Sprint 5 — Audio & Pronunciation** (COMPLETED)
> **Sprint 6 — More Exercise Types** (COMPLETED)
> **Sprint 7 — Spaced Repetition Review** (COMPLETED)
> **Sprint 8 — Reader (Basic)** (COMPLETED)
> **Sprint 9 — Reader (AI Translation + Library)** (COMPLETED)
> **Sprint 10 — Dictionary & Grammar Reference** (COMPLETED)
> **Sprint 11 — AI Tutor** (COMPLETED)
> **Sprint 12 — Progress & Motivation** (NEXT)

See `docs/sprints.md` for the full plan.

## Rules for the Agent

1. **Read this file first** at the start of every session
2. **Check `docs/sprints.md`** for current sprint status before starting work
3. **Follow `docs/project-structure.md`** for file placement
4. **Follow `docs/architecture.md`** for technical decisions
5. **Reference `SPEC.md`** for product behavior questions
6. **Reference `DESIGN.md`** for visual/interaction questions
7. **Run tests** after implementing features: `npm test` (unit), `npx playwright test` (E2E)
8. **Update `docs/sprints.md`** — check off completed tasks
9. **Update this file's "Current Sprint"** section when moving to the next sprint
10. **Never modify `SPEC.md` or `DESIGN.md`** — these are source-of-truth inputs

## Design Token Quick Reference

CSS variables are defined in `src/styles/globals.css` per DESIGN.md §12. Key tokens:

- Colors: `--ink`, `--paper`, `--haldi`, `--neel`, `--tulsi`, `--sindoor`, `--agni`, `--mayura`
- Spacing: `--s-1` (4px) through `--s-8` (64px)
- Radii: `--r-control` (14px), `--r-card` (16px), `--r-sheet` (24px), `--r-pill` (999px)
- Motion: `--dur-instant` (80ms), `--dur-fast` (140ms), `--dur-base` (220ms), `--dur-slow` (360ms)

## Sanskrit Handling

- Internal storage: Devanāgarī (canonical)
- Display: runtime transliteration to user's chosen script
- Scripts: Devanāgarī, Tamil (with Grantha), IAST (Roman)
- All Sanskrit strings in code must be real, reviewed Sanskrit

## i18n

- Two interface languages: English (`en`), Tamil (`ta`)
- Lesson content is **authored separately** per language (not machine-translated)
- UI strings: `src/i18n/en.json`, `src/i18n/ta.json`
- Language tag every text run: `lang="sa"`, `lang="ta"`, `lang="en"`
