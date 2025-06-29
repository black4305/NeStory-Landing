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
  // 서울특별시 (대폭 확충)
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
    name: "창덕궁",
    location: "서울 종로구",
    description: "아름다운 후원과 조선왕궁의 건축미를 감상할 수 있는 UNESCO 세계유산",
    suitableFor: ["RCF", "RCE", "ACF", "ACE"],
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
  {
    name: "N서울타워",
    location: "서울 용산구",
    description: "서울 전경을 한눈에 볼 수 있는 대표적인 전망 명소",
    suitableFor: ["RCE", "ACE", "RCF", "ACF"],
    category: "culture",
    region: "서울특별시",
    district: "용산구"
  },
  {
    name: "홍대 놀이터",
    location: "서울 마포구",
    description: "젊은 문화와 다양한 먹거리를 즐길 수 있는 핫플레이스",
    suitableFor: ["ACF", "ANF", "ACE", "ANE"],
    category: "food",
    region: "서울특별시",
    district: "마포구"
  },
  {
    name: "서울숲",
    location: "서울 성동구",
    description: "도심 속에서 자연을 만끽할 수 있는 대형 공원",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "서울특별시",
    district: "성동구"
  },
  {
    name: "국립중앙박물관",
    location: "서울 용산구",
    description: "한국 역사와 문화를 체계적으로 배울 수 있는 국가대표 박물관",
    suitableFor: ["RCE", "ACE", "RCF", "ACF"],
    category: "culture",
    region: "서울특별시",
    district: "용산구"
  },
  {
    name: "광화문광장",
    location: "서울 종로구",
    description: "역사와 현대가 공존하는 서울의 중심 광장",
    suitableFor: ["RCE", "ACE", "RCF", "ACF"],
    category: "culture",
    region: "서울특별시",
    district: "종로구"
  },
  {
    name: "올림픽공원",
    location: "서울 송파구",
    description: "넓은 잔디밭과 다양한 조각품이 있는 가족 휴식공간",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "서울특별시",
    district: "송파구"
  },
  {
    name: "동대문 디자인플라자",
    location: "서울 중구",
    description: "미래적 건축미와 다양한 전시를 감상할 수 있는 복합문화공간",
    suitableFor: ["ACE", "RCE", "ACF", "RCF"],
    category: "culture",
    region: "서울특별시",
    district: "중구"
  },

  // 부산광역시 (확충)
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
    name: "광안리 해수욕장",
    location: "부산 수영구",
    description: "야경이 아름다운 해수욕장과 다양한 먹거리가 있는 곳",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "부산광역시",
    district: "수영구"
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
  {
    name: "태종대",
    location: "부산 영도구",
    description: "절벽과 바다가 어우러진 부산의 대표적인 자연경관지",
    suitableFor: ["RNE", "ANE", "RNF", "ANF"],
    category: "nature",
    region: "부산광역시",
    district: "영도구"
  },
  {
    name: "부산 아쿠아리움",
    location: "부산 해운대구",
    description: "다양한 해양생물을 관찰할 수 있는 대형 수족관",
    suitableFor: ["ACE", "RCE", "ANE", "RNE"],
    category: "activity",
    region: "부산광역시",
    district: "해운대구"
  },
  {
    name: "송도 해상케이블카",
    location: "부산 서구",
    description: "바다 위를 가로지르는 케이블카에서 부산 전경을 감상",
    suitableFor: ["ACE", "RCE", "ANE", "RNE"],
    category: "activity",
    region: "부산광역시",
    district: "서구"
  },

  // 인천광역시 (신규 추가)
  {
    name: "인천 차이나타운",
    location: "인천 중구",
    description: "한국 최대 규모의 차이나타운에서 중화요리와 문화를 체험",
    suitableFor: ["ACF", "RCF", "ACE", "RCE"],
    category: "culture",
    region: "인천광역시",
    district: "중구"
  },
  {
    name: "월미도",
    location: "인천 중구",
    description: "놀이기구와 해안산책로가 있는 인천의 대표 관광지",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "인천광역시",
    district: "중구"
  },
  {
    name: "송도 센트럴파크",
    location: "인천 연수구",
    description: "첨단 국제도시 송도의 대형 도시공원",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "인천광역시",
    district: "연수구"
  },
  {
    name: "인천대공원",
    location: "인천 남동구",
    description: "가족 단위로 즐길 수 있는 대형 공원과 동물원",
    suitableFor: ["RNE", "ANE", "RNF", "ANF"],
    category: "nature",
    region: "인천광역시",
    district: "남동구"
  },
  {
    name: "을왕리 해수욕장",
    location: "인천 중구",
    description: "수도권에서 가까운 서해안의 아름다운 해수욕장",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "인천광역시",
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

  // 경기도 (대폭 확충)
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
    name: "캐리비안베이",
    location: "경기 용인시",
    description: "사계절 물놀이를 즐길 수 있는 대형 워터파크",
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
  {
    name: "남양주 다산생태공원",
    location: "경기 남양주시",
    description: "가족 단위 산책과 자연체험을 할 수 있는 생태공원",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "경기도",
    district: "남양주시"
  },
  {
    name: "화성 우음도",
    location: "경기 화성시",
    description: "갯벌체험과 해양생태를 관찰할 수 있는 섬",
    suitableFor: ["ANE", "ACE", "RNE", "RCE"],
    category: "nature",
    region: "경기도",
    district: "화성시"
  },
  {
    name: "고양 아람누리",
    location: "경기 고양시",
    description: "다양한 공연과 문화 행사를 즐길 수 있는 복합문화공간",
    suitableFor: ["RCF", "RCE", "ACF", "ACE"],
    category: "culture",
    region: "경기도",
    district: "고양시"
  },
  {
    name: "파주 헤이리 예술마을",
    location: "경기 파주시",
    description: "예술가들이 모여 살며 창작활동을 하는 문화예술마을",
    suitableFor: ["RCE", "ACE", "RCF", "ACF"],
    category: "culture",
    region: "경기도",
    district: "파주시"
  },
  {
    name: "양평 두물머리",
    location: "경기 양평군",
    description: "한강과 남한강이 만나는 아름다운 자연 경관지",
    suitableFor: ["RNF", "RNE", "ANF", "ANE"],
    category: "nature",
    region: "경기도",
    district: "양평군"
  },
  {
    name: "안산 시화호 갈대습지공원",
    location: "경기 안산시",
    description: "철새와 갈대를 관찰할 수 있는 생태습지공원",
    suitableFor: ["RNE", "ANE", "RNF", "ANF"],
    category: "nature",
    region: "경기도",
    district: "안산시"
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

  // 대전광역시 (신규 추가)
  {
    name: "국립중앙과학관",
    location: "대전 유성구",
    description: "과학기술의 원리를 재미있게 체험할 수 있는 국가대표 과학관",
    suitableFor: ["ACE", "RCE", "ANE", "RNE"],
    category: "activity",
    region: "대전광역시",
    district: "유성구"
  },
  {
    name: "유성온천",
    location: "대전 유성구",
    description: "천연온천과 다양한 휴양시설이 있는 온천지구",
    suitableFor: ["RNF", "RCF", "ANF", "ACF"],
    category: "relaxation",
    region: "대전광역시",
    district: "유성구"
  },
  {
    name: "대전 한밭수목원",
    location: "대전 서구",
    description: "도심 속 자연을 만끽할 수 있는 대형 수목원",
    suitableFor: ["RNE", "RNF", "ANE", "ANF"],
    category: "nature",
    region: "대전광역시",
    district: "서구"
  },

  // 대구광역시 (신규 추가)
  {
    name: "이월드",
    location: "대구 달서구",
    description: "대구의 대표적인 테마파크로 가족 단위 놀이시설",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "대구광역시",
    district: "달서구"
  },
  {
    name: "앞산공원",
    location: "대구 남구",
    description: "대구 시민들의 휴식처인 대형 도시공원",
    suitableFor: ["RNE", "RNF", "ANE", "ANF"],
    category: "nature",
    region: "대구광역시",
    district: "남구"
  },
  {
    name: "서문시장",
    location: "대구 중구",
    description: "400년 역사의 전통시장에서 대구 특미와 쇼핑을 즐길 수 있는 곳",
    suitableFor: ["ACF", "RCF", "ANF", "RNF"],
    category: "food",
    region: "대구광역시",
    district: "중구"
  },

  // 광주광역시 (신규 추가)
  {
    name: "무등산 국립공원",
    location: "광주 북구",
    description: "광주의 상징인 무등산에서 등산과 자연을 만끽",
    suitableFor: ["ANE", "RNE", "ACE", "RCE"],
    category: "nature",
    region: "광주광역시",
    district: "북구"
  },
  {
    name: "광주 패밀리랜드",
    location: "광주 북구",
    description: "가족 단위로 즐길 수 있는 놀이동산",
    suitableFor: ["ACE", "ANE", "RCE", "RNE"],
    category: "activity",
    region: "광주광역시",
    district: "북구"
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
  {
    name: "아산 온양온천",
    location: "충남 아산시",
    description: "1300년 역사의 전통 온천지로 가족 힐링 여행지",
    suitableFor: ["RNF", "RCF", "ANF", "ACF"],
    category: "relaxation",
    region: "충청남도",
    district: "아산시"
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

// 지역 인접성 매핑 (근거리 여행지 우선 추천)
const adjacentRegions: { [key: string]: string[] } = {
  '서울특별시': ['경기도', '인천광역시'],
  '경기도': ['서울특별시', '인천광역시', '강원도', '충청북도', '충청남도'],
  '인천광역시': ['서울특별시', '경기도'],
  '부산광역시': ['경상남도', '울산광역시'],
  '대구광역시': ['경상북도', '경상남도'],
  '광주광역시': ['전라남도', '전라북도'],
  '대전광역시': ['충청남도', '충청북도', '세종특별자치시'],
  '울산광역시': ['부산광역시', '경상남도', '경상북도'],
  '세종특별자치시': ['대전광역시', '충청남도', '충청북도'],
  '강원도': ['경기도', '충청북도', '경상북도'],
  '충청북도': ['경기도', '강원도', '충청남도', '전라북도', '경상북도'],
  '충청남도': ['경기도', '대전광역시', '세종특별자치시', '충청북도', '전라북도'],
  '전라북도': ['충청남도', '충청북도', '전라남도', '경상남도'],
  '전라남도': ['광주광역시', '전라북도'],
  '경상북도': ['대구광역시', '울산광역시', '강원도', '충청북도', '경상남도'],
  '경상남도': ['부산광역시', '대구광역시', '울산광역시', '전라북도', '경상북도'],
  '제주특별자치도': [] // 제주도는 인접 지역 없음
};

// 여행 유형별 추천 함수 (지역 근접성 우선)
export const getRecommendationsByType = (
  travelType: string, 
  userRegion?: string, 
  maxResults: number = 5
): TravelDestination[] => {
  // 1. 사용자 여행 유형에 맞는 목적지 필터링
  let filteredDestinations = travelDestinations.filter(dest => 
    dest.suitableFor.includes(travelType)
  );

  // 2. 지역 기반 우선순위 적용
  if (userRegion) {
    const sameRegion = filteredDestinations.filter(dest => dest.region === userRegion);
    const adjacentAreas = adjacentRegions[userRegion] || [];
    const nearbyRegions = filteredDestinations.filter(dest => 
      adjacentAreas.includes(dest.region)
    );
    const farRegions = filteredDestinations.filter(dest => 
      dest.region !== userRegion && !adjacentAreas.includes(dest.region)
    );
    
    // 우선순위: 같은 지역 100% 우선, 부족하면 인접 지역으로 채우기
    let selectedDestinations: TravelDestination[] = [];
    
    // 1순위: 같은 지역에서 최대한 많이
    if (sameRegion.length >= maxResults) {
      selectedDestinations = sameRegion.slice(0, maxResults);
    } else {
      // 같은 지역 모두 포함
      selectedDestinations = [...sameRegion];
      const remaining = maxResults - sameRegion.length;
      
      // 2순위: 인접 지역에서 부족한 만큼 채우기
      if (nearbyRegions.length >= remaining) {
        selectedDestinations = [
          ...selectedDestinations,
          ...nearbyRegions.slice(0, remaining)
        ];
      } else {
        // 인접 지역도 부족하면 먼 지역에서 채우기
        selectedDestinations = [
          ...selectedDestinations,
          ...nearbyRegions,
          ...farRegions.slice(0, remaining - nearbyRegions.length)
        ];
      }
    }
    
    filteredDestinations = selectedDestinations;
  }

  // 3. 결과 개수 제한 및 약간의 셔플 (너무 랜덤하지 않게)
  const result = filteredDestinations.slice(0, maxResults);
  
  // 같은 우선순위 그룹 내에서만 셔플
  return result;
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