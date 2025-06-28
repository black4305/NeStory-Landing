// 실제 여행지 추천 데이터
// 유형별 × 지역별 여행지 매핑

export interface TravelDestination {
  name: string;
  location: string;
  description: string;
  suitableFor: string[]; // 여행 유형 코드들
  category: 'nature' | 'culture' | 'activity' | 'food' | 'relaxation';
  region: string; // 지역 (시/도)
  district?: string; // 시/군/구 (선택적)
}

export const travelDestinations: TravelDestination[] = [
  // 서울특별시
  {
    name: "경복궁",
    location: "서울 종로구",
    description: "조선 왕조의 정궁으로 전통 문화를 체험할 수 있는 곳",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "서울특별시",
    district: "종로구"
  },
  {
    name: "한강공원",
    location: "서울 여의도구",
    description: "가족 단위 피크닉과 휴식을 즐길 수 있는 도심 속 자연공간",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "서울특별시",
    district: "영등포구"
  },
  {
    name: "롯데월드",
    location: "서울 송파구",
    description: "실내외 놀이기구와 다양한 체험을 할 수 있는 테마파크",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "서울특별시",
    district: "송파구"
  },
  {
    name: "명동거리",
    location: "서울 중구",
    description: "쇼핑과 다양한 음식을 즐길 수 있는 관광 중심지",
    suitableFor: ["ACF", "RCF", "ANF", "RNF"],
    category: "food",
    region: "서울특별시",
    district: "중구"
  },

  // 부산광역시
  {
    name: "해운대 해수욕장",
    location: "부산 해운대구",
    description: "아름다운 해변과 다양한 해양 레저를 즐길 수 있는 곳",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "부산광역시",
    district: "해운대구"
  },
  {
    name: "감천문화마을",
    location: "부산 사하구",
    description: "알록달록한 벽화와 예술 작품이 있는 문화 관광지",
    suitableFor: ["ACF", "ACE", "RCF", "RCE"],
    category: "culture",
    region: "부산광역시",
    district: "사하구"
  },
  {
    name: "자갈치시장",
    location: "부산 중구",
    description: "신선한 해산물과 부산 특미를 맛볼 수 있는 전통시장",
    suitableFor: ["ACF", "RCF", "ANF", "RNF"],
    category: "food",
    region: "부산광역시",
    district: "중구"
  },

  // 제주도
  {
    name: "한라산 국립공원",
    location: "제주 서귀포시",
    description: "제주도의 상징인 한라산과 아름다운 자연경관",
    suitableFor: ["ANE", "RNE", "ACE", "RCE"],
    category: "nature",
    region: "제주특별자치도",
    district: "서귀포시"
  },
  {
    name: "성산일출봉",
    location: "제주 서귀포시",
    description: "일출과 함께 제주의 아름다운 경치를 감상할 수 있는 곳",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "제주특별자치도",
    district: "서귀포시"
  },
  {
    name: "제주민속촌",
    location: "제주 서귀포시",
    description: "제주 전통 문화와 생활상을 체험할 수 있는 민속마을",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "제주특별자치도",
    district: "서귀포시"
  },

  // 경기도
  {
    name: "에버랜드",
    location: "경기 용인시",
    description: "국내 최대 규모의 테마파크로 온 가족이 즐길 수 있는 곳",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "경기도",
    district: "용인시"
  },
  {
    name: "수원화성",
    location: "경기 수원시",
    description: "조선시대 성곽의 아름다움과 역사를 느낄 수 있는 UNESCO 세계유산",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "경기도",
    district: "수원시"
  },
  {
    name: "가평 자라섬",
    location: "경기 가평군",
    description: "아름다운 강변 풍경과 캠핑을 즐길 수 있는 자연휴양지",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "경기도",
    district: "가평군"
  },

  // 강원도
  {
    name: "설악산 국립공원",
    location: "강원 속초시",
    description: "웅장한 산세와 아름다운 자연경관을 자랑하는 국립공원",
    suitableFor: ["ANE", "RNE", "ACE", "RCE"],
    category: "nature",
    region: "강원도",
    district: "속초시"
  },
  {
    name: "남이섬",
    location: "강원 춘천시",
    description: "아름다운 자연과 문화가 어우러진 섬",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "강원도",
    district: "춘천시"
  },
  {
    name: "대관령 양떼목장",
    location: "강원 평창군",
    description: "목가적인 풍경과 동물 체험을 할 수 있는 목장",
    suitableFor: ["ANE", "RNE", "ACE", "RCE"],
    category: "activity",
    region: "강원도",
    district: "평창군"
  },

  // 전라남도
  {
    name: "순천만 국가정원",
    location: "전남 순천시",
    description: "갯벌과 갈대밭이 어우러진 생태공원",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "전라남도",
    district: "순천시"
  },
  {
    name: "담양 죽녹원",
    location: "전남 담양군",
    description: "시원한 대나무 숲길과 힐링을 즐길 수 있는 곳",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "전라남도",
    district: "담양군"
  },
  {
    name: "여수 해상케이블카",
    location: "전남 여수시",
    description: "바다 위를 날아가는 듯한 케이블카 체험과 아름다운 전망",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "전라남도",
    district: "여수시"
  },

  // 전라북도
  {
    name: "전주한옥마을",
    location: "전북 전주시",
    description: "전통 한옥과 맛있는 전주 비빔밥을 즐길 수 있는 곳",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "전라북도",
    district: "전주시"
  },
  {
    name: "내장산 국립공원",
    location: "전북 정읍시",
    description: "단풍으로 유명한 아름다운 산악 국립공원",
    suitableFor: ["ANE", "RNE", "ACE", "RCE"],
    category: "nature",
    region: "전라북도",
    district: "정읍시"
  },

  // 경상남도
  {
    name: "통영 케이블카",
    location: "경남 통영시",
    description: "아름다운 다도해 풍경을 한눈에 볼 수 있는 케이블카",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "경상남도",
    district: "통영시"
  },
  {
    name: "하동 녹차밭",
    location: "경남 하동군",
    description: "푸른 차밭과 함께 차 문화 체험을 할 수 있는 곳",
    suitableFor: ["RNF", "RNE", "ACF", "ACE"],
    category: "nature",
    region: "경상남도",
    district: "하동군"
  },

  // 경상북도
  {
    name: "경주 불국사",
    location: "경북 경주시",
    description: "신라 문화의 정수를 보여주는 UNESCO 세계유산",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "경상북도",
    district: "경주시"
  },
  {
    name: "안동 하회마을",
    location: "경북 안동시",
    description: "조선시대 전통 마을의 모습을 간직한 UNESCO 세계유산",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "경상북도",
    district: "안동시"
  },

  // 충청남도
  {
    name: "태안 꽃지해수욕장",
    location: "충남 태안군",
    description: "아름다운 일몰과 해변을 즐길 수 있는 서해안 대표 해수욕장",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "충청남도",
    district: "태안군"
  },
  {
    name: "부여 백제문화단지",
    location: "충남 부여군",
    description: "백제 문화의 찬란함을 체험할 수 있는 역사문화공간",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "충청남도",
    district: "부여군"
  },

  // 충청북도
  {
    name: "단양 도담삼봉",
    location: "충북 단양군",
    description: "남한강에 우뚝 선 기암절벽과 아름다운 자연경관",
    suitableFor: ["ANF", "ANE", "RNF", "RNE"],
    category: "nature",
    region: "충청북도",
    district: "단양군"
  },
  {
    name: "청주 직지문화공원",
    location: "충북 청주시",
    description: "세계 최초 금속활자본 직지의 역사를 배울 수 있는 곳",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "충청북도",
    district: "청주시"
  }
];

