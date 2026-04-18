import {
  characterProfiles,
  dimensionOrder,
  type CharacterProfile,
  type DimensionKey,
  type QuizQuestion,
} from "../data/sbtiData";

export type ScoreMap = Record<DimensionKey, number>;

export interface MatchResult {
  profile: CharacterProfile;
  score: ScoreMap;
  normalizedScore: ScoreMap;
  distance: number;
}

export const createEmptyScore = (): ScoreMap => ({
  S: 0,
  M: 0,
  V: 0,
  A: 0,
  D: 0,
});

export const calculateScore = (
  questions: QuizQuestion[],
  answers: number[],
): ScoreMap => {
  const total = createEmptyScore();

  questions.forEach((question, index) => {
    const answerIndex = answers[index];
    const option = question.options[answerIndex];

    if (!option) {
      return;
    }

    dimensionOrder.forEach((key) => {
      total[key] += option.score[key] ?? 0;
    });
  });

  return total;
};

const normalizeDimension = (value: number): number => {
  const min = -10;
  const max = 10;
  const clamped = Math.max(min, Math.min(max, value));
  return Number((((clamped - min) / (max - min)) * 10).toFixed(2));
};

export const normalizeScoreForRadar = (score: ScoreMap): ScoreMap => ({
  S: normalizeDimension(score.S),
  M: normalizeDimension(score.M),
  V: normalizeDimension(score.V),
  A: normalizeDimension(score.A),
  D: normalizeDimension(score.D),
});

export const euclideanDistance = (a: ScoreMap, b: ScoreMap): number => {
  const sum = dimensionOrder.reduce((acc, key) => {
    const diff = a[key] - b[key];
    return acc + diff * diff;
  }, 0);

  return Math.sqrt(sum);
};

export const findBestMatch = (score: ScoreMap): MatchResult => {
  const ranked = characterProfiles
    .map((profile) => ({
      profile,
      distance: euclideanDistance(score, profile.vector),
    }))
    .sort((left, right) => left.distance - right.distance);

  return {
    profile: ranked[0].profile,
    distance: ranked[0].distance,
    score,
    normalizedScore: normalizeScoreForRadar(score),
  };
};
