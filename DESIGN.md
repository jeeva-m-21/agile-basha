# design.md — Sanskrit Learning Platform

**Working product name:** Haṃsa (हंस · அன்னம்) — placeholder, replaceable without touching anything below.
**Companion document:** *Sanskrit Learning Platform — Product Specification (User Perspective)*
**Platforms:** Mobile web first (360 px base), tablet, desktop. Native-app-ready.
**Learner languages:** English, Tamil. **Scripts shown:** Devanāgarī, Tamil (with Grantha letters), Roman (IAST).

---

## 0. How to Use This Document

This file is the single source of truth for how the product looks, moves, and behaves. Every rule has a **reason** so designers and engineers can make correct decisions in cases the document doesn't cover. When in doubt, apply §1 (principles) and the decision tests in §1.3.

Contrast ratios in this file were calculated (WCAG 2.2 formula) for the exact hex values given. Anything marked **VERIFY** must be checked in the real build (fonts, glyph coverage, dark-mode borders) before it is treated as final.

---

## 1. Design Intent

### 1.1 The one-line intent

> **Make a very hard, very old language feel doable today.**

Learners arrive intimidated: a new script, unfamiliar sounds, grammar terms that sound heavy. The design's job is to **lower fear, raise momentum, and protect trust**. Everything else (beauty, delight, brand) serves that.

### 1.2 Principles

| # | Principle | What it means in the UI | Why |
|---|---|---|---|
| 1 | **One thing at a time** | Each screen has exactly one primary action, visually dominant. Lessons show one task per screen. | Hick's law: fewer simultaneous choices → faster decisions and less overwhelm. |
| 2 | **The Sanskrit is the hero** | Sanskrit text is the largest, highest-contrast element on every screen where it appears. Chrome stays quiet around it. | The learner's goal is to read it. Clutter near the script slows reading. |
| 3 | **Instant, honest feedback** | Every tap responds in < 100 ms (visual) and every answer explains *why*. | Doherty threshold: sub-400 ms feedback keeps flow; explanations create learning, not just scoring. |
| 4 | **Progress you can feel** | Always show where you are, how far, and what's next. Make completion a satisfying moment. | Goal-gradient effect + peak-end rule: people persist when progress is visible and remember how it ended. |
| 5 | **Mistakes are material, not failure** | "Not yet" tone, soft colour, calm motion, immediate path to the rule. No lives, no punishing countdowns. | Fear of error is the #1 beginner dropout cause in language apps. |
| 6 | **Your language, your script** | Language and script are first-class settings, switchable anywhere, changing the whole UI at once. | The core promise of the product. |
| 7 | **Depth on demand** | Simple answer first; "Show rule", "More detail", "Sources" expand in place. | Progressive disclosure serves beginners and advanced learners with one interface. |
| 8 | **Honest labelling** | Course content, library text, AI translation, AI tutor each carry a consistent badge. Ambiguity is shown, not hidden. | Trust is the product in a scholarly domain. |
| 9 | **Respect the subject** | Joyful, never silly. No cartoon gods, no cliché clip-art, no shaming. | Many learners come for devotional and philosophical texts. |
| 10 | **Calm by default, delight at the right moment** | Motion and sound are functional in practice, expressive at milestones. | Prevents fatigue; keeps celebration meaningful. |

### 1.3 Decision tests (use in reviews)

Before approving any design, ask:

1. **The 3-second test:** Can a first-time user say what to do next within 3 seconds?
2. **The thumb test:** Is the primary action reachable with one thumb on a 6-inch phone?
3. **The Tamil test:** Does it still work with Tamil strings (often 30–50% longer than English), Tamil line height, and Tamil script for Sanskrit?
4. **The mistake test:** If the learner gets this wrong, do they feel guided or judged?
5. **The reduced-motion test:** Is meaning preserved without animation?
6. **The "would we keep it if it didn't animate/shine?" test:** Decoration that doesn't help comprehension gets cut.

---

## 2. Identity

### 2.1 Personality

**Warm · Encouraging · Precise · Dignified · Playful in small doses.**
Think of a great teacher: patient, clear, quietly proud of you. Not a hype-man, not a professor on a pedestal.

### 2.2 The mascot — Haṃsa the swan

- **Why a haṃsa:** In Sanskrit literature the haṃsa is the bird of discernment (said to separate milk from water). It is a native symbol of learning and clarity, so it earns its place instead of being decoration.
- **Role:** Guide, not gamification mascot. Appears in onboarding, empty states, lesson feedback sheets (small), and celebrations. Never blocks content, never nags.
- **Character:** Calm, curious, small head tilts and soft wing gestures. Expressions: *neutral, encouraging, delighted, thinking, gently-concerned* (for mistakes: concerned-but-kind, never sad or disappointed).
- **Build:** Geometric shapes, 3 colours max per pose, rounded forms, consistent stroke. Delivered as layered vector + Rive/Lottie rig for expressions (see §9).
- **Rule:** Commissioned original artwork by a professional illustrator. No AI-generated or stock mascot artwork in production.

### 2.3 Visual motifs (used sparingly)

- **Kolam / rangoli line patterns** (Tamil tradition) as subtle backgrounds on celebration screens and the Tamil Bridge cards.
- **Palm-leaf and paper textures** only as a faint tint in the Reader's "text" cards; never behind interactive controls.
- **Devanāgarī letterforms as shapes** in onboarding illustrations (large cropped *अ*, *ॐ* is **not** used decoratively).
- **Not used:** lotus clip-art, Om symbols as decoration, saffron-and-peacock-feather clichés, glowing mandalas, stock "Indian gradient" backgrounds.

### 2.4 Voice and tone

| Situation | Tone | English example | Tamil example |
|---|---|---|---|
| Correct answer | Warm, brief | "Yes — that's the doer." | "சரி — இதுதான் செய்பவர்." |
| Wrong answer | Gentle, informative | "Not yet. *-ena* marks 'by/with'." | "இன்னும் இல்லை. *-ena* என்பது 'ஆல்' பொருள்." |
| Streak nudge | Invitational, never guilt | "Ready for a 3-minute review?" | "3 நிமிட மீள்பார்வை செய்யலாமா?" |
| Ambiguity | Honest | "This can be read two ways." | "இதை இரண்டு விதமாக வாசிக்கலாம்." |
| Milestone | Proud, restrained | "You read your first full verse." | "உங்கள் முதல் முழு ஸ்லோகத்தை வாசித்துவிட்டீர்கள்." |

