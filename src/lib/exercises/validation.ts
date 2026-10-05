export interface ValidationResult {
  correct: boolean;
  correctOptionId?: string;
  explanationEn: string;
  explanationTa: string;
  isAlternativeOrder?: boolean;
  alsoCorrectEn?: string;
  alsoCorrectTa?: string;
}

export function normalizeSentence(str: string): string {
  return str
    .replace(/[।\.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateAnswer(exercise: any, userResponse: any): ValidationResult {
  const { exerciseType } = exercise;

  // 1. read_script & listen_choose
  if (exerciseType === "read_script" || exerciseType === "listen_choose") {
    const isCorrect = userResponse.selectedOptionId === exercise.correctOptionId;
    return {
      correct: isCorrect,
      correctOptionId: exercise.correctOptionId,
      explanationEn: exercise.explanationEn,
      explanationTa: exercise.explanationTa,
    };
  }

  // 2. fill_blank
  if (exerciseType === "fill_blank") {
    if (userResponse.selectedOptionId) {
      const isCorrect = userResponse.selectedOptionId === exercise.correctOptionId;
      return {
        correct: isCorrect,
        correctOptionId: exercise.correctOptionId,
        explanationEn: exercise.explanationEn,
        explanationTa: exercise.explanationTa,
      };
    }
    if (userResponse.textAnswer) {
      const normInput = normalizeSentence(userResponse.textAnswer);
      const accepted = (exercise.acceptedAnswers || [exercise.correctText || ""]).map((a: string) =>
        normalizeSentence(a)
      );
      const isCorrect = accepted.includes(normInput);
      return {
        correct: isCorrect,
        explanationEn: exercise.explanationEn,
        explanationTa: exercise.explanationTa,
      };
    }
  }

  // 3. match (pairs)
  if (exerciseType === "match") {
    const pairs = exercise.pairs || [];
    const userPairs = userResponse.matchedPairs || [];

    if (userPairs.length < pairs.length) {
      return {
        correct: false,
        explanationEn: exercise.explanationEn || "Please match all pairs before submitting.",
        explanationTa: exercise.explanationTa || "சமர்ப்பிக்கும் முன் அனைத்து இணைகளையும் பொருத்துங்கள்.",
      };
    }

    const allCorrect = pairs.every((targetPair: any) =>
      userPairs.some(
        (up: any) => up.leftId === targetPair.leftId && up.rightId === targetPair.rightId
      )
    );

    return {
      correct: allCorrect,
      explanationEn: exercise.explanationEn,
      explanationTa: exercise.explanationTa,
    };
  }

  // 4. build_sentence (word tiles)
  if (exerciseType === "build_sentence") {
    const tileIds: string[] = userResponse.selectedTileIds || [];
    const tiles: Array<{ id: string; text: string }> = exercise.tiles || [];
    const assembledText = tileIds
      .map((id) => tiles.find((t) => t.id === id)?.text || "")
      .join(" ");

    const normalizedAssembled = normalizeSentence(assembledText);

    // Check tile sequences if defined
    if (exercise.acceptedTileSequences && exercise.acceptedTileSequences.length > 0) {
      const matchedSeqIndex = exercise.acceptedTileSequences.findIndex(
        (seq: string[]) =>
          seq.length === tileIds.length && seq.every((tid, idx) => tid === tileIds[idx])
      );

      if (matchedSeqIndex !== -1) {
        const isCanonical = matchedSeqIndex === 0;
        return {
          correct: true,
          isAlternativeOrder: !isCanonical,
          alsoCorrectEn: !isCanonical && exercise.canonicalSentence
            ? `Also common word order: "${exercise.canonicalSentence}"`
            : undefined,
          alsoCorrectTa: !isCanonical && exercise.canonicalSentenceTa
            ? `வழக்கமான சொல் வரிசை: "${exercise.canonicalSentenceTa}"`
            : undefined,
          explanationEn: exercise.explanationEn,
          explanationTa: exercise.explanationTa,
        };
      }
    }

    // Check sentence strings
    const acceptedSentences: string[] = exercise.acceptedSentences || (exercise.canonicalSentence ? [exercise.canonicalSentence] : []);
    const matchedSentenceIndex = acceptedSentences.findIndex(
      (s) => normalizeSentence(s) === normalizedAssembled
    );

    if (matchedSentenceIndex !== -1) {
      const isCanonical = matchedSentenceIndex === 0;
      return {
        correct: true,
        isAlternativeOrder: !isCanonical,
        alsoCorrectEn: !isCanonical && exercise.canonicalSentence
          ? `Also common word order: "${exercise.canonicalSentence}"`
          : undefined,
        alsoCorrectTa: !isCanonical && exercise.canonicalSentenceTa
          ? `வழக்கமான சொல் வரிசை: "${exercise.canonicalSentenceTa}"`
          : undefined,
        explanationEn: exercise.explanationEn,
        explanationTa: exercise.explanationTa,
      };
    }

    return {
      correct: false,
      explanationEn: exercise.explanationEn,
      explanationTa: exercise.explanationTa,
    };
  }

  // 5. transliterate
  if (exerciseType === "transliterate") {
    if (userResponse.selectedOptionId) {
      const isCorrect = userResponse.selectedOptionId === exercise.correctOptionId;
      return {
        correct: isCorrect,
        correctOptionId: exercise.correctOptionId,
        explanationEn: exercise.explanationEn,
        explanationTa: exercise.explanationTa,
      };
    }

    if (userResponse.textAnswer) {
      const normInput = userResponse.textAnswer.trim().toLowerCase();
      const accepted: string[] = (exercise.acceptedAnswers || [exercise.correctText || ""]).map(
        (a: string) => a.trim().toLowerCase()
      );
      const isCorrect = accepted.includes(normInput);
      return {
        correct: isCorrect,
        explanationEn: exercise.explanationEn,
        explanationTa: exercise.explanationTa,
      };
    }
  }

  // Fallback
  return {
    correct: false,
    explanationEn: exercise.explanationEn || "Incorrect answer, try again.",
    explanationTa: exercise.explanationTa || "தவறான விடை, மீண்டும் முயற்சிக்கவும்.",
  };
}
