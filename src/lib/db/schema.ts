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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type Level = typeof levels.$inferSelect;
export type Unit = typeof units.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
