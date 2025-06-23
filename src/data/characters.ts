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
  'ACFBK': {
    emoji: '🏃‍♀️',
    name: '에너제틱 맘',
    description: '도시 속 숨은 맛집을 찾아 헤매는 액티브한 가족',
    personality: '활동적이고 트렌디한 것을 좋아하며, 아이들의 의견을 존중하는 스타일',
    celebrity: '김태희 가족',
    funFact: '하루에 카페 3곳은 기본으로 방문하는 카페 마니아!',
    specialItem: '🥤 텀블러 & 맛집 지도',
    trait: '손에는 항상 아이스 아메리카노, 가방에는 맛집 리스트'
  },
  'ACFBP': {
    emoji: '👨‍💼',
    name: '플래너 대디',
    description: '효율적인 일정으로 도시 미식 여행을 이끄는 계획형 아빠',
    personality: '체계적이고 합리적이며, 가족의 리더 역할을 담당',
    celebrity: '정우성 가족',
    funFact: '여행 계획서를 엑셀로 만드는 완벽주의자!',
    specialItem: '📱 여행 앱 & 할인쿠폰',
    trait: '스마트폰에는 여행 관련 앱 50개, 할인 정보 수집 전문가'
  },
  'ACFLK': {
    emoji: '👑',
    name: '프리미엄 키즈',
    description: '아이 중심의 고급 체험을 즐기는 럭셔리 패밀리',
    personality: '품격있고 세련되며, 아이들에게 최고의 경험을 선사하고 싶어함',
    celebrity: '이영애 가족',
    funFact: '아이 키즈클래스 수강료가 어른 취미활동비보다 비쌈!',
    specialItem: '👑 VIP 카드 & 키즈 명품',
    trait: '아이 전용 명품 가방, 프리미엄 체험 VIP 회원권 보유'
  },
  'ACFLP': {
    emoji: '🥂',
    name: '소피스트 커플',
    description: '고급 문화와 미식을 즐기는 세련된 부모',
    personality: '품위있고 교양있으며, 삶의 질을 중시하는 스타일',
    celebrity: '송혜교 가족',
    funFact: '미술관 도슨트 투어는 필수, 와인 페어링도 빼먹지 않음!',
    specialItem: '🍷 와인 글라스 & 아트북',
    trait: '한 손에는 와인, 다른 손에는 미술 도록'
  },
  'ACEBK': {
    emoji: '🎮',
    name: '체험왕 키즈',
    description: '아이들이 주도하는 도시 체험 여행의 달인',
    personality: '호기심이 많고 새로운 것을 좋아하며, 아이들의 창의성을 중시',
    celebrity: '슈퍼맨이 돌아왔다 송일국 가족',
    funFact: '과학관, 체험관은 연간패스 보유자!',
    specialItem: '🎫 체험관 연간패스 & 키즈 백팩',
    trait: '아이들이 직접 고른 체험 활동 리스트와 미션 수첩을 항상 휴대'
  },
  'ACEBP': {
    emoji: '🎓',
    name: '에듀케이터 패밀리',
    description: '교육적 가치를 중시하는 체험 중심 가족',
    personality: '지적이고 계획적이며, 아이들의 학습을 중요하게 생각',
    celebrity: '김영철 가족',
    funFact: '여행지마다 역사 공부하고 가는 준비성 만점 가족!',
    specialItem: '📚 교육 가이드북 & 학습 노트',
    trait: '여행지 역사를 미리 공부하고, 아이들과 퀴즈를 내며 학습 여행을 진행'
  },
  'ACELK': {
    emoji: '✨',
    name: '럭셔리 키즈마스터',
    description: '프리미엄 키즈 체험을 선도하는 트렌드세터',
    personality: '앞서가고 특별함을 추구하며, 아이들에게 특별한 경험 제공',
    celebrity: '김사랑 가족',
    funFact: '아이 생일파티를 호텔에서 하는 것이 당연한 라이프스타일!',
    specialItem: '💎 프리미엄 체험 골드카드 & 키즈 루이비통',
    trait: '아이 전용 명품 여행가방과 프리미엄 체험 우선예약권을 보유'
  },
  'ACELP': {
    emoji: '🎭',
    name: '컬처 엘리트',
    description: '문화와 예술을 사랑하는 고품격 가족',
    personality: '예술적 감성이 뛰어나고 품격있는 라이프스타일 추구',
    celebrity: '김희선 가족',
    funFact: '클래식 콘서트, 뮤지컬 관람은 가족 필수 코스!',
    specialItem: '🎫 문화예술 VIP 멤버십 & 오페라글라스',
    trait: '클래식 음악과 와인을 즐기며, 문화 공연 프리미엄 좌석을 선호'
  },
  'ANFBK': {
    emoji: '🏕️',
    name: '캠핑 마스터',
    description: '자연 속에서 맛있는 것을 찾아 다니는 아웃도어 가족',
    personality: '자연을 사랑하고 소박하며, 아이들과의 시간을 소중히 여김',
    celebrity: '이동국 가족',
    funFact: '캠핑장 맛집 정보는 누구보다 빠르게 입수!',
    specialItem: '🔥 캠핑용 쿠킹세트 & 맛집 지도',
    trait: '캠핑장 근처 숨은 맛집 정보를 수집하고, 직접 요리하는 것을 즐김'
  },
  'ANFBP': {
    emoji: '🚗',
    name: '로드트립 패밀리',
    description: '자연과 로컬 맛집을 찾아 떠나는 드라이브 전문가',
    personality: '자유롭고 모험적이며, 가족과의 추억 만들기를 중시',
    celebrity: '차태현 가족',
    funFact: '전국 숨은 맛집 지도를 머릿속에 저장하고 있음!',
    specialItem: '🗺️ 로컬 맛집 지도 & 드라이브 스낵박스',
    trait: '차 안에는 항상 간식이 가득하고, 숨은 맛집 정보를 끊임없이 수집'
  },
  'ANFLK': {
    emoji: '🌿',
    name: '네이처 프린세스',
    description: '자연 속에서 프리미엄 힐링을 즐기는 가족',
    personality: '여유롭고 자연친화적이며, 아이들과의 질적인 시간 추구',
    celebrity: '한지민 가족',
    funFact: '글램핑장 예약은 오픈과 동시에 마감시키는 실력자!',
    specialItem: '🧘‍♀️ 힐링 아로마세트 & 글램핑 VIP카드',
    trait: '자연 속에서 요가와 명상을 즐기며, 프리미엄 글램핑 예약의 달인'
  },
  'ANFLP': {
    emoji: '🍃',
    name: '힐링 구루',
    description: '자연에서 진정한 휴식과 미식을 추구하는 어른들',
    personality: '깊이있고 사색적이며, 진정한 휴식의 가치를 아는 성숙함',
    celebrity: '공유 가족',
    funFact: '숲속 펜션에서 와인 한 잔과 함께 일몰 감상이 취미!',
    specialItem: '🍷 와인 셀렉션 & 해먹',
    trait: '자연 속에서 와인을 즐기며, 해먹에서의 독서와 사색을 즐김'
  },
  'ANEBK': {
    emoji: '🌳',
    name: '자연 탐험가',
    description: '아이들과 함께 자연에서 뛰어노는 체험 마니아',
    personality: '활동적이고 자연친화적이며, 아이들의 모험심을 기름',
    celebrity: '추성훈 가족',
    funFact: '나무 타기, 곤충 잡기 등 야생의 기술을 터득한 가족!',
    specialItem: '🔍 곤충채집 키트 & 자연관찰 노트',
    trait: '아이들과 함께 곤충을 관찰하고, 자연에서 발견한 것들을 스케치'
  },
  'ANEBP': {
    emoji: '🥾',
    name: '하이킹 마스터',
    description: '자연 체험을 통해 가족의 끈끈함을 다지는 가족',
    personality: '건강하고 활동적이며, 가족과의 협동을 중시',
    celebrity: '김병만 가족',
    funFact: '등산화 컬렉션이 운동화보다 많은 아웃도어 매니아!',
    specialItem: '🎒 등산용 백팩 & 트레킹 폴',
    trait: '가족 모두가 전문 등산 장비를 갖추고, 산행 계획을 체계적으로 세움'
  },
  'ANELK': {
    emoji: '🦋',
    name: '에코 프리미엄',
    description: '프리미엄 생태 체험을 즐기는 럭셔리 자연주의 가족',
    personality: '환경을 생각하고 품격있으며, 아이들에게 자연의 소중함 교육',
    celebrity: '이나영 가족',
    funFact: '친환경 제품만 사용하는 지구를 생각하는 가족!',
    specialItem: '🌱 친환경 여행용품 세트 & 생태도감',
    trait: '모든 여행용품을 친환경 소재로 선택하고, 아이들에게 생태교육을 병행'
  },
  'ANELP': {
    emoji: '🌅',
    name: '선라이즈 커플',
    description: '자연의 아름다움을 만끽하는 로맨틱 가족',
    personality: '감성적이고 로맨틱하며, 자연 속에서의 특별한 순간을 추구',
    celebrity: '원빈♥이나영 부부',
    funFact: '일출 명소는 모두 섭렵한 자연 사진작가 수준!',
    specialItem: '📸 프로 카메라 & 일출 명소 지도',
    trait: '새벽 일찍 일어나 일출을 촬영하고, 자연의 아름다운 순간을 기록'
  },
  'RCFBK': {
    emoji: '☕',
    name: '카페 노마드',
    description: '도심 카페에서 아이들과 여유로운 시간을 보내는 가족',
    personality: '여유롭고 트렌드에 민감하며, 아이들과의 소통을 중시',
    celebrity: '이효리 가족',
    funFact: '인스타그램 카페 태그가 1000개 돌파한 카페 인플루언서!',
    specialItem: '📱 카페 앱 컬렉션 & 리유저블 컵',
    trait: '신상 카페 정보를 실시간으로 체크하고, 인스타그래머블한 장소를 선호'
  },
  'RCFBP': {
    emoji: '📚',
    name: '북카페 러버',
    description: '조용한 도시 산책과 맛집을 즐기는 지적인 가족',
    personality: '차분하고 지적이며, 깊이있는 대화를 좋아함',
    celebrity: '유지태 가족',
    funFact: '서점 겸 카페에서 하루 종일 보낼 수 있는 독서광 가족!',
    specialItem: '📖 독서 노트 & 북마크 컬렉션',
    trait: '항상 읽을 책을 가방에 넣고 다니며, 카페에서 독서와 토론을 즐김'
  },
  'RCFLK': {
    emoji: '🎨',
    name: '아티스틱 키즈',
    description: '고급 카페와 문화공간에서 아이들의 감성을 키우는 가족',
    personality: '예술적이고 세련되며, 아이들의 창의성 발달에 관심',
    celebrity: '김태희 가족',
    funFact: '아이 그림 전시회를 개인적으로 열어본 예술가족!',
    specialItem: '🖌️ 아트 키트 & 미술관 멤버십',
    trait: '아이들의 그림 도구를 항상 휴대하고, 미술관과 갤러리를 정기적으로 방문'
  },
  'RCFLP': {
    emoji: '🍷',
    name: '어반 소피스트',
    description: '도심에서 프리미엄 라이프스타일을 즐기는 세련된 부부',
    personality: '세련되고 고급스러우며, 품격있는 취향을 추구',
    celebrity: '장동건♥고소영 부부',
    funFact: '호텔 라운지가 단골, 루프탑 바는 집 앞마당 같은 곳!',
    specialItem: '🥂 샴페인 글라스 & 프리미엄 라운지패스',
    trait: '도심 속 루프탑 바와 고급 호텔 라운지를 자유자재로 이용'
  },
  'RCEBK': {
    emoji: '🎪',
    name: '키즈 엔터테이너',
    description: '아이들을 위한 도시 문화 체험을 즐기는 가족',
    personality: '재미있고 활기차며, 아이들의 즐거움을 최우선으로 생각',
    celebrity: '김준호 가족',
    funFact: '어린이 뮤지컬 시즌권 보유, 아이돌 콘서트도 챙겨보는 가족!',
    specialItem: '🎟️ 공연 티켓 묶음 & 엔터테인먼트 가이드',
    trait: '매주 새로운 공연을 찾아 예약하고, 아이들과 함께 즐기는 것을 최우선으로 생각'
  },
  'RCEBP': {
    emoji: '🎭',
    name: '컬처 패밀리',
    description: '문화 중심의 느긋한 체험을 즐기는 교양있는 가족',
    personality: '교양있고 차분하며, 깊이있는 문화적 경험을 추구',
    celebrity: '김상경 가족',
    funFact: '박물관 연간패스 보유, 도슨트 투어는 필수 코스!',
    specialItem: '📜 문화예술 가이드북 & 도슨트 오디오',
    trait: '여행지의 문화사를 미리 공부하고, 도슨트 투어를 통해 깊이있는 문화 체험'
  },
  'RCELK': {
    emoji: '👨‍🎨',
    name: '크리에이티브 키즈',
    description: '아이 중심의 프리미엄 창작 체험을 즐기는 가족',
    personality: '창의적이고 혁신적이며, 아이들의 잠재력 개발에 투자',
    celebrity: '소지섭 가족',
    funFact: '아이 작품으로 집안 인테리어를 하는 창의적 가족!',
    specialItem: '🖼️ 프리미엄 창작 도구세트 & 아트스튜디오 패스',
    trait: '아이들이 직접 만든 작품을 소중히 전시하고, 창작 체험 프로그램에 적극 참여'
  },
  'RCELP': {
    emoji: '🏛️',
    name: '뮤지엄 마니아',
    description: '프리미엄 문화 체험과 휴식을 추구하는 고품격 가족',
    personality: '우아하고 지적이며, 고급 문화를 즐기는 안목 보유',
    celebrity: '이병헌 가족',
    funFact: '전시회 오프닝 파티 단골, 아트 컬렉션도 하는 문화 애호가!',
    specialItem: '🎨 프리미엄 아트 커탈로그 & 뮤지엄 회원권',
    trait: '전시회 오픈닝은 놓치지 않고, 아트 작품 커렉션을 하며 고서한 문화 수준을 자랑'
  },
  'RNFBK': {
    emoji: '🌾',
    name: '시골 그래니',
    description: '자연 속에서 정겨운 맛집을 찾아다니는 힐링 가족',
    personality: '따뜻하고 정겨우며, 아이들과의 소박한 행복을 추구',
    celebrity: '백종원 가족',
    funFact: '시골 할머니 밥상이 미슐랭보다 맛있다고 믿는 로컬푸드 마니아!',
    specialItem: '🥣 수제 도시락 & 로컬푸드 지도',
    trait: '직접 만든 반찬과 도시락을 가지고 다니며, 시골 할머니들과 요리 레시피 공유'
  },
  'RNFBP': {
    emoji: '🚜',
    name: '컨트리사이드 패밀리',
    description: '시골의 정취와 맛을 즐기는 전원 생활 추구 가족',
    personality: '소박하고 자연스러우며, 전통적 가치를 중시',
    celebrity: '이서진 가족',
    funFact: '농촌 체험마을 연간회원, 김치 담그기는 전문가 수준!',
    specialItem: '🥬 전통 장류 세트 & 농촌체험 가이드',
    trait: '직접 만든 장류와 전통 음식을 선보이며, 농촌 체험 활동에 적극적으로 참여'
  },
  'RNFLK': {
    emoji: '🏡',
    name: '컨트리 프린세스',
    description: '자연 속에서 프리미엄 휴양을 즐기는 전원 생활 가족',
    personality: '자연스럽고 여유로우며, 아이들과의 질적 시간을 중시',
    celebrity: '수지 가족',
    funFact: '펜션 예약 전쟁에서 항상 승리하는 예약의 신!',
    specialItem: '💝 프리미엄 펜션 예약앱 & 휠링 아로마 세트',
    trait: '프리미엄 펜션 예약을 빠르게 성공시키고, 자연 카페에서 카페 라이프를 즐김'
  },
  'RNFLP': {
    emoji: '🍯',
    name: '하니문 커플',
    description: '자연에서 달콤한 힐링과 미식을 즐기는 로맨틱 가족',
    personality: '로맨틱하고 감성적이며, 부부만의 특별한 시간을 추구',
    celebrity: '현빈♥손예진 부부',
    funFact: '신혼여행지를 매년 재방문하는 로맨틱 부부!',
    specialItem: '🍾 로컬 꿀미 & 허니문 스낵',
    trait: '지역 특산 꿀미와 달콤한 간식을 함께 맛보며, 로맨틱한 시간을 공유'
  },
  'RNEBK': {
    emoji: '🦋',
    name: '네이처 키즈',
    description: '아이들과 함께 자연에서 조용한 체험을 즐기는 가족',
    personality: '평화롭고 자연친화적이며, 아이들의 순수함을 지켜주려 함',
    celebrity: '김민종 가족',
    funFact: '곤충박물관 연간패스 보유, 아이가 곤충박사가 꿈!',
    specialItem: '🦋 나비 관찰 도감 & 자연학습장',
    trait: '나비와 곤충의 생태를 자세히 관찰하고, 아이들과 함께 자연 일기를 기록'
  },
  'RNEBP': {
    emoji: '📖',
    name: '네이처 에듀케이터',
    description: '자연에서 교육적 체험을 중시하는 가족',
    personality: '교육적이고 체계적이며, 자연을 통한 학습을 중시',
    celebrity: '정재영 가족',
    funFact: '생태 해설사 자격증 보유, 가족 자연학습 가이드!',
    specialItem: '🔭 생태 해설 도구 & 자연교육 체크리스트',
    trait: '자연 생태에 대한 전문 지식으로 가족에게 해설하고, 체계적인 자연 학습 프로그램 진행'
  },
  'RNELK': {
    emoji: '🌸',
    name: '에코 키즈마스터',
    description: '프리미엄 자연 체험으로 아이들의 감성을 키우는 가족',
    personality: '환경친화적이고 감성적이며, 아이들의 정서 발달에 관심',
    celebrity: '안성기 가족',
    funFact: '사계절 꽃 축제는 모두 섭렵한 자연 감성 가족!',
    specialItem: '🌺 계절별 꽃 가이드 & 에코 크래프트 도구',
    trait: '사계절 꽃으로 아이들과 에코 크래프트를 만들고, 자연의 아름다움을 감상하는 감성 교육'
  },
  'RNELP': {
    emoji: '🌙',
    name: '달빛 로맨티스트',
    description: '자연의 신비로움을 만끽하는 감성 충만 가족',
    personality: '몽환적이고 감성적이며, 자연의 아름다움에 감동받는 순수함',
    celebrity: '정우성 가족',
    funFact: '별자리 관측이 취미, 천체망원경 보유한 우주 마니아!',
    specialItem: '🔭 천체망원경 & 별자리 가이드',
    trait: '달빛이 아름다운 밤에 별자리를 관측하고, 우주의 신비로움을 가족과 함께 공유'
  }
};