Rules: second person ("you"), active voice, ≤ 12 words per instruction, no exclamation overload (max one per screen), no sarcasm, no emoji in UI strings. Tamil copy is **written by a Tamil copywriter**, never machine-translated from English.

---

## 3. Colour

### 3.1 Concept

The palette is drawn from the physical world of Indian learning and craft: **turmeric** (haldi), **ink** (masi), **kumkum**, **tulsi leaf**, **indigo** (neel), **peacock** (mayura), **fire/lamp flame** (agni). It deliberately **avoids** green as the primary brand colour and the standard blue/purple "tech gradient" look, so the product has its own recognisable identity while meeting the clarity standard of the best language-learning apps: flat, saturated, high-contrast, with unmistakable success/error colours.

### 3.2 Core palette (light mode)

| Token | Name | Hex | Use |
|---|---|---|---|
| `--ink` | Masi (ink) | `#2D2A32` | Primary text, Sanskrit text |
| `--ink-2` | Masi 2 | `#5A564D` | Secondary text |
| `--ink-3` | Masi 3 | `#75705F` | Tertiary text, captions (min 14 px) |
| `--paper` | Paper | `#FFFBF2` | App background (warm, reduces glare for long reading) |
| `--surface` | Surface | `#FFFFFF` | Cards, sheets, inputs |
| `--surface-2` | Surface 2 | `#FFF4DC` | Highlighted blocks (hints, reading cards) |
| `--line` | Line (decor) | `#E8E0CF` | Dividers, decorative borders |
| `--line-strong` | Control line | `#9A9079` | Borders of interactive controls (≥ 3:1) |
| `--haldi` | Haldi (turmeric) | `#FFB800` | **Primary action** fill |
| `--haldi-edge` | Haldi edge | `#C98A00` | Primary action bottom edge/pressed |
| `--neel` | Neel (indigo) | `#3454D1` | Links, selection, focus, info |
| `--neel-tint` | Neel tint | `#E8EDFF` | Selected option background |
| `--neel-edge` | Neel edge | `#2A45B0` | Selected option border/edge |
| `--tulsi` | Tulsi (green) | `#25803A` | Success fill |
| `--tulsi-ink` | Tulsi ink | `#1E6B2F` | Success text on tint |
| `--tulsi-tint` | Tulsi tint | `#E3F5E7` | Correct-answer background |
| `--sindoor` | Sindoor (vermilion) | `#D63B2A` | Error fill, destructive actions |
| `--sindoor-ink` | Sindoor ink | `#A82617` | Error text on tint |
| `--sindoor-tint` | Sindoor tint | `#FDE8E4` | Incorrect-answer background |
| `--agni` | Agni (flame) | `#FF8A1F` | Streak, energy, reward accents |
| `--mayura` | Mayura (peacock teal) | `#0B7F8A` | Tamil/English **Bridge** content, special highlights |
| `--mayura-tint` | Mayura tint | `#E0F4F5` | Bridge card backgrounds |

### 3.3 Verified contrast (light mode)

| Pairing | Ratio | Passes |
|---|---|---|
| Ink on Paper | **13.66 : 1** | AAA |
| Ink-2 on Paper | **7.08 : 1** | AAA |
| Ink-3 on Paper | **4.80 : 1** | AA |
| Ink on Haldi (primary button label) | **8.13 : 1** | AAA |
| White on Neel | **6.30 : 1** | AA |
| Neel on NeelTint | **6.98 : 1** | AA |
| White on Tulsi | **4.97 : 1** | AA |
| Tulsi-ink on Tulsi-tint | **5.78 : 1** | AA |
| White on Sindoor | **4.65 : 1** | AA |
| Sindoor-ink on Sindoor-tint | **6.04 : 1** | AA |
| Ink on Agni | **5.98 : 1** | AA |
| White on Mayura | **4.75 : 1** | AA |
| Control line on Paper | **3.06 : 1** | AA for UI components (1.4.11) |

### 3.4 Semantic rules

1. **Colour is never the only signal.** Correct = green + check icon + "Correct" text; incorrect = coral/red + cross icon + "Not yet" text. Required for colour-blind users.
2. **Haldi means "do this next."** Exactly one Haldi button per screen. Never use Haldi for decoration, headers, or large surfaces.
3. **Neel means "this is selected / interactive / information."**
4. **Tulsi and Sindoor are reserved for correctness feedback** (plus true success/error states). Not used as brand decoration.
5. **Agni means momentum** (streak, daily goal). Max one Agni element per screen.
6. **Mayura means "a bridge to your own language/knowledge"** (Tamil Bridge, English Bridge, "you already know this word").
7. **Text colour is always Ink / Ink-2 / Ink-3** on Paper/Surface; never place coloured text on coloured fill unless the pair is in the verified table.
8. **Disabled** = Ink-3 text at 60% on `--line` fill, with `aria-disabled`; never used to hide required explanations.

### 3.5 Dark mode

Not an inversion. A warm night palette, same semantics.

| Token | Hex | Notes |
|---|---|---|
| `--paper` | `#1C1B20` | background |
| `--surface` | `#24232A` | cards |
| `--surface-2` | `#2E2C35` | highlights |
| `--ink` | `#F4EFE4` | text (14.93 : 1 on paper) |
| `--ink-2` | `#CFC8B8` | secondary |
| `--ink-3` | `#A8A294` | tertiary (6.73 : 1) |
| `--line` | `#3A3843` | decor |
| `--line-strong` | `#77748A` | **VERIFY ≥ 3:1 on surface** |
| `--haldi` | `#FFC933` | with Ink label `#2D2A32` (9.17 : 1) |
| `--haldi-edge` | `#D9A300` | |
| `--neel` | `#8FA6FF` | 7.39 : 1 on paper |
| `--tulsi` | `#6FD488` | 9.33 : 1 |
| `--sindoor` | `#FF8A7A` | 7.47 : 1 |
| `--agni` | `#FFA04D` | **VERIFY** |
| `--mayura` | `#5CC9D3` | **VERIFY** |

