import { createClient } from '@supabase/supabase-js';

// Supabase 환경 변수 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 기존 PostgresService와 동일한 인터페이스 유지
export interface AnonymousSession {
  id?: string;
  session_id: string;
  user_agent?: string;
  ip_address?: string;
  device_type?: string;
  country?: string;
  city?: string;
  referrer?: string;
  landing_page?: string;
}

export interface PageVisit {
  session_id: string;
  route: string;
  page_title: string;
  url_params?: any;
  enter_time: string | Date;
  scroll_depth_percent?: number;
  click_count?: number;
  interaction_count?: number;
  cta_clicks?: number;
  form_interactions?: number;
  bounce?: boolean;
  exit_intent_triggered?: boolean;
  load_time_ms?: number;
  exit_time?: string | Date;
  [key: string]: any;
}

export interface UserEvent {
  session_id: string;
  event_type: string;
  event_data?: any;
  timestamp?: Date | string;
  page_visit_id?: string;
  target_element?: string;
  target_text?: string;
  target_value?: any;
  mouse_x?: number;
  mouse_y?: number;
  keyboard_key?: string;
  scroll_x?: number;
  scroll_y?: number;
  error_message?: string;
  metadata?: any;
  created_at?: Date | string;
}

export interface Lead {
  session_id: string;
  email?: string;
  contact_type?: string;
  contact_value?: string;
  marketing_consent?: any;
  privacy_consent?: any;
  kakao_channel_added?: any;
  lead_source?: string;
  travel_type?: string;
  lead_score?: number;
  webhook_sent?: boolean;
  created_at?: string | Date;
  name?: string;
  source?: string;
  timestamp?: Date;
}

export interface SurveyResponse {
  session_id: string;
  question_id: string | number;
  question_number?: number;
  question_text?: string;
  option_a?: string;
  option_b?: string;
  answer?: string;
  selected_option?: string;
  selected_score?: number;
  response_time_ms?: number;
  confidence_score?: number;
  answered_at?: string | Date;
  timestamp?: Date;
  [key: string]: any;
}

export interface TestResult {
  session_id: string;
  type_code?: string;
  travel_type_code?: string;
  axis_scores: any;
  total_response_time_ms?: any;
  average_response_time_ms?: any;
  completion_rate?: any;
  consistency_score?: number;
  started_at?: string | Date;
  completed_at?: string | Date;
  share_id?: string;
  shared_count?: number;
  timestamp?: Date;
}

