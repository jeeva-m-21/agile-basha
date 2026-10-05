export interface SeedLevel {
  id: string;
  orderNum: number;
  titleEn: string;
  titleTa: string;
  outcomeEn: string;
  outcomeTa: string;
  units: SeedUnit[];
}

export interface SeedUnit {
  id: string;
  orderNum: number;
  titleEn: string;
  titleTa: string;
  lessons: SeedLesson[];
}

export interface SeedLesson {
  id: string;
  orderNum: number;
  titleEn: string;
  titleTa: string;
  goalEn: string;
  goalTa: string;
  estMinutes: number;
}

export const curriculumLevels: SeedLevel[] = [
  {
    id: "level-0",
    orderNum: 0,
    titleEn: "Level 0 — Sounds and Script",
    titleTa: "நிலை 0 — ஒலிகளும் எழுத்துக்களும்",
    outcomeEn: "You will be able to read and pronounce every Devanāgarī letter and simple syllables.",
    outcomeTa: "ஒவ்வொரு தேவநாகரி எழுத்தையும் எளிய அசைச்சொற்களையும் நீங்கள் தெளிவாக வாசிக்க முடியும்.",
    units: [
      {
        id: "unit-0-1",
        orderNum: 1,
        titleEn: "The Vowels (Svara)",
        titleTa: "உயிர் எழுத்துக்கள் (ஸ்வரங்கள்)",
        lessons: [
          {
            id: "level-0-lesson-1",
            orderNum: 1,
            titleEn: "First Five Sounds (a, ā, i, ī, u)",
            titleTa: "முதல் ஐந்து ஒலிகள் (அ, ஆ, இ, ஈ, உ)",
            goalEn: "Recognize and pronounce short and long vowel pairs (a/ā, i/ī, u).",
            goalTa: "குறில், நெடில் உயிர் ஒலி இணைகளை அடையாளம் கண்டு உச்சரிக்கவும்.",
            estMinutes: 10,
          },
          {
            id: "level-0-lesson-2",
            orderNum: 2,
            titleEn: "Vowel Length and Special Vowels (ū, ṛ, e, o)",
            titleTa: "நெடில் மற்றும் சிறப்பு உயிர்கள் (ஊ, ரு, ஏ, ஓ)",
            goalEn: "Master the vocalic ṛ and diphthongs with proper mouth placement.",
            goalTa: "ரு (ṛ) போன்ற சிறப்பு ஒலிகளையும் கூட்டொலிகளையும் பயிலவும்.",
            estMinutes: 12,
          },
          {
            id: "level-0-lesson-3",
            orderNum: 3,
            titleEn: "Anusvāra & Visarga (aṃ, aḥ)",
            titleTa: "அனுஸ்வாரம் மற்றும் விஸர்கம் (அம், அஃ)",
            goalEn: "Pronounce pure nasal sound (aṃ) and gentle breath release (aḥ).",
            goalTa: "மூக்கொலி (அம்) மற்றும் மூச்சொலி (அஃ) விதிகளை அறியவும்.",
            estMinutes: 10,
          },
        ],
      },
      {
        id: "unit-0-2",
        orderNum: 2,
        titleEn: "Consonant Groups (Varga)",
        titleTa: "மெய்யெழுத்து வரிசைகள் (வர்க்கங்கள்)",
        lessons: [
          {
            id: "level-0-lesson-4",
            orderNum: 4,
            titleEn: "Velar & Palatal Consonants (ka, ca)",
            titleTa: "க-வர்க்கம் மற்றும் ச-வர்க்கம்",
            goalEn: "Distinguish unvoiced, aspirated, and voiced stops (ka, kha, ga, gha).",
            goalTa: "ஒலிப்பு மற்றும் பெருமூச்சொலி மெய்களை வேறுபடுத்தி அறியவும்.",
            estMinutes: 12,
          },
        ],
      },
    ],
  },
  {
    id: "level-1",
    orderNum: 1,
    titleEn: "Level 1 — First Words and Sentences",
    titleTa: "நிலை 1 — முதல் சொற்களும் வாக்கியங்களும்",
    outcomeEn: "You will be able to understand and say simple sentences like 'Rāma goes to the forest'.",
    outcomeTa: "'ராமன் காட்டிற்குச் செல்கிறான்' போன்ற எளிய வாக்கியங்களை நீங்கள் புரிந்துகொண்டு பேச முடியும்.",
    units: [],
  },
  {
    id: "level-2",
    orderNum: 2,
    titleEn: "Level 2 — Cases (Vibhakti)",
    titleTa: "நிலை 2 — வேற்றுமைகள் (விபக்தி)",
    outcomeEn: "You will be able to tell who does what, to whom, with what, and where from word endings.",
    outcomeTa: "சொல் ஈறுகளிலிருந்து யார் எதை யாருக்கு எங்கு செய்கிறார் என்பதை அறிவீர்கள்.",
    units: [],
  },
];