Dark mode follows system by default; user can override in Settings.

---

## 4. Typography

### 4.1 Requirements specific to this product

- Must render **Devanāgarī, Tamil, and Latin with IAST diacritics** with equal care.
- Must handle **conjuncts** (क्ष, ज्ञ, श्र, द्ध, त्र, ङ्क), **vowel signs above/below the line**, **Vedic-style marks** in later phases, and **Tamil with Grantha letters** (ஜ ஷ ஸ ஹ க்ஷ) plus the superscript-number convention for Sanskrit aspirates/voiced stops (e.g., க², க³, க⁴) in Tamil-script Sanskrit.
- Must be free to self-host (SIL OFL) and subsettable by script.

### 4.2 Font stack

| Role | Latin | Devanāgarī | Tamil | Notes |
|---|---|---|---|---|
| **Display & headings** | Baloo 2 (600–800) | Baloo 2 | Baloo Thambi 2 (600–800) | Rounded, friendly, matches the chunky UI. |
| **Body & UI** | Noto Sans (400–700) | Noto Sans Devanagari | Noto Sans Tamil | Neutral, extremely complete, excellent hinting and screen-reader behaviour. |
| **Sanskrit — learning text** (lessons, exercises) | — | Noto Sans Devanagari (500–600) | Noto Sans Tamil (500–600) | Clear, open letterforms for beginners at large sizes. |
| **Sanskrit — texts & verses** (Reader, library) | — | **Tiro Devanagari Sanskrit** | Noto Serif Tamil | Book-like feel; Tiro is designed for Sanskrit typography. |
| **IAST/Roman helper** | Noto Sans (italic *not* used for IAST) | — | — | Must show ā ī ū ṛ ṝ ḷ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ correctly. |

**Font acceptance test (blocking, VERIFY):** render this string in every font/weight used, at 16 px, 24 px and 48 px, light and dark, on iOS Safari, Android Chrome, Windows Chrome:

```
क्ष ज्ञ श्र द्ध त्र ङ्क ॠ ऌ ऋ ् ं ः  ॐ
रामः वनं गच्छति । धर्मक्षेत्रे कुरुक्षेत्रे ।
க² க³ க⁴ ஜ ஷ ஸ ஹ க்ஷ ஸ்ரீ
rāmaḥ vanaṃ gacchati · ṛṣi · kṛṣṇa · śiva · ṭīkā · jñāna
```

If any glyph falls back to a system font or collides with a vowel sign, the font is rejected for that role. Baloo 2's Latin Extended coverage (IAST) must be confirmed; if incomplete, headings in IAST fall back to Noto Sans Bold.

### 4.3 Type scale (mobile, rem = 16 px)

Devanāgarī and Tamil need more vertical room than Latin: matras above and below the headline stack. **Line heights are set per script**, not globally.

| Style | Size | Weight | Line height (Latin) | Line height (Devanāgarī / Tamil) | Use |
|---|---|---|---|---|---|
| `sanskrit-hero` | 44 px | 600 | 1.2 | **1.5** | Main lesson word/sentence |
| `sanskrit-large` | 32 px | 600 | 1.2 | **1.5** | Examples in lessons |
| `sanskrit-body` | 24 px | 500 | 1.3 | **1.55** | Reader sentences, exercise prompts |
| `verse` | 24 px | 400 | — | **1.7** | Library verses (Tiro) |
| `h1` | 28 px | 700 | 1.25 | 1.5 | Screen titles |
| `h2` | 22 px | 700 | 1.3 | 1.5 | Section titles |
| `body` | 17 px | 400 | 1.5 | **1.65** | Explanations |
| `button` | 17 px | 700 | 1.2 | 1.4 | Buttons (Baloo) |
| `caption` | 14 px | 500 | 1.4 | 1.55 | Labels, helper text |
| `helper-line` | 16 px | 400 | 1.4 | 1.5 | Transliteration under Sanskrit (Ink-2) |

- **Minimum text size: 14 px.** Sanskrit in lessons: never below 24 px.
- Desktop scales `sanskrit-hero` to 56 px, `h1` to 36 px; body stays 17–18 px.
- User text-size setting scales all sizes ×1 / ×1.15 / ×1.3; layouts must not break at ×1.3.
- **No all-caps** anywhere (no case in Devanāgarī/Tamil; it creates inconsistency). Hierarchy comes from size, weight, and colour.
- **No italics for Sanskrit.** Italics only for English emphasis, sparingly.
- Letter-spacing: 0 for Devanāgarī/Tamil (never track Indic scripts); max +0.2 px for Latin captions.
- Max line length: 60–70 characters (Latin) / 45–55 characters (Indic).

### 4.4 Font loading

- Self-hosted, WOFF2, **subset per script** with `unicode-range`; first-load budget ≤ 150 KB per script actually used on the page.
- `font-display: swap` with metric-matched fallbacks (`size-adjust`, `ascent-override`) so text does not jump.
- Preload only the fonts for the learner's selected languages/scripts.
- Never render Sanskrit as an image or canvas.

---

## 5. Layout, Spacing, Shape

### 5.1 Grid and breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Base (phone) | 360–599 | Single column, 16 px side margins, bottom tab bar |
| Tablet | 600–899 | Single centered column (max 600), 24 px margins, bottom tab bar |
| Desktop | 900–1199 | Left nav rail (88 px) + centered column (max 640) + optional right panel (320 px) |
| Wide | ≥ 1200 | Same as desktop; side panel shows Grammar/Tutor persistently during lessons and Reader |

Design at **360 × 640** first. Everything must function at 320 px width without horizontal scroll.

### 5.2 Spacing scale (4-pt base)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Between related items: 8–12. Between groups: 24. Between sections: 32–48. The bottom 24 px of any scrolling screen above a sheet/tab bar is reserved safe space.

### 5.3 Shape

| Element | Radius |
|---|---|
| Inputs, buttons, option cards | 14 px |
| Cards, tiles | 16 px |
| Bottom sheets (top corners) | 24 px |
| Chips, badges | 999 px (pill) |
| Progress bar | 999 px |

### 5.4 "Pressable depth" — the elevation system

Instead of blurry drop shadows, interactive elements have a **solid bottom edge** (3–4 px) in a darker tone of their fill. It reads as a physical key you can press, makes tappability unmistakable, and gives the satisfying press animation (§8).

