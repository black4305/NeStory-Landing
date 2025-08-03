import { Answer, AxisScore } from '../types';
import { questions } from '../data/questions';

export const calculateTravelType = (answers: Answer[]): string => {
  const axisScores: AxisScore = {
    A: 0,
    C: 0,
    F: 0
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

  // 각 축별 유형 결정 (A축 4문항, C/F축 3문항, 5점 척도)
  const typeCode = 
    (axisScores.A >= 12 ? 'A' : 'R') +  // 4문항 기준점: 12점 (중간값)
    (axisScores.C >= 9 ? 'C' : 'N') +   // 3문항 기준점: 9점 (중간값)
    (axisScores.F >= 9 ? 'F' : 'E');    // 3문항 기준점: 9점 (중간값)

  return typeCode;
};

export const getAxisScores = (answers: Answer[]): AxisScore => {
  const axisScores: AxisScore = {
    A: 0,
    C: 0,
    F: 0
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