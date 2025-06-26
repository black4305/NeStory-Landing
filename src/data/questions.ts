import { Question } from '../types';

export const questions: Question[] = [
  // A축: Active vs Relaxing (2문항)
  {
    id: 1,
    text: "🌅 vs 🛌 가족여행 첫날 아침!",
    description: "7시에 일어나서 알찬 하루 시작하기 vs 10시까지 늘어지게 자고 여유로운 브런치",
    axis: 'A'
  },
  {
    id: 2,
    text: "🎢 vs ☕ 놀이공원에서 4시간!",
    description: "스릴 넘치는 놀이기구 최대한 많이 타기 vs 그늘진 카페에서 아이들 구경하며 휴식",
    axis: 'A'
  },
  
  // C축: Culture vs Nature (2문항)  
  {
    id: 3,
    text: "🏛️ vs 🌊 가족 데이트 코스는?",
    description: "아이들과 함께 박물관이나 전시관 관람 vs 바다나 호수에서 자연 속 힐링",
    axis: 'C'
  },
  {
    id: 4,
    text: "📸 vs 🦆 인스타 사진 찍기 좋은 곳은?",
    description: "예쁜 카페나 감성적인 거리에서 사진 vs 공원이나 산책로에서 자연 배경 사진",
    axis: 'C'
  },
  
  // F축: Foodie vs Experience (2문항)
  {
    id: 5,
    text: "💰 vs 🎪 10만원 더 있다면?",
    description: "유명한 맛집에서 특별한 식사 한 번 vs 아이들과 체험 프로그램이나 액티비티",
    axis: 'F'
  },
  {
    id: 6,
    text: "📱 vs 🎯 여행 준비할 때?",
    description: "맛집 블로그 검색하고 맛있다는 곳들 리스트업 vs 재미있는 체험활동이나 놀거리 찾기",
    axis: 'F'
  }
];