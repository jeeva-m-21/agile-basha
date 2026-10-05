import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  learnIn: text("learn_in", { enum: ["en", "ta"] }).default("en").notNull(),
  script: text("script", { enum: ["devanagari", "tamil", "iast"] }).default("devanagari").notNull(),
  helperLine: text("helper_line", { enum: ["off", "roman", "tamil"] }).default("roman").notNull(),
  dailyGoalMin: integer("daily_goal_min").default(10).notNull(),
  goals: jsonb("goals").$type<string[]>().default(["gita", "mantras"]).notNull(),
  level: text("level", { enum: ["beginner", "some"] }).default("beginner").notNull(),
  theme: text("theme", { enum: ["system", "light", "dark"] }).default("system").notNull(),
  textScale: text("text_scale").default("1.0").notNull(),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  hapticsEnabled: boolean("haptics_enabled").default(true).notNull(),
  reminderTime: text("reminder_time"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const levels = pgTable("levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNum: integer("order_num").notNull(),
  titleEn: text("title_en").notNull(),
  titleTa: text("title_ta").notNull(),
  outcomeEn: text("outcome_en").notNull(),
  outcomeTa: text("outcome_ta").notNull(),
});

export const units = pgTable("units", {
  id: uuid("id").primaryKey().defaultRandom(),
  levelId: uuid("level_id").references(() => levels.id, { onDelete: "cascade" }).notNull(),
  orderNum: integer("order_num").notNull(),
  titleEn: text("title_en").notNull(),
  titleTa: text("title_ta").notNull(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  unitId: uuid("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
  orderNum: integer("order_num").notNull(),
  titleEn: text("title_en").notNull(),
  titleTa: text("title_ta").notNull(),
  goalEn: text("goal_en").notNull(),
  goalTa: text("goal_ta").notNull(),
  estMinutes: integer("est_minutes").default(10).notNull(),
});

export const lessonSteps = pgTable("lesson_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: text("lesson_id").notNull(),
  orderNum: integer("order_num").notNull(),
  stepType: text("step_type", {
    enum: ["see_it", "notice_it", "rule", "exercise", "say_it", "recap"],
  }).notNull(),
  content: jsonb("content").notNull(),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  stepId: uuid("step_id"),
  exerciseType: text("exercise_type", {
    enum: [
      "read_script",
      "listen_choose",
      "match",
      "fill_blank",
      "identify_case",
      "build_sentence",
      "translate",
      "transliterate",
      "split_sandhi",
      "recall",
    ],
  }).notNull(),
  promptEn: text("prompt_en").notNull(),
  promptTa: text("prompt_ta").notNull(),
  content: jsonb("content").notNull(),
  audioUrl: text("audio_url"),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  status: text("status", {
    enum: ["not_started", "in_progress", "completed"],
  }).default("in_progress").notNull(),
  score: integer("score").default(0).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const streaks = pgTable("streaks", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(1).notNull(),
  longestStreak: integer("longest_streak").default(1).notNull(),
  lastActiveDate: date("last_active_date").notNull(),
  restDayUsed: boolean("rest_day_used").default(false).notNull(),
  restDayWeekStart: date("rest_day_week_start"),
});

export const reviewItems = pgTable("review_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  itemType: text("item_type", {
    enum: ["word", "grammar_rule", "vowel", "sentence"],
  }).notNull(),
  itemId: text("item_id"),
  sanskrit: text("sanskrit").notNull(),
  iast: text("iast").notNull(),
  tamilScript: text("tamil_script").notNull(),
  meaningEn: text("meaning_en").notNull(),
  meaningTa: text("meaning_ta").notNull(),
  explanationEn: text("explanation_en"),
  explanationTa: text("explanation_ta"),
  nextDue: timestamp("next_due", { withTimezone: true }).defaultNow().notNull(),
  intervalDays: integer("interval_days").default(1).notNull(),
  easeFactor: text("ease_factor").default("2.5").notNull(),
  repCount: integer("rep_count").default(0).notNull(),
  lastReviewed: timestamp("last_reviewed", { withTimezone: true }),
});

