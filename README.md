# Bhāṣā (भाषा · பாஷா)

> A modern, accessible, and pedagogically sound Sanskrit learning platform built with Next.js, React 19, Tailwind CSS v4, and Spaced Repetition (SRS). Designed specifically for English and Tamil speakers.

[![Tests](https://img.shields.io/badge/tests-116%20passed-brightgreen)](#tests)
[![Sprints](https://img.shields.io/badge/sprints-8%20of%2014%20complete-blue)](#sprints)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 🌟 Core Philosophy

1. **Start Small, Always Know What's Next:** One clear next action on the home screen.
2. **Your Language, Your Script:** Complete bilingual support in English and Tamil (தமிழ்), with multi-script Sanskrit display in **Devanāgarī**, **Tamil**, and **IAST Roman**.
3. **Never Hide Real Sanskrit:** Sanskrit is always taught using genuine, grammatically reviewed text — no artificial placeholders.
4. **Understand, Not Memorize:** Discover patterns before rules; every exercise provides supportive explanations.
5. **Honest About Ambiguity:** Clear labeling (**Clear · Possible · Ambiguous**) for complex Sanskrit interpretations.
6. **Short, Consistent Sessions:** Meaningful lessons in 10 minutes; spaced repetition reviews in 3 minutes.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography:** Baloo 2, Noto Sans, Noto Sans Devanagari, Noto Sans Tamil
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database & ORM:** PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **Audio Engine:** Web Audio API with formant synthesis and syllable synchronization
- **Spaced Repetition:** SuperMemo-2 (SM-2) algorithm
- **Testing:** [Vitest](https://vitest.dev/), Testing Library, JSDOM

---

## 🗺️ Sprint Roadmap (8 / 14 Sprints Completed)

| Sprint | Status | Description |
|---|:---:|---|
| **Sprint 1: Project Setup & Landing** | ✅ Complete | Next.js 16, design tokens, fonts, base UI, interactive script-switching hero |
| **Sprint 2: Onboarding Flow** | ✅ Complete | 6-step personalized onboarding, script preview, bilingual i18n, preferences store |
| **Rebranding: Bhāṣā** | ✅ Complete | Official rebranding to भाषा · பாஷா, custom monogram, bilingual tokens |
| **Sprint 3: Home & Navigation** | ✅ Complete | 5-tab app shell, forgiving streak engine, daily commitment card (`GET /api/today`) |
| **Sprint 4: Lesson Engine Core** | ✅ Complete | 7-step pedagogical arc (See It → Notice It → Rule → Exercises → Recap), feedback sheet |
| **Sprint 5: Audio & Pronunciation** | ✅ Complete | 64px `AudioButton`, syllable highlight sync, phonetic formant synthesis, Service Worker |
| **Sprint 6: More Exercise Types** | ✅ Complete | `WordTile`, fill-the-blank, match pairs, sentence building with flexible word order, transliteration |
| **Sprint 7: Spaced Repetition (SRS)** | ✅ Complete | SM-2 algorithm, review session API, fast-actions (*"I know this"*, *"Reset"*), `/review` screen |
| **Sprint 8: Reader (Basic)** | ✅ Complete | Script detection, transliteration engine, word tokenization chips, progressive grammar disclosure sheet |
| **Sprint 9: Reader (AI Translation & Library)** | ⏳ Next | Indic LLM translation (**Sarvam API**), translation caching, curated text library |
| **Sprint 10: Dictionary & Grammar Reference** | 📅 Planned | Multi-script dictionary search, grammatical form analyzer |
| **Sprint 11: AI Tutor** | 📅 Planned | Grounded Indic AI tutor panel with context-aware explanation |
| **Sprint 12: Progress & Motivation** | 📅 Planned | Winding skill tree map, level progress, milestone celebrations |
| **Sprint 13: Offline & PWA** | 📅 Planned | Full PWA manifest, IndexedDB offline sync queue |
| **Sprint 14: Polish & Launch Prep** | 📅 Planned | WCAG 2.2 AA accessibility audit, cross-device QA |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/jeeva-m-21/agile-basha.git
cd agile-basha
npm install
```

### Running Locally

```bash
npm run dev -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Key routes available for inspection:
- `/` — Landing page with interactive multi-script hero
- `/onboarding` — 6-step bilingual onboarding
- `/home` — Daily practice dashboard and streak tracker
- `/lesson/level-0-lesson-1` — First Five Sounds (Audio & Syllable Highlight)
- `/lesson/level-0-lesson-2` — Word Order & Interactive Sentence Building
- `/review` — Spaced Repetition review session with SM-2 rating
- `/read` — Sanskrit Reader with script detection & grammar breakdown
- `/practice` — Practice drills & SRS queue
- `/learn` — Curriculum overview

---

## 🧪 Testing

Run the Vitest unit and integration test suite:

```bash
npm test
```

Build for production:

```bash
npm run build
```

---

## 📄 License

MIT
