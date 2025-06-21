export interface RegionalRecommendation {
  region: string;
  nearbyDestinations: string[];
  signature: string;
  description: string;
}

export const regionalRecommendations: Record<string, RegionalRecommendation> = {
  '서울': {
    region: '서울',
    nearbyDestinations: ['경기 가평', '인천 강화도', '경기 양평', '경기 포천'],
    signature: '한강 크루즈',
    description: '도심 속 힐링과 근교 자연 여행의 완벽한 조합'
  },
  '경기': {
    region: '경기',
    nearbyDestinations: ['강원 춘천', '충북 제천', '강원 가평', '인천 을왕리'],
    signature: '에버랜드 & 한국민속촌',
    description: '가족 테마파크와 전통문화 체험의 메카'
  },
  '인천': {
    region: '인천',
    nearbyDestinations: ['경기 김포', '서울 강서구', '경기 부천', '강화도'],
    signature: '월미도 & 차이나타운',
    description: '바다와 이국적 문화가 어우러진 관문 도시'
  },
  '부산': {
    region: '부산',
    nearbyDestinations: ['경남 거제', '경남 통영', '울산 울주군', '경남 김해'],
    signature: '해운대 & 감천문화마을',
    description: '바다와 산이 만나는 역동적인 해양 도시'
  },
  '대구': {
    region: '대구',
    nearbyDestinations: ['경북 경주', '경북 안동', '경북 청도', '경북 칠곡'],
    signature: '팔공산 & 동성로',
    description: '전통과 현대가 공존하는 영남 문화의 중심'
  },
  '광주': {
    region: '광주',
    nearbyDestinations: ['전남 담양', '전남 곡성', '전남 화순', '전남 나주'],
    signature: '무등산 & 양림동',
    description: '예술과 문화, 그리고 호남의 정취가 살아있는 도시'
  },
  '대전': {
    region: '대전',
    nearbyDestinations: ['충남 계룡', '충북 옥천', '충남 공주', '충남 부여'],
    signature: '엑스포공원 & 유성온천',
    description: '과학과 온천이 어우러진 중부권 거점 도시'
  },
  '울산': {
    region: '울산',
    nearbyDestinations: ['경남 양산', '부산 기장', '경주 토함산', '경남 밀양'],
    signature: '간절곶 & 대왕암공원',
    description: '산업과 자연이 조화를 이루는 동해안 명소'
  },
  '세종': {
    region: '세종',
    nearbyDestinations: ['대전 유성', '충남 공주', '충북 청주', '충남 천안'],
    signature: '세종호수공원 & 정부청사',
    description: '미래와 자연이 공존하는 신행정수도'
  },
  '강원': {
    region: '강원',
    nearbyDestinations: ['춘천 남이섬', '강릉 경포대', '속초 설악산', '평창 대관령'],
    signature: '설악산 & 정동진',
    description: '산과 바다, 사계절이 아름다운 자연의 보고'
  },
  '충북': {
    region: '충북',
    nearbyDestinations: ['단양 도담삼봉', '제천 청풍호', '괴산 산막이마을', '영동 와인터널'],
    signature: '단양 8경 & 속리산',
    description: '산과 강이 어우러진 내륙의 비경'
  },
  '충남': {
    region: '충남',
    nearbyDestinations: ['부여 백제역사지구', '공주 무령왕릉', '보령 대천해수욕장', '태안 꽃지해수욕장'],
    signature: '백제 역사문화 & 서해안',
    description: '유구한 역사와 서해의 낙조가 만나는 곳'
  },
  '전북': {
    region: '전북',
    nearbyDestinations: ['전주 한옥마을', '고창 청보리밭', '부안 변산반도', '무주 덕유산'],
    signature: '전주 한옥마을 & 비빔밥',
    description: '전통문화와 맛의 고장, 한국의 멋이 살아있는 곳'
  },
  '전남': {
    region: '전남',
    nearbyDestinations: ['여수 오동도', '순천 순천만', '담양 죽녹원', '보성 녹차밭'],
    signature: '순천만 습지 & 여수 밤바다',
    description: '생태와 해양관광의 천국, 자연이 주는 선물'
  },
  '경북': {
    region: '경북',
    nearbyDestinations: ['경주 불국사', '안동 하회마을', '포항 호미곶', '영주 부석사'],
    signature: '경주 역사문화 & 안동 전통마을',
    description: '천년 역사의 숨결과 전통문화가 살아있는 곳'
  },
  '경남': {
    region: '경남',
    nearbyDestinations: ['통영 케이블카', '거제 외도보타니아', '하동 섬진강', '남해 독일마을'],
    signature: '통영 한려수도 & 지리산',
    description: '바다와 산의 절경, 이순신의 역사가 깃든 땅'
  },
  '제주': {
    region: '제주',
    nearbyDestinations: ['성산일출봉', '한라산', '우도', '서귀포 천지연폭포'],
    signature: '한라산 & 성산일출봉',
    description: '신비로운 화산섬, 사계절 다른 매력을 간직한 힐링의 섬'
  }
};