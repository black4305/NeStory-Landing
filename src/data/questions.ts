import { Question } from '../types';

export const questions: Question[] = [
  // A축: Active vs Relaxing (2문항)
  {
    id: 1,
    text: "🏃‍♂️ vs 🛌 여행에서 선택한다면?",
    description: "아침 6시에 일어나서 하루 종일 놀기 vs 늦잠 자고 여유롭게 브런치",
    axis: 'A'
  },
  {
    id: 2,
    text: "🎢 vs ☕ 테마파크에서 선택한다면?",
    description: "하루 종일 롤러코스터 10개 타기 vs 벤치에 앉아서 사람 구경하며 커피",
    axis: 'A'
  },
  
  // C축: Culture vs Nature (2문항)  
  {
    id: 3,
    text: "🏛️ vs 🌲 휴가지에서 선택한다면?",
    description: "박물관에서 역사 공부하기 vs 산속에서 새소리 들으며 명상",
    axis: 'C'
  },
  {
    id: 4,
    text: "🎭 vs 🦋 주말에 선택한다면?",
    description: "시내 갤러리 도슨트 투어 vs 숲속 곤충채집과 자연관찰",
    axis: 'C'
  },
  
  // F축: Foodie vs Experience (2문항)
  {
    id: 5,
    text: "🍽️ vs 🎪 여행 예산 배분한다면?",
    description: "미슐랭 레스토랑에서 특별한 디너 vs 번지점프나 패러글라이딩 체험",
    axis: 'F'
  },
  {
    id: 6,
    text: "📍 vs 🎯 여행 계획 세울 때?",
    description: "현지 맛집 리스트 20곳 정리 vs 액티비티와 체험 프로그램 예약",
    axis: 'F'
  },
  
  // B축: Budget vs Luxury (2문항)
  {
    id: 7,
    text: "✈️ vs 🚗 교통편 선택한다면?",
    description: "새벽 할인 항공편으로 절약 vs 비즈니스클래스로 편안하게",
    axis: 'B'
  },
  {
    id: 8,
    text: "🏨 vs 🏠 숙소 선택한다면?",
    description: "깨끗한 게스트하우스에서 현지인과 교류 vs 5성급 호텔 스위트룸에서 럭셔리",
    axis: 'B'
  },
  
  // K축: Kid-Initiated vs Parent-Initiated (2문항)
  {
    id: 9,
    text: "🎈 vs 📚 아이와 여행 계획 세울 때?",
    description: "아이가 가고 싶다는 곳 무조건 포함 vs 교육적 가치가 있는 곳 우선 선택",
    axis: 'K'
  },
  {
    id: 10,
    text: "⏰ vs 🎪 여행 일정 짤 때?",
    description: "아이 피곤하면 바로 숙소 복귀 vs 어른이 정한 스케줄은 끝까지 완주",
    axis: 'K'
  }
];