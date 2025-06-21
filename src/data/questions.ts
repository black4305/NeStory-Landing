import { Question } from '../types';

export const questions: Question[] = [
  // A축: Active vs Relaxing
  {
    id: 1,
    text: "여행에서 하루를 꽉 채워 다양한 활동을 하는 게 좋다",
    axis: 'A'
  },
  {
    id: 2,
    text: "여행 중엔 충분한 낮잠이나 여유 시간이 꼭 필요하다",
    axis: 'A',
    isReverse: true
  },
  {
    id: 3,
    text: "테마파크, 놀이공원, 스포츠 같은 체험은 기대된다",
    axis: 'A'
  },
  
  // C축: Culture vs Nature
  {
    id: 4,
    text: "박물관, 유적지, 지역의 전통문화를 체험하는 게 흥미롭다",
    axis: 'C'
  },
  {
    id: 5,
    text: "한적한 자연 속에서 산책하거나 풍경을 감상하는 게 좋다",
    axis: 'C',
    isReverse: true
  },
  {
    id: 6,
    text: "유명한 카페거리나 미술관, 공연장을 가는 여행이 즐겁다",
    axis: 'C'
  },
  
  // F축: Foodie vs Experience
  {
    id: 7,
    text: "여행의 가장 큰 즐거움은 지역 맛집과 먹거리를 탐험하는 것이다",
    axis: 'F'
  },
  {
    id: 8,
    text: "새로운 문화나 놀이를 체험하는 게 음식보다 더 기대된다",
    axis: 'F',
    isReverse: true
  },
  {
    id: 9,
    text: "맛집에 가기 위해 줄을 서는 것도 괜찮다고 생각한다",
    axis: 'F'
  },
  
  // B축: Budget vs Luxury
  {
    id: 10,
    text: "여행 경비는 무조건 일정 예산 내로 맞추는 것이 중요하다",
    axis: 'B',
    isReverse: true
  },
  {
    id: 11,
    text: "특별한 경험을 위해 가격이 조금 비싸도 괜찮다",
    axis: 'B'
  },
  {
    id: 12,
    text: "여행을 자주 가려면 숙소나 식사는 가성비가 중요하다",
    axis: 'B',
    isReverse: true
  },
  
  // K축: Kid-Initiated vs Parent-Initiated
  {
    id: 13,
    text: "여행지를 정할 때 아이가 원하는 장소를 가장 먼저 고려한다",
    axis: 'K'
  },
  {
    id: 14,
    text: "아이가 좋아하는 테마파크, 동물원 등을 자주 포함한다",
    axis: 'K'
  },
  {
    id: 15,
    text: "여행 일정이나 스케줄도 아이의 피로도나 루틴을 고려해서 짠다",
    axis: 'K'
  },
  
  // 추가 신뢰도 측정용 역방향 문항들
  {
    id: 16,
    text: "여행에서는 스케줄 없이 그때그때 결정하는 게 더 자유롭다",
    axis: 'A',
    isReverse: true
  },
  {
    id: 17,
    text: "자연보다는 도시의 번화가나 쇼핑센터가 더 흥미롭다",
    axis: 'C'
  },
  {
    id: 18,
    text: "음식보다는 각종 체험 활동이 여행의 핵심이다",
    axis: 'F',
    isReverse: true
  },
  {
    id: 19,
    text: "예산을 초과하더라도 특별한 경험은 꼭 해봐야 한다",
    axis: 'B'
  },
  {
    id: 20,
    text: "어른이 계획한 일정이 아이에게도 더 유익하다",
    axis: 'K',
    isReverse: true
  }
];