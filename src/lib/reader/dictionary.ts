import { transliterate, detectScript } from "./transliterate";

export interface WordAnalysis {
  id: string;
  word: string;
  iast: string;
  tamil: string;
  baseForm: string;
  baseIast: string;
  meaningEn: string;
  meaningTa: string;
  grammarEn: string;
  grammarTa: string;
  ruleEn?: string;
  ruleTa?: string;
  isKnown: boolean;
  ambiguityStatus?: "clear" | "possible" | "ambiguous";
  alternateReadings?: Array<{
    meaningEn: string;
    meaningTa: string;
    grammarEn: string;
  }>;
}

export interface TokenAnalysis extends WordAnalysis {
  index: number;
}

export interface SentenceAnalysisResult {
  originalText: string;
  detectedScript: "devanagari" | "tamil" | "iast";
  transliterationIast: string;
  transliterationTamil: string;
  transliterationDevanagari: string;
  translationEn: string;
  translationTa: string;
  isAiAssisted: boolean;
  totalWords: number;
  knownWords: number;
  tokens: TokenAnalysis[];
}

export const VOCABULARY_DICTIONARY: Record<string, Omit<WordAnalysis, "id" | "word" | "iast" | "tamil">> = {
  "रामः": {
    baseForm: "राम",
    baseIast: "rāma",
    meaningEn: "Rāma (hero, proper name)",
    meaningTa: "இராமன் (பெயர்ச்சொல்)",
    grammarEn: "Masculine singular, Nominative case (kartā / the doer)",
    grammarTa: "ஆண்பால் ஒருமை, எழுவாய் வேற்றுமை (ப்ரதமா / கர்தா)",
    ruleEn: "Prathamā vibhakti: -ḥ suffix marks masculine singular agent.",
    ruleTa: "ப்ரதமா விபக்தி: விஸர்க்கம் (-:) ஆண்பால் ஒருமை எழுவாயைக் குறிக்கும்.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "वनम्": {
    baseForm: "वन",
    baseIast: "vana",
    meaningEn: "Forest, woods",
    meaningTa: "காடு, வனம்",
    grammarEn: "Neuter singular, Accusative case (karma / destination)",
    grammarTa: "நபும்சகலிங்கம் ஒருமை, இரண்டாம் வேற்றுமை (த்³விதீயா / சென்றடையும் இடம்)",
    ruleEn: "Dvitīyā vibhakti: -m ending indicates goal or object.",
    ruleTa: "த்³விதீயா விபக்தி: -ம் உருபு சென்றடையும் இலக்கைக் குறிக்கும்.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "वनं": {
    baseForm: "वन",
    baseIast: "vana",
    meaningEn: "Forest (with anusvāra)",
    meaningTa: "காடு",
    grammarEn: "Neuter singular, Accusative case",
    grammarTa: "இரண்டாம் வேற்றுமை",
    ruleEn: "Anusvāra sandhi replaces -m before consonants.",
    ruleTa: "மெய்யெழுத்திற்கு முன் மகரம் அநுஸ்வாரமாக மாறும்.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "गच्छति": {
    baseForm: "गम्",
    baseIast: "gam",
    meaningEn: "Goes, walks",
    meaningTa: "செல்கிறான், செல்கிறது",
    grammarEn: "Present active verb (laṭ lakāra), 3rd person singular",
    grammarTa: "நிகழ்கால வினைமுற்று (லட்), படர்க்கை ஒருமை",
    ruleEn: "Root gam → gacch + ti ending for 3rd person singular present.",
    ruleTa: "கம் (gam) தாது + தி (ti) படர்க்கை ஒருமை விகுதி.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "विद्या": {
    baseForm: "विद्या",
    baseIast: "vidyā",
    meaningEn: "Knowledge, learning, science",
    meaningTa: "கல்வி, அறிவு",
    grammarEn: "Feminine singular, Nominative case (subject)",
    grammarTa: "பெண்பால் ஒருமை, எழுவாய் வேற்றுமை",
    ruleEn: "Root vid (to know). -ā ending feminine nominative.",
    ruleTa: "வித்³ (vid) தாதுவிலிருந்து தோன்றிய அறிவு.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "ददाति": {
    baseForm: "दा",
    baseIast: "dā",
    meaningEn: "Gives, grants, bestows",
    meaningTa: "தருகிறது, அளிக்கிறது",
    grammarEn: "Present verb (laṭ lakāra), 3rd person singular",
    grammarTa: "நிகழ்கால வினை, படர்க்கை ஒருமை",
    ruleEn: "Reduplicated present stem of root dā (to give).",
    ruleTa: "தா³ (dā) தாதுவின் நிகழ்கால வடிவம்.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "विनयम्": {
    baseForm: "विनय",
    baseIast: "vinaya",
    meaningEn: "Humility, discipline, modesty",
    meaningTa: "பணிவு, அடக்கம்",
    grammarEn: "Masculine singular, Accusative case (object)",
    grammarTa: "ஆண்பால் ஒருமை, இரண்டாம் வேற்றுமை",
    ruleEn: "Dvitīyā vibhakti marking what is bestowed.",
    ruleTa: "அளிக்கப்படும் குணத்தைக் குறிக்கும் செயப்படுபொருள் உருபு.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "विनयं": {
    baseForm: "विनय",
    baseIast: "vinaya",
    meaningEn: "Humility, discipline",
    meaningTa: "பணிவு",
    grammarEn: "Accusative singular with anusvāra",
    grammarTa: "இரண்டாம் வேற்றுமை",
    ruleEn: "Anusvāra sandhi form of vinayam.",
    ruleTa: "அநுஸ்வார வடிவம்.",
    isKnown: true,
    ambiguityStatus: "clear",
  },
  "धर्मक्षेत्रे": {
    baseForm: "धर्मक्षेत्र",
    baseIast: "dharmakṣetra",
    meaningEn: "In the field of righteousness / sacred duty",
    meaningTa: "அறநெறிக்களத்தில் (தர்ம பூமியில்)",
    grammarEn: "Locative singular neuter (saptamī vibhakti)",
    grammarTa: "ஏழாம் வேற்றுமை ஒருமை (இட வேற்றுமை / ஸப்தமீ)",
    ruleEn: "Tatpuruṣa compound: dharma + kṣetra in locative -e.",
    ruleTa: "தத்புருஷ சமாசம்: தர்மம் + க்ஷேத்ரம், ஏழாம் வேற்றுமை உருபு.",
    isKnown: false,
    ambiguityStatus: "clear",
  },
  "कुरुक्षेत्रे": {
    baseForm: "कुरुक्षेत्र",
    baseIast: "kurukṣetra",
    meaningEn: "In the historical plain of Kurukṣetra",
    meaningTa: "குருக்ஷேத்திர போர்க்களத்தில்",
    grammarEn: "Locative singular neuter (saptamī vibhakti)",
    grammarTa: "ஏழாம் வேற்றுமை ஒருமை (ஸப்தமீ)",
    ruleEn: "Locative suffix -e specifies location in space.",
    ruleTa: "போர் நிகழும் இடத்தைக் குறிக்கும் ஏழாம் வேற்றுமை.",
    isKnown: false,
    ambiguityStatus: "clear",
  },
};

