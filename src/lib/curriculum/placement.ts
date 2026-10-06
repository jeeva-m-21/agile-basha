export interface PlacementOption {
  id: string;
  textEn: string;
  textTa: string;
  sanskritOption?: string;
  isCorrect: boolean;
}

export interface PlacementQuestion {
  id: string;
  band: 0 | 1 | 2 | 3 | 4; // 0: Script, 1: Vocab, 2: Simple Verbs, 3: Cases, 4: Complex Sentences
  topicEn: string;
  topicTa: string;
  skillId: string;
  promptEn: string;
  promptTa: string;
  sanskrit?: string;
  helper?: string;
  audioText?: string;
  options: PlacementOption[];
  explanationEn: string;
  explanationTa: string;
}

export interface PlacementEvaluation {
  score: number;
  totalQuestions: number;
  percentage: number;
  recommendedLevel: "level-0" | "level-1" | "level-2";
  recommendedLesson: string;
  levelNameEn: string;
  levelNameTa: string;
  masteredSkills: string[];
  reviewSkills: string[];
  summaryEn: string;
  summaryTa: string;
}

export const placementQuestions: PlacementQuestion[] = [
  // Band 0: Script & Sounds
  {
    id: "pq-0-1",
    band: 0,
    topicEn: "Devanāgarī Vowels",
    topicTa: "தேவநாகரி உயிர்கள்",
    skillId: "devanagari-vowels",
    promptEn: "Which vowel sound corresponds to the letter 'आ'?",
    promptTa: "'आ' என்ற எழுத்துக்குரிய ஒலி எது?",
    sanskrit: "आ",
    helper: "ā",
    audioText: "आ",
    options: [
      { id: "opt-1", textEn: "Short 'a' (like 'up')", textTa: "குறில் 'அ'", isCorrect: false },
      { id: "opt-2", textEn: "Long 'ā' (like 'father')", textTa: "நெடில் 'ஆ'", isCorrect: true },
      { id: "opt-3", textEn: "Short 'i' (like 'it')", textTa: "குறில் 'இ'", isCorrect: false },
      { id: "opt-4", textEn: "Vocalic 'ṛ'", textTa: "ரு (ṛ)", isCorrect: false },
    ],
    explanationEn: "'आ' is the long open vowel 'ā', held twice as long as 'अ'.",
    explanationTa: "'आ' என்பது 'ஆ' என்ற நெடில் உயிர் எழுத்தாகும்.",
  },
  {
    id: "pq-0-2",
    band: 0,
    topicEn: "Consonants & Aspirates",
    topicTa: "மெய்யெழுத்துக்கள் & பெருமூச்சொலி",
    skillId: "consonant-aspirates",
    promptEn: "Which of these is the aspirated stop 'pha' (फ)?",
    promptTa: "இவற்றில் பெருமூச்சொலி 'ப2' (pha - फ) எது?",
    sanskrit: "फ",
    helper: "pha",
    audioText: "फ",
    options: [
      { id: "opt-1", textEn: "pa (प)", textTa: "ப (pa)", sanskritOption: "प", isCorrect: false },
      { id: "opt-2", textEn: "pha (फ)", textTa: "ப2 (pha)", sanskritOption: "फ", isCorrect: true },
      { id: "opt-3", textEn: "ba (ब)", textTa: "ப3 (ba)", sanskritOption: "ब", isCorrect: false },
      { id: "opt-4", textEn: "bha (भ)", textTa: "ப4 (bha)", sanskritOption: "भ", isCorrect: false },
    ],
    explanationEn: "'फ' represents the aspirated unvoiced bilabial consonant 'pha'.",
    explanationTa: "'फ' என்பது காற்றழுத்தத்துடன் கூடிய 'pha' மெய்யெழுத்தாகும்.",
  },

  // Band 1: Core Vocabulary
  {
    id: "pq-1-1",
    band: 1,
    topicEn: "Basic Vocabulary",
    topicTa: "அடிப்படைச் சொற்கள்",
    skillId: "basic-vocabulary",
    promptEn: "What is the meaning of 'फलम्' (phalam)?",
    promptTa: "'फलम्' (phalam) என்ற சொல்லின் பொருள் என்ன?",
    sanskrit: "फलम्",
    helper: "phalam",
    audioText: "फलम्",
    options: [
      { id: "opt-1", textEn: "Water", textTa: "தண்ணீர்", isCorrect: false },
      { id: "opt-2", textEn: "Fruit", textTa: "பழம்", isCorrect: true },
      { id: "opt-3", textEn: "Forest", textTa: "காடு", isCorrect: false },
      { id: "opt-4", textEn: "Book", textTa: "புத்தகம்", isCorrect: false },
    ],
    explanationEn: "'फलम्' (phalam, neuter) means 'fruit'.",
    explanationTa: "'फलम्' (பலம்) என்றால் பழம் என்று பொருள்.",
  },
  {
    id: "pq-1-2",
    band: 1,
    topicEn: "Everyday Nouns",
    topicTa: "அன்றாடப் பெயர்ச்சொற்கள்",
    skillId: "basic-vocabulary",
    promptEn: "Which Sanskrit word means 'friend'?",
    promptTa: "'நண்பன்' என்ற பொருள் தரும் சமஸ்கிருதச் சொல் எது?",
    sanskrit: "मित्रम्",
    helper: "mitram",
    audioText: "मित्रम्",
    options: [
      { id: "opt-1", textEn: "mitram (मित्रम्)", textTa: "மித்ரம் (मित्रम्)", sanskritOption: "मित्रम्", isCorrect: true },
      { id: "opt-2", textEn: "gajaḥ (गजः)", textTa: "கஜஃ (गजः)", sanskritOption: "गजः", isCorrect: false },
      { id: "opt-3", textEn: "annam (अन्नम्)", textTa: "அன்னம் (अन्नम्)", sanskritOption: "अन्नम्", isCorrect: false },
      { id: "opt-4", textEn: "vāpī (वापी)", textTa: "வாபீ (वापी)", sanskritOption: "वापी", isCorrect: false },
    ],
    explanationEn: "'मित्रम्' (mitram) means 'friend' (traditionally neuter).",
    explanationTa: "'मित्रम्' என்றால் நண்பன் ஆகும்.",
  },

  // Band 2: Simple Verbs & Agreement
  {
    id: "pq-2-1",
    band: 2,
    topicEn: "Present Tense Verbs",
    topicTa: "நிகழ்கால வினைகள்",
    skillId: "verb-agreement",
    promptEn: "Choose the correct verb for: 'बालकः ______' (The boy reads).",
    promptTa: "'बालकः ______' (சிறுவன் படிக்கிறான்) என்பதற்குரிய சரியான வினைச்சொல் எது?",
    sanskrit: "बालकः पठति",
    helper: "bālakaḥ paṭhati",
    audioText: "बालकः पठति",
    options: [
      { id: "opt-1", textEn: "paṭhati (पठति) [reads - singular]", textTa: "படிக்கிறான் (ப2ட2தி)", sanskritOption: "पठति", isCorrect: true },
      { id: "opt-2", textEn: "paṭhanti (पठन्ति) [they read - plural]", textTa: "படிக்கிறார்கள் (ப2ட2ந்தி)", sanskritOption: "पठन्ति", isCorrect: false },
      { id: "opt-3", textEn: "paṭhasi (पठसि) [you read]", textTa: "படிக்கிறாய் (ப2ட2ஸி)", sanskritOption: "पठसि", isCorrect: false },
      { id: "opt-4", textEn: "paṭhāmi (पठामि) [I read]", textTa: "படிக்கிறேன் (ப2டா2மி)", sanskritOption: "पठामि", isCorrect: false },
    ],
    explanationEn: "'बालकः' is 3rd-person singular, so it takes the '-ti' verb ending: 'पठति'.",
    explanationTa: "'बालकः' படர்க்கை ஒருமை என்பதால் '-தி' (पठति) என்ற விகுதியைப் பெறுகிறது.",
  },
  {
    id: "pq-2-2",
    band: 2,
    topicEn: "Action Verbs",
    topicTa: "செயல் வினைகள்",
    skillId: "verb-agreement",
    promptEn: "What does 'गजः मन्दं चलति' mean?",
    promptTa: "'गजः मन्दं चलति' என்பதன் பொருள் யாது?",
    sanskrit: "गजः मन्दं चलति",
    helper: "gajaḥ mandaṁ calati",
    audioText: "गजः मन्दं चलति",
    options: [
      { id: "opt-1", textEn: "The horse runs fast", textTa: "குதிரை வேகமாக ஓடுகிறது", isCorrect: false },
      { id: "opt-2", textEn: "The elephant walks slowly", textTa: "யானை மெதுவாக நடக்கிறது", isCorrect: true },
      { id: "opt-3", textEn: "The king drinks water", textTa: "அரசன் தண்ணீர் குடிக்கிறான்", isCorrect: false },
      { id: "opt-4", textEn: "The boy sleeps peacefully", textTa: "சிறுவன் நிம்மதியாக தூங்குகிறான்", isCorrect: false },
    ],
    explanationEn: "'गजः' = elephant, 'मन्दम्' = slowly, 'चलति' = walks.",
    explanationTa: "'गजः' = யானை, 'मन्दम्' = மெதுவாக, 'चलति' = நடக்கிறது.",
  },

  // Band 3: Cases (Vibhakti)
  {
    id: "pq-3-1",
    band: 3,
    topicEn: "Accusative Case (Dvitīyā)",
    topicTa: "இரண்டாம் வேற்றுமை (த்விதீயா)",
    skillId: "accusative-case",
    promptEn: "In 'रामः वनं गच्छति', which word is in the accusative (object) case?",
    promptTa: "'रामः वनं गच्छति' என்பதில் இரண்டாம் வேற்றுமையில் (செயப்படுபொருள்) உள்ள சொல் எது?",
    sanskrit: "रामः वनं गच्छति",
    helper: "rāmaḥ vanaṁ gacchati",
    audioText: "रामः वनं गच्छति",
    options: [
      { id: "opt-1", textEn: "रामः (rāmaḥ - Subject)", textTa: "ராமஃ (எழுவாய்)", sanskritOption: "रामः", isCorrect: false },
      { id: "opt-2", textEn: "वनम् / वनं (vanaṁ - Forest/Destination)", textTa: "வனம் (காட்டிற்கு)", sanskritOption: "वनं", isCorrect: true },
      { id: "opt-3", textEn: "गच्छति (gacchati - Verb)", textTa: "கச்ச2தி (பயனிலை)", sanskritOption: "गच्छति", isCorrect: false },
      { id: "opt-4", textEn: "None of the above", textTa: "எதுவுமில்லை", isCorrect: false },
    ],
    explanationEn: "'वनम्' (marked with anusvāra 'ं') is the accusative direct object/destination.",
    explanationTa: "'वनम्' (வனம்) என்பது இலக்கு/செயப்படுபொருளைக் குறிக்கும் இரண்டாம் வேற்றுமைச் சொல்லாகும்.",
  },
  {
    id: "pq-3-2",
    band: 3,
    topicEn: "Case Identification",
    topicTa: "வேற்றுமை உருபுகள்",
    skillId: "cases-vibhakti",
    promptEn: "What case ending does 'हस्तेन' (hastena - with the hand) have?",
    promptTa: "'हस्तेन' (கையினால்) என்ற சொல் எந்த வேற்றுமையில் உள்ளது?",
    sanskrit: "हस्तेन",
    helper: "hastena",
    audioText: "हस्तेन",
    options: [
      { id: "opt-1", textEn: "Nominative (1st case)", textTa: "முதல் வேற்றுமை (எழுவாய்)", isCorrect: false },
      { id: "opt-2", textEn: "Instrumental (3rd case / Tṛtīyā)", textTa: "மூன்றாம் வேற்றுமை (கருவி / த்ருதீயா)", isCorrect: true },
      { id: "opt-3", textEn: "Genitive (6th case / Ṣaṣṭhī)", textTa: "ஆறாம் வேற்றுமை (உடைமை)", isCorrect: false },
      { id: "opt-4", textEn: "Locative (7th case / Saptamī)", textTa: "ஏழாம் வேற்றுமை (இடம்)", isCorrect: false },
    ],
    explanationEn: "'-ena' (-एन) is the instrumental singular masculine ending, expressing 'by/with'.",
    explanationTa: "'-ena' என்பது மூன்றாம் வேற்றுமை உருபாகும் ('கையினால்').",
  },

  // Band 4: Sentence Translation & Sandhi
  {
    id: "pq-4-1",
    band: 4,
    topicEn: "Sandhi & Verse Translation",
    topicTa: "சந்தி & தொடர் வாசிப்பு",
    skillId: "complex-syntax",
    promptEn: "Translate the classical statement: 'सत्यं वद धर्मं चर' (satyaṁ vada dharmaṁ cara).",
    promptTa: "'सत्यं वद धर्मं चर' என்பதன் பொருள் யாது?",
    sanskrit: "सत्यं वद धर्मं चर",
    helper: "satyaṁ vada dharmaṁ cara",
    audioText: "सत्यं वद धर्मं चर",
    options: [
      { id: "opt-1", textEn: "Speak truth, practice righteousness", textTa: "உண்மையை பேசு, அறத்தைக் கடைப்பிடி", isCorrect: true },
      { id: "opt-2", textEn: "The king walks along the river", textTa: "அரசன் நதிக்கரையில் நடக்கிறான்", isCorrect: false },
      { id: "opt-3", textEn: "Fruits fall from the high tree", textTa: "உயர்ந்த மரத்திலிருந்து பழங்கள் விழுகின்றன", isCorrect: false },
      { id: "opt-4", textEn: "Study grammar every morning", textTa: "தினமும் காலையில் இலக்கணம் படி", isCorrect: false },
    ],
    explanationEn: "From the Taittirīya Upaniṣad: 'satyam vada' (Speak the truth), 'dharmam cara' (Practice virtue/dharma).",
    explanationTa: "தைத்திரீய உபநிடத வாக்கு: 'சத்தியம் பேசு, தர்மத்தைக் கடைப்பிடி'.",
  },
];

