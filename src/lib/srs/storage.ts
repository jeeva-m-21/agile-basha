import {
  ReviewItem,
  ReviewAttempt,
  calculateSM2,
  markItemKnown,
  resetItem,
  countDueItems,
  isItemDue,
} from "./sm2";

const initialSeeds: ReviewItem[] = [
  {
    id: "rev-vowel-1",
    userId: "guest-user-default",
    itemType: "vowel",
    sanskrit: "अ",
    iast: "a",
    tamilScript: "அ",
    meaningEn: "Short vowel 'a' (1 mātrā beat, throat sound)",
    meaningTa: "குறில் 'அ' (1 மாத்திரை, தொண்டை ஒலி)",
    explanationEn: "Inherent vowel in every Sanskrit consonant unless muted by a virāma.",
    explanationTa: "புள்ளி இல்லாத அனைத்து மெய்யெழுத்துக்களிலும் இயல்பாக இருக்கும் குறில் ஒலி.",
    soundToPlay: "a",
    isLongVowel: false,
    nextDue: new Date(Date.now() - 3600000).toISOString(), // due 1 hour ago
    intervalDays: 1,
    easeFactor: 2.5,
    repCount: 0,
  },
  {
    id: "rev-vowel-2",
    userId: "guest-user-default",
    itemType: "vowel",
    sanskrit: "आ",
    iast: "ā",
    tamilScript: "ஆ",
    meaningEn: "Long vowel 'ā' (2 mātrā beats)",
    meaningTa: "நெடில் 'ஆ' (2 மாத்திரை கால அளவு)",
    explanationEn: "Twice the duration of short 'a'. Vowel length changes word meanings.",
    explanationTa: "குறில் 'அ' போல இரண்டு மடங்கு கால அளவு கொண்டது.",
    soundToPlay: "ā",
    isLongVowel: true,
    nextDue: new Date(Date.now() - 3600000).toISOString(),
    intervalDays: 1,
    easeFactor: 2.5,
    repCount: 0,
  },
  {
    id: "rev-word-1",
    userId: "guest-user-default",
    itemType: "word",
    sanskrit: "रामः",
    iast: "rāmaḥ",
    tamilScript: "ராம:",
    meaningEn: "Rāma (Nominative case / Kartā - the doer)",
    meaningTa: "இராமன் (எழுவாய் வேற்றுமை - செய்பவர்)",
    explanationEn: "Ends in visarga (-ḥ) marking the singular masculine subject.",
    explanationTa: "விஸர்கத்துடன் (-:) முடிந்து எழுவாயைக் குறிக்கிறது.",
    soundToPlay: "rāmaḥ",
    isLongVowel: false,
    nextDue: new Date(Date.now() - 3600000).toISOString(),
    intervalDays: 1,
    easeFactor: 2.5,
    repCount: 0,
  },
  {
    id: "rev-word-2",
    userId: "guest-user-default",
    itemType: "word",
    sanskrit: "वनम्",
    iast: "vanam",
    tamilScript: "வநம்",
    meaningEn: "Forest (Accusative case / Karma - destination)",
    meaningTa: "காடு (இரண்டாம் வேற்றுமை - சென்றடையும் இடம்)",
    explanationEn: "Ends in -m / anusvāra marking the destination of action.",
    explanationTa: "மகர மெய்யுடன் முடிந்து செயப்படுபொருளை உணர்த்துகிறது.",
    soundToPlay: "vanam",
    isLongVowel: false,
    nextDue: new Date(Date.now() - 3600000).toISOString(),
    intervalDays: 1,
    easeFactor: 2.5,
    repCount: 0,
  },
];

class ReviewStore {
  private items: Map<string, ReviewItem> = new Map();
  private attempts: ReviewAttempt[] = [];

  constructor() {
    this.seedDefaultItems();
  }

  private seedDefaultItems() {
    initialSeeds.forEach((item) => {
      this.items.set(item.id, { ...item });
    });
  }

  getItems(userId: string = "guest-user-default"): ReviewItem[] {
    return Array.from(this.items.values()).filter((i) => i.userId === userId);
  }

  getItemById(id: string): ReviewItem | undefined {
    return this.items.get(id);
  }

  getDueItems(userId: string = "guest-user-default", limit: number = 10): ReviewItem[] {
    const userItems = this.getItems(userId);
    return userItems
      .filter((item) => isItemDue(item))
      .slice(0, limit);
  }

  getDueCount(userId: string = "guest-user-default"): number {
    return countDueItems(this.getItems(userId));
  }

  answerItem(
    itemId: string,
    quality: number,
    action: "rate" | "know_this" | "reset" = "rate"
  ): {
    updatedItem: ReviewItem;
    attempt: ReviewAttempt;
    remainingDueCount: number;
  } {
    const item = this.items.get(itemId);
    if (!item) {
      throw new Error(`Review item ${itemId} not found`);
    }

    const now = new Date();
    let updatedFields: Partial<ReviewItem>;

    if (action === "know_this") {
      updatedFields = markItemKnown(item);
    } else if (action === "reset") {
      updatedFields = resetItem(item);
    } else {
      const sm2 = calculateSM2({
        quality,
        repetitions: item.repCount,
        previousInterval: item.intervalDays,
        previousEaseFactor: item.easeFactor,
      });

      updatedFields = {
        intervalDays: sm2.interval,
        easeFactor: sm2.easeFactor,
        repCount: sm2.repetitions,
        nextDue: sm2.nextDueDate.toISOString(),
        lastReviewed: now.toISOString(),
      };
    }

    const updatedItem: ReviewItem = {
      ...item,
      ...updatedFields,
    };

    this.items.set(itemId, updatedItem);

    const attempt: ReviewAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reviewItemId: itemId,
      reviewedAt: now.toISOString(),
      quality,
      action,
    };
    this.attempts.push(attempt);

    return {
      updatedItem,
      attempt,
      remainingDueCount: this.getDueCount(item.userId),
    };
  }

  getAllItems(): ReviewItem[] {
    return Array.from(this.items.values());
  }

  upsertItem(item: Partial<ReviewItem> & { id: string }) {
    const existing = this.items.get(item.id);
    const fullItem: ReviewItem = {
      userId: "guest-user-default",
      itemType: "word",
      sanskrit: item.sanskrit || "",
      iast: item.iast || "",
      tamilScript: item.tamilScript || "",
      meaningEn: item.meaningEn || "",
      meaningTa: item.meaningTa || "",
      soundToPlay: item.soundToPlay || item.sanskrit || "",
      isLongVowel: item.isLongVowel ?? false,
      nextDue: item.nextDue || new Date().toISOString(),
      intervalDays: item.intervalDays ?? 1,
      easeFactor: item.easeFactor ?? 2.5,
      repCount: item.repCount ?? 0,
      ...existing,
      ...item,
    };
    this.items.set(item.id, fullItem);
  }

  clear() {
    this.items.clear();
    this.attempts = [];
  }

  reset() {
    this.clear();
  }

  resetStore() {
    this.items.clear();
    this.attempts = [];
    this.seedDefaultItems();
  }
}

export const reviewStore = new ReviewStore();
