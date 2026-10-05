export interface DictionaryEntry {
  id: string;
  headword: string; // Canonical Devanāgarī lemma
  iast: string;
  tamil: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "indeclinable" | "pronoun";
  gender?: "masculine" | "feminine" | "neuter";
  stemEnding?: string; // e.g. "-a", "-i", "-u", "-an"
  root?: {
    rootDeva: string;
    rootIast: string;
    rootMeaning: string;
    gana?: number; // Verb class 1 to 10
  };
  meaningsEn: string[];
  meaningsTa: string[];
  etymology?: string;
  source: string; // e.g. "Monier-Williams", "Apte", "Bhāṣā Core"
  relatedLessonId?: string;
  relatedLessonTitle?: string;
  examples: Array<{
    sanskrit: string;
    iast: string;
    tamil: string;
    translationEn: string;
    translationTa: string;
  }>;
  inflections?: Array<{
    form: string;
    iast: string;
    tamil: string;
    analysisEn: string;
    analysisTa: string;
    vibhaktiSlug?: string;
    lakaraSlug?: string;
  }>;
}

export const DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    id: "dict-shiva",
    headword: "शिव",
    iast: "śiva",
    tamil: "ஶிவ",
    partOfSpeech: "noun",
    gender: "masculine",
    stemEnding: "-a",
    meaningsEn: ["Auspicious, propitious, gracious", "Lord Śiva (the Auspicious One)", "Bliss, welfare"],
    meaningsTa: ["மங்களகரமானவர்", "சிவபெருமான்", "அமைதி, பேரின்பம்"],
    etymology: "Root śī (to rest) or śvan (auspicious)",
    source: "Monier-Williams Sanskrit-English Dictionary",
    relatedLessonId: "lesson-1",
    relatedLessonTitle: "Lesson 1: First Sentences",
    examples: [
      {
        sanskrit: "शिवः कल्याणं करोति ।",
        iast: "śivaḥ kalyāṇaṃ karoti |",
        tamil: "ஶிவ: கல்யாணம் கரோதி |",
        translationEn: "Lord Śiva brings about auspicious welfare.",
        translationTa: "சிவபெருமான் மங்களத்தை அருளுகிறார்.",
      },
    ],
    inflections: [
      {
        form: "शिवः",
        iast: "śivaḥ",
        tamil: "ஶிவ:",
        analysisEn: "Masculine singular, Nominative case (kartā)",
        analysisTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை (எழுவாய்)",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "शिवम्",
        iast: "śivam",
        tamil: "ஶிவம்",
        analysisEn: "Masculine singular, Accusative case (karma)",
        analysisTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை (செயப்படுபொருள்)",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
      {
        form: "शिवेन",
        iast: "śivena",
        tamil: "ஶிவேந",
        analysisEn: "Masculine singular, Instrumental case (karaṇa)",
        analysisTa: "ஆண்பால் ஒருமை, மூன்றாம் வேற்றுமை (கருவி / துணை)",
        vibhaktiSlug: "tritiya-vibhakti",
      },
    ],
  },
  {
    id: "dict-rama",
    headword: "राम",
    iast: "rāma",
    tamil: "ராம",
    partOfSpeech: "noun",
    gender: "masculine",
    stemEnding: "-a",
    meaningsEn: ["Pleasing, charming, delightful", "Rāma (hero of Rāmāyaṇa, avatar of Viṣṇu)", "Dark, black"],
    meaningsTa: ["இனியவர், கவர்ச்சியானவர்", "இராமபிரான் (மகாவிஷ்ணுவின் அவதாரம்)", "அழகு"],
    root: {
      rootDeva: "रम्",
      rootIast: "ram",
      rootMeaning: "to delight, rejoice, revel",
      gana: 1,
    },
    etymology: "From root ram (to rejoice) + ghañ affix: ramante tasmin iti rāmaḥ",
    source: "Apte Practical Sanskrit-English Dictionary",
    relatedLessonId: "lesson-1",
    relatedLessonTitle: "Lesson 1: First Sentences",
    examples: [
      {
        sanskrit: "रामः वनं गच्छति ।",
        iast: "rāmaḥ vanaṃ gacchati |",
        tamil: "ராம: வநம் க³ச்ச²தி |",
        translationEn: "Rāma goes to the forest.",
        translationTa: "இராமன் காட்டிற்குச் செல்கிறான்.",
      },
      {
        sanskrit: "रामेण सह लक्ष्मणः अस्ति ।",
        iast: "rāmeṇa saha lakṣmaṇaḥ asti |",
        tamil: "ராமேண ஸஹ லக்ஷ்மண: அஸ்தி |",
        translationEn: "Lakṣmaṇa is together with Rāma.",
        translationTa: "இராமனுடன் இலக்குவன் இருக்கிறான்.",
      },
    ],
    inflections: [
      {
        form: "रामः",
        iast: "rāmaḥ",
        tamil: "ராம:",
        analysisEn: "Masculine singular, Nominative case (kartā)",
        analysisTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை (எழுவாய்)",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "रामम्",
        iast: "rāmam",
        tamil: "ராமம்",
        analysisEn: "Masculine singular, Accusative case (karma)",
        analysisTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை (செயப்படுபொருள்)",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
      {
        form: "रामेण",
        iast: "rāmeṇa",
        tamil: "ராமேண",
        analysisEn: "Masculine singular, Instrumental case (karaṇa)",
        analysisTa: "ஆண்பால் ஒருமை, மூன்றாம் வேற்றுமை (ஆல் / உடன்)",
        vibhaktiSlug: "tritiya-vibhakti",
      },
    ],
  },
  {
    id: "dict-gam",
    headword: "गम्",
    iast: "gam",
    tamil: "க³ம்",
    partOfSpeech: "verb",
    stemEnding: "-m",
    root: {
      rootDeva: "गम्",
      rootIast: "gam",
      rootMeaning: "to go, walk, move, reach",
      gana: 1,
    },
    meaningsEn: ["To go, move, depart", "To approach, reach, attain", "To understand, comprehend"],
    meaningsTa: ["செல்லுதல், நகருதல்", "சென்றடைதல், பெறுதல்", "புரிந்துகொள்ளுதல்"],
    source: "Monier-Williams Sanskrit-English Dictionary",
    relatedLessonId: "lesson-1",
    relatedLessonTitle: "Lesson 1: First Sentences",
    examples: [
      {
        sanskrit: "बालकः गृहं गच्छति ।",
        iast: "bālakaḥ gṛhaṃ gacchati |",
        tamil: "பா³லக: க்³ருஹம் க³ச்ச²தி |",
        translationEn: "The boy goes home.",
        translationTa: "சிறுவன் வீட்டிற்குச் செல்கிறான்.",
      },
    ],
    inflections: [
      {
        form: "गच्छति",
        iast: "gacchati",
        tamil: "க³ச்ச²தி",
        analysisEn: "Present active (laṭ), 3rd person singular (he/she/it goes)",
        analysisTa: "நிகழ்காலம் (லட்), படர்க்கை ஒருமை (செல்கிறான்/செல்கிறது)",
        lakaraSlug: "lat-lakara",
      },
      {
        form: "गच्छतः",
        iast: "gacchataḥ",
        tamil: "க³ச்ச²த:",
        analysisEn: "Present active (laṭ), 3rd person dual (they two go)",
        analysisTa: "நிகழ்காலம் (லட்), படர்க்கை இருமை (இருவர் செல்கின்றனர்)",
        lakaraSlug: "lat-lakara",
      },
      {
        form: "गच्छन्ति",
        iast: "gacchanti",
        tamil: "க³ச்ச²ந்தி",
        analysisEn: "Present active (laṭ), 3rd person plural (they go)",
        analysisTa: "நிகழ்காலம் (லட்), படர்க்கை பன்மை (செல்கிறார்கள்)",
        lakaraSlug: "lat-lakara",
      },
    ],
  },
  {
    id: "dict-vana",
    headword: "वन",
    iast: "vana",
    tamil: "வந",
    partOfSpeech: "noun",
    gender: "neuter",
    stemEnding: "-a",
    meaningsEn: ["Forest, woods, grove", "Abode, residence", "Water (Vedic)"],
    meaningsTa: ["காடு, வனம், சோலை", "வாழிடம்", "நீர்"],
    source: "Apte Practical Sanskrit-English Dictionary",
    relatedLessonId: "lesson-1",
    relatedLessonTitle: "Lesson 1: First Sentences",
    examples: [
      {
        sanskrit: "मृगः वने चरति ।",
        iast: "mṛgaḥ vane carati |",
        tamil: "ம்ருக³: வநே சரதி |",
        translationEn: "The deer roams in the forest.",
        translationTa: "மான் காட்டில் உலவுகிறது.",
      },
    ],
    inflections: [
      {
        form: "वनम्",
        iast: "vanam",
        tamil: "வநம்",
        analysisEn: "Neuter singular, Nominative / Accusative case",
        analysisTa: "நபும்சகலிங்கம் ஒருமை, முதல் / இரண்டாம் வேற்றுமை",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
      {
        form: "वने",
        iast: "vane",
        tamil: "வநே",
        analysisEn: "Neuter singular, Locative case (saptamī / in the forest)",
        analysisTa: "நபும்சகலிங்கம் ஒருமை, ஏழாம் வேற்றுமை (இட வேற்றுமை / காட்டில்)",
      },
    ],
  },
  {
    id: "dict-vidya",
    headword: "विद्या",
    iast: "vidyā",
    tamil: "வித்³யா",
    partOfSpeech: "noun",
    gender: "feminine",
    stemEnding: "-ā",
    root: {
      rootDeva: "विद्",
      rootIast: "vid",
      rootMeaning: "to know, perceive, understand",
      gana: 2,
    },
    meaningsEn: ["Knowledge, learning, scholarship", "Science, art, philosophy", "Spiritual wisdom"],
    meaningsTa: ["கல்வி, அறிவு, மெய்யறிவு", "கலை, சாஸ்திரம்", "ஞானம்"],
    source: "Monier-Williams Sanskrit-English Dictionary",
    relatedLessonId: "lesson-2",
    relatedLessonTitle: "Lesson 2: Sentence Building & Vocabulary",
    examples: [
      {
        sanskrit: "विद्या ददाति विनयम् ।",
        iast: "vidyā dadāti vinayam |",
        tamil: "வித்³யா த³தா³தி விநயம் |",
        translationEn: "Knowledge gives humility.",
        translationTa: "கல்வி பணிவைத் தருகிறது.",
      },
    ],
    inflections: [
      {
        form: "विद्या",
        iast: "vidyā",
        tamil: "வித்³யா",
        analysisEn: "Feminine singular, Nominative case (kartā)",
        analysisTa: "பெண்பால் ஒருமை, முதல் வேற்றுமை (எழுவாய்)",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "विद्याम्",
        iast: "vidyām",
        tamil: "வித்³யாம்",
        analysisEn: "Feminine singular, Accusative case (karma)",
        analysisTa: "பெண்பால் ஒருமை, இரண்டாம் வேற்றுமை",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
    ],
  },
  {
    id: "dict-vinaya",
    headword: "विनय",
    iast: "vinaya",
    tamil: "விநய",
    partOfSpeech: "noun",
    gender: "masculine",
    stemEnding: "-a",
    root: {
      rootDeva: "नी",
      rootIast: "nī",
      rootMeaning: "to lead, guide (vi + nī: to train, educate)",
      gana: 1,
    },
    meaningsEn: ["Humility, modesty, politeness", "Discipline, training, good conduct"],
    meaningsTa: ["பணிவு, அடக்கம், நன்னடத்தை", "ஒழுக்கம், கட்டுப்பாடு"],
    source: "Apte Practical Sanskrit-English Dictionary",
    relatedLessonId: "lesson-2",
    relatedLessonTitle: "Lesson 2: Sentence Building & Vocabulary",
    examples: [
      {
        sanskrit: "विनयेन सर्वं लभते ।",
        iast: "vinayena sarvaṃ labhate |",
        tamil: "விநயேந ஸர்வம் லப⁴தே |",
        translationEn: "Through humility, one gains everything.",
        translationTa: "பணிவினால் எல்லாவற்றையும் பெறலாம்.",
      },
    ],
    inflections: [
      {
        form: "विनयः",
        iast: "vinayaḥ",
        tamil: "விநய:",
        analysisEn: "Masculine singular, Nominative case",
        analysisTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "विनयम्",
        iast: "vinayam",
        tamil: "விநயம்",
        analysisEn: "Masculine singular, Accusative case",
        analysisTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
    ],
  },
  {
    id: "dict-guru",
    headword: "गुरु",
    iast: "guru",
    tamil: "கு³ரு",
    partOfSpeech: "noun",
    gender: "masculine",
    stemEnding: "-u",
    meaningsEn: ["Spiritual teacher, master, preceptor", "Heavy, weighty, venerable", "Elder"],
    meaningsTa: ["ஆசிரியர், குருநாதர், வழிகாட்டி", "கனமான, போற்றுதலுக்குரிய", "முதியவர்"],
    source: "Monier-Williams Sanskrit-English Dictionary",
    relatedLessonId: "lesson-1",
    relatedLessonTitle: "Lesson 1: First Sentences",
    examples: [
      {
        sanskrit: "गुरुः ज्ञानं दिशति ।",
        iast: "guruḥ jñānaṃ diśati |",
        tamil: "கு³ரு: ஜ்ஞாநம் தி³ஶதி |",
        translationEn: "The Guru points the way to wisdom.",
        translationTa: "குரு ஞானத்தை வழிகாட்டுகிறார்.",
      },
    ],
    inflections: [
      {
        form: "गुरुः",
        iast: "guruḥ",
        tamil: "கு³ரு:",
        analysisEn: "Masculine singular, Nominative case",
        analysisTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "गुरुम्",
        iast: "gurum",
        tamil: "கு³ரும்",
        analysisEn: "Masculine singular, Accusative case",
        analysisTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
    ],
  },
  {
    id: "dict-dharma",
    headword: "धर्म",
    iast: "dharma",
    tamil: "த⁴ர்ம",
    partOfSpeech: "noun",
    gender: "masculine",
    stemEnding: "-a",
    root: {
      rootDeva: "धृ",
      rootIast: "dhṛ",
      rootMeaning: "to hold, maintain, sustain",
      gana: 1,
    },
    meaningsEn: ["Righteousness, duty, moral cosmic order", "Virtue, justice, law", "Essential nature of a thing"],
    meaningsTa: ["அறம், தர்மம், கடமை", "நீதி, ஒழுக்கம், பண்பு", "இயற்கையான சுபாவம்"],
    source: "Apte Practical Sanskrit-English Dictionary",
    relatedLessonId: "lesson-2",
    relatedLessonTitle: "Lesson 2: Sentence Building & Vocabulary",
    examples: [
      {
        sanskrit: "धर्मो रक्षति रक्षितः ।",
        iast: "dharmo rakṣati rakṣitaḥ |",
        tamil: "த⁴ர்மோ ரக்ஷதி ரக்ஷித: |",
        translationEn: "Dharma protects those who uphold dharma.",
        translationTa: "காக்கப்பட்ட அறம் நம்மைக் காக்கும்.",
      },
    ],
    inflections: [
      {
        form: "धर्मः",
        iast: "dharmaḥ",
        tamil: "த⁴ர்ம:",
        analysisEn: "Masculine singular, Nominative case",
        analysisTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை",
        vibhaktiSlug: "prathama-vibhakti",
      },
      {
        form: "धर्मम्",
        iast: "dharmam",
        tamil: "த⁴ர்மம்",
        analysisEn: "Masculine singular, Accusative case",
        analysisTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை",
        vibhaktiSlug: "dvitiya-vibhakti",
      },
    ],
  },
];
