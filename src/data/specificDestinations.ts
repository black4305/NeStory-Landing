// 실제 여행지 정보 (구체적인 장소명으로 변경)
export interface SpecificDestination {
  name: string;
  category: string;
  description: string;
  travelType: string[]; // 어떤 여행 유형에 맞는지
  season: string[];
  duration: string;
  familyFriendly: boolean;
  cost: 'low' | 'medium' | 'high';
}

export interface RegionalDestinations {
  region: string;
  destinations: SpecificDestination[];
}

export const specificDestinations: Record<string, RegionalDestinations> = {
  // 전라남도 여수
  '전남 여수시': {
    region: '전남 여수시',
    destinations: [
      {
        name: '돌산공원 해상케이블카',
        category: '케이블카/전망',
        description: '바다 위를 가로지르는 케이블카에서 여수 앞바다의 아름다운 전경을 감상',
        travelType: ['ACF', 'ACE', 'NCF', 'NCE'],
        season: ['봄', '여름', '가을'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'medium'
      },
      {
        name: '만성리 검은모래해변',
        category: '해변/물놀이',
        description: '독특한 검은 모래와 얕은 수심으로 아이들이 안전하게 물놀이할 수 있는 해변',
        travelType: ['ARF', 'ARE', 'NRF', 'NRE'],
        season: ['여름'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '여수 아쿠아플라넷',
        category: '수족관/체험',
        description: '국내 최대 규모의 해양생물 체험관, 벨루가와 바이칼물범 만나기',
        travelType: ['ACF', 'ACE', 'ARF', 'ARE'],
        season: ['사계절'],
        duration: '3-4시간',
        familyFriendly: true,
        cost: 'high'
      },
      {
        name: '오동도 동백꽃축제장',
        category: '자연/산책',
        description: '겨울철 붉은 동백꽃이 만개하는 섬, 가족과 함께 걷기 좋은 산책로',
        travelType: ['NCF', 'NCE', 'NRF', 'NRE'],
        season: ['겨울', '봄'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '여수 엑스포 해양공원',
        category: '테마파크/체험',
        description: '해양 바이오산업과 기후환경을 체험할 수 있는 복합 문화공간',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'medium'
      }
    ]
  },

  // 전라남도 목포
  '전남 목포시': {
    region: '전남 목포시',
    destinations: [
      {
        name: '유달산 조각공원',
        category: '산/문화',
        description: '목포 시내가 한눈에 보이는 유달산 정상의 야외 조각 전시장',
        travelType: ['NCF', 'NCE', 'ACF', 'ACE'],
        season: ['봄', '가을'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '목포 자연사박물관',
        category: '박물관/체험',
        description: '공룡 화석과 바다생물 표본을 볼 수 있는 아이들 교육에 좋은 박물관',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '2시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '삼학도 출렁다리',
        category: '다리/산책',
        description: '바다 위에 설치된 긴 출렁다리, 스릴과 경치를 동시에 즐길 수 있음',
        travelType: ['ACF', 'ACE', 'ARF', 'ARE'],
        season: ['봄', '여름', '가을'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '목포 근대역사관',
        category: '박물관/문화',
        description: '일제강점기 건물을 활용한 근대사 체험 박물관',
        travelType: ['NCF', 'NCE'],
        season: ['사계절'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'low'
      }
    ]
  },

  // 경기도 수원
  '경기 수원시': {
    region: '경기 수원시',
    destinations: [
      {
        name: '수원화성 성곽길',
        category: '문화재/산책',
        description: '유네스코 세계문화유산 수원화성을 따라 걷는 역사 체험 코스',
        travelType: ['NCF', 'NCE', 'ACF', 'ACE'],
        season: ['봄', '가을'],
        duration: '3-4시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '에버랜드 테마파크',
        category: '놀이공원',
        description: '국내 최대 테마파크, 사파리와 다양한 놀이기구로 온 가족이 즐길 수 있음',
        travelType: ['ACF', 'ACE', 'ARF', 'ARE'],
        season: ['사계절'],
        duration: '하루종일',
        familyFriendly: true,
        cost: 'high'
      },
      {
        name: '광교호수공원 음악분수',
        category: '공원/분수',
        description: '저녁에 펼쳐지는 음악분수쇼와 넓은 호수공원에서의 산책',
        travelType: ['NRF', 'NRE', 'ARF', 'ARE'],
        season: ['봄', '여름', '가을'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '한국민속촌',
        category: '문화체험',
        description: '조선시대 생활상을 재현한 야외 박물관, 전통 공연과 체험 프로그램',
        travelType: ['NCF', 'NCE'],
        season: ['봄', '가을'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'medium'
      }
    ]
  },

  // 부산 해운대구
  '부산 해운대구': {
    region: '부산 해운대구',
    destinations: [
      {
        name: '해운대 블루라인파크 해변열차',
        category: '체험열차',
        description: '동해남부선 폐선을 활용한 해안열차, 탁 트인 바다 전망',
        travelType: ['ACF', 'ACE', 'NCF', 'NCE'],
        season: ['사계절'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'medium'
      },
      {
        name: '해운대해수욕장',
        category: '해변/물놀이',
        description: '국내 대표 해수욕장, 모래놀이와 해수욕을 즐길 수 있는 가족 해변',
        travelType: ['ARF', 'ARE', 'NRF', 'NRE'],
        season: ['여름'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '부산 아쿠아리움',
        category: '수족관',
        description: '해운대 해변가 대형 수족관, 80m 해저터널과 다양한 해양생물',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'high'
      },
      {
        name: '달맞이길 벚꽃터널',
        category: '드라이브/산책',
        description: '봄철 벚꽃이 터널을 이루는 아름다운 드라이브 코스',
        travelType: ['NCF', 'NCE', 'NRF', 'NRE'],
        season: ['봄'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'low'
      }
    ]
  },

  // 서울 강남구
  '서울 강남구': {
    region: '서울 강남구',
    destinations: [
      {
        name: '한강공원 반포 무지개분수',
        category: '공원/분수',
        description: '저녁마다 펼쳐지는 음악분수쇼, 가족 피크닉 장소로 인기',
        travelType: ['NRF', 'NRE', 'ARF', 'ARE'],
        season: ['봄', '여름', '가을'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '코엑스 아쿠아리움',
        category: '수족관',
        description: '도심 속 대형 수족관, 실내에서 즐기는 해양생물 체험',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '2-3시간',
        familyFriendly: true,
        cost: 'high'
      },
      {
        name: '선릉과 정릉 왕릉공원',
        category: '문화재/공원',
        description: '조선왕릉의 고즈넉한 숲길, 도심 속 힐링 산책 코스',
        travelType: ['NCF', 'NCE', 'NRF', 'NRE'],
        season: ['봄', '가을'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '롯데월드타워 서울스카이',
        category: '전망대',
        description: '세계 6위 높이의 전망대에서 서울 전경을 360도로 감상',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'high'
      }
    ]
  },

  // 제주도
  '제주 제주시': {
    region: '제주 제주시',
    destinations: [
      {
        name: '한라산 어리목탐방로',
        category: '등산/트레킹',
        description: '가족이 함께 오를 수 있는 완만한 한라산 코스, 제주의 자연 만끽',
        travelType: ['NCF', 'NCE', 'ACF', 'ACE'],
        season: ['봄', '가을'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '제주 아쿠아플라넷',
        category: '수족관',
        description: '아시아 최대 규모 수족관, 고래상어와 다양한 해양생물 관찰',
        travelType: ['ACF', 'ACE'],
        season: ['사계절'],
        duration: '3-4시간',
        familyFriendly: true,
        cost: 'high'
      },
      {
        name: '용두암 해안산책로',
        category: '자연/산책',
        description: '제주의 대표 명소 용두암 주변 해안 산책로, 일출 명소',
        travelType: ['NCF', 'NCE', 'NRF', 'NRE'],
        season: ['사계절'],
        duration: '1-2시간',
        familyFriendly: true,
        cost: 'low'
      },
      {
        name: '협재해수욕장',
        category: '해변/물놀이',
        description: '에메랄드빛 바다와 하얀 모래사장, 아이들 물놀이에 최적',
        travelType: ['ARF', 'ARE', 'NRF', 'NRE'],
        season: ['여름'],
        duration: '반나절',
        familyFriendly: true,
        cost: 'low'
      }
    ]
  }
};

// 여행 유형별 맞춤 추천 함수
export const getRecommendationsByType = (
  region: string, 
  travelType: string, 
  hasMarketingConsent: boolean = false
): SpecificDestination[] => {
  if (!hasMarketingConsent) {
    return []; // 마케팅 동의 안 한 경우 추천 안 함
  }

  const regionalData = specificDestinations[region];
  if (!regionalData) {
    return [];
  }

  // 여행 유형에 맞는 목적지 필터링
  const matchedDestinations = regionalData.destinations.filter(dest => 
    dest.travelType.includes(travelType)
  );

  // 최대 3개까지만 추천
  return matchedDestinations.slice(0, 3);
};

// 지역별 전체 목적지 목록
export const getAllDestinationsByRegion = (region: string): SpecificDestination[] => {
  const regionalData = specificDestinations[region];
  return regionalData ? regionalData.destinations : [];
};

// 사용 가능한 지역 목록
export const getAvailableRegions = (): string[] => {
  return Object.keys(specificDestinations);
};