# API Design

Next.js API Routes. JSON request/response. Auth via Supabase JWT in Authorization header.

## Conventions

- All routes under `/api/`
- Auth required unless marked `[public]`
- Errors: `{ error: string, code: string }`
- Pagination: `?cursor=<id>&limit=<n>`

## Routes

### Auth

Handled by Supabase client SDK. No custom auth routes.

### Onboarding

```
POST /api/onboarding/preferences
  Body: { learnIn, script, helperLine, goals[], dailyGoalMin }
  → 200 { preferences }

POST /api/onboarding/placement
  Body: { answers[] }
  → 200 { suggestedLevel, suggestedLesson, knownTopics[] }

POST /api/onboarding/start
  Body: { startLevel, startLesson } (override placement)
  → 200 { firstLessonId }
```

### Home / Today

```
GET /api/today
  → 200 {
    nextLesson: { id, title, level, unit, estMinutes },
    reviewCount: number,
    reviewEstMinutes: number,
    readingSuggestion: { id, title, preview } | null,
    streak: { current, restDayAvailable },
    weekProgress: { daysActive, goal }
  }
```

### Lessons

```
GET /api/lessons/:id
  → 200 {
    lesson: { id, title, goal, steps[] },
    steps[]: { type, content, exercises[] }
  }

POST /api/lessons/:id/answer
  Body: { stepId, exerciseId, answer }
  → 200 { correct: bool, feedback, correctAnswer?, explanation }

POST /api/lessons/:id/complete
  → 200 { skillsUnlocked[], wordsLearned, nextLesson }

GET /api/lessons/:id/resume
  → 200 { lastStepIndex, answers[] }
```

### Review (SRS)

```
GET /api/review/session
  → 200 { items[]: { id, type, prompt, options } }

POST /api/review/answer
  Body: { itemId, quality (0-5) }
  → 200 { correct, nextDue, feedback }

GET /api/review/stats
  → 200 { totalItems, dueToday, accuracy7d }
```

### Reader

```
POST /api/reader/analyze
  Body: { text, inputScript? }
  → 200 (streamed) {
    normalized: string,
    tokens[]: { word, meaning, grammar, confidence },
    translation: string,
    isAiTranslation: bool,
    knownWordCount: number,
    totalWordCount: number
  }

GET /api/reader/library
  → 200 { texts[]: { id, title, category, difficulty, preview } }

GET /api/reader/library/:id
  → 200 { text with full content + analysis }
```

### Dictionary

```
GET /api/dictionary/search?q=<query>&script=<auto|deva|tamil|iast>
  → 200 { results[]: { word, meanings, type, root, examples } }

GET /api/dictionary/analyze?form=<word>
  → 200 { analyses[]: { baseWord, grammar, confidence } }
```

### AI Tutor

```
POST /api/tutor/ask
  Body: { question, context: { lessonId?, wordId?, textId? } }
  → 200 (streamed) { answer, references[], questionsRemaining }

GET /api/tutor/quota
  → 200 { used, limit, resetsAt }
```

### Progress

```
GET /api/progress/overview
  → 200 {
    skills[]: { slug, title, state },
    levelsCompleted: number,
    wordsKnown: number,
    versesRead: number
  }

GET /api/progress/vocabulary
  → 200 { words[]: { word, meaning, state, nextReview } }
```

### Preferences

```
GET /api/preferences
  → 200 { preferences }

PATCH /api/preferences
  Body: { ...partial preferences }
  → 200 { preferences }
```

### Taster [public]

```
GET /api/taster/lesson
  → 200 { lesson (first 5 sounds lesson, no auth) }

POST /api/taster/reader
  Body: { text }
  → 200 { basic analysis, limited }
```
