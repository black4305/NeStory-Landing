import { Answer, Question } from '../types';
import { questions } from '../data/questions';

export interface ReliabilityAnalysis {
  score: number;
  pattern: 'consistent' | 'inconsistent' | 'random';
  details: {
    reverseItemConsistency: number;
    responseVariability: number;
    speedConsistency: number;
  };
}

export const calculateReliabilityScore = (answers: Answer[]): ReliabilityAnalysis => {
  if (answers.length < 5) {
    return {
      score: 0,
      pattern: 'random',
      details: {
        reverseItemConsistency: 0,
        responseVariability: 0,
        speedConsistency: 0
      }
    };
  }

  // 1. 역방향 문항 일관성 검사
  const reverseItemConsistency = calculateReverseItemConsistency(answers);
  
  // 2. 응답 변산성 검사 (모든 응답이 같은 점수인지 확인)
  const responseVariability = calculateResponseVariability(answers);
  
  // 3. 응답 속도 일관성 검사
  const speedConsistency = calculateSpeedConsistency(answers);
  
  // 종합 신뢰도 점수 계산 (0-100)
  const score = Math.round(
    (reverseItemConsistency * 0.5 + responseVariability * 0.3 + speedConsistency * 0.2) * 100
  );

  // 응답 패턴 분류
  let pattern: 'consistent' | 'inconsistent' | 'random';
  if (score >= 80) pattern = 'consistent';
  else if (score >= 50) pattern = 'inconsistent';
  else pattern = 'random';

  return {
    score,
    pattern,
    details: {
      reverseItemConsistency: Math.round(reverseItemConsistency * 100),
      responseVariability: Math.round(responseVariability * 100),
      speedConsistency: Math.round(speedConsistency * 100)
    }
  };
};

const calculateReverseItemConsistency = (answers: Answer[]): number => {
  const questionMap = questions.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {} as Record<number, Question>);

  // 각 축별로 정방향/역방향 문항 쌍을 찾아 일관성 검사
  const axisGroups = answers.reduce((acc, answer) => {
    const question = questionMap[answer.questionId];
    if (question) {
      if (!acc[question.axis]) acc[question.axis] = { normal: [], reverse: [] };
      if (question.isReverse) {
        acc[question.axis].reverse.push(answer.score);
      } else {
        acc[question.axis].normal.push(answer.score);
      }
    }
    return acc;
  }, {} as Record<string, { normal: number[], reverse: number[] }>);

  let totalConsistency = 0;
  let axisCount = 0;

  Object.values(axisGroups).forEach(({ normal, reverse }) => {
    if (normal.length > 0 && reverse.length > 0) {
      const normalAvg = normal.reduce((a, b) => a + b, 0) / normal.length;
      const reverseAvg = reverse.reduce((a, b) => a + b, 0) / reverse.length;
      
      // 역방향 문항은 점수가 반대여야 함 (5점 척도 기준: 1↔5, 2↔4, 3↔3)
      const expectedReverse = 6 - normalAvg;
      const consistency = 1 - Math.abs(reverseAvg - expectedReverse) / 4;
      totalConsistency += Math.max(0, consistency);
      axisCount++;
    }
  });

  return axisCount > 0 ? totalConsistency / axisCount : 0.5;
};

const calculateResponseVariability = (answers: Answer[]): number => {
  const scores = answers.map(a => a.score);
  const uniqueScores = new Set(scores).size;
  
  // 모든 응답이 같으면 0점, 다양할수록 높은 점수
  if (uniqueScores === 1) return 0;
  if (scores.length <= 5) return uniqueScores / 5;
  
  // 표준편차를 이용한 변산성 측정
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // 적절한 변산성은 0.8-1.5 사이
  const normalizedVariability = Math.min(stdDev / 1.5, 1);
  return normalizedVariability;
};

const calculateSpeedConsistency = (answers: Answer[]): number => {
  const times = answers.map(a => a.timeSpent).filter(t => t > 0);
  if (times.length < 3) return 0.5;
  
  // 너무 빠른 응답(2초 미만) 또는 너무 느린 응답(30초 초과) 패널티
  const suspiciouslyFast = times.filter(t => t < 2000).length;
  const suspiciouslySlow = times.filter(t => t > 30000).length;
  const suspiciousRatio = (suspiciouslyFast + suspiciouslySlow) / times.length;
  
  // 적절한 응답 시간 범위 (3-20초)는 보상
  const appropriateResponses = times.filter(t => t >= 3000 && t <= 20000).length;
  const appropriateRatio = appropriateResponses / times.length;
  
  return Math.max(0, appropriateRatio - suspiciousRatio * 0.5);
};

export const getReliabilityScoreColor = (score: number): string => {
  if (score >= 80) return '#48bb78'; // 초록
  if (score >= 60) return '#ed8936'; // 주황
  if (score >= 40) return '#f56565'; // 빨강
  return '#9ca3af'; // 회색
};

export const getReliabilityScoreLabel = (score: number): string => {
  if (score >= 80) return '신뢰함';
  if (score >= 60) return '보통';
  if (score >= 40) return '의심';
  return '불신';
};