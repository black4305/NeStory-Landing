import { AnalyticsData, Answer, UserInfo } from '../types';

class Analytics {
  private sessionId: string;
  private startTime: number;
  private clickCount: number = 0;
  private scrollDepth: number = 0;
  private answers: Answer[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // 클릭 추적
    document.addEventListener('click', () => {
      this.clickCount++;
    });

    // 스크롤 추적
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = Math.min(100, maxScroll);
      }
    });
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  trackAnswer(questionId: number, score: number, timeSpent: number): void {
    this.answers.push({
      questionId,
      score,
      timeSpent
    });
  }

  trackCompletion(result: string, userInfo?: UserInfo): void {
    const analyticsData: AnalyticsData = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      answers: this.answers,
      totalTime: Date.now() - this.startTime,
      clickCount: this.clickCount,
      scrollDepth: this.scrollDepth,
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent,
      completed: true,
      result,
      userInfo,
      submittedAt: Date.now()
    };

    this.sendAnalytics(analyticsData);
  }

  trackAbandon(): void {
    const analyticsData: AnalyticsData = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      answers: this.answers,
      totalTime: Date.now() - this.startTime,
      clickCount: this.clickCount,
      scrollDepth: this.scrollDepth,
      deviceType: this.getDeviceType(),
      userAgent: navigator.userAgent,
      completed: false
    };

    this.sendAnalytics(analyticsData);
  }

  private sendAnalytics(data: AnalyticsData): void {
    // 실제 환경에서는 여기서 분석 서버로 데이터를 전송
    console.log('Analytics Data:', data);
    
    // Local Storage에 저장 (개발용)
    const existingData = JSON.parse(localStorage.getItem('surveyAnalytics') || '[]');
    existingData.push(data);
    localStorage.setItem('surveyAnalytics', JSON.stringify(existingData));
  }

  getAverageResponseTime(): number {
    if (this.answers.length === 0) return 0;
    const total = this.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    return Math.round(total / this.answers.length);
  }

  getCompletionRate(): number {
    return Math.round((this.answers.length / 15) * 100);
  }
}

export const analytics = new Analytics();