| State | Visual |
|---|---|
| Rest | Fill + 2 px border (own colour) + 4 px solid bottom edge |
| Hover (pointer) | Fill brightens 3%; edge unchanged |
| Pressed | Element translates down 3 px; bottom edge shrinks to 1 px |
| Focus-visible | 3 px `--neel` outline, 2 px offset (never removed) |
| Disabled | Flat, no edge, Ink-3 label |

Non-interactive cards are **flat** (border `--line` only, no edge), so "raised" always means "tappable".

### 5.3.1 Touch targets

Minimum 48 × 48 px (target); answer options, tiles, primary buttons 56 px tall. Minimum 8 px between adjacent targets.

---

## 6. Core Components

Each component specifies purpose, anatomy, states, and the UX reason.

### 6.1 Primary button (Haldi)

- Full width on mobile (min height 56), max 360 px wide on desktop.
- Label: `button` style, Ink on Haldi, sentence case, ≤ 3 words where possible (*Continue*, *Check*, *Start lesson*).
- States: rest / pressed / loading (label replaced with 3-dot pulse, width fixed) / disabled.
- **One per screen.** Secondary actions use the outlined button or a text link.

### 6.2 Secondary button

White fill, 2 px `--line-strong` border, 4 px `--line` bottom edge, Neel label. Use for "Skip", "Show hint", "Review later".

### 6.3 Answer option card

- Full width, 56+ px, 14 px radius. Contains optional number key (desktop), Sanskrit text (`sanskrit-body`), optional helper line.
- **Unselected:** white, `--line-strong` border, `--line` edge.
- **Selected:** `--neel-tint` fill, `--neel` border, `--neel-edge` bottom edge, label Neel-edge.
- **Correct (after check):** `--tulsi-tint` fill, `--tulsi` border, check icon right.
- **Incorrect (after check):** `--sindoor-tint` fill, `--sindoor` border, cross icon right. The correct option is also outlined green so the learner sees the answer without extra taps.
- Keyboard: ↑/↓ moves, Space selects, Enter checks. Screen reader announces "Option 2 of 4, selected."

### 6.3.1 Word tile (sentence building)

Rounded 14 px, 48 px tall, Sanskrit `sanskrit-body`. Tiles in the **bank** (bottom) are raised; tapping moves the tile to the **answer line** (top) with a short arc animation (§8.3); the bank leaves a dashed ghost slot so layout doesn't jump. Drag-and-drop supported but **tap-to-place is the primary interaction**. Reordering via drag or left/right arrow keys.

### 6.4 Lesson progress bar

Pill-shaped, 16 px tall, Tulsi fill on `--line` track, highlight strip on the fill's top half for depth. Sits under a close (✕) button. Fills **smoothly toward the next segment on every correct answer**; does not decrease on a miss (the missed item is queued again instead; copy: "We'll try this one again").

### 6.5 Feedback sheet (the most important component)

A bottom sheet that appears when the learner taps **Check**. Replaces the button area.

| Variant | Background | Content | Primary action |
|---|---|---|---|
| Correct | `--tulsi-tint`, top accent Tulsi | ✓ "Correct" + (optional) a one-line "Why" in Tulsi-ink | **Continue** (Tulsi button, white label) |
| Incorrect | `--sindoor-tint`, top accent Sindoor | ✕ "Not yet" + correct answer + 1–2 line explanation + link "See rule" | **Got it** (Sindoor button, white label) |
| Alternate valid | `--neel-tint` | "Also correct: …" | Continue |

Includes: small Haṃsa face (expression matches variant), audio button replaying the correct Sanskrit, **Report a problem** (text link). Explanation text is `body`, Ink on tint (≥ 11:1).
**Tulsi and Sindoor buttons** are the only places those fills are used for buttons; they appear only inside this sheet so Haldi still uniquely means "next step" elsewhere.

### 6.6 Audio button

64 px circle (Neel fill, white speaker icon), with **slow-speed** companion (turtle icon, 44 px). While playing: icon becomes animated waveform and the **syllable highlight** runs across the word (see §8.5). Never autoplay without a user gesture except the lesson's single "hear it" moment after a tap on "Start."

### 6.7 Sanskrit text block

Anatomy, top to bottom: (1) Sanskrit in chosen script; (2) helper line (transliteration) in Ink-2, if enabled; (3) translation in the learner's language, `body`. Words are tappable (Reader/lessons). Tapped word gets a `--surface-2` highlight with a 2 px Neel underline; no colour changes to the Sanskrit glyphs themselves so reading is not disrupted.

### 6.8 Token chip (Reader word-by-word)

Pill, 44 px tall, white with `--line-strong` border and 3 px edge. Contains Sanskrit word; a tiny dot indicates confidence: no dot = clear, **amber outline + "?"** = possible, **two-line stack icon** = ambiguous. Known-from-lessons words show a subtle Tulsi corner dot ("you know this"). Selected chip becomes Neel-tint.

### 6.9 Ambiguity banner

`--surface-2` card with a left bar in Agni. Icon + "This can be read more than one way." + segmented control of alternatives (A / B / C) each showing the resulting split and meaning. Never red (it is not an error).

### 6.10 Source/label badges

Small pills, 12 px type ≥ 14 px minimum is **not** required for badges but text must still be ≥ 12 px and ≥ 4.5 : 1.

| Badge | Fill | Meaning |
|---|---|---|
| Course | Neel-tint / Neel text | Human-authored curriculum |
| Library · *source* | Surface-2 / Ink | Sourced text |
| AI translation | Agni-tint / Ink | AI-assisted |
| AI tutor | Agni-tint / Ink | AI answers |
| Bridge | Mayura-tint / Mayura-ink | Cross-language connection |

Badges are always visible (not on hover) and have an info popover explaining what the label means.

### 6.11 Bridge card (Tamil/English Bridge)

`--mayura-tint` background, 2 px Mayura border, kolam line-pattern in the top-right corner at 12% opacity, header "In Tamil you already know this" / "தமிழில் ஏற்கனவே தெரிந்தது". Side-by-side two-column mapping (e.g., Sanskrit case ↔ வேற்றுமை) which stacks on narrow screens.

### 6.12 Skill map node (Learn tab)

