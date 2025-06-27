import { Question } from '../types';

export const questions: Question[] = [
  // A축: Active vs Relaxing (4문항)
  {
    id: 1,
    text: "여행 중에는 다양한 액티비티와 체험을 많이 하고 싶다",
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
    text: "여행지에서는 하루 종일 바쁘게 움직이는 것이 좋다",
    axis: 'A'
  },
  {
    id: 4,
    text: "여행에서는 스케줄 없이 그때그때 결정하는 게 더 자유롭다",
    axis: 'A',
    isReverse: true
  },

  // C축: Culture vs Nature (3문항)
  {
    id: 5,
    text: "도시의 문화시설이나 쇼핑센터를 방문하는 것을 선호한다",
    axis: 'C'
  },
  {
    id: 6,
    text: "한적한 자연 속에서 산책하거나 풍경을 감상하는 게 좋다",
    axis: 'C',
    isReverse: true
  },
  {
    id: 7,
    text: "박물관이나 미술관 같은 문화공간 방문을 즐긴다",
    axis: 'C'
  },

  // F축: Foodie vs Experience (3문항)
  {
    id: 8,
    text: "여행의 가장 큰 즐거움은 맛있는 음식을 먹는 것이다",
    axis: 'F'
  },
  {
    id: 9,
    text: "새로운 문화나 놀이를 체험하는 게 음식보다 더 기대된다",
    axis: 'F',
    isReverse: true
  },
  {
    id: 10,
    text: "여행지에서는 유명한 맛집을 꼭 가봐야 한다",
    axis: 'F'
  }
];