export class SupabaseService {
  // 1. 초기 데이터 조회
  async getInitialData() {
    try {
      // 기본 통계 데이터 조회
      const { data: sessions, error: sessionError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('*')
        .limit(10);

      if (sessionError) throw sessionError;

      return {
        success: true,
        data: {
          sessions: sessions || []
        }
      };
    } catch (error) {
      console.error('초기 데이터 조회 오류:', error);
      return { success: false, error: '초기 데이터를 불러올 수 없습니다.' };
    }
  }

  // 2. 세션 생성/업데이트
  async createOrUpdateSession(sessionData: AnonymousSession) {
    try {
      const { data, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .upsert({
          ...sessionData,
          last_activity: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('세션 생성/업데이트 오류:', error);
      return { success: false, error: '세션을 저장할 수 없습니다.' };
    }
  }

  // 3. 페이지 방문 기록
  async recordPageVisit(visitData: PageVisit) {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .insert({
          ...visitData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('페이지 방문 기록 오류:', error);
      return { success: false, error: '페이지 방문을 기록할 수 없습니다.' };
    }
  }

  // 4. 사용자 이벤트 기록
  async recordUserEvent(eventData: UserEvent) {
    try {
      const { data, error } = await supabase
        .from('squeeze_user_events')
        .insert({
          ...eventData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('사용자 이벤트 기록 오류:', error);
      return { success: false, error: '이벤트를 기록할 수 없습니다.' };
    }
  }

  // 5. 배치 이벤트 기록
  async recordBatchEvents(events: UserEvent[]) {
    try {
      const eventsWithTimestamp = events.map(event => ({
        ...event,
        created_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('squeeze_user_events')
        .insert(eventsWithTimestamp)
        .select();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('배치 이벤트 기록 오류:', error);
      return { success: false, error: '배치 이벤트를 기록할 수 없습니다.' };
    }
  }

  // 6. 리드 저장
  async saveLead(leadData: Lead) {
    try {
      const { data, error } = await supabase
        .from('squeeze_leads')
        .insert({
          ...leadData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('리드 저장 오류:', error);
      return { success: false, error: '리드를 저장할 수 없습니다.' };
    }
  }

  // 7. 테스트 결과 저장
  async saveTestResult(resultData: TestResult) {
    try {
      const { data, error } = await supabase
        .from('squeeze_test_results')
        .insert({
          ...resultData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('테스트 결과 저장 오류:', error);
      return { success: false, error: '테스트 결과를 저장할 수 없습니다.' };
    }
  }

  // 8. 전환 추적
  async recordConversion(conversionData: any) {
    try {
      const { data, error } = await supabase
        .from('squeeze_conversions')
        .insert({
          ...conversionData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('전환 추적 오류:', error);
      return { success: false, error: '전환을 기록할 수 없습니다.' };
    }
  }

  // 9. 분석 데이터 조회
  async getFunnelMetrics() {
    try {
      // 세션 통계
      const { data: sessionStats, error: sessionError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (sessionError) throw sessionError;

      // 리드 통계
      const { data: leadStats, error: leadError } = await supabase
        .from('squeeze_leads')
        .select('session_id, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (leadError) throw leadError;

      const totalSessions = sessionStats?.length || 0;
      const totalLeads = leadStats?.length || 0;
      const conversionRate = totalSessions > 0 ? (totalLeads / totalSessions) * 100 : 0;

      return {
        success: true,
        data: {
          totalSessions,
          totalLeads,
          conversionRate: Math.round(conversionRate * 100) / 100
        }
      };
    } catch (error) {
      console.error('퍼널 메트릭스 조회 오류:', error);
      return { success: false, error: '분석 데이터를 불러올 수 없습니다.' };
    }
  }

  // 10. 실시간 통계
  async getRealtimeStats() {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // 오늘 세션 수
      const { data: todaySessions, error: todayError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('created_at', oneDayAgo.toISOString());

      if (todayError) throw todayError;

      // 현재 활성 세션 (1시간 이내 활동)
      const { data: activeSessions, error: activeError } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('last_activity', oneHourAgo.toISOString());

      if (activeError) throw activeError;

      return {
        success: true,
        data: {
          sessionsToday: todaySessions?.length || 0,
          activeSessions: activeSessions?.length || 0
        }
      };
    } catch (error) {
      console.error('실시간 통계 조회 오류:', error);
      return { success: false, error: '실시간 통계를 불러올 수 없습니다.' };
    }
  }

  // 11. 여행 유형별 분석
  async getTravelTypeAnalytics() {
    try {
      const { data: results, error } = await supabase
        .from('squeeze_test_results')
        .select('type_code')
        .not('type_code', 'is', null);

      if (error) throw error;

      // 유형별 카운트
      const typeCounts = (results || []).reduce((acc, result) => {
        const type = result.type_code;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: typeCounts
      };
    } catch (error) {
      console.error('여행 유형 분석 조회 오류:', error);
      return { success: false, error: '여행 유형 분석을 불러올 수 없습니다.' };
    }
  }

  // 12. 페이지 성능 분석
  async getPagePerformanceAnalytics() {
    try {
      const { data: visits, error } = await supabase
        .from('squeeze_page_visits')
        .select('route, enter_time, exit_time, scroll_depth_percent')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // 페이지별 통계 계산
      const pageStats = (visits || []).reduce((acc, visit) => {
        const route = visit.route;
        if (!acc[route]) {
          acc[route] = {
            visits: 0,
            totalTime: 0,
            avgScrollDepth: 0,
            scrollSamples: 0
          };
        }
        
        acc[route].visits++;
        
        if (visit.enter_time && visit.exit_time) {
          const duration = new Date(visit.exit_time).getTime() - new Date(visit.enter_time).getTime();
          acc[route].totalTime += duration;
        }
        
        if (visit.scroll_depth_percent) {
          acc[route].avgScrollDepth += visit.scroll_depth_percent;
          acc[route].scrollSamples++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      // 평균 계산
      Object.keys(pageStats).forEach(route => {
        const stats = pageStats[route];
        stats.avgTime = stats.visits > 0 ? stats.totalTime / stats.visits : 0;
        stats.avgScrollDepth = stats.scrollSamples > 0 ? stats.avgScrollDepth / stats.scrollSamples : 0;
      });

      return {
        success: true,
        data: pageStats
      };
    } catch (error) {
      console.error('페이지 성능 분석 조회 오류:', error);
      return { success: false, error: '페이지 성능 분석을 불러올 수 없습니다.' };
    }
  }

  // 13. 활성 사용자 데이터
  async getActiveUserData() {
    try {
      const { data: users, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id, device_type, country, city, last_activity')
        .gte('last_activity', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('last_activity', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: users || []
      };
    } catch (error) {
      console.error('활성 사용자 데이터 조회 오류:', error);
      return { success: false, error: '활성 사용자 데이터를 불러올 수 없습니다.' };
    }
  }

  // 14. 지역별 분석
  async getGeographicAnalytics() {
    try {
      const { data: sessions, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('country, city')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // 국가별 카운트
      const countryCounts = (sessions || []).reduce((acc, session) => {
        const country = session.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 도시별 카운트
      const cityCounts = (sessions || []).reduce((acc, session) => {
        const city = session.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: {
          countries: countryCounts,
          cities: cityCounts
        }
      };
    } catch (error) {
      console.error('지역별 분석 조회 오류:', error);
      return { success: false, error: '지역별 분석을 불러올 수 없습니다.' };
    }
  }

  // 15. 현재 활성 사용자
  async getCurrentActiveUsers() {
    try {
      const { data: activeUsers, error } = await supabase
        .from('squeeze_anonymous_sessions')
        .select('session_id')
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      if (error) throw activeUsers;

      return {
        success: true,
        data: {
          count: activeUsers?.length || 0
        }
      };
    } catch (error) {
      console.error('현재 활성 사용자 조회 오류:', error);
      return { success: false, error: '활성 사용자를 불러올 수 없습니다.' };
    }
  }

  // 16. 페이지 방문 종료 업데이트
  async updatePageVisitExit(visitId: string, exitData: any) {
    try {
      const { data, error } = await supabase
        .from('squeeze_page_visits')
        .update({
          ...exitData,
          exit_time: new Date().toISOString()
        })
        .eq('id', visitId)
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('페이지 방문 종료 업데이트 오류:', error);
      return { success: false, error: '페이지 방문 종료를 업데이트할 수 없습니다.' };
    }
  }

  // 17. Survey 응답 저장 (Survey 연동용)
  async saveSurveyResponse(responseData: any) {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .insert({
          ...responseData,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('Survey 응답 저장 오류:', error);
      return { success: false, error: 'Survey 응답을 저장할 수 없습니다.' };
    }
  }
}

// 싱글톤 인스턴스 생성
export const supabaseService = new SupabaseService();
export default supabaseService;