Circular 72 px node on a vertical winding path. States: **locked** (flat grey, lock icon), **available** (Haldi ring + pulsing once on appearance), **in progress** (ring partially filled Tulsi), **complete** (Tulsi fill + check), **needs review** (Agni dot + "Review"). Unit headers are full-width banners with the unit's "You will be able to…" sentence. The path is a soft curved line; **nodes are never fully locked behind placement**: tapping a locked node shows "Try a quick check to skip ahead."

### 6.13 Navigation

- **Mobile:** bottom tab bar, 5 tabs: Home, Learn, Read, Practice, Me. 64 px tall, icon (24 px) + label (14 px). Active: Neel icon + label, with a 3 px pill indicator above. Hidden during lessons (focus mode).
- **Desktop:** left rail with the same five items (icon + label).
- A persistent **search/ask bar** appears in the top app bar on Home, Learn, Read and Practice (collapses to an icon on scroll).

### 6.14 Input fields

Height 56, 14 px radius, `--line-strong` border; focus: 3 px Neel outline. Persistent visible label above (never placeholder-only labels). For Sanskrit entry: a **script toggle** (Devanāgarī / Tamil / Roman) and a **typing helper** (Roman → Devanāgarī/Tamil live preview) beneath the field.

### 6.15 Toasts, empty states, loading

- **Toast:** bottom, above tab bar; 4 s; with an action ("Undo"). Announced via `aria-live="polite"`.
- **Empty states:** a small Haṃsa pose + one sentence + one action. Never a blank screen.
- **Loading:** skeleton shapes in `--line`, shimmer 1.4 s (disabled in reduced motion), never spinners longer than 400 ms without skeletons. Reader analysis streams in **stage by stage** (script → words → translation → grammar) so the learner sees something useful within ~1 s.
- **Errors:** inline, plain-language, with a retry. Network offline shows a quiet top banner and keeps downloaded lessons usable.

---

## 7. Screens and Flows

Wireframes are structural (not visual design).

### 7.1 Onboarding (≈ 2 minutes, 6 steps, one decision each)

```
[Progress dots ● ● ○ ○ ○ ○ ]                  [Skip →] (where allowed)

 Haṃsa (neutral)
 "I'd like to learn in…"              (step 1)

 [ English      ]  <- big option cards
 [ தமிழ்          ]

 [         Continue  (Haldi)        ]
```

Steps: Language → Script for Sanskrit (with live preview of one word in all three scripts) → Goal → Level (beginner / I know some) → Daily time → "Your first lesson is ready."

- The **language choice screen is itself bilingual** (both options shown in their own script) so it works before any setting exists.
- The Script step shows *रामः*, *ராமஃ*, *rāmaḥ* as live previews; selecting one updates the preview text in the next screen's example immediately.
- Back is always available; nothing is lost.
- No sign-up wall in onboarding; the account prompt comes **after the first lesson** (peak of motivation).

### 7.2 Home

```
┌──────────────────────────────┐
│ Hello, Priya          🔥 4   │  ← Agni streak chip (single Agni element)
│                              │
│ ┌──────────────────────────┐ │
│ │ Continue                 │ │  ← large card with Haldi button
│ │ Level 2 · Instrumental   │ │
│ │ 10 min                   │ │
│ │ [   Start lesson       ] │ │  ← the one Haldi button
│ └──────────────────────────┘ │
│  Review · 12 due (≈4 min) →  │  ← secondary card
│  Today's verse · Read →      │  ← tertiary card
│  Week: ▮▮▮▯▯▯▯  3/5 days     │
└──────────────────────────────┘
 [Home][Learn][Read][Practice][Me]
```

- **Order is deliberate:** the next lesson first; review second; reading third.
- If the learner skipped yesterday, the streak chip shows a calm "Welcome back" instead of a loss message.

### 7.3 Lesson loop (focus mode)

```
 ✕  [████████░░░░░░░░]                         ← progress, exit confirms only if > 1 step done

 Pick the word that means "by Rāma"

 रामेण          (sanskrit-hero, tap to hear 🔊)
 rāmeṇa          (helper line)

 ┌ रामः        ┐
 ┌ रामेण       ┐   ← answer options
 ┌ रामाय       ┐
 ┌ रामात्       ┐

 [ Check ]  (Haldi; disabled until selection)
```

Flow per item: **Prompt → Select → Check → Feedback sheet → Continue → next item** with 7–10 items per lesson (a lesson never exceeds 12 minutes). "Explain differently" and "Ask tutor" live in a small ⋯ menu at top right during items and as text links inside the feedback sheet.

### 7.4 Lesson intro ("See it → Notice it → Rule")

- **See it:** full-screen Sanskrit sentence, audio auto-plays once after the first tap. Translation fades in 400 ms later.
- **Notice it:** tapping a word highlights it and shows a one-line role chip beneath ("the doer"). Guided: the lesson asks the learner to tap 2–3 specific words; wrong taps get a gentle hint, not a penalty.
- **Rule:** a card with 3 lines max, Sanskrit term in `--surface-2` pill beside the plain-language term; "Show full rule" expands in place.

### 7.5 Lesson complete (the peak-end moment)

Sequence in §8.4. Content: Haṃsa celebration pose, "Lesson complete", three stat cards (items correct, new words, time), **"You can now…"** statement, **Continue** (Haldi) and a text link "Review mistakes (3)". The account prompt (if no account) appears **here**, after the reward, as a sheet — not before.

### 7.6 Reader

```
┌ Read ────────────────────────┐
│ [Paste or type Sanskrit…   ] │
│ [Devanāgarī ▾]   [Analyze ]  │ ← Haldi
├──────────────────────────────┤
│ धर्मक्षेत्रे कुरुक्षेत्रे …         │  ← verse font, big
│ dharmakṣetre kurukṣetre …    │
│ "On the field of dharma…"    │
│  [AI translation]            │
├──────────────────────────────┤
│ [धर्मक्षेत्रे] [कुरुक्षेत्रे]  …  │  ← token chips (wrap)
│ You know 18 of 24 words      │
├──────────────────────────────┤
│ Grammar ▸  Rule ▸  Sources ▸ │  ← progressive disclosure
└──────────────────────────────┘
```

