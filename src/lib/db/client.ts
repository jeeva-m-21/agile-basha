import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@127.0.0.1:5432/agile_basha";

// Global client cache in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const client =
  globalForDb.conn ??
  postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = client;

export const db = drizzle(client, { schema });

// In-memory preferences store for fast tests and mock user storage
const inMemoryPreferencesStore = new Map<string, any>();

export const memoryDb = {
  getPreferences: (userId: string) => inMemoryPreferencesStore.get(userId) || null,
  setPreferences: (userId: string, data: any) => {
    const existing = inMemoryPreferencesStore.get(userId) || {};
    const updated = {
      ...existing,
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };
    inMemoryPreferencesStore.set(userId, updated);
    return updated;
  },
  reset: () => inMemoryPreferencesStore.clear(),
};
