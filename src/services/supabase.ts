import { createClient } from '@supabase/supabase-js';
import { AnalyticsData } from '../types';

// Supabase URL과 anon key는 환경변수에서 가져오거나 직접 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  // 사용자 데이터 저장
  static async saveUserData(data: AnalyticsData) {
    try {
      const { error } = await supabase
        .from('user_responses')
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

      if (error) {
        console.error('Supabase 저장 오류:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      return false;
    }
  }

  // 모든 사용자 데이터 가져오기
  static async getAllUserData(): Promise<AnalyticsData[]> {
    try {
      const { data, error } = await supabase
        .from('user_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Supabase 조회 오류:', error);
        return [];
      }

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
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      return [];
    }
  }

  // 통계 데이터 가져오기
  static async getStatsData() {
    try {
      const { data, error } = await supabase
        .from('user_responses')
        .select('result, device_type, submitted_at, completed, reliability_score, response_pattern');

      if (error) {
        console.error('통계 조회 오류:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('통계 조회 실패:', error);
      return null;
    }
  }

  // 데이터 삭제
  static async deleteUserData(sessionId: string) {
    try {
      const { error } = await supabase
        .from('user_responses')
        .delete()
        .eq('session_id', sessionId);

      if (error) {
        console.error('삭제 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      return false;
    }
  }

  // 테이블이 존재하는지 확인하고 생성
  static async initializeDatabase() {
    try {
      // 먼저 테이블 존재 여부 확인
      const { data, error } = await supabase
        .from('user_responses')
        .select('session_id')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        // 테이블이 없으면 생성하라고 안내
        console.log('Supabase에서 다음 SQL을 실행하여 테이블을 생성하세요:');
        console.log(`
          CREATE TABLE user_responses (
            id SERIAL PRIMARY KEY,
            session_id TEXT UNIQUE NOT NULL,
            start_time TIMESTAMP,
            answers JSONB,
            total_time INTEGER,
            click_count INTEGER,
            scroll_depth REAL,
            device_type TEXT,
            user_agent TEXT,
            completed BOOLEAN DEFAULT false,
            result TEXT,
            user_info JSONB,
            submitted_at TIMESTAMP DEFAULT NOW(),
            reliability_score REAL,
            question_progress JSONB,
            response_pattern TEXT
          );
        `);
        return false;
      }

      return true;
    } catch (error) {
      console.error('데이터베이스 초기화 실패:', error);
      return false;
    }
  }
}