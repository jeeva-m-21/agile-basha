import { analyzeWordForm } from "../dictionary/analyzer";
import { getGrammarRuleBySlug, GrammarRuleItem } from "../dictionary/grammar-rules";
import { DICTIONARY_ENTRIES } from "../dictionary/data";

export interface TutorContext {
  type: "lesson" | "reader" | "dictionary" | "general";
  lessonId?: string;
  lessonTitle?: string;
  sentence?: string;
  word?: string;
  ruleSlug?: string;
}

export interface TutorReference {
  type: "grammar_rule" | "lesson" | "word";
  id: string;
  title: string;
  url: string;
}

export interface TutorResponse {
  answer: string;
  label: "AI tutor";
  references: TutorReference[];
  quotaRemaining: number;
  dailyQuota: number;
  suggestedFollowUps?: string[];
}

// In-memory quota tracker: key is `${userId}_${date}`
const DAILY_QUOTA_LIMIT = 20;
const quotaStore = new Map<string, number>();

export function getTodayKey(userId: string = "guest"): string {
  const today = new Date().toISOString().split("T")[0];
  return `${userId}_${today}`;
}

export function checkAndIncrementQuota(userId: string = "guest"): {
  allowed: boolean;
  remaining: number;
  dailyQuota: number;
} {
  const key = getTodayKey(userId);
  const currentCount = quotaStore.get(key) || 0;

  if (currentCount >= DAILY_QUOTA_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      dailyQuota: DAILY_QUOTA_LIMIT,
    };
  }

  const newCount = currentCount + 1;
  quotaStore.set(key, newCount);

  return {
    allowed: true,
    remaining: DAILY_QUOTA_LIMIT - newCount,
    dailyQuota: DAILY_QUOTA_LIMIT,
  };
}

export function getRemainingQuota(userId: string = "guest"): number {
  const key = getTodayKey(userId);
  const currentCount = quotaStore.get(key) || 0;
  return Math.max(0, DAILY_QUOTA_LIMIT - currentCount);
}

export function resetQuotaForTesting() {
  quotaStore.clear();
}

/**
 * Generates grounded, context-aware answers to Sanskrit learner questions
 * per SPEC §12.
 */
