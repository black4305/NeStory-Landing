export interface Question {
  id: number;
  text: string;
  description?: string; // 밸런스 게임용 상세 설명
  axis: 'A' | 'C' | 'F';
  isReverse?: boolean;
}

export interface Answer {
  questionId: number;
  score: number;
  timeSpent: number;
  responseConsistency?: number;
}

export interface TravelType {
  code: string;
  title: string;
  description: string;
  recommendations: string[];
}

export interface UserInfo {
  name: string;
  instagram: string;
  age: string;
  gender: string;
  familySize: number;
  region: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
}

export interface AnalyticsData {
  sessionId: string;
  startTime: number;
  answers: Answer[];
  totalTime: number;
  clickCount: number;
  scrollDepth: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
  completed: boolean;
  result?: string;
  userInfo?: UserInfo;
  submittedAt?: number;
  reliabilityScore?: number;
  questionProgress?: number[];
  responsePattern?: 'consistent' | 'inconsistent' | 'random';
}

export interface AxisScore {
  A: number; // Active vs Relaxing
  C: number; // Culture vs Nature
  F: number; // Foodie vs Experience
}