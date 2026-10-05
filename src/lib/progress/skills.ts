export type SkillState = "locked" | "in_progress" | "mastered";

export interface SkillNode {
  id: string;
  titleEn: string;
  titleTa: string;
  sanskrit: string;
  level: number;
  category: "sounds" | "sentences" | "vibhaktis" | "sandhi" | "reading";
  prerequisites: string[];
  youCanNowEn: string;
  youCanNowTa: string;
  lessonId?: string;
  defaultState?: SkillState;
}

export const SKILL_GRAPH: SkillNode[] = [
  {
    id: "skill-vowels",
    titleEn: "Vowels & Sounds",
    titleTa: "உயிரெழுத்துக்கள் & ஒலிகள்",
    sanskrit: "स्वर (Svara)",
    level: 0,
    category: "sounds",
    prerequisites: [],
    youCanNowEn: "Recognize and pronounce short and long vowel pairs (a/ā, i/ī, u).",
    youCanNowTa: "குறில் மற்றும் நெடில் உயிர் ஒலி இணைகளை (அ/ஆ, இ/ஈ, உ) அடையாளம் காணவும் உச்சரிக்கவும் முடியும்.",
    lessonId: "lesson-1",
    defaultState: "mastered",
  },
  {
    id: "skill-consonants",
    titleEn: "Consonants & Syllables",
    titleTa: "மெய்யெழுத்துக்கள் & அக்ஷரங்கள்",
    sanskrit: "व्यञ्जन (Vyañjana)",
    level: 0,
    category: "sounds",
    prerequisites: ["skill-vowels"],
    youCanNowEn: "Read and sound out full syllables in Devanāgarī and Tamil script.",
    youCanNowTa: "தேவநாகரி மற்றும் தமிழ் எழுத்து வடிவில் முழு அக்ஷரங்களை வாசிக்க முடியும்.",
    lessonId: "lesson-1",
    defaultState: "mastered",
  },
  {
    id: "skill-karta",
    titleEn: "Nominative Case (Subject)",
    titleTa: "முதல் வேற்றுமை (எழுவாய்)",
    sanskrit: "प्रथमा (कर्ता)",
    level: 1,
    category: "vibhaktis",
    prerequisites: ["skill-consonants"],
    youCanNowEn: "Form subjects with masculine visarga endings (e.g. Rāmaḥ).",
    youCanNowTa: "ஆண்பால் விஸர்க்க ஈற்றுடன் எழுவாய்களை (எ.கா: ராம:) அமைக்க முடியும்.",
    lessonId: "lesson-1",
    defaultState: "mastered",
  },
  {
    id: "skill-present-verbs",
    titleEn: "Present Active Verbs",
    titleTa: "நிகழ்கால வினைகள்",
    sanskrit: "लट् लकारः",
    level: 1,
    category: "sentences",
    prerequisites: ["skill-karta"],
    youCanNowEn: "Construct complete 3-word action sentences (e.g. Rāmaḥ gacchati).",
    youCanNowTa: "முழுமையான மூன்று சொல் சமஸ்கிருத வாக்கியங்களை உருவாக்க முடியும்.",
    lessonId: "lesson-1",
    defaultState: "mastered",
  },
  {
    id: "skill-karma",
    titleEn: "Accusative Case (Object)",
    titleTa: "இரண்டாம் வேற்றுமை (செயப்படுபொருள்)",
    sanskrit: "द्वितीया (कर्म)",
    level: 1,
    category: "vibhaktis",
    prerequisites: ["skill-present-verbs"],
    youCanNowEn: "Express destinations and objects with -m endings (e.g. vanam).",
    youCanNowTa: "சென்றடையும் இடத்தையும் செயப்படுபொருளையும் (-ம் உருபு) குறிப்பிட முடியும்.",
    lessonId: "lesson-1",
    defaultState: "in_progress",
  },
  {
    id: "skill-karana",
    titleEn: "Instrumental Case (By / With)",
    titleTa: "மூன்றாம் வேற்றுமை (ஆல் / உடன்)",
    sanskrit: "तृतीया (करणम्)",
    level: 2,
    category: "vibhaktis",
    prerequisites: ["skill-karma"],
    youCanNowEn: "Express tools, companions, and means using -eṇa (e.g. rāmeṇa saha).",
    youCanNowTa: "கருவிகள் மற்றும் துணையை மூன்றாம் வேற்றுமையில் (-ஏண) கூற முடியும்.",
    lessonId: "lesson-2",
    defaultState: "in_progress",
  },
  {
    id: "skill-anusvara-sandhi",
    titleEn: "Anusvāra Hal Sandhi",
    titleTa: "அநுஸ்வார சந்தி",
    sanskrit: "मोऽनुस्वारः",
    level: 2,
    category: "sandhi",
    prerequisites: ["skill-karma"],
    youCanNowEn: "Apply phonological rules for final -m before consonants.",
    youCanNowTa: "மெய்யெழுத்திற்கு முன் 'ம்' அநுஸ்வாரமாக மாறும் சந்தி விதியைப் பயன்படுத்த முடியும்.",
    lessonId: "lesson-2",
    defaultState: "in_progress",
  },
  {
    id: "skill-guna-sandhi",
    titleEn: "Guṇa Vowel Sandhi",
    titleTa: "குண சந்தி",
    sanskrit: "आद्गुणः",
    level: 2,
    category: "sandhi",
    prerequisites: ["skill-anusvara-sandhi"],
    youCanNowEn: "Join vowels seamlessly into classical compound forms (a + i = e).",
    youCanNowTa: "உயிரெழுத்துக்களை குண விதிகளின்படி இணைத்து வாசிக்க முடியும்.",
    lessonId: "lesson-2",
    defaultState: "locked",
  },
  {
    id: "skill-subhashita-reading",
    titleEn: "Subhāṣitas & Verses",
    titleTa: "சுபாஷித வாசிப்பு",
    sanskrit: "सुभाषितम्",
    level: 3,
    category: "reading",
    prerequisites: ["skill-karana", "skill-guna-sandhi"],
    youCanNowEn: "Read and comprehend classical moral verses word by word.",
    youCanNowTa: "அறநெறி சுபாஷிதங்களை சொல்-சொல்லாகப் படித்துப் புரிந்து கொள்ள முடியும்.",
    defaultState: "locked",
  },
  {
    id: "skill-gita-reading",
    titleEn: "Bhagavad Gītā Verses",
    titleTa: "பகவத் கீதை வாசிப்பு",
    sanskrit: "श्रीमद्भगवद्गीता",
    level: 4,
    category: "reading",
    prerequisites: ["skill-subhashita-reading"],
    youCanNowEn: "Chant and analyze authentic verses of the Bhagavad Gītā with grammar.",
    youCanNowTa: "பகவத் கீதையின் மூல சுலோகங்களை இலக்கணத்துடன் வாசித்து உணர முடியும்.",
    defaultState: "locked",
  },
];

