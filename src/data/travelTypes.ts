import { TravelType } from '../types';

export const travelTypes: Record<string, TravelType> = {
  // A-C-F-B 조합 (활동적+문화+미식)
  'ACFBK': {
    code: 'ACFBK',
    title: '활동적 도시 미식가 · 가성비 · 아이주도형',
    description: '빠르게 즐기고, 핫플 맛집과 키즈 액티비티를 병행하는 여행을 선호합니다.',
    recommendations: ['파주 출판도시+전통시장', '용인 민속촌+근처 브런치']
  },
  'ACFBP': {
    code: 'ACFBP',
    title: '활동적 도시 미식가 · 가성비 · 부모주도형',
    description: '어른 주도로 효율적인 도시 위주 맛집 탐방을 선호합니다.',
    recommendations: ['전주 한옥마을+한정식', '서울 미식투어']
  },
  'ACFLK': {
    code: 'ACFLK',
    title: '활동적 도시 미식가 · 프리미엄 · 아이주도형',
    description: '아이 중심의 고급 경험(키즈 클래스 + 맛집)을 선호합니다.',
    recommendations: ['압구정 키즈쿠킹+고급다이닝', '제주 아쿠아플라넷+호텔뷔페']
  },
  'ACFLP': {
    code: 'ACFLP',
    title: '활동적 도시 미식가 · 프리미엄 · 부모주도형',
    description: '고급 레스토랑과 문화 체험을 중시하는 어른 중심 여행을 선호합니다.',
    recommendations: ['강남 파인다이닝+갤러리', '부산 해운대 럭셔리 리조트']
  },

  // A-C-E-B 조합 (활동적+문화+체험)
  'ACEBK': {
    code: 'ACEBK',
    title: '활동적 도시 체험러 · 가성비 · 아이주도형',
    description: '아이와 함께 다양한 도시 체험 활동을 저렴하게 즐기는 여행을 선호합니다.',
    recommendations: ['서울 키즈박물관+체험센터', '인천 차이나타운+만들기 체험']
  },
  'ACEBP': {
    code: 'ACEBP',
    title: '활동적 도시 체험러 · 가성비 · 부모주도형',
    description: '합리적 가격으로 문화 체험과 액티비티를 즐기는 여행을 선호합니다.',
    recommendations: ['경주 역사 체험+전통공예', '전주 한복 체험+전통문화관']
  },
  'ACELK': {
    code: 'ACELK',
    title: '활동적 도시 체험러 · 프리미엄 · 아이주도형',
    description: '아이를 위한 고급 체험 프로그램과 액티비티를 중시하는 여행을 선호합니다.',
    recommendations: ['롯데월드타워+키즈 프리미엄 체험', '제주 승마체험+리조트']
  },
  'ACELP': {
    code: 'ACELP',
    title: '활동적 도시 체험러 · 프리미엄 · 부모주도형',
    description: '고급 문화 체험과 특별한 액티비티를 추구하는 여행을 선호합니다.',
    recommendations: ['북촌 한옥스테이+프리미엄 투어', '제주 골프+스파 리조트']
  },

  // A-N-F-B 조합 (활동적+자연+미식)
  'ANFBK': {
    code: 'ANFBK',
    title: '활동적 자연 미식가 · 가성비 · 아이주도형',
    description: '자연에서 뛰놀며 지역 맛집을 찾는 아이 중심 여행을 선호합니다.',
    recommendations: ['가평 자라섬+맛집투어', '춘천 남이섬+닭갈비']
  },
  'ANFBP': {
    code: 'ANFBP',
    title: '활동적 자연 미식가 · 가성비 · 부모주도형',
    description: '자연 속에서 지역 특산품과 맛집을 탐방하는 여행을 선호합니다.',
    recommendations: ['강릉 해변+횟집투어', '정선 산채정식+래프팅']
  },
  'ANFLK': {
    code: 'ANFLK',
    title: '활동적 자연 미식가 · 프리미엄 · 아이주도형',
    description: '고급 자연 리조트에서 아이와 함께 특별한 식도락을 즐기는 여행을 선호합니다.',
    recommendations: ['평창 리조트+한우 프리미엄', '제주 올레길+흑돼지 고급정식']
  },
  'ANFLP': {
    code: 'ANFLP',
    title: '활동적 자연 미식가 · 프리미엄 · 부모주도형',
    description: '자연 속 고급 레스토랑과 특별한 미식 경험을 추구하는 여행을 선호합니다.',
    recommendations: ['지리산 한정식+등산', '울릉도 해산물 특선+트레킹']
  },

  // A-N-E-B 조합 (활동적+자연+체험)
  'ANEBK': {
    code: 'ANEBK',
    title: '활동적 자연 체험러 · 가성비 · 아이주도형',
    description: '자연에서 뛰노는 아이 중심 체험 위주 구성을 선호합니다.',
    recommendations: ['철원 고석정+체험농장', '강원 계곡 물놀이+감자수확']
  },
  'ANEBP': {
    code: 'ANEBP',
    title: '활동적 자연 체험러 · 가성비 · 부모주도형',
    description: '자연에서 가족이 함께 할 수 있는 체험 활동을 중시하는 여행을 선호합니다.',
    recommendations: ['보성 녹차밭+차 만들기 체험', '안동 하회마을+전통놀이']
  },
  'ANELK': {
    code: 'ANELK',
    title: '활동적 자연 체험러 · 프리미엄 · 아이주도형',
    description: '아이를 위한 고급 자연 체험과 모험 활동을 추구하는 여행을 선호합니다.',
    recommendations: ['제주 승마+글램핑', '평창 스키+프리미엄 펜션']
  },
  'ANELP': {
    code: 'ANELP',
    title: '활동적 자연 체험러 · 프리미엄 · 부모주도형',
    description: '고급 자연 환경에서 특별한 체험과 모험을 즐기는 여행을 선호합니다.',
    recommendations: ['설악산 케이블카+럭셔리 펜션', '한라산 등반+제주 프리미엄 리조트']
  },

  // R-C-F-B 조합 (휴식형+문화+미식)
  'RCFBK': {
    code: 'RCFBK',
    title: '휴식형 도시 미식가 · 가성비 · 아이주도형',
    description: '도심 카페+아이 중심의 느긋한 여행을 선호합니다.',
    recommendations: ['마포 키즈카페+합정 브런치', '대전 갤러리+놀이터']
  },
  'RCFBP': {
    code: 'RCFBP',
    title: '휴식형 도시 미식가 · 가성비 · 부모주도형',
    description: '도심에서 여유롭게 카페와 맛집을 즐기는 여행을 선호합니다.',
    recommendations: ['홍대 카페투어+맛집', '부산 감천문화마을+해산물']
  },
  'RCFLK': {
    code: 'RCFLK',
    title: '휴식형 도시 미식가 · 프리미엄 · 아이주도형',
    description: '아이와 함께 고급 도심 레스토랑에서 여유로운 시간을 보내는 여행을 선호합니다.',
    recommendations: ['청담동 키즈 프렌들리 파인다이닝', '해운대 호텔 뷔페+해변산책']
  },
  'RCFLP': {
    code: 'RCFLP',
    title: '휴식형 도시 미식가 · 프리미엄 · 부모주도형',
    description: '고급 도심 레스토랑에서 여유롭고 품격 있는 식도락을 즐기는 여행을 선호합니다.',
    recommendations: ['신사동 파인다이닝+갤러리', '부산 센텀시티 호텔 스테이']
  },

  // R-C-E-B 조합 (휴식형+문화+체험)
  'RCEBK': {
    code: 'RCEBK',
    title: '휴식형 도시 체험러 · 가성비 · 아이주도형',
    description: '아이와 함께 여유롭게 도시 문화를 체험하는 여행을 선호합니다.',
    recommendations: ['서울 북촌 한옥마을+전통놀이', '인사동 전통차+공예체험']
  },
  'RCEBP': {
    code: 'RCEBP',
    title: '휴식형 도시 체험러 · 가성비 · 부모주도형',
    description: '여유롭게 문화 체험과 도심 산책을 즐기는 여행을 선호합니다.',
    recommendations: ['경복궁+전통문화체험', '부산 국제시장+문화투어']
  },
  'RCELK': {
    code: 'RCELK',
    title: '휴식형 도시 체험러 · 프리미엄 · 아이주도형',
    description: '아이를 위한 고급 문화 체험을 여유롭게 즐기는 여행을 선호합니다.',
    recommendations: ['국립중앙박물관+키즈 프로그램', '롯데콘서트홀+어린이 공연']
  },
  'RCELP': {
    code: 'RCELP',
    title: '휴식형 도시 체험러 · 프리미엄 · 부모주도형',
    description: '고급 문화 예술 체험을 여유롭게 즐기는 여행을 선호합니다.',
    recommendations: ['예술의전당+클래식 공연', '덕수궁+전통 차 체험']
  },

  // R-N-F-B 조합 (휴식형+자연+미식)
  'RNFBK': {
    code: 'RNFBK',
    title: '휴식형 자연 미식가 · 가성비 · 아이주도형',
    description: '자연 속 쉬면서 맛집 찾는 여행을 선호합니다.',
    recommendations: ['가평 잣향기 숲+칼국수집', '남양주 슬로우푸드+하천놀이']
  },
  'RNFBP': {
    code: 'RNFBP',
    title: '휴식형 자연 미식가 · 가성비 · 부모주도형',
    description: '자연 속에서 여유롭게 지역 맛집을 탐방하는 여행을 선호합니다.',
    recommendations: ['양평 두물머리+닭갈비', '괴산 산채정식+계곡휴식']
  },
  'RNFLK': {
    code: 'RNFLK',
    title: '휴식형 자연 미식가 · 프리미엄 · 아이주도형',
    description: '고급 자연 리조트에서 아이와 함께 여유로운 식도락을 즐기는 여행을 선호합니다.',
    recommendations: ['제주 한림 리조트+해산물', '평창 알펜시아+한우정식']
  },
  'RNFLP': {
    code: 'RNFLP',
    title: '휴식형 자연 미식가 · 프리미엄 · 부모주도형',
    description: '자연 속 고급 레스토랑에서 여유로운 미식을 즐기는 여행을 선호합니다.',
    recommendations: ['강릉 경포대 리조트+해산물 특선', '지리산 펜션+산채한정식']
  },

  // R-N-E-B 조합 (휴식형+자연+체험)
  'RNEBK': {
    code: 'RNEBK',
    title: '휴식형 자연 체험러 · 가성비 · 아이주도형',
    description: '자연에서 아이와 함께 여유롭게 체험 활동을 즐기는 여행을 선호합니다.',
    recommendations: ['포천 산정호수+딸기체험', '화천 산천어축제+얼음낚시']
  },
  'RNEBP': {
    code: 'RNEBP',
    title: '휴식형 자연 체험러 · 가성비 · 부모주도형',
    description: '자연에서 가족이 함께 여유롭게 체험할 수 있는 여행을 선호합니다.',
    recommendations: ['임실 치즈마을+체험', '고창 청보리밭+농촌체험']
  },
  'RNELK': {
    code: 'RNELK',
    title: '휴식형 자연 체험러 · 프리미엄 · 아이주도형',
    description: '고급 자연 환경에서 아이를 위한 특별한 체험을 여유롭게 즐기는 여행을 선호합니다.',
    recommendations: ['제주 비자림+승마체험', '양평 프리미엄 글램핑+자연체험']
  },
  'RNELP': {
    code: 'RNELP',
    title: '휴식형 자연 체험러 · 프리미엄 · 부모주도형',
    description: '고급 자연 환경에서 특별한 체험을 여유롭게 즐기는 여행을 선호합니다.',
    recommendations: ['설악산 케이블카+리조트', '울진 죽변 펜션+해양체험']
  }
};