Tapping a chip opens a bottom sheet (desktop: right panel) with: meaning, base word, grammar in plain words, "Save word", "Show Sanskrit rule", "Ask tutor". Sheet height has 2 snap points (40% / 85%).

### 7.7 Learn (skill map), Practice, Me

- **Learn:** vertical path with unit banners; current node auto-scrolled into view with a 400 ms ease.
- **Practice:** three large cards: *Review (due)*, *Practice by topic*, *Sandhi Lab*.
- **Me:** progress map, vocabulary, settings (Learn-in language, script, helper line, text size, sound, haptics, theme, reminders), data export/delete.

### 7.8 Switching language/script mid-use

A single sheet "Language & script" reachable from any screen's top bar. Changes apply **live** behind the sheet (the current screen re-renders in the new setting), so the learner sees the result before closing. Motion: content crossfades 180 ms; layout does not jump (text containers reserve space for Tamil's longer strings).

---

## 8. Motion and Animation

### 8.1 Principles

1. **Motion explains.** Each animation shows cause → effect, origin → destination, or state change.
2. **Fast in practice, expressive at milestones.** Practice interactions ≤ 240 ms. Celebrations may take 1.2–2 s but are skippable.
3. **Physical metaphor:** things are keys, tiles, sheets, and cards with mass. Pressed keys move *down*. Sheets *rise* from the bottom (where the thumb is). Tiles *travel* from bank to line.
4. **Only animate `transform` and `opacity`** (and colour for simple fills). No layout-thrashing animation. Target 60 fps on a mid-range Android phone.
5. **One attention animation per screen at a time.**
6. **Never block input.** Learners can tap through any animation; the next tap advances.
7. **Reduced motion respected** (see §8.7).

