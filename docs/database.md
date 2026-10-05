# Database Schema

PostgreSQL via Supabase. All tables use UUID primary keys and timestamps.

## Core Tables

### users
```sql
id          UUID PK (supabase auth.users)
email       TEXT UNIQUE
display_name TEXT
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

### user_preferences
```sql
user_id         UUID PK FK(users)
learn_in        ENUM('en', 'ta')
script          ENUM('devanagari', 'tamil', 'iast')
helper_line     ENUM('off', 'roman', 'tamil')
daily_goal_min  INT (5, 10, 20)
goals           TEXT[] (mantras, gita, literature, grammar, general)
theme           ENUM('system', 'light', 'dark')
text_scale      DECIMAL (1.0, 1.15, 1.3)
sound_enabled   BOOLEAN
haptics_enabled BOOLEAN
reminder_time   TIME
```

### levels
```sql
id          UUID PK
order_num   INT
title_en    TEXT
title_ta    TEXT
outcome_en  TEXT ("You will be able to...")
outcome_ta  TEXT
```

### units
```sql
id          UUID PK
level_id    UUID FK(levels)
order_num   INT
title_en    TEXT
title_ta    TEXT
```

### lessons
```sql
id          UUID PK
unit_id     UUID FK(units)
order_num   INT
title_en    TEXT
title_ta    TEXT
goal_en     TEXT
goal_ta     TEXT
est_minutes INT
```

### lesson_steps
```sql
id          UUID PK
lesson_id   UUID FK(lessons)
order_num   INT
step_type   ENUM('see_it', 'notice_it', 'rule', 'exercise', 'say_it', 'recap')
content     JSONB (structure varies by step_type)
```

### exercises
```sql
id              UUID PK
lesson_step_id  UUID FK(lesson_steps)
exercise_type   ENUM('read_script', 'listen_choose', 'match', 'fill_blank',
                      'identify_case', 'build_sentence', 'translate',
                      'transliterate', 'split_sandhi', 'recall')
prompt_en       TEXT
prompt_ta       TEXT
content         JSONB (options, correct_answers, explanations)
audio_url       TEXT
```

### words
```sql
id          UUID PK
devanagari  TEXT
tamil       TEXT
iast        TEXT
meaning_en  TEXT
meaning_ta  TEXT
word_type   TEXT (noun, verb, adjective, indeclinable...)
root        TEXT (dhatu for verbs)
gender      ENUM('m', 'f', 'n', NULL)
stem_type   TEXT (a-stem, i-stem...)
lesson_id   UUID FK(lessons) (where first taught)
audio_url   TEXT
syllables   JSONB ([{text, duration_ms, is_long}])
```

### grammar_rules
```sql
id              UUID PK
slug            TEXT UNIQUE
title_en        TEXT
title_ta        TEXT
explanation_en  TEXT
explanation_ta  TEXT
sanskrit_term   TEXT
examples        JSONB
lesson_id       UUID FK(lessons)
```

### texts (Reader library)
```sql
id              UUID PK
title_en        TEXT
title_ta        TEXT
sanskrit        TEXT
translation_en  TEXT
translation_ta  TEXT
source          TEXT
translator      TEXT
is_ai_translated BOOLEAN
difficulty      INT (0-5)
category        TEXT (gita, subhashita, stotra, story, upanishad)
```

## User Progress Tables

### user_progress
```sql
user_id     UUID FK(users)
lesson_id   UUID FK(lessons)
status      ENUM('not_started', 'in_progress', 'completed')
started_at  TIMESTAMPTZ
completed_at TIMESTAMPTZ
score       INT (items correct out of total)
PK(user_id, lesson_id)
```

### user_skills
```sql
user_id     UUID FK(users)
skill_slug  TEXT (e.g., 'nominative', 'present_tense')
state       ENUM('not_started', 'learning', 'strong', 'needs_review')
updated_at  TIMESTAMPTZ
PK(user_id, skill_slug)
```

### user_words
```sql
user_id     UUID FK(users)
word_id     UUID FK(words)
saved       BOOLEAN
PK(user_id, word_id)
```

### review_items
```sql
id          UUID PK
user_id     UUID FK(users)
item_type   ENUM('word', 'grammar_rule')
item_id     UUID
next_due    TIMESTAMPTZ
interval_days DECIMAL
ease_factor DECIMAL DEFAULT 2.5
rep_count   INT DEFAULT 0
last_reviewed TIMESTAMPTZ
```

### review_attempts
```sql
id          UUID PK
review_item_id UUID FK(review_items)
reviewed_at TIMESTAMPTZ
quality     INT (0-5, SM-2 scale)
```

### streaks
```sql
user_id         UUID PK FK(users)
current_streak  INT
longest_streak  INT
last_active_date DATE
rest_day_used   BOOLEAN DEFAULT FALSE
rest_day_week_start DATE
```

## Indexes

```sql
CREATE INDEX idx_review_items_due ON review_items(user_id, next_due);
CREATE INDEX idx_user_progress_status ON user_progress(user_id, status);
CREATE INDEX idx_words_lesson ON words(lesson_id);
CREATE INDEX idx_lesson_steps_lesson ON lesson_steps(lesson_id, order_num);
CREATE INDEX idx_exercises_step ON exercises(lesson_step_id);
```

## Row-Level Security

All user_* and review_* tables: `auth.uid() = user_id`
Curriculum tables (levels, units, lessons, etc.): read-only for authenticated users.