// 여행 유형별 추천 함수
export const getRecommendationsByType = (
  travelType: string, 
  userRegion?: string, 
  maxResults: number = 5
): TravelDestination[] => {
  // 1. 사용자 여행 유형에 맞는 목적지 필터링
  let filteredDestinations = travelDestinations.filter(dest => 
    dest.suitableFor.includes(travelType)
  );

  // 2. 사용자 지역 우선순위 적용 (같은 지역 우선)
  if (userRegion) {
    const sameRegion = filteredDestinations.filter(dest => dest.region === userRegion);
    const otherRegions = filteredDestinations.filter(dest => dest.region !== userRegion);
    
    // 같은 지역 50%, 다른 지역 50% 비율로 섞기
    const sameRegionCount = Math.min(Math.ceil(maxResults * 0.3), sameRegion.length);
    const otherRegionCount = maxResults - sameRegionCount;
    
    filteredDestinations = [
      ...sameRegion.slice(0, sameRegionCount),
      ...otherRegions.slice(0, otherRegionCount)
    ];
  }

  // 3. 결과 개수 제한 및 셔플
  const shuffled = filteredDestinations
    .sort(() => Math.random() - 0.5)
    .slice(0, maxResults);

  return shuffled;
};

// 지역별 인기 여행지 추천
export const getPopularDestinationsByRegion = (region: string): TravelDestination[] => {
  return travelDestinations
    .filter(dest => dest.region === region)
    .slice(0, 3);
};

// 카테고리별 추천
export const getDestinationsByCategory = (
  category: string, 
  maxResults: number = 3
): TravelDestination[] => {
  return travelDestinations
    .filter(dest => dest.category === category)
    .sort(() => Math.random() - 0.5)
    .slice(0, maxResults);
};