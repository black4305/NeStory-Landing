export interface Character {
  emoji: string;
  name: string;
  description: string;
  personality: string;
  celebrity: string;
  funFact: string;
  specialItem: string; // 고유 아이템/특성
  trait: string; // 간단한 특성 설명
}

export const characters: Record<string, Character> = {
  'ACF': {
    emoji: '🍜',
    name: '도시 미식 탐험가',
    description: '도시 곳곳의 숨은 맛집을 찾아 헤매는 활동적인 푸디',
    personality: '호기심 많고 에너지 넘치며, 새로운 맛을 발견하는 것이 최고의 즐거움',
    celebrity: '백종원 가족',
    funFact: '하루에 맛집 5곳은 기본, 인스타그램은 음식 사진으로 가득!',
    specialItem: '🍽️ 맛집 지도 & 웨이팅 앱',
    trait: '항상 다음 맛집 리스트를 준비하고, 줄 서는 것도 마다하지 않는 진성 푸디'
  },
  'ACE': {
    emoji: '🎭',
    name: '문화 체험러',
    description: '박물관부터 공연장까지, 도시 문화를 몸으로 체험하는 활동파',
    personality: '지적 호기심이 왕성하고 새로운 문화 경험을 추구하는 활동적인 스타일',
    celebrity: '유재석 가족',
    funFact: '전시회 오프닝부터 문화센터 강좌까지 놓치지 않는 문화계 인싸!',
    specialItem: '🎫 문화생활 패스 & 체험 키트',
    trait: '박물관 연간회원권 보유, 새로운 체험 프로그램이 있으면 무조건 도전'
  },
  'ANF': {
    emoji: '🏕️',
    name: '자연 미식가',
    description: '자연 속에서 지역 특산품을 맛보며 활동적인 시간을 보내는 타입',
    personality: '자연을 사랑하면서도 맛있는 음식을 놓치지 않는 균형잡힌 성격',
    celebrity: '이동국 가족',
    funFact: '캠핑장 근처 맛집은 모두 섭렵, 자연 속에서 먹는 음식이 더 맛있다고 믿음!',
    specialItem: '🎒 아웃도어 쿠킹 세트 & 로컬 맛집 앱',
    trait: '백패킹할 때도 맛있는 음식 포기 안함, 자연과 미식을 모두 잡는 욕심쟁이'
  },
  'ANE': {
    emoji: '⛰️',
    name: '아웃도어 모험가',
    description: '자연에서 극한의 액티비티를 즐기는 진정한 모험가',
    personality: '도전정신이 강하고 위험을 두려워하지 않는 진취적인 성격',
    celebrity: '김병만 가족',
    funFact: '번지점프부터 암벽등반까지, 하지 못한 익스트림 스포츠가 없음!',
    specialItem: '🧗‍♂️ 아웃도어 장비 세트 & 익스트림 스포츠 예약앱',
    trait: '장비는 항상 풀세트 보유, 날씨가 나빠도 모험을 포기하지 않는 강인함'
  },
  'RCF': {
    emoji: '☕',
    name: '도시 힐링 미식가',
    description: '도시의 한적한 카페와 맛집에서 여유를 즐기는 힐링족',
    personality: '여유롭고 세련되며, 분위기 좋은 곳에서 맛있는 음식을 천천히 즐기는 스타일',
    celebrity: '이효리 가족',
    funFact: '브런치 맛집은 다 꿰고 있고, 예약제 레스토랑을 선호하는 슬로우 라이프 추구자!',
    specialItem: '🥐 브런치 맛집 리스트 & 프리미엄 예약 앱',
    trait: '분위기 좋은 카페에서 몇 시간도 앉아있을 수 있는 여유, 맛과 분위기 둘 다 놓치지 않음'
  },
  'RCE': {
    emoji: '🎨',
    name: '문화 감상러',
    description: '미술관과 공연장에서 조용히 문화를 감상하는 품격 있는 타입',
    personality: '차분하고 지적이며, 깊이 있는 문화 경험을 통해 내적 성장을 추구',
    celebrity: '정우성 가족',
    funFact: '전시 도록은 모두 수집, 클래식 콘서트 시즌권 보유한 진정한 문화인!',
    specialItem: '🎼 문화 예술 시즌권 & 도슨트 예약 서비스',
    trait: '조용한 갤러리에서 몇 시간도 감상할 수 있는 집중력, 예술에 대한 깊은 이해와 애정'
  },
  'RNF': {
    emoji: '🌾',
    name: '전원 힐링 미식가',
    description: '자연 속에서 평화롭게 쉬며 지역 특산품을 즐기는 힐링족',
    personality: '평온하고 자연스러우며, 서두르지 않고 자연의 리듬에 맞춰 살아가는 스타일',
    celebrity: '이서진 가족',
    funFact: '농장 직영 레스토랑과 전원 카페가 최애, 제철 음식의 소중함을 아는 슬로우 푸드 신봉자!',
    specialItem: '🥬 농장투어 패스 & 제철 식재료 앱',
    trait: '자연에서 나는 재료로 만든 음식만 최고로 여기고, 계절의 변화를 음식으로 느끼는 감성'
  },
  'RNE': {
    emoji: '🌿',
    name: '자연 힐링 체험러',
    description: '자연에서 조용히 휴식하며 힐링 체험을 즐기는 평온한 타입',
    personality: '내성적이고 사색적이며, 자연과의 교감을 통해 마음의 평화를 찾는 성격',
    celebrity: '공유 가족',
    funFact: '명상과 요가는 기본, 자연에서 하는 모든 힐링 프로그램을 섭렵한 힐링 마스터!',
    specialItem: '🧘‍♀️ 명상 매트 & 힐링 프로그램 앱',
    trait: '새소리와 바람소리만으로도 충분히 행복하고, 디지털 디톡스를 정기적으로 실행하는 자연인'
  }
};