/**
 * Analyzes a sentence into words, meanings, grammatical forms, and translations
 */
export function analyzeSentence(input: string): SentenceAnalysisResult {
  const clean = input.trim();
  const detected = detectScript(clean);

  // Normalize text to Devanāgarī for canonical dictionary lookup
  const devaText = detected === "devanagari" ? clean : transliterate(clean, "devanagari");
  const iastText = transliterate(devaText, "iast");
  const tamilText = transliterate(devaText, "tamil");

  // Split into word tokens, discarding punctuation
  const rawWords = devaText
    .split(/[\s।॥,\.!?]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  let knownCount = 0;
  const tokens: TokenAnalysis[] = rawWords.map((word, index) => {
    // Lookup in dictionary or construct baseline analysis
    const entry = VOCABULARY_DICTIONARY[word];
    const wordIast = transliterate(word, "iast");
    const wordTamil = transliterate(word, "tamil");

    if (entry) {
      if (entry.isKnown) knownCount++;
      return {
        id: `tok-${index}-${word}`,
        index,
        word,
        iast: wordIast,
        tamil: wordTamil,
        baseForm: entry.baseForm,
        baseIast: entry.baseIast,
        meaningEn: entry.meaningEn,
        meaningTa: entry.meaningTa,
        grammarEn: entry.grammarEn,
        grammarTa: entry.grammarTa,
        ruleEn: entry.ruleEn,
        ruleTa: entry.ruleTa,
        isKnown: entry.isKnown,
        ambiguityStatus: entry.ambiguityStatus || "clear",
      };
    }

    // Uncatalogued word fallback
    return {
      id: `tok-${index}-${word}`,
      index,
      word,
      iast: wordIast,
      tamil: wordTamil,
      baseForm: word,
      baseIast: wordIast,
      meaningEn: `Sanskrit word "${wordIast}"`,
      meaningTa: `சமஸ்கிருத சொல் "${wordTamil}"`,
      grammarEn: "Classical Sanskrit word form",
      grammarTa: "சமஸ்கிருத சொல் வடிவம்",
      isKnown: false,
      ambiguityStatus: "possible",
    };
  });

  // Common sentence translations
  let translationEn = "A Sanskrit verse / sentence.";
  let translationTa = "ஒரு சமஸ்கிருத வாக்கியம் / ஸ்லோகம்.";

  if (clean.includes("राम") && clean.includes("गच्छति")) {
    translationEn = "Rāma goes to the forest.";
    translationTa = "இராமன் காட்டிற்குச் செல்கிறான்.";
  } else if (clean.includes("विद्या") && clean.includes("विनय")) {
    translationEn = "Knowledge gives humility; from humility comes worthiness.";
    translationTa = "கல்வி பணிவைத் தருகிறது; பணிவு தகுதியைத் தருகிறது.";
  } else if (clean.includes("धर्मक्षेत्रे") || clean.includes("कुरुक्षेत्रे")) {
    translationEn = "On the sacred field, the field of Kuru, assembled together and eager to fight...";
    translationTa = "அறக்களமாகிய குருக்ஷேத்திரத்தில், போரிட விரும்பி ஒன்றாகக் கூடிய...";
  }

  return {
    originalText: clean,
    detectedScript: detected,
    transliterationIast: iastText,
    transliterationTamil: tamilText,
    transliterationDevanagari: devaText,
    translationEn,
    translationTa,
    isAiAssisted: true,
    totalWords: tokens.length,
    knownWords: knownCount,
    tokens,
  };
}
