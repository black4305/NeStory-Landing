import { createClient } from '@supabase/supabase-js';
import { AnalyticsData } from '../types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseRPCService {
  // RPC 함수를 통한 데이터 저장
  static async saveUserData(data: AnalyticsData) {
    console.log('🔍 Supabase RPC saveUserData 시작:', data.sessionId);
    
    try {
      const { error } = await supabase.rpc('save_user_response', {
        p_session_id: data.sessionId,
        p_start_time: new Date(data.startTime),
        p_answers: data.answers,
        p_total_time: data.totalTime,
        p_click_count: data.clickCount,
        p_scroll_depth: data.scrollDepth,
        p_device_type: data.deviceType,
        p_user_agent: data.userAgent,
        p_completed: data.completed,
        p_result: data.result,
        p_user_info: data.userInfo,
        p_submitted_at: data.submittedAt ? new Date(data.submittedAt) : new Date(),
        p_reliability_score: data.reliabilityScore,
        p_response_pattern: data.responsePattern
      });

      if (!error) {
        console.log('✅ RPC를 통해 nestory.user_responses 테이블에 저장 성공!');
        return true;
      } else {
        console.log('❌ RPC save_user_response 실패:', error.message);
        return false;
      }
      
    } catch (error) {
      console.error('💥 RPC 데이터 저장 실패:', error);
      return false;
    }
  }

  // RPC 함수를 통한 데이터 조회
  static async getAllUserData(): Promise<AnalyticsData[]> {
    console.log('🔍 Supabase RPC getAllUserData 시작...');
    
    try {
      const { data, error } = await supabase.rpc('get_user_responses');

      if (!error && data) {
        console.log(`✅ RPC를 통해 ${data.length}개 데이터 조회 성공!`);
        
        // Supabase 데이터를 AnalyticsData 형식으로 변환
        return data.map((item: any) => ({
          sessionId: item.session_id,
          startTime: new Date(item.start_time).getTime(),
          answers: item.answers,
          totalTime: item.total_time,
          clickCount: item.click_count,
          scrollDepth: item.scroll_depth,
          deviceType: item.device_type,
          userAgent: item.user_agent,
          completed: item.completed,
          result: item.result,
          userInfo: item.user_info,
          submittedAt: item.submitted_at ? new Date(item.submitted_at).getTime() : Date.now(),
          reliabilityScore: item.reliability_score,
          questionProgress: item.question_progress,
          responsePattern: item.response_pattern
        }));
      } else {
        console.log('❌ RPC get_user_responses 실패:', error?.message || 'No data');
        return [];
      }
    } catch (error) {
      console.error('💥 RPC 데이터 조회 실패:', error);
      return [];
    }
  }

  // RPC 함수를 통한 통계 조회
  static async getStatsData() {
    console.log('🔍 Supabase RPC getStatsData 시작...');
    
    try {
      const { data, error } = await supabase.rpc('get_response_stats');

      if (!error && data) {
        console.log('✅ RPC를 통해 통계 데이터 조회 성공!');
        return data;
      } else {
        console.log('❌ RPC get_response_stats 실패:', error?.message || 'No data');
        return null;
      }
    } catch (error) {
      console.error('💥 RPC 통계 조회 실패:', error);
      return null;
    }
  }
}