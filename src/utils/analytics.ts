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
    this.trackPageLoad(); // 페이지 로드 분석 추가
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

  private trackPageLoad(): void {
    // 페이지 로드 시 referrer 정보 수집
    this.referrer = document.referrer || 'direct';
  }

  private referrer: string = '';

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

  async trackCompletion(result: string, userInfo?: UserInfo): Promise<void> {
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

    await this.sendAnalytics(analyticsData);
  }

  async trackAbandon(): Promise<void> {
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

    await this.sendAnalytics(analyticsData);
  }

  private async sendAnalytics(data: AnalyticsData): Promise<void> {
    try {
      // nestory 스키마 프록시 함수 사용
      const { SupabaseService } = await import('../services/supabase');
      const success = await SupabaseService.saveUserData(data);
      
      if (success) {
        console.log('✅ nestory.user_responses에 분석 데이터 저장 완료');
      } else {
        throw new Error('nestory 스키마 저장 실패');
      }
    } catch (error) {
      console.error('❌ nestory 스키마 저장 실패, localStorage로 fallback:', error);
      
      // Supabase 실패 시 localStorage 백업
      const existingData = JSON.parse(localStorage.getItem('surveyAnalytics') || '[]');
      existingData.push(data);
      localStorage.setItem('surveyAnalytics', JSON.stringify(existingData));
    }
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