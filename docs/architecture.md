# System Architecture

## Overview

Haṃsa is a Sanskrit learning platform. Mobile-web-first, progressive web app. Monorepo, three layers: client → API → data.

```
┌─────────────────────────────────────────────────┐
│                   CLIENT (SPA)                  │
│  Next.js App Router · React · TypeScript        │
│  PWA (offline lessons) · i18n (en/ta)           │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS / JSON
┌──────────────────────▼──────────────────────────┐
│                   API SERVER                    │
│  Next.js API Routes / tRPC                      │
│  Auth · Lessons · Reader · Review · Progress    │
└──────┬───────────┬───────────┬──────────────────┘
       │           │           │
┌──────▼──┐  ┌─────▼────┐  ┌──▼──────────────┐
│PostgreSQL│  │  Redis   │  │ Object Storage │
│(Supabase)│  │ (cache)  │  │ (audio/assets) │
└─────────┘  └──────────┘  └────────────────┘
       │
┌──────▼──────────────────────────────────────────┐
│              EXTERNAL SERVICES                  │
│  LLM API (tutor/translation) · Auth provider    │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | SSR for SEO landing, RSC for lessons, API routes colocated |
| Language | TypeScript (strict) | Type safety across stack |
| UI | React 19 + Tailwind CSS v4 | Component model, design tokens via CSS vars |
| State | Zustand | Lightweight, works with SSR |
| DB | PostgreSQL via Supabase | Auth + DB + Realtime + Storage in one |
| Cache | Redis (Upstash) | Session, SRS scheduling, rate limits |
| ORM | Drizzle ORM | Type-safe, lightweight, SQL-first |
| Auth | Supabase Auth | Email + Google, row-level security |
| Audio | Supabase Storage / CDN | Streaming, offline cache via SW |
| AI/LLM | OpenAI / Gemini API | Tutor chat, Reader translations |
| Testing | Vitest + Playwright | Unit + E2E |
| Deploy | Vercel | Edge functions, preview deploys |

## Domain Model

```
User
  ├── preferences: { learnIn, showSanskritIn, helperLine, dailyGoal }
  ├── progress: UserProgress[]
  └── reviewQueue: ReviewItem[]

Curriculum
  ├── Level (0-5)
  │   └── Unit
  │       └── Lesson
  │           ├── steps: LessonStep[] (see-it, notice-it, rule, exercise, recap)
  │           └── exercises: Exercise[]
  └── ReadingPath
      └── ReadingPassage

Content
  ├── Word { devanagari, tamil, iast, meanings[], root, grammar }
  ├── Text { source, sanskrit, translations[], difficulty }
  └── AudioClip { url, syllableTimestamps[] }

Review (SRS)
  ├── item: Word | GrammarRule
  ├── nextDue: timestamp
  ├── interval, easeFactor
  └── history: ReviewAttempt[]
```

## Key Modules

### 1. Curriculum Engine
- Serves lessons as ordered step sequences
- Tracks skill prerequisites (DAG)
- Manages placement quiz logic (adaptive difficulty)

### 2. Sanskrit Processing
- Script transliteration (Devanāgarī ↔ Tamil ↔ IAST)
- Sandhi splitting (rule-based + dictionary lookup)
- Morphological analysis (word → root + grammar)
- Uses a combination of rule engine + dictionary DB

### 3. Reader Pipeline
- Input: Sanskrit text (any script, auto-detected)
- Stage 1: Script normalization → Devanāgarī internal
- Stage 2: Sandhi split → word tokens
- Stage 3: Dictionary lookup → meanings + grammar
- Stage 4: LLM translation (cached, labeled "AI-assisted")
- Streams results stage-by-stage to client

### 4. SRS (Spaced Repetition System)
- SM-2 algorithm variant
- Items: words, grammar rules, forms
- Due items calculated server-side, served as review sessions
- Forgiveness: missed day ≠ reset

### 5. AI Tutor
- Context-aware: receives current lesson/word/sentence context
- Grounded: responses reference verified lesson content + grammar DB
- Rate-limited per user per day
- All responses labeled "AI tutor"

### 6. i18n System
- Interface strings: en.json / ta.json
- Sanskrit display: runtime script conversion (single source in Devanāgarī)
- Lesson content: authored separately for EN and TA (not translated)
- Switching language re-renders entire UI, no progress loss

## Data Flow: Lesson Session

```
User opens Home
  → API: GET /api/today (next lesson, review count, reading suggestion)
  → User taps "Start lesson"
  → API: GET /api/lessons/{id} (full lesson with steps + exercises)
  → Client renders step-by-step (offline-capable once cached)
  → Each answer: POST /api/progress/answer { lessonId, exerciseId, answer, correct }
  → On complete: POST /api/progress/complete { lessonId, newSkills[], wordsLearned[] }
  → SRS items created for new words/rules
  → Home refreshes with updated state
```

## Offline Strategy

- Service Worker caches current + next 7 days of lessons
- Audio files cached alongside lesson data
- Answers queued in IndexedDB, synced on reconnect
- Reader requires network (LLM dependency); shows clear offline message
- AI Tutor requires network; graceful degradation

## Security

- Supabase RLS: users access only their own data
- API rate limiting: Redis-backed, per-user
- LLM proxy: never expose API keys to client
- Input sanitization: all Sanskrit input validated before processing
- CORS: strict origin allowlist
