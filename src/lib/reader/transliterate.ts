export type ScriptType = "devanagari" | "tamil" | "iast";

/**
 * Detects the script of a given Sanskrit string
 */
export function detectScript(text: string): ScriptType {
  if (/[\u0900-\u097F]/.test(text)) {
    return "devanagari";
  }
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "tamil";
  }
  return "iast";
}

// Consonant mappings: IAST <-> Devanāgarī
const IAST_TO_DEVA_CONSONANTS: Array<[string, string]> = [
  ["cch", "च्छ"],
  ["kṣ", "क्ष"],
  ["jñ", "ज्ञ"],
  ["kh", "ख"],
  ["gh", "घ"],
  ["ch", "छ"],
  ["jh", "झ"],
  ["ṭh", "ठ"],
  ["ḍh", "ढ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["k", "क"],
  ["g", "ग"],
  ["ṅ", "ङ"],
  ["c", "च"],
  ["j", "ज"],
  ["ñ", "ञ"],
  ["ṭ", "ट"],
  ["ḍ", "ड"],
  ["ṇ", "ण"],
  ["t", "त"],
  ["d", "द"],
  ["n", "न"],
  ["p", "प"],
  ["b", "ब"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["v", "व"],
  ["ś", "श"],
  ["ṣ", "ष"],
  ["s", "स"],
  ["h", "ह"],
];

// Vowel signs: IAST -> Devanāgarī Mātrā
const IAST_TO_DEVA_MATRAS: Record<string, string> = {
  a: "",
  ā: "ा",
  i: "ि",
  ī: "ी",
  u: "ु",
  ū: "ू",
  ṛ: "ृ",
  ṝ: "ॄ",
  ḷ: "ॢ",
  e: "े",
  ai: "ै",
  o: "ो",
  au: "ौ",
};

// Independent vowels: IAST -> Devanāgarī
const IAST_TO_DEVA_INDEP_VOWELS: Record<string, string> = {
  a: "अ",
  ā: "आ",
  i: "इ",
  ī: "ई",
  u: "उ",
  ū: "ऊ",
  ṛ: "ऋ",
  ṝ: "ॠ",
  ḷ: "ऌ",
  e: "ए",
  ai: "ऐ",
  o: "ओ",
  au: "औ",
};

// Devanāgarī to IAST dictionary for fast lookup of standard tokens & common words
const DEVA_TO_IAST_MAP: Record<string, string> = {
  "रामः": "rāmaḥ",
  "वनम्": "vanam",
  "वनं": "vanaṃ",
  "गच्छति": "gacchati",
  "अ": "a",
  "आ": "ā",
  "इ": "i",
  "ई": "ī",
  "उ": "u",
  "ऊ": "ū",
  "ऋ": "ṛ",
  "ए": "e",
  "ऐ": "ai",
  "ओ": "o",
  "औ": "au",
  "अग्निः": "agniḥ",
  "विद्या": "vidyā",
  "ददाति": "dadāti",
  "विनयम्": "vinayam",
  "विनयं": "vinayaṃ",
  "धर्मक्षेत्रे": "dharmakṣetre",
  "कुरुक्षेत्रे": "kurukṣetre",
  "समवेता": "samavetā",
  "युयुत्सवः": "yuyutsavaḥ",
  "मामकाः": "māmakāḥ",
  "पाण्डवाश्चैव": "pāṇḍavāścaiva",
  "किमकुर्वत": "kimakurvata",
  "सञ्जय": "sañjaya",
};

// Devanāgarī to Tamil dictionary
const DEVA_TO_TAMIL_MAP: Record<string, string> = {
  "रामः": "ராம:",
  "वनम्": "வநம்",
  "वनं": "வநம்",
  "गच्छति": "க³ச்ச²தி",
  "अ": "அ",
  "आ": "ஆ",
  "इ": "இ",
  "ई": "ஈ",
  "उ": "உ",
  "ऊ": "ஊ",
  "ऋ": "ரு",
  "ए": "ஏ",
  "ऐ": "ஐ",
  "ओ": "ஓ",
  "औ": "ஔ",
  "अग्निः": "அக்³நி:",
  "विद्या": "வித்³யா",
  "ददाति": "த³தா³தி",
  "विनयम्": "விநயம்",
  "विनयं": "விநயம்",
  "धर्मक्षेत्रे": "த⁴ர்மக்ஷேத்ரே",
  "कुरुक्षेत्रे": "குருக்ஷேத்ரே",
};

/**
 * Transliterates text from any source script into the desired target script
 */
export function transliterate(text: string, targetScript: ScriptType): string {
  if (!text) return "";
  const currentScript = detectScript(text);

  if (currentScript === targetScript) {
    return text;
  }

  // Check direct phrase / word map first
  const cleanTrimmed = text.trim();
  if (targetScript === "iast" && DEVA_TO_IAST_MAP[cleanTrimmed]) {
    return DEVA_TO_IAST_MAP[cleanTrimmed];
  }
  if (targetScript === "tamil" && DEVA_TO_TAMIL_MAP[cleanTrimmed]) {
    return DEVA_TO_TAMIL_MAP[cleanTrimmed];
  }

  // Word-by-word tokenized conversion for compound sentences
  const tokens = text.split(/(\s+|[।॥,\.!?]+)/);
  const converted = tokens.map((tok) => {
    if (/^\s+$/.test(tok) || /^[।॥,\.!?]+$/.test(tok)) {
      return tok;
    }

    if (targetScript === "iast" && DEVA_TO_IAST_MAP[tok]) {
      return DEVA_TO_IAST_MAP[tok];
    }
    if (targetScript === "tamil" && DEVA_TO_TAMIL_MAP[tok]) {
      return DEVA_TO_TAMIL_MAP[tok];
    }

    // Dynamic conversion fallback
    if (currentScript === "iast" && targetScript === "devanagari") {
      return iastToDevanagari(tok);
    }
    if (currentScript === "devanagari" && targetScript === "iast") {
      return devanagariToIast(tok);
    }
    if (currentScript === "devanagari" && targetScript === "tamil") {
      return devanagariToTamil(tok);
    }
    if (currentScript === "tamil" && targetScript === "devanagari") {
      return tamilToDevanagari(tok);
    }

    return tok;
  });

  return converted.join("");
}

/**
 * Converts IAST Roman transliteration to Devanāgarī
 */
export function iastToDevanagari(iast: string): string {
  let s = iast.toLowerCase();

  // Normalize common phonetic input shortcuts (e.g. aa -> ā, ii -> ī, uu -> ū)
  s = s
    .replace(/aa/g, "ā")
    .replace(/ii/g, "ī")
    .replace(/uu/g, "ū")
    .replace(/sh/g, "ś");

  let out = "";
  let i = 0;

  while (i < s.length) {
    // Check punctuation / visarga / anusvāra
    if (s[i] === "ḥ") {
      out += "ः";
      i++;
      continue;
    }
    if (s[i] === "ṃ" || s[i] === "m̐") {
      out += "ं";
      i++;
      continue;
    }

    // Check consonants
    let matchedConsonant: [string, string] | undefined;
    for (const pair of IAST_TO_DEVA_CONSONANTS) {
      if (s.startsWith(pair[0], i)) {
        matchedConsonant = pair;
        break;
      }
    }

    if (matchedConsonant) {
      i += matchedConsonant[0].length;
      // Check following vowel
      let matchedVowel = "";
      for (const v of ["ai", "au", "ā", "a", "ī", "i", "ū", "u", "ṝ", "ṛ", "ḷ", "e", "o"]) {
        if (s.startsWith(v, i)) {
          matchedVowel = v;
          i += v.length;
          break;
        }
      }

      if (matchedVowel) {
        out += matchedConsonant[1] + (IAST_TO_DEVA_MATRAS[matchedVowel] ?? "");
      } else {
        // Virāma if no following vowel
        out += matchedConsonant[1] + "्";
      }
    } else {
      // Independent vowel
      let matchedIndep = "";
      for (const v of ["ai", "au", "ā", "a", "ī", "i", "ū", "u", "ṝ", "ṛ", "ḷ", "e", "o"]) {
        if (s.startsWith(v, i)) {
          matchedIndep = v;
          i += v.length;
          break;
        }
      }

      if (matchedIndep) {
        out += IAST_TO_DEVA_INDEP_VOWELS[matchedIndep] || matchedIndep;
      } else {
        out += s[i];
        i++;
      }
    }
  }

  return out;
}

/**
 * Converts Devanāgarī to IAST
 */
export function devanagariToIast(deva: string): string {
  // If mapped directly, return
  if (DEVA_TO_IAST_MAP[deva]) return DEVA_TO_IAST_MAP[deva];

  const DEVA_INDEP: Record<string, string> = {
    अ: "a",
    आ: "ā",
    इ: "i",
    ई: "ī",
    उ: "u",
    ऊ: "ū",
    ऋ: "ṛ",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
  };

  const DEVA_CONS: Record<string, string> = {
    क: "k",
    ख: "kh",
    ग: "g",
    घ: "gh",
    ङ: "ṅ",
    च: "c",
    छ: "ch",
    ज: "j",
    झ: "jh",
    ञ: "ñ",
    ट: "ṭ",
    ठ: "ṭh",
    ड: "ḍ",
    ढ: "ḍh",
    ण: "ṇ",
    त: "t",
    थ: "th",
    द: "d",
    ध: "dh",
    न: "n",
    प: "p",
    फ: "ph",
    ब: "b",
    भ: "bh",
    म: "m",
    य: "y",
    र: "r",
    ल: "l",
    व: "v",
    श: "ś",
    ष: "ṣ",
    स: "s",
    ह: "h",
  };

  const DEVA_MATRAS: Record<string, string> = {
    "ा": "ā",
    "ि": "i",
    "ी": "ī",
    "ु": "u",
    "ू": "ū",
    "ृ": "ṛ",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
  };

  let out = "";
  for (let i = 0; i < deva.length; i++) {
    const ch = deva[i];
    const next = deva[i + 1];

    if (ch === "ः") {
      out += "ḥ";
    } else if (ch === "ं") {
      out += "ṃ";
    } else if (ch === "्") {
      // halanta already cancels preceding inherent 'a'
      continue;
    } else if (DEVA_INDEP[ch]) {
      out += DEVA_INDEP[ch];
    } else if (DEVA_CONS[ch]) {
      const cons = DEVA_CONS[ch];
      if (next === "्") {
        out += cons;
      } else if (next && DEVA_MATRAS[next]) {
        out += cons + DEVA_MATRAS[next];
        i++; // skip matra
      } else {
        out += cons + "a";
      }
    } else {
      out += ch;
    }
  }

  return out;
}

/**
 * Converts Devanāgarī to Tamil Script
 */
export function devanagariToTamil(deva: string): string {
  if (DEVA_TO_TAMIL_MAP[deva]) return DEVA_TO_TAMIL_MAP[deva];

  // Basic phonemic substitution for transliteration display
  const MAP: Record<string, string> = {
    अ: "அ",
    आ: "ஆ",
    इ: "இ",
    ई: "ஈ",
    उ: "உ",
    ऊ: "ஊ",
    ऋ: "ரு",
    ए: "ஏ",
    ऐ: "ஐ",
    ओ: "ஓ",
    औ: "ஔ",
    क: "க",
    ख: "க²",
    ग: "க³",
    घ: "க⁴",
    ङ: "ங",
    च: "ச",
    छ: "ச²",
    ज: "ஜ",
    झ: "ஜ²",
    ञ: "ஞ",
    ट: "ட",
    ठ: "ட²",
    ड: "ட³",
    ढ: "ட⁴",
    ण: "ண",
    त: "த",
    थ: "த²",
    द: "த³",
    ध: "த⁴",
    न: "ந",
    प: "ப",
    फ: "ப²",
    ब: "ப³",
    भ: "ப⁴",
    म: "ம",
    य: "ய",
    र: "ர",
    ल: "ல",
    व: "வ",
    श: "ஶ",
    ष: "ஷ",
    स: "ஸ",
    ह: "ஹ",
    "ा": "ா",
    "ि": "ி",
    "ी": "ீ",
    "ु": "ு",
    "ू": "ூ",
    "ृ": "்ரு",
    "े": "ே",
    "ै": "ை",
    "ो": "ோ",
    "ौ": "ௌ",
    "्": "்",
    "ः": ":",
    "ं": "ம்",
  };

  let out = "";
  for (let i = 0; i < deva.length; i++) {
    const ch = deva[i];
    out += MAP[ch] || ch;
  }
  return out;
}

/**
 * Converts Tamil Script back to Devanāgarī
 */
export function tamilToDevanagari(tamil: string): string {
  const iast = devanagariToIast(tamil);
  return iastToDevanagari(iast);
}
