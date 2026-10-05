# Sprint Plan

Each sprint = 1 week. Each sprint delivers a user-facing feature. Tests are written within each sprint.

## Sprint 1 — Project Setup & Landing Page
**User Feature:** Visitor sees the landing page and can choose to start learning or try the Reader.

- [x] Initialize Next.js 15 project with TypeScript
- [x] Configure Tailwind CSS with design tokens from DESIGN.md §12
- [x] Set up fonts (Baloo 2, Noto Sans, Noto Sans Devanagari, Noto Sans Tamil)
- [x] Create base UI components: Button (Primary/Secondary), Card
- [x] Build landing page: hero with promise statement, two CTAs
- [x] Light/dark theme support via CSS vars
- [x] Basic responsive layout (360px → desktop)
- [x] **Tests:** Component rendering, theme switching, responsive breakpoints

## Sprint 2 — Onboarding Flow
**User Feature:** New user completes onboarding (language, script, goal, level, daily time) and lands on Home.

- [x] Supabase project setup (auth, database)
- [x] Drizzle ORM setup + initial migration (users, user_preferences)
- [x] Onboarding multi-step form (6 steps)
- [x] Live script preview (Devanāgarī / Tamil / IAST) on script selection
- [x] Preferences API (POST /api/onboarding/preferences)
- [x] Persist preferences to DB
- [x] i18n setup (en.json / ta.json) — onboarding strings
- [x] **Tests:** Onboarding flow E2E, preference persistence, i18n switching

## Sprint 3 — Home Screen & Navigation
**User Feature:** User sees their daily plan on Home with lesson, review, and reading cards.

- [x] Bottom navigation bar (Home, Learn, Read, Practice, Me)
- [x] Home screen layout (continue card, review card, reading card, streak)
- [x] GET /api/today endpoint
- [x] DB tables: levels, units, lessons (seeded with Level 0 structure)
- [x] Streak tracking (streaks table, rest day logic)
- [x] Empty states with Haṃsa/Bhāṣā placeholder
- [x] **Tests:** Navigation routing, today API response, streak logic

## Sprint 4 — Lesson Engine (Core)
**User Feature:** User completes a lesson with the see-it → notice-it → rule → exercise → recap flow.

- [x] DB tables: lesson_steps, exercises
- [x] Lesson page (focus mode, no nav, progress bar)
- [x] Step rendering by type (see_it, notice_it, rule, exercise, recap)
- [x] SanskritText component (script-aware, helper line, tap-to-hear)
- [x] Exercise type: multiple choice (read_script, identify_case)
- [x] Feedback sheet (correct/incorrect with explanation)
- [x] Lesson API: GET /api/lessons/:id, POST answer, POST complete
- [x] Progress tracking (user_progress table)
- [x] Seed Level 0, Lesson 1 content
- [x] **Tests:** Lesson step flow, answer validation, progress save, feedback rendering

## Sprint 5 — Audio & Pronunciation
**User Feature:** User hears Sanskrit words/sentences with syllable highlighting and speed control.

- [x] AudioButton component (play, slow speed)
- [x] Syllable highlight sync (timestamps from word data)
- [x] Audio file serving from Supabase Storage
- [x] Service worker setup for audio caching
- [x] Exercise type: listen_and_choose
- [x] Seed audio for Level 0 Lesson 1 words
- [x] **Tests:** Audio playback, syllable sync, offline audio

## Sprint 6 — More Exercise Types
**User Feature:** User practices with fill-the-blank, match, sentence building, and transliteration exercises.

- [x] Exercise: fill_blank
- [x] Exercise: match (drag/tap pairs)
- [x] Exercise: build_sentence (word tiles)
- [x] Exercise: transliterate
- [x] Word tile component with tap-to-place + reorder
- [x] Flexible answer acceptance (multiple valid word orders)
- [x] **Tests:** Each exercise type rendering and validation

## Sprint 7 — Spaced Repetition Review
**User Feature:** User reviews due words/rules in short mixed sessions with SRS scheduling.

