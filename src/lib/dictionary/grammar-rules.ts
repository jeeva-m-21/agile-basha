export interface GrammarExample {
  sanskrit: string;
  iast: string;
  tamil: string;
  translationEn: string;
  translationTa: string;
  highlightToken?: string;
}

export interface GrammarRuleItem {
  id: string;
  slug: string;
  titleEn: string;
  titleTa: string;
  sanskritTerm: string;
  sanskritIast: string;
  category: "vibhakti" | "sandhi" | "lakara" | "samasa" | "general";
  sutra?: string;
  sutraTranslationEn?: string;
  sutraTranslationTa?: string;
  ruleEn: string;
  ruleTa: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  examples: GrammarExample[];
  relatedLessonId?: string;
}

export const SEEDED_GRAMMAR_RULES: GrammarRuleItem[] = [
  {
    id: "rule-prathama",
    slug: "prathama-vibhakti",
    titleEn: "Nominative Case (Prathamā Vibhakti / Subject)",
    titleTa: "முதல் வேற்றுமை (எழுவாய் / கர்தா)",
    sanskritTerm: "प्रथमा विभक्तिः (कर्ता)",
    sanskritIast: "prathamā vibhaktiḥ (kartā)",
    category: "vibhakti",
    sutra: "प्रातिपदिकार्थलिङ्गपरिमाणवचनमात्रे प्रथमा (२.३.४६)",
    sutraTranslationEn: "The nominative case denotes the nominal stem meaning, gender, measure, and number alone (or the independent agent).",
    sutraTranslationTa: "சொல்லின் அடிப்படைப் பொருள், பால், அளவு, எண் ஆகியவற்றை அல்லது முதன்மை எழுவாயைக் குறிக்க முதல் வேற்றுமை பயன்படுகிறது.",
    ruleEn: "The nominative case marks the subject or agent of an active sentence. For a-stem masculine nouns (like Rāma, deva), the singular adds visarga (-ḥ).",
    ruleTa: "ஒரு வாக்கியத்தில் செயலைச் செய்யும் எழுவாயைக் (கர்தா) குறிக்க முதல் வேற்றுமை பயன்படுகிறது. அகராந்த ஆண்பால் சொற்களில் ஒருமையில் விஸர்க்கம் (-:) சேரும்.",
    tableData: {
      headers: ["வகை (Type)", "ஒருமை (Singular)", "இருமை (Dual)", "பன்மை (Plural)"],
      rows: [
        ["Masculine (राम)", "रामः (rāmaḥ)", "रामौ (rāmau)", "रामाः (rāmāḥ)"],
        ["Feminine (विद्या)", "विद्या (vidyā)", "विद्ये (vidye)", "विद्याः (vidyāḥ)"],
        ["Neuter (फलम्)", "फलम् (phalam)", "फले (phale)", "फलानि (phalāni)"],
      ],
    },
    examples: [
      {
        sanskrit: "रामः वनं गच्छति ।",
        iast: "rāmaḥ vanaṃ gacchati |",
        tamil: "ராம: வநம் க³ச்ச²தி |",
        translationEn: "Rāma goes to the forest.",
        translationTa: "இராமன் காட்டிற்குச் செல்கிறான்.",
        highlightToken: "रामः",
      },
      {
        sanskrit: "बालकः पुस्तकं पठति ।",
        iast: "bālakaḥ pustakaṃ paṭhati |",
        tamil: "பா³லக: புஸ்தகம் பட²தி |",
        translationEn: "The boy reads a book.",
        translationTa: "சிறுவன் புத்தகத்தைப் படிக்கிறான்.",
        highlightToken: "बालकः",
      },
      {
        sanskrit: "विद्या ददाति विनयम् ।",
        iast: "vidyā dadāti vinayam |",
        tamil: "வித்³யா த³தா³தி விநயம் |",
        translationEn: "Knowledge bestows humility.",
        translationTa: "கல்வி பணிவைத் தருகிறது.",
        highlightToken: "विद्या",
      },
    ],
    relatedLessonId: "lesson-1",
  },
  {
    id: "rule-dvitiya",
    slug: "dvitiya-vibhakti",
    titleEn: "Accusative Case (Dvitīyā Vibhakti / Object)",
    titleTa: "இரண்டாம் வேற்றுமை (செயப்படுபொருள் / கர்மா)",
    sanskritTerm: "द्वितीया विभक्तिः (कर्म)",
    sanskritIast: "dvitīyā vibhaktiḥ (karma)",
    category: "vibhakti",
    sutra: "कर्मणि द्वितीया (२.३.२)",
    sutraTranslationEn: "The second (accusative) case is used to denote the direct object (karma) or destination of motion.",
    sutraTranslationTa: "வினையின் பயனை அடையும் செயப்படுபொருளை (ஐ உருபு) அல்லது சென்றடையும் இடத்தை உணர்த்த இரண்டாம் வேற்றுமை பயன்படுகிறது.",
    ruleEn: "The accusative case marks the direct receiver of an action or the destination of motion. Masculine and neuter singular forms take -m (or anusvāra before consonants).",
    ruleTa: "செயலின் நேரடி இலக்கு அல்லது சென்றடையும் இடத்தைக் குறிக்க இரண்டாம் வேற்றுமை பயன்படுகிறது. சொற்களின் இறுதியில் 'ம்' (-m) அல்லது அநுஸ்வாரம் சேரும்.",
    tableData: {
      headers: ["வகை (Type)", "ஒருமை (Singular)", "இருமை (Dual)", "பன்மை (Plural)"],
      rows: [
        ["Masculine (राम)", "रामम् (rāmam)", "रामौ (rāmau)", "रामान् (rāmān)"],
        ["Neuter (वन)", "वनम् (vanam)", "वने (vane)", "वनानि (vanāni)"],
      ],
    },
    examples: [
      {
        sanskrit: "रामः वनं गच्छति ।",
        iast: "rāmaḥ vanaṃ gacchati |",
        tamil: "ராம: வநம் க³ச்ச²தி |",
        translationEn: "Rāma goes to the forest (destination: vanam).",
        translationTa: "இராமன் காட்டிற்குச் (வனம் + ஐ) செல்கிறான்.",
        highlightToken: "वनं",
      },
      {
        sanskrit: "सः फलं खादति ।",
        iast: "saḥ phalaṃ khādati |",
        tamil: "ஸ: ப²லம் கா²த³தி |",
        translationEn: "He eats a fruit.",
        translationTa: "அவன் பழத்தை உண்கிறான்.",
        highlightToken: "फलं",
      },
    ],
    relatedLessonId: "lesson-1",
  },
  {
    id: "rule-tritiya",
    slug: "tritiya-vibhakti",
    titleEn: "Instrumental Case (Tṛtīyā Vibhakti / By, With)",
    titleTa: "மூன்றாம் வேற்றுமை (ஆல், உடன் / கரணம்)",
    sanskritTerm: "तृतीया विभक्तिः (करणम्)",
    sanskritIast: "tṛtīyā vibhaktiḥ (karaṇam)",
    category: "vibhakti",
    sutra: "कर्तृकरणयोस्तृतीया (२.३.१८)",
    sutraTranslationEn: "The third (instrumental) case is employed to denote the instrument of an action, or the agent in a passive construction.",
    sutraTranslationTa: "செயல் நிகழ உதவும் கருவி அல்லது துணை (ஆல், உடன், கொண்டு) என்பதை உணர்த்த மூன்றாம் வேற்றுமை பயன்படுகிறது.",
    ruleEn: "The instrumental case denotes the instrument with which an action is performed, accompaniment (with), or means. For masculine a-stems, singular takes -ena (or -eṇa after r/ṣ).",
    ruleTa: "ஒரு செயலைச் செய்யப் பயன்படுத்தப்படும் கருவி (ஆல் / கொண்டு) அல்லது துணையை (உடன்) குறிக்க மூன்றாம் வேற்றுமை பயன்படுகிறது. அகராந்த ஆண்பால் சொற்களில் '-ஏந' அல்லது '-ஏண' சேரும்.",
    tableData: {
      headers: ["வகை (Type)", "ஒருமை (Singular)", "இருமை (Dual)", "பன்மை (Plural)"],
      rows: [
        ["Masculine (राम)", "रामेण (rāmeṇa)", "रामाभ्याम् (rāmābhyām)", "रामैः (rāmaiḥ)"],
        ["Masculine (गज)", "गजेन (gajena)", "गजाभ्याम् (gajābhyām)", "गजैः (gajaiḥ)"],
      ],
    },
    examples: [
      {
        sanskrit: "रामः बाणेन हन्ति ।",
        iast: "rāmaḥ bāṇena hanti |",
        tamil: "ராம: பா³ணேந ஹந்தி |",
        translationEn: "Rāma strikes with an arrow.",
        translationTa: "இராமன் அம்பினால் தாக்குகிறான்.",
        highlightToken: "बाणेन",
      },
      {
        sanskrit: "मित्रैः सह गच्छति ।",
        iast: "mitraiḥ saha gacchati |",
        tamil: "மித்ரை: ஸஹ க³ச்ச²தி |",
        translationEn: "Goes together with friends.",
        translationTa: "நண்பர்களுடன் கூடிச் செல்கிறான்.",
        highlightToken: "मित्रैः",
      },
    ],
    relatedLessonId: "lesson-2",
  },
  {
    id: "rule-lat-lakara",
    slug: "lat-lakara",
    titleEn: "Present Tense (Laṭ Lakāra)",
    titleTa: "நிகழ்கால வினை (லட் लकार)",
    sanskritTerm: "लट् लकारः (वर्तमान)",
    sanskritIast: "laṭ lakāraḥ (vartamāna)",
    category: "lakara",
    sutra: "वर्तमाने लट् (३.२.१२३)",
    sutraTranslationEn: "The affix 'laṭ' (present tense) occurs after a verbal root when denoting action happening in the present time.",
    sutraTranslationTa: "தற்போது நிகழ்ந்து கொண்டிருக்கும் செயலைக் குறிக்க தாதுவின் பின் 'லட்' (நிகழ்கால விகுதிகள்) வரும்.",
    ruleEn: "Used for present actions. Parasmaipada endings for 3rd person (prathama puruṣa) are: -ti (singular), -taḥ (dual), -anti (plural).",
    ruleTa: "நிகழ்கால செயலைக் குறிக்கும் வினைமுற்று. படர்க்கை விகுதிகள்: -தி (ஒருமை), -த: (இருமை), -அந்தி (பன்மை).",
    tableData: {
      headers: ["இடம் (Person)", "ஒருமை (Singular)", "இருமை (Dual)", "பன்மை (Plural)"],
      rows: [
        ["3rd Person (படர்க்கை)", "गच्छति (gacchati)", "गच्छतः (gacchataḥ)", "गच्छन्ति (gacchanti)"],
        ["2nd Person (முன்னிலை)", "गच्छसि (gacchasi)", "गच्छथः (gacchathaḥ)", "गच्छथ (gacchatha)"],
        ["1st Person (தன்மை)", "गच्छामि (gacchāmi)", "गच्छावः (gacchāvaḥ)", "गच्छामः (gacchāmaḥ)"],
      ],
    },
    examples: [
      {
        sanskrit: "सः वनं गच्छति ।",
        iast: "saḥ vanaṃ gacchati |",
        tamil: "ஸ: வநம் க³ச்ச²தி |",
        translationEn: "He goes to the forest.",
        translationTa: "அவன் காட்டிற்குச் செல்கிறான்.",
        highlightToken: "गच्छति",
      },
      {
        sanskrit: "ते पुस्तकं पठन्ति ।",
        iast: "te pustakaṃ paṭhanti |",
        tamil: "தே புஸ்தகம் பட²ந்தி |",
        translationEn: "They read the book.",
        translationTa: "அவர்கள் புத்தகத்தைப் படிக்கிறார்கள்.",
        highlightToken: "पठन्ति",
      },
    ],
    relatedLessonId: "lesson-1",
  },
  {
    id: "rule-anusvara-sandhi",
    slug: "anusvara-sandhi",
    titleEn: "Anusvāra Sandhi (मोऽनुस्वारः)",
    titleTa: "அநுஸ்வார சந்தி (மகர மெய் மாற்றம்)",
    sanskritTerm: "अनुस्वार सन्धिः (हल्)",
    sanskritIast: "anusvāra sandhiḥ (hal)",
    category: "sandhi",
    sutra: "मोऽनुस्वारः (८.३.२३)",
    sutraTranslationEn: "A word-final 'm' changes into an anusvāra dot (ṃ) when followed by any consonant.",
    sutraTranslationTa: "சொல்லின் இறுதியில் உள்ள மகர மெய் (ம் / m), அடுத்து ஒரு மெய்யெழுத்து வரும்போது அநுஸ்வாரப் புள்ளியாக (dot) மாறும்.",
    ruleEn: "When a word ends in -m and the following word begins with any consonant, -m changes to anusvāra (dot above). If followed by a vowel or pause, -m remains unchanged.",
    ruleTa: "ஒரு சொல்லின் கடைசியில் 'ம்' வந்து, அடுத்த சொல் மெய்யெழுத்தில் தொடங்கினால் 'ம்' என்பது அநுஸ்வாரமாக மாறும் (எ.கா: वनम् + गच्छति → वनं गच्छति).",
    examples: [
      {
        sanskrit: "वनम् + गच्छति = वनं गच्छति",
        iast: "vanam + gacchati = vanaṃ gacchati",
        tamil: "வநம் + க³ச்ச²தி = வநம் க³ச்ச²தி",
        translationEn: "Final -m becomes anusvāra before consonant 'g'.",
        translationTa: "'க' மெய்யெழுத்தின் முன் 'ம்' அநுஸ்வாரமாக மாறியது.",
      },
      {
        sanskrit: "सत्यम् + वद = सत्यं वद",
        iast: "satyam + vada = satyaṃ vada",
        tamil: "ஸத்யம் + வத³ = ஸத்யம் வத³",
        translationEn: "Speak the truth.",
        translationTa: "உண்மையை பேசு.",
      },
    ],
    relatedLessonId: "lesson-2",
  },
  {
    id: "rule-guna-sandhi",
    slug: "guna-sandhi",
    titleEn: "Guṇa Vowel Sandhi (आद्गुणः)",
    titleTa: "குண சந்தி (உயிரெழுத்துச் சந்தி)",
    sanskritTerm: "गुण सन्धिः (अच्)",
    sanskritIast: "guṇa sandhiḥ (ac)",
    category: "sandhi",
    sutra: "आद्गुणः (६.१.८७)",
    sutraTranslationEn: "When short or long 'a' is followed by 'i/ī', 'u/ū', or 'ṛ/ṝ', the two vowels merge into their single guṇa equivalent: e, o, or ar.",
    sutraTranslationTa: "அ/ஆ விற்குப் பின் இ/ஈ வந்தால் 'ஏ' என்றும், உ/ஊ வந்தால் 'ஓ' என்றும், ரு/ரூ வந்தால் 'அர்' என்றும் ஒன்றிணையும்.",
    ruleEn: "a/ā + i/ī → e; a/ā + u/ū → o; a/ā + ṛ/ṝ → ar. Common in classical names and compounds.",
    ruleTa: "அ + இ = ஏ (தேவ + இந்திர = தேவேந்திர), அ + ஈ = ஏ (பரம + ஈஸ்வர = பரமேஸ்வர).",
    examples: [
      {
        sanskrit: "देव + इन्द्रः = देवेन्द्रः",
        iast: "deva + indraḥ = devendraḥ",
        tamil: "தே³வ + இந்த்³ர: = தே³வேந்த்³ர:",
        translationEn: "Deva + Indra = Devendra (King of Gods).",
        translationTa: "தேவர் தலைவன் தேவேந்திரன்.",
      },
      {
        sanskrit: "महा + उत्सवः = महोत्सवः",
        iast: "mahā + utsavaḥ = mahotsavaḥ",
        tamil: "மஹா + உத்ஸவ: = மஹோத்ஸவ:",
        translationEn: "Mahā + Utsava = Mahotsava (Great festival).",
        translationTa: "மாபெரும் விழா.",
      },
    ],
    relatedLessonId: "lesson-2",
  },
];

export function getGrammarRules(category?: string): GrammarRuleItem[] {
  if (!category || category === "all") {
    return SEEDED_GRAMMAR_RULES;
  }
  return SEEDED_GRAMMAR_RULES.filter((r) => r.category === category);
}

export function getGrammarRuleBySlug(slug: string): GrammarRuleItem | undefined {
  return SEEDED_GRAMMAR_RULES.find((r) => r.slug === slug);
}
