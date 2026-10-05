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

- [ ] AudioButton component (play, slow speed)
- [ ] Syllable highlight sync (timestamps from word data)
- [ ] Audio file serving from Supabase Storage
- [ ] Service worker setup for audio caching
- [ ] Exercise type: listen_and_choose
- [ ] Seed audio for Level 0 Lesson 1 words
- [ ] **Tests:** Audio playback, syllable sync, offline audio

## Sprint 6 — More Exercise Types
**User Feature:** User practices with fill-the-blank, match, sentence building, and transliteration exercises.

- [ ] Exercise: fill_blank
- [ ] Exercise: match (drag/tap pairs)
- [ ] Exercise: build_sentence (word tiles)
- [ ] Exercise: transliterate
- [ ] Word tile component with tap-to-place + reorder
- [ ] Flexible answer acceptance (multiple valid word orders)
- [ ] **Tests:** Each exercise type rendering and validation

## Sprint 7 — Spaced Repetition Review
**User Feature:** User reviews due words/rules in short mixed sessions with SRS scheduling.

- [ ] SM-2 algorithm implementation (lib/srs/sm2.ts)
- [ ] DB tables: review_items, review_attempts
- [ ] Review session API (GET session, POST answer)
- [ ] Review screen with mixed item types
- [ ] "Items due" count on Home
- [ ] Mark "I know this" / "Reset" controls
- [ ] **Tests:** SM-2 interval calculation, review session generation, due item counting

## Sprint 8 — Reader (Basic)
**User Feature:** User pastes Sanskrit text and sees word-by-word breakdown with meanings.

- [ ] Sanskrit input component (script detection, typing helper)
- [ ] Transliteration engine (Devanāgarī ↔ Tamil ↔ IAST)
- [ ] Token chip component
- [ ] Reader page with input + analysis display
- [ ] Reader API (POST /api/reader/analyze) — basic: script normalize + word split
- [ ] Dictionary lookup for word meanings
- [ ] DB table: words (seeded with initial vocabulary)
- [ ] Progressive disclosure (meaning → grammar → rule)
- [ ] **Tests:** Script detection, transliteration accuracy, word tokenization

## Sprint 9 — Reader (AI Translation + Library)
**User Feature:** Reader shows AI translation and user can browse curated texts.

- [ ] LLM integration for translation (OpenAI/Gemini)
- [ ] Translation caching in DB
- [ ] "AI-assisted translation" labeling
- [ ] Text library page (GET /api/reader/library)
- [ ] DB table: texts (seeded with 5-10 curated texts)
- [ ] "Save word" to personal vocabulary
- [ ] "You know X of Y words" display
- [ ] **Tests:** Translation API, caching, library listing

## Sprint 10 — Dictionary & Grammar Reference
**User Feature:** User searches words by any script and sees meanings, forms, grammar with linked lessons.

- [ ] Dictionary search API (GET /api/dictionary/search)
- [ ] Form analysis API (GET /api/dictionary/analyze)
- [ ] Dictionary UI (search, results, two tabs: meaning vs form)
- [ ] Grammar reference pages (DB: grammar_rules)
- [ ] Link back to lessons from dictionary entries
- [ ] Search bar integration in top bar
- [ ] **Tests:** Search across scripts, form analysis accuracy

## Sprint 11 — AI Tutor
**User Feature:** User asks questions about Sanskrit in context and gets grounded answers.

- [ ] Tutor chat panel (bottom sheet / right panel)
- [ ] Context-aware prompting (lesson, word, text context)
- [ ] Streaming response display
- [ ] Response grounding (reference lesson content + grammar DB)
- [ ] Rate limiting with daily quota
- [ ] "AI tutor" badge + "Report a problem" on every message
- [ ] **Tests:** Context passing, rate limiting, response labeling

## Sprint 12 — Progress & Motivation
**User Feature:** User sees skill map, level progress, vocabulary count, streaks, and weekly summary.

- [ ] Skill map visualization (Learn tab)
- [ ] Level progress bar with "You can now..." statements
- [ ] Vocabulary count display
- [ ] Weekly summary card
- [ ] Streak display with rest day logic
- [ ] Lesson complete celebration sequence
- [ ] DB table: user_skills
- [ ] **Tests:** Skill state transitions, progress calculations, streak rules

## Sprint 13 — Offline & PWA
**User Feature:** User can continue lessons without internet; app installable on phone.

- [ ] PWA manifest
- [ ] Service worker: lesson + audio precaching (next 7 days)
- [ ] IndexedDB queue for offline answers
- [ ] Sync on reconnect
- [ ] Offline UI states (clear messaging per feature)
- [ ] App install prompt
- [ ] **Tests:** Offline lesson completion, sync after reconnect

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
