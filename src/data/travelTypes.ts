import { TravelType } from '../types';

export const travelTypes: Record<string, TravelType> = {
  // 8가지 여행 유형 (3축 조합: A/R × C/N × F/E)
  
  'ACF': {
    code: 'ACF',
    title: '도시 미식 탐험가',
    description: '활기찬 도시에서 맛집을 찾아 헤매며 에너지 넘치는 미식 여행을 즐기는 타입',
    recommendations: ['홍대 맛집 투어', '부산 국제시장 먹거리', '전주 한옥마을 한정식']
  },
  'ACE': {
    code: 'ACE',
    title: '문화 체험러',
    description: '박물관, 갤러리, 공연을 즐기며 도시의 문화를 몸으로 체험하는 활동적인 타입',
    recommendations: ['경복궁 전통문화체험', '인사동 공예체험', '롯데월드타워 체험관']
  },
  'ANF': {
    code: 'ANF',
    title: '자연 미식가',
    description: '자연 속에서 지역 특산품과 맛집을 찾아다니는 활동적인 푸디 타입',
    recommendations: ['강릉 해변 횟집', '제주 흑돼지 맛집', '가평 잣향기 숲 맛집']
  },
  'ANE': {
    code: 'ANE',
    title: '아웃도어 모험가',
    description: '자연에서 다양한 액티비티와 체험을 즐기는 진정한 모험가 타입',
    recommendations: ['제주 패러글라이딩', '강원도 래프팅', '설악산 등반체험']
  },
  'RCF': {
    code: 'RCF',
    title: '도시 힐링 미식가',
    description: '도시의 조용한 카페와 맛집에서 여유롭게 휴식하며 미식을 즐기는 타입',
    recommendations: ['성수동 카페거리', '이태원 브런치', '압구정 파인다이닝']
  },
  'RCE': {
    code: 'RCE',
    title: '문화 감상러',
    description: '미술관이나 공연장에서 여유롭게 문화를 감상하고 체험하는 힐링 타입',
    recommendations: ['국립중앙박물관', '예술의전당', '덕수궁 돌담길']
  },
  'RNF': {
    code: 'RNF',
    title: '전원 힐링 미식가',
    description: '자연 속에서 여유롭게 쉬며 지역 특산품을 즐기는 평화로운 타입',
    recommendations: ['양평 두물머리', '보성 녹차밭', '담양 죽녹원']
  },
  'RNE': {
    code: 'RNE',
    title: '자연 힐링 체험러',
    description: '자연에서 조용히 휴식하며 간단한 체험 활동을 즐기는 평온한 타입',
    recommendations: ['제주 비자림', '순천만 습지', '안면도 자연휴양림']
  }
};