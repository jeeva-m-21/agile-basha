export interface LessonContent {
  id: string;
  titleEn: string;
  titleTa: string;
  levelTitleEn: string;
  levelTitleTa: string;
  goalEn: string;
  goalTa: string;
  steps: LessonStepData[];
}

export type StepType = "see_it" | "notice_it" | "rule" | "exercise" | "recap";

export interface LessonStepData {
  id: string;
  type: StepType;
  titleEn: string;
  titleTa: string;
  content: any;
}

export const level0Lesson1: LessonContent = {
  id: "level-0-lesson-1",
  titleEn: "First Five Sounds (a, ā, i, ī, u)",
  titleTa: "முதல் ஐந்து ஒலிகள் (அ, ஆ, இ, ஈ, உ)",
  levelTitleEn: "Level 0 — Sounds and Script",
  levelTitleTa: "நிலை 0 — ஒலிகளும் எழுத்துக்களும்",
  goalEn: "Today: recognize and pronounce the first five vowel sounds: a, ā, i, ī, u.",
  goalTa: "இன்று: முதல் ஐந்து உயிர் ஒலிகளை (அ, ஆ, இ, ஈ, உ) அடையாளம் கண்டு உச்சரிக்கவும்.",
  steps: [
    {
      id: "step-1",
      type: "see_it",
      titleEn: "See the First Five Sounds",
      titleTa: "முதல் ஐந்து ஒலிகளைக் காணுங்கள்",
      content: {
        sanskrit: "अ  आ  इ  ई  उ",
        tamilScript: "அ  ஆ  இ  ஈ  உ",
        transliteration: "a  ā  i  ī  u",
        syllables: [
          { text: "अ", iast: "a", tamil: "அ", isLong: false, durationMs: 350 },
          { text: "आ", iast: "ā", tamil: "ஆ", isLong: true, durationMs: 700 },
          { text: "इ", iast: "i", tamil: "இ", isLong: false, durationMs: 350 },
          { text: "ई", iast: "ī", tamil: "ஈ", isLong: true, durationMs: 700 },
          { text: "उ", iast: "u", tamil: "உ", isLong: false, durationMs: 350 },
        ],
        translationEn: "The primary vowels of Sanskrit: short and long pairs.",
        translationTa: "சமஸ்கிருதத்தின் முதன்மை உயிர் ஒலிகள்: குறில் மற்றும் நெடில் இணைகள்.",
      },
    },
    {
      id: "step-2",
      type: "notice_it",
      titleEn: "Notice the Pattern",
      titleTa: "ஒலி அமைப்பைக் கவனியுங்கள்",
      content: {
        instructionEn: "Tap each sound to discover its duration and mouth position:",
        instructionTa: "ஒவ்வொரு ஒலியையும் தட்டி அதன் கால அளவையும் உச்சரிப்பு முறையையும் அறியவும்:",
        tokens: [
          {
            char: "अ",
            iast: "a",
            tamil: "அ",
            nameEn: "Short vowel (Hrasva)",
            nameTa: "குறில் ஒலி (ஹ்ரஸ்வ)",
            detailEn: "Throat sound (kaṇṭhya). 1 beat duration (mātrā).",
            detailTa: "தொண்டை ஒலி. 1 மாத்திரை கால அளவு.",
          },
          {
            char: "आ",
            iast: "ā",
            tamil: "ஆ",
            nameEn: "Long vowel (Dīrgha)",
            nameTa: "நெடில் ஒலி (தீ³ர்க⁴)",
            detailEn: "Throat sound. Exactly twice the length of 'a' (2 beats).",
            detailTa: "தொண்டை ஒலி. 'அ' போல இரண்டு மடங்கு கால அளவு (2 மாத்திரை).",
          },
          {
            char: "इ",
            iast: "i",
            tamil: "இ",
            nameEn: "Short vowel (Hrasva)",
            nameTa: "குறில் ஒலி (ஹ்ரஸ்வ)",
            detailEn: "Palatal sound (tālavya). Like 'i' in 'pin'.",
            detailTa: "அண்ண ஒலி. குறுகிய 'இ' ஒலி.",
          },
          {
            char: "ई",
            iast: "ī",
            tamil: "ஈ",
            nameEn: "Long vowel (Dīrgha)",
            nameTa: "நெடில் ஒலி (தீ³ர்க⁴)",
            detailEn: "Palatal sound. Sustained like 'ee' in 'seed'.",
            detailTa: "அண்ண ஒலி. நீண்ட 'ஈ' ஒலி (2 மாத்திரை).",
          },
          {
            char: "उ",
            iast: "u",
            tamil: "உ",
            nameEn: "Short vowel (Hrasva)",
            nameTa: "குறில் ஒலி (ஹ்ரஸ்வ)",
            detailEn: "Labial sound (oṣṭhya). Formed with rounded lips.",
            detailTa: "இதழ் ஒலி. இதழ்களைக் குவித்து ஒலிக்கும் 'உ' ஒலி.",
          },
        ],
      },
    },
    {
      id: "step-3",
      type: "rule",
      titleEn: "The Rule: Vowel Length Matters",
      titleTa: "விதி: ஒலி கால அளவின் முக்கியத்துவம்",
      content: {
        headlineEn: "Short (Hrasva) vs. Long (Dīrgha)",
        headlineTa: "குறில் (ஹ்ரஸ்வ) vs நெடில் (தீ³ர்க⁴)",
        ruleEn:
          "In Sanskrit, vowel length changes the entire meaning of a word. A short vowel (ह्रस्व / hrasva) lasts 1 beat; a long vowel (दीर्घ / dīrgha) lasts 2 beats.",
        ruleTa:
          "சமஸ்கிருதத்தில் குறில் மற்றும் நெடில் ஒலிப்பு சொல்லின் பொருளையே மாற்றும். குறில் (ஹ்ரஸ்வ) 1 மாத்திரை; நெடில் (தீ³ர்க⁴) 2 மாத்திரை கால அளவு கொண்டது.",
        bridgeTitleEn: "Tamil & English Connection",
        bridgeTitleTa: "தமிழ் இலக்கண இணைப்பு",
        bridgeTextEn:
          "Unlike English, where vowel length often shifts the quality ('cut' vs 'cute'), Sanskrit and Tamil share the exact same concept of pure duration: அ ↔ ஆ matches short a ↔ long ā.",
        bridgeTextTa:
          "தமிழில் உள்ள குறில் (அ, இ, உ) மற்றும் நெடில் (ஆ, ஈ, ஊ) மாத்திரை விதிகளும் சமஸ்கிருதத்தின் விதிகளும் முற்றிலும் ஒன்றே!",
      },
    },
    {
      id: "step-4",
      type: "exercise",
      titleEn: "Exercise 1 of 3",
      titleTa: "பயிற்சி 1 / 3",
      content: {
        id: "ex-1",
        exerciseType: "read_script",
        promptEn: "Which letter makes the long 'ā' sound?",
        promptTa: "நீண்ட 'ஆ' (ā) ஒலியைக் குறிக்கும் எழுத்து எது?",
        options: [
          { id: "opt-1", text: "अ", helper: "a" },
          { id: "opt-2", text: "आ", helper: "ā" },
          { id: "opt-3", text: "इ", helper: "i" },
          { id: "opt-4", text: "उ", helper: "u" },
        ],
        correctOptionId: "opt-2",
        explanationEn: "Correct! 'आ' (ā) is the long form of 'अ', lasting twice as long (2 mātrās).",
        explanationTa: "சரி! 'ஆ' (ā) என்பது 'அ' வின் நெடில் வடிவமாகும் (2 மாத்திரை).",
      },
    },
    {
      id: "step-5",
      type: "exercise",
      titleEn: "Exercise 2 of 3",
      titleTa: "பயிற்சி 2 / 3",
      content: {
        id: "ex-2",
        exerciseType: "read_script",
        promptEn: "Which letter represents the short sound 'i'?",
        promptTa: "குறுகிய 'இ' (i) ஒலியைக் குறிக்கும் எழுத்து எது?",
        options: [
          { id: "opt-1", text: "ई", helper: "ī" },
          { id: "opt-2", text: "इ", helper: "i" },
          { id: "opt-3", text: "उ", helper: "u" },
          { id: "opt-4", text: "आ", helper: "ā" },
        ],
        correctOptionId: "opt-2",
        explanationEn: "Yes! 'इ' is the short vowel 'i' (as in 'pit'). 'ई' is the long vowel (as in 'feed').",
        explanationTa: "சரி! 'இ' என்பது குறில் ஒலி. 'ஈ' என்பது நெடில் ஒலி.",
      },
    },
    {
      id: "step-6",
      type: "exercise",
      titleEn: "Exercise 3 of 3",
      titleTa: "பயிற்சி 3 / 3",
      content: {
        id: "ex-3",
        exerciseType: "read_script",
        promptEn: "Which sound is long (dīrgha)?",
        promptTa: "இவற்றில் நெடில் (தீ³ர்க⁴) ஒலி எது?",
        options: [
          { id: "opt-1", text: "उ", helper: "u" },
          { id: "opt-2", text: "अ", helper: "a" },
          { id: "opt-3", text: "ई", helper: "ī" },
          { id: "opt-4", text: "इ", helper: "i" },
        ],
        correctOptionId: "opt-3",
        explanationEn: "Spot on! 'ई' (ī) is a long vowel (dīrgha). The others (u, a, i) are short (hrasva).",
        explanationTa: "மிகச் சரி! 'ஈ' (ī) நெடில் ஒலி. மற்றவை (உ, அ, இ) குறில் ஒலிகள்.",
      },
    },
    {
      id: "step-6b",
      type: "exercise",
      titleEn: "Listening Exercise",
      titleTa: "கேட்டறிதல் பயிற்சி",
      content: {
        id: "ex-4",
        exerciseType: "listen_choose",
        promptEn: "Listen carefully. Which sound was pronounced?",
        promptTa: "கவனமாகக் கேளுங்கள். உச்சரிக்கப்பட்ட ஒலி எது?",
        soundToPlay: "ā",
        soundText: "आ",
        soundIsLong: true,
        options: [
          { id: "opt-1", text: "अ", helper: "a (short)" },
          { id: "opt-2", text: "आ", helper: "ā (long)" },
          { id: "opt-3", text: "उ", helper: "u (short)" },
          { id: "opt-4", text: "इ", helper: "i (short)" },
        ],
        correctOptionId: "opt-2",
        explanationEn: "Well heard! 'आ' (ā) is the sustained long vowel.",
        explanationTa: "நன்றாகக் கேட்டீர்கள்! 'ஆ' (ā) என்பது நீடித்த நெடில் ஒலி.",
      },
    },
    {
      id: "step-7",
      type: "recap",
      titleEn: "Lesson Complete!",
      titleTa: "பாடம் நிறைவுற்றது!",
      content: {
        recapPointsEn: [
          "Recognized short (hrasva) and long (dīrgha) vowels: a, ā, i, ī, u.",
          "Learned that long vowels take double the time (2 beats / mātrās).",
          "Connected duration rules with familiar English/Tamil sound concepts.",
        ],
        recapPointsTa: [
          "குறில் (ஹ்ரஸ்வ) மற்றும் நெடில் (தீ³ர்க⁴) உயிர் ஒலிகளை (அ, ஆ, இ, ஈ, உ) அறிந்தீர்கள்.",
          "நெடில் எழுத்துக்கள் 2 மாத்திரை கால அளவு கொண்டவை என்பதைப் பயின்றீர்கள்.",
          "தமிழுக்கும் சமஸ்கிருதத்திற்குமான ஒலி ஒற்றுமைகளை உணர்ந்தீர்கள்.",
        ],
        achievementEn: "You can now read and pronounce the primary Sanskrit vowels!",
        achievementTa: "சமஸ்கிருதத்தின் முதன்மை உயிர் ஒலிகளை நீங்கள் இப்போது வாசித்து உச்சரிக்க முடியும்!",
      },
    },
  ],
};