### 8.2 Timing and easing tokens

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 80 ms | Press feedback |
| `--dur-fast` | 140 ms | Colour changes, selection, chip toggles |
| `--dur-base` | 220 ms | Sheets, cards, tile moves |
| `--dur-slow` | 360 ms | Screen transitions, progress fill |
| `--dur-celebrate` | 600–1200 ms | Milestones |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Leaving elements |
| `--ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Small overshoot for success, badges |

Stagger step for lists: 40 ms, max 6 items staggered.

### 8.3 Interaction animations (practice loop)

| Moment | Animation | Timing |
|---|---|---|
| **Press any raised element** | Translates down 3 px, edge shrinks 4→1 px | 80 ms in, 120 ms out (ease-standard) |
| **Select answer option** | Border/fill crossfade to Neel; edge colour change; slight scale 1 → 1.01 → 1 | 140 ms |
| **Check button becomes enabled** | Fill from grey to Haldi + 1 soft pulse (scale 1.03) | 220 ms (once) |
| **Tap Check → sheet appears** | Sheet slides up from bottom 100% → 0; background content dims to 4% scrim; button area is replaced | 240 ms ease-out |
| **Correct** | Option border → Tulsi (140 ms) → check icon pops 0.6 → 1.15 → 1 (**ease-pop**, 280 ms) → progress bar fills (360 ms) → "+" chip floats up 16 px and fades (500 ms); Haṃsa face switches to *delighted* | Sequence starts at 0 ms; offsets 0 / 60 / 120 / 160 |
| **Incorrect** | Selected option shakes ±6 px × 2.5 cycles (260 ms, linear-ish) → border Sindoor → correct option outlines in Tulsi (140 ms) → explanation fades in (160 ms, delay 120 ms); Haṃsa *gently-concerned* | Soft, no screen shake, no flash |
| **Sheet → Continue** | Sheet slides down 200 ms; current content slides left −24 px + fades 180 ms; next prompt enters from right +24 px → 0 + fades in 220 ms | Overlap 60 ms |
| **Tile placement** | Tile travels from bank to answer line along a slight arc, 220 ms ease-out; bank leaves dashed ghost; other tiles in the line slide to make room (180 ms) | Haptic: light tick on drop |
| **Tile removal** | Reverse of placement, 180 ms | |
| **Unit/lesson node unlock** | Path segment "draws" along the curve 600 ms; node scales in with ease-pop 300 ms; one pulse ring (once) | Triggered when returning to Learn |
| **Progress bar fill** | Width animates with ease-standard 360 ms; a small highlight sweep travels across 400 ms on completion of a bar segment | |
| **Token chip tap (Reader)** | Chip lifts 2 px + Neel tint 140 ms; bottom sheet rises to 40% snap in 220 ms | |
| **Sheet snap** | Spring-like settle: `ease-pop` limited to 4% overshoot | |
| **Toggle / switch** | Thumb slides 160 ms; track colour crossfades 160 ms | |
| **Skeleton → content** | Content fades in 160 ms, stagger 40 ms | |

### 8.4 Milestone choreography — Lesson complete (≈ 1.8 s, tap to skip)

| t (ms) | Event |
|---|---|
| 0 | Last feedback sheet dismissed; screen background gently shifts to Paper with a faint kolam pattern fading in (12%). |
| 150 | Haṃsa enters from bottom with a soft rise + wing-open (Rive state *celebrate*), 500 ms. |
| 450 | "Lesson complete" headline fades up 12 px, 220 ms. |
| 600 | Three stat cards enter staggered (100 ms apart), each number **counts up** over 500 ms. |
| 1000 | Streak chip (Agni) lights up; flame scales with ease-pop; **if the streak increased**, the digit rolls up (200 ms). |
| 1300 | "You can now…" card slides up 220 ms with the new skill name highlighted. |
| 1500 | Continue button appears (Haldi) with a single soft pulse. |

Sound: one short, warm chime at 450 ms. Haptic: one medium impact at 450 ms.
**Everything before the Continue button is skippable by tapping anywhere**; the Continue button is available after 600 ms at the latest if the user taps.

### 8.5 Pronunciation and syllable animation

- When audio plays, the Sanskrit word's syllables **highlight one by one** in sync (Neel-tint background pill moves from syllable to syllable, 120–300 ms each, driven by audio timestamps, not fixed timing).
- Long syllables (guru) display slightly longer highlight; the helper line mirrors the highlight.
- The slow-speed button replays with the same highlight at the slow audio's timing.
- A "mouth-place" mini-animation (2 frames, 600 ms loop max 2 times) can be opened from the sound's info icon.

### 8.6 Screen and page transitions

| Transition | Motion |
|---|---|
| Tab ↔ tab | Crossfade 180 ms, no sliding (peer destinations) |
| Push (Home → Lesson, Learn → Lesson) | New screen slides in from right 360 ms ease-standard; the tab bar slides down and out 220 ms (focus mode) |
| Pop (close lesson) | Reverse; exit requires confirmation only if > 1 item answered |
| Sheet open/close | From/to bottom, 240 ms / 200 ms |
| Language/script change | Content crossfade 180 ms; no layout shift |
| Settings toggle changes | In-place, 140 ms |

### 8.7 Reduced motion (`prefers-reduced-motion: reduce` and in-app toggle)

- Replace all translations with **opacity crossfades ≤ 120 ms**.
- Remove shakes, pops, counting animations, pulsing, shimmer, parallax, and the mascot's looping idle.
- Incorrect feedback relies on the icon + text + colour only.
- Celebration becomes a static Haṃsa pose with stat cards appearing together.
- Sound and haptics remain per their own settings.

### 8.8 Sound and haptics

| Event | Sound | Haptic |
|---|---|---|
| Correct | Short, bright two-note "ting" (≤ 400 ms) | Light |
| Incorrect | Soft low "thup" (≤ 250 ms), non-alarming | Light, single |
| Tile drop | Quiet wooden click | Selection tick |
| Lesson complete | Warm chime (≈ 900 ms) | Medium |
| Streak extended | Rising two-note | Light |
| Button press | None | None |

- Sounds are **on by default in lessons, off elsewhere**; master toggle in Settings and a quick mute in the lesson ⋯ menu.
- Sanskrit audio (content) is separate from sound effects and has its own volume/behaviour.
- Never auto-play audio on page load. Respect the device silent switch.
- Sound design is original (commissioned), not stock UI sounds.

### 8.9 Mascot animation (Rive / Lottie)

State machine: `idle` (blink every 4–6 s; off in reduced motion) → `think` → `encourage` → `delight` → `concern` → `celebrate`. Max 120 KB per animation file; lazy-loaded; static SVG fallback for each pose.

---

## 9. Illustration, Iconography, Imagery

### 9.1 Illustration
- Style: flat geometric shapes, rounded corners, 3–4 colours drawn from the palette, no gradients except subtle two-stop tints inside shapes, no outlines heavier than 2 px.
- Subjects: learning-in-action (a hand tracing a letter, a swan reading a palm-leaf), nature associated with texts (tree, river, forest, field), everyday scenes used in Level 1 vocabulary (family, home, forest, school).
- Diversity: figures represent a range of ages, skin tones and attire; no caricature.
- **Never:** photorealistic deities, copyrighted characters, stock "yoga on a mountain" imagery, AI-generated artwork shipped as final.

### 9.2 Iconography
- One consistent set: 24 px grid, 2 px rounded stroke, filled variants for active states. Built from a single open-licence base (e.g., Phosphor/Lucide) and extended with custom icons: *aspirate*, *retroflex*, *visarga*, *anusvāra*, *sandhi-join*, *case-wheel*, *bridge*.
- Icons accompany labels; icon-only buttons have `aria-label` and tooltips on pointer devices.
- Never use emoji as UI icons (inconsistent rendering across platforms). The streak "flame" is a custom icon.

### 9.3 Photography
Not used in the learning flow. Reserved for library text covers if licensed.

---

## 10. Accessibility (non-negotiable)

- **WCAG 2.2 AA** minimum, with AAA for Sanskrit/learning text (Ink on Paper 13.7 : 1).
- All interactive controls ≥ 48 px; spacing ≥ 8 px.
- Fully operable by keyboard; visible focus; logical focus order; focus is moved to the feedback sheet when it opens and returned to the next prompt on Continue.
- **Language tagging:** every text run carries `lang="sa"`, `"ta"`, `"en"`, or `"hi"` so screen readers pronounce correctly. Sanskrit in Tamil script: `lang="sa-Taml"`; in Devanāgarī: `sa-Deva`; IAST: `sa-Latn`.
- Screen-reader labels for tiles, tokens and options include role and state ("Word tile, रामः, in bank").
- **Live regions:** feedback sheet announced assertively once ("Correct." / "Not yet. The answer is …").
- Captions/transcripts: every audio clip has the text visible; every animation has text equivalent.
- Colour-blind safe: all states use icon + text + colour; verified with deuteranopia/protanopia/tritanopia simulation.
- Adjustable text size (×1 / ×1.15 / ×1.3), high-contrast theme, reduced motion, sound off, haptics off.
- No time-limited interactions; no flashing > 3 Hz.
- Forms: labels, inline errors with `aria-describedby`, no placeholder-only labelling.
- Test with VoiceOver (iOS), TalkBack (Android), NVDA (Windows) in **English and Tamil**.

---

## 11. Gamification Rules (retention without manipulation)

| Allowed | Not allowed |
|---|---|
| Daily streak with 1 weekly rest day and "freeze" earned by learning | Lives/hearts that stop learning when you err |
| Weekly goal progress | Public leaderboards in v1 |
| "You can now…" skill statements | Countdown timers that create panic |
| Words-known and verses-read counters | Guilt notifications ("Haṃsa is sad") |
| Gentle opt-in reminders at user's chosen time | Streak loss as the main motivator |
| Milestone celebrations tied to real skills | XP inflation with no learning meaning |

Notifications: max 1 per day, always actionable, never shaming, with one-tap "Not today" and "Change time."

---

## 12. Design Tokens (source for code)

```css
:root {
  /* colour */
  --ink:#2D2A32; --ink-2:#5A564D; --ink-3:#75705F;
  --paper:#FFFBF2; --surface:#FFFFFF; --surface-2:#FFF4DC;
  --line:#E8E0CF; --line-strong:#9A9079;
  --haldi:#FFB800; --haldi-edge:#C98A00;
  --neel:#3454D1; --neel-edge:#2A45B0; --neel-tint:#E8EDFF;
  --tulsi:#25803A; --tulsi-ink:#1E6B2F; --tulsi-tint:#E3F5E7;
  --sindoor:#D63B2A; --sindoor-ink:#A82617; --sindoor-tint:#FDE8E4;
  --agni:#FF8A1F;
  --mayura:#0B7F8A; --mayura-tint:#E0F4F5;

  /* shape & space */
  --r-control:14px; --r-card:16px; --r-sheet:24px; --r-pill:999px;
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px; --s-7:48px; --s-8:64px;
  --edge:4px; --edge-pressed:1px; --press-shift:3px;

  /* motion */
  --dur-instant:80ms; --dur-fast:140ms; --dur-base:220ms; --dur-slow:360ms;
  --ease-standard:cubic-bezier(.2,0,0,1);
  --ease-out:cubic-bezier(0,0,.2,1);
  --ease-in:cubic-bezier(.4,0,1,1);
  --ease-pop:cubic-bezier(.34,1.56,.64,1);

  /* type */
  --font-display:"Baloo 2","Baloo Thambi 2",system-ui,sans-serif;
  --font-ui:"Noto Sans","Noto Sans Devanagari","Noto Sans Tamil",system-ui,sans-serif;
  --font-verse:"Tiro Devanagari Sanskrit","Noto Serif Tamil",serif;
}

