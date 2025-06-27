import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

/**
 * NeStory-Landing을 위한 고급 Supabase 기능
 */
export class SupabaseAdvancedService {
  private realtimeChannel: RealtimeChannel | null = null;
  private activeUsersChannel: RealtimeChannel | null = null;

  /**
   * 실시간 활성 사용자 추적 시작
   */
  async trackActiveUser(sessionId: string, status: 'landing' | 'test' | 'survey' | 'result') {
    try {
      const { error } = await supabase
        .from('nestory.active_users')
        .upsert({
          session_id: sessionId,
          status,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });

      if (error) throw error;

      // 5분마다 활성 상태 업데이트
      const interval = setInterval(async () => {
        await this.updateActivity(sessionId);
      }, 5 * 60 * 1000);

      // 페이지 이탈 시 정리
      window.addEventListener('beforeunload', () => {
        clearInterval(interval);
        this.removeActiveUser(sessionId);
      });

    } catch (error) {
      console.error('활성 사용자 추적 오류:', error);
    }
  }

  /**
   * 활성 상태 업데이트
   */
  private async updateActivity(sessionId: string) {
    await supabase
      .from('nestory.active_users')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_id', sessionId);
  }

  /**
   * 활성 사용자 제거
   */
  private async removeActiveUser(sessionId: string) {
    await supabase
      .from('nestory.active_users')
      .delete()
      .eq('session_id', sessionId);
  }

  /**
   * 실시간 활성 사용자 수 구독
   */
  subscribeToActiveUsers(callback: (count: number) => void) {
    // 초기 카운트 로드
    this.getActiveUserCount().then(callback);

    this.activeUsersChannel = supabase
      .channel('active-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'nestory',
          table: 'active_users'
        },
        async () => {
          // active_users_live 뷰를 사용하여 자동으로 30분 이상 비활성 사용자 제외
          const count = await this.getActiveUserCount();
          callback(count);
        }
      )
      .subscribe();
  }

  /**
   * 활성 사용자 수 가져오기 (방법 3: 뷰 사용)
   */
  private async getActiveUserCount(): Promise<number> {
    const { data, error } = await supabase
      .from('nestory.active_users_live')
      .select('id', { count: 'exact', head: true });
    
    return error ? 0 : (data as any)?.count || 0;
  }

  /**
   * 실시간 결과 리더보드 구독
   */
  subscribeToLeaderboard(callback: (leaderboard: any[]) => void) {
    this.realtimeChannel = supabase
      .channel('leaderboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'nestory',
          table: 'user_responses',
          filter: 'completed=eq.true'
        },
        async () => {
          const { data, error } = await supabase
            .from('nestory.result_leaderboard')
            .select('*');
          
          if (!error && data) {
            callback(data);
          }
        }
      )
      .subscribe();
  }

  /**
   * 랜딩 페이지 분석 데이터 저장
   */
  async trackLandingAnalytics(data: {
    visitId: string;
    timestamp: number;
    userAgent: string;
    referrer: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    sessionDuration?: number;
    ctaClicked?: boolean;
    scrollDepth?: number;
  }) {
    try {
      const { error } = await supabase
        .from('nestory.landing_analytics')
        .insert({
          visit_id: data.visitId,
          timestamp: data.timestamp,
          user_agent: data.userAgent,
          referrer: data.referrer,
          device_type: data.deviceType,
          session_duration: data.sessionDuration,
          cta_clicked: data.ctaClicked,
          scroll_depth: data.scrollDepth
        });

      if (error) throw error;
    } catch (error) {
      console.error('랜딩 분석 저장 오류:', error);
    }
  }

  /**
   * A/B 테스트 결과 저장
   */
  async trackABTest(data: {
    variant: string;
    sessionId: string;
    conversion: boolean;
    completionRate?: number;
    timeSpent?: number;
  }) {
    try {
      const { error } = await supabase
        .from('nestory.ab_test_results')
        .insert({
          variant: data.variant,
          session_id: data.sessionId,
          conversion: data.conversion,
          completion_rate: data.completionRate,
          time_spent: data.timeSpent
        });

      if (error) throw error;
    } catch (error) {
      console.error('A/B 테스트 결과 저장 오류:', error);
    }
  }

  /**
   * 통계 개요 가져오기
   */
  async getStatsOverview() {
    try {
      const { data, error } = await supabase
        .from('nestory.stats_overview')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('통계 조회 오류:', error);
      return null;
    }
  }

  /**
   * Edge Function 호출 (향후 사용)
   */
  async callEdgeFunction(functionName: string, payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Edge Function 호출 오류:', error);
      return null;
    }
  }

  /**
   * Storage에 이미지 업로드 (결과 공유용)
   */
  async uploadResultImage(sessionId: string, imageBlob: Blob) {
    try {
      const fileName = `results/${sessionId}-${Date.now()}.png`;
      
      const { data, error } = await supabase.storage
        .from('nestory-landing')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 서명된 URL 생성 (1시간 유효)
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('nestory-landing')
        .createSignedUrl(fileName, 3600);

      if (urlError) throw urlError;

      // URL을 DB에 저장하여 추후 접근 가능하도록
      await supabase
        .from('nestory.user_responses')
        .update({ shared_url: signedUrlData.signedUrl })
        .eq('session_id', sessionId);

      return signedUrlData.signedUrl;
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      return null;
    }
  }

  /**
   * 리소스 정리
   */
  cleanup() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }
    if (this.activeUsersChannel) {
      supabase.removeChannel(this.activeUsersChannel);
    }
  }
}

// 싱글톤 인스턴스
export const supabaseAdvanced = new SupabaseAdvancedService();