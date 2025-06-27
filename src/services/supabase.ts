import { createClient } from '@supabase/supabase-js';
import { AnalyticsData } from '../types';

// Supabase URL과 anon key는 환경변수에서 가져오거나 직접 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  // nestory 스키마 프록시 함수 사용
  static async saveUserData(data: AnalyticsData) {
    console.log('🔍 nestory 스키마로 Supabase 저장 시작:', data.sessionId);
    
    try {
      // userInfo에서 필요한 정보 추출
      const userInfo = data.userInfo || {};
      
      // 설문 답변에서 여행 빈도 추출 (예시 로직)
      const travelFrequency = data.answers?.length > 0 ? '정기적' : '가끔';
      
      // 나이 정보 배열 생성
      const ages = userInfo.age ? [userInfo.age] : [];
      
      // 관심사 추출 (설문 결과 기반)
      const interests = {
        travelType: data.result,
        preferences: data.answers?.slice(0, 3) || []
      };

      // 모든 컬럼 값 준비
      const currentIndex = data.answers?.length || 0;
      const sharedUrl = data.completed ? `${window.location.origin}/result/${data.sessionId}` : null;
      const referrer = document.referrer || 'direct';

      // 마케팅 관련 정보 분리
      const marketingConsent = userInfo.marketingConsent || false;
      const privacyConsent = userInfo.privacyConsent || false;
      const contactInfo = marketingConsent ? {
        name: userInfo.name,
        instagram: userInfo.instagram,
        region: userInfo.region
      } : null;

      // nestory 스키마 프록시 함수 호출 (모든 컬럼 완전 활용)
      const { data: result, error } = await supabase.rpc('save_nestory_response_complete', {
        p_session_id: data.sessionId,
        p_user_id: null, // 익명 사용자
        p_start_time: data.startTime,
        p_answers: data.answers,
        p_total_time: data.totalTime,
        p_result: data.result,
        p_current_index: currentIndex,
        p_completed: data.completed,
        p_family_size: userInfo.familySize || null,
        p_ages: ages.length > 0 ? ages : null,
        p_travel_frequency: travelFrequency,
        p_location: userInfo.region || null,
        p_interests: interests,
        p_result_details: {
          clickCount: data.clickCount,
          scrollDepth: data.scrollDepth,
          reliabilityScore: data.reliabilityScore,
          responsePattern: data.responsePattern
        },
        p_shared_url: sharedUrl,
        p_user_agent: data.userAgent,
        p_device_type: data.deviceType,
        p_referrer: referrer,
        p_marketing_consent: marketingConsent,
        p_privacy_consent: privacyConsent,
        p_contact_info: contactInfo
      });

      if (!error && result) {
        console.log('✅ nestory.user_responses 테이블에 저장 성공!');
        return true;
      } else {
        console.log('❌ nestory 프록시 함수 저장 실패:', error?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('💥 nestory 스키마 저장 오류:', error);
      return false;
    }
  }

  // nestory 스키마 프록시 함수로 모든 사용자 데이터 가져오기
  static async getAllUserData(): Promise<AnalyticsData[]> {
    console.log('🔍 nestory 스키마에서 Supabase 조회 시작...');
    
    try {
      // nestory 스키마 프록시 함수 호출
      const { data, error } = await supabase.rpc('get_nestory_responses');

      if (!error && data) {
        console.log(`✅ nestory.user_responses 테이블에서 ${data.length}개 데이터 조회 성공!`);
        
        // Supabase 데이터를 AnalyticsData 형식으로 변환
        return data.map((item: any) => ({
          sessionId: item.session_id,
          startTime: item.start_time, // 이미 bigint
          answers: item.answers,
          totalTime: item.total_time,
          clickCount: item.result_details?.clickCount || 0,
          scrollDepth: item.result_details?.scrollDepth || 0,
          deviceType: item.device_type,
          userAgent: item.user_agent,
          completed: item.completed,
          result: item.result,
          userInfo: item.result_details?.userInfo || null,
          submittedAt: item.submitted_at ? new Date(item.submitted_at).getTime() : Date.now(),
          reliabilityScore: item.result_details?.reliabilityScore || null,
          questionProgress: item.current_index || 0,
          responsePattern: item.result_details?.responsePattern || null
        }));
      } else {
        console.log('❌ nestory 프록시 함수 조회 실패:', error?.message || 'No data');
        return [];
      }
    } catch (error) {
      console.error('💥 nestory 스키마 데이터 조회 실패:', error);
      return [];
    }
  }

  // 통계 데이터 가져오기
  static async getStatsData() {
    try {
      const { data, error } = await supabase
        .from('nestory.user_responses')
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

  // nestory 스키마 프록시 함수로 데이터 삭제
  static async deleteUserData(sessionId: string) {
    try {
      const { data: result, error } = await supabase.rpc('delete_nestory_response', {
        p_session_id: sessionId
      });

      if (!error && result) {
        console.log('✅ nestory.user_responses에서 데이터 삭제 성공');
        return true;
      } else {
        console.error('❌ nestory 삭제 오류:', error?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('💥 nestory 데이터 삭제 실패:', error);
      return false;
    }
  }

  // 테이블이 존재하는지 확인하고 생성
  static async initializeDatabase() {
    try {
      // 먼저 테이블 존재 여부 확인
      const { data, error } = await supabase
        .from('nestory.user_responses')
        .select('session_id')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        // 테이블이 없으면 생성하라고 안내
        console.log('Supabase에서 nestory-landing-setup.sql 파일을 실행하세요.');
        console.log('또는 다음 SQL을 실행하여 테이블을 생성하세요:');
        console.log(`
          CREATE TABLE nestory.user_responses (
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