:root[data-theme="dark"] {
  --ink:#F4EFE4; --ink-2:#CFC8B8; --ink-3:#A8A294;
  --paper:#1C1B20; --surface:#24232A; --surface-2:#2E2C35;
  --line:#3A3843; --line-strong:#77748A;
  --haldi:#FFC933; --haldi-edge:#D9A300;
  --neel:#8FA6FF; --tulsi:#6FD488; --sindoor:#FF8A7A;
  --agni:#FFA04D; --mayura:#5CC9D3;
}

/* script-aware line heights */
:lang(sa-Deva), :lang(hi), :lang(sa-Taml), :lang(ta) { line-height: 1.6; }

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .01ms !important; transition-duration: 120ms !important; }
}

/* the pressable key */
.key { border-bottom: var(--edge) solid var(--haldi-edge); transition: transform var(--dur-instant) var(--ease-standard), border-bottom-width var(--dur-instant); }
.key:active { transform: translateY(var(--press-shift)); border-bottom-width: var(--edge-pressed); }
```

---

## 13. Quality Bar: What "Genuine" Means Here

### 13.1 We will not ship

- Purple-to-blue gradients, glassmorphism, neon glows, or "AI sparkle" iconography.
- Inter/Roboto-everything with no script consideration.
- The generic layout of a centred hero, three feature cards, and a gradient CTA.
- Stock lotus/Om/mandala clip-art, or emoji used as icons.
- AI-generated mascot, illustration or sound as final assets.
- Lorem ipsum, fake testimonials, fake metrics, placeholder Sanskrit. **Every Sanskrit string in a design is real, reviewed Sanskrit.**
- Machine-translated Tamil UI copy.
- Dark patterns (fake urgency, guilt, hidden cancel, confusing toggles).

### 13.2 Craft checks (design QA)

1. **Real content only:** mocks use actual lesson sentences in both languages, reviewed by a Sanskrit teacher and a Tamil speaker.
2. **Stress strings:** longest Tamil strings, 3-line Sanskrit conjunct-heavy verses (धर्मक्षेत्रे…), ×1.3 text size, 320 px width.
3. **Pixel checks:** matras/vowel signs never clipped; no collisions of above-line marks with the previous line.
4. **State coverage:** every component has rest / hover / focus / pressed / disabled / loading / error / empty designed.
5. **Motion specs:** each animation has a documented duration, easing, trigger, and reduced-motion variant; prototyped before engineering.
6. **Sound check:** all sounds auditioned on phone speaker and cheap earbuds; none exceeds −14 LUFS short-term loudness.

---

## 14. Performance and Technical Design Constraints

| Metric | Target |
|---|---|
| LCP (Home, mid-range Android, 4G) | ≤ 2.5 s |
| Input response (tap → visual change) | ≤ 100 ms |
| Next lesson item transition | ≤ 300 ms (preload next 2 items) |
| JS per route | ≤ 170 KB gzip (initial), lazy-load Reader/analysis and Rive |
| Fonts per page | ≤ 150 KB per script in use |
| Mascot animation files | ≤ 120 KB each, lazy-loaded |
| Layout shift (CLS) | ≤ 0.05, including font swap and language switch |
| Offline | Current + next 7 days of lessons cached; lesson audio cached with them |

Animation is implemented with CSS transitions/WAAPI for UI motion, Rive (or Lottie) for the mascot and celebrations, and `prefers-reduced-motion` gating at the component level.

---

## 15. Validation Plan

1. **Prototype tests (before build):** 5 Tamil-speaking and 5 English-speaking beginners per round, think-aloud on onboarding → first lesson → Reader. Success: 9/10 complete the first lesson unaided; median time to first correct answer ≤ 90 s.
2. **Comprehension checks:** after the lesson, can the learner restate the rule in their own words? (Measures whether explanations work, not whether the UI is pretty.)
3. **Preference tests:** two Haṃsa expressions, two feedback-sheet tones, two celebration lengths. Choose by task completion and next-day return, not by taste.
4. **A/B in beta:** onboarding length, placement quiz vs. beginner-start, helper-line default.
5. **Accessibility audit** by an external specialist, English and Tamil screen-reader passes.
6. **Teacher review** of every Sanskrit string, hyphenation/line break, and animation that touches a letterform.

Design is "done" for v1 when the checks in §1.3, §10, §13.2 and §14 pass on the real build, not on mock-ups.

---

## 16. Deliverables Checklist (for the design team)

- [ ] Brand sheet: name, logotype, Haṃsa character sheet (5 expressions, 3 poses)
- [ ] Figma component library with all states and variables for tokens, light + dark, EN + TA
- [ ] Font acceptance test report (§4.2)
- [ ] Prototype of the lesson loop with real motion (Principle/Rive/Framer)
- [ ] Motion spec sheet (this document's §8 as per-component timelines)
- [ ] Sound pack (8 sounds) with usage rules
- [ ] Icon set including 7 custom linguistic icons
- [ ] Illustration kit: 30 spot illustrations + 5 hero scenes + kolam pattern set
- [ ] Accessibility annotations on all key screens
- [ ] Content style guide (EN + TA) for microcopy
- [ ] Design QA checklist integrated into the engineering definition-of-done