import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