export const reviewAttempts = pgTable("review_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewItemId: uuid("review_item_id")
    .references(() => reviewItems.id, { onDelete: "cascade" })
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
  quality: integer("quality").notNull(),
  action: text("action", { enum: ["rate", "know_this", "reset"] }).default("rate").notNull(),
});

export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  sanskrit: text("sanskrit").notNull(),
  transliteration: text("transliteration").notNull(),
  tamilScript: text("tamil_script").notNull(),
  meaningEn: text("meaning_en").notNull(),
  meaningTa: text("meaning_ta").notNull(),
  root: text("root"),
  partOfSpeech: text("part_of_speech"),
  lessonId: text("lesson_id"),
});

export const texts = pgTable("texts", {
  id: uuid("id").primaryKey().defaultRandom(),
  titleEn: text("title_en").notNull(),
  titleTa: text("title_ta").notNull(),
  sanskrit: text("sanskrit").notNull(),
  translationEn: text("translation_en").notNull(),
  translationTa: text("translation_ta").notNull(),
  source: text("source").notNull(),
  translator: text("translator"),
  isAiTranslated: boolean("is_ai_translated").default(false).notNull(),
  difficulty: integer("difficulty").default(1).notNull(), // 0-5
  category: text("category", {
    enum: ["gita", "subhashita", "stotra", "story", "upanishad"],
  }).notNull(),
});

export const translationsCache = pgTable("translations_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceText: text("source_text").notNull(),
  targetLang: text("target_lang", { enum: ["en", "ta"] }).notNull(),
  translation: text("translation").notNull(),
  provider: text("provider").default("sarvam").notNull(),
  isAiTranslated: boolean("is_ai_translated").default(true).notNull(),
  cachedAt: timestamp("cached_at", { withTimezone: true }).defaultNow().notNull(),
});

export const grammarRules = pgTable("grammar_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  titleEn: text("title_en").notNull(),
  titleTa: text("title_ta").notNull(),
  sanskritTerm: text("sanskrit_term").notNull(),
  sanskritIast: text("sanskrit_iast").notNull(),
  category: text("category", {
    enum: ["vibhakti", "sandhi", "lakara", "samasa", "general"],
  }).notNull(),
  sutra: text("sutra"),
  sutraTranslationEn: text("sutra_translation_en"),
  sutraTranslationTa: text("sutra_translation_ta"),
  ruleEn: text("rule_en").notNull(),
  ruleTa: text("rule_ta").notNull(),
  tableData: jsonb("table_data"),
  examples: jsonb("examples").notNull(),
  relatedLessonId: text("related_lesson_id"),
});

export const tutorMessages = pgTable("tutor_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").default("guest").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  context: jsonb("context"),
  references: jsonb("references"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tutorReports = pgTable("tutor_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: text("message_id").notNull(),
  userQuestion: text("user_question"),
  assistantAnswer: text("assistant_answer"),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tutorQuota = pgTable("tutor_quota", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  count: integer("count").default(0).notNull(),
});

export const userSkills = pgTable("user_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").default("guest").notNull(),
  skillId: text("skill_id").notNull(),
  state: text("state", { enum: ["locked", "in_progress", "mastered"] }).default("locked").notNull(),
  masteryPercentage: integer("mastery_percentage").default(0).notNull(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
  masteredAt: timestamp("mastered_at", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type Level = typeof levels.$inferSelect;
export type Unit = typeof units.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LessonStep = typeof lessonSteps.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type DbReviewItem = typeof reviewItems.$inferSelect;
export type DbReviewAttempt = typeof reviewAttempts.$inferSelect;
export type Word = typeof words.$inferSelect;
export type TextItem = typeof texts.$inferSelect;
export type TranslationCache = typeof translationsCache.$inferSelect;
export type GrammarRule = typeof grammarRules.$inferSelect;
export type TutorMessage = typeof tutorMessages.$inferSelect;
export type TutorReport = typeof tutorReports.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;