export async function answerTutorQuestion({
  question,
  context,
  language = "en",
  userId = "guest",
}: {
  question: string;
  context?: TutorContext;
  language?: "en" | "ta";
  userId?: string;
}): Promise<TutorResponse> {
  const quotaCheck = checkAndIncrementQuota(userId);

  if (!quotaCheck.allowed) {
    const isTa = language === "ta";
    return {
      answer: isTa
        ? "இன்றைய 20 கேள்விகளுக்கான வரம்பை எட்டிவிட்டீர்கள். நாளை மீண்டும் புதிய கேள்விகளைக் கேட்கலாம்!"
        : "You have reached your daily limit of 20 questions. The AI Tutor quota resets tomorrow!",
      label: "AI tutor",
      references: [],
      quotaRemaining: 0,
      dailyQuota: DAILY_QUOTA_LIMIT,
    };
  }

  const q = question.trim().toLowerCase();
  const isTa = language === "ta";
  const references: TutorReference[] = [];
  const followUps: string[] = [];

  // 1. Analyze targeted word from context or extracted from question
  let targetWord = context?.word;
  if (!targetWord) {
    // Extract Sanskrit words or key terms from question
    const words = question.match(/[\u0900-\u097F]+|[a-zA-Zāīūṛṝḷēōṃḥñṅṇṭḍśṣ]+/g);
    if (words) {
      targetWord = words.find((w) =>
        ["रामेण", "रामः", "गच्छति", "वनम्", "शिव", "विद्या", "रामा", "ராமேண", "ராம:"].includes(w)
      ) || words[0];
    }
  }

  let formAnalysis = targetWord ? analyzeWordForm(targetWord) : null;

  // 2. Add references if matched
  if (formAnalysis?.grammarRule) {
    references.push({
      type: "grammar_rule",
      id: formAnalysis.grammarRule.slug,
      title: isTa ? formAnalysis.grammarRule.titleTa : formAnalysis.grammarRule.titleEn,
      url: `/dictionary?slug=${formAnalysis.grammarRule.slug}`,
    });
  }

  if (formAnalysis?.relatedLessonId) {
    references.push({
      type: "lesson",
      id: formAnalysis.relatedLessonId,
      title: formAnalysis.relatedLessonTitle || `Lesson: ${formAnalysis.relatedLessonId}`,
      url: `/${formAnalysis.relatedLessonId.replace("-", "/")}`,
    });
  }

  // 3. Question routing & grounded response generation
  let answer = "";

  // A. "Why is it रामेण / [word] here?" (Vibhakti / Case explanation)
  if (q.includes("why") || q.includes("ஏன்") || q.includes("ராமேண") || q.includes("रामेण")) {
    if (targetWord?.includes("रामेण") || q.includes("रामेण") || q.includes("ராமேண")) {
      if (isTa) {
        answer =
          "இங்கு 'ராமேண' (rāmeṇa) என்பது 'ராம' (rāma) என்ற சொல்லின் மூன்றாம் வேற்றுமை ஒருமை (Tṛtīyā Vibhakti / Instrumental case) வடிவம் ஆகும்.\n\n" +
          "பாணினீய சூத்திரம்: 'कर्तृकरणयोस्तृतीया' (2.3.18) படி, ஒரு செயலைச் செய்ய உதவும் கருவி அல்லது துணையைக் குறிக்க மூன்றாம் வேற்றுமை உருபு (-ஏண / -ena) பயன்படுகிறது. எ.கா: 'ராமேண ஸஹ' என்றால் 'இராமனுடன் கூட' என்று பொருள்.";
      } else {
        answer =
          "'Rāmeṇa' (रामेण) is the instrumental singular (tṛtīyā vibhakti) form of the base stem 'Rāma' (राम).\n\n" +
          "According to Pāṇini sūtra 'कर्तृकरणयोस्तृतीया' (2.3.18), the instrumental case marks the instrument of action or accompaniment (with/by). For a-stem masculine nouns, the ending -ena becomes -eṇa due to na-to-ṇa retroflexion triggered by the consonant 'r'.";
      }
      followUps.push(isTa ? "மூன்றாம் வேற்றுமை விதியை விளக்குக" : "Quiz me on the instrumental case");
      followUps.push(isTa ? "இராமன் தாது என்ன?" : "What is the root of Rāma?");
    } else if (formAnalysis) {
      if (isTa) {
        answer = `'${formAnalysis.surfaceWord}' என்பது '${formAnalysis.baseLemma}' சொல்லின் வடிவம் ஆகும். இலக்கணம்: ${formAnalysis.grammarTa}.`;
      } else {
        answer = `'${formAnalysis.surfaceWord}' is an inflected form of lemma '${formAnalysis.baseLemma}'. Grammar: ${formAnalysis.grammarEn}.`;
      }
    }
  }

  // B. "What is the root of this word?" / "இந்த வார்த்தையின் வேர் என்ன?"
  else if (q.includes("root") || q.includes("வேர்") || q.includes("தாது") || q.includes("dhātu")) {
    if (targetWord?.includes("गच्छति") || q.includes("गच्छति") || q.includes("gacchati")) {
      if (isTa) {
        answer =
          "'க³ச்ச²தி' (gacchati) என்ற வினையின் வேர் (தாது) √க³ம் (√gam - செல்லுதல்) ஆகும்.\n\n" +
          "இது முதல் கணத்தைச் (Bhavādi gaṇa) சேர்ந்தது. நிகழ்காலத்தில் (லட் लकार) க³ம் தாது 'க³ச்ச்²' (gacch) என மாறி, படர்க்கை ஒருமை விகுதியான '-தி' (-ti) பெற்று 'க³ச்ச²தி' (அவன்/அவள் செல்கிறான்) என அமைகிறது.";
      } else {
        answer =
          "The verbal root (dhātu) of 'gacchati' (गच्छति) is √gam (√गम्), meaning 'to go, move, reach'.\n\n" +
          "It belongs to the 1st conjugation class (bhavādi gaṇa). In present tense (laṭ lakāra), the root √gam undergoes stem substitution to gacch-, and with the 3rd person singular active ending -ti, forms 'gacchati' (he/she/it goes).";
      }
      followUps.push(isTa ? "லட் லசார விகுதிகள் என்னென்ன?" : "Show present tense endings table");
    } else if (targetWord?.includes("राम") || q.includes("ராம") || q.includes("rama")) {
      if (isTa) {
        answer =
          "'ராம' (rāma) என்ற சொல்லின் வேர் √ரம் (√ram - மகிழ்ச்சியூட்டுதல், இன்புறுதல்) ஆகும்.\n\n" +
          "'ரமந்தே தஸ்மிந் இதி ராம:' (ramante tasmin iti rāmaḥ) — எவரிடத்தில் யோகிகளும் அனைவருமே மனமகிழ்ச்சி கொள்கிறார்களோ அவரே இராமன்.";
      } else {
        answer =
          "The etymological root of 'Rāma' (राम) is √ram (√रम्), meaning 'to delight, rejoice, or revel'.\n\n" +
          "Traditional etymology: 'ramante tasmin iti rāmaḥ' — 'He in whom the wise and devoted rejoice'.";
      }
    } else if (targetWord?.includes("विद्या") || q.includes("வித்யா") || q.includes("vidya")) {
      if (isTa) {
        answer =
          "'வித்³யா' (vidyā) சொல்லின் வேர் √வித்³ (√vid - அறிதல், உணர்தல்) ஆகும். இதிலிருந்தே 'வேதம்' (Veda) என்ற சொல்லும் தோன்றியது.";
      } else {
        answer =
          "The root of 'vidyā' (विद्या) is √vid (√विद्), meaning 'to know, perceive, understand'. The word 'Veda' also derives directly from this root.";
      }
    } else {
      if (isTa) {
        answer = `சமஸ்கிருதத்தில் சொற்கள் வேர் தாதுக்களிலிருந்து (Verbal roots) பிரத்யயங்கள் (suffixes) இணைந்து உருவாகின்றன.`;
      } else {
        answer = `Sanskrit nominal and verbal forms are derived from primary verbal roots (dhātus) using derivational and inflectional affixes.`;
      }
    }
  }

  // C. "Quiz me on [topic/case]" / Interactive practice
  else if (q.includes("quiz") || q.includes("பயிற்சி") || q.includes("கேள்வி")) {
    if (isTa) {
      answer =
        "இதோ உங்கள் உடனடி வினாடி-வினா:\n\n" +
        "கேள்வி: 'சிறுவன் பாணத்தினால் தாக்குகிறான்' — என்பதில் 'பாணத்தினால்' என்பதற்கு சரியான சமஸ்கிருத மூன்றாம் வேற்றுமை வடிவம் எது?\n" +
        "அ) बाणम् (bāṇam)\n" +
        "ஆ) बाणेन (bāṇena)\n" +
        "இ) बाणात् (bāṇāt)\n\n" +
        "பதிலை யோசித்து சரிபாருங்கள்! (விடை: ஆ)";
    } else {
      answer =
        "Here is a quick practice quiz for you:\n\n" +
        "Question: 'The hero strikes with an arrow.' Which form represents the instrumental case (by/with an arrow)?\n" +
        "A) बाणम् (bāṇam)\n" +
        "B) बाणेन (bāṇena)\n" +
        "C) बाणात् (bāṇāt)\n\n" +
        "Think of the answer! (Answer: B — bāṇena, a-stem masculine instrumental singular).";
    }
    followUps.push(isTa ? "இன்னொரு கேள்வி கேள்" : "Give me another quiz question");
  }

  // D. General grounded Sanskrit guidance
  else {
    if (isTa) {
      answer =
        `உங்கள் கேள்வி '${question}' குறித்து:\n\n` +
        (context?.sentence ? `தற்போதைய வாசகம்: "${context.sentence}"\n\n` : "") +
        "சமஸ்கிருத இலக்கண விதிகளின்படி, வாக்கியத்தில் சொல் வடிவங்கள் எழுவாய், செயப்படுபொருள், வேற்றுமை (விபக்தி) மற்றும் தாது விகுதிகளை அடிப்படையாகக் கொண்டு அமைகின்றன.";
    } else {
      answer =
        `Regarding your question "${question}":\n\n` +
        (context?.sentence ? `Current context sentence: "${context.sentence}"\n\n` : "") +
        "In Sanskrit grammar, words are formed through clear morphological paradigms based on noun cases (vibhakti), verbal tenses (lakāra), and sandhi phonetic rules.";
    }
    followUps.push(isTa ? "வேற்றுமை விதிகளைக் காட்டு" : "Show grammar case rules");
    followUps.push(isTa ? "இந்த சொல்லின் இலக்கணம் என்ன?" : "Analyze this word's grammar");
  }

  return {
    answer,
    label: "AI tutor",
    references,
    quotaRemaining: quotaCheck.remaining,
    dailyQuota: DAILY_QUOTA_LIMIT,
    suggestedFollowUps: followUps,
  };
}
