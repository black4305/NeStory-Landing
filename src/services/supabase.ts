import { createClient } from '@supabase/supabase-js';
import { AnalyticsData, UserInfo } from '../types';

// Supabase URL과 anon key는 환경변수에서 가져오거나 직접 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  // nestory-landing 스키마 프록시 함수 사용
  static async saveUserData(data: AnalyticsData) {
    console.log('🔍 nestory-landing 스키마로 Supabase 저장 시작:', data.sessionId);
    
    try {
      // userInfo에서 필요한 정보 추출
      const userInfo: UserInfo = data.userInfo || {} as UserInfo;
      
      // 설문 답변에서 여행 빈도 추출
      const travelFrequency = data.completed ? '연 2-3회' : '연 1회 미만';
      
      // 나이 정보 배열 생성 (가족 구성원 나이)
      const ages = userInfo.age ? 
        [userInfo.age, ...(userInfo.familySize > 1 ? ['30대', '10대 미만'] : [])] : 
        ['30대', '40대', '10대 미만'];
      
      // 관심사 추출 (설문 결과 기반)
      const interests = [
        data.result ? `${data.result} 유형 여행` : '가족 여행',
        '자연 탐방',
        '문화 체험',
        '맛집 탐방'
      ];
      
      // IP 주소 가져오기 (비동기)
      const getIPAddress = async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch {
          return '0.0.0.0';
        }
      };
      const ipAddress = await getIPAddress();

      // 모든 컬럼 값 준비 (결측치 방지)
      const currentIndex = data.answers?.length || 0;
      const sharedUrl = `${window.location.origin}/result/${data.sessionId}`;
      const referrer = document.referrer || window.location.origin;
      const submittedAt = data.completed ? new Date() : null;

      // 마케팅 관련 정보 분리
      const marketingConsent = userInfo.marketingConsent || false;
      const privacyConsent = userInfo.privacyConsent || false;
      const contactInfo = marketingConsent ? {
        name: userInfo.name,
        instagram: userInfo.instagram,
        region: userInfo.region
      } : null;

      // 브라우저 정보 수집
      const browserInfo = {
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // 각 문항별 소요 시간 (예시 - 실제로는 QuestionCard에서 수집해야 함)
      const questionTimes = data.answers?.map((answer, index) => ({
        questionId: index + 1,
        timeSpent: answer.timeSpent || 5000 // 기본 5초
      })) || [];

      // nestory-landing 스키마 프록시 함수 호출 (개별 컬럼으로 분리)
      const { data: result, error } = await supabase.rpc('save_nestory_landing_response_complete', {
        p_session_id: data.sessionId,
        p_user_id: null, // 익명 사용자
        p_start_time: data.startTime || Date.now(),
        p_answers: data.answers || [],
        p_total_time: data.totalTime || 0,
        p_result: data.result || 'INCOMPLETE',
        p_current_index: currentIndex,
        p_completed: data.completed || false,
        p_family_size: userInfo.familySize || 4,
        p_ages: ages,
        p_travel_frequency: travelFrequency,
        p_location: userInfo.region || '서울',
        p_interests: interests,
        p_shared_url: sharedUrl,
        p_ip_address: ipAddress,
        p_user_agent: data.userAgent || navigator.userAgent,
        p_device_type: data.deviceType || 'desktop',
        p_referrer: referrer,
        p_submitted_at: submittedAt,
        p_marketing_consent: marketingConsent,
        // 새로운 개별 컬럼들
        p_click_count: data.clickCount || 0,
        p_scroll_depth: data.scrollDepth || 0,
        p_reliability_score: data.reliabilityScore || 0.8,
        p_response_pattern: data.responsePattern || 'normal',
        p_privacy_consent: privacyConsent,
        p_user_name: userInfo.name || null,
        p_user_instagram: userInfo.instagram || null,
        p_question_times: questionTimes,
        p_browser_info: browserInfo
      });

      if (!error && result) {
        console.log('✅ nestory-landing.nestory_landing_user_responses 테이블에 저장 성공!');
        return true;
      } else {
        console.log('❌ nestory-landing 프록시 함수 저장 실패:', error?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('💥 nestory-landing 스키마 저장 오류:', error);
      return false;
    }
  }

  // nestory-landing 스키마 프록시 함수로 모든 사용자 데이터 가져오기
  static async getNestoryLandingUserData(): Promise<AnalyticsData[]> {
    console.log('🔍 nestory-landing 스키마에서 Supabase 조회 시작...');
    
    try {
      // nestory-landing 스키마 프록시 함수 호출
      const { data, error } = await supabase.rpc('get_nestory_landing_responses');

      if (!error && data) {
        console.log(`✅ nestory-landing.nestory_landing_user_responses 테이블에서 ${data.length}개 데이터 조회 성공!`);
        
        // Supabase 데이터를 AnalyticsData 형식으로 변환
        return data.map((item: any) => {
          // UserInfo 객체 재구성
          const userInfo: UserInfo | undefined = (item.user_name || item.user_instagram || item.location) ? {
            name: item.user_name || '',
            instagram: item.user_instagram || '',
            age: item.ages?.[0] || '',
            gender: '',
            familySize: item.family_size || 0,
            region: item.location || '',
            marketingConsent: item.marketing_consent || false,
            privacyConsent: item.privacy_consent || false
          } : undefined;

          return {
            id: item.id,
            sessionId: item.session_id,
            startTime: item.start_time,
            answers: item.answers,
            totalTime: item.total_time,
            clickCount: item.click_count || 0, // 이제 개별 컬럼에서 가져옴
            scrollDepth: item.scroll_depth || 0,
            deviceType: item.device_type,
            userAgent: item.user_agent,
            completed: item.completed,
            result: item.result,
            userInfo: userInfo,
            submittedAt: item.submitted_at ? new Date(item.submitted_at).getTime() : Date.now(),
            reliabilityScore: item.reliability_score || null, // 개별 컬럼
            questionProgress: item.current_index || 0,
            responsePattern: item.response_pattern || null, // 개별 컬럼
            privacyConsent: item.privacy_consent || false,
            questionTimes: item.question_times || [],
            browserInfo: item.browser_info || null
          };
        });
      } else {
        console.log('❌ nestory-landing 프록시 함수 조회 실패:', error?.message || 'No data');
        return [];
      }
    } catch (error) {
      console.error('💥 nestory-landing 스키마 데이터 조회 실패:', error);
      return [];
    }
  }

  // 통계 데이터 가져오기 (프록시 함수 사용)
  static async getStatsData() {
    try {
      const { data, error } = await supabase.rpc('get_nestory_landing_stats');

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

  // 결과별 리더보드 가져오기
  static async getResultLeaderboard() {
    try {
      const { data, error } = await supabase.rpc('get_nestory_landing_result_leaderboard');

      if (error) {
        console.error('리더보드 조회 오류:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('리더보드 조회 실패:', error);
      return null;
    }
  }

  // 활성 사용자 가져오기
  static async getActiveUsers() {
    try {
      const { data, error } = await supabase.rpc('get_nestory_landing_active_users');

      if (error) {
        console.error('활성 사용자 조회 오류:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('활성 사용자 조회 실패:', error);
      return null;
    }
  }

  // 랜딩 페이지 분석 데이터 저장 (모든 컬럼 채우기)
  static async saveLandingAnalytics(data: {
    visitId: string;
    timestamp: number;
    userAgent?: string;
    referrer?: string;
    deviceType?: string;
    sessionDuration?: number;
    ctaClicked?: boolean;
    scrollDepth?: number;
  }) {
    try {
      const { data: result, error } = await supabase.rpc('save_nestory_landing_analytics', {
        p_visit_id: data.visitId,
        p_timestamp: data.timestamp || Date.now(),
        p_user_agent: data.userAgent || navigator.userAgent,
        p_referrer: data.referrer || window.location.origin,
        p_device_type: data.deviceType || SupabaseService.getDeviceType(),
        p_session_duration: data.sessionDuration || 0,
        p_cta_clicked: data.ctaClicked || false,
        p_scroll_depth: data.scrollDepth || 0
      });

      if (error) {
        console.error('랜딩 분석 데이터 저장 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('랜딩 분석 데이터 저장 실패:', error);
      return false;
    }
  }

  // nestory-landing 스키마 프록시 함수로 데이터 삭제
  static async deleteUserData(id: string) {
    try {
      const { data: result, error } = await supabase.rpc('delete_nestory_landing_response', {
        p_id: id // UUID로 삭제
      });

      if (!error && result) {
        console.log('✅ nestory-landing.nestory_landing_user_responses에서 데이터 삭제 성공');
        return true;
      } else {
        console.error('❌ nestory-landing 삭제 오류:', error?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('💥 nestory-landing 데이터 삭제 실패:', error);
      return false;
    }
  }


  // 관리자 페이지용: nestory-landing 데이터 삭제
  static async deleteNestoryLandingUserData(id: string) {
    return await this.deleteUserData(id);
  }

  // 관리자 페이지용: nestory-landing 통계 조회
  static async getNestoryLandingStats() {
    try {
      const { data: stats, error } = await supabase.rpc('get_nestory_landing_stats');

      if (error) {
        console.error('통계 조회 오류:', error);
        return null;
      }

      return stats;
    } catch (error) {
      console.error('nestory-landing 통계 조회 실패:', error);
      return null;
    }
  }

  // 관리자 페이지용: nestory-landing 결과 리더보드 조회
  static async getNestoryLandingLeaderboard() {
    try {
      const { data: leaderboard, error } = await supabase.rpc('get_nestory_landing_result_leaderboard');

      if (error) {
        console.error('리더보드 조회 오류:', error);
        return [];
      }

      return leaderboard || [];
    } catch (error) {
      console.error('nestory-landing 리더보드 조회 실패:', error);
      return [];
    }
  }

  // 랜딩 페이지 분석 데이터 조회
  static async getLandingAnalytics() {
    try {
      const { data: analytics, error } = await supabase
        .from('nestory_landing_analytics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('랜딩 분석 데이터 조회 오류:', error);
        return [];
      }

      return analytics || [];
    } catch (error) {
      console.error('랜딩 분석 데이터 조회 실패:', error);
      return [];
    }
  }

  // 관리자 페이지용: nestory-landing 활성 사용자 조회
  static async getNestoryLandingActiveUsers() {
    try {
      const { data: activeUsers, error } = await supabase.rpc('get_nestory_landing_active_users');

      if (error) {
        console.error('활성 사용자 조회 오류:', error);
        return [];
      }

      return activeUsers || [];
    } catch (error) {
      console.error('nestory-landing 활성 사용자 조회 실패:', error);
      return [];
    }
  }

  // 테이블이 존재하는지 확인하고 생성
  static async initializeDatabase() {
    try {
      // 먼저 테이블 존재 여부 확인
      const { data, error } = await supabase
        .from('nestory-landing.nestory_landing_user_responses')
        .select('session_id')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        // 테이블이 없으면 생성하라고 안내
        console.log('Supabase에서 nestory-landing-setup.sql 파일을 실행하세요.');
        console.log('또는 다음 SQL을 실행하여 테이블을 생성하세요:');
        console.log(`
          CREATE TABLE "nestory-landing".nestory_landing_user_responses (
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

  // 관리자 페이지 호환성을 위한 기존 함수명 유지 (getNestoryLandingUserData의 별칭)
  static async getAllUserData() {
    return await this.getNestoryLandingUserData();
  }

  // 디바이스 타입 감지 헬퍼 함수
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }
}