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
      // 먼저 기본 Supabase 서비스로 시도
      const { SupabaseService } = await import('../services/supabase');
      let success = await SupabaseService.saveUserData(data);
      
      if (!success) {
        console.log('🔄 nestory 스키마로 재시도...');
        // nestory 스키마 명시적 설정으로 재시도
        const { SupabaseServiceWithSchema } = await import('../services/supabaseWithSchema');
        success = await SupabaseServiceWithSchema.saveUserData(data);
        
        if (!success) {
          console.log('🔄 RPC 함수로 재시도...');
          // RPC 함수로 재시도
          const { SupabaseRPCService } = await import('../services/supabaseRPC');
          success = await SupabaseRPCService.saveUserData(data);
        }
      }
      
      if (success) {
        console.log('✅ Supabase에 분석 데이터 저장 완료');
      } else {
        throw new Error('Supabase 저장 실패');
      }
    } catch (error) {
      console.error('❌ Supabase 저장 실패, localStorage로 fallback:', error);
      
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