export interface ProgressSummary {
  currentLevel: number;
  levelNameEn: string;
  levelNameTa: string;
  levelProgressPercent: number;
  youCanNowEn: string;
  youCanNowTa: string;
  skills: Array<SkillNode & { state: SkillState }>;
  stats: {
    vocabularyCount: number;
    wordsLearned: number;
    wordsDueForReview: number;
    minutesPracticedWeek: number;
    lessonsCompletedWeek: number;
    daysActiveWeek: number;
    streakDays: number;
    restDayProtected: boolean;
  };
}

export function computeProgressSummary(customSkillStates?: Record<string, SkillState>): ProgressSummary {
  const skillsWithState = SKILL_GRAPH.map((node) => {
    const state = customSkillStates?.[node.id] || node.defaultState || "locked";
    return {
      ...node,
      state,
    };
  });

  const masteredCount = skillsWithState.filter((s) => s.state === "mastered").length;
  const inProgressCount = skillsWithState.filter((s) => s.state === "in_progress").length;
  const total = skillsWithState.length;

  // Level progress percentage
  const levelProgressPercent = Math.min(
    100,
    Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / total) * 100)
  );

  // Active mastered or in-progress highest achievement
  const latestMastered = [...skillsWithState].reverse().find((s) => s.state === "mastered") || skillsWithState[0];

  return {
    currentLevel: 1,
    levelNameEn: "Level 1 — First Sentences & Cases",
    levelNameTa: "நிலை 1 — முதல் வாக்கியங்களும் வேற்றுமைகளும்",
    levelProgressPercent,
    youCanNowEn: latestMastered.youCanNowEn,
    youCanNowTa: latestMastered.youCanNowTa,
    skills: skillsWithState,
    stats: {
      vocabularyCount: 24,
      wordsLearned: 18,
      wordsDueForReview: 4,
      minutesPracticedWeek: 45,
      lessonsCompletedWeek: 3,
      daysActiveWeek: 4,
      streakDays: 4,
      restDayProtected: true,
    },
  };
}