export function evaluatePlacementQuiz(answers: Record<string, string>): PlacementEvaluation {
  let score = 0;
  const totalQuestions = placementQuestions.length;
  const masteredSkills: string[] = [];
  const reviewSkills: string[] = [];

  for (const q of placementQuestions) {
    const selectedOptId = answers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    const isCorrect = selectedOptId === correctOpt?.id;

    if (isCorrect) {
      score += 1;
      if (!masteredSkills.includes(q.topicEn)) {
        masteredSkills.push(q.topicEn);
      }
    } else {
      if (!reviewSkills.includes(q.topicEn)) {
        reviewSkills.push(q.topicEn);
      }
    }
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  // Calibrate recommendation based on score:
  // 0 - 3: Level 0 (Sounds & Script)
  // 4 - 6: Level 1 (First Words & Sentences)
  // 7 - 9: Level 2 (Cases / Vibhakti)
  let recommendedLevel: "level-0" | "level-1" | "level-2" = "level-0";
  let recommendedLesson = "level-0-lesson-1";
  let levelNameEn = "Level 0 — Sounds and Script";
  let levelNameTa = "நிலை 0 — ஒலிகளும் எழுத்துக்களும்";
  let summaryEn = "";
  let summaryTa = "";

  if (score >= 7) {
    recommendedLevel = "level-2";
    recommendedLesson = "level-1-lesson-2";
    levelNameEn = "Level 2 — Cases & Sentence Mastery";
    levelNameTa = "நிலை 2 — வேற்றுமைகளும் வாக்கிய அமைப்பும்";
    summaryEn = "Excellent! You already have solid literacy in Devanāgarī, verbs, and core cases. We suggest starting directly at Level 2.";
    summaryTa = "அற்புதம்! உங்களுக்கு தேவநாகரி எழுத்துக்களும் அடிப்படை வினைகளும் நன்கு அறிமுகமாகியுள்ளன. நிலை 2-ல் தொடங்கப் பரிந்துரைக்கிறோம்.";
  } else if (score >= 4) {
    recommendedLevel = "level-1";
    recommendedLesson = "level-1-lesson-1";
    levelNameEn = "Level 1 — First Words and Sentences";
    levelNameTa = "நிலை 1 — முதல் சொற்களும் வாக்கியங்களும்";
    summaryEn = "Great job! You recognize sounds and essential vocabulary. We recommend jumping directly to Level 1, Lesson 1.";
    summaryTa = "நன்று! உங்களுக்கு ஒலிகளும் சில சொற்களும் தெரிகின்றன. நீங்கள் நிலை 1, பாடம் 1-லிருந்து தொடங்கலாம்.";
  } else {
    recommendedLevel = "level-0";
    recommendedLesson = "level-0-lesson-1";
    levelNameEn = "Level 0 — Sounds and Script";
    levelNameTa = "நிலை 0 — ஒலிகளும் எழுத்துக்களும்";
    summaryEn = "Welcome! Starting with Level 0 will establish pristine pronunciation, mouth positions, and effortless Devanāgarī reading.";
    summaryTa = "வரவேற்கிறோம்! நிலை 0-ல் தொடங்குவது தேவநாகரி வாசிப்பையும் தெளிவான உச்சரிப்பையும் உறுதிசெய்யும்.";
  }

  return {
    score,
    totalQuestions,
    percentage,
    recommendedLevel,
    recommendedLesson,
    levelNameEn,
    levelNameTa,
    masteredSkills,
    reviewSkills,
    summaryEn,
    summaryTa,
  };
}
