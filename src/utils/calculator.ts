import { Answer, AxisScore } from '../types';
import { questions } from '../data/questions';

export const calculateTravelType = (answers: Answer[]): string => {
  const axisScores: AxisScore = {
    A: 0,
    C: 0,
    F: 0,
    B: 0,
    K: 0
  };

  // 각 축별 점수 계산
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    let score = answer.score;
    if (question.isReverse) {
      score = 6 - score; // 5점 척도 역산
    }

    axisScores[question.axis] += score;
  });

  // 각 축별 유형 결정 (기준점 9점)
  const typeCode = 
    (axisScores.A >= 10 ? 'A' : 'R') +
    (axisScores.C >= 10 ? 'C' : 'N') +
    (axisScores.F >= 10 ? 'F' : 'E') +
    (axisScores.B >= 10 ? 'L' : 'B') +
    (axisScores.K >= 10 ? 'K' : 'P');

  return typeCode;
};

export const getAxisScores = (answers: Answer[]): AxisScore => {
  const axisScores: AxisScore = {
    A: 0,
    C: 0,
    F: 0,
    B: 0,
    K: 0
  };

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    let score = answer.score;
    if (question.isReverse) {
      score = 6 - score;
    }

    axisScores[question.axis] += score;
  });

  return axisScores;
};