# Project Structure

Next.js 15 App Router monorepo.

```
agile-basha/
├── SPEC.md                    # Product specification (do not modify)
├── DESIGN.md                  # Design specification (do not modify)
├── agent.md                   # AI agent guide (cross-session)
├── docs/
│   ├── architecture.md        # System architecture
│   ├── database.md            # Database schema
│   ├── api.md                 # API routes
│   ├── project-structure.md   # This file
│   └── sprints.md             # Sprint plan
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (fonts, i18n provider, theme)
│   │   ├── page.tsx           # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/             # Authenticated app shell
│   │   │   ├── layout.tsx     # App layout with bottom nav
│   │   │   ├── home/
│   │   │   ├── learn/
│   │   │   ├── read/
│   │   │   ├── practice/
│   │   │   └── me/
│   │   ├── lesson/
│   │   │   └── [id]/          # Lesson focus mode (no nav)
│   │   ├── onboarding/
│   │   └── api/               # API routes
│   │       ├── today/
│   │       ├── lessons/
│   │       ├── review/
│   │       ├── reader/
│   │       ├── dictionary/
│   │       ├── tutor/
│   │       ├── progress/
│   │       ├── preferences/
│   │       ├── onboarding/
│   │       └── taster/
│   ├── components/
│   │   ├── ui/                # Base components (Button, Card, Input...)
│   │   ├── sanskrit/          # SanskritText, HelperLine, AudioButton
│   │   ├── lesson/            # LessonStep, ExerciseCard, FeedbackSheet
│   │   ├── reader/            # TokenChip, AmbiguityBanner, TextBlock
│   │   ├── review/            # ReviewCard, SRSProgress
│   │   ├── navigation/        # BottomNav, TopBar, SearchBar
│   │   └── onboarding/        # OnboardingSteps, PlacementQuiz
│   ├── lib/
│   │   ├── db/                # Drizzle schema, client, migrations
│   │   │   ├── schema.ts
│   │   │   ├── client.ts
│   │   │   └── migrations/
│   │   ├── sanskrit/           # Sanskrit processing
│   │   │   ├── transliterate.ts
│   │   │   ├── sandhi.ts
│   │   │   └── morphology.ts
│   │   ├── srs/               # Spaced repetition algorithm
│   │   │   └── sm2.ts
│   │   ├── ai/                # LLM integration
│   │   │   ├── tutor.ts
│   │   │   └── translator.ts
│   │   ├── auth/              # Supabase auth helpers
│   │   └── utils/             # Shared utilities
│   ├── hooks/                 # React hooks
│   │   ├── useLesson.ts
│   │   ├── useReview.ts
│   │   ├── useAudio.ts
│   │   ├── usePreferences.ts
│   │   └── useSanskritInput.ts
│   ├── stores/                # Zustand stores
│   │   ├── lessonStore.ts
│   │   ├── preferencesStore.ts
│   │   └── progressStore.ts
│   ├── i18n/                  # Internationalization
│   │   ├── en.json
│   │   ├── ta.json
│   │   └── provider.tsx
│   ├── styles/
│   │   ├── globals.css        # Design tokens (CSS vars from DESIGN.md §12)
│   │   └── fonts.ts           # Font loading config
│   └── types/                 # Shared TypeScript types
│       ├── lesson.ts
│       ├── exercise.ts
│       ├── user.ts
│       └── sanskrit.ts
├── public/
│   ├── fonts/                 # Self-hosted WOFF2 fonts
│   ├── audio/                 # Lesson audio files
│   └── icons/                 # App icons
├── tests/
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # API integration tests
│   └── e2e/                   # Playwright E2E tests
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|----------|
| Components | PascalCase | `FeedbackSheet.tsx` |
| Hooks | camelCase with `use` prefix | `useLesson.ts` |
| Stores | camelCase with `Store` suffix | `lessonStore.ts` |
| API routes | kebab-case folders | `api/review/session` |
| DB tables | snake_case | `user_progress` |
| CSS tokens | kebab-case with `--` prefix | `--haldi-edge` |
| Types | PascalCase | `LessonStep` |
| Test files | `*.test.ts` / `*.spec.ts` | `sm2.test.ts` |
