import { createClient } from '@supabase/supabase-js';
import { AnalyticsData } from '../types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// nestory 스키마를 명시적으로 설정
const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'nestory'
  }
});

export class SupabaseServiceWithSchema {
  // 사용자 데이터 저장 (nestory 스키마 사용)
  static async saveUserData(data: AnalyticsData) {
    console.log('🔍 Supabase saveUserData with nestory schema 시작:', data.sessionId);
    
    try {
      const { error } = await supabase
        .from('user_responses')  // nestory 스키마가 이미 설정되어 있음
        .insert([{
          session_id: data.sessionId,
          start_time: new Date(data.startTime),
          answers: data.answers,
          total_time: data.totalTime,
          click_count: data.clickCount,
          scroll_depth: data.scrollDepth,
          device_type: data.deviceType,
          user_agent: data.userAgent,
          completed: data.completed,
          result: data.result,
          user_info: data.userInfo,
          submitted_at: data.submittedAt ? new Date(data.submittedAt) : new Date(),
          reliability_score: data.reliabilityScore,
          response_pattern: data.responsePattern
        }]);

      if (!error) {
        console.log('✅ nestory.user_responses 테이블에 저장 성공!');
        return true;
      } else {
        console.log('❌ nestory.user_responses 실패:', error.message);
        return false;
      }
      
    } catch (error) {
      console.error('💥 데이터 저장 실패:', error);
      return false;
    }
  }

  // 모든 사용자 데이터 가져오기 (nestory 스키마 사용)
  static async getAllUserData(): Promise<AnalyticsData[]> {
    console.log('🔍 Supabase getAllUserData with nestory schema 시작...');
    
    try {
      const { data, error } = await supabase
        .from('user_responses')  // nestory 스키마가 이미 설정되어 있음
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data) {
        console.log(`✅ nestory.user_responses 테이블에서 ${data.length}개 데이터 조회 성공!`);
        
        // Supabase 데이터를 AnalyticsData 형식으로 변환
        return data.map(item => ({
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
        console.log('❌ nestory.user_responses 조회 실패:', error?.message || 'No data');
        return [];
      }
    } catch (error) {
      console.error('💥 데이터 조회 실패:', error);
      return [];
    }
  }
}