- [x] SM-2 algorithm implementation (lib/srs/sm2.ts)
- [x] DB tables: review_items, review_attempts
- [x] Review session API (GET session, POST answer)
- [x] Review screen with mixed item types
- [x] "Items due" count on Home
- [x] Mark "I know this" / "Reset" controls
- [x] **Tests:** SM-2 interval calculation, review session generation, due item counting

## Sprint 8 — Reader (Basic)
**User Feature:** User pastes Sanskrit text and sees word-by-word breakdown with meanings.

- [x] Sanskrit input component (script detection, typing helper)
- [x] Transliteration engine (Devanāgarī ↔ Tamil ↔ IAST)
- [x] Token chip component
- [x] Reader page with input + analysis display
- [x] Reader API (POST /api/reader/analyze) — basic: script normalize + word split
- [x] Dictionary lookup for word meanings
- [x] DB table: words (seeded with initial vocabulary)
- [x] Progressive disclosure (meaning → grammar → rule)
- [x] **Tests:** Script detection, transliteration accuracy, word tokenization

## Sprint 9 — Reader (AI Translation + Library)
**User Feature:** Reader shows AI translation and user can browse curated texts.

- [x] LLM / Sarvam AI integration for translation
- [x] Translation caching in DB and in-memory cache
- [x] "AI-assisted translation" labeling per SPEC §10.1
- [x] Text library page / drawer with category filter (GET /api/reader/library)
- [x] DB table: texts & translations_cache (seeded with 7 curated classical texts)
- [x] "Save word" to personal vocabulary
- [x] "You know X of Y words" display
- [x] **Tests:** Translation API, caching, library listing, category filters

## Sprint 10 — Dictionary & Grammar Reference
**User Feature:** User searches words by any script and sees meanings, forms, grammar with linked lessons.

- [x] Dictionary search API (GET /api/dictionary/search)
- [x] Form analysis API (GET /api/dictionary/analyze)
- [x] Dictionary UI (search, results, two tabs: meaning vs form)
- [x] Grammar reference pages (DB: grammar_rules, Panini sutras, tables)
- [x] Link back to lessons from dictionary entries
- [x] Search bar integration in top bar
- [x] **Tests:** Search across scripts, form analysis accuracy, UI tabs

## Sprint 11 — AI Tutor
**User Feature:** User asks questions about Sanskrit in context and gets grounded answers.

- [x] Tutor chat panel (bottom sheet / right panel)
- [x] Context-aware prompting (lesson, word, text context)
- [x] Grounded responses with follow-up suggestions
- [x] Response grounding (reference lesson content + grammar DB)
- [x] Rate limiting with daily fair-use quota (20 questions/day)
- [x] "AI tutor" badge + "Report a problem" on every message
- [x] Persistent floating trigger and AppShell integration
- [x] **Tests:** Context passing, rate limiting, response labeling, reporting

## Sprint 12 — Progress & Motivation
**User Feature:** User sees skill map, level progress, vocabulary count, streaks, and weekly summary.

- [x] Skill map visualization (Learn tab)
- [x] Level progress bar with "You can now..." statements
- [x] Vocabulary count display
- [x] Weekly summary card
- [x] Streak display with rest day logic
- [x] Lesson complete celebration sequence
- [x] DB table: user_skills
- [x] **Tests:** Skill state transitions, progress calculations, streak rules

## Sprint 13 — Offline & PWA
**User Feature:** User can continue lessons without internet; app installable on phone.

- [x] PWA manifest
- [x] Service worker: lesson + audio precaching (next 7 days)
- [x] IndexedDB queue for offline answers
- [x] Sync on reconnect
- [x] Offline UI states (clear messaging per feature)
- [x] App install prompt
- [x] **Tests:** Offline lesson completion, sync after reconnect

## Sprint 14 — Polish, Accessibility & Launch Prep
**User Feature:** Platform is accessible, performant, and ready for beta users.

- [ ] Accessibility audit (keyboard nav, screen reader, lang tags, ARIA)
- [ ] Performance audit (LCP ≤ 2.5s, CLS ≤ 0.05)
- [ ] Reduced motion support
- [ ] High contrast mode
- [ ] Text size adjustment
- [ ] Account management (data export, delete)
- [ ] Error states for all screens
- [ ] **Tests:** Accessibility automated checks, Lighthouse audit, cross-browser
