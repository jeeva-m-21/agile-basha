export interface SM2Input {
  quality: number; // 0 to 5
  repetitions: number;
  previousInterval: number; // in days
  previousEaseFactor: number;
}

export interface SM2Result {
  interval: number; // in days
  easeFactor: number;
  repetitions: number;
  nextDueDate: Date;
}

export interface ReviewItem {
  id: string;
  userId: string;
  itemType: "word" | "grammar_rule" | "vowel" | "sentence";
  itemId?: string;
  sanskrit: string;
  iast: string;
  tamilScript: string;
  meaningEn: string;
  meaningTa: string;
  explanationEn?: string;
  explanationTa?: string;
  audioUrl?: string;
  soundToPlay?: string;
  isLongVowel?: boolean;
  nextDue: string; // ISO date string
  intervalDays: number;
  easeFactor: number;
  repCount: number;
  lastReviewed?: string;
}

export interface ReviewAttempt {
  id: string;
  reviewItemId: string;
  reviewedAt: string;
  quality: number;
  action?: "rate" | "know_this" | "reset";
}

/**
 * SuperMemo 2 (SM-2) Spaced Repetition Algorithm
 *
 * Quality scale:
 * 5 - Perfect response
 * 4 - Correct response after a hesitation
 * 3 - Correct response recalled with serious difficulty
 * 2 - Incorrect response; where the correct one seemed easy to recall
 * 1 - Incorrect response; the correct one remembered
 * 0 - Complete blackout
 */
export function calculateSM2({
  quality,
  repetitions,
  previousInterval,
  previousEaseFactor,
}: SM2Input): SM2Result {
  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  // Calculate new Ease Factor:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let easeFactor =
    previousEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // Minimum Ease Factor is 1.3 in SM-2
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Round easeFactor to 2 decimal places
  easeFactor = Math.round(easeFactor * 100) / 100;

  let interval: number;
  let newRepetitions: number;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // Incorrect response - reset repetition streak
    newRepetitions = 0;
    interval = 1;
  }

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    repetitions: newRepetitions,
    nextDueDate,
  };
}

/**
 * "I know this" control: fast-forwards the item as mastered
 */
export function markItemKnown(
  item: ReviewItem,
  advanceDays: number = 14
): {
  intervalDays: number;
  easeFactor: number;
  repCount: number;
  nextDue: string;
  lastReviewed: string;
} {
  const now = new Date();
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + advanceDays);

  return {
    intervalDays: advanceDays,
    easeFactor: Math.max(item.easeFactor, 2.6),
    repCount: Math.max(item.repCount + 1, 3),
    nextDue: nextDue.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

/**
 * "Reset" control: puts item back to day 1 for immediate review
 */
export function resetItem(item: ReviewItem): {
  intervalDays: number;
  easeFactor: number;
  repCount: number;
  nextDue: string;
  lastReviewed: string;
} {
  const now = new Date();

  return {
    intervalDays: 1,
    easeFactor: 2.5,
    repCount: 0,
    nextDue: now.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

/**
 * Checks whether an item is due for review
 */
export function isItemDue(item: ReviewItem, asOfDate: Date = new Date()): boolean {
  return new Date(item.nextDue).getTime() <= asOfDate.getTime();
}

/**
 * Counts how many items are currently due
 */
export function countDueItems(
  items: ReviewItem[],
  asOfDate: Date = new Date()
): number {
  return items.filter((item) => isItemDue(item, asOfDate)).length;
}
