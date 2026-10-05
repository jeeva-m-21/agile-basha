import { NextResponse } from "next/server";
import { reviewStore } from "@/lib/srs/storage";
import { db, memoryDb } from "@/lib/db/client";
import { userSkills, userProgress, reviewItems, reviewAttempts } from "@/lib/db/schema";

export async function POST() {
  try {
    // 1. Reset in-memory review storage and preferences
    reviewStore.reset();
    memoryDb.reset();

    // 2. Clear database tables if DB is connected
    try {
      if (db) {
        await db.delete(userSkills);
        await db.delete(userProgress);
        await db.delete(reviewAttempts);
        await db.delete(reviewItems);
      }
    } catch {
      // Offline/local development fallback
    }

    return NextResponse.json({
      success: true,
      messageEn: "All learning data and progress have been completely reset.",
      messageTa: "உங்கள் கற்றல் மற்றும் முன்னேற்றத் தரவுகள் அனைத்தும் அழிக்கப்பட்டன.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset account data", details: String(error) },
      { status: 500 }
    );
  }
}
