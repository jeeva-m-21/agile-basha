import { DICTIONARY_ENTRIES, DictionaryEntry } from "./data";
import { transliterate, detectScript } from "../reader/transliterate";
import { getGrammarRuleBySlug, GrammarRuleItem } from "./grammar-rules";

export interface FormAnalysisDetail {
  surfaceWord: string;
  surfaceIast: string;
  surfaceTamil: string;
  baseLemma: string;
  baseIast: string;
  baseTamil: string;
  partOfSpeech: string;
  grammarEn: string;
  grammarTa: string;
  vibhaktiOrLakara?: string;
  genderOrPerson?: string;
  number?: string;
  stemOrRoot?: string;
  suffix?: string;
  ruleSlug?: string;
  grammarRule?: GrammarRuleItem;
  relatedLessonId?: string;
  relatedLessonTitle?: string;
  meaningEn: string;
  meaningTa: string;
  source: string;
}

/**
 * Searches the dictionary across any script (Devanāgarī, Tamil, IAST)
 * or English / Tamil translation keywords.
 * SPEC §11.1: Searching "shiva" or "சிவ" finds शिव.
 */
export function searchDictionary(rawQuery: string): DictionaryEntry[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const script = detectScript(query);
  let devaQuery = "";
  let iastQuery = "";

  if (script === "devanagari") {
    devaQuery = query;
    iastQuery = transliterate(query, "iast").toLowerCase();
  } else if (script === "tamil") {
    devaQuery = transliterate(query, "devanagari");
    iastQuery = transliterate(devaQuery, "iast").toLowerCase();
  } else {
    // Roman/IAST or English query
    iastQuery = query;
    devaQuery = transliterate(query, "devanagari");
  }

  // Normalize query string for comparison (strip diacritics / macrons for fuzzy matching)
  const normQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normIastQuery = iastQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return DICTIONARY_ENTRIES.filter((entry) => {
    const entryHeadword = entry.headword.toLowerCase();
    const entryIast = entry.iast.toLowerCase();
    const entryTamil = entry.tamil.toLowerCase();
    const normEntryIast = entryIast.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Direct or fuzzy headword match
    if (
      entryHeadword.includes(devaQuery) ||
      entryIast.includes(iastQuery) ||
      normEntryIast.includes(normQuery) ||
      normEntryIast.includes(normIastQuery) ||
      entryTamil.includes(query)
    ) {
      return true;
    }

    // 2. Inflected forms match
    if (entry.inflections) {
      const matchInflection = entry.inflections.some((inf) => {
        const infForm = inf.form.toLowerCase();
        const infIast = inf.iast.toLowerCase();
        const normInfIast = infIast.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return (
          infForm.includes(devaQuery) ||
          infIast.includes(iastQuery) ||
          normInfIast.includes(normQuery) ||
          normInfIast.includes(normIastQuery) ||
          inf.tamil.includes(query)
        );
      });
      if (matchInflection) return true;
    }

    // 3. English meaning search (e.g. "auspicious", "forest", "knowledge", "teacher")
    const matchEnMeaning = entry.meaningsEn.some((m) =>
      m.toLowerCase().includes(query)
    );
    if (matchEnMeaning) return true;

    // 4. Tamil meaning search (e.g. "சிவன்", "காடு", "கல்வி", "பணிவு", "குரு")
    const matchTaMeaning = entry.meaningsTa.some((m) =>
      m.includes(query)
    );
    if (matchTaMeaning) return true;

    // 5. Root search
    if (entry.root) {
      if (
        entry.root.rootDeva.includes(devaQuery) ||
        entry.root.rootIast.includes(normQuery)
      ) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Performs deep morphological form analysis on a Sanskrit word form.
 * e.g., "gacchati" -> present tense, 3rd person singular of root gam.
 */
export function analyzeWordForm(rawWord: string): FormAnalysisDetail | null {
  const word = rawWord.trim();
  if (!word) return null;

  const script = detectScript(word);
  const devaWord = script === "devanagari" ? word : transliterate(word, "devanagari");
  const iastWord = transliterate(devaWord, "iast");
  const tamilWord = transliterate(devaWord, "tamil");

  // 1. Search existing dictionary inflections first
  for (const entry of DICTIONARY_ENTRIES) {
    if (entry.inflections) {
      for (const inf of entry.inflections) {
        if (
          inf.form === devaWord ||
          inf.iast.toLowerCase() === word.toLowerCase() ||
          inf.iast.toLowerCase() === iastWord.toLowerCase() ||
          inf.tamil === tamilWord ||
          inf.tamil === word
        ) {
          const rule = inf.vibhaktiSlug
            ? getGrammarRuleBySlug(inf.vibhaktiSlug)
            : inf.lakaraSlug
            ? getGrammarRuleBySlug(inf.lakaraSlug)
            : undefined;

          return {
            surfaceWord: inf.form,
            surfaceIast: inf.iast,
            surfaceTamil: inf.tamil,
            baseLemma: entry.headword,
            baseIast: entry.iast,
            baseTamil: entry.tamil,
            partOfSpeech: entry.partOfSpeech,
            grammarEn: inf.analysisEn,
            grammarTa: inf.analysisTa,
            vibhaktiOrLakara: inf.vibhaktiSlug || inf.lakaraSlug,
            ruleSlug: inf.vibhaktiSlug || inf.lakaraSlug,
            grammarRule: rule,
            relatedLessonId: entry.relatedLessonId,
            relatedLessonTitle: entry.relatedLessonTitle,
            meaningEn: entry.meaningsEn[0],
            meaningTa: entry.meaningsTa[0],
            source: entry.source,
          };
        }
      }
    }

    // Direct headword match
    if (entry.headword === devaWord || entry.iast.toLowerCase() === iastWord.toLowerCase()) {
      return {
        surfaceWord: entry.headword,
        surfaceIast: entry.iast,
        surfaceTamil: entry.tamil,
        baseLemma: entry.headword,
        baseIast: entry.iast,
        baseTamil: entry.tamil,
        partOfSpeech: entry.partOfSpeech,
        grammarEn: `${entry.partOfSpeech} (base stem / citation form)`,
        grammarTa: `அடிப்படைச் சொல் வடிவம் (${entry.partOfSpeech})`,
        relatedLessonId: entry.relatedLessonId,
        relatedLessonTitle: entry.relatedLessonTitle,
        meaningEn: entry.meaningsEn[0],
        meaningTa: entry.meaningsTa[0],
        source: entry.source,
      };
    }
  }

  // 2. Morphological rule-based analyzer for uncatalogued words
  // e.g. endings -ति (3rd sg pres), -तः (3rd dual), -न्ति (3rd pl), -एन/-एण (instrumental), -म्/-ं (accusative), -ः (nominative)
  if (devaWord.endsWith("ति") || iastWord.endsWith("ti")) {
    const stem = devaWord.replace(/ति$/, "");
    return {
      surfaceWord: devaWord,
      surfaceIast: iastWord,
      surfaceTamil: tamilWord,
      baseLemma: stem,
      baseIast: transliterate(stem, "iast"),
      baseTamil: transliterate(stem, "tamil"),
      partOfSpeech: "verb",
      grammarEn: "Present active indicative (laṭ lakāra), 3rd person singular",
      grammarTa: "நிகழ்கால வினைமுற்று (லட்), படர்க்கை ஒருமை",
      vibhaktiOrLakara: "lat-lakara",
      ruleSlug: "lat-lakara",
      grammarRule: getGrammarRuleBySlug("lat-lakara"),
      meaningEn: `Action of ${transliterate(stem, "iast")} (he/she/it does)`,
      meaningTa: `${transliterate(stem, "tamil")} வினையின் நிகழ்கால வடிவம்`,
      source: "Bhāṣā Morphological Engine",
    };
  }

  if (devaWord.endsWith("ेण") || devaWord.endsWith("ेन") || iastWord.endsWith("eṇa") || iastWord.endsWith("ena")) {
    const stem = devaWord.replace(/[ेन|ेण]$/, "a");
    return {
      surfaceWord: devaWord,
      surfaceIast: iastWord,
      surfaceTamil: tamilWord,
      baseLemma: stem,
      baseIast: transliterate(stem, "iast"),
      baseTamil: transliterate(stem, "tamil"),
      partOfSpeech: "noun",
      grammarEn: "Masculine / Neuter singular, Instrumental case (tṛtīyā / by, with)",
      grammarTa: "ஆண்பால் / நபும்சகலிங்கம் ஒருமை, மூன்றாம் வேற்றுமை (ஆல், கொண்டு)",
      vibhaktiOrLakara: "tritiya-vibhakti",
      ruleSlug: "tritiya-vibhakti",
      grammarRule: getGrammarRuleBySlug("tritiya-vibhakti"),
      meaningEn: `By / with ${transliterate(stem, "iast")}`,
      meaningTa: `${transliterate(stem, "tamil")} மூலமாக / உடன்`,
      source: "Bhāṣā Morphological Engine",
    };
  }

  if (devaWord.endsWith("म्") || devaWord.endsWith("ं") || iastWord.endsWith("m") || iastWord.endsWith("ṃ")) {
    const stem = devaWord.replace(/[म्|ं]$/, "");
    return {
      surfaceWord: devaWord,
      surfaceIast: iastWord,
      surfaceTamil: tamilWord,
      baseLemma: stem,
      baseIast: transliterate(stem, "iast"),
      baseTamil: transliterate(stem, "tamil"),
      partOfSpeech: "noun",
      grammarEn: "Accusative case singular (dvitīyā / direct object or destination)",
      grammarTa: "இரண்டாம் வேற்றுமை ஒருமை (செயப்படுபொருள் / இலக்கு)",
      vibhaktiOrLakara: "dvitiya-vibhakti",
      ruleSlug: "dvitiya-vibhakti",
      grammarRule: getGrammarRuleBySlug("dvitiya-vibhakti"),
      meaningEn: `Towards / direct object ${transliterate(stem, "iast")}`,
      meaningTa: `${transliterate(stem, "tamil")} (இரண்டாம் வேற்றுமை உருபு)`,
      source: "Bhāṣā Morphological Engine",
    };
  }

  if (devaWord.endsWith("ः") || iastWord.endsWith("ḥ")) {
    const stem = devaWord.replace(/ः$/, "");
    return {
      surfaceWord: devaWord,
      surfaceIast: iastWord,
      surfaceTamil: tamilWord,
      baseLemma: stem,
      baseIast: transliterate(stem, "iast"),
      baseTamil: transliterate(stem, "tamil"),
      partOfSpeech: "noun",
      grammarEn: "Masculine singular, Nominative case (prathamā / subject)",
      grammarTa: "ஆண்பால் ஒருமை, முதல் வேற்றுமை (எழுவாய்)",
      vibhaktiOrLakara: "prathama-vibhakti",
      ruleSlug: "prathama-vibhakti",
      grammarRule: getGrammarRuleBySlug("prathama-vibhakti"),
      meaningEn: `Subject form: ${transliterate(stem, "iast")}`,
      meaningTa: `எழுவாய் வடிவம்: ${transliterate(stem, "tamil")}`,
      source: "Bhāṣā Morphological Engine",
    };
  }

  // Fallback
  return {
    surfaceWord: devaWord,
    surfaceIast: iastWord,
    surfaceTamil: tamilWord,
    baseLemma: devaWord,
    baseIast: iastWord,
    baseTamil: tamilWord,
    partOfSpeech: "word form",
    grammarEn: "Sanskrit lexical form",
    grammarTa: "சமஸ்கிருத சொல் வடிவம்",
    meaningEn: `Sanskrit word "${iastWord}"`,
    meaningTa: `சமஸ்கிருத சொல் "${tamilWord}"`,
    source: "Bhāṣā Morphological Engine",
  };
}
