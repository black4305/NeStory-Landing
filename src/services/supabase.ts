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

      // squeeze_leads 테이블에 직접 저장 (새로운 RPC 함수 사용)
      const { data: result, error } = await supabase.rpc('landing_save_lead', {
        p_session_id: data.sessionId,
        p_lead_source: 'nestoryti_test',
        p_email: userInfo.instagram ? `${userInfo.instagram}@instagram` : null,
        p_phone: null,
        p_name: userInfo.name || null,
        p_email_consent: marketingConsent,
        p_marketing_consent: marketingConsent,
        p_privacy_consent: privacyConsent,
        p_lead_magnet_name: 'family_travel_test',
        p_conversion_page: window.location.pathname,
        p_lead_score: data.completed ? 80 : 50,
        p_lead_quality: data.completed ? 'warm' : 'cold',
        p_engagement_level: data.completed ? 'high' : 'medium'
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

  // squeeze_leads 테이블에서 모든 사용자 데이터 가져오기
  static async getNestoryLandingUserData(): Promise<AnalyticsData[]> {
    console.log('🔍 squeeze_leads 테이블에서 Supabase 조회 시작...');
    
    try {
      // squeeze_leads 테이블에서 직접 조회
      const { data, error } = await supabase
        .from('squeeze_leads')
        .select('*')
        .order('converted_at', { ascending: false });

      if (!error && data) {
        console.log(`✅ squeeze_leads 테이블에서 ${data.length}개 데이터 조회 성공!`);
        
        // Supabase 데이터를 AnalyticsData 형식으로 변환
        return data.map((item: any) => {
          // UserInfo 객체 재구성
          const userInfo: UserInfo | undefined = (item.name || item.email) ? {
            name: item.name || '',
            instagram: item.email?.includes('@instagram') ? item.email.split('@')[0] : '',
            age: '',
            gender: '',
            familySize: 4,
            region: '',
            marketingConsent: item.marketing_consent || false,
            privacyConsent: item.privacy_consent || false
          } : undefined;

          return {
            id: item.id,
            sessionId: item.session_id,
            timestamp: new Date(item.converted_at).getTime(),
            startTime: new Date(item.converted_at).getTime() - 300000, // 5분 전으로 가정
            answers: [],
            totalTime: 300000, // 5분으로 가정
            clickCount: 0,
            scrollDepth: 0,
            deviceType: 'desktop',
            userAgent: '',
            completed: true,
            result: 'COMPLETED',
            userInfo: userInfo,
            submittedAt: new Date(item.converted_at).getTime(),
            reliabilityScore: item.lead_score ? item.lead_score / 100 : 0.8,
            questionProgress: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            responsePattern: 'consistent',
            privacyConsent: item.privacy_consent || false,
            questionTimes: [],
            browserInfo: undefined
          };
        });
      } else {
        console.log('❌ squeeze_leads 조회 실패:', error?.message || 'No data');
        return [];
      }
    } catch (error) {
      console.error('💥 squeeze_leads 데이터 조회 실패:', error);
      return [];
    }
  }

  // 통계 데이터 가져오기 (새로운 RPC 함수 사용)
  static async getStatsData() {
    try {
      const { data, error } = await supabase.rpc('landing_get_realtime_stats');

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

  // 결과별 리더보드 가져오기 (테이블에서 직접 조회)
  static async getResultLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('squeeze_leads')
        .select('lead_magnet_name, lead_quality, count')
        .order('converted_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('리더보드 조회 오류:', error);
        return null;
      }

      // 결과별 집계
      const leaderboard = data?.reduce((acc: any, lead: any) => {
        const result = lead.lead_quality || 'unknown';
        if (!acc[result]) {
          acc[result] = { result, count: 0 };
        }
        acc[result].count++;
        return acc;
      }, {});

      return Object.values(leaderboard || {});
    } catch (error) {
      console.error('리더보드 조회 실패:', error);
      return null;
    }
  }

  // 활성 사용자 가져오기 (세션 테이블에서 직접 조회)
  static async getActiveUsers() {
    try {
      // 최근 5분 이내 활동한 세션 조회
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, last_activity, device_type, city')
        .gte('last_activity', fiveMinutesAgo)
        .order('last_activity', { ascending: false });

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
      // 이벤트 추적으로 대체 - 올바른 파라미터 사용
      const { data: result, error } = await supabase.rpc('landing_record_user_event', {
        p_session_id: data.visitId || `temp_${Date.now()}`,
        p_event_type: 'page_analytics',
        p_timestamp_ms: data.timestamp || Date.now(),
        p_element_type: 'analytics',
        p_metadata: {
          userAgent: data.userAgent || navigator.userAgent,
          referrer: data.referrer || window.location.origin,
          deviceType: data.deviceType || SupabaseService.getDeviceType(),
          sessionDuration: data.sessionDuration || 0,
          ctaClicked: data.ctaClicked || false,
          scrollDepth: data.scrollDepth || 0
        }
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
      // squeeze_leads 테이블에서 직접 삭제
      const { data: result, error } = await supabase
        .from('squeeze_leads')
        .delete()
        .eq('id', id);

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
      const { data: stats, error } = await supabase.rpc('landing_get_realtime_stats');

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
      // 테이블에서 직접 조회 (RPC 함수 없음)
      const { data: leaderboard, error } = await supabase
        .from('squeeze_test_results')
        .select('travel_type_code, type_code')
        .not('travel_type_code', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);

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
      // 테이블에서 직접 조회
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: activeUsers, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, device_type, country, city, last_activity')
        .gte('last_activity', fiveMinutesAgo)
        .order('last_activity', { ascending: false });

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

  // 리드 정보 저장 (팝업에서 사용)
  static async saveLeadInfo(data: {
    visitId: string;
    timestamp: number;
    leadType: string;
    email?: string;
    phone?: string;
    marketingConsent: boolean;
  }) {
    try {
      const { error } = await supabase.rpc('landing_save_lead', {
        p_session_id: data.visitId,
        p_lead_source: data.leadType,
        p_email: data.email || null,
        p_phone: data.phone || null,
        p_marketing_consent: data.marketingConsent,
        p_privacy_consent: true
      });

      if (error) {
        console.error('리드 정보 저장 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('리드 정보 저장 실패:', error);
      return false;
    }
  }

  // 페이지 분석 데이터 저장
  static async savePageAnalytics(data: {
    page: string;
    timestamp: number;
    sessionId: string;
    visitId: string;
    duration?: number;
    scrollDepth?: number;
    interactions?: number;
    exitPoint?: string;
    deviceType: string;
    userAgent: string;
    referrer: string;
    viewportWidth: number;
    viewportHeight: number;
  }) {
    try {
      const { error } = await supabase
        .from('squeeze_page_visits')
        .insert({
          session_id: data.sessionId,
          route: data.page,
          page_title: document.title,
          full_url: window.location.href,
          enter_time: new Date(data.timestamp).toISOString(),
          duration_ms: data.duration,
          scroll_depth_percent: data.scrollDepth,
          interaction_count: data.interactions,
          exit_type: data.exitPoint
        });

      if (error) {
        console.error('페이지 분석 데이터 저장 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('페이지 분석 데이터 저장 실패:', error);
      return false;
    }
  }

  // 페이지별 분석 데이터 조회
  static async getPageAnalytics(page?: string) {
    try {
      let query = supabase
        .from('squeeze_page_visits')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (page) {
        query = query.eq('page', page);
      }

      const { data, error } = await query;

      if (error) {
        console.error('페이지 분석 데이터 조회 오류:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('페이지 분석 데이터 조회 실패:', error);
      return [];
    }
  }

  // CTA 클릭 추적
  static async saveCTAClick(data: {
    page: string;
    ctaName: string;
    ctaTarget?: string;
    sessionId: string;
    visitId: string;
    timestamp: number;
    deviceType: string;
    userAgent: string;
    scrollDepth: number;
    timeOnPage: number;
  }) {
    try {
      const { error } = await supabase
        .from('squeeze_user_events')
        .eq('event_type', 'cta_click')
        .insert({
          session_id: data.sessionId,
          event_type: 'cta_click',
          element_id: data.ctaName,
          element_type: 'cta',
          element_text: data.ctaTarget,
          timestamp_ms: data.timestamp,
          time_on_page_ms: data.timeOnPage,
          scroll_position: Math.round((data.scrollDepth / 100) * document.body.scrollHeight),
          cta_type: data.ctaName
        });

      if (error) {
        console.error('CTA 클릭 추적 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('CTA 클릭 추적 실패:', error);
      return false;
    }
  }

  // 섹션 조회 추적
  static async saveSectionView(data: {
    page: string;
    section: string;
    sessionId: string;
    visitId: string;
    timestamp: number;
    scrollDepth: number;
    timeOnPage: number;
  }) {
    try {
      const { error } = await supabase
        .from('squeeze_user_events')
        .eq('event_type', 'section_view')
        .insert({
          session_id: data.sessionId,
          event_type: 'section_view',
          element_id: data.section,
          element_type: 'section',
          timestamp_ms: data.timestamp,
          time_on_page_ms: data.timeOnPage,
          scroll_position: Math.round((data.scrollDepth / 100) * document.body.scrollHeight)
        });

      if (error) {
        console.error('섹션 조회 추적 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('섹션 조회 추적 실패:', error);
      return false;
    }
  }

  // CTA 클릭 데이터 조회
  static async getCTAAnalytics(page?: string) {
    try {
      let query = supabase
        .from('squeeze_user_events')
        .eq('event_type', 'cta_click')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (page) {
        query = query.eq('page', page);
      }

      const { data, error } = await query;

      if (error) {
        console.error('CTA 분석 데이터 조회 오류:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('CTA 분석 데이터 조회 실패:', error);
      return [];
    }
  }

  // 섹션 조회 데이터 조회
  static async getSectionAnalytics(page?: string) {
    try {
      let query = supabase
        .from('squeeze_user_events')
        .eq('event_type', 'section_view')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (page) {
        query = query.eq('page', page);
      }

      const { data, error } = await query;

      if (error) {
        console.error('섹션 분석 데이터 조회 오류:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('섹션 분석 데이터 조회 실패:', error);
      return [];
    }
  }

  // 사용자 정보를 세션에 연결
  static async linkUserInfoToSession(data: {
    sessionId: string;
    visitId: string;
    userInfo: {
      email?: string;
      phone?: string;
      name?: string;
      marketingConsent?: boolean;
    };
    timestamp: number;
  }) {
    try {
      // squeeze_page_visits에는 사용자 정보 필드가 없음
      // squeeze_leads 테이블에 사용자 정보 저장
      const pageError = null;

      // squeeze_user_events에는 사용자 정보 필드가 없음
      const ctaError = null;

      // squeeze_user_events에는 사용자 정보 필드가 없음
      const sectionError = null;

      // squeeze_leads 테이블에 사용자 정보 저장
      const { error: userError } = await supabase.rpc('landing_save_lead', {
        p_session_id: data.sessionId,
        p_email: data.userInfo.email,
        p_phone: data.userInfo.phone,
        p_name: data.userInfo.name,
        p_marketing_consent: data.userInfo.marketingConsent,
        p_privacy_consent: true,
        p_lead_source: 'identification'
      });

      if (pageError || ctaError || sectionError || userError) {
        console.error('사용자 정보 연결 오류:', { pageError, ctaError, sectionError, userError });
        return false;
      }

      return true;
    } catch (error) {
      console.error('사용자 정보 연결 실패:', error);
      return false;
    }
  }

  // 식별된 사용자와 익명 사용자 통계 조회
  static async getUserIdentificationStats() {
    try {
      const { data: pageData, error } = await supabase
        .from('squeeze_page_visits')
        .select('session_id, enter_time')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('사용자 식별 통계 조회 오류:', error);
        return {
          total: 0,
          identified: 0,
          anonymous: 0,
          identificationRate: 0
        };
      }

      const total = pageData?.length || 0;
      // squeeze_leads 테이블에서 식별된 사용자 조회
      const { data: leadData } = await supabase
        .from('squeeze_leads')
        .select('session_id, email, phone');
      
      const identified = leadData?.filter(item => item.email || item.phone).length || 0;
      const anonymous = total - identified;
      const identificationRate = total > 0 ? Math.round((identified / total) * 100) : 0;

      return {
        total,
        identified,
        anonymous,
        identificationRate,
        identifiedUsers: leadData?.filter(item => item.email || item.phone) || []
      };
    } catch (error) {
      console.error('사용자 식별 통계 조회 실패:', error);
      return {
        total: 0,
        identified: 0,
        anonymous: 0,
        identificationRate: 0
      };
    }
  }

  // 사용자별 상세 KPI 조회
  static async getUserDetailedKPI(sessionId: string) {
    try {
      // 페이지 분석 데이터
      const { data: pageData } = await supabase
        .from('squeeze_page_visits')
        .select('*')
        .eq('session_id', sessionId);

      // CTA 클릭 데이터
      const { data: ctaData } = await supabase
        .from('squeeze_user_events')
        .eq('event_type', 'cta_click')
        .select('*')
        .eq('session_id', sessionId);

      // 섹션 조회 데이터
      const { data: sectionData } = await supabase
        .from('squeeze_user_events')
        .eq('event_type', 'section_view')
        .select('*')
        .eq('session_id', sessionId);

      return {
        pageAnalytics: pageData || [],
        ctaClicks: ctaData || [],
        sectionViews: sectionData || []
      };
    } catch (error) {
      console.error('사용자 상세 KPI 조회 실패:', error);
      return {
        pageAnalytics: [],
        ctaClicks: [],
        sectionViews: []
      };
    }
  }

  // 디바이스 타입 감지 헬퍼 함수
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  // 상세 이벤트 저장
  static async saveDetailedEvents(events: any[]) {
    try {
      const { data, error } = await supabase
        .from('squeeze_user_events')
        .insert(events);

      if (error) {
        console.error('상세 이벤트 저장 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('상세 이벤트 저장 실패:', error);
      return false;
    }
  }

  // 페이지 세션 저장
  static async savePageSessions(sessions: any[]) {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .insert(sessions);

      if (error) {
        console.error('페이지 세션 저장 오류:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('페이지 세션 저장 실패:', error);
      return false;
    }
  }

  // 사용자 여정 분석 데이터 조회
  static async getUserJourneyAnalytics(sessionId?: string) {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('squeeze_user_events')
        .select('*')
        .eq(sessionId ? 'sessionId' : 'sessionId', sessionId || '')
        .order('timestamp_ms', { ascending: true });

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('squeeze_page_visits')
        .select('*')
        .eq(sessionId ? 'sessionId' : 'sessionId', sessionId || '')
        .order('enter_time', { ascending: true });

      if (eventsError || sessionsError) {
        console.error('사용자 여정 데이터 조회 오류:', eventsError || sessionsError);
        return null;
      }

      return {
        events: eventsData || [],
        sessions: sessionsData || []
      };
    } catch (error) {
      console.error('사용자 여정 데이터 조회 실패:', error);
      return null;
    }
  }

  // 라우트별 통계 조회
  static async getRouteAnalytics() {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .select('route, duration_ms, interaction_count, scroll_depth_percent, cta_clicks')
        .order('enter_time', { ascending: false });

      if (error) {
        console.error('라우트 통계 조회 오류:', error);
        return null;
      }

      // 라우트별 집계
      const routeStats = data?.reduce((acc: any, session: any) => {
        if (!acc[session.route]) {
          acc[session.route] = {
            route: session.route,
            totalSessions: 0,
            avgDuration: 0,
            avgInteractions: 0,
            avgScrollDepth: 0,
            totalCtaClicks: 0,
            totalErrors: 0,
            bounceRate: 0
          };
        }

        const stats = acc[session.route];
        stats.totalSessions++;
        stats.avgDuration = (stats.avgDuration + (session.duration_ms || 0)) / stats.totalSessions;
        stats.avgInteractions = (stats.avgInteractions + session.interaction_count) / stats.totalSessions;
        stats.avgScrollDepth = (stats.avgScrollDepth + session.scroll_depth_percent) / stats.totalSessions;
        stats.totalCtaClicks += session.cta_clicks || 0;
        stats.totalErrors += 0; // squeeze_page_visits에 errors 필드 없음
        
        // 바운스 레이트 계산 (5초 미만 + 인터랙션 없음)
        if ((session.duration_ms || 0) < 5000 && session.interaction_count === 0) {
          stats.bounceRate++;
        }

        return acc;
      }, {});

      // 바운스 레이트를 퍼센티지로 변환
      Object.values(routeStats || {}).forEach((stats: any) => {
        stats.bounceRate = (stats.bounceRate / stats.totalSessions) * 100;
      });

      return Object.values(routeStats || {});
    } catch (error) {
      console.error('라우트 통계 조회 실패:', error);
      return null;
    }
  }

  // 전환율 분석 (퍼널 분석)
  static async getFunnelAnalytics() {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .select('session_id, route, enter_time, cta_clicks')
        .order('session_id, enter_time', { ascending: true });

      if (error) {
        console.error('퍼널 분석 조회 오류:', error);
        return null;
      }

      // 세션별로 그룹핑하여 여정 분석
      const sessionJourneys = data?.reduce((acc: any, session: any) => {
        if (!acc[session.session_id]) {
          acc[session.session_id] = [];
        }
        acc[session.session_id].push(session);
        return acc;
      }, {});

      const funnelSteps = ['/', '/info', '/nestoryti', '/squeeze', '/result'];
      const funnelData = funnelSteps.map((step, index) => ({
        step,
        stepName: ['랜딩페이지', '안내페이지', '테스트페이지', '고객정보페이지', '결과페이지'][index],
        users: 0,
        dropoffRate: 0,
        conversionRate: 0
      }));

      // 세션별 여정 분석
      const totalSessions = Object.keys(sessionJourneys || {}).length;
      Object.values(sessionJourneys || {}).forEach((journey: any) => {
        journey.forEach((session: any) => {
          const stepIndex = funnelSteps.indexOf(session.route);
          if (stepIndex !== -1) {
            funnelData[stepIndex].users++;
          }
        });
      });

      // 전환율 및 이탈률 계산
      funnelData.forEach((step, index) => {
        if (index === 0) {
          step.conversionRate = 100;
          step.dropoffRate = 0;
        } else {
          const prevStepUsers = funnelData[index - 1].users;
          step.conversionRate = prevStepUsers > 0 ? (step.users / prevStepUsers) * 100 : 0;
          step.dropoffRate = 100 - step.conversionRate;
        }
      });

      return funnelData;
    } catch (error) {
      console.error('퍼널 분석 실패:', error);
      return null;
    }
  }
}